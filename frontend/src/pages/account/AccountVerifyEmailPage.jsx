import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { verifyEmail } from "../../services/api/customers.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function AccountVerifyEmailPage() {
  const { t } = useLanguage();
  const { login } = useCustomerAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    verifyEmail(token)
      .then((res) => {
        const { token: jwtToken, customer } = res?.data || {};
        if (jwtToken && customer) login(jwtToken, customer);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="flex min-h-[60vh] items-start justify-center py-4 sm:py-8">
      <div className="w-full max-w-sm space-y-5">
        {status === "loading" ? (
          <div className="rounded-[1.5rem] border border-zinc-200/80 bg-white p-6 text-center">
            <div className="text-sm text-zinc-500">{t("verify_email_verifying")}</div>
          </div>
        ) : null}

        {status === "success" ? (
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 p-6 text-center">
            <div className="text-3xl">✓</div>
            <h2 className="mt-3 text-lg font-semibold tracking-[-0.03em] text-zinc-950">{t("verify_email_success_title")}</h2>
            <p className="mt-2 text-sm text-zinc-600">{t("verify_email_success_copy")}</p>
            <Link
              to={ROUTE_PATHS.accountOrders}
              className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--color-primary, #111)" }}
            >
              {t("verify_email_go_account")}
            </Link>
          </div>
        ) : null}

        {status === "error" || status === "invalid" ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50/70 p-6 text-center">
            <h2 className="text-lg font-semibold text-rose-900">{t("verify_email_error_title")}</h2>
            <p className="mt-2 text-sm text-rose-700">{t("verify_email_error_copy")}</p>
            <Link
              to={ROUTE_PATHS.accountLogin}
              className="mt-4 inline-flex text-sm font-medium underline text-rose-900"
            >
              {t("forgot_password_back_login")}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
