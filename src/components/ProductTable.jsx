import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, Box, Typography, Button, IconButton, Menu, MenuItem, Pagination, Select, FormControl, InputLabel
} from "@mui/material";
import { Edit, Delete, Add, MoreVert } from "@mui/icons-material";
import ProductForm from "./ProductForm";

const API_URL = "https://autochefsystem.azurewebsites.net/api/Recipe";

const ProductTable = ({ formData }) => {
  const [allRecipes, setAllRecipes] = useState([]); 
  const [recipes, setRecipes] = useState([]); 
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (page = 1, pageSize = 100) => { 
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Missing authentication token");
  
      const url = new URL(`${API_URL}/all`);
      url.searchParams.append("page", page);
      url.searchParams.append("pageSize", pageSize); 
  
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        console.error("Response Text:", await response.text());
        throw new Error("Failed to fetch recipes");
      }
  
      const data = await response.json();
      console.log("Total Recipes Fetched:", data.recipes.length); 
  
      setAllRecipes(data.recipes || []);
      handleSortAndFilter(data.recipes || [], search, sortOrder, page);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };
  
  

  const handleSortAndFilter = (recipesData, searchValue, sortValue, pageValue) => {
    let filtered = recipesData.filter(r =>
      r.recipeName.toLowerCase().includes(searchValue.toLowerCase())
    );

    switch (sortValue) {
      case "newest":
        filtered.sort((a, b) => b.recipeId - a.recipeId);
        break;
      case "oldest":
        filtered.sort((a, b) => a.recipeId - b.recipeId);
        break;
      case "alphabet":
        filtered.sort((a, b) => a.recipeName.localeCompare(b.recipeName));
        break;
      default:
        break;
    }

    setTotalPages(Math.ceil(filtered.length / pageSize));
    setRecipes(filtered.slice((pageValue - 1) * pageSize, pageValue * pageSize));
  };

  useEffect(() => {
    handleSortAndFilter(allRecipes, search, sortOrder, page);
  }, [search, sortOrder, page, allRecipes]);

  const handleSave = async (recipe) => {
  

    try {
      const token = localStorage.getItem("token");
      const method = editingRecipe ? "PUT" : "POST";
      const url = editingRecipe ? `${API_URL}` : `${API_URL}/create`;
      const body = editingRecipe
        ? {
            recipeId: editingRecipe.recipeId,
            recipeName: recipe.recipeName,
            ingredients: recipe.ingredients,
            description: recipe.description,
            imageUrl: recipe.imageUrl,
          }
        : {
            recipeName: recipe.recipeName,
            ingredients: recipe.ingredients,
            description: recipe.description,
            imageUrl: recipe.imageUrl,
          };

      

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Failed to save recipe");

      const newRecipe = await response.json();

      if (editingRecipe) {
        setAllRecipes((prev) =>
          prev.map((item) =>
            item.recipeId === editingRecipe.recipeId ? newRecipe : item
          )
        );
      } else {
        setAllRecipes((prev) => [newRecipe, ...prev]);
      }

      setOpenForm(false);
      setEditingRecipe(null);
      setPage(1);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to delete recipe");

      setAllRecipes(prev => prev.filter(recipe => recipe.recipeId !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>Product Management</Typography>
      <Box display="flex"justifyContent="space-between" marginBottom={2}>
        <TextField label="Search product..." size="small" variant="outlined" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Box >
        <FormControl size="small" sx={{ minWidth: 100, marginRight:3 }} >
          <InputLabel>Sort By</InputLabel>
          <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="oldest">Oldest</MenuItem>
            <MenuItem value="alphabet">A-Z</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" size="medium" color="success" startIcon={<Add />} onClick={() => setOpenForm(true)}>
          Add new product
        </Button>
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f8f9fa" }}>
            <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Ingredients</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe, index) => (
              <TableRow key={recipe.recipeId || `temp-${index}`}>
                <TableCell>
        {recipe.imageUrl && <img src={recipe.imageUrl} alt="Recipe" style={{ width: 100, height: 100 }} />}
      </TableCell>
                <TableCell>{recipe.recipeName}</TableCell>
                <TableCell>{recipe.ingredients}</TableCell>
                <TableCell>{recipe.description}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setSelectedRecipe(recipe); }}>
                    <MoreVert />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                    <MenuItem onClick={() => { setEditingRecipe(selectedRecipe); setOpenForm(true); setAnchorEl(null); }}>
                      <Edit fontSize="small" /> Edit
                    </MenuItem>
                    <MenuItem onClick={() => { handleDelete(selectedRecipe.recipeId); setAnchorEl(null); }}>
                      <Delete fontSize="small" color="error" /> Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }} />

      <ProductForm open={openForm} handleClose={() => setOpenForm(false)} onSave={handleSave} product={editingRecipe} />
    </Box>
  );
};

export default ProductTable;
