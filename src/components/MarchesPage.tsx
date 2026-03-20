"use client";

import { MarketData, DayOfWeek, DAY_LABELS, DAY_ORDER } from "@/lib/types";

function getMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function getMapsEmbedUrl(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

interface MarchesPageProps {
  markets: MarketData[];
}

export function MarchesPage({ markets }: MarchesPageProps) {
  const byDay = DAY_ORDER.reduce(
    (acc, day) => {
      acc[day] = markets.filter((m) => m.dayOfWeek === day);
      return acc;
    },
    {} as Record<DayOfWeek, MarketData[]>
  );

  // Villes uniques pour la carte
  const uniqueCities = [...new Set(markets.map((m) => m.city))];

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      {/* Titre */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-main)" }}>
          Marchés
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {uniqueCities.length} villes · 7h30 - 13h00 · toute l&apos;année
        </p>
      </div>

      {/* Grille : calendrier + carte */}
      <div className="flex gap-8 items-start">
        {/* Calendrier semaine */}
        <div className="flex-1 min-w-0">
          {DAY_ORDER.map((day) => {
            const dayMarkets = byDay[day];
            const hasMarkets = dayMarkets.length > 0;

            return (
              <div
                key={day}
                className="flex items-start gap-5 py-4"
                style={{ borderBottom: "1px solid var(--border-main)" }}
              >
                <span
                  className="w-28 shrink-0 text-sm"
                  style={{
                    color: hasMarkets ? "var(--text-main)" : "var(--text-muted)",
                    fontWeight: hasMarkets ? 500 : 400,
                    opacity: hasMarkets ? 1 : 0.4,
                  }}
                >
                  {DAY_LABELS[day]}
                </span>

                {hasMarkets ? (
                  <div className="flex-1 space-y-2">
                    {dayMarkets.map((m) => (
                      <a
                        key={m.id}
                        href={getMapsUrl(m.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between"
                      >
                        <div>
                          <span
                            className="text-sm font-medium group-hover:text-or transition-colors"
                            style={{ color: "var(--text-main)" }}
                          >
                            {m.city}
                          </span>
                          <span className="text-xs ml-2" style={{ color: "var(--text-muted)" }}>
                            {m.startTime} - {m.endTime}
                          </span>
                        </div>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-or/0 group-hover:text-or transition-colors shrink-0"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm" style={{ color: "var(--text-muted)", opacity: 0.3 }}>
                    —
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Carte — desktop */}
        <div
          className="hidden lg:block w-80 shrink-0 rounded-lg overflow-hidden border sticky top-6"
          style={{ borderColor: "var(--border-main)" }}
        >
          <iframe
            title="Carte des marchés"
            src={getMapsEmbedUrl(uniqueCities.map((c) => `Marché de ${c}`).join("|"))}
            className="w-full h-[400px]"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {/* Carte — mobile */}
      <div
        className="lg:hidden mt-8 rounded-lg overflow-hidden border"
        style={{ borderColor: "var(--border-main)" }}
      >
        <iframe
          title="Carte des marchés"
          src={getMapsEmbedUrl("Marché de " + uniqueCities[0])}
          className="w-full h-52"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
