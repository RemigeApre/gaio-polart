"use client";

import { useState } from "react";
import { MarketData, DAY_LABELS } from "@/lib/types";
import { CityBlason } from "./CityBlason";

const CITY_COLORS: Record<string, { bg: string; glow: string; neon: string }> = {
  Gagny:        { bg: "#254d7a", glow: "rgba(59, 130, 246, 0.5)",  neon: "#60a5fa" },
  Chelles:      { bg: "#3a2463", glow: "rgba(168, 85, 247, 0.5)",  neon: "#a78bfa" },
  Meaux:        { bg: "#1c4438", glow: "rgba(34, 197, 94, 0.5)",   neon: "#4ade80" },
  Villeparisis: { bg: "#4d3714", glow: "rgba(245, 158, 11, 0.5)",  neon: "#fbbf24" },
};

const DEFAULT_COLOR = { bg: "#352c15", glow: "rgba(201, 168, 76, 0.5)", neon: "#c9a84c" };

function getCityColor(city: string) {
  return CITY_COLORS[city] || DEFAULT_COLOR;
}

function getMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

const JS_DAY_TO_ENUM = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

function getTimeLabel(dayOfWeek: string, now: Date): string {
  const todayEnum = JS_DAY_TO_ENUM[now.getDay()];
  const tomorrowEnum = JS_DAY_TO_ENUM[(now.getDay() + 1) % 7];
  if (dayOfWeek === todayEnum) return "Aujourd'hui";
  if (dayOfWeek === tomorrowEnum) return "Demain";
  return DAY_LABELS[dayOfWeek as keyof typeof DAY_LABELS];
}

interface HeroMarketProps {
  current: MarketData[];
  next: MarketData[];
  upcoming: MarketData[];
}

