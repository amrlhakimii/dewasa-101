import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInPage } from '@/features/auth/components/SignInPage';
import { DebtInputForm } from '@/features/debt-dsr/components/DebtInputForm';
import { DsrGaugeometer } from '@/features/debt-dsr/components/DsrGaugeometer';
import { GoalSimulator } from '@/features/goal-planner/components/GoalSimulator';
import { PanduanPage } from '@/features/guide/components/PanduanPage';
import { RentVsBuySimulator } from '@/features/living-costs/components/RentVsBuySimulator';
import { DeductionsBreakdownCard } from '@/features/net-salary/components/DeductionsBreakdownCard';
import { SalaryInputForm } from '@/features/net-salary/components/SalaryInputForm';
import { OverviewPage } from '@/features/overview/components/OverviewPage';
import { RetirementProjection } from '@/features/retirement/components/RetirementProjection';
import { TaxBreakdownCard } from '@/features/tax/components/TaxBreakdownCard';
import { TaxFilingGuide } from '@/features/tax/components/TaxFilingGuide';
import { TaxReliefChecklist } from '@/features/tax/components/TaxReliefChecklist';
import { ZakatBreakdownCard } from '@/features/zakat/components/ZakatBreakdownCard';
import { ZakatInputForm } from '@/features/zakat/components/ZakatInputForm';
import { ZakatPaymentGuide } from '@/features/zakat/components/ZakatPaymentGuide';
import logo from '@/assets/logo-source.png';
import { logEvent } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { useFirestoreSync } from '@/lib/useFirestoreSync';

const TAB_ITEMS = [
  { value: 'overview', label: 'Ringkasan' },
  { value: 'income', label: 'Pendapatan' },
  { value: 'commitments', label: 'Komitmen' },
  { value: 'housing', label: 'Perumahan' },
  { value: 'simulation', label: 'Simulasi' },
  { value: 'tax', label: 'Cukai' },
  { value: 'zakat', label: 'Zakat' },
  { value: 'retirement', label: 'KWSP' },
  { value: 'guide', label: 'Panduan' },
] as const;

function App() {
  const [tab, setTab] = useState('overview');
  const { user, loading } = useAuth();
  useFirestoreSync();

  function handleTabChange(next: string) {
    setTab(next);
    logEvent('tab_change', { tab: next });
  }

  if (loading) {
    return (
      <div className="app-bg flex min-h-svh items-center justify-center">
        <img src={logo} alt="" className="h-14 w-14 animate-pulse rounded-2xl shadow-glow" />
      </div>
    );
  }

  if (!user) {
    return <SignInPage />;
  }

  return (
    <DashboardLayout>
      <Tabs value={tab} onValueChange={handleTabChange}>
        {/* Small screens: a native dropdown, so every page stays reachable
            with no hidden/clipped items — a horizontal-scroll pill row gives
            no visual hint there's more to swipe to. */}
        <select
          value={tab}
          onChange={(e) => handleTabChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-sm font-semibold text-text-h outline-none focus:border-accent sm:hidden"
        >
          {TAB_ITEMS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <TabsList className="hidden sm:flex">
          {TAB_ITEMS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview">
          <OverviewPage onNavigate={handleTabChange} />
        </TabsContent>

        <TabsContent value="income">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SalaryInputForm />
            <DeductionsBreakdownCard />
          </div>
        </TabsContent>

        <TabsContent value="commitments">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DebtInputForm />
            <DsrGaugeometer />
          </div>
        </TabsContent>

        <TabsContent value="housing">
          <RentVsBuySimulator />
        </TabsContent>

        <TabsContent value="simulation">
          <GoalSimulator />
        </TabsContent>

        <TabsContent value="tax">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              <TaxReliefChecklist />
              <TaxFilingGuide />
            </div>
            <TaxBreakdownCard />
          </div>
        </TabsContent>

        <TabsContent value="zakat">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              <ZakatInputForm />
              <ZakatPaymentGuide />
            </div>
            <ZakatBreakdownCard />
          </div>
        </TabsContent>

        <TabsContent value="retirement">
          <RetirementProjection />
        </TabsContent>

        <TabsContent value="guide">
          <PanduanPage />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

export default App;
