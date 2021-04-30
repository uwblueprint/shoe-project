import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import ShoeLogo from "../assets/images/shoeproject-logo.svg";
import PeopleWalking from "../assets/images/walking-people.svg";
import { CenteredCircularProgress } from "../components";
import { FailureState, useAuth } from "../hooks/auth";
import { colors } from "../styles/index";
import {
  LoginHeader,
  LoginMessageText,
  LoginTitleText,
} from "../styles/typography";
const SHOE_PROJECT_URL = "https://theshoeproject.online/our-stories";

const PeopleFooter = styled.img`
  z-index: 2;
  margin: 53vh 0 5vh 0;
`;

const StyledLogo = styled.div`
  background-image: url(${ShoeLogo});
  height: 129px;
  margin: auto;
  width: 127px;
  background-repeat: no-repeat;
  margin-bottom: 16.62px;
`;

const StyledTinyLogo = styled.div`
  background-image: url(${ShoeLogo});
  background-size: 39px;
  width: 39px;
  height: 39.65px;
  cursor: pointer;
  flex-grow: 1;
`;

const CardDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

export const CenterText = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 10px 0 0 -275px;
  width: 500px;
  height: 100px;
`;

const StyledCard = styled(Card)`
  max-width: 25vw;

  && .MuiCardContent-root {
    border: 2px solid ${colors.primary};
    border-radius: 10px;
    background: ${colors.white};
  }

  &&.MuiPaper-outlined {
    border: none;
  }

  &.MuiCard-root {
    overflow: visible;
  }
`;

const Container = styled.div`
  text-align: center;
  margin: 40px 0 32px 0;
`;

const GoogleButton = styled(Button)`
  && {
    box-shadow: none;
    background-color: ${colors.primaryDark1};
    &:active {
      background-color: ${colors.primaryDark2};
    }
    &:hover {
      background-color: ${colors.primaryDark3};
    }
    position: relative;
    z-index: 3;
  }
`;

const useStyles = makeStyles({
  root: {
    backgroundColor: colors.primaryLight6,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  appBar: {
    width: "100%",
    backgroundColor: colors.white,
    background: colors.white,
    boxSizing: "border-box",
    paddingLeft: "54px",
    height: "56px",
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
    zIndex: 2,
    top: 0,
  },
});

export const Login: React.FC = () => {
  const { auth, googleLoaded, failure, signIn } = useAuth();
  const classes = useStyles();

  if (auth !== undefined) {
    return <Redirect to="/admin" />;
  }

  const loginAppBar = (
    <div className={classes.appBar}>
      <AppBar position="static">
        <Toolbar>
          <a href={SHOE_PROJECT_URL} target="_blank" rel="noreferrer">
            <StyledTinyLogo role="img" alt="Link to the Shoe Project site" />
          </a>
        </Toolbar>
      </AppBar>
    </div>
  )

  if (!googleLoaded) {
    return (
      <div className={classes.root}>
        {loginAppBar}
        <CenteredCircularProgress />
        <CenterText>
          <LoginTitleText>
            Please make sure cookies are enabled on this site
          </LoginTitleText>
          <LoginMessageText>
            (Check the toolbar at the top of the page!)
          </LoginMessageText>
        </CenterText>
      </div>
    );
  }

  const title =
    failure !== FailureState.InvalidEmail ? "Welcome back!" : "Invalid Sign In";
  const description =
    failure !== FailureState.InvalidEmail
      ? "Please Sign In using your Shoe Project Email. If you are having trouble signing in, make sure third-party cookies are enabled for this site."
      : "Please make sure you are using a Shoe Project Organizational Email.";

  return (
    <div className={classes.root}>
      {loginAppBar}
      <CardDiv>
        <StyledCard variant="outlined">
          <CardContent>
            <StyledLogo></StyledLogo>
            <LoginHeader>The Shoe Project Admin Portal</LoginHeader>
            <LoginTitleText>{title}</LoginTitleText>
            <LoginMessageText>{description}</LoginMessageText>
            <LoginMessageText></LoginMessageText>
            <Container>
              <GoogleButton
                size="large"
                color="primary"
                variant="contained"
                onClick={signIn}
              >
                Sign In with Google
              </GoogleButton>
            </Container>
          </CardContent>
        </StyledCard>
      </CardDiv>
      <PeopleFooter src={PeopleWalking}></PeopleFooter>
    </div>
  );
};
