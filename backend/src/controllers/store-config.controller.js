const StoreConfig = require("../models/store-config.model");
const asyncHandler = require("../utils/async-handler");

const getStoreConfigBase = asyncHandler(async (req, res) => {
  let storeConfig = await StoreConfig.findOne({ singletonKey: "default" }).lean();

  if (!storeConfig) {
    storeConfig = await StoreConfig.create({ singletonKey: "default" });
  }

  res.status(200).json({
    success: true,
    message: "Store configuration module is ready.",
    data: storeConfig,
  });
});

const updateStoreConfigBase = asyncHandler(async (req, res) => {
  const allowedFields = [
    "storeName",
    "currency",
    "contactEmail",
    "phone",
    "logo",
    "theme",
    "socialLinks",
  ];

  const payload = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      payload[field] = req.body[field];
    }
  });

  const storeConfig = await StoreConfig.findOneAndUpdate(
    { singletonKey: "default" },
    {
      $set: payload,
      $setOnInsert: {
        singletonKey: "default",
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Store configuration updated successfully.",
    data: storeConfig,
  });
});

module.exports = {
  getStoreConfigBase,
  updateStoreConfigBase,
};
