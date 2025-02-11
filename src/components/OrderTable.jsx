import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Box, Typography, Button, IconButton, Chip, Menu, MenuItem
} from "@mui/material";
import { Edit, Delete, Add, MoreVert } from "@mui/icons-material";
import OrderForm from "./OrderForm";

const initialOrders = [
  { id: 1, customerName: "Nguyễn Văn A", totalAmount: "500,000 VND", status: "Processing" },
  { id: 2, customerName: "Trần Thị B", totalAmount: "1,200,000 VND", status: "Completed" },
  { id: 3, customerName: "Lê Văn C", totalAmount: "750,000 VND", status: "Confirmed" },
];

const OrderTable = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data) => {
    if (editingOrder) {
      setOrders(orders.map(order => (order.id === editingOrder.id ? { ...data, id: order.id } : order)));
    } else {
      setOrders([...orders, { ...data, id: Date.now() }]);
    }
    setOpenForm(false);
    setEditingOrder(null);
  };

  const handleDelete = (id) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Order Management</Typography>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <TextField label="Search order..." variant="outlined" size="small" onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" color="success" size="small" startIcon={<Add />} onClick={() => setOpenForm(true)}>
          Add order
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order, index) => (
              <TableRow
                key={order.id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                  "&:hover": { backgroundColor: "#eef6ff" },
                }}
              >
                <TableCell>
                  <Typography fontWeight="bold">{order.customerName}</Typography>
                  <Typography variant="body2" color="textSecondary">#O000{index + 1}</Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{
                    display: "inline-block",
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold"
                  }}>
                    {order.totalAmount}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={order.status} color={
                    order.status === "Completed" ? "success" :
                    order.status === "Confirmed" ? "primary" :
                    order.status === "Processing" ? "warning" : "secondary"
                  } />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuClick(e, order)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { setEditingOrder(selectedOrder); setOpenForm(true); handleMenuClose(); }}>
          <Edit fontSize="small" /> Edit
        </MenuItem>
        <MenuItem onClick={() => { handleDelete(selectedOrder.id); handleMenuClose(); }}>
          <Delete fontSize="small" color="error" /> Delete
        </MenuItem>
      </Menu>

      <OrderForm open={openForm} handleClose={() => setOpenForm(false)} onSave={handleSave} order={editingOrder} />
    </Box>
  );
};

export default OrderTable;
