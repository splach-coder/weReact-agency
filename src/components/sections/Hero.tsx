'use client';

import React, { useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { getImageProps } from 'next/image';
import VariableProximity from '../VariableProximity';

export default function Hero() {
    const containerRef = useRef(null);

    // Art Direction: Define image sources for different breakpoints
    const common = { alt: "Nature Landscape", fill: true, priority: true };

    // Desktop Optimized Source
    const { props: { srcSet: desktopSrcSet } } = getImageProps({
        ...common,
        src: "/images/nature_hero.webp",
        sizes: "(min-width: 768px) 100vw, 1px"
    });

    // Mobile Optimized Source
    const { props: { srcSet: mobileSrcSet, ...rest } } = getImageProps({
        ...common,
        src: "/images/nature_hero_phone.webp",
        sizes: "(max-width: 767px) 100vw, 1px"
    });

    // Column Animation Configuration
    const colVariants: Variants = {
        hidden: { height: 0 },
        visible: (h: string) => ({
            height: h
        })
    };

    const textContainerVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    return (
        <section ref={containerRef} className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-white">

            {/* Ar-Directed Image Layer: Discoverable immediately by HTML scanner */}
            <div className="absolute inset-0 z-0 h-full w-full">
                <motion.div
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 1.2,
                        ease: "easeOut"
                    }}
                    className="relative w-full h-full"
                >
                    <picture>
                        <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
                        <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
                        <img
                            {...rest}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            className="mobile-hero-blur"
                        />
                    </picture>
                </motion.div>

                {/* Mobile Glassy Overlay - Only visible on mobile */}
                <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px] md:hidden z-10" />
            </div>

            <style jsx global>{`
                @media (max-width: 767px) {
                    .mobile-hero-blur {
                        filter: blur(5px);
                        transform: scale(1.1);
                    }
                }
            `}</style>

            {/* 2. Layout Grid: Desktop */}
            <div className="relative z-10 w-full h-full hidden md:flex flex-row items-start pointer-events-none">
                {/* Column 1: Left */}
                <motion.div
                    custom="70vh"
                    variants={colVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-1/3 h-full bg-[#E3E3DC] border-r border-[#d4d4cd] relative flex flex-col justify-end pb-8 px-6"
                    style={{ transformOrigin: 'top', height: 0 }}
                />

                {/* Column 2: Center */}
                <motion.div
                    custom="60vh"
                    variants={colVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-1/3 h-full bg-[#E3E3DC] border-r border-[#d4d4cd] relative"
                    style={{ transformOrigin: 'top', height: 0 }}
                />

                {/* Column 3: Right */}
                <motion.div
                    custom="50vh"
                    variants={colVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="w-1/3 h-full bg-[#E3E3DC] relative"
                    style={{ transformOrigin: 'top', height: 0 }}
                >
                    <div className="absolute bottom-6 left-6 max-w-[280px]">
                        <motion.div
                            custom={0.2}
                            variants={textContainerVariants}
                            initial="hidden"
                            animate="visible"
                            className="opacity-0"
                        >
                            <p className="text-xs font-medium uppercase leading-relaxed tracking-wider text-[#1A1A1A]">
                                Our team combines strategic thinking with cutting-edge design to create experiences that resonate.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* 2b. Layout Creative: Mobile (Overlay Content) */}
            <div className="relative z-20 w-full h-full md:hidden px-6 pt-20 pb-4 flex flex-col justify-end pointer-events-none">
                <div className="flex flex-col gap-6 mb-12 text-[#1A1A1A] pointer-events-auto">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-4xl tracking-tighter leading-[1.1] text-[#E3E3DC] uppercase"
                    >
                        We Design & Build <span className="text-[#E3E3DC] font-bold">Impactful Digital</span> Experiences
                    </motion.h1>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="w-full py-4 mt-2 bg-[#3A5A40] text-white text-sm font-bold uppercase tracking-widest rounded-sm shadow-lg"
                    >
                        Get Started
                    </motion.button>
                </div>
            </div>

            {/* 3. Floating Overlay for Big Text - Variable Proximity (Desktop Only) */}
            <div className="absolute top-0 left-0 w-full h-full z-30 hidden md:flex flex-col pt-32 md:pt-48 px-4 md:px-12 max-w-[1400px] mx-auto pointer-events-none">
                <div className="flex flex-col leading-[0.9] font-light mix-blend-multiply text-[#1A1A1A] pointer-events-auto mt-12 md:mt-0">
                    <motion.div
                        custom={0.1}
                        variants={textContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-2 opacity-0"
                    >
                        <VariableProximity
                            label="We Design & Build"
                            fromFontVariationSettings="'wght' 500, 'wdth' 100"
                            toFontVariationSettings="'wght' 900, 'wdth' 100"
                            containerRef={containerRef}
                            radius={150}
                            falloff="gaussian"
                            className="text-[11vw] md:text-[5.5rem] tracking-tight uppercase cursor-pointer block"
                        />
                    </motion.div>

                    <motion.div
                        custom={0.2}
                        variants={textContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-2 opacity-0"
                    >
                        <VariableProximity
                            label="Impactful Digital"
                            fromFontVariationSettings="'wght' 500, 'wdth' 100"
                            toFontVariationSettings="'wght' 900, 'wdth' 100"
                            containerRef={containerRef}
                            radius={150}
                            falloff="gaussian"
                            className="text-[11vw] md:text-[5.5rem] tracking-tight uppercase text-[#3A5A40] cursor-pointer block"
                        />
                    </motion.div>

                    <motion.div
                        custom={0.3}
                        variants={textContainerVariants}
                        initial="hidden"
                        animate="visible"
                        className="opacity-0"
                    >
                        <VariableProximity
                            label="Experiences"
                            fromFontVariationSettings="'wght' 500, 'wdth' 100"
                            toFontVariationSettings="'wght' 900, 'wdth' 100"
                            containerRef={containerRef}
                            radius={150}
                            falloff="gaussian"
                            className="text-[11vw] md:text-[5.5rem] tracking-tight uppercase cursor-pointer block"
                        />
                    </motion.div>
                </div>
            </div>

        </section>
    );
}
