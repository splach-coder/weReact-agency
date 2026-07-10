/**
 * Shared geometry for the Atlas-Green curtain used by both the Preloader and
 * the page-transition overlay — the exo-ape SVG path-morph idiom
 * (`Page.js` show()/hide()), re-expressed for a top-anchored curtain.
 *
 * Every path has an IDENTICAL command structure:
 *     M 0 0  V <edge>  Q 50 <ctrl> 100 <edge>  V 0  Z
 * so GSAP can tween the `d` attribute directly — no premium MorphSVG plugin.
 * Only the leading-edge y (`edge`) and its quadratic control point (`ctrl`)
 * change, which is what produces the liquid curved sweep.
 */

const path = (edge: number, ctrl: number) =>
  `M 0 0 V ${edge} Q 50 ${ctrl} 100 ${edge} V 0 Z`;

export const CURTAIN = {
  /** Off-screen above — zero height. */
  GONE: path(0, 0),
  /** Mid-cover with a leading edge bulging downward (drop-in). */
  COVER_CURVE: path(55, 90),
  /** Full-screen rectangle. */
  FULL: path(100, 100),
  /** Mid-reveal with the trailing edge arcing up and away (lift-out). */
  REVEAL_CURVE: path(45, 10),
};

/** SVG viewBox used by every curtain (non-uniform scale to fill the screen). */
export const CURTAIN_VIEWBOX = '0 0 100 100';
