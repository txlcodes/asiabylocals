import { Metadata } from 'next';
import { Suspense } from 'react';
import PaymentCallbackClient from '@/components/PaymentCallbackClient';

export const metadata: Metadata = {
  title: 'Payment Processing | AsiaByLocals',
  robots: { index: false },
};

export default function PaymentCallbackPage() {
  return (
    <Suspense>
      <PaymentCallbackClient />
    </Suspense>
  );
}
