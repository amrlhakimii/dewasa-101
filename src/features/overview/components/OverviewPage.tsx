import { Banknote, HandCoins, Landmark, PiggyBank, Scale, Wallet } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { useFinanceStore } from '@/stores/useFinanceStore';
import { formatCurrency, formatPercent } from '@/utils/formatters';
import type { DsrRiskLevel } from '@/types/finance';

const RISK_TONE: Record<DsrRiskLevel, 'success' | 'warning' | 'danger'> = {
  SAFE: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
};

const RISK_COPY: Record<DsrRiskLevel, string> = {
  SAFE: "You're in good shape — most banks will approve new financing at this level.",
  WARNING: 'Getting tight. Still approvable, but with less room to breathe.',
  DANGER: 'Over the typical 60% ceiling. New loan applications will likely be rejected.',
};

interface OverviewPageProps {
  onNavigate: (tab: string) => void;
}

export function OverviewPage({ onNavigate }: OverviewPageProps) {
  const grossSalary = useFinanceStore((s) => s.grossSalary);
  const taxableAllowances = useFinanceStore((s) => s.taxableAllowances);
  const { deductions, monthlyPcb, netMonthlyIncome, totalMonthlyDebt, dsr, dsrRisk, taxState } = useDerivedFinance();

  const monthlyGross = grossSalary + taxableAllowances;
  const takeHomePercent = monthlyGross > 0 ? (netMonthlyIncome / monthlyGross) * 100 : 0;

  const breakdown = [
    { name: 'Net pay', value: Math.max(0, monthlyGross - deductions.epfEmployee - deductions.socso - deductions.eis - monthlyPcb), fill: 'var(--color-brand-600)' },
    { name: 'EPF', value: deductions.epfEmployee, fill: 'var(--color-brand-300)' },
    { name: 'SOCSO + EIS', value: deductions.socso + deductions.eis, fill: 'var(--color-warning)' },
    { name: 'Tax (PCB)', value: monthlyPcb, fill: 'var(--color-danger)' },
  ].filter((slice) => slice.value > 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
          <p className="label-eyebrow text-brand-100">Net take-home pay, this month</p>
          <p className="font-display mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {formatCurrency(netMonthlyIncome)}
          </p>
          <p className="mt-2 text-sm text-brand-50/90">
            {formatPercent(takeHomePercent)} of your {formatCurrency(monthlyGross)} gross salary lands in your bank
            account
          </p>
        </div>
      </Card>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Gross monthly income"
          value={formatCurrency(monthlyGross)}
          icon={Wallet}
          caption="Basic + taxable allowances"
        />
        <StatCard
          label="Statutory deductions"
          value={formatCurrency(deductions.epfEmployee + deductions.socso + deductions.eis)}
          icon={PiggyBank}
          caption="EPF + SOCSO + EIS"
        />
        <StatCard
          label="Debt Service Ratio"
          value={formatPercent(dsr)}
          icon={Scale}
          tone={RISK_TONE[dsrRisk]}
          caption={`${dsrRisk} · ${formatCurrency(totalMonthlyDebt)}/mo committed`}
        />
        <StatCard
          label="Annual tax payable"
          value={formatCurrency(taxState.finalTaxPayable)}
          icon={Landmark}
          caption={`After ${formatCurrency(taxState.zakatPaid)} zakat rebate`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {/* Breakdown donut */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Where your paycheck goes</CardTitle>
            <CardDescription>Monthly gross salary, split by destination.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="h-52 w-52 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={58} outerRadius={84} paddingAngle={2}>
                      {breakdown.map((slice) => (
                        <Cell key={slice.name} fill={slice.fill} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value))}
                      contentStyle={{
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex w-full flex-col gap-2">
                {breakdown.map((slice) => (
                  <div key={slice.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-text">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: slice.fill }} />
                      {slice.name}
                    </span>
                    <span className="font-semibold text-text-h">{formatCurrency(slice.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DSR risk + quick actions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Loan readiness</CardTitle>
            <Badge tone={RISK_TONE[dsrRisk]}>{dsrRisk}</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-text">{RISK_COPY[dsrRisk]}</p>

            <button
              type="button"
              onClick={() => onNavigate('commitments')}
              className="flex items-center justify-between rounded-xl border border-border bg-surface-muted px-4 py-3 text-left text-sm font-semibold text-text-h transition-colors hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <HandCoins size={16} className="text-brand-300" /> Review debts &amp; DSR
              </span>
              <span className="text-text">&rarr;</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('tax')}
              className="flex items-center justify-between rounded-xl border border-border bg-surface-muted px-4 py-3 text-left text-sm font-semibold text-text-h transition-colors hover:bg-white/5"
            >
              <span className="flex items-center gap-2">
                <Banknote size={16} className="text-brand-300" /> Optimise tax &amp; zakat
              </span>
              <span className="text-text">&rarr;</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
