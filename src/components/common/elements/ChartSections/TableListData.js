import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from "recharts";

const TableListData = ({ data = [], headers = {}, isFullDetails }) => {
    const hasData = Array.isArray(data) && data.length > 0;

    if (!hasData) {
        return (
            <div style={{ textAlign: "center", padding: "1rem" }}>
                No data available to display.
            </div>
        );
    }
    return (
        <div className="tableContainer">
            <table className="table table-white responsive borderless no-wrap align-middle list mainRenderList minWidthTh">
                <thead>
                    <tr>
                        <th>Sr. No.</th>
                        {headers.map(
                            (header, headerIndex) =>
                                <th key={"headerIndex" + headerIndex}>
                                    {header.label}
                                </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((singleTableData, cellIndex) => (
                        <tr>
                            <td key={"rowIndex-" + cellIndex}>
                                {cellIndex + 1}
                            </td>
                            {
                                headers.map((header, cellIndex) =>{
                                    return  (
                                        <td key={"cellIndex" + cellIndex} style={{textAlign:"left"}}>
                                            {header.subField ? singleTableData?.[header.name]?.[header.subField] : singleTableData[header.name]} {header.subField}
                                        </td>
                                    )
                                })
                            }
                        </tr>
                    )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TableListData;
