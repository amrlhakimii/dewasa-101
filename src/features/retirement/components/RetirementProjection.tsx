import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { axisTick, chartTooltipProps, gridProps } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES } from '@/config/statutory';
import { projectRetirementBalance } from '@/features/retirement/logic';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { useFinanceStore } from '@/stores/useFinanceStore';
import { formatCompactNumber, formatCurrency } from '@/utils/formatters';

export function RetirementProjection() {
  const { deductions } = useDerivedFinance();
  const currentAge = useFinanceStore((s) => s.kwspCurrentAge);
  const retirementAge = useFinanceStore((s) => s.kwspRetirementAge);
  const currentBalance = useFinanceStore((s) => s.kwspCurrentBalance);
  const dividendRatePercent = useFinanceStore((s) => s.kwspDividendRatePercent);
  const setCurrentAge = useFinanceStore((s) => s.setKwspCurrentAge);
  const setRetirementAge = useFinanceStore((s) => s.setKwspRetirementAge);
  const setCurrentBalance = useFinanceStore((s) => s.setKwspCurrentBalance);
  const setDividendRatePercent = useFinanceStore((s) => s.setKwspDividendRatePercent);

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
          <div
            className="rounded-2xl border border-hairline p-5"
            style={{ background: 'radial-gradient(circle at 100% 0%, rgba(190,18,60,0.26), rgba(18,18,20,0.5) 60%)' }}
          >
            <p className="label-eyebrow text-brand-300">Anggaran baki semasa bersara</p>
            <p className="tabular-nums mt-1 text-3xl font-extrabold tracking-tight text-text-h sm:text-4xl">
              {formatCurrency(result.finalBalance)}
            </p>
          </div>

          <div className="mt-4 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.points} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="kwspFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e11d48" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="kwspStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#fda4af" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="age" tick={axisTick} axisLine={false} tickLine={false} minTickGap={16} />
                <YAxis
                  tick={axisTick}
                  width={60}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `RM${formatCompactNumber(v)}`}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  labelFormatter={(age) => `Umur ${age}`}
                  {...chartTooltipProps}
                  cursor={{ stroke: 'rgba(225, 29, 72, 0.4)', strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="url(#kwspStroke)"
                  fill="url(#kwspFill)"
                  strokeWidth={2.5}
                  activeDot={{ r: 5, fill: '#e11d48', stroke: '#f4f4f5', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
