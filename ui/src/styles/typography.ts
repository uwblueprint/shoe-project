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
});

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
  font-weight: normal;
  line-height: 24px;
  text-align: left;
  color: ${colors.black};
  opacity: 0.7;
  margin: 0;

  @media ${device.mobileS} {
    font-size: ${fontSize.body2};
  }
`;

export const CardDetailText = styled.p`
  font-size: ${fontSize.caption};
  font-weight: 300;
  line-height: 21px;
  text-align: left;
  color: ${colors.black};
  margin: 16px 0px 0px 0px !important;

  @media ${device.mobileS} {
    font-size: 10px;
  }
`;

export const CardTagText = styled.span`
  font-size: ${fontSize.subtitle};
  font-weight: 500;
  line-height: 19px;
  text-align: left;
  color: ${colors.black};
  opacity: 0.7;
  margin-left: 9px;

  @media ${device.mobileS} {
    font-size: 10px;
  }
`;

export const DrawerTitleText = styled.span`
  font-family: Canela;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 37px;
  letter-spacing: 0em;
  text-align: left;
`;

