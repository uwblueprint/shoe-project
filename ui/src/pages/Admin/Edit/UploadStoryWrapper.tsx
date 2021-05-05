import CircularProgress from "@material-ui/core/CircularProgress";
import * as React from "react";
import styled from "styled-components";
import useSWR from "swr";

import { StoryWrapperProps } from "./types";
import { UploadStory } from "./UploadStory";

const InfoDiv = styled.div`
  font-family: Poppins !important;
  font-size: 30px;
  position: fixed;
  right: 50%;
  top: 50%;
`;

const StyledProgress = styled(CircularProgress)`
  position: fixed;
  right: 50%;
  top: 50%;
`;

export const UploadStoryWrapper: React.FC<StoryWrapperProps> = ({
  id,
  currentStory,
  bio,
}: StoryWrapperProps) => {
  const { data: tagOptions, error: errorTags } = useSWR<string[]>("/api/tags");
  const { data: countries, error: errorCountries } = useSWR<string[]>(
    "/api/countries"
  );

  if (errorTags) {
    return <InfoDiv>Error fetching tags!</InfoDiv>;
  }
  if (errorCountries) {
    return <InfoDiv>Error fetching countries array!</InfoDiv>;
  }

  if (tagOptions === undefined || countries === undefined) {
    return <StyledProgress />;
  }

  return (
    <UploadStory
      id={id}
      currentStory={currentStory}
      bio={bio}
      tagOptions={tagOptions}
      countries={countries}
    />
  );
};
