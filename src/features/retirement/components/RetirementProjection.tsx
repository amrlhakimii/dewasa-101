import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES, KWSP_DEFAULT_DIVIDEND_RATE, KWSP_DEFAULT_RETIREMENT_AGE } from '@/config/statutory';
import { projectRetirementBalance } from '@/features/retirement/logic';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { formatCurrency } from '@/utils/formatters';

export function RetirementProjection() {
  const { deductions } = useDerivedFinance();
  const [currentAge, setCurrentAge] = useState(25);
  const [retirementAge, setRetirementAge] = useState(KWSP_DEFAULT_RETIREMENT_AGE);
  const [currentBalance, setCurrentBalance] = useState(15000);
  const [dividendRatePercent, setDividendRatePercent] = useState(KWSP_DEFAULT_DIVIDEND_RATE * 100);

  const annualContribution = (deductions.epfEmployee + deductions.epfEmployer) * 12;
  const result = projectRetirementBalance(
    currentAge,
    retirementAge,
    currentBalance,
    annualContribution,
    dividendRatePercent / 100,
  );

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Simpanan KWSP</CardTitle>
          <CardDescription>Anggaran pertumbuhan simpanan persaraan anda.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentAge">Umur sekarang</Label>
              <NumberField id="currentAge" value={currentAge} onValueChange={setCurrentAge} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="retirementAge">Umur persaraan</Label>
              <NumberField id="retirementAge" value={retirementAge} onValueChange={setRetirementAge} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currentBalance">Baki KWSP semasa (RM)</Label>
            <NumberField id="currentBalance" value={currentBalance} onValueChange={setCurrentBalance} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dividendRate">Kadar dividen dijangka (% setahun)</Label>
            <NumberField id="dividendRate" value={dividendRatePercent} onValueChange={setDividendRatePercent} />
          </div>

          <div className="rounded-xl bg-surface-muted px-3 py-2 text-sm">
            <span className="text-text">Caruman tahunan (dari halaman Pendapatan)</span>
            <p className="font-semibold text-text-h">{formatCurrency(annualContribution)}/tahun</p>
          </div>

          <SourceNote label="KWSP — Kadar Dividen Rasmi" href={DATA_SOURCES.KWSP} />
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Unjuran hingga umur {retirementAge}</CardTitle>
          <CardDescription>Andaian caruman &amp; dividen kekal sama sepanjang tempoh.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-5 text-white">
            <p className="label-eyebrow text-brand-100">Anggaran baki semasa bersara</p>
            <p className="font-display mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {formatCurrency(result.finalBalance)}
            </p>
          </div>

          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.points} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <defs>
                  <linearGradient id="kwspFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="age" tick={{ fontSize: 11, fill: 'var(--color-text)' }} />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-text)' }}
                  width={70}
                  tickFormatter={(v) => formatCurrency(v)}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(age) => `Umur ${age}`}
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="balance" stroke="var(--color-brand-500)" fill="url(#kwspFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
