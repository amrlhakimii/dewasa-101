import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { calculateHomePurchaseCosts, calculateMoveInCosts } from '@/features/living-costs/logic';
import { formatCurrency } from '@/utils/formatters';

export function RentVsBuySimulator() {
  const [monthlyRent, setMonthlyRent] = useState(1500);
  const [propertyPrice, setPropertyPrice] = useState(350000);

  const rentCosts = calculateMoveInCosts(monthlyRent);
  const buyCosts = calculateHomePurchaseCosts(propertyPrice, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>The Reality Check: moving out</CardTitle>
        <CardDescription>Upfront cash you need before you get the keys — not the monthly instalment.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rent">
          <TabsList>
            <TabsTrigger value="rent">Renting</TabsTrigger>
            <TabsTrigger value="buy">Buying</TabsTrigger>
          </TabsList>

          <TabsContent value="rent">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="monthlyRent">Monthly rent (RM)</Label>
                <NumberField id="monthlyRent" value={monthlyRent} onValueChange={setMonthlyRent} />
              </div>

              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-sm text-text">Total cash required to move in</p>
                <p className="text-3xl font-bold text-accent">{formatCurrency(rentCosts.totalCashRequired)}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <Row label="Security deposit (2 months)" value={rentCosts.breakdown.securityDeposit} />
                <Row label="Utility deposit (0.5 month)" value={rentCosts.breakdown.utilityDeposit} />
                <Row label="Advance rental (1 month)" value={rentCosts.breakdown.advanceRental} />
                <Row label="Tenancy stamp duty" value={rentCosts.breakdown.stampDuty} />
                <Row label="Agency admin fee" value={rentCosts.breakdown.estimatedAdminFee} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="buy">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="propertyPrice">Property price (RM)</Label>
                <NumberField id="propertyPrice" value={propertyPrice} onValueChange={setPropertyPrice} />
              </div>

              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-sm text-text">Total cash required to complete purchase</p>
                <p className="text-3xl font-bold text-accent">{formatCurrency(buyCosts.totalCashRequired)}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <Row label="Down payment (10%)" value={buyCosts.downPayment} />
                <Row label="MOT stamp duty" value={buyCosts.mot} />
                <Row label="Legal fees (SPA)" value={buyCosts.legalFees} />
                <Row label="Loan agreement stamp duty" value={buyCosts.loanAgreementStampDuty} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between border-b border-border/60 pb-2">
      <span className="text-text">{label}</span>
      <span className="font-medium text-text-h">{formatCurrency(value)}</span>
    </div>
  );
}
