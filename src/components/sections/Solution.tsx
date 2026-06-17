'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Eye, Zap, Sparkles, Smartphone } from 'lucide-react';
import { staggerContainerVariants, cardItemVariants } from '@/lib/animations';

export default function Solution() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    const solutions = [
        { icon: Eye, label: "01", title: "Crystal Clear", desc: "Information architecture that guides visitors naturally through your story." },
        { icon: Zap, label: "02", title: "Lightning Fast", desc: "Performance optimized for instant loading and smooth interactions." },
        { icon: Sparkles, label: "03", title: "Premium Visuals", desc: "Beautiful design that builds trust and reflects your brand values." },
        { icon: Smartphone, label: "04", title: "Mobile First", desc: "Flawless experience on every device, every screen, every time." }
    ];

    return (
        <section ref={containerRef} className="relative w-full py-20 md:py-32 bg-[var(--color-primary)] text-white overflow-hidden">

            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-20 md:mb-28 max-w-3xl"
                >
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/50 mb-4">
                        SOLUTION
                    </p>
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8">
                        THAT'S WHERE <br />
                        <span className="text-[var(--color-accent-warm)]">WE REACT.</span>
                    </h2>
                    <p className="text-lg md:text-xl font-light text-white/70 leading-relaxed">
                        We strip away complexity and deliver clarity. No bloat. No confusion. Just <strong className="font-semibold text-white">a powerful digital presence</strong> engineered to drive real results.
                    </p>
                </motion.div>

                {/* Solutions Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={staggerContainerVariants(0.1)}
                >
                    {solutions.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={cardItemVariants}
                                className="group relative"
                            >
                                {/* Animated Background Fill */}
                                <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />

                                {/* Content */}
                                <div className="relative z-10 p-8 md:p-10 border border-white/15 group-hover:border-white/30 rounded-xl transition-all duration-500">

                                    {/* Number & Icon Row */}
                                    <div className="flex items-start justify-between mb-6">
                                        <motion.div
                                            whileHover={{ scale: 1.12, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            className="p-3 rounded-lg bg-white/15 group-hover:bg-white/25 transition-colors"
                                        >
                                            <Icon className="w-5 h-5 text-white" />
                                        </motion.div>
                                        <span className="text-xs font-black text-white/20 tracking-widest">
                                            {item.label}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-4 group-hover:translate-x-1 transition-transform duration-300">
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-white/70 font-light leading-relaxed mb-6 group-hover:text-white/85 transition-colors duration-300">
                                        {item.desc}
                                    </p>

                                    {/* Accent Bar */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: 40 }}
                                        transition={{ delay: idx * 0.12 + 0.4, duration: 0.7 }}
                                        className="h-1 bg-gradient-to-r from-[var(--color-accent-warm)] to-white/40 group-hover:w-16 transition-all duration-300"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}
