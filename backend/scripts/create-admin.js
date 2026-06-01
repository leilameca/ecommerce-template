/**
 * Run once to create the initial super-admin user.
 * Usage: node scripts/create-admin.js
 * Set MONGODB_URI in your environment or .env before running.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@tienda.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin1234!";
const ADMIN_NAME = process.env.ADMIN_NAME || "Super Admin";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`User ${ADMIN_EMAIL} already exists. Nothing to do.`);
    process.exit(0);
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "super-admin",
  });

  console.log(`\nSuper-admin created:`);
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${ADMIN_PASSWORD}`);
  console.log(`\nChange the password from the admin panel after first login.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
