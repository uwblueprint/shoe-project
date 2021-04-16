import AppBar from "@material-ui/core/AppBar";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
import SearchBar from "material-ui-search-bar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { useEffect, useReducer, useState } from "react";
import * as React from "react";
import styled from "styled-components";
import useSWR, { mutate } from "swr";

import { StoryDrawer } from "../../../components";
import { a11yProps, AllStoriesTabs } from "../../../components/AllStoriesTabs";
import VirtualizedTable from "../../../components/VirtualizedTable";
import { colors } from "../../../styles/colors";
import {
  StyledAllStoriesHeader,
  StyledEmptyMessage,
} from "../../../styles/typography";
import { Story } from "../../../types/index";
import { allStoriesReducer, INIT_STATE } from "./reducer";
import { StoryView } from "./types";
import { VisibilitySwitch } from "./VisibilitySwitch";

const StyledSearchBar = styled(SearchBar)`
  max-width: 320px;
  background-color: ${colors.primaryLight4};
  border-radius: 5px;
  height: 40px;
  margin-left: 70vw;
  margin-top: 1vh;
  color: ${colors.primaryDark1};
  border: none;
  box-shadow: none;
  .ForwardRef-iconButton-10 {
    color: ${colors.primaryDark1};
  }
  .MuiInputBase-input {
    font-family: "Poppins";
  }
`;

const StyledContainer = styled.div`
  background-color: ${colors.primaryLight6};
`;

const StyledAddIcon = styled(AddIcon)`
  &.MuiSvgIcon-colorPrimary {
    color: ${colors.tertiary};
    border: 2px solid ${colors.tertiary};
    border-radius: 5px;
    width: 24px;
  }
  &.MuiSvgIcon-root {
    width: 24px;
    height: 24px;
  }
`;

const StyledRemoveIcon = styled(RemoveIcon)`
  &.MuiSvgIcon-colorPrimary {
    color: ${colors.secondary};
    border: 2px solid ${colors.secondary};
    border-radius: 5px;
    width: 24px;
  }
  &.MuiSvgIcon-root {
    width: 24px;
    height: 24px;
  }
`;

