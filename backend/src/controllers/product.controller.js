const Product = require("../models/product.model");
const asyncHandler = require("../utils/async-handler");

const listProductsBase = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("category", "name slug")
    .lean();

  res.status(200).json({
    success: true,
    message: "Product module base is ready for CRUD expansion.",
    count: products.length,
    data: products,
  });
});

module.exports = {
  listProductsBase,
};
