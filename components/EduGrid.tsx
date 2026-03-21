import Link from 'next/link';
import { Lesson } from '@/data/content';

export default function EduGrid({ lessons }: { lessons: Lesson[] }) {
  return (
    <div className="edu-grid">
      {lessons.map((l) => (
        <Link key={l.id} href={`/lesson/${l.id}`} className="edu-card">
          <div className="edu-num">{l.num.split(' ')[0]}</div>
          <div className="edu-title">{l.title}</div>
          <div className="edu-desc">{l.desc}</div>
          <div className="edu-level">{l.readTime} →</div>
        </Link>
      ))}
    </div>
  );
}
