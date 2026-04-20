// Shared Recharts configuration — used by all modules for visual consistency.
// Colors reference CSS custom properties so dark mode works automatically.

export const CHART_COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
  'var(--color-chart-6)',
  'var(--color-chart-7)',
  'var(--color-chart-8)',
];

export const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    background: 'var(--color-card)',
    border: '1px solid var(--color-border)',
    borderRadius: '8px',
    fontSize: '13px',
    color: 'var(--color-foreground)',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
  itemStyle: {
    color: 'var(--color-foreground)',
  },
  labelStyle: {
    color: 'var(--color-muted-foreground)',
    fontWeight: 500,
  },
};

export const CHART_GRID_STYLE = {
  stroke: 'var(--color-border)',
  strokeDasharray: '3 3',
};

export const CHART_AXIS_TICK = {
  fill: 'var(--color-muted-foreground)',
  fontSize: 12,
};
