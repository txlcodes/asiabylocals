const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

// Fetch tours for a city
export async function fetchCityTours(city: string) {
  return fetchAPI(`/api/tours?city=${encodeURIComponent(city)}`);
}

// Fetch single tour by slug
export async function fetchTourBySlug(city: string, slug: string) {
  return fetchAPI(`/api/tours/city/${encodeURIComponent(city)}/slug/${encodeURIComponent(slug)}`);
}

// Fetch tour by ID
export async function fetchTourById(id: string) {
  return fetchAPI(`/api/tours/${id}`);
}
