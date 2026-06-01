import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { resetPassword } from "../../services/api/customers.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function AccountResetPasswordPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useCustomerAuth();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!token) {
    return (
      <div className="mx-auto max-w-sm rounded-[1.5rem] border border-rose-200 bg-rose-50/70 p-6 text-rose-900">
        <h1 className="text-xl font-semibold">{t("reset_password_invalid_link")}</h1>
        <Link to={ROUTE_PATHS.accountForgotPassword} className="mt-4 inline-flex text-sm font-medium underline">
          {t("reset_password_request_new")}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setErrorMessage(t("reset_password_mismatch"));
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const res = await resetPassword(token, password);
      const { token: newToken, customer } = res?.data || {};
      if (newToken && customer) {
        login(newToken, customer);
      }
      navigate(ROUTE_PATHS.accountOrders);
    } catch (err) {
      setErrorMessage(err?.message || t("reset_password_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-5 sm:space-y-8">
      <div>
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">{t("reset_password_eyebrow")}</span>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-zinc-950">{t("reset_password_title")}</h1>
      </div>

      <form className="space-y-4 rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-6" onSubmit={handleSubmit}>
        <TextInput
          label={t("reset_password_new")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          required
        />
        <TextInput
          label={t("reset_password_confirm")}
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat password"
          required
        />

        {errorMessage ? (
          <p className="text-xs text-rose-600">{errorMessage}</p>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "..." : t("reset_password_submit")}
        </Button>
      </form>
    </div>
  );
}
