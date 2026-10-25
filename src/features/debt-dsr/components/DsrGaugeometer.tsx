import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from 'recharts';
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

const RISK_GLOW: Record<DsrRiskLevel, string> = {
  SAFE: 'rgba(74, 222, 128, 0.35)',
  WARNING: 'rgba(251, 191, 36, 0.35)',
  DANGER: 'rgba(248, 113, 113, 0.4)',
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
      <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
        <CardTitle>Nisbah Khidmat Hutang (DSR)</CardTitle>
        <Badge tone={RISK_TONE[dsrRisk]} className="shrink-0">
          {formatRiskLevel(dsrRisk)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto h-52 w-52" style={{ filter: `drop-shadow(0 0 14px ${RISK_GLOW[dsrRisk]})` }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              data={gaugeData}
              startAngle={90}
              endAngle={-270}
              innerRadius="78%"
              outerRadius="100%"
              barSize={14}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
              <RadialBar dataKey="value" background={{ fill: 'rgba(255,255,255,0.05)' }} cornerRadius={8} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="tabular-nums text-4xl font-extrabold tracking-tight text-text-h">{formatPercent(dsr)}</span>
            <span className="label-eyebrow mt-1">daripada gaji bersih</span>
          </div>
        </div>

        <div className="mt-5">
          <div className="relative h-2 w-full overflow-hidden rounded-full">
            <div className="absolute inset-y-0 left-0 bg-success/70" style={{ width: `${DSR_THRESHOLDS.SAFE_MAX}%` }} />
            <div
              className="absolute inset-y-0 bg-warning/70"
              style={{ left: `${DSR_THRESHOLDS.SAFE_MAX}%`, width: `${DSR_THRESHOLDS.WARNING_MAX - DSR_THRESHOLDS.SAFE_MAX}%` }}
            />
            <div
              className="absolute inset-y-0 right-0 bg-danger/70"
              style={{ left: `${DSR_THRESHOLDS.WARNING_MAX}%` }}
            />
          </div>
          <div className="relative -mt-3.5 h-5">
            <span
              className="absolute top-0 h-5 w-1 -translate-x-1/2 rounded-full bg-text-h shadow-card"
              style={{ left: `${Math.min(dsr, 100)}%` }}
            />
          </div>
          <div className="relative mt-1 flex justify-between text-[11px] text-text/70">
            <span>0%</span>
            <span className="absolute -translate-x-1/2" style={{ left: `${DSR_THRESHOLDS.SAFE_MAX}%` }}>
              {DSR_THRESHOLDS.SAFE_MAX}%
            </span>
            <span className="absolute -translate-x-1/2" style={{ left: `${DSR_THRESHOLDS.WARNING_MAX}%` }}>
              {DSR_THRESHOLDS.WARNING_MAX}%
            </span>
            <span>100%</span>
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
