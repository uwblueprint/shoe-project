import styled from "styled-components";
import { colors } from "./colors";
import { device } from "./device";

export const fontSize = Object.freeze({
  h1Text: "32px",
  h2Text: "27px",
  h3Text: "18px",
  body: "14px",
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
