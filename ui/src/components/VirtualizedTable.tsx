import { makeStyles } from "@material-ui/core/styles";
import MuiTable from "mui-virtualized-table";
import * as React from "react";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

import { colors } from "../styles/colors";

const useVirtualizedTableStyles = makeStyles({
  root: {
    "& .MuiTableCell-root": {
      backgroundColor: colors.white,
      fontFamily: "Poppins",
    },
    "& .topLeftGrid, & .topRightGrid": {
      border: "none",
    },
    "& .bottomLeftGrid": {
      border: "none",
    },
  },
  headerCell: {
    fontSize: "12px",
  },
  stickyCell: {
    display: "flex",
    alignItems: "center",
  },
  stickyColumnClass: {},
});

interface VirtualizedTableProps {
  data: [];
  columns: [];
  order: "desc" | "asc";
  orderBy: string;
}

export function VirtualizedTable({
  data,
  columns,
  order,
  orderBy,
}: VirtualizedTableProps): JSX.Element {
  const classes = useVirtualizedTableStyles();
  return (
    <div className={classes.root} style={{ height: "calc(100vh)" }}>
      <AutoSizer>
        {({ width }) => (
          <MuiTable
            data={data}
            columns={columns}
            orderBy={orderBy}
            orderDirection={order}
            includeHeaders
            cellProps={(column, row) => {
              /* alternate the background colour of rows between colors.white and colors.primaryLight6 */
              if (data.indexOf(row) > 0 && data.indexOf(row) % 2 !== 0) {
                return {
                  style: {
                    backgroundColor: colors.primaryLight6,
                  },
                };
              }
              if (column.name === columns[0].name) {
                return {
                  className: `
                    ${classes.stickyColumnClass}
                    ${classes.stickyCell}
                  `,
                };
              }
            }}
            width={width}
            maxHeight={800}
            fixedRowCount={1}
            fixedColumnCount={1}
            style={{ tableLayout: "fixed", backgroundColor: colors.white }}
          />
        )}
      </AutoSizer>
    </div>
  );
}

export default VirtualizedTable;
