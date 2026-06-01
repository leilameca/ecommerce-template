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

const extractI18n = (v, lang) => {
  if (!v) return "";
  if (typeof v === "object" && !Array.isArray(v)) return v[lang] || "";
  return String(v);
};

const createFormState = (config) => ({
  storeName: config.storeName || "",
  heroTitle_en: extractI18n(config.heroTitle, "en"),
  heroTitle_es: extractI18n(config.heroTitle, "es"),
  heroCopy_en: extractI18n(config.heroCopy, "en"),
  heroCopy_es: extractI18n(config.heroCopy, "es"),
  logoUrl: config.logoUrl || "",
  heroImage: config.heroImage || "",
  whatsappNumber: config.whatsappNumber || "",
  currency: config.currency || "USD",
  primaryColor: config.primaryColor || "#111111",
  secondaryColor: config.secondaryColor || "#f5f5f5",
  backgroundColor: config.backgroundColor || "#ffffff",
  fontFamily: config.fontFamily || "default",
  editorialTitle_en: extractI18n(config.editorialTitle, "en"),
  editorialTitle_es: extractI18n(config.editorialTitle, "es"),
  editorialCopy_en: extractI18n(config.editorialCopy, "en"),
  editorialCopy_es: extractI18n(config.editorialCopy, "es"),
  editorialPoint1Title_en: extractI18n(config.editorialPoint1Title, "en"),
  editorialPoint1Title_es: extractI18n(config.editorialPoint1Title, "es"),
  editorialPoint1Copy_en: extractI18n(config.editorialPoint1Copy, "en"),
  editorialPoint1Copy_es: extractI18n(config.editorialPoint1Copy, "es"),
  editorialPoint2Title_en: extractI18n(config.editorialPoint2Title, "en"),
  editorialPoint2Title_es: extractI18n(config.editorialPoint2Title, "es"),
  editorialPoint2Copy_en: extractI18n(config.editorialPoint2Copy, "en"),
  editorialPoint2Copy_es: extractI18n(config.editorialPoint2Copy, "es"),
  aboutTitle_en: extractI18n(config.aboutTitle, "en"),
  aboutTitle_es: extractI18n(config.aboutTitle, "es"),
  aboutCopy_en: extractI18n(config.aboutCopy, "en"),
  aboutCopy_es: extractI18n(config.aboutCopy, "es"),
  aboutMissionTitle_en: extractI18n(config.aboutMissionTitle, "en"),
  aboutMissionTitle_es: extractI18n(config.aboutMissionTitle, "es"),
  aboutMissionCopy_en: extractI18n(config.aboutMissionCopy, "en"),
  aboutMissionCopy_es: extractI18n(config.aboutMissionCopy, "es"),
  faqItems: Array.isArray(config.faqItems)
    ? config.faqItems.map((item) => ({
        question_en: extractI18n(item.question, "en"),
        question_es: extractI18n(item.question, "es"),
        answer_en: extractI18n(item.answer, "en"),
        answer_es: extractI18n(item.answer, "es"),
      }))
    : [],
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

  const addFaqItem = () => {
    setFormState((prev) => ({
      ...prev,
      faqItems: [...prev.faqItems, { question_en: "", question_es: "", answer_en: "", answer_es: "" }],
    }));
  };

  const removeFaqItem = (index) => {
    setFormState((prev) => ({
      ...prev,
      faqItems: prev.faqItems.filter((_, i) => i !== index),
    }));
  };

  const updateFaqItem = (index, field, value) => {
    setFormState((prev) => {
      const items = [...prev.faqItems];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, faqItems: items };
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
        storeName: formState.storeName,
        heroTitle: { en: formState.heroTitle_en, es: formState.heroTitle_es },
        heroCopy: { en: formState.heroCopy_en, es: formState.heroCopy_es },
        logoUrl: formState.logoUrl,
        heroImage: formState.heroImage,
        whatsappNumber: formState.whatsappNumber,
        currency: formState.currency,
        primaryColor: formState.primaryColor,
        secondaryColor: formState.secondaryColor,
        backgroundColor: formState.backgroundColor,
        fontFamily: formState.fontFamily,
        editorialTitle: { en: formState.editorialTitle_en, es: formState.editorialTitle_es },
        editorialCopy: { en: formState.editorialCopy_en, es: formState.editorialCopy_es },
        editorialPoint1Title: { en: formState.editorialPoint1Title_en, es: formState.editorialPoint1Title_es },
        editorialPoint1Copy: { en: formState.editorialPoint1Copy_en, es: formState.editorialPoint1Copy_es },
        editorialPoint2Title: { en: formState.editorialPoint2Title_en, es: formState.editorialPoint2Title_es },
        editorialPoint2Copy: { en: formState.editorialPoint2Copy_en, es: formState.editorialPoint2Copy_es },
        aboutTitle: { en: formState.aboutTitle_en, es: formState.aboutTitle_es },
        aboutCopy: { en: formState.aboutCopy_en, es: formState.aboutCopy_es },
        aboutMissionTitle: { en: formState.aboutMissionTitle_en, es: formState.aboutMissionTitle_es },
        aboutMissionCopy: { en: formState.aboutMissionCopy_en, es: formState.aboutMissionCopy_es },
        faqItems: formState.faqItems.map((item) => ({
          question: { en: item.question_en, es: item.question_es },
          answer: { en: item.answer_en, es: item.answer_es },
        })),
        enableWhatsappCheckout: formState.enableWhatsappCheckout,
        enableOnlinePayment: formState.enableOnlinePayment,
        paymentMethods: formState.paymentMethods,
        contactEmail: formState.contactEmail,
        phone: formState.phone,
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
          <div className="space-y-3">
            <TextInput
              label={`${t("admin_hero_title")} (EN)`}
              value={formState.heroTitle_en}
              onChange={(event) => handleFieldChange("heroTitle_en", event.target.value)}
              placeholder="Your headline in English"
            />
            <TextInput
              label={`${t("admin_hero_title")} (ES)`}
              value={formState.heroTitle_es}
              onChange={(event) => handleFieldChange("heroTitle_es", event.target.value)}
              placeholder="Tu titular en Español"
            />
          </div>
          <div className="space-y-3">
            <TextareaField
              label={`${t("admin_hero_copy")} (EN)`}
              rows={2}
              value={formState.heroCopy_en}
              onChange={(event) => handleFieldChange("heroCopy_en", event.target.value)}
              placeholder="Subtitle or description in English"
            />
            <TextareaField
              label={`${t("admin_hero_copy")} (ES)`}
              rows={2}
              value={formState.heroCopy_es}
              onChange={(event) => handleFieldChange("heroCopy_es", event.target.value)}
              placeholder="Subtítulo o descripción en Español"
            />
          </div>
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
            <div className="space-y-3">
              <TextInput
                label={`${t("admin_editorial_title")} (EN)`}
                value={formState.editorialTitle_en}
                onChange={(event) => handleFieldChange("editorialTitle_en", event.target.value)}
              />
              <TextInput
                label={`${t("admin_editorial_title")} (ES)`}
                value={formState.editorialTitle_es}
                onChange={(event) => handleFieldChange("editorialTitle_es", event.target.value)}
              />
            </div>
            <div className="space-y-3">
              <TextareaField
                label={`${t("admin_editorial_copy")} (EN)`}
                rows={2}
                value={formState.editorialCopy_en}
                onChange={(event) => handleFieldChange("editorialCopy_en", event.target.value)}
              />
              <TextareaField
                label={`${t("admin_editorial_copy")} (ES)`}
                rows={2}
                value={formState.editorialCopy_es}
                onChange={(event) => handleFieldChange("editorialCopy_es", event.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <TextInput
                label={`${t("admin_editorial_point1_title")} (EN)`}
                value={formState.editorialPoint1Title_en}
                onChange={(event) => handleFieldChange("editorialPoint1Title_en", event.target.value)}
              />
              <TextInput
                label={`${t("admin_editorial_point1_title")} (ES)`}
                value={formState.editorialPoint1Title_es}
                onChange={(event) => handleFieldChange("editorialPoint1Title_es", event.target.value)}
              />
              <TextareaField
                rows={2}
                label={`${t("admin_editorial_point1_copy")} (EN)`}
                value={formState.editorialPoint1Copy_en}
                onChange={(event) => handleFieldChange("editorialPoint1Copy_en", event.target.value)}
              />
              <TextareaField
                rows={2}
                label={`${t("admin_editorial_point1_copy")} (ES)`}
                value={formState.editorialPoint1Copy_es}
                onChange={(event) => handleFieldChange("editorialPoint1Copy_es", event.target.value)}
              />
            </div>
            <div className="space-y-3">
              <TextInput
                label={`${t("admin_editorial_point2_title")} (EN)`}
                value={formState.editorialPoint2Title_en}
                onChange={(event) => handleFieldChange("editorialPoint2Title_en", event.target.value)}
              />
              <TextInput
                label={`${t("admin_editorial_point2_title")} (ES)`}
                value={formState.editorialPoint2Title_es}
                onChange={(event) => handleFieldChange("editorialPoint2Title_es", event.target.value)}
              />
              <TextareaField
                rows={2}
                label={`${t("admin_editorial_point2_copy")} (EN)`}
                value={formState.editorialPoint2Copy_en}
                onChange={(event) => handleFieldChange("editorialPoint2Copy_en", event.target.value)}
              />
              <TextareaField
                rows={2}
                label={`${t("admin_editorial_point2_copy")} (ES)`}
                value={formState.editorialPoint2Copy_es}
                onChange={(event) => handleFieldChange("editorialPoint2Copy_es", event.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            {t("admin_about_section")}
          </div>
          <div className="mt-3 grid gap-4 xl:grid-cols-2">
            <div className="space-y-3">
              <TextInput
                label={`${t("admin_about_title")} (EN)`}
                value={formState.aboutTitle_en}
                onChange={(event) => handleFieldChange("aboutTitle_en", event.target.value)}
                placeholder="About Us"
              />
              <TextInput
                label={`${t("admin_about_title")} (ES)`}
                value={formState.aboutTitle_es}
                onChange={(event) => handleFieldChange("aboutTitle_es", event.target.value)}
                placeholder="Sobre Nosotros"
              />
            </div>
            <div className="space-y-3">
              <TextareaField
                label={`${t("admin_about_copy")} (EN)`}
                rows={2}
                value={formState.aboutCopy_en}
                onChange={(event) => handleFieldChange("aboutCopy_en", event.target.value)}
              />
              <TextareaField
                label={`${t("admin_about_copy")} (ES)`}
                rows={2}
                value={formState.aboutCopy_es}
                onChange={(event) => handleFieldChange("aboutCopy_es", event.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            <div className="space-y-3">
              <TextInput
                label={`${t("admin_about_mission_title")} (EN)`}
                value={formState.aboutMissionTitle_en}
                onChange={(event) => handleFieldChange("aboutMissionTitle_en", event.target.value)}
              />
              <TextInput
                label={`${t("admin_about_mission_title")} (ES)`}
                value={formState.aboutMissionTitle_es}
                onChange={(event) => handleFieldChange("aboutMissionTitle_es", event.target.value)}
              />
            </div>
            <div className="space-y-3">
              <TextareaField
                label={`${t("admin_about_mission_copy")} (EN)`}
                rows={2}
                value={formState.aboutMissionCopy_en}
                onChange={(event) => handleFieldChange("aboutMissionCopy_en", event.target.value)}
              />
              <TextareaField
                label={`${t("admin_about_mission_copy")} (ES)`}
                rows={2}
                value={formState.aboutMissionCopy_es}
                onChange={(event) => handleFieldChange("aboutMissionCopy_es", event.target.value)}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.24em] text-zinc-400">
            {t("admin_faq_section")}
          </div>
          <div className="mt-3 space-y-4">
            {formState.faqItems.length === 0 ? (
              <p className="text-sm text-zinc-400">{t("admin_faq_empty")}</p>
            ) : null}
            {formState.faqItems.map((item, index) => (
              <div key={index} className="rounded-[1.5rem] border border-zinc-200 bg-zinc-50/70 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-zinc-500">#{index + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFaqItem(index)}>
                    {t("admin_faq_remove")}
                  </Button>
                </div>
                <div className="grid gap-3 xl:grid-cols-2">
                  <TextInput
                    label={`${t("admin_faq_question")} (EN)`}
                    value={item.question_en}
                    onChange={(e) => updateFaqItem(index, "question_en", e.target.value)}
                    placeholder="Question in English"
                  />
                  <TextInput
                    label={`${t("admin_faq_question")} (ES)`}
                    value={item.question_es}
                    onChange={(e) => updateFaqItem(index, "question_es", e.target.value)}
                    placeholder="Pregunta en Español"
                  />
                </div>
                <div className="grid gap-3 xl:grid-cols-2">
                  <TextareaField
                    label={`${t("admin_faq_answer")} (EN)`}
                    rows={2}
                    value={item.answer_en}
                    onChange={(e) => updateFaqItem(index, "answer_en", e.target.value)}
                    placeholder="Answer in English"
                  />
                  <TextareaField
                    label={`${t("admin_faq_answer")} (ES)`}
                    rows={2}
                    value={item.answer_es}
                    onChange={(e) => updateFaqItem(index, "answer_es", e.target.value)}
                    placeholder="Respuesta en Español"
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" size="sm" onClick={addFaqItem}>
              + {t("admin_faq_add")}
            </Button>
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
