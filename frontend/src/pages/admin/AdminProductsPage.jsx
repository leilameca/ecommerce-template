import { useEffect, useState } from "react";

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

const emptyProductForm = {
  id: "",
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  imageUrl: "",
  imageAlt: "",
  isActive: true,
};

const mapProductToForm = (product) => ({
  id: product._id,
  name: product.name || "",
  slug: product.slug || "",
  description: product.description || "",
  price: String(product.price ?? ""),
  stock: String(product.stock ?? ""),
  category: product.category?._id || "",
  imageUrl: product.images?.[0]?.url || "",
  imageAlt: product.images?.[0]?.alt || "",
  isActive: Boolean(product.isActive),
});

export default function AdminProductsPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState(emptyProductForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");

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
    setFormMessage("");
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
      images: formState.imageUrl
        ? [
            {
              url: formState.imageUrl,
              alt: formState.imageAlt,
            },
          ]
        : [],
      isActive: formState.isActive,
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
        <section className="min-w-0 border border-zinc-200/80 bg-white">
          <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5">
            <div className="text-sm font-medium text-zinc-950">Catalog products</div>
            <div className="mt-1 text-sm text-zinc-500">
              {t("admin_catalog_products_copy")}
            </div>
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
          ) : (
            <div className="divide-y divide-zinc-200/80">
              {products.map((product) => (
                <article key={product._id} className="px-4 py-4 sm:px-5">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_160px_160px]">
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

                    <div className="text-sm font-medium text-zinc-950 lg:text-right">
                      {formatCurrency(product.price)}
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setFormState(mapProductToForm(product))}
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

        <aside className="border border-zinc-200/80 bg-white">
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

              <TextInput
                label={t("admin_image_url")}
                value={formState.imageUrl}
                onChange={(event) => handleFormChange("imageUrl", event.target.value)}
                placeholder="https://..."
              />

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
                {t("admin_active_product")}
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? t("admin_saving")
                    : formState.id
                      ? t("admin_update_product")
                      : t("admin_create_product_btn")}
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
