import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import * as React from "react";
import styled from "styled-components";

import { colors } from "../styles/colors";
import { device } from "../styles/device";

import {
  StoryDrawerAuthorText,
  StoryDrawerContentText,
  StoryDrawerCountryText,
  StoryDrawerRightText,
  StoryDrawerTitleText,
} from "../styles/typography";
import { Story } from "../types";

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paperAnchorRight{  
    width: 100%;
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

  @media ${device.mobileS} {
    margin-left: 1vh;
    margin-right: 1vh;
   }
`;

const StyledRoot = styled.div`
  padding-left: 30vh;
  padding-right: 30vh;
  padding-bottom: 10vh;


  @media ${device.laptop}  {
     padding-left: 2.5vh;
     padding-right: 2.5vh;
    }

`;
const StyledDrawerContainer = styled.div`
  position: relative;
  margin-bottom: 21px;
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
    image_url,
    year,
  } = story;

  return (
    <StyledDrawer anchor="right" open onClose={onClose}>
      <StyledIconButton onClick={onClose}>
        <ArrowForwardIcon />
      </StyledIconButton>
      <StyledRoot>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <StoryDrawerTitleText>{title}</StoryDrawerTitleText>
          </Grid>
          <Grid item xs={12}>
            <StoryDrawerCountryText>Origin: {author_country}</StoryDrawerCountryText>
            <StyledDrawerContainer>
            <StoryDrawerAuthorText>{`${author_first_name} ${author_last_name}`}</StoryDrawerAuthorText>
            <StoryDrawerRightText>
              {current_city}, Canada • {year}
            </StoryDrawerRightText>
            </StyledDrawerContainer>
          </Grid>
          
          <Grid 
          item 
          xs={12}
          justify="flex-end"
          alignContent="flex-end"
          >
            <StyledImage src={image_url} alt="Temporary Image" />
          </Grid>
          <Grid item xs={12}>
            <StoryDrawerContentText>{content}</StoryDrawerContentText>
          </Grid>
        </Grid>
      </StyledRoot>
    </StyledDrawer>
  );
}
