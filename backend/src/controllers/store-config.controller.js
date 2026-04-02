const StoreConfig = require("../models/store-config.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const {
  PAYMENT_METHODS,
  DEFAULT_STORE_PAYMENT_METHODS,
} = require("../utils/ecommerce-constants");
const {
  pickAllowedFields,
  validateString,
} = require("../utils/validation");

const STORE_CONFIG_SINGLETON_KEY = "default";
const ALLOWED_STORE_CONFIG_FIELDS = [
  "storeName",
  "logoUrl",
  "heroImage",
  "whatsappNumber",
  "currency",
  "primaryColor",
  "secondaryColor",
  "enableWhatsappCheckout",
  "enableOnlinePayment",
  "paymentMethods",
];

const serializeStoreConfig = (storeConfig) => {
  if (!storeConfig) {
    return {};
  }

  return {
    id: storeConfig._id,
    storeName: storeConfig.storeName || "My Store",
    logoUrl: storeConfig.logoUrl || storeConfig.logo?.url || "",
    heroImage: storeConfig.heroImage || "",
    whatsappNumber: storeConfig.whatsappNumber || storeConfig.phone || "",
    currency: storeConfig.currency || "USD",
    primaryColor: storeConfig.primaryColor || storeConfig.theme?.primaryColor || "#111111",
    secondaryColor:
      storeConfig.secondaryColor || storeConfig.theme?.secondaryColor || "#f5f5f5",
    enableWhatsappCheckout:
      typeof storeConfig.enableWhatsappCheckout === "boolean"
        ? storeConfig.enableWhatsappCheckout
        : true,
    enableOnlinePayment:
      typeof storeConfig.enableOnlinePayment === "boolean"
        ? storeConfig.enableOnlinePayment
        : false,
    paymentMethods:
      Array.isArray(storeConfig.paymentMethods) && storeConfig.paymentMethods.length > 0
        ? storeConfig.paymentMethods
        : [...DEFAULT_STORE_PAYMENT_METHODS],
    createdAt: storeConfig.createdAt,
    updatedAt: storeConfig.updatedAt,
  };
};

const validateStoreConfigPayload = (payload) => {
  validateString(payload.storeName, "store name");
  validateString(payload.logoUrl, "logo url");
  validateString(payload.heroImage, "hero image");
  validateString(payload.whatsappNumber, "whatsapp number");
  validateString(payload.currency, "currency");
  validateString(payload.primaryColor, "primary color");
  validateString(payload.secondaryColor, "secondary color");

  if (
    payload.enableWhatsappCheckout !== undefined &&
    typeof payload.enableWhatsappCheckout !== "boolean"
  ) {
    throw new ApiError(400, "Enable whatsapp checkout must be a boolean.");
  }

  if (
    payload.enableOnlinePayment !== undefined &&
    typeof payload.enableOnlinePayment !== "boolean"
  ) {
    throw new ApiError(400, "Enable online payment must be a boolean.");
  }

  if (payload.paymentMethods !== undefined) {
    if (!Array.isArray(payload.paymentMethods)) {
      throw new ApiError(400, "Payment methods must be an array.");
    }

    const invalidMethod = payload.paymentMethods.find(
      (method) => !PAYMENT_METHODS.includes(method)
    );

    if (invalidMethod) {
      throw new ApiError(400, `Invalid payment method: ${invalidMethod}.`);
    }

    if (new Set(payload.paymentMethods).size !== payload.paymentMethods.length) {
      throw new ApiError(400, "Payment methods must not contain duplicated values.");
    }
  }
};

const getStoreConfig = asyncHandler(async (req, res) => {
  const storeConfig = await StoreConfig.findOne({
    singletonKey: STORE_CONFIG_SINGLETON_KEY,
  }).lean();

  if (!storeConfig) {
    res.status(200).json({
      success: true,
      message: "Store configuration not set yet.",
      data: {},
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Store configuration fetched successfully.",
    data: serializeStoreConfig(storeConfig),
  });
});

const upsertStoreConfig = asyncHandler(async (req, res) => {
  const payload = pickAllowedFields(req.body, ALLOWED_STORE_CONFIG_FIELDS);

  validateStoreConfigPayload(payload);

  let storeConfig = await StoreConfig.findOne({
    singletonKey: STORE_CONFIG_SINGLETON_KEY,
  });

  if (!storeConfig) {
    storeConfig = new StoreConfig({
      singletonKey: STORE_CONFIG_SINGLETON_KEY,
    });
  }

  Object.assign(storeConfig, payload);

  if (payload.whatsappNumber !== undefined) {
    storeConfig.phone = payload.whatsappNumber;
  }

  if (payload.logoUrl !== undefined) {
    storeConfig.logo = payload.logoUrl
      ? {
          ...(storeConfig.logo?.toObject?.() || storeConfig.logo || {}),
          url: payload.logoUrl,
        }
      : undefined;
  }

  if (payload.primaryColor !== undefined || payload.secondaryColor !== undefined) {
    storeConfig.theme = {
      ...(storeConfig.theme?.toObject?.() || storeConfig.theme || {}),
      primaryColor: payload.primaryColor ?? storeConfig.primaryColor,
      secondaryColor: payload.secondaryColor ?? storeConfig.secondaryColor,
    };
  }

  await storeConfig.save();

  res.status(200).json({
    success: true,
    message: "Store configuration saved successfully.",
    data: serializeStoreConfig(storeConfig.toObject()),
  });
});

module.exports = {
  getStoreConfig,
  upsertStoreConfig,
  getStoreConfigBase: getStoreConfig,
  updateStoreConfigBase: upsertStoreConfig,
};
