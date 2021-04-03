import { GoogleLoginResponse } from "react-google-login";

export enum FailureState {
  InvalidEmail,
  PopupFail,
  Unknown,
}

export type State = {
  loading: boolean;
  auth?: GoogleLoginResponse;
  failure?: FailureState;
};

export type Action =
  | { type: "START_LOADING" }
  | {
      type: "SUCCESS";
      response: GoogleLoginResponse;
    }
  | { type: "FAILURE"; failure: FailureState }
  | { type: "LOGOUT_SUCCESS" }
  | { type: "LOGOUT_FAILURE" };

export const INIT_STATE: State = Object.freeze({
  loading: false,
  auth: undefined,
  failure: undefined,
});

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "START_LOADING": {
      return {
        ...state,
        loading: true,
      };
    }
    case "SUCCESS": {
      return {
        ...state,
        loading: false,
        failure: undefined,
        auth: action.response,
      };
    }
    case "FAILURE": {
      return {
        ...state,
        loading: false,
        failure: action.failure,
        auth: undefined,
      };
    }
    case "LOGOUT_SUCCESS": {
      return {
        ...state,
        failure: undefined,
        auth: undefined,
      };
    }
    default:
      return state;
  }
}
