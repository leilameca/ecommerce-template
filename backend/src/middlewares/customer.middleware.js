const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const Customer = require("../models/customer.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");

const protectCustomer = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is required.");
  }

  const token = authorization.split(" ")[1];
  let decoded;

  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token.");
  }

  if (decoded.type !== "customer") {
    throw new ApiError(401, "Invalid token type.");
  }

  const customer = await Customer.findById(decoded.id).select("-password");

  if (!customer || !customer.isActive) {
    throw new ApiError(401, "Account not found or inactive.");
  }

  req.customer = customer;
  next();
});

const optionalCustomer = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);

    if (decoded.type === "customer") {
      const customer = await Customer.findById(decoded.id).select("-password");
      if (customer && customer.isActive) {
        req.customer = customer;
      }
    }
  } catch {
    // token invalid or wrong type — proceed as guest
  }

  next();
});

module.exports = { protectCustomer, optionalCustomer };
