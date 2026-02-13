export interface CityInfo {
  name: string;
  country: string;
  region: string;
  type: 'City' | 'Region' | 'Island';
  image?: string;
}

export const ASIAN_CITIES_DATABASE: CityInfo[] = [
  // Japan
  { name: 'Tokyo', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Kyoto', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Osaka', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Yokohama', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Sapporo', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Fukuoka', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Hiroshima', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Nagoya', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Nara', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Okinawa', country: 'Japan', region: 'East Asia', type: 'Region' },
  { name: 'Nikko', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Takayama', country: 'Japan', region: 'East Asia', type: 'City' },
  { name: 'Kanazawa', country: 'Japan', region: 'East Asia', type: 'City' },

  // Thailand
  { name: 'Bangkok', country: 'Thailand', region: 'Southeast Asia', type: 'City' },
  { name: 'Chiang Mai', country: 'Thailand', region: 'Southeast Asia', type: 'City' },
  { name: 'Phuket', country: 'Thailand', region: 'Southeast Asia', type: 'Region' },
  { name: 'Krabi', country: 'Thailand', region: 'Southeast Asia', type: 'City' },
  { name: 'Ko Samui', country: 'Thailand', region: 'Southeast Asia', type: 'Island' },
  { name: 'Ko Phangan', country: 'Thailand', region: 'Southeast Asia', type: 'Island' },
  { name: 'Ko Lanta', country: 'Thailand', region: 'Southeast Asia', type: 'Island' },
  { name: 'Phi Phi Islands', country: 'Thailand', region: 'Southeast Asia', type: 'Island' },
  { name: 'Pattaya', country: 'Thailand', region: 'Southeast Asia', type: 'City' },
  { name: 'Ayutthaya', country: 'Thailand', region: 'Southeast Asia', type: 'City' },
  { name: 'Sukhothai', country: 'Thailand', region: 'Southeast Asia', type: 'City' },
  { name: 'Hua Hin', country: 'Thailand', region: 'Southeast Asia', type: 'City' },
  { name: 'Pai', country: 'Thailand', region: 'Southeast Asia', type: 'City' },

  // China
  { name: 'Beijing', country: 'China', region: 'East Asia', type: 'City' },
  { name: 'Shanghai', country: 'China', region: 'East Asia', type: 'City' },
  { name: 'Hong Kong', country: 'Hong Kong', region: 'East Asia', type: 'City' },
  { name: 'Guangzhou', country: 'China', region: 'East Asia', type: 'City' },
  { name: 'Shenzhen', country: 'China', region: 'East Asia', type: 'City' },
  { name: 'Chengdu', country: 'China', region: 'East Asia', type: 'City' },
  { name: 'Xi\'an', country: 'China', region: 'East Asia', type: 'City' },
  { name: 'Hangzhou', country: 'China', region: 'East Asia', type: 'City' },
  { name: 'Suzhou', country: 'China', region: 'East Asia', type: 'City' },
  { name: 'Nanjing', country: 'China', region: 'East Asia', type: 'City' },
  { name: 'Macau', country: 'Macau', region: 'East Asia', type: 'City' },

  // South Korea
  { name: 'Seoul', country: 'South Korea', region: 'East Asia', type: 'City' },
  { name: 'Busan', country: 'South Korea', region: 'East Asia', type: 'City' },
  { name: 'Jeju Island', country: 'South Korea', region: 'East Asia', type: 'Island' },
  { name: 'Incheon', country: 'South Korea', region: 'East Asia', type: 'City' },
  { name: 'Gyeongju', country: 'South Korea', region: 'East Asia', type: 'City' },
  { name: 'Jeonju', country: 'South Korea', region: 'East Asia', type: 'City' },

  // India
  { name: 'Mumbai', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Delhi', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Agra', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Goa', country: 'India', region: 'South Asia', type: 'Region' },
  { name: 'Bangalore', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Chennai', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Kolkata', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Jaipur', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Varanasi', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Udaipur', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Kochi', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Mysore', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Rishikesh', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Darjeeling', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Jodhpur', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Amritsar', country: 'India', region: 'South Asia', type: 'City' },
  { name: 'Leh Ladakh', country: 'India', region: 'South Asia', type: 'Region' },

  // Indonesia
  { name: 'Bali', country: 'Indonesia', region: 'Southeast Asia', type: 'Region' },
  { name: 'Jakarta', country: 'Indonesia', region: 'Southeast Asia', type: 'City' },
  { name: 'Yogyakarta', country: 'Indonesia', region: 'Southeast Asia', type: 'City' },
  { name: 'Ubud', country: 'Indonesia', region: 'Southeast Asia', type: 'City' },
  { name: 'Lombok', country: 'Indonesia', region: 'Southeast Asia', type: 'Island' },
  { name: 'Bandung', country: 'Indonesia', region: 'Southeast Asia', type: 'City' },
  { name: 'Surabaya', country: 'Indonesia', region: 'Southeast Asia', type: 'City' },
  { name: 'Borobudur', country: 'Indonesia', region: 'Southeast Asia', type: 'City' },
  { name: 'Gili Islands', country: 'Indonesia', region: 'Southeast Asia', type: 'Island' },

  // Vietnam
  { name: 'Hanoi', country: 'Vietnam', region: 'Southeast Asia', type: 'City' },
  { name: 'Ho Chi Minh City', country: 'Vietnam', region: 'Southeast Asia', type: 'City' },
  { name: 'Hoi An', country: 'Vietnam', region: 'Southeast Asia', type: 'City' },
  { name: 'Hue', country: 'Vietnam', region: 'Southeast Asia', type: 'City' },
  { name: 'Da Nang', country: 'Vietnam', region: 'Southeast Asia', type: 'City' },
  { name: 'Ha Long Bay', country: 'Vietnam', region: 'Southeast Asia', type: 'Region' },
  { name: 'Nha Trang', country: 'Vietnam', region: 'Southeast Asia', type: 'City' },
  { name: 'Sapa', country: 'Vietnam', region: 'Southeast Asia', type: 'City' },
  { name: 'Mui Ne', country: 'Vietnam', region: 'Southeast Asia', type: 'City' },

  // Malaysia
  { name: 'Kuala Lumpur', country: 'Malaysia', region: 'Southeast Asia', type: 'City' },
  { name: 'Penang', country: 'Malaysia', region: 'Southeast Asia', type: 'City' },
  { name: 'Langkawi', country: 'Malaysia', region: 'Southeast Asia', type: 'Island' },
  { name: 'Malacca', country: 'Malaysia', region: 'Southeast Asia', type: 'City' },
  { name: 'Cameron Highlands', country: 'Malaysia', region: 'Southeast Asia', type: 'Region' },
  { name: 'Borneo', country: 'Malaysia', region: 'Southeast Asia', type: 'Region' },

  // Singapore
  { name: 'Singapore', country: 'Singapore', region: 'Southeast Asia', type: 'City' },

  // Philippines
  { name: 'Manila', country: 'Philippines', region: 'Southeast Asia', type: 'City' },
  { name: 'Cebu', country: 'Philippines', region: 'Southeast Asia', type: 'City' },
  { name: 'Boracay', country: 'Philippines', region: 'Southeast Asia', type: 'Island' },
  { name: 'Palawan', country: 'Philippines', region: 'Southeast Asia', type: 'Island' },
  { name: 'El Nido', country: 'Philippines', region: 'Southeast Asia', type: 'City' },
  { name: 'Coron', country: 'Philippines', region: 'Southeast Asia', type: 'City' },
  { name: 'Bohol', country: 'Philippines', region: 'Southeast Asia', type: 'Island' },

  // Taiwan
  { name: 'Taipei', country: 'Taiwan', region: 'East Asia', type: 'City' },
  { name: 'Kaohsiung', country: 'Taiwan', region: 'East Asia', type: 'City' },
  { name: 'Taichung', country: 'Taiwan', region: 'East Asia', type: 'City' },
  { name: 'Tainan', country: 'Taiwan', region: 'East Asia', type: 'City' },

  // UAE & Middle East
  { name: 'Dubai', country: 'United Arab Emirates', region: 'Middle East', type: 'City' },
  { name: 'Abu Dhabi', country: 'United Arab Emirates', region: 'Middle East', type: 'City' },
  { name: 'Doha', country: 'Qatar', region: 'Middle East', type: 'City' },
  { name: 'Muscat', country: 'Oman', region: 'Middle East', type: 'City' },

  // Sri Lanka
  { name: 'Colombo', country: 'Sri Lanka', region: 'South Asia', type: 'City' },
  { name: 'Kandy', country: 'Sri Lanka', region: 'South Asia', type: 'City' },
  { name: 'Galle', country: 'Sri Lanka', region: 'South Asia', type: 'City' },
  { name: 'Sigiriya', country: 'Sri Lanka', region: 'South Asia', type: 'City' },

  // Nepal
  { name: 'Kathmandu', country: 'Nepal', region: 'South Asia', type: 'City' },
  { name: 'Pokhara', country: 'Nepal', region: 'South Asia', type: 'City' },

  // Bangladesh
  { name: 'Dhaka', country: 'Bangladesh', region: 'South Asia', type: 'City' },

  // Myanmar
  { name: 'Yangon', country: 'Myanmar', region: 'Southeast Asia', type: 'City' },
  { name: 'Bagan', country: 'Myanmar', region: 'Southeast Asia', type: 'City' },
  { name: 'Mandalay', country: 'Myanmar', region: 'Southeast Asia', type: 'City' },

  // Cambodia
  { name: 'Siem Reap', country: 'Cambodia', region: 'Southeast Asia', type: 'City' },
  { name: 'Phnom Penh', country: 'Cambodia', region: 'Southeast Asia', type: 'City' },

  // Laos
  { name: 'Luang Prabang', country: 'Laos', region: 'Southeast Asia', type: 'City' },
  { name: 'Vientiane', country: 'Laos', region: 'Southeast Asia', type: 'City' },

  // Mongolia
  { name: 'Ulaanbaatar', country: 'Mongolia', region: 'East Asia', type: 'City' },

  // Pakistan
  { name: 'Lahore', country: 'Pakistan', region: 'South Asia', type: 'City' },
  { name: 'Karachi', country: 'Pakistan', region: 'South Asia', type: 'City' },
  { name: 'Islamabad', country: 'Pakistan', region: 'South Asia', type: 'City' },
];

export const getCityImage = (cityName: string): string => {
  const cityImages: Record<string, string> = {
    'Tokyo': '/tokyo-hero.jpg',
    'Kyoto': '/kyoto-hero.jpg',
    'Osaka': '/osaka-hero.jpg',
    'Dubai': '/dubai-hero.jpg',
    'Agra': '/agra-hero.jpg',
    'Hanoi': '/hanoi-hero.jpg',
    'Kuala Lumpur': '/kuala-lumpur-hero.jpg',
    'Taipei': '/taipei-hero.jpg',
    'Jodhpur': '/cities-images/jodhpur.jpg',
    'Bikaner': '/cities-images/bikaner.jpg',
    'Mathura': '/cities-images/mathura.jpg',
    'Varanasi': '/cities-images/varanasi.jpg',
    'Khajuraho': '/cities-images/khajurao.jpg',
    'Gwalior': '/cities-images/gwalior.jpg',
    'Aurangabad': '/cities-images/aurangabad.jpg',
    'Goa': '/cities-images/goa.jpg',
    'Mysore': '/cities-images/mysore.jpg',
    'Bengaluru': '/cities-images/bangalore.jpg',
    'Delhi': '/cities-images/delhi.jpg',
    'Udaipur': 'https://images.unsplash.com/photo-1624235113031-86640fb6acfb?auto=format&fit=crop&q=80&w=600',
    'Amritsar': '/cities-images/amritsar.jpg',
    'Rishikesh': '/cities-images/rishikesh.jpg',
    'Mumbai': 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?auto=format&fit=crop&q=80&w=600',
    'Leh Ladakh': 'https://images.unsplash.com/photo-1542144611-13e9259a287c?auto=format&fit=crop&q=80&w=600',
  };

  return cityImages[cityName] || `https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=200`;
};

