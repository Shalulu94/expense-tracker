'use client';

import { useState } from 'react';
import { useTransactions } from '@/lib/hooks/useTransactions';
import { useCategories } from '@/lib/hooks/useCategories';
import { TransactionRow } from './TransactionRow';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore } from '@/lib/store';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Receipt, Trash2 } from 'lucide-react';

interface TransactionListProps {
  currency?: string;
}

export function TransactionList({ currency = 'USD' }: TransactionListProps) {
  const { filtered } = useTransactions();
  const { getCategoryById } = useCategories();
  const isLoading = useAppStore((s) => s.isLoading);
  const openTransactionModal = useAppStore((s) => s.openTransactionModal);
  const deleteTransactionsBatch = useAppStore((s) => s.deleteTransactionsBatch);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((t) => t.id)));
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleBulkDelete() {
    await deleteTransactionsBatch([...selectedIds]);
    setSelectedIds(new Set());
    setBulkDeleteOpen(false);
  }

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
    <div className="space-y-0">
      {/* Select-all header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-border">
        <Checkbox
          checked={allSelected ? true : someSelected ? 'indeterminate' : false}
          onCheckedChange={toggleAll}
          aria-label="Select all transactions"
        />
        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {selectedIds.size} selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 h-7"
              onClick={() => setBulkDeleteOpen(true)}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Select all</span>
        )}
      </div>

      {filtered.map((tx) => (
        <TransactionRow
          key={tx.id}
          transaction={tx}
          category={getCategoryById(tx.categoryId)}
          currency={currency}
          isSelected={selectedIds.has(tx.id)}
          onToggleSelect={toggleOne}
        />
      ))}

      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        title={`Delete ${selectedIds.size} transaction${selectedIds.size !== 1 ? 's' : ''}`}
        description="This will permanently delete the selected transactions. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
