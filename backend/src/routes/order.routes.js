const express = require("express");

const {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus,
  getPublicOrder,
} = require("../controllers/order.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const { optionalCustomer } = require("../middlewares/customer.middleware");

const router = express.Router();

router.get("/public/:id", getPublicOrder);

router
  .route("/")
  .post(optionalCustomer, createOrder)
  .get(protect, restrictTo("super-admin", "admin", "manager"), listOrders);

router.get(
  "/:id",
  protect,
  restrictTo("super-admin", "admin", "manager"),
  getOrderById
);

router.patch(
  "/:id/status",
  protect,
  restrictTo("super-admin", "admin", "manager"),
  updateOrderStatus
);

module.exports = router;
