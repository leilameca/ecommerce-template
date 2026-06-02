import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { resendVerification } from "../../services/api/customers.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function AccountLoginPage() {
  const { t } = useLanguage();
  const { login, isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notVerified, setNotVerified] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  if (isAuthenticated) {
    navigate(ROUTE_PATHS.accountOrders, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotVerified(false);
    setResendDone(false);
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(ROUTE_PATHS.accountOrders);
    } catch (err) {
      if (err?.message === "EMAIL_NOT_VERIFIED") {
        setNotVerified(true);
      } else {
        setError(err?.message || t("account_login_failed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification(email.trim());
      setResendDone(true);
    } catch {}
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

          {notVerified ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-sm text-amber-800">
              {t("verify_email_required")}
              {" "}
              {resendDone ? (
                <span className="font-medium">{t("verify_email_resent")}</span>
              ) : (
                <button type="button" onClick={handleResend} className="font-medium underline">
                  {t("verify_email_resend")}
                </button>
              )}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("account_signing_in") : t("account_sign_in")}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-500">
          <Link to={ROUTE_PATHS.accountForgotPassword} className="font-medium text-zinc-950 hover:underline">
            {t("account_forgot_password")}
          </Link>
        </p>

        <p className="mt-3 text-center text-sm text-zinc-500">
          {t("account_no_account")}{" "}
          <Link to={ROUTE_PATHS.accountRegister} className="font-medium text-zinc-950 hover:underline">
            {t("account_register_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
