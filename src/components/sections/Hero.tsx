'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import VariableProximity from '../VariableProximity';

export default function Hero() {
    const containerRef = useRef(null);

    // Column Animation Configuration
    const colVariants = {
        hidden: { height: 0 },
        visible: (h: string) => ({
            height: h
        })
    };

    const textContainerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0
        })
    };

    return (
        <section ref={containerRef} className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-white">

            {/* 1. Underlying Absolute Image Layer (Desktop Only) */}
            <div className="absolute inset-0 z-0 h-full w-full hidden md:block">
                <motion.div
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{
                        duration: 2.5,
                        ease: "easeOut"
                    }}
                    className="relative w-full h-full"
                >
                    <Image
                        src="/images/nature_hero.jpg"
                        alt="Nature Landscape"
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
            </div>

            {/* 2. Layout Grid: Desktop (Original) */}
            <div className="relative z-10 w-full h-full hidden md:flex flex-row items-start pointer-events-none">

                {/* Column 1: Left */}
                <motion.div
                    custom="70vh"
                    variants={colVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="
                        w-1/3 
                        h-full 
                        bg-[#E3E3DC] border-r border-[#d4d4cd] 
                        relative flex flex-col justify-end pb-8 px-6
                    "
                    style={{ transformOrigin: 'top', height: 0 }}
                >
                </motion.div>

                {/* Column 2: Center */}
                <motion.div
                    custom="60vh"
                    variants={colVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="
                        w-1/3 
                        h-full 
                        bg-[#E3E3DC] border-r border-[#d4d4cd] 
                        relative
                    "
                    style={{ transformOrigin: 'top', height: 0 }}
                >
                </motion.div>

                {/* Column 3: Right */}
                <motion.div
                    custom="50vh"
                    variants={colVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="
                        w-1/3 
                        h-full bg-[#E3E3DC] relative
                    "
                    style={{ transformOrigin: 'top', height: 0 }}
                >
                    {/* Small Text - Desktop Only */}
                    <div className="absolute bottom-6 left-6 max-w-[280px]">
                        <motion.div
                            custom={0.5}
                            variants={textContainerVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                        >
                            <p className="text-xs font-medium uppercase leading-relaxed tracking-wider text-[#1A1A1A]">
                                Our team combines strategic thinking with cutting-edge design to create experiences that resonate.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* 2b. Layout Creative: Mobile (Card Style - Glass Effect) */}
            <div className="relative z-10 w-full h-full md:hidden px-2 pt-20 pb-4 flex flex-col justify-start pointer-events-none">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full flex-1 rounded-[1rem] overflow-hidden border border-white/40 pointer-events-auto bg-black/5"
                >
                    {/* Background Image - Glassy Visualisation (Mobile) */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* The Image itself */}
                        <motion.div
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 2.5, ease: "easeOut" }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src="/images/nature_hero_phone.jpg"
                                alt="Nature Landscape"
                                fill
                                className="object-cover blur-[5px] scale-110"
                                priority
                            />
                        </motion.div>
                        {/* Glass/Tint Overlay to ensure readability while keeping 'glss deesign' */}
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-between p-8 text-[#1A1A1A]">
                        {/* Middle: Main Text */}
                        <div className="flex flex-col gap-6 mb-12 mt-auto">
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
                                className="w-full py-4 mt-2 bg-[#3A5A40] text-white text-sm font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-[#E3E3DC] hover:text-[#3A5A40] transition-colors duration-300"
                            >
                                Get Started
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 3. Floating Overlay for Big Text - Variable Proximity (Desktop Only) */}
            <div className="absolute top-0 left-0 w-full h-full z-20 hidden md:flex flex-col pt-32 md:pt-48 px-4 md:px-12 max-w-[1400px] mx-auto pointer-events-none">
                <div className="flex flex-col leading-[0.9] font-light mix-blend-multiply text-[#1A1A1A] pointer-events-auto mt-12 md:mt-0">

                    <motion.div
                        custom={0.4}
                        variants={textContainerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
                        className="mb-2"
                        style={{ opacity: 0 }}
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
                        custom={0.5}
                        variants={textContainerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                        className="mb-2"
                        style={{ opacity: 0 }}
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
                        custom={0.6}
                        variants={textContainerVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
                        style={{ opacity: 0 }}
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
