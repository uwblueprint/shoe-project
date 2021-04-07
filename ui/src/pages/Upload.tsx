import * as React from "react";

import { UploadStory } from "../components/UploadStory";
import { Story } from "../types/index";

export const Upload: React.FC = () => {
  const story: Story = {
    title: "",
    content: "",
    current_city: "",
    year: null,
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

  return <UploadStory id={null} currentStory={story} bio={""}></UploadStory>;
};
