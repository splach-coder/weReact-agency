import { Variants } from 'framer-motion';

export const smoothEasing = [0.22, 1, 0.36, 1] as const;
export const springEasing = { type: 'spring', stiffness: 60, damping: 15 } as const;

/* CONTAINER ANIMATIONS */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainerVariants = (delay = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: delay,
      delayChildren: 0.1,
    },
  },
});

/* FADE ANIMATIONS */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: smoothEasing },
  },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: smoothEasing },
  },
};

export const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: smoothEasing },
  },
};

export const fadeInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: smoothEasing },
  },
};

/* SCALE ANIMATIONS */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: smoothEasing },
  },
};

export const scalePopVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...springEasing, duration: 0.4 },
  },
};

/* STAGGER ANIMATION HELPERS */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: smoothEasing },
  },
};

export const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: smoothEasing },
  },
};

/* SCROLL TRIGGER ANIMATIONS */
export const scrollRevealVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: smoothEasing },
  },
};

/* HOVER ANIMATIONS */
export const hoverLiftVariants: Variants = {
  initial: { y: 0 },
  hover: { y: -4 },
};

export const hoverScaleVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
};

export const hoverGlowVariants: Variants = {
  initial: { boxShadow: '0 0 0 rgba(58, 90, 64, 0.1)' },
  hover: { boxShadow: '0 0 20px rgba(58, 90, 64, 0.15)' },
};

/* BORDER ANIMATIONS */
export const borderAnimationVariants: Variants = {
  initial: { scaleX: 0 },
  hover: { scaleX: 1 },
};

/* LOADING & SKELETON ANIMATIONS */
export const pulseVariants: Variants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: { duration: 2, repeat: Infinity },
  },
};

export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 2, repeat: Infinity },
  },
};

/* REVEAL ANIMATIONS FOR TEXT/IMAGES */
export const revealVariants: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)' },
  visible: {
    clipPath: 'inset(0 0 0 0)',
    transition: { duration: 0.6, ease: smoothEasing },
  },
};

/* NUMBER COUNTER ANIMATIONS */
export const numberRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...springEasing, duration: 0.5 },
  },
};

/* SLIDE ANIMATIONS */
export const slideInFromLeftVariants: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: smoothEasing },
  },
};

export const slideInFromRightVariants: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: smoothEasing },
  },
};

/* ROTATE ANIMATIONS */
export const rotateInVariants: Variants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: smoothEasing },
  },
};

/* PARALLAX CONFIGURATION */
export const parallaxVariants = (offset = -50): Variants => ({
  visible: {
    y: offset,
    transition: { duration: 0.6 },
  },
});

/* ANIMATION PRESETS FOR COMMON PATTERNS */
export const heroTitleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.15,
      duration: 0.7,
      ease: smoothEasing,
    },
  }),
};

export const featureCardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.12,
      duration: 0.6,
      ease: smoothEasing,
    },
  }),
};

export const ctaButtonVariants: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const arrowAnimationVariants: Variants = {
  initial: { x: 0 },
  hover: { x: 4 },
};
