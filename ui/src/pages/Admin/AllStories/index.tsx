import { Grid } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Popover from "@material-ui/core/Popover";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import RemoveIcon from "@material-ui/icons/Remove";
import SearchBar from "material-ui-search-bar";
import { useEffect, useReducer, useState } from "react";
import * as React from "react";
import { Link, Prompt } from "react-router-dom";
import styled from "styled-components";
import useSWR, { mutate } from "swr";

import { StoryDrawer } from "../../../components";
import AllStoriesAppBar from "../../../components/AllStoriesAppBar";
import { a11yProps, AllStoriesTabs } from "../../../components/AllStoriesTabs";
import ToastyBoi from "../../../components/ToastyBoi";
import VirtualizedTable from "../../../components/VirtualizedTable";
import { useAuth } from "../../../hooks/auth";
import { colors } from "../../../styles/colors";
import {
  fontSize,
  StyledAllStoriesHeader,
  StyledEmptyMessage,
  StyledSubEmptyMessage,
} from "../../../styles/typography";
import { Story } from "../../../types/index";
import { allStoriesReducer, INIT_STATE } from "./reducer";
import { StoryView } from "./types";
import { VisibilitySwitch } from "./VisibilitySwitch";

const StyledFilter = styled.div`
  width: 30vw;
  margin-top: 7vh;
  justify-self: right;
  margin-left: 65vw;
`;

const StyledButton = styled(Button)`
  && {
    width: 100%;
    height: 100%;
    box-shadow: none;
    color: ${colors.primaryDark1};
    background-color: ${colors.white};
    background: ${colors.white};
    padding: 5px;
    &:active {
      background-color: ${colors.primaryLight6};
    }
    &:hover {
      background-color: ${colors.white};
      box-shadow: none;
    }
  }
`;

const ShowHideButton = styled(Button)`
  && {
    box-shadow: none;
    background-color: ${colors.primaryDark1};
    margin-left: 64px;
    padding: 8px 20px 8px 20px;

    && .MuiButton-label {
      font-family: "Poppins";
      color: ${colors.white};
    }

    &:active {
      background-color: ${colors.primaryDark2};
    }
    &:hover {
      background-color: ${colors.primaryDark3};
    }
  }
`;

const StyledSearchBar = styled(SearchBar)`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  color: ${colors.primaryDark1};
  border: none;
  .ForwardRef-iconButton-10 {
    color: ${colors.primaryDark1};
  }
  .MuiInputBase-input {
    font-family: "Poppins";
  }
  &.MuiPaper-elevation1 {
    box-shadow: none;
  }
  &.MuiPaper-root {
    background-color: ${colors.primaryLight4};
  }
`;

