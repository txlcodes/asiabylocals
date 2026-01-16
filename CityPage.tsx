import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Users, Search, Filter, Heart, ShoppingCart, User, Globe, ChevronDown, Calendar } from 'lucide-react';

interface CityPageProps {
  country: string;
  city: string;
}

// City descriptions for SEO - Battle-tested structure
const CITY_DESCRIPTIONS: Record<string, { 
  title: string; 
  description: string; 
  intro: string[];
  whyBook: string[];
  topAttractions: string[];
  bestTime: string;
  faqs: { question: string; answer: string }[];
}> = {
  'Agra': {
    title: 'Agra Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Agra with licensed local guides. Taj Mahal sunrise tours, heritage walks, food tours & day trips.',
    intro: [
      'Agra is one of India\'s most visited cities, famous worldwide for the Taj Mahal and its rich Mughal heritage. Beyond the iconic monument, Agra offers a deep cultural experience through historic forts, bustling bazaars, traditional crafts, and local cuisine.',
      'At AsiaByLocals, discover expert-led tours in Agra hosted by licensed local guides and historians. From Taj Mahal sunrise visits to heritage walks, food tours, and day trips to Fatehpur Sikri, explore Agra through authentic, locally curated experiences.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Taj Mahal',
      'Agra Fort',
      'Mehtab Bagh',
      'Itmad-ud-Daulah',
      'Fatehpur Sikri',
      'Local markets & food streets'
    ],
    bestTime: 'The best time to visit Agra is from October to March when the weather is pleasant. Early mornings are highly recommended, especially for sunrise Taj Mahal tours when the monument glows in golden light and crowds are minimal.',
    faqs: [
      {
        question: 'How long does a Taj Mahal tour take?',
        answer: 'A typical Taj Mahal tour takes 2-3 hours, including entry, guided exploration, and photography time. Combined tours with Agra Fort usually take 5-6 hours.'
      },
      {
        question: 'Are Agra tours suitable for families?',
        answer: 'Yes, most Agra tours are family-friendly. Our guides adapt the pace and content for children, making history engaging and accessible for all ages.'
      },
      {
        question: 'Do I need a licensed guide in Agra?',
        answer: 'While not mandatory, a licensed local guide enhances your experience significantly by providing historical context, cultural insights, and helping navigate the sites efficiently.'
      },
      {
        question: 'Are sunrise tours worth it?',
        answer: 'Absolutely. Sunrise tours offer the best lighting for photography, cooler temperatures, fewer crowds, and a magical experience as the Taj Mahal glows in the morning light.'
      }
    ]
  },
  'Delhi': {
    title: 'Delhi Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Delhi with licensed local guides. Red Fort tours, Old Delhi heritage walks, street food tours & cultural experiences.',
    intro: [
      'Delhi, India\'s capital, is a vibrant blend of ancient history and modern energy. From the historic Red Fort and Jama Masjid to the bustling markets of Old Delhi and the modern architecture of New Delhi, the city offers endless exploration opportunities.',
      'At AsiaByLocals, explore Delhi through expert-led tours with licensed local guides. Discover authentic street food, hidden neighborhoods, and the real stories that make Delhi special. Experience the contrast between Old Delhi\'s narrow lanes and New Delhi\'s wide boulevards with knowledgeable local experts.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Red Fort',
      'Jama Masjid',
      'India Gate',
      'Qutub Minar',
      'Humayun\'s Tomb',
      'Old Delhi markets & street food'
    ],
    bestTime: 'The best time to visit Delhi is from October to March when the weather is pleasant. Early mornings and late afternoons are ideal for exploring outdoor sites and markets.',
    faqs: [
      {
        question: 'How long does a Delhi heritage tour take?',
        answer: 'A typical Old Delhi heritage walk takes 3-4 hours, while combined tours covering multiple monuments can take 6-8 hours.'
      },
      {
        question: 'Are Delhi tours suitable for families?',
        answer: 'Yes, Delhi tours are family-friendly. Our guides adapt the experience for children and ensure comfortable pacing for all ages.'
      },
      {
        question: 'Do I need a licensed guide in Delhi?',
        answer: 'While not mandatory, a licensed local guide helps navigate Delhi\'s complex history, diverse neighborhoods, and provides valuable cultural insights.'
      },
      {
        question: 'Are street food tours safe?',
        answer: 'Yes, our guides take you to trusted vendors with high hygiene standards. We ensure safe, authentic food experiences while respecting dietary restrictions.'
      }
    ]
  },
  'Jaipur': {
    title: 'Jaipur Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Jaipur with licensed local guides. City Palace tours, Hawa Mahal visits, heritage walks & authentic Rajasthan experiences.',
    intro: [
      'Jaipur, known as the Pink City, is the vibrant capital of Rajasthan. Famous for its stunning palaces, colorful markets, and rich cultural heritage, Jaipur offers visitors a glimpse into royal India.',
      'At AsiaByLocals, explore Jaipur through expert-led tours with licensed local guides. Discover the magnificent City Palace, the unique Hawa Mahal (Palace of Winds), and the ancient Jantar Mantar observatory. Our guides share the stories behind these architectural marvels and take you to authentic markets, traditional workshops, and hidden gems that showcase Jaipur\'s true character.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'City Palace',
      'Hawa Mahal',
      'Jantar Mantar',
      'Amber Fort',
      'Nahargarh Fort',
      'Local markets & traditional workshops'
    ],
    bestTime: 'The best time to visit Jaipur is from October to March when the weather is pleasant. Early mornings are ideal for exploring palaces and forts before the heat sets in.',
    faqs: [
      {
        question: 'How long does a Jaipur palace tour take?',
        answer: 'A typical City Palace and Hawa Mahal tour takes 3-4 hours. Combined tours with Amber Fort can take 6-8 hours including travel time.'
      },
      {
        question: 'Are Jaipur tours suitable for families?',
        answer: 'Yes, Jaipur tours are very family-friendly. The palaces and markets are engaging for children, and our guides make history come alive for all ages.'
      },
      {
        question: 'Do I need a licensed guide in Jaipur?',
        answer: 'While not mandatory, a licensed local guide enhances your experience by explaining the rich history, architecture, and cultural significance of Jaipur\'s royal heritage.'
      },
      {
        question: 'Are heritage walks worth it?',
        answer: 'Absolutely. Heritage walks in Jaipur\'s old city reveal hidden gems, traditional crafts, local stories, and authentic experiences you won\'t find on your own.'
      }
    ]
  },
  'Mumbai': {
    title: 'Mumbai Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Mumbai with licensed local guides. Gateway of India tours, street food walks, heritage tours & cultural experiences.',
    intro: [
      'Mumbai, India\'s financial capital, is a city of contrasts where colonial architecture meets modern skyscrapers, and luxury hotels stand alongside vibrant street markets.',
      'At AsiaByLocals, explore Mumbai through expert-led tours with licensed local guides. Discover the iconic Gateway of India, Marine Drive, bustling markets of Colaba, and authentic street food. Our guides help you navigate this bustling metropolis and understand what makes Mumbai the city of dreams for millions.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Gateway of India',
      'Marine Drive',
      'Colaba Causeway',
      'Elephanta Caves',
      'Dharavi',
      'Street food & local markets'
    ],
    bestTime: 'The best time to visit Mumbai is from November to February when the weather is pleasant. Early mornings and evenings are ideal for exploring outdoor sites.',
    faqs: [
      {
        question: 'How long does a Mumbai city tour take?',
        answer: 'A typical Mumbai city tour covering major landmarks takes 4-6 hours. Street food tours usually take 2-3 hours.'
      },
      {
        question: 'Are Mumbai tours suitable for families?',
        answer: 'Yes, Mumbai tours are family-friendly. Our guides ensure comfortable pacing and adapt the experience for children.'
      },
      {
        question: 'Do I need a licensed guide in Mumbai?',
        answer: 'While not mandatory, a licensed local guide helps navigate Mumbai\'s complex neighborhoods and provides valuable cultural insights.'
      },
      {
        question: 'Are street food tours safe?',
        answer: 'Yes, our guides take you to trusted vendors with high hygiene standards. We ensure safe, authentic food experiences.'
      }
    ]
  },
  'Goa': {
    title: 'Goa Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Goa with licensed local guides. Beach tours, Portuguese heritage walks, spice plantation visits & cultural experiences.',
    intro: [
      'Goa, India\'s smallest state, is famous for its beautiful beaches, Portuguese colonial heritage, and laid-back atmosphere.',
      'At AsiaByLocals, explore Goa through expert-led tours with licensed local guides. Discover pristine beaches, historic churches, spice plantations, and local villages. Our guides take you to hidden beaches and cultural gems that showcase authentic Goan life.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Beaches',
      'Portuguese churches',
      'Spice plantations',
      'Local markets',
      'Heritage villages',
      'Waterfalls & nature spots'
    ],
    bestTime: 'The best time to visit Goa is from November to February when the weather is perfect for beach activities and sightseeing.',
    faqs: [
      {
        question: 'How long does a Goa heritage tour take?',
        answer: 'A typical Goa heritage tour covering churches and Portuguese architecture takes 3-4 hours. Spice plantation visits take 2-3 hours.'
      },
      {
        question: 'Are Goa tours suitable for families?',
        answer: 'Yes, Goa tours are very family-friendly with activities suitable for all ages including beaches, markets, and cultural sites.'
      },
      {
        question: 'Do I need a licensed guide in Goa?',
        answer: 'While not mandatory, a licensed local guide enhances your experience by explaining Goa\'s unique blend of Indian and Portuguese cultures.'
      },
      {
        question: 'Are spice plantation tours worth it?',
        answer: 'Absolutely. Spice plantation tours offer hands-on experiences, traditional Goan cuisine, and insights into local agriculture and culture.'
      }
    ]
  }
};

