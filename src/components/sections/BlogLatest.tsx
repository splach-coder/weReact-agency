'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { blogPosts } from '@/data/blog';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

export default function BlogLatest() {
    const locale = useLocale();
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-10%" });
    const latestPosts = blogPosts.slice(0, 3);

    return (
        <section ref={containerRef} className="py-20 md:py-24 bg-white overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary)]">The Journal</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-[0.9] text-[var(--color-primary)] font-nohemi uppercase">
                            Latest <br /> Insights
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Link
                            href={`/${locale}/blog`}
                            className="group flex items-center gap-3 text-[var(--color-primary)] font-black uppercase tracking-widest text-[10px]"
                        >
                            Journal Index
                            <div className="w-8 h-8 rounded-sm border border-[var(--color-primary)]/20 flex items-center justify-center group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all duration-300">
                                <ArrowRight size={14} />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {latestPosts.map((post, index) => (
                        <motion.article
                            key={post.slug}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                            className="group"
                        >
                            <Link href={`/${locale}/blog/${post.slug}`} className="block relative aspect-video rounded-sm overflow-hidden mb-6">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </Link>

                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.2em] text-[var(--color-text-secondary)] mb-3 px-1">
                                <span className="text-[var(--color-primary)]">{post.category}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                            </div>

                            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-3 leading-tight group-hover:translate-x-1 transition-transform duration-300 px-1">
                                <Link href={`/${locale}/blog/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </h3>

                            <p className="text-[var(--color-text-secondary)] leading-relaxed line-clamp-2 text-xs px-1">
                                {post.excerpt}
                            </p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
