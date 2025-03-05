import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Avatar, Box, Typography, Button, IconButton, Menu, MenuItem, TablePagination
} from "@mui/material";
import { Edit, Delete, Add, MoreVert } from "@mui/icons-material";
import EmployeeForm from "./EmployeeForm";

const API_URL = "https://autochefsystem.azurewebsites.net/api/Users";

const roleMapping = {
  1: "Admin",
  2: "Staff",
  3: "Manager"
};

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/all?pageNumber=1&pageSize=10`, {
        headers: { "accept": "*/*" }
      });
      const data = await response.json();

      console.log("API Response:", data);

      if (data?.users) {
        setEmployees(data.users);  // Chỉ lấy mảng users
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };





  const handleSave = async (data) => {
    try {
      const method = editingEmployee ? "PUT" : "POST";
      const response = await fetch(API_URL, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: editingEmployee?.id || 0 })
      });

      if (response.ok) {
        fetchEmployees();
        setOpenForm(false);
        setEditingEmployee(null);
      }
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };



  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.userName.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleChangeRole = async (employee) => {
    const newRoleId = employee.roleId === 1 ? 2 : employee.roleId === 2 ? 3 : 1; // Vòng xoay đổi role
    try {
      await fetch(`${API_URL}/${employee.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...employee, roleId: newRoleId })
      });
      fetchEmployees();
      handleMenuClose();
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      const employeeToUpdate = employees.find(emp => emp.userId === id);
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...employeeToUpdate, isActive: false })
      });
      fetchEmployees();
      handleMenuClose();
    } catch (error) {
      console.error("Error deactivating employee:", error);
    }
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

              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <TableRow key={emp.userId}>
                  <TableCell>{emp.userName}</TableCell>
                  <TableCell>{emp.userFullName || "-"}</TableCell>
                  <TableCell>{roleMapping[emp.roleId]}</TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, emp)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>


        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredEmployees.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleChangeRole(selectedEmployee)}>
          <Edit fontSize="small" /> Change Role
        </MenuItem>
        <MenuItem onClick={() => handleSoftDelete(selectedEmployee.userId)}>
          <Delete fontSize="small" color="error" /> Deactivate
        </MenuItem>
      </Menu>


      <EmployeeForm open={openForm} handleClose={() => setOpenForm(false)} onSave={handleSave} employee={editingEmployee} />
    </Box>
  );
};

export default EmployeeTable;
