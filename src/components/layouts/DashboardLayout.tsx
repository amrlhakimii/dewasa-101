import type { ReactNode } from 'react';
import { AuthButton } from '@/components/AuthButton';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-bg">
      <header className="sticky top-0 z-10 border-b border-border bg-bg/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-glow">
              D
            </span>
            <div>
              <h1 className="font-display text-base font-bold">
                <span className="text-brand-300">Dewasa</span> <span className="text-text-h">101</span>
              </h1>
              <p className="text-xs text-text">Financial reality checks for young Malaysians</p>
            </div>
          </div>
          <AuthButton />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
