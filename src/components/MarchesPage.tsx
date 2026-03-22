"use client";

import { useState, useMemo } from "react";
import { MarketData, DayOfWeek, DAY_LABELS, DAY_LABELS_SHORT, DAY_ORDER, dateToDayOfWeek } from "@/lib/types";
import { CityBlason } from "./CityBlason";

function getMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

// Couleurs par ville
const CITY_COLORS: Record<string, { bg: string; text: string; border: string; cardBg: string }> = {
  Gagny:        { bg: "rgba(59, 130, 246, 0.12)", text: "#3b82f6", border: "rgba(59, 130, 246, 0.3)",  cardBg: "rgba(59, 130, 246, 0.06)" },
  Chelles:      { bg: "rgba(168, 85, 247, 0.12)", text: "#a855f7", border: "rgba(168, 85, 247, 0.3)",  cardBg: "rgba(168, 85, 247, 0.06)" },
  Meaux:        { bg: "rgba(34, 197, 94, 0.12)",  text: "#22c55e", border: "rgba(34, 197, 94, 0.3)",   cardBg: "rgba(34, 197, 94, 0.06)" },
  Villeparisis: { bg: "rgba(245, 158, 11, 0.12)", text: "#f59e0b", border: "rgba(245, 158, 11, 0.3)",  cardBg: "rgba(245, 158, 11, 0.06)" },
};

const DEFAULT_COLOR = { bg: "rgba(201, 168, 76, 0.12)", text: "#c9a84c", border: "rgba(201, 168, 76, 0.3)", cardBg: "rgba(201, 168, 76, 0.06)" };

function getCityColor(city: string) {
  return CITY_COLORS[city] || DEFAULT_COLOR;
}

// ─── Helpers dates ────────────────────────────────────────────────

