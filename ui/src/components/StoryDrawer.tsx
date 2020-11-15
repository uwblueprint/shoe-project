import * as React from "react";
import Drawer from '@material-ui/core/Drawer';
import {
  DrawerAuthorText,
  DrawerContentText,
  DrawerCountryText,
  DrawerRightText,
  DrawerTitleText
} from "../styles/typography";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import styled from "styled-components";
import ChinaFlag from "../assets/flags/China.png";
import TempShoe from "../assets/images/temp.png";
import { colors } from "../styles/colors"

const StyledIconButton = styled(Button)`
  position: absolute;
  left: 0px;
  top: 0px;
  && {
    background-color: ${colors.secondary};
    color: ${colors.white};
    min-width: 66.77px;
    min-height: 60px;
    width: 66.77px;
    height: 60px;
    border-radius: 0px;
    &:hover {
      background-color: ${colors.secondaryDark1};
    }
  }
`;

const StyledImage = styled.img`
border-radius: 0px;
width: 100%;
`;

const StyledRoot = styled.div`
width: 100vh;
padding-left: 30vh;
padding-right: 30vh;
`;

const StyledFlagImage = styled.img`
  border-radius: 10px;
  width: 100%;
`;

export enum StoryDrawerState {
  Open,
  Closed
}

interface StoryDrawerProps {
  title: string;
  author: string;
  date: string;
  country: string;
  content: string;
  currentCity: string;
  state: StoryDrawerState;
  setState: (newState: StoryDrawerState) => void;
}

export function StoryDrawer({ title, author, date, country, currentCity, content, state, setState }: StoryDrawerProps): JSX.Element {
  return (
    <Drawer anchor="right" open={state == StoryDrawerState.Open} onClose={() => setState(StoryDrawerState.Closed)}>
      <StyledIconButton onClick={() => setState(StoryDrawerState.Closed)}>
        <ArrowForwardIcon />
      </StyledIconButton>
      <StyledRoot>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <DrawerTitleText>{title}</DrawerTitleText>
        </Grid>
        <Grid item xs={2}>
          <StyledFlagImage alt="flag" src={ChinaFlag}/>
        </Grid>
        <Grid item xs={4}>
          <DrawerCountryText>{"Origin: " + country}</DrawerCountryText>
          <DrawerAuthorText>{author}</DrawerAuthorText>
        </Grid>
        <Grid item xs={6} alignItems="flex-end" alignContent="flex-end" justify="flex-end">
          <DrawerRightText>{currentCity}</DrawerRightText>
          <DrawerRightText>{date}</DrawerRightText>
        </Grid>
        <Grid item xs={12}>
          <StyledImage src={TempShoe} alt="Temporary Image" />
        </Grid>
        <Grid item xs={12}>
          <DrawerContentText>{content}</DrawerContentText>
        </Grid>
      </Grid>
      </StyledRoot>
    </Drawer>
  )
}