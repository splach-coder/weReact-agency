import React from 'react';
import Hero from '@/components/sections/Hero';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';
import Services from '@/components/sections/Services';
import Packages from '@/components/sections/Packages';
import HowItWorks from '@/components/sections/HowItWorks';
import Work from '@/components/sections/Work';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <Problem />
      <Solution />
      <Services />
      <HowItWorks />
      <Work />
      <About />
      <Contact />
    </main>
  );
}