const path = require("path");
const dotenv = require("dotenv");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const env = Object.freeze({
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,
  CLIENT_URL: process.env.CLIENT_URL?.trim() || "http://localhost:5173",
  MONGODB_URI: process.env.MONGODB_URI?.trim() || "",
  JWT_SECRET: process.env.JWT_SECRET?.trim() || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN?.trim() || "7d",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL?.trim() || "admin@example.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD?.trim() || "ChangeMe123!",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME?.trim() || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim() || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim() || "",
  // Stripe (optional — leave blank to disable online payment)
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY?.trim() || "",
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET?.trim() || "",
  // Email via SMTP (optional — leave blank to disable order emails)
  SMTP_HOST: process.env.SMTP_HOST?.trim() || "",
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER?.trim() || "",
  SMTP_PASS: process.env.SMTP_PASS?.trim() || "",
  SMTP_FROM: process.env.SMTP_FROM?.trim() || "",
  BREVO_API_KEY: process.env.BREVO_API_KEY?.trim() || "",
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID?.trim() || "",
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET?.trim() || "",
  PAYPAL_MODE: process.env.PAYPAL_MODE?.trim() || "sandbox",
  STORE_NOTIFICATION_EMAIL: process.env.STORE_NOTIFICATION_EMAIL?.trim() || "",
});

const validateEnv = () => {
  if (!env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI");
  }

  if (!env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET");
  }
};

module.exports = {
  env,
  validateEnv,
};
