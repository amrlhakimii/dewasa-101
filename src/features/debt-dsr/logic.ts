import { DSR_THRESHOLDS } from '@/config/statutory';
import type { DebtProfile, DsrRiskLevel } from '@/types/finance';
import { roundTo2, sum } from '@/utils/math';

export function getTotalMonthlyDebt(debts: DebtProfile): number {
  return sum([debts.carLoan, debts.personalLoan, debts.creditCardMinimum, debts.ptptn, debts.existingMortgage]);
}

export function calculateDSR(totalMonthlyDebt: number, netMonthlyIncome: number): number {
  if (netMonthlyIncome <= 0) return 0;
  return roundTo2((totalMonthlyDebt / netMonthlyIncome) * 100);
}

export function getDSRRiskLevel(dsr: number): DsrRiskLevel {
  if (dsr <= DSR_THRESHOLDS.SAFE_MAX) return 'SAFE';
  if (dsr <= DSR_THRESHOLDS.WARNING_MAX) return 'WARNING';
  return 'DANGER'; // Banks generally reject >60% unless high-net-worth
}

/** Max additional monthly commitment the user could take on before hitting a DSR ceiling. */
export function getRemainingDebtCapacity(netMonthlyIncome: number, currentMonthlyDebt: number, ceilingPercent: number): number {
  const ceilingAmount = netMonthlyIncome * (ceilingPercent / 100);
  return roundTo2(Math.max(0, ceilingAmount - currentMonthlyDebt));
}
