import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import * as React from "react";
import styled from "styled-components";

import WWFlag from "../assets/flags/WW.svg";
import TempShoe from "../assets/images/temp.png";
import { colors } from "../styles/colors";
import {
  CardDescriptionText,
  CardDetailText,
  CardTagText,
  CardTitleText,
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
  shoeImage: string;
  onClick: () => void;
}

function importFlag(importStr:string) {
  var flag = import(importStr)
  .catch(err => console.log(err))
  console.log(flag)
  return (flag)
}

export function PinPreview({
  title,
  description,
  author,
  date,
  country,
  shoeImage,
  onClick,
}: PinPreviewProps): JSX.Element {


  const importStr = `../assets/flags/${country}.svg`

  const flag = importFlag(importStr)
  return (
    <>
      <StyledMedia image={shoeImage} title="Temporary Image" />
      <StyledCardContent>
        {/* {flag && (
          <img alt="flag" src={flag} />
        )} */}
        <CardTagText>{country}</CardTagText>
        <CardTitleText>{title}</CardTitleText>
        <CardDescriptionText>{description}</CardDescriptionText>
        <StyledButton
          variant="contained"
          color="primary"
          disableElevation
          onClick={onClick}
        >
          Read Full Story
        </StyledButton>
        <CardDetailText>
          {author} • {date}
        </CardDetailText>
      </StyledCardContent>
    </>
  );
}
