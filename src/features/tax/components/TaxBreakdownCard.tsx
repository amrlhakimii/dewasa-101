import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES } from '@/config/statutory';
import { calculateLHDNTax } from '@/features/tax/logic';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { formatCurrency } from '@/utils/formatters';

export function TaxBreakdownCard() {
  const { annualIncome, taxState } = useDerivedFinance();

  const taxBeforeRelief = calculateLHDNTax(annualIncome, 0);

  const chartData = [
    { name: 'Tiada\npelepasan', value: taxBeforeRelief, fill: 'var(--color-text)' },
    { name: 'Dengan\npelepasan', value: taxState.baseTaxPayable, fill: 'var(--color-accent)' },
    { name: 'Cukai akhir\n(selepas rebat)', value: taxState.finalTaxPayable, fill: 'var(--color-danger)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anggaran Cukai Pendapatan (LHDN)</CardTitle>
        <CardDescription>
          Pelepasan cukai mengecilkan pendapatan bercukai sebelum kadar dikenakan. Baki akhir di bawah sudah
          termasuk rebat zakat {formatCurrency(taxState.zakatPaid)} dari halaman Zakat.
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

        <div className="mt-4 rounded-xl bg-surface-muted px-3 py-2">
          <p className="text-sm text-text">Cukai perlu dibayar setahun</p>
          <p className="text-2xl font-bold text-text-h">{formatCurrency(taxState.finalTaxPayable)}</p>
        </div>

        <SourceNote label="Lembaga Hasil Dalam Negeri (LHDN) — Kadar Cukai" href={DATA_SOURCES.LHDN_TAX_RATE} />
      </CardContent>
    </Card>
  );
}
