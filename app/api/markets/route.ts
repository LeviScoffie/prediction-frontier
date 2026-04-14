import { NextResponse } from 'next/server';
import { fetchTopMarkets } from '@/lib/polymarket';
import { fetchKalshiMarkets } from '@/lib/kalshi';

export const revalidate = 60;

export async function GET() {
  try {
    const [polymarkets, kalshiMarkets] = await Promise.allSettled([
      fetchTopMarkets(8),
      fetchKalshiMarkets(8),
    ]);

    const markets = [
      ...(polymarkets.status === 'fulfilled' ? polymarkets.value : []),
      ...(kalshiMarkets.status === 'fulfilled' ? kalshiMarkets.value : []),
    ];

    return NextResponse.json(markets, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    console.error('[/api/markets]', err);
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 502 },
    );
  }
}
