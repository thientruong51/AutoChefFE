import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Edit, Delete, Add, MoreVert } from "@mui/icons-material";
import EmployeeForm from "./EmployeeForm";

const API_URL = `${import.meta.env.VITE_API_URL}/Users`;

const roleMapping = {
  1: "Admin",
  3: "Staff",
  2: "Manager",
};

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openChangeRoleDialog, setOpenChangeRoleDialog] = useState(false);
  const [openSoftDeleteDialog, setOpenSoftDeleteDialog] = useState(false);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/all?pageNumber=1&pageSize=10`, {
        headers: { accept: "*/*" },
      });
      const data = await response.json();
      console.log("API Response:", data);
      if (data?.users) {
        setEmployees(data.users);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  const handleAddEmployee = async (data) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        fetchEmployees();
        setOpenForm(false);
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const handleUpdateRole = async () => {
    try {
      const updatedEmployee = {
        userId: selectedEmployee.userId,
        userName: selectedEmployee.userName,
        password: selectedEmployee.password,
        roleId: newRole,
        userImage: selectedEmployee.userImage,
        
      };
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee),
      });
      if (response.ok) {
        fetchEmployees();
        handleCloseDialogs();
      }
    } catch (error) {
      console.error("Error updating employee role:", error);
    }
  };

  const handleSoftDelete = async (id) => {
    try {
      const employeeToUpdate = employees.find((emp) => emp.userId === id);
      const updatedEmployee = {
        userId: employeeToUpdate.userId,
        userName: employeeToUpdate.userName,
        password: employeeToUpdate.password,
        roleId: employeeToUpdate.roleId,
        userImage: employeeToUpdate.userImage,
        isActive: false, 
      };
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee),
      });
      if (response.ok) {
        fetchEmployees();
        handleCloseDialogs();
      }
    } catch (error) {
      console.error("Error deactivating employee:", error);
    }
  };

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const openRoleDialog = (employee) => {
    setSelectedEmployee(employee);
    setNewRole(employee.roleId);
    setOpenChangeRoleDialog(true);
    handleMenuClose();
  };

  const openDeleteDialog = (employee) => {
    setSelectedEmployee(employee);
    setOpenSoftDeleteDialog(true);
    handleMenuClose();
  };

  const handleCloseDialogs = () => {
    setOpenChangeRoleDialog(false);
    setOpenSoftDeleteDialog(false);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.userName.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Employee Management
      </Typography>

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
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Active</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <TableRow key={emp.userId}>
                  <TableCell>{emp.userName}</TableCell>
                  <TableCell>{roleMapping[emp.roleId]}</TableCell>
                <TableCell>{emp.isActive ? "Active" : "Inactive"}</TableCell>

                  <TableCell>
                    <IconButton onClick={(e) => handleMenuClick(e, emp)}>
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
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
        <MenuItem onClick={() => openRoleDialog(selectedEmployee)}>
          <Edit fontSize="small" /> Change Role
        </MenuItem>
        <MenuItem onClick={() => openDeleteDialog(selectedEmployee)}>
          <Delete fontSize="small" color="error" /> Deactivate
        </MenuItem>
      </Menu>

      <Dialog open={openChangeRoleDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Change Role</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-select-label">Position</InputLabel>
            <Select
              labelId="role-select-label"
              name="roleId"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              label="Position"
            >
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={3}>Staff</MenuItem>
              <MenuItem value={2}>Manager</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} color="error">
            Cancel
          </Button>
          <Button onClick={handleUpdateRole} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSoftDeleteDialog} onClose={handleCloseDialogs}>
        <DialogTitle>Deactivate Employee</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate {selectedEmployee?.userName}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} color="error">
            Cancel
          </Button>
          <Button onClick={() => handleSoftDelete(selectedEmployee.userId)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <EmployeeForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        onSave={handleAddEmployee}
        employee={null}
      />
    </Box>
  );
};

export default EmployeeTable;
