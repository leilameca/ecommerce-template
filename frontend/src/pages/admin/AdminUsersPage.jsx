import { useEffect, useState } from "react";

import AdminPageHeader from "../../components/shared/AdminPageHeader";
import SurfaceMessage from "../../components/shared/SurfaceMessage";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import SelectField from "../../components/ui/SelectField";
import { useAuth } from "../../hooks/useAuth";
import { getUsers, createUser, updateUser, deleteUser } from "../../services/api/users.service";

const ROLES = ["super-admin", "admin", "manager"];
const EMPTY_FORM = { name: "", email: "", password: "", role: "admin" };

function UserModal({ isOpen, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(initial || EMPTY_FORM);
    setError("");
  }, [initial, isOpen]);

  if (!isOpen) return null;
  const isEdit = Boolean(initial?.id);
  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err?.message || "Could not save user.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-950 mb-5">
          {isEdit ? "Edit User" : "New User"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextInput label="Name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
          <TextInput label="Email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required />
          <TextInput
            label={isEdit ? "New password (leave blank to keep current)" : "Password"}
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required={!isEdit}
            placeholder={isEdit ? "Leave blank to keep current" : "Min. 8 characters"}
          />
          <SelectField label="Role" value={form.role} onChange={(e) => handleChange("role", e.target.value)}>
            {ROLES.map((r) => (<option key={r} value={r}>{r}</option>))}
          </SelectField>
          {error ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-2.5 text-sm text-rose-700">{error}</div>
          ) : null}
          <div className="flex gap-3 pt-1">
            <Button type="submit" className="flex-1" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  if (currentUser?.role !== "super-admin") {
    return (
      <SurfaceMessage
        title="Access Restricted"
        description="Only super-admins can manage users."
      />
    );
  }

  const loadUsers = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await getUsers();
      setUsers(res?.data || []);
    } catch (err) {
      setErrorMessage(err?.message || "Could not load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleCreate = () => { setEditingUser(null); setModalOpen(true); };
  const handleEdit = (u) => {
    setEditingUser({ id: u._id, name: u.name, email: u.email, password: "", role: u.role });
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    if (editingUser?.id) {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (form.password) payload.password = form.password;
      await updateUser(editingUser.id, payload);
    } else {
      await createUser(form);
    }
    await loadUsers();
  };

  const handleDeactivate = async (u) => {
    if (!window.confirm(`Deactivate "${u.name}"? They will no longer be able to log in.`)) return;
    try {
      await deleteUser(u._id);
      await loadUsers();
    } catch (err) {
      setErrorMessage(err?.message || "Could not deactivate user.");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin"
        title="Users"
        description="Manage who has access to the admin panel."
        actions={<Button onClick={handleCreate}>Add User</Button>}
      />
      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>
      ) : null}
      {isLoading ? (
        <div className="py-12 text-center text-sm text-zinc-500">Loading users...</div>
      ) : users.length === 0 ? (
        <SurfaceMessage title="No users yet" description="Add your first admin user above." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-200/80">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50">
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Email</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Role</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-zinc-200/80 last:border-0 hover:bg-zinc-50/60">
                  <td className="px-4 py-3 font-medium text-zinc-950">{u.name}</td>
                  <td className="px-4 py-3 text-zinc-600">{u.email}</td>
                  <td className="px-4 py-3 text-zinc-600">{u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"
                    }`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleEdit(u)}>Edit</Button>
                      {u._id !== currentUser?.id && u.isActive ? (
                        <Button size="sm" variant="danger" onClick={() => handleDeactivate(u)}>Deactivate</Button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editingUser}
      />
    </div>
  );
}
