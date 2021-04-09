import { Story } from "../../types";

export interface State {
  tagArray: string[];
  authorCountry: string;
  currentCity: string;
  autocompleteAuthorCountry: string;
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
  | { type: "ADD_COUNTRY"; newCountry: string }
  | { type: "ADD_IMAGE"; addedImage: string }
  | { type: "SET_BUTTON_DISABLE"; status: boolean }
  | { type: "SET_ERROR_STATE"; errorState: boolean }
  | { type: "SET_LOADING_STATUS"; loadingStatus: boolean }
  | { type: "SET_DRAWER_OPEN"; drawerOpen: boolean };

export function INIT_STATE(currentStory: Story): State {
  return {
    tagArray: currentStory.tags,
    authorCountry: currentStory.author_country,
    currentCity: currentStory.current_city.toUpperCase(),
    autocompleteAuthorCountry: currentStory.author_country,
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
    case "ADD_COUNTRY": {
      return {
        ...state,
        addedCountry: action.newCountry,
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
  }
}
