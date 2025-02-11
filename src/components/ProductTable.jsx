import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Avatar, Box, Typography, Button, IconButton, Menu, MenuItem
} from "@mui/material";
import { Edit, Delete, Add, MoreVert } from "@mui/icons-material";
import ProductForm from "./ProductForm";

const initialProducts = [
  { id: 1, name: "Pho", price: "50,000 VND", category: "Vietnamese Food", image: "src/assets/pho.png" },
  { id: 2, name: "Hu tieu", price: "50,000 VND", category: "Vietnamese Food", image: "src/assets/hutieu.png" },
  { id: 3, name: "Banh canh", price: "50,000 VND", category: "Vietnamese Food", image: "src/assets/banhcanh.png" },
];

const ProductTable = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data) => {
    if (editingProduct) {
      setProducts(products.map(prod => (prod.id === editingProduct.id ? { ...data, id: prod.id } : prod)));
    } else {
      setProducts([...products, { ...data, id: Date.now() }]);
    }
    setOpenForm(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    setProducts(products.filter(prod => prod.id !== id));
  };

  const handleMenuClick = (event, product) => {
    setAnchorEl(event.currentTarget);
    setSelectedProduct(product);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Product Management</Typography>

      <Box display="flex" justifyContent="space-between" marginBottom={2}>
        <TextField label="Search product..." size="small" variant="outlined" onChange={(e) => setSearch(e.target.value)} />
        <Button variant="contained" size="small" color="success" startIcon={<Add />} onClick={() => setOpenForm(true)}>
          Add new product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Price</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((prod, index) => (
              <TableRow
                key={prod.id}
                sx={{
                  "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                  "&:hover": { backgroundColor: "#eef6ff" },
                }}
              >
                <TableCell sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={prod.image} alt={prod.name} />
                  <Box>
                    <Typography fontWeight="bold">{prod.name}</Typography>
                    <Typography variant="body2" color="textSecondary">#P000{index + 1}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{
                    display: "inline-block",
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold"
                  }}>
                    {prod.price}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{
                    display: "inline-block",
                    backgroundColor: "#d4edda",
                    color: "#155724",
                    padding: "4px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold"
                  }}>
                    {prod.category}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => handleMenuClick(e, prod)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { setEditingProduct(selectedProduct); setOpenForm(true); handleMenuClose(); }}>
          <Edit fontSize="small" /> Edit
        </MenuItem>
        <MenuItem onClick={() => { handleDelete(selectedProduct.id); handleMenuClose(); }}>
          <Delete fontSize="small" color="error" /> Delete
        </MenuItem>
      </Menu>

      <ProductForm open={openForm} handleClose={() => setOpenForm(false)} onSave={handleSave} product={editingProduct} />
    </Box>
  );
};

export default ProductTable;
