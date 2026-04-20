import { useMemo } from 'react';
import { useTransactions } from './useTransactions';
import { useCategories } from './useCategories';
import { useAppStore } from '@/lib/store';
import { toMonthKey } from '@/lib/utils/date';

export interface CategoryRowData {
  id: string;
  name: string;
  icon: string;
  total: number;
  avgPerMonth: number;
  transactionCount: number;
  isParent: boolean;
  subcategories: CategoryRowData[];
}

export function useCategoryDetails(): CategoryRowData[] {
  const { filtered } = useTransactions();
  const { rootExpenseCategories, getChildCategories } = useCategories();
  const transactions = useAppStore((s) => s.transactions);

  return useMemo(() => {
    const expenses = filtered.filter((t) => t.type === 'expense');

    // Total months denominator — same approach as summary stats
    const allExpenses = transactions.filter((t) => t.type === 'expense');
    const totalMonths = Math.max(1, new Set(allExpenses.map((t) => toMonthKey(t.date))).size);

    function calcRow(categoryId: string, name: string, icon: string, isParent: boolean, matchIds: string[]): CategoryRowData {
      const rows = expenses.filter((t) => matchIds.includes(t.categoryId));
      const total = rows.reduce((sum, t) => sum + t.amount, 0);
      return {
        id: categoryId,
        name,
        icon,
        total,
        avgPerMonth: total / totalMonths,
        transactionCount: rows.length,
        isParent,
        subcategories: [],
      };
    }

    return rootExpenseCategories
      .map((parent) => {
        const children = getChildCategories(parent.id);
        const subcategories = children
          .map((child) => calcRow(child.id, child.name, child.icon, false, [child.id]))
          .filter((r) => r.transactionCount > 0);

        // Parent total covers both direct transactions and all subcategory transactions
        const allIds = [parent.id, ...children.map((c) => c.id)];
        const parentRow = calcRow(parent.id, parent.name, parent.icon, true, allIds);
        parentRow.subcategories = subcategories;
        return parentRow;
      })
      .filter((r) => r.transactionCount > 0);
  }, [filtered, transactions, rootExpenseCategories, getChildCategories]);
}
