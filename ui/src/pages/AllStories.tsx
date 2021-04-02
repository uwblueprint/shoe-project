import AppBar from "@material-ui/core/AppBar";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useEffect, useState } from "react";
import * as React from "react";
import styled from "styled-components";
import useSWR, { mutate } from "swr";

import { a11yProps, AllStoriesTabs } from "../components/AllStoriesTabs";
import VirtualizedTable from "../components/VirtualizedTable";
import { colors } from "../styles/colors";
import { fontSize, StyledAllStoriesHeader } from "../styles/typography";
import { Story } from "../types/index";
import SearchBar from "material-ui-search-bar";

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

export const AllStories: React.FC = () => {
  const { data: allStories, error } = useSWR<Story[]>("/api/stories");
  const [origTableData, setOrigTableData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [visibleState, setVisibleState] = useState([]);
  const [visibleTableState, setVisibleTableState] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [changedVisibility, setChangedVisibility] = useState([]);
  const classes = useStyles();
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [searched, setSearched] = useState<string>("");

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
      setVisibleState(rows);
      setVisibleTableState(rows);
      setTableData(rows);
      setOrigTableData(rows);
    }
  }, [allStories]);

  const handleSwitchChange = (e, story) => {
    if (e.target.checked) {
      setVisibleState((prevStories) => [...prevStories, story.id]);
      setVisibleTableState([...visibleTableState, story]);
    } else {
      setVisibleState((prevStories) =>
        prevStories.filter((e) => e !== story.id)
      );
      setVisibleTableState((visibleTableState) =>
        visibleTableState.filter((e) => e.id !== story.id)
      );
    }
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

    const changedVisibilityContainsID = (elem) => elem.ID === story.ID;

    if (changedVisibility.some(changedVisibilityContainsID)) {
      setChangedVisibility((prevState) =>
        prevState.filter((i) => i.ID !== story.ID)
      );
    } else {
      setChangedVisibility((prevState) => [...prevState, story]);
    }
  };

  const handleCheckedAll = () => {
    setSelectedRowIds((prevState) =>
      prevState.length === rows.length ? [] : rows.map((story) => story.id)
    );
  };
  const handleChecked = (e, story) => {
    if (e.target.checked) {
      setSelectedRowIds((prevState) => [...prevState, story.ID]);
    } else {
      setSelectedRowIds((prevState) => prevState.filter((e) => e !== story.ID));
    }
  };

  const handleRequestSort = (property) => {
    const isDesc = orderBy === property && order === "asc";
    const newOrder = isDesc ? "desc" : "asc";
    setOrder(newOrder);
    setOrderBy(property);

    onChangeTableSort(newOrder, property);
  };
  const onChangeTableSort = (order, property) => {
    const newData = stableSort(tableData, getComparator(order, property));
    setTableData(newData);
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
    selectedRowIds.length > 0 && selectedRowIds.length !== rows.length;
  if (error) return <div>Error returning stories data!</div>;
  if (!allStories) return <div>Loading all stories table..</div>;

  const handleTabChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    setTabValue(newValue);
  };


  const requestSearch = (searchedVal: string) => {
    const filteredRows = origTableData.filter((row) => {
      let exist = false
      Object.keys(row).forEach(prop => {
        console.log(prop)
        if (typeof row[prop] === 'string' && row[prop].toLowerCase().includes(searchedVal.toLowerCase())) {
          exist = true
        }
      })
      return exist
    });
    console.log(filteredRows)
    setTableData(filteredRows);
  };
  const cancelSearch = () => {
    setSearched("");
    requestSearch(searched);
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
          value={tabValue}
          onChange={handleTabChange}
          aria-label="all stories tabs"
        >
          <Tab label="ALL STORIES" {...a11yProps(0)} />
          <Tab label="VISIBLE STORIES" {...a11yProps(1)} />
          <Tab label="PENDING MAP CHANGES" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SearchBar
    value={searched}
    onChange={(searchVal) => requestSearch(searchVal)}
    onCancelSearch={() => cancelSearch()}
  />
      <AllStoriesTabs value={tabValue} index={0}>
        
        <VirtualizedTable
          data={stableSort(tableData, getComparator(order, orderBy))}
          order={order}
          orderBy={orderBy}
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
                    checked={selectedRowIds.length > 0}
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
                    checked={selectedRowIds.includes(story.ID)}
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
      <AllStoriesTabs value={tabValue} index={1}>
        <VirtualizedTable
          data={visibleTableState.filter((story) => story.is_visible)}
          order={order}
          orderBy={orderBy}
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
                    checked={selectedRowIds.length > 0}
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
                    checked={selectedRowIds.includes(story.ID)}
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
      <AllStoriesTabs value={tabValue} index={2}>
        {/* Pending Changes */}
        {changedVisibility.length > 0 ? (
          <VirtualizedTable
            data={stableSort(changedVisibility, getComparator(order, orderBy))}
            order={order}
            orderBy={orderBy}
            columns={[
              {
                name: "pending-map-changes-changes",
                width: 100,
                header: <div>Changes</div>,
                cell: (d) => (
                  <div>
                    {visibleState.includes(d.id) ? <AddIcon /> : <RemoveIcon />}
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
                    checked={visibleState.includes(story.id)}
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
