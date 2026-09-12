import { ZAKAT_FITRAH_RATES } from '@/config/statutory';
import type { RiceGrade } from '@/types/finance';

export const MALAYSIAN_STATES = Object.keys(ZAKAT_FITRAH_RATES);

// Rice-grade multiplier applied to the base Zakat Fitrah rate — some state
// authorities publish a higher rate for premium/super-premium rice categories.
const RICE_GRADE_MULTIPLIER: Record<RiceGrade, number> = {
  Standard: 1,
  Premium: 1.15,
  'Super Premium': 1.3,
};

export function getZakatFitrahRate(state: string, riceGrade: RiceGrade): number {
  const base = ZAKAT_FITRAH_RATES[state] ?? 7;
  return Math.round(base * RICE_GRADE_MULTIPLIER[riceGrade] * 100) / 100;
}

export const TAX_RELIEF_CHECKLIST = [
  { id: 'lifestyle', label: 'Lifestyle (books, gadgets, internet, gym)', max: 2500 },
  { id: 'medical-parents', label: 'Medical treatment for parents', max: 8000 },
  { id: 'epf-life-insurance', label: 'EPF + life insurance', max: 7000 },
  { id: 'sspn', label: 'SSPN net savings', max: 8000 },
  { id: 'child-education', label: 'Child education & care (under 6)', max: 3000 },
  { id: 'medical-self', label: 'Medical expenses (self/spouse/child)', max: 10000 },
] as const;
