'use client';

import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

type LanguageSwitcherProps = {
  className?: string;
  variant?: 'bar' | 'menu';
};

const LOCALES = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
] as const;

/**
 * Compact FR / EN toggle. `usePathname()` from the i18n navigation helpers is
 * already locale-agnostic, so each Link only has to set its own `locale` and
 * keep the same `href` to stay on the current page.
 *
 * `variant="bar"` renders small and leaves text color to the parent (so it
 * can follow the top bar's light/dark swap); `variant="menu"` renders larger
 * and white, for the dark mobile overlay.
 */
export default function LanguageSwitcher({ className = '', variant = 'bar' }: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();

  const sizing = variant === 'menu' ? 'text-sm md:text-base' : 'text-xs';
  const tone = variant === 'menu' ? 'text-white' : '';

  return (
    <div
      role="group"
      aria-label="Change language"
      className={`text-mono flex items-center gap-1.5 font-semibold uppercase tracking-widest ${sizing} ${tone} ${className}`}
    >
      {LOCALES.map(({ code, label }, i) => {
        const active = locale === code;
        return (
          <span key={code} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="opacity-30">
                &middot;
              </span>
            )}
            <Link
              href={pathname}
              locale={code}
              aria-current={active ? 'true' : undefined}
              className={`transition-opacity hover:opacity-100 ${active ? 'opacity-100' : 'opacity-45'}`}
            >
              {label}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
