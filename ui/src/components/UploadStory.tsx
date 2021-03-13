import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert";
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

const StyledButton = styled(Button)`
  && {
    width: 30vw;
    margin-left: 24px;
  }
`;

const StyledBackgroundColor = styled.div`
  background-color: ${colors.white};
  width: 40vw;
  padding: 0px 0px 24px 24px;
  margin-bottom: 24px;
`;

const StyledLinearProgress = styled(LinearProgress)`
  margin-top: 24px;
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
  id: number;
  story: Story;
  bio: string;
}

export const UploadStory: React.FC<StoryProps> = ({
  id,
  story,
  bio,
}: StoryProps) => {
  const { data: tagOptions, error } = useSWR<string[]>("/api/tags");
  const [tagArray, setTagArrayValues] = useState(story.tags);
  const [newImage, setNewImage] = useState(story.image_url);
  const [disabled, setDisabled] = useState(false);
  //handleSubmit component states
  const [dialogOpenState, setDialogOpenState] = useState(false);
  const [uploadErrorState, setErrorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const addNewImageButton = () => {
    setNewImage("");
  };

  const yearArray = [];
  let year: number = new Date().getFullYear();
  for (let i = 30; i > 0; i--) {
    yearArray.push(year);
    year -= 1;
  }

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

  const setErrorUploadingState = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorOpen(false);
  };

  const handleChange = (
    event?: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof formInput;
    setFormInput({
      [name]: event.target.value,
    });
  };

  const handleDialogClose = () => {
    setDialogOpenState(false);
  };

  const handleDialogAgree = () => {
    handleDialogClose();
  };

  const handleDialogDisagree = () => {
    handleDialogClose();
  };

  const storySubmitDialog = (result) => {
    setLoading(false);
    setDisabled(false);
    const resultMessage = JSON.parse(result).message;
    if (
      resultMessage === "Story Added Successfully" ||
      resultMessage === "Story Updated successfully"
    ) {
      setDialogOpenState(true);
    } else {
      setErrorOpen(true);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setDisabled(true);
    const formData = new FormData();
    for (const key in formInput) {
      formData.append(key, formInput[key]);
    }

    for (const index in tagArray) {
      formData.append("tags", tagArray[index]);
    }
    let fetchString = "/api/story";
    let method = "POST";

    if (id) {
      fetchString = `/api/story/${id}`;
      method = "PUT";
    }

    fetch(fetchString, {
      method: method,
      body: formData,
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => {
        storySubmitDialog(result);
      })
      .catch((error) => console.log("Error: ", error));
  };

  const successMessage = id ? "Story Edit Success!" : "Story Upload Success!";

  if (error) return <div>Error fetching tags!</div>;

  return (
    <>
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
              <UploadStoriesHeading>
                Additional Information
              </UploadStoriesHeading>
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
                <StyledMenuItem value={"Thunder Bay"}>
                  Thunder Bay
                </StyledMenuItem>
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
            <StyledButton
              disabled={disabled}
              color="primary"
              type="submit"
              variant="contained"
            >
              Submit Story
            </StyledButton>
            <Snackbar
              open={uploadErrorState}
              autoHideDuration={5000}
              onClose={setErrorUploadingState}
            >
              <Alert variant="filled" severity="error">
                Error uploading story!
              </Alert>
            </Snackbar>
            <Dialog
              open={dialogOpenState}
              onClose={handleDialogClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialogd-description"
            >
              <DialogTitle id="alert-dialog-title">
                {successMessage}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Your story is now available on the All Stories Dashboard!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogDisagree} color="primary">
                  Return to Dashboard
                </Button>
                <Button onClick={handleDialogAgree} color="primary">
                  Continue Uploading
                </Button>
              </DialogActions>
            </Dialog>
          </FormControl>
        </form>
      </StyledGrid>
      {loading ? <StyledLinearProgress /> : null}
    </>
  );
};
