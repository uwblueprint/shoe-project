import * as React from "react";
import { Redirect } from "react-router-dom";

import { useAuth } from "../hooks/auth";

export const Login: React.FC = () => {
  const auth = useAuth();

  if (auth.user) {
    return <Redirect to="/admin" />;
  }

  return null;
};
