import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { useFinanceStore } from '@/stores/useFinanceStore';
import { formatCurrency } from '@/utils/formatters';

export function DeductionsBreakdownCard() {
  const grossSalary = useFinanceStore((s) => s.grossSalary);
  const taxableAllowances = useFinanceStore((s) => s.taxableAllowances);
  const { deductions, monthlyPcb, netMonthlyIncome } = useDerivedFinance();

  const rows = [
    { label: 'KWSP (11%, anda)', value: deductions.epfEmployee },
    { label: 'PERKESO (0.5%, siling RM6,000)', value: deductions.socso },
    { label: 'SIP (0.2%, siling RM6,000)', value: deductions.eis },
    { label: 'PCB (anggaran cukai bulanan)', value: monthlyPcb },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gaji Sebenar (Gaji Bersih)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div>
          <p className="text-sm text-text">Gaji bersih masuk akaun bank anda</p>
          <p className="text-4xl font-bold tracking-tight text-accent">{formatCurrency(netMonthlyIncome)}</p>
          <p className="mt-1 text-xs text-text">
            daripada gaji kasar {formatCurrency(grossSalary + taxableAllowances)}
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
              <span className="text-text">{row.label}</span>
              <span className="shrink-0 font-medium text-text-h">-{formatCurrency(row.value)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
            <span className="text-text">Majikan turut caruman KWSP {formatCurrency(deductions.epfEmployer)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
