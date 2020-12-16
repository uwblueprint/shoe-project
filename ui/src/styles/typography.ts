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
  interactive: "16px",
});

export const Body1 = styled.span`
  font-style: normal;
  font-size: ${fontSize.body1};
  line-height: 150%;
  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
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

  @media ${device.mobileS} {
    font-size: ${fontSize.h3Text};
  }
`;

export const CardDescriptionText = styled.p`
  font-size: ${fontSize.body1};
  font-family: Poppins;
  font-weight: normal;
  line-height: 24px;
  text-align: justify;
  color: ${colors.black};
  opacity: 0.7;
  margin: 0;

  @media ${device.mobileS} {
    font-size: ${fontSize.body2};
  }
`;

export const WelcomeTitleText = styled.p`
  font-size: ${fontSize.h3Text};
  font-weight: 500;
  line-height: 30px;
  text-align: center;
  margin: 0px;
  color: ${colors.black};
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
`;

export const CardDetailText = styled.p`
  font-size: ${fontSize.caption};
  font-family: Poppins;
  font-weight: 300;
  line-height: 21px;
  text-align: left;
  color: ${colors.black};
  margin: 16px 0px 0px 0px !important;

  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
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
  margin-left: 9px;

  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
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
  font-size: ${fontSize.subtitle};
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
  }
`;

export const StoryDrawerAuthorText = styled.div`
  font-family: Poppins;
  font-size: ${fontSize.subtitle};
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  opacity: 0.5;
  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
  }
`;

export const StoryDrawerRightText = styled.div`
  font-family: Poppins;
  font-size: ${fontSize.subtitle};
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: right;
  opacity: 0.5;
  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
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
  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
  }
`;

export const HelpDrawerBoxText = styled.span`
  font-size: ${fontSize.body2};
  font-style: normal;
  font-weight: normal;
  line-height: 150%;
  text-align: left;
  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
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
  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
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
  @media ${device.mobileS} {
    font-size: ${fontSize.mobile};
  }
`;
