import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import * as React from "react";
import styled from "styled-components";

import ChinaFlag from "../assets/flags/China.png";
import TempShoe from "../assets/images/temp.png";
import { colors } from "../styles/colors";
import {
  DrawerAuthorText,
  DrawerContentText,
  DrawerCountryText,
  DrawerRightText,
  DrawerTitleText,
} from "../styles/typography";
import { Story } from "../types";

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
  padding-bottom: 10vh;
`;

const StyledFlagImage = styled.img`
  border-radius: 5px;
  width: 100%;
`;

interface StoryDrawerProps {
  story?: Story;
  onClose: () => void;
}

export function StoryDrawer({ story, onClose }: StoryDrawerProps): JSX.Element {
  if (story === undefined) {
    return null;
  }

  const {
    title,
    author_first_name,
    author_last_name,
    author_country,
    current_city,
    content,
    /* TODO: update date */
    CreatedAt: date,
  } = story;

  return (
    <Drawer anchor="right" open onClose={onClose}>
      <StyledIconButton onClick={onClose}>
        <ArrowForwardIcon />
      </StyledIconButton>
      <StyledRoot>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <DrawerTitleText>{title}</DrawerTitleText>
          </Grid>
          <Grid item xs={1}>
            <StyledFlagImage alt="flag" src={ChinaFlag} />
          </Grid>
          <Grid item xs={5}>
            <DrawerCountryText>{`Origin: ${author_country}`}</DrawerCountryText>
            <DrawerAuthorText>{`${author_first_name} ${author_last_name}`}</DrawerAuthorText>
          </Grid>
          <Grid
            item
            xs={6}
            alignItems="flex-end"
            alignContent="flex-end"
            justify="flex-end"
          >
            <DrawerRightText>{current_city}, Canada</DrawerRightText>
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
  );
}
