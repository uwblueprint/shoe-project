import * as React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import { colors } from "../../styles/colors";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

import {
  NavigateTitleText,
  NavigateDescriptionText,
} from "../../styles/typography";

const StyledIconButton = styled(Button)`
  position: absolute;
  align-items: right;
  margin-left: 372px;  
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
    width: 415px;
    height: 230px;
    background: #ffffff;
    box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin: 0px;
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
    width: 80px;
    height: 40px;
    &:active {
      background-color: ${colors.primaryLight3};
    }
  }
`;

const StyledCloseIcon = styled(CloseIcon)`
  position: absolute;
  right: 21px;
  top: 29px;

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
export function NavigateScreen() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledWelcome open={true}>
        <StyledCloseIcon color="primary" fontSize="small" />
        <NavigateTitleText>Navigating the Map</NavigateTitleText>
        <NavigateDescriptionText>
          The pins are placed on the city where these women currently reside.
          Zoom in on any pin to see all the stories from that city.
        </NavigateDescriptionText>
        <StyledContainer>
          <StyledTag text-align="center" variant="text" disableElevation={true}>
            1/3
          </StyledTag>
          <StyledNextButton
            text-align="center"
            variant="text"
            disableElevation={true}
          >
            NEXT
          </StyledNextButton>
        </StyledContainer>
      </StyledWelcome>
    </>
  );
}
