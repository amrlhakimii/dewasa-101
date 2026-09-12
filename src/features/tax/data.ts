// Senarai pelepasan cukai individu yang paling kerap digunakan oleh golongan
// muda bekerja. Had sebenar tertakluk kepada syarat LHDN — lihat sumber rasmi.
export const TAX_RELIEF_CHECKLIST = [
  { id: 'lifestyle', label: 'Gaya hidup (buku, gajet, internet, gimnasium)', max: 2500 },
  { id: 'medical-parents', label: 'Rawatan perubatan ibu bapa', max: 8000 },
  { id: 'epf-life-insurance', label: 'KWSP + insurans hayat', max: 7000 },
  { id: 'sspn', label: 'Simpanan bersih SSPN', max: 8000 },
  { id: 'child-education', label: 'Pendidikan & penjagaan anak (bawah 6 tahun)', max: 3000 },
  { id: 'medical-self', label: 'Perbelanjaan perubatan (diri/pasangan/anak)', max: 10000 },
] as const;
