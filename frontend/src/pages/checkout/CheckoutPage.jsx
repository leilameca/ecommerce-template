import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";
import SelectField from "../../components/ui/SelectField";
import TextInput from "../../components/ui/TextInput";
import TextareaField from "../../components/ui/TextareaField";
import { useCart } from "../../hooks/useCart";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { buildWhatsappCheckoutUrl } from "../../lib/build-whatsapp-url";
import { formatCurrency } from "../../lib/format-currency";
import { createOrder } from "../../services/api/orders.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

const paymentMethodLabels = {
  whatsapp: "WhatsApp",
  cash_on_delivery: "Cash on delivery",
  transfer: "Bank transfer",
  online_payment: "Online payment",
};

function EmptyCheckoutState() {
  return (
    <div className="rounded-[2rem] border border-zinc-200/80 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-10">
      <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
        Checkout
      </div>

      <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
        Add products before checkout.
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
        Your order flow is ready, but the cart needs at least one product before
        an order can be created.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to={ROUTE_PATHS.catalog}>
          <Button size="lg">Go to Catalog</Button>
        </Link>

        <Link to={ROUTE_PATHS.cart}>
          <Button variant="secondary" size="lg">
            View Cart
          </Button>
        </Link>
      </div>
    </div>
  );
}

function SuccessState({ orderId, whatsappUrl, paymentMethod }) {
  return (
    <div className="space-y-6 rounded-[2rem] border border-zinc-200/80 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-10">
      <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
        Order Confirmed
      </div>

      <h1 className="text-3xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
        Your order has been created successfully.
      </h1>

      <p className="text-sm leading-7 text-zinc-600 sm:text-base">
        Order reference: <span className="font-medium text-zinc-950">{orderId}</span>
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to={ROUTE_PATHS.catalog}>
          <Button size="lg">Continue Shopping</Button>
        </Link>

        {paymentMethod === "whatsapp" && whatsappUrl ? (
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <Button variant="secondary" size="lg">
              Open WhatsApp Confirmation
            </Button>
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart, isEmpty } = useCart();
  const { config } = useStoreConfig();
  const currency = config.currency || "USD";
  const availablePaymentMethods = useMemo(() => {
    return config.paymentMethods?.length
      ? config.paymentMethods
      : ["whatsapp", "cash_on_delivery"];
  }, [config.paymentMethods]);

  const [formState, setFormState] = useState({
    customerName: "",
    phone: "",
    address: "",
    notes: "",
    shipping: "0",
    paymentMethod: availablePaymentMethods[0] || "whatsapp",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [whatsappUrl, setWhatsappUrl] = useState("");

  useEffect(() => {
    if (!availablePaymentMethods.includes(formState.paymentMethod)) {
      setFormState((currentValue) => ({
        ...currentValue,
        paymentMethod: availablePaymentMethods[0] || "whatsapp",
      }));
    }
  }, [availablePaymentMethods, formState.paymentMethod]);

  if (isEmpty && !createdOrder) {
    return <EmptyCheckoutState />;
  }

  const shipping = Number(formState.shipping || 0);
  const total = subtotal + shipping;

  const handleChange = (fieldName, value) => {
    setFormState((currentValue) => ({
      ...currentValue,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await createOrder({
        customerName: formState.customerName,
        phone: formState.phone,
        address: formState.address,
        notes: formState.notes,
        shipping,
        paymentMethod: formState.paymentMethod,
        items: items.map((item) => ({
          product: item.productId,
          quantity: item.quantity,
        })),
      });

      const created = response?.data || null;
      setCreatedOrder(created);

      const whatsappMessage = [
        `Hello, I just created order ${created?._id || ""}.`,
        `Customer: ${formState.customerName}`,
        `Items:`,
        ...items.map(
          (item) => `- ${item.name} x${item.quantity} (${formatCurrency(item.price, currency)})`
        ),
        `Total: ${formatCurrency(total, currency)}`,
      ].join("\n");

      const nextWhatsappUrl =
        formState.paymentMethod === "whatsapp"
          ? buildWhatsappCheckoutUrl({
              phoneNumber: config.whatsappNumber,
              message: whatsappMessage,
            })
          : "";

      setWhatsappUrl(nextWhatsappUrl);
      clearCart();

      if (nextWhatsappUrl && typeof window !== "undefined") {
        window.open(nextWhatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      setErrorMessage(error?.message || "Order could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (createdOrder) {
    return (
      <SuccessState
        orderId={createdOrder._id}
        whatsappUrl={whatsappUrl}
        paymentMethod={formState.paymentMethod}
      />
    );
  }

  return (
    <div className="space-y-10 sm:space-y-12">
      <section className="max-w-3xl">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
          Checkout
        </span>

        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.06em] text-zinc-950 sm:text-5xl">
          Complete the order with a clean, reusable purchase flow.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-600">
          This form creates a real order in the backend and can redirect to
          WhatsApp when the store configuration enables that flow.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form
          className="space-y-6 rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-8"
          onSubmit={handleSubmit}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Customer name"
              value={formState.customerName}
              onChange={(event) => handleChange("customerName", event.target.value)}
              placeholder="Jane Doe"
              required
            />

            <TextInput
              label="Phone"
              value={formState.phone}
              onChange={(event) => handleChange("phone", event.target.value)}
              placeholder="+1 555 123 4567"
              required
            />
          </div>

          <TextInput
            label="Address"
            value={formState.address}
            onChange={(event) => handleChange("address", event.target.value)}
            placeholder="Street, city, region"
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Shipping"
              type="number"
              min="0"
              step="0.01"
              value={formState.shipping}
              onChange={(event) => handleChange("shipping", event.target.value)}
              placeholder="0"
            />

            <SelectField
              label="Payment method"
              value={formState.paymentMethod}
              onChange={(event) => handleChange("paymentMethod", event.target.value)}
            >
              {availablePaymentMethods.map((method) => (
                <option key={method} value={method}>
                  {paymentMethodLabels[method] || method}
                </option>
              ))}
            </SelectField>
          </div>

          <TextareaField
            label="Notes"
            value={formState.notes}
            onChange={(event) => handleChange("notes", event.target.value)}
            placeholder="Delivery details or special instructions"
          />

          {errorMessage ? (
            <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </Button>
        </form>

        <aside className="rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)] sm:p-8">
          <div className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
            Order Summary
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-start justify-between gap-4 border-b border-zinc-200/80 pb-4 text-sm"
              >
                <div>
                  <div className="font-medium text-zinc-950">{item.name}</div>
                  <div className="mt-1 text-zinc-500">
                    {item.quantity} x {formatCurrency(item.price, currency)}
                  </div>
                </div>

                <div className="font-medium text-zinc-950">
                  {formatCurrency(item.price * item.quantity, currency)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between text-zinc-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, currency)}</span>
            </div>

            <div className="flex items-center justify-between text-zinc-500">
              <span>Shipping</span>
              <span>{formatCurrency(shipping, currency)}</span>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-200/80 pt-4 text-base font-semibold text-zinc-950">
              <span>Total</span>
              <span>{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
