import Chip from "@material-ui/core/Chip";
import * as React from "react";
import styled from "styled-components";

import { colors } from "../styles/colors";

const StyledChip = styled(Chip)`
  background-color: ${colors.primaryLight3} !important;
  color: ${colors.primaryDark2} !important;
  .MuiChip-deleteIcon {
    color: ${colors.primaryDark3};
  }
`;

export function FilterChip(props: unknown): JSX.Element {
  return <StyledChip {...props} />;
}
