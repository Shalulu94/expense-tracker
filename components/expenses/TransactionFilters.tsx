'use client';

import { useAppStore } from '@/lib/store';
import { useCategories } from '@/lib/hooks/useCategories';
import { DateRangePicker } from '@/components/shared/DateRangePicker';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/finance';

const TYPES: { label: string; value: TransactionType }[] = [
  { label: 'Expenses', value: 'expense' },
  { label: 'Income', value: 'income' },
];

export function TransactionFilters() {
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const { rootExpenseCategories, getChildCategories } = useCategories();

  const activeFilterCount =
    filters.categoryIds.length +
    filters.transactionTypes.length +
    (filters.searchQuery ? 1 : 0) +
    (filters.amountMin !== null ? 1 : 0) +
    (filters.amountMax !== null ? 1 : 0);

  function toggleCategory(id: string) {
    const ids = filters.categoryIds.includes(id)
      ? filters.categoryIds.filter((c) => c !== id)
      : [...filters.categoryIds, id];
    setFilters({ categoryIds: ids });
  }

  function toggleParent(parentId: string, childIds: string[]) {
    const allChildIds = [parentId, ...childIds];
    const allSelected = allChildIds.every((id) => filters.categoryIds.includes(id));
    const ids = allSelected
      ? filters.categoryIds.filter((id) => !allChildIds.includes(id))
      : [...new Set([...filters.categoryIds, ...allChildIds])];
    setFilters({ categoryIds: ids });
  }

  function toggleType(type: TransactionType) {
    const types = filters.transactionTypes.includes(type)
      ? filters.transactionTypes.filter((t) => t !== type)
      : [...filters.transactionTypes, type];
    setFilters({ transactionTypes: types });
  }

  function clearAll() {
    setFilters({ categoryIds: [], transactionTypes: [], searchQuery: '', amountMin: null, amountMax: null });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DateRangePicker />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={filters.searchQuery}
          onChange={(e) => setFilters({ searchQuery: e.target.value })}
          className="pl-8 h-8 w-40 text-sm"
        />
      </div>

      {/* Category filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5 h-8')}>
          <Filter className="size-3.5" />
          Categories
          {filters.categoryIds.length > 0 && (
            <Badge className="ml-1 h-4 px-1 text-xs">{filters.categoryIds.length}</Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto min-w-52">
          {rootExpenseCategories.map((parent, i) => {
            const children = getChildCategories(parent.id);
            const allIds = [parent.id, ...children.map((c) => c.id)];
            const someSelected = allIds.some((id) => filters.categoryIds.includes(id));
            const allSelected = allIds.every((id) => filters.categoryIds.includes(id));
            return (
              <div key={parent.id}>
                {i > 0 && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold"
                  onClick={() => toggleParent(parent.id, children.map((c) => c.id))}
                  closeOnClick={false}
                >
                  <span
                    className={cn(
                      'size-3.5 rounded-sm border flex items-center justify-center shrink-0',
                      allSelected ? 'bg-primary border-primary' : someSelected ? 'bg-primary/40 border-primary/40' : 'border-muted-foreground/30'
                    )}
                  />
                  {parent.icon} {parent.name}
                </DropdownMenuItem>
                {children.map((child) => (
                  <DropdownMenuCheckboxItem
                    key={child.id}
                    checked={filters.categoryIds.includes(child.id)}
                    onCheckedChange={() => toggleCategory(child.id)}
                    className="pl-6 text-xs"
                  >
                    {child.icon} {child.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Type filter */}
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'gap-1.5 h-8')}>
          Type
          {filters.transactionTypes.length > 0 && (
            <Badge className="ml-1 h-4 px-1 text-xs">{filters.transactionTypes.length}</Badge>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {TYPES.map((t) => (
            <DropdownMenuCheckboxItem
              key={t.value}
              checked={filters.transactionTypes.includes(t.value)}
              onCheckedChange={() => toggleType(t.value)}
            >
              {t.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground" onClick={clearAll}>
          <X className="size-3.5" /> Clear
        </Button>
      )}
    </div>
  );
}
