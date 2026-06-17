'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingDown, Zap, AlertCircle } from 'lucide-react';
import { cardItemVariants, staggerContainerVariants, slideUpStaggerVariants, blurInVariants } from '@/lib/animations';

export default function Problem() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

    const problemCards = [
        {
            icon: TrendingDown,
            label: "01",
            title: "The Confusion",
            desc: "Building a platform feels overwhelming, expensive, and technically complex.",
            delay: 0.1
        },
        {
            icon: Zap,
            label: "02",
            title: "The Outdated",
            desc: "Existing sites often load slowly, look generic, and fail to convert visitors.",
            delay: 0.2
        },
        {
            icon: AlertCircle,
            label: "03",
            title: "The Gap",
            desc: "Good businesses remain invisible while competitors dominate digital spaces.",
            delay: 0.3
        }
    ];

    return (
        <section ref={sectionRef} className="relative w-full py-20 md:py-32 bg-[var(--color-background-main)] text-[var(--color-primary)] overflow-hidden">

            {/* Background Watermark - Parallax */}
            <motion.div
                style={{ y: yBackground }}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden"
            >
                <span className="text-[30vw] font-black leading-none whitespace-nowrap tracking-tighter text-[var(--color-primary)]">
                    CHALLENGE
                </span>
            </motion.div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

                {/* Header Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    className="mb-16 md:mb-24"
                >
                    <motion.h2
                        variants={slideUpStaggerVariants}
                        custom={0}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-8"
                    >
                        INVISIBLE <br />
                        <motion.span
                            variants={blurInVariants}
                            className="text-[var(--color-primary-light)] inline-block"
                        >
                            ONLINE?
                        </motion.span>
                    </motion.h2>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="h-1.5 w-40 md:w-56 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] mb-12 origin-left"
                    />

                    <p className="text-xl md:text-2xl font-light text-[var(--color-primary)]/75 max-w-3xl leading-relaxed">
                        Good businesses shouldn't get lost in digital noise. Most face invisible online presence, outdated platforms, and missed conversion opportunities. <strong className="font-bold text-[var(--color-primary)]">We change that.</strong>
                    </p>
                </motion.div>

                {/* Problem Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={staggerContainerVariants(0.12)}
                >
                    {problemCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={cardItemVariants}
                                className="group card-base card-hover p-8 md:p-10 relative"
                            >
                                {/* Number Badge */}
                                <div className="absolute top-6 right-6 text-xs font-black text-[var(--color-primary)]/20 tracking-widest">
                                    {card.label}
                                </div>

                                {/* Icon */}
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="mb-6 p-3 w-fit rounded-lg bg-[var(--color-primary)]/10 group-hover:bg-[var(--color-primary)]/20"
                                >
                                    <Icon className="w-6 h-6 text-[var(--color-primary)]" />
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-xl md:text-2xl font-black tracking-tight mb-3 uppercase">
                                    {card.title}
                                </h3>

                                <p className="text-[var(--color-primary)]/70 font-light leading-relaxed mb-4">
                                    {card.desc}
                                </p>

                                {/* Accent Bar */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: 32 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: card.delay + 0.3, duration: 0.6 }}
                                    className="h-0.5 bg-[var(--color-primary)]/40 group-hover:bg-[var(--color-primary)]"
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}
