import AppBar from "@material-ui/core/AppBar";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useEffect, useReducer, useState } from "react";
import * as React from "react";
import styled from "styled-components";
import useSWR, { mutate } from "swr";

import { StoryDrawer } from "../../components";
import { a11yProps, AllStoriesTabs } from "../../components/AllStoriesTabs";
import VirtualizedTable from "../../components/VirtualizedTable";
import { colors } from "../../styles/colors";
import {
  StyledAllStoriesHeader,
  StyledEmptyMessage,
} from "../../styles/typography";
import { Story } from "../../types/index";
import { allStoriesReducer, INIT_STATE } from "../AllStories/reducer";
import { VisibilitySwitch } from "./VisibilitySwitch";

import AllStoriesAppBar from "../../components/AllStoriesAppBar";

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

export type StoryView = Omit<
  Story,
  | "summary"
  | "latitude"
  | "longitude"
  | "author"
  | "tags"
  | "CreatedAt"
  | "DeletedAt"
  | "UpdatedAt"
> & { author_name: string };

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

export const AllStories: React.FC = () => {
  const [state, dispatch] = useReducer(allStoriesReducer, INIT_STATE);
  const [clickedStory, setClickedStory] = useState<StoryView | undefined>(
    undefined
  );
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
    dispatch({ type: "HANDLE_SWITCH_CHANGE", e, story: { ...story, is_visible: !story.is_visible }});
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
    dispatch({ type: "SET_TAB_VALUE", newValue });
  };

  const publishMap = () => {

    console.log("WE ARE HERE RN");

    if (state.changedVisibility.length > 0) {

      console.log("WE ARE ALSO HERE");
      console.log(state.tableData);
      console.log(state.changedVisibility);

      fetch("/api/stories/publish", {
        method: "PUT",
        body: JSON.stringify(state.changedVisibility),
        redirect: "follow",
      })
        .then((response) => response.text())
        .then((result) => {
          dispatch({type: "CLEAR_PENDING_CHANGES"});
          // storySubmitDialog(result);
        })
        .catch((error) => console.log("Error: ", error));

    };
  };

  if (error) return <div>Error returning stories data!</div>;
  if (!allStories) return <div>Loading all stories table..</div>;
  return (
    <>
      <StyledContainer>
        <AllStoriesAppBar handlePublishMap={publishMap} publishMapDisabled={state.changedVisibility.length == 0}/>
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
        <StoryDrawer
          story={clickedStory}
          onClose={() => setClickedStory(undefined)}
          onClickEditStory={() => {
            console.log("TODO: Route to edit page");
          }}
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
    </>
  );
};
