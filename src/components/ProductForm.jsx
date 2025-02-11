import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from "@mui/material";

const ProductForm = ({ open, handleClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ name: "", price: "", category: "", image: "" });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{product ? "Edit product" : "Add new product"}</DialogTitle>
      <DialogContent>
        <TextField label="Product name" name="name" fullWidth margin="dense" value={formData.name} onChange={handleChange} />
        <TextField label="Price" name="price" fullWidth margin="dense" value={formData.price} onChange={handleChange} />
        <TextField label="Category" name="category" fullWidth margin="dense" value={formData.category} onChange={handleChange} />
        <TextField label="Image (URL)" name="image" fullWidth margin="dense" value={formData.image} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">Cancel</Button>
        <Button onClick={() => onSave(formData)} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;
