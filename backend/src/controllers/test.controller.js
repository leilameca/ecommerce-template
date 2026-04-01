const { env } = require("../config/env");
const { isCloudinaryConfigured } = require("../config/cloudinary");
const asyncHandler = require("../utils/async-handler");

const getHealthCheck = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: "API base ready to scale.",
    data: {
      environment: env.NODE_ENV,
      uptimeInSeconds: Number(process.uptime().toFixed(2)),
      timestamp: new Date().toISOString(),
      cloudinaryReady: isCloudinaryConfigured,
    },
  });
});

module.exports = {
  getHealthCheck,
};
