'use client';

import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function Footer() {
    const locale = useLocale();

    return (
        <footer className="relative bg-[var(--color-primary)] text-[#E3E3DC] py-8 md:py-16 overflow-hidden">

            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]" aria-hidden="true">
                <span className="text-[25vw] font-black tracking-tighter text-white">WeReact</span>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-start">

                    {/* Left Column: Newsletter & Info */}
                    <div className="flex flex-col max-w-lg">
                        <h2 className="text-2xl md:text-3xl font-bold uppercase leading-tight mb-12 tracking-wide text-white">
                            Sign up for our newsletter and stay up to date with the cool stuff we're cooking up.
                        </h2>

                        <form className="flex flex-col gap-6 mb-12 w-full md:max-w-md">
                            <input
                                type="email"
                                placeholder="YOUR EMAIL"
                                className="bg-transparent border-b border-white/30 py-4 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors uppercase tracking-widest text-sm"
                            />
                            <input
                                type="text"
                                placeholder="YOUR NAME"
                                className="bg-transparent border-b border-white/30 py-4 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors uppercase tracking-widest text-sm"
                            />
                            <button className="w-fit mt-4 bg-[#E3E3DC] text-[var(--color-primary)] px-8 py-3 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
                                Subscribe
                            </button>
                        </form>

                        <div className="flex gap-6 mb-8 text-[#E3E3DC]">
                            <Link href="#" className="hover:text-white transition-colors" aria-label="Twitter"><Twitter size={24} /></Link>
                            <Link href="#" className="hover:text-white transition-colors" aria-label="Instagram"><Instagram size={24} /></Link>
                            <Link href="#" className="hover:text-white transition-colors" aria-label="Linkedin"><Linkedin size={24} /></Link>
                        </div>

                        <p className="text-xs text-white/70 uppercase tracking-widest">
                            © WeReact LLC 2025 All rights reserved
                        </p>
                    </div>

                    {/* Right Column: Navigation */}
                    <div className="flex flex-col items-start md:items-end gap-2 md:gap-4 md:text-right">
                        {[
                            { name: 'HOME', href: `/${locale}` },
                            { name: 'ABOUT', href: `/${locale}/about` },
                            { name: 'SERVICES', href: `/${locale}/services` },
                            { name: 'WORK', href: `/${locale}/work` },
                            { name: 'BLOG', href: `/${locale}/blog` },
                            { name: 'CONTACT US', href: `/${locale}/contact` }
                        ].map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="text-4xl md:text-6xl font-bold text-[#E3E3DC] hover:text-white transition-colors uppercase tracking-tight"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </footer>
    );
}
