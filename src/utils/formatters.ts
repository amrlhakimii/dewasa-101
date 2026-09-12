const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return 'RM 0.00';
  return currencyFormatter.format(amount).replace('MYR', 'RM');
}

export function formatPercent(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-MY', { notation: 'compact' }).format(value);
}

const RISK_LABEL_MY: Record<'SAFE' | 'WARNING' | 'DANGER', string> = {
  SAFE: 'SELAMAT',
  WARNING: 'AMARAN',
  DANGER: 'BAHAYA',
};

export function formatRiskLevel(level: 'SAFE' | 'WARNING' | 'DANGER'): string {
  return RISK_LABEL_MY[level];
}
