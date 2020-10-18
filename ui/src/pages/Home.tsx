import * as React from "react";
import useSWR from "swr";
import { TitleText } from "../styles/typography";
import { Story } from "../types";

export const Home: React.FC = () => {
  const { data, error } = useSWR<Story[]>("/api/stories");

  if (error) return <div>Error!</div>;
  if (!data) return <div>Loading</div>;

  return (
    <div>
      <TitleText>Stories</TitleText>
      {data.map((story) => (
        <div key={story.ID}>
          <div>{story.Title}</div>
          <div>{story.Content}</div>
        </div>
      ))}
    </div>
  );
};
