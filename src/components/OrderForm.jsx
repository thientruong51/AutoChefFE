import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem
} from "@mui/material";

const statuses = ["Processing", "Confirmed", "Delivering", "Completed", "Cancelled"];

const OrderForm = ({ open, handleClose, onSave, order }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    totalAmount: "",
    status: "Processing",
  });

  useEffect(() => {
    if (order) {
      setFormData(order);
    } else {
      setFormData({ customerName: "", totalAmount: "", status: "Đang xử lý" });
    }
  }, [order]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{order ? "Chỉnh sửa đơn hàng" : "Thêm đơn hàng mới"}</DialogTitle>
      <DialogContent>
        <TextField label="Mame" name="customerName" fullWidth margin="dense" value={formData.customerName} onChange={handleChange} />
        <TextField label="Total Amount" name="totalAmount" fullWidth margin="dense" value={formData.totalAmount} onChange={handleChange} />
        <TextField select label="Status" name="status" fullWidth margin="dense" value={formData.status} onChange={handleChange}>
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>{status}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
        <Button onClick={() => onSave(formData)} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderForm;
