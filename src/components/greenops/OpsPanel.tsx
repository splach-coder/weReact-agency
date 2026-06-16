import React from 'react';

type OpsPanelProps = {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
};

export default function OpsPanel({ children, className = '', dark = false }: OpsPanelProps) {
  const palette = dark
    ? 'border-white/15 bg-white/10 text-[var(--color-background-main)]'
    : 'border-[var(--color-primary)]/14 bg-white/75 text-[var(--color-text-main)] shadow-[0_18px_60px_rgba(58,90,64,0.08)]';

  return (
    <div className={`relative min-w-0 overflow-hidden rounded-[8px] border ${palette} ${className}`.trim()}>
      <div className="pointer-events-none absolute inset-0 greenops-scanline opacity-35" aria-hidden="true" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
