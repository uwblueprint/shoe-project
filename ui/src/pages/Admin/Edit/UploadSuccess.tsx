import { Button } from "@material-ui/core/";
import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import WelcomeLogo from "../../../assets/images/shoeproject-logo.svg";
import SuccessDrawing from "../../../assets/images/success-doodle.svg";
import { colors } from "../../../styles/colors";
import { fontSize } from "../../../styles/typography";

const StyledGrid = styled.div`
  background-color: ${colors.primaryLight6};
  width: 100vw;
  height: 100vh;
`;

const StyledLogo = styled.img`
  width: 5vw;
  height: 5vh;
  background-color: ${colors.white};
  padding-top: 0.5vw;
  padding-right: 95vw;
  padding-bottom: 0.5vw;
`;

const StyledIllustration = styled.img`
  width: 40vw;
  height: 40vh;
  display: block;
`;

const StyledBackground = styled.div`
  width: 40vw;
  height: 60vh;
  background-color: ${colors.white};
  display: flex;
  margin-left: 30%;
  margin-top: 5%;
`;

const StyledText = styled.div`
  font-family: Poppins;
  font-size: ${fontSize.h2Text};
  line-height: 33px;
  text-align: center;
  display: block;
  margin-top: 85px;
`;

const ReturnButton = styled(Button)`

.MuiButton-label{
  color: ${colors.primaryDark1};
  font-family: Poppins;
  font-weight: 500;
  font-size: ${fontSize.subtitle};
  line-height: 150%;
  
}
&.MuiButton-outlined{
  border: 2px solid ${colors.primaryDark1};
}

&& {
  box-shadow: none;
  background-color: ${colors.white};
  margin-right: 18px;
  &:active {
    background-color: ${colors.white};
  }
`;

const UploadButton = styled(Button)` 
&& {

  box-shadow: none;
  background-color: ${colors.primaryDark1};
 
  margin-left: 18px;
  &:active {
    background-color: ${colors.primaryDark3};
  }
  &:hover{
    background-color: ${colors.primaryDark2};
  }

`;

const StyledDiv = styled.div`
  text-align: center;
`;
const StyledContainer = styled.div`
  display: inline-block;
`;

export const UploadSuccess: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <StyledGrid>
        <StyledLogo src={WelcomeLogo}></StyledLogo>
        <StyledBackground>
          <StyledContainer>
            <StyledText>Story Uploaded Successfully!</StyledText>
            <StyledIllustration src={SuccessDrawing}></StyledIllustration>
            <StyledDiv>
              <ReturnButton
                onClick={() => {
                  history.push("/admin/allstories");
                  history.go(0);
                }}
                to="/admin/allstories"
                variant="outlined"
                size="large"
              >
                Return to Dashboard
              </ReturnButton>
              <UploadButton
                onClick={() => history.push("/admin/upload")}
                to="/admin/upload"
                variant="contained"
                size="large"
                color="primary"
              >
                Upload Another Story
              </UploadButton>
            </StyledDiv>
          </StyledContainer>
        </StyledBackground>
      </StyledGrid>
    </>
  );
};
