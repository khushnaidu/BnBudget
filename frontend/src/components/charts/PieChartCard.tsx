// src/components/charts/PieChartCard.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#B978FD", "#FF6384"];

interface PieChartCardProps {
  title: string;
  data: { name: string; value: number }[];
}

const PieChartCard: React.FC<PieChartCardProps> = ({ title, data }) => (
  <Card sx={{ flex: 1, minWidth: 350, height: 360 }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default PieChartCard;