const StyledIconButton = styled(IconButton)`
  &.MuiIconButton-root {
    padding: 0px;
  }
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

function createData({
  ID,
  title,
  current_city,
  year,
  author_first_name,
  author_last_name,
  author_country,
  is_visible,
  image_url,
  video_url,
  content,
}: Story): StoryView {
  const author_name = `${author_first_name} ${author_last_name}`;
  return {
    ID,
    title,
    current_city,
    year,
    author_name,
    author_first_name,
    author_last_name,
    author_country,
    is_visible,
    image_url,
    video_url,
    content,
  };
}
const checkboxOptions = ["All", "Hidden Stories", "Visible Stories"];
export const AllStories: React.FC = () => {
  const [state, dispatch] = useReducer(allStoriesReducer, INIT_STATE);
  const [clickedStory, setClickedStory] = useState<StoryView | undefined>(
    undefined
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const drawerOpen = Boolean(anchorEl);
  const [optionState, setOptionState] = useState("All");
  const classes = useStyles();
  const allStoriesLabel = `${"ALL STORIES"} ${"("} ${
    state.tableData.length
  } ${")"}`;
  const visibleStoriesLabel = `${"VISIBLE STORIES"} ${"("} ${
    state.visibleTableState.filter((story) => story.is_visible).length
  } ${")"}`;
  const pendingChangesLabel = `${"PENDING MAP CHANGES"} ${"("} ${
    state.changedVisibility.length
  } ${")"}`;

  const fetchStories = (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((response) => response.payload.map(createData));

  const { data: allStories, error } = useSWR<StoryView[] | undefined>(
    "/api/stories",
    fetchStories
  );

  useEffect(() => {
    if (allStories) {
      dispatch({ type: "INITIALIZE_AFTER_API", rows: allStories });
    }
  }, [allStories]);

  const setClickedRow = (rowId: number | undefined) => {
    if (rowId) {
      const story = allStories?.find((story: StoryView) => story.ID === rowId);
      if (story) {
        setClickedStory(story);
      }
    }
  };

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
  };

  const handleCheckedAll = () => {
    dispatch({ type: "HANDLE_CHECKED_ALL", rows: allStories });
  };
  const handleChecked = (e, story) => {
    dispatch({ type: "HANDLE_CHECKED", e, story });
  };

  const onChangeTableSort = (order, property) => {
    const data = stableSort(state.tableData, getComparator(order, property));
    dispatch({ type: "SET_TABLE_DATA", data });
  };

  const handleRequestSort = (property: string) => {
    const isDesc = state.orderBy === property && state.order === "asc";
    const order = isDesc ? "desc" : "asc";
    dispatch({ type: "SET_ORDERING", order, orderBy: property });

    onChangeTableSort(order, property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array ? array.map((el, index) => [el, index]) : [];
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    const sortedArray = stabilizedThis.map((el) => el[0]);
    if (sortedArray.length === 0) {
      return allStories ? allStories : [];
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
    state.selectedRowIds.length > 0 &&
    state.selectedRowIds.length !== allStories.length;

  const handleTabChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    cancelSearch();
    dispatch({ type: "SET_TAB_VALUE", newValue });
  };

  const requestSearchHelper = (row, searchedVal: string) => {
    let doesExist = false;
    Object.keys(row).forEach((prop) => {
      //Exclude search for StoryView members not displayed on table cells
      const excludedParameters = prop !== "ID";
      prop !== "image_url" &&
        prop !== "video_url" &&
        prop !== "content" &&
        prop !== "is_visible";
      const numExist =
        typeof row[prop] === "number" &&
        row[prop].toString().includes(searchedVal) &&
        excludedParameters;
      const stringExist =
        typeof row[prop] === "string" &&
        row[prop].toLowerCase().includes(searchedVal.toLowerCase()) &&
        excludedParameters;
      if (stringExist || numExist) {
        doesExist = true;
      }
    });
    return doesExist;
  };

  const requestSearch = (searchedVal: string) => {
    if (state.tabValue === 0) {
      const filteredRows: StoryView[] = state.origTableData.filter((row) => {
        return requestSearchHelper(row, searchedVal);
      });
      dispatch({ type: "SET_TABLE_DATA", data: filteredRows });
    } else if (state.tabValue === 1) {
      const filteredRows: StoryView[] = state.visibleTableFilterState.filter(
        (row) => {
          return requestSearchHelper(row, searchedVal);
        }
      );
      dispatch({ type: "SET_VISIBLE_TABLE_STATE", data: filteredRows });
    } else if (state.tabValue === 2) {
      const filteredRows: StoryView[] = state.changedVisibilityFilter.filter(
        (row) => {
          return requestSearchHelper(row, searchedVal);
        }
      );
      dispatch({ type: "SET_CHANGED_VISIBILITY", data: filteredRows });
    }
  };
  const cancelSearch = () => {
    dispatch({ type: "HANDLE_SEARCH", data: "" });
    requestSearch("");
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCheckboxMenuItemPressed = (option: string) => {
    setOptionState(option);
  };
  if (error) return <div>Error returning stories data!</div>;
  if (!allStories) return <div>Loading all stories table..</div>;
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
          <Tab label={allStoriesLabel} {...a11yProps(0)} />
          <Tab label={visibleStoriesLabel} {...a11yProps(1)} />
          <Tab label={pendingChangesLabel} {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <StyledSearchBar
        placeholder="Type to search..."
        value={state.search}
        onChange={(searchVal) => {
          dispatch({ type: "HANDLE_SEARCH", data: searchVal });
          requestSearch(searchVal);
        }}
        onCancelSearch={() => cancelSearch()}
      />
      <AllStoriesTabs value={state.tabValue} index={0}>
        <VirtualizedTable
          data={stableSort(
            state.tableData,
            getComparator(state.order, state.orderBy)
          )}
          order={state.order}
          orderBy={state.orderBy}
          setClickedRow={setClickedRow}
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
                    onChange={(e) => {
                      e.persist();
                      handleCheckedAll();
                    }}
                  />
                  <StyledIconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                  >
                    <ExpandMoreIcon />
                  </StyledIconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={drawerOpen}
                    onClose={handleClose}
                  >
                    {checkboxOptions.map((option) => (
                      <MenuItem
                        key={option}
                        selected={option === optionState}
                        onClick={() => {
                          handleCheckboxMenuItemPressed(option);
                          handleClose();
                        }}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              ),
              cell: (story) => (
                <div>
                  <Checkbox
                    classes={{
                      root: classes.checkbox,
                      checked: classes.checked,
                    }}
                    onChange={(e) => {
                      e.persist();
                      handleChecked(e, story);
                    }}
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
              header: "Visibility",
              width: 150,
              onHeaderClick() {
                handleRequestSort("is_visible");
              },
              cell: (story) => (
                <VisibilitySwitch
                  checked={story.is_visible}
                  onChange={(e) => {
                    e.persist();
                    handleSwitchChange(e, story);
                  }}
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
          setClickedRow={setClickedRow}
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
                    onChange={(e) => {
                      e.persist();
                      handleCheckedAll;
                    }}
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
                    onChange={(e) => {
                      e.persist();
                      handleChecked(e, story);
                    }}
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
              header: "Visibility",
              width: 150,
              onHeaderClick() {
                handleRequestSort("is_visible");
              },
              cell: (story) => (
                <VisibilitySwitch
                  checked={story.is_visible}
                  onChange={(e) => {
                    e.persist();
                    handleSwitchChange(e, story);
                  }}
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
            data={stableSort(
              state.changedVisibility,
              getComparator(state.order, state.orderBy)
            )}
            order={state.order}
            orderBy={state.orderBy}
            setClickedRow={setClickedRow}
            columns={[
              {
                name: "pending-map-changes-changes",
                width: 50,
                header: "",
                cell: (d) => {
                  return (
                    <div>
                      {state.visibleState.includes(d.ID) ? (
                        <StyledAddIcon color="primary" />
                      ) : (
                        <StyledRemoveIcon color="primary" />
                      )}
                    </div>
                  );
                },
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
                header: "Visibility",
                width: 150,
                onHeaderClick() {
                  handleRequestSort("is_visible");
                },
                cell: (story) => (
                  <VisibilitySwitch
                    checked={state.visibleState.includes(story.ID)}
                    onChange={(e) => {
                      e.persist();
                      handleSwitchChange(e, story);
                    }}
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
      <StoryDrawer
        story={clickedStory}
        onClose={() => setClickedStory(undefined)}
        onClickEditStory={() => {
          console.log("TODO: Route to edit page");
        }}
      />
    </>
  );
};
