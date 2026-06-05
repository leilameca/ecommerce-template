import { useDeferredValue, useEffect, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import InvoiceModal from "../../components/shared/InvoiceModal";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import Button from "../../components/ui/Button";
import SelectField from "../../components/ui/SelectField";
import TextInput from "../../components/ui/TextInput";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { formatCurrency } from "../../lib/format-currency";
import { getOrders, updateOrderStatus } from "../../services/api/orders.service";

const orderStatusOptions = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatusOptions = ["pending", "paid", "failed"];

const formatStatusLabel = (status) =>
  String(status || "")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function AdminOrdersPage() {
  const { t } = useLanguage();
  const { config: storeConfig } = useStoreConfig();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [savingOrderId, setSavingOrderId] = useState("");
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const loadOrdersData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getOrders({ page: 1, limit: 50 });
      setOrders(response?.data || []);
    } catch (error) {
      setErrorMessage(error?.message || t("admin_order_update_error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrdersData();
  }, []);

  const handleLocalChange = (orderId, fieldName, value) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order._id === orderId ? { ...order, [fieldName]: value } : order
      )
    );
  };

  const handleSave = async (order) => {
    setSavingOrderId(order._id);
    setErrorMessage("");

    try {
      await updateOrderStatus(order._id, {
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
      });
      await loadOrdersData();
    } catch (error) {
      setErrorMessage(error?.message || t("admin_order_update_error"));
    } finally {
      setSavingOrderId("");
    }
  };

  const normalizedSearchQuery = deferredSearchQuery.trim().toLowerCase();
  const filteredOrders = normalizedSearchQuery
    ? orders.filter((order) => {
        const matchesOrderFields = [
          order.customerName,
          order.phone,
          order.address,
          order.notes,
          order.paymentMethod,
          order.paymentStatus,
          order.orderStatus,
        ].some((fieldValue) =>
          String(fieldValue || "").toLowerCase().includes(normalizedSearchQuery)
        );

        const matchesItems = (order.items || []).some((item) =>
          String(item.name || "").toLowerCase().includes(normalizedSearchQuery)
        );

        return matchesOrderFields || matchesItems;
      })
    : orders;

  const groupedOrders = orderStatusOptions
    .map((status) => ({
      status,
      orders: filteredOrders.filter((order) => order.orderStatus === status),
    }))
    .filter((group) => group.orders.length > 0);

  return (
    <div className="space-y-8">
      {invoiceOrder ? (
        <InvoiceModal
          order={invoiceOrder}
          storeConfig={storeConfig}
          onClose={() => setInvoiceOrder(null)}
        />
      ) : null}

      <AdminPageHeader
        eyebrow={t("admin_order_operations")}
        title={t("admin_orders_title")}
        description={t("admin_orders_copy")}
      />

      {errorMessage ? (
        <SurfaceMessage
          tone="error"
          title="Orders unavailable"
          description={errorMessage}
        />
      ) : null}

      <section className="min-w-0 overflow-hidden border border-zinc-200/80 bg-white">
        <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="text-sm font-medium text-zinc-950">
                {t("admin_order_queue")}
              </div>
              <div className="mt-1 text-sm text-zinc-500">
                {t("admin_order_queue_copy")}
              </div>
            </div>

            <div className="w-full max-w-md">
              <TextInput
                label={t("admin_search_orders")}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("admin_search_orders_placeholder")}
              />
            </div>
          </div>

          {orders.length > 0 ? (
            <div className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-zinc-400">
              {t("admin_orders_results_count", {
                visible: filteredOrders.length,
                total: orders.length,
              })}
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <div className="px-4 py-6 sm:px-5">
            <SurfaceMessage
              title={t("admin_loading_orders")}
              description={t("admin_loading_orders_copy")}
            />
          </div>
        ) : orders.length === 0 ? (
          <div className="px-4 py-6 sm:px-5">
            <SurfaceMessage
              title={t("admin_no_orders")}
              description={t("admin_no_orders_copy")}
            />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="px-4 py-6 sm:px-5">
            <SurfaceMessage
              title={t("admin_no_matching_orders")}
              description={t("admin_no_matching_orders_copy")}
            />
          </div>
        ) : (
          <div className="space-y-5 p-4 sm:p-5">
            {groupedOrders.map((group) => (
              <section
                key={group.status}
                className="space-y-4 rounded-[1.5rem] border border-zinc-200/80 bg-zinc-50/50 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">
                      {t("admin_order_status")}
                    </div>
                    <h2 className="mt-2 text-lg font-semibold tracking-[-0.03em] text-zinc-950">
                      {formatStatusLabel(group.status)}
                    </h2>
                  </div>

                  <div className="text-sm text-zinc-500">
                    {t("admin_status_group_count", { count: group.orders.length })}
                  </div>
                </div>

                <div className="space-y-4">
                  {group.orders.map((order) => (
                    <article
                      key={order._id}
                      className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 sm:p-5"
                    >
                      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_280px]">
                        <div className="min-w-0">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="text-base font-semibold tracking-[-0.03em] text-zinc-950">
                                {order.customerName}
                              </div>
                              <div className="mt-1 break-words text-sm text-zinc-500">
                                {order.phone} · {order.address}
                              </div>
                            </div>

                            <div className="text-left text-base font-semibold text-zinc-950 sm:text-right">
                              {formatCurrency(order.total)}
                            </div>
                          </div>

                          {order.notes ? (
                            <p className="mt-3 text-sm leading-6 text-zinc-500">
                              {order.notes}
                            </p>
                          ) : null}

                          <div className="mt-4 divide-y divide-zinc-200/80 border border-zinc-200/80">
                            {order.items?.map((item) => (
                              <div
                                key={`${order._id}-${item.product}-${item.name}`}
                                className="flex flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                              >
                                <span className="text-zinc-700">
                                  {item.name} x{item.quantity}
                                </span>
                                <span className="font-medium text-zinc-950">
                                  {formatCurrency(item.lineTotal)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-4 border border-zinc-200/80 p-4 sm:grid-cols-2 2xl:grid-cols-1">
                          <SelectField
                            label={t("admin_order_status")}
                            value={order.orderStatus}
                            onChange={(event) =>
                              handleLocalChange(
                                order._id,
                                "orderStatus",
                                event.target.value
                              )
                            }
                          >
                            {orderStatusOptions.map((status) => (
                              <option key={status} value={status}>
                                {formatStatusLabel(status)}
                              </option>
                            ))}
                          </SelectField>

                          <SelectField
                            label={t("admin_payment_status")}
                            value={order.paymentStatus}
                            onChange={(event) =>
                              handleLocalChange(
                                order._id,
                                "paymentStatus",
                                event.target.value
                              )
                            }
                          >
                            {paymentStatusOptions.map((status) => (
                              <option key={status} value={status}>
                                {formatStatusLabel(status)}
                              </option>
                            ))}
                          </SelectField>

                          <Button
                            className="w-full sm:col-span-2 2xl:col-span-1"
                            disabled={savingOrderId === order._id}
                            onClick={() => handleSave(order)}
                          >
                            {savingOrderId === order._id
                              ? t("admin_saving")
                              : t("admin_update_order")}
                          </Button>

                          <Button
                            variant="secondary"
                            className="w-full sm:col-span-2 2xl:col-span-1"
                            onClick={() => setInvoiceOrder(order)}
                          >
                            {t("admin_generate_invoice")}
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
