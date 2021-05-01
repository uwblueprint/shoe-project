import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SWRConfig } from "swr";

import { CenteredCircularProgress } from "./components";
import { AuthProvider } from "./hooks/auth";

const Admin = React.lazy(() =>
  import("./pages").then(({ Admin }) => ({ default: Admin }))
);
const Login = React.lazy(() =>
  import("./pages").then(({ Login }) => ({ default: Login }))
);
const ShoeMap = React.lazy(() =>
  import("./pages").then(({ ShoeMap }) => ({ default: ShoeMap }))
);

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
        <React.Suspense fallback={<CenteredCircularProgress />}>
          <Router>
            <Switch>
              <Route exact path="/">
                <ShoeMap />
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route path="/admin">
                <Admin />
              </Route>
            </Switch>
          </Router>
        </React.Suspense>
      </AuthProvider>
    </SWRConfig>
  );
}

export default App;
