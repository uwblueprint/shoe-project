import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Autocomplete from "@material-ui/lab/Autocomplete";
import * as React from "react";
import { ScaleControl } from "react-leaflet";
import styled from "styled-components";
import useSWR from "swr";

import { colors, fontSize } from "../styles";
import { device } from "../styles/device";
import { FilterChip } from "./FilterChip";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface FilterProps {
  onChange: (event: React.ChangeEvent, options: string[]) => void;
}

const StyledAutocomplete = styled(Autocomplete)`
  color: ${colors.primary};
  width: 312px;
  @media ${device.mobile} {
    padding-left: 2em;
    width: 86vw;

    .MuiChip-root {
      height: 60px;
      border-radius: 3em;
      margin-bottom: 1.4em;
    }

    .MuiChip-deleteIcon {
      height: 2em;
      width: 1.6em;
      padding-right: 0.7em;
      padding-left: 0.4em;
    }
  }

  /* .MuiAutocomplete-option {
    font-size: 40px;
    padding-top: 30px;
    padding-bottom: 30px;
  } */

  .MuiChip-label {
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: ${fontSize.subtitle};
    line-height: 24px;
    color: ${colors.primaryDark2};
    @media ${device.mobile} {
      padding-left: 20px;
      font-size: 3em;
      line-height: 4em;
    }
  }

  .MuiAutocomplete-inputRoot {
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: ${fontSize.subtitle};
    line-height: 24px;
    color: ${colors.grey};
    @media ${device.mobile} {
      font-size: 40px;
      padding-bottom: 10px;
      padding-right: 56px;
    }
  }

  .MuiIconButton-label {
    padding-left: 30px;
  }

  .MuiInput-underline:before {
    border-bottom: 1px solid ${colors.grey};
  }

  .MuiInput-underline:after {
    border-bottom: 2px solid ${colors.primary};
  }
`;

const StyledCheckbox = styled(Checkbox)`
  .MuiCheckbox-colorPrimary {
    color: ${colors.primaryDark1};
  }
  margin-right: 8px;
  @media ${device.mobile} {
    transform: scale(2);
  }
`;

const FilterContainer = styled.div`
  z-index: 1000;
  position: absolute;
  width: 324px;
  min-height: 61px;
  left: 36px;
  top: 16px;

  @media ${device.mobile} {
    margin-top: 1.5vh;
    width: 90vw;
    min-height: 8.5vh;
    border-radius: 1.5em;
  }

  background: ${colors.white};
  box-shadow: 0px 0px 25px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  display: flex;
  padding: 16px;
  flex-direction: column;
`;

const Tagline = styled.span`
  font-size: ${fontSize.subtitle};
  padding-bottom: 16px;
  @media ${device.mobile} {
    padding-top: 0.75em;
    margin-bottom: 0.75em;
    padding-left: 0.7em;
    font-size: 3em;
  }
`;

const StyledDiv = styled.div`
  font-size: 40px;
`;

const CheckboxLabel = styled.label`
  @media ${device.mobile} {
    font-size: 40px;
    padding-top: 30px;
    padding-bottom: 30px;
  }
`;

const useStyles = makeStyles(() => ({
  paper: {
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "24px",
    // "@media (max-width: 1000px)": {
    //   ".MuiAutocomplete-option": {
    //     fontSize: "40px",
    //     paddingTop: "30px",
    //     paddingBottom: "30px",
    //   },
    // },
  },
  "@media (max-width: 1000px)": {
    ".MuiAutocomplete-option": {
      fontSize: "40px",
      paddingTop: "30px",
      paddingBottom: "30px",
    },
  },
  // "@global": {
  //   ".MuiAutocomplete-option": {
  //     fontSize: "40px",
  //     paddingTop: "30px",
  //     paddingBottom: "30px",
  //   },
  // },
}));

export function Filter({ onChange }: FilterProps): JSX.Element {
  const { data: countries, error } = useSWR<string[]>(
    "/api/authors/origin_countries"
  );

  const classes = useStyles();
  useStyles();
  if (error) return <div>Error!</div>;

  return (
    <FilterContainer>
      <Tagline>Show stories from:</Tagline>
      <StyledAutocomplete
        color="Primary"
        multiple
        loading={!countries}
        id="filter-autocomplete"
        options={countries || []}
        onChange={onChange}
        disableCloseOnSelect
        classes={{
          paper: classes.paper,
        }}
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
            <StyledCheckbox
              id={option}
              icon={icon}
              checkedIcon={checkedIcon}
              checked={selected}
              color="primary"
            />
            <CheckboxLabel htmlFor={option}>{option}</CheckboxLabel>
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
                  <StyledDiv>
                    {!countries ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </StyledDiv>
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </FilterContainer>
  );
}
