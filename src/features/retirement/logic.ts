import { roundTo2 } from '@/utils/math';

export interface RetirementProjectionPoint {
  age: number;
  balance: number;
}

export interface RetirementProjectionResult {
  points: RetirementProjectionPoint[];
  finalBalance: number;
  totalContributed: number;
}

/** Projects KWSP balance growth using annual compounding: each year the
 * balance grows by the dividend rate, then the year's contribution is added. */
export function projectRetirementBalance(
  currentAge: number,
  retirementAge: number,
  currentBalance: number,
  annualContribution: number,
  annualDividendRate: number,
): RetirementProjectionResult {
  const years = Math.max(0, retirementAge - currentAge);
  const points: RetirementProjectionPoint[] = [{ age: currentAge, balance: roundTo2(currentBalance) }];

  let balance = currentBalance;
  for (let i = 1; i <= years; i++) {
    balance = balance * (1 + annualDividendRate) + annualContribution;
    points.push({ age: currentAge + i, balance: roundTo2(balance) });
  }

  return {
    points,
    finalBalance: roundTo2(balance),
    totalContributed: roundTo2(currentBalance + annualContribution * years),
  };
}
