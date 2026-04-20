import { useMemo } from 'react';
import type { Transaction, Category, ExpenseSummary, CategoryBreakdown, MonthlyTotals } from '@/types/finance';
import { toMonthKey, getDateRangeForPreset } from '@/lib/utils/date';
import { useAppStore } from '@/lib/store';
import { useTransactions } from './useTransactions';
import { useCategories } from './useCategories';

export function useSummaryStats(): {
  summary: ExpenseSummary;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTotals: MonthlyTotals[];
} {
  const { filtered } = useTransactions();
  const { categories } = useCategories();
  const filters = useAppStore((s) => s.filters);
  const transactions = useAppStore((s) => s.transactions);

  const dateRange = filters.datePreset !== 'custom'
    ? getDateRangeForPreset(filters.datePreset)
    : filters.dateRange;

  const summary: ExpenseSummary = useMemo(() => {
    const expenses = filtered.filter((t) => t.type === 'expense');
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Top category by spend — roll up to parent so the stat matches the chart.
    const categoryTotals = new Map<string, number>();
    for (const t of expenses) {
      const chartId = categories.find((c) => c.id === t.categoryId)?.parentId ?? t.categoryId;
      categoryTotals.set(chartId, (categoryTotals.get(chartId) ?? 0) + t.amount);
    }
    let topCategoryId = '';
    let topAmount = 0;
    for (const [id, amount] of categoryTotals) {
      if (amount > topAmount) { topAmount = amount; topCategoryId = id; }
    }
    const topCategory = topCategoryId
      ? { category: categories.find((c) => c.id === topCategoryId)!, amount: topAmount }
      : null;

    // Monthly average: count distinct calendar months spanned by the date range.
    const from = new Date(dateRange.from);
    const to = new Date(dateRange.to);
    const months = Math.max(
      1,
      (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1
    );

    return {
      totalSpent,
      avgPerMonth: totalSpent / months,
      transactionCount: filtered.length,
      topCategory: topCategory?.category ? topCategory : null,
      dateRange,
    };
  }, [filtered, categories, dateRange]);

  const categoryBreakdown: CategoryBreakdown[] = useMemo(() => {
    const expenses = filtered.filter((t) => t.type === 'expense');
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totals = new Map<string, { amount: number; count: number }>();

    for (const t of expenses) {
      // Roll subcategories up to their parent so the chart shows ~14 slices.
      const chartId = categories.find((c) => c.id === t.categoryId)?.parentId ?? t.categoryId;
      const existing = totals.get(chartId) ?? { amount: 0, count: 0 };
      totals.set(chartId, { amount: existing.amount + t.amount, count: existing.count + 1 });
    }

    return Array.from(totals.entries())
      .map(([categoryId, { amount, count }]) => ({
        categoryId,
        category: categories.find((c) => c.id === categoryId)!,
        amount,
        percentage: totalSpent > 0 ? (amount / totalSpent) * 100 : 0,
        transactionCount: count,
      }))
      .filter((b) => b.category)
      .sort((a, b) => b.amount - a.amount);
  }, [filtered, categories]);

  const monthlyTotals: MonthlyTotals[] = useMemo(() => {
    const map = new Map<string, MonthlyTotals>();
    for (const t of transactions) {
      const month = toMonthKey(t.date);
      const existing = map.get(month) ?? { month, expense: 0, income: 0, net: 0 };
      if (t.type === 'expense') existing.expense += t.amount;
      else if (t.type === 'income') existing.income += t.amount;
      existing.net = existing.income - existing.expense;
      map.set(month, existing);
    }
    return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  return { summary, categoryBreakdown, monthlyTotals };
}
