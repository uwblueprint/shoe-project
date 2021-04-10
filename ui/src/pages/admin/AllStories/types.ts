import { Story } from "../../../types";

export type StoryView = Omit<
Story,
| "summary"
| "latitude"
| "longitude"
| "author"
| "tags"
| "CreatedAt"
| "DeletedAt"
| "UpdatedAt"
> & { author_name: string };
