import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import WebGLHero from '@/components/WebGLHero';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';
import { createServiceJsonLd } from '@/lib/seo';

// Below-the-fold sections are code-split.
const Manifesto = dynamic(() => import('@/components/sections/home/Manifesto'));
const SelectedProjects = dynamic(() => import('@/components/sections/home/SelectedProjects'));
const WhatWeDo = dynamic(() => import('@/components/sections/home/WhatWeDo'));
const ScrollReel = dynamic(() => import('@/components/sections/home/ScrollReel'));
const Testimonials = dynamic(() => import('@/components/sections/home/Testimonials'));
const Faq = dynamic(() => import('@/components/sections/home/Faq'));
const BookCall = dynamic(() => import('@/components/sections/home/BookCall'));

const SECTIONS = [
  Manifesto,
  WhatWeDo,
  SelectedProjects,
  ScrollReel,
  Testimonials,
  Faq,
  BookCall,
];

export default function Home() {
  const serviceJsonLd = createServiceJsonLd();

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <WebGLHero />
      <Suspense
        fallback={<div className="h-screen bg-[var(--color-background-main)]" />}
      >
        {SECTIONS.map((Section, i) => (
          <SectionErrorBoundary key={i}>
            <Section />
          </SectionErrorBoundary>
        ))}
      </Suspense>
    </div>
  );
}
