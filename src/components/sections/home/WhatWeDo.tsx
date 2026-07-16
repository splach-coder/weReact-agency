'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import Link from '@/components/transition/TransitionLink';
import { smoothEasing } from '@/lib/animations';

type ServiceItem = { title: string; text: string };

type SceneMeta = {
  image: string;
  alt: string;
  signal: string;
};

type SceneTiming = {
  start: number;
  reveal: number;
  finish: number;
  nextStart: number;
  nextCovered: number;
};

const SCENES: SceneMeta[] = [
  {
    image: '/images/services/business-websites-hd.png',
    alt: 'HD production website scene for a Moroccan business brand',
    signal: 'TRUST',
  },
  {
    image: '/images/services/landing-pages-hd.png',
    alt: 'HD production landing page campaign scene',
    signal: 'CONVERT',
  },
  {
    image: '/images/services/seo-foundations-hd.png',
    alt: 'HD production SEO and analytics scene',
    signal: 'DISCOVER',
  },
  {
    image: '/images/services/commerce-flows-hd.png',
    alt: 'HD production e-commerce storefront scene',
    signal: 'SELL',
  },
  {
    image: '/images/services/booking-systems-hd.png',
    alt: 'HD production booking and reservation flow scene',
    signal: 'BOOK',
  },
  {
    image: '/images/services/care-maintenance-hd.png',
    alt: 'HD production website care and maintenance scene',
    signal: 'CARE',
  },
];

const smooth = { duration: 0.8, ease: smoothEasing };
const IMAGE_REVEAL_START = 0.05;
const IMAGE_REVEAL_END = 0.32;
const SERVICE_START = 0.36;
const SERVICE_END = 0.98;

function getSceneTiming(index: number, count: number): SceneTiming {
  const slice = 1 / count;
  const start = index * slice;
  const reveal = Math.min(1, start + slice * 0.2);
  const finish = Math.min(1, start + slice * 0.42);
  const nextStart = Math.min(1, (index + 1) * slice);
  const nextCovered = Math.min(1, nextStart + slice * 0.66);

  return { start, reveal, finish, nextStart, nextCovered };
}

function ServiceImageLayer({
  index,
  count,
  scene,
  progress,
  reduceMotion,
}: {
  index: number;
  count: number;
  scene: SceneMeta;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const timing = getSceneTiming(index, count);
  const isFirst = index === 0;
  const isLast = index === count - 1;
  const opacity = useTransform(
    progress,
    isLast ? [timing.start, timing.reveal] : [timing.start, timing.reveal, timing.nextStart, timing.nextCovered],
    isLast ? [isFirst ? 1 : 0, 1] : [isFirst ? 1 : 0, 1, 1, 0],
  );
  const clipPath = useTransform(
    progress,
    [timing.start, timing.reveal, timing.finish],
    isFirst
      ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)']
      : ['inset(100% 0% 0% 0%)', 'inset(54% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  );
  const scale = useTransform(progress, [timing.start, timing.finish], [isFirst ? 1.02 : 1.07, 1]);
  const y = useTransform(progress, [timing.start, timing.finish], [isFirst ? 0 : 112, 0]);
  const rotate = useTransform(progress, [timing.start, timing.finish], [isFirst ? 0 : 0.28, 0]);

  return (
    <motion.div
      data-depth="3"
      aria-hidden={index !== 0}
      style={reduceMotion ? undefined : { opacity, clipPath, scale, y, rotate }}
      className="absolute inset-0 origin-bottom will-change-[clip-path,transform,opacity]"
    >
      <Image
        src={scene.image}
        alt={scene.alt}
        fill
        sizes="100vw"
        priority={index < 2}
        className="object-cover"
      />
    </motion.div>
  );
}

function IntroCopy({ t }: { t: ReturnType<typeof useTranslations<'Home.services'>> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={smooth}
      className="max-w-5xl"
    >
      <p className="text-mono mb-5 flex items-center gap-3 text-[var(--color-primary)]">
        <span className="text-2xl font-black leading-none text-[var(--color-accent-sage)]">01</span>
        <span className="h-1.5 w-1.5 bg-[var(--color-accent-sage)] shadow-[0_0_18px_rgba(181,192,158,0.75)]" />
        {t('eyebrow')}
      </p>
      <h2 className="font-display text-[clamp(2.6rem,6vw,6.6rem)] leading-[0.92] text-[var(--color-text-main)]">
        {t('title')}
      </h2>
      <p className="mt-6 max-w-sm text-base font-light leading-relaxed text-[var(--color-text-secondary)] md:text-lg">
        {t('subtitle')}
      </p>
    </motion.div>
  );
}

function useMobileLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    let frame = window.requestAnimationFrame(() => setIsMobile(media.matches));

    const update = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => setIsMobile(media.matches));
    };

    media.addEventListener('change', update);
    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener('change', update);
    };
  }, []);

  return isMobile;
}

