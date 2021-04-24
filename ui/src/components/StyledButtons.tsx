import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import * as React from "react";
import { Link } from "react-router-dom";

import { colors } from "../styles/colors";

interface ButtonProps {
  text: string;
  onClickFunction?: () => void;
  isDisabled?: boolean;
  link_dest?: string;
  component?: Link;
  to?: string;
}

const StyledPrimaryButton = withStyles({
  root: {
    background: colors.primaryDark1,
    color: colors.white,
    boxShadow: "none",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 16,
    fontWeight: 500,
    padding: "8px 20px",
    margin: "0 10px",
    "&:hover": {
      background: colors.benjaminMoore,
      color: colors.white,
      boxShadow: "none",
    },
    "&:disabled": {
      background: colors.neutralGrey,
      color: colors.white,
    },
  },
})(Button);

export function PrimaryButton({
  text,
  onClickFunction,
  isDisabled,
  component,
  to,
}: ButtonProps): JSX.Element {
  return (
    <StyledPrimaryButton
      disableRipple
      variant="contained"
      onClick={to ? null : () => onClickFunction()}
      disabled={isDisabled}
      component={component}
      to={to}
    >
      {text}
    </StyledPrimaryButton>
  );
}

const StyledSecondaryButton = withStyles({
  root: {
    color: colors.primaryDark1,
    boxShadow: "none",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    padding: "6px 20px",
    margin: "0 10px",
    borderWidth: "2px",
    borderColor: colors.primaryDark1,
    "&:hover": {
      color: colors.benjaminMoore,
      borderColor: colors.benjaminMoore,
      boxShadow: "none",
      background: "transparent",
    },
    "&:disabled": {
      color: colors.neutralGrey,
    },
  },
})(Button);

export function SecondaryButton({
  text,
  onClickFunction,
  isDisabled,
  component,
  to,
}: ButtonProps): JSX.Element {
  return (
    <StyledSecondaryButton
      disableRipple
      variant="outlined"
      disabled={isDisabled}
      component={component}
      to={to}
      onClick={to ? null : () => onClickFunction()}
    >
      {text}
    </StyledSecondaryButton>
  );
}

const StyledTertiaryButton = withStyles({
  root: {
    color: colors.primaryDark1,
    boxShadow: "none",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 16,
    fontWeight: 600,
    padding: "8px 20px",
    margin: "0 10px",
    "&:hover": {
      color: colors.benjaminMoore,
      boxShadow: "none",
      backgroundColor: "transparent",
    },
    "&:disabled": {
      color: colors.neutralGrey,
    },
  },
})(Button);

export function TertiaryButton({
  text,
  onClickFunction,
  isDisabled,
  component,
  to,
}: ButtonProps): JSX.Element {
  return (
    <StyledTertiaryButton
      disableRipple
      disabled={isDisabled}
      component={component}
      to={to}
      onClick={to ? null : () => onClickFunction()}
    >
      {text}
    </StyledTertiaryButton>
  );
}
