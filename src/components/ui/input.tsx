import type { InputHTMLAttributes, LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-xl border border-border bg-surface-muted px-3 py-2.5 text-sm text-text-h outline-none transition-colors placeholder:text-text/50 focus:border-accent focus:bg-surface',
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('label-eyebrow mb-1 block', className)} {...props} />;
}
