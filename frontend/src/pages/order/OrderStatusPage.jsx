import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { formatCurrency } from "../../lib/format-currency";
import { getPublicOrder } from "../../services/api/orders.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

const STATUS_COLORS = {
  pending: "bg-zinc-100 text-zinc-600",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-violet-50 text-violet-700",
  shipped: "bg-emerald-50 text-emerald-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-rose-50 text-rose-700",
};

export default function OrderStatusPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { config } = useStoreConfig();
  const currency = config.currency || "USD";
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getPublicOrder(id)
      .then((res) => setOrder(res?.data || null))
      .catch((err) => setErrorMessage(err?.message || t("order_status_not_found")))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-[2rem] border border-zinc-200/80 bg-white p-6 sm:p-10 animate-pulse">
        <div className="h-4 w-32 rounded-full bg-zinc-100" />
        <div className="h-8 w-2/3 rounded-[1rem] bg-zinc-100" />
        <div className="h-4 w-1/2 rounded-full bg-zinc-100" />
      </div>
    );
  }

  if (errorMessage || !order) {
    return (
      <div className="rounded-[2rem] border border-rose-200 bg-rose-50/70 p-6 sm:p-10 text-rose-900">
        <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-rose-400">{t("order_status_eyebrow")}</div>
        <h1 className="mt-4 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">{t("order_status_not_found")}</h1>
        <p className="mt-3 text-sm leading-7 text-current/75">{errorMessage}</p>
        <Link to={ROUTE_PATHS.catalog} className="mt-6 inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white">
          {t("order_status_back")}
        </Link>
      </div>
    );
  }

  const statusColorClass = STATUS_COLORS[order.orderStatus] || STATUS_COLORS.pending;
  const orderId = order._id?.slice(-8).toUpperCase();

  return (
    <div className="space-y-5 sm:space-y-8">
      <section className="max-w-2xl">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">{t("order_status_eyebrow")}</span>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
          {t("order_status_title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">{t("order_status_id")}: <span className="font-mono font-medium text-zinc-900">{orderId}</span></p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-start">
        <div className="space-y-4 rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusColorClass}`}>
              {order.orderStatus}
            </span>
            <span className="text-xs text-zinc-400">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="divide-y divide-zinc-100">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <div className="font-medium text-zinc-950">{item.name}</div>
                  {item.variantSelections && Object.keys(item.variantSelections).length > 0 ? (
                    <div className="mt-0.5 text-xs text-zinc-400">
                      {Object.entries(item.variantSelections).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                    </div>
                  ) : null}
                  <div className="mt-0.5 text-sm text-zinc-500">{item.quantity} × {formatCurrency(item.price, currency)}</div>
                </div>
                <div className="shrink-0 font-medium text-zinc-950">{formatCurrency(item.lineTotal, currency)}</div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-zinc-100 pt-4 text-sm">
            <div className="flex justify-between text-zinc-500">
              <span>{t("order_status_subtotal")}</span>
              <span>{formatCurrency(order.subtotal, currency)}</span>
            </div>
            {order.shipping > 0 ? (
              <div className="flex justify-between text-zinc-500">
                <span>{t("order_status_shipping")}</span>
                <span>{formatCurrency(order.shipping, currency)}</span>
              </div>
            ) : null}
            {order.discountAmount > 0 ? (
              <div className="flex justify-between text-emerald-600">
                <span>{t("order_status_discount")}</span>
                <span>-{formatCurrency(order.discountAmount, currency)}</span>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-zinc-100 pt-3 text-base font-semibold text-zinc-950">
              <span>{t("order_status_total")}</span>
              <span>{formatCurrency(order.total, currency)}</span>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-5">
            <div className="text-[10px] font-medium uppercase tracking-[0.26em] text-zinc-400">{t("order_status_details")}</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="text-zinc-950 font-medium">{order.customerName}</div>
              {order.phone ? <div className="text-zinc-500">{order.phone}</div> : null}
              {order.address ? <div className="text-zinc-500">{order.address}</div> : null}
              <div className="capitalize text-zinc-500">{order.paymentMethod?.replace("_", " ")}</div>
            </div>
          </div>

          <Link to={ROUTE_PATHS.catalog}>
            <button type="button" className="w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
              {t("order_status_back")}
            </button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
