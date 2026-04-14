import { NextResponse } from 'next/server';
import { fetchTopMarkets } from '@/lib/polymarket';
import { fetchKalshiMarkets } from '@/lib/kalshi';

export const revalidate = 60;

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const [polyResult, kalshiResult] = await Promise.allSettled([
    fetchTopMarkets(50, 0),
    fetchKalshiMarkets(30, 3),
  ]);

  const all = [
    ...(polyResult.status === 'fulfilled' ? polyResult.value : []),
    ...(kalshiResult.status === 'fulfilled' ? kalshiResult.value : []),
  ];

  const market = all.find((m) => m.id === id || m.slug === id);
  if (!market) {
    return NextResponse.json({ error: 'Market not found' }, { status: 404 });
  }

  return NextResponse.json(market, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}
