'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Marquee from '@/components/ui/Marquee';

/** Full-bleed scrolling capability ticker, used as a section divider. */
export default function MarqueeBand() {
  const tHome = useTranslations('Home');
  const marquee = tHome.raw('marquee') as string[];
  return <Marquee items={marquee} tone="onPrimary" />;
}
