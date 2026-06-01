import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function AccountLoginPage() {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    navigate(ROUTE_PATHS.accountOrders, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(ROUTE_PATHS.accountOrders);
    } catch (err) {
      setError(err?.message || t("account_login_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-start justify-center py-4 sm:py-8">
      <div className="w-full max-w-sm">
        <div className="mb-6">
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
            {t("account_login_eyebrow")}
          </span>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-3xl">
            {t("account_login_title")}
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            {t("account_login_copy")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-[1.5rem] border border-zinc-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.05)]"
        >
          <TextInput
            label={t("account_email")}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextInput
            label={t("account_password")}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("account_signing_in") : t("account_sign_in")}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-zinc-500">
          {t("account_no_account")}{" "}
          <Link
            to={ROUTE_PATHS.accountRegister}
            className="font-medium text-zinc-950 hover:underline"
          >
            {t("account_register_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
