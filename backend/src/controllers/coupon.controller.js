const Coupon = require("../models/coupon.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");

const serializeCoupon = (c) => ({
  id: c._id,
  code: c.code,
  type: c.type,
  value: c.value,
  minOrderAmount: c.minOrderAmount,
  maxUses: c.maxUses,
  usedCount: c.usedCount,
  expiresAt: c.expiresAt,
  isActive: c.isActive,
  createdAt: c.createdAt,
});

const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: coupons.map(serializeCoupon) });
});

const createCoupon = asyncHandler(async (req, res) => {
  const { code, type, value, minOrderAmount, maxUses, expiresAt } = req.body;

  if (!code || typeof code !== "string") throw new ApiError(400, "Code is required.");
  if (!["percentage", "fixed"].includes(type)) throw new ApiError(400, "Type must be percentage or fixed.");
  if (typeof value !== "number" || value <= 0) throw new ApiError(400, "Value must be a positive number.");
  if (type === "percentage" && value > 100) throw new ApiError(400, "Percentage cannot exceed 100.");

  const coupon = await Coupon.create({
    code: code.trim().toUpperCase(),
    type,
    value,
    minOrderAmount: minOrderAmount || 0,
    maxUses: maxUses || null,
    expiresAt: expiresAt || null,
  });

  res.status(201).json({ success: true, data: serializeCoupon(coupon.toObject()) });
});

const toggleCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw new ApiError(404, "Coupon not found.");

  coupon.isActive = !coupon.isActive;
  await coupon.save();

  res.status(200).json({ success: true, data: serializeCoupon(coupon.toObject()) });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, "Coupon not found.");
  res.status(200).json({ success: true, message: "Coupon deleted." });
});

// Public endpoint — called from checkout to validate a code
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderSubtotal } = req.body;

  if (!code) throw new ApiError(400, "Coupon code is required.");

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

  if (!coupon || !coupon.isActive) {
    throw new ApiError(404, "Invalid or inactive coupon code.");
  }

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    throw new ApiError(400, "This coupon has expired.");
  }

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    throw new ApiError(400, "This coupon has reached its usage limit.");
  }

  if (orderSubtotal !== undefined && coupon.minOrderAmount > 0 && orderSubtotal < coupon.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount for this coupon is ${coupon.minOrderAmount}.`);
  }

  const discount =
    coupon.type === "percentage"
      ? Number(((orderSubtotal || 0) * (coupon.value / 100)).toFixed(2))
      : coupon.value;

  res.status(200).json({
    success: true,
    data: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount: discount,
    },
  });
});

module.exports = { listCoupons, createCoupon, toggleCoupon, deleteCoupon, validateCoupon };
