import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import * as React from "react";
import styled from "styled-components";

import { TutorialState } from "../components/WelcomeTutorial";
import { colors } from "../styles/colors";
import { device } from "../styles/device";
import {
  HelpDrawerBoxText,
  HelpDrawerLaunchButtonText,
  HelpDrawerTitleText,
} from "../styles/typography";
import { HelpAccordion } from "./HelpAccordion";

const StyledRoot = styled.div`
  width: 25vw;
  height: 100vh;
  margin: 24px;
  position: relative;

  @media ${device.laptop} {
    width: 95vw;
    height: 100vh;
  }
`;

const ScrollArea = styled.div`
  height: 78vh;
  overflow-y: scroll;
`;

const StyledBox = styled.div`
  border: 1.5px solid ${colors.primary};
  background: ${colors.primaryLight4};
  border-radius: 10px;
  margin: 12px 0px;
  padding: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  padding: 0;
  color: ${colors.primaryDark1};

  &:hover {
    opacity: 70%;
    cursor: pointer;
  }

  &:focus {
    outline: 0;
    border-radius: 50%;
    background-color: ${colors.neutral};
    cursor: pointer;
  }
`;

const LaunchButton = styled.button`
  width: 100%;
  height: 48px;
  margin: 24px 24px 0 24px;
  border-radius: 5px;
  border: none;
  background-color: ${colors.primaryLight4};
  cursor: pointer;
  z-index: 100;
  position: absolute;
  bottom: 0;

  &:hover {
    cursor: pointer;
    background-color: ${colors.primaryLight3};
  }

  &:focus {
    cursor: pointer;
    background-color: ${colors.primaryLight2};
  }
`;

export enum HelpDrawerState {
  Open,
  Closed,
}

interface HelpDrawerProps {
  state: HelpDrawerState;
  setIsHelpDrawerOpen: (newState: HelpDrawerState) => void;
  setIsTutorialOpen: (newState: TutorialState) => void;
}

export function HelpDrawer({
  state,
  setIsHelpDrawerOpen,
  setIsTutorialOpen,
}: HelpDrawerProps): JSX.Element {
  const handleLaunchTour = () => {
    setIsTutorialOpen(TutorialState.First);
    setIsHelpDrawerOpen(HelpDrawerState.Closed);
  };

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={state === HelpDrawerState.Open}
      onClose={() => setIsHelpDrawerOpen(HelpDrawerState.Closed)}
    >
      <StyledRoot>
        <Grid container>
          <Grid container direction="row" justify="flex-end">
            <CloseButton
              onClick={() => setIsHelpDrawerOpen(HelpDrawerState.Closed)}
            >
              <CloseIcon />
            </CloseButton>
          </Grid>
          <Grid item xs={12}>
            <HelpDrawerTitleText>Help Centre</HelpDrawerTitleText>
          </Grid>
          <ScrollArea>
            <Grid item xs={12}>
              <StyledBox>
                <HelpDrawerBoxText>
                  The Shoe Project Impact Page is an interactive map that
                  showcases a selection of stories written by immigrant and
                  refugee women who have come to Canada.
                </HelpDrawerBoxText>
              </StyledBox>
            </Grid>
            <Grid item xs={12}>
              <HelpAccordion
                title={"General Navigation"}
                body={
                  "The pins are placed on the city where these women currently reside. Zoom in on any pin to see all the stories from that city."
                }
                login={false}
              />
            </Grid>
            <Grid item xs={12}>
              <HelpAccordion
                title={"Story Pins"}
                body={
                  "Each pin represents a story written by a participant of The Shoe Project. To preview a story, click on any pin."
                }
                login={false}
              />
            </Grid>
            <Grid item xs={12}>
              <HelpAccordion
                title={"Filter Stories"}
                body={
                  "Stories can be filtered by their author’s country of origin. Only stories from selected countries will remain on the map."
                }
                login={false}
              />
            </Grid>
            <Grid item xs={12}>
              <HelpAccordion
                title={"Lost?"}
                body={
                  "If you are no longer able to find a story pin, click on a redirect icon and it will bring you to the nearest story."
                }
                login={false}
              />
            </Grid>
            <Grid item xs={12}>
              <HelpAccordion title={"TSP Administrator?"} body={""} login />
            </Grid>
          </ScrollArea>
          <Grid container direction="row" justify="center">
            <LaunchButton onClick={handleLaunchTour}>
              <HelpDrawerLaunchButtonText>
                Launch Tour
              </HelpDrawerLaunchButtonText>
            </LaunchButton>
          </Grid>
        </Grid>
      </StyledRoot>
    </Drawer>
  );
}
