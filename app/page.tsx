import { Metadata } from 'next';
import HomepageClient from '@/components/HomepageClient';

export const metadata: Metadata = {
  title: 'AsiaByLocals - Authentic Local Tours & Cultural Experiences Across Asia | Expert Local Guides',
  description: 'Discover authentic local tours and cultural experiences across Asia. Book tours with verified local guides in India, Japan, Thailand, Vietnam, Indonesia, and more. Expert-led cultural experiences, food tours, heritage walks, and immersive travel adventures.',
  alternates: {
    canonical: 'https://www.asiabylocals.com',
  },
};

export default function HomePage() {
  return <HomepageClient />;
}
