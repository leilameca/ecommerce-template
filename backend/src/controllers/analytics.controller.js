const Order = require("../models/order.model");
const asyncHandler = require("../utils/async-handler");

const getSalesAnalytics = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [revenueByDay, topProducts, byStatus, totals] = await Promise.all([
    // Revenue per day for the requested window
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", revenue: 1, orders: 1 } },
    ]),

    // Top 5 products by quantity sold
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          quantity: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.lineTotal" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, name: "$_id", quantity: 1, revenue: 1 } },
    ]),

    // Orders by status
    Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]),

    // Summary totals
    Order.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: { $round: ["$totalRevenue", 2] },
          totalOrders: 1,
          avgOrderValue: { $round: ["$avgOrderValue", 2] },
        },
      },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      summary: totals[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
      revenueByDay,
      topProducts,
      byStatus,
    },
  });
});

module.exports = { getSalesAnalytics };
