import { FormControl } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core/";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { DropzoneArea } from "material-ui-dropzone";
import * as React from "react";
// import React from 'react';
// import {Chips} from 'react-chips';
import styled from "styled-components";

import { device } from "../styles/device";
// https://yuvaleros.github.io/material-ui-dropzone/

const StyledGrid = styled(Grid)`
  margin-top: 48px;
  @media ${device.laptop} {
    justify: left;
    width: 100vw;
  }
`;

export const Upload: React.FC = () => {
  // var [chips, setChips] = React.useState('');
  const [state, setState] = React.useState<{
    storyTitle: string;
    storySummary: string;
    author: string;
    authorBio: string;
    country: string;
    city: string;
    year: string | number;
  }>({
    storyTitle: "",
    storySummary: "",
    author: "",
    authorBio: "",
    country: "",
    city: "",
    year: 0,
  });

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof state;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  // const handleChipsChange = event => {
  //   console.log("hi");
  // };

  const handleSubmit = event => {
    //some logic
  };

  return (
    <StyledGrid container justify="center" alignContent="center">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <TextField
            onChange={handleChange}
            variant="outlined"
            required
            id="story-title"
            label="Story Title"
            placeholder="Lorem ipsum"
          />
          <TextField
            onChange={handleChange}
            multiline
            placeholder="Enter additional information here"
            rows={8}
            required
            id="story-summary"
            label="Story Summary"
          />
          <TextField
            onChange={handleChange}
            variant="outlined"
            required
            id="author-title"
            label="Author"
            placeholder="Lorem ipsum"
          />
          <TextField
            onChange={handleChange}
            multiline
            placeholder="Enter additional information here"
            rows={8}
            required
            id="author-bio"
            label="Author Bio"
          />

          <FormControl>
            <InputLabel id="Country of Origin">Country of Origin</InputLabel>
            <Select
              value={state.country}
              onChange={handleChange}
              inputProps={{
                name: "country",
                id: "select-label-country",
              }}
            >
              <MenuItem value={"China"}>China</MenuItem>
              <MenuItem value={"India"}>India</MenuItem>
              <MenuItem value={"Russia"}>Russia</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="Current Location">Current City</InputLabel>
            <Select
              value={state.city}
              onChange={handleChange}
              inputProps={{
                name: "city",
                id: "select-label-city",
              }}
            >
              <MenuItem value={"Toronto"}>Toronto</MenuItem>
              <MenuItem value={"Calgary"}>Calgary</MenuItem>
              <MenuItem value={"Vancouver"}>Vancouver</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="input-label-year">Year Published</InputLabel>
            <Select
              value={state.year}
              onChange={handleChange}
              inputProps={{
                name: "year",
                id: "select-label-year",
              }}
            >
              <MenuItem value={2021}>2021</MenuItem>
              <MenuItem value={2020}>2020</MenuItem>
              <MenuItem value={2019}>2019</MenuItem>
            </Select>
          </FormControl>

          <DropzoneArea
            acceptedFiles={["image/*"]}
            dropzoneText={"Drag and drop an image here or click"}
            onChange={(files) => console.log("Files:", files)}
          />

          {/* <Chips
          value={chips}
          onChange={setChips}
          suggestions={["Tag1", "Tag2", "Tag3"]}

        /> */}

          <TextField
            required
            id="video-link"
            label="Video Link"
            placeholder="www.youtube.com/link"
          />
          <TextField
            multiline
            placeholder="Lorem ipsum dolor sit amet, consectet ui i iadipiscing elit"
            rows={8}
            required
            id="story-content"
            label="Story"
          />
        </FormControl>
      </form>
    </StyledGrid>
  );
};
