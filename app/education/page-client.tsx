'use client';

import Link from 'next/link';
import { Lesson } from '@/data/content';
import { useState } from 'react';

const ALL_LEVELS = 'All';

export default function EducationPage({ lessons }: { lessons: Lesson[] }) {
  const [difficulty, setDifficulty] = useState(ALL_LEVELS);

  const levels = [ALL_LEVELS, 'Beginner', 'Intermediate', 'Advanced'];

  const visible = lessons.filter((l) => {
    if (difficulty !== ALL_LEVELS && l.difficulty !== difficulty) return false;
    return true;
  });

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
        <h1>Learn Prediction Markets</h1>
        <p className="page-subtitle">Master prediction market mechanics, strategies, and arbitrage techniques</p>
      </div>

      {/* Difficulty filters */}
      <div className="section" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <div className="market-filters" style={{ marginBottom: '40px' }}>
          {levels.map((level) => (
            <button
              key={level}
              className={`market-filter-pill ${difficulty === level ? 'market-filter-active' : ''}`}
              onClick={() => setDifficulty(level)}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Lessons grid */}
        <div className="edu-grid">
          {visible.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 20px', color: 'var(--ink2)' }}>
              No lessons found for this level.
            </div>
          ) : (
            visible.map((l) => (
              <Link key={l.id} href={`/lesson/${l.id}`} className="edu-card">
                <div className="edu-num">{l.num}</div>
                <div className="edu-title">{l.title}</div>
                <div className="edu-desc">{l.desc}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--ink3)' }}>{l.readTime}</span>
                  <span style={{ fontSize: '11px', color: 'var(--orange)', opacity: '0.8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {l.difficulty}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
