import { Link } from "react-router-dom";

import { formatCurrency } from "../../lib/format-currency";
import { ROUTE_PATHS } from "../../routes/route-paths";

const createProductPath = (slug) => {
  return ROUTE_PATHS.productDetail.replace(":slug", slug);
};

export default function ProductCard({ product }) {
  const currency = product.currency || "USD";
  const imageUrl = product.images?.[0]?.url || "";
  const categoryName = product.category?.name || "Collection";
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-zinc-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.05)] transition-transform duration-300 hover:-translate-y-1">
      <Link to={createProductPath(product.slug)} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.images?.[0]?.alt || product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[linear-gradient(180deg,rgba(250,250,250,1),rgba(244,244,245,0.92))]">
              <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-400">
                Premium Product
              </span>
            </div>
          )}

          <div className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-500 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            {categoryName}
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <Link
            to={createProductPath(product.slug)}
            className="block text-lg font-semibold tracking-[-0.03em] text-zinc-950 transition-colors duration-200 hover:text-zinc-700"
          >
            {product.name}
          </Link>

          <p className="line-clamp-2 text-sm leading-7 text-zinc-600">
            {product.description || "A premium catalog item prepared for a polished storefront experience."}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xl font-semibold tracking-[-0.04em] text-zinc-950">
              {formatCurrency(product.price, currency)}
            </div>

            <div className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
              {product.stock > 0
                ? isLowStock
                  ? "Low stock"
                  : "In stock"
                : "Out of stock"}
            </div>
          </div>

          <Link
            to={createProductPath(product.slug)}
            className="inline-flex items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-800 transition-colors duration-200 hover:bg-zinc-100"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
