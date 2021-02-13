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
import { useReducer } from "react";
import styled from "styled-components";

import { device } from "../styles/device";

const StyledGrid = styled(Grid)`
  margin-top: 48px;
  @media ${device.laptop} {
    justify: left;
    width: 100vw;
  }
`;

export const Upload: React.FC = () => {
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      image: {} as File,
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
    }
  );

  const setImage = (files: File[]) => {
    setFormInput({
      image: files[0],
    });
  };

  const handleChange = (
    event?: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof formInput;
    setFormInput({
      [name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form_data = new FormData();
    for (const key in formInput) {
      form_data.append(key, formInput[key]);
    }

    fetch("/api/story", {
      method: "POST",
      body: form_data,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("Error: ", error));
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
              value={formInput.author_country}
              onChange={handleChange}
              inputProps={{
                name: "author_country",
                id: "select-label-country",
              }}
            >
              <MenuItem value={"China"}>China</MenuItem>
              <MenuItem value={"India"}>India</MenuItem>
              <MenuItem value={"Sri Lanka"}>Sri Lanka</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="Current Location">Current City</InputLabel>
            <Select
              value={formInput.current_city}
              onChange={handleChange}
              inputProps={{
                name: "current_city",
                id: "select-label-city",
              }}
            >
              <MenuItem value={"Toronto"}>Toronto</MenuItem>
              <MenuItem value={"Calgary"}>Calgary</MenuItem>
              <MenuItem value={"Vancouver"}>Vancouver</MenuItem>
              <MenuItem value={"Thunder Bay"}>Thunder Bay</MenuItem>
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="input-label-year">Year Published</InputLabel>
            <Select
              value={formInput.year}
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
