'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, PenTool, Rocket } from 'lucide-react';

export default function HowItWorks() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

    const steps = [
        {
            icon: MessageSquare,
            step: "1. Planning",
            desc: "We discuss your goals, target audience, and requirements to outline the perfect strategy."
        },
        {
            icon: PenTool,
            step: "2. Design",
            desc: "Our team crafts a stunning, responsive design that aligns with your brand identity."
        },
        {
            icon: Rocket,
            step: "3. Launch",
            desc: "We build, test, and deploy your new website, ensuring it performs perfectly on all devices."
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="py-8 md:py-16 px-6 bg-[var(--color-primary)] text-[var(--color-background-main)]"
        >
            <div className="max-w-[1200px] mx-auto">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        <span className="px-4 py-2 rounded-full border border-white/20 text-sm font-semibold text-white/80 bg-white/10 mb-6 inline-block shadow-sm">
                            How It Works
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-white"
                    >
                        Get Online in <span className="text-[var(--color-background-main)]">3 Easy Steps</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto"
                    >
                        Our process is simple, transparent, and designed to help you start growing your business right away.
                    </motion.p>
                </div>

                {/* Steps Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 + (idx * 0.1) }}
                            className="bg-white/10 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:bg-white/15 transition-all duration-300"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-white mb-8">
                                <item.icon size={32} strokeWidth={2} />
                            </div>

                            <h3 className="text-2xl font-bold mb-4 text-white">
                                {item.step}
                            </h3>

                            <p className="text-white/70 leading-relaxed font-medium">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
