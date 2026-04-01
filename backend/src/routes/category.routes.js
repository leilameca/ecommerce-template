const express = require("express");

const { listCategoriesBase } = require("../controllers/category.controller");

const router = express.Router();

router.get("/", listCategoriesBase);

module.exports = router;
