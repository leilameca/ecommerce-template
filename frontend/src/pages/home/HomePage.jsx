import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { useHomeMerchandising } from "../../hooks/useHomeMerchandising";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { formatCurrency } from "../../lib/format-currency";
import { ROUTE_PATHS } from "../../routes/route-paths";
import QuickAddToCartButton from "../../components/shared/QuickAddToCartButton";

function SectionHeader({ title, actionLabel, actionTo }) {
  return (
    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
      <h2 className="text-2xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-3xl">
        {title}
      </h2>

      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="text-sm font-medium text-zinc-500 transition-colors duration-200 hover:text-zinc-950"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}

function CategoryTile({ category, index }) {
  const imageUrl = category.image?.url || "";
  const imageAlt = category.image?.alt || category.name;
  const fallbackBackgrounds = ["bg-zinc-100", "bg-stone-100", "bg-neutral-100"];

  return (
    <Link to={ROUTE_PATHS.catalog} className="group block">
      <article className="space-y-4">
        <div className="aspect-[5/6] overflow-hidden bg-zinc-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className={`h-full w-full ${fallbackBackgrounds[index % fallbackBackgrounds.length]}`} />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium tracking-[-0.03em] text-zinc-950">
            {category.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-6 text-zinc-500">
            {category.description || "Clean merchandising for a stronger storefront entry point."}
          </p>
        </div>
      </article>
    </Link>
  );
}

function ProductTile({ product, currency }) {
  const imageUrl = product.images?.[0]?.url || "";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const productPath = ROUTE_PATHS.productDetail.replace(":slug", product.slug);

  return (
    <article className="group space-y-4">
      <div className="relative">
        <Link to={productPath} className="block overflow-hidden bg-zinc-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="aspect-[4/5] h-full w-full object-contain p-4"
            />
          ) : (
            <div className="aspect-[4/5] bg-[linear-gradient(180deg,rgba(246,246,247,1),rgba(236,236,238,0.92))]" />
          )}
        </Link>

        <QuickAddToCartButton
          product={product}
          size="sm"
          className="absolute right-4 top-4 z-10"
        />
      </div>

      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          {product.category?.name || "Product"}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              to={productPath}
              className="text-lg font-medium tracking-[-0.03em] text-zinc-950 transition-colors duration-200 hover:text-zinc-600"
            >
              {product.name}
            </Link>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-500">
              {product.description ||
                "A refined item presented with quiet hierarchy and strong image priority."}
            </p>
          </div>

          <div className="whitespace-nowrap text-base font-medium tracking-[-0.02em] text-zinc-950">
            {formatCurrency(product.price, currency)}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const { config } = useStoreConfig();
  const { t } = useLanguage();
  const { featuredCategories, featuredProducts, isLoading } = useHomeMerchandising();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);
  const currency = config.currency || "USD";
  const storeName = config.storeName || "Commerce Studio";
  const heroImage = config.heroImage || featuredProducts[0]?.images?.[0]?.url || "";
  const heroAlt = config.storeName || featuredProducts[0]?.name || "Storefront hero";
  const heroImageClassName = config.heroImage
    ? "aspect-[5/6] h-full w-full object-cover lg:aspect-[4/5]"
    : "aspect-[5/6] h-full w-full object-contain p-4 lg:aspect-[4/5] lg:p-6";

  return (
    <div className="space-y-14 pb-8 sm:space-y-20 lg:space-y-24">
      <section className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <div className="flex flex-col justify-end py-0 sm:py-2 lg:py-8">
          <div className="max-w-xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              {storeName}
            </div>

            <h1 className="mt-5 text-[2.8rem] font-semibold leading-[0.96] tracking-[-0.06em] text-zinc-950 sm:text-6xl lg:text-[4.9rem]">
              {config.heroTitle || t("home_hero_title")}
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-500 sm:text-lg">
              {config.heroCopy || t("home_hero_copy")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <Link
                to={ROUTE_PATHS.catalog}
                className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium text-white transition-colors duration-200 hover:opacity-90 [&_*]:text-inherit sm:w-auto"
                style={{ backgroundColor: "var(--color-primary, #111)" }}
              >
                {t("home_shop_now")}
              </Link>

              <Link
                to={{ pathname: ROUTE_PATHS.home, hash: "#featured" }}
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm text-zinc-600 transition-colors duration-200 hover:border-zinc-300 hover:text-zinc-950 sm:w-auto"
              >
                {t("home_view_featured")}
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-zinc-100">
          {heroImage ? (
            <img
              src={heroImage}
              alt={heroAlt}
              className={heroImageClassName}
            />
          ) : (
            <div className="aspect-[5/6] bg-[linear-gradient(180deg,rgba(245,245,245,1),rgba(231,231,231,0.92))] lg:aspect-[4/5]" />
          )}
        </div>
      </section>

      <section id="collections" className="space-y-8">
        <SectionHeader title={t("home_featured_categories")} />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(isLoading ? Array.from({ length: 3 }) : featuredCategories).map((category, index) =>
            isLoading ? (
              <div key={index} className="space-y-4">
                <div className="aspect-[5/6] animate-pulse bg-zinc-100" />
                <div className="h-5 w-2/3 animate-pulse bg-zinc-100" />
                <div className="h-4 w-full animate-pulse bg-zinc-100" />
              </div>
            ) : (
              <CategoryTile key={category._id} category={category} index={index} />
            )
          )}
        </div>
      </section>

      <section id="featured" className="space-y-8">
        <SectionHeader title={t("home_featured_products")} actionLabel={t("home_shop_all")} actionTo={ROUTE_PATHS.catalog} />

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
          {(isLoading ? Array.from({ length: 4 }) : featuredProducts).map((product, index) =>
            isLoading ? (
              <div key={index} className="space-y-4">
                <div className="aspect-[4/5] animate-pulse bg-zinc-100" />
                <div className="h-4 w-1/3 animate-pulse bg-zinc-100" />
                <div className="h-5 w-2/3 animate-pulse bg-zinc-100" />
              </div>
            ) : (
              <ProductTile key={product._id} product={product} currency={currency} />
            )
          )}
        </div>
      </section>

      <section className="grid gap-6 border-t border-zinc-200/80 pt-10 sm:gap-8 sm:pt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="overflow-hidden rounded-[2rem] bg-[#f3f3f3]">
          {featuredProducts[1]?.images?.[0]?.url ? (
            <img
              src={featuredProducts[1].images[0].url}
              alt={featuredProducts[1].images?.[0]?.alt || featuredProducts[1].name}
              className="aspect-[5/4] h-full w-full object-contain p-4"
            />
          ) : (
            <div className="aspect-[5/4] bg-[linear-gradient(180deg,rgba(243,243,243,1),rgba(229,229,229,0.92))]" />
          )}
        </div>

        <div className="max-w-xl">
          <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
            {t("home_editorial_eyebrow")}
          </div>

          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.05em] text-zinc-950 sm:text-4xl">
            {t("home_editorial_title")}
          </h2>

          <p className="mt-5 text-base leading-7 text-zinc-500">
            {t("home_editorial_copy")}
          </p>

          <div className="mt-8 grid gap-5 border-t border-zinc-200/80 pt-6 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium text-zinc-950">{t("home_editorial_point_1_title")}</div>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {t("home_editorial_point_1_copy")}
              </p>
            </div>

            <div>
              <div className="text-sm font-medium text-zinc-950">{t("home_editorial_point_2_title")}</div>
              <p className="mt-2 text-sm leading-6 text-zinc-500">
                {t("home_editorial_point_2_copy")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
