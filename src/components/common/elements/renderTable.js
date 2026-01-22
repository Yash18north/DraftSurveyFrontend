import { Table } from "react-bootstrap";

const renderTable = (table) => {
  const { columns, data } = table;

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.name}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((rowData, rowIndex) => (
          <tr key={"renderTable" + rowIndex}>
            {columns.map((column) => (
              <td key={column.name}>{rowData[column.name]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
export default renderTable;
