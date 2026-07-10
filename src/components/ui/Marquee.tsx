'use client';

import React from 'react';
import { Asterisk } from 'lucide-react';

interface MarqueeProps {
  items: string[];
  /** Visual variant: light text on green, or dark text on sand. */
  tone?: 'onPrimary' | 'onSand';
  className?: string;
}

/**
 * Full-bleed infinite marquee — the editorial "ticker" beat. Two identical
 * halves shifted by -50% (see .animate-marquee in globals.css) for a seamless
 * loop; pauses on hover. Decorative, so the track is aria-hidden.
 */
export default function Marquee({ items, tone = 'onPrimary', className = '' }: MarqueeProps) {
  const half = [...items];
  const toneClasses =
    tone === 'onPrimary'
      ? 'bg-[var(--color-primary)] text-[var(--color-background-main)]'
      : 'bg-[var(--color-background-main)] text-[var(--color-text-main)]';
  const dotColor = tone === 'onPrimary' ? 'text-[var(--color-accent-sage)]' : 'text-[var(--color-primary)]';

  return (
    <div className={`w-full overflow-hidden ${toneClasses} ${className}`}>
      <div className="flex w-max animate-marquee py-5" aria-hidden="true">
        {[0, 1].map((dup) => (
          <ul key={dup} className="flex shrink-0 items-center">
            {half.map((item, i) => (
              <li key={`${dup}-${i}`} className="flex items-center">
                <span className="px-6 text-2xl font-black uppercase tracking-tight md:text-4xl">
                  {item}
                </span>
                <Asterisk className={`h-6 w-6 ${dotColor}`} strokeWidth={2.5} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
