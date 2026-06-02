import { useDeferredValue, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import PageSEO from "../../components/shared/PageSEO";
import ProductCard from "../../components/shared/ProductCard";
import FilterChip from "../../components/ui/FilterChip";
import PaginationControls from "../../components/ui/PaginationControls";
import SelectField from "../../components/ui/SelectField";
import TextInput from "../../components/ui/TextInput";
import { useCatalogData } from "../../hooks/useCatalogData";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";

const DEFAULT_LIMIT = 12;
const ALL_CATEGORIES_VALUE = "all";

const sortProducts = (products, sortValue) => {
  const sortedProducts = [...products];

  if (sortValue === "price-asc") {
    sortedProducts.sort((firstItem, secondItem) => firstItem.price - secondItem.price);
    return sortedProducts;
  }

  if (sortValue === "price-desc") {
    sortedProducts.sort((firstItem, secondItem) => secondItem.price - firstItem.price);
    return sortedProducts;
  }

  if (sortValue === "name") {
    sortedProducts.sort((firstItem, secondItem) =>
      firstItem.name.localeCompare(secondItem.name)
    );
    return sortedProducts;
  }

  return sortedProducts;
};

const filterProducts = ({ products, selectedCategory, searchQuery }) => {
  return products.filter((product) => {
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES_VALUE ||
      product.category?.slug === selectedCategory;

    const normalizedSearch = searchQuery.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.description?.toLowerCase().includes(normalizedSearch) ||
      product.category?.name?.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });
};

function CatalogHeader({ t }) {
  return (
    <section className="max-w-3xl">
      <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
        {t("catalog_eyebrow")}
      </span>

      <h1 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
        {t("catalog_title")}
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8 sm:mt-3">
        {t("catalog_copy")}
      </p>
    </section>
  );
}

function CatalogToolbar({
  searchValue,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  sortValue,
  onSortChange,
  t,
}) {
  return (
    <section className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-3.5 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
        <TextInput
          label={t("catalog_search")}
          type="search"
          placeholder={t("catalog_search_placeholder")}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />

        <SelectField
          label={t("catalog_sort_by")}
          value={sortValue}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="featured">{t("catalog_sort_featured")}</option>
          <option value="price-asc">{t("catalog_sort_price_asc")}</option>
          <option value="price-desc">{t("catalog_sort_price_desc")}</option>
          <option value="name">{t("catalog_sort_name")}</option>
        </SelectField>
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <FilterChip
          isActive={selectedCategory === ALL_CATEGORIES_VALUE}
          onClick={() => onCategoryChange(ALL_CATEGORIES_VALUE)}
        >
          {t("catalog_all_categories")}
        </FilterChip>

        {categories.map((category) => (
          <FilterChip
            key={category._id}
            isActive={selectedCategory === category.slug}
            onClick={() => onCategoryChange(category.slug)}
          >
            {category.name}
          </FilterChip>
        ))}
      </div>
    </section>
  );
}

function CatalogState({ title, description, tone = "default" }) {
  const toneClassName =
    tone === "error"
      ? "border-rose-200 bg-rose-50/70 text-rose-900"
      : "border-zinc-200/80 bg-zinc-50/70 text-zinc-900";

  return (
    <div className={`rounded-[2rem] border p-8 shadow-[0_20px_60px_rgba(15,23,42,0.04)] ${toneClassName}`}>
      <h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-current/75">{description}</p>
    </div>
  );
}

export default function ProductCatalogPage() {
  const { t } = useLanguage();
  const { config } = useStoreConfig();
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ALL_CATEGORIES_VALUE
  );
  const [sortValue, setSortValue] = useState("featured");
  const deferredSearchValue = useDeferredValue(searchValue);

  const { products, categories, pagination, isLoading, errorMessage } = useCatalogData({
    page,
    limit: DEFAULT_LIMIT,
  });

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, deferredSearchValue, sortValue]);

  const filteredProducts = filterProducts({
    products,
    selectedCategory,
    searchQuery: deferredSearchValue,
  });
  const visibleProducts = sortProducts(filteredProducts, sortValue);

  return (
    <div className="space-y-5 sm:space-y-8">
      <PageSEO title={t("catalog_title")} />
      <CatalogHeader t={t} />

      <CatalogToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortValue={sortValue}
        onSortChange={setSortValue}
        t={t}
      />

      <section className="space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
              {t("catalog_visible_selection")}
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-zinc-950">
              {t("catalog_products_on_view", { count: visibleProducts.length })}
            </h2>
          </div>

          {pagination ? (
            <p className="text-sm text-zinc-500">
              {t("catalog_showing_page", { page: pagination.page, total: pagination.totalPages })}
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.05)]"
              >
                <div className="aspect-[4/5] animate-pulse rounded-[1.5rem] bg-zinc-100" />
                <div className="mt-5 h-5 w-2/3 animate-pulse rounded-full bg-zinc-100" />
                <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-zinc-100" />
                <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-zinc-100" />
              </div>
            ))}
          </div>
        ) : errorMessage ? (
          <CatalogState
            tone="error"
            title={t("catalog_unavailable")}
            description={errorMessage}
          />
        ) : visibleProducts.length === 0 ? (
          <CatalogState
            title={t("catalog_empty_title")}
            description={t("catalog_empty_copy")}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={{ ...product, currency: config.currency || "USD" }}
              />
            ))}
          </div>
        )}
      </section>

      <PaginationControls
        pagination={pagination}
        isDisabled={isLoading}
        onPageChange={setPage}
      />
    </div>
  );
}
