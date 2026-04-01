const Order = require("../models/order.model");
const asyncHandler = require("../utils/async-handler");

const listOrdersBase = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("items.product", "name price")
    .lean();

  res.status(200).json({
    success: true,
    message: "Order module base is ready for creation and management flows.",
    count: orders.length,
    data: orders,
  });
});

module.exports = {
  listOrdersBase,
};
