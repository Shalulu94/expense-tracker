'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_COLORS, CHART_TOOLTIP_STYLE, CHART_GRID_STYLE, CHART_AXIS_TICK } from '@/lib/constants/chart-theme';
import { formatCurrencyCompact, formatCurrency } from '@/lib/utils/currency';
import { formatMonth } from '@/lib/utils/date';
import { ChartContainer } from './ChartContainer';
import { EmptyState } from '../EmptyState';
import type { MonthlyTotals } from '@/types/finance';

interface MonthlyBarChartProps {
  data: MonthlyTotals[];
  isLoading?: boolean;
  currency?: string;
}

export function MonthlyBarChart({ data, isLoading, currency = 'GBP' }: MonthlyBarChartProps) {
  const chartData = data
    .slice(-6) // last 6 months
    .map((m) => ({ ...m, label: formatMonth(m.month) }));

  return (
    <ChartContainer title="Monthly Overview" description="Last 6 months" isLoading={isLoading}>
      {chartData.length === 0 ? (
        <EmptyState title="No data" description="Add expenses to see monthly comparison" />
      ) : (
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
            formatter={(v) => formatCurrency(Number(v), currency)}
          />
          <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
          <Bar dataKey="expense" name="Expenses" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
          <Bar dataKey="income" name="Income" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </ChartContainer>
  );
}
