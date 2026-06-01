import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useLanguage } from "../../hooks/useLanguage";
import { requestPasswordReset } from "../../services/api/customers.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function AccountForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await requestPasswordReset(email.trim());
      setIsDone(true);
    } catch (err) {
      setErrorMessage(err?.message || t("forgot_password_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-5 sm:space-y-8">
      <div>
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">{t("forgot_password_eyebrow")}</span>
        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.05em] text-zinc-950">{t("forgot_password_title")}</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{t("forgot_password_copy")}</p>
      </div>

      {isDone ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 p-5 text-sm text-emerald-700">
          {t("forgot_password_sent")}
        </div>
      ) : (
        <form className="space-y-4 rounded-[1.5rem] border border-zinc-200/80 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-6" onSubmit={handleSubmit}>
          <TextInput
            label={t("forgot_password_email")}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />

          {errorMessage ? (
            <p className="text-xs text-rose-600">{errorMessage}</p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("forgot_password_sending") : t("forgot_password_submit")}
          </Button>
        </form>
      )}

      <p className="text-center text-sm text-zinc-500">
        <Link to={ROUTE_PATHS.accountLogin} className="font-medium text-zinc-950 hover:underline">
          {t("forgot_password_back_login")}
        </Link>
      </p>
    </div>
  );
}
