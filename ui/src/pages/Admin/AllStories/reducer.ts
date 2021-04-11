import { StoryView } from "./types";

export interface State {
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
  filterState: any;
}

export type Action =
  | { type: "SWITCH_TAB"; id: number }
  | { type: "HANDLE_SWITCH_CHANGE"; e: React.ChangeEvent; story: StoryView }
  | { type: "INITIALIZE_AFTER_API"; rows: StoryView[] }
  | { type: "INITIALIZE_AFTER_TAGS_API"; rows: string[] }
  | { type: "HANDLE_CHECKED_ALL"; rows: StoryView[] }
  | { type: "HANDLE_CHECKED"; e: React.ChangeEvent; story: StoryView }
  | { type: "SET_ORDERING"; order: "asc" | "desc"; orderBy: string }
  | { type: "SET_TABLE_DATA"; data: StoryView[] }
  | { type: "SET_TAB_VALUE"; newValue: number; newState: State }
  | { type: "SET_CHANGED_VISIBILITY"; data: StoryView[] }
  | { type: "SET_VISIBLE_TABLE_STATE"; data: StoryView[] }
  | { type: "HANDLE_SEARCH/FILTER"; data: State };

export const INIT_STATE: State = {
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
};

export function allStoriesReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SWITCH_TAB": {
      return {
        ...state,
        tabValue: action.id,
      };
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

    case "HANDLE_CHECKED_ALL": {
      return {
        ...state,
        selectedRowIds:
          state.selectedRowIds.length === state.tableData.length
            ? []
            : state.tableData.map((story) => story.ID),
      };
    }
    case "HANDLE_CHECKED": {
      const target = action.e.target as HTMLInputElement;

      if (target.checked) {
        return {
          ...state,
          selectedRowIds: [...state.selectedRowIds, action.story.ID],
        };
      } else {
        return {
          ...state,
          selectedRowIds: state.selectedRowIds.filter(
            (e) => e !== action.story.ID
          ),
        };
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
      const newState = requestSearchAndFilter(action.newState);
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
      return requestSearchAndFilter(action.data);
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
    console.log(newState.changedVisibility);
    newState.changedVisibility = requestSearchAndFilterHelper(
      newState.changedVisibilityFilter,
      newState
    );
  }
  return newState;
};
