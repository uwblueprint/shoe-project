import { KeyboardEvent } from "react";

import { Story } from "../../../types";

interface InputProps {
  onKeyDown: (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export interface TagParameters {
  inputProps: InputProps;
}

export interface StoryWrapperProps {
  id: number;
  currentStory: Story;
  bio: string;
}
export interface StoryProps {
  id: number;
  currentStory: Story;
  bio: string;
  tagOptions: string[];
  countries: string[];
}
