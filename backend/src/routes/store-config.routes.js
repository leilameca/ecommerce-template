const express = require("express");

const {
  getStoreConfigBase,
  updateStoreConfigBase,
} = require("../controllers/store-config.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", getStoreConfigBase);
router.put("/", protect, restrictTo("admin", "super-admin"), updateStoreConfigBase);

module.exports = router;
