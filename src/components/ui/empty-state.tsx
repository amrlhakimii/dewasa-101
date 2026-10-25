import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center select-none">
      <div
        className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl text-brand-300"
        style={{ background: 'rgba(190,18,60,0.08)', border: '1px solid rgba(190,18,60,0.18)' }}
      >
        <Icon size={28} strokeWidth={1.75} />
      </div>
      <p className="mb-1 text-base font-semibold text-text-h/70">{title}</p>
      {description && <p className="max-w-xs text-sm text-text-h/40">{description}</p>}
    </div>
  );
}
