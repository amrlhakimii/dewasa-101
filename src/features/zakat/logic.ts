import { ZAKAT_PENDAPATAN_RATE } from '@/config/statutory';
import { roundTo2 } from '@/utils/math';

/** Zakat Pendapatan — 2.5% daripada pendapatan/simpanan tahunan sebaik sahaja
 * cukup Nisab. Rujuk kaedah pengiraan rasmi di DATA_SOURCES.ZAKAT_PENDAPATAN. */
export function calculateZakatPendapatan(annualIncome: number, nisabValue: number): number {
  if (annualIncome < nisabValue) return 0;
  return roundTo2(annualIncome * ZAKAT_PENDAPATAN_RATE);
}
