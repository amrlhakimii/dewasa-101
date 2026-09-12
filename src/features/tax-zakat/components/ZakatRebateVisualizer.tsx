import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateLHDNTax } from '@/features/tax-zakat/logic';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { formatCurrency } from '@/utils/formatters';

export function ZakatRebateVisualizer() {
  const { annualIncome, taxState, zakatPendapatan, zakatFitrah } = useDerivedFinance();

  const taxBeforeRelief = calculateLHDNTax(annualIncome, 0);

  const chartData = [
    { name: 'Tax\n(no relief)', value: taxBeforeRelief, fill: 'var(--color-text)' },
    { name: 'Tax\n(with relief)', value: taxState.baseTaxPayable, fill: 'var(--color-accent)' },
    { name: 'Zakat\npaid', value: taxState.zakatPaid, fill: 'var(--color-success)' },
    { name: 'Final tax\n(after rebate)', value: taxState.finalTaxPayable, fill: 'var(--color-danger)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>LHDN vs Zakat: how the rebate works</CardTitle>
        <CardDescription>
          Tax relief shrinks your taxable income before rates apply. Zakat is a direct, dollar-for-dollar
          rebate against the tax bill itself — Section 6A(3).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--color-text)' }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-text)' }} width={70} tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-success-bg px-3 py-2">
            <p className="text-text">Zakat Pendapatan</p>
            <p className="font-semibold text-success">{formatCurrency(zakatPendapatan)}</p>
          </div>
          <div className="rounded-xl bg-success-bg px-3 py-2">
            <p className="text-text">Zakat Fitrah</p>
            <p className="font-semibold text-success">{formatCurrency(zakatFitrah)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
