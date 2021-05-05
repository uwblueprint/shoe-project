import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function a11yProps(index: number): Record<string, unknown> {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function AllStoriesTabs(props: TabPanelProps): JSX.Element {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component={"span"} variant={"body2"}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}
