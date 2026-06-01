const User = require("../models/user.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { validateObjectId } = require("../utils/validation");

const USER_ROLES = ["super-admin", "admin", "manager"];

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.status(200).json({ success: true, count: users.length, data: users });
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name?.trim()) throw new ApiError(400, "Name is required.");
  if (!email?.trim()) throw new ApiError(400, "Email is required.");
  if (!password || password.length < 8) throw new ApiError(400, "Password must be at least 8 characters.");
  if (role && !USER_ROLES.includes(role)) throw new ApiError(400, "Invalid role.");

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) throw new ApiError(409, "A user with this email already exists.");

  const user = await User.create({ name: name.trim(), email: email.trim(), password, role: role || "admin" });

  res.status(201).json({
    success: true,
    message: "User created successfully.",
    data: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive },
  });
});

const updateUser = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, "user id");

  const { name, email, role, isActive, password } = req.body;
  const targetId = req.params.id;

  // Only super-admin can change roles or deactivate; other admins can only update their own profile
  const isSelf = String(req.user._id) === targetId;
  const isSuperAdmin = req.user.role === "super-admin";

  if (!isSelf && !isSuperAdmin) {
    throw new ApiError(403, "You can only update your own profile.");
  }

  const user = await User.findById(targetId).select("+password");
  if (!user) throw new ApiError(404, "User not found.");

  if (name?.trim()) user.name = name.trim();
  if (email?.trim()) user.email = email.trim();
  if (password && password.length >= 8) user.password = password;

  if (isSuperAdmin) {
    if (role && USER_ROLES.includes(role)) user.role = role;
    if (typeof isActive === "boolean") user.isActive = isActive;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully.",
    data: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive },
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, "user id");

  if (String(req.user._id) === req.params.id) {
    throw new ApiError(400, "You cannot deactivate your own account.");
  }

  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) throw new ApiError(404, "User not found.");

  res.status(200).json({ success: true, message: "User deactivated successfully." });
});

module.exports = { listUsers, createUser, updateUser, deleteUser };
