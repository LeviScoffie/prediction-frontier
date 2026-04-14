export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: https://predictionfrontier.com/sitemap.xml
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
