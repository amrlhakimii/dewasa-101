// Core Income & Debt Profile
export interface DebtProfile {
  carLoan: number;
  personalLoan: number;
  creditCardMinimum: number;
  ptptn: number;
  existingMortgage: number;
}

export interface FinancialProfile {
  grossSalary: number;
  freelanceIncome: number;
  taxableAllowances: number;
  nonTaxableAllowances: number;
  monthlyDebts: DebtProfile;
}

// Statutory Deductions
export interface StatutoryDeductions {
  epfEmployee: number;
  epfEmployer: number;
  socso: number;
  eis: number;
  pcbEstimate: number;
}

// Zakat & Tax State
export interface TaxState {
  totalTaxableIncome: number;
  claimedReliefs: number;
  baseTaxPayable: number;
  zakatPaid: number;
  finalTaxPayable: number;
}

export type RiceGrade = 'Standard' | 'Premium' | 'Super Premium';

export interface ZakatProfile {
  state: string;
  dependents: number;
  lowestSavingsBalance: number;
  paysZakatFitrah: boolean;
  riceGrade: RiceGrade;
}

export type DsrRiskLevel = 'SAFE' | 'WARNING' | 'DANGER';

export interface MoveInCostBreakdown {
  securityDeposit: number;
  utilityDeposit: number;
  advanceRental: number;
  stampDuty: number;
  estimatedAdminFee: number;
}

export interface MoveInCosts {
  totalCashRequired: number;
  breakdown: MoveInCostBreakdown;
}
