'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useCategories } from '@/lib/hooks/useCategories';
import { formatCurrency } from '@/lib/utils/currency';
import { formatDate } from '@/lib/utils/date';
import { cn } from '@/lib/utils';
import type { ImportRow } from '@/lib/hooks/useImport';

interface ImportPreviewModalProps {
  open: boolean;
  filename: string;
  rows: ImportRow[];
  error?: string | null;
  onUpdateRow: (index: number, updates: Partial<ImportRow>) => void;
  onConfirm: (learnFromCorrections: boolean) => Promise<number | void>;
  onCancel: () => void;
  isProcessing?: boolean;
}

function SourceBadge({ source }: { source: ImportRow['categorizationSource'] }) {
  const labels: Record<ImportRow['categorizationSource'], { label: string; className: string }> = {
    rule: { label: 'Rule', className: 'bg-emerald-100 text-emerald-700' },
    ai: { label: 'AI', className: 'bg-indigo-100 text-indigo-700' },
    manual: { label: 'Manual', className: 'bg-gray-100 text-gray-700' },
    'user-correction': { label: 'Corrected', className: 'bg-amber-100 text-amber-700' },
  };
  const { label, className } = labels[source];
  return <Badge className={cn('text-xs px-1.5 py-0 h-5', className)}>{label}</Badge>;
}

