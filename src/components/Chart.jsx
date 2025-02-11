import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, Typography } from "@mui/material";

const data = [
  { month: "Jan", revenue: 12000 },
  { month: "Feb", revenue: 15000 },
  { month: "Mar", revenue: 18000 },
  { month: "Apr", revenue: 14000 },
  { month: "May", revenue: 20000 },
  { month: "Jun", revenue: 22000 },
  { month: "Jul", revenue: 25000 },
  { month: "Aug", revenue: 23000 },
  { month: "Sep", revenue: 21000 },
  { month: "Oct", revenue: 26000 },
  { month: "Nov", revenue: 28000 },
  { month: "Dec", revenue: 30000 },
];

const Chart = () => {
  return (
    <Card sx={{ padding: 2, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Monthly Revenue
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#4CAF50" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Chart;
