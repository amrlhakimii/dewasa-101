import { MONTH_NAMES_MY, WEEKDAY_NAMES_MY } from '@/features/holiday-planner/data';
import { getHolidayMap, isWeekend, toIsoDate, type WeekendType } from '@/features/holiday-planner/logic';
import { cn } from '@/lib/utils';

interface MonthCalendarProps {
  year: number;
  month: number; // 0-11
  weekendType: WeekendType;
  bookedDates: Set<string>;
  onToggleBooked: (iso: string) => void;
}

export function MonthCalendar({ year, month, weekendType, bookedDates, onToggleBooked }: MonthCalendarProps) {
  const holidayMap = getHolidayMap(year);
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const leadingBlanks = firstOfMonth.getUTCDay(); // 0 = Sunday

  const cells: (Date | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(Date.UTC(year, month, i + 1))),
  ];

  return (
    <div>
      <p className="font-display mb-2 text-sm font-bold text-text-h">
        {MONTH_NAMES_MY[month]} {year}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-text">
        {WEEKDAY_NAMES_MY.map((d) => (
          <div key={d} className="pb-1 font-semibold">
            {d}
          </div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={`blank-${i}`} />;

          const iso = toIsoDate(date);
          const weekend = isWeekend(date, weekendType);
          const holidayName = holidayMap.get(iso);
          const booked = bookedDates.has(iso);
          const isWorkingDay = !weekend && !holidayName;

          return (
            <button
              key={iso}
              type="button"
              disabled={!isWorkingDay}
              onClick={() => onToggleBooked(iso)}
              title={holidayName ?? undefined}
              className={cn(
                'flex aspect-square flex-col items-center justify-center rounded-lg text-xs transition-colors',
                holidayName && 'bg-brand-500/20 font-semibold text-brand-300',
                !holidayName && weekend && 'bg-surface-muted text-text',
                !holidayName && !weekend && !booked && 'text-text-h hover:bg-surface-muted',
                booked && 'bg-success-bg font-semibold text-success',
              )}
            >
              {date.getUTCDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
