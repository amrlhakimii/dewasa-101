import { calculateMonthlyInstalment, roundTo2 } from '@/utils/math';

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
