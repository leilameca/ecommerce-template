const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { signCustomerToken } = require("../utils/jwt");

const ORDER_PRODUCT_POPULATE_FIELDS = "name slug price";

const formatCustomer = (customer) => ({
  id: customer._id,
  name: customer.name,
  email: customer.email,
  phone: customer.phone || "",
});

const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "Name is required.");
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    throw new ApiError(400, "Email is required.");
  }

  if (!password || typeof password !== "string" || password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters.");
  }

  const existing = await Customer.findOne({ email: email.toLowerCase().trim() });

  if (existing) {
    throw new ApiError(409, "This email is already registered.");
  }

  const customer = await Customer.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    phone: phone ? String(phone).trim() : "",
  });

  const token = signCustomerToken(customer);

  res.status(201).json({
    success: true,
    message: "Account created successfully.",
    data: { token, customer: formatCustomer(customer) },
  });
});

const loginCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const customer = await Customer.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!customer || !customer.isActive) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const isValid = await customer.comparePassword(password);

  if (!isValid) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const token = signCustomerToken(customer);

  res.status(200).json({
    success: true,
    message: "Logged in successfully.",
    data: { token, customer: formatCustomer(customer) },
  });
});

const getCustomerProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: formatCustomer(req.customer),
  });
});

const getCustomerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.customer._id })
    .sort({ createdAt: -1 })
    .populate("items.product", ORDER_PRODUCT_POPULATE_FIELDS)
    .lean();

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  getCustomerOrders,
};
