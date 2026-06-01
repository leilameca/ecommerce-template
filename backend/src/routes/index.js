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

module.exports = router;
