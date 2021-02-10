import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core/";
import { DropzoneArea } from "material-ui-dropzone";
import * as React from "react";
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
  const [state, setState] = React.useState<{
    images: File[];
    video_url: string;
    title: string;
    content: string;
    summary: string;
    author_first_name: string;
    author_last_name: string;
    author_country: string;
    year: string;
    current_city: string;
    bio: string;
  }>({
    images: [],
    video_url: "",
    title: "",
    content: "",
    summary: "",
    author_first_name: "",
    author_last_name: "",
    author_country: "",
    year: "",
    current_city: "",
    bio: "",
  });

  const setImage = (files: File[]) => {
    setState({
      ...state,
      images: files,
    });
  };

  const handleChange = (
    event?: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    console.log(state.images);
    const name = event.target.name as keyof typeof state;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = { state };
    console.log(JSON.stringify(data));
    fetch("localhost:8900/api/stories_formdata", {
      method: "POST",
      //should send in as form-data
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => console.log("Success:", JSON.stringify(response)))
      .catch((error) => console.error("Error:", error));
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
            name="title"
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
            name="summary"
            label="Story Summary"
          />
          <TextField
            onChange={handleChange}
            variant="outlined"
            required
            id="author-first-name"
            name="author_first_name"
            label="First Name"
            placeholder="Lorem ipsum"
          />
           <TextField
            onChange={handleChange}
            variant="outlined"
            required
            id="author-last-name"
            name="author_last_name"
            label="Last Name"
            placeholder="Lorem ipsum"
          />
          <TextField
            onChange={handleChange}
            multiline
            placeholder="Enter additional information here"
            rows={8}
            required
            id="author-bio"
            name="bio"
            label="Author Bio"
          />

          <FormControl>
            <InputLabel id="Country of Origin">Country of Origin</InputLabel>
            <Select
              value={state.author_country}
              onChange={handleChange}
              inputProps={{
                name: "author_country",
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
              value={state.current_city}
              onChange={handleChange}
              inputProps={{
                name: "current_city",
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
              <MenuItem value={"2021"}>2021</MenuItem>
              <MenuItem value={"2020"}>2020</MenuItem>
              <MenuItem value={"2019"}>2019</MenuItem>
            </Select>
          </FormControl>

          <DropzoneArea
            acceptedFiles={["image/*"]}
            dropzoneText={"Drag and drop an image here or click"}
            onChange={(files) => {
              setImage(files);
            }}
          />
          {/* TODO: verify link */}
          <TextField
            onChange={handleChange}
            required
            id="video-link"
            label="Video Link"
            placeholder="www.youtube.com/link"
            inputProps={{
              name: "video_url",
              id: "input-video-link",
            }}
          />
          <TextField
            onChange={handleChange}
            multiline
            placeholder="Lorem ipsum dolor sit amet, consectet ui i iadipiscing elit"
            rows={8}
            required
            inputProps={{
              name: "content",
              id: "story-content",
            }}
            label="Story"
          />
          <Button color="primary" type="submit" variant="contained">
            Submit Story
          </Button>
        </FormControl>
      </form>
    </StyledGrid>
  );
};
