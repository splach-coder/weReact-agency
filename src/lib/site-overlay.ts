import { getLenis } from './lenis';

const scrollLocks = new Set<string>();

function syncScrollLock() {
  if (typeof document === 'undefined') return;
  if (scrollLocks.size) {
    getLenis()?.stop();
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    getLenis()?.start();
  }
}

export function acquireScrollLock(owner: string) {
  scrollLocks.add(owner);
  syncScrollLock();
}

export function releaseScrollLock(owner: string) {
  scrollLocks.delete(owner);
  syncScrollLock();
}