import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.asiabylocals.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages = [
    '', '/about-us', '/privacy-policy', '/terms-and-conditions',
    '/safety-guidelines', '/support', '/supplier',
    '/india/agra', '/india/delhi',
  ].map(path => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  // Agra info pages
  const agraInfoPages = [
    'things-to-do-in-agra', 'places-to-visit-in-agra', '1-day-agra-itinerary',
    'taj-mahal-ticket-price-2026', 'taj-mahal-opening-time', 'is-taj-mahal-closed-on-friday',
    'agra-travel-guide-2026',
  ].map(slug => ({
    url: `${BASE_URL}/india/agra/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Delhi info pages
  const delhiInfoPages = [
    'delhi-travel-guide-2026', 'red-fort', 'qutub-minar', 'humayuns-tomb',
    'india-gate', 'things-to-do-in-delhi', 'delhi-1-day-itinerary',
  ].map(slug => ({
    url: `${BASE_URL}/india/delhi/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Dynamic tour pages from API
  let tourPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/tours`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const tours = data.tours || data || [];
      tourPages = tours
        .filter((t: any) => t.slug && t.city)
        .map((t: any) => ({
          url: `${BASE_URL}/india/${t.city.toLowerCase()}/${t.slug}`,
          lastModified: new Date(t.updatedAt || t.createdAt || Date.now()),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        }));
    }
  } catch (e) {
    console.error('Sitemap: failed to fetch tours', e);
  }

  return [...staticPages, ...agraInfoPages, ...delhiInfoPages, ...tourPages];
}
