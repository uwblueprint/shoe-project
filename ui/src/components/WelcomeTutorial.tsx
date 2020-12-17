import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import * as React from "react";
import styled from "styled-components";

import ShoeLogo from "../assets/images/welcome-shoe-logo.svg";
import DialogTip from "../assets/images/white-arrow.png";
import { colors } from "../styles/colors";
import {
  NavigateDescriptionText,
  NavigateTitleText,
  WelcomeDescriptionText,
  WelcomeTitleText,
} from "../styles/typography";

const StyledArrowTip = styled.img`
  position: absolute;
  width: 29px;
  height: 26px;
  left: -5%;
  top: 45%;
  background: none;
`;

const StyledFilterArrowTip = styled.img`
  position: absolute;
  width: 29px;
  height: 26px;
  left: -5%;
  top: 15%;
  background: none;
`;

const StyledIconButton = styled(IconButton)`
  position: absolute;
  margin: 0px;
  padding: 0px;
  left: 372px;
  top: 29px;
  width: 14px;
  height: 14px;

  && {
    box-shadow: none;
  }
`;

const StyledWelcome = styled(Dialog)`
  .MuiDialog-paper {
    width: 415px;
    height: 230px;
    background: #ffffff;
    box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow-y: visible;
    overflow-x: visible;
    margin: 0px;
    top: 20%;
  }

  .MuiBackdrop-root {
    opacity: 10%;
  }
`;

const StyledFilterWelcome = styled(Dialog)`
  .MuiDialog-paper {
    width: 415px;
    height: 230px;
    background: #ffffff;
    box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow-y: visible;
    overflow-x: visible;
    bottom: 30%;
  }
  .MuiBackdrop-root {
    background-color: transparent;
  }
`;
const StyledNextButton = styled(Button)`
  left: 248px;
  .MuiButton-label {
    color: ${colors.primaryDark2};
    font-size: 16px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    margin: 0px 10px;
  }
  && {
    box-shadow: none;
    background-color: ${colors.primaryLight4};
    width: 80px;
    height: 40px;
    &:active {
      background-color: ${colors.primaryLight3};
    }
  }
`;

const StyledFilterNextButton = styled(Button)`
  left: 235px;
  .MuiButton-label {
    color: ${colors.primaryDark2};
    font-size: 16px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    margin: 0px 10px;
  }
  && {
    box-shadow: none;
    background-color: ${colors.primaryLight4};
    width: 92px;
    height: 40px;
    &:active {
      background-color: ${colors.primaryLight3};
    }
  }
`;

const StyledCloseIcon = styled(CloseIcon)`
  .MuiIcon-colorPrimary {
    color: ${colors.primaryDark2};
  }
`;

const StyledTag = styled(Button)`
  width: 58px;
  height: 32px;
  left: 24px;
  border-radius: 5px;
  background-color: ${colors.neutralLight};

  .MuiButton-label {
    color: ${colors.neutralDark};
    font-size: 16px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    margin: 0px 10px;
  }

  && {
    box-shadow: none;
    background-color: ${colors.neutralLight};
  }
`;

const StyledWelcomeIconButton = styled(IconButton)`
  position: absolute;
  margin: 0px;
  padding: 0px;
  left: 455px;
  top: 29px;
  width: 14px;
  height: 14px;

  && {
    box-shadow: none;
  }
`;

const StyledWelcomeWelcome = styled(Dialog)`
  .MuiDialog-paper {
    width: 490px;
    height: 346px;
    background: #ffffff;
    box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin: 0px;
  }
  .MuiBackdrop-root {
    background-color: transparent;
  }
`;

const StyledWelcomeButton = styled(Button)`
  position: absolute;
  left: 134px;
  bottom: 24px;
  color: ${colors.primaryLight2};

  .MuiButton-label {
    color: ${colors.primaryDark2};
    font-size: 16px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    margin: 0px 10px;
  }

  && {
    box-shadow: none;
    background-color: ${colors.primaryLight4};
    width: 222px;
    height: 48px;
    display: flex;
    &:active {
      background-color: ${colors.primaryLight3};
    }
  }
`;

const StyledWelcomeLogo = styled.img`
  margin-left: 189px;
  margin-right: 196px;
  margin-bottom: 16px;
  display: flex;
  background-repeat: no-repeat;
  width: 105px;
  height: 109px;
`;

const StyledNavigateIconButton = styled(IconButton)`
  position: absolute;
  margin: 0px;
  padding: 0px;
  left: 372px;
  top: 29px;
  width: 14px;
  height: 14px;

  && {
    box-shadow: none;
  }
`;

const StyledNavigateWelcome = styled(Dialog)`
  .MuiDialog-paper {
    width: 415px;
    height: 230px;
    background: #ffffff;
    box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin: 0px;
  }

  .MuiBackdrop-root {
    background-color: transparent;
  }
`;

