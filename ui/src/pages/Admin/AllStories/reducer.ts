import { StoryView } from "./types";

interface FilterState {
  visibility: VisibilityType;
  tags: Record<string, boolean>;
}
type VisibilityType = {
  visible: boolean;
  nonVisible: boolean;
};

export interface State {
  anchorEl: HTMLButtonElement | null;
  popoverAnchorEl: HTMLButtonElement | null;
  tabValue: number;
  search: string;
  visibleState: number[];
  visibleTableState: StoryView[];
  tableData: StoryView[];
  changedVisibility: StoryView[];
  visibleTableFilterState: StoryView[];
  changedVisibilityFilter: StoryView[];
  origTableData: StoryView[];
  selectedRowIds: number[];
  order: "asc" | "desc";
  orderBy: string;
  tags: string[];
  filterState: FilterState;
  checkedVisibleStoriesArray: number[];
  checkedHiddenStoriesArray: number[];
}

export type Action =
  | { type: "SWITCH_TAB"; id: number }
  | { type: "SET_ANCHOR"; click: HTMLButtonElement; popoverType: string }
  | { type: "HANDLE_SWITCH_CHANGE"; e: React.ChangeEvent; story: StoryView }
  | { type: "INITIALIZE_AFTER_API"; rows: StoryView[] }
  | { type: "INITIALIZE_AFTER_TAGS_API"; rows: string[] }
  | { type: "HANDLE_CHECKED_ALL"; rows: StoryView[] }
  | { type: "HANDLE_CHECKED"; e: React.ChangeEvent; story: StoryView }
  | { type: "SET_ORDERING"; order: "asc" | "desc"; orderBy: string }
  | { type: "SET_TABLE_DATA"; data: StoryView[] }
  | { type: "SET_TAB_VALUE"; newValue: number }
  | { type: "SET_CHANGED_VISIBILITY"; data: StoryView[] }
  | { type: "SET_VISIBLE_TABLE_STATE"; data: StoryView[] }
  | {
      type: "HANDLE_SEARCH/FILTER";
      newFilterState: FilterState;
      newSearch: string;
    }
  | { type: "HANDLE_POPOVER_CHECKED"; visibilityCondition: string }
  | { type: "UNCHECK_STORIES"; visibilityCondition: string };
export const INIT_STATE: State = {
  anchorEl: null,
  tabValue: 0,
  search: "",
  visibleState: [],
  visibleTableState: [],
  tableData: [],
  changedVisibility: [],
  visibleTableFilterState: [],
  changedVisibilityFilter: [],
  origTableData: [],
  selectedRowIds: [],
  order: "asc",
  orderBy: "ID",
  tags: [],
  filterState: {
    visibility: {
      visible: false,
      nonVisible: false,
    },
    tags: {},
  },
  popoverAnchorEl: null,
  checkedVisibleStoriesArray: [],
  checkedHiddenStoriesArray: [],
};

