const mongoose = require("mongoose");

const {
  PAYMENT_METHODS,
  DEFAULT_STORE_PAYMENT_METHODS,
} = require("../utils/ecommerce-constants");

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
    alt: String,
  },
  {
    _id: false,
  }
);

const storeConfigSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "default",
      unique: true,
      immutable: true,
    },
    storeName: {
      type: String,
      default: "My Store",
      trim: true,
    },
    heroTitle: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    heroCopy: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    logoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    heroImage: {
      type: String,
      default: "",
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: "",
      trim: true,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
      uppercase: true,
    },
    primaryColor: {
      type: String,
      default: "#111111",
      trim: true,
    },
    secondaryColor: {
      type: String,
      default: "#f5f5f5",
      trim: true,
    },
    enableWhatsappCheckout: {
      type: Boolean,
      default: true,
    },
    enableOnlinePayment: {
      type: Boolean,
      default: false,
    },
    paymentMethods: {
      type: [
        {
          type: String,
          enum: PAYMENT_METHODS,
        },
      ],
      default: () => [...DEFAULT_STORE_PAYMENT_METHODS],
      validate: {
        validator: (methods) => methods.length === new Set(methods).size,
        message: "Payment methods must not contain duplicated values.",
      },
    },
    contactEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    logo: {
      type: imageSchema,
      default: undefined,
    },
    theme: {
      primaryColor: {
        type: String,
        default: "#111111",
      },
      secondaryColor: {
        type: String,
        default: "#f5f5f5",
      },
    },
    backgroundColor: {
      type: String,
      default: "#ffffff",
      trim: true,
    },
    fontFamily: {
      type: String,
      default: "default",
      trim: true,
      enum: ["default", "editorial", "minimal", "classic", "bold"],
    },
    editorialTitle: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    editorialCopy: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    editorialPoint1Title: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    editorialPoint1Copy: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    editorialPoint2Title: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    editorialPoint2Copy: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    socialLinks: {
      instagram: {
        type: String,
        default: "",
      },
      facebook: {
        type: String,
        default: "",
      },
      tiktok: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StoreConfig", storeConfigSchema);
