import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  differenceInDays,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isAfter,
  isBefore,
  isEqual,
} from 'date-fns';
import type { DatePreset, DateRange } from '@/types/finance';

export function generateId(): string {
  return crypto.randomUUID();
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function todayDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM yyyy');
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd MMM');
}

export function formatMonthYear(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM yyyy');
}

export function formatMonth(ym: string): string {
  // ym is 'YYYY-MM'
  return format(parseISO(`${ym}-01`), 'MMM yyyy');
}

export function getDateRangeForPreset(preset: DatePreset): DateRange {
  const now = new Date();
  switch (preset) {
    case 'this_month':
      return {
        from: format(startOfMonth(now), 'yyyy-MM-dd'),
        to: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
    case 'last_3_months':
      return {
        from: format(startOfMonth(subMonths(now, 2)), 'yyyy-MM-dd'),
        to: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
    case 'this_year':
      return {
        from: format(startOfYear(now), 'yyyy-MM-dd'),
        to: format(endOfYear(now), 'yyyy-MM-dd'),
      };
    case 'custom':
      return {
        from: format(startOfMonth(now), 'yyyy-MM-dd'),
        to: format(endOfMonth(now), 'yyyy-MM-dd'),
      };
  }
}

export function daysBetween(from: string, to: string): number {
  return Math.max(1, differenceInDays(parseISO(to), parseISO(from)) + 1);
}

export function isDateInRange(date: string, range: DateRange): boolean {
  const d = parseISO(date);
  const from = parseISO(range.from);
  const to = parseISO(range.to);
  return (isAfter(d, from) || isEqual(d, from)) && (isBefore(d, to) || isEqual(d, to));
}

export function toMonthKey(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy-MM');
}

export { addDays, addWeeks, addMonths, addYears, parseISO, format, isAfter, isBefore };
