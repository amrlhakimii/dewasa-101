import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES } from '@/config/statutory';

export function ZakatPaymentGuide() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cara Bayar &amp; Tuntut Rebat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <Step
          n={1}
          title="Bayar melalui portal/app lembaga zakat negeri anda"
          body="Setiap negeri ada portal sendiri (cth: zakatselangor.com.my untuk Selangor). Boleh bayar online, bank-in, atau kaunter."
        />
        <Step
          n={2}
          title="Atau minta majikan potong terus dari gaji"
          body="Majikan boleh selaraskan potongan zakat dengan PCB bulanan anda — jika zakat menyamai/melebihi PCB, potongan cukai bulanan mungkin tidak diperlukan."
        />
        <Step
          n={3}
          title="Simpan resit rasmi"
          body="LHDN hanya terima resit asal daripada institusi zakat negeri yang diiktiraf — wajib disimpan sekiranya disemak (audit)."
        />
        <Step
          n={4}
          title="Tuntut semasa e-Filing"
          body="Dalam MyTax, masukkan jumlah zakat di bahagian 'Pelepasan Cukai' → ruangan 'Zakat dan Fitrah'. Ini rebat terus (bukan pelepasan), jadi kurangkan cukai dolar-untuk-dolar."
        />
        <p className="text-xs text-text">
          Perlu dibayar sebelum 31 Disember tahun taksiran berkenaan untuk layak dituntut tahun itu.
        </p>
        <SourceNote label="Lembaga Zakat Selangor" href={DATA_SOURCES.ZAKAT_PENDAPATAN} />
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
