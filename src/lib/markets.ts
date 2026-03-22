import { prisma } from "./prisma";
import { MarketData, DayOfWeek, DAY_ORDER } from "./types";

/**
 * Récupère tous les marchés actifs avec leurs absences
 * sur une plage configurable (par défaut 90 jours pour le calendrier).
 */
export async function getAllMarkets(daysAhead = 90): Promise<MarketData[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endRange = new Date(today);
  endRange.setDate(endRange.getDate() + daysAhead);

  const markets = await prisma.market.findMany({
    where: { active: true },
    include: {
      absences: {
        where: {
          date: { gte: today, lt: endRange },
        },
      },
    },
  });

  return markets.map((market) => ({
    id: market.id,
    name: market.name,
    city: market.city,
    address: market.address,
    dayOfWeek: market.dayOfWeek as DayOfWeek,
    startTime: market.startTime,
    endTime: market.endTime,
    absenceDates: market.absences.map((a) => a.date.toISOString().split("T")[0]),
    absenceReasons: market.absences.reduce(
      (acc, a) => {
        acc[a.date.toISOString().split("T")[0]] = a.reason || undefined;
        return acc;
      },
      {} as Record<string, string | undefined>
    ),
  }));
}

/**
 * Trie les marchés par proximité temporelle
 */
export function sortMarketsByProximity(
  markets: MarketData[],
  currentDay: DayOfWeek
): MarketData[] {
  const currentIndex = DAY_ORDER.indexOf(currentDay);

  return [...markets].sort((a, b) => {
    const distA =
      (DAY_ORDER.indexOf(a.dayOfWeek) - currentIndex + 7) % 7;
    const distB =
      (DAY_ORDER.indexOf(b.dayOfWeek) - currentIndex + 7) % 7;
    if (distA !== distB) return distA - distB;
    return a.startTime.localeCompare(b.startTime);
  });
}

/**
 * Retourne les marchés groupés :
 * - current: marché(s) en cours maintenant
 * - next: prochain(s) marché(s)
 * - upcoming: marchés des 2 jours suivants
 */
export function groupMarketsByUrgency(
  markets: MarketData[],
  now: Date
) {
  const JS_DAY_TO_ENUM: DayOfWeek[] = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
    "THURSDAY", "FRIDAY", "SATURDAY",
  ];

  const currentDay = JS_DAY_TO_ENUM[now.getDay()];
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const todayStr = now.toISOString().split("T")[0];

  // Filtrer les marchés absents aujourd'hui
  const availableMarkets = markets.filter(
    (m) => !m.absenceDates.includes(todayStr) || m.dayOfWeek !== currentDay
  );

  const sorted = sortMarketsByProximity(availableMarkets, currentDay);

  const current: MarketData[] = [];
  const next: MarketData[] = [];
  const upcoming: MarketData[] = [];

  let nextDay: DayOfWeek | null = null;
  const upcomingDays = new Set<DayOfWeek>();

  for (const market of sorted) {
    const isToday = market.dayOfWeek === currentDay;

    if (isToday && currentTime >= market.startTime && currentTime < market.endTime) {
      current.push(market);
      continue;
    }

    if (isToday && currentTime >= market.endTime) {
      continue;
    }

    if (next.length === 0 && nextDay === null) {
      nextDay = market.dayOfWeek;
    }

    if (market.dayOfWeek === nextDay) {
      next.push(market);
      continue;
    }

    if (upcomingDays.size < 2) {
      upcomingDays.add(market.dayOfWeek);
    }

    if (upcomingDays.has(market.dayOfWeek)) {
      upcoming.push(market);
    }
  }

  return { current, next, upcoming };
}
