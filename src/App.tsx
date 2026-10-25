import {
  BookOpen,
  CalendarDays,
  CreditCard,
  HandCoins,
  Home,
  LayoutDashboard,
  PiggyBank,
  Receipt,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { NavList, NavTrigger, Tabs, TabsContent } from '@/components/ui/tabs';
import { SignInPage } from '@/features/auth/components/SignInPage';
import { DebtInputForm } from '@/features/debt-dsr/components/DebtInputForm';
import { DsrGaugeometer } from '@/features/debt-dsr/components/DsrGaugeometer';
import { GoalSimulator } from '@/features/goal-planner/components/GoalSimulator';
import { PanduanPage } from '@/features/guide/components/PanduanPage';
import { HolidayPlannerPage } from '@/features/holiday-planner/components/HolidayPlannerPage';
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
import { OnboardingModal } from '@/features/onboarding/components/OnboardingModal';
import logo from '@/assets/logo-source.png';
import { logEvent } from '@/lib/firebase';
import { useAuth } from '@/lib/useAuth';
import { useFirestoreSync } from '@/lib/useFirestoreSync';
import { useFinanceStore } from '@/stores/useFinanceStore';

const TAB_ITEMS = [
  { value: 'overview', label: 'Ringkasan', icon: LayoutDashboard },
  { value: 'income', label: 'Pendapatan', icon: Wallet },
  { value: 'commitments', label: 'Komitmen', icon: CreditCard },
  { value: 'housing', label: 'Perumahan', icon: Home },
  { value: 'simulation', label: 'Simulasi', icon: Sparkles },
  { value: 'tax', label: 'Cukai', icon: Receipt },
  { value: 'zakat', label: 'Zakat', icon: HandCoins },
  { value: 'retirement', label: 'KWSP', icon: PiggyBank },
  { value: 'guide', label: 'Panduan', icon: BookOpen },
  { value: 'holidays', label: 'Cuti', icon: CalendarDays },
] as const;

function App() {
  const [tab, setTab] = useState('overview');
  const { user, loading } = useAuth();
  const { ready } = useFirestoreSync();
  const hasOnboarded = useFinanceStore((s) => s.hasOnboarded);
  const navRef = useRef<HTMLDivElement>(null);
  const activeItem = TAB_ITEMS.find((item) => item.value === tab) ?? TAB_ITEMS[0];

  // Keep the active nav item visible when the pill scrolls on narrow screens.
  useEffect(() => {
    navRef.current
      ?.querySelector<HTMLElement>('[data-state="active"]')
      ?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }, [tab, user, ready]);

  function handleTabChange(next: string) {
    setTab(next);
    logEvent('tab_change', { tab: next });
  }

  if (loading || (user && !ready)) {
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
      {!hasOnboarded && <OnboardingModal />}
      <Tabs value={tab} onValueChange={handleTabChange}>
        <div className="mb-6 animate-fade-up">
          <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">{activeItem.label}</h2>
        </div>

        <nav
          aria-label="Navigasi utama"
          className="fixed left-1/2 z-50 w-max max-w-[calc(100vw-1rem)] -translate-x-1/2"
          style={{ bottom: 'calc(20px + env(safe-area-inset-bottom))' }}
        >
          <div
            ref={navRef}
            className="rounded-full"
            style={{
              background: 'rgba(18,18,20,0.65)',
              backdropFilter: 'blur(28px) saturate(160%)',
              WebkitBackdropFilter: 'blur(28px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset',
            }}
          >
            <NavList>
              {TAB_ITEMS.map((item) => (
                <NavTrigger key={item.value} value={item.value} aria-label={item.label} title={item.label}>
                  <item.icon size={18} strokeWidth={tab === item.value ? 2.5 : 1.75} />
                </NavTrigger>
              ))}
            </NavList>
          </div>
        </nav>

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

        <TabsContent value="holidays">
          <HolidayPlannerPage />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

export default App;
