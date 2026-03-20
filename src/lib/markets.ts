import { prisma } from "./prisma";
import { MarketData, DayOfWeek, DAY_ORDER } from "./types";

export async function getAllMarkets(): Promise<MarketData[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endRange = new Date(today);
  endRange.setDate(endRange.getDate() + 7);

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

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  return markets.map((market) => ({
    id: market.id,
    name: market.name,
    city: market.city,
    address: market.address,
    dayOfWeek: market.dayOfWeek as DayOfWeek,
    startTime: market.startTime,
    endTime: market.endTime,
    isAbsentToday: market.absences.some(
      (a) => a.date >= todayStart && a.date < tomorrowStart
    ),
  }));
}

/**
 * Trie les marchés par proximité temporelle :
 * d'abord aujourd'hui, puis demain, puis après-demain, etc.
 * en bouclant sur la semaine.
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
 * - next: prochain(s) marché(s) (aujourd'hui plus tard ou jour suivant)
 * - upcoming: marchés des 2 jours suivants après "next"
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

  const sorted = sortMarketsByProximity(markets, currentDay);

  const current: MarketData[] = [];
  const next: MarketData[] = [];
  const upcoming: MarketData[] = [];

  let nextDay: DayOfWeek | null = null;
  let upcomingDays = new Set<DayOfWeek>();

  for (const market of sorted) {
    const isToday = market.dayOfWeek === currentDay;

    // Marché en cours ?
    if (isToday && currentTime >= market.startTime && currentTime < market.endTime) {
      current.push(market);
      continue;
    }

    // Marché terminé aujourd'hui → skip pour "next"
    if (isToday && currentTime >= market.endTime) {
      continue;
    }

    // Premier marché "next" trouvé → on fixe le jour
    if (next.length === 0 && nextDay === null) {
      nextDay = market.dayOfWeek;
    }

    // Même jour que le prochain → c'est "next"
    if (market.dayOfWeek === nextDay) {
      next.push(market);
      continue;
    }

    // Upcoming : les 2 jours suivants après nextDay
    if (upcomingDays.size < 2) {
      upcomingDays.add(market.dayOfWeek);
    }

    if (upcomingDays.has(market.dayOfWeek)) {
      upcoming.push(market);
    }
  }

  return { current, next, upcoming };
}
