'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cardItemVariants, staggerContainerVariants } from '@/lib/animations';

export default function Packages() {
    const packages = [
        {
            label: "01",
            name: "Starter",
            description: "For small businesses getting online.",
            price: "Custom",
            features: [
                "1 to 3 pages",
                "Modern design",
                "Mobile-friendly",
                "Contact form",
                "Basic SEO",
                "Fast delivery"
            ],
            cta: "Get Started"
        },
        {
            label: "02",
            name: "Business",
            description: "The perfect middle ground for growth.",
            price: "Custom",
            highlight: true,
            badge: "Most Popular",
            features: [
                "Up to 5 pages",
                "Custom layout",
                "Mobile optimized",
                "Contact form",
                "SEO setup",
                "Performance tuning"
            ],
            cta: "Get Started"
        },
        {
            label: "03",
            name: "Enterprise",
            description: "For complex, scalable solutions.",
            price: "Custom",
            features: [
                "Unlimited pages",
                "Tailored structure",
                "Advanced features",
                "Scalable design",
                "Dedicated support",
                "Custom integrations"
            ],
            cta: "Let's Talk"
        }
    ];

    return (
        <section className="py-20 md:py-32 px-6 md:px-12 bg-[var(--color-background-main)]">
            <div className="max-w-[1400px] mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20 md:mb-28"
                >
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-[var(--color-primary)]/50 mb-4">
                        PRICING
                    </p>
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-6 max-w-4xl mx-auto">
                        Plans Built <br />
                        <span className="text-[var(--color-primary-light)]">for Growth</span>
                    </h2>
                    <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed font-light">
                        Flexible packages tailored to your business size and goals. All includes our commitment to quality and results.
                    </p>
                </motion.div>

                {/* Pricing Cards Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={staggerContainerVariants(0.15)}
                >
                    {packages.map((pkg, idx) => (
                        <motion.div
                            key={idx}
                            variants={cardItemVariants}
                            className={`group relative card-base card-hover p-8 md:p-10 flex flex-col ${
                                pkg.highlight ? 'md:scale-105 ring-2 ring-[var(--color-primary)]' : ''
                            }`}
                        >
                            {/* Badge */}
                            {pkg.badge && (
                                <motion.span
                                    initial={{ opacity: 0, y: -10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.15 + 0.3 }}
                                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
                                >
                                    {pkg.badge}
                                </motion.span>
                            )}

                            {/* Number */}
                            <div className="text-xs font-black text-[var(--color-primary)]/20 tracking-widest mb-6">
                                {pkg.label}
                            </div>

                            {/* Title */}
                            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--color-text-main)] mb-2">
                                {pkg.name}
                            </h3>

                            {/* Description */}
                            <p className="text-[var(--color-text-secondary)] font-light mb-8">
                                {pkg.description}
                            </p>

                            {/* Price */}
                            <div className="mb-8">
                                <p className="text-sm text-[var(--color-text-muted)] tracking-widest font-semibold">
                                    PRICING
                                </p>
                                <p className="text-3xl font-black text-[var(--color-text-main)]">
                                    {pkg.price}
                                </p>
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-10 flex-grow">
                                {pkg.features.map((feature, fidx) => (
                                    <motion.li
                                        key={fidx}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.15 + fidx * 0.05 + 0.2 }}
                                        className="flex items-start gap-3 text-[var(--color-text-secondary)]"
                                    >
                                        <div className="flex-shrink-0 mt-1 p-1 rounded-full bg-[var(--color-primary)]/10">
                                            <Check size={16} className="text-[var(--color-primary)] font-bold" />
                                        </div>
                                        <span className="font-light">{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <Link href="#contact" className="w-full">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`w-full py-4 px-6 rounded-lg font-bold tracking-wide uppercase text-sm transition-all flex items-center justify-center gap-2 group ${
                                        pkg.highlight
                                            ? 'bg-[var(--color-primary)] text-white hover:shadow-lg'
                                            : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20 hover:bg-[var(--color-primary)]/15 hover:border-[var(--color-primary)]/40'
                                    }`}
                                >
                                    {pkg.cta}
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-center"
                >
                    <p className="text-[var(--color-text-secondary)] font-light">
                        Not sure which fits best?{' '}
                        <Link href="#contact" className="text-[var(--color-primary)] font-bold hover:text-[var(--color-primary-dark)] transition-colors">
                            Let&apos;s discuss your project
                        </Link>
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
