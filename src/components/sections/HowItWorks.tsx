'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, PenTool, Rocket } from 'lucide-react';
import { cardItemVariants, staggerContainerVariants } from '@/lib/animations';

export default function HowItWorks() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

    const steps = [
        {
            icon: MessageSquare,
            label: "01",
            title: "Planning",
            desc: "We discuss your goals, audience, and requirements to outline the perfect strategy."
        },
        {
            icon: PenTool,
            label: "02",
            title: "Design & Build",
            desc: "Our team crafts stunning, responsive interfaces that align with your brand."
        },
        {
            icon: Rocket,
            label: "03",
            title: "Launch & Grow",
            desc: "Deploy your website with confidence, with ongoing support for optimization."
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="py-20 md:py-32 px-6 md:px-12 bg-[var(--color-primary)] text-white relative overflow-hidden"
        >

            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-20 md:mb-28"
                >
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/50 mb-4">
                        PROCESS
                    </p>
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8">
                        Simple, <br />
                        <span className="text-[var(--color-accent-warm)]">Proven Process</span>
                    </h2>
                    <p className="text-lg md:text-xl font-light text-white/70 leading-relaxed">
                        Three straightforward steps from vision to launch. Our transparent process keeps you informed every step of the way.
                    </p>
                </motion.div>

                {/* Steps with Connecting Lines */}
                <div className="relative">

                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-white/10 via-white/20 to-white/10 z-0" />

                    {/* Steps Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative z-10"
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={staggerContainerVariants(0.15)}
                    >
                        {steps.map((item, idx) => {
                            const Icon = item.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    variants={cardItemVariants}
                                    className="group"
                                >
                                    <div className="p-8 md:p-10 rounded-xl border border-white/15 bg-white/8 backdrop-blur-sm hover:bg-white/12 hover:border-white/25 transition-all duration-500 relative z-20">

                                        {/* Number Badge */}
                                        <div className="text-xs font-black text-white/20 tracking-widest mb-6">
                                            {item.label}
                                        </div>

                                        {/* Icon */}
                                        <motion.div
                                            whileHover={{ scale: 1.15, rotate: -5 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            className="w-16 h-16 rounded-lg bg-white/15 flex items-center justify-center text-white/80 mb-8 group-hover:bg-white/25 group-hover:text-white transition-all"
                                        >
                                            <Icon size={28} strokeWidth={1.5} />
                                        </motion.div>

                                        {/* Title */}
                                        <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-4">
                                            {item.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-white/70 font-light leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>

                                    {/* Arrow Indicator (Mobile) */}
                                    {idx < steps.length - 1 && (
                                        <div className="md:hidden text-center py-4">
                                            <div className="text-white/40">↓</div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
