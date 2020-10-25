import * as React from "react";
import { SWRConfig } from "swr";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Home, ShoeMap } from "./pages";
import {Filter} from './components/Filter';

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
