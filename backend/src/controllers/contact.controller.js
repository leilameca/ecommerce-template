const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { sendContactMessage } = require("../services/email.service");

const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "Name is required.");
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new ApiError(400, "Email is required.");
  }
  if (!message || typeof message !== "string" || !message.trim()) {
    throw new ApiError(400, "Message is required.");
  }

  sendContactMessage({ name: name.trim(), email: email.trim(), message: message.trim() }).catch(() => {});

  res.status(200).json({ success: true, message: "Your message has been received." });
});

module.exports = { submitContact };
