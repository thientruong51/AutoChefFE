import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, InputBase, Box, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { Search, Notifications, Settings, Person } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const location = useLocation();

  const getPageTitle = (pathname) => {
    const segments = pathname.split("/").filter(Boolean); 
    return segments.length > 0 ? segments[segments.length - 1] : "Dashboard";
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#F8FAFC",
        color: "#64748B",
        boxShadow: "none",
        padding: "10px 20px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="body3" sx={{ color: "#94A3B8", fontWeight: "bold" }}>
            Pages/
          </Typography>
          <Typography variant="body3" sx={{ color: "#1E293B", fontWeight: "bold", marginLeft: "4px" }}>
          {pageTitle}
          </Typography>
        </Box>


        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "5px 10px",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                width: "200px",
                marginRight: "16px",
              }}
            >
              <Search sx={{ color: "#64748B" }} />
              <InputBase placeholder="Type here..." sx={{ marginLeft: 1, flex: 1 }} />
            </Box>

            <Typography sx={{ fontWeight: "bold", fontSize: "14px", cursor: "pointer" }} onClick={handleMenuOpen}>
              <Person sx={{ fontSize: 20, marginRight: 1 }} />
            </Typography>
            <Settings sx={{ fontSize: 20, marginLeft: 2, cursor: "pointer" }} />
            <Notifications sx={{ fontSize: 20, marginLeft: 2, cursor: "pointer" }} />
          </Box>
        </Box>


        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Log out</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
