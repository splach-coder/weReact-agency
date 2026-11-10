import {
  PRELOADER_PAID_CLICK_SOURCE,
  PRELOADER_SESSION_KEY,
  PRELOADER_STATE_ATTRIBUTE,
} from './preloader-config';

/**
 * Decides, before the first paint, whether the first-load curtain shows on this
 * page load and records it on <html>. CSS then shows the server-rendered
 * curtain immediately (no flash of the page before it drops) and holds the hero
 * in its final state underneath, so the headline is painted with the first
 * frame instead of waiting for hydration. Must stay the first element in <body>.
 */
export default function PreloaderBoot() {
  return (
    <script
      id="wereact-preloader-boot"
      dangerouslySetInnerHTML={{
        __html: `(function(){var s='skip';try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var n=window.sessionStorage.getItem('${PRELOADER_SESSION_KEY}');var p=/${PRELOADER_PAID_CLICK_SOURCE}/.test(window.location.search);if(!r&&!n&&!p)s='on';}catch(e){}document.documentElement.setAttribute('${PRELOADER_STATE_ATTRIBUTE}',s);})();`,
      }}
    />
  );
}
