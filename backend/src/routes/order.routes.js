const express = require("express");

const { listOrdersBase } = require("../controllers/order.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", protect, listOrdersBase);

module.exports = router;
