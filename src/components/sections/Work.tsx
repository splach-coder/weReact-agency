'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import Button from '../Button'; // Assuming we have this or can use standard button

export default function Work() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });

    const projects = [
        {
            id: "flying-tandem",
            src: "/images/projects/flying-tandem.webp",
            alt: "Flying Tandem",
            category: "Tourism Website",
            desc: "A professional paragliding platform with real-time booking and multilingual support for adventure seekers."
        },
        {
            id: "kasbah-angour",
            src: "/images/projects/kasbah-angour.webp",
            alt: "Kasbah Angour",
            category: "Hotel Website",
            desc: "Showcasing authentic Moroccan hospitality with stunning imagery and direct booking integration."
        },
        {
            id: "your-morocco",
            src: "/images/projects/your-morocco.webp",
            alt: "Your Morocco",
            category: "Travel Platform",
            desc: "Curating authentic Moroccan experiences with comprehensive tour listings and booking capabilities."
        },
        {
            id: "by-marrakech",
            src: "/images/projects/by-marrakech.webp",
            alt: "By Marrakech",
            category: "Digital Guide",
            desc: "Your digital companion to Marrakech with offline functionality and interactive maps."
        },
    ];

    // Triple the array for smooth infinite scrolling (12 items total)
    const marqueeProjects = [...projects, ...projects, ...projects];

    return (
        <section id="work" ref={containerRef} className="py-20 md:py-32 bg-[var(--color-background-main)] text-[var(--color-primary)] overflow-hidden">

            <div className="max-w-[1400px] mx-auto px-6 mb-16 md:mb-24">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-6">
                            <ArrowUpRight size={14} />
                            <span className="text-xs font-bold uppercase tracking-widest">Our Work</span>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-6">
                            Trusted by Over 15k+ <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/60">
                                Satisfied Clients
                            </span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-4"
                    >
                        <p className="text-lg opacity-70 max-w-sm text-right mb-6 hidden md:block">
                            WeReact has helped businesses across industries enhance their sales performance and achieve their goals.
                        </p>
                        <button className="bg-[var(--color-primary)] text-[var(--color-background-main)] px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform duration-300">
                            Get Started Now
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing">
                <motion.div
                    className="flex gap-6 md:gap-8 w-max px-6"
                    drag="x"
                    dragConstraints={{ left: -2000, right: 0 }}
                    dragElastic={0.1}
                    animate={{ x: "-33.33%" }}
                    transition={{
                        ease: "linear",
                        duration: 30,
                        repeat: Infinity
                    }}
                >
                    {/* Render duplications for seamless loop */}
                    {marqueeProjects.map((project, idx) => (
                        <Link
                            key={idx}
                            href={`/work/${project.id}`}
                            className="relative w-[300px] md:w-[400px] aspect-[3/4] rounded-[2rem] overflow-hidden flex-shrink-0 group select-none block transition-transform duration-300 hover:scale-[1.02]"
                        >
                            <Image
                                src={project.src}
                                alt={project.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 300px, 400px"
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                            {/* Text Content Overlay */}
                            <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
                                <div className="mb-4">
                                    <span className="inline-block p-2 bg-white/20 backdrop-blur-md rounded-full mb-4">
                                        <ArrowRight size={16} className="text-white" />
                                    </span>
                                </div>

                                <div className="border-t border-white/20 pt-4 flex justify-between items-end">
                                    <div>
                                        <div className="font-bold text-lg tracking-tight flex items-center gap-2">
                                            {project.alt}
                                        </div>
                                        <div className="text-sm opacity-60 font-light uppercase tracking-widest mt-1">
                                            {project.category}
                                        </div>
                                    </div>
                                    {/* Brand Logo Placeholder if needed */}
                                    {/* <div className="h-6 w-6 bg-white/20 rounded-full" /> */}
                                </div>
                            </div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
