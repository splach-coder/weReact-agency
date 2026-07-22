import type { Metadata } from 'next';
import '../globals.css';
import '../admin/admin.css';
import { nohemi } from '@/app/fonts';

export const metadata: Metadata = {
  title: 'WeReact CRM',
  description: 'Private WeReact client workspace',
  robots: { index: false, follow: false },
};

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nohemi.variable} min-h-screen antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
