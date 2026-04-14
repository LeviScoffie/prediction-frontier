import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchArbitrageOpportunities, ArbitrageOpportunity } from '@/lib/arbitrage';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Arbitrage Scanner',
  description: 'Live cross-platform arbitrage and price divergence opportunities between Polymarket and Kalshi. Find where the crowds disagree.',
  openGraph: {
    title: 'Arbitrage Scanner | Prediction Frontier',
    description: 'Live cross-platform arbitrage and price divergence opportunities between Polymarket and Kalshi.',
    url: '/arbitrage',
  },
  twitter: {
    title: 'Arbitrage Scanner | Prediction Frontier',
    description: 'Live cross-platform arbitrage and price divergence opportunities between Polymarket and Kalshi.',
  },
};

function ProbBar({ pct, platform }: { pct: number; platform: string }) {
  const isHigh = pct >= 50;
  return (
    <div className="prob-bar-wrap">
      <div className="prob-bar-label">
        <span className="prob-bar-platform">{platform}</span>
        <span className={`prob-bar-pct ${isHigh ? 'prob-yes' : 'prob-no'}`}>{pct}%</span>
      </div>
      <div className="prob-bar-track">
        <div
          className={`prob-bar-fill ${isHigh ? 'fill-yes' : 'fill-no'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OpportunityCard({ opp }: { opp: ArbitrageOpportunity }) {
  const polyPct = Math.round(opp.polymarket.yesPrice * 100);
  const kalshiPct = Math.round(opp.kalshi.yesPrice * 100);
  const isArb = opp.type === 'arb';

  return (
    <div className={`arb-card ${isArb ? 'arb-card-hot' : ''}`}>
      {/* Header */}
      <div className="arb-card-header">
        <div className="arb-badge-row">
          {isArb ? (
            <span className="arb-badge arb-badge-arb">⚡ Arbitrage</span>
          ) : (
            <span className="arb-badge arb-badge-div">≠ Divergence</span>
          )}
          <span className="arb-spread">{opp.spreadPct}pp spread</span>
        </div>
        <div className="arb-topic">{opp.topic}</div>
      </div>

      {/* Questions */}
      <div className="arb-questions">
        <div className="arb-question">
          <div className="arb-q-platform">Polymarket</div>
          <div className="arb-q-text">{opp.polymarket.question}</div>
        </div>
        <div className="arb-divider">vs</div>
        <div className="arb-question">
          <div className="arb-q-platform">Kalshi</div>
          <div className="arb-q-text">{opp.kalshi.question}</div>
        </div>
      </div>

      {/* Probability bars */}
      <div className="arb-probs">
        <ProbBar pct={polyPct} platform="Polymarket" />
        <ProbBar pct={kalshiPct} platform="Kalshi" />
      </div>

      {/* Signal / arb box */}
      {isArb && opp.profitPct != null ? (
        <div className="arb-callout arb-callout-hot">
          <div className="arb-callout-title">Potential profit: {opp.profitPct}%</div>
          <div className="arb-callout-body">
            Buy YES on {opp.kalshi.yesPrice < opp.polymarket.yesPrice ? 'Kalshi' : 'Polymarket'} ({Math.min(polyPct, kalshiPct)}¢) +
            NO on {opp.kalshi.yesPrice < opp.polymarket.yesPrice ? 'Polymarket' : 'Kalshi'} ({100 - Math.max(polyPct, kalshiPct)}¢) = {Math.round(opp.combinedCost * 100)}¢ total.
            One leg pays $1 on resolution. Factor in fees before trading.
          </div>
        </div>
      ) : (
        <div className="arb-callout arb-callout-signal">
          <div className="arb-callout-body">{opp.impliedConflict}</div>
        </div>
      )}

      {/* Links */}
      <div className="arb-links">
        <a href={opp.polymarket.url} target="_blank" rel="noopener noreferrer" className="arb-link">
          Trade on Polymarket →
        </a>
        <a href={opp.kalshi.url} target="_blank" rel="noopener noreferrer" className="arb-link">
          Trade on Kalshi →
        </a>
      </div>
    </div>
  );
}

export default async function ArbitragePage() {
  let opportunities: ArbitrageOpportunity[] = [];
  let error = false;

  try {
    opportunities = await fetchArbitrageOpportunities();
  } catch {
    error = true;
  }

  const arbs = opportunities.filter((o) => o.type === 'arb');
  const divs = opportunities.filter((o) => o.type === 'divergence');

  return (
    <>
      {/* Page header */}
      <div className="arb-hero">
        <div className="arb-hero-inner">
          <div className="section-label" style={{ marginBottom: '32px' }}>Cross-platform scanner</div>
          <h1 className="arb-title">
            Arbitrage &<br /><em>Divergence</em> Scanner
          </h1>
          <p className="arb-subtitle">
            When Polymarket and Kalshi price the same event differently, there's signal.
            We surface the gaps — true arbitrage opportunities and meaningful crowd disagreements — updated every 60 seconds.
          </p>

          {/* Stats row */}
          <div className="arb-stats">
            <div className="arb-stat">
              <div className="arb-stat-num">{arbs.length}</div>
              <div className="arb-stat-label">Arb opportunities</div>
            </div>
            <div className="arb-stat">
              <div className="arb-stat-num">{divs.length}</div>
              <div className="arb-stat-label">Divergence signals</div>
            </div>
            <div className="arb-stat">
              <div className="arb-stat-num">
                {opportunities.length > 0
                  ? Math.max(...opportunities.map((o) => o.spreadPct)) + 'pp'
                  : '—'}
              </div>
              <div className="arb-stat-label">Largest spread</div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="arb-disclaimer">
        <span>⚠ Not financial advice.</span> Resolution criteria differ across platforms — always verify before trading. Fees reduce or eliminate apparent arbitrage.
      </div>

      {/* Content */}
      <div className="arb-content">
        {error && (
          <p style={{ color: 'var(--ink3)', padding: '48px 0', textAlign: 'center' }}>
            Unable to load scanner data right now. Try again shortly.
          </p>
        )}

        {!error && opportunities.length === 0 && (
          <div className="arb-empty">
            <div className="arb-empty-icon">◎</div>
            <div className="arb-empty-title">No signals detected</div>
            <p className="arb-empty-body">
              No significant price discrepancies found between Polymarket and Kalshi right now.
              Markets are pricing similar events within 5 percentage points of each other.
            </p>
          </div>
        )}

        {arbs.length > 0 && (
          <section className="arb-section">
            <div className="section-label">True arbitrage</div>
            <div className="arb-grid">
              {arbs.map((opp, i) => (
                <OpportunityCard key={i} opp={opp} />
              ))}
            </div>
          </section>
        )}

        {divs.length > 0 && (
          <section className="arb-section">
            <div className="section-label">Divergence signals</div>
            <div className="arb-grid">
              {divs.map((opp, i) => (
                <OpportunityCard key={i} opp={opp} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* How it works */}
      <div className="arb-explainer">
        <div className="arb-explainer-inner">
          <div className="section-label">How it works</div>
          <div className="arb-explainer-grid">
            <div className="arb-explainer-item">
              <div className="arb-explainer-num">01</div>
              <div className="arb-explainer-title">We fetch live prices</div>
              <div className="arb-explainer-body">
                Every 60 seconds we pull YES/NO prices from Polymarket's CLOB API and Kalshi's market API across dozens of active markets.
              </div>
            </div>
            <div className="arb-explainer-item">
              <div className="arb-explainer-num">02</div>
              <div className="arb-explainer-title">We match related events</div>
              <div className="arb-explainer-body">
                Our matcher identifies markets covering the same underlying topic across platforms — even when the question wording differs.
              </div>
            </div>
            <div className="arb-explainer-item">
              <div className="arb-explainer-num">03</div>
              <div className="arb-explainer-title">We surface the gaps</div>
              <div className="arb-explainer-body">
                True arb: combined cost of YES + NO across platforms is below $1 — guaranteed profit on resolution. Divergence: significant crowd disagreement worth investigating.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
