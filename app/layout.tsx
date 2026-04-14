import type { Metadata } from 'next';
import { Instrument_Serif, Inter } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://predictionfrontier.com'),
  title: {
    default: 'Prediction Frontier — Map the Signal. Shape the Future.',
    template: '%s | Prediction Frontier',
  },
  description: 'Real-time odds, signals, and education across every major prediction market — from Polymarket to Kalshi.',
  keywords: ['prediction markets', 'Polymarket', 'Kalshi', 'prediction market odds', 'arbitrage', 'political prediction markets'],
  authors: [{ name: 'Prediction Frontier' }],
  openGraph: {
    type: 'website',
    siteName: 'Prediction Frontier',
    title: 'Prediction Frontier — Map the Signal. Shape the Future.',
    description: 'Real-time odds, signals, and education across every major prediction market — from Polymarket to Kalshi.',
    url: '/',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Prediction Frontier — live market odds and signals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prediction Frontier — Map the Signal. Shape the Future.',
    description: 'Real-time odds, signals, and education across every major prediction market.',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
