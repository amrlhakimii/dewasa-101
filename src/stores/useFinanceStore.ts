import { create } from 'zustand';
import type { DebtProfile, RiceGrade } from '@/types/finance';

// The subset of state that gets persisted to Firestore per signed-in user —
// deliberately excludes actions (functions aren't serializable).
export interface PersistedFinanceState {
  grossSalary: number;
  freelanceIncome: number;
  taxableAllowances: number;
  nonTaxableAllowances: number;
  monthlyDebts: DebtProfile;
  claimedReliefIds: string[];
  zakatState: string;
  zakatDependents: number;
  lowestSavingsBalance: number;
  paysZakatFitrah: boolean;
  riceGrade: RiceGrade;
}

const DEFAULT_STATE: PersistedFinanceState = {
  grossSalary: 3500,
  freelanceIncome: 0,
  taxableAllowances: 0,
  nonTaxableAllowances: 0,
  monthlyDebts: {
    carLoan: 0,
    personalLoan: 0,
    creditCardMinimum: 0,
    ptptn: 0,
    existingMortgage: 0,
  },
  claimedReliefIds: [],
  zakatState: 'WP Kuala Lumpur',
  zakatDependents: 0,
  lowestSavingsBalance: 0,
  paysZakatFitrah: false,
  riceGrade: 'Standard',
};

interface FinanceState extends PersistedFinanceState {
  // Actions
  setGrossSalary: (amount: number) => void;
  setFreelanceIncome: (amount: number) => void;
  setTaxableAllowances: (amount: number) => void;
  setNonTaxableAllowances: (amount: number) => void;
  setMonthlyDebt: (key: keyof DebtProfile, amount: number) => void;
  toggleRelief: (id: string) => void;
  setZakatState: (state: string) => void;
  setZakatDependents: (count: number) => void;
  setLowestSavingsBalance: (amount: number) => void;
  setPaysZakatFitrah: (value: boolean) => void;
  setRiceGrade: (grade: RiceGrade) => void;
  hydrate: (data: PersistedFinanceState) => void;
  /** Wipes the store back to defaults — used when switching/signing out of an
   * account so a new session never inherits the previous user's data. */
  reset: () => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  ...DEFAULT_STATE,

  setGrossSalary: (amount) => set({ grossSalary: Math.max(0, amount) }),
  setFreelanceIncome: (amount) => set({ freelanceIncome: Math.max(0, amount) }),
  setTaxableAllowances: (amount) => set({ taxableAllowances: Math.max(0, amount) }),
  setNonTaxableAllowances: (amount) => set({ nonTaxableAllowances: Math.max(0, amount) }),
  setMonthlyDebt: (key, amount) =>
    set((state) => ({ monthlyDebts: { ...state.monthlyDebts, [key]: Math.max(0, amount) } })),
  toggleRelief: (id) =>
    set((state) => ({
      claimedReliefIds: state.claimedReliefIds.includes(id)
        ? state.claimedReliefIds.filter((r) => r !== id)
        : [...state.claimedReliefIds, id],
    })),
  setZakatState: (zakatState) => set({ zakatState }),
  setZakatDependents: (count) => set({ zakatDependents: Math.max(0, count) }),
  setLowestSavingsBalance: (amount) => set({ lowestSavingsBalance: Math.max(0, amount) }),
  setPaysZakatFitrah: (value) => set({ paysZakatFitrah: value }),
  setRiceGrade: (riceGrade) => set({ riceGrade }),
  hydrate: (data) => set(data),
  reset: () => set(DEFAULT_STATE),
}));

export function getPersistedState(state: FinanceState): PersistedFinanceState {
  return {
    grossSalary: state.grossSalary,
    freelanceIncome: state.freelanceIncome,
    taxableAllowances: state.taxableAllowances,
    nonTaxableAllowances: state.nonTaxableAllowances,
    monthlyDebts: state.monthlyDebts,
    claimedReliefIds: state.claimedReliefIds,
    zakatState: state.zakatState,
    zakatDependents: state.zakatDependents,
    lowestSavingsBalance: state.lowestSavingsBalance,
    paysZakatFitrah: state.paysZakatFitrah,
    riceGrade: state.riceGrade,
  };
}
