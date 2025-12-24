'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

export default function Contact() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    return (
        <section id="contact" ref={containerRef} className="py-8 md:py-16 px-6 bg-[var(--color-background-main)] text-[var(--color-primary)] relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto text-center relative z-10">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-8">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                        <span className="text-sm font-bold uppercase tracking-widest">Available for new projects</span>
                    </div>

                    <h2 className="text-8xl md:text-[10rem] font-bold tracking-tighter uppercase leading-[0.8] mb-12">
                        Ready To <br />
                        <span className="italic font-light opacity-50">Launch?</span>
                    </h2>

                    <p className="text-xl md:text-3xl font-light opacity-80 max-w-2xl mx-auto mb-16 leading-normal">
                        Your business deserves a platform that performs. <br className="hidden md:block" /> Let's build something extraordinary together.
                    </p>

                    <Link href="mailto:hello@wereact.agency" className="group relative inline-flex flex-col items-center">
                        <div className="relative overflow-hidden rounded-full bg-[var(--color-primary)] text-[var(--color-background-main)] px-12 py-6 md:px-16 md:py-8 flex items-center gap-4 transition-transform duration-500 hover:scale-105">
                            <span className="text-2xl md:text-3xl font-bold tracking-tight z-10">Start a Project</span>
                            <ArrowRight className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:translate-x-2 z-10" />

                            {/* Fill Effect */}
                            <div className="absolute inset-0 bg-[#2e4833] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]" />
                        </div>

                        <span className="mt-4 text-sm font-medium uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity duration-300">
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
