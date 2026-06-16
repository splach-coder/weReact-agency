import React from 'react';
import OpsBadge from './OpsBadge';

type SectionHeaderProps = {
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  copy,
  align = 'left',
  dark = false,
  className = '',
}: SectionHeaderProps) {
  const centered = align === 'center';

  return (
    <div className={`${centered ? 'mx-auto text-center' : ''} max-w-4xl ${className}`.trim()}>
      <OpsBadge tone={dark ? 'dark' : 'success'}>{eyebrow}</OpsBadge>
      <h2
        className={`mt-5 break-words text-4xl font-black uppercase leading-[0.92] tracking-normal md:text-6xl lg:text-7xl ${
          dark ? 'text-[var(--color-background-main)]' : 'text-[var(--color-primary)]'
        }`}
      >
        {title}
      </h2>
      {copy && (
        <p
          className={`mt-5 max-w-2xl text-base leading-relaxed md:text-lg ${
            centered ? 'mx-auto' : ''
          } ${dark ? 'text-white/68' : 'text-[var(--color-text-secondary)]'}`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
