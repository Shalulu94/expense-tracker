'use client';

import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import { CHART_COLORS, CHART_TOOLTIP_STYLE } from '@/lib/constants/chart-theme';
import { formatCurrency } from '@/lib/utils/currency';
import type { CategoryBreakdown } from '@/types/finance';
import { ChartContainer } from './ChartContainer';
import { EmptyState } from '../EmptyState';

interface DonutChartProps {
  data: CategoryBreakdown[];
  isLoading?: boolean;
  currency?: string;
}

function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) {
  if (!percent || percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const cxNum = Number(cx);
  const cyNum = Number(cy);
  const irNum = Number(innerRadius);
  const orNum = Number(outerRadius);
  const midAngleNum = Number(midAngle);
  const radius = irNum + (orNum - irNum) * 0.5;
  const x = cxNum + radius * Math.cos(-midAngleNum * RADIAN);
  const y = cyNum + radius * Math.sin(-midAngleNum * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function DonutChart({ data, isLoading, currency = 'USD' }: DonutChartProps) {
  const chartData = data.map((b) => ({
    name: b.category.name,
    value: b.amount,
    color: b.category.color,
  }));

  return (
    <ChartContainer title="Spending by Category" isLoading={isLoading}>
      {chartData.length === 0 ? (
        <EmptyState title="No expenses yet" description="Add transactions to see category breakdown" />
      ) : (
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={CustomLabel}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            {...CHART_TOOLTIP_STYLE}
            formatter={(value) => [formatCurrency(Number(value), currency), 'Amount']}
          />
          <Legend
            formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>}
          />
        </PieChart>
      )}
    </ChartContainer>
  );
}
