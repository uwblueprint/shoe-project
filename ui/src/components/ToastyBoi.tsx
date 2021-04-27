import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import * as React from "react";

import { colors } from "../styles/colors";

const { forwardRef, useImperativeHandle } = React;

const ToastyBoi = forwardRef((props, ref) => {
  const [toastState, setToastState] = React.useState<{
    open?: boolean;
    message?: string;
  }>({
    open: false,
    message: "",
  });

  const useStyles = makeStyles({
    root: {
      backgroundColor: colors.primaryLight3,
      color: colors.primaryDark2,
      fontSize: 16,
      fontWeight: 400,

      "& .MuiSnackbarContent-message": {
        margin: "auto",
        fontFamily: "Poppins",
      },
    },
  });
  const classes = useStyles();

  const showToast = (message: string) => {
    setToastState({
      open: true,
      message,
    });
  };

  useImperativeHandle(ref, () => {
    return {
      showToast: showToast,
    };
  });

  const handleClose = () => {
    setToastState({
      ...toastState,
      open: false,
    });
  };

  return (
    <>
      <Snackbar
        open={toastState.open}
        onClose={handleClose}
        TransitionComponent={Slide}
        message={toastState.message}
        autoHideDuration={5000}
        ContentProps={{
          className: classes.root,
        }}
      />
    </>
  );
});

export default ToastyBoi;
