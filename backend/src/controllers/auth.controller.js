const User = require("../models/user.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { signUserToken } = require("../utils/jwt");

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  }).select("+password");

  if (!user || !user.isActive) {
    throw new ApiError(401, "Invalid user credentials.");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials.");
  }

  const token = signUserToken(user);

  res.status(200).json({
    success: true,
    message: "User authenticated successfully.",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    },
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

module.exports = {
  loginUser,
  getCurrentUser,
};
