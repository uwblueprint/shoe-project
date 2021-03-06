import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";

import { colors } from "../styles/colors";
import { Body1 } from "../styles/typography";

interface StyledAccordionProps {
  ishover: boolean;
}

const StyledAccordion = styled(Accordion)<StyledAccordionProps>`
  && {
    box-shadow: none;
  }

  .MuiAccordionSummary-root {
    padding: 0px;
  }

  .MuiAccordionSummary-content {
    margin: 10px 0px 10px 20px;
    ${(props: StyledAccordionProps) =>
      props.ishover &&
      css`
        color: ${colors.primaryDark1};
      `};
  }

  .MuiAccordionSummary-content.Mui-expanded {
    margin: 10px 0px 10px 20px;
    color: ${colors.primaryDark1};
    font-weight: 500;
  }

  .MuiIconButton-root {
    padding: 0px;
  }

  .MuiIconButton-edgeEnd {
    margin-left: 0px;
  }

  .MuiAccordionSummary-expandIcon {
    color: ${colors.black};
    transform: rotate(-90deg);
    ${(props: StyledAccordionProps) =>
      props.ishover &&
      css`
        color: ${colors.primaryDark1};
      `};
  }

  .MuiAccordionSummary-expandIcon.Mui-expanded {
    margin-left: 0px;
    color: ${colors.primaryDark1};
    transform: rotate(0deg);
  }

  .MuiAccordionDetails-root {
    padding: 0px;
  }
`;

const StyledAccordionSummary = styled(AccordionSummary)`
  flex-direction: row-reverse;
`;

const StyledBox = styled.div`
  background: ${colors.neutral};
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

interface HelpDrawerProps {
  title: string;
  body: string;
  login?: boolean;
}

export function HelpAccordion({
  title,
  body,
  login = false,
}: HelpDrawerProps): JSX.Element {
  const [isHover, setIsHover] = useState(false);
  const link = <Link to="/login">here</Link>;
  return (
    <StyledAccordion
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      ishover={isHover ? 1 : 0}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="help-panel-content"
        id="help-panel"
      >
        <Body1> {title} </Body1>
      </StyledAccordionSummary>
      <AccordionDetails>
        <StyledBox>
          {login ? (
            <div>
              <Body1>Are you a TSP administrator?</Body1>
              <br />
              <Body1>Sign in {link} to make changes to the map. </Body1>
            </div>
          ) : (
            <Body1> {body} </Body1>
          )}
        </StyledBox>
      </AccordionDetails>
    </StyledAccordion>
  );
}
