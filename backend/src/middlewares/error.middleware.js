const { env } = require("../config/env");
const ApiError = require("../utils/api-error");

const notFoundMiddleware = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === "CastError") {
    error = new ApiError(400, `Invalid value for ${err.path}.`);
  }

  if (err.code === 11000) {
    const duplicatedFields = Object.keys(err.keyValue || {}).join(", ");
    error = new ApiError(409, `Duplicated value for: ${duplicatedFields}`);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    error = new ApiError(400, message);
  }

  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid authentication token.");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Authentication token expired.");
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error.";

  res.status(statusCode).json({
    success: false,
    message,
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = {
  notFoundMiddleware,
  errorHandler,
};