export function allStoriesReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SWITCH_TAB": {
      return {
        ...state,
        tabValue: action.id,
      };
    }
    case "SET_ANCHOR": {
      if (action.popoverType === "filter") {
        return {
          ...state,
          anchorEl: action.click,
        };
      } else {
        return {
          ...state,
          popoverAnchorEl: action.click,
        };
      }
    }
    case "HANDLE_POPOVER_CHECKED": {
      if (action.visibilityCondition === "all") {
        return {
          ...state,
          selectedRowIds: state.tableData.map((story) => story.ID),
          checkedVisibleStoriesArray: state.visibleTableState
            .filter((story) => story.is_visible)
            .map((story) => story.ID),
          checkedHiddenStoriesArray: state.visibleTableState
            .filter((story) => !story.is_visible)
            .map((story) => story.ID),
        };
      } else if (action.visibilityCondition === "visible") {
        return {
          ...state,
          selectedRowIds: state.tableData.map((story) => {
            if (story.is_visible) {
              return story.ID;
            }
          }),
          checkedVisibleStoriesArray: state.visibleTableState
            .filter((story) => story.is_visible)
            .map((story) => story.ID),
          checkedHiddenStoriesArray: INIT_STATE.checkedHiddenStoriesArray,
        };
      } else {
        return {
          ...state,
          selectedRowIds: state.tableData.map((story) => {
            if (!story.is_visible) {
              return story.ID;
            }
          }),
          checkedHiddenStoriesArray: state.visibleTableState
            .filter((story) => !story.is_visible)
            .map((story) => story.ID),
          checkedVisibleStoriesArray: INIT_STATE.checkedVisibleStoriesArray,
        };
      }
    }

    case "HANDLE_SWITCH_CHANGE": {
      const changedVisibilityContainsID = state.changedVisibility.some(
        (e) => e.ID === action.story.ID
      );
      const target = action.e.target as HTMLInputElement;
      if (target.checked) {
        return {
          ...state,
          visibleState: [...state.visibleState, action.story.ID],
          visibleTableState: [...state.visibleTableState, action.story],
          changedVisibility: changedVisibilityContainsID
            ? state.changedVisibility.filter((e) => e.ID !== action.story.ID)
            : [...state.changedVisibility, action.story],
          visibleTableFilterState: [
            ...state.visibleTableFilterState,
            action.story,
          ],
          changedVisibilityFilter: changedVisibilityContainsID
            ? state.changedVisibilityFilter.filter(
                (e) => e.ID !== action.story.ID
              )
            : [...state.changedVisibilityFilter, action.story],
        };
      } else {
        return {
          ...state,
          visibleState: state.visibleState.filter((e) => e !== action.story.ID),
          visibleTableState: state.visibleTableState.filter(
            (e) => e.ID !== action.story.ID
          ),
          changedVisibility: changedVisibilityContainsID
            ? state.changedVisibility.filter((e) => e.ID !== action.story.ID)
            : [...state.changedVisibility, action.story],
          visibleTableFilterState: state.visibleTableState.filter(
            (e) => e.ID !== action.story.ID
          ),
          changedVisibilityFilter: changedVisibilityContainsID
            ? state.changedVisibilityFilter.filter(
                (e) => e.ID !== action.story.ID
              )
            : [...state.changedVisibilityFilter, action.story],
        };
      }
    }
    case "INITIALIZE_AFTER_API": {
      const newState = {
        ...state,
        visibleTableState: action.rows ? action.rows : [],
        tableData: action.rows ? action.rows : [],
        visibleTableFilterState: action.rows ? action.rows : [],
        origTableData: action.rows ? action.rows : [],
      };

      return requestSearchAndFilter(newState);
    }
    case "INITIALIZE_AFTER_TAGS_API": {
      const tagBooleans = {};
      action.rows.forEach((tag) => {
        tagBooleans[tag] = false;
      });
      return {
        ...state,
        tags: action.rows,
        filterState: {
          ...state.filterState,
          tags: state.tags.length > 0 ? state.filterState.tags : tagBooleans,
        },
      };
    }
    case "UNCHECK_STORIES": {
      if (action.visibilityCondition === "hide") {
        return {
          ...state,
          selectedRowIds: state.selectedRowIds.filter(
            (s) => !state.visibleState.includes(s)
          ),
          checkedVisibleStoriesArray: INIT_STATE.checkedVisibleStoriesArray,
        };
      } else {
        return {
          ...state,
          selectedRowIds: state.selectedRowIds.filter((s) =>
            state.visibleState.includes(s)
          ),
          checkedHiddenStoriesArray: INIT_STATE.checkedHiddenStoriesArray,
        };
      }
    }
    case "HANDLE_CHECKED_ALL": {
      if (state.selectedRowIds.length === 0) {
        return {
          ...state,
          selectedRowIds: state.tableData.map((story) => story.ID),
          checkedVisibleStoriesArray: state.visibleTableState
            .filter((story) => story.is_visible)
            .map((story) => story.ID),
          checkedHiddenStoriesArray: state.visibleTableState
            .filter((story) => !story.is_visible)
            .map((story) => story.ID),
        };
      } else {
        return {
          ...state,
          selectedRowIds: INIT_STATE.selectedRowIds,
          checkedHiddenStoriesArray: INIT_STATE.checkedHiddenStoriesArray,
          checkedVisibleStoriesArray: INIT_STATE.checkedVisibleStoriesArray,
        };
      }
    }
    case "HANDLE_CHECKED": {
      const target = action.e.target as HTMLInputElement;
      if (target.checked) {
        if (action.story.is_visible) {
          return {
            ...state,
            selectedRowIds: [...state.selectedRowIds, action.story.ID],
            checkedVisibleStoriesArray: [
              ...state.checkedVisibleStoriesArray,
              action.story.ID,
            ],
          };
        } else {
          return {
            ...state,
            selectedRowIds: [...state.selectedRowIds, action.story.ID],
            checkedHiddenStoriesArray: [
              ...state.checkedHiddenStoriesArray,
              action.story.ID,
            ],
          };
        }
      } else {
        if (!action.story.is_visible) {
          return {
            ...state,
            selectedRowIds: state.selectedRowIds.filter(
              (e) => e !== action.story.ID
            ),
            checkedHiddenStoriesArray: state.checkedHiddenStoriesArray.filter(
              (id) => id !== action.story.ID
            ),
          };
        } else {
          return {
            ...state,
            selectedRowIds: state.selectedRowIds.filter(
              (e) => e !== action.story.ID
            ),
            checkedVisibleStoriesArray: state.checkedVisibleStoriesArray.filter(
              (id) => id !== action.story.ID
            ),
          };
        }
      }
    }
    case "SET_ORDERING": {
      return {
        ...state,
        order: action.order,
        orderBy: action.orderBy,
      };
    }
    case "SET_TABLE_DATA": {
      return {
        ...state,
        tableData: action.data,
      };
    }
    case "SET_TAB_VALUE": {
      const tagBooleans = {};
      state.tags.forEach((tag) => {
        tagBooleans[tag] = false;
      });
      let newState = {
        ...state,
        search: "",
        filterState: {
          visibility: {
            visible: false,
            nonVisible: false,
          },
          tags: tagBooleans,
        },
      }; // To reset the previous tab
      newState = requestSearchAndFilter(newState);
      return {
        ...newState,
        tabValue: action.newValue,
      };
    }
    case "SET_CHANGED_VISIBILITY": {
      return {
        ...state,
        changedVisibility: action.data,
      };
    }
    case "SET_VISIBLE_TABLE_STATE": {
      return {
        ...state,
        visibleTableState: action.data,
      };
    }
    case "HANDLE_SEARCH/FILTER": {
      const newState = {
        ...state,
        search: action.newSearch,
        filterState: action.newFilterState,
      };
      return requestSearchAndFilter(newState);
    }
  }
}