function MobileWhatWeDo({
  t,
  items,
  scenes,
  reduceMotion,
}: {
  t: ReturnType<typeof useTranslations<'Home.services'>>;
  items: ServiceItem[];
  scenes: SceneMeta[];
  reduceMotion: boolean;
}) {
  return (
    <section
      id="services"
      data-scene="services"
      className="relative overflow-hidden bg-[var(--color-background-main)] py-20 text-[var(--color-text-main)] md:hidden"
    >
      <motion.div
        data-depth="4"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={smooth}
        className="px-6"
      >
        <p className="text-mono mb-5 flex items-center gap-3 text-[var(--color-primary)]">
          <span className="text-xl font-black leading-none text-[var(--color-accent-sage)]">01</span>
          <span className="h-1.5 w-1.5 bg-[var(--color-accent-sage)]" />
          {t('eyebrow')}
        </p>
        <h2 className="max-w-[11ch] font-display text-4xl leading-[0.96] text-[var(--color-text-main)]">
          {t('title')}
        </h2>
        <p className="mt-5 max-w-[32rem] text-base leading-relaxed text-[var(--color-text-secondary)]">
          {t('subtitle')}
        </p>
      </motion.div>

      <div className="mt-14 space-y-14">
        {items.slice(0, scenes.length).map((item, index) => {
          const scene = scenes[index] ?? SCENES[0];

          return (
            <motion.article
              key={item.title}
              data-depth="4"
              initial={reduceMotion ? false : { opacity: 0, y: 26 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: smoothEasing }}
              className={`pb-10 ${index < Math.min(items.length, scenes.length) - 1 ? 'border-b border-[rgba(58,90,64,0.16)]' : ''}`}
            >
              <div data-depth="3" className="relative aspect-video overflow-hidden">
                <Image
                  src={scene.image}
                  alt={scene.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div
                  data-depth="1"
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,32,22,0.02)_14%,rgba(18,32,22,0.76)_100%)]"
                />
                <div data-depth="4" className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="mb-3 flex items-center gap-3 text-mono text-white/78">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <span className="h-1.5 w-1.5 bg-[var(--color-accent-sage)]" />
                    <span>{scene.signal}</span>
                  </div>
                  <h3 className="max-w-[12ch] font-display text-3xl leading-[0.92]">{item.title}</h3>
                </div>
              </div>
              <p className="px-6 pt-5 text-base leading-relaxed text-[var(--color-text-secondary)]">{item.text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
function ServiceCopyLayer({
  item,
  scene,
  index,
  count,
  progress,
  reduceMotion,
}: {
  item: ServiceItem;
  scene: SceneMeta;
  index: number;
  count: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const timing = getSceneTiming(index, count);
  const isFirst = index === 0;
  const isLast = index === count - 1;
  const slice = 1 / count;
  const textIn = Math.min(1, isFirst ? timing.start + slice * 0.02 : timing.finish + slice * 0.08);
  const textSettled = Math.min(1, isFirst ? timing.start + slice * 0.28 : timing.finish + slice * 0.34);
  const textExitStart = Math.min(1, timing.nextStart + slice * 0.16);
  const textExitEnd = Math.min(1, timing.nextStart + slice * 0.46);
  const opacity = useTransform(
    progress,
    isLast ? [timing.start, textIn, textSettled] : [timing.start, textIn, textSettled, textExitStart, textExitEnd],
    isLast ? [isFirst ? 1 : 0, isFirst ? 1 : 0, 1] : [isFirst ? 1 : 0, isFirst ? 1 : 0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    isLast ? [timing.start, textIn, textSettled] : [timing.start, textIn, textSettled, textExitEnd],
    isLast ? [isFirst ? 0 : 46, isFirst ? 0 : 46, 0] : [isFirst ? 0 : 46, isFirst ? 0 : 46, 0, -16],
  );
  const scale = useTransform(progress, [timing.start, textIn, textSettled], [isFirst ? 1 : 0.98, isFirst ? 1 : 0.98, 1]);
  const words = item.title.split(' ');

  return (
    <motion.div
      data-depth="4"
      aria-hidden={index !== 0}
      style={reduceMotion ? undefined : { opacity, y, scale }}
      className="absolute inset-x-0 top-0 max-w-[32rem] text-white drop-shadow-[0_14px_44px_rgba(0,0,0,0.36)] will-change-[transform,opacity]"
    >
      <div className="mb-5 flex flex-wrap items-center gap-3 text-mono text-white/82">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span className="h-1.5 w-1.5 bg-[var(--color-accent-sage)] shadow-[0_0_18px_rgba(181,192,158,0.75)]" />
        <span>{scene.signal}</span>
      </div>
      <h3 className="font-display text-[clamp(2rem,4vw,5.1rem)] leading-[0.9] text-white">
        {words.map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            <span className="mr-[0.18em] inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span className="inline-block">{word}</span>
            </span>
            {wordIndex < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </h3>
      <p className="mt-6 max-w-md text-base font-light leading-relaxed text-white/84 md:text-lg">
        {item.text}
      </p>
      <motion.div
        style={reduceMotion ? undefined : { scaleX: opacity }}
        className="mt-8 h-px w-40 origin-left bg-white/70"
      />
    </motion.div>
  );
}

function ServiceLinksRow({ locale }: { locale: string }) {
  const links = locale === 'fr'
    ? [
        { name: 'Agence web à Marrakech', href: '/agence-web-marrakech' },
        { name: 'Création de site web', href: '/web-design-marrakech' },
        { name: 'Sites tourisme au Maroc', href: '/tourism-websites-morocco' },
        { name: 'Landing pages SEO', href: '/seo-landing-pages' },
      ]
    : [
        { name: 'Web agency in Marrakech', href: '/agence-web-marrakech' },
        { name: 'Website design', href: '/web-design-marrakech' },
        { name: 'Tourism websites', href: '/tourism-websites-morocco' },
        { name: 'SEO landing pages', href: '/seo-landing-pages' },
      ];

  return (
    <div className="relative border-t border-[rgba(58,90,64,0.16)] bg-[var(--color-background-main)] px-6 py-10 md:px-12 md:py-12">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-10 gap-y-4">
        <p className="text-mono text-[var(--color-text-secondary)]">
          {locale === 'fr' ? 'Nos services' : 'Our services'}
        </p>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-[var(--color-text-main)] underline decoration-[var(--color-accent-sage)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--color-primary)]"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function WhatWeDo() {
  const t = useTranslations('Home.services');
  const locale = useLocale();
  const items = t.raw('items') as ServiceItem[];
  const sectionRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const isMobile = useMobileLayout();
  const sceneCount = Math.min(items.length, SCENES.length);
  const scenes = SCENES.slice(0, sceneCount);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const introOpacity = useTransform(scrollYProgress, [0.02, 0.2, 0.34], [1, 1, 0]);
  const introY = useTransform(scrollYProgress, [0.14, 0.34], [0, -72]);
  const introScale = useTransform(scrollYProgress, [0.14, 0.34], [1, 0.96]);
  const introBlur = useTransform(scrollYProgress, [0.22, 0.34], ['blur(0px)', 'blur(8px)']);
  const imageScale = useTransform(scrollYProgress, [IMAGE_REVEAL_START, IMAGE_REVEAL_END], [0.001, 1]);
  const imageOpacity = useTransform(scrollYProgress, [IMAGE_REVEAL_START - 0.005, IMAGE_REVEAL_START + 0.01], [0, 1]);
  const sceneProgress = useTransform(scrollYProgress, [SERVICE_START, SERVICE_END], [0, 1]);
  const serviceOpacity = useTransform(scrollYProgress, [SERVICE_START - 0.025, SERVICE_START + 0.045], [0, 1]);
  const serviceY = useTransform(scrollYProgress, [SERVICE_START - 0.025, SERVICE_START + 0.045], [28, 0]);

  if (isMobile) {
    return (
      <>
        <MobileWhatWeDo t={t} items={items} scenes={scenes} reduceMotion={reduceMotion} />
        <ServiceLinksRow locale={locale} />
      </>
    );
  }

  return (
    <>
      <section
        id="services"
        ref={sectionRef}
        data-scene="services"
        className="relative isolate overflow-x-clip bg-[var(--color-background-main)] text-[var(--color-text-main)]"
        style={{ minHeight: reduceMotion ? undefined : `${sceneCount * 200 + 260}vh` }}
      >
        <div className={reduceMotion ? 'px-5 py-20 md:px-12 md:py-28' : 'sticky top-0 min-h-screen overflow-hidden'}>
          <div className="relative min-h-screen">
            <motion.div
              data-depth="4"
              style={reduceMotion ? undefined : { opacity: introOpacity, y: introY, scale: introScale, filter: introBlur }}
              className="absolute inset-0 z-10 mx-auto flex w-full max-w-7xl items-center px-5 py-10 md:px-12 md:py-12"
            >
              <IntroCopy t={t} />
            </motion.div>

            <motion.div
              data-depth="3"
              aria-hidden="true"
              style={reduceMotion ? undefined : { scale: imageScale, opacity: imageOpacity }}
              className="absolute inset-0 z-20 origin-center overflow-hidden will-change-[transform,opacity]"
            >
              {scenes.map((scene, index) => (
                <ServiceImageLayer
                  key={scene.image}
                  index={index}
                  count={Math.max(1, sceneCount)}
                  scene={scene}
                  progress={sceneProgress}
                  reduceMotion={reduceMotion}
                />
              ))}
              <div
                data-depth="1"
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,22,15,0.82)_0%,rgba(12,22,15,0.58)_34%,rgba(12,22,15,0.2)_62%,rgba(12,22,15,0)_100%)] md:bg-[linear-gradient(90deg,rgba(12,22,15,0.8)_0%,rgba(12,22,15,0.52)_30%,rgba(12,22,15,0.14)_58%,rgba(12,22,15,0)_100%)]"
              />
              <div
                data-depth="1"
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,22,15,0.22)_0%,rgba(12,22,15,0)_35%,rgba(12,22,15,0.34)_100%)]"
              />
            </motion.div>

            <motion.div
              data-depth="4"
              style={reduceMotion ? undefined : { opacity: serviceOpacity, y: serviceY }}
              className="relative z-30 mx-auto flex min-h-screen w-full max-w-7xl items-center px-5 py-10 md:px-12 md:py-12"
            >
              <div className="relative min-h-[26rem] w-full max-w-[38rem] md:min-h-[28rem]">
                {items.slice(0, sceneCount).map((item, index) => (
                  <ServiceCopyLayer
                    key={item.title}
                    item={item}
                    scene={scenes[index] ?? SCENES[0]}
                    index={index}
                    count={Math.max(1, sceneCount)}
                    progress={sceneProgress}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <ServiceLinksRow locale={locale} />
    </>
  );
}