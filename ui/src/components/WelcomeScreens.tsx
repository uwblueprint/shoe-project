import * as React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import { colors } from "../styles/colors";
import Button from "@material-ui/core/Button";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ShoeLogo from "../assets/images/test.svg";

import {
  WelcomeTitleText,
  WelcomeDescriptionText,
  CardDetailText,
  CardTagText,
} from "../styles/typography";

const StyledIconButton = styled(Button)`
  position: absolute;
  align-items: right;
  margin-left: 455px;  
  margin-top: 29px;
 
  && {
    align: right;
    box-shadow: none;
    width: 14px;
    height: 14px;
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
  margin-top: 32px;
  margin-bottom: 16px;
  display: flex;
  background-repeat: no-repeat;
  width: 105px;
  height: 109px;
`;

const StyledCloseIcon = styled(CloseIcon)`
position: absolute;
right: 21px;
top: 29px;

  .MuiIcon-colorPrimary {
    color: #2d6394;
  }
`;
export function WelcomeScreens() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledWelcome open={true}>
        {/* <StyledIconButton onClick={handleClose}> */}
          <StyledCloseIcon color="primary" fontSize="small" />
        {/* </StyledIconButton> */}
        <StyledLogo src = {ShoeLogo}></StyledLogo>
        <WelcomeTitleText>Welcome</WelcomeTitleText>
        <WelcomeDescriptionText>
          The Shoe Project Impact Page is an interactive map that showcases a
          selection of stories written by immigrant and refugee women who have
          come to Canada.
        </WelcomeDescriptionText>
        <StyledButton
          text-color={colors.primaryDark2}
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
