import * as TabsPrimitive from '@radix-ui/react-tabs';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

// Recessed track, accent-filled active tab.
export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-bg p-1',
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
        'inline-flex min-h-11 shrink-0 cursor-pointer items-center rounded-lg px-3 text-sm font-medium whitespace-nowrap text-text-h/50 transition-all sm:min-h-0 sm:py-2',
        'data-[state=active]:bg-brand-600 data-[state=active]:text-white',
        'data-[state=inactive]:hover:text-text-h',
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content className={cn('mt-6 animate-fade-up focus:outline-none', className)} {...props} />;
}

// Floating glass pill nav. Active item = gradient fill + brand glow.
export function NavList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('nav-scroll flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1.5', className)}
      {...props}
    />
  );
}

export function NavTrigger({ className, children, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'group relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-h/45 transition-all duration-200',
        'hover:text-text-h data-[state=active]:text-white',
        className,
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-200 group-data-[state=active]:opacity-100"
        style={{ background: 'linear-gradient(145deg, #e11d48, #9f1239)', boxShadow: '0 0 16px rgba(190,18,60,0.5)' }}
      />
      <span className="relative">{children}</span>
    </TabsPrimitive.Trigger>
  );
}
