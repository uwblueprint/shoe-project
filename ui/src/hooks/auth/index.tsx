import * as React from "react";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
  useGoogleLogout,
} from "react-google-login";

import { FailureState, INIT_STATE, reducer, State } from "./reducer";

export { FailureState } from "./reducer";

const CLIENT_ID =
  "722954318269-211qsag71c3bsfjik321h9sa0kmbnelf.apps.googleusercontent.com";

type AuthContextType = State & {
  googleLoaded: boolean;
  signIn: () => void;
  signOut: () => void;
};

// These auth helpers are based on: https://usehooks.com/useAuth/
const AuthContext = React.createContext({});

export function useAuth(): AuthContextType {
  return React.useContext(AuthContext) as AuthContextType;
}

export function useProvideAuth(): AuthContextType {
  const [state, dispatch] = React.useReducer(reducer, INIT_STATE);

  const handleLogoutSuccess = () => {
    dispatch({ type: "LOGOUT_SUCCESS" });
  };

  const { signOut, loaded: signOutLoaded } = useGoogleLogout({
    onLogoutSuccess: handleLogoutSuccess,
    clientId: CLIENT_ID,
  });

  const handleSuccess = (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const response = res as GoogleLoginResponse;
    dispatch({ type: "START_LOADING" });
    fetch("api/login", {
      method: "POST",
      headers: { Authorization: response.tokenId },
    })
      .then((res) => {
        if (res.ok) {
          dispatch({ type: "SUCCESS", response });
        } else {
          if (signOutLoaded) {
            signOut()
          }
          dispatch({ type: "FAILURE", failure: FailureState.InvalidEmail });
        }
      })
      .catch(() => {
        if (signOutLoaded) {
          signOut()
        }
        dispatch({ type: "FAILURE", failure: FailureState.Unknown });
      });
  };

  function handleFailure() {
    dispatch({ type: "FAILURE", failure: FailureState.PopupFail });
  }

  const { signIn, loaded } = useGoogleLogin({
    onSuccess: handleSuccess,
    onFailure: handleFailure,
    clientId: CLIENT_ID,
    isSignedIn: true,
  });

  return {
    ...state,
    googleLoaded: loaded && signOutLoaded,
    signIn,
    signOut,
  };
}

export const AuthProvider: React.FC = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
