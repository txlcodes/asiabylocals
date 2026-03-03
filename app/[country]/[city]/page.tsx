import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityPageClient from '@/components/CityPageClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

// Cache the rendered page for 60s — bypasses the 2MB fetch cache limit
export const revalidate = 60;

interface Props {
  params: Promise<{ country: string; city: string }>;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// City-specific SEO titles and descriptions (must match client component)
const CITY_META: Record<string, { title: string; description: string }> = {
  'Agra': {
    title: 'Agra Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Agra with licensed local guides. Taj Mahal sunrise tours, heritage walks, food tours & day trips.',
  },
  'Delhi': {
    title: 'Delhi Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Delhi with licensed local guides. Red Fort tours, Old Delhi heritage walks, street food tours & cultural experiences.',
  },
  'Jaipur': {
    title: 'Jaipur Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Jaipur with licensed local guides. City Palace tours, Hawa Mahal visits, heritage walks & authentic Rajasthan experiences.',
  },
  'Mumbai': {
    title: 'Mumbai Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Mumbai with licensed local guides. Gateway of India tours, street food walks, heritage tours & cultural experiences.',
  },
  'Goa': {
    title: 'Goa Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Goa with licensed local guides. Beach tours, Portuguese heritage walks, spice plantation visits & cultural experiences.',
  },
  'Bangkok': {
    title: 'Bangkok Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Bangkok with licensed local guides. Grand Palace visits, canal tours, street food walks & floating markets.',
  },
  'Phuket': {
    title: 'Phuket Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Phuket with licensed local guides. Phi Phi Islands, Phang Nga Bay cruises, Big Buddha visits & Old Town tours.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country, city } = await params;
  const cityName = capitalize(city);
  const countryName = capitalize(country);
  const meta = CITY_META[cityName];
  const title = meta?.title || `Guided Tours & Things to Do in ${cityName} | AsiaByLocals`;
  const description = meta?.description || `Discover the best tours in ${cityName} with licensed local guides. Book authentic experiences in ${cityName}, ${countryName}.`;
  const noIndex = !['Agra', 'Delhi', 'Jaipur'].includes(cityName);

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.asiabylocals.com/${country.toLowerCase()}/${city.toLowerCase()}`,
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
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
    const res = await fetch(
      `${API_URL}/api/public/tours?country=${encodeURIComponent(countryName)}&city=${encodeURIComponent(cityName)}&status=approved`,
      { cache: 'no-store' }  // Don't cache raw API (can exceed 2MB); page-level ISR handles caching
    );
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        let toursArray: any[] = [];
        if (Array.isArray(data.tours)) {
          toursArray = data.tours;
        } else if (data.tours && typeof data.tours === 'object') {
          if (Array.isArray(data.tours.tours)) {
            toursArray = data.tours.tours;
          }
        }
        // Only send fields the listing page actually uses — keeps payload small & ISR-cacheable
        tours = toursArray.map((tour: any) => ({
          id: tour.id,
          title: tour.title,
          slug: tour.slug || `tour-${tour.id}`,
          city: tour.city,
          country: tour.country,
          category: tour.category,
          duration: tour.duration,
          pricePerPerson: tour.pricePerPerson,
          currency: tour.currency,
          status: tour.status,
          shortDescription: tour.shortDescription,
          included: tour.included,
          meetingPoint: tour.meetingPoint,
          tourTypes: tour.tourTypes,
          // Only keep Cloudinary URLs, drop base64 blobs
          images: Array.isArray(tour.images)
            ? tour.images
                .map((img: any) => (typeof img === 'string' && img.startsWith('data:') ? '' : img))
                .filter(Boolean)
            : tour.images,
          // Slim down options — listing only needs price info
          options: Array.isArray(tour.options)
            ? tour.options.map((opt: any) => ({
                title: opt.title,
                pricePerPerson: opt.pricePerPerson,
                groupPricingTiers: opt.groupPricingTiers,
              }))
            : tour.options,
        }));
      }
    }
  } catch (e) {
    console.error('Failed to fetch tours:', e);
  }

  return <CityPageClient tours={tours} city={cityName} country={countryName} />;
}
