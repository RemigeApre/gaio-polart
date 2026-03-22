"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface Market {
  id: string;
  name: string;
  city: string;
  dayOfWeek: string;
}

interface Absence {
  id: string;
  date: string;
  reason: string | null;
  market: Market;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

// ─── Calendrier de sélection ──────────────────────────────────────

const DAY_HEADERS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1));
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dateToStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function CalendarPicker({ selected, onSelect, onClear, existingAbsences }: {
  selected: string[];
  onSelect: (dates: string[]) => void;
  onClear: () => void;
  existingAbsences?: string[];
}) {
  const [viewDate, setViewDate] = useState(() => new Date());
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const startDay = getMonday(firstDay);

  const cells: Date[] = [];
  const cursor = new Date(startDay);
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  const monthLabel = viewDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  // Calculer la prévisualisation de la plage
  const previewRange = useMemo(() => {
    if (!rangeStart || !hoveredDate) return new Set<string>();
    const a = rangeStart < hoveredDate ? rangeStart : hoveredDate;
    const b = rangeStart < hoveredDate ? hoveredDate : rangeStart;
    const dates = new Set<string>();
    const cur = new Date(a + "T00:00:00");
    const end = new Date(b + "T00:00:00");
    while (cur <= end) {
      dates.add(dateToStr(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return dates;
  }, [rangeStart, hoveredDate]);

  const handleClick = (dateStr: string) => {
    if (rangeStart) {
      // Deuxième clic : sélectionner la plage
      const a = rangeStart < dateStr ? rangeStart : dateStr;
      const b = rangeStart < dateStr ? dateStr : rangeStart;
      const dates: string[] = [];
      const cur = new Date(a + "T00:00:00");
      const end = new Date(b + "T00:00:00");
      while (cur <= end) {
        const s = dateToStr(cur);
        if (!selected.includes(s)) dates.push(s);
        cur.setDate(cur.getDate() + 1);
      }
      onSelect([...selected, ...dates].sort());
      setRangeStart(null);
      setHoveredDate(null);
    } else {
      // Premier clic
      if (selected.includes(dateStr)) {
        // Désélectionner
        onSelect(selected.filter((d) => d !== dateStr));
      } else {
        // Début de plage
        setRangeStart(dateStr);
      }
    }
  };

  const selectedSet = new Set(selected);
  const existingSet = new Set(existingAbsences || []);

  return (
    <div>
      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="p-2 rounded-lg hover:bg-or/10 transition-colors" style={{ color: "var(--text-muted)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <span className="text-[14px] font-semibold capitalize" style={{ color: "var(--text-main)" }}>{monthLabel}</span>
        <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="p-2 rounded-lg hover:bg-or/10 transition-colors" style={{ color: "var(--text-muted)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>

      {/* Indication */}
      {rangeStart && (
        <div className="text-center mb-2">
          <span className="text-[11px] font-medium text-or">
            Cliquez sur le dernier jour de la période
          </span>
        </div>
      )}

      {/* En-tête jours */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-center py-1">
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>{d}</span>
          </div>
        ))}
      </div>

      {/* Cellules */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((date, i) => {
          const isThisMonth = date.getMonth() === month;
          const isToday = isSameDay(date, today);
          const isPast = date < today;
          const dateStr = dateToStr(date);
          const isSelected = selectedSet.has(dateStr);
          const isExisting = existingSet.has(dateStr);
          const isPreview = previewRange.has(dateStr);
          const isRangeStart = dateStr === rangeStart;

          return (
            <button
              key={i}
              type="button"
              onClick={() => !isPast && isThisMonth && handleClick(dateStr)}
              onMouseEnter={() => rangeStart && !isPast && setHoveredDate(dateStr)}
              disabled={isPast && !isSelected}
              className={`w-full aspect-square text-[13px] font-medium transition-all flex items-center justify-center relative ${
                !isThisMonth ? "opacity-15 rounded-lg" :
                isPast && !isSelected ? "opacity-20 cursor-not-allowed rounded-lg" :
                isRangeStart ? "bg-red-600 text-white font-bold rounded-lg ring-2 ring-red-400" :
                isSelected ? "bg-red-500 text-white font-bold rounded-sm" :
                isPreview ? "bg-red-500/20 rounded-sm" :
                isExisting ? "bg-orange-500/15 text-orange-500 font-semibold rounded-lg" :
                isToday ? "ring-2 ring-or ring-inset rounded-lg" :
                "hover:bg-or/10 rounded-lg"
              }`}
              style={!isSelected && !isPreview && !isRangeStart && !isExisting && isThisMonth && !isPast ? { color: "var(--text-main)" } : {}}
              title={isExisting ? "Absence déjà enregistrée" : undefined}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>
          {selected.length > 0
            ? `${selected.length} jour${selected.length > 1 ? "s" : ""} sélectionné${selected.length > 1 ? "s" : ""}`
            : "Cliquez sur un jour, ou deux pour une période"}
        </span>
        {selected.length > 0 && (
          <button type="button" onClick={() => { onClear(); setRangeStart(null); }}
            className="text-[11px] font-medium text-red-400/70 hover:text-red-400 transition-colors">
            Effacer
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────

export function DashboardAbsences() {
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [reason, setReason] = useState("");
  const [selectedMarketIds, setSelectedMarketIds] = useState<string[]>([]);
  const [allMarkets, setAllMarkets] = useState(true);

  const fetchData = useCallback(async () => {
    const [absRes, marketsRes] = await Promise.all([
      fetch("/api/absences"),
      fetch("/api/markets"),
    ]);
    const absData = await absRes.json();
    const marketsData = await marketsRes.json();
    if (absRes.ok) setAbsences(absData.absences);
    if (marketsRes.ok) setMarkets(marketsData.markets);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const marketsByCity = markets.reduce((acc, m) => {
    const existing = acc.find((g) => g.city === m.city);
    if (existing) {
      if (!existing.markets.find((em) => em.id === m.id)) existing.markets.push(m);
    } else {
      acc.push({ city: m.city, markets: [m] });
    }
    return acc;
  }, [] as { city: string; markets: Market[] }[]);

  const toggleMarket = (id: string) => {
    setSelectedMarketIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (selectedDates.length === 0) {
      setError("Sélectionnez au moins un jour sur le calendrier.");
      return;
    }

    setSaving(true);

    const body: { dates: string[]; reason?: string; marketIds?: string[] } = { dates: selectedDates };
    if (reason.trim()) body.reason = reason.trim();
    if (!allMarkets && selectedMarketIds.length > 0) body.marketIds = selectedMarketIds;

    const res = await fetch("/api/absences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error || "Erreur."); return; }

    setSuccess(`${data.created} absence${data.created > 1 ? "s" : ""} enregistrée${data.created > 1 ? "s" : ""}.`);
    setSelectedDates([]);
    setReason("");
    setSelectedMarketIds([]);
    setAllMarkets(true);
    fetchData();
  };

  const deleteAbsenceIds = async (ids: string[]) => {
    await fetch("/api/absences", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    fetchData();
  };

  // Grouper les absences en "blocs" de dates consécutives
  // Un bloc = des dates qui se suivent jour après jour
  const absenceBlocks = useMemo(() => {
    // D'abord grouper par date
    const byDate: Record<string, Absence[]> = {};
    for (const a of absences) {
      const key = a.date.split("T")[0];
      (byDate[key] = byDate[key] || []).push(a);
    }

    const sortedDates = Object.keys(byDate).sort();
    if (sortedDates.length === 0) return [];

    const blocks: { startDate: string; endDate: string; dates: string[]; absences: Absence[]; cities: string[]; reason: string | null }[] = [];
    let currentBlock = {
      startDate: sortedDates[0],
      endDate: sortedDates[0],
      dates: [sortedDates[0]],
      absences: [...byDate[sortedDates[0]]],
      reason: byDate[sortedDates[0]][0]?.reason || null,
    };

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1] + "T12:00:00");
      const currDate = new Date(sortedDates[i] + "T12:00:00");
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      const sameReason = (byDate[sortedDates[i]][0]?.reason || null) === currentBlock.reason;

      if (diffDays === 1 && sameReason) {
        // Consécutif et même motif → même bloc
        currentBlock.endDate = sortedDates[i];
        currentBlock.dates.push(sortedDates[i]);
        currentBlock.absences.push(...byDate[sortedDates[i]]);
      } else {
        // Nouveau bloc
        blocks.push({ ...currentBlock, cities: [...new Set(currentBlock.absences.map((a) => a.market.city))] });
        currentBlock = {
          startDate: sortedDates[i],
          endDate: sortedDates[i],
          dates: [sortedDates[i]],
          absences: [...byDate[sortedDates[i]]],
          reason: byDate[sortedDates[i]][0]?.reason || null,
        };
      }
    }
    blocks.push({ ...currentBlock, cities: [...new Set(currentBlock.absences.map((a) => a.market.city))] });

    return blocks;
  }, [absences]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[50vw] italic font-light leading-none select-none pointer-events-none z-0 font-[family-name:var(--font-calligraphic)]"
        style={{ color: "var(--text-main)", opacity: 0.02 }} aria-hidden="true">GP</div>

      <div className="relative z-10">
        <div className="bg-noir border-b border-blanc/[0.06]">
          <div className="max-w-5xl mx-auto px-5 py-3 flex items-center gap-3">
            <a href="/dashboard" className="text-blanc/40 hover:text-blanc/70 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </a>
            <span className="text-[14px] text-blanc/90 font-light tracking-[0.2em] uppercase">Absences</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-5 py-8">
          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="card px-5 py-5 mb-8">
            <h2 className="text-[15px] font-bold mb-4" style={{ color: "var(--text-main)" }}>
              Signaler une absence
            </h2>

            {error && (
              <div className="text-[13px] text-center py-2 px-3 rounded-lg bg-red-500/[0.06] border border-red-500/15 text-red-400 font-medium mb-4">{error}</div>
            )}
            {success && (
              <div className="text-[13px] text-center py-2 px-3 rounded-lg bg-green-500/[0.06] border border-green-500/15 text-green-500 font-medium mb-4">{success}</div>
            )}

            {/* Calendrier */}
            <div className="mb-4">
              <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                Sélectionnez les jours d&apos;absence
              </label>
              <div className="rounded-xl p-3" style={{ backgroundColor: "var(--bg-body)", border: "1px solid var(--border-main)" }}>
                <CalendarPicker
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  onClear={() => setSelectedDates([])}
                  existingAbsences={absences.map((a) => a.date.split("T")[0])}
                />
              </div>
            </div>

            {/* Marchés concernés */}
            <div className="mb-4">
              <label className="block text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
                Marchés concernés
              </label>
              <div className="flex items-center gap-2 mb-3">
                <button type="button" onClick={() => { setAllMarkets(true); setSelectedMarketIds([]); }}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${allMarkets ? "bg-or text-noir-light" : ""}`}
                  style={!allMarkets ? { color: "var(--text-muted)", border: "1px solid var(--border-main)" } : {}}>
                  Tous
                </button>
                <button type="button" onClick={() => setAllMarkets(false)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${!allMarkets ? "bg-or text-noir-light" : ""}`}
                  style={allMarkets ? { color: "var(--text-muted)", border: "1px solid var(--border-main)" } : {}}>
                  Choisir
                </button>
              </div>

              {!allMarkets && (
                <div className="flex flex-wrap gap-2">
                  {marketsByCity.map(({ city, markets: cityMarkets }) => {
                    const allCitySelected = cityMarkets.every((m) => selectedMarketIds.includes(m.id));
                    return (
                      <button key={city} type="button"
                        onClick={() => {
                          if (allCitySelected) {
                            setSelectedMarketIds((prev) => prev.filter((id) => !cityMarkets.some((m) => m.id === id)));
                          } else {
                            setSelectedMarketIds((prev) => [...new Set([...prev, ...cityMarkets.map((m) => m.id)])]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${allCitySelected ? "bg-or text-noir-light" : ""}`}
                        style={!allCitySelected ? { color: "var(--text-main)", border: "1px solid var(--border-main)" } : {}}>
                        {city}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Motif */}
            <div className="mb-5">
              <label className="block text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                Motif <span className="normal-case tracking-normal font-normal">(facultatif)</span>
              </label>
              <input type="text" value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Ex : Vacances, intempéries..."
                className="w-full text-[14px] px-3 py-2.5 rounded-lg outline-none border transition-colors focus:border-or/50"
                style={{ backgroundColor: "var(--bg-body)", borderColor: "var(--border-main)", color: "var(--text-main)" }} />
            </div>

            <button type="submit" disabled={saving || selectedDates.length === 0}
              className="px-5 py-2.5 rounded-lg bg-red-500 text-white text-[13px] font-bold disabled:opacity-40 transition-colors hover:bg-red-600">
              {saving ? "Enregistrement..." : `Signaler ${selectedDates.length > 0 ? selectedDates.length + " jour" + (selectedDates.length > 1 ? "s" : "") : "l'absence"}`}
            </button>
          </form>

          {/* Liste des absences */}
          <div>
            <h2 className="text-[12px] font-bold uppercase tracking-wider mb-3 px-1" style={{ color: "var(--text-muted)" }}>
              Absences à venir ({absences.length})
            </h2>

            {loading ? (
              <p className="text-center py-8 text-[14px]" style={{ color: "var(--text-muted)" }}>Chargement...</p>
            ) : absenceBlocks.length === 0 ? (
              <div className="card px-5 py-8 text-center">
                <p className="text-[14px] font-medium" style={{ color: "var(--text-muted)" }}>Aucune absence prévue.</p>
                <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Tous les marchés sont maintenus.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {absenceBlocks.map((block) => {
                  const isSingleDay = block.startDate === block.endDate;
                  const allIds = block.absences.map((a) => a.id);

                  return (
                    <AbsenceBlockCard
                      key={block.startDate + block.reason}
                      block={block}
                      isSingleDay={isSingleDay}
                      onDelete={() => deleteAbsenceIds(allIds)}
                      onDeleteSingle={(id) => deleteAbsenceIds([id])}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Carte d'un bloc d'absences ───────────────────────────────────

function AbsenceBlockCard({ block, isSingleDay, onDelete, onDeleteSingle }: {
  block: { startDate: string; endDate: string; dates: string[]; absences: Absence[]; cities: string[]; reason: string | null };
  isSingleDay: boolean;
  onDelete: () => void;
  onDeleteSingle: (id: string) => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete();
  };

  const formatShort = (iso: string) => {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div className="card px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Date(s) */}
          <p className="text-[14px] font-bold capitalize" style={{ color: "var(--text-main)" }}>
            {isSingleDay
              ? formatShort(block.startDate)
              : `${formatShort(block.startDate)} → ${formatShort(block.endDate)}`
            }
            {!isSingleDay && (
              <span className="text-[11px] font-medium ml-2" style={{ color: "var(--text-muted)" }}>
                ({block.dates.length} jours)
              </span>
            )}
          </p>

          {/* Villes + motif */}
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[12px] font-medium" style={{ color: "var(--text-main)" }}>
              {block.cities.join(", ")}
            </span>
            {block.reason && (
              <span className="text-[11px] italic" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
                {block.reason}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {!isSingleDay && (
            <button onClick={() => setExpanded(!expanded)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-or/10 transition-colors"
              style={{ color: "var(--text-muted)" }} title="Détails">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="transition-transform" style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          )}
          <button onClick={handleDelete}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              confirmDelete ? "bg-red-500/15 text-red-400" : "text-red-400/40 hover:text-red-400 hover:bg-red-500/10"
            }`}
            title={confirmDelete ? "Confirmer la suppression du bloc" : "Supprimer ce bloc"}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Détails dépliés : chaque absence individuelle */}
      {expanded && (
        <div className="mt-3 pt-3 space-y-1.5" style={{ borderTop: "1px solid var(--border-main)" }}>
          {block.absences.map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2">
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                <span className="capitalize">{formatShort(a.date.split("T")[0])}</span> — {a.market.city}
              </span>
              <button onClick={() => onDeleteSingle(a.id)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/[0.06] hover:bg-red-500/15 text-red-400/40 hover:text-red-400 transition-colors shrink-0">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
