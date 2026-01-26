const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ========== PRODUCTS ==========

// Get all products
export const getAllProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
};

// Get products by category
export const getProductsByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/products?category=${category}`);
  return res.json();
};

// Get single product by ID
export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  return res.json();
};

// ========== HOME SECTIONS (BANNERS) ==========

// Get all homepage sections
export const getHomeSections = async () => {
  const res = await fetch(`${BASE_URL}/home-sections`);
  return res.json();
};

// OPTIONAL: Get single home section (if ever needed)
export const getHomeSectionById = async (id) => {
  const res = await fetch(`${BASE_URL}/home-sections/${id}`);
  return res.json();
};
