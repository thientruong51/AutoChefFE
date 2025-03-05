import React, { useState } from "react";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";

const Products = () => {
  const [formData, setFormData] = useState({
    recipeName: "",
    ingredients: "",
    imageUrl: "",
  });
  return (
    <div style={{ padding: "20px" }}>
      <ProductForm formData={formData} setFormData={setFormData} />
      <ProductTable formData={formData} />
    </div>
  );
};

export default Products;
