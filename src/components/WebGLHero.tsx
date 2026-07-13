'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import Link from '@/components/transition/TransitionLink';
import { smoothEasing } from '@/lib/animations';
import { RevealLine } from '@/components/ui/RevealText';
import { trackContactIntent } from '@/lib/analytics';

type Peep = {
  image: HTMLImageElement;
  rect: number[];
  width: number;
  height: number;
  x: number;
  y: number;
  anchorY: number;
  scaleX: number;
  walk: gsap.core.Timeline | null;
  setRect: (rect: number[]) => void;
  render: (ctx: CanvasRenderingContext2D) => void;
};

type WalkProps = {
  startX: number;
  startY: number;
  endX: number;
};

type CrowdCanvasProps = {
  src: string;
  rows?: number;
  cols?: number;
  reduceMotion?: boolean;
};

function CrowdCanvas({ src, rows = 15, cols = 7, reduceMotion = false }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const randomRange = (min: number, max: number) => min + Math.random() * (max - min);
    const randomIndex = <T,>(array: T[]) => randomRange(0, array.length) | 0;
    const removeFromArray = <T,>(array: T[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = <T,>(array: T[], item: T) => removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = <T,>(array: T[]) => removeFromArray(array, randomIndex(array));
    const getRandomFromArray = <T,>(array: T[]) => array[randomIndex(array) | 0];

    const stage = { width: 0, height: 0 };
    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];
    const img = document.createElement('img');
    let destroyed = false;
    let isReady = false;
    let pixelRatio = 1;
    let peepScale = 1;

    const resetPeep = ({ peep }: { peep: Peep }): WalkProps => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const isPhone = stage.width < 640;
      const offsetY = (isPhone ? 72 : 100) - (isPhone ? 145 : 235) * gsap.parseEase('power2.in')(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return { startX, startY, endX };
    };

    const normalWalk = ({ peep, props }: { peep: Peep; props: WalkProps }) => {
      const { startY, endX } = props;
      const xDuration = randomRange(stage.width < 640 ? 14 : 16, stage.width < 640 ? 22 : 26);
      const yDuration = 0.34;
      const tl = gsap.timeline();

      tl.timeScale(randomRange(0.82, 1.12));
      tl.to(peep, { duration: xDuration, x: endX, ease: 'none' }, 0);
      tl.to(peep, { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: startY - randomRange(4, 8) }, 0);

      return tl;
    };

    const walks = [normalWalk];

    const createPeep = ({ image, rect }: { image: HTMLImageElement; rect: number[] }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (nextRect: number[]) => {
          peep.rect = nextRect;
          peep.width = nextRect[2] ?? 0;
          peep.height = nextRect[3] ?? 0;
        },
        render: (targetCtx: CanvasRenderingContext2D) => {
          targetCtx.save();
          targetCtx.translate(peep.x, peep.y);
          targetCtx.scale(peep.scaleX, 1);
          targetCtx.drawImage(
            peep.image,
            peep.rect[0] ?? 0,
            peep.rect[1] ?? 0,
            peep.rect[2] ?? 0,
            peep.rect[3] ?? 0,
            0,
            0,
            peep.width,
            peep.height,
          );
          targetCtx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    const createPeeps = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i += 1) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [(i % rows) * rectWidth, ((i / rows) | 0) * rectHeight, rectWidth, rectHeight],
          }),
        );
      }
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({ peep }),
      }).eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;
      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const initCrowd = () => {
      const activeCount = Math.min(availablePeeps.length, stage.width < 640 ? 44 : stage.width < 900 ? 62 : 86);

      for (let i = 0; i < activeCount; i += 1) {
        addPeepToCrowd().walk?.progress(reduceMotion ? 0.35 : Math.random());
      }

      if (reduceMotion) {
        crowd.forEach((peep) => peep.walk?.pause());
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(pixelRatio, pixelRatio);
      crowd.forEach((peep) => peep.render(ctx));
      ctx.restore();
    };

    const resize = () => {
      if (!isReady) return;

      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      peepScale = stage.width < 640 ? 0.6 : stage.width < 900 ? 0.78 : 1;
      allPeeps.forEach((peep) => {
        peep.width = (peep.rect[2] ?? 0) * peepScale;
        peep.height = (peep.rect[3] ?? 0) * peepScale;
      });
      canvas.width = stage.width * pixelRatio;
      canvas.height = stage.height * pixelRatio;

      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
      render();
    };

    const init = () => {
      if (destroyed) return;
      createPeeps();
      isReady = true;
      resize();
      if (!reduceMotion) gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = src;

    window.addEventListener('resize', resize);

    return () => {
      destroyed = true;
      window.removeEventListener('resize', resize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => peep.walk?.kill());
      crowd.length = 0;
      availablePeeps.length = 0;
      allPeeps.length = 0;
    };
  }, [cols, reduceMotion, rows, src]);

  return <canvas ref={canvasRef} className="absolute bottom-0 h-[58svh] w-full md:h-[68svh]" aria-hidden="true" />;
}

