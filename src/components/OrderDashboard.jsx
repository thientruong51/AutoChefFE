import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import "chart.js/auto";
import { Bar } from "react-chartjs-2";

const baseUrl = import.meta.env.VITE_API_URL;

const OrderDashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [aggregation, setAggregation] = useState("day"); 
  const [dailyOrders, setDailyOrders] = useState([]);
  const [dailyRecipes, setDailyRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDailyData = async () => {
    if (!startDate) return;
    setLoading(true);

    const start = new Date(startDate);
    const today = new Date();
    let current = new Date(start);
    const ordersData = [];
    const recipesData = [];

    while (current <= today) {
      const dateStr = current.toISOString().split("T")[0];

      // Gọi API Orders Count
      try {
        const resOrders = await fetch(
          `${baseUrl}/Dashboard/orders/count?date=${dateStr}`
        );
        const ordersCount = await resOrders.json();
        ordersData.push({ date: dateStr, count: ordersCount || 0 });
      } catch {
        ordersData.push({ date: dateStr, count: 0 });
      }

      // Gọi API Recipe Counts (dữ liệu dạng object, ví dụ: { "Mì Quảng": 4, "Phở bò": 2 })
      try {
        const resRecipes = await fetch(
          `${baseUrl}/Dashboard/recipe-counts?date=${dateStr}`
        );
        const recipesCount = await resRecipes.json();
        recipesData.push({ date: dateStr, data: recipesCount || {} });
      } catch {
        recipesData.push({ date: dateStr, data: {} });
      }

      current.setDate(current.getDate() + 1);
    }

    setDailyOrders(ordersData);
    setDailyRecipes(recipesData);
    setLoading(false);
  };

  const groupOrders = (data, agg) => {
    const groups = {};
    data.forEach((item) => {
      let key = item.date;
      const d = new Date(item.date);
      if (agg === "week") {
        const week = getWeekNumber(d);
        key = `${d.getFullYear()}-W${week}`;
      } else if (agg === "month") {
        key = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}`;
      } else if (agg === "quarter") {
        const quarter = Math.floor(d.getMonth() / 3) + 1;
        key = `${d.getFullYear()}-Q${quarter}`;
      }
      groups[key] = (groups[key] || 0) + item.count;
    });
    return groups;
  };

  const groupRecipes = (data, agg) => {
    const groups = {};
    data.forEach((item) => {
      let key = item.date;
      const d = new Date(item.date);
      if (agg === "week") {
        const week = getWeekNumber(d);
        key = `${d.getFullYear()}-W${week}`;
      } else if (agg === "month") {
        key = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}`;
      } else if (agg === "quarter") {
        const quarter = Math.floor(d.getMonth() / 3) + 1;
        key = `${d.getFullYear()}-Q${quarter}`;
      }
      if (!groups[key]) {
        groups[key] = {};
      }
      Object.entries(item.data).forEach(([recipe, count]) => {
        groups[key][recipe] = (groups[key][recipe] || 0) + count;
      });
    });
    return groups;
  };

  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  };

  const ordersGrouped = groupOrders(dailyOrders, aggregation);
  const recipesGrouped = groupRecipes(dailyRecipes, aggregation);

  const chartDataOrders = {
    labels: Object.keys(ordersGrouped),
    datasets: [
      {
        label: "Orders Count",
        data: Object.values(ordersGrouped),
        backgroundColor: "rgba(22, 230, 85, 0.6)",
      },
    ],
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Order Management
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Start at"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="agg-label">Group by:</InputLabel>
              <Select
                labelId="agg-label"
                value={aggregation}
                label="Phân nhóm"
                onChange={(e) => setAggregation(e.target.value)}
              >
                <MenuItem value="day">Day</MenuItem>
                <MenuItem value="week">Week</MenuItem>
                <MenuItem value="month">Month</MenuItem>
                <MenuItem value="quarter">Quarter</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={fetchDailyData}
            >
             Get data
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        startDate && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Chart of Orders
            </Typography>
            <Box sx={{ maxWidth: 600, mx: "auto" }}>
              <Bar data={chartDataOrders} />
            </Box>

            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
              Detail by groups
            </Typography>
            {Object.keys(recipesGrouped).length > 0 ? (
              Object.entries(recipesGrouped).map(([group, recipes]) => (
                <Box key={group} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                    {group}
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Dish</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(recipes)
                          .sort((a, b) => b[1] - a[1]) 
                          .map(([recipe, count]) => (
                            <TableRow key={recipe}>
                              <TableCell>{recipe}</TableCell>
                              <TableCell align="right">{count}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))
            ) : (
              <Typography variant="body1">No Data</Typography>
            )}
          </Paper>
        )
      )}
    </Box>
  );
};

export default OrderDashboard;
