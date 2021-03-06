import { CircularProgress } from "@material-ui/core";
import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../../hooks/auth";
import { AllStories } from "./AllStories";
import { Edit } from "./Edit/index";
import { UploadSuccess } from "./Edit/UploadSuccess";
import { Upload } from "./Upload";

const Center = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 100px;
  height: 100px;
`;

export const Admin: React.FC = () => {
  const { auth, googleLoaded } = useAuth();

  if (!googleLoaded) {
    return (
      <Center>
        <CircularProgress />
      </Center>
    );
  }

  if (auth === undefined) {
    return <Redirect to="/login" />;
  }

  return (
    <Switch>
      <Route exact path="/admin">
        <Redirect to="/admin/allstories" />
      </Route>
      <Route path="/admin/upload">
        <Upload />
      </Route>
      <Route path="/admin/upload-success">
        <UploadSuccess />
      </Route>
      <Route path="/admin/edit/:id">
        <Edit />
      </Route>
      <Route path="/admin/allstories">
        <AllStories />
      </Route>
    </Switch>
  );
};
