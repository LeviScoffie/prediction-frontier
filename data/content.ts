import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string(),
  tag: z.string(),
  tagClass: z.enum(['tag-c', 'tag-r', 'tag-p', 'tag-s']),
  headline: z.string(),
  source: z.string(),
  time: z.string(),
  featured: z.boolean(),
  body: z.string(),
});

export const LessonSchema = z.object({
  id: z.string(),
  num: z.string(),
  title: z.string(),
  desc: z.string(),
  readTime: z.string(),
  body: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
export type Lesson = z.infer<typeof LessonSchema>;

export const posts: Post[] = z.array(PostSchema).parse([
  {
    id: 'btc-150k',
    tag: 'Markets', tagClass: 'tag-c',
    headline: 'Polymarket sees $28M in BTC price markets as crowd probability shifts to 73% YES on $150k target',
    source: 'Oracle', time: '2 hours ago',
    featured: true,
    body: `
      <p>Bitcoin's prediction market on Polymarket has crossed a significant threshold — over $28 million in combined volume across the BTC $150k contracts, with the YES side now sitting at 73% implied probability. That's a 12-point move in under two weeks.</p>
      <h2>What's driving the shift</h2>
      <p>The catalyst appears to be a combination of ETF inflow data and macro positioning. Spot Bitcoin ETF products recorded their largest single-week net inflow since February, pulling in approximately $1.4B. Simultaneously, the dollar index (DXY) has softened against a backdrop of mixed Fed signals, which historically correlates with BTC upward repricing.</p>
      <div class="callout">At 73%, the market is pricing a 3-in-4 chance BTC hits $150k by December 31. For context, the same contract was at 48% in early January.</div>
      <h2>How to read this signal</h2>
      <p>Prediction market probabilities aren't just sentiment — they represent capital at risk. Someone willing to bet $1 at 73 cents to win a dollar has a real financial stake in that belief. This is why prediction markets consistently outperform polls and pundit forecasts: there's a cost to being wrong.</p>
      <p>That said, the $150k contract is binary. The crowd could be right directionally but wrong on the specific threshold. Traders worth tracking are the large wallets that moved into YES positions in the $8–12M range over the last 72 hours — not retail, but structured positions.</p>
      <h2>What to watch</h2>
      <p><strong>FOMC meeting (March 19)</strong> — Any dovish pivot accelerates the thesis. <strong>ETF flows week of March 17</strong> — If inflows sustain above $800M, the 73% hold. A reversal below $400M would likely push odds back toward 60%.</p>
    `,
  },
  {
    id: 'cftc-kalshi',
    tag: 'Regulation', tagClass: 'tag-r',
    headline: 'CFTC approves new event contract categories for Kalshi, expanding into climate and sports',
    source: 'CoinDesk', time: '4 hours ago',
    featured: false,
    body: `
      <p>The Commodity Futures Trading Commission has approved Kalshi's application to list event contracts in two new verticals: climate outcomes and professional sports results. The approval marks the broadest expansion of CFTC-regulated prediction markets in the agency's history.</p>
      <h2>What this means practically</h2>
      <p>Kalshi can now list contracts on outcomes like "Will average US summer temperature exceed X°F?" and "Will [Team] win the championship?" These aren't novelties — weather derivatives and sports betting markets each represent multi-billion dollar industries. Kalshi is now the only CFTC-regulated venue that can touch all of them.</p>
      <div class="callout">The significance isn't just sports or weather — it's that the CFTC is defining a framework for what constitutes a legitimate "event contract." This creates a regulatory moat around Kalshi while signaling what Polymarket would need to do to re-enter the US market.</div>
      <h2>The Polymarket dimension</h2>
      <p>Polymarket has been effectively blocked from US users since its 2022 CFTC settlement. Every new Kalshi approval raises the compliance bar for a potential Polymarket return. The gap in regulatory legitimacy is widening, which could accelerate institutional capital flows toward Kalshi's more structured contracts.</p>
    `,
  },
  {
    id: 'pm-research',
    tag: 'Research', tagClass: 'tag-s',
    headline: 'New paper: Prediction markets outperform expert forecasters by 18% across 1,200 geopolitical events',
    source: 'SSRN', time: '6 hours ago',
    featured: false,
    body: `
      <p>A new working paper analyzing 1,200 geopolitical forecasting events across a five-year period finds that prediction market prices outperform structured expert panels by 18 percentage points on Brier score — a metric that penalizes both overconfidence and underconfidence.</p>
      <h2>Why this matters beyond the headline</h2>
      <p>The 18% figure is the average. The gap widens dramatically for long-horizon events (6–18 months out) where expert forecasters showed consistent overconfidence, especially in domains with high media coverage. Prediction markets, by contrast, corrected faster as new information arrived — sometimes within hours of a news event.</p>
      <div class="callout">The paper's most striking finding: expert forecasters were most wrong on the events they were most confident about. Prediction markets showed no such correlation between confidence and accuracy.</div>
      <h2>The mechanism</h2>
      <p>This isn't magic — it's incentives. Experts face reputational risk for bold claims and career risk for being wrong publicly. Markets face financial loss for being wrong and financial gain for updating faster than others. The result is that markets aggregate information more efficiently, particularly at moments when conventional wisdom is most likely to be wrong.</p>
    `,
  },
  {
    id: 'manifold-usd',
    tag: 'Platform', tagClass: 'tag-p',
    headline: 'Manifold Markets launches real-money USD bridge, opens to 14 new countries',
    source: 'Manifold Blog', time: '9 hours ago',
    featured: false,
    body: `
      <p>Manifold Markets, which has operated as a play-money prediction market since 2022, has announced a real-money USD bridge that allows users to convert their Mana (M$) winnings into actual dollars at a fixed rate. The feature is launching in 14 countries, with the US and EU excluded pending regulatory review.</p>
      <h2>What changes with real money</h2>
      <p>Manifold's key differentiator has always been the breadth and speed of market creation — anyone can create a market on anything, with essentially no listing requirements. The play-money model enabled this by removing regulatory friction. Real money changes the calculus significantly.</p>
      <p>The conversion bridge is likely a test for user behavior: does real-money incentive improve forecasting accuracy? Manifold's research team has hinted at internal data suggesting yes, particularly for niche markets where specialist knowledge is rewarded.</p>
      <div class="callout">The 14-country launch is strategically interesting — it includes Kenya, Nigeria, and India, markets where mobile money is dominant and traditional finance barriers are high. Manifold may be building a non-Western growth base before a potential US regulatory push.</div>
    `,
  },
  {
    id: 'fed-cut',
    tag: 'Markets', tagClass: 'tag-c',
    headline: 'Fed cut odds drop from 58% to 41% in 90 minutes after hot jobs report',
    source: 'Oracle', time: '12 hours ago',
    featured: false,
    body: `
      <p>This morning's non-farm payrolls print came in at 303,000 — well above the 214,000 consensus estimate — and the prediction markets responded immediately. The Kalshi "Fed cuts at March FOMC" contract dropped from 58% to 41% in under 90 minutes. That's a $4.2M swing in implied value.</p>
      <h2>How fast is fast?</h2>
      <p>For context: the Bloomberg consensus estimate barely moved in the same window. The Fed funds futures market (a much larger, more liquid market) took closer to 4 hours to fully reprice. Prediction markets, despite lower liquidity, moved first and moved correctly — a recurring pattern on high-frequency economic data releases.</p>
      <div class="callout">The speed gap is closing between prediction markets and traditional derivatives. When Kalshi's volumes cross $1B in a single contract category, expect institutional desks to start using prediction market prices as leading indicators rather than lagging ones.</div>
      <h2>What this means for March</h2>
      <p>At 41%, the crowd now thinks a March cut is a coin flip that favors no action. The next major data point is CPI on March 12. If inflation comes in above 3.5%, expect the contract to drop toward 25%. Below 3.0% could push it back above 55%. The market is essentially a real-time CPI probability machine right now.</p>
    `,
  },
]);

export const lessons: Lesson[] = z.array(LessonSchema).parse([
  {
    id: 'what-are-prediction-markets',
    num: '01 — Beginner',
    title: 'What are prediction markets?',
    desc: 'How crowd wisdom becomes probability. The mechanics of YES/NO shares and why markets outperform polls.',
    readTime: '5 min read',
    body: `
      <p>A prediction market is a trading venue where the commodity being bought and sold is the probability of a future event. Instead of trading stocks in a company, you're trading claims about whether something will happen.</p>
      <h2>The basic mechanism</h2>
      <p>Every market resolves to either YES (1) or NO (0). If you buy a YES share at $0.73, you're paying 73 cents for a contract that pays $1 if the event happens and $0 if it doesn't. The market price of that share — in this case, 73 cents — is the crowd's implied probability: 73%.</p>
      <div class="callout">The price IS the probability. If a contract trades at $0.60, the market believes there's a 60% chance the event occurs. This is the core insight of prediction markets — prices aggregate information from all participants into a single number.</div>
      <h2>Why they beat polls</h2>
      <p>A poll asks people what they think. A prediction market asks people to stake money on what they think. That financial stake changes behavior in two important ways: people research before betting, and people update quickly when new information arrives because holding a wrong position is costly.</p>
      <p>This is why Philip Tetlock's research on forecasting consistently finds that markets outperform expert panels. Experts can hold wrong views indefinitely without consequence. Market participants cannot.</p>
      <h2>Where the money comes from</h2>
      <p>On Polymarket, you trade USDC (a dollar-pegged stablecoin) on a smart contract on the Polygon blockchain. On Kalshi, you trade actual US dollars in a CFTC-regulated account. The difference matters for who can participate and what legal protections you have — but the underlying probability mechanism is identical.</p>
    `,
  },
  {
    id: 'amms-vs-order-books',
    num: '02 — Intermediate',
    title: 'AMMs vs order books',
    desc: "How Polymarket's automated market maker differs from Kalshi's model and what it means for price efficiency.",
    readTime: '12 min read',
    body: `
      <p>Two fundamentally different systems power today's largest prediction markets. Polymarket runs on an Automated Market Maker (AMM). Kalshi runs a Central Limit Order Book (CLOB). The difference shapes everything: liquidity, spreads, price discovery speed, and who can profitably trade.</p>
      <h2>How an AMM works</h2>
      <p>An AMM uses a mathematical formula to set prices automatically. In Polymarket's case, the CLOB model (they actually migrated from pure AMM in 2023) uses a constant product formula adapted for binary outcomes. The key property: you can always trade, but the price moves against you as your order size grows. Large orders move the market more.</p>
      <p>This creates a predictable liquidity profile. Liquidity providers deposit both YES and NO shares into a pool and earn fees from trading activity. They don't need to be active — the contract prices them automatically.</p>
      <h2>How an order book works</h2>
      <p>Kalshi's CLOB is more similar to a stock exchange. Buyers post bids ("I'll pay $0.40 for YES"), sellers post asks ("I'll sell YES for $0.42"), and the exchange matches them when prices cross. There's no automatic price — the market price is simply the last trade price.</p>
      <div class="callout">Order books require active market makers to maintain liquidity. During high-volatility events (like a surprise jobs number), order books can experience "liquidity gaps" where spreads widen dramatically. AMMs don't gap — they just move the price along the curve.</div>
      <h2>What this means for you</h2>
      <p>For small trades: AMMs are usually better. The spread is predictable and you execute immediately. For large trades (&gt;$50k notional): order books are usually better if there's deep liquidity, because you won't move the price curve. For fast-moving events: order books update faster because they rely on human market makers who can reprice in milliseconds based on news, whereas AMM prices change only when someone trades against the pool.</p>
    `,
  },
  {
    id: 'cross-platform-arbitrage',
    num: '03 — Advanced',
    title: 'Cross-platform arbitrage',
    desc: "When Polymarket and Kalshi disagree on the same event, that's an opportunity. How to find and execute it.",
    readTime: '20 min read',
    body: `
      <p>Cross-platform arbitrage in prediction markets is the practice of simultaneously buying YES on one platform and NO on another for the same event when the combined cost is below $1. If both positions pay out at $1 on resolution, you lock in a risk-free profit equal to the spread.</p>
      <h2>A real example</h2>
      <p>Suppose Polymarket has "Fed cuts in March" at 58% (YES costs $0.58) and Kalshi has the same event at 47% (NO costs $0.53). Buy YES on Polymarket for $0.58, buy NO on Kalshi for $0.53. Total cost: $1.11. Wait — that's more than $1. That's not arbitrage, that's a guaranteed loss.</p>
      <p>Flip it: Polymarket at 42% (YES at $0.42) and Kalshi at 55% (NO at $0.45). Buy YES on Polymarket + NO on Kalshi: $0.87 total. One of them pays $1. Profit: $0.13 per dollar, or ~15% return on the trade, risk-free on resolution.</p>
      <div class="callout">The catch: "risk-free" assumes both markets resolve the same way, on the same event definition. Always read the resolution criteria carefully. Polymarket and Kalshi can list contracts on superficially similar events with meaningfully different resolution rules.</div>
      <h2>Why gaps exist</h2>
      <p>Gaps arise because the platforms have different user bases, different liquidity depths, and different information flows. Kalshi's US-only user base skews toward macro traders. Polymarket's global user base includes crypto-native participants with different macro priors. When a data release hits, these audiences don't update at the same speed.</p>
      <h2>Execution constraints</h2>
      <p>The main friction is capital lockup. Both legs of the trade need to be funded simultaneously, and capital is locked until resolution (which could be months). Factor in: Polymarket's 2% winning fee, Kalshi's per-contract fee, and the opportunity cost of locked capital. After fees, most apparent arbitrage opportunities are 2–8% — real, but not infinite money.</p>
    `,
  },
]);
