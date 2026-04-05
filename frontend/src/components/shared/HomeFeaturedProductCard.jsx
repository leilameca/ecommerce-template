import { Link } from "react-router-dom";

import { formatCurrency } from "../../lib/format-currency";
import { ROUTE_PATHS } from "../../routes/route-paths";
import QuickAddToCartButton from "./QuickAddToCartButton";

const buildProductPath = (slug) => {
  return ROUTE_PATHS.productDetail.replace(":slug", slug);
};

export default function HomeFeaturedProductCard({ product, currency = "USD" }) {
  const imageUrl = product.images?.[0]?.url || "";
  const imageAlt = product.images?.[0]?.alt || product.name;
  const productPath = buildProductPath(product.slug);

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
              {product.description ||
                "A product selected to anchor the storefront with cleaner merchandising and faster purchase intent."}
            </p>
          </div>

          <div className="whitespace-nowrap text-base font-semibold tracking-[-0.03em] text-zinc-950">
            {formatCurrency(product.price, currency)}
          </div>
        </div>
      </div>
    </article>
  );
}
