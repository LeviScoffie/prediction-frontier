import { z } from 'zod';
import type { Market } from './polymarket';

// ── Schemas ────────────────────────────────────────────────────────────────

const KalshiMarketSchema = z.object({
  ticker: z.string(),
  event_ticker: z.string(),
  title: z.string(),
  yes_bid_dollars: z.coerce.number().optional(),
  yes_ask_dollars: z.coerce.number().optional(),
  no_bid_dollars: z.coerce.number().optional(),
  no_ask_dollars: z.coerce.number().optional(),
  previous_price_dollars: z.coerce.number().optional(),
  volume_fp: z.coerce.number().optional(),
  volume_24h_fp: z.coerce.number().optional(),
  liquidity_dollars: z.coerce.number().optional(),
  status: z.string().optional(),
  close_time: z.string().optional(),
});

type KalshiMarket = z.infer<typeof KalshiMarketSchema>;

// ── Constants ──────────────────────────────────────────────────────────────

const KALSHI_BASE = 'https://api.elections.kalshi.com/trade-api/v2';

// High-signal series tickers covering macro, politics, geopolitics, AI
// Each maps to a human-readable category
const SERIES: Array<{ ticker: string; category: string }> = [
  { ticker: 'KXFED', category: 'Macro' },
  { ticker: 'KXCPI', category: 'Macro' },
  { ticker: 'KXGDP', category: 'Economy' },
  { ticker: 'KXIMPEACH', category: 'Politics' },
  { ticker: 'KXTRUMPREMOVE', category: 'Politics' },
  { ticker: 'KXTRUMPRESIGN', category: 'Politics' },
  { ticker: 'KXGREENLAND', category: 'Geopolitics' },
  { ticker: 'KXCANAL', category: 'Geopolitics' },
  { ticker: 'KXZELENSKYPUTIN', category: 'Geopolitics' },
  { ticker: 'KXTAIWANLVL4', category: 'Geopolitics' },
  { ticker: 'KXOAIANTH', category: 'AI' },
  { ticker: 'KXMUSKTRILLION', category: 'Tech' },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function midpoint(bid?: number, ask?: number): number {
  if (bid != null && ask != null) return (bid + ask) / 2;
  if (bid != null) return bid;
  if (ask != null) return ask;
  return 0;
}

const MIN_VOLUME = 100; // minimum contracts traded to be worth showing

function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
}

function normalise(raw: KalshiMarket, category: string): Market | null {
  const yesPrice = midpoint(raw.yes_bid_dollars, raw.yes_ask_dollars);
  // Skip markets with no pricing data or negligible volume
  if (yesPrice === 0) return null;

  const volume = raw.volume_fp ?? 0;
  if (volume < MIN_VOLUME) return null;

  return {
    id: raw.ticker,
    slug: raw.ticker,
    question: stripMarkdown(raw.title),
    platform: 'Kalshi' as const,
    category,
    yesPrice,
    noPrice: 1 - yesPrice,
    volume,
    url: `https://kalshi.com/markets/${raw.event_ticker}/${raw.ticker}`,
  };
}

async function fetchSeries(
  seriesTicker: string,
  category: string,
  limit: number,
  maxResults = 1,
): Promise<Market[]> {
  const params = new URLSearchParams({
    series_ticker: seriesTicker,
    status: 'open',
    limit: String(limit),
  });

  const res = await fetch(`${KALSHI_BASE}/markets?${params}`, {
    next: { revalidate: 60 },
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) return [];

  const json = await res.json();
  const items: unknown[] = (json as { markets?: unknown[] }).markets ?? [];

  const markets: Market[] = [];
  for (const item of items) {
    const parsed = KalshiMarketSchema.safeParse(item);
    if (!parsed.success) continue;
    const m = normalise(parsed.data, category);
    if (m) markets.push(m);
  }

  // Sort by volume descending, take top maxResults
  return markets.sort((a, b) => b.volume - a.volume).slice(0, maxResults);
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function fetchKalshiMarkets(total = 10, perSeries = 1): Promise<Market[]> {
  // Fetch top N per series, pick best by volume

  const results = await Promise.allSettled(
    SERIES.map(({ ticker, category }) => fetchSeries(ticker, category, perSeries + 2, perSeries)),
  );

  const all: Market[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value);
  }

  return all.sort((a, b) => b.volume - a.volume).slice(0, total);
}
