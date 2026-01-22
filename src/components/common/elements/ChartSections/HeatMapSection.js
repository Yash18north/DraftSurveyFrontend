import React, { useState } from "react";
import HeatMap from "react-heatmap-grid";

const HeatMapSection = ({ data, xLabels, yLabels, COLORS, isFullDetails }) => {
  const [pageNo, setPageNo] = useState(0);
  const pageSize = 15; // Show 15 xLabels (days) per page

  const hasData = Array.isArray(data) && data.length > 0;

  if (!hasData) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        No data available to display.
      </div>
    );
  }

  const totalPages = Math.ceil(xLabels.length / pageSize);

  // Get current page xLabels and data
  const pagedXLabels = xLabels.slice(pageNo * pageSize, (pageNo + 1) * pageSize);

  // Wrap each cell with { value, colIndex } to track column for coloring
  const pagedData = data.map(row =>
    row.slice(pageNo * pageSize, (pageNo + 1) * pageSize).map((value, colIndex) => ({
      value,
      colIndex
    }))
  );

  // Day-wise thresholds (column-wise)
  const columnThresholds = pagedXLabels.map((_, colIndex) => {
    const columnValues = pagedData.map(row => row[colIndex].value);
    const maxVal = Math.max(...columnValues);
    return {
      low: maxVal * 0.33,
      medium: maxVal * 0.66,
    };
  });

  const getColor = (value, colIndex) => {
    const { low, medium } = columnThresholds[colIndex];
    if (value > medium) return COLORS[1];  // High
    if (value > low) return COLORS[0];     // Medium
    return COLORS[3];                      // Low
  };

  const handlePrevPage = () => {
    if (pageNo > 0) setPageNo(pageNo - 1);
  };

  const handleNextPage = () => {
    if (pageNo < totalPages - 1) setPageNo(pageNo + 1);
  };

  return (
    <div
      style={{
        width: isFullDetails ? "100%" : "500px",
        height: isFullDetails ? "100%" : "300px",
      }}
      className="heatmap-main-section"
    >
      {/* Pagination top */}
      {isFullDetails && (
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button onClick={handlePrevPage} disabled={pageNo === 0}>Previous</button>
          <span style={{ margin: "0 1rem" }}>Page {pageNo + 1} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={pageNo === totalPages - 1}>Next</button>
        </div>
      )}

      <HeatMap
        xLabels={pagedXLabels}
        yLabels={yLabels}
        data={pagedData}
        yLabelWidth={180}
        xLabelsStyle={{
          fontSize: "14px",
          padding: "5px",
          textAlign: "center",
        }}
        cellStyle={(background, cellData) => ({
          background: getColor(cellData.value, cellData.colIndex),
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          textAlign: "center",
          height: "45px",
          minWidth: "45px",
        })}
        cellRender={(cellData) => (
          <div title={`Value: ${cellData.value}`} style={{ width: "100%", height: "100%" }}>
            {cellData.value}
          </div>
        )}
      />

      {/* Pagination bottom */}
      {isFullDetails && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button onClick={handlePrevPage} disabled={pageNo === 0}>Previous</button>
          <span style={{ margin: "0 1rem" }}>Page {pageNo + 1} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={pageNo === totalPages - 1}>Next</button>
        </div>
      )}
    </div>
  );
};

export default HeatMapSection;
