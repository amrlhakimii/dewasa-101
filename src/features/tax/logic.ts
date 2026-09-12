import { LHDN_BASE_RELIEF, LHDN_TAX_BRACKETS } from '@/config/statutory';
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
  // Seksyen 6A(3): Zakat ialah rebat terus tetapi LHDN tidak membayar balik
  // lebihan apabila zakat yang dibayar melebihi cukai yang perlu dibayar.
  return roundTo2(Math.max(0, calculatedLhdnTax - totalZakatPaid));
}
