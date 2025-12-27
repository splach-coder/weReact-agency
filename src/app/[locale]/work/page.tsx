'use client';

import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Code, Sparkles, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function WorkPage() {
    const heroRef = useRef(null);
    const projectsRef = useRef(null);
    const ctaRef = useRef(null);

    const isHeroInView = useInView(heroRef, { once: true, margin: "-10%" });
    const isProjectsInView = useInView(projectsRef, { once: true, margin: "-10%" });
    const isCtaInView = useInView(ctaRef, { once: true, margin: "-10%" });

    const [hoveredProject, setHoveredProject] = useState<string | null>(null);

    const projects = [
        {
            id: "flying-tandem",
            title: "Flying Tandem",
            client: "Adventure Tourism",
            year: "2024",
            category: "Tourism Website",
            description: "Professional paragliding website with booking system and safety information",
            tags: ["Next.js", "Booking", "Responsive"],
            image: "/images/projects/flying-tandem.webp", // You'll add these images
            gradient: "from-[#3A5A40] to-[#2e4833]"
        },
        {
            id: "kasbah-angour",
            title: "Kasbah Angour",
            client: "Hospitality",
            year: "2024",
            category: "Hotel Website",
            description: "Elegant hotel website showcasing accommodations and amenities",
            tags: ["Next.js", "CMS", "SEO"],
            image: "/images/projects/kasbah-angour.webp",
            gradient: "from-[#2e4833] to-[#1f3322]"
        },
        {
            id: "your-morocco",
            title: "Your Morocco",
            client: "Travel & Experiences",
            year: "2024",
            category: "Travel Platform",
            description: "Comprehensive travel platform for Moroccan tours and experiences",
            tags: ["Next.js", "Travel", "Multilingual"],
            image: "/images/projects/your-morocco.webp",
            gradient: "from-[#3A5A40] to-[#2e4833]"
        },
        {
            id: "by-marrakech",
            title: "By Marrakech",
            client: "City Guide",
            year: "2024",
            category: "Digital Guide",
            description: "Modern city guide for discovering the best of Marrakech",
            tags: ["Next.js", "PWA", "i18n"],
            image: "/images/projects/by-marrakech.webp",
            gradient: "from-[#2e4833] to-[#1f3322]"
        }
    ];

    const stats = [
        { number: "4+", label: "Projects Delivered" },
        { number: "4+", label: "Happy Clients" },
        { number: "100%", label: "Satisfaction" },
        { number: "5★", label: "Avg Rating" }
    ];

    return (
        <div className="min-h-screen bg-[var(--color-background-main)]">
            {/* Hero Section */}
            <section ref={heroRef} className="relative py-20 md:py-32 px-6 bg-[var(--color-primary)] text-[var(--color-background-main)] overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="max-w-[1200px] mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 mb-8">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-bold uppercase tracking-widest">Our Work</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase leading-[0.9] mb-8">
                            Projects We're <br />
                            <span className="text-[var(--color-background-main)]">Proud Of</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/70 leading-relaxed max-w-3xl mx-auto">
                            Real results for real businesses. Explore our portfolio of successful projects.
                        </p>
                    </motion.div>
                </div>

                <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03]">
                    <span className="text-[20vw] font-bold leading-none whitespace-nowrap tracking-tighter text-white">
                        PORTFOLIO
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

            {/* Projects Grid with Images */}
            <section ref={projectsRef} className="py-16 md:py-24 px-6">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isProjectsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-primary)] mb-6">
                            Featured Projects
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                            Click on any project to see the full case study
                        </p>
                    </motion.div>

                    {/* Projects List */}
                    <div className="space-y-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isProjectsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/work/${project.id}`}
                                    onMouseEnter={() => setHoveredProject(project.id)}
                                    onMouseLeave={() => setHoveredProject(null)}
                                    className="group block"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden border-2 border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 transition-all duration-500 hover:shadow-2xl">
                                        {/* Image Side */}
                                        <div className="relative h-[300px] lg:h-[400px] overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5">
                                            {/* Project Image */}
                                            <Image
                                                src={project.image}
                                                alt={`${project.title} - ${project.description}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                            />

                                            {/* Overlay on hover */}
                                            <div className={`absolute inset-0 bg-[var(--color-primary)]/90 flex items-center justify-center transition-opacity duration-500 ${hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                                                }`}>
                                                <div className="text-center text-white">
                                                    <ArrowRight size={40} className="mx-auto mb-4 transition-transform duration-300 group-hover:translate-x-2" />
                                                    <p className="text-lg font-bold">View Case Study</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Side */}
                                        <div className="p-8 lg:p-10 flex flex-col justify-center">
                                            {/* Category Badge */}
                                            <div className="inline-block w-fit px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                                                {project.category}
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-3xl md:text-4xl font-bold text-[var(--color-primary)] mb-3 group-hover:text-[#2e4833] transition-colors">
                                                {project.title}
                                            </h3>

                                            {/* Meta */}
                                            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                                {project.client} • {project.year}
                                            </p>

                                            {/* Description */}
                                            <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed mb-6">
                                                {project.description}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.tags.map((tag, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-[var(--color-primary)]/5 text-[var(--color-primary)] text-sm font-medium rounded-full"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* CTA */}
                                            <div className="flex items-center gap-2 text-[var(--color-primary)] font-bold group-hover:gap-4 transition-all duration-300">
                                                <span>View Full Case Study</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section ref={ctaRef} className="py-12 md:py-16 lg:py-24 px-4 md:px-6">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center bg-[var(--color-primary)] text-white p-6 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl"
                    >
                        <Code className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6" />
                        <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6">
                            Ready to Start Your Project?
                        </h2>
                        <p className="text-base md:text-xl text-white/70 mb-6 md:mb-10 max-w-2xl mx-auto">
                            Let's create something amazing together. Your project could be our next success story.
                        </p>
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-white text-[var(--color-primary)] rounded-full font-bold text-sm md:text-lg uppercase tracking-wider hover:bg-[var(--color-background-main)] transition-all duration-300 hover:scale-105"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4 md:w-6 md:h-6 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
