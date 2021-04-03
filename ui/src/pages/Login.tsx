import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import * as React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../hooks/auth";
import { LoginMessageText, LoginTitleText } from "../styles/typography";

const CardDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: absolute;
`;

const StyledCard = styled(Card)`
  max-height: 35vh;
  max-width: 25vw;
`;

const GoogleButton = styled.div`
  text-align: center;
  margin-bottom: 5vh;
`;

const Center = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -50px;
  margin-left: -50px;
  width: 100px;
  height: 100px;
`;

export const Login: React.FC = () => {
  const { auth, googleLoaded, failure, signIn } = useAuth();

  if (!googleLoaded) {
    return (
      <Center>
        <CircularProgress />
      </Center>
    );
  }

  if (auth !== undefined) {
    return <Redirect to="/admin" />;
  }

  const title =
    failure === undefined
      ? "Welcome to the Shoe Project Admin Portal"
      : "Sorry, that is not a valid email";
  const description =
    failure === undefined
      ? "Please Sign In using your Shoe Project Email"
      : "Make sure you are using a Shoe Project Organization Email";

  return (
    <CardDiv>
      <StyledCard variant="outlined">
        <CardContent>
          <LoginTitleText>{title}</LoginTitleText>
          <LoginMessageText>{description}</LoginMessageText>
        </CardContent>
        <GoogleButton>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={signIn}
          >
            Sign In with Google
          </Button>
        </GoogleButton>
      </StyledCard>
    </CardDiv>
  );
};
