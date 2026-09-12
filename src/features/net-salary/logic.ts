import { STATUTORY_CONFIG } from '@/config/statutory';
import type { StatutoryDeductions } from '@/types/finance';
import { roundTo2 } from '@/utils/math';

export function calculateDeductions(grossSalary: number): StatutoryDeductions {
  const safeGross = Math.max(0, grossSalary);

  // 1. EPF
  const epfEmployee = safeGross * STATUTORY_CONFIG.EPF_EMPLOYEE_RATE;
  const epfEmployer =
    safeGross <= STATUTORY_CONFIG.EPF_EMPLOYER_THRESHOLD ? safeGross * 0.13 : safeGross * 0.12;

  // 2. SOCSO & EIS (capped at the statutory salary ceiling)
  const socsoBase = Math.min(safeGross, STATUTORY_CONFIG.SOCSO_SALARY_CAP);
  const eisBase = Math.min(safeGross, STATUTORY_CONFIG.EIS_SALARY_CAP);

  const socso = socsoBase * STATUTORY_CONFIG.SOCSO_EMPLOYEE_RATE;
  const eis = eisBase * STATUTORY_CONFIG.EIS_EMPLOYEE_RATE;

  return {
    epfEmployee: roundTo2(epfEmployee),
    epfEmployer: roundTo2(epfEmployer),
    socso: roundTo2(socso),
    eis: roundTo2(eis),
    pcbEstimate: 0, // Calculated separately using LHDN brackets (see features/tax)
  };
}

export function getNetPay(grossSalary: number, freelanceIncome: number): number {
  const deductions = calculateDeductions(grossSalary);
  // Freelance income is generally not subject to automatic EPF/SOCSO/EIS deductions.
  const net = grossSalary - deductions.epfEmployee - deductions.socso - deductions.eis + freelanceIncome;
  return roundTo2(Math.max(0, net));
}
