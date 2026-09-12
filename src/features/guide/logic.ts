import { roundTo2 } from '@/utils/math';

export interface BudgetSplit {
  needs: number;
  wants: number;
  savings: number;
}

/** The 50/30/20 rule: 50% essential needs, 30% wants, 20% savings/debt payoff. */
export function calculateBudgetSplit(netMonthlyIncome: number): BudgetSplit {
  return {
    needs: roundTo2(netMonthlyIncome * 0.5),
    wants: roundTo2(netMonthlyIncome * 0.3),
    savings: roundTo2(netMonthlyIncome * 0.2),
  };
}

export interface EmergencyFundTarget {
  threeMonths: number;
  sixMonths: number;
  progressPercent: number;
}

/** Standard emergency-fund guidance: 3-6x essential monthly expenses. */
export function calculateEmergencyFundTarget(essentialMonthlyExpenses: number, currentSavings: number): EmergencyFundTarget {
  const sixMonths = essentialMonthlyExpenses * 6;
  const progressPercent = sixMonths > 0 ? roundTo2(Math.min(100, (currentSavings / sixMonths) * 100)) : 0;

  return {
    threeMonths: roundTo2(essentialMonthlyExpenses * 3),
    sixMonths: roundTo2(sixMonths),
    progressPercent,
  };
}
