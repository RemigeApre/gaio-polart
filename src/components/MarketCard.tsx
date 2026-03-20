import { DayOfWeek } from "@/lib/types";

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Lundi",
  TUESDAY: "Mardi",
  WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi",
  FRIDAY: "Vendredi",
  SATURDAY: "Samedi",
  SUNDAY: "Dimanche",
};

interface MarketCardProps {
  name: string;
  city: string;
  address: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isAbsentToday?: boolean;
}

function getMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export function MarketCard({
  name,
  city,
  address,
  dayOfWeek,
  startTime,
  endTime,
  isAbsentToday,
}: MarketCardProps) {
  return (
    <article className="border border-border rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-text-light text-sm">{city}</p>
        </div>
        <span className="shrink-0 bg-primary/10 text-primary text-sm font-medium px-2 py-1 rounded">
          {DAY_LABELS[dayOfWeek]}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <p className="text-sm">{address}</p>
        <a
          href={getMapsUrl(address)}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-primary hover:text-primary-light text-sm font-medium underline"
          aria-label={`Voir ${name} sur la carte`}
        >
          📍 Itinéraire
        </a>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-text-light">
          {startTime} - {endTime}
        </span>

        {isAbsentToday && (
          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
            Absent
          </span>
        )}
      </div>
    </article>
  );
}
