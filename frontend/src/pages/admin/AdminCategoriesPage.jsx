import { useEffect, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import TextareaField from "../../components/ui/TextareaField";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../services/api/categories.service";

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
  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState(emptyCategoryForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formMessage, setFormMessage] = useState("");

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
      image: formState.imageUrl
        ? {
            url: formState.imageUrl,
            alt: formState.imageAlt,
          }
        : undefined,
      isActive: formState.isActive,
    };

    try {
      if (formState.id) {
        await updateCategory(formState.id, payload);
        setFormMessage("Category updated successfully.");
      } else {
        await createCategory(payload);
        setFormMessage("Category created successfully.");
      }

      await loadCategoriesData();
      resetForm();
    } catch (error) {
      setErrorMessage(error?.message || "Category could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Delete this category from the active catalog?")) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      await loadCategoriesData();
    } catch (error) {
      setErrorMessage(error?.message || "Category could not be deleted.");
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Catalog Structure"
        title="Categories"
        description="Manage the storefront collections used to organize products."
        actions={
          <Button variant="secondary" onClick={resetForm}>
            New Category
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
        <section className="min-w-0 border border-zinc-200/80 bg-white">
          <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5">
            <div className="text-sm font-medium text-zinc-950">Catalog categories</div>
            <div className="mt-1 text-sm text-zinc-500">
              Organize storefront collections and visibility.
            </div>
          </div>

          {isLoading ? (
            <div className="px-4 py-6 sm:px-5">
              <SurfaceMessage
                title="Loading categories"
                description="Fetching active categories from the backend."
              />
            </div>
          ) : categories.length === 0 ? (
            <div className="px-4 py-6 sm:px-5">
              <SurfaceMessage
                title="No categories yet"
                description="Create the first category from the editor."
              />
            </div>
          ) : (
            <div className="divide-y divide-zinc-200/80">
              {categories.map((category) => (
                <article key={category._id} className="px-4 py-4 sm:px-5">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_140px]">
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold tracking-[-0.03em] text-zinc-950">
                        {category.name}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        {category.description || "No description provided."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setFormState(mapCategoryToForm(category))}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
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
              {formState.id ? "Edit category" : "Create category"}
            </div>
            <div className="mt-1 text-sm text-zinc-500">
              Basic collection information and media.
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
                label="Name"
                value={formState.name}
                onChange={(event) => handleFormChange("name", event.target.value)}
                required
              />

              <TextInput
                label="Slug"
                value={formState.slug}
                onChange={(event) => handleFormChange("slug", event.target.value)}
                placeholder="Auto-generated if empty"
              />

              <TextareaField
                label="Description"
                value={formState.description}
                onChange={(event) =>
                  handleFormChange("description", event.target.value)
                }
              />

              <TextInput
                label="Image URL"
                value={formState.imageUrl}
                onChange={(event) => handleFormChange("imageUrl", event.target.value)}
              />

              <TextInput
                label="Image alt"
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
                Active category
              </label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving..."
                    : formState.id
                      ? "Update Category"
                      : "Create Category"}
                </Button>

                <Button type="button" variant="secondary" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
