import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { registerCustomer } from "../../services/api/customers.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function AccountRegisterPage() {
  const { t } = useLanguage();
  const { isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  if (isAuthenticated) {
    navigate(ROUTE_PATHS.accountOrders, { replace: true });
    return null;
  }

  const handleChange = (field, value) => setFormState((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await registerCustomer(
        formState.name.trim(),
        formState.email.trim(),
        formState.password,
        formState.phone.trim(),
      );
      setVerificationSent(true);
    } catch (err) {
      setError(err?.message || t("account_register_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="flex min-h-[60vh] items-start justify-center py-4 sm:py-8">
        <div className="w-full max-w-sm space-y-5">
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 p-6 text-center">
            <h2 className="text-lg font-semibold tracking-[-0.03em] text-zinc-950">{t("verify_email_sent_title")}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{t("verify_email_sent_copy")}</p>
          </div>
          <p className="text-center text-sm text-zinc-500">
            <Link to={ROUTE_PATHS.accountLogin} className="font-medium text-zinc-950 hover:underline">
              {t("forgot_password_back_login")}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-start justify-center py-4 sm:py-8">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
            {t("account_register_eyebrow")}
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-3xl">
            {t("account_register_title")}
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {t("account_register_copy")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-[1.5rem] border border-zinc-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)]"
        >
          <TextInput
            label={t("account_name")}
            type="text"
            autoComplete="name"
            value={formState.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <TextInput
            label={t("account_email")}
            type="email"
            autoComplete="email"
            value={formState.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

          <TextInput
            label={t("account_password")}
            type="password"
            autoComplete="new-password"
            value={formState.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />

          <TextInput
            label={t("account_phone")}
            type="tel"
            autoComplete="tel"
            value={formState.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("account_creating") : t("account_create")}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-500">
          {t("account_has_account")}{" "}
          <Link
            to={ROUTE_PATHS.accountLogin}
            className="font-medium text-zinc-950 hover:underline"
          >
            {t("account_login_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
