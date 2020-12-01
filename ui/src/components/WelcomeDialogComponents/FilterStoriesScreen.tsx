import * as React from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import { colors } from "../../styles/colors";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DialogTip from "../../assets/images/white-arrow.png";
import {
  NavigateTitleText,
  NavigateDescriptionText,
} from "../../styles/typography";

const StyledArrowTip = styled.img`
  position: absolute;
  width: 29px;
  height: 26px;
  left: 463px;
  top: 597px;
  transform: rotate(-90deg);
  background: red;
`;

const StyledIconButton = styled(Button)`
position: absolute;
display: flex;
z-index: 0;
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
  position: absolute;
  z-index: 1;
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

export function FilterStoriesScreen() {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledArrowTip src={DialogTip}></StyledArrowTip>

      <StyledWelcome open={true}>
        {/* <StyledIconButton> */}
        <StyledCloseIcon color="primary" fontSize="small" />
        {/* </StyledIconButton> */}
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
          >
            GOT IT
          </StyledNextButton>
        </StyledContainer>
      </StyledWelcome>
    </>
  );
}
