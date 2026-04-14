import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'The Frontier Briefing',
  description: 'Weekly prediction market intelligence — the biggest probability shifts, deep dives, and cross-platform signals, every Monday.',
  openGraph: {
    title: 'The Frontier Briefing | Prediction Frontier',
    description: 'Weekly prediction market intelligence — every Monday.',
    url: '/newsletter',
  },
  twitter: {
    title: 'The Frontier Briefing | Prediction Frontier',
    description: 'Weekly prediction market intelligence — every Monday.',
  },
};

export default function NewsletterLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
