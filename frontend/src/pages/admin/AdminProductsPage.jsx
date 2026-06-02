import { useDeferredValue, useEffect, useRef, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import Button from "../../components/ui/Button";
import SelectField from "../../components/ui/SelectField";
import TextInput from "../../components/ui/TextInput";
import TextareaField from "../../components/ui/TextareaField";
import { useLanguage } from "../../hooks/useLanguage";
import { formatCurrency } from "../../lib/format-currency";
import { getCategories } from "../../services/api/categories.service";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../../services/api/products.service";
import { uploadProductImage } from "../../services/api/uploads.service";

const emptyProductForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  images: [],
  draftImageUrl: "",
  draftImageAlt: "",
  isActive: true,
  variants: [],
  variantImages: {},
  draftVariantName: "",
};

const mapProductToForm = (product) => ({
  id: product._id,
  name: product.name || "",
  slug: product.slug || "",
  description: product.description || "",
  price: String(product.price ?? ""),
  stock: String(product.stock ?? ""),
  category: product.category?._id || "",
  images: Array.isArray(product.images)
    ? product.images.map((image) => ({
        url: image.url || "",
        publicId: image.publicId || "",
        alt: image.alt || "",
      }))
    : [],
  draftImageUrl: "",
  draftImageAlt: "",
  isActive: Boolean(product.isActive),
  variants: Array.isArray(product.variants)
    ? product.variants.map((v) => ({
        name: v.name || "",
        options: Array.isArray(v.options) ? [...v.options] : [],
        draftOption: "",
      }))
    : [],
  variantImages: product.variantImages && typeof product.variantImages === "object" ? { ...product.variantImages } : {},
  draftVariantName: "",
});

