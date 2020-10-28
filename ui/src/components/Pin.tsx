import * as React from "react";
import styled from "styled-components";

export interface PinProps {
  focused: boolean;
  disabled: boolean;
}

const UnionContainer = styled.div`
  /* Union */


  position: absolute;
  left: 0.79%;
  right: 0.79%;
  top: 0%;
  bottom: 10.71%;
  //transform: rotateZ(-45deg);
  border-radius: 50% 50% 50% 50%;
  /* Red / Light 1 */

  background: #E44343;
  box-shadow: 0px 3.22581px 3.22581px rgba(0, 0, 0, 0.25), 0px 4.03226px 8.06452px rgba(0, 0, 0, 0.1);
`;

const IconContainer = styled.div`
  /* Vector */

  position: absolute;
  left: 34.48%;
  right: 34.48%;
  top: 25.35%;
  bottom: 43.66%;
  //border-radius: 0% 0% 30% 10%;

  /* Neutral / White */

  background: #ffffff;
`;

const PinContainer = styled.div`
  position: absolute;
  width: 58px;
  height: 71px;
`;

const EllipseContainer = styled.div`
  position: absolute;
  left: 44.83%;
  right: 44.83%;
  top: 91.55%;
  bottom: 0%;
  border-radius: 50%;
  /* Red / Light 1 */

  background: #E44343;
`;

export function Pin({focused,disabled}: PinProps): JSX.Element {

  return (
    <PinContainer>
      <UnionContainer></UnionContainer>
      <IconContainer></IconContainer>
      <EllipseContainer></EllipseContainer>
    </PinContainer>
  );
}
