const crypto = require("crypto");

const Customer = require("../models/customer.model");
const Order = require("../models/order.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { signCustomerToken } = require("../utils/jwt");
const { sendPasswordResetEmail } = require("../services/email.service");
const { env } = require("../config/env");

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

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) throw new ApiError(400, "Email is required.");

  const customer = await Customer.findOne({ email: email.toLowerCase().trim() })
    .select("+resetPasswordToken +resetPasswordExpires");

  console.log(`[forgot-password] email="${email}" found=${Boolean(customer)} isActive=${customer?.isActive}`);

  // Always respond 200 to prevent email enumeration
  if (!customer || !customer.isActive) {
    res.status(200).json({ success: true, message: "If that email exists, a reset link was sent." });
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");
  customer.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  customer.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await customer.save();

  const resetUrl = `${env.CLIENT_URL}/account/reset-password?token=${token}`;
  console.log(`[forgot-password] Sending reset email to ${customer.email}`);
  await sendPasswordResetEmail({ email: customer.email, name: customer.name, resetUrl });

  res.status(200).json({ success: true, message: "If that email exists, a reset link was sent." });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) throw new ApiError(400, "Token and new password are required.");
  if (password.length < 8) throw new ApiError(400, "Password must be at least 8 characters.");

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const customer = await Customer.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpires +password");

  if (!customer) throw new ApiError(400, "Reset link is invalid or has expired.");

  customer.password = password;
  customer.resetPasswordToken = null;
  customer.resetPasswordExpires = null;
  await customer.save();

  const newToken = signCustomerToken(customer);

  res.status(200).json({
    success: true,
    message: "Password reset successfully.",
    data: { token: newToken, customer: formatCustomer(customer) },
  });
});

const updateCustomerProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (name !== undefined) {
    if (!name || typeof name !== "string" || !name.trim()) {
      throw new ApiError(400, "Name cannot be empty.");
    }
    req.customer.name = name.trim();
  }

  if (phone !== undefined) {
    req.customer.phone = String(phone).trim();
  }

  await req.customer.save();

  res.status(200).json({
    success: true,
    message: "Profile updated.",
    data: formatCustomer(req.customer),
  });
});

const changeCustomerPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new passwords are required.");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters.");
  }

  const customer = await Customer.findById(req.customer._id).select("+password");
  const isValid = await customer.comparePassword(currentPassword);

  if (!isValid) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  customer.password = newPassword;
  await customer.save();

  res.status(200).json({ success: true, message: "Password changed successfully." });
});

module.exports = {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  getCustomerOrders,
  requestPasswordReset,
  resetPassword,
  updateCustomerProfile,
  changeCustomerPassword,
};
