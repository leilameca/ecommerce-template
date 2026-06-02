const express = require("express");
const { runSeed } = require("../controllers/seed.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

// Admin only — POST /api/v1/seed   (add ?reset=true to clear first)
router.post("/", protect, restrictTo("super-admin", "admin"), runSeed);

module.exports = router;
