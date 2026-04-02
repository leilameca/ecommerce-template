const ApiError = require("./api-error");

const parsePositiveInteger = (value, fallback, fieldName) => {
  if (value === undefined) {
    return fallback;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw new ApiError(400, `${fieldName} must be a positive integer.`);
  }

  return parsedValue;
};

const getPagination = (query = {}, options = {}) => {
  const defaultPage = options.defaultPage || 1;
  const defaultLimit = options.defaultLimit || 20;
  const maxLimit = options.maxLimit || 100;

  const page = parsePositiveInteger(query.page, defaultPage, "page");
  const rawLimit = parsePositiveInteger(query.limit, defaultLimit, "limit");
  const limit = Math.min(rawLimit, maxLimit);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

const buildPaginationMeta = ({ page, limit, totalItems }) => {
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / limit);

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasPrevPage: page > 1,
    hasNextPage: totalPages > 0 && page < totalPages,
  };
};

module.exports = {
  getPagination,
  buildPaginationMeta,
};
