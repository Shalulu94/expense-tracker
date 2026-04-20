'use client';

import { useSummaryStats } from '@/lib/hooks/useSummaryStats';
import { StatCard } from '@/components/shared/StatCard';
import { formatCurrency } from '@/lib/utils/currency';
import { useAppStore } from '@/lib/store';
import { TrendingDown, TrendingUp, Wallet, Calendar, Tag } from 'lucide-react';

interface SummaryBarProps {
  currency?: string;
}

export function SummaryBar({ currency = 'GBP' }: SummaryBarProps) {
  const { summary } = useSummaryStats();
  const isLoading = useAppStore((s) => s.isLoading);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <StatCard
        label="Total Spent"
        value={formatCurrency(summary.totalSpent, currency)}
        icon={<TrendingDown className="size-4" />}
        isLoading={isLoading}
      />
      <StatCard
        label="Total Income"
        value={formatCurrency(summary.totalIncome, currency)}
        icon={<TrendingUp className="size-4" />}
        isLoading={isLoading}
      />
      <StatCard
        label="Net"
        value={formatCurrency(summary.netAmount, currency)}
        trend={summary.netAmount >= 0 ? 'up' : 'down'}
        isLoading={isLoading}
      />
      <StatCard
        label="Avg / Day"
        value={formatCurrency(summary.avgPerDay, currency)}
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
  );
}
