import * as React from 'react';
import styled from "styled-components";

interface Props {
   name:
    string
}

const Title = styled.h1`
  font-size: 3em;
  text-align: center;
  color: palevioletred;
`;

const Button = styled.button`
  display: flex;    
  color: palevioletred;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
  
`;

class App extends React.Component<Props> {
  render() {
    const { name } = this.props;
    return (
      <>
          <Title>Hello {name}</Title>
          <Button>Click Me!</Button>
      </>
    );
  }
}

export default App;
