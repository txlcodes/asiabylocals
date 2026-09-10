// GENERATED to match lib/cityCountryMap.ts in the frontend repo.
//
// A supplier used to be able to pick a city the site cannot route (Yokohama,
// Nikko, Hoi An, Ubud and 71 others). An unmapped city publishes under /india/,
// so a Japanese operator's Nikko tour would have gone live as an India tour.
// UAE was missing entirely despite 101 live tours, and Hakone and Mount Fuji
// were missing from Japan.
//
// Every city name here slugifies exactly to its CITY_URL_MAP key. If you add a
// city, add it to CITY_URL_MAP first, or it will not route.

export const COUNTRIES = [
    { name: 'Japan', code: 'JP' },
    { name: 'Sri Lanka', code: 'LK' },
    { name: 'India', code: 'IN' },
    { name: 'Thailand', code: 'TH' },
    { name: 'UAE', code: 'AE' },
    { name: 'Nepal', code: 'NP' },
    { name: 'Cambodia', code: 'KH' },
    { name: 'China', code: 'CN' },
    { name: 'Hong Kong', code: 'HK' },
    { name: 'Indonesia', code: 'ID' },
    { name: 'Malaysia', code: 'MY' },
    { name: 'Myanmar', code: 'MM' },
    { name: 'Philippines', code: 'PH' },
    { name: 'Singapore', code: 'SG' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Taiwan', code: 'TW' },
    { name: 'Vietnam', code: 'VN' },
];

export const COUNTRY_CITIES: Record<string, string[]> = {
    'Japan': ['Hakone', 'Hiroshima', 'Kyoto', 'Mount Fuji', 'Nagoya', 'Nara', 'Osaka', 'Sapporo', 'Tokyo'],
    'Sri Lanka': ['Bentota', 'Colombo', 'Ella', 'Galle', 'Kandy', 'Mirissa', 'Negombo', 'Nuwara Eliya', 'Sigiriya'],
    'India': ['Agra', 'Amritsar', 'Aurangabad', 'Bengaluru', 'Bikaner', 'Delhi', 'Goa', 'Gwalior', 'Jaipur', 'Jaisalmer', 'Jodhpur', 'Kashmir', 'Khajuraho', 'Kolkata', 'Leh Ladakh', 'Mathura', 'Mumbai', 'Mysore', 'Rishikesh', 'Udaipur', 'Varanasi'],
    'Thailand': ['Bangkok', 'Chiang Mai', 'Krabi', 'Pattaya', 'Phuket'],
    'UAE': ['Abu Dhabi', 'Dubai'],
    'Nepal': ['Bhaktapur', 'Chitwan', 'Kathmandu', 'Lumbini', 'Pokhara'],
    'Cambodia': ['Siem Reap'],
    'China': ['Beijing', 'Shanghai'],
    'Hong Kong': ['Hongkong'],
    'Indonesia': ['Bali', 'Yogyakarta'],
    'Malaysia': ['Kuala Lumpur', 'Penang'],
    'Myanmar': ['Yangon'],
    'Philippines': ['Cebu', 'Manila'],
    'Singapore': ['Singapore'],
    'South Korea': ['Busan', 'Seoul'],
    'Taiwan': ['Taipei'],
    'Vietnam': ['Hanoi', 'Ho Chi Minh City'],
};
