import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="/" className="logo">
        Or<em>a</em>cle
      </Link>
      <ul className="nav-links">
        <li><Link href="/#markets">Markets</Link></li>
        <li><Link href="/#news">News</Link></li>
        <li><Link href="/#learn">Learn</Link></li>
        <li><Link href="/#platforms">Platforms</Link></li>
      </ul>
      <div className="nav-right">
        <Link href="/newsletter" className="nav-subscribe">Subscribe →</Link>
      </div>
    </nav>
  );
}
