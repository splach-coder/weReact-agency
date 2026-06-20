import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import MinimalHero from '@/components/MinimalHero';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';

// Below-the-fold sections are code-split.
const TrustBand = dynamic(() => import('@/components/sections/home/TrustBand'));
const Manifesto = dynamic(() => import('@/components/sections/home/Manifesto'));
const SelectedProjects = dynamic(() => import('@/components/sections/home/SelectedProjects'));
const WhatWeDo = dynamic(() => import('@/components/sections/home/WhatWeDo'));
const Process = dynamic(() => import('@/components/sections/home/Process'));
const Testimonials = dynamic(() => import('@/components/sections/home/Testimonials'));
const Faq = dynamic(() => import('@/components/sections/home/Faq'));
const BookCall = dynamic(() => import('@/components/sections/home/BookCall'));
const FinalCta = dynamic(() => import('@/components/sections/home/FinalCta'));

const SECTIONS = [
  TrustBand,
  Manifesto,
  SelectedProjects,
  WhatWeDo,
  Process,
  Testimonials,
  Faq,
  BookCall,
  FinalCta,
];

export default function Home() {
  return (
    <>
      <MinimalHero />
      <Suspense
        fallback={<div className="h-screen bg-[var(--color-background-main)]" />}
      >
        {SECTIONS.map((Section, i) => (
          <SectionErrorBoundary key={i}>
            <Section />
          </SectionErrorBoundary>
        ))}
      </Suspense>
    </>
  );
}
