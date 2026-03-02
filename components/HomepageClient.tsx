'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Search,
  User,
  Star,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Award,
  ShieldCheck,
  X,
  Quote
} from 'lucide-react';
import { CITIES, ATTRACTIONS, getCityUrl } from '@/lib/constants';
import { ASIAN_CITIES_DATABASE } from '@/lib/citiesDatabase';

// ── Exploration Footer Data & Component ──────────────────────────────

interface ExploreItem {
  name: string;
  count: string;
  image: string;
}

const EXPLORATION_DATA: Record<string, ExploreItem[]> = {
  attractions: [
    { name: "Taj Mahal, India", count: "112 tours", image: "/taj-mahal-new.jpg" },
    { name: "Wat Arun, Bangkok", count: "45 tours", image: "/wat-arun-new.jpg" },
    { name: "Phuket Marine Park", count: "62 tours", image: "/phuket-marine-park-new.jpg" },
    { name: "Amber Fort, India", count: "42 tours", image: "/amber-fort-new.jpg" },
    { name: "Hawa Mahal, India", count: "28 tours", image: "/hawa-mahal-new.jpg" },
    { name: "Red Fort, India", count: "35 tours", image: "/red-fort-new.jpg" },
    { name: "Qutub Minar, India", count: "22 tours", image: "/qutub-minar-new.jpg" },
    { name: "City Palace, Jaipur", count: "18 tours", image: "/city-palace-new.jpg" },
    { name: "Agra Fort, India", count: "65 tours", image: "/agra-fort-new.jpg" },
    { name: "Humayun's Tomb, India", count: "15 tours", image: "/humayun-tomb-new.jpg" },
    { name: "Jama Masjid, Delhi", count: "12 tours", image: "/jama-masjid-new.jpg" },
    { name: "Fatehpur Sikri, Agra", count: "24 tours", image: "/fatehpur-sikri-new.jpg" }
  ],
  destinations: [
    { name: "Agra, India", count: "145 tours", image: "/agra-hero.jpg" },
    { name: "Delhi, India", count: "156 tours", image: "/delhi-home.jpg" },
    { name: "Jaipur, India", count: "89 tours", image: "/jaipur-hero.jpg" },
    { name: "Phuket, Thailand", count: "124 tours", image: "/phuket-hero.jpg" },
    { name: "Kyoto, Japan", count: "98 tours", image: "/kyoto-hero.jpg" },
    { name: "Bangkok, Thailand", count: "210 tours", image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&q=80&w=400" }
  ],
  countries: [
    { name: "India", count: "512 tours", image: "/delhi-home.jpg" },
    { name: "Japan", count: "342 tours", image: "/japan-pagoda.jpg" },
    { name: "Thailand", count: "421 tours", image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=400" },
    { name: "Vietnam", count: "289 tours", image: "/hanoi-hero.jpg" }
  ],
  categories: [
    { name: "Heritage Walks", count: "1,245 tours", image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=400" },
    { name: "Street Food Safaris", count: "2,150 tours", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=400" },
    { name: "Sacred Temples", count: "560 tours", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=400" },
    { name: "Historical Walks", count: "670 tours", image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=400" }
  ]
};

const ExplorationFooter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('attractions');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [activeTab]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const tabs = [
    { id: 'attractions', label: 'Top attractions in Asia' },
    { id: 'destinations', label: 'Top destinations' },
    { id: 'countries', label: 'Top countries to visit' },
    { id: 'categories', label: 'Top attraction categories' }
  ];

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-12 border-t border-gray-100">
      <div className="flex gap-8 border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-4 text-[14px] font-bold transition-all whitespace-nowrap border-b-2 outline-none ${activeTab === tab.id
              ? 'text-[#0071EB] border-[#0071EB]'
              : 'text-gray-400 border-transparent hover:text-[#001A33]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative group/scroll">
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all border border-gray-100 items-center justify-center -ml-5"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-gray-400 group-hover/scroll:text-[#10B981] transition-colors" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all border border-gray-100 items-center justify-center -mr-5"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-gray-400 group-hover/scroll:text-[#10B981] transition-colors" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto pb-8 no-scrollbar -mx-6 px-6 scroll-smooth snap-x snap-proximity"
        >
          {EXPLORATION_DATA[activeTab]?.map((item, idx) => {
            let href = "#";
            if (activeTab === 'countries') {
              href = `/${item.name.toLowerCase().replace(/\s+/g, '-')}`;
            } else if (activeTab === 'destinations') {
              const [city, country] = item.name.split(', ');
              if (city && country) {
                href = `/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`;
              }
            } else if (activeTab === 'attractions') {
              if (item.name.includes('Taj Mahal')) {
                href = "/india/agra/taj-mahal";
              } else if (item.name.includes('Agra Fort')) {
                href = "/india/agra/agra-fort";
              } else if (item.name.includes('Fatehpur Sikri')) {
                href = "/india/agra/fatehpur-sikri";
              }
            }

            return (
              <Link
                key={`${activeTab}-${idx}`}
                href={href}
                className="relative flex-shrink-0 w-72 h-64 rounded-3xl overflow-hidden transition-all duration-700 bg-black group"
              >
                <div className="absolute inset-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-80 group-hover:opacity-100"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h6 className="text-white text-[18px] font-thin tracking-tight leading-tight group-hover:font-normal transition-all duration-500">
                    {item.name.split(',')[0]}
                  </h6>
                  <span className="text-white/60 text-[10px] font-medium tracking-[0.1em] uppercase mt-1 block group-hover:text-white transition-colors">
                    {item.count}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ── Hero Images ──────────────────────────────────────────────────────

const HERO_IMAGES = [
  { url: '/kyoto-hero.jpg', city: 'Kyoto' },
  { url: '/tokyo-hero.jpg', city: 'Tokyo' },
  { url: '/agra-hero.jpg', city: 'Agra' },
  { url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000', city: 'Bangkok' },
  { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000', city: 'Bali' },
  { url: '/dubai-hero.jpg', city: 'Dubai' },
  { url: '/yu-kato-hero.jpg', city: 'Asia' },
  { url: '/tianshu-liu-hero.jpg', city: 'Asia' },
  { url: '/rafa-prada-hero.jpg', city: 'Asia' },
  { url: '/soroush-zargarbashi-hero.jpg', city: 'Asia' }
];

// ── City guides data for "Trip inspiration" dropdown ─────────────────

const CITY_GUIDES = [
  { name: 'Tokyo', image: '/tokyo-hero.jpg' },
  { name: 'Kyoto', image: '/kyoto-hero.jpg' },
  { name: 'Osaka', image: '/osaka-hero.jpg' },
  { name: 'Bangkok', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=200' },
  { name: 'Dubai', image: '/dubai-hero.jpg' },
  { name: 'Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=200' },
  { name: 'Seoul', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=200' },
  { name: 'Hong Kong', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&q=80&w=200' },
  { name: 'Kuala Lumpur', image: '/kuala-lumpur-hero.jpg' },
  { name: 'Taipei', image: '/taipei-hero.jpg' },
  { name: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=200' },
  { name: 'Agra', image: '/agra-hero.jpg' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=200' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=200' },
  { name: 'Hanoi', image: '/hanoi-hero.jpg' },
  { name: 'Ho Chi Minh City', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=200' },
  { name: 'Chiang Mai', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=200' },
  { name: 'Phuket', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=200' },
  { name: 'Krabi', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=200' },
  { name: 'Manila', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=200' },
  { name: 'Jakarta', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=200' },
  { name: 'Shanghai', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=200' },
  { name: 'Beijing', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=200' },
  { name: 'Colombo', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=200' },
  { name: 'Kathmandu', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=200' }
];

const CITY_GUIDE_ID_MAP: Record<string, string> = {
  'Tokyo': 'tokyo', 'Kyoto': 'kyoto', 'Osaka': 'osaka', 'Bangkok': 'bangkok',
  'Dubai': 'dubai', 'Singapore': 'singapore', 'Seoul': 'seoul', 'Hong Kong': 'hongkong',
  'Kuala Lumpur': 'kuala-lumpur', 'Taipei': 'taipei', 'Bali': 'bali', 'Agra': 'agra',
  'Mumbai': 'mumbai', 'Delhi': 'delhi', 'Hanoi': 'hanoi', 'Ho Chi Minh City': 'ho-chi-minh-city',
  'Chiang Mai': 'chiang-mai', 'Phuket': 'phuket', 'Krabi': 'bangkok', 'Manila': 'manila',
  'Jakarta': 'bangkok', 'Shanghai': 'shanghai', 'Beijing': 'beijing', 'Colombo': 'colombo',
  'Kathmandu': 'kathmandu'
};

// ── Testimonials Data ────────────────────────────────────────────────

const TESTIMONIALS = [
  {
    name: "Liz B.",
    text: "If you want to truly understand the history of the Taj Mahal in the context of how India developed, this tour with Shahnawaz will leave you loving Agra even more than you thought possible. We had a meaningful and memorable time.",
    tour: "Taj Mahal Sunrise Tour",
    link: "/india/agra/taj-mahal-sunrise-guided-tour"
  },
  {
    name: "Anthony L W.",
    text: "Best tour that we have EVER had! We covered so many things from city highlights to the cultural beginnings of the Mughal Empire. Talha told story after story of how Agra came to be and tied it all in with what we were experiencing present day.",
    tour: "Agra City Highlights Tour",
    link: "/india/agra/agra-city-highlights-tour"
  },
  {
    name: "Joe M.",
    text: "Great tour with fantastic guide... We were able to customize the tour to our interests, got an early start to beat the crowds. Overall a great day, full of unexpected discoveries. Danish is a wonderful guide, interesting and knowledgeable.",
    tour: "Taj Mahal Photography Tour",
    link: "/india/agra/taj-mahal-photography-tour"
  },
  {
    name: "Raghu N.",
    text: "The highlight of our trip to India for sure! Asif was so knowledgeable and personable - it felt like we were walking around with a longtime friend. I can't recommend taking a tour with Asif highly enough!",
    tour: "Taj Mahal & Agra Fort Guided Tour",
    link: "/india/agra/taj-mahal-agra-fort-guided-tour"
  }
];

// ── Main Homepage Component ──────────────────────────────────────────

export default function HomepageClient() {
  const router = useRouter();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mobile nav state
  const [showMobilePlacesDropdown, setShowMobilePlacesDropdown] = useState(false);
  const [showMobileInspirationDropdown, setShowMobileInspirationDropdown] = useState(false);

  // City scroll state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Hero rotation — use deterministic order, random start index on client only
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Pick a random starting image on mount (client-only)
    setCurrentImageIndex(Math.floor(Math.random() * HERO_IMAGES.length));
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Cities scroll check
  useEffect(() => {
    const checkScroll = () => {
      const scrollContainer = document.getElementById('cities-scroll');
      if (scrollContainer) {
        setCanScrollLeft(scrollContainer.scrollLeft > 0);
        setCanScrollRight(scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth - 10);
      }
    };
    checkScroll();
    const scrollContainer = document.getElementById('cities-scroll');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  // Search suggestions
  const focusCities = useMemo(() => {
    return ASIAN_CITIES_DATABASE.map(city => ({
      name: city.name,
      country: city.country,
      slug: city.name.toLowerCase().replace(/\s+/g, '-')
    }));
  }, []);

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return focusCities
      .filter(city => city.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(query);
        const bStarts = b.name.toLowerCase().startsWith(query);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
  }, [searchQuery, focusCities]);

  const handleSearch = (cityName?: string) => {
    const query = cityName || searchQuery.trim();
    if (!query) return;

    if (query.toLowerCase().includes('taj mahal')) {
      router.push("/india/agra/taj-mahal");
      return;
    }

    const matchedCity = focusCities.find(city =>
      city.name.toLowerCase() === query.toLowerCase()
    );
    if (matchedCity) {
      const countrySlug = matchedCity.country.toLowerCase().replace(/\s+/g, '-');
      router.push(`/${countrySlug}/${matchedCity.slug}`);
    } else {
      const fuzzyMatch = focusCities.find(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      if (fuzzyMatch) {
        const countrySlug = fuzzyMatch.country.toLowerCase().replace(/\s+/g, '-');
        router.push(`/${countrySlug}/${fuzzyMatch.slug}`);
      }
    }
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AsiaByLocals",
            "url": "https://www.asiabylocals.com",
            "description": "Discover authentic local tours and cultural experiences across Asia with verified local guides.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://www.asiabylocals.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full h-24 sm:h-28 md:h-32 flex items-center justify-between px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-3 h-full">
            <Link href="/" className="cursor-pointer">
              <img
                src="/logo.png"
                alt="Asia By Locals"
                className="w-auto object-contain"
                style={{ height: '120px', maxHeight: '120px' }}
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-semibold text-[#001A33]">
              {/* Places to see dropdown */}
              <div className="relative flex items-center gap-1 cursor-pointer hover:text-[#10B981] group/places">
                Places to see <ChevronRight size={14} className="rotate-90 group-hover/places:rotate-[270deg] transition-transform duration-150" />
                <div className="absolute top-full left-0 pt-2 z-50 opacity-0 -translate-y-2 pointer-events-none group-hover/places:opacity-100 group-hover/places:translate-y-0 group-hover/places:pointer-events-auto transition-[opacity,transform] duration-100 ease-out">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 xl:p-5 w-[90vw] max-w-[800px] max-h-[70vh] overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-3 gap-1">
                      {CITIES.map((city) => {
                        const url = getCityUrl(city.name, city.id);
                        return (
                          <div key={city.id}>
                            <Link
                              href={url}
                              className="flex items-center gap-3 hover:bg-[#10B981]/10 p-2 rounded-lg group/item"
                            >
                              <img
                                src={city.image}
                                alt={`${city.name} tours and cultural experiences`}
                                className="w-11 h-11 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-[#001A33] text-sm group-hover/item:text-[#10B981]">{city.name} Tours</div>
                                <div className="text-gray-400 text-xs">{city.localAngle}</div>
                              </div>
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Trip inspiration dropdown */}
              <div className="relative flex items-center gap-1 cursor-pointer hover:text-[#10B981] group/inspiration">
                Trip inspiration <ChevronRight size={14} className="rotate-90 group-hover/inspiration:rotate-[270deg] transition-transform duration-150" />
                <div className="absolute top-full left-0 pt-2 z-50 opacity-0 -translate-y-2 pointer-events-none group-hover/inspiration:opacity-100 group-hover/inspiration:translate-y-0 group-hover/inspiration:pointer-events-auto transition-[opacity,transform] duration-100 ease-out">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 w-[90vw] max-w-[750px]">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                          <h3 className="font-bold text-[#001A33] text-sm">City guides</h3>
                        </div>
                        <p className="text-gray-500 text-xs mb-4">Explore all</p>
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto no-scrollbar">
                        {CITY_GUIDES.map((city, idx) => {
                          const cityId = CITY_GUIDE_ID_MAP[city.name] || city.name.toLowerCase().replace(/\s+/g, '-');
                          const url = getCityUrl(city.name, cityId);
                          return (
                            <Link key={idx} href={url} className="flex flex-col items-center gap-1.5 cursor-pointer p-1.5 rounded-lg hover:bg-[#10B981]/10 group/guide">
                              <img src={city.image} alt={city.name} className="w-12 h-12 rounded-full object-cover" />
                              <div className="font-semibold text-[#001A33] text-[10px] text-center leading-tight group-hover/guide:text-[#10B981]">{city.name} Travel Guide</div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-[#001A33] font-semibold cursor-pointer hover:text-[#10B981] text-xs underline">
                        Explore all <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-[13px] font-semibold text-[#001A33]">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              <button className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#10B981] p-1.5 sm:p-2 min-w-[44px] min-h-[44px] justify-center">
                <Globe size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden lg:block text-[11px]">EN/USD</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#10B981] p-1.5 sm:p-2 min-w-[44px] min-h-[44px] justify-center">
                <User size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden lg:block text-[11px]">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden sticky top-[72px] sm:top-[82px] md:top-[92px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-3 sm:px-4 pt-3 pb-2">
          <button
            onClick={() => {
              setShowMobilePlacesDropdown(!showMobilePlacesDropdown);
              setShowMobileInspirationDropdown(false);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${showMobilePlacesDropdown
              ? 'bg-[#10B981] text-white'
              : 'bg-gray-100 text-[#001A33] hover:bg-gray-200'
              }`}
          >
            <span>Places to see</span>
            <ChevronRight size={14} className={`transition-transform ${showMobilePlacesDropdown ? 'rotate-90' : 'rotate-0'}`} />
          </button>

          <button
            onClick={() => {
              setShowMobileInspirationDropdown(!showMobileInspirationDropdown);
              setShowMobilePlacesDropdown(false);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${showMobileInspirationDropdown
              ? 'bg-[#10B981] text-white'
              : 'bg-gray-100 text-[#001A33] hover:bg-gray-200'
              }`}
          >
            <span>Trip inspiration</span>
            <ChevronRight size={14} className={`transition-transform ${showMobileInspirationDropdown ? 'rotate-90' : 'rotate-0'}`} />
          </button>
        </div>

        {/* City Chips Row - Hidden on small mobile */}
        <div className="hidden md:block px-3 sm:px-4 pb-3 overflow-x-auto scroll-smooth scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex items-center gap-2 min-w-max">
            {CITIES.slice(0, 12).map((city) => {
              const url = getCityUrl(city.name, city.id);
              return (
                <Link
                  key={city.id}
                  href={url}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-[#001A33] text-sm font-medium hover:border-[#10B981] hover:text-[#10B981] active:scale-95 transition-all whitespace-nowrap"
                >
                  {city.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mobile Places Dropdown */}
        {showMobilePlacesDropdown && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 top-[72px] sm:top-[82px] md:top-[92px]"
              onClick={() => setShowMobilePlacesDropdown(false)}
            />
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto top-[72px] sm:top-[82px] md:top-[92px]">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#001A33]">Places to see</h3>
                <button onClick={() => setShowMobilePlacesDropdown(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 gap-3">
                  {CITIES.map((city) => {
                    const url = getCityUrl(city.name, city.id);
                    return (
                      <div key={city.id} className="space-y-2">
                        <Link
                          href={url}
                          onClick={() => setShowMobilePlacesDropdown(false)}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left w-full min-h-[44px]"
                        >
                          <img
                            src={city.image}
                            alt={`${city.name} tours and cultural experiences`}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[#001A33] text-sm mb-0.5">{city.name} Tours</div>
                            <div className="text-gray-500 text-xs">{city.localAngle}</div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Mobile Inspiration Dropdown */}
        {showMobileInspirationDropdown && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 top-[72px] sm:top-[82px] md:top-[92px]"
              onClick={() => setShowMobileInspirationDropdown(false)}
            />
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto top-[72px] sm:top-[82px] md:top-[92px]">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#001A33]">Trip inspiration</h3>
                <button onClick={() => setShowMobileInspirationDropdown(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                    <h4 className="font-bold text-[#001A33] text-sm">City guides</h4>
                  </div>
                  <p className="text-gray-500 text-xs">Explore all</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {CITY_GUIDES.map((city, idx) => {
                    const cityId = CITY_GUIDE_ID_MAP[city.name] || city.name.toLowerCase().replace(/\s+/g, '-');
                    const url = getCityUrl(city.name, cityId);
                    return (
                      <Link
                        key={idx}
                        href={url}
                        onClick={() => setShowMobileInspirationDropdown(false)}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
                      >
                        <img src={city.image} alt={city.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="font-semibold text-[#001A33] text-[10px] text-center leading-tight">{city.name} Travel Guide</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {HERO_IMAGES.map((hero, index) => (
          <img
            key={index}
            src={hero.url}
            alt={`${hero.city} - Authentic local tours and cultural experiences in ${hero.city}, Asia`}
            className={`absolute inset-0 w-full h-full object-cover object-center brightness-[0.7] transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 hero-overlay z-10"></div>

        <div className="relative z-10 w-full max-w-[800px] px-1 md:px-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 sm:mb-8 md:mb-10 tracking-tight leading-tight">
            Discover Authentic Local Tours & Cultural Experiences Across Asia
          </h1>

          <div className="bg-white p-1 md:p-2 rounded-full shadow-2xl flex flex-row flex-nowrap items-stretch gap-1 md:gap-2 relative w-full max-w-[600px] mx-auto">
            <div className="flex-1 flex items-center gap-1 md:gap-4 px-2 md:px-6 py-2 md:py-3 min-w-0 relative">
              <Search size={16} className="text-gray-400 shrink-0 md:w-5 md:h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                placeholder="Search cities or tours..."
                className="flex-1 outline-none border-none ring-0 focus:ring-0 focus:border-none bg-transparent text-[#001A33] font-bold text-sm sm:text-base md:text-lg placeholder:text-gray-400 placeholder:font-medium min-w-0"
              />

              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  {filteredSuggestions.slice(0, 8).map((city) => (
                    <button
                      key={city.slug}
                      onClick={() => handleSearch(city.name)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 min-h-[44px]"
                    >
                      <MapPin size={18} className="text-[#10B981] flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-[#001A33] text-sm sm:text-base truncate">{city.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500 font-semibold truncate">{city.country}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleSearch()}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-black px-4 sm:px-6 md:px-8 lg:px-12 py-2.5 sm:py-3 md:py-4 rounded-full text-sm sm:text-base md:text-lg transition-all shadow-lg active:scale-95 shrink-0 whitespace-nowrap min-h-[44px] flex items-center justify-center"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Row 1: Things to do wherever you're going */}
        <section className="max-w-[1400px] mx-auto pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-12 md:pb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[28px] font-black text-[#001A33] mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
            Things to do wherever you&apos;re going
          </h2>
          <div className="relative px-4 sm:px-6 lg:px-8">
            {canScrollLeft && (
              <button
                onClick={() => {
                  const scrollContainer = document.getElementById('cities-scroll');
                  if (scrollContainer) {
                    const cardWidth = window.innerWidth < 640 ? 170 : 200;
                    const gap = window.innerWidth < 640 ? 16 : 20;
                    scrollContainer.scrollTo({ left: Math.max(0, scrollContainer.scrollLeft - ((cardWidth + gap) * 3)), behavior: 'smooth' });
                  }
                }}
                className="hidden lg:flex absolute left-4 top-[40%] -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all border border-gray-100 items-center justify-center"
              >
                <ChevronLeft className="text-gray-400" size={20} />
              </button>
            )}

            <div className="relative overflow-hidden">
              <div
                id="cities-scroll"
                className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-4 scroll-smooth snap-x snap-mandatory"
                onScroll={(e) => {
                  const container = e.currentTarget;
                  setCanScrollLeft(container.scrollLeft > 10);
                  setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
                }}
              >
                {CITIES.map((city) => {
                  const url = getCityUrl(city.name, city.id);
                  return (
                    <Link
                      key={city.id}
                      href={url}
                      className="flex-shrink-0 w-[170px] sm:w-[200px] md:w-[200px] lg:w-[calc((100%-100px)/6)] xl:w-[calc((100%-120px)/6)] group snap-start"
                    >
                      <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden mb-2 sm:mb-3 shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-100">
                        <div className="relative w-full h-full">
                          <img
                            src={city.image}
                            alt={`${city.name} tours and cultural experiences`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                            <h3 className="text-white font-black text-lg sm:text-xl md:text-lg mb-1 drop-shadow-xl leading-tight">{city.name}</h3>
                            <p className="text-white/95 text-xs sm:text-sm md:text-[11px] font-semibold drop-shadow-md leading-snug">{city.localAngle}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {canScrollRight && (
              <button
                onClick={() => {
                  const scrollContainer = document.getElementById('cities-scroll');
                  if (scrollContainer) {
                    const cardWidth = window.innerWidth < 640 ? 280 : 200;
                    const gap = window.innerWidth < 640 ? 16 : 20;
                    scrollContainer.scrollTo({ left: scrollContainer.scrollLeft + ((cardWidth + gap) * 3), behavior: 'smooth' });
                  }
                }}
                className="hidden lg:flex absolute right-4 top-[40%] -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all border border-gray-100 items-center justify-center"
              >
                <ChevronRight className="text-gray-400" size={20} />
              </button>
            )}
          </div>
        </section>

        {/* Attractions you can't miss */}
        <section className="max-w-[1200px] mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-[28px] font-black text-[#001A33] mb-8">
            Attractions you can&apos;t miss
          </h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {ATTRACTIONS.map((attr) => (
              <div key={attr.id} className="group flex-shrink-0 w-72 md:w-[380px] h-48 rounded-2xl overflow-hidden relative cursor-pointer shadow-sm hover:shadow-lg transition-all">
                <img src={attr.image} alt={`${attr.title} - Top attraction in ${attr.location}`} className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-black text-xl leading-tight mb-1">{attr.title}</h4>
                  <p className="text-green-400 text-[11px] font-black uppercase tracking-widest italic mb-2">
                    {attr.whyLocal}
                  </p>
                  <p className="text-white/70 text-[12px] font-bold uppercase">{attr.experts} verified local experts</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exploration Footer */}
        <ExplorationFooter />

        {/* Testimonials Section */}
        <section className="bg-white py-24 border-t border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6">
            <h2 className="text-3xl font-black text-[#001A33] mb-16 text-center">What travellers say</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {TESTIMONIALS.map((t, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col items-center text-center group hover:border-[#67C1B0]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                  <div className="text-[#67C1B0] mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    <Quote size={48} fill="currentColor" fillOpacity="0.1" />
                  </div>
                  <p className="text-gray-500 text-[14px] leading-relaxed italic mb-8 font-medium">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#FFB800] text-[#FFB800]" />
                    ))}
                  </div>
                  <div className="mb-8">
                    <span className="block font-black text-[#001A33] text-[15px]">{t.name}</span>
                    <span className="text-[12px] text-gray-400 font-bold uppercase tracking-widest">Traveller</span>
                  </div>
                  <Link
                    href={t.link}
                    className="mt-auto text-[13px] font-black text-[#001A33] border-b-2 border-gray-200 hover:border-[#67C1B0] transition-colors pb-0.5"
                  >
                    {t.tour}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Global Local Trust Bar */}
        <section className="bg-gray-50 py-20 border-y border-gray-100">
          <div className="max-w-[1000px] mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-[#001A33] mb-4">Curated, not crowded.</h2>
            <p className="text-gray-500 font-medium mb-12 max-w-xl mx-auto">
              We vet every local host to ensure your experience is safe, ethical, and culturally profound.
            </p>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="font-black text-lg mb-2">100% Verified</h4>
                <p className="text-sm text-gray-500">Every guide is personally interviewed and verified on-ground.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mb-4">
                  <Award size={32} />
                </div>
                <h4 className="font-black text-lg mb-2">Quality First</h4>
                <p className="text-sm text-gray-500">We prioritize storytelling and depth over mass-market tourism.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mb-4">
                  <MapPin size={32} />
                </div>
                <h4 className="font-black text-lg mb-2">Direct Impact</h4>
                <p className="text-sm text-gray-500">Payments go directly to local communities, ensuring fair wages.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Scrollbar hide styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .hero-overlay { background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%); }
        `
      }} />
    </div>
  );
}
