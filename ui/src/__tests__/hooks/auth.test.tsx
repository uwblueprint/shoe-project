import { renderHook } from '@testing-library/react-hooks'
import { GoogleLoginResponse } from "react-google-login";

import { useProvideAuth } from "../../hooks/auth";
import {
  Action,
  FailureState,
  INIT_STATE,
  reducer,
} from "../../hooks/auth/reducer";

const mockSignOut = jest.fn();
const mockSignIn = jest.fn();

const mockUseGoogleLogin = jest.fn().mockReturnValue({ signIn: mockSignIn, loaded: true });
const mockUseGoogleLogout = jest.fn().mockReturnValue({ signOut: mockSignOut, loaded: true });

jest.mock("react-google-login", () => ({
  useGoogleLogin: (...args: unknown[]) => mockUseGoogleLogin(...args),
  useGoogleLogout: (...args: unknown[]) => mockUseGoogleLogout(...args),
}));

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

  describe("useProvideAuth()", () => {
    beforeEach(() => {
      mockUseGoogleLogin.mockClear();
      mockUseGoogleLogout.mockClear();
    });

    it("calls useGoogleLogout()", () => {
    expect(mockUseGoogleLogout).toHaveBeenCalledTimes(0);
      renderHook(() => useProvideAuth());
      expect(mockUseGoogleLogout).toHaveBeenCalledTimes(1);
      expect(mockUseGoogleLogout).toHaveBeenCalledWith({
        clientId: expect.any(String),
        onFailure: expect.any(Function),
        onLogoutSuccess: expect.any(Function),
      });
    });

    it("calls useGoogleLogin()", () => {
      expect(mockUseGoogleLogin).toHaveBeenCalledTimes(0);
        renderHook(() => useProvideAuth());
        expect(mockUseGoogleLogin).toHaveBeenCalledTimes(1);
        expect(mockUseGoogleLogin).toHaveBeenCalledWith({
          clientId: expect.any(String),
          isSignedIn: true,
          onFailure: expect.any(Function),
          onSuccess: expect.any(Function),
          prompt: "consent",
        });
      });

      describe("return value", () => {
        beforeEach(() => {
          mockSignIn.mockClear();
          mockSignOut.mockClear();
        })

        it("matches expected values", () => {
          const {result} = renderHook(() => useProvideAuth());

          expect(result.current).toEqual({
            ...INIT_STATE,
            googleLoaded: true,
            signIn: mockSignIn,
            signOut: mockSignOut,
          })
        });

        it("calls signIn", () => {
          const {result} = renderHook(() => useProvideAuth());

          expect(mockSignIn).toHaveBeenCalledTimes(0);
          result.current.signIn();
          expect(mockSignIn).toHaveBeenCalledTimes(1);
        });

        it("calls signOut", () => {
          const {result} = renderHook(() => useProvideAuth());

          expect(mockSignOut).toHaveBeenCalledTimes(0);
          result.current.signOut();
          expect(mockSignOut).toHaveBeenCalledTimes(1);
        });        
      })
  })
});
