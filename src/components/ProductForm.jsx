import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import axios from "axios";

const ProductForm = ({ open, handleClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    recipeId: 0,
    recipeName: "",
    ingredients: "",
    description:"",
    imageUrl: "", 
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ recipeId: 0, recipeName: "", ingredients: "", description:"", imageUrl: "" });
    }
  }, [product]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", "autochef"); 
  
    setUploading(true);
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dkfykdjlm/image/upload",
        formDataUpload
      );
  
     
      console.log("Uploaded image URL:", res.data.secure_url);
  
      setFormData((prev) => {
        const updated = { ...prev, imageUrl: res.data.secure_url };
        
        return updated;
      });
      
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };
  
  

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Recipe Name"
          name="recipeName"
          fullWidth
          margin="dense"
          value={formData.recipeName}
          onChange={handleChange}
        />
       
        <TextField
          label="Ingredients"
          name="ingredients"
          fullWidth
          margin="dense"
          value={formData.ingredients}
          onChange={handleChange}
        />
         <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          value={formData.description}
          onChange={handleChange}
        />
        <input type="file" onChange={handleImageUpload} style={{ marginTop: 16 }} />
        {uploading && <p>Uploading...</p>}
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Uploaded"
            style={{ width: "100%", marginTop: 16, borderRadius: 8 }}
          />
        )}
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

export default ProductForm;
