import { Country, AttractionCard, SignatureExperience } from './types';

export const CITIES: Country[] = [
  // Live cities - shown first
  { id: 'agra', name: 'Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600', localAngle: 'Mughal Heritage', guidesCount: 112 },
  { id: 'delhi', name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600', localAngle: 'Historic Capital', guidesCount: 245 },
  { id: 'jaipur', name: 'Jaipur', image: '/jaipur-hero.jpg', localAngle: 'Pink City', guidesCount: 189 },
  // Other cities
  { id: 'tokyo', name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600', localAngle: 'Neon & Tradition', guidesCount: 342 },
  { id: 'kyoto', name: 'Kyoto', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600', localAngle: 'Zen & Temples', guidesCount: 184 },
  { id: 'bali', name: 'Ubud', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600', localAngle: 'Spirit & Jungle', guidesCount: 256 },
  { id: 'bangkok', name: 'Bangkok', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600', localAngle: 'Street Food Capital', guidesCount: 421 },
  { id: 'dubai', name: 'Dubai', image: '/dubai-hero.jpg', localAngle: 'Modern Oasis', guidesCount: 287 },
  { id: 'singapore', name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=600', localAngle: 'Garden City', guidesCount: 234 },
  { id: 'seoul', name: 'Seoul', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=600', localAngle: 'K-Pop & Palaces', guidesCount: 312 },
  { id: 'hongkong', name: 'Hong Kong', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&q=80&w=600', localAngle: 'Skyline & Dim Sum', guidesCount: 298 },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', image: '/kuala-lumpur-hero.jpg', localAngle: 'Twin Towers', guidesCount: 156 },
  { id: 'taipei', name: 'Taipei', image: '/taipei-hero.jpg', localAngle: 'Night Markets', guidesCount: 189 },
  { id: 'mumbai', name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=600', localAngle: 'Bollywood & Bazaars', guidesCount: 267 },
  { id: 'osaka', name: 'Osaka', image: '/osaka-hero.jpg', localAngle: 'Food Paradise', guidesCount: 198 },
  // Additional Asian cities
  { id: 'phuket', name: 'Phuket', image: '/phuket-hero.jpg', localAngle: 'Beaches & Nightlife', guidesCount: 312 },
  { id: 'chiang-mai', name: 'Chiang Mai', image: '/chiang-mai-hero.jpg', localAngle: 'Temples & Mountains', guidesCount: 198 },
  { id: 'hanoi', name: 'Hanoi', image: '/hanoi-hero.jpg', localAngle: 'Old Quarter & Street Food', guidesCount: 245 },
  { id: 'ho-chi-minh-city', name: 'Ho Chi Minh City', image: '/ho-chi-minh-city-hero.jpg', localAngle: 'History & Markets', guidesCount: 267 },
  { id: 'beijing', name: 'Beijing', image: '/beijing-hero.jpg', localAngle: 'Great Wall & Forbidden City', guidesCount: 389 },
  { id: 'shanghai', name: 'Shanghai', image: '/shanghai-hero.jpg', localAngle: 'Skyline & The Bund', guidesCount: 356 },
  { id: 'manila', name: 'Manila', image: '/manila-hero.jpg', localAngle: 'Spanish Heritage & Culture', guidesCount: 223 },
  { id: 'cebu', name: 'Cebu', image: '/cebu-hero.jpg', localAngle: 'Beaches & Diving', guidesCount: 178 },
  { id: 'siem-reap', name: 'Siem Reap', image: '/siem-reap-hero.jpg', localAngle: 'Angkor Wat & Temples', guidesCount: 234 },
  { id: 'kathmandu', name: 'Kathmandu', image: '/kathmandu-hero.jpg', localAngle: 'Himalayan Gateway', guidesCount: 189 },
  { id: 'yangon', name: 'Yangon', image: '/yangon-hero.jpg', localAngle: 'Shwedagon Pagoda', guidesCount: 156 },
  { id: 'colombo', name: 'Colombo', image: '/colombo-hero.jpg', localAngle: 'Coastal Capital & Tea', guidesCount: 167 },
  { id: 'yogyakarta', name: 'Yogyakarta', image: '/yogyakarta-hero.jpg', localAngle: 'Borobudur & Javanese Culture', guidesCount: 201 },
  { id: 'penang', name: 'Penang', image: '/penang-hero.jpg', localAngle: 'UNESCO Heritage & Food', guidesCount: 189 },
  { id: 'busan', name: 'Busan', image: '/busan-hero.jpg', localAngle: 'Beaches & Seafood', guidesCount: 234 }
];

export const EXPERIENCES: SignatureExperience[] = [
  {
    id: 'e1',
    category: 'GUIDED TOUR',
    title: 'Kyoto: Gion District Evening Cultural Walk with Local Scholar',
    guideName: 'Akiko',
    guideAvatar: '',
    location: 'Kyoto',
    price: 45,
    rating: 4.9,
    reviews: 1240,
    duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
    isOriginal: true
  },
  {
    id: 'e2',
    category: 'STREET FOOD',
    title: 'Bangkok: Midnight Tuk-Tuk Food Tour with a Local Chef',
    guideName: 'Somchai',
    guideAvatar: '',
    location: 'Bangkok',
    price: 62,
    rating: 4.8,
    reviews: 2150,
    duration: '4 hours',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800',
    isOriginal: true
  },
  {
    id: 'e3',
    category: 'DAY TRIP',
    title: 'Bali: Sacred Water Temple Blessing & Organic Village Lunch',
    guideName: 'Wayan',
    guideAvatar: '',
    location: 'Ubud',
    price: 85,
    rating: 5.0,
    reviews: 890,
    duration: '6 hours',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800',
    isOriginal: true
  },
  {
    id: 'e4',
    category: 'HERITAGE WALK',
    title: 'Agra: Taj Mahal Sunrise Secrets with a Professional Historian',
    guideName: 'Arjun',
    guideAvatar: '',
    location: 'Agra',
    price: 32,
    rating: 4.9,
    reviews: 3420,
    duration: '2.5 hours',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
    isOriginal: true
  }
];

export const ATTRACTIONS: AttractionCard[] = [
  { id: 'a1', title: 'Fushimi Inari Shrine', location: 'Kyoto', whyLocal: 'Hidden pathways & ritual etiquette', experts: 45, image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&q=80&w=800' },
  { id: 'a2', title: 'Grand Palace', location: 'Bangkok', whyLocal: 'Decoding royal symbols with locals', experts: 82, image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800' },
  { id: 'a3', title: 'Angkor Wat', location: 'Siem Reap', whyLocal: 'Stories behind the bas-reliefs', experts: 120, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80&w=800' }
];

// Shared city locations/places - used in both tour creation and city pages
export const CITY_LOCATIONS: Record<string, string[]> = {
  // India
  'Delhi': [
    'India Gate', 'Jama Masjid', 'Qutb Minar', 'Red Fort', "Humayun's Tomb",
    'Lotus Temple', 'Chandni Chowk', 'Connaught Place', 'Rashtrapati Bhavan', 'Old Delhi'
  ],
  'Mumbai': [
    'Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Chhatrapati Shivaji Terminus',
    'Haji Ali Dargah', 'Juhu Beach', 'Colaba Causeway', 'Bandra-Worli Sea Link'
  ],
  'Agra': [
    'Taj Mahal', 'Agra Fort', 'Baby Taj', 'Mehtab Bagh', 'Fatehpur Sikri',
    'Tomb of Akbar the Great', 'Itmad-ud-Daulah', 'Jama Masjid', 'Kinari Bazaar', 'Chini Ka Rauza'
  ],
  'Jaipur': [
    'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Amber Fort', 'Jal Mahal',
    'Nahargarh Fort', 'Albert Hall Museum', 'Bapu Bazaar', 'Birla Temple', 'Patrika Gate'
  ],
  'Goa': [
    'Calangute Beach', 'Baga Beach', 'Anjuna Beach', 'Dudhsagar Falls',
    'Basilica of Bom Jesus', 'Fort Aguada', 'Spice Plantations'
  ],
  'Kerala': [
    'Backwaters', 'Munnar', 'Alleppey', 'Kochi', 'Wayanad',
    'Thekkady', 'Kovalam Beach', 'Varkala'
  ],
  'Varanasi': [
    'Ganges River', 'Kashi Vishwanath Temple', 'Sarnath', 'Dashashwamedh Ghat',
    'Manikarnika Ghat', 'Assi Ghat', 'Banaras Hindu University'
  ],
  'Udaipur': [
    'City Palace', 'Lake Pichola', 'Jag Mandir', 'Jagdish Temple',
    'Monsoon Palace', 'Fateh Sagar Lake', 'Saheliyon Ki Bari'
  ],
  'Rishikesh': [
    'Laxman Jhula', 'Ram Jhula', 'Triveni Ghat', 'Neelkanth Mahadev Temple',
    'Beatles Ashram', 'Ganga Aarti', 'Adventure Activities'
  ],
  'Darjeeling': [
    'Tiger Hill', 'Darjeeling Himalayan Railway', 'Batasia Loop', 'Peace Pagoda',
    'Tea Gardens', 'Observatory Hill', 'Padmaja Naidu Himalayan Zoological Park'
  ],
  // Add more cities as needed
};