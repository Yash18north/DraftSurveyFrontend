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
import { formatCurrency, formatIndianNumber } from "../../../../services/commonFunction";

const LineChartSection = ({ data = [], labels = {}, COLORS = [], isFullDetails }) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const labelKeys = labels && Object.keys(labels);

  if (!hasData) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        No data available to display.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={isFullDetails ? "100%" : 300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 40, bottom: 70 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          angle={-35}          // slightly increased angle for better fit
          textAnchor="end"
          interval={0}
          height={60}          // increased height to give more room
          minTickGap={10}      // adds gap between ticks for better spacing
          tickFormatter={(fullText) =>
            fullText.length > 12 ? `${fullText.slice(0, 12)}...` : fullText
          }
        />
        <YAxis tickFormatter={formatCurrency} />
        <Tooltip formatter={(value) => formatIndianNumber(value)} />
        <Legend verticalAlign="top" align="center" formatter={(value) => labels[value] || value} />
        {labelKeys.length > 0 &&
          labelKeys.map((key, index) => (
            <Line
              key={key}
              type="linear"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              name={labels[key]}
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartSection;
