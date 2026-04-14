'use client';

import { useState } from 'react';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setSubmitted(true);
      setEmail('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="newsletter-container">
      <div className="nl-label">Weekly intelligence</div>
      <h1 className="nl-title">The Frontier<br /><em>Briefing</em></h1>
      <p className="nl-desc">
        Every Monday: the most important prediction market moves, the signal behind the noise, and one deep-dive into a market that deserves attention.
      </p>

      {submitted ? (
        <div className="nl-success">You&apos;re in. First issue lands Monday.</div>
      ) : (
        <form className="nl-form" onSubmit={handleSubmit}>
          <input
            className="nl-input"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button className="nl-btn" type="submit" disabled={loading}>
            {loading ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      )}

      {error && <div style={{ color: 'var(--red)', fontSize: '13px', marginTop: '8px' }}>{error}</div>}

      <div className="nl-perks">
        <div className="nl-perk">
          <div className="nl-perk-title">Market moves</div>
          <div className="nl-perk-desc">The week&apos;s biggest probability shifts, explained with context, not just the number.</div>
        </div>
        <div className="nl-perk">
          <div className="nl-perk-title">Deep dive</div>
          <div className="nl-perk-desc">One undertracked market or platform development we think deserves serious attention.</div>
        </div>
        <div className="nl-perk">
          <div className="nl-perk-title">Data edge</div>
          <div className="nl-perk-desc">Cross-platform discrepancies, arbitrage setups, and historical resolution data worth knowing.</div>
        </div>
      </div>
    </div>
  );
}