export function HeroMarket({ current, next, upcoming }: HeroMarketProps) {
  const hasCurrent = current.length > 0;
  const featured = hasCurrent ? current : next;
  const firstFeatured = featured[0];
  const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
  const now = new Date();

  const nextUp = hasCurrent && next.length > 0 ? next : upcoming;

  const upcomingByDay: { day: string; markets: MarketData[] }[] = [];
  const seen = new Set<string>();
  for (const m of nextUp) {
    if (!seen.has(m.dayOfWeek)) {
      seen.add(m.dayOfWeek);
      upcomingByDay.push({
        day: DAY_LABELS[m.dayOfWeek],
        markets: nextUp.filter((x) => x.dayOfWeek === m.dayOfWeek),
      });
    }
  }

  if (!firstFeatured) return null;

  const statusLabel = hasCurrent ? "En ce moment" : getTimeLabel(firstFeatured.dayOfWeek, now);
  const isMultiple = featured.length > 1;

  return (
    <section className="max-w-4xl mx-auto px-5 pt-6 sm:pt-10 pb-2">
      {/* ─── BLOC PRINCIPAL ─── */}
      <div className="relative select-none" style={{ height: isMultiple ? "300px" : undefined }}>

        {isMultiple ? (
          /* ═══ VERSUS : 2 cristaux triangulaires ═══ */
          <>
            {/* SVG clipPaths avec coins arrondis au 90° */}
            <svg className="absolute" width="0" height="0">
              <defs>
                {/* Triangle haut-gauche : coin arrondi en haut-gauche, pointes nettes en haut-droit et bas-gauche */}
                <clipPath id="triLeft" clipPathUnits="objectBoundingBox">
                  <path d="M 0.02,0 L 1,0 L 0,1 L 0,0.02 A 0.02,0.02 0 0 1 0.02,0 Z" />
                </clipPath>
                {/* Triangle bas-droit : coin arrondi en bas-droit, pointes nettes en haut-droit et bas-gauche */}
                <clipPath id="triRight" clipPathUnits="objectBoundingBox">
                  <path d="M 1,0 L 1,0.98 A 0.02,0.02 0 0 1 0.98,1 L 0,1 Z" />
                </clipPath>
              </defs>
            </svg>

            {/* Triangle haut-gauche */}
            <a
              href={getMapsUrl(featured[0].address)}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 cursor-pointer"
              style={{
                backgroundColor: getCityColor(featured[0].city).bg,
                clipPath: "url(#triLeft)",
                transform: hoveredSide === "left"
                  ? "translate(-8px, -8px) rotate(-0.5deg)"
                  : hoveredSide === "right"
                    ? "translate(2px, 2px)"
                    : "translate(0, 0)",
                filter: hoveredSide === "left"
                  ? `drop-shadow(10px 10px 25px ${getCityColor(featured[0].city).glow}) drop-shadow(5px 5px 15px rgba(0,0,0,0.4))`
                  : "none",
                zIndex: hoveredSide === "left" ? 15 : 10,
                transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s ease, z-index 0s",
              }}
              onMouseEnter={() => setHoveredSide("left")}
              onMouseLeave={() => setHoveredSide(null)}
            >
              {/* Blason inline teinté */}
              <CityBlason
                city={featured[0].city}
                className="absolute top-14 sm:top-16 left-4 sm:left-8 w-24 sm:w-32 pointer-events-none select-none"
                style={{ color: getCityColor(featured[0].city).glow.replace("0.5", "0.18") }}
              />
              <span className="absolute top-8 sm:top-10 left-6 sm:left-10 flex items-center gap-2 sm:gap-3">
                <span
                  className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black uppercase tracking-tight"
                  style={{
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(220,220,220,0.85) 100%)",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                  } as React.CSSProperties}
                >
                  {featured[0].city}
                </span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blanc/40 sm:w-5 sm:h-5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
            </a>

            {/* Triangle bas-droit */}
            <a
              href={getMapsUrl(featured[1].address)}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 cursor-pointer"
              style={{
                backgroundColor: getCityColor(featured[1].city).bg,
                clipPath: "url(#triRight)",
                transform: hoveredSide === "right"
                  ? "translate(8px, 8px) rotate(0.5deg)"
                  : hoveredSide === "left"
                    ? "translate(-2px, -2px)"
                    : "translate(0, 0)",
                filter: hoveredSide === "right"
                  ? `drop-shadow(-10px -10px 25px ${getCityColor(featured[1].city).glow}) drop-shadow(-5px -5px 15px rgba(0,0,0,0.4))`
                  : "none",
                zIndex: hoveredSide === "right" ? 15 : 10,
                transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1), filter 0.8s ease, z-index 0s",
              }}
              onMouseEnter={() => setHoveredSide("right")}
              onMouseLeave={() => setHoveredSide(null)}
            >
              {/* Blason inline teinté */}
              <CityBlason
                city={featured[1].city}
                className="absolute bottom-14 sm:bottom-16 right-4 sm:right-8 w-24 sm:w-32 pointer-events-none select-none"
                style={{ color: getCityColor(featured[1].city).glow.replace("0.5", "0.18") }}
              />
              <span className="absolute bottom-8 sm:bottom-10 right-6 sm:right-10 flex items-center gap-2 sm:gap-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blanc/40 sm:w-5 sm:h-5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span
                  className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black uppercase tracking-tight"
                  style={{
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundImage: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(220,220,220,0.85) 100%)",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                  } as React.CSSProperties}
                >
                  {featured[1].city}
                </span>
              </span>
            </a>

            {/* Encart statut sur la diagonale */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="bg-noir/85 backdrop-blur-xl rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-center border border-blanc/10 shadow-2xl">
                <div className="flex items-center justify-center gap-2">
                  {hasCurrent && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                  )}
                  <span className="text-or text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em]">
                    {statusLabel}
                  </span>
                </div>
                <p className="text-blanc/50 text-[11px] sm:text-[12px] font-medium mt-0.5">
                  {firstFeatured.startTime} - {firstFeatured.endTime}
                </p>
              </div>
            </div>
          </>
        ) : (
          /* ═══ SOLO ═══ */
          <div
            className="relative px-6 sm:px-12 py-12 sm:py-16 text-center rounded-2xl overflow-hidden"
            style={{ backgroundColor: getCityColor(firstFeatured.city).bg }}
          >
            {/* Blason inline teinté */}
            <CityBlason
              city={firstFeatured.city}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 sm:w-44 pointer-events-none select-none"
              style={{ color: getCityColor(firstFeatured.city).glow.replace("0.5", "0.15") }}
            />
            <div className="inline-block bg-noir/60 backdrop-blur-xl rounded-xl px-5 py-2.5 mb-8 border border-blanc/10">
              <div className="flex items-center justify-center gap-2">
                {hasCurrent && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                )}
                <span className="text-or text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
                  {statusLabel}
                </span>
              </div>
              <p className="text-blanc/50 text-[11px] sm:text-[12px] font-medium mt-0.5">
                {firstFeatured.startTime} - {firstFeatured.endTime}
              </p>
            </div>

            <a
              href={getMapsUrl(firstFeatured.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 group"
            >
              <span
                className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight"
                style={{
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(230,230,230,0.9) 100%)",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                } as React.CSSProperties}
              >
                {firstFeatured.city}
              </span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blanc/30 group-hover:text-blanc/60 transition-colors shrink-0 sm:w-7 sm:h-7">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </a>
          </div>
        )}
      </div>

      {/* ─── BLOC SECONDAIRE : prochains jours + CTA ─── */}
      <div className="mt-6 sm:mt-8 text-center">
        {upcomingByDay.length > 0 && (
          <div className="inline-flex items-stretch gap-0 mb-6 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border-main)" }}>
            {upcomingByDay.map(({ day, markets: dayMarkets }, i) => (
              <div
                key={day}
                className="flex flex-col items-center justify-center px-5 sm:px-8 py-3 min-w-[120px] sm:min-w-[140px]"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderLeft: i > 0 ? "1px solid var(--border-main)" : undefined,
                }}
              >
                <span className="text-[10px] uppercase tracking-[0.15em] font-semibold mb-1.5" style={{ color: "var(--text-muted)" }}>
                  {day}
                </span>
                <div className="flex flex-col items-center gap-1">
                  {dayMarkets.map((m) => {
                    const color = getCityColor(m.city);
                    return (
                      <span key={m.id} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color.neon }} />
                        <span className="text-[13px] font-bold" style={{ color: color.neon }}>
                          {m.city}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <a
            href="/marches"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 text-[12px] font-semibold rounded-xl bg-or text-noir-light hover:bg-or-light transition-colors tracking-wide uppercase shadow-sm hover:shadow-md"
          >
            Tous nos marchés
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
