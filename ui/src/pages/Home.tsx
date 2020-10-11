import * as React from "react";
import styled from "styled-components";
import { color } from "../styles";
import { TitleText } from "../styles/typography";

const Button = styled.button`
  display: flex;
  color: ${color.accentColor};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid ${color.accentColor};
  border-radius: 3px;
`;

export const Home: React.FC = () => {
  return (
    <div>
      <TitleText>Home</TitleText>
      <span> test text hehe</span>
      <Button>Test Button</Button>
    </div>
  );
};
