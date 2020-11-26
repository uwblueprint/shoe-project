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
import ShoeLogo from "../assets/images/shoeproject-logo.svg";

import {
  CardTitleText,
  CardDescriptionText,
  CardDetailText,
  CardTagText,
} from "../styles/typography";

const StyledWelcome = styled(Dialog)`
  width: 490px;
  height: 346px;
  left: 475px;
  top: 277px;

  background: #ffffff;
  box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`;

const StyledButton = styled(Button)`
  && {
    box-shadow: none;
    background-color: ${colors.primaryLight4};
    width: 222px;
    height: 48px;

    &:active {
      background-color: ${colors.primaryLight3};
    }
  }
`;

const StyledLogo = styled.div`
  background-image: url(${ShoeLogo});
  width: 87px;
  height: 87px;
`;

export function WelcomeScreens() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledWelcome open={true}>
          <StyledLogo></StyledLogo>
        <CardTitleText>Welcome</CardTitleText>
        <CardDescriptionText>
          The Shoe Project Impact Page is an interactive map that showcases a
          selection of stories written by immigrant and refugee women who have
          come to Canada.
        </CardDescriptionText>
        <StyledButton
          variant="contained"
          color={colors.primaryLight2}
          disableElevation={true}
        >
          START TOUR
        </StyledButton>
        {/* <MuiDialogTitle>Testing</MuiDialogTitle> */}
      </StyledWelcome>
    </>
  );
}
