import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Hero from '@/components/sections/Hero';

// Dynamically import sections below the fold
const Problem = dynamic(() => import('@/components/sections/Problem'));
const Solution = dynamic(() => import('@/components/sections/Solution'));
const Services = dynamic(() => import('@/components/sections/Services'));
const Packages = dynamic(() => import('@/components/sections/Packages'));
const HowItWorks = dynamic(() => import('@/components/sections/HowItWorks'));
const Work = dynamic(() => import('@/components/sections/Work'));
const About = dynamic(() => import('@/components/sections/About'));
const Contact = dynamic(() => import('@/components/sections/Contact'));

export default function Home() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<div className="h-screen bg-[var(--color-background-main)]" />}>
        <Problem />
        <Solution />
        <Services />
        <HowItWorks />
        <Work />
        <About />
        <Contact />
      </Suspense>
    </main>
  );
}