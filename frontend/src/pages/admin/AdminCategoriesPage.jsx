import { useDeferredValue, useEffect, useRef, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import TextareaField from "../../components/ui/TextareaField";
import { useLanguage } from "../../hooks/useLanguage";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/api/categories.service";
import { uploadProductImage } from "../../services/api/uploads.service";

const emptyCategoryForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  imageAlt: "",
  isActive: true,
};

const mapCategoryToForm = (category) => ({
  id: category._id,
  name: category.name || "",
  slug: category.slug || "",
  description: category.description || "",
  imageUrl: category.image?.url || "",
  imageAlt: category.image?.alt || "",
  isActive: Boolean(category.isActive),
});

export default function AdminCategoriesPage() {
  const { t } = useLanguage();
  const imageFileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState(emptyCategoryForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const loadCategoriesData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getCategories();
      setCategories(response?.data || []);
    } catch (error) {
      setErrorMessage(error?.message || "Categories could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategoriesData();
  }, []);

  const handleFormChange = (fieldName, value) => {
    setFormState((currentValue) => ({
      ...currentValue,
      [fieldName]: value,
    }));
  };

  const resetForm = () => {
    setFormState(emptyCategoryForm);
    if (imageFileInputRef.current) {
      imageFileInputRef.current.value = "";
    }
    setFormMessage("");
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setErrorMessage("");
    setFormMessage("");

    try {
      const response = await uploadProductImage(file);
      const uploadedImage = response?.data || {};

      if (!uploadedImage.url) {
        throw new Error(t("admin_product_image_upload_error"));
      }

      setFormState((currentValue) => ({
        ...currentValue,
        imageUrl: uploadedImage.url,
        imageAlt: currentValue.imageAlt || uploadedImage.alt || currentValue.name,
      }));
      setFormMessage(t("admin_product_image_uploaded"));
    } catch (error) {
      setErrorMessage(error?.message || t("admin_product_image_upload_error"));
    } finally {
      setIsUploadingImage(false);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = "";
      }
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
      image: formState.imageUrl
        ? {
            url: formState.imageUrl,
            alt: formState.imageAlt || undefined,
          }
        : undefined,
      isActive: formState.isActive,
    };

    try {
      if (formState.id) {
        await updateCategory(formState.id, payload);
        setFormMessage(t("admin_category_updated"));
      } else {
        await createCategory(payload);
        setFormMessage(t("admin_category_created"));
      }

      await loadCategoriesData();
      setFormState(emptyCategoryForm);
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = "";
      }
    } catch (error) {
      setErrorMessage(error?.message || t("admin_category_save_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm(t("admin_category_delete_confirm"))) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      await loadCategoriesData();
    } catch (error) {
      setErrorMessage(error?.message || t("admin_category_delete_error"));
    }
  };

  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredCategories = normalizedSearchQuery
    ? categories.filter((category) => {
        const searchableFields = [category.name, category.slug, category.description];

        return searchableFields.some((fieldValue) =>
          String(fieldValue || "").toLowerCase().includes(normalizedSearchQuery)
        );
      })
    : categories;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={t("admin_catalog_structure")}
        title={t("admin_categories_title")}
        description={t("admin_categories_copy")}
        actions={
          <Button variant="secondary" onClick={resetForm}>
            {t("admin_new_category")}
          </Button>
        }
      />

      {errorMessage ? (
        <SurfaceMessage
          tone="error"
          title="Categories unavailable"
          description={errorMessage}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <section className="min-w-0 overflow-hidden border border-zinc-200/80 bg-white">
          <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-950">
                  {t("admin_catalog_categories")}
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  {t("admin_catalog_categories_copy")}
                </div>
              </div>

              <div className="w-full max-w-md">
                <TextInput
                  label={t("admin_search_categories")}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("admin_search_categories_placeholder")}
                />
              </div>
            </div>

            {categories.length > 0 ? (
              <div className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
                {t("admin_categories_results_count", {
                  visible: filteredCategories.length,
                  total: categories.length,
                })}
              </div>
            ) : null}
          </div>

          {isLoading ? (
            <div className="px-4 py-6 sm:px-5">
              <SurfaceMessage
                title={t("admin_loading_categories")}
                description={t("admin_loading_categories_copy")}
              />
            </div>
          ) : categories.length === 0 ? (
            <div className="px-4 py-6 sm:px-5">
              <SurfaceMessage
                title={t("admin_no_categories")}
                description={t("admin_no_categories_copy")}
              />
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="px-4 py-6 sm:px-5">
              <SurfaceMessage
                title={t("admin_no_matching_categories")}
                description={t("admin_no_matching_categories_copy")}
              />
            </div>
          ) : (
            <div className="divide-y divide-zinc-200/80">
              {filteredCategories.map((category) => (
                <article key={category._id} className="px-4 py-4 sm:px-5">
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold tracking-[-0.03em] text-zinc-950">
                        {category.name}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        {category.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row md:justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setFormState(mapCategoryToForm(category));
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
                        onClick={() => handleDelete(category._id)}
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

        <aside className="overflow-hidden border border-zinc-200/80 bg-white">
          <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5">
            <div className="text-sm font-medium text-zinc-950">
              {formState.id ? t("admin_edit_category") : t("admin_create_category")}
            </div>
            <div className="mt-1 text-sm text-zinc-500">
              {t("admin_category_info")}
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

              <div className="space-y-3 rounded-md border border-zinc-200 bg-zinc-50/70 p-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
                    {t("admin_image_upload")}
                  </div>
                  <p className="text-sm text-zinc-500">
                    {t("admin_image_upload_copy")}
                  </p>
                </div>

                <div className="overflow-hidden rounded-md border border-zinc-200 bg-white">
                  <div className="h-48 bg-zinc-100">
                    {formState.imageUrl ? (
                      <img
                        src={formState.imageUrl}
                        alt={formState.imageAlt || formState.name || "Category image"}
                        className="h-full w-full object-contain p-3"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-400">
                        {t("admin_store_image_empty")}
                      </div>
                    )}
                  </div>
                </div>

                <input
                  ref={imageFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-md file:border file:border-zinc-300 file:bg-white file:px-3.5 file:py-2.5 file:text-sm file:font-medium file:text-zinc-900"
                  disabled={isUploadingImage}
                  onChange={(event) => handleImageUpload(event.target.files?.[0])}
                />

                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs leading-5 text-zinc-500">
                    {isUploadingImage
                      ? t("admin_image_uploading")
                      : t("admin_store_media_note")}
                  </p>

                  {formState.imageUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFormChange("imageUrl", "")}
                    >
                      {t("admin_image_remove")}
                    </Button>
                  ) : null}
                </div>
              </div>

              <TextInput
                label={t("admin_image_alt")}
                value={formState.imageAlt}
                onChange={(event) => handleFormChange("imageAlt", event.target.value)}
              />

              <label className="flex items-center gap-3 border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) =>
                    handleFormChange("isActive", event.target.checked)
                  }
                />
                {t("admin_active_category")}
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={isSubmitting || isUploadingImage}>
                  {isSubmitting
                    ? t("admin_saving")
                    : formState.id
                      ? t("admin_update_category")
                      : t("admin_create_category_btn")}
                </Button>

                <Button type="button" variant="secondary" onClick={resetForm}>
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
