import { useEffect, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { upsertStoreConfig } from "../../services/api/store-config.service";

const paymentMethodOptions = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "cash_on_delivery", label: "Cash on delivery" },
  { value: "transfer", label: "Bank transfer" },
  { value: "online_payment", label: "Online payment" },
];

const createFormState = (config) => ({
  storeName: config.storeName || "",
  logoUrl: config.logoUrl || "",
  heroImage: config.heroImage || "",
  whatsappNumber: config.whatsappNumber || "",
  currency: config.currency || "USD",
  primaryColor: config.primaryColor || "#111111",
  secondaryColor: config.secondaryColor || "#f5f5f5",
  enableWhatsappCheckout: Boolean(config.enableWhatsappCheckout),
  enableOnlinePayment: Boolean(config.enableOnlinePayment),
  paymentMethods: config.paymentMethods || ["whatsapp", "cash_on_delivery"],
});

export default function AdminStoreConfigPage() {
  const { config, refreshConfig, isLoading } = useStoreConfig();
  const [formState, setFormState] = useState(createFormState(config));
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormState(createFormState(config));
  }, [config]);

  const handleFieldChange = (fieldName, value) => {
    setFormState((currentValue) => ({
      ...currentValue,
      [fieldName]: value,
    }));
  };

  const togglePaymentMethod = (paymentMethod) => {
    setFormState((currentValue) => {
      const isSelected = currentValue.paymentMethods.includes(paymentMethod);

      return {
        ...currentValue,
        paymentMethods: isSelected
          ? currentValue.paymentMethods.filter((method) => method !== paymentMethod)
          : [...currentValue.paymentMethods, paymentMethod],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await upsertStoreConfig(formState);
      await refreshConfig();
      setSuccessMessage("Store configuration updated successfully.");
    } catch (error) {
      setErrorMessage(error?.message || "Store configuration could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <AdminPageHeader
        eyebrow="Branding & Preferences"
        title="Store configuration"
        description="Centralize the storefront identity, payment methods, and key white-label settings."
      />

      {errorMessage ? (
        <SurfaceMessage
          tone="error"
          title="Configuration unavailable"
          description={errorMessage}
        />
      ) : null}

      <form
        className="space-y-6 rounded-[2rem] border border-zinc-200/80 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.04)] sm:p-8"
        onSubmit={handleSubmit}
      >
        {successMessage ? (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Store name"
            value={formState.storeName}
            onChange={(event) => handleFieldChange("storeName", event.target.value)}
          />
          <TextInput
            label="Currency"
            value={formState.currency}
            onChange={(event) => handleFieldChange("currency", event.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Logo URL"
            value={formState.logoUrl}
            onChange={(event) => handleFieldChange("logoUrl", event.target.value)}
          />
          <TextInput
            label="Hero image"
            value={formState.heroImage}
            onChange={(event) =>
              handleFieldChange("heroImage", event.target.value)
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput
            label="WhatsApp number"
            value={formState.whatsappNumber}
            onChange={(event) =>
              handleFieldChange("whatsappNumber", event.target.value)
            }
          />
          <TextInput
            label="Primary color"
            value={formState.primaryColor}
            onChange={(event) =>
              handleFieldChange("primaryColor", event.target.value)
            }
          />
          <TextInput
            label="Secondary color"
            value={formState.secondaryColor}
            onChange={(event) =>
              handleFieldChange("secondaryColor", event.target.value)
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex items-center gap-3 rounded-[1.5rem] border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={formState.enableWhatsappCheckout}
              onChange={(event) =>
                handleFieldChange("enableWhatsappCheckout", event.target.checked)
              }
            />
            Enable WhatsApp checkout
          </label>

          <label className="flex items-center gap-3 rounded-[1.5rem] border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={formState.enableOnlinePayment}
              onChange={(event) =>
                handleFieldChange("enableOnlinePayment", event.target.checked)
              }
            />
            Enable online payment
          </label>
        </div>

        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            Payment methods
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {paymentMethodOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 rounded-[1.5rem] border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700"
              >
                <input
                  type="checkbox"
                  checked={formState.paymentMethods.includes(option.value)}
                  onChange={() => togglePaymentMethod(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Saving..." : "Save Store Configuration"}
        </Button>
      </form>
    </div>
  );
}
