import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

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

interface LoginProps {
  login: boolean;
}

export const Login: React.FC<LoginProps> = (props: LoginProps) => {
  const [loading, setLoading] = React.useState(true);
  const history = useHistory();
  React.useLayoutEffect(() => {
    fetch("/api/check_auth")
      .then((res) => {
        if (!res.redirected) {
          history.replace("/admin");
        } else {
          setLoading(false);
        }
      })
      .catch((_) => {
        setLoading(false);
      });
  }, [setLoading, history]);

  if (loading) {
    return <CircularProgress />;
  }

  function handleOnClick() {
    window.location.href = `${window.location.origin}/api/login`;
  }

  const title = props.login
    ? "Welcome to the Shoe Project Admin Portal"
    : "Sorry, that is not a valid email";
  const description = props.login
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
            onClick={handleOnClick}
          >
            Sign In with Google
          </Button>
        </GoogleButton>
      </StyledCard>
    </CardDiv>
  );
};
