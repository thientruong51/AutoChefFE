import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const ProductForm = ({ open, handleClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    recipeId: 0,
    recipeName: "",
    ingredients: "",
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ recipeId: 0, recipeName: "", ingredients: "" });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
      <DialogContent>
        <TextField label="Recipe Name" name="recipeName" fullWidth margin="dense" value={formData.recipeName} onChange={handleChange} />
        <TextField label="Ingredients" name="ingredients" fullWidth margin="dense" value={formData.ingredients} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
        <Button onClick={() => onSave(formData)} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
