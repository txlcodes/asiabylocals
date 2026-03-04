import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import {
  Globe,
  Search,
  Heart,
  User,
  Star,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Menu,
  Award,
  ShieldCheck,
  X,
  Trash2,
  LogIn,
  LogOut,
  Quote
} from 'lucide-react';
import { CITIES, EXPERIENCES, ATTRACTIONS } from './constants';
import { ASIAN_CITIES_DATABASE } from './citiesDatabase';
import SupplierPage from './SupplierPage';
import VerifyEmail from './VerifyEmail';
import EmailVerificationWaiting from './EmailVerificationWaiting';
import TourDetailPage from './TourDetailPage';
import CityPage from './CityPage';
import AdminDashboard from './AdminDashboard';
import CityInfoPage from './CityInfoPage';
import BookingPage from './BookingPage';
import Footer from './Footer';

// List of Agra Authority Page Slugs for Interception
const AGRA_INFO_SLUGS = [
  'things-to-do-in-agra',
  'places-to-visit-in-agra',
  '1-day-agra-itinerary',
  'taj-mahal-ticket-price-2026',
  'taj-mahal-opening-time',
  'is-taj-mahal-closed-on-friday',
  'agra-travel-guide-2026',
  'taj-mahal',
  'agra-fort',
  'fatehpur-sikri'
];

// List of Delhi Authority Page Slugs for Interception
const DELHI_INFO_SLUGS = [
  'delhi-travel-guide-2026',
  'red-fort',
  'qutub-minar',
  'humayuns-tomb',
  'india-gate',
  'things-to-do-in-delhi',
  'delhi-1-day-itinerary'
];

// List of Phuket Authority Page Slugs for Interception
const PHUKET_INFO_SLUGS = [
  'things-to-do-in-phuket',
  'phuket-travel-guide-2026',
  'phi-phi-islands',
  'phang-nga-bay',
  'big-buddha-phuket',
  'wat-chalong',
  'phuket-old-town',
  'phuket-1-day-itinerary'
];

import BookingConfirmation from './BookingConfirmation';
import PaymentCallback from './PaymentCallback';
import SafetyGuidelines from './SafetyGuidelines';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';
import SupportPage from './SupportPage';
import AboutUs from './AboutUs';
import TouristLogin from './TouristLogin';
import TouristSignup from './TouristSignup';


interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">Error loading tour</h2>
            <p className="text-gray-500 font-semibold mb-6">{this.state.error?.message || 'Please try again later.'}</p>
            <button
              onClick={this.handleReset}
              className="px-6 py-2 bg-[#10B981] text-white font-bold rounded-lg hover:bg-[#059669] transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ExploreItem {
  name: string;
  count: string;
  image: string;
}

interface ExplorationData {
  [key: string]: ExploreItem[];
}

