import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import * as React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import ShoeLogo from "../assets/images/shoeproject-logo.svg";
import PeopleWalking from "../assets/images/walking-people.svg";
import { FailureState, useAuth } from "../hooks/auth";
import { colors } from "../styles/index";
import {
  LoginHeader,
  LoginMessageText,
  LoginTitleText,
} from "../styles/typography";

const PeopleFooter = styled.img`
  z-index: 1;
  margin: 60vh 0 0 15vw;
`;

const StyledLogo = styled.div`
  background-image: url(${ShoeLogo});
  height: 129px;
  margin: auto;
  width: 127px;
  background-repeat: no-repeat;
  margin-bottom: 16.62px;
`;

const CardDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100vw;
  position: absolute;
  z-index: 0;
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
  max-height: 35vh;
  max-width: 25vw;

  && .MuiCardContent-root {
    border: 2px solid ${colors.primary};
    border-radius: 10px;
    z-index: -1;
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
    &:hover{
      background-color: ${colors.primaryDark3};
    }
`;

const CenterIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -50px 0 0 -50px;
  width: 100px;
  height: 100px;
`;

export const Login: React.FC = () => {
  const { auth, googleLoaded, failure, signIn } = useAuth();

  if (!googleLoaded) {
    return (
      <>
        <CenterIcon>
          <CircularProgress />
        </CenterIcon>
        <CenterText>
          <LoginTitleText>
            Please make sure cookies are enabled on this site
          </LoginTitleText>
          <LoginMessageText>
            (Check the toolbar at the top of the page!)
          </LoginMessageText>
        </CenterText>
      </>
    );
  }

  if (auth !== undefined) {
    return <Redirect to="/admin" />;
  }

  const title =
    failure !== FailureState.InvalidEmail ? "Welcome back!" : "Invalid Sign In";
  const description =
    failure !== FailureState.InvalidEmail
      ? "Please Sign In using your Shoe Project Email. If you are having trouble signing in, make sure third-party cookies are enabled for this site."
      : "Please make sure you are using a Shoe Project Organizational Email.";

  return (
    <>
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
    </>
  );
};
