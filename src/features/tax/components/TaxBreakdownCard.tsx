import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisTick, chartTooltipProps, gridProps } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES } from '@/config/statutory';
import { calculateLHDNTax } from '@/features/tax/logic';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { formatCompactNumber, formatCurrency } from '@/utils/formatters';

export function TaxBreakdownCard() {
  const { annualIncome, taxState } = useDerivedFinance();

  const taxBeforeRelief = calculateLHDNTax(annualIncome, 0);

  const chartData = [
    { name: 'Asal', value: taxBeforeRelief, fill: '#a1a1aa' },
    { name: 'Pelepasan', value: taxState.baseTaxPayable, fill: '#e11d48' },
    { name: 'Akhir', value: taxState.finalTaxPayable, fill: '#fda4af' },
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
            <BarChart data={chartData} margin={{ top: 24, right: 8, left: 0, bottom: 0 }}>
              <defs>
                {chartData.map((entry, i) => (
                  <linearGradient key={entry.name} id={`taxBar${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={entry.fill} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.fill} stopOpacity={0.45} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="name" tick={axisTick} interval={0} axisLine={false} tickLine={false} />
              <YAxis
                tick={axisTick}
                width={60}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `RM${formatCompactNumber(v)}`}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} {...chartTooltipProps} />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} maxBarSize={64}>
                {chartData.map((entry, i) => (
                  <Cell key={entry.name} fill={`url(#taxBar${i})`} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v) => `RM${formatCompactNumber(Number(v))}`}
                  style={{ fill: '#f4f4f5', fontSize: 11, fontWeight: 600 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 rounded-xl bg-surface-muted px-3 py-2">
          <p className="text-sm text-text">Cukai perlu dibayar setahun</p>
          <p className="tabular-nums text-2xl font-extrabold tracking-tight text-text-h">{formatCurrency(taxState.finalTaxPayable)}</p>
        </div>

        <SourceNote label="Lembaga Hasil Dalam Negeri (LHDN) — Kadar Cukai" href={DATA_SOURCES.LHDN_TAX_RATE} />
      </CardContent>
    </Card>
  );
}
