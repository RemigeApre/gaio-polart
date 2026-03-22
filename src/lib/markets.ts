import { prisma } from "./prisma";
import { MarketData, DayOfWeek, DAY_ORDER } from "./types";

function localDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function stripTime(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function daysBetween(a: Date, b: Date): number {
  const aStripped = stripTime(a);
  const bStripped = stripTime(b);
  return Math.round((bStripped.getTime() - aStripped.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Récupère tous les marchés actifs avec leurs absences
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
    absenceDates: market.absences.map((a) => localDateStr(a.date)),
    absenceReasons: market.absences.reduce(
      (acc, a) => {
        acc[localDateStr(a.date)] = a.reason || undefined;
        return acc;
      },
      {} as Record<string, string | undefined>
    ),
  }));
}

export function sortMarketsByProximity(
  markets: MarketData[],
  currentDay: DayOfWeek
): MarketData[] {
  const currentIndex = DAY_ORDER.indexOf(currentDay);
  return [...markets].sort((a, b) => {
    const distA = (DAY_ORDER.indexOf(a.dayOfWeek) - currentIndex + 7) % 7;
    const distB = (DAY_ORDER.indexOf(b.dayOfWeek) - currentIndex + 7) % 7;
    if (distA !== distB) return distA - distB;
    return a.startTime.localeCompare(b.startTime);
  });
}

const JS_DAY_TO_ENUM: DayOfWeek[] = [
  "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY",
  "THURSDAY", "FRIDAY", "SATURDAY",
];

/**
 * Prochaine date pour un jour de la semaine donné, à partir d'aujourd'hui.
 */
function getNextDateForDay(dayOfWeek: DayOfWeek, from: Date): Date {
  const targetIndex = DAY_ORDER.indexOf(dayOfWeek);
  const fromJsDay = from.getDay();
  const fromIndex = (fromJsDay + 6) % 7;
  let diff = targetIndex - fromIndex;
  if (diff < 0) diff += 7;
  const d = stripTime(from);
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Retourne les marchés groupés en prenant en compte les absences :
 * - current: marché(s) en cours maintenant (et pas absent aujourd'hui)
 * - next: prochain(s) marché(s) (non absents)
 * - upcoming: marchés des 2 jours suivants (non absents)
 */
export function groupMarketsByUrgency(
  markets: MarketData[],
  now: Date
) {
  const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const today = stripTime(now);
  const todayStr = localDateStr(today);

  // Pour chaque marché, trouver sa prochaine occurrence non absente
  const entries: { market: MarketData; date: string; distDays: number }[] = [];

  for (const market of markets) {
    let nextDate = getNextDateForDay(market.dayOfWeek, today);
    let dateStr = localDateStr(nextDate);
    let dist = daysBetween(today, nextDate);

    // Si c'est aujourd'hui mais le marché est fini, passer à la semaine prochaine
    if (dist === 0 && currentTime >= market.endTime) {
      nextDate.setDate(nextDate.getDate() + 7);
      dateStr = localDateStr(nextDate);
      dist = 7;
    }

    // Si absent, essayer semaine prochaine (max 2 tentatives)
    for (let attempt = 0; attempt < 2; attempt++) {
      if (!market.absenceDates.includes(dateStr)) break;
      nextDate.setDate(nextDate.getDate() + 7);
      dateStr = localDateStr(nextDate);
      dist += 7;
    }

    // Si toujours absent, on skip
    if (market.absenceDates.includes(dateStr)) continue;

    entries.push({ market, date: dateStr, distDays: dist });
  }

  // Trier par distance puis par heure
  entries.sort((a, b) => {
    if (a.distDays !== b.distDays) return a.distDays - b.distDays;
    return a.market.startTime.localeCompare(b.market.startTime);
  });

  const current: MarketData[] = [];
  const next: MarketData[] = [];
  const upcoming: MarketData[] = [];

  let nextDate: string | null = null;
  const upcomingDates = new Set<string>();

  for (const entry of entries) {
    const isToday = entry.date === todayStr;

    // Marché en cours ?
    if (isToday && currentTime >= entry.market.startTime && currentTime < entry.market.endTime) {
      current.push(entry.market);
      continue;
    }

    // Prochain marché
    if (next.length === 0 && nextDate === null) {
      nextDate = entry.date;
    }

    if (entry.date === nextDate) {
      next.push(entry.market);
      continue;
    }

    // Upcoming : les 2 dates suivantes
    if (upcomingDates.size < 2) {
      upcomingDates.add(entry.date);
    }

    if (upcomingDates.has(entry.date)) {
      upcoming.push(entry.market);
    }
  }

  return { current, next, upcoming };
}
