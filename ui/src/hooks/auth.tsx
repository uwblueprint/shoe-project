import * as React from "react";
import { Redirect, Route, RouteProps, useHistory, useLocation } from "react-router-dom";

interface AuthContextType {
  user: boolean;
  signin: () => void;
  signout: () => void;
}

// These auth helpers are based on: https://usehooks.com/useAuth/
const AuthContext = React.createContext({});

export function useAuth(): AuthContextType {
  return React.useContext(AuthContext) as AuthContextType;
}

export function useProvideAuth(): AuthContextType {
  const [user, setUser] = React.useState<boolean>(false);
  const history = useHistory();

  const signin = () => {
    console.log(location);
    setUser(true);
    console.log(document.cookie);
    // window.location.href = `${location.origin}/api/login`;
  };

  const signout = (redirect = "/login", state?: Record<string, string>) => {
    setUser(false);
    history.replace(redirect, state);
  };

  return {
    user,
    signin,
    signout,
  };
}

// eslint-disable-next-line react/prop-types
export const AuthProvider: React.FC = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
