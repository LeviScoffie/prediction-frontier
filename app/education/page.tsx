import { lessons } from '@/data/content';
import EducationPageClient from './page-client';

export const revalidate = 60;

export const metadata = {
  title: 'Learn',
  description: 'Master prediction market mechanics, strategies, and arbitrage techniques with our comprehensive guides.',
};

export default function EducationPage() {
  return <EducationPageClient lessons={lessons} />;
}
