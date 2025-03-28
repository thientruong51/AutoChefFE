import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete, MoreVert } from "@mui/icons-material";
import RecipestepForm from "../components/RecipeStepForm";

const API_URL = import.meta.env.VITE_API_URL;

const Recipesteps = () => {
  const [allSteps, setAllSteps] = useState([]);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const response = await fetch(
        `${API_URL}/recipesteps/all?pageNumber=1&pageSize=100`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch recipe steps");
      }
      const data = await response.json();
      const tasks = data.tasks || [];
      setAllSteps(tasks);
    } catch (error) {
      console.error("Error fetching recipe steps:", error);
    }
  };

  const filteredSteps = allSteps.filter((step) =>
    step.stepDescription.toLowerCase().includes(search.toLowerCase())
  );

  const groupStepsByRecipe = (steps) => {
    return steps.reduce((groups, step) => {
      const recipeId = step.recipeId;
      if (!groups[recipeId]) {
        groups[recipeId] = [];
      }
      groups[recipeId].push(step);
      return groups;
    }, {});
  };

  const groupedSteps = groupStepsByRecipe(filteredSteps);

  const handleSave = async (step) => {
    try {
      const method = editingStep ? "PUT" : "POST";
      const url = `${API_URL}/recipesteps`;
      const body = editingStep
        ? {
            stepId: editingStep.stepId,
            recipeId: step.recipeId,
            stepDescription: step.stepDescription,
            stepNumber: step.stepNumber,
          }
        : {
            recipeId: step.recipeId,
            stepDescription: step.stepDescription,
            stepNumber: step.stepNumber,
          };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to save recipe step");

      const newStep = await response.json();

      if (editingStep) {
        setAllSteps((prev) =>
          prev.map((item) =>
            item.stepId === editingStep.stepId ? newStep : item
          )
        );
      } else {
        setAllSteps((prev) => [newStep, ...prev]);
      }
      setOpenForm(false);
      setEditingStep(null);
    } catch (error) {
      console.error("Error saving recipe step:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/recipesteps/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete recipe step");
      setAllSteps((prev) => prev.filter((step) => step.stepId !== id));
    } catch (error) {
      console.error("Error deleting recipe step:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Recipe Steps Management
      </Typography>
      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <TextField
          label="Search step description..."
          size="small"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          variant="contained"
          size="medium"
          color="success"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Add New Step
        </Button>
      </Box>

      {Object.keys(groupedSteps).map((recipeId) => (
        <Box key={recipeId} sx={{ marginBottom: 4 }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Recipe ID: {recipeId}
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Step Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Step Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedSteps[recipeId].map((step, index) => (
                  <TableRow key={step.stepId || `temp-${index}`}>
                    <TableCell>{step.stepNumber}</TableCell>
                    <TableCell>{step.stepDescription}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={(e) => {
                          setAnchorEl(e.currentTarget);
                          setSelectedStep(step);
                        }}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                      >
                        <MenuItem
                          onClick={() => {
                            setEditingStep(selectedStep);
                            setOpenForm(true);
                            setAnchorEl(null);
                          }}
                        >
                          <Edit fontSize="small" /> Edit
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleDelete(selectedStep.stepId);
                            setAnchorEl(null);
                          }}
                        >
                          <Delete fontSize="small" color="error" /> Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      <RecipestepForm
        open={openForm}
        handleClose={() => {
          setOpenForm(false);
          setEditingStep(null);
        }}
        onSave={handleSave}
        recipestep={editingStep}
      />
    </Box>
  );
};

export default Recipesteps;
