'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { CHART_COLORS, CHART_TOOLTIP_STYLE, CHART_GRID_STYLE, CHART_AXIS_TICK } from '@/lib/constants/chart-theme';
import { formatCurrencyCompact, formatCurrency } from '@/lib/utils/currency';
import { formatShortDate, toMonthKey } from '@/lib/utils/date';
import { ChartContainer } from './ChartContainer';
import { EmptyState } from '../EmptyState';
import type { Transaction } from '@/types/finance';
import { useMemo } from 'react';

interface SpendingAreaChartProps {
  transactions: Transaction[];
  dateRange: { from: string; to: string };
  isLoading?: boolean;
  currency?: string;
}

export function SpendingAreaChart({ transactions, dateRange, isLoading, currency = 'USD' }: SpendingAreaChartProps) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      if (t.date < dateRange.from || t.date > dateRange.to) continue;
      map.set(t.date, (map.get(t.date) ?? 0) + t.amount);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, amount]) => ({ date, amount, label: formatShortDate(date) }));
  }, [transactions, dateRange]);

  return (
    <ChartContainer title="Spending Over Time">
      {data.length === 0 ? (
        <EmptyState title="No data" description="No expenses in the selected period" />
      ) : (
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...CHART_GRID_STYLE} vertical={false} />
          <XAxis dataKey="label" tick={CHART_AXIS_TICK} tickLine={false} axisLine={false} />
          <YAxis
            tick={CHART_AXIS_TICK}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatCurrencyCompact(v, currency)}
          />
          <Tooltip
            {...CHART_TOOLTIP_STYLE}
            formatter={(v) => [formatCurrency(Number(v), currency), 'Spent']}
            labelFormatter={(label) => label}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={CHART_COLORS[0]}
            strokeWidth={2}
            fill="url(#spendGradient)"
          />
        </AreaChart>
      )}
    </ChartContainer>
  );
}
