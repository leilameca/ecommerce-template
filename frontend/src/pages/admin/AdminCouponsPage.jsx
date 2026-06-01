import { useEffect, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import SelectField from "../../components/ui/SelectField";
import { useLanguage } from "../../hooks/useLanguage";
import {
  getCoupons,
  createCoupon,
  toggleCoupon,
  deleteCoupon,
} from "../../services/api/coupon.service";

const defaultForm = {
  code: "",
  type: "percentage",
  value: "",
  minOrderAmount: "",
  maxUses: "",
  expiresAt: "",
};

export default function AdminCouponsPage() {
  const { t } = useLanguage();
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await getCoupons();
      setCoupons(res?.data || []);
    } catch {
      setErrorMessage(t("admin_coupons_load_error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadCoupons(); }, []);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createCoupon({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : 0,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      });
      setSuccessMessage(t("admin_coupon_created"));
      setForm(defaultForm);
      setShowForm(false);
      loadCoupons();
    } catch (err) {
      setErrorMessage(err?.message || t("admin_coupon_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await toggleCoupon(id);
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: res?.data?.isActive } : c))
      );
    } catch {
      setErrorMessage(t("admin_coupon_error"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("admin_coupon_delete_confirm"))) return;
    try {
      await deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setErrorMessage(t("admin_coupon_error"));
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow={t("admin_coupons_eyebrow")}
        title={t("admin_coupons_title")}
        description={t("admin_coupons_copy")}
      />

      {errorMessage ? (
        <SurfaceMessage tone="error" title={t("admin_configuration_unavailable")} description={errorMessage} />
      ) : null}

      {successMessage ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-500">{coupons.length} {t("admin_coupons_count")}</div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? t("admin_cancel") : t("admin_coupon_new")}
        </Button>
      </div>

      {showForm ? (
        <form
          onSubmit={handleCreate}
          className="space-y-4 rounded-[2rem] border border-zinc-200/80 bg-white p-6"
        >
          <div className="text-sm font-medium text-zinc-950">{t("admin_coupon_new")}</div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <TextInput
              label={t("admin_coupon_code")}
              placeholder="SUMMER20"
              value={form.code}
              required
              onChange={(e) => handleFormChange("code", e.target.value.toUpperCase())}
            />
            <SelectField
              label={t("admin_coupon_type")}
              value={form.type}
              onChange={(e) => handleFormChange("type", e.target.value)}
              options={[
                { value: "percentage", label: t("admin_coupon_percentage") },
                { value: "fixed", label: t("admin_coupon_fixed") },
              ]}
            />
            <TextInput
              label={form.type === "percentage" ? t("admin_coupon_value_pct") : t("admin_coupon_value_fixed")}
              type="number"
              min="0"
              max={form.type === "percentage" ? "100" : undefined}
              required
              value={form.value}
              onChange={(e) => handleFormChange("value", e.target.value)}
            />
            <TextInput
              label={t("admin_coupon_min_order")}
              type="number"
              min="0"
              placeholder="0"
              value={form.minOrderAmount}
              onChange={(e) => handleFormChange("minOrderAmount", e.target.value)}
            />
            <TextInput
              label={t("admin_coupon_max_uses")}
              type="number"
              min="1"
              placeholder={t("admin_coupon_unlimited")}
              value={form.maxUses}
              onChange={(e) => handleFormChange("maxUses", e.target.value)}
            />
            <TextInput
              label={t("admin_coupon_expires")}
              type="date"
              value={form.expiresAt}
              onChange={(e) => handleFormChange("expiresAt", e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("admin_saving") : t("admin_coupon_create")}
          </Button>
        </form>
      ) : null}

      <div className="rounded-[2rem] border border-zinc-200/80 bg-white overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-zinc-500">{t("admin_loading")}</div>
        ) : coupons.length === 0 ? (
          <div className="p-6 text-sm text-zinc-500">{t("admin_coupons_empty")}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200/80 bg-zinc-50/70">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{t("admin_coupon_code")}</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{t("admin_coupon_discount")}</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{t("admin_coupon_uses")}</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{t("admin_coupon_expires")}</th>
                <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-400">{t("admin_status")}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-zinc-50/50">
                  <td className="px-5 py-3 font-mono font-medium text-zinc-950">{coupon.code}</td>
                  <td className="px-5 py-3 text-zinc-600">
                    {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                    {coupon.minOrderAmount > 0 ? ` (min $${coupon.minOrderAmount})` : ""}
                  </td>
                  <td className="px-5 py-3 text-zinc-500">
                    {coupon.usedCount}{coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                  </td>
                  <td className="px-5 py-3 text-zinc-500">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <span className={[
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      coupon.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-zinc-100 text-zinc-500",
                    ].join(" ")}>
                      {coupon.isActive ? t("admin_coupon_active") : t("admin_coupon_inactive")}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleToggle(coupon.id)}
                      >
                        {coupon.isActive ? t("admin_deactivate") : t("admin_activate")}
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        {t("admin_delete")}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
