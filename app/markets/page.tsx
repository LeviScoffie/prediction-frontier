import Link from 'next/link';
import { fetchTopMarkets } from '@/lib/polymarket';
import { fetchKalshiMarkets } from '@/lib/kalshi';
import type { Market } from '@/lib/polymarket';
import MarketBoard from '@/components/MarketBoard';

export const revalidate = 60;

export const metadata = {
  title: 'Markets',
  description: 'Live prediction markets across Polymarket and Kalshi. Track probabilities, volume, and trading activity in real-time.',
};

export default async function MarketsPage() {
  let markets: Market[] = [];
  let error = false;

  try {
    const [poly, kalshi] = await Promise.allSettled([
      fetchTopMarkets(50),
      fetchKalshiMarkets(30),
    ]);

    const polyMarkets = poly.status === 'fulfilled' ? poly.value : [];
    const kalshiMarkets = kalshi.status === 'fulfilled' ? kalshi.value : [];

    // Interleave so neither platform dominates
    const maxLen = Math.max(polyMarkets.length, kalshiMarkets.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < polyMarkets.length) markets.push(polyMarkets[i]);
      if (i < kalshiMarkets.length) markets.push(kalshiMarkets[i]);
    }

    error = polyMarkets.length === 0 && kalshiMarkets.length === 0;
  } catch {
    error = true;
  }

  return (
    <>
      {/* Top nav */}
      <div className="article-nav">
        <Link href="/" className="logo">
          Prediction<em>Frontier</em>
        </Link>
        <Link href="/" className="back-link">← Home</Link>
      </div>

      {/* Header */}
      <div className="page-header">
        <h1>Live Markets</h1>
        <p className="page-subtitle">Real-time prediction market odds from Polymarket and Kalshi</p>
      </div>

      {/* Market Board */}
      {error ? (
        <div className="section" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: 'var(--ink2)', fontSize: '14px' }}>
            Unable to load live market data right now. Please try again in a moment.
          </p>
        </div>
      ) : (
        <div className="section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <MarketBoard markets={markets} />
        </div>
      )}
    </>
  );
}
