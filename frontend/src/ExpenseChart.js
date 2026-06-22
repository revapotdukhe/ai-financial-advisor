import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#4CAF50", "#FF6384", "#36A2EB", "#FFCE56"];

const ExpenseChart = ({ expenses }) => {
  // ✅ Clean & safe data
  const data = Object.values(
    (expenses || []).reduce((acc, curr) => {
      const title = curr.title?.trim() || "Other";
      const amount = Number(curr.amount);

      if (!amount || isNaN(amount)) return acc;

      if (!acc[title]) {
        acc[title] = { name: title, value: 0 };
      }

      acc[title].value += amount;
      return acc;
    }, {})
  );

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      {data.length === 0 ? (
        <p style={{ color: "#aaa" }}>No chart data</p>
      ) : (
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      )}
    </div>
  );
};

export default ExpenseChart;