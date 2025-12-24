'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Problem() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section ref={sectionRef} className="relative w-full py-8 md:py-16 bg-[var(--color-background-main)] text-[var(--color-primary)] overflow-hidden">
            {/* Background Watermark - Parallax */}
            <motion.div
                style={{ y: yBackground }}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden"
            >
                <span className="text-[25vw] font-bold leading-none whitespace-nowrap tracking-tighter text-[var(--color-primary)]">
                    REALITY
                </span>
            </motion.div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

                    {/* Left: The "Hook" - Huge Typography */}
                    <div className="md:col-span-7 flex flex-col justify-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9] mb-8">
                                INVISIBLE <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)]">ONLINE?</span>
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2, ease: "circOut" }}
                            className="h-1 w-32 md:w-48 bg-[var(--color-primary)] mb-12 origin-left"
                        />

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-2xl md:text-3xl font-extralight text-[var(--color-primary)]/80 max-w-2xl leading-normal"
                        >
                            Good businesses shouldn't be hidden in the digital noise. <strong className="font-bold text-[var(--color-primary)]">But most are.</strong>
                        </motion.p>
                    </div>

                    {/* Right: The Breakdown - Cards */}
                    <div className="md:col-span-5 flex flex-col gap-6 mt-12 md:mt-0">
                        {[
                            {
                                title: "The Confusion",
                                weight: "font-bold", // 700
                                desc: "Building a platform feels overwhelming, expensive, and technically complex.",
                                delay: 0.2
                            },
                            {
                                title: "The Outdated",
                                weight: "font-bold", // 700
                                desc: "Existing sites often load slowly, look generic, and fail to convert visitors.",
                                delay: 0.3
                            },
                            {
                                title: "The Solution",
                                weight: "font-bold", // 700
                                desc: "A website shouldn't be a problem. It's your most powerful asset.",
                                highlight: true,
                                delay: 0.4
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: item.delay }}
                                className={`p-8 rounded-3xl border ${item.highlight ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-[var(--color-background-main)]' : 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 text-[var(--color-primary)]'} backdrop-blur-sm transition-colors duration-300 group`}
                            >
                                <h3 className={`text-2xl ${item.weight} tracking-tight mb-3 uppercase flex items-center gap-3`}>
                                    {item.title}
                                    {!item.highlight && <span className="h-[2px] w-8 bg-[var(--color-primary)] group-hover:w-12 transition-all duration-300" />}
                                </h3>
                                <p className={`text-lg ${item.highlight ? 'font-medium' : 'font-extralight opacity-80'}`}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
