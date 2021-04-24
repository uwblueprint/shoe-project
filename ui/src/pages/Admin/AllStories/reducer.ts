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
}

export type Action =
  | { type: "SWITCH_TAB"; id: number }
  | { type: "HANDLE_SWITCH_CHANGE"; e: React.ChangeEvent; story: StoryView }
  | { type: "INITIALIZE_AFTER_API"; rows: StoryView[] }
  | { type: "HANDLE_CHECKED_ALL"; rows: StoryView[] }
  | { type: "HANDLE_CHECKED"; e: React.ChangeEvent; story: StoryView }
  | { type: "SET_ORDERING"; order: "asc" | "desc"; orderBy: string }
  | { type: "SET_TABLE_DATA"; data: StoryView[] }
  | { type: "SET_TAB_VALUE"; newValue: number }
  | { type: "CLEAR_PENDING_CHANGES" }
  | { type: "SET_CHANGED_VISIBILITY"; data: StoryView[] }
  | { type: "SET_VISIBLE_TABLE_STATE"; data: StoryView[] }
  | { type: "HANDLE_SEARCH"; data: string };

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
};

export function allStoriesReducer(state: State, action: Action): State {
  switch (action.type) {
    case "CLEAR_PENDING_CHANGES": {
      return {
        ...state,
        changedVisibility: [],
      };
    }
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
      return {
        ...state,
        visibleTableState: action.rows ? action.rows : [],
        tableData: action.rows ? action.rows : [],
        visibleTableFilterState: action.rows ? action.rows : [],
        origTableData: action.rows ? action.rows : [],
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
      return {
        ...state,
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
    case "HANDLE_SEARCH": {
      return {
        ...state,
        search: action.data,
      };
    }
  }
}
