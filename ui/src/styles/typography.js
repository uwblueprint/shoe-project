import styled from "styled-components";
import colors from "./colors";
import { device } from "./device";

const extraLargeText = "42px";
const largeText = "36px";
const mediumText = "16px";
const smallText = "14px";
const extraSmallText = "12px";
const tinyText = "10px";

export const TitleText = styled.p`
  font-size: ${largeText};
  font-weight: 700;
  text-align: center;
  color: ${colors.accentColor};

  @media ${device.mobileS} {
    font-size: ${smallText};
  }
`;