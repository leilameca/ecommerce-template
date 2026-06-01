const mongoose = require("mongoose");

const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { sendOrderNotification } = require("../services/email.service");
const {
  getPagination,
  buildPaginationMeta,
} = require("../utils/pagination");
const {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  ORDER_STATUSES,
} = require("../utils/ecommerce-constants");
const {
  pickAllowedFields,
  validateObjectId,
  validateNumber,
  validateNonEmptyArray,
  validateString,
} = require("../utils/validation");

const ALLOWED_ORDER_FIELDS = [
  "customerName",
  "phone",
  "address",
  "notes",
  "items",
  "shipping",
  "paymentMethod",
  "couponCode",
];
const ORDER_PRODUCT_POPULATE_FIELDS = "name slug price";

const roundCurrencyValue = (value) => {
  return Number(value.toFixed(2));
};

const populateOrderProducts = (query) => {
  return query.populate("items.product", ORDER_PRODUCT_POPULATE_FIELDS);
};

const validateCreateOrderPayload = (payload) => {
  validateString(payload.customerName, "customer name");
  validateString(payload.phone, "phone");
  validateString(payload.address, "address");
  validateString(payload.notes, "notes");
  validateNumber(payload.shipping, "shipping", { min: 0 });

  if (!payload.customerName || !payload.customerName.trim()) {
    throw new ApiError(400, "Customer name is required.");
  }

  if (!payload.phone || !payload.phone.trim()) {
    throw new ApiError(400, "Phone is required.");
  }

  if (!payload.address || !payload.address.trim()) {
    throw new ApiError(400, "Address is required.");
  }

  validateNonEmptyArray(payload.items, "items");

  if (
    payload.paymentMethod !== undefined &&
    !PAYMENT_METHODS.includes(payload.paymentMethod)
  ) {
    throw new ApiError(400, "Invalid payment method.");
  }
};

const normalizeOrderItemsInput = (items) => {
  return items.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new ApiError(400, `Items item ${index + 1} must be an object.`);
    }

    validateObjectId(item.product, `items item ${index + 1} product id`);
    validateNumber(item.quantity, `items item ${index + 1} quantity`, {
      min: 1,
      integer: true,
    });

    return {
      product: String(item.product),
      quantity: item.quantity,
      variantSelections:
        item.variantSelections && typeof item.variantSelections === "object"
          ? item.variantSelections
          : {},
    };
  });
};

const aggregateRequestedQuantities = (items) => {
  return items.reduce((accumulator, item) => {
    const currentQuantity = accumulator.get(item.product) || 0;
    accumulator.set(item.product, currentQuantity + item.quantity);
    return accumulator;
  }, new Map());
};

