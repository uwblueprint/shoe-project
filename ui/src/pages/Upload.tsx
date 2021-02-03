import * as React from "react";
import { Redirect } from "react-router-dom";
import { FormControl } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { Grid }from '@material-ui/core/';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';


export const Upload: React.FC = () => {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Grid>
      <FormControl>
      <TextField required id="standard-required" label="Story Title" defaultValue="Lorem Ipsum" />
      <TextField required id="standard-required" label="Author" defaultValue="Jane Doe" />
    
      </FormControl>

    <FormControl>
    <FormControl>
        <InputLabel id="Country of Origin">Country of Origin</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={14}
          onChange={handleChange}
        >
          <MenuItem value={10}>China</MenuItem>
          <MenuItem value={20}>India</MenuItem>
          <MenuItem value={30}>Russia</MenuItem>
        </Select>
</FormControl>
     
        <InputLabel id="Current Location">Current Location</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={14}
          onChange={handleChange}
        >
          <MenuItem value={10}>Toronto</MenuItem>
          <MenuItem value={20}>Calgary</MenuItem>
          <MenuItem value={30}>Vancouver</MenuItem>
        </Select>
        <InputLabel id="demo-simple-select-label">Year Published</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={14}
          onChange={handleChange}
        >
          <MenuItem value={10}>2021</MenuItem>
          <MenuItem value={20}>2020</MenuItem>
          <MenuItem value={30}>2019</MenuItem>
        </Select>
        </FormControl>

    </Grid>
  
  );
  }