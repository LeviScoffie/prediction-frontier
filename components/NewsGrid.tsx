import Link from 'next/link';
import { Post } from '@/data/content';

export default function NewsGrid({ posts }: { posts: Post[] }) {
  const featured = posts.find((p) => p.featured);
  const secondary = posts.filter((p) => !p.featured);

  return (
    <div>
      {/* Featured — full-width editorial */}
      {featured && (
        <Link href={`/post/${featured.id}`} className="news-featured">
          <div className={`news-tag ${featured.tagClass}`}>{featured.tag}</div>
          <div className="news-headline">{featured.headline}</div>
          <div className="news-meta">{featured.source} · {featured.time}</div>
        </Link>
      )}

      {/* Secondary — 2×2 grid */}
      <div className="news-secondary">
        {secondary.map((p) => (
          <Link key={p.id} href={`/post/${p.id}`} className="news-card">
            <div className={`news-tag ${p.tagClass}`}>{p.tag}</div>
            <div className="news-headline">{p.headline}</div>
            <div className="news-meta">{p.source} · {p.time}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
