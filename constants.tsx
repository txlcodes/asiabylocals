import { Country, AttractionCard, SignatureExperience } from './types';

export const CITIES: Country[] = [
  { id: 'tokyo', name: 'Tokyo', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=600', localAngle: 'Neon & Tradition', guidesCount: 342 },
  { id: 'kyoto', name: 'Kyoto', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=600', localAngle: 'Zen & Temples', guidesCount: 184 },
  { id: 'bali', name: 'Ubud', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=600', localAngle: 'Spirit & Jungle', guidesCount: 256 },
  { id: 'agra', name: 'Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600', localAngle: 'Mughal Heritage', guidesCount: 112 },
  { id: 'bangkok', name: 'Bangkok', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=600', localAngle: 'Street Food Capital', guidesCount: 421 },
  { id: 'dubai', name: 'Dubai', image: '/dubai-hero.jpg', localAngle: 'Modern Oasis', guidesCount: 287 },
  { id: 'singapore', name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=600', localAngle: 'Garden City', guidesCount: 234 },
  { id: 'seoul', name: 'Seoul', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=600', localAngle: 'K-Pop & Palaces', guidesCount: 312 },
  { id: 'hongkong', name: 'Hong Kong', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&q=80&w=600', localAngle: 'Skyline & Dim Sum', guidesCount: 298 },
  { id: 'kuala-lumpur', name: 'Kuala Lumpur', image: '/kuala-lumpur-hero.jpg', localAngle: 'Twin Towers', guidesCount: 156 },
  { id: 'taipei', name: 'Taipei', image: '/taipei-hero.jpg', localAngle: 'Night Markets', guidesCount: 189 },
  { id: 'mumbai', name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=600', localAngle: 'Bollywood & Bazaars', guidesCount: 267 },
  { id: 'delhi', name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=600', localAngle: 'Historic Capital', guidesCount: 245 },
  { id: 'osaka', name: 'Osaka', image: '/osaka-hero.jpg', localAngle: 'Food Paradise', guidesCount: 198 }
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