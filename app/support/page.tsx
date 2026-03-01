import { Metadata } from 'next';
import SupportClient from '@/components/SupportClient';

export const metadata: Metadata = {
  title: 'Support | AsiaByLocals',
  description: 'Get help and support for your AsiaByLocals bookings and tours.',
  alternates: { canonical: 'https://www.asiabylocals.com/support' },
};

export default function SupportPage() {
  return <SupportClient />;
}
