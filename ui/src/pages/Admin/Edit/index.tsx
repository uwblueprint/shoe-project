import * as React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";

import { Story } from "../../../types/index";
import { UploadStoryWrapper } from "./UploadStoryWrapper";

export const Edit: React.FC = () => {
  const { id } = useParams();
  const { data: story, error } = useSWR<Story>(`/api/story/${id}`);

  if (error) return <div>Error fetching story!</div>;
  return (
    <div>
      {story && !error && (
        <UploadStoryWrapper
          id={id}
          currentStory={story}
          bio={story.author.bio}
        ></UploadStoryWrapper>
      )}
    </div>
  );
};
