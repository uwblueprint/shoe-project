import * as React from "react";
import {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
  useGoogleLogin,
  useGoogleLogout,
} from "react-google-login";

const CLIENT_ID =
  "722954318269-211qsag71c3bsfjik321h9sa0kmbnelf.apps.googleusercontent.com";

type State = {
  loading: boolean;
  auth?: GoogleLoginResponse;
  failure?: unknown;
};

type Action =
  | { type: "START_LOADING" }
  | {
      type: "SUCCESS";
      response: GoogleLoginResponse;
    }
  | { type: "FAILURE"; response: unknown }
  | { type: "LOGOUT_SUCCESS" }
  | { type: "LOGOUT_FAILURE" };

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

const INIT_STATE: State = Object.freeze({
  loading: false,
  auth: undefined,
  failure: undefined,
});

function reducer(state: State, action: Action): State {
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
        failure: action.response,
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

export function useProvideAuth(): AuthContextType {
  const [state, dispatch] = React.useReducer(reducer, INIT_STATE);

  const handleSuccess = async (
    res: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    const response = res as GoogleLoginResponse;
    dispatch({ type: "START_LOADING" });
    fetch("api/login", {
      method: "POST",
      headers: { Authorization: response.tokenId },
    }).then((res) => {
      if (res.ok) {
        dispatch({ type: "SUCCESS", response });
      } else {
        dispatch({ type: "FAILURE", response });
      }
    }).catch(() => {
      dispatch({ type: "FAILURE", response });
    });
  };

  const handleFailure = (response?: unknown) => {
    dispatch({ type: "FAILURE", response });
  };

  const handleLogoutSuccess = () => {
    dispatch({ type: "LOGOUT_SUCCESS" });
  };

  const { signIn, loaded } = useGoogleLogin({
    onSuccess: handleSuccess,
    onFailure: handleFailure,
    clientId: CLIENT_ID,
    isSignedIn: true,
  });

  const { signOut } = useGoogleLogout({
    onLogoutSuccess: handleLogoutSuccess,
    clientId: CLIENT_ID,
  });

  return {
    ...state,
    googleLoaded: loaded,
    signIn,
    signOut,
  };
}

export const AuthProvider: React.FC = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
