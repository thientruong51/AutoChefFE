import React from "react";
import { Grid } from "@mui/material";
import StatsCard from "../components/StatsCard";
import Chart from "../components/Chart";
import { AttachMoney, People, ShoppingCart, BarChart } from "@mui/icons-material";

const Dashboard = () => {
  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>
      {/* Stats Cards */}
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard title="Revenue" value="$53,000" percentage="+55%" icon={<AttachMoney />} color="#4CAF50" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard title="User" value="2,300" percentage="+5%" icon={<People />} color="#2196F3" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard title="Order" value="3,020" percentage="-14%" icon={<ShoppingCart />} color="#FF9800" />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <StatsCard title="Profit" value="$173,000" percentage="+8%" icon={<BarChart />} color="#9C27B0" />
      </Grid>

      {/* Biểu đồ doanh thu */}
      <Grid item xs={12}>
        <Chart />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
