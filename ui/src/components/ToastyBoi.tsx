import Slide from "@material-ui/core/Slide";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import * as React from "react";

import { colors } from "../styles/colors";
type SvgIconComponent = typeof SvgIcon;

const { forwardRef, useImperativeHandle } = React;

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
interface SnackBarMessage {
  message: string;
  icon: SvgIconComponent;
  key: number;
}

const ToastyBoi = forwardRef((props, ref) => {
  const [snackPack, setSnackPack] = React.useState<SnackBarMessage[]>([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState<SnackBarMessage | "">(
    ""
  );

  React.useEffect(() => {
    // Set a new snack when we don't have an active one
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);

      // Close an active snack when a new one is added
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const classes = useStyles();

  const showToast = (message: string, icon: SvgIconComponent) => {
    setSnackPack((prev) => [
      ...prev,
      { message, icon, key: new Date().getTime() },
    ]);
  };

  useImperativeHandle(ref, () => {
    return {
      showToast: showToast,
    };
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo("");
  };

  const Icon = messageInfo ? messageInfo.icon : "";

  return (
    <>
      <Snackbar
        key={messageInfo ? messageInfo.key : ""}
        open={open}
        onClose={handleClose}
        onExited={handleExited}
        TransitionComponent={Slide}
        message={
          !messageInfo ? (
            ""
          ) : (
            <span className={classes.span}>
              <Icon className={classes.icon} />
              {messageInfo.message}
            </span>
          )
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
