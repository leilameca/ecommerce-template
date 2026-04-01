const mongoose = require("mongoose");

const storeConfigSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "default",
      unique: true,
    },
    storeName: {
      type: String,
      default: "My Store",
      trim: true,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
      uppercase: true,
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
      url: String,
      publicId: String,
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
