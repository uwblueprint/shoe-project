import { CircularProgress } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";

const Center = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 100px;
  height: 100px;
`;

export const CenteredCircularProgress = (): JSX.Element => (
  <Center>
    <CircularProgress />
  </Center>
);
