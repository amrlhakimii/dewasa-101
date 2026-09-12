import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES, NISAB_ESTIMATED_VALUE } from '@/config/statutory';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { formatCurrency } from '@/utils/formatters';

export function ZakatBreakdownCard() {
  const { zakatPendapatan, zakatFitrah, taxState } = useDerivedFinance();
  const totalZakat = zakatPendapatan + zakatFitrah;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anggaran Zakat</CardTitle>
        <CardDescription>
          Zakat ialah rebat terus (dolar-untuk-dolar) terhadap cukai anda, bukan sekadar pelepasan — Seksyen 6A(3).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl bg-surface-muted px-4 py-3">
          <p className="text-sm text-text">Jumlah zakat tahunan</p>
          <p className="text-3xl font-bold text-accent">{formatCurrency(totalZakat)}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-success-bg px-3 py-2">
            <p className="text-text">Zakat Pendapatan</p>
            <p className="font-semibold text-success">{formatCurrency(zakatPendapatan)}</p>
            <p className="mt-1 text-xs text-text">
              2.5% pendapatan/simpanan tahunan sebaik cukup Nisab ({formatCurrency(NISAB_ESTIMATED_VALUE)})
            </p>
          </div>
          <div className="rounded-xl bg-success-bg px-3 py-2">
            <p className="text-text">Zakat Fitrah</p>
            <p className="font-semibold text-success">{formatCurrency(zakatFitrah)}</p>
            <p className="mt-1 text-xs text-text">Mengikut negeri &amp; gred beras</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm">
          <span className="text-text">Rebat ini mengurangkan cukai anda sebanyak</span>
          <span className="font-semibold text-brand-300">{formatCurrency(taxState.zakatPaid)}</span>
        </div>

        <SourceNote label="Lembaga Zakat Selangor — Zakat Pendapatan" href={DATA_SOURCES.ZAKAT_PENDAPATAN} />
        <SourceNote label="Jabatan Mufti Negeri — Kadar Zakat Fitrah" href={DATA_SOURCES.ZAKAT_FITRAH} />
      </CardContent>
    </Card>
  );
}
