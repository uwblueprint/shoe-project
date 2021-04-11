import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

import { colors } from "../../../styles/colors";

export const VisibilitySwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 48,
      height: 24,
      padding: 0,
    },
    switchBase: {
      padding: 3.5,
      color: theme.palette.grey[500],
      "&$checked": {
        transform: "translateX(24px)",
        color: colors.white,
        "& + $track": {
          opacity: 1,
          backgroundColor: colors.primaryDark1,
        },
      },
    },
    thumb: {
      width: 16,
      height: 16,
      boxShadow: "none",
      color: colors.white,
    },
    track: {
      borderRadius: 15,
      opacity: 0.7,
      backgroundColor: colors.grey,
    },
    checked: {},
  })
)(Switch);
