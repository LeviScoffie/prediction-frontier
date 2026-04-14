import { posts } from '@/data/content';
import SignalsPageClient from './page-client';

export const revalidate = 60;

export const metadata = {
  title: 'Market Signals',
  description: 'Latest insights and analysis on prediction market movements. Real-time market intelligence and signals.',
};

export default function SignalsPage() {
  return <SignalsPageClient posts={posts} />;
}
