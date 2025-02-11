import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Avatar, Box, Typography, Button, IconButton, Menu, MenuItem
} from "@mui/material";
import { Edit, Delete, Add, MoreVert } from "@mui/icons-material";
import EmployeeForm from "./EmployeeForm";

const initialEmployees = [
  { id: 1, name: "Nguyễn Văn A", position: "Quản lý", email: "a@example.com", avatar: "https://i.pravatar.cc/50?u=a", status: "Active" },
  { id: 2, name: "Trần Thị B", position: "Nhân viên bán hàng", email: "b@example.com", avatar: "https://i.pravatar.cc/50?u=b", status: "Active" },
  { id: 3, name: "Lê Văn C", position: "Bếp trưởng", email: "c@example.com", avatar: "https://i.pravatar.cc/50?u=c", status: "Active" },
  { id: 4, name: "Phạm Thị D", position: "Kế toán", email: "d@example.com", avatar: "https://i.pravatar.cc/50?u=d", status: "Edit" },
];

const EmployeeTable = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data) => {
    if (editingEmployee) {
      setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? { ...data, id: emp.id } : emp)));
    } else {
      setEmployees([...employees, { ...data, id: Date.now() }]);
    }
    setOpenForm(false);
    setEditingEmployee(null);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Employee Management</Typography>

      <Box display="flex" justifyContent="space-between" marginBottom={2} alignItems="center">
        <TextField
          label="Search employee..."
          variant="outlined"
          size="small"
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 250, height: 36 }}
        />
        <Button
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
          size="small"
          sx={{ height: 36 }}
        >
          Add Employee
        </Button>
      </Box>


      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Staff ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((emp, index) => (
              <TableRow
                key={emp.id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                  "&:hover": { backgroundColor: "#eef6ff" },
                }}
              >
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={emp.avatar} alt={emp.name} />
                  <Box>
                    <Typography fontWeight="bold">{emp.name}</Typography>
                    <Typography variant="body2" color="textSecondary">#000{index + 1}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>ST-00{index + 1}</TableCell>
                <TableCell sx={{ color: "blue", cursor: "pointer" }}>{emp.email}</TableCell>
                <TableCell>
                  <Box sx={{
                    display: "inline-block",
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold"
                  }}>
                    Staff
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{
                    display: "inline-block",
                    backgroundColor: emp.status === "Active" ? "#d4edda" : "#fff3cd",
                    color: emp.status === "Active" ? "#155724" : "#856404",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold"
                  }}>
                    {emp.status}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuClick(e, emp)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { setEditingEmployee(selectedEmployee); setOpenForm(true); handleMenuClose(); }}>
          <Edit fontSize="small" /> Edit
        </MenuItem>
        <MenuItem onClick={() => { handleDelete(selectedEmployee.id); handleMenuClose(); }}>
          <Delete fontSize="small" color="error" /> Delete
        </MenuItem>
      </Menu>

      <EmployeeForm open={openForm} handleClose={() => setOpenForm(false)} onSave={handleSave} employee={editingEmployee} />
    </Box>
  );
};

export default EmployeeTable;
