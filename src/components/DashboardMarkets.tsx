"use client";

import { useState, useEffect, useCallback } from "react";

const DAYS = [
  { value: "MONDAY", label: "Lun" },
  { value: "TUESDAY", label: "Mar" },
  { value: "WEDNESDAY", label: "Mer" },
  { value: "THURSDAY", label: "Jeu" },
  { value: "FRIDAY", label: "Ven" },
  { value: "SATURDAY", label: "Sam" },
  { value: "SUNDAY", label: "Dim" },
];

interface Market {
  id: string;
  name: string;
  city: string;
  address: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  active: boolean;
}

interface MarketGroup {
  city: string;
  name: string;
  address: string;
  startTime: string;
  endTime: string;
  days: string[];
  entries: Market[];
}

function groupMarkets(markets: Market[]): MarketGroup[] {
  const map = new Map<string, MarketGroup>();
  for (const m of markets) {
    const existing = map.get(m.city);
    if (existing) {
      existing.days.push(m.dayOfWeek);
      existing.entries.push(m);
    } else {
      map.set(m.city, {
        city: m.city, name: m.name, address: m.address,
        startTime: m.startTime, endTime: m.endTime,
        days: [m.dayOfWeek], entries: [m],
      });
    }
  }
  return [...map.values()];
}

const emptyForm = { name: "", city: "", address: "", startTime: "07:30", endTime: "13:00", days: [] as string[] };

