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

const StyledImage = styled.img`
  width: 30vw;
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
  story: Story;
  bio: string;
}

export const UploadStory: React.FC<StoryProps> = ({
  story,
  bio,
}: StoryProps) => {
  const [tagArray, setTagArrayValues] = useState([]);
  const [newImage, setNewImage] = useState(story.image_url);

  const addNewImageButton = () => {
    setNewImage("");
  };

  const yearArray = [];
  let year: number = new Date().getFullYear();
  for (let i = 30; i > 0; i--) {
    yearArray.push(year);
    year -= 1;
  }

  const { data: tagOptions, error } = useSWR<string[]>("/api/tags");

  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      image: new File([""], "filename"),
      video_url: story.video_url,
      title: story.title,
      content: story.content,
      summary: story.summary,
      author_first_name: story.author_first_name,
      author_last_name: story.author_last_name,
      author_country: story.author_country,
      year: story.year,
      current_city: story.current_city,
      bio: bio,
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
              defaultValue={formInput.title}
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
              defaultValue={formInput.summary}
            />
            <UploadLabelsText>Story</UploadLabelsText>
            <StyledTextField
              onChange={handleChange}
              multiline
              variant="outlined"
              defaultValue={formInput.content}
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
              defaultValue={formInput.author_first_name}
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
              defaultValue={formInput.author_last_name}
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
              defaultValue={formInput.bio}
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
                {yearArray.map((year) => (
                  <StyledMenuItem key={year} value={year}>
                    {year}
                  </StyledMenuItem>
                ))}
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
              {/* <img src={story.image_url} /> */}
              {newImage == "" ? (
                <div>
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
                </div>
              ) : (
                <div>
                  <UploadLabelsText>Current Image:</UploadLabelsText>
                  <br />
                  <StyledImage src={story.image_url} />
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={addNewImageButton}
                  >
                    Change Image
                  </Button>
                </div>
              )}
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
              defaultValue={formInput.video_url}
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
