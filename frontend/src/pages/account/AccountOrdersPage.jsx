import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { formatCurrency } from "../../lib/format-currency";
import { getCustomerOrders } from "../../services/api/customers.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

const STATUS_LABELS = {
  pending: { en: "Pending", es: "Pendiente" },
  processing: { en: "Processing", es: "En proceso" },
  shipped: { en: "Shipped", es: "Enviado" },
  delivered: { en: "Delivered", es: "Entregado" },
  cancelled: { en: "Cancelled", es: "Cancelado" },
};

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-violet-50 text-violet-700 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function OrderCard({ order, currency, t }) {
  const statusColor = STATUS_COLORS[order.orderStatus] || "bg-zinc-50 text-zinc-700 border-zinc-200";

  return (
    <article className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 shadow-[0_16px_48px_rgba(15,23,42,0.04)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            #{String(order._id).slice(-8).toUpperCase()}
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            {t("account_order_placed")}: {formatDate(order.createdAt)}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {order.items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate text-zinc-700">
              {item.name} × {item.quantity}
              {item.variantSelections && Object.keys(item.variantSelections).length > 0 ? (
                <span className="ml-1 text-zinc-400">
                  ({Object.entries(item.variantSelections).map(([k, v]) => `${k}: ${v}`).join(", ")})
                </span>
              ) : null}
            </span>
            <span className="shrink-0 font-medium text-zinc-950">
              {formatCurrency(item.lineTotal, currency)}
            </span>
          </div>
        ))}
        {order.items.length > 3 ? (
          <div className="text-xs text-zinc-400">
            +{order.items.length - 3} more item(s)
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4">
        <span className="text-sm text-zinc-500">{t("account_order_total")}</span>
        <span className="text-base font-semibold tracking-[-0.03em] text-zinc-950">
          {formatCurrency(order.total, currency)}
        </span>
      </div>
    </article>
  );
}

export default function AccountOrdersPage() {
  const { t } = useLanguage();
  const { customer, token, isAuthenticated, isLoading: authLoading, logout } = useCustomerAuth();
  const { config } = useStoreConfig();
  const navigate = useNavigate();
  const currency = config.currency || "USD";
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate(ROUTE_PATHS.accountLogin, { replace: true });
      return;
    }

    setIsLoading(true);
    getCustomerOrders(token)
      .then((res) => {
        setOrders(res?.data || []);
      })
      .catch((err) => {
        setError(err?.message || "Could not load orders.");
      })
      .finally(() => setIsLoading(false));
  }, [authLoading, isAuthenticated, token]);

  if (authLoading || isLoading) {
    return (
      <div className="space-y-4 py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-[1.5rem] bg-zinc-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
            {t("account_orders_eyebrow")}
          </span>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-3xl">
            {t("account_hello", { name: customer?.name || "" })}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{t("account_orders_copy")}</p>
        </div>

        <Button variant="secondary" size="sm" onClick={logout}>
          {t("account_logout")}
        </Button>
      </section>

      <div className="flex gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1 text-sm font-medium w-fit">
        <span className="rounded-full bg-white px-4 py-1.5 text-zinc-950 shadow-sm">
          {t("account_nav_orders")}
        </span>
        <Link to={ROUTE_PATHS.accountProfile} className="rounded-full px-4 py-1.5 text-zinc-500 transition-colors hover:text-zinc-950">
          {t("account_nav_profile")}
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {!error && orders.length === 0 ? (
        <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="text-sm font-medium text-zinc-950">{t("account_orders_empty")}</div>
          <p className="mt-2 text-sm text-zinc-500">{t("account_orders_empty_copy")}</p>
          <div className="mt-5">
            <Link to={ROUTE_PATHS.catalog}>
              <Button size="sm">{t("account_go_catalog")}</Button>
            </Link>
          </div>
        </div>
      ) : null}

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} currency={currency} t={t} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
