import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { StoryView } from "../pages/Admin/AllStories/types";
import { colors } from "../styles/colors";
import { device } from "../styles/device";
import {
  StoryDrawerAuthorText,
  StoryDrawerContentText,
  StoryDrawerCountryText,
  StoryDrawerRightText,
  StoryDrawerTitleText,
} from "../styles/typography";
import { Story } from "../types";

const StyledDrawer = styled(Drawer)`
  .MuiDrawer-paperAnchorRight {
    width: 100%;
  }
`;

function formatYoutubeURL(video_url: string) {
  if (!video_url.includes("embed")) {
    try {
      const youtubeEmbedURL = "https://www.youtube.com/embed/";
      // eslint-disable-next-line
      const regex = `(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})`;
      const found = video_url.match(regex);
      return youtubeEmbedURL + found[1];
    } catch (err) {
      console.error(err);
      return "";
    }
  }
  return video_url;
}

const StyledIconButton = styled(Button)`
  position: absolute;
  left: 0px;
  top: 0px;
  && {
    background-color: ${colors.secondary};
    color: ${colors.white};
    min-width: 66.77px;
    min-height: 60px;
    width: 66.77px;
    height: 60px;
    border-radius: 0px;
    &:hover {
      background-color: ${colors.secondaryDark1};
    }
  }
`;

const EditStoryButton = styled(Button)`
  && {
    box-shadow: none;
    background-color: ${colors.primaryDark1};
    font-family: "Poppins";

    &:active {
      background-color: ${colors.primaryDark1};
    }
    &:hover {
      background-color: ${colors.primaryDark1};
    }
  }
`;

const StyledImage = styled.img`
  border-radius: 0px;
  width: 100%;

  @media ${device.mobileS} {
    margin-left: 1vh;
    margin-right: 1vh;
  }
`;

const LoadingContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500px;

  @media ${device.mobileS} {
    margin-left: 1vh;
    margin-right: 1vh;
  }
`;

const StyledRoot = styled.div`
  padding-left: 30vh;
  padding-right: 30vh;
  padding-bottom: 10vh;

  @media ${device.laptop} {
    padding-left: 2.5vh;
    padding-right: 2.5vh;
  }
`;

const HiddenImg = styled.img`
  display: none;
`;

const StyledDrawerContainer = styled.div`
  position: relative;
  margin-bottom: 21px;
`;

const StyledVideo = styled.iframe`
  height: 40vw;
  width: 100%;
`;

const EditStoryButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface StoryDrawerProps {
  story?: Story | StoryView;
  onClose: () => void;
  onClickEditStory?: () => void;
}

export function StoryDrawer({
  story,
  onClose,
  onClickEditStory,
}: StoryDrawerProps): JSX.Element {
  const [imageURL, setImageURL] = React.useState("");
  const history = useHistory();
  if (story === undefined) {
    return null;
  }

  const {
    title,
    author_first_name,
    author_last_name,
    author_country,
    current_city,
    content,
    image_url,
    video_url,
    year,
  } = story;

  const shoeImg =
    imageURL.length === 0 ? (
      <LoadingContent>
        <CircularProgress />
      </LoadingContent>
    ) : (
      <StyledImage src={image_url} alt="Image of shoe" />
    );

  return (
    <StyledDrawer anchor="right" open onClose={onClose}>
      <HiddenImg src={image_url} onLoad={() => setImageURL(image_url)} />
      <StyledIconButton onClick={onClose}>
        <ArrowBackIcon />
      </StyledIconButton>
      <StyledRoot>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={onClickEditStory ? 9 : 12}>
            <StoryDrawerTitleText>{title}</StoryDrawerTitleText>
          </Grid>
          {onClickEditStory && (
            <Grid item xs={3}>
              <EditStoryButtonWrapper>
                <EditStoryButton
                  variant="contained"
                  color="primary"
                  onClick={() => history.push(`/admin/edit/${story.ID}`)}
                >
                  Edit Story
                </EditStoryButton>
              </EditStoryButtonWrapper>
            </Grid>
          )}
          <Grid item xs={12}>
            <StoryDrawerCountryText>
              Origin: {author_country}
            </StoryDrawerCountryText>
            <StyledDrawerContainer>
              <StoryDrawerAuthorText>{`${author_first_name} ${author_last_name}`}</StoryDrawerAuthorText>
              <StoryDrawerRightText>
                {current_city ? current_city.toUpperCase() : current_city},
                CANADA • {year}
              </StoryDrawerRightText>
            </StyledDrawerContainer>
          </Grid>

          <Grid item xs={12}>
            {shoeImg}
          </Grid>
          <Grid item xs={12}>
            <StoryDrawerContentText>{content}</StoryDrawerContentText>
          </Grid>
          {video_url && (
            <Grid item xs={12}>
              <StyledVideo
                src={formatYoutubeURL(video_url)}
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></StyledVideo>
            </Grid>
          )}
        </Grid>
      </StyledRoot>
    </StyledDrawer>
  );
}
