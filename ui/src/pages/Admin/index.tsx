import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { CenteredCircularProgress } from "../../components/CenteredCircularProgress";
import { useAuth } from "../../hooks/auth";

const AllStories = React.lazy(() =>
  import("./AllStories").then(({ AllStories }) => ({ default: AllStories }))
);
const Upload = React.lazy(() =>
  import("./Upload").then(({ Upload }) => ({ default: Upload }))
);
const UploadSuccess = React.lazy(() =>
  import("./Edit/UploadSuccess").then(({ UploadSuccess }) => ({
    default: UploadSuccess,
  }))
);
const Edit = React.lazy(() =>
  import("./Edit").then(({ Edit }) => ({ default: Edit }))
);

export const Admin: React.FC = () => {
  const { auth, googleLoaded } = useAuth();

  if (!googleLoaded) {
    return <CenteredCircularProgress />;
  }

  if (auth === undefined) {
    return <Redirect to="/login" />;
  }

  return (
    <React.Suspense fallback={<CenteredCircularProgress />}>
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
    </React.Suspense>
  );
};
