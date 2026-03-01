import { Metadata } from 'next';
import SafetyClient from '@/components/SafetyClient';

export const metadata: Metadata = {
  title: 'Safety Guidelines | AsiaByLocals',
  description: 'Safety guidelines for travelers booking tours with AsiaByLocals.',
  alternates: { canonical: 'https://www.asiabylocals.com/safety-guidelines' },
};

export default function SafetyPage() {
  return <SafetyClient />;
}
