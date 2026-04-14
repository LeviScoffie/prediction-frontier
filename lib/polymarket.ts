import { z } from 'zod';

// ── Schemas ────────────────────────────────────────────────────────────────

export const PolymarketMarketSchema = z.object({
  id: z.string(),
  slug: z.string(),
  question: z.string(),
  // outcomes is a JSON-encoded string array from the API
  outcomes: z.union([
    z.array(z.string()),
    z.string().transform((s) => JSON.parse(s) as string[]),
  ]),
  // outcomePrices is a JSON-encoded string array of floats
  outcomePrices: z.union([
    z.array(z.coerce.number()),
    z.string().transform((s) => (JSON.parse(s) as string[]).map(Number)),
  ]),
  volume: z.coerce.number(),
  liquidity: z.coerce.number().optional(),
  endDate: z.string().nullable().optional(),
  active: z.boolean().optional(),
  closed: z.boolean().optional(),
  tags: z
    .array(z.object({ label: z.string(), slug: z.string() }).passthrough())
    .optional(),
  // events array contains the parent event with the correct URL slug
  events: z
    .array(z.object({ slug: z.string() }).passthrough())
    .optional(),
});

export type PolymarketMarket = z.infer<typeof PolymarketMarketSchema>;

// Normalised shape we expose to the UI
export type Market = {
  id: string;
  slug: string;
  question: string;
  platform: 'Polymarket' | 'Kalshi';
  category: string;
  yesPrice: number; // 0–1
  noPrice: number;  // 0–1
  volume: number;   // USDC / USD
  url: string;
};

// ── Constants ──────────────────────────────────────────────────────────────

const GAMMA_BASE = 'https://gamma-api.polymarket.com';

// ── Helpers ────────────────────────────────────────────────────────────────

function deriveCategory(market: PolymarketMarket): string {
  const tags = market.tags ?? [];
  if (tags.length > 0) return tags[0].label;
  const q = market.question.toLowerCase();
  if (q.includes('bitcoin') || q.includes('btc') || q.includes('ethereum') || q.includes('crypto')) return 'Crypto';
  if (q.includes('fed') || q.includes('cpi') || q.includes('gdp') || q.includes('inflation')) return 'Macro';
  if (q.includes('election') || q.includes('president') || q.includes('senate') || q.includes('trump') || q.includes('impeach')) return 'Politics';
  if (q.includes('ukraine') || q.includes('russia') || q.includes('china') || q.includes('taiwan') || q.includes('ceasefire') || q.includes('war') || q.includes('nato')) return 'Geopolitics';
  if (q.includes('openai') || q.includes('gpt') || q.includes('anthropic') || q.includes('gemini')) return 'AI';
  return 'General';
}

function normalise(raw: PolymarketMarket): Market {
  const outcomes = Array.isArray(raw.outcomes) ? raw.outcomes : JSON.parse(raw.outcomes as unknown as string);
  const prices   = Array.isArray(raw.outcomePrices) ? raw.outcomePrices : (raw.outcomePrices as unknown as string[]).map(Number);

  const yesIdx = outcomes.findIndex((o: string) => o.toLowerCase() === 'yes');
  const yesPrice = yesIdx >= 0 ? prices[yesIdx] : prices[0] ?? 0;
  const noPrice  = yesIdx >= 0 ? prices[yesIdx === 0 ? 1 : 0] : prices[1] ?? 0;

  // Use the parent event slug for the URL (the market slug has a numeric suffix
  // that Polymarket's router doesn't recognise — the event slug is what works)
  const eventSlug = raw.events?.[0]?.slug ?? raw.slug.replace(/-\d+$/, '');

  return {
    id: raw.id,
    slug: raw.slug,
    question: raw.question,
    platform: 'Polymarket',
    category: deriveCategory(raw),
    yesPrice,
    noPrice,
    volume: raw.volume,
    url: `https://polymarket.com/event/${eventSlug}`,
  };
}

// ── Fetch ──────────────────────────────────────────────────────────────────

export async function fetchTopMarkets(limit = 10, minVolume = 50_000): Promise<Market[]> {
  const params = new URLSearchParams({
    active: 'true',
    closed: 'false',
    limit: String(Math.min(limit, 100)),
    sort_by: 'volume24hr',
    ascending: 'false',
  });

  const res = await fetch(`${GAMMA_BASE}/markets?${params}`, {
    next: { revalidate: 60 }, // ISR — fresh every 60 s
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  // API can return an array directly or { data: [...] }
  const items: unknown[] = Array.isArray(json) ? json : (json as { data: unknown[] }).data ?? [];

  const markets: Market[] = [];
  for (const item of items) {
    const parsed = PolymarketMarketSchema.safeParse(item);
    if (!parsed.success) continue;
    const m = normalise(parsed.data);
    if (m.volume < minVolume) continue;
    markets.push(m);
  }

  return markets.slice(0, limit);
}
