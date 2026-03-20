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
  isAbsentToday: boolean;
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
