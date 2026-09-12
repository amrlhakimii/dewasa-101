import { RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DSR_THRESHOLDS } from '@/config/statutory';
import { getRemainingDebtCapacity } from '@/features/debt-dsr/logic';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { formatCurrency, formatPercent, formatRiskLevel } from '@/utils/formatters';
import type { DsrRiskLevel } from '@/types/finance';

const RISK_TONE: Record<DsrRiskLevel, 'success' | 'warning' | 'danger'> = {
  SAFE: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
};

const RISK_COLOR: Record<DsrRiskLevel, string> = {
  SAFE: 'var(--color-success)',
  WARNING: 'var(--color-warning)',
  DANGER: 'var(--color-danger)',
};

const RISK_COPY: Record<DsrRiskLevel, string> = {
  SAFE: 'Selesa. Kebanyakan bank akan meluluskan pembiayaan baharu pada tahap ini.',
  WARNING: 'Semakin ketat. Bank mungkin masih luluskan, tetapi ruang semakin sempit.',
  DANGER: 'Melebihi siling 60% biasa. Permohonan pinjaman baharu berkemungkinan ditolak.',
};

export function DsrGaugeometer() {
  const { totalMonthlyDebt, netMonthlyIncome, dsr, dsrRisk } = useDerivedFinance();
  const remainingCapacity = getRemainingDebtCapacity(netMonthlyIncome, totalMonthlyDebt, DSR_THRESHOLDS.WARNING_MAX);

  const gaugeData = [{ name: 'DSR', value: Math.min(dsr, 100), fill: RISK_COLOR[dsrRisk] }];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Nisbah Khidmat Hutang (DSR)</CardTitle>
        <Badge tone={RISK_TONE[dsrRisk]}>{formatRiskLevel(dsrRisk)}</Badge>
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={gaugeData}
              startAngle={90}
              endAngle={-270}
              innerRadius="75%"
              outerRadius="100%"
              barSize={16}
            >
              <RadialBar dataKey="value" background={{ fill: 'var(--color-surface-muted)' }} cornerRadius={8} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-text-h">{formatPercent(dsr)}</span>
            <span className="text-xs text-text">daripada gaji bersih</span>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-text">{RISK_COPY[dsrRisk]}</p>

        <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-text">Jumlah komitmen bulanan</span>
            <span className="font-medium text-text-h">{formatCurrency(totalMonthlyDebt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text">Gaji bersih bulanan</span>
            <span className="font-medium text-text-h">{formatCurrency(netMonthlyIncome)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text">Ruang tersisa sebelum siling 60%</span>
            <span className="font-medium text-success">{formatCurrency(remainingCapacity)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
