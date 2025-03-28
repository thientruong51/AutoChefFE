import React, { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

import OrderDashboard from "../components/OrderDashboard";
import RobotDashboard from "../components/RobotDashboard";

const Dashboard = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCancelled, setTotalCancelled] = useState(0);
  const [recipeCounts, setRecipeCounts] = useState({});

  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchAllTimeStats();
  }, []);

  const fetchAllTimeStats = async () => {
    setLoading(true);

    const start = new Date("2025-02-01");
    const today = new Date();
    let current = new Date(start);

    let sumOrders = 0;
    let sumCancelled = 0;
    let recipeMap = {};

    while (current <= today) {
      const dateStr = current.toISOString().split("T")[0];

      try {
        const resOrders = await fetch(`${baseUrl}/Dashboard/orders/count?date=${dateStr}`);
        const ordersCount = await resOrders.json();
        sumOrders += ordersCount || 0;
      } catch (error) {
        console.error("Error fetching orders count:", error);
      }

      try {
        const resCancelled = await fetch(`${baseUrl}/Dashboard/orders/countByStatus?date=${dateStr}&status=cancelled`);
        const cancelledCount = await resCancelled.json();
        sumCancelled += cancelledCount || 0;
      } catch (error) {
        console.error("Error fetching cancelled orders count:", error);
      }

      try {
        const resRecipes = await fetch(`${baseUrl}/Dashboard/recipe-counts?date=${dateStr}`);
        const dataRecipes = await resRecipes.json();
        Object.entries(dataRecipes || {}).forEach(([recipe, count]) => {
          recipeMap[recipe] = (recipeMap[recipe] || 0) + count;
        });
      } catch (error) {
        console.error("Error fetching recipe counts:", error);
      }

      current.setDate(current.getDate() + 1);
    }

    setTotalOrders(sumOrders);
    setTotalCancelled(sumCancelled);
    setRecipeCounts(recipeMap);
    setLoading(false);
  };

  const chartDataRecipes = {
    labels: Object.keys(recipeCounts),
    datasets: [
      {
        label: "Orders Counts",
        data: Object.values(recipeCounts),
        backgroundColor: "rgba(22, 230, 85, 0.6)",
      },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        Dashboard
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ marginBottom: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success">
                    Total of Orders:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }} color="success">
                    {totalOrders}
                  </Typography>
                 
                </CardContent>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="red">
                  Cancelled Orders:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }} color="red">
                  {totalCancelled}
                  </Typography>
                  
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Volume by Food Category:
                  </Typography>
                  {Object.keys(recipeCounts).length === 0 ? (
                    <Typography>No Data</Typography>
                  ) : (
                    <Box sx={{ maxWidth: 600 }}>
                      <Bar data={chartDataRecipes} />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Order Management" />
        <Tab label="Robot Management" />
      </Tabs>
      {tabIndex === 0 && <OrderDashboard />}
      {tabIndex === 1 && <RobotDashboard />}
    </Box>
  );
};

export default Dashboard;
