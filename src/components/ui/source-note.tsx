import { ExternalLink } from 'lucide-react';

export function SourceNote({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="mt-3 inline-flex items-center gap-1.5 text-xs text-text hover:text-brand-300"
    >
      <ExternalLink size={12} />
      Sumber: {label}
    </a>
  );
}
