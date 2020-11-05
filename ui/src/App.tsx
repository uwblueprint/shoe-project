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
      }}
    >
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Map</Link>
            </li>
            <li>
              <Link to="/home">Home</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
            <ShoeMap />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
        </Switch>
      </Router>
    </SWRConfig>
  );
}

export default App;
