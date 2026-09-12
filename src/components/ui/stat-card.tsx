import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  caption?: string;
  icon?: LucideIcon;
  tone?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'text-text-h',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
};

const iconToneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  default: 'bg-brand-500/15 text-brand-300',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
};

export function StatCard({ label, value, caption, icon: Icon, tone = 'default', className }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/5 bg-surface/90 p-4 shadow-card backdrop-blur-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="label-eyebrow min-w-0">{label}</span>
        {Icon && (
          <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', iconToneClasses[tone])}>
            <Icon size={16} strokeWidth={2.5} />
          </span>
        )}
      </div>
      <p className={cn('font-display mt-2 text-2xl font-bold tracking-tight', toneClasses[tone])}>{value}</p>
      {caption && <p className="mt-1 text-xs text-text">{caption}</p>}
    </div>
  );
}
