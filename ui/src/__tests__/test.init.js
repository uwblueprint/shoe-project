import "babel-polyfill";

import { cache } from "swr";

afterEach(() => {
  cache.clear();
});
