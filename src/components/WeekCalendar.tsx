"use client";

import { MarketData, DayOfWeek, DAY_LABELS, DAY_ORDER } from "@/lib/types";

function getMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

interface WeekCalendarProps {
  markets: MarketData[];
}

export function WeekCalendar({ markets }: WeekCalendarProps) {
  const byDay = DAY_ORDER.reduce(
    (acc, day) => {
      acc[day] = markets.filter((m) => m.dayOfWeek === day);
      return acc;
    },
    {} as Record<DayOfWeek, MarketData[]>
  );

  return (
    <section style={{ borderTop: "1px solid var(--border-main)" }}>
      <div className="max-w-3xl mx-auto px-5 py-10">
        <h2 className="text-xs font-medium text-or uppercase tracking-[0.15em] mb-6">
          Semaine type
        </h2>

        <div className="space-y-1">
          {DAY_ORDER.map((day) => {
            const dayMarkets = byDay[day];
            const hasMarkets = dayMarkets.length > 0;

            return (
              <div
                key={day}
                className="flex items-start gap-4 py-3"
                style={{ borderBottom: "1px solid var(--border-main)" }}
              >
                <span
                  className={`w-24 shrink-0 text-sm ${
                    hasMarkets ? "font-medium" : ""
                  }`}
                  style={{
                    color: hasMarkets
                      ? "var(--text-main)"
                      : "var(--text-muted)",
                    opacity: hasMarkets ? 1 : 0.5,
                  }}
                >
                  {DAY_LABELS[day]}
                </span>

                {hasMarkets ? (
                  <div className="flex-1 space-y-1">
                    {dayMarkets.map((m) => (
                      <a
                        key={m.id}
                        href={getMapsUrl(m.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between"
                      >
                        <span className="text-sm" style={{ color: "var(--text-main)" }}>
                          {m.city}
                        </span>
                        <span
                          className="text-xs group-hover:text-or transition-colors"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {m.startTime} - {m.endTime}
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm italic" style={{ color: "var(--text-muted)", opacity: 0.4 }}>
                    —
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
