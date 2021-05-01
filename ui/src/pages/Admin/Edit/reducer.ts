import { Story } from "../../../types";

export interface State {
  tagArray: string[];
  authorCountry: string;
  currentCity: string;
  autocompleteAuthorCountry: string;
  autocompleteTag: string;
  addedCountry: string;
  newImage: string;
  disabled: boolean;
  uploadErrorState: boolean;
  loading: boolean;
  isDrawerOpen: boolean;
}

export type Action =
  | { type: "SET_TAG_VALUES"; tags: string[] }
  | { type: "SET_AUTHOR_COUNTRY"; country: string }
  | { type: "SET_CURRENT_CITY"; city: string }
  | { type: "SET_AUTOCOMPLETE_COUNTRY"; autocompleteCountry: string }
  | { type: "SET_AUTOCOMPLETE_TAG"; autocompleteTag: string }
  | { type: "ADD_IMAGE"; addedImage: string }
  | { type: "SET_BUTTON_DISABLE"; status: boolean }
  | { type: "SET_ERROR_STATE"; errorState: boolean }
  | { type: "SET_LOADING_STATUS"; loadingStatus: boolean }
  | { type: "SET_DRAWER_OPEN"; drawerOpen: boolean }
  | { type: "STORY_SUBMITTED"; loadingStatus: boolean; buttonStatus: boolean }
  | { type: "NEW_COUNTRY_ADDED"; newCountry: string };

export function get_init_state(currentStory: Story): State {
  return {
    tagArray: currentStory.tags,
    authorCountry: currentStory.author_country,
    currentCity: currentStory.current_city.toUpperCase(),
    autocompleteAuthorCountry: currentStory.author_country,
    autocompleteTag: "",
    addedCountry: "",
    newImage: currentStory.image_url,
    disabled: false,
    uploadErrorState: false,
    loading: false,
    isDrawerOpen: false,
  };
}

export function uploadStoryReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TAG_VALUES": {
      return {
        ...state,
        tagArray: action.tags,
      };
    }
    case "SET_AUTHOR_COUNTRY": {
      return {
        ...state,
        authorCountry: action.country,
      };
    }
    case "SET_CURRENT_CITY": {
      return {
        ...state,
        currentCity: action.city,
      };
    }
    case "SET_AUTOCOMPLETE_COUNTRY": {
      return {
        ...state,
        autocompleteAuthorCountry: action.autocompleteCountry,
      };
    }
    case "SET_AUTOCOMPLETE_TAG": {
      return {
        ...state,
        autocompleteTag: action.autocompleteTag,
      };
    }
    case "ADD_IMAGE": {
      return {
        ...state,
        newImage: action.addedImage,
      };
    }
    case "SET_BUTTON_DISABLE": {
      return {
        ...state,
        disabled: action.status,
      };
    }
    case "SET_ERROR_STATE": {
      return {
        ...state,
        uploadErrorState: action.errorState,
      };
    }
    case "SET_LOADING_STATUS": {
      return {
        ...state,
        loading: action.loadingStatus,
      };
    }
    case "SET_DRAWER_OPEN": {
      return {
        ...state,
        isDrawerOpen: action.drawerOpen,
      };
    }
    case "STORY_SUBMITTED": {
      return {
        ...state,
        loading: action.loadingStatus,
        disabled: action.buttonStatus,
      };
    }
    case "NEW_COUNTRY_ADDED": {
      return {
        ...state,
        addedCountry: action.newCountry,
        authorCountry: action.newCountry,
      };
    }
  }
}
