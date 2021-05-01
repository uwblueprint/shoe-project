import * as React from "react";

import { Story } from "../../types/index";
import { UploadStoryWrapper } from "./Edit/UploadStoryWrapper";

const startYear = new Date().getFullYear();

export const Upload: React.FC = () => {
  const story: Story = {
    title: "",
    content: "",
    current_city: "",
    year: startYear,
    is_visible: null,
    summary: "",
    latitude: null,
    longitude: null,
    image_url: "",
    video_url: "",
    author_first_name: "",
    author_last_name: "",
    author_country: "",
    author: null,
    tags: [],
    ID: null,
    CreatedAt: null,
    UpdatedAt: null,
    DeletedAt: null,
  };

  return (
    <UploadStoryWrapper
      id={null}
      currentStory={story}
      bio=""
    ></UploadStoryWrapper>
  );
};
