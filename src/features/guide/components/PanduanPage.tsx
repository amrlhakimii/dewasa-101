import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES } from '@/config/statutory';
import { CREDIT_GLOSSARY, PAYSLIP_GLOSSARY } from '@/features/guide/data';
import { calculateBudgetSplit, calculateEmergencyFundTarget } from '@/features/guide/logic';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { formatCurrency, formatPercent } from '@/utils/formatters';

export function PanduanPage() {
  const { netMonthlyIncome, totalMonthlyDebt } = useDerivedFinance();
  const [essentialExpenses, setEssentialExpenses] = useState(0);
  const [currentSavings, setCurrentSavings] = useState(0);

  const budget = calculateBudgetSplit(netMonthlyIncome);
  const emergencyFund = calculateEmergencyFundTarget(essentialExpenses, currentSavings);
  const hasExpenses = essentialExpenses > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Peraturan Belanjawan 50/30/20</CardTitle>
            <CardDescription>Cara mudah bahagikan gaji bersih anda setiap bulan.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <BudgetRow label="Keperluan (sewa, makan, bil, hutang)" percent={50} value={budget.needs} />
            <BudgetRow label="Kehendak (hiburan, gaya hidup)" percent={30} value={budget.wants} />
            <BudgetRow label="Simpanan & bayar hutang lebih" percent={20} value={budget.savings} />
            <p className="mt-1 text-xs text-text">
              Berdasarkan gaji bersih {formatCurrency(netMonthlyIncome)}/bln daripada halaman Pendapatan.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dana Kecemasan</CardTitle>
            <CardDescription>Simpanan sebelum apa-apa lagi — kereta rosak, hilang kerja, dll.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="essentialExpenses">Perbelanjaan penting bulanan (RM)</Label>
              <p className="text-xs text-text">
                Tambah semua <strong className="text-text-h">keperluan asas</strong> yang WAJIB dibayar setiap
                bulan walaupun anda kehilangan kerja esok:
              </p>
              <ul className="ml-4 list-disc text-xs text-text">
                <li>Sewa / bayaran pinjaman rumah — cth RM800</li>
                <li>Makan — cth RM600</li>
                <li>Bil (elektrik, air, internet, telefon) — cth RM150</li>
                <li>Minyak / pengangkutan — cth RM200</li>
                <li>Bayaran hutang bulanan (dari halaman Komitmen)</li>
              </ul>
              <p className="text-xs text-text">
                Contoh jumlah: RM800 + RM600 + RM150 + RM200 = <strong className="text-text-h">RM1,750</strong>.
                Jangan masukkan kehendak (Netflix, shopping, makan luar).
              </p>
              <NumberField
                id="essentialExpenses"
                value={essentialExpenses}
                onValueChange={setEssentialExpenses}
                placeholder="Cth: 1750"
              />
              {totalMonthlyDebt > 0 && (
                <button
                  type="button"
                  onClick={() => setEssentialExpenses(totalMonthlyDebt)}
                  className="self-start text-xs font-semibold text-brand-300 hover:underline"
                >
                  Guna jumlah Komitmen sahaja ({formatCurrency(totalMonthlyDebt)})
                </button>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="currentSavings">Simpanan kecemasan semasa (RM)</Label>
              <p className="text-xs text-text">
                Baki yang ada SEKARANG dalam akaun simpanan/tabung yang khas untuk kecemasan sahaja (bukan akaun
                yang anda selalu belanja). Tiada simpanan lagi? Taip 0 — tidak mengapa, itulah sebabnya alat ini
                wujud.
              </p>
              <NumberField id="currentSavings" value={currentSavings} onValueChange={setCurrentSavings} placeholder="Cth: 2000" />
            </div>

            {hasExpenses ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-surface-muted px-3 py-2">
                    <p className="text-xs text-text">Sasaran minimum (3 bulan)</p>
                    <p className="text-lg font-bold text-text-h">{formatCurrency(emergencyFund.threeMonths)}</p>
                  </div>
                  <div className="rounded-xl bg-surface-muted px-3 py-2">
                    <p className="text-xs text-text">Sasaran selesa (6 bulan)</p>
                    <p className="text-lg font-bold text-text-h">{formatCurrency(emergencyFund.sixMonths)}</p>
                  </div>
                </div>

                <div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-700"
                      style={{ width: `${emergencyFund.progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-text">
                    {formatPercent(emergencyFund.progressPercent, 0)} ke arah sasaran 6 bulan
                  </p>
                </div>
              </>
            ) : (
              <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-sm text-text">
                Isi perbelanjaan penting bulanan di atas untuk lihat sasaran dana kecemasan anda.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Apa Semua Potongan Dalam Slip Gaji Ni?</CardTitle>
          <CardDescription>Perkara yang jarang sesiapa terangkan bila mula-mula bekerja.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PAYSLIP_GLOSSARY.map((entry) => (
            <div key={entry.term} className="rounded-xl border border-border px-3 py-2.5">
              <p className="text-sm font-semibold text-text-h">{entry.term}</p>
              <p className="mt-1 text-xs text-text">{entry.explanation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CCRIS &amp; CTOS — Kenapa Penting</CardTitle>
          <CardDescription>Ini yang bank tengok sebelum luluskan pinjaman rumah/kereta anda.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {CREDIT_GLOSSARY.map((entry) => (
            <div key={entry.term} className="rounded-xl border border-border px-3 py-2.5">
              <p className="text-sm font-semibold text-text-h">{entry.term}</p>
              <p className="mt-1 text-xs text-text">{entry.explanation}</p>
            </div>
          ))}
          <div className="flex flex-wrap gap-4">
            <SourceNote label="Bank Negara Malaysia — CCRIS" href={DATA_SOURCES.CCRIS} />
            <SourceNote label="CTOS" href={DATA_SOURCES.CTOS} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BudgetRow({ label, percent, value }: { label: string; percent: number; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-surface-muted px-3 py-2.5 text-sm">
      <span className="text-text">
        {label} <span className="text-text-h">({percent}%)</span>
      </span>
      <span className="font-semibold text-text-h">{formatCurrency(value)}</span>
    </div>
  );
}
