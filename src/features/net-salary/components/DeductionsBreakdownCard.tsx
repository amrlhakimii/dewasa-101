import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { useFinanceStore } from '@/stores/useFinanceStore';
import { formatCurrency } from '@/utils/formatters';

export function DeductionsBreakdownCard() {
  const grossSalary = useFinanceStore((s) => s.grossSalary);
  const taxableAllowances = useFinanceStore((s) => s.taxableAllowances);
  const { deductions, monthlyPcb, netMonthlyIncome } = useDerivedFinance();

  const rows = [
    { label: 'EPF (11%, you)', value: deductions.epfEmployee, tone: 'text-text' },
    { label: 'SOCSO (0.5%, capped RM6,000)', value: deductions.socso, tone: 'text-text' },
    { label: 'EIS (0.2%, capped RM6,000)', value: deductions.eis, tone: 'text-text' },
    { label: 'PCB (monthly tax estimate)', value: monthlyPcb, tone: 'text-text' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gaji Sebenar (Real Take-Home Pay)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div>
          <p className="text-sm text-text">Net pay lands in your bank account</p>
          <p className="text-4xl font-bold tracking-tight text-accent">{formatCurrency(netMonthlyIncome)}</p>
          <p className="mt-1 text-xs text-text">
            from a gross of {formatCurrency(grossSalary + taxableAllowances)}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <span className={row.tone}>{row.label}</span>
              <span className="font-medium text-text-h">-{formatCurrency(row.value)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
            <span className="text-text">Employer also contributes EPF {formatCurrency(deductions.epfEmployer)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
