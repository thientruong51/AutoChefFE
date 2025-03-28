import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Box, Typography, Button, IconButton, Chip, Menu, MenuItem, TablePagination
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/Order`;

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);


  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);


  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/all?sort=true&page=${page + 1}&pageSize=${rowsPerPage}`)
      .then((response) => {
        console.log("API response:", response.data);
        setOrders(response.data.orders || []);
      })
      .catch((error) => {
        console.error("Lỗi khi tải đơn hàng:", error);
        setOrders([]);
      });
  }, [page, rowsPerPage]);


  const filteredOrders = orders.filter(order =>
    order.orderId.toString().includes(search)
  );




  const handleMenuClose = () => {
    setAnchorEl(null);
  };




  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Order Management</Typography>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <TextField
          label="Search order by ID..."
          variant="outlined"
          size="small"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap", minWidth: 100 }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap", minWidth: 120 }}>Recipe Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap", minWidth: 120 }}>Robot ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap", minWidth: 140 }}>Location ID</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap", minWidth: 180 }}>Ordered Time</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap", minWidth: 180 }}>Completed Time</TableCell>
              <TableCell sx={{ fontWeight: "bold", whiteSpace: "nowrap", minWidth: 120 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.recipeName}</TableCell>
                <TableCell>{order.robotId}</TableCell>
                <TableCell>{order.locationId}</TableCell>
                <TableCell>{new Date(order.orderedTime).toLocaleString()}</TableCell>
                <TableCell>{order.completedTime ? new Date(order.completedTime).toLocaleString() : "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "Completed"
                        ? "success"
                        : order.status === "pending"
                          ? "primary"
                          : order.status === "Processing"    ? "primary" : 
                          order.status === "Cancel"   ? "error" : "warning" 
                    }
                  />                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={100}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />


      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {["Procressing", "Completed", "Canceled"].map((status) => (
          <MenuItem key={status} onClick={() => handleStatusChange(status)}>
            {status}
          </MenuItem>
        ))}
      </Menu>

    </Box>
  );
};

export default OrderTable;
