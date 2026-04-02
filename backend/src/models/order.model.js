const mongoose = require("mongoose");

const {
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  ORDER_STATUSES,
} = require("../utils/ecommerce-constants");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required for each order item."],
    },
    name: {
      type: String,
      required: [true, "Product name is required for each order item."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Product price is required for each order item."],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required for each order item."],
      min: 1,
    },
    lineTotal: {
      type: Number,
      required: [true, "Line total is required for each order item."],
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required."],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Customer phone is required."],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Customer address is required."],
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    items: {
      type: [orderItemSchema],
      required: [true, "Order items are required."],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "At least one order item is required.",
      },
    },
    subtotal: {
      type: Number,
      required: [true, "Order subtotal is required."],
      min: 0,
    },
    shipping: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: [true, "Order total is required."],
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "whatsapp",
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