const CityPage: React.FC<CityPageProps> = ({ country, city }) => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('recommended');

  useEffect(() => {
    fetchTours();
  }, [country, city]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const url = `http://localhost:3001/api/public/tours?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}&status=approved`;
      console.log('CityPage - Fetching tours from:', url);
      const response = await fetch(url);
      console.log('CityPage - Response status:', response.status);
      const data = await response.json();
      console.log('CityPage - Response data:', data);
      if (data.success) {
        // Ensure all tours have slugs
        const toursWithSlugs = data.tours.map((tour: any) => ({
          ...tour,
          slug: tour.slug || `tour-${tour.id}` // Fallback slug if missing
        }));
        console.log('CityPage - Setting tours:', toursWithSlugs.length, toursWithSlugs);
        setTours(toursWithSlugs);
      } else {
        console.error('CityPage - API returned success=false:', data);
        setTours([]);
      }
    } catch (error) {
      console.error('CityPage - Error fetching tours:', error);
      setTours([]);
    } finally {
      setLoading(false);
      console.log('CityPage - Loading complete');
    }
  };

  // Get city info with defaults
  const cityInfo = CITY_DESCRIPTIONS[city] || {
    title: `${city} Tours & Things to Do | Guided Experiences by Locals`,
    description: `Discover the best tours in ${city} with licensed local guides. Book authentic experiences and cultural tours.`,
    intro: [
      `${city} offers rich cultural experiences and historical sites waiting to be explored.`,
      `At AsiaByLocals, discover expert-led tours in ${city} hosted by licensed local guides. Explore authentic, locally curated experiences that showcase the best of ${city}.`
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [],
    bestTime: `The best time to visit ${city} is during the cooler months when weather is pleasant for sightseeing.`,
    faqs: []
  };

  // Filter tours
  const filteredTours = tours.filter(tour => {
    const matchesCategory = filterCategory === 'all' || tour.category === filterCategory;
    const matchesSearch = searchQuery === '' || 
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tour.shortDescription && tour.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Generate country slug
  const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');

  // Helper function to generate unique random rating between 4.0 and 5.0 for each tour
  const calculateRating = (tour: any) => {
    // Generate a consistent random rating based on tour ID (so it's unique but stable)
    // This creates a pseudo-random number between 4.0 and 5.0
    const seed = parseInt(tour.id) || 0;
    const random = (seed * 9301 + 49297) % 233280;
    const normalized = random / 233280;
    return 4.0 + (normalized * 1.0); // Range: 4.0 to 5.0
  };

  // Helper function to get review count
  const getReviewCount = (tour: any) => {
    if (!tour.reviews) return 0;
    try {
      const reviews = typeof tour.reviews === 'string' ? JSON.parse(tour.reviews) : tour.reviews;
      return Array.isArray(reviews) ? reviews.length : 0;
    } catch (e) {
      return 0;
    }
  };

  // Sort tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortBy === 'recommended') {
      // Sort by rating (descending), then by review count
      const ratingA = calculateRating(a) || 0;
      const ratingB = calculateRating(b) || 0;
      if (ratingB !== ratingA) return ratingB - ratingA;
      return getReviewCount(b) - getReviewCount(a);
    } else if (sortBy === 'price-low') {
      return a.pricePerPerson - b.pricePerPerson;
    } else if (sortBy === 'price-high') {
      return b.pricePerPerson - a.pricePerPerson;
    }
    return 0;
  });

  // SEO Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": `AsiaByLocals - ${city} Tours`,
    "description": cityInfo.description,
    "url": `https://asiabylocals.com/${countrySlug}/${citySlug}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressCountry": country
    },
    "areaServed": {
      "@type": "City",
      "name": city,
      "containedIn": {
        "@type": "Country",
        "name": country
      }
    },
    "offers": tours.map(tour => ({
      "@type": "Offer",
      "name": tour.title,
      "description": tour.shortDescription || tour.fullDescription,
      "price": tour.pricePerPerson,
      "priceCurrency": tour.currency,
      "availability": tour.status === 'approved' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }))
  };

  // Update SEO meta tags
  useEffect(() => {
    // Update title
    document.title = cityInfo.title;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', cityInfo.description);
    
    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', `${city} tours, ${city} experiences, ${country} tours, local guides ${city}, ${city} travel guide, things to do in ${city}, ${city} activities`);
    
    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://asiabylocals.com/${countrySlug}/${citySlug}`);
    
    // Update Open Graph
    const ogTags = [
      { property: 'og:title', content: cityInfo.title },
      { property: 'og:description', content: cityInfo.description },
      { property: 'og:url', content: `https://asiabylocals.com/${countrySlug}/${citySlug}` },
      { property: 'og:type', content: 'website' }
    ];
    
    ogTags.forEach(tag => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', tag.property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', tag.content);
    });
    
    // Add structured data
    let existingScript = document.querySelector('script[type="application/ld+json"][data-city-page]');
    if (existingScript) {
      existingScript.remove();
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-city-page', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [city, country, cityInfo, countrySlug, citySlug, structuredData]);

  return (
    <div className="min-h-screen bg-white">

      {/* Header - GetYourGuide Style */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <img src="/logo.png" alt="AsiaByLocals" className="h-10 w-10 object-contain" />
              <span className="font-black text-[#001A33] text-lg">ASIA BY LOCALS</span>
            </a>

            {/* Search Bar - Large and Prominent */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={city}
                  readOnly
                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-3 pl-12 pr-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#10B981] hover:bg-[#059669] text-white font-black px-6 py-2 rounded-lg text-[14px] transition-colors">
                  Search
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <a href="/supplier" className="text-[14px] font-semibold text-[#001A33] hover:text-[#10B981] transition-colors">
                Become a supplier
              </a>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart size={20} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <Globe size={16} className="text-gray-600" />
                <span className="text-[14px] font-semibold text-[#001A33]">EN</span>
                <span className="text-[14px] text-gray-500">/</span>
                <span className="text-[14px] font-semibold text-[#001A33]">INR ₹</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-[14px] font-semibold text-[#001A33]">
            <a href="#" className="hover:text-[#10B981] transition-colors">Explore {city}</a>
            <a href="#" className="flex items-center gap-1 hover:text-[#10B981] transition-colors">
              Places to see <ChevronDown size={14} />
            </a>
            <a href="#" className="flex items-center gap-1 hover:text-[#10B981] transition-colors">
              Things to do <ChevronDown size={14} />
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* H1 - SEO Gold (ONLY ONE H1) */}
        <h1 className="text-4xl md:text-5xl font-black text-[#001A33] mb-8">
          Guided Tours & Things to Do in {city}
        </h1>

        {/* Intro Content - 2-3 Paragraphs (Mandatory for SEO) */}
        <div className="mb-10 space-y-4 text-[16px] text-gray-700 font-semibold leading-relaxed max-w-4xl">
          {cityInfo.intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* H2 #1: Popular Tours & Experiences */}
        {sortedTours.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black text-[#001A33] mb-6">
              Popular Tours & Experiences in {city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sortedTours.map((tour) => {
                const tourSlug = tour.slug || `tour-${tour.id}`;
                const hasSkipLine = tour.included && tour.included.toLowerCase().includes('skip');
                const hasPickup = tour.meetingPoint || (tour.included && tour.included.toLowerCase().includes('pickup'));
                
                // Calculate rating (random between 4.0 and 5.0, unique per tour)
                const rating = calculateRating(tour);
                const displayRating = rating.toFixed(1);
                const isTopRated = rating >= 4.5;
                
                // Parse duration to extract hours
                const durationMatch = tour.duration?.match(/(\d+)\s*hours?/i) || tour.duration?.match(/(\d+)\s*hrs?/i);
                const durationHours = durationMatch ? durationMatch[1] : null;
                
                // Get lowest price from options or use pricePerPerson
                let lowestPrice = tour.pricePerPerson;
                if (tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
                  const prices = tour.options.map((opt: any) => opt.price || tour.pricePerPerson);
                  lowestPrice = Math.min(...prices);
                }
                
                return (
                  <a
                    key={tour.id}
                    href={`/${countrySlug}/${citySlug}/${tourSlug}`}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group"
                  >
                    {/* Image Section */}
                    {tour.images && tour.images.length > 0 && (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={tour.images[0]}
                          alt={`${tour.title} in ${city} - ${cityInfo.description}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Top Rated Badge */}
                        {isTopRated && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-[#10B981] text-white text-[10px] font-black rounded-md">
                              Top rated
                            </span>
                          </div>
                        )}
                        {/* Wishlist Heart */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        >
                          <Heart size={18} className="text-gray-600" />
                        </button>
                      </div>
                    )}
                    
                    {/* Content Section */}
                    <div className="p-4">
                      {/* H3 - Tour Title (SEO Gold) */}
                      <h3 className="text-[16px] font-black text-[#001A33] mb-3 line-clamp-2 group-hover:text-[#10B981] transition-colors leading-tight">
                        {tour.title}
                      </h3>
                      
                      {/* Duration */}
                      {durationHours && (
                        <div className="text-[12px] text-gray-500 font-semibold mb-3">
                          {durationHours} {durationHours === '1' ? 'hour' : 'hours'}
                        </div>
                      )}
                      
                      {/* Rating & Activity Provider Row */}
                      <div className="flex items-center justify-between mb-3">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => {
                              const starRating = parseFloat(displayRating);
                              const filled = i < Math.floor(starRating);
                              const halfFilled = i === Math.floor(starRating) && starRating % 1 >= 0.5;
                              return (
                                <div key={i} className="relative">
                                  <Star 
                                    size={14} 
                                    className="text-gray-300"
                                  />
                                  {(filled || halfFilled) && (
                                    <Star 
                                      size={14} 
                                      className={`absolute top-0 left-0 text-yellow-400 fill-yellow-400 ${halfFilled ? 'clip-path-half' : ''}`}
                                      style={halfFilled ? { clipPath: 'inset(0 50% 0 0)' } : {}}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <span className="text-[14px] font-black text-[#001A33]">{displayRating}</span>
                        </div>
                      </div>
                      
                      {/* Price Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="text-right w-full">
                          <div className="text-[18px] font-black text-[#001A33]">
                            From {tour.currency === 'INR' ? '₹' : '$'}{lowestPrice.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-gray-500 font-semibold">per person</div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* H2 #2: Why Book with Local Guides */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-[#001A33] mb-6">
            Why Book {city} Tours with Local Guides?
          </h2>
          <ul className="space-y-3 max-w-3xl">
            {cityInfo.whyBook.map((reason, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2 shrink-0"></div>
                <span className="text-[16px] text-gray-700 font-semibold">{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* H2 #3: Top Attractions */}
        {cityInfo.topAttractions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black text-[#001A33] mb-6">
              Top Attractions Covered in {city} Tours
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
              {cityInfo.topAttractions.map((attraction, index) => (
                <div key={index} className="flex items-center gap-2 text-[16px] text-gray-700 font-semibold">
                  <MapPin size={16} className="text-[#10B981] shrink-0" />
                  <span>{attraction}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* H2 #4: Best Time to Visit */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-[#001A33] mb-4">
            Best Time to Visit {city}
          </h2>
          <p className="text-[16px] text-gray-700 font-semibold leading-relaxed max-w-3xl">
            {cityInfo.bestTime}
          </p>
        </section>

        {/* H2 #5: FAQs */}
        {cityInfo.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black text-[#001A33] mb-6">
              FAQs About {city} Tours
            </h2>
            <div className="space-y-6 max-w-3xl">
              {cityInfo.faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h3 className="text-[18px] font-black text-[#001A33] mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-[16px] text-gray-700 font-semibold leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Filter Buttons Row - GetYourGuide Style */}
        {sortedTours.length > 0 && (
          <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Calendar size={16} />
              Dates
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Day trips
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Multi-day
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Photography
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Sunrise
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Private tours
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Walking tours
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Filter size={16} className="inline mr-1" />
              Filters
            </button>
          </div>
        )}

        {/* Results Summary & Sort - Only show if tours exist */}
        {sortedTours.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-[16px] font-black text-[#001A33]">
              {sortedTours.length} {sortedTours.length === 1 ? 'result' : 'results'}: {city}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] focus:ring-2 focus:ring-[#10B981] outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto"></div>
            <p className="text-[14px] text-gray-500 font-semibold mt-4">Loading tours...</p>
          </div>
        )}

        {/* Empty State - Only show if no tours */}
        {!loading && sortedTours.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-black text-[#001A33] mb-2">No tours available yet</h3>
            <p className="text-[14px] text-gray-500 font-semibold">
              {searchQuery || filterCategory !== 'all' 
                ? 'Try adjusting your filters'
                : `Be the first to create a tour in ${city}!`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityPage;
