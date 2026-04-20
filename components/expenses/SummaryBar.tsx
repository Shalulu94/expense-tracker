'use client';

import { useState } from 'react';
import { useSummaryStats } from '@/lib/hooks/useSummaryStats';
import { useCategories } from '@/lib/hooks/useCategories';
import { StatCard } from '@/components/shared/StatCard';
import { formatCurrency } from '@/lib/utils/currency';
import { useAppStore } from '@/lib/store';
import { TrendingDown, Wallet, Calendar, Tag } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SummaryBarProps {
  currency?: string;
}

const ALL = '__all__';

export function SummaryBar({ currency = 'GBP' }: SummaryBarProps) {
  const [selectedParentId, setSelectedParentId] = useState<string>(ALL);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(ALL);

  const { rootExpenseCategories, getChildCategories } = useCategories();
  const isLoading = useAppStore((s) => s.isLoading);

  const subcategories = selectedParentId !== ALL ? getChildCategories(selectedParentId) : [];

  function handleParentChange(value: string) {
    setSelectedParentId(value);
    setSelectedSubcategoryId(ALL);
  }

  const categoryFilter = {
    parentId: selectedParentId !== ALL ? selectedParentId : null,
    categoryId: selectedSubcategoryId !== ALL ? selectedSubcategoryId : null,
  };

  const { summary } = useSummaryStats(categoryFilter);

  return (
    <div className="space-y-3">
      {/* Category filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={selectedParentId} onValueChange={(v) => handleParentChange(v ?? ALL)}>
          <SelectTrigger className="h-8 w-48 text-sm">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All categories</SelectItem>
            {rootExpenseCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {subcategories.length > 0 && (
          <Select value={selectedSubcategoryId} onValueChange={(v) => setSelectedSubcategoryId(v ?? ALL)}>
            <SelectTrigger className="h-8 w-48 text-sm">
              <SelectValue placeholder="All subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All subcategories</SelectItem>
              {subcategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Total Spent"
          value={formatCurrency(summary.totalSpent, currency)}
          icon={<TrendingDown className="size-4" />}
          isLoading={isLoading}
        />
        <StatCard
          label="Avg / Month"
          value={formatCurrency(summary.avgPerMonth, currency)}
          icon={<Calendar className="size-4" />}
          isLoading={isLoading}
        />
        <StatCard
          label="Transactions"
          value={summary.transactionCount.toString()}
          icon={<Wallet className="size-4" />}
          isLoading={isLoading}
        />
        <StatCard
          label="Top Category"
          value={
            summary.topCategory
              ? `${summary.topCategory.category.icon} ${summary.topCategory.category.name}`
              : '—'
          }
          subValue={
            summary.topCategory
              ? formatCurrency(summary.topCategory.amount, currency)
              : undefined
          }
          icon={<Tag className="size-4" />}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
