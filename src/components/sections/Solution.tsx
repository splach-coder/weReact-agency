'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Solution() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    const solutions = [
        { title: "Crystal Clear", desc: "Information structure that guides, not confuses." },
        { title: "Lightning Fast", desc: "Performance optimization for instant loading." },
        { title: "Premium Visuals", desc: "Aesthetics that build immediate trust." },
        { title: "Mobile First", desc: "Flawless experience on every device." }
    ];

    return (
        <section ref={containerRef} className="relative w-full py-8 md:py-16 bg-[var(--color-primary)] text-[var(--color-background-main)] overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

                    {/* Left: The Manifesto */}
                    <div className="flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-white/60 mb-6">
                                The Antidote
                            </h2>
                            <h3 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8">
                                THAT’S WHERE <br />
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-[var(--color-background-main)]">WE REACT.</span>
                                    <motion.span
                                        initial={{ scaleX: 0 }}
                                        animate={isInView ? { scaleX: 1 } : {}}
                                        transition={{ duration: 0.8, delay: 0.5, ease: "circOut" }}
                                        className="absolute bottom-2 left-0 w-full h-[0.2em] bg-white/20 -z-0 origin-left"
                                    />
                                </span>
                            </h3>
                            <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-xl">
                                We strip away the complexity. No bloat. No confusion. Just a high-performance digital presence designed to <span className="font-bold text-white">work for your business.</span>
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1, duration: 1 }}
                            className="mt-12 hidden lg:block"
                        >
                            <ArrowRight size={48} className="text-[var(--color-background-main)] opacity-50" />
                        </motion.div>
                    </div>

                    {/* Right: The Solutions Grid */}
                    <div className="flex flex-col gap-6">
                        {solutions.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.2 + (idx * 0.15), ease: "easeOut" }}
                                className="group relative"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-full bg-[var(--color-background-main)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out z-0 rounded-2xl" />

                                <div className="relative z-10 p-8 border-b border-white/20 group-hover:border-transparent transition-colors duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <h4 className="text-3xl font-bold tracking-tight group-hover:text-[var(--color-primary)] transition-colors duration-300">
                                        {item.title}
                                    </h4>
                                    <p className="text-lg font-light text-white/60 group-hover:text-[var(--color-primary)]/80 transition-colors duration-300 max-w-xs text-right">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
