import {
  CAR_ROAD_TAX_BRACKETS,
  INSURANCE_ESTIMATE_RATE_OF_VALUE,
  MOTORCYCLE_ROAD_TAX_BRACKETS,
} from '@/config/statutory';
import { calculateMaxPrincipalForInstalment, calculateMonthlyInstalment, roundTo2 } from '@/utils/math';

export type ScenarioKind = 'car' | 'room' | 'custom';

export interface CarScenarioInput {
  kind: 'car';
  price: number;
  downPaymentPercent: number;
  interestRatePercent: number;
  tenureYears: number;
  annualInsurance: number;
  annualRoadTax: number;
  monthlyMaintenance: number;
}

export interface RoomScenarioInput {
  kind: 'room';
  monthlyRent: number;
}

export interface CustomScenarioInput {
  kind: 'custom';
  monthlyAmount: number;
}

export type ScenarioInput = CarScenarioInput | RoomScenarioInput | CustomScenarioInput;

export interface Scenario {
  id: string;
  label: string;
  input: ScenarioInput;
}

export interface CarScenarioBreakdown {
  instalment: number;
  insuranceMonthly: number;
  roadTaxMonthly: number;
  maintenanceMonthly: number;
}

export interface ScenarioResult {
  monthlyAmount: number;
  downPayment?: number;
  principal?: number;
  carBreakdown?: CarScenarioBreakdown;
}

/** Resolves any scenario's hypothetical extra commitment down to a single monthly RM amount. */
export function resolveScenario(input: ScenarioInput): ScenarioResult {
  switch (input.kind) {
    case 'car': {
      const price = Math.max(0, input.price);
      const downPayment = price * (input.downPaymentPercent / 100);
      const principal = price - downPayment;
      const instalment =
        principal > 0 ? calculateMonthlyInstalment(principal, input.interestRatePercent / 100, input.tenureYears) : 0;

      const insuranceMonthly = Math.max(0, input.annualInsurance) / 12;
      const roadTaxMonthly = Math.max(0, input.annualRoadTax) / 12;
      const maintenanceMonthly = Math.max(0, input.monthlyMaintenance);

      const monthlyAmount = instalment + insuranceMonthly + roadTaxMonthly + maintenanceMonthly;

      return {
        monthlyAmount: roundTo2(monthlyAmount),
        downPayment: roundTo2(downPayment),
        principal: roundTo2(principal),
        carBreakdown: {
          instalment: roundTo2(instalment),
          insuranceMonthly: roundTo2(insuranceMonthly),
          roadTaxMonthly: roundTo2(roadTaxMonthly),
          maintenanceMonthly: roundTo2(maintenanceMonthly),
        },
      };
    }
    case 'room':
      return { monthlyAmount: roundTo2(Math.max(0, input.monthlyRent)) };
    case 'custom':
      return { monthlyAmount: roundTo2(Math.max(0, input.monthlyAmount)) };
  }
}

export function getTotalScenarioMonthly(scenarios: Scenario[]): number {
  return roundTo2(scenarios.reduce((total, s) => total + resolveScenario(s.input).monthlyAmount, 0));
}

export interface CarAffordabilitySuggestion {
  /** Rule of thumb: net annual salary as a straightforward price ceiling. */
  priceByAnnualSalary: number;
  /** Max price the instalment (incl. interest, at the given rate/tenure/down
   * payment) can stay within budgetPercent of net monthly income. */
  priceByInstalmentBudget: number;
  maxMonthlyInstalment: number;
}

/** Two independent affordability checks for a car purchase:
 * 1) price shouldn't exceed ~1x net annual salary (simple rule of thumb)
 * 2) the loan instalment itself (including interest) shouldn't exceed
 *    budgetPercent of net monthly income — the stricter, more realistic check
 *    since it accounts for the actual rate/tenure/down payment chosen. */
export function suggestCarAffordability(
  netMonthlyIncome: number,
  downPaymentPercent: number,
  interestRatePercent: number,
  tenureYears: number,
  budgetPercent: number,
): CarAffordabilitySuggestion {
  const maxMonthlyInstalment = netMonthlyIncome * (budgetPercent / 100);
  const maxPrincipal = calculateMaxPrincipalForInstalment(maxMonthlyInstalment, interestRatePercent / 100, tenureYears);
  const priceByInstalmentBudget = downPaymentPercent >= 100 ? maxPrincipal : maxPrincipal / (1 - downPaymentPercent / 100);

  return {
    priceByAnnualSalary: roundTo2(netMonthlyIncome * 12),
    priceByInstalmentBudget: roundTo2(Math.max(0, priceByInstalmentBudget)),
    maxMonthlyInstalment: roundTo2(maxMonthlyInstalment),
  };
}

export type VehicleKind = 'car' | 'motorcycle';

/** Estimated annual JPJ road tax for a given engine capacity — indicative,
 * Peninsular Malaysia private registration. See DATA_SOURCES.ROAD_TAX. */
export function estimateRoadTax(vehicleKind: VehicleKind, cc: number): number {
  const safeCc = Math.max(0, cc);

  if (vehicleKind === 'motorcycle') {
    const bracket = MOTORCYCLE_ROAD_TAX_BRACKETS.find((b) => safeCc <= b.maxCc);
    return bracket ? bracket.rate : 0;
  }

  const bracket = CAR_ROAD_TAX_BRACKETS.find((b) => safeCc <= b.maxCc);
  if (!bracket) return 0;
  const excess = Math.max(0, safeCc - bracket.aboveCc);
  return roundTo2(bracket.baseRate + excess * bracket.perCcAboveRate);
}

/** Rough starting estimate for annual comprehensive insurance — a percentage
 * of the car's price. Real premiums vary by insurer, NCD, and coverage. */
export function estimateAnnualInsurance(carPrice: number): { low: number; high: number } {
  return {
    low: roundTo2(carPrice * INSURANCE_ESTIMATE_RATE_OF_VALUE.min),
    high: roundTo2(carPrice * INSURANCE_ESTIMATE_RATE_OF_VALUE.max),
  };
}
