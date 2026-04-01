const express = require("express");

const { listProductsBase } = require("../controllers/product.controller");

const router = express.Router();

router.get("/", listProductsBase);

module.exports = router;