const EXPLORATION_DATA: ExplorationData = {
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
      {/* Dynamic Tab Navigation */}
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

      {/* Horizontal Scroll Content Container */}
      <div className="relative group/scroll">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all border border-gray-100 items-center justify-center -ml-5"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-gray-400 group-hover/scroll:text-[#10B981] transition-colors" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all border border-gray-100 items-center justify-center -mr-5"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-gray-400 group-hover/scroll:text-[#10B981] transition-colors" />
          </button>
        )}

        {/* Scroll Content */}
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
              <a
                key={`${activeTab}-${idx}`}
                href={href}
                className="relative flex-shrink-0 w-72 h-64 rounded-3xl overflow-hidden transition-all duration-700 bg-black group"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-80 group-hover:opacity-100"
                  />
                </div>

                {/* Minimal Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-700" />

                {/* Minimal Content */}
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <h6 className="text-white text-[18px] font-thin tracking-tight leading-tight group-hover:font-normal transition-all duration-500">
                    {item.name.split(',')[0]}
                  </h6>
                  <span className="text-white/60 text-[10px] font-medium tracking-[0.1em] uppercase mt-1 block group-hover:text-white transition-colors">
                    {item.count}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  // Search state - Focus on Agra, Delhi, Jaipur
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Wishlist, Profile state
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // Tourist authentication modals
  const [showTouristLogin, setShowTouristLogin] = useState(false);
  const [showTouristSignup, setShowTouristSignup] = useState(false);
  const [pendingWishlistTour, setPendingWishlistTour] = useState<any>(null);

  // Use ASIAN_CITIES_DATABASE for search suggestions
  const focusCities = useMemo(() => {
    return ASIAN_CITIES_DATABASE.map(city => ({
      name: city.name,
      country: city.country,
      slug: city.name.toLowerCase().replace(/\s+/g, '-')
    }));
  }, []);

  // Filter suggestions based on search query - Prioritize startsWith over includes
  const filteredSuggestions = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase();

    return focusCities
      .filter(city => city.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aStarts = aName.startsWith(query);
        const bStarts = bName.startsWith(query);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aName.localeCompare(bName);
      });
  }, [searchQuery, focusCities]);

  // Handle search - redirects to city page
  const handleSearch = (cityName?: string) => {
    const query = cityName || searchQuery.trim();
    if (!query) return;

    // Special case for Taj Mahal authority page
    if (query.toLowerCase().includes('taj mahal')) {
      window.location.href = "/india/agra/taj-mahal";
      return;
    }

    // Find matching city (case-insensitive)
    const matchedCity = focusCities.find(city =>
      city.name.toLowerCase() === query.toLowerCase()
    );

    if (matchedCity) {
      const countrySlug = matchedCity.country.toLowerCase().replace(/\s+/g, '-');
      window.location.href = `/${countrySlug}/${matchedCity.slug}`;
    } else {
      // If no exact match, try fuzzy match
      const fuzzyMatch = focusCities.find(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      if (fuzzyMatch) {
        const countrySlug = fuzzyMatch.country.toLowerCase().replace(/\s+/g, '-');
        window.location.href = `/${countrySlug}/${fuzzyMatch.slug}`;
      }
    }
    setShowSuggestions(false);
  };

  // Load wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    const savedUser = localStorage.getItem('user');

    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error loading wishlist:', e);
      }
    }

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (e) {
        console.error('Error loading user:', e);
      }
    }

    // Set up initial placeholder function immediately
    (window as any).addToWishlist = (tour: any) => {
      console.log('addToWishlist called (placeholder - will be replaced)', { tour });
    };
  }, []);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Expose functions globally so tour pages can add items
  useEffect(() => {
    const wishlistHandler = (tour: any) => {
      console.log('addToWishlist called', { tour, tourId: tour?.id, user, wishlistLength: wishlist.length });

      if (!tour || !tour.id) {
        console.error('Invalid tour object:', tour);
        alert('Unable to add tour to wishlist. Please try again.');
        return;
      }

      // Check if user is logged in
      if (!user || user.type !== 'tourist') {
        console.log('User not logged in, showing login modal');
        // Store the tour they want to add and show login modal
        setPendingWishlistTour(tour);
        setShowTouristLogin(true);
        return;
      }

      console.log('User logged in, adding to wishlist');
      // User is logged in, add to wishlist
      if (!wishlist.find((item: any) => item.id === tour.id)) {
        setWishlist((prev: any[]) => [...prev, tour]);
        console.log('Tour added to wishlist');
      } else {
        console.log('Tour already in wishlist');
      }
    };

    (window as any).addToWishlist = wishlistHandler;
    (window as any).openWishlist = () => setShowWishlistModal(true);
    (window as any).user = user; // Expose user state
    (window as any).wishlist = wishlist; // Expose wishlist state for checking

    return () => {
      delete (window as any).addToWishlist;
      delete (window as any).openWishlist;
      delete (window as any).user;
      delete (window as any).wishlist;
    };
  }, [wishlist, user]);

  // Handle successful tourist login/signup
  const handleTouristAuthSuccess = (userData: any) => {
    setUser(userData);
    // If there was a pending wishlist tour, add it now
    if (pendingWishlistTour) {
      if (!wishlist.find((item: any) => item.id === pendingWishlistTour.id)) {
        setWishlist([...wishlist, pendingWishlistTour]);
      }
      setPendingWishlistTour(null);
    }
  };

  const removeFromWishlist = (tourId: string) => {
    setWishlist(wishlist.filter((item: any) => item.id !== tourId));
  };

  // Helper to get tour price for display and calculation
  const getTourPrice = (tour: any) => {
    let displayPrice = 0;

    // PRIORITY 1: Check tour.groupPricingTiers directly
    if (tour.groupPricingTiers) {
      try {
        const tiers = typeof tour.groupPricingTiers === 'string'
          ? JSON.parse(tour.groupPricingTiers)
          : tour.groupPricingTiers;
        if (Array.isArray(tiers) && tiers.length > 0 && tiers[0]?.price) {
          displayPrice = parseFloat(tiers[0].price) || 0;
        }
      } catch (e) {
        console.error('Error parsing tour groupPricingTiers:', e);
      }
    }

    // PRIORITY 2: Check tour options for groupPricingTiers
    if (displayPrice === 0 && tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
      for (const opt of tour.options) {
        if (opt.groupPricingTiers) {
          try {
            const tiers = typeof opt.groupPricingTiers === 'string'
              ? JSON.parse(opt.groupPricingTiers)
              : opt.groupPricingTiers;
            if (Array.isArray(tiers) && tiers.length > 0 && tiers[0]?.price) {
              const firstTierPrice = parseFloat(tiers[0].price) || 0;
              if (firstTierPrice > 0) {
                displayPrice = displayPrice === 0 ? firstTierPrice : Math.min(displayPrice, firstTierPrice);
              }
            }
          } catch (e) {
            console.error('Error parsing option groupPricingTiers:', e);
          }
        }
      }
    }

    // FALLBACK: Use pricePerPerson only if no tiers found
    if (displayPrice === 0) {
      displayPrice = tour.pricePerPerson || 0;
    }

    return displayPrice;
  };

  // Profile functions
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setShowProfileModal(false);
  };

  // Check if we're on the verify-email page
  const isVerifyEmailPage = window.location.pathname === '/verify-email' || window.location.search.includes('token=');
  // Check if we're on the email verification waiting page
  const isEmailVerificationWaitingPage = window.location.pathname === '/email-verification-waiting';
  // Check if we're on the supplier page (from URL)
  const isSupplierPageFromUrl = window.location.pathname === '/supplier' || window.location.pathname === '/become-a-supplier';
  // Check if we're on the admin dashboard
  const isAdminPage = window.location.pathname === '/admin' || window.location.pathname === '/secure-panel-abl';
  // Check for policy/legal pages
  const isSafetyGuidelinesPage = window.location.pathname === '/safety-guidelines';
  const isPrivacyPolicyPage = window.location.pathname === '/privacy-policy';
  const isTermsAndConditionsPage = window.location.pathname === '/terms-and-conditions';
  const isSupportPage = window.location.pathname === '/support';
  const isAboutUsPage = window.location.pathname === '/about-us' || window.location.pathname === '/about';


  // Check for city page: /india/agra, /thailand/bangkok, etc.
  const cityPageMatch = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)$/);
  const countrySlug = cityPageMatch ? cityPageMatch[1] : null;
  const citySlug = cityPageMatch ? cityPageMatch[2] : null;

  // Check for tour page: /india/agra/tour-slug
  const tourPageMatch = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)\/(.+)$/);
  const tourCountrySlug = tourPageMatch ? tourPageMatch[1] : null;
  const tourCitySlug = tourPageMatch ? tourPageMatch[2] : null;
  const tourSlug = tourPageMatch ? tourPageMatch[3].replace(/\/+$/, '') : null;

  // Legacy tour ID route: /tour/:id
  const tourDetailMatch = window.location.pathname.match(/^\/tour\/(.+)$/);
  const tourId = tourDetailMatch ? tourDetailMatch[1] : null;

  // Convert slugs to proper case for display
  const slugToTitle = (slug: string) => {
    return slug.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const [activeTab, setActiveTab] = useState('worldwide');
  const [citiesScrollPosition, setCitiesScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showMobilePlacesDropdown, setShowMobilePlacesDropdown] = useState(false);
  const [showMobileInspirationDropdown, setShowMobileInspirationDropdown] = useState(false);
  const [showSupplierPage, setShowSupplierPage] = useState(isSupplierPageFromUrl);

  // Map city names to their country and city slugs for navigation
  const getCityUrl = (cityName: string, cityId: string): string => {
    const cityMap: Record<string, { country: string; city: string }> = {
      'agra': { country: 'india', city: 'agra' },
      'delhi': { country: 'india', city: 'delhi' },
      'jaipur': { country: 'india', city: 'jaipur' },
      'jodhpur': { country: 'india', city: 'jodhpur' },
      'bikaner': { country: 'india', city: 'bikaner' },
      'mathura': { country: 'india', city: 'mathura' },
      'varanasi': { country: 'india', city: 'varanasi' },
      'khajuraho': { country: 'india', city: 'khajuraho' },
      'gwalior': { country: 'india', city: 'gwalior' },
      'mumbai': { country: 'india', city: 'mumbai' },
      'aurangabad': { country: 'india', city: 'aurangabad' },
      'goa': { country: 'india', city: 'goa' },
      'mysore': { country: 'india', city: 'mysore' },
      'bengaluru': { country: 'india', city: 'bengaluru' },
      'tokyo': { country: 'japan', city: 'tokyo' },
      'kyoto': { country: 'japan', city: 'kyoto' },
      'osaka': { country: 'japan', city: 'osaka' },
      'bali': { country: 'indonesia', city: 'ubud' },
      'yogyakarta': { country: 'indonesia', city: 'yogyakarta' },
      'bangkok': { country: 'thailand', city: 'bangkok' },
      'phuket': { country: 'thailand', city: 'phuket' },
      'chiang-mai': { country: 'thailand', city: 'chiang-mai' },
      'hanoi': { country: 'vietnam', city: 'hanoi' },
      'ho-chi-minh-city': { country: 'vietnam', city: 'ho-chi-minh-city' },
      'beijing': { country: 'china', city: 'beijing' },
      'shanghai': { country: 'china', city: 'shanghai' },
      'manila': { country: 'philippines', city: 'manila' },
      'cebu': { country: 'philippines', city: 'cebu' },
      'siem-reap': { country: 'cambodia', city: 'siem-reap' },
      'kathmandu': { country: 'nepal', city: 'kathmandu' },
      'yangon': { country: 'myanmar', city: 'yangon' },
      'colombo': { country: 'sri-lanka', city: 'colombo' },
      'penang': { country: 'malaysia', city: 'penang' },
      'kuala-lumpur': { country: 'malaysia', city: 'kuala-lumpur' },
      'busan': { country: 'south-korea', city: 'busan' },
      'seoul': { country: 'south-korea', city: 'seoul' },
      'dubai': { country: 'uae', city: 'dubai' },
      'singapore': { country: 'singapore', city: 'singapore' },
      'hongkong': { country: 'hong-kong', city: 'hong-kong' },
      'taipei': { country: 'taiwan', city: 'taipei' }
    };

    const mapping = cityMap[cityId.toLowerCase()];
    if (mapping) {
      return `/${mapping.country}/${mapping.city}`;
    }

    // Fallback: use city name as slug
    const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
    return `/india/${citySlug}`; // Default to India for now
  };

  useEffect(() => {
    const checkScroll = () => {
      const scrollContainer = document.getElementById('cities-scroll');
      if (scrollContainer) {
        const scrollLeft = scrollContainer.scrollLeft;
        const scrollWidth = scrollContainer.scrollWidth;
        const clientWidth = scrollContainer.clientWidth;

        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
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

  // Hero images for rotation - verified Asian city images
  const heroImagesBase = [
    { url: '/kyoto-hero.jpg', city: 'Kyoto' },
    { url: '/tokyo-hero.jpg', city: 'Tokyo' },
    { url: '/agra-hero.jpg', city: 'Agra' },
    { url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000', city: 'Bangkok' },
    { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000', city: 'Bali' },
    { url: '/dubai-hero.jpg', city: 'Dubai' },
    { url: '/yu-kato-hero.jpg', city: 'Asia' },
    { url: '/tianshu-liu-hero.jpg', city: 'Asia' },
    { url: '/rafa-prada-hero.jpg', city: 'Asia' },
    { url: '/soroush-zargarbashi-hero.jpg', city: 'Asia' },
    { url: '/things-to-do/phuket-maya-bay-hero.jpg', city: 'Phuket' }
  ];

  // Shuffle function (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Randomize hero images order (only once on mount)
  const heroImages = useMemo(() => shuffleArray(heroImagesBase), []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Show verify email page if on verification route
  if (isVerifyEmailPage) {
    return <VerifyEmail />;
  }

  // Show email verification waiting page
  if (isEmailVerificationWaitingPage) {
    return <EmailVerificationWaiting />;
  }

  // Show admin dashboard
  if (isAdminPage) {
    return <AdminDashboard />;
  }

  // Show Safety Guidelines page
  if (isSafetyGuidelinesPage) {
    return <SafetyGuidelines />;
  }

  // Show Privacy Policy page
  if (isPrivacyPolicyPage) {
    return <PrivacyPolicy />;
  }

  // Show Terms & Conditions page
  if (isTermsAndConditionsPage) {
    return <TermsAndConditions />;
  }

  // Show Support page
  if (isSupportPage) {
    return <SupportPage />;
  }

  // Show About Us page
  if (isAboutUsPage) {
    return <AboutUs />;
  }

  // Show payment callback page
  const paymentCallbackMatch = window.location.pathname === '/payment-callback';
  if (paymentCallbackMatch) {
    return (
      <ErrorBoundary>
        <PaymentCallback />
      </ErrorBoundary>
    );
  }

  // Show booking page (production standard: /booking/:bookingId)
  const bookingPageMatch = window.location.pathname.match(/^\/booking\/(\d+)$/);
  if (bookingPageMatch) {
    return (
      <ErrorBoundary>
        <BookingPage />
      </ErrorBoundary>
    );
  }

  // Legacy booking confirmation page (redirect to new format)
  const bookingConfirmationMatch = window.location.pathname.match(/^\/booking-confirmation\/(\d+)$/);
  if (bookingConfirmationMatch) {
    const bookingId = bookingConfirmationMatch[1];
    window.location.replace(`/booking/${bookingId}`);
    return null;
  }

  // Show tour detail page (SEO-friendly URL: /country/city/slug)
  if (tourPageMatch && tourSlug) {
    // INTERCEPT: If it's an Agra Authority Page
    if (tourCitySlug?.toLowerCase() === 'agra' && AGRA_INFO_SLUGS.includes(tourSlug)) {
      return (
        <ErrorBoundary>
          <CityInfoPage
            country={slugToTitle(tourCountrySlug || 'India')}
            city={slugToTitle(tourCitySlug || 'Agra')}
            slug={tourSlug}
          />
        </ErrorBoundary>
      );
    }

    // INTERCEPT: If it's a Delhi Authority Page
    if (tourCitySlug?.toLowerCase() === 'delhi' && DELHI_INFO_SLUGS.includes(tourSlug)) {
      return (
        <ErrorBoundary>
          <CityInfoPage
            country={slugToTitle(tourCountrySlug || 'India')}
            city={slugToTitle(tourCitySlug || 'Delhi')}
            slug={tourSlug}
          />
        </ErrorBoundary>
      );
    }

    // INTERCEPT: If it's a Phuket Authority Page
    if (tourCitySlug?.toLowerCase() === 'phuket' && PHUKET_INFO_SLUGS.includes(tourSlug)) {
      return (
        <ErrorBoundary>
          <CityInfoPage
            country={slugToTitle(tourCountrySlug || 'Thailand')}
            city={slugToTitle(tourCitySlug || 'Phuket')}
            slug={tourSlug}
          />
        </ErrorBoundary>
      );
    }

    console.log('App.tsx - Routing to TourDetailPage', {
      pathname: window.location.pathname,
      tourPageMatch: !!tourPageMatch,
      tourSlug,
      tourCountrySlug,
      tourCitySlug
    });

    return (
      <ErrorBoundary>
        <TourDetailPage
          tourSlug={tourSlug}
          country={slugToTitle(tourCountrySlug || '')}
          city={slugToTitle(tourCitySlug || '')}
          onClose={() => window.history.back()}
        />
      </ErrorBoundary>
    );
  }

  // Show tour detail page (legacy ID route: /tour/:id)
  if (tourId) {
    return <TourDetailPage tourId={tourId} onClose={() => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }} />;
  }

  // Show city page (SEO-friendly URL: /country/city)
  if (cityPageMatch && countrySlug && citySlug) {
    try {
      return (
        <ErrorBoundary>
          <CityPage
            country={slugToTitle(countrySlug)}
            city={slugToTitle(citySlug)}
          />
        </ErrorBoundary>
      );
    } catch (error) {
      console.error('Error rendering CityPage:', error);
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">Error loading page</h2>
            <p className="text-gray-500 font-semibold mb-6">Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#10B981] text-white font-bold rounded-lg hover:bg-[#059669] transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
  }

  // Show supplier page if URL is /supplier or if showSupplierPage is true
  if (showSupplierPage || isSupplierPageFromUrl) {
    return <SupplierPage onClose={() => {
      setShowSupplierPage(false);
      // If coming from URL, redirect to homepage
      if (isSupplierPageFromUrl) {
        window.location.href = '/';
      }
    }} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>AsiaByLocals - Authentic Local Tours & Cultural Experiences Across Asia</title>
        <meta name="description" content="Discover authentic local tours and cultural experiences across Asia. Book tours with verified local guides in India, Japan, Thailand, Vietnam, Indonesia, and more." />
        <link rel="canonical" href="https://www.asiabylocals.com/" />
        <meta name="language" content="en" />
        <meta property="og:title" content="AsiaByLocals - Authentic Local Tours & Cultural Experiences Across Asia" />
        <meta property="og:description" content="Discover authentic local tours and cultural experiences across Asia. Book tours with verified local guides in India, Japan, Thailand, Vietnam, Indonesia, and more." />
        <meta property="og:url" content="https://www.asiabylocals.com/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "AsiaByLocals",
            "url": "https://www.asiabylocals.com/",
            "description": "Discover authentic local tours and cultural experiences across Asia.",
            "publisher": {
              "@type": "Organization",
              "name": "AsiaByLocals",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.asiabylocals.com/logo.png"
              }
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top Destinations",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Agra Tours",
                  "url": "https://www.asiabylocals.com/india/agra"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Delhi Tours",
                  "url": "https://www.asiabylocals.com/india/delhi"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Jaipur Tours",
                  "url": "https://www.asiabylocals.com/india/jaipur"
                }
              ]
            }
          })}
        </script>
      </Helmet>
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full h-24 sm:h-28 md:h-32 flex items-center justify-between px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-3 h-full">
            {/* Logo */}
            <div className="cursor-pointer">
              <img
                src="/logo.png"
                alt="Asia By Locals"
                className="w-auto object-contain"
                style={{ height: '120px', maxHeight: '120px' }}
              />
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-semibold text-[#001A33]">
              <div className="relative flex items-center gap-1 cursor-pointer hover:text-[#10B981] group/places">
                Places to see <ChevronRight size={14} className="rotate-90 group-hover/places:rotate-[270deg] transition-transform duration-150" />
                <div className="absolute top-full left-0 pt-2 z-50 opacity-0 -translate-y-2 pointer-events-none group-hover/places:opacity-100 group-hover/places:translate-y-0 group-hover/places:pointer-events-auto transition-[opacity,transform] duration-100 ease-out">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 xl:p-5 w-[90vw] max-w-[800px] max-h-[70vh] overflow-y-auto no-scrollbar">
                    <div className="grid grid-cols-3 gap-1">
                      {CITIES.map((city) => {
                        const url = getCityUrl(city.name, city.id);
                        return (
                          <div key={city.id}>
                            <div
                              className="flex items-center gap-3 cursor-pointer hover:bg-[#10B981]/10 p-2 rounded-lg group/item"
                              onClick={() => window.location.href = url}
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
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center gap-1 cursor-pointer hover:text-[#10B981] group/inspiration">
                Trip inspiration <ChevronRight size={14} className="rotate-90 group-hover/inspiration:rotate-[270deg] transition-transform duration-150" />
                <div className="absolute top-full left-0 pt-2 z-50 opacity-0 -translate-y-2 pointer-events-none group-hover/inspiration:opacity-100 group-hover/inspiration:translate-y-0 group-hover/inspiration:pointer-events-auto transition-[opacity,transform] duration-100 ease-out">
                  <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 w-[90vw] max-w-[750px]">
                    <div className="flex gap-6">
                      {/* Left Sidebar */}
                      <div className="flex-shrink-0 w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                          <h3 className="font-bold text-[#001A33] text-sm">City guides</h3>
                        </div>
                        <p className="text-gray-500 text-xs mb-4">Explore all</p>
                      </div>

                      {/* Right Grid */}
                      <div className="flex-1 grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto no-scrollbar">
                        {[
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
                        ].map((city, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1.5 cursor-pointer p-1.5 rounded-lg hover:bg-[#10B981]/10 group/guide">
                            <img
                              src={city.image}
                              alt={city.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="font-semibold text-[#001A33] text-[10px] text-center leading-tight group-hover/guide:text-[#10B981]">{city.name} Travel Guide</div>
                          </div>
                        ))}
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
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#10B981] p-1.5 sm:p-2 min-w-[44px] min-h-[44px] justify-center"
              >
                <User size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden lg:block text-[11px]">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Bar - Horizontal Scrollable */}
      <div className="lg:hidden sticky top-[72px] sm:top-[82px] md:top-[92px] z-40 bg-white border-b border-gray-100 shadow-sm">
        {/* Category Buttons Row */}
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
            <ChevronRight
              size={14}
              className={`transition-transform ${showMobilePlacesDropdown ? 'rotate-90' : 'rotate-0'}`}
            />
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
            <ChevronRight
              size={14}
              className={`transition-transform ${showMobileInspirationDropdown ? 'rotate-90' : 'rotate-0'}`}
            />
          </button>
        </div>

        {/* City Chips Row - Scrollable - Hidden on mobile */}
        <div className="hidden md:block px-3 sm:px-4 pb-3 overflow-x-auto scroll-smooth scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex items-center gap-2 min-w-max">
            {CITIES.slice(0, 12).map((city) => {
              const url = getCityUrl(city.name, city.id);
              return (
                <button
                  key={city.id}
                  onClick={() => {
                    window.location.href = url;
                  }}
                  className="flex-shrink-0 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-[#001A33] text-sm font-medium hover:border-[#10B981] hover:text-[#10B981] active:scale-95 transition-all whitespace-nowrap"
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Dropdown Overlays */}
        {/* Places to See Dropdown */}
        {showMobilePlacesDropdown && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 top-[72px] sm:top-[82px] md:top-[92px]"
              onClick={() => setShowMobilePlacesDropdown(false)}
            />
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto top-[72px] sm:top-[82px] md:top-[92px]">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#001A33]">Places to see</h3>
                <button
                  onClick={() => setShowMobilePlacesDropdown(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 gap-3">
                  {CITIES.map((city) => {
                    const url = getCityUrl(city.name, city.id);
                    const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
                    return (
                      <div key={city.id} className="space-y-2">
                        <button
                          onClick={() => {
                            setShowMobilePlacesDropdown(false);
                            window.location.href = url;
                          }}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left w-full min-h-[44px]"
                        >
                          <img
                            src={city.image}
                            alt={`${city.name} tours and cultural experiences - Book local guides in ${city.name}`}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[#001A33] text-sm mb-0.5">{city.name} Tours</div>
                            <div className="text-gray-500 text-xs">City in India</div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Trip Inspiration Dropdown */}
        {showMobileInspirationDropdown && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 top-[72px] sm:top-[82px] md:top-[92px]"
              onClick={() => setShowMobileInspirationDropdown(false)}
            />
            <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-2xl z-50 max-h-[85vh] overflow-y-auto top-[72px] sm:top-[82px] md:top-[92px]">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#001A33]">Trip inspiration</h3>
                <button
                  onClick={() => setShowMobileInspirationDropdown(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
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
                  {[
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
                  ].map((city, idx) => {
                    // Map city names to city IDs for navigation
                    const cityNameToId: Record<string, string> = {
                      'Tokyo': 'tokyo',
                      'Kyoto': 'kyoto',
                      'Osaka': 'osaka',
                      'Bangkok': 'bangkok',
                      'Dubai': 'dubai',
                      'Singapore': 'singapore',
                      'Seoul': 'seoul',
                      'Hong Kong': 'hongkong',
                      'Kuala Lumpur': 'kuala-lumpur',
                      'Taipei': 'taipei',
                      'Bali': 'bali',
                      'Agra': 'agra',
                      'Mumbai': 'mumbai',
                      'Delhi': 'delhi',
                      'Hanoi': 'hanoi',
                      'Ho Chi Minh City': 'ho-chi-minh-city',
                      'Chiang Mai': 'chiang-mai',
                      'Phuket': 'phuket',
                      'Krabi': 'bangkok', // Using bangkok as fallback
                      'Manila': 'manila',
                      'Jakarta': 'bangkok', // Using bangkok as fallback
                      'Shanghai': 'shanghai',
                      'Beijing': 'beijing',
                      'Colombo': 'colombo',
                      'Kathmandu': 'kathmandu'
                    };

                    const cityId = cityNameToId[city.name] || city.name.toLowerCase().replace(/\s+/g, '-');
                    const url = getCityUrl(city.name, cityId);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setShowMobileInspirationDropdown(false);
                          window.location.href = url;
                        }}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
                      >
                        <img
                          src={city.image}
                          alt={city.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="font-semibold text-[#001A33] text-[10px] text-center leading-tight">{city.name} Travel Guide</div>
                      </button>
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
        {heroImages.map((hero, index) => (
          <img
            key={index}
            src={hero.url}
            alt={`${hero.city} - Authentic local tours and cultural experiences in ${hero.city}, Asia`}
            className={`absolute inset-0 w-full h-full object-cover object-center brightness-[0.7] transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
              }`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
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
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                placeholder="Search cities or tours..."
                className="flex-1 outline-none border-none ring-0 focus:ring-0 focus:border-none bg-transparent text-[#001A33] font-bold text-sm sm:text-base md:text-lg placeholder:text-gray-400 placeholder:font-medium min-w-0"
              />

              {/* Search Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  {/* City Suggestions */}
                  {filteredSuggestions.map((city) => (
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
            Things to do wherever you're going
          </h2>
          <div className="relative px-4 sm:px-6 lg:px-8">
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                onClick={() => {
                  const scrollContainer = document.getElementById('cities-scroll');
                  if (scrollContainer) {
                    const cardWidth = window.innerWidth < 640 ? 170 : window.innerWidth < 768 ? 200 : 200;
                    const gap = window.innerWidth < 640 ? 16 : 20;
                    const newPosition = Math.max(0, scrollContainer.scrollLeft - ((cardWidth + gap) * 3));
                    scrollContainer.scrollTo({ left: newPosition, behavior: 'smooth' });
                  }
                }}
                className="hidden lg:flex absolute left-4 top-[40%] -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all border border-gray-100 items-center justify-center"
              >
                <ChevronLeft className="text-gray-400 group-hover:text-[#10B981] transition-colors" size={20} />
              </button>
            )}

            {/* Cards Container */}
            <div className="relative overflow-hidden">
              <div
                id="cities-scroll"
                className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-4 scroll-smooth snap-x snap-mandatory"
                onScroll={(e) => {
                  const container = e.currentTarget;
                  const scrollLeft = container.scrollLeft;
                  const scrollWidth = container.scrollWidth;
                  const clientWidth = container.clientWidth;

                  setCanScrollLeft(scrollLeft > 10);
                  setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
                }}
              >
                {CITIES.map((city) => {
                  return (
                    <div
                      key={city.id}
                      className="flex-shrink-0 w-[170px] sm:w-[200px] md:w-[200px] lg:w-[calc((100%-100px)/6)] xl:w-[calc((100%-120px)/6)] cursor-pointer group snap-start"
                      onClick={() => {
                        const url = getCityUrl(city.name, city.id);
                        window.location.href = url;
                      }}
                    >
                      <div className="relative aspect-[4/5] lg:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden mb-2 sm:mb-3 shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-100">
                        <div className="relative w-full h-full">
                          <img
                            src={city.image}
                            alt={`${city.name} tours and cultural experiences - Book local guides in ${city.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                            <h3 className="text-white font-black text-lg sm:text-xl md:text-lg mb-1 drop-shadow-xl leading-tight">{city.name}</h3>
                            <p className="text-white/95 text-xs sm:text-sm md:text-[11px] font-semibold drop-shadow-md leading-snug">{city.localAngle}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                onClick={() => {
                  const scrollContainer = document.getElementById('cities-scroll');
                  if (scrollContainer) {
                    const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 300 : 200;
                    const gap = window.innerWidth < 640 ? 16 : 20;
                    const newPosition = scrollContainer.scrollLeft + ((cardWidth + gap) * 3);
                    scrollContainer.scrollTo({ left: newPosition, behavior: 'smooth' });
                  }
                }}
                className="hidden lg:flex absolute right-4 top-[40%] -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:bg-white transition-all border border-gray-100 items-center justify-center"
              >
                <ChevronRight className="text-gray-400 group-hover:text-[#10B981] transition-colors" size={20} />
              </button>
            )}
          </div>
        </section>


        {/* Section 3: Attractions you can't miss (Wide Cards) */}
        <section className="max-w-[1200px] mx-auto px-6 py-16">
          <h2 className="text-2xl md:text-[28px] font-black text-[#001A33] mb-8">
            Attractions you can't miss
          </h2>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {ATTRACTIONS.map((attr) => (
              <div key={attr.id} className="group flex-shrink-0 w-72 md:w-[380px] h-48 rounded-2xl overflow-hidden relative cursor-pointer shadow-sm hover:shadow-lg transition-all">
                <img src={attr.image} alt={`${attr.title} - Top attraction in ${attr.location} - Book tours and experiences`} className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
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
              {[
                {
                  name: "Liz B.",
                  text: "If you want to truly understand the history of the Taj Mahal in the context of how India developed, this tour with Shahnawaz will leave you loving Agra even more than you thought possible. We had a meaningful and memorable time. Shahnawaz added some special photo opportunities along the way knowing what our interests were and we couldn't have been happier.",
                  tour: "Taj Mahal Sunrise Tour",
                  link: "/india/agra/taj-mahal-sunrise-guided-tour"
                },
                {
                  name: "Anthony L W.",
                  text: "Best tour that we have EVER had! We covered so many things from city highlights to the cultural beginnings of the Mughal Empire. Talha told story after story of how Agra came to be and tied it all in with what we were experiencing present day. By the end it became more like seeing the city with a great friend than a tour guide.",
                  tour: "Agra City Highlights Tour",
                  link: "/india/agra/agra-city-highlights-tour"
                },
                {
                  name: "Joe M.",
                  text: "Great tour with fantastic guide... We were able to customize the tour to our interests, got an early start to beat the crowds. Overall a great day, full of unexpected discoveries. Danish is a wonderful guide, interesting and knowledgeable, with a great sense of humor. We will hire him again in a heartbeat next time we are visiting Agra.",
                  tour: "Taj Mahal Photography Tour",
                  link: "/india/agra/taj-mahal-photography-tour"
                },
                {
                  name: "Raghu N.",
                  text: "The highlight of our trip to India for sure! Asif was so knowledgeable and personable - it felt like we were walking around with a longtime friend. In addition to his encyclopedic knowledge of Mughal history and mythology, he also had lots of useful tips and recommendations for the rest of our stay in Agra. I can't recommend taking a tour with Asif highly enough!",
                  tour: "Taj Mahal & Agra Fort Guided Tour",
                  link: "/india/agra/taj-mahal-agra-fort-guided-tour"
                }
              ].map((t, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-50 flex flex-col items-center text-center group hover:border-[#67C1B0]/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                  <div className="text-[#67C1B0] mb-6 transform group-hover:scale-110 transition-transform duration-500">
                    <Quote size={48} fill="currentColor" fillOpacity="0.1" />
                  </div>

                  <p className="text-gray-500 text-[14px] leading-relaxed italic mb-8 font-medium">
                    "{t.text}"
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

                  <a
                    href={t.link}
                    className="mt-auto text-[13px] font-black text-[#001A33] border-b-2 border-gray-200 hover:border-[#67C1B0] transition-colors pb-0.5"
                  >
                    {t.tour}
                  </a>
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

      {/* Footer (GYG inspired structure) */}
      <Footer />

      {/* Wishlist Modal */}
      {
        showWishlistModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-black text-[#001A33]">My Wishlist</h2>
                <button
                  onClick={() => setShowWishlistModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-semibold text-lg mb-2">Your wishlist is empty</p>
                    <p className="text-gray-400 text-sm">Start adding tours to your wishlist!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {wishlist.map((tour) => (
                      <div
                        key={tour.id}
                        className="flex gap-4 p-4 border border-gray-200 rounded-xl hover:border-[#10B981] transition-colors"
                      >
                        {tour.images && JSON.parse(tour.images)[0] && (
                          <img
                            src={JSON.parse(tour.images)[0]}
                            alt={tour.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-black text-[#001A33] mb-1">{tour.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{tour.city}, {tour.country}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[#10B981]">
                              {(() => {
                                const displayPrice = getTourPrice(tour);
                                return `Starting from ${tour.currency === 'INR' ? '₹' : '$'}${displayPrice.toLocaleString()}`;
                              })()}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => window.location.href = `/india/${tour.city?.toLowerCase()}/${tour.slug}`}
                                className="px-4 py-2 bg-[#10B981] text-white font-bold rounded-lg hover:bg-[#059669] transition-colors text-sm"
                              >
                                View Tour
                              </button>
                              <button
                                onClick={() => removeFromWishlist(tour.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }



      {/* Profile Modal */}
      {
        showProfileModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-black text-[#001A33]">Profile</h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6">
                {user ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center">
                        <User size={32} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-black text-[#001A33] text-lg">{user.name || user.email}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg font-semibold text-[#001A33] transition-colors">
                        My Bookings
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg font-semibold text-[#001A33] transition-colors">
                        Account Settings
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg font-semibold text-[#001A33] transition-colors">
                        Payment Methods
                      </button>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-semibold text-lg mb-2">Guest User</p>
                    <p className="text-gray-400 text-sm mb-6">You can book tours directly without signing in. Your booking confirmation will be sent to your email.</p>
                    <button
                      onClick={() => {
                        setShowProfileModal(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-lg transition-colors"
                    >
                      Continue Browsing
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }

      {/* Tourist Login Modal */}
      {
        showTouristLogin && (
          <TouristLogin
            onClose={() => {
              setShowTouristLogin(false);
              setPendingWishlistTour(null);
            }}
            onLoginSuccess={handleTouristAuthSuccess}
            onSwitchToSignup={() => {
              setShowTouristLogin(false);
              setShowTouristSignup(true);
            }}
          />
        )
      }

      {/* Tourist Signup Modal */}
      {
        showTouristSignup && (
          <TouristSignup
            onClose={() => {
              setShowTouristSignup(false);
              setPendingWishlistTour(null);
            }}
            onSignupSuccess={handleTouristAuthSuccess}
            onSwitchToLogin={() => {
              setShowTouristSignup(false);
              setShowTouristLogin(true);
            }}
          />
        )
      }
    </div >
  );
};

export default App;