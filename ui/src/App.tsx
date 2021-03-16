import * as React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { SWRConfig } from "swr";

import { AuthProvider, useAuth } from "./hooks/auth";
import { Admin, Login, ShoeMap } from "./pages";

function App(): JSX.Element {
  const auth = useAuth();

  const defaultFetcher = (
    input: RequestInfo,
    init?: RequestInit
  ): Promise<unknown> =>
    fetch(input, init)
      .then((res) => {
        console.log(res);
        if (res.redirected) {
          auth.signout();
          return { payload: "error: redirect" };
        }
        return res.json();
      })
      .then(({ payload }) => payload)
      .catch((err) => err);

  return (
    <SWRConfig
      value={{
        fetcher: defaultFetcher,
      }}
    >
      <Router>
        <AuthProvider>
          <Switch>
            <Route exact path="/">
              <ShoeMap />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/unauthorized">
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location },
                }}
              />
            </Route>
            <Route path="/admin">
              <Admin />
            </Route>
          </Switch>
        </AuthProvider>
      </Router>
    </SWRConfig>
  );
}

export default App;
