const express = require("express");

const {
  loginUser,
  getCurrentUser,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);

module.exports = router;
