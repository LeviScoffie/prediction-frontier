import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchTopMarkets } from '@/lib/polymarket';
import { fetchKalshiMarkets } from '@/lib/kalshi';
import type { Market } from '@/lib/polymarket';
import WatchButton from '@/components/WatchButton';

export const revalidate = 60;

async function getMarket(id: string): Promise<Market | null> {
  const [polyResult, kalshiResult] = await Promise.allSettled([
    fetchTopMarkets(50, 0),
    fetchKalshiMarkets(30, 3),
  ]);

  const all = [
    ...(polyResult.status === 'fulfilled' ? polyResult.value : []),
    ...(kalshiResult.status === 'fulfilled' ? kalshiResult.value : []),
  ];

  return all.find((m) => m.id === id || m.slug === id) ?? null;
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const market = await getMarket(params.id);
  if (!market) return {};
  const yesPct = Math.round(market.yesPrice * 100);
  return {
    title: market.question,
    description: `${market.platform} · ${market.category} · ${yesPct}% YES probability. Live prediction market odds on Prediction Frontier.`,
    openGraph: {
      title: `${market.question} | Prediction Frontier`,
      description: `${yesPct}% YES on ${market.platform}. Live odds and signals.`,
      url: `/market/${market.id}`,
    },
    twitter: {
      title: `${market.question} | Prediction Frontier`,
      description: `${yesPct}% YES on ${market.platform}.`,
    },
  };
}

function ProbBar({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div className="mkt-prob-row">
      <div className="mkt-prob-label">
        <span>{label}</span>
        <span className="mkt-prob-pct" style={{ color }}>{pct}%</span>
      </div>
      <div className="mkt-prob-track">
        <div className="mkt-prob-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function formatVolume(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(2)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export default async function MarketPage({ params }: { params: { id: string } }) {
  const market = await getMarket(params.id);
  if (!market) notFound();

  const yesPct = Math.round(market.yesPrice * 100);
  const noPct = Math.round(market.noPrice * 100);
  const isYes = yesPct >= 50;

  return (
    <>
      {/* Top nav */}
      <div className="article-nav">
        <Link href="/" className="logo">Prediction<em>Frontier</em></Link>
        <Link href="/#markets" className="back-link">← Back to markets</Link>
      </div>

      <div className="mkt-container">
        {/* Header */}
        <div className="mkt-header">
          <div className="mkt-meta-row">
            <span className="mkt-platform-badge">{market.platform}</span>
            <span className="mkt-category">{market.category}</span>
          </div>
          <h1 className="mkt-question">{market.question}</h1>
          <div className="mkt-header-actions">
            <div className="mkt-volume">{formatVolume(market.volume)} volume</div>
            <WatchButton id={market.id} />
          </div>
        </div>

        {/* Probability card */}
        <div className="mkt-prob-card">
          <div className="mkt-prob-headline">
            <span className="mkt-prob-big" style={{ color: isYes ? 'var(--green)' : 'var(--red)' }}>
              {yesPct}%
            </span>
            <span className="mkt-prob-label-main">probability of YES</span>
          </div>
          <div className="mkt-prob-bars">
            <ProbBar label="YES" pct={yesPct} color="var(--green)" />
            <ProbBar label="NO" pct={noPct} color="var(--red)" />
          </div>
        </div>

        {/* Trade CTA */}
        <div className="mkt-cta-card">
          <div className="mkt-cta-title">Trade this market</div>
          <p className="mkt-cta-desc">
            This market is live on {market.platform}. Click below to view current order book, place a position, or track price changes.
          </p>
          <a
            href={market.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mkt-cta-btn"
          >
            Open on {market.platform} →
          </a>
        </div>

        {/* Info grid */}
        <div className="mkt-info-grid">
          <div className="mkt-info-item">
            <div className="mkt-info-label">Platform</div>
            <div className="mkt-info-val">{market.platform}</div>
          </div>
          <div className="mkt-info-item">
            <div className="mkt-info-label">Category</div>
            <div className="mkt-info-val">{market.category}</div>
          </div>
          <div className="mkt-info-item">
            <div className="mkt-info-label">Volume</div>
            <div className="mkt-info-val">{formatVolume(market.volume)}</div>
          </div>
          <div className="mkt-info-item">
            <div className="mkt-info-label">YES price</div>
            <div className="mkt-info-val" style={{ color: 'var(--green)' }}>{market.yesPrice.toFixed(3)}</div>
          </div>
          <div className="mkt-info-item">
            <div className="mkt-info-label">NO price</div>
            <div className="mkt-info-val" style={{ color: 'var(--red)' }}>{market.noPrice.toFixed(3)}</div>
          </div>
          <div className="mkt-info-item">
            <div className="mkt-info-label">Market ID</div>
            <div className="mkt-info-val mkt-info-mono">{market.id}</div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mkt-disclaimer">
          Prices update every 60 seconds. This is not financial advice. Prediction market probabilities reflect crowd sentiment, not guaranteed outcomes.
        </p>
      </div>
    </>
  );
}
