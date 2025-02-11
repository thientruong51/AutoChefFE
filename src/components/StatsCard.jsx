import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

const StatsCard = ({ title, value, percentage, icon }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minWidth: 250,
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
        backgroundColor: "#fff",
      }}
    >
      <Box>
        <Typography variant="body2" sx={{ color: "#7D8DA1", fontWeight: "bold", textTransform: "uppercase" }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold", mt: 1 }}>
          {value}{" "}
          <Typography
            component="span"
            sx={{ color: percentage.includes("-") ? "red" : "green", fontSize: "14px", fontWeight: "bold" }}
          >
            {percentage}
          </Typography>
        </Typography>
      </Box>
      <Box
        sx={{
          width: 50,
          height: 50,
          backgroundColor: "#5AD552",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>
    </Card>
  );
};

export default StatsCard;
