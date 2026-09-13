import { create } from 'zustand';
import type { CustomDebtItem, DebtProfile, RiceGrade } from '@/types/finance';

// The subset of state that gets persisted to Firestore per signed-in user —
// deliberately excludes actions (functions aren't serializable).
export interface PersistedFinanceState {
  grossSalary: number;
  freelanceIncome: number;
  taxableAllowances: number;
  nonTaxableAllowances: number;
  monthlyDebts: DebtProfile;
  customDebts: CustomDebtItem[];
  claimedReliefIds: string[];
  zakatState: string;
  zakatDependents: number;
  lowestSavingsBalance: number;
  paysZakatFitrah: boolean;
  riceGrade: RiceGrade;
  annualLeaveBalance: number;
  medicalLeaveBalance: number;
  otherLeaveBalance: number;
  bookedLeaveDates: string[]; // ISO dates the user has marked as booked
  hasOnboarded: boolean;
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
  customDebts: [],
  claimedReliefIds: [],
  zakatState: 'WP Kuala Lumpur',
  zakatDependents: 0,
  lowestSavingsBalance: 0,
  paysZakatFitrah: false,
  riceGrade: 'Standard',
  annualLeaveBalance: 0,
  medicalLeaveBalance: 0,
  otherLeaveBalance: 0,
  bookedLeaveDates: [],
  hasOnboarded: false,
};

let nextCustomDebtId = 1;

interface FinanceState extends PersistedFinanceState {
  // Actions
  setGrossSalary: (amount: number) => void;
  setFreelanceIncome: (amount: number) => void;
  setTaxableAllowances: (amount: number) => void;
  setNonTaxableAllowances: (amount: number) => void;
  setMonthlyDebt: (key: keyof DebtProfile, amount: number) => void;
  addCustomDebt: (label: string, amount: number) => void;
  removeCustomDebt: (id: string) => void;
  toggleRelief: (id: string) => void;
  setZakatState: (state: string) => void;
  setZakatDependents: (count: number) => void;
  setLowestSavingsBalance: (amount: number) => void;
  setPaysZakatFitrah: (value: boolean) => void;
  setRiceGrade: (grade: RiceGrade) => void;
  setAnnualLeaveBalance: (days: number) => void;
  setMedicalLeaveBalance: (days: number) => void;
  setOtherLeaveBalance: (days: number) => void;
  toggleBookedLeave: (iso: string) => void;
  completeOnboarding: () => void;
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
  addCustomDebt: (label, amount) =>
    set((state) => ({
      customDebts: [...state.customDebts, { id: String(nextCustomDebtId++), label, amount: Math.max(0, amount) }],
    })),
  removeCustomDebt: (id) => set((state) => ({ customDebts: state.customDebts.filter((d) => d.id !== id) })),
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
  setAnnualLeaveBalance: (days) => set({ annualLeaveBalance: Math.max(0, days) }),
  setMedicalLeaveBalance: (days) => set({ medicalLeaveBalance: Math.max(0, days) }),
  setOtherLeaveBalance: (days) => set({ otherLeaveBalance: Math.max(0, days) }),
  toggleBookedLeave: (iso) =>
    set((state) => ({
      bookedLeaveDates: state.bookedLeaveDates.includes(iso)
        ? state.bookedLeaveDates.filter((d) => d !== iso)
        : [...state.bookedLeaveDates, iso],
    })),
  completeOnboarding: () => set({ hasOnboarded: true }),
  hydrate: (data) =>
    set({
      ...data,
      customDebts: data.customDebts ?? [],
      bookedLeaveDates: data.bookedLeaveDates ?? [],
      annualLeaveBalance: data.annualLeaveBalance ?? 0,
      medicalLeaveBalance: data.medicalLeaveBalance ?? 0,
      otherLeaveBalance: data.otherLeaveBalance ?? 0,
      hasOnboarded: data.hasOnboarded ?? false,
    }),
  reset: () => set(DEFAULT_STATE),
}));

export function getPersistedState(state: FinanceState): PersistedFinanceState {
  return {
    grossSalary: state.grossSalary,
    freelanceIncome: state.freelanceIncome,
    taxableAllowances: state.taxableAllowances,
    nonTaxableAllowances: state.nonTaxableAllowances,
    monthlyDebts: state.monthlyDebts,
    customDebts: state.customDebts,
    claimedReliefIds: state.claimedReliefIds,
    zakatState: state.zakatState,
    zakatDependents: state.zakatDependents,
    lowestSavingsBalance: state.lowestSavingsBalance,
    paysZakatFitrah: state.paysZakatFitrah,
    riceGrade: state.riceGrade,
    annualLeaveBalance: state.annualLeaveBalance,
    medicalLeaveBalance: state.medicalLeaveBalance,
    otherLeaveBalance: state.otherLeaveBalance,
    bookedLeaveDates: state.bookedLeaveDates,
    hasOnboarded: state.hasOnboarded,
  };
}
