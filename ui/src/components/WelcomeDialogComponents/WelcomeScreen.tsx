import * as React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import { colors } from "../../styles/colors";
import Button from "@material-ui/core/Button";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ShoeLogo from "../../assets/images/welcome-shoe-logo.svg";

import {
  WelcomeTitleText,
  WelcomeDescriptionText,
} from "../../styles/typography";

const StyledIconButton = styled(IconButton)`
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
  }
`;

const StyledWelcome = styled(Dialog)`
  .MuiDialog-paper {
    width: 490px;
    height: 346px;
    background: #ffffff;
    box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin: 0px;
  }
`;

const StyledButton = styled(Button)`
  position: absolute;
  left: 134px;
  bottom: 24px;
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

const StyledLogo = styled.img`
  margin-left: 189px;
  margin-right: 196px;
  margin-bottom: 16px;
  display: flex;
  background-repeat: no-repeat;
  width: 105px;
  height: 109px;
`;

const StyledCloseIcon = styled(CloseIcon)`
  .MuiIcon-colorPrimary {
    color: ${colors.primaryDark2};
  }
`;
export function WelcomeScreen() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledWelcome open={open} onClose={handleClose}>
        <StyledIconButton onClick={handleClose}>
          <StyledCloseIcon color="primary" fontSize="small" />
        </StyledIconButton>
        <StyledLogo src={ShoeLogo}></StyledLogo>
        <WelcomeTitleText>Welcome</WelcomeTitleText>
        <WelcomeDescriptionText>
          The Shoe Project Impact Page is an interactive map that showcases a
          selection of stories written by immigrant and refugee women who have
          come to Canada.
        </WelcomeDescriptionText>
        <StyledButton
          text-align="center"
          variant="text"
          color={colors.primaryLight2}
          disableElevation={true}
        >
          START TOUR
        </StyledButton>
      </StyledWelcome>
    </>
  );
}
