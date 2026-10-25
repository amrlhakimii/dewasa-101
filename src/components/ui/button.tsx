import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-brand-500 to-brand-700 text-white shadow-glow hover:shadow-glow-hover hover:brightness-105',
  secondary: 'bg-surface/80 text-text-h border border-white/10 hover:bg-white/10',
  ghost: 'bg-transparent text-text hover:bg-surface-muted hover:text-text-h',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'min-h-11 px-3 text-sm rounded-lg sm:min-h-0 sm:h-8',
  md: 'min-h-11 px-4 text-sm rounded-xl sm:min-h-0 sm:h-10',
};

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
