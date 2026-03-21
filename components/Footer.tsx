import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer>
        <div>
          <div className="footer-logo">Or<em>a</em>cle</div>
          <p className="footer-desc">The cleanest way to follow prediction markets — odds, news, education, and platform data in one place.</p>
        </div>
        <div>
          <div className="footer-col-title">Markets</div>
          <ul className="footer-links">
            <li><Link href="/#markets">Live odds</Link></li>
            <li><Link href="/#markets">Trending</Link></li>
            <li><Link href="/#markets">By category</Link></li>
            <li><Link href="/#markets">Arbitrage scanner</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Learn</div>
          <ul className="footer-links">
            <li><Link href="/lesson/what-are-prediction-markets">Beginner guide</Link></li>
            <li><Link href="/#platforms">Platform reviews</Link></li>
            <li><Link href="/#learn">Research library</Link></li>
            <li><Link href="/#learn">Glossary</Link></li>
          </ul>
        </div>
        <div>
          <div className="footer-col-title">Data</div>
          <ul className="footer-links">
            <li><Link href="#">API docs</Link></li>
            <li><Link href="#">Historical data</Link></li>
            <li><Link href="/newsletter">Newsletter</Link></li>
            <li><Link href="#">Discord</Link></li>
          </ul>
        </div>
      </footer>
      <div className="footer-bottom">
        <span>© 2026 Oracle</span>
        <span>Not financial advice</span>
      </div>
    </>
  );
}
