'use client';

import React from 'react';

interface CornerFrameProps {
  children: React.ReactNode;
  /** Extra classes for the wrapper (e.g. aspect ratio, rounding). */
  className?: string;
  /** Length of each bracket arm. Default 24px. */
  size?: number;
  /** Bracket color. Defaults to the brand primary. */
  color?: string;
  /** Inset of the brackets from the wrapper edge. Default 12px. */
  inset?: number;
}

/**
 * Wraps content with thin L-shaped corner brackets — the editorial "frame the
 * work" motif borrowed from OHHH! Contest, tuned to the calm-premium brand.
 * The brackets sit above the content (z-20) and never intercept pointer events.
 */
export default function CornerFrame({
  children,
  className = '',
  size = 24,
  color = 'var(--color-primary)',
  inset = 12,
}: CornerFrameProps) {
  const arm = `${size}px`;
  const off = `${inset}px`;
  const corners = [
    { top: off, left: off, borderTop: true, borderLeft: true },
    { top: off, right: off, borderTop: true, borderRight: true },
    { bottom: off, left: off, borderBottom: true, borderLeft: true },
    { bottom: off, right: off, borderBottom: true, borderRight: true },
  ];

  return (
    <div className={`relative ${className}`}>
      {children}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20">
        {corners.map((c, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              top: c.top,
              bottom: c.bottom,
              left: c.left,
              right: c.right,
              width: arm,
              height: arm,
              borderColor: color,
              borderTopWidth: c.borderTop ? 2 : 0,
              borderBottomWidth: c.borderBottom ? 2 : 0,
              borderLeftWidth: c.borderLeft ? 2 : 0,
              borderRightWidth: c.borderRight ? 2 : 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
