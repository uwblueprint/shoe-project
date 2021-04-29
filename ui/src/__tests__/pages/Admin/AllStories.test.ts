import React from "react";

import {
  Action,
  allStoriesReducer,
  INIT_STATE,
} from "../../../pages/Admin/AllStories/reducer";
const mockTableData = [
  {
    ID: 1,
    title: "Test1",
    current_city: "City1",
    year: 2000,
    author_name: "TestName1",
    author_first_name: "TestFirstName1",
    author_last_name: "TestLastName1",
    author_country: "Country1",
    is_visible: false,
    image_url: "image1",
    video_url: "video1",
    content: "content1",
    tags: ["TAG1, TAG2"],
  },
  {
    ID: 2,
    title: "Test2",
    current_city: "City2",
    year: 2019,
    author_name: "TestName2",
    author_first_name: "TestFirstName2",
    author_last_name: "TestLastName2",
    author_country: "Country2",
    is_visible: true,
    image_url: "image2",
    video_url: "video2",
    content: "content2",
    tags: ["TAG1"],
  },
];

describe("allstories table", () => {
  describe("reducer", () => {
    it("should set the correct tab value", () => {
      const action: Action = { type: "SWITCH_TAB", id: 2 };
      expect(INIT_STATE.tabValue).toBe(0);
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.tabValue).toBe(2);
    });

    it("should order table data", () => {
      const action: Action = {
        type: "SET_ORDERING",
        order: "desc",
        orderBy: INIT_STATE.orderBy,
      };
      expect(INIT_STATE.order).toBe("asc");
      expect(INIT_STATE.orderBy).toBe("ID");

      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.order).toBe("desc");
    });

    it("should initialize table data", () => {
      const action: Action = { type: "SET_TABLE_DATA", data: mockTableData };
      expect(INIT_STATE.tableData).toHaveLength(0);

      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.tableData).toHaveLength(2);
    });

    it("should initialize visibletable states after API", () => {
      const action: Action = {
        type: "INITIALIZE_AFTER_API",
        rows: mockTableData,
      };
      expect(INIT_STATE.visibleTableState).toHaveLength(0);
      expect(INIT_STATE.origTableData).toHaveLength(0);
      expect(INIT_STATE.tableData).toHaveLength(0);
      expect(INIT_STATE.tabValue).toBe(0);
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.visibleTableState).toHaveLength(2);
      expect(newState.tableData).toHaveLength(2);
      expect(newState.origTableData).toHaveLength(2);
    });

    it("should initialize tags and filter states after Tags API", () => {
      const tagRows = ["TAG1", "TAG2"];
      const action: Action = {
        type: "INITIALIZE_AFTER_TAGS_API",
        rows: tagRows,
      };
      expect(INIT_STATE.tags).toHaveLength(0);
      expect(INIT_STATE.filterState.tags).toEqual({});
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.tags).toHaveLength(2);
      expect(newState.filterState.tags).toEqual({
        TAG1: false,
        TAG2: false,
      });
    });

    it("should switch tabs", () => {
      const action: Action = {
        type: "SET_TAB_VALUE",
        newValue: 1,
        newState: INIT_STATE,
      };
      expect(INIT_STATE.tabValue).toBe(0);
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.tabValue).toBe(1);
    });

    it("should toggle switch", () => {
      const changeEvent = {
        target: {
          checked: false,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      const action: Action = {
        type: "HANDLE_SWITCH_CHANGE_CHECKBOX",
        e: changeEvent,
        story: mockTableData[2],
      };
      expect(INIT_STATE.changedVisibility).toHaveLength(0);
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.changedVisibility).toHaveLength(1);
    });

    it("should search a story by number", () => {
      const searchedVal = "2019";
      const action: Action = {
        type: "HANDLE_SEARCH/FILTER",
        newFilterState: INIT_STATE.filterState,
        newSearch: searchedVal,
      };
      expect(INIT_STATE.search).toBe("");
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.search).toBe(searchedVal);
    });

    it("should search a story by string", () => {
      const searchedVal = "City1";
      const action: Action = {
        type: "HANDLE_SEARCH/FILTER",
        newFilterState: INIT_STATE.filterState,
        newSearch: searchedVal,
      };
      expect(INIT_STATE.search).toBe("");
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.search).toBe(searchedVal);
    });

    it("should filter by tag1", () => {
      const newFilterState = {
        ...INIT_STATE.filterState,
        tags: { TAG1: true },
      };
      const action: Action = {
        type: "HANDLE_SEARCH/FILTER",
        newFilterState: newFilterState,
        newSearch: INIT_STATE.search,
      };
      expect(INIT_STATE.filterState.tags).toEqual({});
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.filterState.tags).toEqual({ TAG1: true });
    });

    it("should set changed visibility state", () => {
      const action: Action = {
        type: "SET_CHANGED_VISIBILITY",
        data: mockTableData,
      };
      expect(INIT_STATE.changedVisibility).toHaveLength(0);

      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.changedVisibility).toHaveLength(2);
    });

    it("should set visible table state", () => {
      const action: Action = {
        type: "SET_VISIBLE_TABLE_STATE",
        data: mockTableData,
      };
      expect(INIT_STATE.visibleTableState).toHaveLength(0);

      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.visibleTableState).toHaveLength(2);
    });
  });
});
