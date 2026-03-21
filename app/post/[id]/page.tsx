import { notFound } from 'next/navigation';
import Link from 'next/link';
import { posts } from '@/data/content';

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.id }));
}

export default function PostPage({ params }: { params: { id: string } }) {
  const post = posts.find((p) => p.id === params.id);
  if (!post) notFound();

  return (
    <>
      <div className="article-nav">
        <Link href="/" className="logo">Or<em>a</em>cle</Link>
        <Link href="/#news" className="back-link">← Back to News</Link>
      </div>
      <div className="article-container">
        <div className={`article-tag news-tag ${post.tagClass}`}>{post.tag}</div>
        <h1 className="article-headline">{post.headline}</h1>
        <div className="article-meta-line">{post.source} · {post.time}</div>
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      </div>
    </>
  );
}
