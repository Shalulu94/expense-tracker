'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { useCategories } from '@/lib/hooks/useCategories';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';
import type { MerchantRule } from '@/types/finance';

const SOURCE_LABELS: Record<'user' | 'ai-learned', { label: string; className: string }> = {
  user:        { label: 'Manual',  className: 'bg-emerald-100 text-emerald-700' },
  'ai-learned':{ label: 'Learned', className: 'bg-indigo-100 text-indigo-700' },
};

// Reusable two-level category picker used for both Add and Edit dialogs.
function CategoryPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const { rootExpenseCategories, getChildCategories, getCategoryById } = useCategories();

  const currentCat = getCategoryById(value);
  const derivedParentId = currentCat?.parentId ?? (currentCat ? currentCat.id : '');
  const [parentId, setParentId] = useState<string>(derivedParentId);

  const children = getChildCategories(parentId);
  const parentCat = getCategoryById(parentId);
  const subcatValue = currentCat?.parentId === parentId ? value : '';

  function handleParentChange(id: string) {
    setParentId(id);
    const kids = getChildCategories(id);
    if (kids.length === 0) onChange(id);
  }

  function handleSubcatChange(id: string) {
    onChange(id);
  }

  return (
    <div className="flex gap-2">
      <Select value={parentId} onValueChange={handleParentChange}>
        <SelectTrigger className="flex-1 text-sm">
          {parentCat
            ? <span className="truncate">{parentCat.icon} {parentCat.name}</span>
            : <span className="text-muted-foreground">Category…</span>}
        </SelectTrigger>
        <SelectContent>
          {rootExpenseCategories.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {children.length > 0 && (
        <Select value={subcatValue} onValueChange={handleSubcatChange}>
          <SelectTrigger className="flex-1 text-sm">
            {subcatValue
              ? (() => {
                  const sub = getCategoryById(subcatValue);
                  return sub
                    ? <span className="truncate">{sub.icon} {sub.name}</span>
                    : <span className="text-muted-foreground">Subcategory…</span>;
                })()
              : <span className="text-muted-foreground">Subcategory…</span>}
          </SelectTrigger>
          <SelectContent>
            {children.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export function RulesManager() {
  const merchantRules = useAppStore((s) => s.merchantRules);
  const createMerchantRule = useAppStore((s) => s.createMerchantRule);
  const updateMerchantRule = useAppStore((s) => s.updateMerchantRule);
  const deleteMerchantRule = useAppStore((s) => s.deleteMerchantRule);
  const { getCategoryById, getCategoryParent } = useCategories();

  // Only show rules the user can act on (not read-only system rules)
  const visibleRules = merchantRules
    .filter((r) => r.source !== 'system')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  // ── Add dialog ────────────────────────────────────────────────────────────
  const [addOpen, setAddOpen] = useState(false);
  const [addPattern, setAddPattern] = useState('');
  const [addCategoryId, setAddCategoryId] = useState('');
  const [isSavingAdd, setIsSavingAdd] = useState(false);

  async function handleAdd() {
    const pattern = addPattern.trim().toLowerCase();
    if (!pattern || !addCategoryId) return;
    setIsSavingAdd(true);
    await createMerchantRule({
      pattern,
      isRegex: false,
      categoryId: addCategoryId,
      source: 'user',
      matchCount: 0,
    });
    setAddPattern('');
    setAddCategoryId('');
    setAddOpen(false);
    setIsSavingAdd(false);
  }

  // ── Edit dialog ───────────────────────────────────────────────────────────
  const [editingRule, setEditingRule] = useState<MerchantRule | null>(null);
  const [editPattern, setEditPattern] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  function openEdit(rule: MerchantRule) {
    setEditingRule(rule);
    setEditPattern(rule.pattern);
    setEditCategoryId(rule.categoryId);
  }

  async function handleEdit() {
    const pattern = editPattern.trim().toLowerCase();
    if (!editingRule || !pattern || !editCategoryId) return;
    setIsSavingEdit(true);
    await updateMerchantRule(editingRule.id, {
      pattern,
      categoryId: editCategoryId,
      source: 'user',
    });
    setEditingRule(null);
    setIsSavingEdit(false);
  }

  // ── Delete dialog ─────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<MerchantRule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteMerchantRule(deleteTarget.id);
    setDeleteTarget(null);
    setIsDeleting(false);
  }

  // ── Category display helper ───────────────────────────────────────────────
  function categoryLabel(categoryId: string) {
    const cat = getCategoryById(categoryId);
    if (!cat) return <span className="text-muted-foreground text-xs">Unknown</span>;
    const parent = getCategoryParent(categoryId);
    return (
      <span className="text-sm">
        {parent ? `${parent.icon} ${parent.name} › ` : ''}
        {cat.icon} {cat.name}
      </span>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Categorisation Rules</CardTitle>
            <CardDescription className="mt-1">
              Rules learned from your corrections. These take priority over built-in rules on every future import.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" /> Add Rule
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          {visibleRules.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-muted-foreground">
              No custom rules yet. Correct transactions during import or add one manually above.
            </p>
          ) : (
            <div className="border-t border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Pattern</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground">Source</th>
                    <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden sm:table-cell">Updated</th>
                    <th className="px-4 py-2" />
                  </tr>
                </thead>
                <tbody>
                  {visibleRules.map((rule) => {
                    const src = SOURCE_LABELS[rule.source as 'user' | 'ai-learned'];
                    return (
                      <tr key={rule.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs">{rule.pattern}</td>
                        <td className="px-4 py-3">{categoryLabel(rule.categoryId)}</td>
                        <td className="px-4 py-3">
                          <Badge className={`text-xs px-1.5 py-0 h-5 ${src.className}`}>
                            {src.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                          {formatDate(rule.updatedAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7"
                              onClick={() => openEdit(rule)}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(rule)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Rule Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { if (!o) { setAddOpen(false); setAddPattern(''); setAddCategoryId(''); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block">Merchant pattern</Label>
              <Input
                placeholder="e.g. woolworths, origin energy"
                value={addPattern}
                onChange={(e) => setAddPattern(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lowercase. Any transaction whose description contains this phrase will match.
              </p>
            </div>
            <div>
              <Label className="mb-1.5 block">Category</Label>
              <CategoryPicker value={addCategoryId} onChange={setAddCategoryId} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAdd}
              disabled={!addPattern.trim() || !addCategoryId || isSavingAdd}
            >
              {isSavingAdd ? 'Saving…' : 'Save Rule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Rule Dialog */}
      {editingRule && (
        <Dialog open onOpenChange={(o) => { if (!o) setEditingRule(null); }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Rule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="mb-1.5 block">Pattern</Label>
                <Input
                  className="font-mono text-sm"
                  value={editPattern}
                  onChange={(e) => setEditPattern(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lowercase. Any transaction whose description contains this phrase will match.
                </p>
              </div>
              <div>
                <Label className="mb-1.5 block">Category</Label>
                <CategoryPicker value={editCategoryId} onChange={setEditCategoryId} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRule(null)}>Cancel</Button>
              <Button
                onClick={handleEdit}
                disabled={!editPattern.trim() || !editCategoryId || isSavingEdit}
              >
                {isSavingEdit ? 'Saving…' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
        title="Delete rule"
        description={`Remove the rule for "${deleteTarget?.pattern}"? Future transactions from this merchant will fall back to built-in rules or manual review.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
