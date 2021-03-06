import Switch from "@material-ui/core/Switch";
import TableCell from "@material-ui/core/TableCell";
import clsx from "clsx";
import * as React from "react";
import { AutoSizer, Column, Table, TableHeaderProps } from "react-virtualized";

import { Story } from "../types/index";

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

export interface MuiVirtualizedTableProps {
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
  rowGetter: (row: Row) => Story;
  rowHeight?: number;
}

export function MuiVirtualizedTable({
  classes,
  columns,
  headerHeight = 75,
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
