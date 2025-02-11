import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from "@mui/material";

const EmployeeForm = ({ open, handleClose, onSave, employee }) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({ name: "", position: "", email: "", avatar: "" });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{employee ? "Edit staff" : "Add new employee"}</DialogTitle>
      <DialogContent>
        <TextField label="Name" name="name" fullWidth margin="dense" value={formData.name} onChange={handleChange} />
        <TextField label="Position" name="position" fullWidth margin="dense" value={formData.position} onChange={handleChange} />
        <TextField label="Email" name="email" fullWidth margin="dense" value={formData.email} onChange={handleChange} />
        <TextField label="Avatar (URL)" name="avatar" fullWidth margin="dense" value={formData.avatar} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
        <Button onClick={() => onSave(formData)} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
