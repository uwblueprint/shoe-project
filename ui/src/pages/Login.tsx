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

const StyledCard = styled(Card)`
  align-self: center;
  max-width: 10vw;
  max-height: 30vh;
  /* display: flex;
  justify-content: center;
  align-items: center; */
`;
const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginTop: 10,
  },
});

export const Login: React.FC = () => {
  const auth = useAuth();
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  if (auth.user) {
    return <Redirect to="/admin" />;
  }

  return (
    <StyledCard className={classes.root} variant="outlined">
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Word of the Day
        </Typography>
        <Typography variant="h5" component="h2">
          Welcome to the Shoe Project Admin Portal
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          adjective
        </Typography>
        <Typography variant="body2" component="p">
          Hel
          <br />
          {'"HEHEHEH"'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </StyledCard>
  );
};
