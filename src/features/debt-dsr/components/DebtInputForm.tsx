import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { useFinanceStore } from '@/stores/useFinanceStore';
import { formatCurrency } from '@/utils/formatters';
import type { DebtProfile } from '@/types/finance';

const DEBT_FIELDS: { key: keyof DebtProfile; label: string }[] = [
  { key: 'existingMortgage', label: 'Bayaran pinjaman rumah / sewa sedia ada' },
  { key: 'carLoan', label: 'Pinjaman kereta' },
  { key: 'personalLoan', label: 'Pinjaman peribadi' },
  { key: 'ptptn', label: 'Bayaran balik PTPTN' },
  { key: 'creditCardMinimum', label: 'Bayaran minimum kad kredit' },
];

export function DebtInputForm() {
  const monthlyDebts = useFinanceStore((s) => s.monthlyDebts);
  const setMonthlyDebt = useFinanceStore((s) => s.setMonthlyDebt);
  const customDebts = useFinanceStore((s) => s.customDebts);
  const addCustomDebt = useFinanceStore((s) => s.addCustomDebt);
  const removeCustomDebt = useFinanceStore((s) => s.removeCustomDebt);

  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState(0);

  function handleAdd() {
    if (!newLabel.trim() || newAmount <= 0) return;
    addCustomDebt(newLabel.trim(), newAmount);
    setNewLabel('');
    setNewAmount(0);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Komitmen Bulanan</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {DEBT_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label htmlFor={field.key}>{field.label}</Label>
            <NumberField
              id={field.key}
              value={monthlyDebts[field.key]}
              onValueChange={(value) => setMonthlyDebt(field.key, value)}
            />
          </div>
        ))}

        <div className="flex flex-col gap-3 border-t border-border pt-4">
          <p className="label-eyebrow">Lain-lain komitmen (bil telefon, utiliti, ShopeePay, dll.)</p>

          {customDebts.length > 0 && (
            <div className="flex flex-col gap-2">
              {customDebts.map((debt) => (
                <div
                  key={debt.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surface-muted px-3 py-2 text-sm"
                >
                  <span className="text-text-h">{debt.label}</span>
                  <span className="flex items-center gap-3">
                    <span className="font-semibold text-text-h">{formatCurrency(debt.amount)}</span>
                    <button
                      type="button"
                      onClick={() => removeCustomDebt(debt.id)}
                      className="text-text hover:text-danger"
                      aria-label={`Buang ${debt.label}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Input
              placeholder="Cth: Bil telefon, Netflix, ShopeePay Later"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
            />
            <div className="w-28">
              <NumberField placeholder="RM" value={newAmount} onValueChange={setNewAmount} />
            </div>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={handleAdd} className="self-start">
            <Plus size={14} /> Tambah komitmen
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