const JS_DAY_TO_ENUM: DayOfWeek[] = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateFull(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function dateToString(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** Renvoie "Aujourd'hui", "Demain" ou null */
function getTimeBadge(days: DayOfWeek[], now: Date): string | null {
  const todayEnum = JS_DAY_TO_ENUM[now.getDay()];
  const hours = now.getHours();
  const tomorrowEnum = JS_DAY_TO_ENUM[(now.getDay() + 1) % 7];

  if (days.includes(todayEnum) && hours < 13) return "Aujourd'hui";
  if (days.includes(tomorrowEnum) && hours >= 13) return "Demain";
  if (days.includes(tomorrowEnum)) return "Demain";
  return null;
}

type ViewMode = "week" | "month";

interface MarchesPageProps {
  markets: MarketData[];
}

// ─── Composant principal ──────────────────────────────────────────

export function MarchesPage({ markets }: MarchesPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const [hiddenCities, setHiddenCities] = useState<Set<string>>(new Set());

  const now = useMemo(() => new Date(), []);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const citiesInfo = useMemo(() => {
    const cityMap = new Map<string, { days: DayOfWeek[]; address: string }>();
    for (const m of markets) {
      const existing = cityMap.get(m.city);
      if (existing) {
        if (!existing.days.includes(m.dayOfWeek)) {
          existing.days.push(m.dayOfWeek);
        }
      } else {
        cityMap.set(m.city, { days: [m.dayOfWeek], address: m.address });
      }
    }
    for (const info of cityMap.values()) {
      info.days.sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));
    }
    return cityMap;
  }, [markets]);

  const uniqueCities = [...citiesInfo.keys()];

  const filteredMarkets = useMemo(
    () => markets.filter((m) => !hiddenCities.has(m.city)),
    [markets, hiddenCities]
  );

  const toggleCity = (city: string) => {
    setHiddenCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) {
        next.delete(city);
      } else {
        // Ne pas tout cacher
        if (next.size < uniqueCities.length - 1) {
          next.add(city);
        }
      }
      return next;
    });
  };

  const viewToggle = (
    <div className="inline-flex items-center gap-1 p-0.5 rounded-lg" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-main)" }}>
      <button
        onClick={() => { setViewMode("week"); setMonthOffset(0); setWeekOffset(0); }}
        className={`px-3.5 py-1 text-[11px] font-medium rounded-md transition-colors ${viewMode === "week" ? "bg-or text-noir-light" : "hover:text-or"}`}
        style={viewMode !== "week" ? { color: "var(--text-muted)" } : {}}
      >
        Semaine
      </button>
      <button
        onClick={() => { setViewMode("month"); setWeekOffset(0); setMonthOffset(0); }}
        className={`px-3.5 py-1 text-[11px] font-medium rounded-md transition-colors ${viewMode === "month" ? "bg-or text-noir-light" : "hover:text-or"}`}
        style={viewMode !== "month" ? { color: "var(--text-muted)" } : {}}
      >
        Mois
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-5 pt-8 pb-12">
      {/* Section 1 : Nos Marchés */}
      <section className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-main)" }}>
            Nos Marchés
          </h2>
          <div className="w-10 h-[1.5px] bg-or mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {(() => {
            const entries = [...citiesInfo.entries()];
            const total = entries.length;
            return entries.map(([city, info], idx) => {
            const color = getCityColor(city);
            const addressWithoutCity = info.address.replace(new RegExp(`^${city},?\\s*`, "i"), "").trim();
            const badge = getTimeBadge(info.days, now);

            // Position du blason selon le rang
            const isFirst = idx === 0;
            const isLast = idx === total - 1;
            const isSingle = total === 1;
            const blasonPosition = isSingle
              ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              : isFirst
                ? "top-2 left-2 sm:top-3 sm:left-3"
                : isLast
                  ? "bottom-2 right-2 sm:bottom-3 sm:right-3"
                  : idx % 2 === 0
                    ? "top-2 left-2 sm:top-3 sm:left-3"
                    : "bottom-2 right-2 sm:bottom-3 sm:right-3";

            return (
              <a
                key={city}
                href={getMapsUrl(info.address)}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative rounded-xl px-4 py-3.5 sm:p-5 group hover:scale-[1.02] transition-transform overflow-hidden"
                style={{ backgroundColor: color.cardBg, border: `1px solid ${color.border}` }}
              >
                {/* Blason en fond */}
                <CityBlason
                  city={city}
                  className={`absolute ${blasonPosition} w-14 sm:w-20 pointer-events-none select-none`}
                  style={{ color: color.border }}
                />
                {/* Mobile : ligne horizontale */}
                <div className="sm:hidden flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color.text }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-bold" style={{ color: color.text }}>{city}</h3>
                      {badge && (
                        <span className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                          style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}>
                          {badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {info.days.map((d) => DAY_LABELS[d]).join(", ")}
                      {addressWithoutCity && ` · ${addressWithoutCity}`}
                    </p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: color.text }} className="shrink-0 opacity-40">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>

                {/* Desktop : centré */}
                <div className="hidden sm:block text-center">
                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-medium opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: color.text }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Carte
                  </span>
                  {badge && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}>
                      {badge}
                    </span>
                  )}
                  <h3 className="text-lg font-bold mt-1" style={{ color: color.text }}>{city}</h3>
                  {addressWithoutCity && (
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--text-muted)" }}>{addressWithoutCity}</p>
                  )}
                  <p className="text-[13px] mt-1.5 font-medium" style={{ color: "var(--text-main)" }}>
                    {info.days.map((d) => DAY_LABELS[d]).join(", ")}
                  </p>
                </div>
              </a>
            );
          });
          })()}
        </div>

        <p className="text-center text-[12px] mt-4" style={{ color: "var(--text-muted)" }}>
          Tous les marchés : 7h30 - 13h00
        </p>

        <UpcomingAbsences markets={markets} />
      </section>

      {/* Section 2 : Calendrier */}
      <section>
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-[0.12em]" style={{ color: "var(--text-main)" }}>
            Calendrier
          </h2>
          <div className="w-10 h-[1.5px] bg-or mx-auto mt-3" />
        </div>

        {viewMode === "week" ? (
          <WeekView
            markets={filteredMarkets}
            allMarkets={markets}
            today={today}
            weekOffset={weekOffset}
            onWeekChange={setWeekOffset}
            viewToggle={viewToggle}
          />
        ) : (
          <MonthView
            markets={filteredMarkets}
            today={today}
            monthOffset={monthOffset}
            onMonthChange={setMonthOffset}
            viewToggle={viewToggle}
          />
        )}

        {/* Légende + filtres */}
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          {uniqueCities.map((city) => {
            const color = getCityColor(city);
            const isHidden = hiddenCities.has(city);
            return (
              <button
                key={city}
                onClick={() => toggleCity(city)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                  isHidden ? "opacity-30 grayscale" : "opacity-100"
                }`}
                style={{
                  backgroundColor: isHidden ? "transparent" : color.bg,
                  color: color.text,
                  border: `1px solid ${isHidden ? "var(--border-main)" : color.border}`,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isHidden ? "var(--text-muted)" : color.text }} />
                {city}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── Absences prochaines ──────────────────────────────────────────

function UpcomingAbsences({ markets }: { markets: MarketData[] }) {
  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in14days = new Date(today);
    in14days.setDate(in14days.getDate() + 14);

    const absences: { city: string; date: Date; dateStr: string; reason?: string }[] = [];
    for (const m of markets) {
      for (const dateStr of m.absenceDates) {
        const d = new Date(dateStr + "T00:00:00");
        if (d >= today && d < in14days) {
          absences.push({ city: m.city, date: d, dateStr, reason: m.absenceReasons[dateStr] || undefined });
        }
      }
    }
    absences.sort((a, b) => a.date.getTime() - b.date.getTime());
    return absences;
  }, [markets]);

  if (upcoming.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl px-5 py-4 text-center" style={{ backgroundColor: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
      <p className="text-[11px] uppercase tracking-wider font-semibold text-red-400/80 mb-2">Absences prévues</p>
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
        {upcoming.map((a, i) => {
          const color = getCityColor(a.city);
          const dayLabel = a.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
          return (
            <span key={i} className="text-[13px]" style={{ color: "var(--text-main)" }}>
              <strong style={{ color: color.text }}>{a.city}</strong>{" "}
              <span style={{ color: "var(--text-muted)" }}>{dayLabel}</span>
              {a.reason && (
                <span className="text-[11px] italic" style={{ color: "var(--text-muted)", opacity: 0.7 }}> ({a.reason})</span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ─── Vue Semaine ──────────────────────────────────────────────────

function WeekView({
  markets,
  allMarkets,
  today,
  weekOffset,
  onWeekChange,
  viewToggle,
}: {
  markets: MarketData[];
  allMarkets: MarketData[];
  today: Date;
  weekOffset: number;
  onWeekChange: (n: number) => void;
  viewToggle: React.ReactNode;
}) {
  const monday = addDays(getMonday(today), weekOffset * 7);
  const sunday = addDays(monday, 6);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const isCurrentWeek = weekOffset === 0;

  return (
    <div>
      {/* Toggle mobile en premier */}
      <div className="sm:hidden flex justify-center mb-3">{viewToggle}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-[130px] hidden sm:block" />
        <div className="flex items-center justify-center gap-2 flex-1">
          <button onClick={() => onWeekChange(weekOffset - 1)} className="p-3 rounded-lg hover:bg-or/10 active:bg-or/20 transition-colors" style={{ color: "var(--text-muted)" }} aria-label="Semaine précédente">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="text-center min-w-[180px] sm:min-w-[200px]">
            <span className="text-[13px] sm:text-sm font-medium" style={{ color: "var(--text-main)" }}>
              {formatDateFull(monday)} — {formatDateFull(sunday)}
            </span>
            {isCurrentWeek && <span className="block text-[10px] text-or font-medium mt-0.5 uppercase tracking-wider">Cette semaine</span>}
          </div>
          <button onClick={() => onWeekChange(weekOffset + 1)} className="p-3 rounded-lg hover:bg-or/10 active:bg-or/20 transition-colors" style={{ color: "var(--text-muted)" }} aria-label="Semaine suivante">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        <div className="hidden sm:block">{viewToggle}</div>
      </div>

      {!isCurrentWeek && (
        <div className="text-center mb-4">
          <button onClick={() => onWeekChange(0)} className="text-[11px] text-or hover:text-or-light transition-colors uppercase tracking-wider font-medium">
            Revenir à cette semaine
          </button>
        </div>
      )}

      {/* Desktop : grille horizontale */}
      <div className="hidden sm:block card overflow-hidden">
        <div className="grid grid-cols-7">
          {weekDays.map((date, i) => {
            const dayEnum = dateToDayOfWeek(date);
            const dateStr = dateToString(date);
            const dayMarkets = markets.filter((m) => m.dayOfWeek === dayEnum);
            const isToday = isSameDay(date, today);
            const isPast = date < today && !isToday;
            const hasMarkets = dayMarkets.length > 0;
            const availableMarkets = dayMarkets.filter((m) => !m.absenceDates.includes(dateStr));
            const absentMarkets = dayMarkets.filter((m) => m.absenceDates.includes(dateStr));

            return (
              <div
                key={i}
                className={`min-h-[150px] p-3 flex flex-col ${isPast ? "opacity-35" : ""}`}
                style={{
                  borderRight: i < 6 ? "1px solid var(--border-main)" : undefined,
                  backgroundColor: isToday ? "var(--bg-card)" : undefined,
                  boxShadow: isToday ? "inset 0 2px 0 0 var(--color-or)" : undefined,
                }}
              >
                <div className="text-center mb-3 pb-2" style={{ borderBottom: "1px solid var(--border-main)" }}>
                  <span
                    className={`text-sm uppercase tracking-wider block ${isToday ? "text-or font-bold" : ""}`}
                    style={!isToday ? { color: hasMarkets ? "var(--text-main)" : "var(--text-muted)", fontWeight: hasMarkets ? 600 : 400, opacity: hasMarkets ? 1 : 0.4 } : {}}
                  >
                    {DAY_LABELS_SHORT[dayEnum]}
                  </span>
                </div>
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                  {availableMarkets.map((m) => {
                    const color = getCityColor(m.city);
                    return (
                      <a key={m.id} href={getMapsUrl(m.address)} target="_blank" rel="noopener noreferrer"
                        className="block text-center px-1.5 py-2 rounded-lg text-[12px] font-bold transition-all hover:scale-105 hover:shadow-sm"
                        style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}
                      >{m.city}</a>
                    );
                  })}
                  {absentMarkets.map((m) => {
                    const color = getCityColor(m.city);
                    return (
                      <div key={m.id + "-abs"} className="text-center px-1.5 py-2 rounded-lg text-[12px] line-through opacity-35"
                        style={{ color: color.text, border: `1px dashed ${color.border}` }}
                        title={m.absenceReasons[dateStr] || `${m.city} : absent`}
                      >{m.city}</div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile : liste verticale */}
      <div className="sm:hidden card overflow-hidden divide-y" style={{ borderColor: "var(--border-main)" }}>
        {weekDays.map((date, i) => {
          const dayEnum = dateToDayOfWeek(date);
          const dateStr = dateToString(date);
          const dayMarkets = markets.filter((m) => m.dayOfWeek === dayEnum);
          const isToday = isSameDay(date, today);
          const isPast = date < today && !isToday;
          const availableMarkets = dayMarkets.filter((m) => !m.absenceDates.includes(dateStr));
          const absentMarkets = dayMarkets.filter((m) => m.absenceDates.includes(dateStr));
          const hasContent = availableMarkets.length > 0 || absentMarkets.length > 0;

          if (!hasContent && !isToday) return null;

          return (
            <div
              key={i}
              className={`px-4 py-3.5 ${isPast ? "opacity-35" : ""}`}
              style={{
                borderColor: "var(--border-main)",
                backgroundColor: isToday ? "var(--bg-card)" : undefined,
                borderLeft: isToday ? "3px solid var(--color-or)" : "3px solid transparent",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Jour */}
                <div className="w-12 shrink-0">
                  <span className={`text-sm uppercase tracking-wider font-semibold block ${isToday ? "text-or" : ""}`}
                    style={!isToday ? { color: "var(--text-main)" } : {}}
                  >
                    {DAY_LABELS_SHORT[dayEnum]}
                  </span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                  </span>
                </div>

                {/* Marchés en ligne */}
                <div className="flex-1 flex flex-wrap gap-2">
                  {availableMarkets.map((m) => {
                    const color = getCityColor(m.city);
                    return (
                      <a key={m.id} href={getMapsUrl(m.address)} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg text-[12px] font-bold"
                        style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}
                      >{m.city}</a>
                    );
                  })}
                  {absentMarkets.map((m) => {
                    const color = getCityColor(m.city);
                    return (
                      <span key={m.id + "-abs"} className="px-3 py-1.5 rounded-lg text-[12px] line-through opacity-35"
                        style={{ color: color.text, border: `1px dashed ${color.border}` }}
                      >{m.city}</span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Vue Mois ─────────────────────────────────────────────────────

function MonthView({
  markets,
  today,
  monthOffset,
  onMonthChange,
  viewToggle,
}: {
  markets: MarketData[];
  today: Date;
  monthOffset: number;
  onMonthChange: (n: number) => void;
  viewToggle: React.ReactNode;
}) {
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isCurrentMonth = monthOffset === 0;

  const firstDay = new Date(year, month, 1);
  const startDay = getMonday(firstDay);

  const cells: Date[] = [];
  const cursor = new Date(startDay);
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return (
    <div>
      {/* Toggle mobile en premier */}
      <div className="sm:hidden flex justify-center mb-3">{viewToggle}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-[130px] hidden sm:block" />
        <div className="flex items-center justify-center gap-2 flex-1">
          <button onClick={() => onMonthChange(monthOffset - 1)} className="p-3 rounded-lg hover:bg-or/10 active:bg-or/20 transition-colors" style={{ color: "var(--text-muted)" }} aria-label="Mois précédent">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <div className="text-center min-w-[160px] sm:min-w-[200px]">
            <span className="text-[13px] sm:text-sm font-medium capitalize" style={{ color: "var(--text-main)" }}>
              {formatMonthYear(viewDate)}
            </span>
            {isCurrentMonth && <span className="block text-[10px] text-or font-medium mt-0.5 uppercase tracking-wider">Ce mois</span>}
          </div>
          <button onClick={() => onMonthChange(monthOffset + 1)} className="p-3 rounded-lg hover:bg-or/10 active:bg-or/20 transition-colors" style={{ color: "var(--text-muted)" }} aria-label="Mois suivant">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
        <div className="hidden sm:block">{viewToggle}</div>
      </div>

      {!isCurrentMonth && (
        <div className="text-center mb-4">
          <button onClick={() => onMonthChange(0)} className="text-[11px] text-or hover:text-or-light transition-colors uppercase tracking-wider font-medium">
            Revenir à ce mois
          </button>
        </div>
      )}

      {/* Grille mois */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-7" style={{ borderBottom: "1px solid var(--border-main)" }}>
          {DAY_ORDER.map((day) => (
            <div key={day} className="py-2.5 text-center">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
                {DAY_LABELS_SHORT[day]}
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            const isThisMonth = date.getMonth() === month;
            const isToday = isSameDay(date, today);
            const dayEnum = dateToDayOfWeek(date);
            const dateStr = dateToString(date);
            const dayMarkets = markets.filter((m) => m.dayOfWeek === dayEnum);
            const availableMarkets = dayMarkets.filter((m) => !m.absenceDates.includes(dateStr));
            const absentMarkets = dayMarkets.filter((m) => m.absenceDates.includes(dateStr));
            const isPast = date < today && !isToday;

            return (
              <div
                key={i}
                className={`min-h-[48px] sm:min-h-[84px] p-1 sm:p-2 ${!isThisMonth ? "opacity-20" : isPast ? "opacity-35" : ""}`}
                style={{
                  borderRight: (i + 1) % 7 !== 0 ? "1px solid var(--border-main)" : undefined,
                  borderBottom: i < 35 ? "1px solid var(--border-main)" : undefined,
                  backgroundColor: isToday ? "var(--bg-card)" : undefined,
                  boxShadow: isToday ? "inset 0 2px 0 0 var(--color-or)" : undefined,
                }}
              >
                <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                  <span className={`text-[11px] sm:text-xs ${isToday ? "text-or font-bold" : ""}`}
                    style={!isToday ? { color: "var(--text-main)", fontWeight: dayMarkets.length > 0 ? 600 : 400 } : {}}>
                    {date.getDate()}
                  </span>
                </div>

                {/* Desktop : noms */}
                <div className="hidden sm:block space-y-0.5">
                  {availableMarkets.map((m) => {
                    const color = getCityColor(m.city);
                    return (
                      <button key={m.id} onClick={() => window.open(getMapsUrl(m.address), "_blank")}
                        className="block w-full text-center text-[10px] font-bold truncate px-0.5 py-0.5 rounded transition-transform hover:scale-105 cursor-pointer"
                        style={{ backgroundColor: color.bg, color: color.text }}>
                        {m.city}
                      </button>
                    );
                  })}
                  {absentMarkets.map((m) => {
                    const color = getCityColor(m.city);
                    return (
                      <div key={m.id + "-abs"} className="text-center text-[10px] truncate px-0.5 py-0.5 line-through opacity-35"
                        style={{ color: color.text }} title={m.absenceReasons[dateStr] || `${m.city} : absent`}>
                        {m.city}
                      </div>
                    );
                  })}
                </div>

                {/* Mobile : pastilles */}
                <div className="sm:hidden flex flex-wrap items-center justify-center gap-1 mt-0.5">
                  {availableMarkets.map((m) => {
                    const color = getCityColor(m.city);
                    return (
                      <span key={m.id} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.text }} />
                    );
                  })}
                  {absentMarkets.map((m) => {
                    const color = getCityColor(m.city);
                    return (
                      <span key={m.id + "-abs"} className="w-2.5 h-2.5 rounded-full opacity-25 ring-1" style={{ backgroundColor: "transparent", color: color.text, borderColor: color.text, border: `1px dashed ${color.text}` }} />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
