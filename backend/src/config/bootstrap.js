const User = require("../models/user.model");
const { env } = require("./env");

const ensureDefaultUserSeed = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.log(
      "[seed] Default user skipped. Set ADMIN_EMAIL and ADMIN_PASSWORD."
    );
    return;
  }

  const normalizedEmail = env.ADMIN_EMAIL.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return;
  }

  await User.create({
    name: "Store Owner",
    email: normalizedEmail,
    password: env.ADMIN_PASSWORD,
    role: "super-admin",
  });

  console.log(`[seed] Default super-admin user created for ${normalizedEmail}`);
};

module.exports = {
  ensureDefaultUserSeed,
};
