const Category = require("../models/category.model");
const ApiError = require("../utils/api-error");
const asyncHandler = require("../utils/async-handler");
const { buildSlug } = require("../utils/slug");
const {
  pickAllowedFields,
  validateObjectId,
  validateImageObject,
} = require("../utils/validation");

const ALLOWED_CATEGORY_FIELDS = [
  "name",
  "slug",
  "description",
  "image",
  "isActive",
];

const ensureUniqueSlug = async (slug, categoryId) => {
  const slugFilter = { slug };

  if (categoryId) {
    slugFilter._id = { $ne: categoryId };
  }

  const existingCategory = await Category.findOne(slugFilter).select("_id");

  if (existingCategory) {
    throw new ApiError(409, "A category with this slug already exists.");
  }
};

const getCategorySlug = ({ slug, name }) => {
  const normalizedSlug = typeof slug === "string" ? slug.trim() : "";
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const formattedSlug = buildSlug(normalizedSlug || normalizedName);

  if (!formattedSlug) {
    throw new ApiError(
      400,
      "A valid category name or slug is required to generate the slug."
    );
  }

  return formattedSlug;
};

const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully.",
    count: categories.length,
    data: categories,
  });
});

const createCategory = asyncHandler(async (req, res) => {
  const categoryPayload = pickAllowedFields(req.body, ALLOWED_CATEGORY_FIELDS);

  validateImageObject(categoryPayload.image);

  if (!categoryPayload.slug && !categoryPayload.name) {
    throw new ApiError(400, "Category name is required to generate the slug.");
  }

  categoryPayload.slug = getCategorySlug({
    slug: categoryPayload.slug,
    name: categoryPayload.name,
  });

  await ensureUniqueSlug(categoryPayload.slug);

  const category = await Category.create(categoryPayload);

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    data: category,
  });
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const slug = buildSlug(req.params.slug);

  if (!slug) {
    throw new ApiError(400, "A valid category slug is required.");
  }

  const category = await Category.findOne({ slug, isActive: true }).lean();

  if (!category) {
    throw new ApiError(404, "Active category not found.");
  }

  res.status(200).json({
    success: true,
    message: "Category fetched successfully.",
    data: category,
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, "category id");

  const category = await Category.findById(req.params.id).lean();

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  res.status(200).json({
    success: true,
    message: "Category fetched successfully.",
    data: category,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  validateObjectId(id, "category id");

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  const updateData = pickAllowedFields(req.body, ALLOWED_CATEGORY_FIELDS);

  validateImageObject(updateData.image);

  const hasNameUpdate = Object.prototype.hasOwnProperty.call(updateData, "name");
  const hasSlugValue =
    typeof updateData.slug === "string" && updateData.slug.trim().length > 0;

  if (hasSlugValue) {
    updateData.slug = getCategorySlug({ slug: updateData.slug });
    await ensureUniqueSlug(updateData.slug, category._id);
  } else {
    delete updateData.slug;

    if (hasNameUpdate) {
      updateData.slug = getCategorySlug({ name: updateData.name });
      await ensureUniqueSlug(updateData.slug, category._id);
    }
  }

  Object.assign(category, updateData);
  if (updateData.description !== undefined) {
    category.markModified("description");
  }
  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully.",
    data: category,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  validateObjectId(req.params.id, "category id");

  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  category.isActive = false;
  await category.save();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully.",
    data: category,
  });
});

module.exports = {
  listCategories,
  listCategoriesBase: listCategories,
  createCategory,
  getCategoryBySlug,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
