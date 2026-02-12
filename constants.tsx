import { Country, AttractionCard, SignatureExperience } from './types';

export const CITIES: Country[] = [
  // Live cities - shown first
  { id: 'agra', name: 'Agra', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600', localAngle: 'Mughal Heritage', guidesCount: 112 },
  { id: 'delhi', name: 'Delhi', image: '/cities-images/delhi.jpg', localAngle: 'Historic Capital', guidesCount: 245 },
  { id: 'jaipur', name: 'Jaipur', image: '/jaipur-hero.jpg', localAngle: 'Pink City', guidesCount: 189 },
  { id: 'jodhpur', name: 'Jodhpur', image: '/cities-images/jodhpur.jpg', localAngle: 'Blue City', guidesCount: 145 },
  { id: 'bikaner', name: 'Bikaner', image: '/cities-images/bikaner.jpg', localAngle: 'Desert Heritage', guidesCount: 98 },
  { id: 'mathura', name: 'Mathura', image: '/cities-images/mathura.jpg', localAngle: 'Spiritual Capital', guidesCount: 134 },
  { id: 'varanasi', name: 'Varanasi', image: '/cities-images/varanasi.jpg', localAngle: 'Sacred Ganges', guidesCount: 178 },
  { id: 'khajuraho', name: 'Khajuraho', image: '/cities-images/khajurao.jpg', localAngle: 'Temple Art', guidesCount: 112 },
  { id: 'gwalior', name: 'Gwalior', image: '/cities-images/gwalior.jpg', localAngle: 'Fort City', guidesCount: 123 },
  { id: 'aurangabad', name: 'Aurangabad', image: '/cities-images/aurangabad.jpg', localAngle: 'Cave Temples', guidesCount: 156 },
  { id: 'goa', name: 'Goa', image: '/cities-images/goa.jpg', localAngle: 'Beaches & Culture', guidesCount: 234 },
  { id: 'mysore', name: 'Mysore', image: '/cities-images/mysore.jpg', localAngle: 'Royal Heritage', guidesCount: 167 },
  { id: 'bengaluru', name: 'Bengaluru', image: '/cities-images/bangalore.jpg', localAngle: 'Garden City', guidesCount: 289 },
  { id: 'udaipur', name: 'Udaipur', image: 'https://images.unsplash.com/photo-1624235113031-86640fb6acfb?auto=format&fit=crop&q=80&w=600', localAngle: 'City of Lakes', guidesCount: 156 },
  { id: 'amritsar', name: 'Amritsar', image: '/cities-images/amritsar.jpg', localAngle: 'Golden Temple', guidesCount: 142 },
  { id: 'rishikesh', name: 'Rishikesh', image: '/cities-images/rishikesh.jpg', localAngle: 'Yoga Capital', guidesCount: 134 },
  { id: 'leh-ladakh', name: 'Leh Ladakh', image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&q=80&w=600', localAngle: 'Himalayan Desert', guidesCount: 98 },
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
    'India Gate', 'Jama Masjid', 'Qutb Minar', 'Chandni Chowk', "Humayun's Tomb",
    'Mehrauli New Delhi', 'Lotus Temple', 'Nizamuddin East New Delhi', 'Old Delhi',
    'Red Fort', 'Central Secretariat New Delhi', 'Rashtrapati Bhavan', 'Indira Gandhi International Airport',
    'Mahipalpur New Delhi', 'Raj Ghat', 'Connaught Place', 'Farash Khana New Delhi',
    'Gurudwara Bangla Sahib', 'Khari Baoli', 'Agrasen ki Baoli'
  ],
  'Mumbai': [
    'Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Chhatrapati Shivaji Terminus',
    'Haji Ali Dargah', 'Juhu Beach', 'Colaba Causeway', 'Bandra-Worli Sea Link'
  ],
  'Agra': [
    'Taj Mahal', 'Agra Fort', 'Baby Taj', 'Mehtab Bagh', 'Jama Masjid',
    'Handicraft Store Agra', 'Agra Railway Station', 'Agra Airport',
    'Tomb of Akbar the Great', 'Shri Mankameshwar Temple', 'Sadar Bazar', 'Kinari Bazar'
  ],
  'Jaipur': [
    'Hawa Mahal', 'City Palace', 'Amber Fort', 'Jantar Mantar', 'Jal Mahal',
    'Man Sagar Lake', 'Panna Meena ka Kund', 'Albert Hall Museum', 'Gaitor Ki Chhatriyan',
    'Jaipur International Airport', 'Nahargarh Fort', 'Bapu Bazaar', 'Chandra Mahal',
    'Monkey Temple', 'Maota Lake', 'Jaigarh Fort', 'Patrika Gate', 'Chokhi Dhani', 'Birla Mandir'
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
  'Jodhpur': [
    'Mehrangarh Fort', 'Jaswant Thada', 'Umaid Bhawan Palace', 'Clock Tower',
    'Mandore Gardens', 'Rao Jodha Desert Rock Park', 'Ghanta Ghar', 'Balsamand Lake',
    'Jodhpur Railway Station', 'Jodhpur Airport', 'Sardar Market', 'Toorji Ka Jhalra',
    'Chamunda Mata Temple', 'Mahamandir Temple', 'Kaylana Lake', 'Machia Biological Park',
    'Rao Jodha Desert Rock Park', 'Bishnoi Village'
  ],
  'Bikaner': [
    'Junagarh Fort', 'Karni Mata Temple', 'Lalgarh Palace', 'National Research Centre on Camel',
    'Gajner Palace', 'Laxmi Niwas Palace', 'Bikaner Camel Festival', 'Rampuria Havelis',
    'Bikaner Railway Station', 'Bikaner Airport', 'Kote Gate', 'Bhandasar Jain Temple',
    'Ganga Government Museum', 'Shri Laxminath Temple', 'Devi Kund Sagar', 'Camel Breeding Farm',
    'Sadul Singh Museum', 'Gajner Wildlife Sanctuary'
  ],
  'Mathura': [
    'Krishna Janmasthan Temple', 'Dwarkadhish Temple', 'Vrindavan', 'Govardhan Hill',
    'Banke Bihari Temple', 'Prem Mandir', 'ISKCON Temple', 'Radha Kund',
    'Mathura Railway Station', 'Mathura Junction', 'Vishram Ghat', 'Kusum Sarovar',
    'Gita Mandir', 'Rangji Temple', 'Seva Kunj', 'Nidhivan',
    'Mathura Museum', 'Barsana', 'Gokul'
  ],

  'Khajuraho': [
    'Khajuraho Group of Monuments', 'Western Group of Temples', 'Eastern Group of Temples',
    'Southern Group of Temples', 'Archaeological Museum', 'Panna National Park', 'Raneh Falls',
    'Khajuraho Railway Station', 'Khajuraho Airport', 'Kandariya Mahadeva Temple', 'Lakshmana Temple',
    'Vishvanatha Temple', 'Chitragupta Temple', 'Adinath Temple', 'Parsvanath Temple',
    'Duladeo Temple', 'Chaturbhuj Temple', 'Beni Sagar Dam'
  ],
  'Gwalior': [
    'Gwalior Fort', 'Jai Vilas Palace', 'Teli Ka Mandir', 'Sas Bahu Temples',
    'Tansen Tomb', 'Gurudwara Data Bandi Chhod', 'Sun Temple', 'Scindia Museum',
    'Gwalior Railway Station', 'Gwalior Airport', 'Man Mandir Palace', 'Gurjari Mahal',
    'Gopachal Parvat', 'Tomb of Mohammad Ghaus', 'Gwalior Zoo', 'Phool Bagh',
    'Suraj Kund', 'Gwalior Trade Fair Ground', 'Maharaj Bada'
  ],
  'Aurangabad': [
    'Ajanta Caves', 'Ellora Caves', 'Bibi Ka Maqbara', 'Daulatabad Fort',
    'Grishneshwar Temple', 'Panchakki', 'Aurangabad Caves', 'Shivaji Museum',
    'Aurangabad Railway Station', 'Aurangabad Airport', 'Kailasa Temple', 'Buddhist Caves',
    'Jain Caves', 'Himroo Factory', 'Salim Ali Lake', 'Gautala Wildlife Sanctuary',
    'Pithalkora Caves', 'Lonar Crater Lake', 'Aurangabad Caves Complex'
  ],

  'Mysore': [
    'Mysore Palace', 'Chamundi Hill', 'Brindavan Gardens', 'St. Philomena\'s Cathedral',
    'Mysore Zoo', 'Jaganmohan Palace', 'Karanji Lake', 'Railway Museum',
    'Mysore Railway Station', 'Mysore Airport', 'Chamundeshwari Temple', 'Lalitha Mahal Palace',
    'Krishnaraja Sagar Dam', 'Somnathpur Temple', 'Ranganathittu Bird Sanctuary', 'Melody World Wax Museum',
    'Sand Sculpture Museum', 'Devaraja Market', 'Mysore Silk Factory'
  ],
  'Bengaluru': [
    'Lalbagh Botanical Garden', 'Cubbon Park', 'Bangalore Palace', 'Tipu Sultan\'s Summer Palace',
    'ISKCON Temple', 'Vidhana Soudha', 'Nandi Hills', 'Bannerghatta National Park',
    'Bangalore Railway Station', 'Bangalore Airport', 'Ulsoor Lake', 'Wonderla Amusement Park',
    'Innovation Film City', 'Bull Temple', 'Vidhana Soudha', 'UB City Mall',
    'Commercial Street', 'MG Road', 'Cubbon Park Metro Station', 'Bangalore Fort'
  ],
  'Udaipur': [
    'City Palace', 'Lake Pichola', 'Jag Mandir', 'Jagdish Temple',
    'Monsoon Palace', 'Fateh Sagar Lake', 'Saheliyon Ki Bari'
  ],
  'Jaisalmer': [
    'Jaisalmer Fort', 'Patwon Ki Haveli', 'Sam Sand Dunes', 'Gadisar Lake',
    'Bada Bagh', 'Nathmal Ki Haveli', 'Salim Singh Ki Haveli', 'Desert Safari Camp'
  ],
  'Rishikesh': [
    'Laxman Jhula', 'Ram Jhula', 'Triveni Ghat', 'Neelkanth Mahadev Temple',
    'Beatles Ashram', 'Ganga Aarti', 'Adventure Activities'
  ],
  'Darjeeling': [
    'Tiger Hill', 'Darjeeling Himalayan Railway', 'Batasia Loop', 'Peace Pagoda',
    'Tea Gardens', 'Observatory Hill', 'Padmaja Naidu Himalayan Zoological Park'
  ],
  // Japan - Top 10 attractions for each city
  'Tokyo': [
    'Senso-ji Temple', 'Tokyo Skytree', 'Shibuya Crossing', 'Meiji Shrine',
    'Tsukiji Outer Market', 'Imperial Palace', 'Harajuku', 'Ueno Park',
    'Tokyo Tower', 'Ginza District'
  ],
  'Kyoto': [
    'Fushimi Inari Shrine', 'Kiyomizu-dera Temple', 'Arashiyama Bamboo Grove', 'Kinkaku-ji (Golden Pavilion)',
    'Gion District', 'Nijo Castle', 'Philosopher\'s Path', 'Tenryu-ji Temple',
    'Sanjusangendo Temple', 'Nishiki Market'
  ],
  'Osaka': [
    'Osaka Castle', 'Dotonbori', 'Universal Studios Japan', 'Shitennoji Temple',
    'Osaka Aquarium Kaiyukan', 'Umeda Sky Building', 'Shinsaibashi Shopping Street', 'Sumiyoshi Taisha',
    'Tempozan Ferris Wheel', 'Osaka Museum of History'
  ],
  'Hiroshima': [
    'Hiroshima Peace Memorial Park', 'Atomic Bomb Dome', 'Itsukushima Shrine (Miyajima)', 'Hiroshima Castle',
    'Shukkeien Garden', 'Mazda Museum', 'Hiroshima Peace Memorial Museum', 'Miyajima Island',
    'Okunoshima (Rabbit Island)', 'Hiroshima Museum of Art'
  ],
  'Nara': [
    'Todai-ji Temple', 'Nara Park', 'Kasuga Taisha Shrine', 'Kofuku-ji Temple',
    'Isuien Garden', 'Nara National Museum', 'Yoshikien Garden', 'Horyu-ji Temple',
    'Naramachi District', 'Mount Wakakusa'
  ],
  'Sapporo': [
    'Sapporo Snow Festival Site', 'Odori Park', 'Sapporo Beer Museum', 'Mount Moiwa',
    'Sapporo Clock Tower', 'Hokkaido Shrine', 'Sapporo TV Tower', 'Maruyama Park',
    'Susukino District', 'Historical Village of Hokkaido'
  ],
  'Yokohama': [
    'Yokohama Chinatown', 'Minato Mirai 21', 'Yokohama Landmark Tower', 'Sankeien Garden',
    'Yokohama Red Brick Warehouse', 'Yamashita Park', 'Yokohama Cosmo World', 'Yokohama Hakkeijima Sea Paradise',
    'Yokohama Museum of Art', 'Yokohama Port Museum'
  ],
  'Fukuoka': [
    'Fukuoka Castle Ruins', 'Ohori Park', 'Canal City Hakata', 'Dazaifu Tenmangu Shrine',
    'Fukuoka Tower', 'Kushida Shrine', 'Yatai Food Stalls', 'Uminonakamichi Seaside Park',
    'Fukuoka Asian Art Museum', 'Momochi Seaside Park'
  ],
  'Nagoya': [
    'Nagoya Castle', 'Atsuta Shrine', 'SCMAGLEV and Railway Park', 'Nagoya City Science Museum',
    'Osu Kannon Temple', 'Noritake Garden', 'Port of Nagoya Public Aquarium', 'Tokugawa Art Museum',
    'Shirotori Garden', 'Nagoya TV Tower'
  ],
  'Okinawa': [
    'Shuri Castle', 'Okinawa Churaumi Aquarium', 'Kokusai Street', 'Okinawa World',
    'Manza Beach', 'Nakagusuku Castle Ruins', 'Sefa Utaki', 'Okinawa Peace Memorial Park',
    'Cape Manzamo', 'Ryukyu Mura'
  ],
  // Add more cities as needed
};

// Transportation types available during activities
export const TRANSPORTATION_TYPES: string[] = [
  'Bike',
  'Segway',
  'Electric bike',
  'Mountain bike',
  'Motorcycle',
  'Scooter',
  'Car',
  'Limousine',
  'Jeep / SUV',
  'Van',
  'Bus / coach',
  'Electric car',
  'Vintage car',
  'Black cab',
  'Sailboat',
  'Ferry',
  'Gondola',
  'Duck boat',
  'Sightseeing cruise',
  'Water taxi',
  'Jetski',
  'Riverboat',
  'Kayak',
  'Raft',
  'Catamaran',
  'Speedboat',
  'Yacht',
  'Canoe',
  'Paddleboard',
  'Surfboard',
  'Submarine',
  'Other water transport',
  'Glass bottom boat',
  'Lake cruise',
  'Banana boat',
  'Beer boat',
  'Airboat',
  'Dhow',
  'Train',
  'Tram',
  'Subway',
  'Helicopter',
  'Airplane',
  'Balloon',
  'Glider',
  'Public transportation',
  'Cable car',
  'Quad ATV',
  'Pedicab / rickshaw',
  'Horse carriage',
  'Camel',
  'Snowmobile',
  'Sled',
  'Other animal',
  'Beer bike',
  'Trike',
  'Tuk tuk',
  'Motorized tuk tuk',
  'Golf cart',
  'On foot',
  'Horse'
];

// Entry ticket options for attractions
export type EntryTicketOption = 'paid_included' | 'paid_not_included' | 'free_entry' | 'exterior_only';

export const ENTRY_TICKET_OPTIONS: Array<{
  value: EntryTicketOption;
  label: string;
  description: string;
}> = [
    {
      value: 'paid_included',
      label: 'Paid entry: ticket included',
      description: 'The activity enters the location, and the ticket is included in the activity price.'
    },
    {
      value: 'paid_not_included',
      label: 'Paid entry: ticket not included',
      description: 'The activity enters the location, but the ticket is not included in the activity price. Customers must pay the entrance fee during the activity.'
    },
    {
      value: 'free_entry',
      label: 'Free entry: no ticket required',
      description: 'The location is free to enter. No ticket is required.'
    },
    {
      value: 'exterior_only',
      label: 'No entry: exterior visit only',
      description: 'The activity does not enter the location, but it is part of the experience (e.g. the attraction\'s exterior is visited or detailed during a guided tour, etc).'
    }
  ];