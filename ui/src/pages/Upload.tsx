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
import { colors } from "../styles/colors";
import { device } from "../styles/device";
import { fontSize } from "../styles/typography";

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
    transform: translate(0, 36px) scale(1);
    padding-left: 16px;
  }
`;

const StyledFormLabels = styled.div`
  position: relative;
  margin-bottom: 2px;
  margin-top: 24px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: ${fontSize.subtitle};
  line-height: 120%;
  color: ${colors.black};
`;

const StyledSelect = styled(Select)`
  width: 30vw;
  && {
    align-items: center;
    display: inline-block;
  }
`;

const StyledTextField = styled(TextField)`
  width: 30vw;
  && {
    margin-top: 12px;
    font-family: Poppins;
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

const StyledTags = styled(ReactTags)`
  .react-tags {
    .react-tags_selected {
      .react-tags__selected-tag {
        color: red !important;
      }
    }
  }
`;

const StyledHeading = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 500;
  font-size: ${fontSize.h3Text};
  line-height: 150%;
  color: ${colors.black};
  margin: 24px 0px 24px 0px;
`;

const StyledBackgroundColor = styled.div`
  background-color: ${colors.white};
  width: 40vw;
  padding: 0px 0px 24px 24px;
  margin-bottom: 24px;
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
          <StyledBackgroundColor>
            <StyledHeading>Story Information</StyledHeading>
            <div>
              <StyledFormLabels>Title</StyledFormLabels>
              <StyledTextField
                onChange={handleChange}
                variant="outlined"
                required
                id="story-title"
                name="title"
                label="Enter story title"
                placeholder="Lorem ipsum"
              />
            </div>
            <div>
              <StyledFormLabels>Summary</StyledFormLabels>
              <StyledTextField
                onChange={handleChange}
                multiline
                placeholder="Enter additional information here"
                variant="outlined"
                required
                id="story-summary"
                name="summary"
                label="Enter story summary "
              />
            </div>
            <StyledFormLabels>Story</StyledFormLabels>
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
            <StyledHeading>Author Information</StyledHeading>
            <div>
              <StyledFormLabels>First Name</StyledFormLabels>
              <StyledTextField
                onChange={handleChange}
                variant="outlined"
                required
                id="author-first-name"
                name="author_first_name"
                label="Enter author's first name"
                placeholder="Lorem ipsum"
              />
            </div>
            <div>
              <StyledFormLabels>Last Name</StyledFormLabels>
              <StyledTextField
                onChange={handleChange}
                variant="outlined"
                required
                id="author-last-name"
                name="author_last_name"
                label="Enter author's last name"
                placeholder="Lorem ipsum"
              />
            </div>
            <div>
              <StyledFormLabels>Biography</StyledFormLabels>
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
            </div>
          </StyledBackgroundColor>

          <StyledBackgroundColor>
            <StyledHeading>Additional Information</StyledHeading>

            <div>
              <FormControl>
                <StyledFormLabels>Country of Origin</StyledFormLabels>
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
                    <MenuItem key={country.code} value={country.name}>
                      {country.name}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <StyledFormLabels>Current City</StyledFormLabels>
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
                  <MenuItem value={"Toronto"}>Toronto</MenuItem>
                  <MenuItem value={"Calgary"}>Calgary</MenuItem>
                  <MenuItem value={"Vancouver"}>Vancouver</MenuItem>
                  <MenuItem value={"Thunder Bay"}>Thunder Bay</MenuItem>
                </StyledSelect>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <StyledFormLabels>Year Published</StyledFormLabels>
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
                  <MenuItem value={"2021"}>2021</MenuItem>
                  <MenuItem value={"2020"}>2020</MenuItem>
                  <MenuItem value={"2019"}>2019</MenuItem>
                </StyledSelect>
              </FormControl>
            </div>
          </StyledBackgroundColor>

          <StyledBackgroundColor>
            <StyledHeading>Multimedia</StyledHeading>

            <ImageContainer>
              <StyledFormLabels>Add Image</StyledFormLabels>
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
            <StyledFormLabels>Video Link</StyledFormLabels>
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

            <br></br>
            <br></br>
            <StyledTags
              ref={storyTags}
              tags={tags}
              suggestions={suggestions}
              onAddition={onAddition}
              onDelete={onDelete}
            ></StyledTags>
          </StyledBackgroundColor>
          <br></br>

          <Button color="primary" type="submit" variant="contained">
            Submit Story
          </Button>
        </FormControl>
      </form>
    </StyledGrid>
  );
};
