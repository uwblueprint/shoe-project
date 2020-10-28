import * as React from "react";
import styled from "styled-components";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import ChinaFlag from "../assets/flags/China.png";
import TempShoe from "../assets/images/temp.png";
import {
  CardTitleText,
  CardDescriptionText,
  CardDetailText,
  CardTagText,
} from "../styles/typography";

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
}

export function PinPreview({
  title,
  description,
  author,
  date,
  country,
}: PinPreviewProps): JSX.Element {
  return (
    <>
      <StyledMedia image={TempShoe} title="Temporary Image" />
      <StyledCardContent>
        <img alt="flag" src={ChinaFlag} />
        <CardTagText>{country}</CardTagText>
        <CardTitleText>{title}</CardTitleText>
        <CardDescriptionText>{description}</CardDescriptionText>
        <CardDetailText>
          {author} • {date}
        </CardDetailText>
      </StyledCardContent>
    </>
  );
}
