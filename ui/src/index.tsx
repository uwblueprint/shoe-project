import * as React from 'react';
import * as ReactDOM from "react-dom";

import App from './App';

// See: https://github.com/parcel-bundler/parcel/issues/3299
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.dispose(function() {})
  // @ts-ignore
  module.hot.accept(function() {})
}

const mountNode = document.getElementById("app");
ReactDOM.render(<App name="Abhijeet" />, mountNode);
