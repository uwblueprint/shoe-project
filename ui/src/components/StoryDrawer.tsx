import * as React from "react";
import Drawer from '@material-ui/core/Drawer';
import {
  DrawerTitleText
} from "../styles/typography";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import styled from "styled-components";

const StyledDrawer = styled(Drawer)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 64px 186px;
  width: 1083px;
  background: #FFFFFF;
`;

const StyledIconButton = styled(IconButton)`
  position: absolute;
  width: 66.77px;
  height: 60px;
  left: 0px;
  top: 0px;

  /* Red / Primary */

  background: #C42626;
`;

export enum StoryDrawerState {
  Open,
  Closed
}

interface StoryDrawerProps {
  title: string;
  description: string;
  author: string;
  date: string;
  country: string;
  content: string;
  currentCity: string;
  state: StoryDrawerState;
  setState: (newState: StoryDrawerState) => void;
}

export function StoryDrawer({ title, description, author, date, country, content, state, setState }:StoryDrawerProps) : JSX.Element {
    return(
        <StyledDrawer anchor="right" open={state == StoryDrawerState.Open} onClose={() => setState(StoryDrawerState.Closed)}>
          <StyledIconButton onClick={() =>  setState(StoryDrawerState.Closed)}>
            <ArrowForwardIcon/>
          </StyledIconButton>
          <Grid container>
            <Grid item xs={12}>
              <Typography>{title}</Typography>
            </Grid>
            <Grid item xs={6}>
              {"Origin: " + country}
              {}
            </Grid>

          </Grid>


           
        </StyledDrawer>
    )
}