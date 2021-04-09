import { makeStyles } from "@material-ui/core/styles";
import MuiTable from "mui-virtualized-table";
import * as React from "react";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

import { StoryView } from "../pages/AllStories";
import { colors } from "../styles/colors";
import { fontSize } from "../styles/typography";

const useVirtualizedTableStyles = makeStyles({
  root: {
    marginLeft: "55px",

    "& .MuiTableCell-root": {
      backgroundColor: colors.white,
      fontFamily: "Poppins",
      padding: "0px",
      fontStyle: "normal",
      fontWeight: "bold",
      fontSize: fontSize.subtitle,
      lineHeight: "120%",
      marginRight: "none",
    },
    "& .topLeftGrid, & .topRightGrid": {
      border: "none",
      backgroundColor: "transparent",
    },
    "& .bottomLeftGrid": {
      border: "none",
    },
  },
  stickyCell: {
    display: "flex",
    alignItems: "center",
  },
  stickyColumnClass: {},
});

type TableColumn = {
  name: string;
  width: number;
  onHeaderClick?: () => void;
  header: JSX.Element | string;
  cell?: (any) => JSX.Element;
};

interface VirtualizedTableProps {
  data: StoryView[];
  columns: TableColumn[];
  order: "desc" | "asc";
  orderBy: string;
  setClickedRow: (rowId: number | undefined) => void;
}

export function VirtualizedTable({
  data,
  columns,
  order,
  orderBy,
  setClickedRow,
}: VirtualizedTableProps): JSX.Element {
  const classes = useVirtualizedTableStyles();
  return (
    <div className={classes.root} style={{ width: "auto" }}>
      <AutoSizer>
        {({ height, width }) => (
          <MuiTable
            data={data}
            columns={columns}
            orderBy={orderBy}
            orderDirection={order}
            includeHeaders
            onCellClick={(e, { rowData }) => {
              if (e.target.type === "checkbox") {
                return;
              }
              const id: number = rowData?.ID;
              if (id) {
                setClickedRow(id);
              }
            }}
            cellProps={(column) => {
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
            height={height}
            maxHeight={800}
            fixedRowCount={1}
            style={{ tableLayout: "fixed", backgroundColor: colors.white }}
          />
        )}
      </AutoSizer>
    </div>
  );
}

export default VirtualizedTable;
