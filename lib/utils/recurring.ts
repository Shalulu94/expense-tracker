import type { Transaction, RecurrenceRule } from '@/types/finance';
import {
  parseISO,
  format,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  isAfter,
  isBefore,
} from '@/lib/utils/date';
import { generateId, nowISO } from './date';

function nextDate(current: Date, rule: RecurrenceRule): Date {
  switch (rule.frequency) {
    case 'daily':
      return addDays(current, rule.interval);
    case 'weekly':
      return addWeeks(current, rule.interval);
    case 'biweekly':
      return addWeeks(current, 2 * rule.interval);
    case 'monthly':
      return addMonths(current, rule.interval);
    case 'quarterly':
      return addMonths(current, 3 * rule.interval);
    case 'yearly':
      return addYears(current, rule.interval);
  }
}

export function expandRecurringRule(
  template: Transaction,
  upToDate: Date,
  existingGroupIds: Set<string>
): Transaction[] {
  if (!template.isRecurring || !template.recurrenceRule) return [];
  const rule = template.recurrenceRule;
  const groupId = template.recurrenceGroupId ?? template.id;

  const results: Transaction[] = [];
  let current = parseISO(rule.startDate);
  let count = 0;

  while (
    (isBefore(current, upToDate) || isEqual(current, upToDate)) &&
    (rule.maxOccurrences === null || count < rule.maxOccurrences) &&
    (rule.endDate === null || !isAfter(current, parseISO(rule.endDate)))
  ) {
    const dateStr = format(current, 'yyyy-MM-dd');
    // Only generate if not already persisted
    const instanceId = `${groupId}_${dateStr}`;
    if (!existingGroupIds.has(instanceId)) {
      results.push({
        ...template,
        id: generateId(),
        date: dateStr,
        recurrenceGroupId: groupId,
        isRecurring: false, // generated instances are not themselves recurring
        recurrenceRule: null,
        createdAt: nowISO(),
        updatedAt: nowISO(),
      });
    }
    current = nextDate(current, rule);
    count++;
  }

  return results;
}

function isEqual(a: Date, b: Date): boolean {
  return a.getTime() === b.getTime();
}
