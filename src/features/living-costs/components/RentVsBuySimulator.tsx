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
        <CardTitle>Semakan Realiti: Berpindah Rumah</CardTitle>
        <CardDescription>Wang tunai perlu disediakan sebelum dapat kunci — bukan ansuran bulanan.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rent">
          <TabsList>
            <TabsTrigger value="rent">Menyewa</TabsTrigger>
            <TabsTrigger value="buy">Membeli</TabsTrigger>
          </TabsList>

          <TabsContent value="rent">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="monthlyRent">Sewa bulanan (RM)</Label>
                <NumberField id="monthlyRent" value={monthlyRent} onValueChange={setMonthlyRent} />
              </div>

              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-sm text-text">Jumlah tunai diperlukan untuk berpindah masuk</p>
                <p className="text-3xl font-bold text-accent">{formatCurrency(rentCosts.totalCashRequired)}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <Row label="Deposit keselamatan (2 bulan)" value={rentCosts.breakdown.securityDeposit} />
                <Row label="Deposit utiliti (0.5 bulan)" value={rentCosts.breakdown.utilityDeposit} />
                <Row label="Sewa pendahuluan (1 bulan)" value={rentCosts.breakdown.advanceRental} />
                <Row label="Duti setem perjanjian sewa" value={rentCosts.breakdown.stampDuty} />
                <Row label="Yuran pentadbiran ejen" value={rentCosts.breakdown.estimatedAdminFee} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="buy">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="propertyPrice">Harga hartanah (RM)</Label>
                <NumberField id="propertyPrice" value={propertyPrice} onValueChange={setPropertyPrice} />
              </div>

              <div className="rounded-2xl bg-surface-muted p-4">
                <p className="text-sm text-text">Jumlah tunai diperlukan untuk selesaikan pembelian</p>
                <p className="text-3xl font-bold text-accent">{formatCurrency(buyCosts.totalCashRequired)}</p>
              </div>

              <div className="flex flex-col gap-2 text-sm">
                <Row label="Bayaran pendahuluan (10%)" value={buyCosts.downPayment} />
                <Row label="Duti setem MOT" value={buyCosts.mot} />
                <Row label="Yuran guaman (SPA)" value={buyCosts.legalFees} />
                <Row label="Duti setem perjanjian pinjaman" value={buyCosts.loanAgreementStampDuty} />
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
