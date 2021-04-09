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
import ListSubheader from "@material-ui/core/ListSubheader";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Alert from "@material-ui/lab/Alert";
import Autocomplete, {
  AutocompleteRenderGroupParams,
} from "@material-ui/lab/Autocomplete";
import { DropzoneArea } from "material-ui-dropzone";
import * as React from "react";
import { KeyboardEvent, useReducer, useState } from "react";
import { Redirect } from "react-router-dom";
import { ListChildComponentProps, VariableSizeList } from "react-window";
import styled from "styled-components";
import useSWR from "swr";

import { StoryDrawer } from "../components";
import citiesList from "../data/cities.json";
import { colors } from "../styles/colors";
import { device } from "../styles/device";
import { UploadLabelsText, UploadStoriesHeading } from "../styles/typography";
import { Author, Story } from "../types";

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

function useResetCache(data: number) {
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
  currentStory: Story;
  bio: string;
}

export const UploadStory: React.FC<StoryProps> = ({
  id,
  currentStory,
  bio,
}: StoryProps) => {
  const { data: tagOptions, error } = useSWR<string[]>("/api/tags");
  const [tagArray, setTagArrayValues] = useState(currentStory.tags);
  const [authorCountry, setAuthorCountry] = useState(
    currentStory.author_country
  );
  const [currentCity, setCurrentCity] = useState(
    currentStory.current_city.toUpperCase()
  );
  const [autocompleteAuthorCountry, setAutocompleteAuthorCountry] = useState(
    currentStory.author_country
  );
  const [addedCountry, setAddedCountry] = useState("");
  const [newImage, setNewImage] = useState(currentStory.image_url);
  const [disabled, setDisabled] = useState(false);
  //handleSubmit component states
  const [dialogOpenState, setDialogOpenState] = useState(false);
  const [uploadErrorState, setErrorOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: countries, error: errorCountries } = useSWR<string[]>(
    "/api/countries"
  );

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
    if (isDrawerOpen) {
      const storyFromData: Story = {
        image_url:
          newImage == ""
            ? URL.createObjectURL(formInput.image)
            : currentStory.image_url,
        video_url: formInput.video_url as string,
        title: formInput.title as string,
        content: formInput.content as string,
        summary: formInput.summary as string,
        author_first_name: formInput.author_first_name as string,
        author_last_name: formInput.author_last_name as string,
        author_country: authorCountry as string,
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
  }, [isDrawerOpen, formInput]);

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

  const storySubmitDialog = (result) => {
    setLoading(false);
    setDisabled(false);
    const resultMessage = JSON.parse(result).message;
    if (
      resultMessage === "Story Added Successfully" ||
      resultMessage === "Story Updated successfully"
    ) {
      //TODO: Fix redirect (currently does nothing)
      console.log("HERE");
      return <Redirect to="/admin" />;
    } else {
      setErrorOpen(true);
    }
  };

  const addCountryButtonPressed = (autocompleteAuthorCountry: string) => {
    setFormInput({
      ["author_country"]: autocompleteAuthorCountry,
    });
    setAddedCountry(autocompleteAuthorCountry);
    setAuthorCountry(autocompleteAuthorCountry);
    countries.push(autocompleteAuthorCountry);
  };

  const addNewCountry = ({ children, ...other }) => (
    <AddCountryPaper {...other}>
      {countries.filter(
        (str) => str.toLowerCase() === autocompleteAuthorCountry.toLowerCase()
      ).length === 0 &&
        autocompleteAuthorCountry !== "" && (
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
    event.preventDefault();
    setLoading(true);
    setDisabled(true);
    const formData = new FormData();
    for (const key in formInput) {
      if (key != "image" && key != "current_city") {
        formData.append(key, formInput[key]);
      }
    }
    formData.append("current_city", currentCity);

    for (const index in tagArray) {
      formData.append("tags", tagArray[index]);
    }

    let fetchString = "/api/story";
    let method = "POST";

    if (id) {
      // if a new image was uploaded, add the image to the formdata
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
      const countryNameJsonBody = [
        {
          country_name: addedCountry,
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

  const successMessage = id ? "Story Edit Success!" : "Story Upload Success!";
  const pageTitle = id ? "Edit Story" : "Upload New Story";
  const submitButtonText = id ? "Save Edits" : "Upload";

  if (error) return <div>Error fetching tags!</div>;
  if (errorCountries) return <div>Error fetching countries array!</div>;

  return (
    <>
      <AppBar color="default" position="sticky">
        <Grid container direction="row">
          <Grid item xs={6}>
            <UploadStoriesHeading>{pageTitle}</UploadStoriesHeading>
          </Grid>
          <Grid
            container
            item
            xs={6}
            direction="row"
            alignContent="center"
            justify="flex-end"
          >
            <StyledButton
              disabled={!hasAllRequiredFields}
              onClick={() => setIsDrawerOpen(true)}
              color="primary"
              variant="outlined"
            >
              Preview
            </StyledButton>
            <StyledButton
              disabled={disabled || !hasAllRequiredFields}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {submitButtonText}
            </StyledButton>
          </Grid>
        </Grid>
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
                  value={addedCountry != "" ? addedCountry : (authorCountry ? authorCountry : null)}
                  onInputChange={(_, newValue) =>
                    setAutocompleteAuthorCountry(newValue)
                  }
                  onChange={(_, newValue) => {
                    setFormInput({
                      ["author_country"]: newValue,
                    });
                    setAuthorCountry(newValue);
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
                value={currentCity != "" ? currentCity : null}
                onChange={(_, newValue) => {
                  setFormInput({
                    ["current_city"]: newValue,
                  });
                  setCurrentCity(newValue);
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
                      onClick={() => setNewImage("")}
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
              open={uploadErrorState}
              autoHideDuration={5000}
              onClose={setErrorUploadingState}
            >
              <Alert variant="filled" severity="error">
                Error uploading story!
              </Alert>
            </Snackbar>
          </FormControl>
        </form>
      </StyledGrid>
      <StoryDrawer story={story} onClose={() => setIsDrawerOpen(false)} />
      {loading ? <StyledLinearProgress /> : null}
    </>
  );
};
