'use client';

import { useState } from 'react';
import type { Transaction, Category } from '@/types/finance';
import { formatDate } from '@/lib/utils/date';
import { formatCurrency } from '@/lib/utils/currency';
import { CategoryBadge } from './CategoryBadge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useAppStore } from '@/lib/store';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Pencil, Trash2, Repeat, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

interface TransactionRowProps {
  transaction: Transaction;
  category: Category | undefined;
  currency?: string;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export function TransactionRow({ transaction, category, currency = 'USD', isSelected = false, onToggleSelect }: TransactionRowProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);
  const openTransactionModal = useAppStore((s) => s.openTransactionModal);
  const deleteTransaction = useAppStore((s) => s.deleteTransaction);
  const deleteTransactionsByGroupId = useAppStore((s) => s.deleteTransactionsByGroupId);

  const isExpense = transaction.type === 'expense';

  async function handleDelete() {
    await deleteTransaction(transaction.id);
    setDeleteOpen(false);
  }

  async function handleDeleteGroup() {
    if (transaction.recurrenceGroupId) {
      await deleteTransactionsByGroupId(transaction.recurrenceGroupId);
    }
    setDeleteGroupOpen(false);
  }

  return (
    <>
      <div className="flex items-center gap-3 py-3 px-4 hover:bg-muted/40 rounded-lg group transition-colors">
        {/* Checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggleSelect?.(transaction.id)}
          aria-label="Select transaction"
          className="shrink-0"
        />

        {/* Date */}
        <span className="text-xs text-muted-foreground w-20 shrink-0 hidden sm:block">
          {formatDate(transaction.date)}
        </span>

        {/* Description + category */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium truncate">{transaction.description}</span>
            {transaction.isRecurring && (
              <Repeat className="size-3 text-muted-foreground shrink-0" />
            )}
            {transaction.categorizationSource === 'ai' && (
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-4">AI</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <CategoryBadge category={category} size="sm" />
            {transaction.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0 h-4">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Amount */}
        <span
          className={cn(
            'text-sm font-semibold tabular-nums shrink-0',
            isExpense ? 'text-foreground' : 'text-emerald-600'
          )}
        >
          {isExpense ? '-' : '+'}
          {formatCurrency(transaction.amount, currency)}
        </span>

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'size-7 opacity-0 group-hover:opacity-100 transition-opacity'
            )}
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => openTransactionModal(transaction.id)}>
              <Pencil className="size-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4 mr-2" /> Delete
            </DropdownMenuItem>
            {transaction.recurrenceGroupId && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setDeleteGroupOpen(true)}
              >
                <Trash2 className="size-4 mr-2" /> Delete all recurring
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete transaction"
        description="This will permanently delete this transaction. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />

      <ConfirmDialog
        open={deleteGroupOpen}
        onOpenChange={setDeleteGroupOpen}
        title="Delete all recurring transactions"
        description="This will delete all transactions in this recurring series. This action cannot be undone."
        confirmLabel="Delete all"
        onConfirm={handleDeleteGroup}
      />
    </>
  );
}
