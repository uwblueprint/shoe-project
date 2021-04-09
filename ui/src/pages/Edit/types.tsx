import { KeyboardEvent } from "react";

import { Story } from "../../types";

interface InputProps {
  onKeyDown: (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export interface TagParameters {
  inputProps: InputProps;
}

export interface StoryProps {
  id: number;
  currentStory: Story;
  bio: string;
}
