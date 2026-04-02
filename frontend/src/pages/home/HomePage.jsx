import { Link } from "react-router-dom";

import { useHomeMerchandising } from "../../hooks/useHomeMerchandising";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { formatCurrency } from "../../lib/format-currency";
import { ROUTE_PATHS } from "../../routes/route-paths";

function SectionHeader({ title, actionLabel, actionTo }) {
  return (
    <div className="flex items-end justify-between gap-4">
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
      <Link to={productPath} className="block overflow-hidden bg-zinc-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-[4/5] bg-[linear-gradient(180deg,rgba(246,246,247,1),rgba(236,236,238,0.92))]" />
        )}
      </Link>

      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          {product.category?.name || "Product"}
        </div>

        <div className="flex items-start justify-between gap-4">
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
  const currency = config.currency || "USD";
  const storeName = config.storeName || "Commerce Studio";
  const heroImage = config.heroImage || featuredProducts[0]?.images?.[0]?.url || "";
  const heroAlt = config.storeName || featuredProducts[0]?.name || "Storefront hero";

  return (
    <div className="space-y-16 pb-8 sm:space-y-20 lg:space-y-24">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <div className="flex flex-col justify-end py-2 lg:py-8">
          <div className="max-w-xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              {storeName}
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-zinc-950 sm:text-6xl lg:text-[4.9rem]">
              {t("home_hero_title")}
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-zinc-500 sm:text-lg">
              {t("home_hero_copy")}
            </p>

            <div className="mt-8 flex items-center gap-6">
              <Link
                to={ROUTE_PATHS.catalog}
                className="text-sm font-medium text-zinc-950 transition-opacity duration-200 hover:opacity-60"
              >
                {t("home_shop_now")}
              </Link>

              <Link
                to={{ pathname: ROUTE_PATHS.home, hash: "#featured" }}
                className="text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-950"
              >
                {t("home_view_featured")}
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-zinc-100">
          {heroImage ? (
            <img
              src={heroImage}
              alt={heroAlt}
              className="aspect-[5/6] h-full w-full object-cover lg:aspect-[4/5]"
            />
          ) : (
            <div className="aspect-[5/6] bg-[linear-gradient(180deg,rgba(245,245,245,1),rgba(231,231,231,0.92))] lg:aspect-[4/5]" />
          )}
        </div>
      </section>

      <section id="collections" className="space-y-8">
        <SectionHeader title={t("home_featured_categories")} />

        <div className="grid gap-6 md:grid-cols-3">
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

      <section className="grid gap-8 border-t border-zinc-200/80 pt-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
        <div className="overflow-hidden bg-[#f3f3f3]">
          {featuredProducts[1]?.images?.[0]?.url ? (
            <img
              src={featuredProducts[1].images[0].url}
              alt={featuredProducts[1].images?.[0]?.alt || featuredProducts[1].name}
              className="aspect-[5/4] h-full w-full object-cover"
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
