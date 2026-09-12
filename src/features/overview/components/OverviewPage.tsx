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
  { question: 'Nak beli kereta?', tab: 'simulation', icon: Car },
  { question: 'Nak sewa rumah?', tab: 'housing', icon: Home },
  { question: 'Nak kira zakat?', tab: 'zakat', icon: Banknote },
  { question: 'Nak kira cukai?', tab: 'tax', icon: Landmark },
  { question: 'Nak tengok KWSP?', tab: 'retirement', icon: PiggyBank },
  { question: 'Nak semak hutang?', tab: 'commitments', icon: Scale },
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
      fill: 'var(--color-brand-600)',
    },
    { name: 'KWSP', value: deductions.epfEmployee, fill: 'var(--color-brand-300)' },
    { name: 'PERKESO + SIP', value: deductions.socso + deductions.eis, fill: 'var(--color-warning)' },
    { name: 'Cukai (PCB)', value: monthlyPcb, fill: 'var(--color-danger)' },
  ].filter((slice) => slice.value > 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
          <p className="label-eyebrow text-brand-100">Gaji bersih bulan ini</p>
          <p className="font-display mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {formatCurrency(netMonthlyIncome)}
          </p>
          <p className="mt-2 text-sm text-brand-50/90">
            {formatPercent(takeHomePercent)} daripada gaji kasar {formatCurrency(monthlyGross)} masuk akaun bank
            anda
          </p>
        </div>
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

      {/* Breakdown donut */}
      <Card>
        <CardHeader>
          <CardTitle>Ke mana perginya gaji anda</CardTitle>
          <CardDescription>Gaji kasar bulanan, mengikut destinasi.</CardDescription>
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

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Nak buat apa hari ini?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {QUICK_ACTIONS.map(({ question, tab, icon: Icon }) => (
              <button
                key={tab}
                type="button"
                onClick={() => onNavigate(tab)}
                className="flex flex-col items-start gap-2 rounded-xl border border-border bg-surface-muted px-4 py-3 text-left transition-colors hover:bg-white/5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                  <Icon size={16} />
                </span>
                <span className="text-sm font-semibold text-text-h">{question}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
