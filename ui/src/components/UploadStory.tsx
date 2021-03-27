import {
  Button,
  Checkbox,
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
  Paper,
} from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert";
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from "@material-ui/lab/Autocomplete";
import { countReset } from "console";
import { DropzoneArea } from "material-ui-dropzone";
import * as React from "react";
import { KeyboardEvent, useReducer, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import { VariableSizeList, ListChildComponentProps } from "react-window";
import ListSubheader from "@material-ui/core/ListSubheader";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import countriesList from "../data/countries.json";
// import citiesList from "../data/cities.json";
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
  && {
    width: 30vw;
    margin-left: 24px;
  }
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

const LISTBOX_PADDING = 8; // px

function renderRow(props: ListChildComponentProps) {
  const { data, index, style } = props;
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + LISTBOX_PADDING,
    },
  });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data: any) {
  const ref = React.useRef<VariableSizeList>(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
}

// Adapter for react-window
const ListboxComponent = React.forwardRef<HTMLDivElement>(
  function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), { noSsr: true });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child: React.ReactNode) => {
      if (React.isValidElement(child) && child.type === ListSubheader) {
        return 48;
      }

      return itemSize;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  }
);

const renderGroup = (params: AutocompleteRenderGroupParams) => [
  <ListSubheader key={params.key} component="div">
    {params.group}
  </ListSubheader>,
  params.children,
];

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
  const [authorCountry, setAuthorCountry] = useState(story.author_country);
  const [autocompleteAuthorCountry, setAutocompleteAuthorCountry] = useState(
    story.author_country
  );
  const [addedCountry, setAddedCountry] = useState("");
  const [newImage, setNewImage] = useState(story.image_url);
  const [disabled, setDisabled] = useState(false);
  //handleSubmit component states
  const [dialogOpenState, setDialogOpenState] = useState(false);
  const [uploadErrorState, setErrorOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: countries, error: errorCountries } = useSWR<string[]>(
    "/api/countries"
  );

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
      // author_country: story.author_country,
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

  const addCountryButtonPressed = (autocompleteAuthorCountry: string) => {
    setAddedCountry(autocompleteAuthorCountry);
    setAuthorCountry(autocompleteAuthorCountry);
    countries.push(autocompleteAuthorCountry);
  };

  const newCountry = ({ children, ...other }) => (
    <AddCountryPaper {...other}>
      {countries.filter(
        (str) => str.toLowerCase() == autocompleteAuthorCountry.toLowerCase()
      ).length == 0 &&
        autocompleteAuthorCountry != "" && (
          <AddCountryDiv
            onMouseDown={(event) => {
              event.preventDefault();
            }}
          >
            {autocompleteAuthorCountry}
            <AddCountryButton
              onClick={() => addCountryButtonPressed(autocompleteAuthorCountry)}
            >
              ADD
            </AddCountryButton>
          </AddCountryDiv>
        )}

      {children}
    </AddCountryPaper>
  );

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
    console.log("HERE");
    event.preventDefault();
    setLoading(true);
    setDisabled(true);
    const formData = new FormData();
    for (const key in formInput) {
      if (key != "image") {
        formData.append(key, formInput[key]);
      }
    }

    for (const index in tagArray) {
      formData.append("tags", tagArray[index]);
    }

    let fetchString = "/api/story";
    let method = "POST";

    if (id) {
      // if a new image was uplaoded, add the image to the formdata
      if (newImage == "") {
        formData.append("image", formInput["image"]);
      }
      fetchString = `/api/story/${id}`;
      method = "PUT";
    } else {
      formData.append("image", formInput["image"]);
    }

    formData.append("author_country", authorCountry);
    if (authorCountry === addedCountry) {
      let empArray = [
        {
          country_name: addedCountry,
        },
      ];

      const jsonBody = JSON.stringify(empArray);
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

  const successMessage = id ? "Story Edit Success!" : "Story Upload Success!";

  if (error) return <div>Error fetching tags!</div>;
  if (errorCountries) return <div>Error fetching countries array!</div>;

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
                  value={addedCountry != "" ? addedCountry : (authorCountry ? authorCountry : null)}
                  onInputChange={(_, newValue) =>
                    setAutocompleteAuthorCountry(newValue)
                  }
                  onChange={(_, newValue) => setAuthorCountry(newValue)}
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
                  PaperComponent={newCountry}
                />
              </FormControl>
              <UploadLabelsText>Current City</UploadLabelsText>
              {/* <StyledInputLabel id="Current Location">
                Enter where story was written
              </StyledInputLabel> */}
              <StyledAutocomplete
                color="Primary"
                disableListWrap
                loading={!countries}
                options={countries || []}
                ListboxComponent={
                  ListboxComponent as React.ComponentType<
                    React.HTMLAttributes<HTMLElement>
                  >
                }
                renderGroup={renderGroup}
                forcePopupIcon
                name="current_city"
                id="select-label-city"
                value={formInput.current_city ? formInput.current_city : null}
                //TODO: double check that this onChange method works
                onChange={handleChange}
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
              {/* <StyledSelect
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
              </StyledSelect> */}
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
