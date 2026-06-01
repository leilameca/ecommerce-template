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
  "heroTitle",
  "heroCopy",
  "logoUrl",
  "heroImage",
  "whatsappNumber",
  "currency",
  "primaryColor",
  "secondaryColor",
  "backgroundColor",
  "fontFamily",
  "editorialTitle",
  "editorialCopy",
  "editorialPoint1Title",
  "editorialPoint1Copy",
  "editorialPoint2Title",
  "editorialPoint2Copy",
  "enableWhatsappCheckout",
  "enableOnlinePayment",
  "paymentMethods",
  "contactEmail",
  "phone",
  "socialLinks",
];

const serializeStoreConfig = (storeConfig) => {
  if (!storeConfig) {
    return {};
  }

  return {
    id: storeConfig._id,
    storeName: storeConfig.storeName || "My Store",
    heroTitle: storeConfig.heroTitle || "",
    heroCopy: storeConfig.heroCopy || "",
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
    contactEmail: storeConfig.contactEmail || "",
    phone: storeConfig.phone || storeConfig.whatsappNumber || "",
    backgroundColor: storeConfig.backgroundColor || "#ffffff",
    fontFamily: storeConfig.fontFamily || "default",
    editorialTitle: storeConfig.editorialTitle || "",
    editorialCopy: storeConfig.editorialCopy || "",
    editorialPoint1Title: storeConfig.editorialPoint1Title || "",
    editorialPoint1Copy: storeConfig.editorialPoint1Copy || "",
    editorialPoint2Title: storeConfig.editorialPoint2Title || "",
    editorialPoint2Copy: storeConfig.editorialPoint2Copy || "",
    socialLinks: {
      instagram: storeConfig.socialLinks?.instagram || "",
      facebook: storeConfig.socialLinks?.facebook || "",
      tiktok: storeConfig.socialLinks?.tiktok || "",
    },
    createdAt: storeConfig.createdAt,
    updatedAt: storeConfig.updatedAt,
  };
};

const validateStoreConfigPayload = (payload) => {
  validateString(payload.storeName, "store name");
  validateString(payload.heroTitle, "hero title");
  validateString(payload.heroCopy, "hero copy");
  validateString(payload.logoUrl, "logo url");
  validateString(payload.heroImage, "hero image");
  validateString(payload.whatsappNumber, "whatsapp number");
  validateString(payload.currency, "currency");
  validateString(payload.primaryColor, "primary color");
  validateString(payload.secondaryColor, "secondary color");
  validateString(payload.contactEmail, "contact email");
  validateString(payload.phone, "phone");
  validateString(payload.backgroundColor, "background color");
  validateString(payload.editorialTitle, "editorial title");
  validateString(payload.editorialCopy, "editorial copy");
  validateString(payload.editorialPoint1Title, "editorial point 1 title");
  validateString(payload.editorialPoint1Copy, "editorial point 1 copy");
  validateString(payload.editorialPoint2Title, "editorial point 2 title");
  validateString(payload.editorialPoint2Copy, "editorial point 2 copy");

  const VALID_FONTS = ["default", "editorial", "minimal", "classic", "bold"];
  if (payload.fontFamily !== undefined && !VALID_FONTS.includes(payload.fontFamily)) {
    throw new ApiError(400, `Invalid font family: ${payload.fontFamily}.`);
  }

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
