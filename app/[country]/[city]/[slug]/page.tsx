import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AGRA_INFO_SLUGS, DELHI_INFO_SLUGS } from '@/lib/constants';
import TourDetailClient from '@/components/TourDetailClient';
import CityInfoClient from '@/components/CityInfoClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

interface Props {
  params: Promise<{ country: string; city: string; slug: string }>;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function isInfoSlug(city: string, slug: string): boolean {
  const c = city.toLowerCase();
  if (c === 'agra') return AGRA_INFO_SLUGS.includes(slug);
  if (c === 'delhi') return DELHI_INFO_SLUGS.includes(slug);
  return false;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, city, slug } = await params;
  const cityName = capitalize(city);

  if (isInfoSlug(city, slug)) {
    const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      title: `${title} | ${cityName} Guide | AsiaByLocals`,
      description: `Essential guide: ${title}. Everything you need to know before visiting ${cityName}.`,
      alternates: {
        canonical: `https://www.asiabylocals.com/${country.toLowerCase()}/${city.toLowerCase()}/${slug}`,
      },
    };
  }

  // Tour detail page — fetch tour for metadata
  try {
    const res = await fetch(`${API_URL}/api/tours/city/${encodeURIComponent(cityName)}/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const tour = await res.json();
      return {
        title: `${tour.title} in ${cityName} | AsiaByLocals`,
        description: tour.shortDescription || `Book ${tour.title} in ${cityName} with a licensed local guide. Authentic experience with AsiaByLocals.`,
        alternates: {
          canonical: `https://www.asiabylocals.com/${country.toLowerCase()}/${city.toLowerCase()}/${slug}`,
        },
        openGraph: {
          title: `${tour.title} in ${cityName} | AsiaByLocals`,
          description: tour.shortDescription || `Book ${tour.title} in ${cityName}`,
          images: tour.images?.[0] ? [{ url: tour.images[0] }] : [],
        },
      };
    }
  } catch (e) {}

  return {
    title: `${cityName} Tour | AsiaByLocals`,
    description: `Book tours in ${cityName} with licensed local guides.`,
  };
}

export default async function SlugPage({ params }: Props) {
  const { country, city, slug } = await params;
  const cityName = capitalize(city);
  const countryName = capitalize(country);

  // City info page
  if (isInfoSlug(city, slug)) {
    return <CityInfoClient country={countryName} city={cityName} slug={slug} />;
  }

  // Tour detail page
  let tour = null;
  try {
    const res = await fetch(`${API_URL}/api/tours/city/${encodeURIComponent(cityName)}/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      tour = await res.json();
    }
  } catch (e) {
    console.error('Failed to fetch tour:', e);
  }

  if (!tour) {
    notFound();
  }

  return <TourDetailClient tour={tour} city={cityName} country={countryName} />;
}
