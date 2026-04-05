const express = require("express");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const { uploadImage } = require("../controllers/upload.controller");

const router = express.Router();

router.post(
  "/",
  protect,
  restrictTo("super-admin", "admin", "manager"),
  upload.single("image"),
  uploadImage
);

module.exports = router;