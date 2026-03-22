export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface MarketData {
  id: string;
  name: string;
  city: string;
  address: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  absenceDates: string[]; // ["2026-03-25", ...]
  absenceReasons: Record<string, string | undefined>;
}

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Lundi",
  TUESDAY: "Mardi",
  WEDNESDAY: "Mercredi",
  THURSDAY: "Jeudi",
  FRIDAY: "Vendredi",
  SATURDAY: "Samedi",
  SUNDAY: "Dimanche",
};

export const DAY_LABELS_SHORT: Record<DayOfWeek, string> = {
  MONDAY: "Lun",
  TUESDAY: "Mar",
  WEDNESDAY: "Mer",
  THURSDAY: "Jeu",
  FRIDAY: "Ven",
  SATURDAY: "Sam",
  SUNDAY: "Dim",
};

export const DAY_ORDER: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

// JS getDay() → 0=Sunday, notre enum → 0=Monday
const JS_DAY_TO_ENUM: DayOfWeek[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export function getCurrentDayOfWeek(): DayOfWeek {
  return JS_DAY_TO_ENUM[new Date().getDay()];
}

export function getDayIndex(day: DayOfWeek): number {
  return DAY_ORDER.indexOf(day);
}

export function dateToDayOfWeek(date: Date): DayOfWeek {
  return JS_DAY_TO_ENUM[date.getDay()];
}
