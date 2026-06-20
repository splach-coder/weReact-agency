'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Mail, Twitter, MessageCircle } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';

export default function Footer() {
    const locale = useLocale();
    const t = useTranslations('Footer');
    const tNav = useTranslations('Nav');
    const currentYear = new Date().getFullYear();
    const socialLinks = [
        { label: 'Facebook', href: siteConfig.business.facebook, icon: Facebook },
        { label: 'Instagram', href: siteConfig.business.sameAs[0], icon: Instagram },
        { label: 'Twitter', href: siteConfig.business.sameAs[1], icon: Twitter },
        { label: 'WhatsApp', href: siteConfig.business.whatsapp, icon: MessageCircle },
        { label: 'Email', href: `mailto:${siteConfig.business.email}`, icon: Mail },
    ];

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
                        <h2 className="text-2xl md:text-3xl font-bold uppercase leading-tight mb-4 tracking-wide text-white">
                            {t('newsletterTitle')}
                        </h2>
                        <p className="text-white/70 mb-10">{t('newsletterText')}</p>

                        <form className="flex flex-col gap-6 mb-12 w-full md:max-w-md">
                            <label htmlFor="footer-email" className="sr-only">{t('emailPlaceholder')}</label>
                            <input
                                id="footer-email"
                                type="email"
                                placeholder={t('emailPlaceholder')}
                                className="bg-transparent border-b border-white/30 py-4 text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors uppercase tracking-widest text-sm"
                            />
                            <button className="w-fit mt-4 bg-[#E3E3DC] text-[var(--color-primary)] px-8 py-3 font-bold uppercase text-sm tracking-widest hover:bg-white transition-colors">
                                {t('subscribe')}
                            </button>
                        </form>

                        <div className="flex gap-6 mb-8 text-[#E3E3DC]">
                            {socialLinks.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="hover:text-white transition-colors"
                                    aria-label={label}
                                    target={href.startsWith('http') ? '_blank' : undefined}
                                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                >
                                    <Icon size={24} />
                                </Link>
                            ))}
                        </div>

                        <p className="text-xs text-white/70 uppercase tracking-widest">
                            &copy; WeReact {currentYear} — {t('copyright')}
                        </p>
                    </div>

                    {/* Right Column: Navigation */}
                    <div className="flex flex-col items-start md:items-end gap-2 md:gap-4 md:text-right">
                        {[
                            { name: tNav('home'), href: `/${locale}` },
                            { name: tNav('about'), href: `/${locale}/about` },
                            { name: tNav('services'), href: `/${locale}/services` },
                            { name: tNav('work'), href: `/${locale}/work` },
                            { name: tNav('blog'), href: `/${locale}/blog` },
                            { name: tNav('contact'), href: `/${locale}/contact` }
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
