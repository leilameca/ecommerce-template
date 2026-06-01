import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { useLanguage } from "../../hooks/useLanguage";
import { updateCustomerProfile, changeCustomerPassword } from "../../services/api/customers.service";
import { ROUTE_PATHS } from "../../routes/route-paths";

function AccountNav({ t }) {
  return (
    <div className="flex gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1 text-sm font-medium w-fit">
      <Link to={ROUTE_PATHS.accountOrders} className="rounded-full px-4 py-1.5 text-zinc-500 transition-colors hover:text-zinc-950">
        {t("account_nav_orders")}
      </Link>
      <span className="rounded-full bg-white px-4 py-1.5 text-zinc-950 shadow-sm">
        {t("account_nav_profile")}
      </span>
    </div>
  );
}

export default function AccountProfilePage() {
  const { t } = useLanguage();
  const { customer, token, isAuthenticated, isLoading: authLoading, logout, updateCustomerData } = useCustomerAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { navigate(ROUTE_PATHS.accountLogin, { replace: true }); return; }
    setName(customer?.name || "");
    setPhone(customer?.phone || "");
  }, [authLoading, isAuthenticated, customer]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    setProfileSaving(true);
    try {
      const res = await updateCustomerProfile(token, { name: name.trim(), phone: phone.trim() });
      if (res?.data) updateCustomerData(res.data);
      setProfileMsg(t("account_profile_saved"));
    } catch (err) {
      setProfileError(err?.message || "Could not save changes.");
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg("");
    setPwError("");
    if (newPassword !== confirmPassword) { setPwError(t("account_password_mismatch")); return; }
    setPwSaving(true);
    try {
      await changeCustomerPassword(token, currentPassword, newPassword);
      setPwMsg(t("account_password_changed"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPwError(err?.message || "Could not change password.");
    } finally {
      setPwSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="space-y-4 py-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-[1.5rem] bg-zinc-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-zinc-400">
            {t("account_profile_eyebrow")}
          </span>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-3xl">
            {t("account_profile_title")}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{t("account_profile_copy")}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={logout}>{t("account_logout")}</Button>
      </section>

      <AccountNav t={t} />

      <form
        onSubmit={handleProfileSave}
        className="space-y-4 rounded-[1.5rem] border border-zinc-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-6"
      >
        <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">
          {t("account_profile_info_section")}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label={t("account_profile_name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextInput
            label={t("account_profile_phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {profileMsg ? (
          <p className="text-sm text-emerald-600">{profileMsg}</p>
        ) : null}
        {profileError ? (
          <p className="text-sm text-rose-600">{profileError}</p>
        ) : null}

        <Button type="submit" disabled={profileSaving} className="w-full sm:w-auto">
          {profileSaving ? t("account_profile_saving") : t("account_profile_save")}
        </Button>
      </form>

      <form
        onSubmit={handlePasswordChange}
        className="space-y-4 rounded-[1.5rem] border border-zinc-200/80 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.04)] sm:p-6"
      >
        <div className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">
          {t("account_password_title")}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <TextInput
            label={t("account_current_password")}
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <TextInput
            label={t("account_new_password")}
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <TextInput
            label={t("account_confirm_new_password")}
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {pwMsg ? (
          <p className="text-sm text-emerald-600">{pwMsg}</p>
        ) : null}
        {pwError ? (
          <p className="text-sm text-rose-600">{pwError}</p>
        ) : null}

        <Button type="submit" variant="secondary" disabled={pwSaving} className="w-full sm:w-auto">
          {pwSaving ? t("account_profile_saving") : t("account_change_password_btn")}
        </Button>
      </form>
    </div>
  );
}
