const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { createPaypalOrder, capturePaypalOrder } = require("../services/paypal.service");
const { sendOrderNotification, sendCustomerOrderConfirmation } = require("../services/email.service");
const { env } = require("../config/env");

const createPaypalOrderHandler = asyncHandler(async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new ApiError(400, "Valid amount is required.");
  }

  console.log(`[paypal] create-order: amount=${amount} currency=${currency} mode=${env.PAYPAL_MODE} clientId=${env.PAYPAL_CLIENT_ID ? "set" : "MISSING"}`);

  const curr = (currency || "USD").toUpperCase();
  const order = await createPaypalOrder(Number(amount), curr);

  res.status(200).json({
    success: true,
    data: { paypalOrderId: order.id },
  });
});

const capturePaypalOrderHandler = asyncHandler(async (req, res) => {
  const {
    paypalOrderId,
    customerName,
    phone,
    address,
    notes,
    shipping,
    couponCode,
    items,
    customerEmail,
  } = req.body;

  if (!paypalOrderId) throw new ApiError(400, "PayPal order ID is required.");
  if (!customerName || !phone || !address) throw new ApiError(400, "Customer name, phone, and address are required.");
  if (!Array.isArray(items) || items.length === 0) throw new ApiError(400, "Order must have at least one item.");

  // Capture payment first
  const capture = await capturePaypalOrder(paypalOrderId);
  const captureStatus = capture?.status;
  if (captureStatus !== "COMPLETED") {
    throw new ApiError(400, `PayPal capture failed with status: ${captureStatus}`);
  }

  // Resolve products and calculate totals
  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = Object.fromEntries(products.map((p) => [String(p._id), p]));

  let subtotal = 0;
  const resolvedItems = items.map((item) => {
    const product = productMap[String(item.product)];
    if (!product) throw new ApiError(400, `Product not found: ${item.product}`);
    const qty = Math.max(1, Number(item.quantity) || 1);
    const lineTotal = product.price * qty;
    subtotal += lineTotal;
    return {
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: qty,
      lineTotal,
      variantSelections: item.variantSelections || {},
    };
  });

  // Apply coupon
  let discountAmount = 0;
  let appliedCoupon = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon && coupon.minimumOrderAmount <= subtotal) {
      discountAmount =
        coupon.discountType === "percentage"
          ? Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscountAmount || Infinity)
          : coupon.discountValue;
      appliedCoupon = coupon;
    }
  }

  const shippingCost = Math.max(0, Number(shipping) || 0);
  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  const order = await Order.create({
    customerName: customerName.trim(),
    customerEmail: customerEmail || "",
    phone: phone.trim(),
    address: address.trim(),
    notes: notes || "",
    items: resolvedItems,
    subtotal: Number(subtotal.toFixed(2)),
    shipping: Number(shippingCost.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    total: Number(total.toFixed(2)),
    paymentMethod: "online_payment",
    paymentStatus: "paid",
    paypalOrderId,
    couponCode: appliedCoupon?.code || "",
    customer: req.customer?._id || null,
  });

  if (appliedCoupon) {
    appliedCoupon.usageCount = (appliedCoupon.usageCount || 0) + 1;
    await appliedCoupon.save();
  }

  sendOrderNotification(order).catch(() => {});
  if (customerEmail) {
    sendCustomerOrderConfirmation({ ...order.toObject(), customerEmail }).catch(() => {});
  }

  res.status(201).json({
    success: true,
    message: "Payment captured and order created.",
    data: order,
  });
});

module.exports = { createPaypalOrderHandler, capturePaypalOrderHandler };
