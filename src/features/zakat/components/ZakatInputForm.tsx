import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { MALAYSIAN_STATES } from '@/features/zakat/data';
import { useFinanceStore } from '@/stores/useFinanceStore';
import type { RiceGrade } from '@/types/finance';

const RICE_GRADES: RiceGrade[] = ['Standard', 'Premium', 'Super Premium'];

export function ZakatInputForm() {
  const zakatState = useFinanceStore((s) => s.zakatState);
  const zakatDependents = useFinanceStore((s) => s.zakatDependents);
  const lowestSavingsBalance = useFinanceStore((s) => s.lowestSavingsBalance);
  const paysZakatFitrah = useFinanceStore((s) => s.paysZakatFitrah);
  const riceGrade = useFinanceStore((s) => s.riceGrade);

  const setZakatState = useFinanceStore((s) => s.setZakatState);
  const setZakatDependents = useFinanceStore((s) => s.setZakatDependents);
  const setLowestSavingsBalance = useFinanceStore((s) => s.setLowestSavingsBalance);
  const setPaysZakatFitrah = useFinanceStore((s) => s.setPaysZakatFitrah);
  const setRiceGrade = useFinanceStore((s) => s.setRiceGrade);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Zakat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="zakatState">Negeri (untuk kadar Zakat Fitrah)</Label>
          <select
            id="zakatState"
            value={zakatState}
            onChange={(e) => setZakatState(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-sm text-text-h outline-none transition-colors focus:border-accent focus:bg-surface"
          >
            {MALAYSIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lowestSavingsBalance">Baki simpanan terendah sepanjang setahun (RM)</Label>
          <NumberField id="lowestSavingsBalance" value={lowestSavingsBalance} onValueChange={setLowestSavingsBalance} />
        </div>

        <label className="flex items-center gap-2 text-sm text-text-h">
          <input
            type="checkbox"
            checked={paysZakatFitrah}
            onChange={(e) => setPaysZakatFitrah(e.target.checked)}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Saya juga membayar Zakat Fitrah untuk diri &amp; tanggungan
        </label>

        {paysZakatFitrah && (
          <div className="grid grid-cols-2 gap-3 pl-6">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="zakatDependents">Bilangan tanggungan</Label>
              <NumberField id="zakatDependents" value={zakatDependents} onValueChange={setZakatDependents} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="riceGrade">Gred beras</Label>
              <select
                id="riceGrade"
                value={riceGrade}
                onChange={(e) => setRiceGrade(e.target.value as RiceGrade)}
                className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-sm text-text-h outline-none transition-colors focus:border-accent focus:bg-surface"
              >
                {RICE_GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
