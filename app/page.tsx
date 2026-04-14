import Link from 'next/link';
import { posts, lessons } from '@/data/content';
import NewsGrid from '@/components/NewsGrid';
import EduGrid from '@/components/EduGrid';
import MarketList from '@/components/MarketList';

export const revalidate = 60; // revalidate this page every 60 seconds

export default function Home() {
  return (
    <>
      {/* HERO */}
      <div className="hero">
        <p className="hero-kicker">Prediction Market Intelligence</p>
        <h1>Map the signal.<br />Shape the <em>future.</em></h1>
        <p className="hero-sub">
          Live odds, signals, and education across every major prediction market — Polymarket, Kalshi, and beyond.
        </p>
        <div className="hero-actions">
          <Link href="/#markets" className="btn-dark">Explore markets</Link>
          <Link href="/#learn" className="btn-ghost">How it works</Link>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-num">$2.4<span className="unit">B</span></div>
          <div className="stat-label">Total volume, all platforms</div>
          <div className="stat-change">↑ 340% year over year</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">18k<span className="unit">+</span></div>
          <div className="stat-label">Active markets right now</div>
          <div className="stat-change">↑ 12% this month</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">5</div>
          <div className="stat-label">Platforms tracked</div>
          <div className="stat-change">Updated in real-time</div>
        </div>
      </div>

      {/* MARKETS */}
      <div className="section" id="markets">
        <div className="section-label">Live market signals</div>
        <MarketList />
      </div>

      {/* NEWS */}
      <div className="section" id="news">
        <div className="section-label">Latest signals</div>
        <NewsGrid posts={posts} />
      </div>

      {/* EDUCATION */}
      <div className="section" id="learn">
        <div className="section-label">Learn</div>
        <EduGrid lessons={lessons} />
      </div>

      {/* PLATFORMS */}
      <div className="section" id="platforms">
        <div className="section-label">Platform comparison</div>
        <div className="platform-grid">
          <div className="platform-card">
            <div className="platform-name">Polymarket</div>
            <div className="platform-tagline">Decentralized · Polygon · Global</div>
            <div className="prow"><span className="prow-label">Total volume</span><span className="prow-val g">$2.1B+</span></div>
            <div className="prow"><span className="prow-label">Active markets</span><span className="prow-val">12,400+</span></div>
            <div className="prow"><span className="prow-label">Currency</span><span className="prow-val">USDC</span></div>
            <div className="prow"><span className="prow-label">US residents</span><span className="prow-val r">Restricted</span></div>
            <div className="prow"><span className="prow-label">Fees</span><span className="prow-val">2% on winnings</span></div>
          </div>
          <div className="platform-card">
            <div className="platform-name">Kalshi</div>
            <div className="platform-tagline">CFTC-regulated · USD · US legal</div>
            <div className="prow"><span className="prow-label">Total volume</span><span className="prow-val g">$380M+</span></div>
            <div className="prow"><span className="prow-label">Active markets</span><span className="prow-val">3,200+</span></div>
            <div className="prow"><span className="prow-label">Currency</span><span className="prow-val">USD</span></div>
            <div className="prow"><span className="prow-label">US residents</span><span className="prow-val g">Fully legal</span></div>
            <div className="prow"><span className="prow-label">Fees</span><span className="prow-val">1–7% per contract</span></div>
          </div>
          <div className="platform-card">
            <div className="platform-name">Manifold</div>
            <div className="platform-tagline">Community · Play money · Open</div>
            <div className="prow"><span className="prow-label">Total volume</span><span className="prow-val">M$2.4B (play)</span></div>
            <div className="prow"><span className="prow-label">Active markets</span><span className="prow-val">40,000+</span></div>
            <div className="prow"><span className="prow-label">Currency</span><span className="prow-val">Mana (M$)</span></div>
            <div className="prow"><span className="prow-label">US residents</span><span className="prow-val g">Open to all</span></div>
            <div className="prow"><span className="prow-label">Fees</span><span className="prow-val">None</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
