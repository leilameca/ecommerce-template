const mongoose = require("mongoose");

const ApiError = require("./api-error");

const toLabel = (fieldName = "field") => {
  return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
};

const pickAllowedFields = (payload = {}, allowedFields = []) => {
  return allowedFields.reduce((accumulator, field) => {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      accumulator[field] = payload[field];
    }

    return accumulator;
  }, {});
};

const validateObjectId = (value, fieldName) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new ApiError(400, `Invalid ${fieldName}.`);
  }
};

const validateString = (value, fieldName) => {
  if (value !== undefined && value !== null && typeof value !== "string") {
    throw new ApiError(400, `${toLabel(fieldName)} must be a string.`);
  }
};

const validateNumber = (value, fieldName, options = {}) => {
  const { min = Number.NEGATIVE_INFINITY, integer = false } = options;

  if (value === undefined || value === null) {
    return;
  }

  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new ApiError(400, `${toLabel(fieldName)} must be a valid number.`);
  }

  if (integer && !Number.isInteger(value)) {
    throw new ApiError(400, `${toLabel(fieldName)} must be an integer.`);
  }

  if (value < min) {
    throw new ApiError(400, `${toLabel(fieldName)} must be greater than or equal to ${min}.`);
  }
};

const validateImageObject = (image, fieldName = "image") => {
  if (image === undefined || image === null) {
    return;
  }

  if (typeof image !== "object" || Array.isArray(image)) {
    throw new ApiError(400, `${toLabel(fieldName)} must be an object.`);
  }

  if (Object.keys(image).length === 0) {
    throw new ApiError(400, `${toLabel(fieldName)} url is required.`);
  }

  validateString(image.url, `${fieldName} url`);
  validateString(image.publicId, `${fieldName} publicId`);
  validateString(image.alt, `${fieldName} alt`);

  if (!image.url || !image.url.trim()) {
    throw new ApiError(400, `${toLabel(fieldName)} url is required.`);
  }
};

const validateImagesArray = (images, fieldName = "images") => {
  if (images === undefined) {
    return;
  }

  if (!Array.isArray(images)) {
    throw new ApiError(400, `${toLabel(fieldName)} must be an array.`);
  }

  images.forEach((image, index) => {
    validateImageObject(image, `${fieldName} item ${index + 1}`);
  });
};

const validateNonEmptyArray = (value, fieldName) => {
  if (!Array.isArray(value)) {
    throw new ApiError(400, `${toLabel(fieldName)} must be an array.`);
  }

  if (value.length === 0) {
    throw new ApiError(400, `${toLabel(fieldName)} must contain at least one item.`);
  }
};

module.exports = {
  pickAllowedFields,
  validateObjectId,
  validateString,
  validateNumber,
  validateImageObject,
  validateImagesArray,
  validateNonEmptyArray,
};
