import * as React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import { colors } from "../../styles/colors";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogTip from "../../assets/images/white-arrow.png";
import OverlayCircle from "../../assets/images/clear-circle.svg";
import {
  NavigateTitleText,
  NavigateDescriptionText,
} from "../../styles/typography";

const StyledArrowTip = styled.img`
  position: absolute;
  width: 29px;
  height: 26px;
  left: -5%;
  top: 25%;
  background: none;
`;

const StyledOverlay = styled.img`
  position: absolute;
  width: 456px;
  height: 456px;
  left: -125%;
  top: -45%;
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
    bottom: 30%;
  }
`;

const StyledNextButton = styled(Button)`
  left: 229px;
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
  background-color: ${colors.grey};

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
    background-color: ${colors.grey};    
`;

const StyledContainer = styled.div`
  display: inline-block;
`;

export function FilterStoriesScreen() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledWelcome open={open} onClose={handleClose}>
        <StyledArrowTip src={DialogTip}></StyledArrowTip>
        <StyledOverlay src={OverlayCircle}></StyledOverlay>
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
          <StyledNextButton
            text-align="center"
            variant="text"
            disableElevation={true}
            onClick={handleClose}
          >
            GOT IT
          </StyledNextButton>
        </StyledContainer>
      </StyledWelcome>
    </>
  );
}
