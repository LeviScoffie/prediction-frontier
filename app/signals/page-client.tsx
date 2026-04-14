'use client';

import Link from 'next/link';
import { Post } from '@/data/content';
import { useState } from 'react';

const ALL_CATEGORIES = 'All';

export default function SignalsPage({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState(ALL_CATEGORIES);

  // Get unique categories
  const categories = [ALL_CATEGORIES, ...Array.from(new Set(posts.map((p) => p.tag))).sort()];

  // Filter by category
  const visible = posts.filter((p) => {
    if (category !== ALL_CATEGORIES && p.tag !== category) return false;
    return true;
  });

  const featured = visible.find((p) => p.featured);
  const secondary = visible.filter((p) => !p.featured);

  return (
    <>
      {/* Top nav */}
      <div className="article-nav">
        <Link href="/" className="logo">
          Prediction<em>Frontier</em>
        </Link>
        <Link href="/" className="back-link">← Home</Link>
      </div>

      {/* Header */}
      <div className="page-header">
        <h1>Market Signals</h1>
        <p className="page-subtitle">Latest insights and analysis on prediction market movements</p>
      </div>

      {/* Category filters */}
      <div className="section" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <div className="market-filters" style={{ marginBottom: '40px' }}>
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

        {/* Featured article */}
        {featured && (
          <Link href={`/post/${featured.id}`} className="news-featured" style={{ marginBottom: '40px' }}>
            <div className={`news-tag ${featured.tagClass}`}>{featured.tag}</div>
            <div className="news-headline">{featured.headline}</div>
            <div className="news-meta">{featured.source} · {featured.time}</div>
          </Link>
        )}

        {/* Secondary articles grid */}
        <div className="news-secondary">
          {secondary.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 20px', color: 'var(--ink2)' }}>
              No signals found for this category.
            </div>
          ) : (
            secondary.map((p) => (
              <Link key={p.id} href={`/post/${p.id}`} className="news-card">
                <div className={`news-tag ${p.tagClass}`}>{p.tag}</div>
                <div className="news-headline">{p.headline}</div>
                <div className="news-meta">{p.source} · {p.time}</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
