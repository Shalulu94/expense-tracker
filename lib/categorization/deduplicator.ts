import type { Transaction } from '@/types/finance';
import { normalizeMerchant } from './normalizer';

interface ParsedRow {
  date: string;
  description: string;
  amount: number;
}

// Returns indices of rows that look like duplicates of existing transactions.
export function findDuplicates(
  newRows: ParsedRow[],
  existingTransactions: Transaction[]
): Set<number> {
  const duplicates = new Set<number>();

  for (let i = 0; i < newRows.length; i++) {
    const row = newRows[i];
    const normalizedDesc = normalizeMerchant(row.description);

    const isDuplicate = existingTransactions.some((tx) => {
      if (Math.abs(tx.amount - Math.abs(row.amount)) > 0.01) return false;
      const txNorm = normalizeMerchant(tx.merchantRaw ?? tx.description);
      if (txNorm !== normalizedDesc) return false;
      // Allow ±1 day date tolerance
      const dateDiff = Math.abs(
        new Date(tx.date).getTime() - new Date(row.date).getTime()
      );
      return dateDiff <= 86_400_000; // 1 day in ms
    });

    if (isDuplicate) duplicates.add(i);
  }

  return duplicates;
}
