import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { applyFilters } from '@/lib/utils/filters';

export function useTransactions() {
  const transactions = useAppStore((s) => s.transactions);
  const filters = useAppStore((s) => s.filters);
  const createTransaction = useAppStore((s) => s.createTransaction);
  const updateTransaction = useAppStore((s) => s.updateTransaction);
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);
  const deleteTransactionsByGroupId = useAppStore((s) => s.deleteTransactionsByGroupId);

  const filtered = useMemo(() => applyFilters(transactions, filters), [transactions, filters]);

  return {
    transactions,
    filtered,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    deleteTransactionsByGroupId,
  };
}
