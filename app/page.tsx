import Link from 'next/link';
import { posts, lessons } from '@/data/content';
import NewsGrid from '@/components/NewsGrid';
import EduGrid from '@/components/EduGrid';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <div className="hero">
        <p className="hero-kicker">Prediction Market Intelligence</p>
        <h1>What does the<br />crowd <em>believe</em>?</h1>
        <p className="hero-sub">
          Real-time odds, news, and education across every major prediction market — from Polymarket to Kalshi.
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
        <div className="section-label">Live markets</div>
        <div className="market-header-row">
          <span>Question</span>
          <span className="col-right">Platform</span>
          <span className="col-right">Probability</span>
          <span className="col-right">7d</span>
        </div>
        <div className="market-list">
          <a className="market-row" href="https://polymarket.com" target="_blank" rel="noopener">
            <div>
              <div className="market-row-title">Will Bitcoin exceed $150,000 before end of 2025?</div>
              <div className="market-platform-tag">$28.4M volume</div>
            </div>
            <div className="market-vol">Polymarket · Crypto</div>
            <div className="market-prob prob-yes">73%</div>
            <div className="market-trend trend-up">↑ +4.8%</div>
          </a>
          <a className="market-row" href="https://kalshi.com" target="_blank" rel="noopener">
            <div>
              <div className="market-row-title">Will the Fed cut rates at the March 2025 FOMC meeting?</div>
              <div className="market-platform-tag">$6.1M volume</div>
            </div>
            <div className="market-vol">Kalshi · Macro</div>
            <div className="market-prob prob-no">41%</div>
            <div className="market-trend trend-dn">↓ −17%</div>
          </a>
          <a className="market-row" href="https://polymarket.com" target="_blank" rel="noopener">
            <div>
              <div className="market-row-title">Will GPT-5 be released before July 2025?</div>
              <div className="market-platform-tag">$3.8M volume</div>
            </div>
            <div className="market-vol">Polymarket · AI</div>
            <div className="market-prob prob-yes">67%</div>
            <div className="market-trend trend-up">↑ +5.3%</div>
          </a>
          <a className="market-row" href="https://polymarket.com" target="_blank" rel="noopener">
            <div>
              <div className="market-row-title">Will there be a Gaza ceasefire agreement before June 2025?</div>
              <div className="market-platform-tag">$9.7M volume</div>
            </div>
            <div className="market-vol">Polymarket · Geopolitics</div>
            <div className="market-prob prob-yes">54%</div>
            <div className="market-trend trend-up">↑ +2.1%</div>
          </a>
          <a className="market-row" href="https://kalshi.com" target="_blank" rel="noopener">
            <div>
              <div className="market-row-title">Will US CPI exceed 4% YoY in any month of 2025?</div>
              <div className="market-platform-tag">$2.2M volume</div>
            </div>
            <div className="market-vol">Kalshi · Economy</div>
            <div className="market-prob prob-no">22%</div>
            <div className="market-trend trend-dn">↓ −1.2%</div>
          </a>
        </div>
      </div>

      {/* NEWS */}
      <div className="section" id="news">
        <div className="section-label">Latest intelligence</div>
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
