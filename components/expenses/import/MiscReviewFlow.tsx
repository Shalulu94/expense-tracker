'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAppStore } from '@/lib/store';
import { useCategories } from '@/lib/hooks/useCategories';
import { normalizeMerchant } from '@/lib/categorization/normalizer';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';

interface MiscReviewFlowProps {
  open: boolean;
  onClose: () => void;
}

export function MiscReviewFlow({ open, onClose }: MiscReviewFlowProps) {
  const transactions = useAppStore((s) => s.transactions);
  const categories = useAppStore((s) => s.categories);
  const updateTransaction = useAppStore((s) => s.updateTransaction);
  const createMerchantRule = useAppStore((s) => s.createMerchantRule);
  const { getCategoryById } = useCategories();

  const miscCategoryId = categories.find((c) => c.name === 'Miscellaneous')?.id;
  const miscTransactions = useMemo(
    () => transactions.filter((t) => t.categoryId === miscCategoryId),
    [transactions, miscCategoryId]
  );

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [applyToSimilar, setApplyToSimilar] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const current = miscTransactions[currentIdx];

  async function handleApply() {
    if (!current || !selectedCategoryId) return;
    setIsSaving(true);

    const normalized = normalizeMerchant(current.merchantRaw ?? current.description);

    // Update this transaction
    await updateTransaction(current.id, {
      categoryId: selectedCategoryId,
      categorizationSource: 'user-correction',
    });

    // Apply to all similar transactions in Misc
    if (applyToSimilar) {
      const similar = miscTransactions.filter(
        (t) => t.id !== current.id &&
          normalizeMerchant(t.merchantRaw ?? t.description).includes(normalized.split(' ')[0] ?? '')
      );
      for (const tx of similar) {
        await updateTransaction(tx.id, {
          categoryId: selectedCategoryId,
          categorizationSource: 'user-correction',
        });
      }
    }

    // Create merchant rule
    await createMerchantRule({
      pattern: normalized.split(' ')[0] ?? normalized,
      isRegex: false,
      categoryId: selectedCategoryId,
      source: 'user',
      matchCount: 1,
    });

    setSelectedCategoryId('');
    if (currentIdx >= miscTransactions.length - 1) {
      onClose();
    } else {
      setCurrentIdx((i) => i + 1);
    }
    setIsSaving(false);
  }

  function handleSkip() {
    if (currentIdx >= miscTransactions.length - 1) {
      onClose();
    } else {
      setCurrentIdx((i) => i + 1);
    }
  }

  if (!current) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>All reviewed!</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">No more Miscellaneous transactions to review.</p>
          <DialogFooter>
            <Button onClick={onClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Review Miscellaneous — {currentIdx + 1} of {miscTransactions.length}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border p-4 space-y-1">
            <p className="font-medium">{current.description}</p>
            <p className="text-sm text-muted-foreground">{formatDate(current.date)}</p>
            <p className="text-lg font-semibold">{formatCurrency(current.amount)}</p>
          </div>

          <div>
            <Label className="mb-1.5 block">Assign category</Label>
            <Select value={selectedCategoryId} onValueChange={(v) => v && setSelectedCategoryId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.filter((c) => c.type === 'expense' && c.name !== 'Miscellaneous').map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="applyToSimilar"
              checked={applyToSimilar}
              onCheckedChange={setApplyToSimilar}
            />
            <Label htmlFor="applyToSimilar" className="text-sm">
              Apply to similar merchants & create rule
            </Label>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={handleSkip}>Skip</Button>
          <Button onClick={handleApply} disabled={!selectedCategoryId || isSaving}>
            {isSaving ? 'Saving...' : 'Apply'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
