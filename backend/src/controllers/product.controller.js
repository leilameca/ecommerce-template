const Product = require("../models/product.model");
const Category = require("../models/category.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { buildSlug } = require("../utils/slug");
const {
  getPagination,
  buildPaginationMeta,
} = require("../utils/pagination");
const {
  pickAllowedFields,
  validateObjectId,
  validateImagesArray,
} = require("../utils/validation");

const PRODUCT_POPULATE_FIELDS = "name slug";
const ALLOWED_PRODUCT_FIELDS = [
  "name",
  "slug",
  "description",
  "price",
  "stock",
  "category",
  "images",
  "variants",
  "variantImages",
  "isActive",
];

const ensureCategoryExists = async (categoryId) => {
  validateObjectId(categoryId, "category id");

  const category = await Category.findById(categoryId).select("_id");

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }
};

const ensureUniqueSlug = async (slug, productId) => {
  const slugFilter = { slug };

  if (productId) {
    slugFilter._id = { $ne: productId };
  }

  const existingProduct = await Product.findOne(slugFilter).select("_id");

  if (existingProduct) {
    throw new ApiError(409, "A product with this slug already exists.");
  }
};

const getProductSlug = ({ slug, name }) => {
  const normalizedSlug = typeof slug === "string" ? slug.trim() : "";
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const formattedSlug = buildSlug(normalizedSlug || normalizedName);

  if (!formattedSlug) {
    throw new ApiError(
      400,
      "A valid product name or slug is required to generate the slug."
    );
  }

  return formattedSlug;
};

const populateProductCategory = (query) => {
  return query.populate("category", PRODUCT_POPULATE_FIELDS);
};

const listProductsBase = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query, {
    defaultLimit: 12,
  });
  const filter = { isActive: true };
  const totalItems = await Product.countDocuments(filter);
  const products = await populateProductCategory(
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)
  ).lean();

  res.status(200).json({
    success: true,
    message: "Products fetched successfully.",
    count: products.length,
    pagination: buildPaginationMeta({
      page,
      limit,
      totalItems,
    }),
    data: products,
  });
});

const createProduct = asyncHandler(async (req, res) => {
  const productPayload = pickAllowedFields(req.body, ALLOWED_PRODUCT_FIELDS);

  validateImagesArray(productPayload.images);

  if (!productPayload.slug && !productPayload.name) {
    throw new ApiError(400, "Product name is required to generate the slug.");
  }

  productPayload.slug = getProductSlug({
    slug: productPayload.slug,
    name: productPayload.name,
  });

  await ensureUniqueSlug(productPayload.slug);

  if (productPayload.category) {
    await ensureCategoryExists(productPayload.category);
  }

  const product = await Product.create(productPayload);
  await product.populate("category", PRODUCT_POPULATE_FIELDS);

  res.status(201).json({
    success: true,
    message: "Product created successfully.",
    data: product,
  });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const slug = buildSlug(req.params.slug);

  if (!slug) {
    throw new ApiError(400, "A valid product slug is required.");
  }

  const product = await populateProductCategory(
    Product.findOne({ slug, isActive: true })
  ).lean();

  if (!product) {
    throw new ApiError(404, "Active product not found.");
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully.",
    data: product,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, "product id");

  const product = await populateProductCategory(Product.findById(req.params.id)).lean();

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully.",
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id, "product id");

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const updateData = pickAllowedFields(req.body, ALLOWED_PRODUCT_FIELDS);

  validateImagesArray(updateData.images);

  if (updateData.category !== undefined) {
    await ensureCategoryExists(updateData.category);
  }

  const hasNameUpdate = Object.prototype.hasOwnProperty.call(updateData, "name");
  const hasSlugValue =
    typeof updateData.slug === "string" && updateData.slug.trim().length > 0;

  if (hasSlugValue) {
    updateData.slug = getProductSlug({ slug: updateData.slug });
    await ensureUniqueSlug(updateData.slug, product._id);
  } else {
    delete updateData.slug;

    if (hasNameUpdate) {
      updateData.slug = getProductSlug({ name: updateData.name });
      await ensureUniqueSlug(updateData.slug, product._id);
    }
  }

  Object.assign(product, updateData);
  if (updateData.variantImages !== undefined) {
    product.variantImages = updateData.variantImages;
    product.markModified("variantImages");
  }
  console.log(`[product] update id=${product._id} variantImages=${JSON.stringify(product.variantImages)}`);
  await product.save();
  await product.populate("category", PRODUCT_POPULATE_FIELDS);

  res.status(200).json({
    success: true,
    message: "Product updated successfully.",
    data: product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, "product id");

  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  product.isActive = false;
  await product.save();
  await product.populate("category", PRODUCT_POPULATE_FIELDS);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully.",
    data: product,
  });
});

module.exports = {
  listProductsBase,
  createProduct,
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
};
