// import { CircularProgress } from "@material-ui/core";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { useAuth } from "../../hooks/auth";
import { Upload } from "./Upload";

export const Admin: React.FC = () => {
  const auth = useAuth();
  console.log(document.cookie);

  if (!auth.user) {
    return <Redirect to="/login" />
  }

  return (
    <Switch>
      <Route exact path="/admin">
        INDEX!
      </Route>
      <Route path="/admin/upload">
        <Upload />
      </Route>
    </Switch>
  );
};
