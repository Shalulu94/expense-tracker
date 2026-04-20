'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { useCategories } from '@/lib/hooks/useCategories';
import { DEFAULT_USER_ID } from '@/types/finance';
import type { TransactionType, RecurrenceFrequency, Transaction } from '@/types/finance';
import { todayDate, generateId } from '@/lib/utils/date';
import { parseCurrencyInput } from '@/lib/utils/currency';
import { X } from 'lucide-react';

const FREQUENCIES: { label: string; value: RecurrenceFrequency }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Every 2 weeks', value: 'biweekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
];

export function TransactionForm() {
  const isOpen = useAppStore((s) => s.isTransactionModalOpen);
  const editingId = useAppStore((s) => s.editingTransactionId);
  const closeModal = useAppStore((s) => s.closeTransactionModal);
  const transactions = useAppStore((s) => s.transactions);
  const createTransaction = useAppStore((s) => s.createTransaction);
  const updateTransaction = useAppStore((s) => s.updateTransaction);
  const { categories } = useCategories();

  const editing = editingId ? transactions.find((t) => t.id === editingId) : null;

  // Form state
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayDate());
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<RecurrenceFrequency>('monthly');
  const [recurrenceEnd, setRecurrenceEnd] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (editing) {
      setType(editing.type);
      setAmount(editing.amount.toString());
      setDate(editing.date);
      setCategoryId(editing.categoryId);
      setDescription(editing.description);
      setTags(editing.tags);
      setNotes(editing.notes ?? '');
      setIsRecurring(editing.isRecurring);
      if (editing.recurrenceRule) {
        setFrequency(editing.recurrenceRule.frequency);
        setRecurrenceEnd(editing.recurrenceRule.endDate ?? '');
      }
    } else {
      resetForm();
    }
  }, [editing, isOpen]);

  function resetForm() {
    setType('expense');
    setAmount('');
    setDate(todayDate());
    setCategoryId('');
    setDescription('');
    setTagInput('');
    setTags([]);
    setNotes('');
    setIsRecurring(false);
    setFrequency('monthly');
    setRecurrenceEnd('');
  }

  function addTag() {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!categoryId || !description || !amount) return;

    setIsSaving(true);
    try {
      const data = {
        userId: DEFAULT_USER_ID,
        type,
        amount: parseCurrencyInput(amount),
        currency: 'GBP',
        date,
        categoryId,
        description,
        tags,
        notes: notes || null,
        isRecurring,
        recurrenceRule: isRecurring
          ? {
              frequency,
              interval: 1,
              startDate: date,
              endDate: recurrenceEnd || null,
              dayOfMonth: null,
              maxOccurrences: null,
            }
          : null,
        recurrenceGroupId: isRecurring ? (editing?.recurrenceGroupId ?? generateId()) : null,
        accountId: null,
        attachments: [],
        importSessionId: null,
        merchantRaw: null,
        categorizationSource: 'manual' as const,
        categorizationConfidence: null,
        isExcludedFromBudget: false,
        isSplit: false,
        splitGroupId: null,
      };

      if (editing) {
        await updateTransaction(editing.id, data);
      } else {
        await createTransaction(data);
      }
      closeModal();
    } finally {
      setIsSaving(false);
    }
  }

  const availableCategories = categories.filter(
    (c) => c.type === type || c.type === 'income' && type === 'income'
  );

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeModal()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Type toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(['expense', 'income'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setType(t); setCategoryId(''); }}
                className={`flex-1 py-2 text-sm font-medium transition-colors capitalize ${
                  type === t ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="amount">Amount (£)</Label>
              <Input
                id="amount"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g. Tesco weekly shop"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={(v) => v && setCategoryId(v)} required>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.type === type || c.type === 'expense')
                  .map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Add tag, press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className="flex-1"
              />
              <Button type="button" variant="outline" onClick={addTag}>Add</Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1 resize-none"
              rows={2}
            />
          </div>

          {/* Recurring */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="recurring">Recurring transaction</Label>
              <Switch
                id="recurring"
                checked={isRecurring}
                onCheckedChange={setIsRecurring}
              />
            </div>

            {isRecurring && (
              <div className="grid grid-cols-2 gap-3 pl-4 border-l-2 border-primary/30">
                <div>
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={(v) => setFrequency(v as RecurrenceFrequency)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map((f) => (
                        <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="recurrenceEnd">End date (optional)</Label>
                  <Input
                    id="recurrenceEnd"
                    type="date"
                    value={recurrenceEnd}
                    onChange={(e) => setRecurrenceEnd(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? 'Saving...' : editing ? 'Save changes' : 'Add transaction'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
