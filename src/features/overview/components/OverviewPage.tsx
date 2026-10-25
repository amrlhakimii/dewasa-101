import {
  Banknote,
  Car,
  GraduationCap,
  Home,
  Landmark,
  PiggyBank,
  Scale,
  Wallet,
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { chartTooltipProps } from '@/components/ui/chart';
import { StatCard } from '@/components/ui/stat-card';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { useFinanceStore } from '@/stores/useFinanceStore';
import { formatCurrency, formatPercent, formatRiskLevel } from '@/utils/formatters';
import type { DsrRiskLevel } from '@/types/finance';

const RISK_TONE: Record<DsrRiskLevel, 'success' | 'warning' | 'danger'> = {
  SAFE: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
};

interface OverviewPageProps {
  onNavigate: (tab: string) => void;
}

const QUICK_ACTIONS: { question: string; tab: string; icon: typeof Car }[] = [
  { question: 'Nak semak gaji?', tab: 'income', icon: Wallet },
  { question: 'Nak semak hutang?', tab: 'commitments', icon: Scale },
  { question: 'Nak sewa rumah?', tab: 'housing', icon: Home },
  { question: 'Nak beli kereta?', tab: 'simulation', icon: Car },
  { question: 'Nak kira cukai?', tab: 'tax', icon: Landmark },
  { question: 'Nak kira zakat?', tab: 'zakat', icon: Banknote },
  { question: 'Nak tengok KWSP?', tab: 'retirement', icon: PiggyBank },
  { question: 'Nak belajar asas kewangan?', tab: 'guide', icon: GraduationCap },
];

export function OverviewPage({ onNavigate }: OverviewPageProps) {
  const grossSalary = useFinanceStore((s) => s.grossSalary);
  const taxableAllowances = useFinanceStore((s) => s.taxableAllowances);
  const { deductions, monthlyPcb, netMonthlyIncome, totalMonthlyDebt, dsr, dsrRisk, taxState } = useDerivedFinance();

  const monthlyGross = grossSalary + taxableAllowances;
  const takeHomePercent = monthlyGross > 0 ? (netMonthlyIncome / monthlyGross) * 100 : 0;

  const breakdown = [
    {
      name: 'Gaji bersih',
      value: Math.max(0, monthlyGross - deductions.epfEmployee - deductions.socso - deductions.eis - monthlyPcb),
      fill: 'var(--color-brand-500)',
    },
    { name: 'KWSP', value: deductions.epfEmployee, fill: 'var(--color-brand-300)' },
    { name: 'PERKESO + SIP', value: deductions.socso + deductions.eis, fill: 'var(--color-warning)' },
    { name: 'Cukai (PCB)', value: monthlyPcb, fill: '#a1a1aa' },
  ].filter((slice) => slice.value > 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Hero */}
      <Card className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 100% 0%, rgba(190,18,60,0.28), transparent 55%), radial-gradient(circle at 0% 100%, rgba(190,18,60,0.10), transparent 50%)',
          }}
        />
        {monthlyGross > 0 ? (
          <div className="relative p-6 sm:p-8">
            <p className="label-eyebrow flex items-center gap-2 text-brand-300">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" style={{ boxShadow: '0 0 8px rgba(225,29,72,0.8)' }} />
              Gaji bersih bulan ini
            </p>
            <p className="tabular-nums mt-2 text-4xl font-extrabold tracking-tight text-text-h sm:text-5xl">
              {formatCurrency(netMonthlyIncome)}
            </p>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                style={{ width: `${Math.min(100, takeHomePercent)}%`, boxShadow: '0 0 12px rgba(190,18,60,0.6)' }}
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Badge tone="accent">{formatPercent(takeHomePercent)}</Badge>
              <span className="text-text">
                daripada gaji kasar {formatCurrency(monthlyGross)} masuk akaun bank anda
              </span>
            </div>
          </div>
        ) : (
          <div className="relative p-6 sm:p-8">
            <EmptyState
              icon={Wallet}
              title="Gaji bersih anda belum dikira"
              description="Masukkan gaji pokok untuk lihat berapa sebenarnya masuk akaun bank selepas KWSP, PERKESO, SIP dan cukai."
            />
            <div className="flex justify-center">
              <Button type="button" onClick={() => onNavigate('income')}>
                Masukkan gaji
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Gaji kasar bulanan"
          value={formatCurrency(monthlyGross)}
          icon={Wallet}
          caption="Gaji pokok + elaun bercukai"
        />
        <StatCard
          label="Potongan statutori"
          value={formatCurrency(deductions.epfEmployee + deductions.socso + deductions.eis)}
          icon={PiggyBank}
          caption="KWSP + PERKESO + SIP"
        />
        <StatCard
          label="Nisbah Khidmat Hutang"
          value={formatPercent(dsr)}
          icon={Scale}
          tone={RISK_TONE[dsrRisk]}
          caption={`${formatRiskLevel(dsrRisk)} · ${formatCurrency(totalMonthlyDebt)}/bln komitmen`}
        />
        <StatCard
          label="Cukai perlu dibayar setahun"
          value={formatCurrency(taxState.finalTaxPayable)}
          icon={Landmark}
          caption={`Selepas rebat zakat ${formatCurrency(taxState.zakatPaid)}`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      {/* Breakdown donut */}
      <Card className="flex flex-col lg:col-span-3">
        <CardHeader>
          <CardTitle>Ke mana perginya gaji anda</CardTitle>
          <CardDescription>Gaji kasar bulanan, mengikut destinasi.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center">
          <div className="flex w-full flex-col items-center gap-6 sm:flex-row">
            <div className="relative h-52 w-52 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={breakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={66}
                    outerRadius={92}
                    paddingAngle={3}
                    cornerRadius={6}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                  >
                    {breakdown.map((slice) => (
                      <Cell key={slice.name} fill={slice.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} {...chartTooltipProps} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="tabular-nums text-2xl font-extrabold tracking-tight text-text-h">
                  {formatPercent(takeHomePercent, 0)}
                </span>
                <span className="label-eyebrow">masuk bank</span>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3">
              {breakdown.map((slice) => {
                const share = monthlyGross > 0 ? (slice.value / monthlyGross) * 100 : 0;
                return (
                  <div key={slice.name}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-text">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: slice.fill }} />
                        {slice.name}
                        <span className="text-xs text-text/60">{formatPercent(share, 0)}</span>
                      </span>
                      <span className="tabular-nums font-semibold text-text-h">{formatCurrency(slice.value)}</span>
                    </div>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/5">
                      <div className="h-full rounded-full" style={{ width: `${share}%`, background: slice.fill }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Nak buat apa hari ini?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ question, tab, icon: Icon }) => (
              <button
                key={tab}
                type="button"
                onClick={() => onNavigate(tab)}
                className="flex min-w-0 cursor-pointer flex-col items-start gap-2 rounded-xl border border-hairline bg-bg/60 px-4 py-3 text-left transition-all hover:border-brand-500/40 hover:bg-brand-500/10 active:scale-95"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                  <Icon size={16} />
                </span>
                <span className="text-sm font-semibold text-text-h">{question}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
