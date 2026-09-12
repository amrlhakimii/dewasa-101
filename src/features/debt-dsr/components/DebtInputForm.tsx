import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { useFinanceStore } from '@/stores/useFinanceStore';
import type { DebtProfile } from '@/types/finance';

const DEBT_FIELDS: { key: keyof DebtProfile; label: string }[] = [
  { key: 'existingMortgage', label: 'Existing mortgage / rent commitment' },
  { key: 'carLoan', label: 'Car loan' },
  { key: 'personalLoan', label: 'Personal loan' },
  { key: 'ptptn', label: 'PTPTN repayment' },
  { key: 'creditCardMinimum', label: 'Credit card minimum payment' },
];

export function DebtInputForm() {
  const monthlyDebts = useFinanceStore((s) => s.monthlyDebts);
  const setMonthlyDebt = useFinanceStore((s) => s.setMonthlyDebt);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly commitments</CardTitle>
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
      </CardContent>
    </Card>
  );
}
