// Shared recharts styling so every chart reads as one system: glass tooltip,
// hairline dashed grid, muted ticks, no axis lines.

export const chartTooltipProps = {
  contentStyle: {
    background: 'rgba(18, 18, 20, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(244, 244, 245, 0.08)',
    borderRadius: 12,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
    fontSize: 12,
    padding: '8px 12px',
  },
  labelStyle: { color: '#f4f4f5', fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: '#d4d4d8', padding: 0 },
  cursor: { fill: 'rgba(255, 255, 255, 0.04)', stroke: 'rgba(225, 29, 72, 0.4)' },
} as const;

export const axisTick = { fontSize: 11, fill: '#71717a' } as const;

export const gridProps = {
  stroke: 'rgba(244, 244, 245, 0.06)',
  strokeDasharray: '4 4',
  vertical: false,
} as const;
