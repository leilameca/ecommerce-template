const express = require("express");

const {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router
  .route("/")
  .post(createOrder)
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
