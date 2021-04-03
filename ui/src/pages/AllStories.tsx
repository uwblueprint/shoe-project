import AppBar from "@material-ui/core/AppBar";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useEffect, useState, useReducer } from "react";
import * as React from "react";
import styled from "styled-components";
import useSWR, { mutate } from "swr";

import { a11yProps, AllStoriesTabs } from "../components/AllStoriesTabs";
import VirtualizedTable from "../components/VirtualizedTable";
import { colors } from "../styles/colors";
import { fontSize, StyledAllStoriesHeader } from "../styles/typography";
import { Story } from "../types/index";

const StyledSwitch = styled(Switch)`
  && {
    .MuiSwitch-colorPrimary {
      color: ${colors.white};
    }
    .MuiSwitch-track {
      background-color: ${colors.primaryDark1};
    }
  }
`;

const StyledEmptyMessage = styled.div`
  margin-left: 50vw;
  margin-top: 30vh;
  font-family: Poppins;
  font-size: ${fontSize.subtitle};
`;
const StyledContainer = styled.div`
  background-color: ${colors.primaryLight6};
`;

const useStyles = makeStyles({
  root: {
    background: colors.primaryLight6,
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "150%",
    color: colors.primaryDark1,
    paddingLeft: "64px",
    boxShadow: "none",
  },
  indicator: {
    backgroundColor: colors.primaryDark1,
  },
  checkbox: {
    "&$checked": {
      color: colors.primaryDark1,
    },
  },
  checked: {},
});

function createData(
  id: number,
  title: string,
  current_city: string,
  year: number,
  is_visible: boolean,
  author_first_name: string,
  author_last_name: string,
  author_country: string
) {
  const author_name = `${author_first_name} ${author_last_name}`;
  return {
    ID: id,
    title,
    current_city,
    year,
    author_name,
    author_country,
    is_visible,
  };
}

type State = {
  tabValue: number;
  visibleState: any[];
  visibleTableState: any[]; 
  tableData: any[];
  changedVisibility: any[];
  selectedRowIds: any[];
  order: string;
  orderBy: string;
}

type ActionType = 
  | { type: "SWITCH_TAB", id: number; }
  | { type: "HANDLE_SWITCH_CHANGE", e: any, story: Story }
  | { type: "INITIALIZE_AFTER_API", rows: any[] }
  | { type: "HANDLE_CHECKED_ALL", rows }
  | { type: "HANDLE_CHECKED", e: any, story: Story }
  | { type: "SET_ORDERING", order: string, orderBy: string }
  | { type: "SET_TABLE_DATA", data: any[] }
  | { type: "SET_TAB_VALUE", newValue: number }

const initialState: State = {
  tabValue: 0,
  visibleState: [],
  visibleTableState: [],
  tableData: [],
  changedVisibility: [],
  selectedRowIds: [],
  order: "desc",
  orderBy: "id"
}

function reducer(state: State, action: ActionType) {
  switch (action.type) {
    case "SWITCH_TAB":
      return {
        ...state,
        tabValue: action.id
      };
    case "HANDLE_SWITCH_CHANGE":

      const changedVisibilityFoundID = (elem) => elem.ID === action.story.ID;
      const changedVisibilityContainsID = state.changedVisibility.some(changedVisibilityFoundID);

      if (action.e.target.checked) {
        return {
          ...state,
          visibleState: [...state.visibleState, action.story.ID],
          visibleTableState: [...state.visibleTableState, action.story.ID],
          changedVisibility: changedVisibilityContainsID ? 
            state.changedVisibility.filter(e => e.ID !== action.story.ID) :
            [...state.changedVisibility, action.story]
        };
      } else {
        return {
          ...state,
          visibleState: state.visibleState.filter(e => e !== action.story.ID),
          visibleTableState: state.visibleTableState.filter(e => e.id !== action.story.ID),
          changedVisibility: changedVisibilityContainsID ? 
            state.changedVisibility.filter(e => e.ID !== action.story.ID) :
            [...state.changedVisibility, action.story]
        };
      }

    case "INITIALIZE_AFTER_API":
      return {
        ...state,
        visibleState: action.rows,
        visibleTableState: action.rows,
        tableData: action.rows
      };
    case "HANDLE_CHECKED_ALL":
      return {
        ...state,
        selectedRowIds: state.selectedRowIds.length === action.rows.length ?
          []:
          action.rows.map( story => story.id)
      };
    case "HANDLE_CHECKED":
      if (action.e.target.checked) {
        return {
          ...state,
          selectedRowIds: [...state.selectedRowIds, action.story.ID]
        };
      } else {
        return {
          ...state,
          selectedRowIds: state.selectedRowIds.filter(e => e !== action.story.ID)
        };
      }
    case "SET_ORDERING":
      return {
        ...state,
        order: action.order,
        orderBy: action.orderBy
      };
    case "SET_TABLE_DATA":
      return {
        ...state,
        tableData: action.data
      };
    case "SET_TAB_VALUE":
      return {
        ...state,
        tabValue: action.newValue
      }
  }
}

