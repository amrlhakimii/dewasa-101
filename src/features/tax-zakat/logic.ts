import { LHDN_BASE_RELIEF, LHDN_TAX_BRACKETS, ZAKAT_PENDAPATAN_RATE } from '@/config/statutory';
import { roundTo2 } from '@/utils/math';

export function calculateLHDNTax(annualIncome: number, additionalReliefs = 0): number {
  const chargeableIncome = Math.max(0, annualIncome - LHDN_BASE_RELIEF - additionalReliefs);

  if (chargeableIncome === 0) return 0;

  // Find the bracket the chargeable income falls into.
  const bracket = LHDN_TAX_BRACKETS.slice()
    .reverse()
    .find((b) => chargeableIncome >= b.min);
  if (!bracket) return 0;

  // Tax = base tax accumulated up to this bracket + (amount in excess of the
  // bracket's floor) * this bracket's marginal rate.
  const excess = chargeableIncome - (bracket.min > 0 ? bracket.min - 1 : 0);
  return roundTo2(bracket.baseTaxAtMin + excess * bracket.rate);
}

export function calculateFinalTaxWithZakatRebate(calculatedLhdnTax: number, totalZakatPaid: number): number {
  // Section 6A(3): Zakat is a direct rebate but LHDN does not refund the excess
  // when Zakat paid exceeds tax payable.
  return roundTo2(Math.max(0, calculatedLhdnTax - totalZakatPaid));
}

/** Zakat Pendapatan (income zakat) — 2.5% of annual income once Nisab is met. */
export function calculateZakatPendapatan(annualIncome: number, nisabValue: number): number {
  if (annualIncome < nisabValue) return 0;
  return roundTo2(annualIncome * ZAKAT_PENDAPATAN_RATE);
}
