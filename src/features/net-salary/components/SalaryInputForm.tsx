import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { useFinanceStore } from '@/stores/useFinanceStore';

export function SalaryInputForm() {
  const grossSalary = useFinanceStore((s) => s.grossSalary);
  const freelanceIncome = useFinanceStore((s) => s.freelanceIncome);
  const taxableAllowances = useFinanceStore((s) => s.taxableAllowances);
  const nonTaxableAllowances = useFinanceStore((s) => s.nonTaxableAllowances);
  const setGrossSalary = useFinanceStore((s) => s.setGrossSalary);
  const setFreelanceIncome = useFinanceStore((s) => s.setFreelanceIncome);
  const setTaxableAllowances = useFinanceStore((s) => s.setTaxableAllowances);
  const setNonTaxableAllowances = useFinanceStore((s) => s.setNonTaxableAllowances);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="grossSalary">Gaji pokok bulanan (basic monthly salary)</Label>
          <NumberField id="grossSalary" value={grossSalary} onValueChange={setGrossSalary} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="taxableAllowances">Taxable allowances (transport, fixed bonus, etc.)</Label>
          <NumberField id="taxableAllowances" value={taxableAllowances} onValueChange={setTaxableAllowances} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nonTaxableAllowances">Non-taxable allowances (per diem, medical claims)</Label>
          <NumberField
            id="nonTaxableAllowances"
            value={nonTaxableAllowances}
            onValueChange={setNonTaxableAllowances}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="freelanceIncome">Freelance / side-hustle income (monthly)</Label>
          <NumberField id="freelanceIncome" value={freelanceIncome} onValueChange={setFreelanceIncome} />
        </div>
      </CardContent>
    </Card>
  );
}
