import type { Transaction, TransactionFilters } from '@/types/finance';
import { isDateInRange, getDateRangeForPreset } from './date';

export function applyFilters(
  transactions: Transaction[],
  filters: Partial<TransactionFilters>
): Transaction[] {
  let result = [...transactions];

  // Date range
  if (filters.datePreset && filters.datePreset !== 'custom') {
    const range = getDateRangeForPreset(filters.datePreset);
    result = result.filter((t) => isDateInRange(t.date, range));
  } else if (filters.dateRange) {
    result = result.filter((t) => isDateInRange(t.date, filters.dateRange!));
  }

  // Transaction types
  if (filters.transactionTypes && filters.transactionTypes.length > 0) {
    result = result.filter((t) => filters.transactionTypes!.includes(t.type));
  }

  // Categories
  if (filters.categoryIds && filters.categoryIds.length > 0) {
    result = result.filter((t) => filters.categoryIds!.includes(t.categoryId));
  }

  // Amount range
  if (filters.amountMin !== null && filters.amountMin !== undefined) {
    result = result.filter((t) => t.amount >= filters.amountMin!);
  }
  if (filters.amountMax !== null && filters.amountMax !== undefined) {
    result = result.filter((t) => t.amount <= filters.amountMax!);
  }

  // Search query
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    result = result.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        (t.merchantRaw?.toLowerCase().includes(q) ?? false) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  // Tags
  if (filters.tags && filters.tags.length > 0) {
    result = result.filter((t) => filters.tags!.some((tag) => t.tags.includes(tag)));
  }

  // Recurring only
  if (filters.showRecurringOnly) {
    result = result.filter((t) => t.isRecurring);
  }

  // Sort by date descending
  return result.sort((a, b) => b.date.localeCompare(a.date));
}
