import { useParams } from "react-router-dom";
import * as React from "react";
import { UploadStory } from "../components/UploadStory";
import { Story } from "../types/index";
import useSWR from "swr";

export const Edit: React.FC = () => {
  const { id } = useParams();
  const { data: story, error } = useSWR<Story>(`/api/story/${id}`);

  if (error) return <div>Error fetching story!</div>;
  return (
    <div>
      {story && !error && (
        <UploadStory id={id} story={story} bio={story.author.bio}></UploadStory>
      )}
    </div>
  );
};