function HeroCrowd({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative h-full w-full bg-[var(--color-background-main)] text-[var(--color-primary)] [transform:translateZ(0)]">
      <div className="absolute inset-x-0 bottom-0 h-full w-full">
        <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} reduceMotion={reduceMotion} />
      </div>
    </div>
  );
}

export default function WebGLHero() {
  const t = useTranslations('Home.hero');
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-x-clip overflow-y-visible bg-[var(--color-background-main)] text-[var(--color-primary)]">
      <div
        data-depth="0"
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[linear-gradient(180deg,var(--color-background-main)_0%,var(--color-background-contrast)_100%)]"
      />
      <motion.div
        data-depth="3"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, y: 34, scale: 0.985 }}
        animate={{ opacity: 0.9, y: 0, scale: 1 }}
        transition={{ delay: 0.25, duration: 1.35, ease: smoothEasing }}
        className="absolute inset-0 z-[1] overflow-visible [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_100%)]"
      >
        <HeroCrowd reduceMotion={reduceMotion} />
      </motion.div>
      <div
        data-depth="4"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(246,246,242,0.96)_0%,rgba(246,246,242,0.72)_38%,rgba(246,246,242,0.08)_74%,rgba(246,246,242,0)_100%)]"
      />
      <div
        data-depth="5"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_44%,rgba(58,90,64,0.12)_100%)]"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="absolute inset-x-0 top-28 z-20 mx-auto hidden max-w-7xl items-center justify-between px-16 md:flex"
      >
        <span className="text-mono flex items-center gap-2.5 text-[var(--color-primary)]/62">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-sage)]" />
          {t('kicker')}
        </span>
        <span className="text-mono text-[var(--color-primary)]/40">(C) 2026</span>
      </motion.div>

      <div data-depth="4" className="relative z-20 mx-auto flex h-full max-w-[42rem] flex-col items-center justify-start px-6 pt-[20svh] text-center md:pt-[22svh]">
        <h1 className="max-w-[16.5ch] text-balance font-display text-[clamp(2.05rem,4.5vw,4.45rem)] font-black leading-[0.94] text-[var(--color-primary)]">
          <RevealLine delay={0.15}>{t('titleLine1')}</RevealLine>
          <RevealLine delay={0.3} className="tracking-normal">
            {t('titleLine2')} <span className="italic text-[var(--color-accent-clay-dark)]">{t('highlight')}</span>.
          </RevealLine>
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8, ease: smoothEasing }}
          className="mt-7 hidden flex-col items-center gap-6 md:flex"
        >
          <p className="max-w-[34rem] text-base font-light leading-relaxed text-[var(--color-primary)]/68 md:text-lg">
            {t('subtitle')}
          </p>
          <Link
            href="/contact"
            onClick={() => trackContactIntent('hero_primary_cta', { destination: 'contact' })}
            className="btn-base btn-primary group justify-center transition-transform hover:-translate-y-0.5"
          >
            {t('ctaPrimary')}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute inset-x-0 bottom-16 z-20 flex justify-center md:bottom-20"
      >
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-[var(--color-primary)]/55"
        >
          <ArrowDown size={18} />
        </motion.span>
      </motion.div>
    </section>
  );
}