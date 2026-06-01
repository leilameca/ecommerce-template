const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const {
  listCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/coupon.controller");

const router = express.Router();

// Public — checkout calls this to verify a code before placing the order
router.post("/validate", validateCoupon);

// Admin only
router.use(protect, restrictTo("super-admin", "admin", "manager"));
router.get("/", listCoupons);
router.post("/", createCoupon);
router.patch("/:id/toggle", toggleCoupon);
router.delete("/:id", deleteCoupon);

module.exports = router;
