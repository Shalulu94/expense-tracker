'use client';

import { useTransactions } from '@/lib/hooks/useTransactions';
import { useCategories } from '@/lib/hooks/useCategories';
import { TransactionRow } from './TransactionRow';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/lib/store';
import { Receipt } from 'lucide-react';

interface TransactionListProps {
  currency?: string;
}

export function TransactionList({ currency = 'GBP' }: TransactionListProps) {
  const { filtered } = useTransactions();
  const { getCategoryById } = useCategories();
  const isLoading = useAppStore((s) => s.isLoading);
  const openTransactionModal = useAppStore((s) => s.openTransactionModal);

  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={<Receipt />}
        title="No transactions found"
        description="Try adjusting your filters, or add a new transaction."
        action={
          <button
            onClick={() => openTransactionModal()}
            className="text-sm text-primary underline underline-offset-4"
          >
            Add transaction
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-0.5">
      {filtered.map((tx) => (
        <TransactionRow
          key={tx.id}
          transaction={tx}
          category={getCategoryById(tx.categoryId)}
          currency={currency}
        />
      ))}
    </div>
  );
}
