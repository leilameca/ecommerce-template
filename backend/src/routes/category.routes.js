const express = require("express");

const {
  listCategories,
  createCategory,
  getCategoryBySlug,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .get(listCategories)
  .post(protect, restrictTo("super-admin", "admin", "manager"), createCategory);

router.get("/slug/:slug", getCategoryBySlug);

router
  .route("/:id")
  .get(getCategoryById)
  .put(protect, restrictTo("super-admin", "admin", "manager"), updateCategory)
  .delete(protect, restrictTo("super-admin", "admin"), deleteCategory);

module.exports = router;
