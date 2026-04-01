const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const USER_ROLES = ["super-admin", "admin", "manager"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "User email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "User password is required."],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "admin",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
