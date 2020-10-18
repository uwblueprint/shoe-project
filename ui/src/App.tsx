import * as React from "react";
import { SWRConfig } from "swr";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { Home, ShoeMap } from "./pages";

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
        dedupingInterval: 0,
      }}
    >
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/map">ShoeMap</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/map">
            <ShoeMap />
          </Route>
        </Switch>
      </Router>
    </SWRConfig>
  );
}

export default App;
