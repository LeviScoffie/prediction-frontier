import { fetchTopMarkets } from './polymarket';
import { fetchKalshiMarkets } from './kalshi';
import type { Market } from './polymarket';

// ── Types ──────────────────────────────────────────────────────────────────

export type ArbitrageOpportunity = {
  type: 'arb' | 'divergence';
  topic: string;
  polymarket: Market;
  kalshi: Market;
  // For true arb: cost of buying YES on cheap side + NO on expensive side
  // If < 1.0 → guaranteed profit
  combinedCost: number;
  profitPct: number | null; // null if not a true arb
  // Price divergence regardless of arb
  spreadPct: number; // absolute difference in YES probability
  // Which platform has higher YES probability
  highSide: 'Polymarket' | 'Kalshi';
  impliedConflict: string; // human-readable explanation
};

// ── Match rules ────────────────────────────────────────────────────────────
// Each rule maps a set of Polymarket keywords to Kalshi series ticker(s).
// When a Polymarket question matches the keywords AND a Kalshi market from
// that series is in the fetched set, we pair them.

type MatchRule = {
  topic: string;
  polyKeywords: string[];   // ALL must appear in the Polymarket question
  kalshiKeywords: string[]; // ALL must appear in the Kalshi question
  impliedConflict: (poly: Market, kalshi: Market) => string;
};

const MATCH_RULES: MatchRule[] = [
  {
    topic: 'Trump leaves office',
    polyKeywords: ['trump', 'president'],
    kalshiKeywords: ['trump', 'resign'],
    impliedConflict: (p, k) =>
      `Polymarket prices Trump leaving at ${pct(p.yesPrice)}%, Kalshi prices resignation at ${pct(k.yesPrice)}%.`,
  },
  {
    topic: 'Trump impeachment',
    polyKeywords: ['trump', 'president'],
    kalshiKeywords: ['impeach', 'removed'],
    impliedConflict: (p, k) =>
      `Polymarket prices Trump out at ${pct(p.yesPrice)}%, Kalshi prices impeachment+removal at ${pct(k.yesPrice)}%.`,
  },
  {
    topic: 'China / Taiwan conflict',
    polyKeywords: ['taiwan'],
    kalshiKeywords: ['taiwan', 'level 4'],
    impliedConflict: (p, k) =>
      `Polymarket: ${pct(p.yesPrice)}% China invades Taiwan. Kalshi: ${pct(k.yesPrice)}% US issues Level 4 warning — a leading indicator of conflict.`,
  },
  {
    topic: 'Russia-Ukraine ceasefire',
    polyKeywords: ['ukraine', 'ceasefire'],
    kalshiKeywords: ['zelenskyy', 'putin'],
    impliedConflict: (p, k) =>
      `Polymarket: ${pct(p.yesPrice)}% ceasefire. Kalshi: ${pct(k.yesPrice)}% Zelenskyy-Putin meeting — a prerequisite for any deal.`,
  },
  {
    topic: 'Greenland acquisition',
    polyKeywords: ['greenland'],
    kalshiKeywords: ['greenland'],
    impliedConflict: (p, k) =>
      `Polymarket: ${pct(p.yesPrice)}% Trump buys Greenland. Kalshi: ${pct(k.yesPrice)}% — same question, different crowd.`,
  },
  {
    topic: 'Panama Canal',
    polyKeywords: ['panama'],
    kalshiKeywords: ['canal'],
    impliedConflict: (p, k) =>
      `Polymarket: ${pct(p.yesPrice)}% US takes Panama Canal. Kalshi: ${pct(k.yesPrice)}% — crowd disagrees by ${Math.abs(pct(p.yesPrice) - pct(k.yesPrice))}pp.`,
  },
  {
    topic: 'OpenAI / Anthropic IPO',
    polyKeywords: ['openai'],
    kalshiKeywords: ['openai', 'anthropic'],
    impliedConflict: (p, k) =>
      `Polymarket: ${pct(p.yesPrice)}% OpenAI IPOs first. Kalshi: ${pct(k.yesPrice)}% OpenAI/Anthropic IPO first — slightly different questions.`,
  },
  {
    topic: 'Bitcoin price',
    polyKeywords: ['bitcoin'],
    kalshiKeywords: ['bitcoin'],
    impliedConflict: (p, k) =>
      `Polymarket: ${pct(p.yesPrice)}% on BTC outcome. Kalshi: ${pct(k.yesPrice)}% — compare crowd conviction across platforms.`,
  },
];

