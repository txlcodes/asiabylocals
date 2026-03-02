import { Metadata } from 'next';
import { Suspense } from 'react';
import BookingClient from '@/components/BookingClient';

export const metadata: Metadata = {
  title: 'Complete Your Booking | AsiaByLocals',
  robots: { index: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: Props) {
  const { id } = await params;
  return (
    <Suspense>
      <BookingClient bookingId={id} />
    </Suspense>
  );
}
