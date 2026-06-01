const express = require("express");
const { protect, authorize } = require("../middlewares/auth.middleware");
const { getSalesAnalytics } = require("../controllers/analytics.controller");

const router = express.Router();

router.use(protect, authorize("super-admin", "admin", "manager"));
router.get("/sales", getSalesAnalytics);

module.exports = router;
