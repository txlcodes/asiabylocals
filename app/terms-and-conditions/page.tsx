import { Metadata } from 'next';
import TermsClient from '@/components/TermsClient';

export const metadata: Metadata = {
  title: 'Terms and Conditions | AsiaByLocals',
  description: 'AsiaByLocals terms and conditions for using our platform and booking tours.',
  alternates: { canonical: 'https://www.asiabylocals.com/terms-and-conditions' },
};

export default function TermsPage() {
  return <TermsClient />;
}
