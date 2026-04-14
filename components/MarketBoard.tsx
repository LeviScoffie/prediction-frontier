'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { Market } from '@/lib/polymarket';

function pct(price: number) {
  return Math.round(price * 100);
}

function formatVolume(volume: number) {
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(1)}M`;
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(0)}K`;
  return `$${volume.toFixed(0)}`;
}

const ALL_CATEGORIES = 'All';

type Tab = 'all' | 'watchlist';

export default function MarketBoard({ markets }: { markets: Market[] }) {
  const { toggle, isWatched } = useWatchlist();
  const [tab, setTab] = useState<Tab>('all');
  const [category, setCategory] = useState(ALL_CATEGORIES);

  // Derive unique categories from data
  const categories = [ALL_CATEGORIES, ...Array.from(new Set(markets.map((m) => m.category))).sort()];

  const visible = markets.filter((m) => {
    if (tab === 'watchlist' && !isWatched(m.id)) return false;
    if (category !== ALL_CATEGORIES && m.category !== category) return false;
    return true;
  });

  return (
    <div className="market-board">
      {/* Controls */}
      <div className="market-controls">
        <div className="market-tabs">
          <button
            className={`market-tab ${tab === 'all' ? 'market-tab-active' : ''}`}
            onClick={() => setTab('all')}
          >
            All markets
          </button>
          <button
            className={`market-tab ${tab === 'watchlist' ? 'market-tab-active' : ''}`}
            onClick={() => setTab('watchlist')}
          >
            ★ My watchlist
          </button>
        </div>
        <div className="market-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`market-filter-pill ${category === cat ? 'market-filter-active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Header row */}
      <div className="market-header-row">
        <span>Question</span>
        <span className="col-right">Platform</span>
        <span className="col-right">Probability</span>
        <span className="col-right">Watch</span>
      </div>

      {/* Market rows */}
      <div className="market-list">
        {visible.length === 0 ? (
          <div className="market-empty">
            {tab === 'watchlist'
              ? 'No markets in your watchlist yet. Click ★ on any market to save it.'
              : 'No markets found for this filter.'}
          </div>
        ) : (
          visible.map((m) => {
            const yes = pct(m.yesPrice);
            const isYes = yes >= 50;
            const watched = isWatched(m.id);

            return (
              <div key={`${m.platform}-${m.id}`} className="market-row-wrap">
                <Link className="market-row" href={`/market/${m.id}`}>
                  <div>
                    <div className="market-row-title">{m.question}</div>
                    <div className="market-platform-tag">
                      {formatVolume(m.volume)} · {m.platform} · {m.category}
                    </div>
                  </div>
                  <div className="market-vol col-right">
                    {m.platform}
                  </div>
                  <div className={`market-prob col-right ${isYes ? 'prob-yes' : 'prob-no'}`}>
                    {yes}%
                  </div>
                </Link>
                <button
                  className={`market-star ${watched ? 'market-star-active' : ''}`}
                  onClick={() => toggle(m.id)}
                  title={watched ? 'Remove from watchlist' : 'Add to watchlist'}
                  aria-label={watched ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                  ★
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
