import { useState } from 'react';
import logo from '@/assets/logo-source.png';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { useFinanceStore } from '@/stores/useFinanceStore';

export function OnboardingModal() {
  const grossSalary = useFinanceStore((s) => s.grossSalary);
  const setGrossSalary = useFinanceStore((s) => s.setGrossSalary);
  const completeOnboarding = useFinanceStore((s) => s.completeOnboarding);
  const [salary, setSalary] = useState(grossSalary || 0);

  function handleStart() {
    setGrossSalary(salary);
    completeOnboarding();
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center md:items-center md:p-6"
      style={{
        background: 'rgba(10,10,12,0.6)',
        backdropFilter: 'blur(6px)',
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
      }}
    >
      <div className="w-full animate-modal-in rounded-t-[20px] border border-accent-border/20 bg-surface p-6 text-center shadow-elevated md:max-w-sm md:rounded-[20px]">
        <img src={logo} alt="" className="mx-auto h-16 w-16 rounded-2xl shadow-glow" />
        <h2 className="font-display mt-4 text-xl font-extrabold tracking-tight text-text-h">Selamat datang!</h2>
        <p className="mt-1 text-sm text-text">
          Untuk mula, berapa gaji pokok bulanan anda? Anda boleh kemaskini semua butiran lain (elaun, hutang, zakat)
          bila-bila masa di halaman masing-masing.
        </p>

        <div className="mt-5 flex flex-col gap-1.5 text-left">
          <Label htmlFor="onboardingSalary">Gaji pokok bulanan (RM)</Label>
          <NumberField id="onboardingSalary" value={salary} onValueChange={setSalary} placeholder="Cth: 3500" />
        </div>

        <Button type="button" onClick={handleStart} className="mt-5 w-full">
          Mula guna Dewasa 101
        </Button>
      </div>
    </div>
  );
}
