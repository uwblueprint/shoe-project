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

import { useParams } from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DropzoneArea } from "material-ui-dropzone";
import * as React from "react";
import { UploadStory } from "../components/UploadStory";
import { Story } from "../types/index";
import { KeyboardEvent, useReducer, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

export const Edit: React.FC = () => {
  const { id } = useParams();
  const { data: storyDetails, error } = useSWR<Story>(`/api/story/${id}`);

  if (error) return <div>Error fetching story!</div>;
  return (
    <div>
      <p>{id}</p>
      <UploadStory story={storyDetails}></UploadStory>
    </div>
  );
};
