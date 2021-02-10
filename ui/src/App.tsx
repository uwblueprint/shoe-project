import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SWRConfig } from "swr";

import { AuthProvider, PrivateRoute } from "./hooks/auth";
import { Admin, Login, ShoeMap } from "./pages";

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
            <Route exact path="/login">
              <Login login />
            </Route>
            <Route exact path="/unauthorized">
              <Login login={false} />
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
