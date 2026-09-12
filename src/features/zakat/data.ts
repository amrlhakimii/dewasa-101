import { ZAKAT_FITRAH_RATES } from '@/config/statutory';
import type { RiceGrade } from '@/types/finance';

export const MALAYSIAN_STATES = Object.keys(ZAKAT_FITRAH_RATES);

// Gandaan mengikut gred beras — sesetengah pihak berkuasa negeri menetapkan
// kadar lebih tinggi untuk kategori beras premium/super premium.
const RICE_GRADE_MULTIPLIER: Record<RiceGrade, number> = {
  Standard: 1,
  Premium: 1.15,
  'Super Premium': 1.3,
};

export function getZakatFitrahRate(state: string, riceGrade: RiceGrade): number {
  const base = ZAKAT_FITRAH_RATES[state] ?? 7;
  return Math.round(base * RICE_GRADE_MULTIPLIER[riceGrade] * 100) / 100;
}
