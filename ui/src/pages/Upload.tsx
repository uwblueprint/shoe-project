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
    storyTitle: string;
    storySummary: string;
    storyContent: string;
    author: string;
    authorBio: string;
    images: File[];
    country: string;
    city: string;
    year: string | number;
    videoLink: string;
  }>({
    storyTitle: "",
    storySummary: "",
    storyContent: "",
    author: "",
    authorBio: "",
    images: [],
    country: "",
    city: "",
    year: "",
    videoLink: "",
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
    fetch("localhost:8900/api/stories", {
      method: "POST",
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
            name="storyTitle"
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
            name="storySummary"
            label="Story Summary"
          />
          <TextField
            onChange={handleChange}
            variant="outlined"
            required
            id="author-title"
            name="author"
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
            name="authorBio"
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
            onChange={(files) => {
              setImage(files);
            }}
          />
          <TextField
            onChange={handleChange}
            required
            id="video-link"
            label="Video Link"
            placeholder="www.youtube.com/link"
            inputProps={{
              name: "videoLink",
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
              name: "storyContent",
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
