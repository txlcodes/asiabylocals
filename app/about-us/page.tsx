import { Metadata } from 'next';
import AboutUsClient from '@/components/AboutUsClient';

export const metadata: Metadata = {
  title: 'About Us | AsiaByLocals',
  description: 'Learn about AsiaByLocals - empowering local experts across Asia to share their heritage directly with curious travelers.',
  alternates: { canonical: 'https://www.asiabylocals.com/about-us' },
};

export default function AboutUsPage() {
  return <AboutUsClient />;
}
