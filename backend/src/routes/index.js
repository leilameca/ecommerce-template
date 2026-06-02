const uploadRoutes = require("./upload.routes");
const express = require("express");

const healthRoutes = require("./health.routes");
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const categoryRoutes = require("./category.routes");
const orderRoutes = require("./order.routes");
const storeConfigRoutes = require("./store-config.routes");
const userRoutes = require("./user.routes");
const stripeRoutes = require("./stripe.routes");
const couponRoutes = require("./coupon.routes");
const analyticsRoutes = require("./analytics.routes");
const customerRoutes = require("./customer.routes");
const contactRoutes = require("./contact.routes");
const paymentRoutes = require("./payment.routes");

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/store-config", storeConfigRoutes);
router.use("/uploads", uploadRoutes);
router.use("/users", userRoutes);
router.use("/stripe", stripeRoutes);
router.use("/coupons", couponRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/customers", customerRoutes);
router.use("/contact", contactRoutes);
router.use("/payments", paymentRoutes);

module.exports = router;
