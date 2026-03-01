import { Metadata } from 'next';
import BookingConfirmationClient from '@/components/BookingConfirmationClient';

export const metadata: Metadata = {
  title: 'Booking Confirmed | AsiaByLocals',
  robots: { index: false },
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingConfirmationPage({ params }: Props) {
  const { id } = await params;
  return <BookingConfirmationClient bookingId={id} />;
}
