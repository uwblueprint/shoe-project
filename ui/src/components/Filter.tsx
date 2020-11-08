import * as React from "react";
import useSWR from "swr";
import styled from "styled-components";
import { colors, fontSize } from "../styles";

import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import { FilterChip } from "./FilterChip";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface FilterProps {
  options: string[];
  onChange: (options: string[]) => void;
}

const FilterContainer = styled.div`
  z-index: 1000;
  position: absolute;
  width: 324px;
  min-height: 61px;
  left: 46px;
  top: 70px;

  background: ${colors.white};
  box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  display: flex;
  padding: 16px;
  flex-direction: column;
`;

const Tagline = styled.span`
  fontSize: ${fontSize.subtitle};
  padding-bottom: 16px;
`;

export function Filter(): JSX.Element {
  const { data:countries, error } = useSWR<string[]>("/api/authors/origin_countries");

  if (error) return <div>Error!</div>;

  return (
    <FilterContainer>
      <Tagline>Show stories from:</Tagline>
      <Autocomplete
        multiple
        loading={!countries}
        id="filter-autocomplete"
        options={countries || []}
        style={{ width: 312}}
        disableCloseOnSelect
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <FilterChip
              key={option}
              label={option}
              {...getTagProps({ index })}
            />
          ))
        }
        renderOption={(option, { selected }) => (
          <React.Fragment key={option}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </React.Fragment>
        )}
  
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label=""
            placeholder="Countries"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {!countries ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </FilterContainer>
  );
}
