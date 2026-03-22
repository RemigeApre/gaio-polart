"use client";

import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  active: boolean;
}

const ROLES = [
  { value: "ADMIN", label: "Administrateur" },
  { value: "DIRECTION", label: "Direction" },
  { value: "VIEWER", label: "Consultation" },
];

const ROLE_LABELS: Record<string, string> = Object.fromEntries(ROLES.map((r) => [r.value, r.label]));
const ROLE_COLORS: Record<string, string> = { ADMIN: "text-or", DIRECTION: "text-green-400", VIEWER: "text-blanc/50" };

const emptyForm = { username: "", name: "", password: "", role: "DIRECTION" };

export function DashboardUsers({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (res.ok) setUsers(data.users);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (editingId) {
      const body: Record<string, string> = { name: form.name, username: form.username, role: form.role };
      if (form.password) body.password = form.password;

      const res = await fetch(`/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setSaving(false);
      if (!res.ok) { setError(data.error || "Erreur."); return; }
    } else {
      if (!form.password) { setError("Le mot de passe est requis."); setSaving(false); return; }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setSaving(false);
      if (!res.ok) { setError(data.error || "Erreur."); return; }
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    fetchUsers();
  };

  const startEdit = (user: User) => {
    setForm({ username: user.username, name: user.name, password: "", role: user.role });
    setEditingId(user.id);
    setShowForm(true);
    setError("");
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const toggleActive = async (user: User) => {
    await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 3000);
      return;
    }
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur.");
    }
    setConfirmDeleteId(null);
    fetchUsers();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50vw] italic font-light leading-none select-none pointer-events-none z-0 font-[family-name:var(--font-calligraphic)]"
        style={{ color: "var(--text-main)", opacity: 0.02 }} aria-hidden="true">GP</div>

      <div className="relative z-10">
        <div className="bg-noir border-b border-blanc/[0.06]">
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/dashboard" className="text-blanc/40 hover:text-blanc/70 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </a>
              <span className="text-[14px] text-blanc/90 font-light tracking-[0.2em] uppercase">Utilisateurs</span>
            </div>
            {!showForm && (
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); setError(""); }}
                className="px-4 py-1.5 rounded-lg bg-or text-noir-light text-[12px] font-bold hover:bg-or-light transition-colors"
              >
                + Ajouter
              </button>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-5 py-8">
          {error && !showForm && (
            <div className="text-[13px] text-center py-2 px-3 rounded-lg bg-red-500/[0.06] border border-red-500/15 text-red-400 font-medium mb-4">{error}</div>
          )}

          {/* Formulaire */}
          {showForm && (
            <form onSubmit={handleSubmit} className="card px-5 py-5 mb-6">
              <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--text-main)" }}>
                {editingId ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
              </h2>

              {error && (
                <div className="text-[13px] text-center py-2 px-3 rounded-lg bg-red-500/[0.06] border border-red-500/15 text-red-400 font-medium mb-4">{error}</div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Nom</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex : Paulo" required
                    className="w-full text-[14px] px-3 py-2.5 rounded-lg outline-none border transition-colors focus:border-or/50"
                    style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }} />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Identifiant</label>
                  <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Ex : paulo" required
                    className="w-full text-[14px] px-3 py-2.5 rounded-lg outline-none border transition-colors focus:border-or/50"
                    style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    Mot de passe {editingId && <span className="normal-case tracking-normal font-normal">(laisser vide pour ne pas changer)</span>}
                  </label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={editingId ? "Inchangé" : "Mot de passe"} required={!editingId}
                    className="w-full text-[14px] px-3 py-2.5 rounded-lg outline-none border transition-colors focus:border-or/50"
                    style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }} />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Rôle</label>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full text-[14px] px-3 py-2.5 rounded-lg outline-none border transition-colors focus:border-or/50"
                    style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }}>
                    {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-or text-noir-light text-[13px] font-bold disabled:opacity-50 transition-colors hover:bg-or-light">
                  {saving ? "Enregistrement..." : editingId ? "Enregistrer" : "Créer"}
                </button>
                <button type="button" onClick={cancelEdit}
                  className="px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors hover:bg-or/10" style={{ color: "var(--text-muted)" }}>
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* Liste */}
          {loading ? (
            <p className="text-center py-12 text-[14px]" style={{ color: "var(--text-muted)" }}>Chargement...</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => {
                const isSelf = u.id === currentUserId;
                return (
                  <div key={u.id} className="card px-5 py-4 flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: u.active ? "var(--color-or)" : "var(--border-main)", color: u.active ? "var(--color-noir)" : "var(--text-muted)" }}>
                      <span className="text-[15px] font-bold">{u.name.charAt(0).toUpperCase()}</span>
                    </div>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[14px] font-semibold ${!u.active ? "opacity-40 line-through" : ""}`} style={{ color: "var(--text-main)" }}>
                          {u.name}
                        </span>
                        {isSelf && (
                          <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-or/10 text-or font-semibold">Vous</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>@{u.username}</span>
                        <span className={`text-[10px] uppercase tracking-wider font-semibold ${ROLE_COLORS[u.role] || ""}`}>
                          {ROLE_LABELS[u.role] || u.role}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isSelf && (
                        <button onClick={() => toggleActive(u)}
                          className={`w-3 h-3 rounded-full shrink-0 transition-colors ${u.active ? "bg-green-500" : "bg-red-400/50"}`}
                          title={u.active ? "Désactiver" : "Activer"} />
                      )}
                      <button onClick={() => startEdit(u)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-or/10 transition-colors"
                        style={{ color: "var(--text-muted)" }} title="Modifier">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {!isSelf && (
                        <button onClick={() => handleDelete(u.id)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                            confirmDeleteId === u.id ? "bg-red-500/15 text-red-400" : "text-red-400/40 hover:text-red-400 hover:bg-red-500/10"
                          }`} title={confirmDeleteId === u.id ? "Confirmer" : "Supprimer"}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
