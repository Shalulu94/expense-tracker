import type { Transaction, Category } from '@/types/finance';
import { formatDate } from './date';

export function transactionsToCSV(
  transactions: Transaction[],
  categories: Category[]
): string {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const headers = [
    'Date',
    'Description',
    'Category',
    'Type',
    'Amount',
    'Currency',
    'Tags',
    'Notes',
  ];

  const rows = transactions.map((t) => [
    formatDate(t.date),
    `"${t.description.replace(/"/g, '""')}"`,
    categoryMap.get(t.categoryId) ?? 'Unknown',
    t.type,
    t.type === 'expense' ? `-${t.amount.toFixed(2)}` : t.amount.toFixed(2),
    t.currency,
    `"${t.tags.join(', ')}"`,
    `"${(t.notes ?? '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