const createOrder = asyncHandler(async (req, res) => {
  const orderPayload = pickAllowedFields(req.body, ALLOWED_ORDER_FIELDS);

  validateCreateOrderPayload(orderPayload);

  const normalizedItems = normalizeOrderItemsInput(orderPayload.items);
  const requestedQuantities = aggregateRequestedQuantities(normalizedItems);
  const productIds = [...new Set(normalizedItems.map((item) => item.product))];
  const session = await mongoose.startSession();
  let createdOrder;

  try {
    await session.withTransaction(async () => {
      const products = await Product.find({
        _id: { $in: productIds },
        isActive: true,
      })
        .select("name price stock isActive")
        .session(session);

      if (products.length !== productIds.length) {
        throw new ApiError(
          404,
          "One or more selected products were not found or are inactive."
        );
      }

      const productsMap = new Map(
        products.map((product) => [String(product._id), product])
      );

      requestedQuantities.forEach((requestedQuantity, productId) => {
        const dbProduct = productsMap.get(productId);

        if (!dbProduct) {
          throw new ApiError(
            404,
            "One or more selected products were not found or are inactive."
          );
        }

        if (dbProduct.stock < requestedQuantity) {
          throw new ApiError(
            400,
            `Insufficient stock for product "${dbProduct.name}".`
          );
        }
      });

      const items = normalizedItems.map(({ product, quantity, variantSelections }) => {
        const dbProduct = productsMap.get(product);
        const lineTotal = roundCurrencyValue(dbProduct.price * quantity);

        return {
          product: dbProduct._id,
          name: dbProduct.name,
          price: dbProduct.price,
          quantity,
          lineTotal,
          variantSelections: variantSelections || {},
        };
      });

      const subtotal = roundCurrencyValue(
        items.reduce((accumulator, item) => accumulator + item.lineTotal, 0)
      );
      const shipping = roundCurrencyValue(orderPayload.shipping || 0);

      // Apply coupon if provided
      let discountAmount = 0;
      let appliedCouponCode = "";
      let couponDoc = null;

      if (orderPayload.couponCode) {
        couponDoc = await Coupon.findOne({
          code: orderPayload.couponCode.trim().toUpperCase(),
          isActive: true,
        }).session(session);

        if (couponDoc) {
          const now = new Date();
          const isExpired = couponDoc.expiresAt && now > couponDoc.expiresAt;
          const isExhausted = couponDoc.maxUses !== null && couponDoc.usedCount >= couponDoc.maxUses;
          const belowMin = couponDoc.minOrderAmount > 0 && subtotal < couponDoc.minOrderAmount;

          if (!isExpired && !isExhausted && !belowMin) {
            discountAmount =
              couponDoc.type === "percentage"
                ? roundCurrencyValue(subtotal * (couponDoc.value / 100))
                : Math.min(couponDoc.value, subtotal);
            appliedCouponCode = couponDoc.code;
          }
        }
      }

      const total = roundCurrencyValue(subtotal + shipping - discountAmount);

      requestedQuantities.forEach((requestedQuantity, productId) => {
        const dbProduct = productsMap.get(productId);
        dbProduct.stock -= requestedQuantity;
      });

      await Promise.all(products.map((product) => product.save({ session })));

      // Increment coupon usage inside the transaction
      if (couponDoc && appliedCouponCode) {
        couponDoc.usedCount += 1;
        await couponDoc.save({ session });
      }

      const [order] = await Order.create(
        [
          {
            customerName: orderPayload.customerName.trim(),
            phone: orderPayload.phone.trim(),
            address: orderPayload.address.trim(),
            notes:
              typeof orderPayload.notes === "string"
                ? orderPayload.notes.trim()
                : "",
            items,
            subtotal,
            shipping,
            couponCode: appliedCouponCode,
            discountAmount,
            total,
            paymentMethod: orderPayload.paymentMethod || "whatsapp",
            customer: req.customer ? req.customer._id : null,
          },
        ],
        { session }
      );

      createdOrder = order;
    });
  } finally {
    await session.endSession();
  }

  if (!createdOrder) {
    throw new ApiError(500, "Order could not be created.");
  }

  await createdOrder.populate("items.product", ORDER_PRODUCT_POPULATE_FIELDS);

  // Fire-and-forget — email failure must not break order creation
  sendOrderNotification(createdOrder).catch(() => {});

  res.status(201).json({
    success: true,
    message: "Order created successfully.",
    data: createdOrder,
  });
});

const listOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const totalItems = await Order.countDocuments();
  const orders = await populateOrderProducts(
    Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit)
  ).lean();

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully.",
    count: orders.length,
    pagination: buildPaginationMeta({
      page,
      limit,
      totalItems,
    }),
    data: orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, "order id");

  const order = await populateOrderProducts(Order.findById(req.params.id)).lean();

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  res.status(200).json({
    success: true,
    message: "Order fetched successfully.",
    data: order,
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, "order id");

  const { orderStatus, paymentStatus } = req.body;

  if (!orderStatus) {
    throw new ApiError(400, "Order status is required.");
  }

  if (!ORDER_STATUSES.includes(orderStatus)) {
    throw new ApiError(400, "Invalid order status.");
  }

  if (paymentStatus !== undefined && !PAYMENT_STATUSES.includes(paymentStatus)) {
    throw new ApiError(400, "Invalid payment status.");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  order.orderStatus = orderStatus;

  if (paymentStatus !== undefined) {
    order.paymentStatus = paymentStatus;
  }

  await order.save();
  await order.populate("items.product", ORDER_PRODUCT_POPULATE_FIELDS);

  res.status(200).json({
    success: true,
    message: "Order status updated successfully.",
    data: order,
  });
});

module.exports = {
  createOrder,
  listOrders,
  getOrderById,
  updateOrderStatus,
};
