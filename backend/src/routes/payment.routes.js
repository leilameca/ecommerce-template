const express = require("express");
const { createPaypalOrderHandler, capturePaypalOrderHandler } = require("../controllers/payment.controller");
const { optionalCustomer } = require("../middlewares/customer.middleware");

const router = express.Router();

router.post("/paypal/create-order", createPaypalOrderHandler);
router.post("/paypal/capture-order", optionalCustomer, capturePaypalOrderHandler);

module.exports = router;
