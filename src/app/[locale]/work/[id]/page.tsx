'use client';

import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, ArrowLeft, Check, Calendar, Tag, Users, Monitor, Smartphone, Globe, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, notFound } from 'next/navigation';
import { trackContactIntent } from '@/lib/analytics';
import { getProjectById } from '@/data/projects';
import { getCaseStudy } from '@/data/case-studies';

const FEATURE_ICONS: readonly LucideIcon[] = [Monitor, Globe, Smartphone];

const UI = {
    en: {
        back: 'Back to projects',
        relationship: 'Relationship',
        year: 'Year',
        type: 'Type',
        visit: 'Visit the live site',
        viewLive: 'View live site',
        screenshot: 'screenshot',
        fullScreenshot: 'full page screenshot',
        overview: 'Project overview',
        challenge: 'The challenge',
        solution: 'Our solution',
        glance: 'At a glance',
        service: 'Related service',
        features: 'Key features',
        featuresLead: 'What this site does for its visitors',
        built: 'What we built',
        builtLead: 'The work behind this project',
        stack: 'Technology and focus',
        ctaTitle: 'A similar project in mind?',
        ctaText: 'Tell us about your business and what the site must do. We reply within one business day.',
        ctaStart: 'Start your project',
        ctaMore: 'More projects',
    },
    fr: {
        back: 'Retour aux réalisations',
        relationship: 'Relation',
        year: 'Année',
        type: 'Type',
        visit: 'Voir le site en ligne',
        viewLive: 'Voir le site',
        screenshot: 'capture d’écran',
        fullScreenshot: 'capture de la page complète',
        overview: 'Présentation du projet',
        challenge: 'Le défi',
        solution: 'Notre réponse',
        glance: 'En bref',
        service: 'Service lié',
        features: 'Points clés',
        featuresLead: 'Ce que le site apporte à ses visiteurs',
        built: 'Ce que nous avons construit',
        builtLead: 'Le travail derrière ce projet',
        stack: 'Technologies et axes',
        ctaTitle: 'Un projet similaire en tête ?',
        ctaText: 'Présentez votre activité et ce que le site doit faire. Nous répondons sous un jour ouvré.',
        ctaStart: 'Démarrer votre projet',
        ctaMore: 'Autres réalisations',
    },
} as const;

