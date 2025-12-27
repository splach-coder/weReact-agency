'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

export default function Contact() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    return (
        <section id="contact" ref={containerRef} className="py-6 md:py-8 px-4 md:px-6 bg-[var(--color-background-main)] text-[var(--color-primary)] relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto text-center relative z-10">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-sm border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-6 md:mb-8">
                        <span className="w-2 h-2 rounded-sm bg-[var(--color-primary)] animate-pulse" />
                        <span className="text-xs md:text-sm font-bold uppercase tracking-widest">Available for new projects</span>
                    </div>

                    <h2 className="text-5xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter uppercase leading-[0.8] mb-8 md:mb-12">
                        Ready To <br />
                        <span className="italic font-light opacity-50">Launch?</span>
                    </h2>

                    <p className="text-base md:text-xl lg:text-3xl font-light opacity-80 max-w-2xl mx-auto mb-10 md:mb-16 leading-normal px-4">
                        Your business deserves a platform that performs. <br className="hidden md:block" /> Let's build something extraordinary together.
                    </p>

                    <Link href="mailto:hello@wereact.agency" className="group relative inline-flex flex-col items-center">
                        <div className="relative overflow-hidden rounded-sm bg-[var(--color-primary)] text-[var(--color-background-main)] px-8 py-4 md:px-12 md:py-6 lg:px-16 lg:py-8 flex items-center gap-3 md:gap-4 transition-transform duration-500 hover:scale-105">
                            <span className="text-lg md:text-2xl lg:text-3xl font-bold tracking-tight z-10">Start a Project</span>
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 transition-transform duration-300 group-hover:translate-x-2 z-10" />

                            {/* Fill Effect */}
                            <div className="absolute inset-0 bg-[#2e4833] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]" />
                        </div>

                        <span className="mt-3 md:mt-4 text-xs md:text-sm font-medium uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                            hello@wereact.agency
                        </span>
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Large Text Background */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
                <span className="text-[25vw] font-bold leading-none whitespace-nowrap tracking-tighter text-[var(--color-primary)] text-center translate-y-1/3">
                    WEREACT
                </span>
            </div>
        </section>
    );
}
