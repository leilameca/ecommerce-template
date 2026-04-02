const express = require("express");

const {
  getStoreConfig,
  upsertStoreConfig,
} = require("../controllers/store-config.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", getStoreConfig);
router.put("/", protect, restrictTo("super-admin", "admin"), upsertStoreConfig);

module.exports = router;
