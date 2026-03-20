"use client";

import { useState } from "react";
import { MarketData, DAY_LABELS } from "@/lib/types";

function getMapsEmbedUrl(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed&z=14&maptype=roadmap`;
}

function getMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function formatCities(markets: MarketData[]): string[] {
  return [...new Set(markets.map((m) => m.city))];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs transition-colors group"
      style={{ color: "var(--text-muted)" }}
      title="Copier l'adresse"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-or">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-or">Copié</span>
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-or transition-colors">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          <span className="group-hover:text-or transition-colors">Copier l&apos;adresse</span>
        </>
      )}
    </button>
  );
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
  const cities = formatCities(featured);

  const nextUp = hasCurrent && next.length > 0 ? next : upcoming;

  const upcomingByDay: { day: string; cities: string }[] = [];
  const seen = new Set<string>();
  for (const m of nextUp) {
    if (!seen.has(m.dayOfWeek)) {
      seen.add(m.dayOfWeek);
      const dayCities = formatCities(
        nextUp.filter((x) => x.dayOfWeek === m.dayOfWeek)
      );
      upcomingByDay.push({
        day: DAY_LABELS[m.dayOfWeek],
        cities: dayCities.join(", "),
      });
    }
  }

  if (!firstFeatured) return null;

  const dayLabel = DAY_LABELS[firstFeatured.dayOfWeek];

  return (
    <section className="max-w-5xl mx-auto px-5 pt-8 pb-4">
      <div
        className="rounded-xl overflow-hidden border"
        style={{ borderColor: "var(--border-main)", backgroundColor: "var(--bg-card)" }}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Texte */}
          <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
            <div className="flex items-baseline gap-2.5 flex-wrap">
              <span className="text-xs font-semibold text-or uppercase tracking-[0.15em]">
                {hasCurrent ? "En ce moment" : "Retrouvez-nous"}
              </span>
              <span className="text-xs tracking-wide" style={{ color: "var(--text-muted)" }}>
                {hasCurrent
                  ? `jusqu'à ${firstFeatured.endTime}`
                  : `${dayLabel} · ${firstFeatured.startTime} - ${firstFeatured.endTime}`}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mt-3 leading-[1.1]" style={{ color: "var(--text-main)" }}>
              {cities.map((city, i) => (
                <span key={city}>
                  {i > 0 && (
                    <span className="text-2xl sm:text-3xl font-light text-or"> &amp; </span>
                  )}
                  {city}
                </span>
              ))}
            </h2>

            {/* Adresse + copier */}
            <div className="mt-2.5">
              <CopyButton text={firstFeatured.address} />
            </div>

            {/* Prochains + CTA */}
            <div className="mt-5 flex items-end justify-between gap-4 flex-wrap">
              {upcomingByDay.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-medium" style={{ color: "var(--text-muted)" }}>
                    Ensuite
                  </span>
                  {upcomingByDay.map(({ day, cities: c }, i) => (
                    <span key={day} className="flex items-center gap-1.5">
                      {i > 0 && <span style={{ color: "var(--border-main)" }}>·</span>}
                      <span className="text-xs font-medium" style={{ color: "var(--text-main)" }}>
                        {c}
                      </span>
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {day.toLowerCase()}
                      </span>
                    </span>
                  ))}
                </div>
              )}

              <a
                href="/marches"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-semibold rounded-md bg-or text-noir-light hover:bg-or-light transition-colors tracking-wide uppercase"
              >
                Marchés
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </div>
          </div>

          {/* Map desktop */}
          <div className="hidden sm:block w-72 lg:w-80 shrink-0">
            <a
              href={getMapsUrl(`Marché de ${firstFeatured.city}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative group"
            >
              <iframe
                title={`Carte ${firstFeatured.city}`}
                src={getMapsEmbedUrl(`Marché de ${firstFeatured.city}`)}
                className="w-full h-full min-h-[240px] pointer-events-none"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blanc text-xs font-medium bg-noir/70 px-3 py-1.5 rounded-full">
                  Ouvrir dans Maps
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Map mobile */}
        <div className="sm:hidden">
          <a
            href={getMapsUrl(`Marché de ${firstFeatured.city}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <iframe
              title={`Carte ${firstFeatured.city}`}
              src={getMapsEmbedUrl(`Marché de ${firstFeatured.city}`)}
              className="w-full h-44 pointer-events-none"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
