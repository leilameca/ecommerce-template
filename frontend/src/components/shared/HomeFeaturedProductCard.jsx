import { Link } from "react-router-dom";

import { formatCurrency } from "../../lib/format-currency";
import { useLanguage } from "../../hooks/useLanguage";
import { getLocalizedText } from "../../lib/localize-config";
import { ROUTE_PATHS } from "../../routes/route-paths";
import QuickAddToCartButton from "./QuickAddToCartButton";

const buildProductPath = (slug) => {
  return ROUTE_PATHS.productDetail.replace(":slug", slug);
};

export default function HomeFeaturedProductCard({ product, currency = "USD" }) {
  const { language } = useLanguage();
  const imageUrl = product.images?.[0]?.url || "";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const productPath = buildProductPath(product.slug);
  const hasDiscount = product.compareAtPrice != null && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <article className="overflow-hidden border border-zinc-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
      <div className="relative">
        <Link to={productPath} className="block">
          <div className="aspect-[4/5] overflow-hidden bg-zinc-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,rgba(247,247,248,1),rgba(238,238,240,0.9))]">
                <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
                  Selected Item
                </span>
              </div>
            )}
          </div>
        </Link>

        <QuickAddToCartButton
          product={product}
          size="sm"
          className="absolute right-4 top-4 z-10"
        />
      </div>

      <div className="space-y-3 px-5 py-5 sm:px-6">
        <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
          {product.category?.name || "Featured Product"}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              to={productPath}
              className="text-lg font-semibold tracking-[-0.03em] text-zinc-950 transition-colors duration-200 hover:text-zinc-600"
            >
              {product.name}
            </Link>

            <p className="mt-2 line-clamp-2 text-sm leading-7 text-zinc-600">
              {getLocalizedText(product.description, language) || ""}
            </p>
          </div>

          <div className="text-right">
            {hasDiscount ? (
              <div className="flex items-center justify-end gap-1.5">
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                  -{discountPercent}%
                </span>
              </div>
            ) : null}
            <div className="whitespace-nowrap text-base font-semibold tracking-[-0.03em] text-zinc-950">
              {formatCurrency(product.price, currency)}
            </div>
            {hasDiscount ? (
              <div className="text-sm text-zinc-400 line-through">
                {formatCurrency(product.compareAtPrice, currency)}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
