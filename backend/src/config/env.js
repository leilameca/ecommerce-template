const dotenv = require("dotenv");

dotenv.config();

const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  CLIENT_URL: process.env.CLIENT_URL?.trim() || "http://localhost:5173",
  MONGODB_URI: process.env.MONGODB_URI?.trim() || "",
  JWT_SECRET: process.env.JWT_SECRET?.trim() || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN?.trim() || "7d",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL?.trim() || "",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD?.trim() || "",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME?.trim() || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim() || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim() || "",
});

const validateEnv = () => {
  if (!env.MONGODB_URI) {
    throw new Error(
      "Missing MONGODB_URI. Add your MongoDB connection string in the .env file."
    );
  }

  if (!env.JWT_SECRET) {
    throw new Error(
      "Missing JWT_SECRET. Add a non-empty JWT_SECRET in the .env file."
    );
  }
};

module.exports = {
  env,
  validateEnv,
};
