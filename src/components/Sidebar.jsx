import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Dashboard, People, Menu as MenuIcon, ChevronLeft } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import RamenDiningIcon from "@mui/icons-material/RamenDining";
import ListAltIcon from "@mui/icons-material/ListAlt";

const Sidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const [roleId, setRoleId] = useState(null);
  useEffect(() => {
    const storedRoleId = localStorage.getItem("roleId");
    if (storedRoleId) {
      setRoleId(Number(storedRoleId));
    }
  }, []);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/", roles: [1, 2] },
    { text: "Employee", icon: <People />, path: "/employees", roles: [1] },
    { text: "Product", icon: <RamenDiningIcon />, path: "/products", roles: [2] },
    { text: "Order", icon: <ListAltIcon />, path: "/orders", roles: [2] },
    { text: "RecipeStep", icon: <ListAltIcon />, path: "/recipeSteps", roles: [1] },
  ];

  const filteredMenuItems = roleId
    ? menuItems.filter((item) => item.roles.includes(roleId))
    : [];

  return (
    <Box
      sx={{
        width: open ? 150 : 70,
        height: "100vh",
        backgroundColor: "#F8F9FA",
        padding: open ? "20px" : "10px",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src="https://res.cloudinary.com/dkfykdjlm/image/upload/v1741164153/of8hip09b0xrbxhjbvft.png" alt="Logo" width="40" height="40" />
        {open && (
          <Typography variant="h6" fontWeight="bold" sx={{ ml: 1 }}>
            AutoChef
          </Typography>
        )}
        <IconButton onClick={toggleSidebar} sx={{ alignSelf: open ? "flex-end" : "center" }}>
          {open ? <ChevronLeft /> : <MenuIcon />}
        </IconButton>
      </Box>

      <List>
        {filteredMenuItems.map((item) => (
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
                justifyContent: open ? "flex-start" : "center",
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
