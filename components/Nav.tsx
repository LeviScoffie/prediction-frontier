import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="/" className="logo">
        Prediction<em>Frontier</em>
      </Link>
      <ul className="nav-links">
        <li><Link href="/#markets">Markets</Link></li>
        <li><Link href="/#news">Signals</Link></li>
        <li><Link href="/arbitrage">Arbitrage</Link></li>
        <li><Link href="/#learn">Education</Link></li>
        <li><Link href="/#platforms">Platforms</Link></li>
      </ul>
      <div className="nav-right">
        <Link href="/newsletter" className="nav-subscribe">Join →</Link>
      </div>
    </nav>
  );
}
