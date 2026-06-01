import { useEffect, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import Button from "../../components/ui/Button";
import TextareaField from "../../components/ui/TextareaField";
import TextInput from "../../components/ui/TextInput";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { upsertStoreConfig } from "../../services/api/store-config.service";
import { uploadProductImage } from "../../services/api/uploads.service";

const paymentMethodOptions = [
  { value: "whatsapp", label: "WhatsApp" },
  { value: "cash_on_delivery", label: "Cash on delivery" },
  { value: "transfer", label: "Bank transfer" },
  { value: "online_payment", label: "Online payment" },
];

const mediaFieldOptions = [
  {
    fieldName: "logoUrl",
    labelKey: "admin_store_logo",
    descriptionKey: "admin_store_logo_copy",
    previewClassName: "aspect-[3/2]",
  },
  {
    fieldName: "heroImage",
    labelKey: "admin_hero_image",
    descriptionKey: "admin_store_hero_image_copy",
    previewClassName: "aspect-[16/10]",
  },
];

const FONT_OPTIONS = [
  { value: "default", label: "Default (Inter)", preview: "Aa" },
  { value: "editorial", label: "Editorial (Playfair Display)", preview: "Aa" },
  { value: "minimal", label: "Minimal (DM Sans)", preview: "Aa" },
  { value: "classic", label: "Clásica (Lora)", preview: "Aa" },
  { value: "bold", label: "Bold (Montserrat)", preview: "Aa" },
];

const createFormState = (config) => ({
  storeName: config.storeName || "",
  heroTitle: config.heroTitle || "",
  heroCopy: config.heroCopy || "",
  logoUrl: config.logoUrl || "",
  heroImage: config.heroImage || "",
  whatsappNumber: config.whatsappNumber || "",
  currency: config.currency || "USD",
  primaryColor: config.primaryColor || "#111111",
  secondaryColor: config.secondaryColor || "#f5f5f5",
  backgroundColor: config.backgroundColor || "#ffffff",
  fontFamily: config.fontFamily || "default",
  editorialTitle: config.editorialTitle || "",
  editorialCopy: config.editorialCopy || "",
  editorialPoint1Title: config.editorialPoint1Title || "",
  editorialPoint1Copy: config.editorialPoint1Copy || "",
  editorialPoint2Title: config.editorialPoint2Title || "",
  editorialPoint2Copy: config.editorialPoint2Copy || "",
  enableWhatsappCheckout: Boolean(config.enableWhatsappCheckout),
  enableOnlinePayment: Boolean(config.enableOnlinePayment),
  paymentMethods: config.paymentMethods || ["whatsapp", "cash_on_delivery"],
  contactEmail: config.contactEmail || "",
  phone: config.phone || "",
  instagram: config.socialLinks?.instagram || "",
  facebook: config.socialLinks?.facebook || "",
  tiktok: config.socialLinks?.tiktok || "",
});

export default function AdminStoreConfigPage() {
  const { t } = useLanguage();
  const { config, refreshConfig, isLoading } = useStoreConfig();
  const [formState, setFormState] = useState(createFormState(config));
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState("");

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

  const handleMediaUpload = async (fieldName, file) => {
    if (!file) {
      return;
    }

    setUploadingField(fieldName);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await uploadProductImage(file);
      const uploadedImage = response?.data || {};

      if (!uploadedImage.url) {
        throw new Error(t("admin_product_image_upload_error"));
      }

      handleFieldChange(fieldName, uploadedImage.url);
      setSuccessMessage(t("admin_store_image_uploaded"));
    } catch (error) {
      setErrorMessage(error?.message || t("admin_product_image_upload_error"));
    } finally {
      setUploadingField("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await upsertStoreConfig({
        ...formState,
        socialLinks: {
          instagram: formState.instagram,
          facebook: formState.facebook,
          tiktok: formState.tiktok,
        },
      });
      await refreshConfig();
      setSuccessMessage(t("admin_store_configuration_updated"));
    } catch (error) {
      setErrorMessage(error?.message || t("admin_store_configuration_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <AdminPageHeader
        eyebrow={t("admin_branding_preferences")}
        title={t("admin_store_config_title")}
        description={t("admin_store_config_copy")}
      />

      {errorMessage ? (
        <SurfaceMessage
          tone="error"
          title={t("admin_configuration_unavailable")}
          description={errorMessage}
        />
      ) : null}

      <form
        className="space-y-6 rounded-[2rem] border border-zinc-200/80 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.04)] sm:p-6 lg:p-8"
        onSubmit={handleSubmit}
      >
        {successMessage ? (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label={t("admin_store_name")}
            value={formState.storeName}
            onChange={(event) => handleFieldChange("storeName", event.target.value)}
          />
          <TextInput
            label={t("admin_currency")}
            value={formState.currency}
            onChange={(event) => handleFieldChange("currency", event.target.value)}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <TextInput
            label={t("admin_hero_title")}
            value={formState.heroTitle}
            onChange={(event) => handleFieldChange("heroTitle", event.target.value)}
          />
          <TextareaField
            label={t("admin_hero_copy")}
            rows={3}
            value={formState.heroCopy}
            onChange={(event) => handleFieldChange("heroCopy", event.target.value)}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {mediaFieldOptions.map((option) => {
            const imageUrl = formState[option.fieldName];
            const isUploadingCurrentField = uploadingField === option.fieldName;

            return (
              <div
                key={option.fieldName}
                className="space-y-3 rounded-[1.5rem] border border-zinc-200 bg-zinc-50/70 p-4"
              >
                <div className="space-y-1">
                  <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
                    {t(option.labelKey)}
                  </div>
                  <p className="text-sm text-zinc-500">
                    {t(option.descriptionKey)}
                  </p>
                </div>

                <div className="overflow-hidden rounded-[1.25rem] border border-zinc-200 bg-white">
                  <div className={`${option.previewClassName} bg-zinc-100`}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={t(option.labelKey)}
                        className="h-full w-full object-contain p-4"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-400">
                        {t("admin_store_image_empty")}
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  disabled={Boolean(uploadingField)}
                  className="block w-full text-sm text-zinc-600 file:mr-4 file:rounded-md file:border file:border-zinc-300 file:bg-white file:px-3.5 file:py-2.5 file:text-sm file:font-medium file:text-zinc-900"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    handleMediaUpload(option.fieldName, file);
                    event.target.value = "";
                  }}
                />

                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs leading-5 text-zinc-500">
                    {isUploadingCurrentField
                      ? t("admin_image_uploading")
                      : t("admin_store_media_note")}
                  </p>

                  {imageUrl ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFieldChange(option.fieldName, "")}
                    >
                      {t("admin_image_remove")}
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-4">
          <TextInput
            label={t("admin_whatsapp_number")}
            value={formState.whatsappNumber}
            onChange={(event) =>
              handleFieldChange("whatsappNumber", event.target.value)
            }
          />
          <label className="flex min-w-0 flex-col gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
              {t("admin_primary_color")}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formState.primaryColor}
                onChange={(event) => handleFieldChange("primaryColor", event.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-1"
              />
              <input
                type="text"
                value={formState.primaryColor}
                onChange={(event) => handleFieldChange("primaryColor", event.target.value)}
                className="w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition-colors duration-200 focus:border-zinc-950"
              />
            </div>
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
              {t("admin_secondary_color")}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formState.secondaryColor}
                onChange={(event) => handleFieldChange("secondaryColor", event.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-1"
              />
              <input
                type="text"
                value={formState.secondaryColor}
                onChange={(event) => handleFieldChange("secondaryColor", event.target.value)}
                className="w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition-colors duration-200 focus:border-zinc-950"
              />
            </div>
          </label>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
              {t("admin_background_color")}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={formState.backgroundColor}
                onChange={(event) => handleFieldChange("backgroundColor", event.target.value)}
                className="h-10 w-12 cursor-pointer rounded border border-zinc-300 bg-white p-1"
              />
              <input
                type="text"
                value={formState.backgroundColor}
                onChange={(event) => handleFieldChange("backgroundColor", event.target.value)}
                className="w-full min-w-0 rounded-md border border-zinc-300 bg-white px-3.5 py-3 text-sm text-zinc-950 outline-none transition-colors duration-200 focus:border-zinc-950"
              />
            </div>
          </label>
        </div>

        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            {t("admin_font_family")}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {FONT_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={[
                  "flex cursor-pointer flex-col gap-2 rounded-[1.25rem] border p-4 transition-colors duration-200",
                  formState.fontFamily === option.value
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300",
                ].join(" ")}
              >
                <input
                  type="radio"
                  name="fontFamily"
                  value={option.value}
                  checked={formState.fontFamily === option.value}
                  onChange={() => handleFieldChange("fontFamily", option.value)}
                  className="sr-only"
                />
                <span className="text-2xl font-semibold leading-none">{option.preview}</span>
                <span className="text-xs leading-4">{option.label}</span>
              </label>
            ))}
          </div>
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
            {t("admin_enable_whatsapp_checkout")}
          </label>

          <label className="flex items-center gap-3 rounded-[1.5rem] border border-zinc-200 bg-zinc-50/70 px-4 py-3 text-sm text-zinc-700">
            <input
              type="checkbox"
              checked={formState.enableOnlinePayment}
              onChange={(event) =>
                handleFieldChange("enableOnlinePayment", event.target.checked)
              }
            />
            {t("admin_enable_online_payment")}
          </label>
        </div>

        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            {t("admin_payment_methods")}
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

        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            {t("admin_editorial_section")}
          </div>
          <div className="mt-3 grid gap-4 xl:grid-cols-2">
            <TextInput
              label={t("admin_editorial_title")}
              value={formState.editorialTitle}
              onChange={(event) => handleFieldChange("editorialTitle", event.target.value)}
            />
            <TextareaField
              label={t("admin_editorial_copy")}
              rows={3}
              value={formState.editorialCopy}
              onChange={(event) => handleFieldChange("editorialCopy", event.target.value)}
            />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <TextInput
                label={t("admin_editorial_point1_title")}
                value={formState.editorialPoint1Title}
                onChange={(event) => handleFieldChange("editorialPoint1Title", event.target.value)}
              />
              <TextareaField
                rows={2}
                label={t("admin_editorial_point1_copy")}
                value={formState.editorialPoint1Copy}
                onChange={(event) => handleFieldChange("editorialPoint1Copy", event.target.value)}
              />
            </div>
            <div className="space-y-3">
              <TextInput
                label={t("admin_editorial_point2_title")}
                value={formState.editorialPoint2Title}
                onChange={(event) => handleFieldChange("editorialPoint2Title", event.target.value)}
              />
              <TextareaField
                rows={2}
                label={t("admin_editorial_point2_copy")}
                value={formState.editorialPoint2Copy}
                onChange={(event) => handleFieldChange("editorialPoint2Copy", event.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            {t("admin_contact_info")}
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <TextInput
              label={t("admin_contact_email")}
              type="email"
              value={formState.contactEmail}
              onChange={(event) => handleFieldChange("contactEmail", event.target.value)}
            />
            <TextInput
              label={t("admin_contact_phone")}
              value={formState.phone}
              onChange={(event) => handleFieldChange("phone", event.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            {t("admin_social_links")}
          </div>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <TextInput
              label="Instagram"
              placeholder="instagram.com/tutienda"
              value={formState.instagram}
              onChange={(event) => handleFieldChange("instagram", event.target.value)}
            />
            <TextInput
              label="Facebook"
              placeholder="facebook.com/tutienda"
              value={formState.facebook}
              onChange={(event) => handleFieldChange("facebook", event.target.value)}
            />
            <TextInput
              label="TikTok"
              placeholder="tiktok.com/@tutienda"
              value={formState.tiktok}
              onChange={(event) => handleFieldChange("tiktok", event.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting || isLoading || Boolean(uploadingField)}
        >
          {isSubmitting ? t("admin_saving") : t("admin_save_store_configuration")}
        </Button>
      </form>
    </div>
  );
}
