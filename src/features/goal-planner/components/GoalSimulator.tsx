import { Car, Home, Sparkles, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { calculateDSR, getDSRRiskLevel } from '@/features/debt-dsr/logic';
import { getTotalScenarioMonthly, resolveScenario, type Scenario, type ScenarioKind } from '@/features/goal-planner/logic';
import { useDerivedFinance } from '@/stores/useDerivedFinance';
import { cn } from '@/lib/utils';
import { formatCurrency, formatPercent, formatRiskLevel } from '@/utils/formatters';
import type { DsrRiskLevel } from '@/types/finance';

const RISK_TONE: Record<DsrRiskLevel, 'success' | 'warning' | 'danger'> = {
  SAFE: 'success',
  WARNING: 'warning',
  DANGER: 'danger',
};

const KIND_META: Record<ScenarioKind, { label: string; icon: typeof Car }> = {
  car: { label: 'Kereta', icon: Car },
  room: { label: 'Bilik / sewa', icon: Home },
  custom: { label: 'Lain-lain', icon: Sparkles },
};

let nextId = 1;

export function GoalSimulator() {
  const { totalMonthlyDebt, netMonthlyIncome } = useDerivedFinance();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  const [kind, setKind] = useState<ScenarioKind>('car');
  const [label, setLabel] = useState('');
  const [price, setPrice] = useState(80000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [interestRatePercent, setInterestRatePercent] = useState(3.5);
  const [tenureYears, setTenureYears] = useState(7);
  const [annualInsurance, setAnnualInsurance] = useState(1800);
  const [annualRoadTax, setAnnualRoadTax] = useState(90);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState(120);
  const [monthlyRent, setMonthlyRent] = useState(800);
  const [customAmount, setCustomAmount] = useState(200);

  function addScenario() {
    const id = String(nextId++);
    if (kind === 'car') {
      setScenarios((prev) => [
        ...prev,
        {
          id,
          label: label || 'Pinjaman kereta',
          input: {
            kind: 'car',
            price,
            downPaymentPercent,
            interestRatePercent,
            tenureYears,
            annualInsurance,
            annualRoadTax,
            monthlyMaintenance,
          },
        },
      ]);
    } else if (kind === 'room') {
      setScenarios((prev) => [...prev, { id, label: label || 'Sewa bilik', input: { kind: 'room', monthlyRent } }]);
    } else {
      setScenarios((prev) => [
        ...prev,
        { id, label: label || 'Komitmen lain', input: { kind: 'custom', monthlyAmount: customAmount } },
      ]);
    }
    setLabel('');
  }

  function removeScenario(id: string) {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }

  const plannedMonthly = getTotalScenarioMonthly(scenarios);
  const projectedDebt = totalMonthlyDebt + plannedMonthly;
  const currentDsr = calculateDSR(totalMonthlyDebt, netMonthlyIncome);
  const projectedDsr = calculateDSR(projectedDebt, netMonthlyIncome);
  const projectedRisk = getDSRRiskLevel(projectedDsr);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nak beli kereta, sewa bilik, atau...?</CardTitle>
        <CardDescription>
          Tambah komitmen hipotesis di atas angka sebenar anda dan lihat kesannya pada DSR — sebelum anda
          menandatangani apa-apa.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex gap-1.5 rounded-full border border-border bg-surface-muted p-1">
          {(Object.keys(KIND_META) as ScenarioKind[]).map((k) => {
            const Icon = KIND_META[k].icon;
            const active = kind === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-semibold transition-all',
                  active
                    ? 'bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-glow'
                    : 'text-text hover:text-text-h',
                )}
              >
                <Icon size={14} /> {KIND_META[k].label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="scenarioLabel">Nama (pilihan)</Label>
          <Input
            id="scenarioLabel"
            placeholder={KIND_META[kind].label}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        {kind === 'car' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carPrice">Harga (RM)</Label>
              <NumberField id="carPrice" value={price} onValueChange={setPrice} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carDown">Bayaran pendahuluan (%)</Label>
              <NumberField id="carDown" value={downPaymentPercent} onValueChange={setDownPaymentPercent} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carRate">Kadar faedah (% setahun)</Label>
              <NumberField id="carRate" value={interestRatePercent} onValueChange={setInterestRatePercent} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carTenure">Tempoh (tahun)</Label>
              <NumberField id="carTenure" value={tenureYears} onValueChange={setTenureYears} />
            </div>

            <div className="col-span-2 mt-1 border-t border-border pt-3">
              <p className="label-eyebrow">Kos operasi</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carInsurance">Insurans (RM/tahun)</Label>
              <NumberField id="carInsurance" value={annualInsurance} onValueChange={setAnnualInsurance} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carRoadTax">Cukai jalan (RM/tahun)</Label>
              <NumberField id="carRoadTax" value={annualRoadTax} onValueChange={setAnnualRoadTax} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="carMaintenance">Servis &amp; penyelenggaraan (RM/bulan)</Label>
              <NumberField id="carMaintenance" value={monthlyMaintenance} onValueChange={setMonthlyMaintenance} />
            </div>
          </div>
        )}

        {kind === 'room' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="roomRent">Sewa bulanan (RM)</Label>
            <NumberField id="roomRent" value={monthlyRent} onValueChange={setMonthlyRent} />
          </div>
        )}

        {kind === 'custom' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customAmount">Jumlah bulanan (RM)</Label>
            <NumberField id="customAmount" value={customAmount} onValueChange={setCustomAmount} />
          </div>
        )}

        <Button type="button" onClick={addScenario} className="self-start">
          Tambah ke simulasi
        </Button>

        {scenarios.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            {scenarios.map((s) => {
              const result = resolveScenario(s.input);
              const Icon = KIND_META[s.input.kind].icon;
              return (
                <div key={s.id} className="rounded-xl border border-border bg-surface-muted px-3 py-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-text-h">
                      <Icon size={14} className="text-brand-300" />
                      {s.label}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="font-semibold text-text-h">{formatCurrency(result.monthlyAmount)}/bln</span>
                      <button
                        type="button"
                        onClick={() => removeScenario(s.id)}
                        className="text-text hover:text-danger"
                        aria-label={`Buang ${s.label}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  </div>
                  {result.carBreakdown && (
                    <p className="mt-1.5 pl-6 text-xs text-text">
                      {formatCurrency(result.carBreakdown.instalment)} ansuran +{' '}
                      {formatCurrency(result.carBreakdown.insuranceMonthly)} insurans +{' '}
                      {formatCurrency(result.carBreakdown.roadTaxMonthly)} cukai jalan +{' '}
                      {formatCurrency(result.carBreakdown.maintenanceMonthly)} servis
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-muted p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text">DSR semasa</span>
            <span className="font-semibold text-text-h">{formatPercent(currentDsr)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text">Unjuran DSR dengan tambahan {formatCurrency(plannedMonthly)}/bln</span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-text-h">{formatPercent(projectedDsr)}</span>
              <Badge tone={RISK_TONE[projectedRisk]}>{formatRiskLevel(projectedRisk)}</Badge>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
