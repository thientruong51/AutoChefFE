import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const RecipestepForm = ({ open, handleClose, onSave, recipestep }) => {
  const [formData, setFormData] = useState({
    stepId: 0,
    recipeId: 0,
    stepDescription: "",
    stepNumber: 0,
  });

  useEffect(() => {
    if (recipestep) {
      setFormData(recipestep);
    } else {
      setFormData({
        stepId: 0,
        recipeId: 0,
        stepDescription: "",
        stepNumber: 0,
      });
    }
  }, [recipestep]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "recipeId" || name === "stepNumber"
          ? Number(value)
          : value,
    }));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{recipestep ? "Edit Recipe Step" : "Add New Recipe Step"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Recipe ID"
          name="recipeId"
          fullWidth
          margin="dense"
          type="number"
          value={formData.recipeId}
          onChange={handleChange}
        />
        <TextField
          label="Step Number"
          name="stepNumber"
          fullWidth
          margin="dense"
          type="number"
          value={formData.stepNumber}
          onChange={handleChange}
        />
        <TextField
          label="Step Description"
          name="stepDescription"
          fullWidth
          margin="dense"
          multiline
          value={formData.stepDescription}
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

export default RecipestepForm;
