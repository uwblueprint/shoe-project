import {
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core/";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DropzoneArea } from "material-ui-dropzone";
import * as React from "react";
import { KeyboardEvent, useReducer, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

import countriesList from "../data/countries.json";
import { colors } from "../styles/colors";
import { device } from "../styles/device";
import { UploadLabelsText, UploadStoriesHeading } from "../styles/typography";
import { Story } from "../types";

const StyledGrid = styled(Grid)`
  background-color: ${colors.primaryLight6};
  @media ${device.laptop} {
    justify: left;
    width: 100vw;
  }
`;

const StyledInputLabel = styled(InputLabel)`
  && {
    position: relative;
    font-family: Poppins;
    padding-left: 16px;
    width: 30vw;
  }
`;

const StyledSelect = styled(Select)`
  width: 30vw;
  && {
    font-family: Poppins;
    align-items: center;
    display: inline-block;
  }
`;

const StyledMenuItem = styled(MenuItem)`
  && {
    font-family: Poppins;
  }
`;

const StyledTextField = styled(TextField)`
  width: 30vw;

  && {
    margin-top: 12px;
    .MuiInputLabel-formControl {
      font-family: Poppins !important;
    }
  }
`;

const ImageContainer = styled.div`
  width: 30vw;
`;

const StyledDropzoneArea = styled(DropzoneArea)`
  && {
    margin-top: 12px;
  }
`;

const StyledTags = styled(Autocomplete)`
  && {
    font-family: Poppins;
    margin-top: 12px;
    width: 30vw;
    .MuiInputLabel-root {
      font-family: Poppins !important;
    }
    .MuiInputBase-input {
      font-family: Poppins !important;
    }
  }
`;

const StyledBackgroundColor = styled.div`
  background-color: ${colors.white};
  width: 40vw;
  padding: 0px 0px 24px 24px;
  margin-bottom: 24px;
`;

interface InputProps {
  onKeyDown: (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

interface TagParameters {
  inputProps: InputProps;
}

interface StoryProps {
  title: string;
  content: string;
  current_city: string;
  year: number;
  is_visible: boolean;
  summary: string;
  latitude: number;
  longitude: number;
  image: File;
  video_url: string;
  author_first_name: string;
  author_last_name: string;
  author_country: string;
}

export const UploadStory: React.FC<StoryProps> = (props?: StoryProps) => {
  const [tagArray, setTagArrayValues] = useState([]);

  const { data: tagOptions, error } = useSWR<string[]>("/api/tags");

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

  const handleKeyDown = (event) => {
    switch (event.key) {
      case ",":
      case " ": {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length > 0) {
          setTagArrayValues([...tagArray, event.target.value]);
        }
        break;
      }
      default:
    }
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

    for (const index in tagArray) {
      formData.append("tags", tagArray[index]);
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

  if (error) return <div>Error fetching tags!</div>;

  return (
    <StyledGrid container justify="center" alignContent="center">
      <form onSubmit={handleSubmit}>
        <FormControl>
          <StyledBackgroundColor>
            <UploadStoriesHeading>Story Information</UploadStoriesHeading>
            <UploadLabelsText>Title</UploadLabelsText>
            <StyledTextField
              onChange={handleChange}
              variant="outlined"
              required
              id="story-title"
              name="title"
              label="Enter story title"
              placeholder="Lorem ipsum"
            />
            <UploadLabelsText>Summary</UploadLabelsText>
            <StyledTextField
              onChange={handleChange}
              multiline
              placeholder="Enter additional information here"
              variant="outlined"
              required
              id="story-summary"
              name="summary"
              label="Enter story summary"
            />
            <UploadLabelsText>Story</UploadLabelsText>
            <StyledTextField
              onChange={handleChange}
              multiline
              variant="outlined"
              placeholder="Lorem ipsum dolor sit amet, consectet ui i iadipiscing elit"
              rows={8}
              required
              inputProps={{
                name: "content",
                id: "story-content",
              }}
              label="Enter story"
            />
          </StyledBackgroundColor>
          <StyledBackgroundColor>
            <UploadStoriesHeading>Author Information</UploadStoriesHeading>
            <UploadLabelsText>First Name</UploadLabelsText>
            <StyledTextField
              onChange={handleChange}
              variant="outlined"
              required
              id="author-first-name"
              name="author_first_name"
              label="Enter author's first name"
              placeholder="Lorem ipsum"
            />
            <UploadLabelsText>Last Name</UploadLabelsText>
            <StyledTextField
              onChange={handleChange}
              variant="outlined"
              required
              id="author-last-name"
              name="author_last_name"
              label="Enter author's last name"
              placeholder="Lorem ipsum"
            />
            <UploadLabelsText>Biography</UploadLabelsText>
            <StyledTextField
              variant="outlined"
              onChange={handleChange}
              multiline
              placeholder="Enter additional information here"
              rows={4}
              id="author-bio"
              name="bio"
              label="Enter author biography"
            />
          </StyledBackgroundColor>

          <StyledBackgroundColor>
            <UploadStoriesHeading>Additional Information</UploadStoriesHeading>
            <FormControl>
              <UploadLabelsText>Country of Origin</UploadLabelsText>
              <StyledInputLabel id="Country of Origin">
                Enter story&#39;s country of origin
              </StyledInputLabel>
              <StyledSelect
                variant="outlined"
                value={formInput.author_country}
                onChange={handleChange}
                inputProps={{
                  name: "author_country",
                  id: "select-label-country",
                }}
              >
                {countriesList.map((country) => (
                  <StyledMenuItem key={country.code} value={country.name}>
                    {country.name}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </FormControl>
            <UploadLabelsText>Current City</UploadLabelsText>
            <StyledInputLabel id="Current Location">
              Enter where story was written
            </StyledInputLabel>
            <StyledSelect
              variant="outlined"
              value={formInput.current_city}
              onChange={handleChange}
              inputProps={{
                name: "current_city",
                id: "select-label-city",
              }}
            >
              <StyledMenuItem value={"Toronto"}>Toronto</StyledMenuItem>
              <StyledMenuItem value={"Calgary"}>Calgary</StyledMenuItem>
              <StyledMenuItem value={"Vancouver"}>Vancouver</StyledMenuItem>
              <StyledMenuItem value={"Halifax"}>Halifax</StyledMenuItem>
              <StyledMenuItem value={"Thunder Bay"}>Thunder Bay</StyledMenuItem>
            </StyledSelect>
            <FormControl>
              <UploadLabelsText>Year Published</UploadLabelsText>
              <StyledSelect
                variant="outlined"
                value={formInput.year}
                onChange={handleChange}
                defaultValue={"2021"}
                inputProps={{
                  name: "year",
                  id: "select-label-year",
                }}
              >
                <StyledMenuItem value={"2021"}>2021</StyledMenuItem>
                <StyledMenuItem value={"2020"}>2020</StyledMenuItem>
                <StyledMenuItem value={"2019"}>2019</StyledMenuItem>
              </StyledSelect>
            </FormControl>
            <FormControl>
              <UploadLabelsText>Tags</UploadLabelsText>
              <StyledTags
                autoHighlight
                multiple
                id="tags-outlined"
                name="tags"
                freeSolo
                options={tagOptions ? tagOptions : [""]}
                filterSelectedOptions
                onChange={(_, newValue) => setTagArrayValues(newValue)}
                value={tagArray ? tagArray : [""]}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option}
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params: TagParameters) => {
                  params.inputProps.onKeyDown = handleKeyDown;
                  return (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Shoe Tags"
                      placeholder="Select Tags"
                    ></TextField>
                  );
                }}
              />
            </FormControl>
          </StyledBackgroundColor>
          <StyledBackgroundColor>
            <UploadStoriesHeading>Multimedia</UploadStoriesHeading>
            <ImageContainer>
              <UploadLabelsText>Add Image</UploadLabelsText>
              <StyledDropzoneArea
                showFileNames
                acceptedFiles={["image/*"]}
                filesLimit={1}
                dropzoneText={"Drag image here or select from device"}
                onChange={(files) => {
                  setImage(files);
                }}
              />
            </ImageContainer>
            <UploadLabelsText>Video Link</UploadLabelsText>
            <StyledTextField
              onChange={handleChange}
              variant="outlined"
              id="video-link"
              label="Video Link"
              placeholder="www.youtube.com/link"
              inputProps={{
                name: "video_url",
                id: "input-video-link",
              }}
            />
          </StyledBackgroundColor>
          <Button color="primary" type="submit" variant="contained">
            Submit Story
          </Button>
        </FormControl>
      </form>
    </StyledGrid>
  );
};
