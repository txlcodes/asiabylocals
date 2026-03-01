import { Metadata } from 'next';
import VerifyEmailClient from '@/components/VerifyEmailClient';

export const metadata: Metadata = {
  title: 'Verify Email | AsiaByLocals',
  robots: { index: false },
};

export default function VerifyEmailPage() {
  return <VerifyEmailClient />;
}
