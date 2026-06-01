const express = require("express");

const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  getCustomerOrders,
} = require("../controllers/customer.controller");
const { protectCustomer } = require("../middlewares/customer.middleware");

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.get("/me", protectCustomer, getCustomerProfile);
router.get("/orders", protectCustomer, getCustomerOrders);

module.exports = router;