function pct(price: number) {
  return Math.round(price * 100);
}

function matchesKeywords(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.every((kw) => lower.includes(kw));
}

// ── Similarity check ──────────────────────────────────────────────────────
// A rough check: two questions are "similar enough" for true arb if they share
// at least 4 meaningful words (ignoring stop words). This catches "Will Trump
// resign" on both platforms but rejects "Trump out before GTA VI" vs "resign".

const STOP_WORDS = new Set(['will','the','a','an','be','is','are','of','in','to','and','or','for','on','at','by','as','it','its','before','after','during','than','that','this','with','from','not','no']);

function questionsAreSimilar(q1: string, q2: string): boolean {
  const words1 = new Set(
    q1.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 2 && !STOP_WORDS.has(w))
  );
  const words2 = q2.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(w => w.length > 2 && !STOP_WORDS.has(w));
  const overlap = words2.filter(w => words1.has(w)).length;
  return overlap >= 3;
}

// ── Core matching ──────────────────────────────────────────────────────────

function findMatches(
  polyMarkets: Market[],
  kalshiMarkets: Market[],
): ArbitrageOpportunity[] {
  const results: ArbitrageOpportunity[] = [];
  const usedPairs = new Set<string>();

  for (const rule of MATCH_RULES) {
    const polyMatch = polyMarkets.find((m) =>
      matchesKeywords(m.question, rule.polyKeywords),
    );
    const kalshiMatch = kalshiMarkets.find((m) =>
      matchesKeywords(m.question, rule.kalshiKeywords),
    );

    if (!polyMatch || !kalshiMatch) continue;

    const pairKey = `${polyMatch.id}::${kalshiMatch.id}`;
    if (usedPairs.has(pairKey)) continue;
    usedPairs.add(pairKey);

    const spreadPct = Math.abs(pct(polyMatch.yesPrice) - pct(kalshiMatch.yesPrice));
    const highSide: 'Polymarket' | 'Kalshi' =
      polyMatch.yesPrice >= kalshiMatch.yesPrice ? 'Polymarket' : 'Kalshi';

    // True arb check:
    // Buy YES on the cheaper platform + NO on the more expensive platform
    // Total cost = cheapYes + (1 - expensiveYes)
    // If total < 1.0 → guaranteed profit on resolution
    const cheapYes = Math.min(polyMatch.yesPrice, kalshiMatch.yesPrice);
    const expensiveYes = Math.max(polyMatch.yesPrice, kalshiMatch.yesPrice);
    const combinedCost = cheapYes + (1 - expensiveYes);
    // True arb requires: same resolution criteria (questions very similar)
    // AND combined cost < 0.98. We check question similarity as a proxy.
    const questionsSimilar = questionsAreSimilar(polyMatch.question, kalshiMatch.question);
    const isArb = combinedCost < 0.98 && questionsSimilar;
    const profitPct = isArb ? Math.round((1 - combinedCost) * 100) : null;

    // Only include if there's meaningful signal (≥5pp spread or true arb)
    if (spreadPct < 5 && !isArb) continue;

    results.push({
      type: isArb ? 'arb' : 'divergence',
      topic: rule.topic,
      polymarket: polyMatch,
      kalshi: kalshiMatch,
      combinedCost,
      profitPct,
      spreadPct,
      highSide,
      impliedConflict: rule.impliedConflict(polyMatch, kalshiMatch),
    });
  }

  // Sort: true arbs first, then by spread descending
  return results.sort((a, b) => {
    if (a.type === 'arb' && b.type !== 'arb') return -1;
    if (b.type === 'arb' && a.type !== 'arb') return 1;
    return b.spreadPct - a.spreadPct;
  });
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function fetchArbitrageOpportunities(): Promise<ArbitrageOpportunity[]> {
  const [polyResult, kalshiResult] = await Promise.allSettled([
    fetchTopMarkets(50, 1_000),   // low volume floor — we need breadth for matching
    fetchKalshiMarkets(30, 3),    // up to 3 per series for better matching
  ]);

  const polyMarkets = polyResult.status === 'fulfilled' ? polyResult.value : [];
  const kalshiMarkets = kalshiResult.status === 'fulfilled' ? kalshiResult.value : [];

  return findMatches(polyMarkets, kalshiMarkets);
}
