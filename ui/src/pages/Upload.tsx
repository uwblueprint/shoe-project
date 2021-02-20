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
import { useReducer, useRef } from "react";
import ReactTags from "react-tag-autocomplete";
import styled from "styled-components";

import countriesList from "../data/countries.json";
import { device } from "../styles/device";

const StyledGrid = styled(Grid)`
  margin-top: 48px;
  @media ${device.laptop} {
    justify: left;
    width: 100vw;
  }
`;

const StyledTags = styled(ReactTags)`
  .react-tags {
    .react-tags_selected {
      .react-tags__selected-tag {
        color: red !important;
      }
    }
  }
`;

//Rough
const tags = [
  { id: 1, name: "Educational" },
  { id: 2, name: "Inspirational" },
];

const suggestions = [
  { id: 3, name: "Refugee" },
  { id: 4, name: "East Coast" },
  { id: 5, name: "West Coast" },
  { id: 6, name: "Territories" },
];

export const Upload: React.FC = () => {
  const storyTags = useRef(null);
  const onDelete = (i: number) => {
    console.log("On Delete:");
    // const tempTags = tags.slice(0);
    tags.splice(i, 1);
    //Add logic
  };

  const onAddition = (tag: string) => {
    console.log("On Addition:", tag);
    // const tempTags = [].concat(tags, tag);
    //Add logic
  };

  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      image: new File([""], "filename"),
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

    const formData = new FormData();
    for (const key in formInput) {
      formData.append(key, formInput[key]);
    }

    fetch("/api/story", {
      method: "POST",
      body: formData,
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
              {countriesList.map((country) => (
                <MenuItem key={country.code} value={country.name}>
                  {country.name}
                </MenuItem>
              ))}
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
            filesLimit={1}
            dropzoneText={"Drag and drop an image here or click"}
            onChange={(files) => {
              setImage(files);
            }}
          />
          <TextField
            onChange={handleChange}
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
          <br></br>
          <StyledTags
            ref={storyTags}
            tags={tags}
            suggestions={suggestions}
            onAddition={onAddition}
            onDelete={onDelete}
          ></StyledTags>

          <br></br>

          <Button color="primary" type="submit" variant="contained">
            Submit Story
          </Button>
        </FormControl>
      </form>
    </StyledGrid>
  );
};
