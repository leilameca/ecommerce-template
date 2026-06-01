const express = require("express");
const { createStripeSession } = require("../controllers/stripe.controller");

const router = express.Router();

// Public: called right after order creation, before redirect to Stripe
// Webhook is registered in app.js before express.json() to preserve raw body
router.post("/create-session", createStripeSession);

module.exports = router;
