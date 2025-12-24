'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { PiggyBank, Handshake, Gauge } from 'lucide-react';

export default function About() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    const advantages = [
        {
            icon: PiggyBank,
            title: "Competitive Prices",
            desc: "We offer competitive rates without compromising on quality or service. Premium results, accessible pricing.",
            num: "01"
        },
        {
            icon: Handshake,
            title: "Long-term Partnership",
            desc: "We build relationships, not just websites. We provide ongoing support to ensure your long-term success.",
            num: "02"
        },
        {
            icon: Gauge,
            title: "Performance Driven",
            desc: "We focus on speed, security, and scalability to ensure your website delivers a world-class experience.",
            num: "03"
        }
    ];

    return (
        <section id="about" ref={containerRef} className="py-16 md:py-24 px-6 bg-[var(--color-primary)] text-[var(--color-background-main)] relative overflow-hidden">

            <div className="max-w-[1200px] mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 md:mb-24"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
                        Unlock Your Brand's Potential: <br className="hidden md:block" />
                        WeReact Design & Development <span className="relative inline-block">
                            Advantages.
                            {/* Hand-drawn style underline */}
                            <svg className="absolute w-full h-3 -bottom-2 left-0 text-[var(--color-background-main)] opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
                            </svg>
                        </span>
                    </h2>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    {advantages.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: idx * 0.2 }}
                            className="relative flex flex-col items-center"
                        >
                            {/* Icon Illustration Area */}
                            <div className="mb-6 relative z-10">
                                <div className="w-20 h-20 flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                                    <item.icon size={64} strokeWidth={1.5} className="text-[var(--color-background-main)] opacity-90" />
                                </div>
                                {/* Little sparkle decor */}
                                <div className="absolute top-0 -right-4 text-[var(--color-background-main)] opacity-60">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                                    </svg>
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-4 relative z-10">
                                {item.title}
                            </h3>

                            <p className="text-lg opacity-80 leading-relaxed max-w-xs mx-auto mb-4 relative z-10">
                                {item.desc}
                            </p>

                            {/* Big Number Background */}
                            <div className="text-[120px] font-black leading-none text-[var(--color-background-main)] opacity-[0.07] select-none transform translate-y-4">
                                {item.num}.
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
