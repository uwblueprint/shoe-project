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

interface TableData {
  id: number;
  title: string;
  city: string;
  year: number;
  author: string;
  country: string;
  is_visible: boolean;
}

function createData(
  id: number,
  title: string,
  city: string,
  year: number,
  author: string,
  country: string,
  is_visible: boolean
): TableData {
  return { id, title, city, year, author, country, is_visible };
}

export const AllStories: React.FC = () => {
  const { data: allStories, error } = useSWR<Story[]>("/api/stories");

  if (allStories) {
    const rows: TableData[] = [];
    for (let i = 0; i < allStories.length; i += 1) {
      rows.push(
        createData(
          i,
          allStories[i].title,
          allStories[i].current_city,
          allStories[i].year,
          allStories[i].author_first_name,
          allStories[i].author_country,
          allStories[i].is_visible
        )
      );
    }
  }

  if (error) return <div>Error returning stories data!</div>;
  if (!allStories) return <div>Loading all stories table..</div>;

  return (
    <Paper style={{ height: 1500, width: "100%" }}>
      <VirtualizedTable
        // classes = MuiVirtualizedTableProps.
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
            dataKey: "city",
          },
          {
            width: 100,
            label: "Year",
            dataKey: "year",
          },
          {
            width: 300,
            label: "Author Name",
            dataKey: "author",
          },
          {
            width: 250,
            label: "Country of Origin",
            dataKey: "country",
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
