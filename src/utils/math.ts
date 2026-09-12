export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function roundTo2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Standard mortgage amortization: fixed monthly instalment. */
export function calculateMonthlyInstalment(
  principal: number,
  annualInterestRate: number,
  tenureYears: number,
): number {
  const monthlyRate = annualInterestRate / 12;
  const numPayments = tenureYears * 12;
  if (monthlyRate === 0) return principal / numPayments;
  const factor = (monthlyRate * (1 + monthlyRate) ** numPayments) / ((1 + monthlyRate) ** numPayments - 1);
  return principal * factor;
}

/** Inverse of calculateMonthlyInstalment — the max principal a given fixed
 * monthly instalment can service (present value of an annuity). */
export function calculateMaxPrincipalForInstalment(
  monthlyInstalment: number,
  annualInterestRate: number,
  tenureYears: number,
): number {
  const monthlyRate = annualInterestRate / 12;
  const numPayments = tenureYears * 12;
  if (monthlyRate === 0) return monthlyInstalment * numPayments;
  return (monthlyInstalment * (1 - (1 + monthlyRate) ** -numPayments)) / monthlyRate;
}
