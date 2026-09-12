import { useMemo } from 'react';
import { NISAB_ESTIMATED_VALUE } from '@/config/statutory';
import { calculateDSR, getDSRRiskLevel, getTotalMonthlyDebt } from '@/features/debt-dsr/logic';
import { calculateDeductions, getNetPay } from '@/features/net-salary/logic';
import { TAX_RELIEF_CHECKLIST } from '@/features/tax/data';
import { calculateFinalTaxWithZakatRebate, calculateLHDNTax } from '@/features/tax/logic';
import { getZakatFitrahRate } from '@/features/zakat/data';
import { calculateZakatPendapatan } from '@/features/zakat/logic';
import { useFinanceStore } from '@/stores/useFinanceStore';
import { roundTo2 } from '@/utils/math';

export function useDerivedFinance() {
  const state = useFinanceStore();

  return useMemo(() => {
    const monthlyTaxableGross = state.grossSalary + state.taxableAllowances;
    const deductions = calculateDeductions(state.grossSalary);

    const annualIncome = monthlyTaxableGross * 12 + state.freelanceIncome * 12;
    const claimedReliefsTotal = TAX_RELIEF_CHECKLIST.filter((r) => state.claimedReliefIds.includes(r.id)).reduce(
      (total, r) => total + r.max,
      0,
    );

    const baseTaxPayable = calculateLHDNTax(annualIncome, claimedReliefsTotal);

    const zakatOnIncome = calculateZakatPendapatan(annualIncome, NISAB_ESTIMATED_VALUE);
    const zakatOnSavings = calculateZakatPendapatan(state.lowestSavingsBalance, NISAB_ESTIMATED_VALUE);
    const zakatPendapatan = roundTo2(zakatOnIncome + zakatOnSavings);
    const fitrahRate = getZakatFitrahRate(state.zakatState, state.riceGrade);
    const zakatFitrah = state.paysZakatFitrah ? fitrahRate * (1 + state.zakatDependents) : 0;
    const totalZakatPaid = roundTo2(zakatPendapatan + zakatFitrah);

    const finalTaxPayable = calculateFinalTaxWithZakatRebate(baseTaxPayable, totalZakatPaid);
    const monthlyPcb = roundTo2(finalTaxPayable / 12);

    const netMonthlyIncome = roundTo2(
      getNetPay(monthlyTaxableGross, state.freelanceIncome) + state.nonTaxableAllowances - monthlyPcb,
    );

    const customDebtsTotal = roundTo2(state.customDebts.reduce((total, d) => total + d.amount, 0));
    const totalMonthlyDebt = roundTo2(getTotalMonthlyDebt(state.monthlyDebts) + customDebtsTotal);
    const dsr = calculateDSR(totalMonthlyDebt, netMonthlyIncome);
    const dsrRisk = getDSRRiskLevel(dsr);

    return {
      deductions,
      annualIncome,
      claimedReliefsTotal,
      taxState: {
        totalTaxableIncome: annualIncome,
        claimedReliefs: claimedReliefsTotal,
        baseTaxPayable,
        zakatPaid: totalZakatPaid,
        finalTaxPayable,
      },
      zakatPendapatan,
      zakatFitrah,
      monthlyPcb,
      netMonthlyIncome,
      customDebtsTotal,
      totalMonthlyDebt,
      dsr,
      dsrRisk,
    };
  }, [state]);
}