export function DashboardMarkets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingCity, setEditingCity] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDeleteCity, setConfirmDeleteCity] = useState<string | null>(null);
  const [togglingDay, setTogglingDay] = useState<string | null>(null);

  const fetchMarkets = useCallback(async () => {
    const res = await fetch("/api/markets");
    const data = await res.json();
    if (res.ok) setMarkets(data.markets);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMarkets(); }, [fetchMarkets]);

  const groups = groupMarkets(markets);

  // Toggle un jour directement depuis la carte
  const toggleDayDirect = async (group: MarketGroup, day: string) => {
    setTogglingDay(`${group.city}-${day}`);
    const existing = group.entries.find((e) => e.dayOfWeek === day);

    if (existing) {
      // Supprimer ce jour
      await fetch(`/api/markets/${existing.id}`, { method: "DELETE" });
    } else {
      // Créer ce jour
      await fetch("/api/markets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: group.name, city: group.city, address: group.address,
          startTime: group.startTime, endTime: group.endTime, dayOfWeek: day,
        }),
      });
    }

    await fetchMarkets();
    setTogglingDay(null);
  };

  // Formulaire : créer un nouveau marché ou modifier nom/adresse/horaires
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    if (editingCity) {
      // Modifier : mettre à jour toutes les entrées de cette ville
      const group = groups.find((g) => g.city === editingCity);
      if (group) {
        for (const entry of group.entries) {
          await fetch(`/api/markets/${entry.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: form.name, city: form.city, address: form.address, startTime: form.startTime, endTime: form.endTime }),
          });
        }
      }
    } else {
      // Créer : il faut au moins cocher un jour
      if (form.days.length === 0) {
        setError("Sélectionnez au moins un jour.");
        setSaving(false);
        return;
      }
      for (const day of form.days) {
        const res = await fetch("/api/markets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, city: form.city, address: form.address, startTime: form.startTime, endTime: form.endTime, dayOfWeek: day }),
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Erreur.");
          setSaving(false);
          return;
        }
      }
    }

    setSaving(false);
    setForm(emptyForm);
    setEditingCity(null);
    setShowForm(false);
    fetchMarkets();
  };

  const startEdit = (group: MarketGroup) => {
    setForm({ name: group.name, city: group.city, address: group.address, startTime: group.startTime, endTime: group.endTime, days: [] });
    setEditingCity(group.city);
    setShowForm(true);
    setError("");
  };

  const cancelEdit = () => {
    setForm(emptyForm);
    setEditingCity(null);
    setShowForm(false);
    setError("");
  };

  const handleDeleteGroup = async (group: MarketGroup) => {
    if (confirmDeleteCity !== group.city) {
      setConfirmDeleteCity(group.city);
      setTimeout(() => setConfirmDeleteCity(null), 3000);
      return;
    }
    for (const entry of group.entries) {
      await fetch(`/api/markets/${entry.id}`, { method: "DELETE" });
    }
    setConfirmDeleteCity(null);
    fetchMarkets();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50vw] italic font-light leading-none select-none pointer-events-none z-0 font-[family-name:var(--font-calligraphic)]"
        style={{ color: "var(--text-main)", opacity: 0.02 }} aria-hidden="true">GP</div>

      <div className="relative z-10">
        {/* Top bar */}
        <div className="bg-noir border-b border-blanc/[0.06]">
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/dashboard" className="text-blanc/40 hover:text-blanc/70 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </a>
              <span className="text-[14px] text-blanc/90 font-light tracking-[0.2em] uppercase">Marchés</span>
            </div>
            {!showForm && (
              <button
                onClick={() => { setShowForm(true); setEditingCity(null); setForm(emptyForm); setError(""); }}
                className="px-4 py-1.5 rounded-lg bg-or text-noir-light text-[12px] font-bold hover:bg-or-light transition-colors"
              >
                + Ajouter un marché
              </button>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-5 py-8">
          {/* Formulaire */}
          {showForm && (
            <form onSubmit={handleSubmit} className="card px-5 py-5 mb-6">
              <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--text-main)" }}>
                {editingCity ? `Modifier : ${editingCity}` : "Nouveau marché"}
              </h2>

              {error && (
                <div className="text-[13px] text-center py-2 px-3 rounded-lg bg-red-500/[0.06] border border-red-500/15 text-red-400 font-medium mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <InputField label="Nom du marché" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ex : Marché de Gagny" required />
                <InputField label="Ville" value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="Ex : Gagny" required />
              </div>

              <div className="mb-4">
                <InputField label="Adresse" value={form.address} onChange={(v) => setForm({ ...form, address: v })} placeholder="Ex : Gagny, Seine-Saint-Denis" required />
              </div>

              {/* Jours : seulement pour la création */}
              {!editingCity && (
                <div className="mb-4">
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                    Jours de présence
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((d) => {
                      const selected = form.days.includes(d.value);
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, days: selected ? f.days.filter((x) => x !== d.value) : [...f.days, d.value] }))}
                          className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${selected ? "bg-or text-noir-light" : "hover:bg-or/10"}`}
                          style={!selected ? { color: "var(--text-muted)", border: "1px solid var(--border-main)" } : {}}
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Ouverture</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required
                    className="w-full text-[14px] px-3 py-2.5 rounded-lg outline-none border transition-colors focus:border-or/50"
                    style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }} />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Fermeture</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required
                    className="w-full text-[14px] px-3 py-2.5 rounded-lg outline-none border transition-colors focus:border-or/50"
                    style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-or text-noir-light text-[13px] font-bold disabled:opacity-50 transition-colors hover:bg-or-light">
                  {saving ? "Enregistrement..." : editingCity ? "Enregistrer" : "Créer"}
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
          ) : groups.length === 0 && !showForm ? (
            <p className="text-center py-12 text-[14px]" style={{ color: "var(--text-muted)" }}>Aucun marché enregistré.</p>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => (
                <div key={group.city} className="card px-5 py-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[16px] font-bold" style={{ color: "var(--text-main)" }}>{group.city}</h3>
                      <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {group.address} · {group.startTime} - {group.endTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => startEdit(group)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-or/10 transition-colors"
                        style={{ color: "var(--text-muted)" }} title="Modifier nom, adresse, horaires">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteGroup(group)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                          confirmDeleteCity === group.city ? "bg-red-500/15 text-red-400" : "text-red-400/40 hover:text-red-400 hover:bg-red-500/10"
                        }`} title={confirmDeleteCity === group.city ? "Confirmer" : "Supprimer le marché"}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Jours : cliquables directement */}
                  <div className="flex flex-wrap gap-1.5">
                    {DAYS.map((d) => {
                      const active = group.days.includes(d.value);
                      const isToggling = togglingDay === `${group.city}-${d.value}`;
                      return (
                        <button
                          key={d.value}
                          onClick={() => toggleDayDirect(group, d.value)}
                          disabled={isToggling}
                          className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                            isToggling ? "opacity-50" : active ? "hover:opacity-80" : "hover:bg-or/10"
                          }`}
                          style={active
                            ? { backgroundColor: "var(--color-or)", color: "var(--color-noir)" }
                            : { color: "var(--text-muted)", border: "1px solid var(--border-main)" }
                          }
                        >
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full text-[14px] px-3 py-2.5 rounded-lg outline-none border transition-colors focus:border-or/50"
        style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }} />
    </div>
  );
}
