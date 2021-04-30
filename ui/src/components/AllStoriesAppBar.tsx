import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";

const SHOE_PROJECT_URL = "https://theshoeproject.online/our-stories";
import { Link } from "react-router-dom";
import styled from "styled-components";

import ShoeLogo from "../assets/images/shoeproject-logo.svg";
import { colors } from "../styles/colors";
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from "./StyledButtons";

const StyledLogo = styled.div`
  background-image: url(${ShoeLogo});
  background-size: 39px;
  width: 39px;
  height: 39.65px;
  cursor: pointer;
  flex-grow: 1;
`;

const useStyles = makeStyles({
  root: {
    backgroundColor: colors.white,
    background: colors.white,
    paddingLeft: "54px",
    "& .MuiAppBar-colorPrimary": {
      backgroundColor: colors.white,
    },
    "& .MuiPaper-elevation4": {
      boxShadow: "none",
    },
    "& .MuiToolbar-gutters": {
      paddingLeft: "0px",
    },
    "& .MuiToolbar-regular": {
      minHeight: "56px",
    },
  },
  title: {
    flexGrow: 1,
  },
  buttons: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
export interface AppBarProps {
  isPublishDisabled: boolean;
  handlePublishMap: () => void;
  handleLogout: () => void;
}

export default function AllStoriesAppBar({
  isPublishDisabled,
  handlePublishMap,
  handleLogout,
}: AppBarProps): JSX.Element {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <a href={SHOE_PROJECT_URL} target="_blank" rel="noreferrer">
            <StyledLogo />
          </a>
          <div className={classes.buttons}>
            <SecondaryButton
              text={"VIEW MAP"}
              isDisabled={false}
              component={Link}
              to="/"
            />
            <PrimaryButton
              text={"PUBLISH MAP"}
              onClickFunction={handlePublishMap}
              isDisabled={isPublishDisabled}
            />
            <TertiaryButton text={"LOGOUT"} onClickFunction={handleLogout} />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
