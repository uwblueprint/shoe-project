import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { User } from "../types";

interface AuthContextType {
  user: User | null;
  signin: () => void;
  signout: () => void;
}

// These auth helpers are based on: https://usehooks.com/useAuth/
const AuthContext = React.createContext({});

export function useAuth(): AuthContextType {
  return React.useContext(AuthContext) as AuthContextType;
}

export function useProvideAuth(): AuthContextType {
  const [user, setUser] = React.useState<User | null>(null);

  // TODO: Write signin function
  const signin = () => {
    setUser({ email: "abhijeet@uwblueprint.org" });
  };

  // TODO: Write signout function
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const signout = () => {};

  return {
    user,
    signin,
    signout,
  };
}

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
// eslint-disable-next-line react/prop-types
export const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

// eslint-disable-next-line react/prop-types
export const AuthProvider: React.FC = ({ children }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