const requestSearchHelper = (row, newState: State) => {
  if (newState.search == "") {
    return true;
  }
  let doesExist = false;
  Object.keys(row).forEach((prop) => {
    //Exclude search for StoryView members not displayed on table cells
    const excludedParameters =
      prop !== "ID" &&
      prop !== "image_url" &&
      prop !== "video_url" &&
      prop !== "content" &&
      prop !== "is_visible";
    const numExist =
      typeof row[prop] === "number" &&
      row[prop].toString().includes(newState.search) &&
      excludedParameters;
    const stringExist =
      typeof row[prop] === "string" &&
      row[prop].toLowerCase().includes(newState.search.toLowerCase()) &&
      excludedParameters;
    if (stringExist || numExist) {
      doesExist = true;
    }
  });
  return doesExist;
};

const handleTagFilterHelper = (row, newState: State) => {
  let exist = false;
  let zeroChecked = true; //atleast one tag should be checked off
  Object.keys(newState.filterState.tags).forEach((tag) => {
    if (newState.filterState.tags[tag]) {
      zeroChecked = false;
      if (row.tags.includes(tag.toString())) {
        exist = true;
      }
    }
  });
  if (zeroChecked) {
    return true;
  }
  return exist;
};

const checkRowVisibility = (row, newState: State) => {
  return (
    (newState.filterState.visibility.visible && row.is_visible) ||
    (newState.filterState.visibility.nonVisible && !row.is_visible) ||
    (!newState.filterState.visibility.nonVisible &&
      !newState.filterState.visibility.visible)
  );
};

const checkRowVisibilityPending = (row, newState: State) => {
  return (
    (newState.filterState.visibility.visible &&
      newState.visibleState.includes(row.ID)) ||
    (newState.filterState.visibility.nonVisible &&
      !newState.visibleState.includes(row.ID)) ||
    (!newState.filterState.visibility.nonVisible &&
      !newState.filterState.visibility.visible)
  );
};

const requestSearchAndFilterHelper = (
  origRows: StoryView[],
  newState: State
) => {
  let filteredRows: StoryView[] = origRows.filter((row) => {
    return requestSearchHelper(row, newState);
  });
  filteredRows = filteredRows.filter((row) => {
    if (newState.tabValue === 2) {
      return checkRowVisibilityPending(row, newState);
    }
    return checkRowVisibility(row, newState);
  });
  filteredRows = filteredRows.filter((row) => {
    return handleTagFilterHelper(row, newState);
  });
  return filteredRows;
};

const requestSearchAndFilter = (newState: State) => {
  if (newState.tabValue === 0) {
    newState.tableData = requestSearchAndFilterHelper(
      newState.origTableData,
      newState
    );
  } else if (newState.tabValue === 1) {
    newState.visibleTableState = requestSearchAndFilterHelper(
      newState.visibleTableFilterState,
      newState
    );
  } else if (newState.tabValue === 2) {
    newState.changedVisibility = requestSearchAndFilterHelper(
      newState.changedVisibilityFilter,
      newState
    );
  }
  return newState;
};
