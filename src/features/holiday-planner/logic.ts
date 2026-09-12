import { PUBLIC_HOLIDAYS_BY_YEAR, type PublicHoliday } from '@/features/holiday-planner/data';

export type WeekendType = 'sat-sun' | 'fri-sat';

const WEEKEND_DAYS: Record<WeekendType, number[]> = {
  'sat-sun': [0, 6], // Sunday, Saturday
  'fri-sat': [5, 6], // Friday, Saturday
};

export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function isWeekend(date: Date, weekendType: WeekendType): boolean {
  return WEEKEND_DAYS[weekendType].includes(date.getUTCDay());
}

export function getHolidayMap(year: number): Map<string, string> {
  const holidays = PUBLIC_HOLIDAYS_BY_YEAR[year] ?? [];
  return new Map(holidays.map((h) => [h.date, h.name]));
}

export interface DayInfo {
  date: Date;
  iso: string;
  isWeekend: boolean;
  holidayName: string | null;
  isOff: boolean; // weekend or holiday
}

export function buildYearCalendar(year: number, weekendType: WeekendType): DayInfo[] {
  const holidayMap = getHolidayMap(year);
  const days: DayInfo[] = [];
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31));

  for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
    const date = new Date(d);
    const iso = toIsoDate(date);
    const weekend = isWeekend(date, weekendType);
    const holidayName = holidayMap.get(iso) ?? null;
    days.push({ date, iso, isWeekend: weekend, holidayName, isOff: weekend || holidayName !== null });
  }

  return days;
}

export interface OffCluster {
  startIso: string;
  endIso: string;
  length: number;
}

function findOffClusters(days: DayInfo[]): OffCluster[] {
  const clusters: OffCluster[] = [];
  let runStart: number | null = null;

  for (let i = 0; i < days.length; i++) {
    if (days[i].isOff && runStart === null) {
      runStart = i;
    }
    const isLast = i === days.length - 1;
    if ((!days[i].isOff || isLast) && runStart !== null) {
      const runEnd = days[i].isOff && isLast ? i : i - 1;
      clusters.push({ startIso: days[runStart].iso, endIso: days[runEnd].iso, length: runEnd - runStart + 1 });
      runStart = null;
    }
  }

  return clusters;
}

export interface BridgeSuggestion {
  leaveStartIso: string;
  leaveEndIso: string;
  leaveDays: number;
  breakStartIso: string;
  breakEndIso: string;
  breakDays: number;
  efficiency: number; // breakDays / leaveDays
}

const MAX_LEAVE_BUDGET = 4;

/** Finds "bridge" opportunities: short weekday gaps between two off-clusters
 * (weekends/holidays) that, if spent as annual leave, merge into one long
 * consecutive break. Sorted by total break length, filtered to a realistic
 * leave-day budget. */
export function findBridgeSuggestions(year: number, weekendType: WeekendType, maxLeaveDays = MAX_LEAVE_BUDGET): BridgeSuggestion[] {
  const days = buildYearCalendar(year, weekendType);
  const clusters = findOffClusters(days);
  const dayIndexByIso = new Map(days.map((d, i) => [d.iso, i]));
  const suggestions: BridgeSuggestion[] = [];

  for (let i = 0; i < clusters.length - 1; i++) {
    const a = clusters[i];
    const b = clusters[i + 1];
    const aEndIdx = dayIndexByIso.get(a.endIso)!;
    const bStartIdx = dayIndexByIso.get(b.startIso)!;
    const gapDays = bStartIdx - aEndIdx - 1;

    if (gapDays >= 1 && gapDays <= maxLeaveDays) {
      const leaveStartIdx = aEndIdx + 1;
      const leaveEndIdx = bStartIdx - 1;
      const breakDays = a.length + gapDays + b.length;

      suggestions.push({
        leaveStartIso: days[leaveStartIdx].iso,
        leaveEndIso: days[leaveEndIdx].iso,
        leaveDays: gapDays,
        breakStartIso: a.startIso,
        breakEndIso: b.endIso,
        breakDays,
        efficiency: breakDays / gapDays,
      });
    }
  }

  return suggestions.sort((x, y) => y.breakDays - x.breakDays || y.efficiency - x.efficiency);
}

export function formatDateRangeMY(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const fmt = (d: Date) => `${d.getUTCDate()}/${d.getUTCMonth() + 1}`;
  return startIso === endIso ? fmt(start) : `${fmt(start)}–${fmt(end)}`;
}

export function getHolidaysForYear(year: number): PublicHoliday[] {
  return PUBLIC_HOLIDAYS_BY_YEAR[year] ?? [];
}
