import asyncHandler from "express-async-handler";

import Product from "../models/productModel.js";

//@desc    fetch all products
//@route   GET /api/products
//@access  PUBLIC
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc    fetch single products
//@route   GET /api/products/:id
//@access  PUBLIC
const getProductById = asyncHandler(async () => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProductById, getProducts };