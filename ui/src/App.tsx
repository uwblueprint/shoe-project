import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { SWRConfig } from "swr";

import { Admin, Login, ShoeMap } from "./pages";

const defaultFetcher = (
  input: RequestInfo,
  init?: RequestInit
): Promise<unknown> =>
  fetch(input, init)
    .then((res) => {
      console.log(res);
      if (res.redirected) {
        return { payload: "error: redirect" };
      }
      return res.json();
    })
    .then(({ payload }) => payload)
    .catch((err) => err);

function App(): JSX.Element {
  return (
    <SWRConfig
      value={{
        fetcher: defaultFetcher,
      }}
    >
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
          <Route path="/admin">
            <Admin />
          </Route>
        </Switch>
      </Router>
    </SWRConfig>
  );
}

export default App;