const StyledNavigateNextButton = styled(Button)`
  left: 248px;
  .MuiButton-label {
    color: ${colors.primaryDark2};
    font-size: 16px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    margin: 0px 10px;
  }
  && {
    box-shadow: none;
    background-color: ${colors.primaryLight4};
    width: 80px;
    height: 40px;
    &:active {
      background-color: ${colors.primaryLight3};
    }
  }
`;

const StyledNavigateTag = styled(Button)`
  width: 58px;
  height: 32px;
  left: 24px;
  border-radius: 5px;
  background-color: ${colors.neutralLight};

  .MuiButton-label {
    color: ${colors.neutralDark};
    font-size: 16px;
    font-family: Poppins;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    margin: 0px 10px;
  }
  && {
    box-shadow: none;
    background-color: ${colors.neutralLight};
  }
`;

const StyledContainer = styled.div`
  display: inline-block;
`;

export enum TutorialState {
  First,
  Second,
  Third,
  Fourth,
  Closed,
}

interface TutorialStateProps {
  state: TutorialState;
  setState: (newState: TutorialState) => void;
}

export function WelcomeTutorial({
  state,
  setState,
}: TutorialStateProps): JSX.Element {
  const handleClose = () => {
    setState(TutorialState.Closed);
  };

  return (
    <React.Fragment>
      <StyledWelcomeWelcome
        open={state === TutorialState.First}
        onClose={handleClose}
      >
        <StyledWelcomeIconButton onClick={handleClose}>
          <StyledCloseIcon color="primary" fontSize="small" />
        </StyledWelcomeIconButton>
        <StyledWelcomeLogo src={ShoeLogo}></StyledWelcomeLogo>
        <WelcomeTitleText>Welcome</WelcomeTitleText>
        <WelcomeDescriptionText>
          The Shoe Project Impact Page is an interactive map that showcases a
          selection of stories written by immigrant and refugee women who have
          come to Canada.
        </WelcomeDescriptionText>
        <StyledWelcomeButton
          text-align="center"
          variant="text"
          disableElevation={true}
          onClick={() => setState(TutorialState.Second)}
        >
          START TOUR
        </StyledWelcomeButton>
      </StyledWelcomeWelcome>
      <StyledNavigateWelcome
        open={state === TutorialState.Second}
        onClose={handleClose}
      >
        <StyledNavigateIconButton onClick={handleClose}>
          <StyledCloseIcon color="primary" fontSize="small" />
        </StyledNavigateIconButton>
        <NavigateTitleText>Navigating the Map</NavigateTitleText>
        <NavigateDescriptionText>
          The pins are placed on the city where these women currently reside.
          Zoom in on any pin to see all the stories from that city.
        </NavigateDescriptionText>
        <StyledContainer>
          <StyledNavigateTag
            text-align="center"
            variant="text"
            disableElevation={true}
          >
            1/3
          </StyledNavigateTag>
          <StyledNavigateNextButton
            text-align="center"
            variant="text"
            disableElevation={true}
            onClick={() => setState(TutorialState.Third)}
          >
            NEXT
          </StyledNavigateNextButton>
        </StyledContainer>
      </StyledNavigateWelcome>

      <StyledWelcome open={state === TutorialState.Third} onClose={handleClose}>
        <StyledArrowTip src={DialogTip}></StyledArrowTip>
        <StyledIconButton onClick={handleClose}>
          <StyledCloseIcon color="primary" fontSize="small" />
        </StyledIconButton>
        <NavigateTitleText>Discover a Story</NavigateTitleText>
        <NavigateDescriptionText>
          Each pin represents a story written by a participant of The Shoe
          Project. To preview a story, click on any pin.
        </NavigateDescriptionText>
        <StyledContainer>
          <StyledTag text-align="center" variant="text" disableElevation={true}>
            2/3
          </StyledTag>
          <StyledNextButton
            text-align="center"
            variant="text"
            disableElevation={true}
            onClick={() => setState(TutorialState.Fourth)}
          >
            NEXT
          </StyledNextButton>
        </StyledContainer>
      </StyledWelcome>

      <StyledFilterWelcome
        open={state === TutorialState.Fourth}
        onClose={handleClose}
      >
        <StyledFilterArrowTip src={DialogTip}></StyledFilterArrowTip>
        <StyledIconButton onClick={handleClose}>
          <StyledCloseIcon color="primary" fontSize="small" />
        </StyledIconButton>
        <NavigateTitleText>Filter Stories</NavigateTitleText>
        <NavigateDescriptionText>
          Stories can be filtered by their author’s country of origin. Only
          stories from selected countries will remain on the map.
        </NavigateDescriptionText>
        <StyledContainer>
          <StyledTag text-align="center" variant="text" disableElevation={true}>
            3/3
          </StyledTag>
          <StyledFilterNextButton
            text-align="center"
            variant="text"
            disableElevation={true}
            onClick={handleClose}
          >
            GOT IT
          </StyledFilterNextButton>
        </StyledContainer>
      </StyledFilterWelcome>
    </React.Fragment>
  );
}
