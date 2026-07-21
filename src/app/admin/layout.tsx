import type { Metadata } from 'next';
import '../globals.css';
import './admin.css';
import { nohemi } from '@/app/fonts';

export const metadata: Metadata = {
  title: 'WeReact CRM',
  description: 'Internal lead management',
  robots: { index: false, follow: false },
};

/**
 * Root layout for the internal CRM. Deliberately separate from the localized
 * marketing site ([locale]/layout) - no site chrome, no i18n, noindex.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nohemi.variable} min-h-screen antialiased`}>{children}</body>
    </html>
  );
}
