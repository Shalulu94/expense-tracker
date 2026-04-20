import { useTransactions } from './useTransactions';
import { useCategories } from './useCategories';
import { transactionsToCSV, downloadCSV } from '@/lib/utils/csv';
import { format } from 'date-fns';

export function useExport() {
  const { filtered } = useTransactions();
  const { categories } = useCategories();

  function exportToCSV() {
    const content = transactionsToCSV(filtered, categories);
    const filename = `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    downloadCSV(content, filename);
  }

  return { exportToCSV };
}
