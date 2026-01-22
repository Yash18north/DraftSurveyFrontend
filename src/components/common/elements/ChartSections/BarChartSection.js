import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  LabelList
} from "recharts";
import { formatCurrency, formatIndianNumber } from "../../../../services/commonFunction";

const BarChartSection = ({ data = [], labels = {}, COLORS = [], isFullDetails, isQuantity, isNoTShowInNormal }) => {
  const hasData = Array.isArray(data) && data.length > 0;
  const barKeys = hasData
    ? Object.keys(data[0]).filter((key) => key !== "name")
    : [];

  if (!hasData) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        No data available to display.
      </div>
    );
  }
  const chartWidth = Math.max(data.length * 80, 800);
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={isFullDetails ? chartWidth > 800 ? { width: chartWidth } : { minWidth: 800 } : {}}>
        <ResponsiveContainer width="100%" height={isFullDetails ? 500 : 300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-35}          // slightly increased angle for better fit
              textAnchor="end"
              interval={0}
              height={60}          // increased height to give more room
              minTickGap={10}      // adds gap between ticks for better spacing
              tickFormatter={(fullText) =>
                fullText.length > 12 ? `${fullText.slice(0, 12)}...` : fullText
              }
              tick={{ fontSize: 13 }}
            />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatIndianNumber(value)} />
            {(!isNoTShowInNormal || isFullDetails) && <Legend verticalAlign="top" align="center" formatter={(value) => labels[value] || value} wrapperStyle={{
              marginTop: -20,
            }} />}
            {barKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
                name={labels[key] || key}
              >
                <LabelList dataKey={key} position="top" fill="#000" fontSize={12} formatter={(value) => formatCurrency(value, 1)} />
                {/* <LabelList dataKey={key} position="top" fill="#000" fontSize={12} formatter={(value) => value} /> */}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartSection;
