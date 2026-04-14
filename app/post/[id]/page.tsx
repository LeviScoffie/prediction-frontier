import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { posts } from '@/data/content';

export function generateStaticParams() {
  return posts.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const post = posts.find((p) => p.id === params.id);
  if (!post) return {};
  return {
    title: post.headline,
    description: `${post.tag} · ${post.time} — ${post.headline}`,
    openGraph: {
      title: `${post.headline} | Prediction Frontier`,
      description: post.headline,
      url: `/post/${post.id}`,
    },
    twitter: {
      title: `${post.headline} | Prediction Frontier`,
      description: post.headline,
    },
  };
}

export default function PostPage({ params }: { params: { id: string } }) {
  const post = posts.find((p) => p.id === params.id);
  if (!post) notFound();

  return (
    <>
      <div className="article-nav">
        <Link href="/" className="logo">Prediction<em>Frontier</em></Link>
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
