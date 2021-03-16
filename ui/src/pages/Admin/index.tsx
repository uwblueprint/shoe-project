import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import { AllStories } from "./AllStories";
import { Upload } from "./Upload";

export const Admin: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();
  React.useLayoutEffect(() => {
    fetch("/api/check_auth")
      .then((res) => {
        if (res.redirected) {
          history.replace("/login");
        } else {
          setLoading(false);
        }
      })
      .catch((_) => {
        setLoading(false);
      });
  }, [setLoading, history]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Switch>
      <Route exact path="/admin">
        <Redirect to="/admin/allstories" />
      </Route>
      <Route path="/admin/upload">
        <Upload />
      </Route>
      <Route path="/admin/allstories">
        <AllStories />
      </Route>
    </Switch>
  );
};
