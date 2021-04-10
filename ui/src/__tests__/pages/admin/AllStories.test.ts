import React from "react";

import {
  Action,
  allStoriesReducer,
  INIT_STATE,
} from "../../../pages/admin/AllStories/reducer";
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
      expect(INIT_STATE.tableData.length).toBe(0);

      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.tableData.length).toBe(2);
    });

    it("should initialize visibletable states after API", () => {
      const action: Action = {
        type: "INITIALIZE_AFTER_API",
        rows: mockTableData,
      };
      expect(INIT_STATE.visibleTableState.length).toBe(0);
      expect(INIT_STATE.origTableData.length).toBe(0);
      expect(INIT_STATE.origTableData.length).toBe(0);
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.visibleTableState.length).toBe(2);
      expect(newState.tableData.length).toBe(2);
      expect(newState.origTableData.length).toBe(2);
    });

    it("should switch tabs", () => {
      const action: Action = { type: "SET_TAB_VALUE", newValue: 1 };
      expect(INIT_STATE.tabValue).toBe(0);
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.tabValue).toBe(1);
    });

    it("should check one box", () => {
      const changeEvent = {
        target: {
          checked: true,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      const action: Action = {
        type: "HANDLE_CHECKED",
        e: changeEvent,
        story: mockTableData[1],
      };
      expect(INIT_STATE.selectedRowIds.length).toBe(0);
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.selectedRowIds.length).toBe(1);
    });

    it("should toggle switch", () => {
      const changeEvent = {
        target: {
          checked: false,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      const action: Action = {
        type: "HANDLE_SWITCH_CHANGE",
        e: changeEvent,
        story: mockTableData[2],
      };
      expect(INIT_STATE.changedVisibility.length).toBe(0);
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.changedVisibility.length).toBe(1);
    });

    it("should search a story by number", () => {
      const searchedVal = "2019";
      const action: Action = {
        type: "HANDLE_SEARCH",
        data: searchedVal,
      };
      expect(INIT_STATE.search).toBe("");
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.search).toBe(searchedVal);
    });

    it("should search a story by string", () => {
      const searchedVal = "City1";
      const action: Action = {
        type: "HANDLE_SEARCH",
        data: searchedVal,
      };
      expect(INIT_STATE.search).toBe("");
      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.search).toBe(searchedVal);
    });

    it("should set changed visibility state", () => {
      const action: Action = {
        type: "SET_CHANGED_VISIBILITY",
        data: mockTableData,
      };
      expect(INIT_STATE.changedVisibility.length).toBe(0);

      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.changedVisibility.length).toBe(2);
    });

    it("should set visible table state", () => {
      const action: Action = {
        type: "SET_VISIBLE_TABLE_STATE",
        data: mockTableData,
      };
      expect(INIT_STATE.visibleTableState.length).toBe(0);

      const newState = allStoriesReducer(INIT_STATE, action);
      expect(newState.visibleTableState.length).toBe(2);
    });
  });
});
