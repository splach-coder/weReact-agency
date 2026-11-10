import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
import WebGLHero from '@/components/WebGLHero';
import SectionErrorBoundary from '@/components/SectionErrorBoundary';
import { createBusinessJsonLd, createServiceJsonLd, createWebsiteJsonLd } from '@/lib/seo';

// Below-the-fold sections are code-split.
const Manifesto = dynamic(() => import('@/components/sections/home/Manifesto'));
const AudiencePaths = dynamic(() => import('@/components/sections/home/AudiencePaths'));
const SelectedProjects = dynamic(() => import('@/components/sections/home/SelectedProjects'));
const WhatWeDo = dynamic(() => import('@/components/sections/home/WhatWeDo'));
const ScrollReel = dynamic(() => import('@/components/sections/home/ScrollReel'));
const ProjectEvidence = dynamic(() => import('@/components/sections/home/Testimonials'));
const Faq = dynamic(() => import('@/components/sections/home/Faq'));
const BookCall = dynamic(() => import('@/components/sections/home/BookCall'));

const SECTIONS = [
  Manifesto,
  AudiencePaths,
  WhatWeDo,
  SelectedProjects,
  ScrollReel,
  ProjectEvidence,
  Faq,
  BookCall,
];

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const serviceJsonLd = createServiceJsonLd();
  const businessJsonLd = createBusinessJsonLd();
  const websiteJsonLd = createWebsiteJsonLd();

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <WebGLHero />
      {/* One Suspense boundary per section: React then hydrates them one at a
          time and yields to the browser in between, instead of hydrating the
          whole page below the hero as a single long task. */}
      {SECTIONS.map((Section, i) => (
        <Suspense key={i} fallback={<div className="h-screen bg-[var(--color-background-main)]" />}>
          <SectionErrorBoundary>
            <Section />
          </SectionErrorBoundary>
        </Suspense>
      ))}
    </div>
  );
}
