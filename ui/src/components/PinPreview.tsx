import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import styled from "styled-components";

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
  height: 211px;
  background: ${colors.neutralLight};
`;

const LoadingCardContent = styled(CardContent)`
  height: 211px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCardContent = styled(CardContent)`
  border-radius: 10px;
  overflow: hidden;
`;

const StyledCard = styled(Card)`
  .MuiPaper-rounded {
    border-radius: 10px;
  }
`;

const HiddenImg = styled.img`
  display: none;
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

export function PinPreview({
  title,
  description,
  author,
  date,
  country,
  shoeImage,
  onClick,
}: PinPreviewProps): JSX.Element {
  const [imageURL, setImageURL] = React.useState("");
  const shoeImg =
    imageURL.length === 0 ? (
      <LoadingCardContent><CircularProgress /></LoadingCardContent>
    ) : (
      <StyledMedia alt="Image of shoe" image={imageURL} title="Image of shoe" />
    );

  return (
    <StyledCard>
      <HiddenImg src={shoeImage} onLoad={() => setImageURL(shoeImage)} />
      {shoeImg}
      <StyledCardContent>
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
    </StyledCard>
  );
}
