import React, { useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Divider, Typography, Box, IconButton, Tooltip } from "@mui/material";
import { Dashboard, People, Menu as MenuIcon, ChevronLeft } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true); // State quản lý sidebar mở hay thu gọn

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Employee", icon: <People />, path: "/employees" },
    { text: "Product", icon: <RamenDiningIcon />, path: "/products" },
    { text: "Order", icon: <ListAltIcon />, path: "/orders" },
  ];

  return (
    <Box
      sx={{
        width: open ? 250 : 70, // Thay đổi width khi thu gọn
        height: "100vh",
        backgroundColor: "#F8F9FA",
        padding: open ? "20px" : "10px",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      

      {/* Logo & Title */}
      <Box sx={{ textAlign: "center", mb: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src="src/assets/logo.png" alt="Logo" width="40" height="40" />
        {open && (
          <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
            AutoChef
          </Typography>
        )}
        {/* Toggle Button */}
      <IconButton onClick={toggleSidebar} sx={{ alignSelf: open ? "flex-end" : "center" }}>
        {open ? <ChevronLeft /> : <MenuIcon />}
      </IconButton>
      </Box>

      {/* Main Menu */}
      <List>
        {menuItems.map((item) => (
          <Tooltip title={!open ? item.text : ""} placement="right" key={item.text}>
            <ListItem
              button
              component={Link}
              to={item.path}
              sx={{
                borderRadius: "10px",
                mb: 1,
                backgroundColor: location.pathname === item.path ? "#E3F2FD" : "transparent",
                color: location.pathname === item.path ? "#69E561" : "#333",
                "&:hover": { backgroundColor: "#BEFDBA", color: "#69E561" },
                justifyContent: open ? "flex-start" : "center", // Căn giữa icon khi thu gọn
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? "#69E561" : "#555",
                  minWidth: "40px",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} sx={{ whiteSpace: "nowrap" }} />}
            </ListItem>
          </Tooltip>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />
    </Box>
  );
};

export default Sidebar;
