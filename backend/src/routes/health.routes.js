const express = require("express");

const { getHealthCheck } = require("../controllers/test.controller");

const router = express.Router();

router.get("/", getHealthCheck);

module.exports = router;
