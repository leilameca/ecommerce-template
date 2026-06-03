import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import StatCard from "../../components/shared/StatCard";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { formatCurrency } from "../../lib/format-currency";
import { getSalesAnalytics } from "../../services/api/analytics.service";
import { getOrders } from "../../services/api/orders.service";
import { getProducts } from "../../services/api/products.service";
import { getCategories } from "../../services/api/categories.service";

const STATUS_COLORS = {
  pending: "#a1a1aa",
  confirmed: "#60a5fa",
  processing: "#a78bfa",
  shipped: "#34d399",
  delivered: "#10b981",
  cancelled: "#f87171",
};

function RevenueChart({ data, currency }) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.date.slice(5),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#111111" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#111111" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#a1a1aa" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#a1a1aa" }} tickLine={false} axisLine={false} />
        <Tooltip
          formatter={(val) => [formatCurrency(val, currency), "Revenue"]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#111111"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function OrderStatusChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={48}
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#a1a1aa"} />
          ))}
        </Pie>
        <Tooltip
          formatter={(val, name) => [val, name]}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function AdminDashboardPage() {
  const { config } = useStoreConfig();
  const { t } = useLanguage();
  const currency = config.currency || "USD";
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0 });
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const [productsRes, categoriesRes, ordersRes, analyticsRes] = await Promise.allSettled([
        getProducts({ page: 1, limit: 1 }),
        getCategories(),
        getOrders({ page: 1, limit: 6 }),
        getSalesAnalytics({ days: 30 }),
      ]);

      if (!isMounted) return;

      if (productsRes.status === "fulfilled") {
        setStats((prev) => ({ ...prev, products: productsRes.value?.pagination?.totalItems || 0 }));
      }
      if (categoriesRes.status === "fulfilled") {
        setStats((prev) => ({ ...prev, categories: categoriesRes.value?.data?.length || 0 }));
      }
      if (ordersRes.status === "fulfilled") {
        setStats((prev) => ({ ...prev, orders: ordersRes.value?.pagination?.totalItems || 0 }));
        setRecentOrders(ordersRes.value?.data || []);
      }
      if (analyticsRes.status === "fulfilled") {
        setAnalytics(analyticsRes.value?.data || null);
      } else {
        setErrorMessage(analyticsRes.reason?.message || "Analytics data could not be loaded.");
      }

      setIsLoading(false);
    };

    loadDashboard();
    return () => { isMounted = false; };
  }, []);

  const summary = analytics?.summary || {};
  const revenueByDay = analytics?.revenueByDay || [];
  const topProducts = analytics?.topProducts || [];
  const byStatus = analytics?.byStatus || [];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={t("dashboard_eyebrow")}
        title={t("dashboard_title")}
        description={t("dashboard_copy")}
      />

      {errorMessage ? (
        <SurfaceMessage tone="error" title="Dashboard unavailable" description={errorMessage} />
      ) : null}

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t("dashboard_products")}
          value={isLoading ? "..." : stats.products}
          hint={t("dashboard_products_hint")}
        />
        <StatCard
          label={t("dashboard_categories")}
          value={isLoading ? "..." : stats.categories}
          hint={t("dashboard_categories_hint")}
        />
        <StatCard
          label={t("dashboard_orders")}
          value={isLoading ? "..." : stats.orders}
          hint={t("dashboard_orders_hint")}
        />
        <StatCard
          label={t("dashboard_revenue_30d")}
          value={isLoading ? "..." : formatCurrency(summary.totalRevenue || 0, currency)}
          hint={t("dashboard_revenue_30d_hint")}
        />
      </section>

      {/* Charts */}
      {!isLoading && (revenueByDay.length > 0 || byStatus.length > 0) ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-5">
            <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.26em] text-zinc-400">
              {t("dashboard_revenue_chart")}
            </div>
            <RevenueChart data={revenueByDay} currency={currency} />
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-5">
            <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.26em] text-zinc-400">
              {t("dashboard_orders_by_status")}
            </div>
            <OrderStatusChart data={byStatus} />
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
              {byStatus.map((s) => (
                <div key={s.status} className="flex items-center gap-1.5 text-xs text-zinc-500">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: STATUS_COLORS[s.status] || "#a1a1aa" }}
                  />
                  {s.status} ({s.count})
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Top products + recent orders */}
      <section className="grid gap-6 xl:grid-cols-2">
        {topProducts.length > 0 ? (
          <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white">
            <div className="border-b border-zinc-200/80 px-5 py-4">
              <div className="text-[10px] font-medium uppercase tracking-[0.26em] text-zinc-400">
                {t("dashboard_top_products")}
              </div>
            </div>
            <div className="divide-y divide-zinc-100">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between gap-4 px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-zinc-400 w-4">{i + 1}</span>
                    <span className="text-sm text-zinc-900 truncate">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 text-sm text-zinc-500">
                    <span>{p.quantity} sold</span>
                    <span className="font-medium text-zinc-900">{formatCurrency(p.revenue, currency)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white">
          <div className="border-b border-zinc-200/80 px-5 py-4">
            <div className="text-[10px] font-medium uppercase tracking-[0.26em] text-zinc-400">
              {t("dashboard_recent_orders")}
            </div>
          </div>
          {recentOrders.length === 0 ? (
            <div className="px-5 py-6 text-sm text-zinc-500">{t("dashboard_no_orders")}</div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentOrders.map((order) => (
                <div key={order._id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-zinc-900 truncate">{order.customerName}</div>
                    <div className="mt-0.5 text-xs text-zinc-400">
                      {order.items?.length || 0} items · {order.orderStatus}
                    </div>
                  </div>
                  <div className="text-sm font-medium text-zinc-900 text-right">
                    {formatCurrency(order.total, currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
