import { WEEKDAY_NAMES_MY } from '@/features/holiday-planner/data';
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
                'flex h-11 cursor-pointer flex-col items-center justify-center rounded-xl text-xs transition-all active:scale-95 sm:h-12 disabled:cursor-default',
                holidayName && 'bg-brand-500/20 font-semibold text-brand-300',
                !holidayName && weekend && 'bg-surface-muted text-text',
                !holidayName && !weekend && !booked && 'text-text-h hover:bg-brand-500/10',
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
