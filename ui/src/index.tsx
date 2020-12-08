import "./index.css";

import * as React from "react";
import * as ReactDOM from "react-dom";

import App from "./App";

// See: https://github.com/parcel-bundler/parcel/issues/3299
// @ts-ignore: hot does not exist on node module
if (module.hot) {
  // @ts-ignore: hot does not exist on node module
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  module.hot.dispose(function () {});
  // @ts-ignore: hot does not exist on node module
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  module.hot.accept(function () {});
}

const mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
