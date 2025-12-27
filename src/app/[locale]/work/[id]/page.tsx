'use client';

import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, ArrowLeft, Check, Calendar, Tag, Users, Monitor, Smartphone, Globe } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

export default function CaseStudyPage() {
    const params = useParams();
    const projectId = params.id as string;

    const heroRef = useRef(null);
    const overviewRef = useRef(null);
    const visualsRef = useRef(null);
    const featuresRef = useRef(null);
    const resultsRef = useRef(null);

    const isHeroInView = useInView(heroRef, { once: true, margin: "-10%" });
    const isOverviewInView = useInView(overviewRef, { once: true, margin: "-10%" });
    const isVisualsInView = useInView(visualsRef, { once: true, margin: "-10%" });
    const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-10%" });
    const isResultsInView = useInView(resultsRef, { once: true, margin: "-10%" });

    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

    // Project data
    const projects: Record<string, any> = {
        "flying-tandem": {
            title: "Flying Tandem",
            client: "Adventure Tourism",
            year: "2025",
            category: "Tourism Website",
            tagline: "Bringing the thrill of paragliding to life online",
            description: "A professional paragliding and tandem flight website showcasing aerial experiences, safety information, and booking details for adventure tourism enthusiasts. Built with modern web technologies for optimal performance.",
            challenge: "Create an engaging platform that captures the thrill of paragliding while maintaining a professional, trustworthy image. The site needed to handle bookings, showcase safety credentials, and work flawlessly on mobile devices for tourists on the go.",
            solution: "We developed a dynamic, visually stunning website with integrated booking system, real-time availability, and comprehensive safety information. The design emphasizes the adventure while building trust through clear communication of safety protocols and certifications.",
            results: [
                "Seamless booking experience with real-time availability",
                "Mobile-responsive design optimized for on-the-go bookings",
                "Multilingual support for international tourists",
                "Integrated payment gateway for secure transactions",
                "Weather integration for flight conditions",
                "Photo gallery showcasing customer experiences"
            ],
            tags: ["Next.js", "React", "Booking System", "Responsive", "Payment Integration", "i18n"],
            link: "https://www.flyingtandem.com/",
            image: "/images/projects/flying-tandem.webp",
            imageFull: "/images/projects/flying-tandem-full.webp",
            gradient: "from-[#3A5A40] to-[#2e4833]",
            color: "#3A5A40",
            features: [
                {
                    icon: Monitor,
                    title: "Real-time Booking",
                    description: "Live availability calendar with instant confirmation"
                },
                {
                    icon: Globe,
                    title: "Multi-language",
                    description: "Support for English, French, and Arabic"
                },
                {
                    icon: Smartphone,
                    title: "Mobile First",
                    description: "Optimized for tourists booking on mobile devices"
                }
            ],
            metrics: [
                { label: "Booking Conversion", value: "35%", description: "Increase in online bookings" },
                { label: "Mobile Traffic", value: "68%", description: "Of total visitors" },
                { label: "Page Speed", value: "2.1s", description: "Average load time" }
            ]
        },
        "kasbah-angour": {
            title: "Kasbah Angour",
            client: "Hospitality",
            year: "2025",
            category: "Hotel Website",
            tagline: "Showcasing authentic Moroccan hospitality",
            description: "A hotel and guesthouse website presenting Kasbah Angour, including accommodation details, services, location information, and direct contact options. Features stunning imagery and intuitive navigation.",
            challenge: "Showcase the unique character and authentic Moroccan experience of Kasbah Angour while providing all necessary booking and contact information in an elegant, user-friendly interface that reflects the property's premium positioning.",
            solution: "We created a visually rich website that highlights the property's unique features through high-quality imagery and compelling content. The design balances aesthetics with functionality, making it easy for guests to explore rooms, amenities, and make reservations directly.",
            results: [
                "Enhanced online presence with professional branding",
                "Direct booking integration reducing commission fees",
                "Beautiful visual showcase of property and amenities",
                "Improved search engine visibility",
                "Integrated contact forms and inquiry system",
                "Room availability calendar"
            ],
            tags: ["Next.js", "CMS", "Hospitality", "SEO", "Booking", "Photography"],
            link: "https://www.kasbahangour.com/en",
            image: "/images/projects/kasbah-angour.webp",
            imageFull: "/images/projects/kasbah-angour-full.webp",
            gradient: "from-[#2e4833] to-[#1f3322]",
            color: "#2e4833",
            features: [
                {
                    icon: Monitor,
                    title: "Room Showcase",
                    description: "Detailed room presentations with photo galleries"
                },
                {
                    icon: Globe,
                    title: "SEO Optimized",
                    description: "Enhanced visibility in search results"
                },
                {
                    icon: Smartphone,
                    title: "Direct Booking",
                    description: "Commission-free reservation system"
                }
            ],
            metrics: [
                { label: "Direct Bookings", value: "45%", description: "Increase in direct reservations" },
                { label: "Organic Traffic", value: "120%", description: "Growth in 6 months" },
                { label: "Bounce Rate", value: "-28%", description: "Improvement" }
            ]
        },
        "your-morocco": {
            title: "Your Morocco",
            client: "Travel & Experiences",
            year: "2025",
            category: "Travel Platform",
            tagline: "Curating authentic Moroccan experiences",
            description: "A travel platform dedicated to Moroccan experiences, tours, and cultural discovery, designed to help visitors explore Morocco in a curated way. Features comprehensive tour listings and booking capabilities.",
            challenge: "Create a comprehensive travel platform that showcases the diversity of Moroccan experiences while making it easy for travelers to discover, compare, and book tours and activities. The platform needed to handle complex itineraries and multiple tour operators.",
            solution: "We built a feature-rich platform with advanced filtering, detailed tour descriptions, and integrated booking system. The design emphasizes visual storytelling while maintaining excellent usability and performance across all devices.",
            results: [
                "Curated travel experiences with detailed itineraries",
                "Interactive tour discovery with smart filtering",
                "Cultural immersion focus with local insights",
                "Seamless booking and payment process",
                "Tour operator management system",
                "Customer review and rating system"
            ],
            tags: ["Next.js", "Travel", "Booking", "Multilingual", "CMS", "Reviews"],
            link: "https://your-morocco.com/en",
            image: "/images/projects/your-morocco.webp",
            imageFull: "/images/projects/your-morocco-full.webp",
            gradient: "from-[#3A5A40] to-[#2e4833]",
            color: "#3A5A40",
            features: [
                {
                    icon: Monitor,
                    title: "Tour Catalog",
                    description: "Comprehensive tour listings with filtering"
                },
                {
                    icon: Globe,
                    title: "Multi-language",
                    description: "English, French, and Arabic support"
                },
                {
                    icon: Smartphone,
                    title: "Booking System",
                    description: "End-to-end reservation management"
                }
            ],
            metrics: [
                { label: "Tour Bookings", value: "250+", description: "In first 3 months" },
                { label: "User Engagement", value: "4.2min", description: "Average session duration" },
                { label: "Conversion Rate", value: "12%", description: "Visitor to booking" }
            ]
        },
        "by-marrakech": {
            title: "By Marrakech",
            client: "City Guide",
            year: "2025",
            category: "Digital Guide",
            tagline: "Your digital companion to Marrakech",
            description: "A modern city guide for Marrakech highlighting places, culture, and experiences, built with a clean interface and multilingual support. Helps visitors discover the best of Marrakech.",
            challenge: "Design a modern, intuitive city guide that helps visitors navigate Marrakech's rich cultural landscape while providing up-to-date information about places, events, and experiences. The platform needed to be fast, accessible, and work offline.",
            solution: "We developed a clean, content-focused platform with excellent categorization, search functionality, and multilingual support. Implemented as a Progressive Web App for offline access and mobile-first experience.",
            results: [
                "Clean, modern interface for easy navigation",
                "Comprehensive city coverage with regular updates",
                "Multilingual platform (EN/FR/AR)",
                "Mobile-optimized for travelers on the go",
                "Offline functionality via PWA",
                "Interactive maps integration"
            ],
            tags: ["Next.js", "City Guide", "PWA", "i18n", "Content Management", "Maps"],
            link: "https://by-marrakech.vercel.app/en",
            image: "/images/projects/by-marrakech.webp",
            imageFull: "/images/projects/by-marrakech-full.webp",
            gradient: "from-[#2e4833] to-[#1f3322]",
            color: "#2e4833",
            features: [
                {
                    icon: Monitor,
                    title: "Place Directory",
                    description: "Categorized listings of places and experiences"
                },
                {
                    icon: Globe,
                    title: "PWA",
                    description: "Works offline as a Progressive Web App"
                },
                {
                    icon: Smartphone,
                    title: "Maps Integration",
                    description: "Interactive maps with directions"
                }
            ],
            metrics: [
                { label: "Monthly Users", value: "5K+", description: "Active monthly visitors" },
                { label: "Page Views", value: "8.5", description: "Average per session" },
                { label: "Return Rate", value: "42%", description: "Returning visitors" }
            ]
        }
    };

    const project = projects[projectId] || projects["flying-tandem"];

    return (
        <div className="min-h-screen bg-[var(--color-background-main)]">
            {/* Creative Hero Section with Split Layout */}
            <motion.section
                ref={heroRef}
                className="relative min-h-screen flex items-center pt-24 md:pt-0 px-4 md:px-12 overflow-hidden bg-[var(--color-background-main)]"
            >
                <div className="max-w-[1500px] mx-auto w-full relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                        {/* Left Side - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Back Button */}
                            <Link
                                href="/work"
                                className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-4 md:mb-8 group"
                            >
                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
                                <span className="text-sm md:text-base font-medium">Back to Projects</span>
                            </Link>

                            {/* Category Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="block px-3 py-1.5 md:px-4 md:py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-xs md:text-sm font-bold uppercase tracking-wider mb-4 md:mb-6 w-fit"
                            >
                                {project.category}
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[var(--color-primary)] mb-3 md:mb-4"
                            >
                                {project.title}
                            </motion.h1>

                            {/* Tagline */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="text-base md:text-xl lg:text-2xl text-[var(--color-text-secondary)] mb-6 md:mb-8"
                            >
                                {project.tagline}
                            </motion.p>

                            {/* Meta Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="flex flex-wrap gap-3 md:gap-6 mb-6 md:mb-10"
                            >
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <Users className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)]">Client</div>
                                        <div className="text-xs md:text-sm font-bold text-[var(--color-text-main)]">{project.client}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)]">Year</div>
                                        <div className="text-xs md:text-sm font-bold text-[var(--color-text-main)]">{project.year}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <Tag className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)]">Type</div>
                                        <div className="text-xs md:text-sm font-bold text-[var(--color-text-main)]">{project.category}</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* CTA */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-[var(--color-primary)] text-white rounded-full text-sm md:text-base font-bold hover:bg-[#2e4833] transition-all duration-300 hover:scale-105 group"
                                >
                                    Visit Live Site
                                    <ExternalLink className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </a>
                            </motion.div>
                        </motion.div>

                        {/* Right Side - Browser Mockup with Screenshot */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="relative"
                        >
                            {/* Floating Decorative Elements */}
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 5, 0]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--color-primary)]/10 rounded-3xl blur-2xl"
                            />
                            <motion.div
                                animate={{
                                    y: [0, 20, 0],
                                    rotate: [0, -5, 0]
                                }}
                                transition={{
                                    duration: 8,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--color-primary)]/10 rounded-3xl blur-2xl"
                            />

                            {/* Browser Mockup */}
                            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                                {/* Browser Chrome */}
                                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1 text-xs text-gray-500 flex items-center gap-2">
                                        <Globe className="w-3 h-3" />
                                        <span className="truncate">{project.link}</span>
                                    </div>
                                </div>

                                {/* Screenshot Area */}
                                <div className="relative aspect-[5/3] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-primary)]/10">
                                    {/* Project Screenshot */}
                                    <Image
                                        src={project.image}
                                        alt={`${project.title} screenshot`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />

                                    {/* Animated Glow Effect */}
                                    <motion.div
                                        animate={{
                                            opacity: [0.3, 0.6, 0.3],
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className={`absolute inset-0 bg-gradient-to-tr ${project.gradient} opacity-0 mix-blend-overlay`}
                                    />
                                </div>
                            </div>

                            {/* Floating Stats Cards - Desktop Only */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={isHeroInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="hidden lg:block absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <Check className="w-6 h-6 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[var(--color-primary)]">
                                            {project.metrics[0].value}
                                        </div>
                                        <div className="text-xs text-[var(--color-text-secondary)]">
                                            {project.metrics[0].label}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                animate={isHeroInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 1 }}
                                className="hidden lg:block absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <Smartphone className="w-6 h-6 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[var(--color-primary)]">
                                            {project.metrics[1].value}
                                        </div>
                                        <div className="text-xs text-[var(--color-text-secondary)]">
                                            {project.metrics[1].label}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-primary)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </motion.section>

            {/* Project Image/Screenshot Section */}
            <section ref={visualsRef} className="py-16 md:py-24 px-6 bg-white">
                <div className="mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisualsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="relative w-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 rounded-3xl overflow-hidden border-2 border-[var(--color-primary)]/10 flex items-center justify-center group"
                    >
                        {/* Full Project Screenshot */}
                        <div className="relative w-full h-full min-h-[450px] md:min-h-[1400px]">
                            <Image
                                src={project.imageFull}
                                alt={`${project.title} full screenshot`}
                                fill
                                className="object-contain"
                                sizes="100vw"
                            />
                        </div>

                        {/* Floating Live Website Link */}
                        <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isVisualsInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-white/95 backdrop-blur-sm text-[var(--color-primary)] rounded-full font-bold text-xs md:text-sm border-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl z-10"
                        >
                            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>View Live Site</span>
                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </motion.a>
                    </motion.div>
                </div>
            </section>

            {/* Overview Section */}
            <section ref={overviewRef} className="py-16 md:py-24 px-6">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isOverviewInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6 }}
                            className="lg:col-span-2"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">
                                Project Overview
                            </h2>
                            <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed mb-8">
                                {project.description}
                            </p>

                            {/* Challenge & Solution */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                        The Challenge
                                    </h3>
                                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                                        {project.challenge}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                        Our Solution
                                    </h3>
                                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                                        {project.solution}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar - Metrics */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={isOverviewInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="sticky top-24 space-y-6">
                                <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4">
                                    Key Metrics
                                </h3>
                                {project.metrics.map((metric: any, idx: number) => (
                                    <div key={idx} className="p-6 bg-white rounded-2xl border-2 border-[var(--color-primary)]/10">
                                        <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">
                                            {metric.value}
                                        </div>
                                        <div className="text-sm font-bold text-[var(--color-text-main)] mb-1">
                                            {metric.label}
                                        </div>
                                        <div className="text-sm text-[var(--color-text-secondary)]">
                                            {metric.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} className="py-16 md:py-24 px-6 bg-white">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-4">
                            Key Features
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">
                            What makes this project special
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {project.features.map((feature: any, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="text-center p-8 bg-[var(--color-background-main)] rounded-2xl border-2 border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 transition-all duration-300"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                                    <feature.icon size={32} className="text-[var(--color-primary)]" />
                                </div>
                                <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--color-text-secondary)]">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results Section */}
            <section ref={resultsRef} className="py-16 md:py-24 px-6">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isResultsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-4">
                            Project Results
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">
                            What we achieved together
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {project.results.map((result: string, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isResultsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="flex items-start gap-4 p-6 bg-white rounded-2xl border-2 border-[var(--color-primary)]/10"
                            >
                                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                                    <Check size={20} strokeWidth={3} className="text-[var(--color-primary)]" />
                                </div>
                                <p className="text-lg text-[var(--color-text-main)] leading-relaxed">
                                    {result}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Technology Stack */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isResultsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-16 text-center"
                    >
                        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                            Technology Stack
                        </h3>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {project.tags.map((tag: string, idx: number) => (
                                <span
                                    key={idx}
                                    className="px-5 py-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-16 lg:py-24 px-4 md:px-6 bg-white">
                <div className="max-w-[1200px] mx-auto">
                    <div className={`bg-gradient-to-br ${project.gradient} text-white p-6 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl text-center`}>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                            Interested in a Similar Project?
                        </h2>
                        <p className="text-base md:text-xl text-white/80 mb-6 md:mb-10 max-w-2xl mx-auto">
                            Let's discuss how we can create something amazing for your business.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-white text-[var(--color-primary)] rounded-full font-bold text-sm md:text-lg hover:bg-[var(--color-background-main)] transition-all duration-300 hover:scale-105"
                            >
                                Start Your Project
                                <ExternalLink className="w-4 h-4 md:w-6 md:h-6" />
                            </Link>
                            <Link
                                href="/work"
                                className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-transparent border-2 border-white text-white rounded-full font-bold text-sm md:text-lg hover:bg-white/10 transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
                                View More Projects
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
