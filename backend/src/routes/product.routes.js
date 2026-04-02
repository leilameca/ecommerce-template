const express = require("express");

const {
  listProductsBase,
  createProduct,
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .get(listProductsBase)
  .post(protect, restrictTo("super-admin", "admin", "manager"), createProduct);

router.get("/slug/:slug", getProductBySlug);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, restrictTo("super-admin", "admin", "manager"), updateProduct)
  .delete(protect, restrictTo("super-admin", "admin"), deleteProduct);

module.exports = router;
