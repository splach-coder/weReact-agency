/**
 * Shared between the inline boot script (runs before first paint), the
 * Preloader component and the hero, so all three agree on whether the
 * first-load curtain is showing.
 */

/** sessionStorage flag: the curtain plays once per browser session. */
export const PRELOADER_SESSION_KEY = 'wereact_preloaded';

/** Paid ad clicks skip the curtain (regex source, shared with the boot script). */
export const PRELOADER_PAID_CLICK_SOURCE = '(?:^|[?&])(gclid|gbraid|wbraid|utm_[a-z]+)=';

/**
 * `<html data-wereact-preloader>`:
 *   "on"   - the curtain is up (set before first paint by the boot script)
 *   "skip" - no curtain on this load (reduced motion, same session, paid click)
 *   "done" - the curtain played and lifted
 */
export const PRELOADER_STATE_ATTRIBUTE = 'data-wereact-preloader';

/**
 * If the page's JavaScript never takes over, CSS fades the server-rendered
 * curtain out after this long so it can never trap a visitor. Keep in sync
 * with the `preloader-failsafe` animation delay in globals.css.
 */
export const PRELOADER_FAILSAFE_MS = 12000;
