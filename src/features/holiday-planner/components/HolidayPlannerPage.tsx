import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/input';
import { NumberField } from '@/components/ui/number-field';
import { SourceNote } from '@/components/ui/source-note';
import { DATA_SOURCES } from '@/config/statutory';
import { MonthCalendar } from '@/features/holiday-planner/components/MonthCalendar';
import { MONTH_NAMES_MY } from '@/features/holiday-planner/data';
import { findBridgeSuggestions, formatDateRangeMY, getHolidaysForYear, type WeekendType } from '@/features/holiday-planner/logic';
import { useFinanceStore } from '@/stores/useFinanceStore';
import { cn } from '@/lib/utils';

const YEARS = [2026, 2027] as const;

export function HolidayPlannerPage() {
  const annualLeaveBalance = useFinanceStore((s) => s.annualLeaveBalance);
  const medicalLeaveBalance = useFinanceStore((s) => s.medicalLeaveBalance);
  const otherLeaveBalance = useFinanceStore((s) => s.otherLeaveBalance);
  const bookedLeaveDates = useFinanceStore((s) => s.bookedLeaveDates);
  const setAnnualLeaveBalance = useFinanceStore((s) => s.setAnnualLeaveBalance);
  const setMedicalLeaveBalance = useFinanceStore((s) => s.setMedicalLeaveBalance);
  const setOtherLeaveBalance = useFinanceStore((s) => s.setOtherLeaveBalance);
  const toggleBookedLeave = useFinanceStore((s) => s.toggleBookedLeave);

  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState(0);
  const [weekendType, setWeekendType] = useState<WeekendType>('sat-sun');

  const bookedSet = useMemo(() => new Set(bookedLeaveDates), [bookedLeaveDates]);
  const bookedThisYear = useMemo(
    () => bookedLeaveDates.filter((d) => d.startsWith(String(year))).length,
    [bookedLeaveDates, year],
  );
  const alRemaining = Math.max(0, annualLeaveBalance - bookedThisYear);

  const suggestions = useMemo(() => findBridgeSuggestions(year, weekendType), [year, weekendType]);
  const holidays = getHolidaysForYear(year);

  function changeMonth(delta: number) {
    let nextMonth = month + delta;
    let nextYear = year;
    if (nextMonth < 0) {
      nextMonth = 11;
      nextYear = Math.max(YEARS[0], year - 1);
    } else if (nextMonth > 11) {
      nextMonth = 0;
      nextYear = Math.min(YEARS[YEARS.length - 1], year + 1);
    }
    setMonth(nextMonth);
    setYear(nextYear);
  }

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardHeader>
          <CardTitle>Perancang Cuti</CardTitle>
          <CardDescription>Rancang cuti panjang dengan bijak — jimat AL, maksimumkan percutian.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="alBalance">Baki Cuti Tahunan (AL)</Label>
              <NumberField id="alBalance" value={annualLeaveBalance} onValueChange={setAnnualLeaveBalance} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mcBalance">Baki Cuti Sakit (MC)</Label>
              <NumberField id="mcBalance" value={medicalLeaveBalance} onValueChange={setMedicalLeaveBalance} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="otherLeave">Cuti Lain-lain</Label>
              <NumberField id="otherLeave" value={otherLeaveBalance} onValueChange={setOtherLeaveBalance} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-muted px-3 py-2.5 text-sm">
            <span className="text-text">
              Hujung minggu anda: <span className="font-semibold text-text-h">
                {weekendType === 'sat-sun' ? 'Sabtu–Ahad' : 'Jumaat–Sabtu'}
              </span>
            </span>
            <div className="flex shrink-0 gap-1 rounded-full bg-surface p-0.5">
              {(
                [
                  { value: 'sat-sun' as const, label: 'Sabtu–Ahad' },
                  { value: 'fri-sat' as const, label: 'Jumaat–Sabtu' },
                ]
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setWeekendType(opt.value)}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-semibold transition-all',
                    weekendType === opt.value ? 'bg-brand-600 text-white' : 'text-text hover:text-text-h',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-text">
            Baki AL selepas tolak cuti dibooking untuk {year}: <strong className="text-text-h">{alRemaining} hari</strong>
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Kalendar</CardTitle>
            <CardDescription>Klik hari bekerja untuk tanda sebagai cuti dibooking.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text hover:bg-surface-muted"
                aria-label="Bulan sebelum"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold text-text-h">
                {MONTH_NAMES_MY[month]} {year}
              </span>
              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-text hover:bg-surface-muted"
                aria-label="Bulan seterusnya"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <MonthCalendar
              year={year}
              month={month}
              weekendType={weekendType}
              bookedDates={bookedSet}
              onToggleBooked={toggleBookedLeave}
            />

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-text">
              <LegendDot className="bg-brand-500/20" label="Cuti umum" />
              <LegendDot className="bg-surface-muted" label="Hujung minggu" />
              <LegendDot className="bg-success-bg" label="Cuti dibooking" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cadangan Cuti Panjang</CardTitle>
            <CardDescription>Ambil sikit AL, dapat percutian lebih panjang.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {suggestions.length === 0 && <p className="text-sm text-text">Tiada peluang cuti-jambatan dikesan untuk {year}.</p>}
            {suggestions.slice(0, 6).map((s) => (
              <div key={s.leaveStartIso} className="rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-semibold text-text-h">
                    <CalendarDays size={13} className="shrink-0 text-brand-300" />
                    {s.breakDays} hari percutian
                  </span>
                  <span className="shrink-0 rounded-full bg-brand-500/15 px-2 py-0.5 text-xs font-semibold text-brand-300">
                    {s.leaveDays} hari AL
                  </span>
                </div>
                <p className="mt-1 text-xs text-text">
                  Ambil cuti {formatDateRangeMY(s.leaveStartIso, s.leaveEndIso)} → percutian{' '}
                  {formatDateRangeMY(s.breakStartIso, s.breakEndIso)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cuti Umum {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {holidays.map((h) => (
              <div key={h.date} className="flex items-center justify-between gap-2 rounded-lg bg-surface-muted px-3 py-2 text-sm">
                <span className="min-w-0 truncate text-text-h">{h.name}</span>
                <span className="shrink-0 text-xs text-text">{formatDateRangeMY(h.date, h.date)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-text">
            Senarai cuti umum persekutuan sahaja — cuti khusus negeri (Thaipusam, Awal Ramadan, dll.) tidak
            disertakan. Tarikh boleh berubah ikut pengumuman rasmi kerajaan.
          </p>
          <SourceNote label="publicholidays.com.my" href={DATA_SOURCES.PUBLIC_HOLIDAYS} />
        </CardContent>
      </Card>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('h-3 w-3 rounded-full', className)} />
      {label}
    </span>
  );
}
