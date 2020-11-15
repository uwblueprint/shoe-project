import * as React from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { colors } from "../styles/colors";
import ChinaFlag from "../assets/flags/China.png";
import TempShoe from "../assets/images/temp.png";
import {
  CardTitleText,
  CardDescriptionText,
  CardDetailText,
  CardTagText,
} from "../styles/typography";

const StyledButton = styled(Button)`
  && {
    color: ${colors.primaryDark2};
    background-color: ${colors.primaryLight4};
    height: 48px;
    width: 100%;

    &:hover {
      background-color: ${colors.primaryLight3};
    }
  }
`;

const StyledMedia = styled(CardMedia)`
  border-radius: 10px 10px 0px 0px;
  height: 211px;
`;

const StyledCardContent = styled(CardContent)`
  border-radius: 10px;
  overflow: hidden;
`;

interface PinPreviewProps {
  title: string;
  description: string;
  author: string;
  date: string;
  country: string;
  openDrawer: () => void;
}

export function PinPreview({
  title,
  description,
  author,
  date,
  country,
  openDrawer
}: PinPreviewProps): JSX.Element {
  return (
    <>
      <StyledMedia image={TempShoe} title="Temporary Image" />
      <StyledCardContent>
        <img alt="flag" src={ChinaFlag} />
        <CardTagText>{country}</CardTagText>
        <CardTitleText>{title}</CardTitleText>
        <CardDescriptionText>{description}</CardDescriptionText>
        <StyledButton variant="contained" color="primary" disableElevation onClick={openDrawer}>
          Read Full Story
        </StyledButton>
        <CardDetailText>
          {author} • {date}
        </CardDetailText>
      </StyledCardContent>
    </>
  );
}
