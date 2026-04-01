const Category = require("../models/category.model");
const asyncHandler = require("../utils/async-handler");

const listCategoriesBase = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  res.status(200).json({
    success: true,
    message: "Category module base is ready for CRUD expansion.",
    count: categories.length,
    data: categories,
  });
});

module.exports = {
  listCategoriesBase,
};
