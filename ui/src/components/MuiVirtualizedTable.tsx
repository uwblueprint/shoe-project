import { createStyles, Theme, WithStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
import TableCell from "@material-ui/core/TableCell";
import clsx from "clsx";
import * as React from "react";
import {
  AutoSizer,
  Column,
  Table,
  TableHeaderProps,
} from "react-virtualized";

import { colors } from "../styles/colors";

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

interface TableData {
  id: number;
  title: string;
  city: string;
  year: string;
  author: string;
  country: string;
  is_visible: boolean;
}

export interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  classes: Record<
    | "flexContainer"
    | "table"
    | "tableRow"
    | "tableRowHover"
    | "tableCell"
    | "noClick",
    string
  >;
  columns: ColumnData[];
  headerHeight?: number;
  onRowClick?: () => void;
  rowCount: number;
  rowGetter: (row: Row) => TableData;
  rowHeight?: number;
}

export function MuiVirtualizedTable({
  classes,
  columns,
  headerHeight = 48,
  onRowClick,
  rowCount,
  rowGetter,
  rowHeight = 70,
}: MuiVirtualizedTableProps): JSX.Element {
  const getRowClassName = ({ index }: Row) => {
    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  const TableCellRenderer = ({ cellData, columnIndex }) => {
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

  const headerRenderer = ({
    label,
    columnIndex,
  }: TableHeaderProps & { columnIndex: number }) => {
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

  const tableProps = { onRowClick, rowCount, rowGetter };
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
          rowClassName={getRowClassName}
        >
          {columns.map(({ dataKey, ...other }, index) => {
            return (
              <Column
                key={dataKey}
                headerRenderer={(headerProps) =>
                  headerRenderer({
                    ...headerProps,
                    columnIndex: index,
                  })
                }
                className={classes.flexContainer}
                cellRenderer={TableCellRenderer}
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
