import styled from "styled-components";

import { colors } from "./colors";
import { device } from "./device";

export const fontSize = Object.freeze({
  h1Text: "32px",
  h2Text: "26px",
  h3Text: "20px",
  subtitle: "16px",
  body1: "16px",
  body2: "14px",
  caption: "14px",
  mobile: "10px",
  mobile2: "24px",
  interactive: "16px",
});

export const Body1 = styled.span`
  font-style: normal;
  font-size: ${fontSize.body1};
  line-height: 150%;
  @media ${device.laptop} {
    font-size: 2em;
  }
`;

export const TitleText = styled.p`
  font-size: ${fontSize.h2Text};
  font-weight: 700;
  text-align: center;
  color: ${colors.secondaryDark2};

  @media ${device.mobileS} {
    font-size: ${fontSize.h3Text};
  }
`;

export const CardTitleText = styled.p`
  font-size: ${fontSize.h3Text};
  font-family: Poppins;
  font-weight: 500;
  line-height: 30px;
  text-align: left;
  color: ${colors.black};
  margin: 16px 0px 8px 0px;

  @media ${device.mobile} {
    font-size: 4em;
    line-height: normal;
    font-weight: 600;
  }
`;

export const CardDescriptionText = styled.p`
  font-size: ${fontSize.body1};
  font-family: Poppins;
  font-weight: normal;
  line-height: 24px;
  color: ${colors.black};
  opacity: 0.7;
  margin: 0;

  @media ${device.mobile} {
    font-size: 3em;
    line-height: 1.5em;
    height: 4.5em;
    position: relative;
    overflow: hidden;

    &:after {
      content: "";
      text-align: right;
      position: absolute;
      bottom: 0;
      right: 0;
      width: 70%;
      height: 1.5em;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0),
        rgba(255, 255, 255, 1) 50%
      );
    }
  }
`;

export const WelcomeTitleText = styled.p`
  font-size: ${fontSize.h3Text};
  font-weight: 500;
  line-height: 30px;
  text-align: center;
  margin: 0px;
  color: ${colors.black};
  @media ${device.laptop} {
    font-size: 2.5em;
  }
`;

export const WelcomeDescriptionText = styled.p`
  font-size: ${fontSize.body2};
  font-weight: normal;
  line-height: 21px;
  text-align: center;
  align-items: center;
  color: ${colors.black};
  opacity: 0.7;
  padding-bottom: 24px;
  padding-left: 16px;
  padding-right: 16px;
  @media ${device.laptop} {
    font-size: 1.5em;
    line-height: 120%;
  }
`;

export const NavigateTitleText = styled.p`
  font-size: ${fontSize.h3Text};
  font-weight: 500;
  line-height: 30px;
  text-align: left;
  padding-left: 24px;
  padding-top: 16px;
  margin: 0px;
  color: ${colors.black};

  @media ${device.laptop} {
    font-size: 2em;
  }
`;

export const NavigateDescriptionText = styled.p`
  font-size: ${fontSize.body1};
  font-weight: normal;
  line-height: 21px;
  text-align: left;
  align-items: left;
  color: ${colors.black};
  padding-left: 24px;
  padding-right: 24px;
  @media ${device.laptop} {
    font-size: 1.5em;
    line-height: 120%;
  }
`;

export const CardDetailText = styled.p`
  font-size: ${fontSize.caption};
  font-family: Poppins;
  font-weight: 300;
  line-height: 21px;
  text-align: left;
  color: ${colors.black};
  margin: 16px 0px 0px 0px !important;

  @media ${device.mobile} {
    font-size: 2.5em;
    line-height: normal;
  }
`;

export const CardTagText = styled.span`
  font-size: ${fontSize.subtitle};
  font-family: Poppins;
  font-weight: 500;
  line-height: 19px;
  text-align: left;
  color: ${colors.black};
  opacity: 0.7;

  @media ${device.mobile} {
    font-size: 3em;
    line-height: normal;
    font-weight: 600;
  }
`;

export const StoryDrawerTitleText = styled.span`
  font-family: Canela;
  font-size: ${fontSize.h1Text};
  font-style: normal;
  font-weight: 400;
  line-height: 37px;
  letter-spacing: 0em;
  text-align: left;
  @media ${device.mobileS} {
    font-size: ${fontSize.h2Text};
  }
`;

export const StoryDrawerCountryText = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  opacity: 0.7;
  @media ${device.laptop} {
    font-size: 1em;
  }
`;

export const StoryDrawerAuthorText = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  display: inline;
  position: absolute;
  opacity: 0.5;
  @media ${device.laptop} {
    font-size: 2em;
  }
`;

export const StoryDrawerRightText = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  position: absolute;
  right: 0;
  letter-spacing: 0em;
  opacity: 0.5;
  @media ${device.laptop} {
    font-size: 2em;
  }
`;

export const StoryDrawerContentText = styled.span`
  font-size: ${fontSize.subtitle};
  white-space: pre-line;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: 0em;
  text-align: left;
`;

export const HelpDrawerBoxText = styled.span`
  font-size: ${fontSize.body2};
  font-style: normal;
  font-weight: normal;
  line-height: 150%;
  text-align: left;
  @media ${device.laptop} {
    font-size: 1.5em;
  }
`;

export const HelpDrawerTitleText = styled.p`
  font-size: ${fontSize.h3Text};
  font-style: normal;
  font-weight: 500;
  line-height: 30px;
  text-align: left;
  margin: 0 0 6px 0;
  color: ${colors.black};
  @media ${device.laptop} {
    font-size: 2em;
  }
`;

export const HelpDrawerLaunchButtonText = styled.span`
  font-size: ${fontSize.subtitle};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  text-align: center;
  text-transform: uppercase;
  color: ${colors.primaryDark2};
  @media ${device.laptop} {
    font-size: ${fontSize.mobile2};
    padding-top: 24px;
    padding-bototm: 24px;
  }
`;

export const LoginTitleText = styled.p`
  font-size: ${fontSize.h3Text};
  line-height: 30px;
  text-align: center;
`;

export const LoginMessageText = styled.p`
  font-size: ${fontSize.body2};
  text-align: center;
`;

export const UploadStoriesHeading = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: ${fontSize.h3Text};
  line-height: 150%;
  color: ${colors.black};
  margin: 24px 0px 24px 0px;
`;

export const UploadLabelsText = styled.div`
  position: relative;
  margin-bottom: 2px;
  margin-top: 24px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: ${fontSize.subtitle};
  line-height: 120%;
  color: ${colors.black};
`;

export const StyledAllStoriesHeader = styled.div`
  font-family: Canela;
  font-style: normal;
  font-weight: normal;
  font-size: ${fontSize.h1Text};
  line-height: 37px;
  padding-bottom: 24px;
  padding-top: 80px;
  margin-left: 64px;
`;
