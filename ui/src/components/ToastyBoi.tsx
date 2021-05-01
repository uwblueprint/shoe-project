import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import * as React from "react";

import { colors } from "../styles/colors";
type SvgIconComponent = typeof SvgIcon;

const { forwardRef, useImperativeHandle } = React;

const ToastyBoi = forwardRef((props, ref) => {
  const [toastState, setToastState] = React.useState<{
    open?: boolean;
    message?: string;
    icon?: SvgIconComponent;
  }>({
    open: false,
    message: "",
    icon: null,
  });

  const useStyles = makeStyles({
    root: {
      backgroundColor: colors.primaryLight3,
      color: colors.primaryDark2,
      fontSize: 16,
      fontWeight: 500,

      "& .MuiSnackbarContent-message": {
        margin: "auto",
        fontFamily: "Poppins",
      },
    },
    icon: {
      fontSize: 20,
      marginRight: "8px",
      color: colors.primaryDark2,
    },
    span: {
      display: "flex",
    },
  });
  const classes = useStyles();

  const showToast = (message: string, icon: SvgIconComponent) => {
    setToastState({
      open: true,
      message,
      icon,
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

  const Icon = toastState.icon;

  return (
    <>
      <Snackbar
        open={toastState.open}
        onClose={handleClose}
        TransitionComponent={Slide}
        message={
          <span className={classes.span}>
            <Icon className={classes.icon} />
            {toastState.message}
          </span>
        }
        autoHideDuration={5000}
        ContentProps={{
          className: classes.root,
        }}
      />
    </>
  );
});

export default ToastyBoi;
