import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const GaugeChartSection = ({ data, needleValue, isFullDetails, COLORS }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const total = data.reduce((acc, entry) => acc + entry.value, 0);
  const needleAngle = (needleValue / total) * 180 - 90; // Scale from -90° to 90°
  const hasData = Array.isArray(data) && data.length > 0;

  if (!hasData) {
    return (
      <div style={{ textAlign: "center", padding: "1rem" }}>
        No data available to display.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start", // Align the chart to the left
        alignItems: "center", // Vertically center the items
        width: "100%",
        height: isFullDetails ? "100%" : "300px",
        paddingLeft: "20px", // Add some padding to the left for spacing
      }}
    >
      {/* Legend on the left */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginRight: "20px",
        }}
      >
        {data.map((entry, index) => (
          <div
            key={index}
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: COLORS[index % COLORS.length],
              background: hoveredIndex === index ? "#f0f0f0" : "transparent",
              padding: hoveredIndex === index ? "4px 8px" : "0px",
              borderRadius: "4px",
              transition: "all 0.3s ease",
              margin: "4px 0",
            }}
          >
            {/* Displaying both name and value */}
            {entry.name}: {entry.value}
          </div>
        ))}
      </div>

      {/* Speedometer Chart */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: isFullDetails ? "100%" : "300px",
        }}
      >
        <ResponsiveContainer width="100%" height={isFullDetails ? "100%" : 300}>
          <PieChart>
            <Tooltip />
            <Pie
              data={data}
              dataKey="value"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={100}
              stroke="none"
              onMouseEnter={(_, index) => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    opacity:
                      hoveredIndex === index || hoveredIndex === null ? 1 : 0.5,
                    transition: "opacity 0.3s ease-in-out",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Needle */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "4px",
            height: "70px",
            backgroundColor: "black",
            transform: `translate(-50%, -100%) rotate(${needleAngle}deg)`,
            transformOrigin: "bottom center",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
};

export default GaugeChartSection;
