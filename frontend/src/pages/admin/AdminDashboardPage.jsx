import { useEffect, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import StatCard from "../../components/shared/StatCard";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { formatCurrency } from "../../lib/format-currency";
import { getCategories } from "../../services/api/categories.service";
import { getOrders } from "../../services/api/orders.service";
import { getProducts } from "../../services/api/products.service";

export default function AdminDashboardPage() {
  const { config } = useStoreConfig();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [productsResponse, categoriesResponse, ordersResponse] =
          await Promise.all([
            getProducts({ page: 1, limit: 6 }),
            getCategories(),
            getOrders({ page: 1, limit: 6 }),
          ]);

        if (!isMounted) {
          return;
        }

        setStats({
          products: productsResponse?.pagination?.totalItems || 0,
          categories: categoriesResponse?.data?.length || 0,
          orders: ordersResponse?.pagination?.totalItems || 0,
        });
        setRecentOrders(ordersResponse?.data || []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(error?.message || "Dashboard data could not be loaded.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={t("dashboard_eyebrow")}
        title={t("dashboard_title")}
        description={t("dashboard_copy")}
      />

      {errorMessage ? (
        <SurfaceMessage
          tone="error"
          title="Dashboard unavailable"
          description={errorMessage}
        />
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
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
      </section>

      <section className="border border-zinc-200/80 bg-white">
        <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5">
          <div className="text-[10px] font-medium uppercase tracking-[0.26em] text-zinc-400">
            {t("dashboard_recent_orders")}
          </div>
          <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-zinc-950">
            {t("dashboard_latest_activity")}
          </h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-4 py-6 text-sm text-zinc-500 sm:px-5">
            {t("dashboard_no_orders")}
          </div>
        ) : (
          <div className="divide-y divide-zinc-200/80">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-5 2xl:grid-cols-[minmax(0,1fr)_180px_140px]"
              >
                <div className="min-w-0">
                  <div className="font-medium text-zinc-950">{order.customerName}</div>
                  <div className="mt-1 text-sm text-zinc-500">
                    {order.items?.length || 0} items · {order.orderStatus}
                  </div>
                </div>

                <div className="break-words text-sm text-zinc-500">{order.phone}</div>

                <div className="text-sm font-medium text-zinc-950 sm:text-right 2xl:text-left">
                  {formatCurrency(order.total, config.currency || "USD")}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
