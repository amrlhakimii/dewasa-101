export interface GlossaryEntry {
  term: string;
  explanation: string;
}

// Perkara yang biasanya tiada siapa terangkan bila mula bekerja — apa
// sebenarnya semua potongan dalam slip gaji, dan kenapa CCRIS/CTOS penting.
export const PAYSLIP_GLOSSARY: GlossaryEntry[] = [
  {
    term: 'KWSP (EPF)',
    explanation:
      'Simpanan persaraan wajib. Anda caruman 11% gaji, majikan caruman 12-13%. Duit ini milik anda, berkembang dengan dividen tahunan, dan boleh dikeluarkan mengikut syarat (persaraan, rumah pertama, dll).',
  },
  {
    term: 'PERKESO (SOCSO)',
    explanation:
      'Insurans sosial jika anda alami kemalangan/kecacatan berkaitan kerja. Potongan kecil (0.5%) tapi memberi perlindungan besar jika berlaku kejadian.',
  },
  {
    term: 'SIP (EIS)',
    explanation:
      'Sistem Insurans Pekerjaan — bantuan kewangan sementara jika anda hilang kerja (diberhentikan bukan atas kesalahan sendiri). Potongan 0.2%.',
  },
  {
    term: 'PCB (Potongan Cukai Bulanan)',
    explanation:
      'Anggaran cukai pendapatan tahunan anda, dipotong sikit-sikit setiap bulan supaya tidak perlu bayar sekali gus semasa e-Filing. Boleh lebih/kurang bayar — itu sebab ada refund atau baki bayar semasa isi cukai.',
  },
];

export const CREDIT_GLOSSARY: GlossaryEntry[] = [
  {
    term: 'CCRIS',
    explanation:
      'Rekod pinjaman anda yang disimpan Bank Negara Malaysia — bank rujuk ini untuk lihat sejarah bayaran (tepat masa/lewat) sebelum luluskan pinjaman baharu.',
  },
  {
    term: 'CTOS',
    explanation:
      'Syarikat swasta yang mengumpul skor kredit anda (macam skor kredit di negara lain). Bank & sesetengah majikan mungkin semak ini. Bayar bil tepat masa untuk skor yang baik.',
  },
];
