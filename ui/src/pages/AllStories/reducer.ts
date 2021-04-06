import { StoryView } from "../AllStories";

export interface State {
  tabValue: number;
  visibleState: StoryView[];
  visibleTableState: StoryView[];
  tableData: StoryView[];
  changedVisibility: StoryView[];
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
  | { type: "SET_TAB_VALUE"; newValue: number };

export const INIT_STATE: State = {
  tabValue: 0,
  visibleState: [],
  visibleTableState: [],
  tableData: [],
  changedVisibility: [],
  selectedRowIds: [],
  order: "asc",
  orderBy: "ID",
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
      if (action.e.target.checked) {
        return {
          ...state,
          visibleState: [...state.visibleState, action.story],
          visibleTableState: [...state.visibleTableState, action.story],
          changedVisibility: changedVisibilityContainsID
            ? state.changedVisibility.filter((e) => e.ID !== action.story.ID)
            : [...state.changedVisibility, action.story],
        };
      } else {
        return {
          ...state,
          visibleState: state.visibleState.filter(
            (e) => e.ID !== action.story.ID
          ),
          visibleTableState: state.visibleTableState.filter(
            (e) => e.ID !== action.story.ID
          ),
          changedVisibility: changedVisibilityContainsID
            ? state.changedVisibility.filter((e) => e.ID !== action.story.ID)
            : [...state.changedVisibility, action.story],
        };
      }
    }
    case "INITIALIZE_AFTER_API": {
      return {
        ...state,
        visibleState: action.rows ? action.rows : [],
        visibleTableState: action.rows ? action.rows : [],
        tableData: action.rows ? action.rows : [],
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
      if (action.e.target.checked) {
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
  }
}
