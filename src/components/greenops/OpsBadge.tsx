import React from 'react';

type OpsBadgeTone = 'light' | 'dark' | 'success' | 'warning';

type OpsBadgeProps = {
  children: React.ReactNode;
  tone?: OpsBadgeTone;
  className?: string;
};

const toneClass: Record<OpsBadgeTone, string> = {
  light: 'border-[var(--color-primary)]/15 bg-white/70 text-[var(--color-primary)]',
  dark: 'border-white/15 bg-white/10 text-[var(--color-background-main)]',
  success: 'border-[var(--color-primary)]/20 bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
  warning: 'border-[#A3B18A]/35 bg-[#A3B18A]/20 text-[var(--color-primary)]',
};

export default function OpsBadge({ children, tone = 'light', className = '' }: OpsBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-7 items-center gap-2 rounded-[6px] border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${toneClass[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