export default function AdminProductsPage() {
  const { t } = useLanguage();
  const imageFileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState(emptyProductForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [selectedImageFiles, setSelectedImageFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const loadPageData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts({ page: 1, limit: 50 }),
        getCategories(),
      ]);

      setProducts(productsResponse?.data || []);
      setCategories(categoriesResponse?.data || []);
    } catch (error) {
      setErrorMessage(error?.message || "Products could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleFormChange = (fieldName, value) => {
    setFormState((currentValue) => ({
      ...currentValue,
      [fieldName]: value,
    }));
  };

  const resetForm = () => {
    setFormState(emptyProductForm);
    setSelectedImageFiles([]);
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = "";
    }
    setFormMessage("");
  };

  const handleAddVariant = () => {
    const name = (formState.draftVariantName || "").trim();
    if (!name) return;
    if (formState.variants.some((v) => v.name.toLowerCase() === name.toLowerCase())) return;
    setFormState((cur) => ({
      ...cur,
      variants: [...cur.variants, { name, options: [], draftOption: "" }],
      draftVariantName: "",
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormState((cur) => ({
      ...cur,
      variants: cur.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantDraftOption = (index, value) => {
    setFormState((cur) => ({
      ...cur,
      variants: cur.variants.map((v, i) => (i === index ? { ...v, draftOption: value } : v)),
    }));
  };

  const handleAddVariantOption = (index) => {
    const option = (formState.variants[index]?.draftOption || "").trim();
    if (!option) return;
    setFormState((cur) => ({
      ...cur,
      variants: cur.variants.map((v, i) =>
        i === index && !v.options.includes(option)
          ? { ...v, options: [...v.options, option], draftOption: "" }
          : v
      ),
    }));
  };

  const handleRemoveVariantOption = (variantIndex, option) => {
    setFormState((cur) => {
      const variant = cur.variants[variantIndex];
      const key = `${variant.name}:${option}`;
      const newImages = { ...cur.variantImages };
      delete newImages[key];
      return {
        ...cur,
        variants: cur.variants.map((v, i) =>
          i === variantIndex ? { ...v, options: v.options.filter((o) => o !== option) } : v
        ),
        variantImages: newImages,
      };
    });
  };

  const handleVariantImageUpload = async (variantName, option, file) => {
    if (!file) return;
    try {
      const response = await uploadProductImage(file);
      const url = response?.data?.url;
      if (!url) return;
      const key = `${variantName}:${option}`;
      setFormState((cur) => ({
        ...cur,
        variantImages: { ...cur.variantImages, [key]: url },
      }));
    } catch {
      // silent fail — image upload errors are non-blocking
    }
  };

  const handleVariantImageRemove = (variantName, option) => {
    const key = `${variantName}:${option}`;
    setFormState((cur) => {
      const newImages = { ...cur.variantImages };
      delete newImages[key];
      return { ...cur, variantImages: newImages };
    });
  };

  const handleImageFieldChange = (index, fieldName, value) => {
    setFormState((currentValue) => ({
      ...currentValue,
      images: currentValue.images.map((image, imageIndex) =>
        imageIndex === index
          ? {
              ...image,
              [fieldName]: value,
            }
          : image
      ),
    }));
  };

  const handleRemoveImage = (index) => {
    setFormState((currentValue) => ({
      ...currentValue,
      images: currentValue.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleAddImageByUrl = () => {
    const trimmedImageUrl = formState.draftImageUrl.trim();
    const trimmedImageAlt = formState.draftImageAlt.trim();

    if (!trimmedImageUrl) {
      setErrorMessage(t("admin_image_url_required"));
      return;
    }

    setFormState((currentValue) => ({
      ...currentValue,
      images: [
        ...currentValue.images,
        {
          url: trimmedImageUrl,
          publicId: "",
          alt: trimmedImageAlt,
        },
      ],
      draftImageUrl: "",
      draftImageAlt: "",
    }));
    setErrorMessage("");
    setFormMessage(t("admin_product_image_uploaded"));
  };

  const handleUploadImage = async () => {
    if (selectedImageFiles.length === 0) {
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage("");
    setFormMessage("");

    try {
      const uploadedImages = [];

      for (const file of selectedImageFiles) {
        const response = await uploadProductImage(file);
        const uploadedImage = response?.data || {};

        uploadedImages.push({
          url: uploadedImage.url || "",
          publicId: uploadedImage.publicId || "",
          alt: uploadedImage.alt || file.name,
        });
      }

      setFormState((currentValue) => ({
        ...currentValue,
        images: [...currentValue.images, ...uploadedImages],
      }));
      setSelectedImageFiles([]);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = "";
      }
      setFormMessage(t("admin_product_image_uploaded"));
    } catch (error) {
      setErrorMessage(error?.message || t("admin_product_image_upload_error"));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage("");
    setErrorMessage("");

    const payload = {
      name: formState.name,
      slug: formState.slug || undefined,
      description: formState.description,
      price: Number(formState.price),
      stock: Number(formState.stock),
      category: formState.category,
      images: formState.images
        .filter((image) => image.url)
        .map((image) => ({
          url: image.url,
          publicId: image.publicId || undefined,
          alt: image.alt || undefined,
        })),
      isActive: formState.isActive,
      variants: formState.variants
        .filter((v) => v.name && v.options.length > 0)
        .map((v) => ({ name: v.name, options: v.options })),
      variantImages: formState.variantImages,
    };

    try {
      if (formState.id) {
        await updateProduct(formState.id, payload);
        setFormMessage(t("admin_product_updated"));
      } else {
        await createProduct(payload);
        setFormMessage(t("admin_product_created"));
      }

      await loadPageData();
      resetForm();
    } catch (error) {
      setErrorMessage(error?.message || t("admin_product_save_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm(t("admin_product_delete_confirm"))) {
      return;
    }

    try {
      await deleteProduct(productId);
      await loadPageData();
    } catch (error) {
      setErrorMessage(error?.message || t("admin_product_delete_error"));
    }
  };

  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredProducts = normalizedSearchQuery
    ? products.filter((product) => {
        const searchableFields = [
          product.name,
          product.slug,
          product.description,
          product.category?.name,
        ];

        return searchableFields.some((fieldValue) =>
          String(fieldValue || "").toLowerCase().includes(normalizedSearchQuery)
        );
      })
    : products;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={t("admin_catalog_management")}
        title={t("admin_products_title")}
        description={t("admin_products_copy")}
        actions={
          <Button variant="secondary" onClick={resetForm}>
            {t("admin_new_product")}
          </Button>
        }
      />

      {errorMessage ? (
        <SurfaceMessage
          tone="error"
          title="Products unavailable"
          description={errorMessage}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
        <section className="min-w-0 overflow-hidden border border-zinc-200/80 bg-white">
          <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-950">
                  {t("admin_catalog_products")}
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  {t("admin_catalog_products_copy")}
                </div>
              </div>

              <div className="w-full max-w-md">
                <TextInput
                  label={t("admin_search_products")}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("admin_search_products_placeholder")}
                />
              </div>
            </div>

            {products.length > 0 ? (
              <div className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
                {t("admin_products_results_count", {
                  visible: filteredProducts.length,
                  total: products.length,
                })}
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="px-4 py-6 sm:px-5">
              <SurfaceMessage
                title={t("admin_loading_products")}
                description={t("admin_loading_products_copy")}
              />
            </div>
          ) : products.length === 0 ? (
            <div className="px-4 py-6 sm:px-5">
              <SurfaceMessage
                title={t("admin_no_products")}
                description={t("admin_no_products_copy")}
              />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-4 py-6 sm:px-5">
              <SurfaceMessage
                title={t("admin_no_matching_products")}
                description={t("admin_no_matching_products_copy")}
              />
            </div>
          ) : (
            <div className="divide-y divide-zinc-200/80">
              {filteredProducts.map((product) => (
                <article key={product._id} className="px-4 py-4 sm:px-5">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start 2xl:grid-cols-[minmax(0,1fr)_140px_160px]">
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold tracking-[-0.03em] text-zinc-950">
                        {product.name}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        {product.description || "No description provided."}
                      </p>
                      <div className="mt-2 text-sm text-zinc-500">
                        {product.category?.name || "Uncategorized"} · {t("admin_stock")} {product.stock}
                      </div>
                    </div>

                    <div className="text-left text-sm font-medium text-zinc-950 2xl:text-right">
                      {formatCurrency(product.price)}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row md:flex-col 2xl:flex-row 2xl:justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setFormState(mapProductToForm(product));
                          setSelectedImageFiles([]);
                          if (imageFileInputRef.current) {
                            imageFileInputRef.current.value = "";
                          }
                        }}
                      >
                        {t("admin_edit")}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                      >
                        {t("admin_delete")}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="self-start overflow-hidden border border-zinc-200/80 bg-white xl:sticky xl:top-24">
          <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5">
            <div className="text-sm font-medium text-zinc-950">
              {formState.id ? t("admin_edit_product") : t("admin_create_product")}
            </div>
            <div className="mt-1 text-sm text-zinc-500">
              {t("admin_complete_product_info")}
            </div>
          </div>

          <div className="px-4 py-4 sm:px-5">
            {formMessage ? (
              <div className="mb-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {formMessage}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <TextInput
                label={t("admin_name")}
                value={formState.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                required
              />

              <TextInput
                label={t("admin_slug")}
                value={formState.slug}
                onChange={(event) => handleFormChange("slug", event.target.value)}
                placeholder={t("admin_slug_placeholder")}
              />

              <TextareaField
                label={t("admin_description")}
                value={formState.description}
                onChange={(event) =>
                  handleFormChange("description", event.target.value)
                }
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label={t("admin_price")}
                  type="number"
                  min="0"
                  step="0.01"
                  value={formState.price}
                  onChange={(event) => handleFormChange("price", event.target.value)}
                  required
                />

                <TextInput
                  label={t("admin_stock")}
                  type="number"
                  min="0"
                  step="1"
                  value={formState.stock}
                  onChange={(event) => handleFormChange("stock", event.target.value)}
                  required
                />
              </div>

              <SelectField
                label={t("admin_category")}
                value={formState.category}
                onChange={(event) => handleFormChange("category", event.target.value)}
                required
              >
                <option value="">{t("admin_select_category")}</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </SelectField>

              <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50/70 p-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
                    {t("admin_image_gallery")}
                  </div>
                  <p className="text-sm text-zinc-500">
                    {t("admin_image_gallery_copy")}
                  </p>
                </div>

                {formState.images.length > 0 ? (
                  <div className="grid gap-4">
                    {formState.images.map((image, index) => (
                      <div
                        key={`${image.url || "product-image"}-${index}`}
                        className="rounded-md border border-zinc-200 bg-white p-3"
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="text-sm font-medium text-zinc-900">
                            {t("admin_image_label")} {index + 1}
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveImage(index)}
                          >
                            {t("admin_image_remove")}
                          </Button>
                        </div>

                        <div className="overflow-hidden rounded-md border border-zinc-200 bg-zinc-50">
                          <img
                            src={image.url}
                            alt={image.alt || formState.name || `Product image ${index + 1}`}
                            className="h-48 w-full object-contain p-3"
                          />
                        </div>

                        <div className="mt-3 grid gap-3">
                          <TextInput
                            label={t("admin_image_alt")}
                            value={image.alt}
                            onChange={(event) =>
                              handleImageFieldChange(index, "alt", event.target.value)
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-dashed border-zinc-300 bg-white px-4 py-6 text-sm text-zinc-500">
                    {t("admin_images_empty")}
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50/70 p-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
                    {t("admin_image_url")}
                  </div>
                  <p className="text-sm text-zinc-500">
                    {t("admin_image_url_copy")}
                  </p>
                </div>

                <TextInput
                  label={t("admin_image_url")}
                  value={formState.draftImageUrl}
                  onChange={(event) =>
                    handleFormChange("draftImageUrl", event.target.value)
                  }
                  placeholder="https://..."
                />

                <TextInput
                  label={t("admin_image_alt")}
                  value={formState.draftImageAlt}
                  onChange={(event) =>
                    handleFormChange("draftImageAlt", event.target.value)
                  }
                />

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={handleAddImageByUrl}
                >
                  {t("admin_image_add_url")}
                </Button>
              </div>

              <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50/70 p-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
                    {t("admin_image_upload")}
                  </div>
                  <p className="text-sm text-zinc-500">
                    {t("admin_image_upload_copy")}
                  </p>
                </div>

                <input
                  ref={imageFileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-md file:border file:border-zinc-300 file:bg-white file:px-3.5 file:py-2.5 file:text-sm file:font-medium file:text-zinc-900"
                  onChange={(event) =>
                    setSelectedImageFiles(Array.from(event.target.files || []))
                  }
                />

                {selectedImageFiles.length > 0 ? (
                  <div className="break-words text-sm text-zinc-500">
                    {t("admin_image_selected")}:{" "}
                    {selectedImageFiles.map((file) => file.name).join(", ")}
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto"
                    disabled={selectedImageFiles.length === 0 || isUploadingImage}
                    onClick={handleUploadImage}
                  >
                    {isUploadingImage
                      ? t("admin_image_uploading")
                      : t("admin_image_upload_button")}
                  </Button>
                </div>
              </div>

              <label className="flex items-center gap-3 border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) =>
                    handleFormChange("isActive", event.target.checked)
                  }
                />
                {t("admin_active_product")}
              </label>

              {/* Variants section */}
              <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50/70 p-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
                    {t("admin_variants")}
                  </div>
                  <p className="text-sm text-zinc-500">{t("admin_variants_copy")}</p>
                </div>

                {formState.variants.length === 0 ? (
                  <div className="rounded-md border border-dashed border-zinc-300 bg-white px-4 py-4 text-sm text-zinc-500">
                    {t("admin_variants_empty")}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formState.variants.map((variant, variantIndex) => (
                      <div key={variant.name} className="rounded-md border border-zinc-200 bg-white p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-zinc-900">{variant.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveVariant(variantIndex)}
                          >
                            {t("admin_variant_remove")}
                          </Button>
                        </div>

                        <div className="mb-3 flex flex-wrap gap-2">
                          {variant.options.map((option) => {
                            const imgKey = `${variant.name}:${option}`;
                            const imgUrl = formState.variantImages?.[imgKey];
                            return (
                              <div key={option} className="flex flex-col items-center gap-1">
                                <span className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                                  {option}
                                  <button
                                    type="button"
                                    className="ml-0.5 text-zinc-400 hover:text-rose-600 transition-colors"
                                    onClick={() => handleRemoveVariantOption(variantIndex, option)}
                                  >
                                    ×
                                  </button>
                                </span>
                                {imgUrl ? (
                                  <div className="relative">
                                    <img src={imgUrl} alt={option} className="h-10 w-10 rounded-md border border-zinc-200 object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => handleVariantImageRemove(variant.name, option)}
                                      className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] text-white"
                                    >×</button>
                                  </div>
                                ) : (
                                  <label className="cursor-pointer rounded-md border border-dashed border-zinc-300 p-1 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 transition-colors">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
                                      <rect x="3" y="3" width="18" height="18" rx="2" />
                                      <circle cx="8.5" cy="8.5" r="1.5" />
                                      <path d="m21 15-5-5L5 21" />
                                    </svg>
                                    <input
                                      type="file"
                                      accept="image/png,image/jpeg,image/webp"
                                      className="sr-only"
                                      onChange={(e) => handleVariantImageUpload(variant.name, option, e.target.files?.[0])}
                                    />
                                  </label>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={variant.draftOption}
                            onChange={(e) => handleVariantDraftOption(variantIndex, e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddVariantOption(variantIndex); } }}
                            placeholder={t("admin_variant_option_placeholder")}
                            className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition-colors duration-200 placeholder:text-zinc-400 focus:border-zinc-950"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => handleAddVariantOption(variantIndex)}
                          >
                            {t("admin_variant_option_add")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formState.draftVariantName}
                    onChange={(e) => handleFormChange("draftVariantName", e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddVariant(); } }}
                    placeholder={t("admin_variant_name_placeholder")}
                    className="min-w-0 flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition-colors duration-200 placeholder:text-zinc-400 focus:border-zinc-950"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddVariant}
                    disabled={!formState.draftVariantName.trim()}
                  >
                    {t("admin_variant_add")}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting || isUploadingImage}
                >
                  {isSubmitting
                    ? t("admin_saving")
                    : formState.id
                      ? t("admin_update_product")
                      : t("admin_create_product_btn")}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={resetForm}
                >
                  {t("admin_reset")}
                </Button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