// Per-row category cell: parent Select + subcategory Select linked together.
function CategoryCell({
  row,
  onUpdateRow,
}: {
  row: ImportRow;
  onUpdateRow: (index: number, updates: Partial<ImportRow>) => void;
}) {
  const { rootExpenseCategories, getChildCategories, getCategoryById } = useCategories();

  const currentCat = getCategoryById(row.categoryId ?? '');
  // Determine the parent: if current category has a parentId, use that; otherwise
  // the current category IS the parent (leaf root like Miscellaneous).
  const derivedParentId = currentCat?.parentId ?? (currentCat ? currentCat.id : '');

  // Local state tracks the selected parent independently so the user can pick a
  // parent first and then choose a subcategory without us immediately overwriting categoryId.
  const [selectedParentId, setSelectedParentId] = useState<string>(derivedParentId);

  const children = getChildCategories(selectedParentId);
  const parentCategory = getCategoryById(selectedParentId);

  // The subcategory value is the row's categoryId only when it belongs to the selected parent.
  const subcatValue =
    currentCat?.parentId === selectedParentId ? (row.categoryId ?? '') : '';

  function handleParentChange(parentId: string) {
    setSelectedParentId(parentId);
    const newChildren = getChildCategories(parentId);
    if (newChildren.length === 0) {
      // Leaf parent — assign directly
      onUpdateRow(row.index, {
        categoryId: parentId,
        categorizationSource: 'user-correction',
        categorizationConfidence: 'high',
      });
    }
    // If parent has children, wait for the user to pick a subcategory
  }

  function handleSubcatChange(subcatId: string) {
    onUpdateRow(row.index, {
      categoryId: subcatId,
      categorizationSource: 'user-correction',
      categorizationConfidence: 'high',
    });
  }

  return (
    <div className="flex gap-1">
      {/* Parent / Category */}
      <Select value={selectedParentId} onValueChange={handleParentChange}>
        <SelectTrigger className="h-7 text-xs flex-1 min-w-0">
          {parentCategory
            ? <span className="truncate">{parentCategory.icon} {parentCategory.name}</span>
            : <span className="text-muted-foreground">Category…</span>}
        </SelectTrigger>
        <SelectContent className="!max-h-none overflow-y-visible">
          {rootExpenseCategories.map((parent) => (
            <SelectItem key={parent.id} value={parent.id}>
              {parent.icon} {parent.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Subcategory — only shown when the selected parent has children */}
      {children.length > 0 && (
        <Select value={subcatValue} onValueChange={handleSubcatChange}>
          <SelectTrigger className="h-7 text-xs flex-1 min-w-0">
            {subcatValue
              ? (() => {
                  const sub = getCategoryById(subcatValue);
                  return sub
                    ? <span className="truncate">{sub.icon} {sub.name}</span>
                    : <span className="text-muted-foreground">Subcategory…</span>;
                })()
              : <span className="text-muted-foreground">Subcategory…</span>}
          </SelectTrigger>
          <SelectContent className="!max-h-none overflow-y-visible">
            {children.map((child) => (
              <SelectItem key={child.id} value={child.id}>
                {child.icon} {child.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export function ImportPreviewModal({
  open,
  filename,
  rows,
  error,
  onUpdateRow,
  onConfirm,
  onCancel,
  isProcessing,
}: ImportPreviewModalProps) {
  const [learnFromCorrections, setLearnFromCorrections] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const includedRows = rows.filter((r) => !r.excluded);
  const miscRows = rows.filter((r) => !r.excluded && r.categorizationConfidence === 'low');
  const duplicateRows = rows.filter((r) => r.isDuplicate);

  const tabRows = {
    all: rows,
    review: miscRows,
    duplicates: duplicateRows,
  }[activeTab] ?? rows;

  async function handleConfirm() {
    setIsConfirming(true);
    await onConfirm(learnFromCorrections);
    setIsConfirming(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="w-[90vw] max-w-none sm:max-w-none h-[92vh] max-h-[92vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Preview — {filename}</DialogTitle>
        </DialogHeader>

        {/* Error state */}
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive space-y-1">
            <p className="font-medium">Could not parse this file</p>
            <p>{error}</p>
            <p className="text-muted-foreground">
              Make sure you&apos;re uploading a CSV export from your bank. If your bank is not
              auto-detected, try renaming columns to: Date, Description, Amount, Balance.
            </p>
          </div>
        )}

        {/* Stats strip */}
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="text-muted-foreground">
            <strong className="text-foreground">{includedRows.length}</strong> to import
          </span>
          <span className="text-emerald-600">
            <strong>{rows.filter((r) => !r.excluded && r.categorizationSource === 'rule').length}</strong> by rule
          </span>
          <span className="text-indigo-600">
            <strong>{rows.filter((r) => !r.excluded && r.categorizationSource === 'ai').length}</strong> by AI
          </span>
          <span className="text-amber-600">
            <strong>{miscRows.length}</strong> need review
          </span>
          <span className="text-muted-foreground">
            <strong>{duplicateRows.length}</strong> duplicates skipped
          </span>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-fit">
            <TabsTrigger value="all">All ({rows.length})</TabsTrigger>
            <TabsTrigger value="review">Needs Review ({miscRows.length})</TabsTrigger>
            <TabsTrigger value="duplicates">Duplicates ({duplicateRows.length})</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-3 border border-border rounded-lg">
            <table className="w-full text-sm table-fixed">
              <colgroup>
                <col className="w-24" />
                <col />
                <col className="w-24" />
                <col className="w-56" />
                <col className="w-20" />
                <col className="w-12" />
              </colgroup>
              <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                <tr>
                  <th className="text-left p-2 pl-3 font-medium text-muted-foreground">Date</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Category / Subcategory</th>
                  <th className="text-left p-2 font-medium text-muted-foreground">Source</th>
                  <th className="text-center p-2 font-medium text-muted-foreground">Skip</th>
                </tr>
              </thead>
              <tbody>
                {tabRows.map((row) => (
                  <tr
                    key={row.index}
                    className={cn(
                      'border-t border-border',
                      row.excluded && 'opacity-40',
                      row.categorizationConfidence === 'low' && !row.excluded && 'bg-amber-50/50'
                    )}
                  >
                    <td className="p-2 pl-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(row.date)}
                    </td>
                    <td className="p-2">
                      <span className="truncate block" title={row.description}>{row.description}</span>
                    </td>
                    <td className="p-2 tabular-nums font-medium whitespace-nowrap">
                      {formatCurrency(row.amount)}
                    </td>
                    <td className="p-2">
                      <CategoryCell row={row} onUpdateRow={onUpdateRow} />
                    </td>
                    <td className="p-2">
                      <SourceBadge source={row.categorizationSource} />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="checkbox"
                        checked={row.excluded}
                        onChange={(e) => onUpdateRow(row.index, { excluded: e.target.checked })}
                        className="rounded"
                      />
                    </td>
                  </tr>
                ))}
                {tabRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No transactions in this view.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-3 items-center">
          <div className="flex items-center gap-2 mr-auto">
            <Switch
              id="learn"
              checked={learnFromCorrections}
              onCheckedChange={setLearnFromCorrections}
            />
            <Label htmlFor="learn" className="text-sm">
              Learn from corrections (improves future imports)
            </Label>
          </div>
          <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isConfirming || includedRows.length === 0}>
            {isConfirming ? 'Importing...' : `Import ${includedRows.length} transactions`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
