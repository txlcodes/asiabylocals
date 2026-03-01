import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TourByIdPage({ params }: Props) {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/api/tours/${id}`);
    if (res.ok) {
      const tour = await res.json();
      if (tour.city && tour.slug) {
        redirect(`/india/${tour.city.toLowerCase()}/${tour.slug}`);
      }
    }
  } catch (e) {
    // Fall through to home redirect
  }
  redirect('/');
}
