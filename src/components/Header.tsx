'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import Link from '@/components/transition/TransitionLink';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SITE_MENU_STATE_EVENT } from '@/lib/events';
import { acquireScrollLock, releaseScrollLock } from '@/lib/site-overlay';
import { siteConfig } from '@/config/site';
import { trackContactIntent } from '@/lib/analytics';

/**
 * SOTD (exo-ape) style navigation, ported to weReact.
 *
 * A minimal fixed top bar — wordmark left, Menu/Close right, mix-blend-difference
 * so it stays legible over both the dark hero and the light inner pages — that
 * It opens a full-screen split overlay: hover-swapping creative brand imagery on the left,
 * oversized word-reveal links on the right. Open/close + the staggered word
 * reveal are driven by GSAP (ported from SOTD `hambMenu()`); links route through
 * TransitionLink so the page-transition curtain plays. Honors reduced motion.
 */
export default function Header() {
  const t = useTranslations('Nav');
  const [open, setOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  // The overlay is always in the DOM (hidden at scaleY(0)), so its imagery
  // would otherwise download on every route. Mount the images only once the
  // menu first opens — the reveal block covers them for ~1.1s, plenty of time
  // to fetch — and keep them mounted afterwards for hover-swaps and re-opens.
  const [imagesMounted, setImagesMounted] = useState(false);
  // Render-phase derivation (not an effect): once the menu opens, keep the
  // imagery mounted for hover-swaps, re-opens, and the close animation.
  if (open && !imagesMounted) setImagesMounted(true);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [headerBlurred, setHeaderBlurred] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const links = [
    { label: t('home'), href: '/', img: '/images/menu/menu-home.webp' },
    { label: t('work'), href: '/work', img: '/images/menu/menu-work.webp' },
    { label: t('blog'), href: '/blog', img: '/images/menu/menu-blog.webp' },
    { label: t('contact'), href: '/contact', img: '/images/menu/menu-contact.webp' },
  ];

  const socials = [
    { label: 'Instagram', href: siteConfig.business.sameAs[0] },
    { label: 'Facebook', href: siteConfig.business.facebook },
  ];

  // Open / close choreography.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = overlay.querySelectorAll<HTMLElement>('.menu-word');
    const fades = overlay.querySelectorAll<HTMLElement>('.menu-fade');

    const ctx = gsap.context(() => {
      if (open) {
        acquireScrollLock('site-menu');
        if (reduce) {
          gsap.set(overlay, { scaleY: 1, pointerEvents: 'auto' });
          gsap.set(words, { yPercent: 0, y: 0, opacity: 1 });
          gsap.set(fades, { y: 0, opacity: 1 });
          return;
        }
        // fromTo with explicit start values — animating *from* a CSS scaleY(0)
        // (a degenerate matrix) makes a plain .to() snap instead of tween.
        gsap
          .timeline()
          .set(overlay, { pointerEvents: 'auto' })
          .fromTo(overlay, { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'expo.inOut' })
          .fromTo(
            words,
            { yPercent: 110, y: 0, opacity: 0 },
            { yPercent: 0, y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'expo.out' },
            '-=0.35'
          )
          .fromTo(
            fades,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power2.out' },
            '-=0.5'
          );
      } else {
        releaseScrollLock('site-menu');
        if (reduce) {
          gsap.set(overlay, { scaleY: 0, pointerEvents: 'none' });
          return;
        }
        gsap
          .timeline()
          .to(words, { yPercent: 110, y: 0, opacity: 0, duration: 0.4, stagger: { each: 0.04, from: 'end' }, ease: 'expo.in' })
          .to(fades, { opacity: 0, duration: 0.3 }, '<')
          .to(overlay, { scaleY: 0, duration: 0.6, ease: 'expo.inOut' }, '-=0.1')
          .set(overlay, { pointerEvents: 'none' });
      }
    }, overlay);

    return () => ctx.revert();
  }, [open]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(SITE_MENU_STATE_EVENT, { detail: { open } }));
  }, [open]);

  // Release the shared page lock if the header unmounts while open.
  useEffect(() => () => releaseScrollLock('site-menu'), []);

  // Keep navigation out of the way while reading, then reveal it as soon as
  // the visitor reverses direction. Only transform and backdrop are animated.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastY = window.scrollY;
    let frame = 0;

    const updateHeader = () => {
      frame = 0;
      const nextY = Math.max(window.scrollY, 0);
      const delta = nextY - lastY;

      setHeaderBlurred(nextY > 16);

      if (reduce || open || nextY <= 8) {
        setHeaderVisible(true);
      } else if (Math.abs(delta) >= 6) {
        setHeaderVisible(delta < 0);
      }

      lastY = nextY;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateHeader);
    };

    frame = window.requestAnimationFrame(updateHeader);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [open]);

  return (
    <>
      {/* Fixed top bar */}
      <header
        id="site-header"
        className={[
          'pointer-events-none fixed inset-x-0 top-0 z-[105] transition-[transform,background-color,backdrop-filter,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          open || headerVisible ? 'translate-y-0' : '-translate-y-full',
          headerBlurred && !open
            ? 'border-b border-white/35 bg-[rgba(163,177,138,0.18)] shadow-[0_1px_0_rgba(255,255,255,0.38),0_14px_32px_rgba(46,72,51,0.08)] backdrop-blur-xl backdrop-saturate-150'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-[95%] items-center justify-between py-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={`pointer-events-auto text-2xl font-black tracking-tight transition-opacity hover:opacity-70 ${open ? 'text-white' : 'text-[var(--color-primary)]'}`}
          >
            &middot;wereact&middot;
          </Link>
          <div className="pointer-events-auto flex items-center gap-5">
            <LanguageSwitcher
              variant="bar"
              className={open ? 'text-white' : 'text-[var(--color-primary)]'}
            />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`text-mono cursor-pointer text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-70 ${open ? 'text-white' : 'text-[var(--color-primary)]'}`}
            >
              {open ? t('close') : t('menu')}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen split overlay */}
      <div
        id="site-menu"
        ref={overlayRef}
        aria-hidden={!open}
        inert={!open}
        className="nav-panel-init pointer-events-none fixed inset-0 z-[100] origin-top overflow-hidden bg-[var(--color-primary-dark)]"
      >
        <div className="mx-auto flex h-full max-w-[1500px] flex-col items-center md:flex-row">
          {/* Left: hover-swapping creative menu imagery (desktop) */}
          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="relative h-[70vh] w-[30vw] overflow-hidden rounded-[2px]">
              {imagesMounted && links.map((l, i) => (
                <figure key={l.href} className="absolute inset-0">
                  <Image
                    src={l.img}
                    alt=""
                    fill
                    sizes="30vw"
                    className="object-cover"
                    style={{
                      transition: 'transform 0.8s ease, opacity 0.6s ease, filter 0.55s ease',
                      transformOrigin: 'center',
                      opacity: activeImg === i ? 1 : 0,
                      transform: activeImg === i ? 'rotate(0deg) scale(1)' : 'rotate(-20deg) scale(1.5)',
                      filter: activeImg === i ? 'grayscale(0) blur(0px)' : 'grayscale(1) blur(4px)',
                    }}
                  />
                </figure>
              ))}
              {/* Reveal block — wipes up to uncover the imagery when the menu opens. */}
              <div
                aria-hidden
                className="absolute inset-0 z-[5] origin-bottom bg-[var(--color-primary-dark)]"
                style={{
                  transform: open ? 'scaleY(0)' : 'scaleY(1)',
                  transition: 'transform 0.7s cubic-bezier(0.76,0,0.24,1) 0.4s',
                }}
              />
            </div>
          </div>

          {/* Right: links + meta */}
          <div className="flex flex-1 flex-col items-start justify-center gap-2 px-8 md:px-[6vw]">
            <ul className="w-full">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden py-1">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActiveImg(i)}
                    className="menu-word nav-word-init block font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white transition-colors hover:text-[var(--color-accent-sage)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Socials */}
            <ul className="menu-fade nav-fade-init mt-10 flex gap-8">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-mono text-sm uppercase tracking-widest text-white/70 transition-colors hover:text-white"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Language */}
            <div
              className="menu-fade nav-fade-init mt-10"
              onClick={() => setOpen(false)}
            >
              <LanguageSwitcher variant="menu" />
            </div>

            {/* Bottom row */}
            <div className="menu-fade nav-fade-init mt-8 flex flex-col gap-2">
              <a
                href={`mailto:${siteConfig.business.email}`}
                onClick={() => trackContactIntent('menu_email', { method: 'email', page: 'menu', location: 'menu_email' })}
                className="text-lg text-white/80 transition-colors hover:text-white"
              >
                {siteConfig.business.email}
              </a>
              <span className="text-mono text-xs uppercase tracking-widest text-[var(--color-accent-sage)]">
                {t('menuTagline')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
