import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SWRConfig } from "swr";

import { AuthProvider, PrivateRoute } from "./hooks/auth";
import { Admin, Login, ShoeMap, Upload } from "./pages";

const defaultFetcher = (
  input: RequestInfo,
  init?: RequestInit
): Promise<unknown> =>
  fetch(input, init)
    .then((res) => res.json())
    .then(({ payload }) => payload);

function App(): JSX.Element {
  return (
    <SWRConfig
      value={{
        fetcher: defaultFetcher,
      }}
    >
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/">
              <ShoeMap />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/upload">
              <Upload />
            </Route>
            <PrivateRoute path="/admin">
              <Admin />
            </PrivateRoute>
          </Switch>
        </Router>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
