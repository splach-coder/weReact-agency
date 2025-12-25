'use client';

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Button from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import StaggeredMenu from './StaggeredMenu';
import CardNav, { CardNavItem } from './CardNav';
import { useState, useEffect } from 'react';

export default function Header() {
    const locale = useLocale();
    const pathname = usePathname();
    const [showCardNav, setShowCardNav] = useState(false);

    // Check if we're on a page with green hero (Contact, About, Services, Work listing)
    // Exclude individual case study pages (/work/[id])
    const isGreenHeroPage = pathname?.includes('/contact') ||
        pathname?.includes('/about') ||
        pathname?.includes('/services') ||
        (pathname?.includes('/work') && !pathname?.match(/\/work\/[^/]+$/));

    useEffect(() => {
        const handleScroll = () => {
            setShowCardNav(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { label: 'About', href: `/${locale}/about` },
        { label: 'Services', href: `/${locale}/services` },
        { label: 'Work', href: `/${locale}/work` },
    ];

    const cardNavItems: CardNavItem[] = [
        {
            label: 'Company',
            bgColor: '#3A5A40',
            textColor: '#ffffff',
            links: [
                { label: 'About', href: `/${locale}/about`, ariaLabel: 'About Us' },
                { label: 'Contact', href: `/${locale}/contact`, ariaLabel: 'Contact' }
            ]
        },
        {
            label: 'Services',
            bgColor: '#E3E3DC',
            textColor: '#1A1A1A',
            links: [
                { label: 'Development', href: `/${locale}/services`, ariaLabel: 'Development Services' },
                { label: 'Design', href: `/${locale}/services`, ariaLabel: 'Design Services' }
            ]
        },
        {
            label: 'Work',
            bgColor: '#1A1A1A',
            textColor: '#ffffff',
            links: [
                { label: 'Projects', href: `/${locale}/work`, ariaLabel: 'Recent Projects' },
                { label: 'Case Studies', href: `/${locale}/work`, ariaLabel: 'Case Studies' }
            ]
        }
    ];

    return (
        <>
            <AnimatePresence>
                {!showCardNav && (
                    <motion.header
                        key="default-header"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="absolute top-0 left-0 w-full z-50 pt-3 px-6 block"
                    >
                        <div className="hidden md:grid max-w-[1300px] mx-auto grid-cols-3 items-center">
                            {/* Left: Navigation */}
                            <nav className="flex items-center gap-12 justify-start">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        className={`font-semibold text-xs tracking-widest uppercase transition-colors ${isGreenHeroPage
                                            ? 'text-white hover:text-white/70'
                                            : 'text-[var(--color-text-main)] hover:text-[var(--color-primary)]'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            {/* Center: Logo */}
                            <div className="flex justify-center">
                                <Link
                                    href={`/${locale}`}
                                    className={`text-3xl font-black tracking-tighter mt-8 ${isGreenHeroPage ? 'text-white' : 'text-[var(--color-primary)]'
                                        }`}
                                >
                                    -WeReact-
                                </Link>
                            </div>

                            {/* Right: CTA (Desktop) */}
                            <div className="flex justify-end hidden md:flex">
                                <Link href={`/${locale}/contact`}>
                                    <Button
                                        variant="primary"
                                        className={`px-8 py-3 text-xs font-bold uppercase tracking-widest rounded-none shadow-none ${isGreenHeroPage ? '!bg-[var(--color-background-main)] !text-[var(--color-primary)] hover:!bg-[var(--color-background-main)]/90' : ''
                                            }`}
                                    >
                                        Let’s talk
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Header Layout */}
                        <div className="md:hidden w-full flex justify-between items-center h-full mt-2">
                            {/* Left: Logo */}
                            <Link href={`/${locale}`} className={`text-2xl font-black tracking-tighter z-50 relative pointer-events-auto leading-none flex items-center ${isGreenHeroPage ? 'text-white' : 'text-[var(--color-primary)]'
                                }`}>
                                -WeReact-
                            </Link>

                            {/* Right: Menu */}
                            <div className="relative h-10 w-10 flex items-center justify-center mr-2">
                                <StaggeredMenu
                                    items={[
                                        { label: 'Home', ariaLabel: 'Home', link: `/${locale}/` },
                                        { label: 'About', ariaLabel: 'About Us', link: `/${locale}/about` },
                                        { label: 'Services', ariaLabel: 'Our Services', link: `/${locale}/services` },
                                        { label: 'Work', ariaLabel: 'Our Work', link: `/${locale}/work` },
                                        { label: 'Contact', ariaLabel: 'Contact Us', link: `/${locale}/contact` }
                                    ]}
                                    socialItems={[
                                        { label: 'Instagram', link: 'https://www.instagram.com/wereact.agency' },
                                        { label: 'Twitter', link: 'https://twitter.com/wereact' }
                                    ]}
                                    className="mobile-menu-override"
                                    staticPosition={true}
                                    menuButtonColor={isGreenHeroPage ? '#ffffff' : '#3A5A40'}
                                />
                            </div>
                        </div>
                    </motion.header>
                )}
            </AnimatePresence>

            {/* Scroll Reveal Card Nav */}
            <AnimatePresence>
                {showCardNav && (
                    <motion.div
                        key="card-nav-wrapper"
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="fixed top-0 left-0 w-full z-[100] flex justify-center pointer-events-none"
                    >
                        <div className="pointer-events-auto w-full flex justify-center">
                            <CardNav
                                logo=""
                                items={cardNavItems}
                                baseColor="#ffffff"
                                menuColor="#1A1A1A"
                                buttonBgColor="#3A5A40"
                                buttonTextColor="#ffffff"
                                className="!relative !top-4 !left-auto !translate-x-0"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
