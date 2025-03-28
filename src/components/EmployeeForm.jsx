import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const EmployeeForm = ({ open, handleClose, onSave, employee }) => {
  const [formData, setFormData] = useState({
    userName: "",
    roleId: "",
    password: "",
    userImage: "",
  });

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({ userName: "", roleId: "", password: "", userImage: "" });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{employee ? "Edit staff" : "Add new employee"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          name="userName"
          fullWidth
          margin="dense"
          value={formData.userName}
          onChange={handleChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="role-select-label">Position</InputLabel>
          <Select
            labelId="role-select-label"
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            label="Position"
          >
            <MenuItem value={1}>Admin</MenuItem>
            <MenuItem value={2}>Staff</MenuItem>
            <MenuItem value={3}>Manager</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Password"
          name="password"
          fullWidth
          margin="dense"
          value={formData.password}
          onChange={handleChange}
        />
        <TextField
          label="Avatar (URL)"
          name="userImage"
          fullWidth
          margin="dense"
          value={formData.userImage}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
