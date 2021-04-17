import * as React from "react";
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';

import { colors } from "../styles/colors";
import Autocomplete from "@material-ui/lab/Autocomplete";

const { forwardRef, useImperativeHandle } = React;

const ToastyBoi = forwardRef((props, ref) => {
  const [state, setState] = React.useState<{ open?: boolean; message?: string}>({
    open: false,
    message: ""
  });

  const useStyles = makeStyles({
    root: {
      backgroundColor: colors.primaryLight3,
      color: colors.primaryDark2,
      fontSize: 16,
      fontWeight: 400,

      "& .MuiSnackbarContent-message": {
        margin: "auto"
      }

    }
  })
  const classes = useStyles();

  const showToast = (message: string) => {
    console.log("MESSAGE RECEIVED: " + message);
    setState({
      open: true,
      message
    });
  };

  useImperativeHandle(ref, () => {
    return {
      showToast: showToast
    }
  })
  

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  return (
    <div>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={Slide}
        message={state.message}
        autoHideDuration={5000}
        ContentProps = {{
          className: classes.root
        }}
      />
    </div>
  );
})

export default ToastyBoi;