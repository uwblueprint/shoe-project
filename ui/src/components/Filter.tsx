import * as React from "react";
import styled from "styled-components";
import { colors } from "../styles/colors";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

export interface FilterProps {
  options: string[];
  onChange: (options: string[]) => void;
}

const countries = ["China", "India", "Greece"];

const FilterContainer = styled.div`
  width: 505px;
  height: 61px;
  left: 46px;
  top: 70px;

  background: ${colors.white};
  box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  display: flex;
  align-items: center;
  padding-left: 18px;
`;

export function Filter(): JSX.Element {
  return (
    <FilterContainer>
      <span>Show stories from:</span>
      <Autocomplete
        multiple
        id="filter-autocomplete"
        options={countries}
        defaultValue={[countries[0]]}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label=""
            placeholder="Countries"
          />
        )}
      />
    </FilterContainer>
  );
}
