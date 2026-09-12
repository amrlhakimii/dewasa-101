import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-surface-muted p-1',
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex h-8 shrink-0 items-center rounded-full whitespace-nowrap px-4 text-sm font-semibold text-text transition-all',
        'data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-500 data-[state=active]:to-brand-700 data-[state=active]:text-white data-[state=active]:shadow-glow',
        'data-[state=inactive]:hover:text-text-h',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-4 animate-fade-up focus:outline-none', className)} {...props} />;
}
