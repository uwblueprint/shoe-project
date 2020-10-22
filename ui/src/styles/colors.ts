interface ColorInterface {
  neutral: string;
  grey: string;
  black: string;
  white: string;
  primary: string;
  primaryDark1: string;
  primaryDark2: string;
  primaryLight1: string;
  primaryLight2: string;
  primaryLight3: string;
  primaryLight4: string;
  secondary: string;
  secondaryDark1: string;
  secondaryDark2: string;
  secondaryLight1: string;
  secondaryLight2: string;
  secondaryLight3: string;
  secondaryLight4: string;
}

/* Primary Colours */
const teal = "#6FBAC6";
const tealDark1 = "#2D8694";
const tealDark2 = "#1D626D";
const tealLight1 = "#8CC7D1";
const tealLight2 = "#B7DFE5";
const tealLight3 = "#D2EDF1";
const tealLight4 = "#EBF7F9";

/* Secondary Colours */
const red = "#C42626";
const redDark1 = "#8F1717";
const redDark2 = "#6F1010";
const redLight1 = "#E44343";
const redLight2 = "#EA7B7B";
const redLight3 = "#F5B8B8";
const redLight4 = "#FCDCDC";

/* Neutrals */
const neutral = "#EAF4F4";
const grey = "#F2F6F8";
const black = "#000000";
const white = "#FFFFFF";

const colors: ColorInterface = {
  neutral,
  grey,
  black,
  white,
  primary: teal,
  primaryDark1: tealDark1,
  primaryDark2: tealDark2,
  primaryLight1: tealLight1,
  primaryLight2: tealLight2,
  primaryLight3: tealLight3,
  primaryLight4: tealLight4,
  secondary: red,
  secondaryDark1: redDark1,
  secondaryDark2: redDark2,
  secondaryLight1: redLight1,
  secondaryLight2: redLight2,
  secondaryLight3: redLight3,
  secondaryLight4: redLight4,
};

export default colors;
