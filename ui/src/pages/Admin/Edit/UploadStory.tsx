import {
  AppBar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DropzoneArea } from "material-ui-dropzone";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import * as React from "react";
import { useReducer, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { StoryDrawer } from "../../../components";
import { citiesList } from "../../../data/cities";
import { colors } from "../../../styles/colors";
import { device } from "../../../styles/device";
import {
  UploadLabelsText,
  UploadStoriesHeading,
} from "../../../styles/typography";
import { Author, Story } from "../../../types";
import { ListboxComponent, renderGroup } from "./Listbox";
import { get_init_state, uploadStoryReducer } from "./reducer";
import { StoryProps, TagParameters } from "./types";

const StyledGrid = styled(Grid)`
  background-color: ${colors.primaryLight6};
  @media ${device.laptop} {
    justify: left;
    width: 100vw;
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
const StyledLink = styled.a`
  margin-top: 3.5vh;
  color: ${colors.primaryDark1};
  margin-left: 64px;
  margin-right: 30px;
`;

const StyledContainer = styled.div`
  display: flex;
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

const StyledAutocomplete = styled(Autocomplete)`
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
  text-transform: none;
  margin: 5px;
`;

const StyledDelete = styled(Button)`
  text-transform: none;
  margin: 5px;
  color: ${colors.red} !important;
`;

const StyledConfirmDelete = styled(Button)`
  color: ${colors.red} !important;
`;

const AddCountryPaper = styled(Paper)`
  width: 30vw;
  font-family: Poppins !important;
`;

const AddCountryDiv = styled.div`
  margin-left: 18px;
  margin-top: 5px;
`;

const AddCountryButton = styled(Button)`
  margin-right: 5px;
  width: 2vw;
  float: right;
  height: 3.75vh;

  .MuiButton-label {
    color: ${colors.primaryDark1};
    font-family: Poppins !important;
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

export const UploadStory: React.FC<StoryProps> = ({
  id,
  currentStory,
  bio,
  tagOptions,
  countries,
}: StoryProps) => {
  const [state, dispatch] = useReducer(
    uploadStoryReducer,
    get_init_state(currentStory)
  );
  const history = useHistory();

  const startYear = new Date().getFullYear();
  const yearArray = Array.from({ length: 30 }, (_, i) => startYear - i);

  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      image: new File([""], "filename"),
      video_url: currentStory.video_url,
      title: currentStory.title,
      content: currentStory.content,
      summary: currentStory.summary,
      author_first_name: currentStory.author_first_name,
      author_last_name: currentStory.author_last_name,
      author_country: currentStory.author_country,
      year: currentStory.year,
      current_city: currentStory.current_city.toUpperCase(),
      bio: bio,
    }
  );

  const story = React.useMemo(() => {
    if (state.isDrawerOpen) {
      const storyFromData: Story = {
        image_url:
          state.newImage === ""
            ? URL.createObjectURL(formInput.image)
            : currentStory.image_url,
        video_url: formInput.video_url as string,
        title: formInput.title as string,
        content: formInput.content as string,
        summary: formInput.summary as string,
        author_first_name: formInput.author_first_name as string,
        author_last_name: formInput.author_last_name as string,
        author_country: state.authorCountry as string,
        year: formInput.year as number,
        current_city: formInput.current_city as string,
        author: {
          ID: 0,
          CreatedAt: "",
          UpdatedAt: "",
          DeletedAt: {
            Time: "",
            Valid: true,
          },
          firstName: formInput.author_last_name as string,
          currentCity: formInput.current_city as string,
          bio: formInput.bio as string,
        } as Author,
        tags: [],
        is_visible: true,
        latitude: 0,
        longitude: 0,
        ID: 0,
        CreatedAt: "",
        UpdatedAt: "",
        DeletedAt: {
          Time: "",
          Valid: true,
        },
      };
      return storyFromData;
    }
    return undefined;
  }, [
    state.isDrawerOpen,
    formInput,
    currentStory.image_url,
    state.authorCountry,
    state.newImage,
  ]);

  const hasAllRequiredFields = React.useMemo(() => {
    return (
      formInput.image &&
      formInput.title &&
      formInput.content &&
      formInput.summary &&
      formInput.author_first_name &&
      formInput.author_last_name &&
      formInput.year &&
      formInput.current_city &&
      formInput.author_country
    );
  }, [formInput]);
  const [dialogOpenState, setDialogOpenState] = useState(false);

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
          dispatch({
            type: "SET_TAG_VALUES",
            tags: [...state.tagArray, event.target.value],
          });
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
    dispatch({ type: "SET_ERROR_STATE", errorState: false });
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
    fetch(`/api/story/${id}`, {
      method: "DELETE",
      redirect: "follow",
    })
      .then(() => {
        history.push("/admin");
        history.go(0);
      })
      .catch((error) => console.log("Error: ", error));
    handleDialogClose();
  };

  const handleDialogDisagree = () => {
    handleDialogClose();
  };

  const storySubmitDialog = (result) => {
    dispatch({
      type: "STORY_SUBMITTED",
      loadingStatus: false,
      buttonStatus: false,
    });
    const resultMessage = JSON.parse(result).message;
    if (
      resultMessage === "Story Added Successfully" ||
      resultMessage === "Story Updated successfully"
    ) {
      history.push("/success-screen");
    } else {
      dispatch({ type: "SET_ERROR_STATE", errorState: true });
    }
  };

  const addCountryButtonPressed = (autocompleteAuthorCountry: string) => {
    setFormInput({
      ["author_country"]: autocompleteAuthorCountry,
    });
    dispatch({
      type: "NEW_COUNTRY_ADDED",
      newCountry: autocompleteAuthorCountry,
    });
    countries.push(autocompleteAuthorCountry);
  };

  const addNewCountry = ({ children, ...other }) => {
    const filteredCountriesLength = countries.filter(
      (str) =>
        str.toLowerCase() === state.autocompleteAuthorCountry.toLowerCase()
    ).length;
    return (
      <AddCountryPaper {...other}>
        {filteredCountriesLength === 0 &&
          state.autocompleteAuthorCountry !== "" && (
            <AddCountryDiv
              onMouseDown={(event) => {
                event.preventDefault();
              }}
            >
              {state.autocompleteAuthorCountry}
              <AddCountryButton
                onClick={() =>
                  addCountryButtonPressed(state.autocompleteAuthorCountry)
                }
              >
                ADD
              </AddCountryButton>
            </AddCountryDiv>
          )}
        {children}
      </AddCountryPaper>
    );
  };

  const apiSubmitCall = (
    fetchString: string,
    method: string,
    formData: FormData
  ) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: "SET_LOADING_STATUS", loadingStatus: true });
    dispatch({ type: "SET_BUTTON_DISABLE", status: true });
    const formData = new FormData();
    for (const key in formInput) {
      if (key != "image" && key != "current_city") {
        formData.append(key, formInput[key]);
      }
    }
    formData.append("current_city", state.currentCity);

    for (const index in state.tagArray) {
      formData.append("tags", state.tagArray[index]);
    }

    let fetchString = "/api/story";
    let method = "POST";

    if (id) {
      // if a new image was uploaded, add the image to the formdata
      if (state.newImage === "") {
        formData.append("image", formInput["image"]);
      }
      fetchString = `/api/story/${id}`;
      method = "PUT";
    } else {
      formData.append("image", formInput["image"]);
    }

    formData.append("author_country", state.authorCountry);
    if (state.authorCountry === state.addedCountry) {
      const countryNameJsonBody = [
        {
          country_name: state.addedCountry,
        },
      ];

      const jsonBody = JSON.stringify(countryNameJsonBody);
      fetch("/api/countries", {
        method: "POST",
        body: jsonBody,
      })
        .then((response) => response.text())
        .then(() => apiSubmitCall(fetchString, method, formData))
        .catch((error) => console.log("Error: ", error));
    } else {
      apiSubmitCall(fetchString, method, formData);
    }
  };

  const pageTitle = id ? "Edit Story" : "Upload New Story";
  const submitButtonText = id ? "Save Edits" : "Upload";

  return (
    <>
      <AppBar color="default" position="sticky">
        <Grid container direction="row">
          <Grid item xs={6}>
            <StyledContainer>
              <StyledLink href="/admin/allstories">
                <ArrowBackIcon />
              </StyledLink>
              <UploadStoriesHeading>{pageTitle}</UploadStoriesHeading>
            </StyledContainer>
          </Grid>
          <Grid
            container
            item
            spacing={3}
            xs={6}
            direction="row"
            alignContent="center"
            justify="flex-end"
          >
            {id && (
              <Grid
                item
                direction="row"
                alignContent="center"
                justify="flex-end"
              >
                <StyledDelete
                  onClick={() => setDialogOpenState(true)}
                  color="primary"
                  variant="outlined"
                >
                  Delete Story
                </StyledDelete>
              </Grid>
            )}
            <Grid item direction="row" alignContent="center" justify="flex-end">
              <StyledButton
                disabled={!hasAllRequiredFields}
                onClick={() =>
                  dispatch({ type: "SET_DRAWER_OPEN", drawerOpen: true })
                }
                color="primary"
                variant="outlined"
              >
                Preview
              </StyledButton>
            </Grid>
            <Grid item direction="row" alignContent="center" justify="flex-end">
              <StyledButton
                disabled={state.disabled || !hasAllRequiredFields}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                {submitButtonText}
              </StyledButton>
            </Grid>
          </Grid>
        </Grid>
        {state.loading ? <StyledLinearProgress /> : null}
      </AppBar>
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
                <StyledAutocomplete
                  color="Primary"
                  loading={!countries}
                  options={countries || []}
                  forcePopupIcon
                  name="author_country"
                  id="select-label-country"
                  freeSolo
                  // if user adds a new country display it as the default value, if not, look for prefilled value (edit stories)
                  // prettier-ignore
                  value={state.addedCountry != "" ? state.addedCountry : (state.authorCountry ? state.authorCountry : null)}
                  onInputChange={(_, newValue) =>
                    dispatch({
                      type: "SET_AUTOCOMPLETE_COUNTRY",
                      autocompleteCountry: newValue,
                    })
                  }
                  onChange={(_, newValue) => {
                    setFormInput({
                      ["author_country"]: newValue,
                    });
                    dispatch({ type: "SET_AUTHOR_COUNTRY", country: newValue });
                  }}
                  renderInput={(params) => {
                    return (
                      <TextField
                        {...params}
                        required
                        variant="outlined"
                        label=""
                        placeholder="Enter story&#39;s country of origin *"
                      />
                    );
                  }}
                  PaperComponent={addNewCountry}
                />
              </FormControl>
              <UploadLabelsText>Current City</UploadLabelsText>
              <StyledAutocomplete
                color="Primary"
                loading={!citiesList}
                options={citiesList || []}
                ListboxComponent={
                  ListboxComponent as React.ComponentType<
                    React.HTMLAttributes<HTMLElement>
                  >
                }
                renderGroup={renderGroup}
                forcePopupIcon
                freeSolo
                name="current_city"
                id="select-label-city"
                value={state.currentCity != "" ? state.currentCity : null}
                onChange={(_, newValue) => {
                  setFormInput({
                    ["current_city"]: newValue,
                  });
                  dispatch({ type: "SET_CURRENT_CITY", city: newValue });
                }}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      required
                      variant="outlined"
                      label=""
                      placeholder="Enter where story was written *"
                    />
                  );
                }}
              />
              <FormControl>
                <UploadLabelsText>Year Published</UploadLabelsText>
                <StyledSelect
                  variant="outlined"
                  value={formInput.year ? formInput.year : ""}
                  onChange={handleChange}
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
                <StyledAutocomplete
                  autoHighlight
                  multiple
                  id="tags-outlined"
                  name="tags"
                  freeSolo
                  options={tagOptions ? tagOptions : [""]}
                  filterSelectedOptions
                  onChange={(_, newValue) =>
                    dispatch({ type: "SET_TAG_VALUES", tags: newValue })
                  }
                  value={state.tagArray ? state.tagArray : [""]}
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
                {state.newImage == "" ? (
                  <div>
                    <UploadLabelsText>Add Image</UploadLabelsText>
                    <StyledDropzoneArea
                      showFileNames
                      maxFileSize={7000000}
                      acceptedFiles={["image/*"]}
                      filesLimit={1}
                      dropzoneText={
                        "Drag image here or select from device - Maximum Supported File Size is 7MB."
                      }
                      onChange={(files) => {
                        setImage(files);
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <UploadLabelsText>Current Image:</UploadLabelsText>
                    <br />
                    <StyledImage src={currentStory.image_url} />
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={() =>
                        dispatch({ type: "ADD_IMAGE", addedImage: "" })
                      }
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
            <Snackbar
              open={state.uploadErrorState}
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
                {`Are you sure you want to delete ${formInput.title}?`}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  This cannot be undone
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogDisagree} color="primary">
                  Cancel
                </Button>
                <StyledConfirmDelete
                  onClick={handleDialogAgree}
                  color="primary"
                >
                  Delete Story
                </StyledConfirmDelete>
              </DialogActions>
            </Dialog>
          </FormControl>
        </form>
      </StyledGrid>
      <StoryDrawer
        story={story}
        onClose={() => dispatch({ type: "SET_DRAWER_OPEN", drawerOpen: false })}
      />
    </>
  );
};
