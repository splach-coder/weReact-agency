'use client';

import { forwardRef, type ComponentProps, type MouseEvent } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { useTransition } from './TransitionProvider';

type LinkProps = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for next-intl's locale-aware <Link>. On a normal
 * left-click it plays the cover curtain first, then navigates — the reveal is
 * fired by TransitionProvider once the new route mounts.
 *
 * Modified clicks (new tab), external/mailto/tel/hash links, and explicit
 * target="_blank" fall through to default browser behavior untouched.
 */
const TransitionLink = forwardRef<HTMLAnchorElement, LinkProps>(function TransitionLink(
  { href, onClick, target, ...rest },
  ref
) {
  const router = useRouter();
  const { cover, reveal } = useTransition();

  const handleClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (target && target !== '_self')) return;
    if (typeof href === 'string' && /^(https?:|mailto:|tel:|#)/.test(href)) return;

    const nextUrl = new URL(e.currentTarget.href, window.location.href);
    const currentUrl = new URL(window.location.href);
    const isSamePage =
      nextUrl.pathname === currentUrl.pathname &&
      nextUrl.search === currentUrl.search &&
      nextUrl.hash === currentUrl.hash;

    e.preventDefault();
    await cover();

    if (isSamePage) {
      await reveal();
      return;
    }

    router.push(href as Parameters<typeof router.push>[0]);
  };

  return <Link ref={ref} href={href} target={target} onClick={handleClick} {...rest} />;
});

export default TransitionLink;
