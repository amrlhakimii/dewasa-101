export interface PublicHoliday {
  date: string; // ISO YYYY-MM-DD
  name: string;
}

// Malaysia federal public holidays. Fixed-date holidays (New Year, Labour Day,
// Merdeka, Malaysia Day, Christmas) are certain; Islamic/Hindu/Chinese
// calendar-based dates (Raya, CNY, Wesak, Deepavali, Awal Muharram, Maulidur
// Rasul) are sourced and can still shift with official moon-sighting
// announcements. State-specific holidays (Thaipusam, Awal Ramadan, Gawai,
// Kaamatan, etc.) are NOT included — this is the federal/national list only.
// See DATA_SOURCES.PUBLIC_HOLIDAYS.
export const PUBLIC_HOLIDAYS_2026: PublicHoliday[] = [
  { date: '2026-01-01', name: 'Tahun Baru' },
  { date: '2026-02-17', name: 'Tahun Baru Cina (Hari 1)' },
  { date: '2026-02-18', name: 'Tahun Baru Cina (Hari 2)' },
  { date: '2026-03-20', name: 'Cuti Tambahan Hari Raya Aidilfitri' },
  { date: '2026-03-21', name: 'Hari Raya Aidilfitri (Hari 1)' },
  { date: '2026-03-22', name: 'Hari Raya Aidilfitri (Hari 2)' },
  { date: '2026-03-23', name: 'Ganti Hari Raya Aidilfitri' },
  { date: '2026-05-01', name: 'Hari Pekerja' },
  { date: '2026-05-27', name: 'Hari Raya Haji' },
  { date: '2026-05-31', name: 'Hari Wesak' },
  { date: '2026-06-01', name: 'Hari Keputeraan Yang di-Pertuan Agong' },
  { date: '2026-06-17', name: 'Awal Muharram' },
  { date: '2026-08-25', name: 'Maulidur Rasul' },
  { date: '2026-08-31', name: 'Hari Kebangsaan' },
  { date: '2026-09-16', name: 'Hari Malaysia' },
  { date: '2026-11-08', name: 'Deepavali' },
  { date: '2026-11-09', name: 'Ganti Deepavali' },
  { date: '2026-12-25', name: 'Hari Krismas' },
];

export const PUBLIC_HOLIDAYS_2027: PublicHoliday[] = [
  { date: '2027-01-01', name: 'Tahun Baru' },
  { date: '2027-02-06', name: 'Tahun Baru Cina (Hari 1)' },
  { date: '2027-02-07', name: 'Tahun Baru Cina (Hari 2)' },
  { date: '2027-03-10', name: 'Hari Raya Aidilfitri (Hari 1)' },
  { date: '2027-03-11', name: 'Hari Raya Aidilfitri (Hari 2)' },
  { date: '2027-05-01', name: 'Hari Pekerja' },
  { date: '2027-05-17', name: 'Hari Raya Haji' },
  { date: '2027-05-20', name: 'Hari Wesak' },
  { date: '2027-06-06', name: 'Awal Muharram' },
  { date: '2027-06-07', name: 'Hari Keputeraan Agong / Ganti Awal Muharram' },
  { date: '2027-08-15', name: 'Maulidur Rasul' },
  { date: '2027-08-16', name: 'Ganti Maulidur Rasul' },
  { date: '2027-08-31', name: 'Hari Kebangsaan' },
  { date: '2027-09-16', name: 'Hari Malaysia' },
  { date: '2027-10-28', name: 'Deepavali' },
  { date: '2027-12-25', name: 'Hari Krismas' },
];

export const PUBLIC_HOLIDAYS_BY_YEAR: Record<number, PublicHoliday[]> = {
  2026: PUBLIC_HOLIDAYS_2026,
  2027: PUBLIC_HOLIDAYS_2027,
};

export const MONTH_NAMES_MY = [
  'Januari',
  'Februari',
  'Mac',
  'April',
  'Mei',
  'Jun',
  'Julai',
  'Ogos',
  'September',
  'Oktober',
  'November',
  'Disember',
];

export const WEEKDAY_NAMES_MY = ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'];
