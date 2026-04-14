import { fetchTopMarkets } from '@/lib/polymarket';
import { fetchKalshiMarkets } from '@/lib/kalshi';
import type { Market } from '@/lib/polymarket';
import MarketBoard from './MarketBoard';

export default async function MarketList() {
  let markets: Market[] = [];
  let error = false;

  try {
    const [poly, kalshi] = await Promise.allSettled([
      fetchTopMarkets(12),
      fetchKalshiMarkets(12),
    ]);

    const polyMarkets = poly.status === 'fulfilled' ? poly.value : [];
    const kalshiMarkets = kalshi.status === 'fulfilled' ? kalshi.value : [];

    // Interleave so neither platform dominates the top
    const maxLen = Math.max(polyMarkets.length, kalshiMarkets.length);
    for (let i = 0; i < maxLen; i++) {
      if (i < polyMarkets.length) markets.push(polyMarkets[i]);
      if (i < kalshiMarkets.length) markets.push(kalshiMarkets[i]);
    }

    error = polyMarkets.length === 0 && kalshiMarkets.length === 0;
  } catch {
    error = true;
  }

  if (error) {
    return (
      <p style={{ color: 'var(--ink2)', fontSize: '14px', padding: '40px 0' }}>
        Unable to load live market data right now.
      </p>
    );
  }

  return <MarketBoard markets={markets} />;
}
