import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { lessons } from '@/data/content';

export function generateStaticParams() {
  return lessons.map((l) => ({ id: l.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const lesson = lessons.find((l) => l.id === params.id);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.desc,
    openGraph: {
      title: `${lesson.title} | Prediction Frontier`,
      description: lesson.desc,
      url: `/lesson/${lesson.id}`,
    },
    twitter: {
      title: `${lesson.title} | Prediction Frontier`,
      description: lesson.desc,
    },
  };
}

export default function LessonPage({ params }: { params: { id: string } }) {
  const lesson = lessons.find((l) => l.id === params.id);
  if (!lesson) notFound();

  return (
    <>
      <div className="article-nav">
        <Link href="/" className="logo">Prediction<em>Frontier</em></Link>
        <Link href="/#learn" className="back-link">← Back to Learn</Link>
      </div>
      <div className="article-container">
        <div className="edu-num" style={{ marginBottom: '16px' }}>{lesson.num}</div>
        <h1 className="article-headline">{lesson.title}</h1>
        <div className="article-meta-line">{lesson.readTime}</div>
        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: lesson.body }}
        />
      </div>
    </>
  );
}
