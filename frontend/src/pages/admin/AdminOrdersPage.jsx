import { useEffect, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import Button from "../../components/ui/Button";
import SelectField from "../../components/ui/SelectField";
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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [savingOrderId, setSavingOrderId] = useState("");

  const loadOrdersData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getOrders({ page: 1, limit: 50 });
      setOrders(response?.data || []);
    } catch (error) {
      setErrorMessage(error?.message || "Orders could not be loaded.");
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
      setErrorMessage(error?.message || "Order could not be updated.");
    } finally {
      setSavingOrderId("");
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Order Operations"
        title="Orders"
        description="Review incoming orders and update operational and payment states."
      />

      {errorMessage ? (
        <SurfaceMessage
          tone="error"
          title="Orders unavailable"
          description={errorMessage}
        />
      ) : null}

      <section className="min-w-0 border border-zinc-200/80 bg-white">
        <div className="border-b border-zinc-200/80 px-4 py-4 sm:px-5">
          <div className="text-sm font-medium text-zinc-950">Order queue</div>
          <div className="mt-1 text-sm text-zinc-500">
            Review customers, items, and status updates in one place.
          </div>
        </div>

        {isLoading ? (
          <div className="px-4 py-6 sm:px-5">
            <SurfaceMessage
              title="Loading orders"
              description="Fetching order activity from the backend."
            />
          </div>
        ) : orders.length === 0 ? (
          <div className="px-4 py-6 sm:px-5">
            <SurfaceMessage
              title="No orders yet"
              description="Orders created from checkout will appear here."
            />
          </div>
        ) : (
          <div className="divide-y divide-zinc-200/80">
            {orders.map((order) => (
              <article key={order._id} className="px-4 py-5 sm:px-5">
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-base font-semibold tracking-[-0.03em] text-zinc-950">
                          {order.customerName}
                        </div>
                        <div className="mt-1 text-sm text-zinc-500">
                          {order.phone} · {order.address}
                        </div>
                      </div>

                      <div className="text-base font-semibold text-zinc-950">
                        {formatCurrency(order.total)}
                      </div>
                    </div>

                    <div className="mt-4 divide-y divide-zinc-200/80 border border-zinc-200/80">
                      {order.items?.map((item) => (
                        <div
                          key={`${order._id}-${item.product}-${item.name}`}
                          className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
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

                  <div className="space-y-4 border border-zinc-200/80 p-4">
                    <SelectField
                      label="Order status"
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
                          {status}
                        </option>
                      ))}
                    </SelectField>

                    <SelectField
                      label="Payment status"
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
                          {status}
                        </option>
                      ))}
                    </SelectField>

                    <Button
                      className="w-full"
                      disabled={savingOrderId === order._id}
                      onClick={() => handleSave(order)}
                    >
                      {savingOrderId === order._id ? "Saving..." : "Update Order"}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
