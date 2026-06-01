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
  "aboutTitle",
  "aboutCopy",
  "aboutMissionTitle",
  "aboutMissionCopy",
  "faqItems",
  "enableWhatsappCheckout",
  "enableOnlinePayment",
  "paymentMethods",
  "contactEmail",
  "phone",
  "socialLinks",
];

const I18N_TEXT_FIELDS = [
  "heroTitle",
  "heroCopy",
  "editorialTitle",
  "editorialCopy",
  "editorialPoint1Title",
  "editorialPoint1Copy",
  "editorialPoint2Title",
  "editorialPoint2Copy",
  "aboutTitle",
  "aboutCopy",
  "aboutMissionTitle",
  "aboutMissionCopy",
];

const toI18n = (v) => {
  if (!v) return { en: "", es: "" };
  if (typeof v === "object" && !Array.isArray(v)) {
    return { en: v.en || "", es: v.es || "" };
  }
  const str = String(v);
  return { en: str, es: str };
};

const serializeStoreConfig = (storeConfig) => {
  if (!storeConfig) {
    return {};
  }

  return {
    id: storeConfig._id,
    storeName: storeConfig.storeName || "My Store",
    heroTitle: toI18n(storeConfig.heroTitle),
    heroCopy: toI18n(storeConfig.heroCopy),
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
    editorialTitle: toI18n(storeConfig.editorialTitle),
    editorialCopy: toI18n(storeConfig.editorialCopy),
    editorialPoint1Title: toI18n(storeConfig.editorialPoint1Title),
    editorialPoint1Copy: toI18n(storeConfig.editorialPoint1Copy),
    editorialPoint2Title: toI18n(storeConfig.editorialPoint2Title),
    editorialPoint2Copy: toI18n(storeConfig.editorialPoint2Copy),
    aboutTitle: toI18n(storeConfig.aboutTitle),
    aboutCopy: toI18n(storeConfig.aboutCopy),
    aboutMissionTitle: toI18n(storeConfig.aboutMissionTitle),
    aboutMissionCopy: toI18n(storeConfig.aboutMissionCopy),
    faqItems: Array.isArray(storeConfig.faqItems)
      ? storeConfig.faqItems.map((item) => ({
          question: toI18n(item.question),
          answer: toI18n(item.answer),
        }))
      : [],
    socialLinks: {
      instagram: storeConfig.socialLinks?.instagram || "",
      facebook: storeConfig.socialLinks?.facebook || "",
      tiktok: storeConfig.socialLinks?.tiktok || "",
    },
    createdAt: storeConfig.createdAt,
    updatedAt: storeConfig.updatedAt,
  };
};

const validateI18nField = (value, fieldName) => {
  if (value === undefined) return;
  if (typeof value === "string") return;
  if (typeof value === "object" && !Array.isArray(value)) {
    if (value.en !== undefined && typeof value.en !== "string") {
      throw new ApiError(400, `${fieldName}.en must be a string.`);
    }
    if (value.es !== undefined && typeof value.es !== "string") {
      throw new ApiError(400, `${fieldName}.es must be a string.`);
    }
    return;
  }
  throw new ApiError(400, `${fieldName} must be a string or { en, es } object.`);
};

const validateStoreConfigPayload = (payload) => {
  validateString(payload.storeName, "store name");
  validateI18nField(payload.heroTitle, "heroTitle");
  validateI18nField(payload.heroCopy, "heroCopy");
  validateString(payload.logoUrl, "logo url");
  validateString(payload.heroImage, "hero image");
  validateString(payload.whatsappNumber, "whatsapp number");
  validateString(payload.currency, "currency");
  validateString(payload.primaryColor, "primary color");
  validateString(payload.secondaryColor, "secondary color");
  validateString(payload.contactEmail, "contact email");
  validateString(payload.phone, "phone");
  validateString(payload.backgroundColor, "background color");
  validateI18nField(payload.editorialTitle, "editorialTitle");
  validateI18nField(payload.editorialCopy, "editorialCopy");
  validateI18nField(payload.editorialPoint1Title, "editorialPoint1Title");
  validateI18nField(payload.editorialPoint1Copy, "editorialPoint1Copy");
  validateI18nField(payload.editorialPoint2Title, "editorialPoint2Title");
  validateI18nField(payload.editorialPoint2Copy, "editorialPoint2Copy");
  validateI18nField(payload.aboutTitle, "aboutTitle");
  validateI18nField(payload.aboutCopy, "aboutCopy");
  validateI18nField(payload.aboutMissionTitle, "aboutMissionTitle");
  validateI18nField(payload.aboutMissionCopy, "aboutMissionCopy");

  if (payload.faqItems !== undefined) {
    if (!Array.isArray(payload.faqItems)) {
      throw new ApiError(400, "faqItems must be an array.");
    }
    for (let i = 0; i < payload.faqItems.length; i++) {
      const item = payload.faqItems[i];
      if (!item || typeof item !== "object") {
        throw new ApiError(400, `faqItems[${i}] must be an object.`);
      }
      validateI18nField(item.question, `faqItems[${i}].question`);
      validateI18nField(item.answer, `faqItems[${i}].answer`);
    }
  }

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

  for (const field of I18N_TEXT_FIELDS) {
    if (payload[field] !== undefined) {
      storeConfig.markModified(field);
    }
  }

  if (payload.faqItems !== undefined) {
    storeConfig.markModified("faqItems");
  }

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
