import type { MoveInCosts } from '@/types/finance';
import { roundTo2, sum } from '@/utils/math';

/** The "Renting Reality Check" — upfront cash needed to move into a rental unit. */
export function calculateMoveInCosts(monthlyRent: number): MoveInCosts {
  const rent = Math.max(0, monthlyRent);
  const securityDeposit = rent * 2;
  const utilityDeposit = rent * 0.5;
  const advanceRental = rent * 1;

  // Tenancy agreement stamp duty: RM1 per RM250 (or part thereof) of annual
  // rent in excess of RM2,400, per LHDN's tenancy stamping schedule.
  const annualRent = rent * 12;
  const stampDuty = annualRent > 2400 ? Math.ceil((annualRent - 2400) / 250) * 1 : 0;
  const estimatedAdminFee = 150; // Standard agency admin fee

  const breakdown = { securityDeposit, utilityDeposit, advanceRental, stampDuty, estimatedAdminFee };

  return {
    totalCashRequired: roundTo2(sum(Object.values(breakdown))),
    breakdown,
  };
}

export interface HomePurchaseCosts {
  downPayment: number;
  mot: number; // Memorandum of Transfer stamp duty
  legalFees: number;
  loanAgreementStampDuty: number;
  totalCashRequired: number;
}

/** Upfront cash needed to complete a home purchase (SPA + MOT + legal fees). */
export function calculateHomePurchaseCosts(propertyPrice: number, downPaymentPercent = 10): HomePurchaseCosts {
  const price = Math.max(0, propertyPrice);
  const downPayment = price * (downPaymentPercent / 100);

  const mot = calculateMotStampDuty(price);
  const legalFees = calculateLegalFees(price);
  const loanAgreementStampDuty = roundTo2((price - downPayment) * 0.005);

  return {
    downPayment: roundTo2(downPayment),
    mot: roundTo2(mot),
    legalFees: roundTo2(legalFees),
    loanAgreementStampDuty,
    totalCashRequired: roundTo2(downPayment + mot + legalFees + loanAgreementStampDuty),
  };
}

// MOT stamp duty tiers (first RM100k @ 1%, next RM400k @ 2%, next RM500k @ 3%, above RM1m @ 4%)
function calculateMotStampDuty(price: number): number {
  const tiers = [
    { limit: 100_000, rate: 0.01 },
    { limit: 500_000, rate: 0.02 },
    { limit: 1_000_000, rate: 0.03 },
    { limit: Infinity, rate: 0.04 },
  ];

  let remaining = price;
  let lowerBound = 0;
  let duty = 0;

  for (const tier of tiers) {
    if (remaining <= 0) break;
    const bandSize = Math.min(remaining, tier.limit - lowerBound);
    duty += bandSize * tier.rate;
    remaining -= bandSize;
    lowerBound = tier.limit;
  }

  return duty;
}

// Legal fees for SPA (Sale & Purchase Agreement), tiered per the Solicitors' Remuneration Order.
function calculateLegalFees(price: number): number {
  const tiers = [
    { limit: 500_000, rate: 0.0125 },
    { limit: 7_500_000, rate: 0.01 },
  ];

  if (price <= tiers[0].limit) return Math.max(price * tiers[0].rate, 500);
  const firstBand = tiers[0].limit * tiers[0].rate;
  const remaining = price - tiers[0].limit;
  return firstBand + remaining * tiers[1].rate;
}
