import * as React from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const SHOE_PROJECT_URL = "https://theshoeproject.online/our-stories";
import ShoeLogo from "../assets/images/shoeproject-logo.svg";
import styled, { css } from "styled-components";
import { colors } from "../styles/colors";
import { FormHelperText } from "@material-ui/core";

import {Link} from "react-router-dom";



const StyledLogo = styled.div`
  background-image: url(${ShoeLogo});
  background-size: 60px;
  width: 60px; //height and width must equal background-size or else you'll have clones
  height: 60px;
  cursor: pointer;
  flex-grow: 1;
`;

const useStyles = makeStyles({
    root: {
        // flexGrow: 1,
        backgroundColor: colors.white,
        background: colors.white,
        // display: "flex",
        // flexDirection: "row"
        // paddingLeft: 64
        "& .MuiAppBar-colorPrimary": {
            backgroundColor: colors.white
        },
        "& .MuiPaper-elevation4": {
            boxShadow: "none"
        }

    },
    title: {
        flexGrow: 1,
    },
    button: {
        // justifyContent: "flex-end",
        float: "right",
        color: colors.primaryDark1
    }
  },
);
 
export default function AllStoriesAppBar(props) {
  const classes = useStyles();

  console.log(props.publishMapDisabled);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
            <a href={SHOE_PROJECT_URL} target="_blank" rel="noreferrer">
              <StyledLogo />
            </a>
            <Button className={classes.button} component={Link} to="/">VIEW MAP</Button>
            <Button className={classes.button} onClick={() => {
                console.log(props); 
                try {
                  props.handlePublishMap();
                } catch (e) {
                  console.log(e);
                }
                console.log("BUTTON PRESSED"); 
              }
            } disabled={props.publishMapDisabled}>PUBLISH MAP</Button>
            <Button className={classes.button} onClick={() => props.handleLogout}>LOGOUT</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
