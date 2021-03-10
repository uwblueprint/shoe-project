import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import { useState } from "react";
import * as React from "react";
import useSWR from "swr";

import VirtualizedTable from "../components/VirtualizedTable";
import { Story } from "../types/index";

function createData(
  id: number,
  title: string,
  current_city: string,
  year: number,
  is_visible: boolean,
  author_first_name: string,
  author_last_name: string,
  author_country: string
) {
  const author_name = `${author_first_name} ${author_last_name}`;
  return {
    id,
    title,
    current_city,
    year,
    author_name,
    author_country,
    is_visible,
  };
}

export const AllStories: React.FC = () => {
  const { data: allStories, error } = useSWR<Story[]>("/api/stories");
  
  if (allStories === undefined) return;
  
  const rows = allStories.map((story, i) =>
    createData(
      i,
      story.title,
      story.current_city,
      story.year,
      story.is_visible,
      story.author_first_name,
      story.author_last_name,
      story.author_country
    )
  );

  const [visibleState, setVisibleState] = React.useState([]);
  const [tableData, setTableData] = useState(rows);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");

  const handleChange = (e, d) => {
    if (e.target.checked) {
      setVisibleState((prevState) => [...prevState, d.id]);
    } else {
      setVisibleState((prevState) => prevState.filter((e) => e !== d.id));
    }
  };

  const handleCheckedAll = () => {
    setSelectedRowIds((prevState) =>
      prevState.length === rows.length ? [] : rows.map((d) => d.id)
    );
  };
  const handleChecked = (e, d) => {
    if (e.target.checked) {
      setSelectedRowIds((prevState) => [...prevState, d.id]);
    } else {
      setSelectedRowIds((prevState) => prevState.filter((e) => e !== d.id));
    }
  };

  const handleRequestSort = (property) => {
    const isDesc = orderBy === property && order === "desc";
    const newOrder = isDesc ? "asc" : "desc";
    setOrder(newOrder);
    setOrderBy(property);

    onChangeTableSort(newOrder, property);
  };
  const onChangeTableSort = (order, property) => {
    const newData = stableSort(tableData, getComparator(order, property));
    setTableData(newData);
  };
  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };
  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const indeterminate =
    selectedRowIds.length > 0 && selectedRowIds.length !== rows.length;

  if (error) return <div>Error returning stories data!</div>;
  if (!allStories) return <div>Loading all stories table..</div>;
  return (
    <VirtualizedTable
      data={stableSort(tableData, getComparator(order, orderBy))}
      order={order}
      orderBy={orderBy}
      columns={[
        {
          name: "id",
          width: 100,
          onHeaderClick() {
            handleRequestSort("id");
          },
          header: (
            <div>
              <Checkbox
                checked={selectedRowIds.length > 0}
                indeterminate={indeterminate}
                onChange={handleCheckedAll}
              />
              ID
            </div>
          ),
          cell: (d) => (
            <div>
              <Checkbox
                onChange={(e) => handleChecked(e, d)}
                checked={selectedRowIds.includes(d.id)}
              />
              {d.id}
            </div>
          ),
        },

        {
          name: "title",
          header: "Story Name",
          width: 200,
          onHeaderClick() {
            handleRequestSort("title");
          },
        },
        {
          name: "current_city",
          header: "Current City",
          width: 200,
          onHeaderClick() {
            handleRequestSort("current_city");
          },
        },
        {
          name: "year",
          header: "Year",
          width: 100,
          onHeaderClick() {
            handleRequestSort("year");
          },
        },
        {
          name: "author_name",
          header: "Author name",
          width: 250,
          onHeaderClick() {
            handleRequestSort("author_first_name");
          },
        },
        {
          name: "author_country",
          header: "Country",
          width: 300,
          onHeaderClick() {
            handleRequestSort("author_country");
          },
        },
        {
          name: "is_visible",
          header: "Show on Map",
          width: 150,
          onHeaderClick() {
            handleRequestSort("jobType");
          },
          cell: (d) => (
            <Switch
              checked={visibleState.includes(d.id)}
              onChange={(e) => handleChange(e, d)}
              name="checked"
              color="primary"
            />
          ),
        },
      ]}
    />
  );
};
