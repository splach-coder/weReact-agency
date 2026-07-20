import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'WeReact CRM',
  description: 'Internal lead management',
  robots: { index: false, follow: false },
};

/**
 * Root layout for the internal CRM. Deliberately separate from the localized
 * marketing site ([locale]/layout) — no site chrome, no i18n, noindex.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-100 text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
