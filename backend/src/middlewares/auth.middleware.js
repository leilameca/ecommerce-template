const jwt = require("jsonwebtoken");

const { env } = require("../config/env");
const User = require("../models/user.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");

const protect = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    throw new ApiError(401, "Authentication token is required.");
  }

  const token = authorization.split(" ")[1];
  const decoded = jwt.verify(token, env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");

  if (!user || !user.isActive) {
    throw new ApiError(401, "Authenticated user not found or inactive.");
  }

  req.user = user;
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new ApiError(403, "You do not have permission to access this resource."));
      return;
    }

    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
