'use client';

import { useState } from 'react';
import { useCategories } from '@/lib/hooks/useCategories';
import { DEFAULT_USER_ID } from '@/types/finance';
import type { Category } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';

const EMOJI_OPTIONS = ['🛒', '🍽️', '🚗', '🏠', '💡', '🏥', '📱', '🎬', '🛍️', '✈️', '📚', '💪', '🪥', '💰', '📦', '🎮', '🐕', '🧴', '🎁', '🔧'];
const COLOR_OPTIONS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#a855f7', '#f97316', '#84cc16', '#06b6d4', '#fb7185'];

interface EditRowProps {
  category?: Category;
  onSave: (name: string, icon: string, color: string) => void;
  onCancel: () => void;
}

function EditRow({ category, onSave, onCancel }: EditRowProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '📦');
  const [color, setColor] = useState(category?.color ?? '#6366f1');

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg border border-primary/30 bg-muted/30">
      <select
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
        className="text-lg border rounded px-1 py-0.5 bg-background"
      >
        {EMOJI_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
      </select>
      <Input
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 h-8"
        autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter') onSave(name, icon, color); if (e.key === 'Escape') onCancel(); }}
      />
      <div className="flex gap-1">
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`size-5 rounded-full border-2 transition-transform ${color === c ? 'border-foreground scale-125' : 'border-transparent'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <Button size="icon" variant="ghost" className="size-7" onClick={() => onSave(name, icon, color)}>
        <Check className="size-4 text-emerald-500" />
      </Button>
      <Button size="icon" variant="ghost" className="size-7" onClick={onCancel}>
        <X className="size-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

export function CategoryManager() {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const customCats = categories.filter((c) => !c.isSystem);
  const systemRoots = categories.filter((c) => c.isSystem && !c.parentId);
  const systemChildren = categories.filter((c) => c.isSystem && c.parentId);

  async function handleCreate(name: string, icon: string, color: string) {
    if (!name.trim()) return;
    await createCategory({
      userId: DEFAULT_USER_ID,
      name: name.trim(),
      icon,
      color,
      type: 'expense',
      isSystem: false,
      parentId: null,
      budgetId: null,
    });
    setIsAdding(false);
  }

  async function handleUpdate(id: string, name: string, icon: string, color: string) {
    if (!name.trim()) return;
    await updateCategory(id, { name: name.trim(), icon, color });
    setEditingId(null);
  }

  async function handleDelete() {
    if (!deleteId) return;
    await deleteCategory(deleteId);
    setDeleteId(null);
  }

  function CategoryRow({ cat }: { cat: Category }) {
    if (editingId === cat.id) {
      return (
        <EditRow
          category={cat}
          onSave={(name, icon, color) => handleUpdate(cat.id, name, icon, color)}
          onCancel={() => setEditingId(null)}
        />
      );
    }
    return (
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 group">
        <span className="text-lg">{cat.icon}</span>
        <span className="flex-1 text-sm font-medium">{cat.name}</span>
        <span className="size-3 rounded-full" style={{ backgroundColor: cat.color }} />
        {!cat.isSystem && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" variant="ghost" className="size-7" onClick={() => setEditingId(cat.id)}>
              <Pencil className="size-3.5" />
            </Button>
            <Button size="icon" variant="ghost" className="size-7 text-destructive" onClick={() => setDeleteId(cat.id)}>
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        )}
        {cat.isSystem && <Badge variant="outline" className="text-xs">System</Badge>}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Custom categories */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Custom Categories</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setIsAdding(true)} className="gap-1.5">
                <Plus className="size-4" /> Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {isAdding && (
              <EditRow
                onSave={handleCreate}
                onCancel={() => setIsAdding(false)}
              />
            )}
            {customCats.length === 0 && !isAdding && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No custom categories yet. Add one above.
              </p>
            )}
            {customCats.map((cat) => <CategoryRow key={cat.id} cat={cat} />)}
          </CardContent>
        </Card>

        {/* System categories — hierarchical */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Default Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {systemRoots.map((parent) => {
              const children = systemChildren.filter((c) => c.parentId === parent.id);
              return (
                <div key={parent.id}>
                  <CategoryRow cat={parent} />
                  {children.map((child) => (
                    <div key={child.id} className="ml-4 border-l border-border pl-2">
                      <CategoryRow cat={child} />
                    </div>
                  ))}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete category"
        description="Transactions in this category will be uncategorized. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  );
}
