'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Target, Users, Zap, Award, Heart, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
    const heroRef = useRef(null);
    const storyRef = useRef(null);
    const valuesRef = useRef(null);
    const teamRef = useRef(null);

    const isHeroInView = useInView(heroRef, { once: true, margin: "-10%" });
    const isStoryInView = useInView(storyRef, { once: true, margin: "-10%" });
    const isValuesInView = useInView(valuesRef, { once: true, margin: "-10%" });
    const isTeamInView = useInView(teamRef, { once: true, margin: "-10%" });

    const values = [
        {
            icon: Target,
            title: "Purpose-Driven",
            desc: "We believe every project should have a clear purpose and measurable impact on your business goals."
        },
        {
            icon: Users,
            title: "Client-Centric",
            desc: "Your success is our success. We prioritize understanding your needs and exceeding your expectations."
        },
        {
            icon: Zap,
            title: "Innovation First",
            desc: "We stay ahead of trends and leverage cutting-edge technology to deliver future-proof solutions."
        },
        {
            icon: Award,
            title: "Quality Obsessed",
            desc: "We're perfectionists at heart. Every pixel, every line of code matters to us."
        },
        {
            icon: Heart,
            title: "Passionate Team",
            desc: "We love what we do, and it shows in the quality and care we put into every project."
        },
        {
            icon: Lightbulb,
            title: "Creative Solutions",
            desc: "We think outside the box to solve complex problems with elegant, innovative solutions."
        }
    ];

    const stats = [
        { number: "150+", label: "Projects Delivered" },
        { number: "98%", label: "Client Satisfaction" },
        { number: "5+", label: "Years Experience" },
        { number: "24/7", label: "Support Available" }
    ];

    return (
        <div className="min-h-screen bg-[var(--color-background-main)]">
            {/* Hero Section */}
            <section ref={heroRef} className="relative py-20 md:py-32 px-6 bg-[var(--color-primary)] text-[var(--color-background-main)] overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="max-w-[1200px] mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-white/20 bg-white/10 mb-8">
                            <span className="text-sm font-bold uppercase tracking-widest">About WeReact</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9] mb-8">
                            We Build <br />
                            <span className="text-[var(--color-background-main)]">Digital</span> Experiences
                        </h1>

                        <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto">
                            A creative agency dedicated to transforming businesses through innovative design and powerful digital solutions.
                        </p>
                    </motion.div>
                </div>

                {/* Watermark */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
                    <span className="text-[20vw] font-bold leading-none whitespace-nowrap tracking-tighter text-white">
                        ABOUT US
                    </span>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 md:py-20 px-6 bg-white">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                                className="text-center"
                            >
                                <div className="text-5xl md:text-6xl font-bold text-[var(--color-primary)] mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-sm md:text-base font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section ref={storyRef} className="py-16 md:py-24 px-6">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-primary)] mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-lg text-[var(--color-text-secondary)] leading-relaxed">
                                <p>
                                    WeReact was born from a simple belief: <strong className="text-[var(--color-primary)]">every business deserves a digital presence that truly works.</strong>
                                </p>
                                <p>
                                    We started as a small team of designers and developers who were frustrated with the status quo. Too many businesses were stuck with slow, outdated websites that didn't convert. We knew there had to be a better way.
                                </p>
                                <p>
                                    Today, we've grown into a full-service digital agency, but our mission remains the same: to create high-performance digital experiences that drive real business results.
                                </p>
                                <p>
                                    We're not just building websites—we're building partnerships. We're here for the long haul, committed to your success every step of the way.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={isStoryInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-sm overflow-hidden bg-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/10">
                                <Image
                                    src="/images/about-experience.webp"
                                    alt="5+ Years of Excellence in Web Development"
                                    width={800}
                                    height={800}
                                    className="w-full h-full object-cover"
                                    priority
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section ref={valuesRef} className="py-16 md:py-24 px-6 bg-[var(--color-primary)] text-[var(--color-background-main)]">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                            Our Core Values
                        </h2>
                        <p className="text-xl text-white/70 max-w-2xl mx-auto">
                            These principles guide everything we do and shape how we work with our clients.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                                className="bg-white/10 backdrop-blur-sm p-8 rounded-sm border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                            >
                                <div className="w-16 h-16 rounded-sm bg-white/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <value.icon size={32} strokeWidth={2} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-white/70 leading-relaxed">
                                    {value.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 md:py-24 px-6 bg-white">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="bg-[var(--color-primary)] text-[var(--color-background-main)] p-12 rounded-sm"
                        >
                            <h3 className="text-4xl font-bold mb-6">Our Mission</h3>
                            <p className="text-xl text-white/80 leading-relaxed mb-8">
                                To empower businesses with digital solutions that don't just look good—they perform. We're committed to delivering measurable results that drive growth and success.
                            </p>
                            <div className="flex items-center gap-3 text-lg font-medium">
                                <span>Learn more about our approach</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-[var(--color-background-main)] border-2 border-[var(--color-primary)]/20 p-12 rounded-sm"
                        >
                            <h3 className="text-4xl font-bold text-[var(--color-primary)] mb-6">Our Vision</h3>
                            <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed mb-8">
                                To become the go-to digital partner for businesses that want to make a real impact online. We envision a future where every business has access to world-class digital solutions.
                            </p>
                            <div className="flex items-center gap-3 text-lg font-medium text-[var(--color-primary)]">
                                <span>See our work</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section ref={teamRef} className="py-12 md:py-16 lg:py-24 px-4 md:px-6 bg-[var(--color-background-main)]">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isTeamInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center bg-[var(--color-primary)] text-[var(--color-background-main)] p-6 md:p-12 lg:p-16 rounded-sm"
                    >
                        <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
                            Ready to Work Together?
                        </h2>
                        <p className="text-base md:text-xl text-white/70 mb-6 md:mb-10 max-w-2xl mx-auto">
                            Let's create something extraordinary. Get in touch and let's discuss how we can help your business thrive online.
                        </p>
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-white text-[var(--color-primary)] rounded-sm font-bold text-sm md:text-lg uppercase tracking-wider hover:bg-[var(--color-background-main)] transition-all duration-300 hover:scale-105"
                        >
                            Start Your Project
                            <ArrowRight className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
