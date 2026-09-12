import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES, LHDN_BASE_RELIEF } from '@/config/statutory';
import { TAX_RELIEF_CHECKLIST } from '@/features/tax/data';
import { useFinanceStore } from '@/stores/useFinanceStore';
import { formatCurrency } from '@/utils/formatters';

export function TaxReliefChecklist() {
  const claimedReliefIds = useFinanceStore((s) => s.claimedReliefIds);
  const toggleRelief = useFinanceStore((s) => s.toggleRelief);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Senarai Semak Pelepasan Cukai</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <label className="flex items-center justify-between rounded-xl bg-surface-muted px-3 py-2 text-sm">
          <span className="text-text-h">Pelepasan asas individu</span>
          <span className="font-medium text-text-h">{formatCurrency(LHDN_BASE_RELIEF)}</span>
        </label>

        {TAX_RELIEF_CHECKLIST.map((relief) => {
          const checked = claimedReliefIds.includes(relief.id);
          return (
            <label
              key={relief.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-3 py-2 text-sm hover:bg-surface-muted"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleRelief(relief.id)}
                className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
              />
              <span className="flex-1 text-text">{relief.label}</span>
              <span className="font-medium text-text-h">sehingga {formatCurrency(relief.max)}</span>
            </label>
          );
        })}

        <SourceNote label="Lembaga Hasil Dalam Negeri (LHDN)" href={DATA_SOURCES.LHDN_TAX_RATE} />
      </CardContent>
    </Card>
  );
}
