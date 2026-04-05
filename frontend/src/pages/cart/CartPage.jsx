import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";
import { useCart } from "../../hooks/useCart";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { formatCurrency } from "../../lib/format-currency";
import { ROUTE_PATHS } from "../../routes/route-paths";

function EmptyCartState() {
  return (
    <div className="rounded-[2rem] border border-zinc-200/80 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-10">
      <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
        Cart
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
        Your cart is still empty.
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
        Start with the catalog and add premium products to the bag before moving
        into checkout.
      </p>

      <div className="mt-8">
        <Link to={ROUTE_PATHS.catalog}>
          <Button size="lg">Browse Catalog</Button>
        </Link>
      </div>
    </div>
  );
}

function CartItemRow({ item, currency, onDecrease, onIncrease, onRemove }) {
  return (
    <article className="grid gap-5 rounded-[2rem] border border-zinc-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:grid-cols-[120px_minmax(0,1fr)] sm:p-6">
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
            className="text-xl font-semibold tracking-[-0.03em] text-zinc-950 transition-colors duration-200 hover:text-zinc-700"
          >
            {item.name}
          </Link>

          <p className="text-sm text-zinc-500">
            {formatCurrency(item.price, currency)} each
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-sm font-medium text-zinc-500 transition-colors duration-200 hover:text-rose-600"
              onClick={onRemove}
            >
              Remove
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
  const { items, subtotal, isEmpty, updateQuantity, removeItem, clearCart } = useCart();
  const { config } = useStoreConfig();
  const currency = config.currency || "USD";

  if (isEmpty) {
    return <EmptyCartState />;
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
        <div className="max-w-3xl">
          <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
            Shopping Cart
          </span>

          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-zinc-950 sm:text-5xl">
            Review your selection before checkout.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">
            Fine-tune quantities, validate totals, and continue into a cleaner
            checkout flow connected to your backend order system.
          </p>
        </div>

        <div className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
          <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
            Order Summary
          </div>

          <div className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-zinc-950">
            {formatCurrency(subtotal, currency)}
          </div>

          <p className="mt-3 text-sm leading-7 text-zinc-600">
            Subtotal before shipping and payment method selection.
          </p>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-5">
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              currency={currency}
              onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
              onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </section>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span>Items</span>
                <span>{items.length}</span>
              </div>

              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4 text-sm text-zinc-500">
                <span>Subtotal</span>
                <span className="font-medium text-zinc-950">
                  {formatCurrency(subtotal, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between text-base font-semibold text-zinc-950">
                <span>Estimated total</span>
                <span>{formatCurrency(subtotal, currency)}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link to={ROUTE_PATHS.checkout}>
                <Button size="lg" className="w-full">
                  Continue to Checkout
                </Button>
              </Link>

              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
