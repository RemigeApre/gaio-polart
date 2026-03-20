import { getMarketsWithAbsences } from "@/lib/markets";
import { MarketCard } from "./MarketCard";
import { DayOfWeek } from "@/lib/types";

const DAY_ORDER: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export async function MarketList() {
  const markets = await getMarketsWithAbsences();

  if (markets.length === 0) {
    return (
      <p className="text-[var(--color-text-light)] text-center py-8">
        Aucun marché enregistré pour le moment.
      </p>
    );
  }

  const sorted = [...markets].sort(
    (a, b) =>
      DAY_ORDER.indexOf(a.dayOfWeek as DayOfWeek) -
      DAY_ORDER.indexOf(b.dayOfWeek as DayOfWeek)
  );

  return (
    <div className="grid gap-4">
      {sorted.map((market) => (
        <MarketCard
          key={market.id}
          name={market.name}
          city={market.city}
          address={market.address}
          dayOfWeek={market.dayOfWeek as DayOfWeek}
          startTime={market.startTime}
          endTime={market.endTime}
          isAbsentToday={market.isAbsentToday}
        />
      ))}
    </div>
  );
}
