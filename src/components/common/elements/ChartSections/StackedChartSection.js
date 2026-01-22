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
  LabelList,
} from "recharts";
import { formatCurrency, formatIndianNumber } from "../../../../services/commonFunction";

const StackedChartSection = ({ data, labels, COLORS, isFullDetails }) => {
  const hasData = Array.isArray(data) && data.length > 0;

  if (!hasData) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        No data available to display.
      </div>
    );
  }

  const chartHeight = Math.max(data.length * 40, 500);

  return (
    <div
      style={{
        height: isFullDetails ? "100%" : 300,
        padding: "20px",
        boxSizing: "border-box",
        overflowX: isFullDetails ? "auto" : "hidden",
      }}
    >
      <div
        style={{
          minWidth: isFullDetails ? 800 : 300,
          height: isFullDetails ? chartHeight : "100%",
          overflowY: isFullDetails ? "auto" : "hidden",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 60, left: 20, bottom: 5 }}
            barCategoryGap={10}
            barSize={35}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={formatCurrency} />
            <YAxis
              type="category"
              dataKey="category"
              width={250}
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <Tooltip formatter={(value) => formatIndianNumber(value)} />
            <Legend verticalAlign="top" align="center" formatter={(value) => labels[value] || value} />

            {/* First Bar */}
            <Bar
              key={'firstLabel'}
              dataKey={'firstLabel'}
              fill={COLORS.firstLabel}
              name={labels.firstLabel}
            >
              <LabelList
                dataKey="firstLabel"
                content={({ x, y, width, height, value }) => {
                  const formattedValue = formatCurrency(value);
                  return (
                    <text
                      x={x + width + 5} // Move label to the right of the bar
                      y={y + height / 2 + 4} // Vertically center the label
                      fill="#000"
                      fontSize={12}
                      textAnchor="start"
                    >
                      {formattedValue}
                    </text>
                  );
                }}
              />
              {/* <LabelList dataKey={key} position="top" fill="#000" fontSize={12} formatter={(value) => value} /> */}
            </Bar>
            {labels.secondLabel && <Bar
              key={'secondLabel'}
              dataKey={'secondLabel'}
              fill={COLORS.secondLabel}
              name={labels.secondLabel}
            >
              <LabelList
                dataKey="secondLabel"
                content={({ x, y, width, height, value }) => {
                  const formattedValue = formatCurrency(value);
                  return (
                    <text
                      x={x + width + 5} // Move label to the right of the bar
                      y={y + height / 2 + 4} // Vertically center the label
                      fill="#000"
                      fontSize={12}
                      textAnchor="start"
                    >
                      {formattedValue}
                    </text>
                  );
                }}
              />
              {/* <LabelList dataKey={key} position="top" fill="#000" fontSize={12} formatter={(value) => value} /> */}
            </Bar>}

            {/* <Bar
              dataKey="firstLabel"
              stackId="a"
              fill={COLORS.firstLabel}
              name={labels.firstLabel}
            >
              {!labels.secondLabel && (
                <LabelList
                  dataKey="firstLabel"
                  content={({ x, y, width, value }) => {
                    const formattedValue = formatCurrency(value);
                    return (
                      <text
                        x={x + width + 5}
                        y={y + 10}
                        fill="#000"
                        fontSize={12}
                        textAnchor="start"
                      >
                        {formattedValue}
                      </text>
                    );
                  }}
                />
              )}
            </Bar> */}

            {/* Second Bar, if available */}
            {/* {labels.secondLabel && (
              <Bar
                dataKey="secondLabel"
                stackId="a"
                fill={COLORS.secondLabel}
                name={labels.secondLabel}
              />
            )} */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedChartSection;
