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
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

const baseUrl = import.meta.env.VITE_API_URL;
const robotId = 1;

const getDateRange = (start, end) => {
  const dates = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split("T")[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const getWeek = (date) => {
  const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = copy.getUTCDay() || 7;
  copy.setUTCDate(copy.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(copy.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((copy - yearStart) / 86400000) + 1) / 7);
  return weekNo.toString().padStart(2, "0");
};

const groupData = (results, aggregation) => {
  if (aggregation === "day") return results;

  const groups = {};

  results.forEach((item) => {
    const dateObj = new Date(item.date);
    let key = "";
    if (aggregation === "week") {
      key = `${dateObj.getFullYear()}-W${getWeek(dateObj)}`;
    } else if (aggregation === "month") {
      key = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, "0")}`;
    } else if (aggregation === "quarter") {
      const quarter = Math.floor(dateObj.getMonth() / 3) + 1;
      key = `${dateObj.getFullYear()}-Q${quarter}`;
    }
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
  });

  const combined = [];
  for (const key in groups) {
    const group = groups[key];
    const sumOrders = group.reduce((sum, item) => sum + item.ordersCount, 0);
    const avgCompletion =
      group.reduce((sum, item) => sum + item.avgCompletion, 0) / group.length;
    combined.push({
      date: key,
      ordersCount: sumOrders,
      avgCompletion,
    });
  }

  combined.sort((a, b) => a.date.localeCompare(b.date));
  return combined;
};

const RobotDashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [aggregation, setAggregation] = useState("day");
  const [dailyRobotOrders, setDailyRobotOrders] = useState([]);
  const [dailyAvgCompletion, setDailyAvgCompletion] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDailyData = async () => {
    if (!startDate) return;
    setLoading(true);

    const startDateOnly = startDate.split("T")[0];
    const today = new Date();
    const startDateObj = new Date(startDateOnly);
    const dates = getDateRange(startDateObj, today);

    console.log("Fetching data from:", startDateOnly, "to", today.toISOString().split("T")[0]);
    console.log("Dates array:", dates);

    try {
      const results = await Promise.all(
        dates.map(async (date) => {
          const resOrders = await fetch(
            `${baseUrl}/Dashboard/robot/orders-count?robotId=${robotId}&date=${date}`
          );
          const ordersCount = resOrders.ok ? await resOrders.text() : "0";
          console.log(`Orders count for ${date}:`, ordersCount);

          const resAvg = await fetch(
            `${baseUrl}/Dashboard/robot/average-completion-time?robotId=${robotId}&date=${date}`
          );
          const avgCompletion = resAvg.ok ? await resAvg.text() : "0";
          console.log(`Average completion time for ${date}:`, avgCompletion);

          return {
            date,
            ordersCount: Number(ordersCount) || 0,
            avgCompletion: Number(avgCompletion) || 0,
          };
        })
      );

      const groupedResults = groupData(results, aggregation);

      const ordersData = groupedResults.map((item) => ({
        date: item.date,
        count: item.ordersCount,
      }));
      const avgData = groupedResults.map((item) => ({
        date: item.date,
        value: item.avgCompletion,
      }));

      setDailyRobotOrders(ordersData);
      setDailyAvgCompletion(avgData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const chartDataOrders = {
    labels: dailyRobotOrders.map((item) => item.date),
    datasets: [
      {
        label: "Robot Orders Count",
        data: dailyRobotOrders.map((item) => item.count),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const chartDataAvg = {
    labels: dailyAvgCompletion.map((item) => item.date),
    datasets: [
      {
        label: "Average Completion Time (mins)",
        data: dailyAvgCompletion.map((item) => item.value),
        backgroundColor: "rgba(255,99,132,0.6)",
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Robot Dashboard
      </Typography>
      <Card sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Aggregation</InputLabel>
              <Select
                value={aggregation}
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
              Fetch Data
            </Button>
          </Grid>
        </Grid>
      </Card>

      {loading && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && startDate && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Robot Orders Count
                </Typography>
                <Bar data={chartDataOrders} />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Average Completion Time
                </Typography>
                <Bar data={chartDataAvg} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default RobotDashboard;
