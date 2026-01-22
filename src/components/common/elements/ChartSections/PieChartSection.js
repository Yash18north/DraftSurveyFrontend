import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { formatCurrency, formatIndianNumber } from "../../../../services/commonFunction";

const PieChartSection = ({ data, labels, COLORS, isFullDetails }) => {
  const hasData = Array.isArray(data) && data.length > 0;

  if (!hasData) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        No data available to display.
      </div>
    );
  }

  const renderCustomLabel = ({ value }) => formatCurrency(value);

  return (
    <ResponsiveContainer width="100%" height={isFullDetails ? "100%" : 300} className={"piechart-main-section"}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={renderCustomLabel}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatIndianNumber(value)}/>
        <Legend
          formatter={(value) => {
            // Ensure the value corresponds to the correct label
            return labels[value] ? labels[value] : value;
          }}
          style={{fontSize:"12px"}}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartSection;
