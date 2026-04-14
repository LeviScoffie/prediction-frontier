import { NextResponse } from 'next/server';
import { fetchArbitrageOpportunities } from '@/lib/arbitrage';

export const revalidate = 60;

export async function GET() {
  try {
    const opportunities = await fetchArbitrageOpportunities();
    return NextResponse.json(opportunities, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (err) {
    console.error('[/api/arbitrage]', err);
    return NextResponse.json({ error: 'Failed to compute arbitrage data' }, { status: 502 });
  }
}