export default function CaseStudyPage() {
    const params = useParams();
    const projectId = params.id as string;
    const locale = params.locale === 'fr' ? 'fr' : 'en';

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

    const study = getCaseStudy(projectId);
    const projectRecord = getProjectById(projectId);

    if (!study || !projectRecord) {
        notFound();
    }

    const ui = UI[locale];
    const copy = study.copy[locale];
    const project = {
        ...study,
        ...copy,
        features: copy.features.map((feature, idx) => ({ ...feature, icon: FEATURE_ICONS[idx] ?? Monitor })),
    };

    const relationshipLabel = {
        'client-work': locale === 'fr' ? 'Projet client' : 'Client work',
        'studio-owned': locale === 'fr' ? 'Projet du studio WeReact' : 'WeReact studio project',
        'independent-project': locale === 'fr' ? 'Projet indépendant' : 'Independent project',
    }[projectRecord.relationship];

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
                                href={`/${locale}/work`}
                                className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-4 md:mb-8 group"
                            >
                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1" />
                                <span className="text-sm md:text-base font-medium">{ui.back}</span>
                            </Link>

                            {/* Category Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="block px-3 py-1.5 md:px-4 md:py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-sm text-xs md:text-sm font-bold uppercase tracking-wider mb-4 md:mb-6 w-fit"
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
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <Users className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)]">{ui.relationship}</div>
                                        <div className="text-xs md:text-sm font-bold text-[var(--color-text-main)]">{relationshipLabel}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)]">{ui.year}</div>
                                        <div className="text-xs md:text-sm font-bold text-[var(--color-text-main)]">{project.year}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-[var(--color-primary)]/10 flex items-center justify-center">
                                        <Tag className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)]">{ui.type}</div>
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
                                    className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-[var(--color-primary)] text-white rounded-sm text-sm md:text-base font-bold hover:bg-[#2e4833] transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 hover:scale-105 group"
                                >
                                    {ui.visit}
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
                                className="absolute -top-10 -left-10 w-32 h-32 bg-[var(--color-primary)]/10 rounded-sm blur-2xl hidden"
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
                                className="absolute -bottom-10 -right-10 w-40 h-40 bg-[var(--color-primary)]/10 rounded-sm blur-2xl hidden"
                            />

                            {/* Browser Mockup */}
                            <div className="relative bg-white rounded-sm shadow-2xl border border-gray-200 overflow-hidden">
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
                                        alt={`${project.title}, ${ui.screenshot}`}
                                        fill
                                        className="object-cover object-top"
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
                                className="hidden lg:block absolute -bottom-6 -left-6 bg-white rounded-sm shadow-xl p-4 border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-sm bg-[var(--color-primary)]/10 flex items-center justify-center">
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
                                className="hidden lg:block absolute -top-6 -right-6 bg-white rounded-sm shadow-xl p-4 border border-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-sm bg-[var(--color-primary)]/10 flex items-center justify-center">
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
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 hidden rounded-sm blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-primary)]/5 hidden rounded-sm blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </motion.section>

            {/* Project Image/Screenshot Section */}
            <section ref={visualsRef} className="py-16 md:py-24 px-6 bg-white">
                <div className="mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isVisualsInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="relative w-full bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 rounded-sm overflow-hidden border-2 border-[var(--color-primary)]/10 flex items-center justify-center group"
                    >
                        {/* Full Project Screenshot */}
                        <div className="w-full">
                            <Image
                                src={project.imageFull}
                                alt={`${project.title}, ${ui.fullScreenshot}`}
                                width={1920}
                                height={project.imageFullHeight ?? 1000}
                                className="h-auto w-full"
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
                            className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3 bg-white/95 backdrop-blur-sm text-[var(--color-primary)] rounded-sm font-bold text-xs md:text-sm border-2 border-[var(--color-primary)]/20 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 hover:scale-105 shadow-lg hover:shadow-xl z-10"
                        >
                            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span>{ui.viewLive}</span>
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
                                {ui.overview}
                            </h2>
                            <p className="text-xl text-[var(--color-text-secondary)] leading-relaxed mb-8">
                                {project.description}
                            </p>

                            {/* Challenge & Solution */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                        {ui.challenge}
                                    </h3>
                                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                                        {project.challenge}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-3">
                                        {ui.solution}
                                    </h3>
                                    <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                                        {project.solution}
                                    </p>
                                </div>
                                <p className="text-lg text-[var(--color-text-secondary)]">
                                    {ui.service}{locale === 'fr' ? ' : ' : ': '}
                                    <Link
                                        href={`/${locale}/${project.serviceSlug}`}
                                        className="font-bold text-[var(--color-primary)] underline underline-offset-4 hover:no-underline"
                                    >
                                        {project.serviceLabel[locale]}
                                    </Link>
                                </p>
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
                                    {ui.glance}
                                </h3>
                                {project.metrics.map((metric, idx) => (
                                    <div key={idx} className="p-6 bg-white rounded-sm border-2 border-[var(--color-primary)]/10">
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
                            {ui.features}
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">
                            {ui.featuresLead}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {project.features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="text-center p-8 bg-[var(--color-background-main)] rounded-sm border-2 border-[var(--color-primary)]/10 hover:border-[var(--color-primary)]/30 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 rounded-sm bg-[var(--color-primary)]/10 flex items-center justify-center">
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
                            {ui.built}
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">
                            {ui.builtLead}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {project.results.map((result: string, idx: number) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isResultsInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="flex items-start gap-4 p-6 bg-white rounded-sm border-2 border-[var(--color-primary)]/10"
                            >
                                <div className="w-10 h-10 rounded-sm bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
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
                            {ui.stack}
                        </h3>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {project.tags.map((tag: string, idx: number) => (
                                <span
                                    key={idx}
                                    className="px-5 py-3 bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold rounded-sm text-sm"
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
                    <div className={`bg-gradient-to-br ${project.gradient} text-white p-6 md:p-12 lg:p-16 rounded-sm text-center`}>
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                            {ui.ctaTitle}
                        </h2>
                        <p className="text-base md:text-xl text-white/80 mb-6 md:mb-10 max-w-2xl mx-auto">
                            {ui.ctaText}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                            <Link
                                href={`/${locale}/contact`}
                                onClick={() => trackContactIntent('case_study_cta', { destination: 'contact' })}
                                className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-white text-[var(--color-primary)] rounded-sm font-bold text-sm md:text-lg hover:bg-[var(--color-background-main)] transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300 hover:scale-105"
                            >
                                {ui.ctaStart}
                                <ExternalLink className="w-4 h-4 md:w-6 md:h-6" />
                            </Link>
                            <Link
                                href={`/${locale}/work`}
                                className="inline-flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-10 md:py-5 bg-transparent border-2 border-white text-white rounded-sm font-bold text-sm md:text-lg hover:bg-white/10 transition-[color,background-color,border-color,opacity,transform,box-shadow] duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 md:w-6 md:h-6" />
                                {ui.ctaMore}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
