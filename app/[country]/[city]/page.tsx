import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPageClient from '@/components/CityPageClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

interface Props {
  params: Promise<{ country: string; city: string }>;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, city } = await params;
  const cityName = capitalize(city);
  const countryName = capitalize(country);

  return {
    title: `Guided Tours & Things to Do in ${cityName} | AsiaByLocals`,
    description: `Discover the best tours in ${cityName} with licensed local guides. Taj Mahal sunrise tours, heritage walks, food tours & day trips. Book authentic experiences in ${cityName}, ${countryName}.`,
    alternates: {
      canonical: `https://www.asiabylocals.com/${country.toLowerCase()}/${city.toLowerCase()}`,
    },
    openGraph: {
      title: `Guided Tours & Things to Do in ${cityName} | AsiaByLocals`,
      description: `Discover the best tours in ${cityName} with licensed local guides.`,
      url: `https://www.asiabylocals.com/${country.toLowerCase()}/${city.toLowerCase()}`,
      siteName: 'AsiaByLocals',
      type: 'website',
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { country, city } = await params;
  const cityName = capitalize(city);
  const countryName = capitalize(country);

  let tours: any[] = [];
  try {
    const res = await fetch(`${API_URL}/api/tours?city=${encodeURIComponent(cityName)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      tours = data.tours || data || [];
    }
  } catch (e) {
    console.error('Failed to fetch tours:', e);
  }

  return <CityPageClient tours={tours} city={cityName} country={countryName} />;
}
