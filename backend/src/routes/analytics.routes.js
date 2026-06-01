const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const { getSalesAnalytics } = require("../controllers/analytics.controller");

const router = express.Router();

router.use(protect, restrictTo("super-admin", "admin", "manager"));
router.get("/sales", getSalesAnalytics);

module.exports = router;
