const mongoose = require("mongoose");

const productImageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    alt: String,
  },
  {
    _id: false,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Product slug is required."],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required."],
    },
    images: [productImageSchema],
    variants: [
      {
        _id: false,
        name: {
          type: String,
          required: true,
          trim: true,
        },
        options: [
          {
            type: String,
            trim: true,
          },
        ],
      },
    ],
    variantImages: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

module.exports = mongoose.model("Product", productSchema);
