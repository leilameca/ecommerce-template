import { useState } from "react";

import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import TextareaField from "../../components/ui/TextareaField";
import PageSEO from "../../components/shared/PageSEO";
import { useLanguage } from "../../hooks/useLanguage";
import { useStoreConfig } from "../../hooks/useStoreConfig";
import { submitContactForm } from "../../services/api/contact.service";

export default function ContactPage() {
  const { t } = useLanguage();
  const { config } = useStoreConfig();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const fullMessage = subject ? `Subject: ${subject}\n\n${message}` : message;
      await submitContactForm(name.trim(), email.trim(), fullMessage);
      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err?.message || t("contact_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasContactInfo = config.contactEmail || config.phone || config.whatsappNumber || config.address;

  return (
    <div className="space-y-6 sm:space-y-8">
      <PageSEO title={t("contact_title")} description={t("contact_copy")} />

      <section className="max-w-2xl">
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
          {t("contact_eyebrow")}
        </span>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-zinc-950 sm:text-4xl">
          {t("contact_title")}
        </h1>
        <p className="mt-2 text-sm leading-7 text-zinc-600 sm:text-base sm:leading-8">
          {t("contact_copy")}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-6">
          {success ? (
            <div className="py-6 text-center">
              <div className="text-3xl text-zinc-300">✓</div>
              <h2 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-zinc-950">
                {t("contact_success_title")}
              </h2>
              <p className="mt-2 text-sm leading-7 text-zinc-600">
                {t("contact_success_copy")}
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-5 text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
              >
                {t("contact_send_another")}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label={t("contact_name_label")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                />
                <TextInput
                  label={t("contact_email_label")}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@email.com"
                  required
                />
              </div>

              <TextInput
                label={t("contact_subject_label")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("contact_subject_placeholder")}
              />

              <TextareaField
                label={t("contact_message_label")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("contact_message_placeholder")}
                required
              />

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? t("contact_submitting") : t("contact_submit")}
              </Button>
            </form>
          )}
        </div>

        {hasContactInfo ? (
          <div className="rounded-[1.5rem] border border-zinc-200/80 bg-zinc-50/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">
              {t("contact_info_title")}
            </div>
            <div className="mt-4 space-y-3 text-sm text-zinc-600">
              {config.contactEmail ? (
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{t("contact_write_us")}</div>
                  <a href={`mailto:${config.contactEmail}`} className="mt-1 block text-zinc-950 hover:underline">
                    {config.contactEmail}
                  </a>
                </div>
              ) : null}
              {config.whatsappNumber ? (
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">WhatsApp</div>
                  <a href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="mt-1 block text-zinc-950 hover:underline">
                    {config.whatsappNumber}
                  </a>
                </div>
              ) : null}
              {config.phone && config.phone !== config.whatsappNumber ? (
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{t("contact_phone_label")}</div>
                  <div className="mt-1 text-zinc-950">{config.phone}</div>
                </div>
              ) : null}
              {config.address ? (
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{t("contact_address_label")}</div>
                  <div className="mt-1 text-zinc-950 leading-6">{config.address}</div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