export const StyledChip = styled(Chip)`
  &&.MuiChip-root {
    color: ${colors.primaryDark2};
    font-family: Poppins;
    font-size: ${fontSize.body1};
    line-height: 150%;
    margin-right: 4px;
    text-transform: capitalize;
  }
  &&.MuiChip-colorPrimary {
    background: ${colors.primaryLight3};
  }
`;
const UploadButton = styled(Button)`
  && {
    box-shadow: none;
    background-color: ${colors.primaryDark1};
    margin-bottom: -5vh;
    margin-right: 64px;
    float: right;
    &:active {
      background-color: ${colors.primaryDark2};
    }
    &:hover {
      background-color: ${colors.primaryDark3};
    }
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
    width: "50vw",
  },
  indicator: {
    backgroundColor: colors.primaryDark1,
  },
  checkbox: {
    "&$checked": {
      color: colors.primaryDark1,
    },
  },
  promptText: {
    "&&& .MuiTypography-body1": {
      fontFamily: "Poppins",
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
  tags,
}: Story): StoryView {
  const author_name = `${author_first_name} ${author_last_name}`;
  let current_city_name = "";
  if (current_city.indexOf(",") < 0) {
    current_city_name = current_city;
  } else {
    current_city_name =
      current_city.slice(0, current_city.indexOf(",") + 1) +
      current_city.substring(current_city.indexOf(",") + 1).toUpperCase();
  }

  return {
    ID,
    title,
    current_city,
    current_city_name,
    year,
    author_name,
    author_first_name,
    author_last_name,
    author_country,
    is_visible,
    image_url,
    video_url,
    content,
    tags,
  };
}

const POPOVER_ID = "simple-popover";

export const AllStories: React.FC = () => {
  const { data: tagOptions, error: tagError } = useSWR<string[]>("/api/tags");
  const { signOut } = useAuth();

  const [state, dispatch] = useReducer(allStoriesReducer, INIT_STATE);
  const isFilterOpen = Boolean(state.anchorEl);
  const isPopoverOpen = Boolean(state.popoverAnchorEl);

  const [clickedStory, setClickedStory] = useState<StoryView | undefined>(
    undefined
  );
  const classes = useStyles();
  const allStoriesLabel = `${"ALL STORIES ("}${state.tableData.length}${")"}`;
  const visibleStoriesLabel = `${"VISIBLE STORIES ("}${
    state.visibleTableState.filter((story) => story.is_visible).length
  }${")"}`;
  const pendingChangesLabel = `${"PENDING MAP CHANGES ("}${
    state.changedVisibility.length
  }${")"}`;
  const doesVisibleStoriesExist =
    state.visibleTableState.filter((story) => story.is_visible).length !== 0;

  const hideButtonText = `${"Hide All From Map ("}${
    state.checkedVisibleStoriesArray.length
  }${")"}`;

  const showButtonText = `${"Show All on Map ("}${
    state.checkedHiddenStoriesArray.length
  }${")"}`;

  const isButtonOpen = () => {
    return (
      state.checkedVisibleStoriesArray.length > 0 ||
      state.checkedHiddenStoriesArray.length > 0
    );
  };
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    popoverType: string
  ) => {
    dispatch({
      type: "SET_ANCHOR",
      click: event.currentTarget,
      popoverType: popoverType,
    });
  };

  const handleClose = (popoverType: string) => {
    dispatch({
      type: "SET_ANCHOR",
      click: null,
      popoverType: popoverType,
    });
  };

  const handleStoryVisibilityPopover = (visibility: string) => {
    if (visibility === "all") {
      dispatch({
        type: "HANDLE_POPOVER_CHECKED",
        visibilityCondition: "all",
      });
    } else if (visibility === "visible") {
      dispatch({
        type: "HANDLE_POPOVER_CHECKED",
        visibilityCondition: "visible",
      });
    } else {
      dispatch({
        type: "HANDLE_POPOVER_CHECKED",
        visibilityCondition: "hidden",
      });
    }
  };

  const filterAppliedCount = () => {
    let count = 0;
    Object.keys(state.filterState.tags).forEach((tag) => {
      if (state.filterState.tags[tag]) {
        count += 1;
      }
    });
    Object.keys(state.filterState.visibility).forEach((vs) => {
      if (state.filterState.visibility[vs]) {
        count += 1;
      }
    });
    return count;
  };

  const filterLabel =
    filterAppliedCount() == 0
      ? `Filter`
      : `${filterAppliedCount()} Filter Applied`;

  const handleTagFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: "HANDLE_SEARCH/FILTER",
      newFilterState: {
        ...state.filterState,
        tags: {
          ...state.filterState.tags,
          [event.target.name]: event.target.checked,
        },
      },
      newSearch: state.search,
    });
  };

  const handleFilterVisibilityChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: "HANDLE_SEARCH/FILTER",
      newFilterState: {
        ...state.filterState,
        visibility: {
          ...state.filterState.visibility,
          [event.target.name]: event.target.checked,
        },
      },
      newSearch: state.search,
    });
  };

  const fetchStories = (url) =>
    fetch(url)
      .then((res) => res.json())
      .then((response) => response.payload.map(createData));

  const { data: allStories, error } = useSWR<StoryView[] | undefined>(
    "/api/stories",
    fetchStories,
    {
      isPaused: () => {
        return allStories ? true : false;
      },
    }
  );

  useEffect(() => {
    if (allStories) {
      dispatch({ type: "INITIALIZE_AFTER_API", rows: allStories });
    }
    if (tagOptions) {
      dispatch({ type: "INITIALIZE_AFTER_TAGS_API", rows: tagOptions });
    }
  }, [allStories, tagOptions]);

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const setClickedRow = (rowId: number | undefined) => {
    if (rowId) {
      const story = allStories?.find((story: StoryView) => story.ID === rowId);
      if (story) {
        setClickedStory(story);
      }
    }
  };

  const handleSwitchChange = (e, story) => {
    dispatch({
      type: "HANDLE_SWITCH_CHANGE",
      e,
      story: { ...story, is_visible: !story.is_visible },
    });
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

  const handleSwitchChangeCheckbox = (e, story) => {
    dispatch({
      type: "HANDLE_SWITCH_CHANGE_CHECKBOX",
      e,
      story: { ...story, is_visible: !story.is_visible },
    });
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

  const handleVisibilityButtons = (visibilityType: string) => {
    if (visibilityType === "hide") {
      state.checkedVisibleStoriesArray.forEach((s) => {
        const changeEvent = {
          target: {
            checked: getStoryByID(s).is_visible ? false : true,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        handleSwitchChangeCheckbox(changeEvent, getStoryByID(s));
      });
      dispatch({ type: "UNCHECK_STORIES", visibilityCondition: "hide" });
    } else {
      state.checkedHiddenStoriesArray.forEach((s) => {
        const changeEvent = {
          target: {
            checked: getStoryByID(s).is_visible ? false : true,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        handleSwitchChangeCheckbox(changeEvent, getStoryByID(s));
      });
      dispatch({ type: "UNCHECK_STORIES", visibilityCondition: "show" });
    }
  };
  const getStoryByID = (id: number) => {
    return allStories.find((s) => s.ID === id);
  };
  const handleCheckedAll = () => {
    dispatch({ type: "HANDLE_CHECKED_ALL" });
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
    state.checkedVisibleStoriesArray.length +
      state.checkedHiddenStoriesArray.length >
      0 &&
    state.checkedVisibleStoriesArray.length +
      state.checkedHiddenStoriesArray.length !==
      allStories.length;

  const handleTabChange = (
    event: React.ChangeEvent<Record<string, unknown>>,
    newValue: number
  ) => {
    dispatch({ type: "SET_TAB_VALUE", newValue });
  };

  const toast = React.useRef(null);

  const showToast = (message: string) => {
    toast.current.showToast(message);
  };

  const publishMap = () => {
    fetch("/api/stories/publish", {
      method: "PUT",
      body: JSON.stringify(state.changedVisibility),
      redirect: "follow",
    })
      .then((response) => response.json())
      .then((result) => {
        dispatch({ type: "CLEAR_PENDING_CHANGES" });
        showToast(result["message"]);
      })
      .catch((error) => console.log("Error: ", error));
  };

  const cancelSearch = () => {
    dispatch({
      type: "HANDLE_SEARCH/FILTER",
      newFilterState: state.filterState,
      newSearch: "",
    });
  };
  if (error) return <div>Error returning stories data!</div>;
  if (!allStories) return <div>Loading all stories table..</div>;
  if (tagError) return <div>Error returning tags data!</div>;
  return (
    <>
      <Prompt
        when={state.changedVisibility.length !== 0}
        message={(location) =>
          `Are you sure you want to go to ${location.pathname}? Your changes on this page will not be saved.`
        }
      />
      <StyledContainer>
        <AllStoriesAppBar
          handlePublishMap={publishMap}
          isPublishDisabled={state.changedVisibility.length == 0}
          handleLogout={signOut}
        />
        <StyledAllStoriesHeader>
          The Shoe Project Impact Map Portal
        </StyledAllStoriesHeader>
        <UploadButton
          component={Link}
          to="/admin/upload"
          variant="contained"
          size="large"
          color="primary"
        >
          UPLOAD STORY
        </UploadButton>
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
      </StyledContainer>
      <div>
        <div
          style={{
            marginBottom: isButtonOpen() ? "-12vh" : "-5vh",
            marginTop: isButtonOpen() ? "2vh" : "0vh",
          }}
        >
          {state.checkedVisibleStoriesArray.length > 0 && (
            <ShowHideButton onClick={() => handleVisibilityButtons("hide")}>
              {hideButtonText}
            </ShowHideButton>
          )}
          {state.checkedHiddenStoriesArray.length > 0 && state.tabValue === 0 && (
            <ShowHideButton
              style={{ marginLeft: "16px" }}
              onClick={() => handleVisibilityButtons("show")}
            >
              {showButtonText}
            </ShowHideButton>
          )}
        </div>
        <StyledFilter>
          <Grid container justify="flex-end" spacing={2}>
            <Grid item xs={8}>
              <StyledSearchBar
                placeholder="Type to search..."
                value={state.search}
                onChange={(searchVal) => {
                  dispatch({
                    type: "HANDLE_SEARCH/FILTER",
                    newFilterState: state.filterState,
                    newSearch: searchVal,
                  });
                }}
                onCancelSearch={() => cancelSearch()}
              />
            </Grid>
            <Grid item xs={4}>
              <StyledButton
                aria-describedby={POPOVER_ID}
                variant="contained"
                color="primary"
                onClick={(e) => handleClick(e, "filter")}
                style={
                  filterAppliedCount()
                    ? { backgroundColor: colors.primaryLight4 }
                    : {}
                }
              >
                {filterLabel} <ExpandMoreIcon />
              </StyledButton>

              <Popover
                id={POPOVER_ID}
                open={isFilterOpen}
                anchorEl={state.anchorEl}
                onClose={() => handleClose("filter")}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div
                  style={{
                    padding: 10,
                  }}
                >
                  <FormControl component="fieldset">
                    <FormLabel
                      component="legend"
                      style={{ minWidth: "10vw", fontFamily: "Poppins" }}
                    >
                      Tags:{" "}
                    </FormLabel>
                    <FormGroup>
                      {state.tags.map((tag) => {
                        return (
                          <FormControlLabel
                            key={tag}
                            control={
                              <Checkbox
                                classes={{
                                  root: classes.checkbox,
                                  checked: classes.checked,
                                }}
                                checked={state.filterState.tags[tag]}
                                onChange={handleTagFilterChange}
                                name={tag}
                              />
                            }
                            className={classes.promptText}
                            style={{
                              textTransform: "capitalize",
                              fontFamily: "Poppins",
                            }}
                            label={tag.toLowerCase()}
                          />
                        );
                      })}
                    </FormGroup>
                  </FormControl>
                  <FormControl component="fieldset">
                    <FormLabel
                      component="legend"
                      style={{ minWidth: "10vw", fontFamily: "Poppins" }}
                    >
                      Visibility:{" "}
                    </FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            classes={{
                              root: classes.checkbox,
                              checked: classes.checked,
                            }}
                            checked={state.filterState.visibility.visible}
                            onChange={handleFilterVisibilityChange}
                            name="visible"
                          />
                        }
                        className={classes.promptText}
                        label="Shown"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            classes={{
                              root: classes.checkbox,
                              checked: classes.checked,
                            }}
                            checked={state.filterState.visibility.nonVisible}
                            onChange={handleFilterVisibilityChange}
                            name="nonVisible"
                          />
                        }
                        className={classes.promptText}
                        label="Hidden"
                      />
                    </FormGroup>
                  </FormControl>
                </div>
              </Popover>
            </Grid>
          </Grid>
        </StyledFilter>
      </div>
      <Popover
        id={"visibility-popover"}
        open={isPopoverOpen}
        anchorEl={state.popoverAnchorEl}
        onClose={() => handleClose("checkbox")}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {state.tabValue === 0 && (
          <FormLabel component="legend" style={{ color: colors.neutralDark }}>
            <Button
              onClick={() => {
                handleStoryVisibilityPopover("all");
              }}
              style={{
                fontFamily: "Poppins",
                textTransform: "capitalize",
                width: "100%",
                fontSize: "16px",
              }}
            >
              {"All"}
            </Button>
          </FormLabel>
        )}
        <FormLabel component="legend" style={{ color: colors.neutralDark }}>
          <Button
            onClick={() => {
              handleStoryVisibilityPopover("visible");
            }}
            style={{
              fontFamily: "Poppins",
              textTransform: "capitalize",
              width: "100%",
              fontSize: "16px",
            }}
          >
            {"Visible Stories"}
          </Button>
        </FormLabel>
        {state.tabValue === 0 && (
          <FormLabel component="legend" style={{ color: colors.neutralDark }}>
            <Button
              onClick={() => {
                handleStoryVisibilityPopover("hidden");
              }}
              style={{
                fontFamily: "Poppins",
                textTransform: "capitalize",
                width: "100%",
                fontSize: "16px",
              }}
            >
              {"Hidden Stories"}
            </Button>
          </FormLabel>
        )}
      </Popover>

      <AllStoriesTabs value={state.tabValue} index={0}>
        {state.tableData.length !== 0 ? (
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
                width: "5%",
                header: (
                  <div>
                    <Checkbox
                      classes={{
                        root: classes.checkbox,
                        checked: classes.checked,
                      }}
                      checked={
                        state.checkedVisibleStoriesArray.length +
                          state.checkedHiddenStoriesArray.length >
                        0
                      }
                      indeterminate={indeterminate}
                      onChange={(e) => {
                        e.persist();
                        handleCheckedAll();
                      }}
                    />
                    <Button
                      onClick={(e) => handleClick(e, "checkbox")}
                      variant="contained"
                      color="primary"
                      style={{
                        padding: "0px",
                        minWidth: "1vw",
                        paddingRight: "-20px",
                        boxShadow: "none",
                        backgroundColor: colors.white,
                      }}
                    >
                      <ExpandMoreIcon
                        style={{
                          color: colors.black,
                        }}
                      />
                    </Button>
                  </div>
                ),
                cell: (story) => (
                  <div>
                    <Checkbox
                      checked={
                        state.checkedHiddenStoriesArray.includes(story.ID) ||
                        state.checkedVisibleStoriesArray.includes(story.ID)
                      }
                      classes={{
                        root: classes.checkbox,
                        checked: classes.checked,
                      }}
                      onChange={(e) => {
                        e.persist();
                        handleChecked(e, story);
                      }}
                      name="checked"
                      color="primary"
                    />
                  </div>
                ),
              },
              {
                name: "title",
                header: "Story Name",
                width: "25%",
                onHeaderClick() {
                  handleRequestSort("title");
                },
              },
              {
                name: "current_city_name",
                header: "Current City",
                width: "15%",
                onHeaderClick() {
                  handleRequestSort("current_city_name");
                },
              },
              {
                name: "year",
                header: "Year",
                width: "5%",
                onHeaderClick() {
                  handleRequestSort("year");
                },
              },
              {
                name: "author_name",
                header: "Author name",
                width: "15%",
                onHeaderClick() {
                  handleRequestSort("author_name");
                },
              },
              {
                name: "author_country",
                header: "Country",
                width: "10%",
                onHeaderClick() {
                  handleRequestSort("author_country");
                },
              },
              {
                name: "tags",
                header: "Tags",
                width: "15%",
                onHeaderClick() {
                  handleRequestSort("tags");
                },
                cell: (story) =>
                  story.tags.map((tag) => (
                    <StyledChip
                      color="primary"
                      key={tag}
                      label={tag.toLowerCase()}
                    />
                  )),
              },
              {
                name: "is_visible",
                header: "Visibility",
                width: "10%",
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
        ) : (
          <>
            <StyledEmptyMessage> No Stories Here!</StyledEmptyMessage>
            <StyledSubEmptyMessage>
              {" "}
              To add a story, click “ Upload Story” on the top right.{" "}
            </StyledSubEmptyMessage>
          </>
        )}
      </AllStoriesTabs>
      <AllStoriesTabs value={state.tabValue} index={1}>
        {doesVisibleStoriesExist ? (
          <VirtualizedTable
            data={stableSort(
              state.visibleTableState.filter((story) => story.is_visible),
              getComparator(state.order, state.orderBy)
            )}
            order={state.order}
            orderBy={state.orderBy}
            setClickedRow={setClickedRow}
            columns={[
              {
                name: "ID",
                width: "5%",
                header: (
                  <div>
                    <Checkbox
                      classes={{
                        root: classes.checkbox,
                        checked: classes.checked,
                      }}
                      checked={
                        state.checkedVisibleStoriesArray.length +
                          state.checkedHiddenStoriesArray.length >
                        0
                      }
                      indeterminate={indeterminate}
                      onChange={(e) => {
                        e.persist();
                        handleCheckedAll();
                      }}
                    />
                    <Button
                      onClick={(e) => handleClick(e, "checkbox")}
                      variant="contained"
                      color="primary"
                      style={{
                        padding: "0px",
                        minWidth: "1vw",
                        paddingRight: "-20px",
                        boxShadow: "none",
                        backgroundColor: colors.white,
                      }}
                    >
                      <ExpandMoreIcon
                        style={{
                          color: colors.black,
                        }}
                      />
                    </Button>
                  </div>
                ),
                cell: (story) => (
                  <div>
                    <Checkbox
                      checked={
                        state.checkedHiddenStoriesArray.includes(story.ID) ||
                        state.checkedVisibleStoriesArray.includes(story.ID)
                      }
                      classes={{
                        root: classes.checkbox,
                        checked: classes.checked,
                      }}
                      onChange={(e) => {
                        e.persist();
                        handleChecked(e, story);
                      }}
                      name="checked"
                      color="primary"
                    />
                  </div>
                ),
              },
              {
                name: "title",
                header: "Story Name",
                width: "25%",
                onHeaderClick() {
                  handleRequestSort("title");
                },
              },
              {
                name: "current_city_name",
                header: "Current City",
                width: "15%",
                onHeaderClick() {
                  handleRequestSort("current_city_name");
                },
              },
              {
                name: "year",
                header: "Year",
                width: "5%",
                onHeaderClick() {
                  handleRequestSort("year");
                },
              },
              {
                name: "author_name",
                header: "Author name",
                width: "15%",
                onHeaderClick() {
                  handleRequestSort("author_name");
                },
              },
              {
                name: "author_country",
                header: "Country",
                width: "10%",
                onHeaderClick() {
                  handleRequestSort("author_country");
                },
              },
              {
                name: "tags",
                header: "Tags",
                width: "15%",
                onHeaderClick() {
                  handleRequestSort("tags");
                },
                cell: (story) =>
                  story.tags.map((tag) => (
                    <StyledChip
                      color="primary"
                      key={tag}
                      label={tag.toLowerCase()}
                    />
                  )),
              },
              {
                name: "is_visible",
                header: "Visibility",
                width: "10%",
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
        ) : (
          <>
            <StyledEmptyMessage>
              {" "}
              No Visible Stories right now.{" "}
            </StyledEmptyMessage>
            <StyledSubEmptyMessage>
              To turn on a story’s visibility, go to the All Stories tab and
              toggle Visibility “ON”.{" "}
            </StyledSubEmptyMessage>
          </>
        )}
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
                width: "5%",
                header: "",
                cell: (story) => {
                  return (
                    <div>
                      {story.is_visible ? (
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
                width: "25%",
                onHeaderClick() {
                  handleRequestSort("title");
                },
              },
              {
                name: "current_city_name",
                header: "Current City",
                width: "15%",
                onHeaderClick() {
                  handleRequestSort("current_city_name");
                },
              },
              {
                name: "year",
                header: "Year",
                width: "5%",
                onHeaderClick() {
                  handleRequestSort("year");
                },
              },
              {
                name: "author_name",
                header: "Author name",
                width: "15%",
                onHeaderClick() {
                  handleRequestSort("author_name");
                },
              },
              {
                name: "author_country",
                header: "Country",
                width: "10%",
                onHeaderClick() {
                  handleRequestSort("author_country");
                },
              },
              {
                name: "tags",
                header: "Tags",
                width: "15%",
                onHeaderClick() {
                  handleRequestSort("tags");
                },
                cell: (story) =>
                  story.tags.map((tag) => (
                    <StyledChip
                      color="primary"
                      key={tag}
                      label={tag.toLowerCase()}
                    />
                  )),
              },
              {
                name: "is_visible",
                header: "Visibility",
                width: "10%",
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
        ) : (
          <StyledEmptyMessage> No pending changes! </StyledEmptyMessage>
        )}
      </AllStoriesTabs>
      <ToastyBoi ref={toast} />
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
