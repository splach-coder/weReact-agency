'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { getImageProps } from 'next/image';
import { heroTitleVariants, smoothEasing, fadeInUpVariants, ctaButtonVariants, arrowAnimationVariants } from '@/lib/animations';
import VariableProximity from '../VariableProximity';
import { ChevronDown, ArrowRight } from 'lucide-react';

export default function Hero() {
    const containerRef = useRef(null);

    const common = { alt: "WeReact Agency Hero", fill: true, priority: true };

    const { props: { srcSet: desktopSrcSet } } = getImageProps({
        ...common,
        src: "/images/nature_hero.webp",
        sizes: "(min-width: 768px) 100vw, 1px"
    });

    const { props: { srcSet: mobileSrcSet, ...rest } } = getImageProps({
        ...common,
        src: "/images/nature_hero_phone.webp",
        sizes: "(max-width: 767px) 100vw, 1px"
    });

    return (
        <section ref={containerRef} className="relative h-[90vh] md:h-screen w-full overflow-hidden bg-white">

            {/* Background Image */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <motion.div
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative w-full h-full"
                >
                    <picture>
                        <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
                        <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
                        <img
                            {...rest}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            className="md:filter-none"
                        />
                    </picture>
                </motion.div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent md:bg-gradient-to-b md:from-black/15 md:to-transparent z-10" />
            </div>

            {/* Desktop Content */}
            <div className="hidden md:flex absolute top-0 left-0 w-full h-full z-20 flex-col justify-center items-start px-12 md:px-16">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
                    className="max-w-3xl"
                >
                    {/* Main Headline */}
                    <motion.h1
                        variants={heroTitleVariants}
                        custom={0}
                        className="text-7xl md:text-8xl font-black leading-[0.95] tracking-tight text-white mb-6"
                    >
                        We Design &
                        <br />
                        <span className="text-[var(--color-accent-warm)]">Build Digital</span>
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        variants={heroTitleVariants}
                        custom={1}
                        className="text-lg md:text-xl text-white/80 font-light mb-10 leading-relaxed max-w-2xl"
                    >
                        Transforming ideas into stunning, high-converting experiences that engage users and drive results
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        variants={heroTitleVariants}
                        custom={2}
                        className="flex gap-4 items-center"
                    >
                        <motion.button
                            variants={ctaButtonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            className="btn-base btn-primary group"
                        >
                            Start Your Project
                            <motion.div
                                variants={arrowAnimationVariants}
                                className="group-hover:translate-x-1 transition-transform"
                            >
                                <ArrowRight size={18} />
                            </motion.div>
                        </motion.button>

                        <motion.button
                            variants={ctaButtonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-md text-sm font-semibold uppercase tracking-wide transition-all"
                        >
                            View Our Work
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Mobile Content */}
            <div className="flex md:hidden absolute bottom-0 left-0 w-full z-20 flex-col justify-end pb-12 px-6">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
                >
                    <motion.h1
                        variants={fadeInUpVariants}
                        className="text-4xl font-black leading-tight tracking-tight text-white mb-4"
                    >
                        We Design &
                        <br />
                        Build Digital
                    </motion.h1>

                    <motion.p
                        variants={fadeInUpVariants}
                        className="text-sm text-white/80 font-light mb-6 leading-relaxed"
                    >
                        Transforming ideas into high-converting experiences
                    </motion.p>

                    <motion.button
                        variants={ctaButtonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        className="w-full btn-base btn-primary group justify-center"
                    >
                        Start Your Project
                        <ArrowRight size={16} />
                    </motion.button>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center justify-center"
            >
                <ChevronDown className="text-white/60 w-6 h-6" />
            </motion.div>

        </section>
    );
}
