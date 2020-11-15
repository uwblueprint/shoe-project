import * as React from "react";
import Drawer from '@material-ui/core/Drawer';
import {
  DrawerTitleText
} from "../styles/typography";
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import styled from "styled-components";
import ChinaFlag from "../assets/flags/China.png";
import TempShoe from "../assets/images/temp.png";
import { colors } from "../styles/colors";

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-container{
  min-width: 50vh;
  max-width: 50vh;
  background: #FFFFFF;
  }
`;

const StyledIconButton = styled(Button)`
  position: absolute;
  left: 0px;
  top: 0px;
  && {
    background-color: ${colors.secondary};
    color: ${colors.white};
    min-width: 66.77px;
    min-height: 60px;
    max-width: 66.77px;
    max-height: 60px;
    border-radius: 0px;
      &:hover {
    background-color: ${colors.secondaryDark1};
  }
  }
`;

const StyledSubheaderCountry = styled.div`
//styleName: Subtitle - Poppins Medium 16;
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 19px;
letter-spacing: 0em;
text-align: left;
`;

const StyledSubheaderAuthor = styled.div`
//styleName: Subtitle - Poppins Medium 16;
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 19px;
letter-spacing: 0em;
text-align: left;
opacity: 50%
`;

const StyledSubheaderRight = styled.div`
//styleName: Subtitle - Poppins Medium 16;
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 19px;
letter-spacing: 0em;
text-align: right;
opacity: 50%
`;


const StyledContentTypography = styled.span`
font-family: Poppins;
font-size: 16px;
font-style: normal;
font-weight: 400;
line-height: 32px;
letter-spacing: 0em;
text-align: left;
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
    <StyledDrawer anchor="right" open={state == StoryDrawerState.Open} onClose={() => setState(StoryDrawerState.Closed)}>
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
          <StyledSubheaderCountry>{"Origin: " + country}</StyledSubheaderCountry>
          <StyledSubheaderAuthor>{author}</StyledSubheaderAuthor>
        </Grid>
        <Grid item xs={6} alignItems="flex-end" alignContent="flex-end" justify="flex-end">
          <StyledSubheaderRight>{currentCity}</StyledSubheaderRight>
          <StyledSubheaderRight>{date}</StyledSubheaderRight>
        </Grid>
        <Grid item xs={12}>
          <StyledImage src={TempShoe} alt="Temporary Image" />
        </Grid>
        <Grid item xs={12}>
          <StyledContentTypography>{content}</StyledContentTypography>
        </Grid>
      </Grid>
      </StyledRoot>

    </StyledDrawer>
  )
}