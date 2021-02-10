import * as React from "react";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import styled, { css } from "styled-components";
import { useAuth } from "../hooks/auth";

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

const TitleText = styled.p`
  font-size: 20px;
  line-height: 30px;
  text-align: center;
`;

const MessageText = styled.p`
  font-size: 13px;
  text-align: center;
`;

const GoogleButton = styled.div`
  text-align: center;
  margin-bottom: 5vh;
`;

export const Login: React.FC<{ login: boolean }> = ({ login }) => {
  const auth = useAuth();

  const title = login
    ? "Welcome to the Shoe Project Admin Portal"
    : "Sorry, that is not a valid email";
  const description = login
    ? "Please Sign In using your Shoe Project Email"
    : "Make sure you are using a Shoe Project Organization Email";

  if (auth.user) {
    return <Redirect to="/admin" />;
  }

  return (
    <CardDiv>
      <StyledCard variant="outlined">
        <CardContent>
          <TitleText>{title}</TitleText>
          <MessageText>{description}</MessageText>
        </CardContent>
        <GoogleButton>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={auth.signin}
          >
            Sign In with Google
          </Button>
        </GoogleButton>
      </StyledCard>
    </CardDiv>
  );
};
