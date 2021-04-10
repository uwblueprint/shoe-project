import { GoogleLoginResponse } from "react-google-login";

import {
  Action,
  FailureState,
  INIT_STATE,
  reducer,
} from "../../hooks/auth/reducer";

// TODO: Write tests for react-google-login hooks (too lazy to mock out rn)
describe("auth", () => {
  describe("reducer", () => {
    it("starts loading", () => {
      const action: Action = { type: "START_LOADING" };

      expect(INIT_STATE.loading).toBe(false);
      const newState = reducer(INIT_STATE, action);
      expect(newState.loading).toBe(true);
    });

    it("sets a response on success", () => {
      const mock_res = { tokenId: "123" } as GoogleLoginResponse;
      const action: Action = { type: "SUCCESS", response: mock_res };

      expect(INIT_STATE.auth).toBe(undefined);
      const newState = reducer(INIT_STATE, action);
      expect(newState.auth).toBe(mock_res);
    });

    it("sets failure on failure", () => {
      const action: Action = {
        type: "FAILURE",
        failure: FailureState.InvalidEmail,
      };

      expect(INIT_STATE.failure).toBe(undefined);
      const newState = reducer(INIT_STATE, action);
      expect(newState.failure).toBe(FailureState.InvalidEmail);
    });
  });
});
