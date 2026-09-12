import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES } from '@/config/statutory';

export function TaxFilingGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cara Isi &amp; Bayar Cukai</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <Step
          n={1}
          title="Daftar / log masuk MyTax"
          body="Pergi ke mytax.hasil.gov.my. Pengguna baharu perlu daftar sekali menggunakan MyKad — e-Filing dibuka mulai 1 Mac setiap tahun."
        />
        <Step
          n={2}
          title="Isi borang (BE untuk penggaji, B jika ada perniagaan)"
          body="Semak nombor gaji tahunan, elaun, dan pelepasan (termasuk zakat — masukkan dalam ruangan 'Zakat dan Fitrah', bukan borang berasingan)."
        />
        <Step
          n={3}
          title="Hantar sebelum tarikh akhir"
          body="30 April (tiada punca perniagaan) atau 30 Jun (ada punca perniagaan). LHDN kadangkala umumkan lanjutan masa rasmi — semak MyTax untuk makluman terkini."
        />
        <Step
          n={4}
          title="Bayar melalui ByrHASiL"
          body="Jika ada baki cukai perlu dibayar, guna ByrHASiL dalam MyTax (FPX perbankan internet), atau bayar di kaunter bank/pos berdaftar."
        />
        <SourceNote label="LHDN — MyTax" href={DATA_SOURCES.MYTAX} />
      </CardContent>
    </Card>
  );
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-300">
        {n}
      </span>
      <div>
        <p className="font-semibold text-text-h">{title}</p>
        <p className="text-text">{body}</p>
      </div>
    </div>
  );
}
