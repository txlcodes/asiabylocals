import { Metadata } from 'next';
import PrivacyPolicyClient from '@/components/PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | AsiaByLocals',
  description: 'AsiaByLocals privacy policy. How we collect, use, and protect your personal information.',
  alternates: { canonical: 'https://www.asiabylocals.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
