import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProviders } from '@/providers/AppProviders';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Community Committee Digitiser',
    template: '%s | Community Committee Digitiser',
  },
  description:
    'A transparent and auditable digital platform for managing community committees (kameti) — contributions, cycles, lottery, and payouts.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ fontFamily: 'var(--font-inter), sans-serif', margin: 0 }}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
