import Paper from "@material-ui/core/Paper";
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import TableCell from "@material-ui/core/TableCell";
import clsx from "clsx";
import * as React from "react";
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
} from "react-virtualized";
import useSWR from "swr";

import { colors } from "../styles/colors";
import { Story } from "../types";

declare module "@material-ui/core/styles/withStyles" {
  interface BaseCSSProperties {
    flip?: boolean;
  }
}

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

interface ColumnData {
  dataKey: string;
  label: string;
  numeric?: boolean;
  toggle?: true;
  width: number;
}

interface Row {
  index: number;
}

interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  columns: ColumnData[];
  headerHeight?: number;
  onRowClick?: () => void;
  rowCount: number;
  rowGetter: (row: Row) => TableData;
  rowHeight?: number;
}

class MuiVirtualizedTable extends React.PureComponent<
  MuiVirtualizedTableProps
> {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 70,
  };

  getRowClassName = ({ index }: Row) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={
          (columnIndex != null && columns[columnIndex].numeric) || false
            ? "right"
            : "left"
        }
      >
        {columns[columnIndex].toggle && (
          <Switch disabled inputProps={{ "aria-label": "disabled checkbox" }} />
        )}
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? "right" : "left"}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: "inherit",
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

interface TableData {
  id: number;
  title: string;
  city: string;
  year: string;
  author: string;
  country: string;
  is_visible: boolean;
}

function createData(
  id: number,
  title: string,
  city: string,
  year: string,
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
    for (let i = 0; i < 33; i += 1) {
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
