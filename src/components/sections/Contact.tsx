'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mail, Zap, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { heroTitleVariants, fadeInUpVariants, ctaButtonVariants, arrowAnimationVariants } from '@/lib/animations';

export default function Contact() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    return (
        <section id="contact" ref={containerRef} className="py-20 md:py-40 px-6 md:px-12 bg-gradient-to-b from-[var(--color-background-main)] to-[var(--color-background-main)] text-[var(--color-text-main)] relative overflow-hidden">

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-primary)]/3 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <div className="max-w-[1000px] mx-auto text-center relative z-10">

                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                    className="flex flex-col items-center"
                >

                    {/* Status Badge */}
                    <motion.div
                        variants={fadeInUpVariants}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/8 mb-8"
                    >
                        <Zap size={16} className="text-[var(--color-primary)] animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)]">
                            Ready for New Projects
                        </span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h2
                        variants={heroTitleVariants}
                        custom={0}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6"
                    >
                        Ready To <br />
                        <span className="text-[var(--color-primary-light)]">Launch Your Vision?</span>
                    </motion.h2>

                    {/* Subheading */}
                    <motion.p
                        variants={heroTitleVariants}
                        custom={1}
                        className="text-lg md:text-2xl font-light text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Your business deserves a platform that performs. Let's build something extraordinary together and transform your digital presence.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={heroTitleVariants}
                        custom={2}
                        className="flex flex-col sm:flex-row gap-4 items-center justify-center"
                    >
                        <Link href={siteConfig.business.whatsapp} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                            <motion.button
                                variants={ctaButtonVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                                className="btn-base btn-primary group w-full sm:w-auto justify-center"
                            >
                                Chat on WhatsApp
                                <motion.div
                                    variants={arrowAnimationVariants}
                                >
                                    <MessageCircle size={18} />
                                </motion.div>
                            </motion.button>
                        </Link>

                        <Link href={`mailto:${siteConfig.business.email}`} className="w-full sm:w-auto">
                            <motion.button
                                variants={ctaButtonVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                                className="border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 group w-full sm:w-auto"
                            >
                                <Mail size={18} />
                                Send an Email
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Email Display */}
                    <motion.p
                        variants={fadeInUpVariants}
                        className="mt-10 text-sm text-[var(--color-text-muted)] font-medium"
                    >
                        Or email us directly:{' '}
                        <Link href={`mailto:${siteConfig.business.email}`} className="text-[var(--color-primary)] font-bold hover:text-[var(--color-primary-dark)] transition-colors">
                            {siteConfig.business.email}
                        </Link>
                    </motion.p>

                </motion.div>

            </div>

            {/* Watermark */}
            <motion.div
                className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.02]"
            >
                <span className="text-[30vw] font-black leading-none whitespace-nowrap tracking-tighter text-[var(--color-primary)]">
                    LET'S BUILD
                </span>
            </motion.div>

        </section>
    );
}