export const AllStories: React.FC = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const { data: allStories, error } = useSWR<Story[]>("/api/stories");
  const classes = useStyles();

  let rows = [];
  useEffect(() => {
    if (allStories) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      rows = allStories.map((story) =>
        createData(
          story.ID,
          story.title,
          story.current_city,
          story.year,
          story.is_visible,
          story.author_first_name,
          story.author_last_name,
          story.author_country
        )
      );
      //Initialize state after allstories are mapped
      dispatch({type: "INITIALIZE_AFTER_API", rows })
    }
  }, [allStories]);

  const handleSwitchChange = (e, story) => {
    dispatch({ type: "HANDLE_SWITCH_CHANGE", e, story });
    mutate(
      "/api/stories",
      (prevStories: Story[]) => {
        return prevStories.map((currStory) =>
          currStory.ID === story.ID
            ? { ...currStory, is_visible: !currStory.is_visible }
            : currStory
        );
      },
      false
    );

    
    //todo: figure out if this stuff needs to come after mutate() or nah LOL 
    // const changedVisibilityContainsID = (elem) => elem.ID === story.ID;

    // if (changedVisibility.some(changedVisibilityContainsID)) {
    //   setChangedVisibility((prevState) =>
    //     prevState.filter((i) => i.ID !== story.ID)
    //   );
    // } else {
    //   setChangedVisibility((prevState) => [...prevState, story]);
    // }
  };

  const handleCheckedAll = () => {
    // setSelectedRowIds((prevState) =>
    //   prevState.length === rows.length ? [] : rows.map((story) => story.id)
    // );
    dispatch({type: "HANDLE_CHECKED_ALL", rows });
  };
  const handleChecked = (e, story) => {
    dispatch({type: "HANDLE_CHECKED", e, story });

    // if (e.target.checked) {
    //   setSelectedRowIds((prevState) => [...prevState, story.ID]);
    // } else {
    //   setSelectedRowIds((prevState) => prevState.filter((e) => e !== story.ID));
    // }
  };

  const handleRequestSort = (property: string) => {
    const isDesc = state.orderBy === property && state.order === "asc";
    const order = isDesc ? "desc" : "asc";

    // setOrder(order);
    // setOrderBy(property);
    dispatch({ type: "SET_ORDERING", order, orderBy: property });

    onChangeTableSort(order, property);
  };
  const onChangeTableSort = (order, property) => {
    const data = stableSort(state.tableData, getComparator(order, property));
    // setTableData(newData);
    dispatch({ type: "SET_TABLE_DATA", data })
  };
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    const sortedArray = stabilizedThis.map((el) => el[0]);
    if (sortedArray.length === 0) {
      return rows;
    }
    return sortedArray;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    } else if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const indeterminate =
  state.selectedRowIds.length > 0 && state.selectedRowIds.length !== rows.length;
  if (error) return <div>Error returning stories data!</div>;
  if (!allStories) return <div>Loading all stories table..</div>;

  const handleTabChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    // setTabValue(newValue);
    dispatch({ type: "SET_TAB_VALUE", newValue });
  };
  return (
    <>
      <StyledContainer>
        <StyledAllStoriesHeader>
          The Shoe Project Impact Map Portal
        </StyledAllStoriesHeader>
      </StyledContainer>
      <AppBar className={classes.root} position="relative">
        <Tabs
          classes={{
            indicator: classes.indicator,
          }}
          value={state.tabValue}
          onChange={handleTabChange}
          aria-label="all stories tabs"
        >
          <Tab label="ALL STORIES" {...a11yProps(0)} />
          <Tab label="VISIBLE STORIES" {...a11yProps(1)} />
          <Tab label="PENDING MAP CHANGES" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <AllStoriesTabs value={state.tabValue} index={0}>
        <VirtualizedTable
          data={stableSort(state.tableData, getComparator(state.order, state.orderBy))}
          order={state.order}
          orderBy={state.orderBy}
          columns={[
            {
              name: "ID",
              width: 100,
              onHeaderClick() {
                handleRequestSort("ID");
              },
              header: (
                <div>
                  <Checkbox
                    classes={{
                      root: classes.checkbox,
                      checked: classes.checked,
                    }}
                    checked={state.selectedRowIds.length > 0}
                    indeterminate={indeterminate}
                    onChange={handleCheckedAll}
                  />
                  ID
                </div>
              ),
              cell: (story) => (
                <div>
                  <Checkbox
                    classes={{
                      root: classes.checkbox,
                      checked: classes.checked,
                    }}
                    onChange={(e) => handleChecked(e, story)}
                    checked={state.selectedRowIds.includes(story.ID)}
                  />
                  {story.ID}
                </div>
              ),
            },
            {
              name: "title",
              header: "Story Name",
              width: 500,
              onHeaderClick() {
                handleRequestSort("title");
              },
            },
            {
              name: "current_city",
              header: "Current City",
              width: 200,
              onHeaderClick() {
                handleRequestSort("current_city");
              },
            },
            {
              name: "year",
              header: "Year",
              width: 100,
              onHeaderClick() {
                handleRequestSort("year");
              },
            },
            {
              name: "author_name",
              header: "Author name",
              width: 250,
              onHeaderClick() {
                handleRequestSort("author_name");
              },
            },
            {
              name: "author_country",
              header: "Country",
              width: 300,
              onHeaderClick() {
                handleRequestSort("author_country");
              },
            },
            {
              name: "is_visible",
              header: "Show on Map",
              width: 150,
              onHeaderClick() {
                handleRequestSort("jobType");
              },
              cell: (story) => (
                <StyledSwitch
                  checked={story.is_visible}
                  onChange={(e) => handleSwitchChange(e, story)}
                  name="checked"
                  color="primary"
                />
              ),
            },
          ]}
        />
      </AllStoriesTabs>
      <AllStoriesTabs value={state.tabValue} index={1}>
        <VirtualizedTable
          data={state.visibleTableState.filter((story) => story.is_visible)}
          order={state.order}
          orderBy={state.orderBy}
          columns={[
            {
              name: "ID",
              width: 100,
              onHeaderClick() {
                handleRequestSort("ID");
              },
              header: (
                <div>
                  <Checkbox
                    classes={{
                      root: classes.checkbox,
                      checked: classes.checked,
                    }}
                    checked={state.selectedRowIds.length > 0}
                    indeterminate={indeterminate}
                    onChange={handleCheckedAll}
                  />
                  ID
                </div>
              ),
              cell: (story) => (
                <div>
                  <Checkbox
                    classes={{
                      root: classes.checkbox,
                      checked: classes.checked,
                    }}
                    onChange={(e) => handleChecked(e, story)}
                    checked={state.selectedRowIds.includes(story.ID)}
                  />
                  {story.ID}
                </div>
              ),
            },
            {
              name: "title",
              header: "Story Name",
              width: 500,
              onHeaderClick() {
                handleRequestSort("title");
              },
            },
            {
              name: "current_city",
              header: "Current City",
              width: 200,
              onHeaderClick() {
                handleRequestSort("current_city");
              },
            },
            {
              name: "year",
              header: "Year",
              width: 100,
              onHeaderClick() {
                handleRequestSort("year");
              },
            },
            {
              name: "author_name",
              header: "Author name",
              width: 250,
              onHeaderClick() {
                handleRequestSort("author_name");
              },
            },
            {
              name: "author_country",
              header: "Country",
              width: 300,
              onHeaderClick() {
                handleRequestSort("author_country");
              },
            },
            {
              name: "is_visible",
              header: "Show on Map",
              width: 150,
              onHeaderClick() {
                handleRequestSort("jobType");
              },
              cell: (story) => (
                <StyledSwitch
                  checked={story.is_visible}
                  onChange={(e) => handleSwitchChange(e, story)}
                  name="checked"
                  color="primary"
                />
              ),
            },
          ]}
        />
      </AllStoriesTabs>
      <AllStoriesTabs value={state.tabValue} index={2}>
        {/* Pending Changes */}
        {state.changedVisibility.length > 0 ? (
          <VirtualizedTable
            data={stableSort(state.changedVisibility, getComparator(state.order, state.orderBy))}
            order={state.order}
            orderBy={state.orderBy}
            columns={[
              {
                name: "pending-map-changes-changes",
                width: 100,
                header: <div>Changes</div>,
                cell: (d) => (
                  <div>
                    {state.visibleState.includes(d.id) ? <AddIcon /> : <RemoveIcon />}
                  </div>
                ),
              },

              {
                name: "title",
                header: "Story Name",
                width: 200,
                onHeaderClick() {
                  handleRequestSort("title");
                },
              },
              {
                name: "current_city",
                header: "Current City",
                width: 200,
                onHeaderClick() {
                  handleRequestSort("current_city");
                },
              },
              {
                name: "year",
                header: "Year",
                width: 100,
                onHeaderClick() {
                  handleRequestSort("year");
                },
              },
              {
                name: "author_name",
                header: "Author name",
                width: 250,
                onHeaderClick() {
                  handleRequestSort("author_name");
                },
              },
              {
                name: "author_country",
                header: "Country",
                width: 300,
                onHeaderClick() {
                  handleRequestSort("author_country");
                },
              },
              {
                name: "is_visible",
                header: "Show on Map",
                width: 150,
                onHeaderClick() {
                  handleRequestSort("jobType");
                },
                cell: (story) => (
                  <StyledSwitch
                    checked={state.visibleState.includes(story.id)}
                    onChange={(e) => handleSwitchChange(e, story)}
                    name="checked"
                    color="primary"
                  />
                ),
              },
            ]}
          />
        ) : (
          <StyledEmptyMessage> No pending changes! </StyledEmptyMessage>
        )}
      </AllStoriesTabs>
    </>
  );
};
