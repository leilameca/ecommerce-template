import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import LanguageSwitcher from "../../components/shared/LanguageSwitcher";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { ROUTE_PATHS } from "../../routes/route-paths";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, isLoading } = useAuth();
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(ROUTE_PATHS.adminDashboard, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await login(formState);
      navigate(location.state?.from || ROUTE_PATHS.adminDashboard, {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(error?.message || t("admin_login_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 sm:px-6">
      <div className="w-full max-w-md rounded-[2rem] border border-zinc-200/80 bg-white p-8 shadow-[0_28px_90px_rgba(15,23,42,0.06)] sm:p-10">
        <div className="mb-6 flex justify-end">
          <LanguageSwitcher compact />
        </div>

        <div className="text-[10px] font-medium uppercase tracking-[0.32em] text-zinc-400">
          {t("admin_access")}
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.05em] text-zinc-950">
          {t("admin_sign_in_title")}
        </h1>

        <p className="mt-4 text-sm leading-7 text-zinc-600">
          {t("admin_sign_in_copy")}
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <TextInput
            label={t("admin_email")}
            type="email"
            value={formState.email}
            onChange={(event) =>
              setFormState((currentValue) => ({
                ...currentValue,
                email: event.target.value,
              }))
            }
            placeholder="admin@store.com"
            required
          />

          <TextInput
            label={t("admin_password")}
            type="password"
            value={formState.password}
            onChange={(event) =>
              setFormState((currentValue) => ({
                ...currentValue,
                password: event.target.value,
              }))
            }
            placeholder="********"
            required
          />

          {errorMessage ? (
            <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? t("admin_signing_in") : t("admin_sign_in")}
          </Button>
        </form>
      </div>
    </div>
  );
}
