import { create } from 'zustand';
import type { DebtProfile, RiceGrade } from '@/types/finance';

interface FinanceState {
  // Income
  grossSalary: number;
  freelanceIncome: number;
  taxableAllowances: number;
  nonTaxableAllowances: number;

  // Debts / commitments
  monthlyDebts: DebtProfile;

  // Tax reliefs
  claimedReliefIds: string[];

  // Zakat
  zakatState: string;
  zakatDependents: number;
  lowestSavingsBalance: number;
  paysZakatFitrah: boolean;
  riceGrade: RiceGrade;

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
}

export const useFinanceStore = create<FinanceState>((set) => ({
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
}));
