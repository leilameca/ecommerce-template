import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";
import { useCart } from "../../hooks/useCart";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { formatCurrency } from "../../lib/format-currency";
import { ROUTE_PATHS } from "../../routes/route-paths";

function EmptyCartState({ t }) {
  return (
    <div className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-10">
      <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
        {t("cart_eyebrow")}
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
        {t("cart_empty_title")}
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
        {t("cart_empty_copy")}
      </p>

      <div className="mt-8">
        <Link to={ROUTE_PATHS.catalog} className="block sm:inline-block">
          <Button size="lg" className="w-full sm:w-auto">
            {t("cart_browse_catalog")}
          </Button>
        </Link>
      </div>
    </div>
  );
}

function CartItemRow({ item, currency, onDecrease, onIncrease, onRemove, t }) {
  return (
    <article className="grid gap-5 rounded-[2rem] border border-zinc-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:grid-cols-[120px_minmax(0,1fr)] sm:p-6">
      <div className="overflow-hidden rounded-[1.5rem] bg-zinc-100">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.imageAlt}
            className="aspect-square h-full w-full object-contain p-2"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-[linear-gradient(180deg,rgba(250,250,250,1),rgba(244,244,245,0.92))]">
            <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
              Product
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between gap-5">
        <div className="space-y-2">
          <Link
            to={ROUTE_PATHS.productDetail.replace(":slug", item.slug)}
            className="text-lg font-semibold tracking-[-0.03em] text-zinc-950 transition-colors duration-200 hover:text-zinc-700 sm:text-xl"
          >
            {item.name}
          </Link>

          {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(item.selectedVariants).map(([variantName, option]) => (
                <span
                  key={variantName}
                  className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600"
                >
                  {variantName}: {option}
                </span>
              ))}
            </div>
          ) : null}

          <p className="text-sm text-zinc-500">
            {formatCurrency(item.price, currency)} {t("cart_each")}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 p-1">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 transition-colors duration-200 hover:bg-white"
              onClick={onDecrease}
            >
              -
            </button>

            <span className="min-w-8 text-center text-sm font-medium text-zinc-950">
              {item.quantity}
            </span>

            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 transition-colors duration-200 hover:bg-white"
              onClick={onIncrease}
              disabled={item.quantity >= item.stock}
            >
              +
            </button>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <button
              type="button"
              className="text-sm font-medium text-zinc-500 transition-colors duration-200 hover:text-rose-600"
              onClick={onRemove}
            >
              {t("cart_remove")}
            </button>

            <div className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">
              {formatCurrency(item.price * item.quantity, currency)}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CartPage() {
  const { t } = useLanguage();
  const { items, subtotal, isEmpty, updateQuantity, removeItem, clearCart } = useCart();
  const { config } = useStoreConfig();
  const currency = config.currency || "USD";

  if (isEmpty) {
    return <EmptyCartState t={t} />;
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
        <div className="max-w-3xl">
          <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
            {t("cart_eyebrow")}
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-zinc-950 sm:text-5xl">
            {t("cart_title")}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">
            {t("cart_copy")}
          </p>
        </div>

        <div className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
          <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
            {t("cart_order_summary")}
          </div>

          <div className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-zinc-950">
            {formatCurrency(subtotal, currency)}
          </div>

          <p className="mt-3 text-sm leading-7 text-zinc-600">
            {t("cart_subtotal_copy")}
          </p>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <section className="space-y-5">
          {items.map((item) => (
            <CartItemRow
              key={item.cartItemId}
              item={item}
              currency={currency}
              onDecrease={() => updateQuantity(item.cartItemId, item.quantity - 1)}
              onIncrease={() => updateQuantity(item.cartItemId, item.quantity + 1)}
              onRemove={() => removeItem(item.cartItemId)}
              t={t}
            />
          ))}
        </section>

        <aside className="space-y-5 xl:sticky xl:top-24">
          <div className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span>{t("cart_items")}</span>
                <span>{items.length}</span>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 text-sm text-zinc-500">
                <span>{t("cart_subtotal")}</span>
                <span className="font-medium text-zinc-950">
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-base font-semibold text-zinc-950">
                <span>{t("cart_estimated_total")}</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link to={ROUTE_PATHS.checkout}>
                <Button size="lg" className="w-full">
                  {t("cart_continue_checkout")}
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={clearCart}
              >
                {t("cart_clear")}
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
