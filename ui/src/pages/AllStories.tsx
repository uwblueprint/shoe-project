import { Grid } from "@material-ui/core/";
import * as React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { colors } from "../styles/colors";
import { device } from "../styles/device";
import { Story } from "../types";

const StyledGrid = styled(Grid)`
  background-color: ${colors.primaryLight6};
  @media ${device.laptop} {
    justify: left;
    width: 100vw;
  }
`;

export const AllStories: React.FC = () => {
  const { data, error } = useSWR<Story[]>("/api/stories");

  if (error) return <div>Error returning stories data!</div>;
  if (!data) return <div>loading...</div>;

  return (
    <StyledGrid container justify="center" alignContent="center">
      <div>{data[0].title}</div>
    </StyledGrid>
  );
};
