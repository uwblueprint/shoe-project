import Paper from "@material-ui/core/Paper";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import * as React from "react";
import useSWR from "swr";

import { MuiVirtualizedTable } from "../components/MuiVirtualizedTable";
import { colors } from "../styles/colors";
import { Story } from "../types";

const styles = (theme: Theme) =>
  createStyles({
    flexContainer: {
      display: "flex",
      alignItems: "left",
      boxSizing: "border-box",
    },
    table: {
      "& .ReactVirtualized__Table__headerRow": {
        flip: false,
        paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
        backgroundColor: colors.primaryLight4,
        fontWeight: 800,
      },
      "& .ReactVirtualized__Grid ReactVirtualized__Table__Grid": {},
    },
    tableRow: {
      cursor: "pointer",
      color: colors.grey,
    },
    tableRowHover: {
      "&:hover": {
        backgroundColor: colors.black,
      },
    },
    tableCell: {
      flex: 2,
    },
    noClick: {
      cursor: "initial",
    },
  });

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

//Data types that are included in All Stories table
function createData(
  id: number,
  title: string,
  current_city: string,
  year: number,
  is_visible: boolean,
  author_first_name: string,
  author_country: string
) {
  return {
    id,
    title,
    current_city,
    year,
    author_first_name,
    author_country,
    is_visible,
  };
}

export const AllStories: React.FC = () => {
  const { data: allStories, error } = useSWR<Story[]>("/api/stories");
  let rows = [];
  if (allStories) {
    rows = allStories.map((story, i) =>
      createData(
        i,
        story.title,
        story.current_city,
        story.year,
        story.is_visible,
        story.author_first_name,
        story.author_country
      )
    );
  }
  if (error) return <div>Error returning stories data!</div>;
  if (!allStories) return <div>Loading all stories table..</div>;

  return (
    <Paper style={{ height: 1500, width: "100%" }}>
      <VirtualizedTable
        rowCount={rows.length}
        rowGetter={({ index }) => rows[index]}
        columns={[
          {
            width: 50,
            label: "ID",
            dataKey: "id",
            numeric: true,
          },
          {
            width: 300,
            label: "Story Name",
            dataKey: "title",
          },
          {
            width: 120,
            label: "Current City",
            dataKey: "current_city",
          },
          {
            width: 100,
            label: "Year",
            dataKey: "year",
          },
          {
            width: 300,
            label: "Author Name",
            dataKey: "author_first_name",
          },
          {
            width: 250,
            label: "Country of Origin",
            dataKey: "author_country",
          },
          {
            width: 150,
            label: "Show on Map",
            dataKey: "is_visible",
            toggle: true,
          },
        ]}
      />
    </Paper>
  );
};
