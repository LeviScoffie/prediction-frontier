import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: 'Platforms',
  description: 'Compare prediction market platforms: Polymarket, Kalshi, and Manifold. Fees, markets, and features.',
};

interface PlatformSpec {
  name: string;
  tagline: string;
  url: string;
  specs: Array<[string, string]>;
}

const platforms: PlatformSpec[] = [
  {
    name: 'Polymarket',
    tagline: 'Decentralized · Polygon · Global',
    url: 'https://polymarket.com',
    specs: [
      ['Total Volume', '$2.1B+'],
      ['Active Markets', '12,400+'],
      ['Currency', 'USDC'],
      ['Blockchain', 'Polygon (L2)'],
      ['US Access', 'Restricted (VPN)'],
      ['Fees', '2% on winnings'],
      ['KYC Required', 'Basic (email)'],
      ['Withdrawal', 'Crypto wallet'],
      ['Market Creation', 'Open (with bond)'],
      ['Speed', 'Milliseconds (on-chain)'],
      ['Custody', 'Self-custodial'],
      ['Best For', 'Global traders, crypto native'],
    ],
  },
  {
    name: 'Kalshi',
    tagline: 'CFTC-regulated · USD · US legal',
    url: 'https://kalshi.com',
    specs: [
      ['Total Volume', '$380M+'],
      ['Active Markets', '3,200+'],
      ['Currency', 'USD'],
      ['Blockchain', 'None (centralized)'],
      ['US Access', 'Full legal'],
      ['Fees', '1–7% per contract'],
      ['KYC Required', 'Full (CFTC mandated)'],
      ['Withdrawal', 'Bank account'],
      ['Market Creation', 'Limited (curated)'],
      ['Speed', 'Seconds (order book)'],
      ['Custody', 'Hosted (with custodian)'],
      ['Best For', 'US traders, institutional'],
    ],
  },
  {
    name: 'Manifold Markets',
    tagline: 'Community · Play money + Real money · Open',
    url: 'https://manifold.markets',
    specs: [
      ['Total Volume', 'M$2.4B (play) / $50M+ (USD)'],
      ['Active Markets', '40,000+'],
      ['Currency', 'Mana (M$) / USD'],
      ['Blockchain', 'Optional (Polygon)'],
      ['US Access', 'Open to all'],
      ['Fees', 'None'],
      ['KYC Required', 'None for play money'],
      ['Withdrawal', 'Bank account (USD bridge)'],
      ['Market Creation', 'Anyone can create'],
      ['Speed', 'Milliseconds (AMM)'],
      ['Custody', 'Hosted / self-custodial'],
      ['Best For', 'Community forecasters, niche events'],
    ],
  },
];

export default function PlatformsPage() {
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
        <h1>Prediction Market Platforms</h1>
        <p className="page-subtitle">Complete comparison of the three major prediction markets</p>
      </div>

      {/* Platform cards */}
      <div className="section" style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <div className="platform-grid" style={{ marginBottom: '60px' }}>
          {platforms.map((p) => (
            <div key={p.name} className="platform-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1 }}>
                <div className="platform-name">{p.name}</div>
                <div className="platform-tagline">{p.tagline}</div>
              </div>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mkt-cta-btn"
                style={{ marginTop: '20px' }}
              >
                Visit {p.name} →
              </a>
            </div>
          ))}
        </div>

        {/* Detailed comparison table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
            lineHeight: '1.6',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{
                  padding: '12px',
                  textAlign: 'left',
                  color: 'var(--ink2)',
                  fontWeight: '500',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Specification
                </th>
                {platforms.map((p) => (
                  <th
                    key={p.name}
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      color: 'var(--ink2)',
                      fontWeight: '500',
                      fontSize: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Get all unique spec categories */}
              {Array.from(
                new Set(platforms.flatMap((p) => p.specs.map((s) => s[0])))
              ).map((specCategory) => (
                <tr key={specCategory} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{
                    padding: '12px',
                    color: 'var(--ink3)',
                    fontWeight: '500',
                    fontSize: '13px',
                  }}>
                    {specCategory}
                  </td>
                  {platforms.map((p) => {
                    const specValue = p.specs.find((s) => s[0] === specCategory)?.[1];
                    return (
                      <td
                        key={p.name}
                        style={{
                          padding: '12px',
                          color: 'var(--ink)',
                        }}
                      >
                        {specValue || '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key insights */}
        <div style={{ marginTop: '60px', padding: '20px', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '12px' }}>Key Insights</h2>
          <ul style={{ color: 'var(--ink2)', fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
            <li><strong>Polymarket</strong> is the largest by volume but restricted for US users without VPN.</li>
            <li><strong>Kalshi</strong> is the only CFTC-regulated option and the only one fully legal for US residents.</li>
            <li><strong>Manifold</strong> has the most markets and lowest barriers to entry, but play-money mode dominates.</li>
            <li>Cross-platform arbitrage opportunities arise when all three platforms list similar events at different odds.</li>
            <li>Fees and speed vary significantly — Kalshi's model is more traditional, while Polymarket and Manifold use on-chain mechanics.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
