import { posts, lessons } from '@/data/content';

const BASE = 'https://predictionfrontier.com';

function url(path: string, priority: string, changefreq: string) {
  return `
  <url>
    <loc>${BASE}${path}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export function GET() {
  const staticPages = [
    url('/', '1.0', 'hourly'),
    url('/arbitrage', '0.9', 'hourly'),
    url('/newsletter', '0.7', 'monthly'),
  ];

  const postPages = posts.map((p) => url(`/post/${p.id}`, '0.6', 'weekly'));
  const lessonPages = lessons.map((l) => url(`/lesson/${l.id}`, '0.8', 'monthly'));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...postPages, ...lessonPages].join('')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
