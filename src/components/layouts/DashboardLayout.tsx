import type { ReactNode } from 'react';
import { AuthButton } from '@/components/AuthButton';
import logo from '@/assets/logo-source.png';

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-bg">
      <header
        className="sticky top-0 z-10 border-b border-hairline bg-bg/60 backdrop-blur-xl"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Dewasa 101" className="h-8 w-8 rounded-xl shadow-glow" />
            <div>
              <h1 className="font-display text-lg font-extrabold tracking-tight">
                <span className="text-brand-300">Dewasa</span> <span className="text-text-h">101</span>
              </h1>
              <p className="hidden text-xs text-text sm:block">Semakan realiti kewangan untuk generasi muda Malaysia</p>
            </div>
          </div>
          <AuthButton />
        </div>
      </header>

      <main
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
        style={{
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
          paddingBottom: 'calc(7rem + env(safe-area-inset-bottom))',
        }}
      >
        {children}
      </main>
    </div>
  );
}
