const express = require("express");

const {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  getCustomerOrders,
  requestPasswordReset,
  resetPassword,
  updateCustomerProfile,
  changeCustomerPassword,
} = require("../controllers/customer.controller");
const { protectCustomer } = require("../middlewares/customer.middleware");

const router = express.Router();

router.post("/register", registerCustomer);
router.post("/login", loginCustomer);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/me", protectCustomer, getCustomerProfile);
router.put("/me", protectCustomer, updateCustomerProfile);
router.put("/me/password", protectCustomer, changeCustomerPassword);
router.get("/orders", protectCustomer, getCustomerOrders);

module.exports = router;
