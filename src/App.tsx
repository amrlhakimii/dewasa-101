import { useState } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DebtInputForm } from '@/features/debt-dsr/components/DebtInputForm';
import { DsrGaugeometer } from '@/features/debt-dsr/components/DsrGaugeometer';
import { GoalSimulator } from '@/features/goal-planner/components/GoalSimulator';
import { RentVsBuySimulator } from '@/features/living-costs/components/RentVsBuySimulator';
import { DeductionsBreakdownCard } from '@/features/net-salary/components/DeductionsBreakdownCard';
import { SalaryInputForm } from '@/features/net-salary/components/SalaryInputForm';
import { OverviewPage } from '@/features/overview/components/OverviewPage';
import { TaxReliefChecklist } from '@/features/tax-zakat/components/TaxReliefChecklist';
import { ZakatInputForm } from '@/features/tax-zakat/components/ZakatInputForm';
import { ZakatRebateVisualizer } from '@/features/tax-zakat/components/ZakatRebateVisualizer';

function App() {
  const [tab, setTab] = useState('overview');

  return (
    <DashboardLayout>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="income">Pendapatan</TabsTrigger>
          <TabsTrigger value="commitments">Komitmen</TabsTrigger>
          <TabsTrigger value="tax">Cukai &amp; Zakat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewPage onNavigate={setTab} />
        </TabsContent>

        <TabsContent value="income">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <SalaryInputForm />
            <DeductionsBreakdownCard />
          </div>
        </TabsContent>

        <TabsContent value="commitments">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <DebtInputForm />
              <DsrGaugeometer />
            </div>
            <RentVsBuySimulator />
            <GoalSimulator />
          </div>
        </TabsContent>

        <TabsContent value="tax">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              <TaxReliefChecklist />
              <ZakatInputForm />
            </div>
            <ZakatRebateVisualizer />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

export default App;
