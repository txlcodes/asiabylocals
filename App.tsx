import React, { useState, useEffect, useMemo, Component } from 'react';
import { 
  Globe, 
  Search, 
  Heart, 
  ShoppingCart, 
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
  LogOut
} from 'lucide-react';
import { CITIES, EXPERIENCES, ATTRACTIONS } from './constants';
import SupplierPage from './SupplierPage';
import VerifyEmail from './VerifyEmail';
import EmailVerificationWaiting from './EmailVerificationWaiting';
import TourDetailPage from './TourDetailPage';
import CityPage from './CityPage';
import AdminDashboard from './AdminDashboard';
import SafetyGuidelines from './SafetyGuidelines';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';
import TouristLogin from './TouristLogin';
import TouristSignup from './TouristSignup';

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">Error loading tour</h2>
            <p className="text-gray-500 font-semibold mb-6">{this.state.error?.message || 'Please try again later.'}</p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
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
}

interface ExplorationData {
  [key: string]: ExploreItem[];
}

const EXPLORATION_DATA: ExplorationData = {
  attractions: [
    { name: "Taj Mahal, India", count: "112 tours & activities" },
    { name: "Fushimi Inari Shrine, Japan", count: "84 tours & activities" },
    { name: "Grand Palace, Thailand", count: "156 tours & activities" },
    { name: "Borobudur Temple, Indonesia", count: "92 tours & activities" },
    { name: "Ha Long Bay, Vietnam", count: "198 tours & activities" },
    { name: "Mount Fuji, Japan", count: "65 tours & activities" },
    { name: "Amber Fort, India", count: "42 tours & activities" },
    { name: "Wat Arun, Thailand", count: "78 tours & activities" },
    { name: "Ubud Monkey Forest, Indonesia", count: "95 tours & activities" },
    { name: "Hoi An Ancient Town, Vietnam", count: "124 tours & activities" },
    { name: "Arashiyama Bamboo Grove, Japan", count: "92 tours & activities" },
    { name: "Varanasi Ghats, India", count: "54 tours & activities" },
    { name: "Phi Phi Islands, Thailand", count: "110 tours & activities" },
    { name: "Tanah Lot, Indonesia", count: "135 tours & activities" },
    { name: "Cu Chi Tunnels, Vietnam", count: "48 tours & activities" },
    { name: "Senso-ji Temple, Japan", count: "82 tours & activities" },
    { name: "Meenakshi Temple, India", count: "105 tours & activities" },
    { name: "Ayutthaya Historical Park, Thailand", count: "68 tours & activities" }
  ],
  destinations: [
    { name: "Tokyo, Japan", count: "342 tours & activities" },
    { name: "Bangkok, Thailand", count: "421 tours & activities" },
    { name: "Kyoto, Japan", count: "184 tours & activities" },
    { name: "Bali, Indonesia", count: "256 tours & activities" },
    { name: "Hanoi, Vietnam", count: "198 tours & activities" },
    { name: "Agra, India", count: "145 tours & activities" },
    { name: "Osaka, Japan", count: "210 tours & activities" },
    { name: "Phuket, Thailand", count: "165 tours & activities" },
    { name: "Ho Chi Minh City, Vietnam", count: "112 tours & activities" },
    { name: "Ubud, Indonesia", count: "189 tours & activities" },
    { name: "Delhi, India", count: "156 tours & activities" },
    { name: "Nara, Japan", count: "234 tours & activities" },
    { name: "Chiang Mai, Thailand", count: "128 tours & activities" },
    { name: "Da Nang, Vietnam", count: "167 tours & activities" },
    { name: "Yogyakarta, Indonesia", count: "143 tours & activities" },
    { name: "Jaipur, India", count: "89 tours & activities" },
    { name: "Sapporo, Japan", count: "178 tours & activities" },
    { name: "Goa, India", count: "115 tours & activities" }
  ],
  countries: [
    { name: "Japan", count: "721 tours & activities" },
    { name: "Thailand", count: "845 tours & activities" },
    { name: "Vietnam", count: "498 tours & activities" },
    { name: "Indonesia", count: "624 tours & activities" },
    { name: "India", count: "512 tours & activities" },
    { name: "Cambodia", count: "215 tours & activities" },
    { name: "South Korea", count: "189 tours & activities" },
    { name: "Philippines", count: "245 tours & activities" },
    { name: "Singapore", count: "176 tours & activities" },
    { name: "Malaysia", count: "95 tours & activities" },
    { name: "Nepal", count: "156 tours & activities" },
    { name: "Laos", count: "78 tours & activities" }
  ],
  categories: [
    { name: "Heritage Walks", count: "1,245 experiences" },
    { name: "Street Food Safaris", count: "2,150 experiences" },
    { name: "Zen Meditation Workshops", count: "420 experiences" },
    { name: "Local Cooking Classes", count: "890 experiences" },
    { name: "Sacred Temple Rituals", count: "560 experiences" },
    { name: "Jungle & Rice Terrace Treks", count: "730 experiences" },
    { name: "Traditional Craft Workshops", count: "340 experiences" },
    { name: "Floating Market Private Tours", count: "1,100 experiences" },
    { name: "Midnight City Tuk-Tuk Rides", count: "820 experiences" },
    { name: "Spiritual Water Blessings", count: "410 experiences" },
    { name: "Historical Scholar Walks", count: "670 experiences" },
    { name: "Night Market Food Tours", count: "2,300 experiences" }
  ]
};

const ExplorationFooter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('attractions');

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
            className={`pb-4 text-[14px] font-bold transition-all whitespace-nowrap border-b-2 outline-none ${
              activeTab === tab.id 
              ? 'text-[#0071EB] border-[#0071EB]' 
              : 'text-gray-400 border-transparent hover:text-[#001A33]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6">
        {EXPLORATION_DATA[activeTab]?.map((item, idx) => (
          <div key={`${activeTab}-${idx}`} className="flex flex-col gap-0.5 group cursor-pointer">
            <span className="text-[13px] font-bold text-[#001A33] group-hover:text-[#0071EB] transition-colors line-clamp-1">
              {item.name}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

const App: React.FC = () => {
  // Search state - Focus on Agra, Delhi, Jaipur
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Wishlist, Cart, Profile state
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  
  // Tourist authentication modals
  const [showTouristLogin, setShowTouristLogin] = useState(false);
  const [showTouristSignup, setShowTouristSignup] = useState(false);
  const [pendingWishlistTour, setPendingWishlistTour] = useState<any>(null);
  
  // Focus cities: Agra, Delhi, Jaipur (India)
  const focusCities = [
    { name: 'Agra', country: 'India', slug: 'agra' },
    { name: 'Delhi', country: 'India', slug: 'delhi' },
    { name: 'Jaipur', country: 'India', slug: 'jaipur' }
  ];

  // Filter suggestions based on search query
  const filteredSuggestions = focusCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle search - redirects to city page
  const handleSearch = (cityName?: string) => {
    const query = cityName || searchQuery.trim();
    if (!query) return;

    // Find matching city (case-insensitive)
    const matchedCity = focusCities.find(city =>
      city.name.toLowerCase() === query.toLowerCase()
    );

    if (matchedCity) {
      window.location.href = `/india/${matchedCity.slug}`;
    } else {
      // If no exact match, try fuzzy match
      const fuzzyMatch = focusCities.find(city =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
      if (fuzzyMatch) {
        window.location.href = `/india/${fuzzyMatch.slug}`;
      }
    }
    setShowSuggestions(false);
  };

  // Load wishlist and cart from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    const savedCart = localStorage.getItem('cart');
    const savedUser = localStorage.getItem('user');
    
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Error loading wishlist:', e);
      }
    }
    
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
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

  // Save wishlist and cart to localStorage when they change
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

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
    (window as any).addToCart = (tour: any) => {
      if (!cart.find((item: any) => item.id === tour.id)) {
        setCart((prev: any[]) => [...prev, tour]);
      }
    };
    (window as any).openWishlist = () => setShowWishlistModal(true);
    (window as any).openCart = () => setShowCartModal(true);
    (window as any).user = user; // Expose user state
    (window as any).wishlist = wishlist; // Expose wishlist state for checking
    
    return () => {
      delete (window as any).addToWishlist;
      delete (window as any).addToCart;
      delete (window as any).openWishlist;
      delete (window as any).openCart;
      delete (window as any).user;
      delete (window as any).wishlist;
    };
  }, [wishlist, cart, user]);

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

  // Cart functions
  const addToCart = (tour: any) => {
    if (!cart.find((item: any) => item.id === tour.id)) {
      setCart([...cart, tour]);
    }
  };

  const removeFromCart = (tourId: string) => {
    setCart(cart.filter((item: any) => item.id !== tourId));
  };

  const clearCart = () => {
    setCart([]);
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
  const isSupplierPageFromUrl = window.location.pathname === '/supplier';
  // Check if we're on the admin dashboard
  const isAdminPage = window.location.pathname === '/admin' || window.location.pathname === '/secure-panel-abl';
  // Check for policy/legal pages
  const isSafetyGuidelinesPage = window.location.pathname === '/safety-guidelines';
  const isPrivacyPolicyPage = window.location.pathname === '/privacy-policy';
  const isTermsAndConditionsPage = window.location.pathname === '/terms-and-conditions';
  
  // Check for city page: /india/agra, /thailand/bangkok, etc.
  const cityPageMatch = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)$/);
  const countrySlug = cityPageMatch ? cityPageMatch[1] : null;
  const citySlug = cityPageMatch ? cityPageMatch[2] : null;
  
  // Check for tour page: /india/agra/tour-slug
  const tourPageMatch = window.location.pathname.match(/^\/([^\/]+)\/([^\/]+)\/(.+)$/);
  const tourCountrySlug = tourPageMatch ? tourPageMatch[1] : null;
  const tourCitySlug = tourPageMatch ? tourPageMatch[2] : null;
  const tourSlug = tourPageMatch ? tourPageMatch[3] : null;
  
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
  const [showPlacesDropdown, setShowPlacesDropdown] = useState(false);
  const [showInspirationDropdown, setShowInspirationDropdown] = useState(false);
  const [showMobilePlacesDropdown, setShowMobilePlacesDropdown] = useState(false);
  const [showMobileInspirationDropdown, setShowMobileInspirationDropdown] = useState(false);
  const [showSupplierPage, setShowSupplierPage] = useState(isSupplierPageFromUrl);

  // Map city names to their country and city slugs for navigation
  const getCityUrl = (cityName: string, cityId: string): string => {
    const cityMap: Record<string, { country: string; city: string }> = {
      'agra': { country: 'india', city: 'agra' },
      'delhi': { country: 'india', city: 'delhi' },
      'jaipur': { country: 'india', city: 'jaipur' },
      'mumbai': { country: 'india', city: 'mumbai' },
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
    { url: '/soroush-zargarbashi-hero.jpg', city: 'Asia' }
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

  // Show tour detail page (SEO-friendly URL: /country/city/slug)
  if (tourPageMatch && tourSlug) {
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
    return <TourDetailPage tourId={tourId} onClose={() => window.history.back()} />;
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
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full pt-2 pb-1 flex items-center justify-between px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="flex items-center cursor-pointer mt-2 md:mt-3">
              <img src="/logo.svg?v=4" alt="Asia By Locals" className="h-[60px] sm:h-[70px] md:h-[80px] lg:h-[96px] xl:h-[115px] w-auto object-contain" />
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-semibold text-[#001A33]">
              <div 
                className="relative flex items-center gap-1 cursor-pointer hover:text-[#10B981]"
                onMouseEnter={() => setShowPlacesDropdown(true)}
                onMouseLeave={() => setShowPlacesDropdown(false)}
              >
                Places to see <ChevronRight size={14} className="rotate-90" />
                {showPlacesDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 p-4 xl:p-6 w-[90vw] max-w-[800px] z-50"
                    onMouseEnter={() => setShowPlacesDropdown(true)}
                    onMouseLeave={() => setShowPlacesDropdown(false)}
                  >
                    <div className="grid grid-cols-3 gap-6">
                      {[
                        { name: 'Dubai Tours', location: 'City in United Arab Emirates', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Bali Tours', location: 'Region in Indonesia', image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Abu Dhabi Tours', location: 'City in United Arab Emirates', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Ko Lanta Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Singapore Tours', location: 'City in Singapore', image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Ko Phangan Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Phuket Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Chiang Mai Tours', location: 'City in Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Phi Phi Islands Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Krabi Tours', location: 'City in Thailand', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Okinawa Tours', location: 'Region in Japan', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Ho Chi Minh City Tours', location: 'City in Vietnam', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Bangkok Tours', location: 'City in Thailand', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Ko Samui Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Tokyo Tours', location: 'City in Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Langkawi Tours', location: 'Region in Malaysia', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Hanoi Tours', location: 'City in Vietnam', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Goa Tours', location: 'Region in India', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Kyoto Tours', location: 'City in Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Osaka Tours', location: 'City in Japan', image: 'https://images.unsplash.com/photo-1555993531-9d3ce0b71257?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Seoul Tours', location: 'City in South Korea', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Hong Kong Tours', location: 'City in Hong Kong', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Kuala Lumpur Tours', location: 'City in Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fcbefdfe?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Taipei Tours', location: 'City in Taiwan', image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Mumbai Tours', location: 'City in India', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Delhi Tours', location: 'City in India', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=150' },
                        { name: 'Agra Tours', location: 'City in India', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=150' }
                      ].map((place, idx) => (
                        <div key={idx} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg -m-2 transition-colors">
                          <img 
                            src={place.image} 
                            alt={place.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[#001A33] text-sm mb-0.5">{place.name}</div>
                            <div className="text-gray-500 text-xs">{place.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div 
                className="relative flex items-center gap-1 cursor-pointer hover:text-[#10B981]"
                onMouseEnter={() => setShowInspirationDropdown(true)}
                onMouseLeave={() => setShowInspirationDropdown(false)}
              >
                Trip inspiration <ChevronRight size={14} className="rotate-90" />
                {showInspirationDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-100 p-4 w-[90vw] max-w-[750px] z-50"
                    onMouseEnter={() => setShowInspirationDropdown(true)}
                    onMouseLeave={() => setShowInspirationDropdown(false)}
                  >
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
                          <div key={idx} className="flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity">
                            <img 
                              src={city.image} 
                              alt={city.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="font-semibold text-[#001A33] text-[10px] text-center leading-tight">{city.name} Travel Guide</div>
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
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-[13px] font-semibold text-[#001A33]">
            <button 
              onClick={() => setShowSupplierPage(true)}
              className="text-[12px] sm:text-[13px] hover:text-[#10B981] whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Become a supplier
            </button>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              <button 
                onClick={() => setShowCartModal(true)}
                className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#10B981] relative p-1.5 sm:p-2 min-w-[44px] min-h-[44px] justify-center"
              >
                <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden lg:block text-[11px]">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#10B981] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
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
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              showMobilePlacesDropdown
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
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              showMobileInspirationDropdown
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

        {/* City Chips Row - Scrollable */}
        <div className="px-3 sm:px-4 pb-3 overflow-x-auto scroll-smooth scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
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
                  {[
                    { name: 'Dubai Tours', location: 'City in United Arab Emirates', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Bali Tours', location: 'Region in Indonesia', image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Abu Dhabi Tours', location: 'City in United Arab Emirates', image: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Ko Lanta Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Singapore Tours', location: 'City in Singapore', image: 'https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Ko Phangan Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Phuket Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Chiang Mai Tours', location: 'City in Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Phi Phi Islands Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Krabi Tours', location: 'City in Thailand', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Okinawa Tours', location: 'Region in Japan', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Ho Chi Minh City Tours', location: 'City in Vietnam', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Bangkok Tours', location: 'City in Thailand', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Ko Samui Tours', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Tokyo Tours', location: 'City in Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Langkawi Tours', location: 'Region in Malaysia', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Hanoi Tours', location: 'City in Vietnam', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Goa Tours', location: 'Region in India', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Kyoto Tours', location: 'City in Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Osaka Tours', location: 'City in Japan', image: 'https://images.unsplash.com/photo-1555993531-9d3ce0b71257?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Seoul Tours', location: 'City in South Korea', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Hong Kong Tours', location: 'City in Hong Kong', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Kuala Lumpur Tours', location: 'City in Malaysia', image: 'https://images.unsplash.com/photo-1596422846543-75c6fcbefdfe?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Taipei Tours', location: 'City in Taiwan', image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Mumbai Tours', location: 'City in India', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Delhi Tours', location: 'City in India', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=150' },
                    { name: 'Agra Tours', location: 'City in India', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=150' }
                  ].map((place, idx) => {
                    // Map place names to city IDs for navigation
                    const placeToCityId: Record<string, string> = {
                      'Dubai Tours': 'dubai',
                      'Bali Tours': 'bali',
                      'Abu Dhabi Tours': 'dubai', // Using dubai as fallback
                      'Ko Lanta Tours': 'bangkok', // Using bangkok as fallback
                      'Singapore Tours': 'singapore',
                      'Ko Phangan Tours': 'bangkok', // Using bangkok as fallback
                      'Phuket Tours': 'phuket',
                      'Chiang Mai Tours': 'chiang-mai',
                      'Phi Phi Islands Tours': 'phuket', // Using phuket as fallback
                      'Krabi Tours': 'bangkok', // Using bangkok as fallback
                      'Okinawa Tours': 'tokyo', // Using tokyo as fallback
                      'Ho Chi Minh City Tours': 'ho-chi-minh-city',
                      'Bangkok Tours': 'bangkok',
                      'Ko Samui Tours': 'bangkok', // Using bangkok as fallback
                      'Tokyo Tours': 'tokyo',
                      'Langkawi Tours': 'kuala-lumpur', // Using kuala-lumpur as fallback
                      'Hanoi Tours': 'hanoi',
                      'Goa Tours': 'mumbai', // Using mumbai as fallback
                      'Kyoto Tours': 'kyoto',
                      'Osaka Tours': 'osaka',
                      'Seoul Tours': 'seoul',
                      'Hong Kong Tours': 'hongkong',
                      'Kuala Lumpur Tours': 'kuala-lumpur',
                      'Taipei Tours': 'taipei',
                      'Mumbai Tours': 'mumbai',
                      'Delhi Tours': 'delhi',
                      'Agra Tours': 'agra'
                    };
                    
                    const cityId = placeToCityId[place.name] || place.name.replace(' Tours', '').toLowerCase().replace(/\s+/g, '-');
                    const cityName = place.name.replace(' Tours', '');
                    const url = getCityUrl(cityName, cityId);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setShowMobilePlacesDropdown(false);
                          window.location.href = url;
                        }}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left w-full min-h-[44px]"
                      >
                        <img 
                          src={place.image} 
                          alt={place.name}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-[#001A33] text-sm mb-0.5">{place.name}</div>
                          <div className="text-gray-500 text-xs">{place.location}</div>
                        </div>
                      </button>
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
      <section className="relative h-[50vh] min-h-[400px] sm:h-[55vh] sm:min-h-[450px] md:h-[60vh] md:min-h-[500px] lg:h-[70vh] lg:min-h-[600px] xl:h-[750px] flex items-center justify-center overflow-hidden">
        {heroImages.map((hero, index) => (
          <img 
            key={index}
            src={hero.url} 
            alt={`${hero.city} - Authentic local tours and cultural experiences in ${hero.city}, Asia`} 
            className={`absolute inset-0 w-full h-full object-cover brightness-[0.7] transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
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
                placeholder="Search Agra, Delhi, Jaipur..." 
                className="flex-1 outline-none border-none ring-0 focus:ring-0 focus:border-none bg-transparent text-[#001A33] font-bold text-sm sm:text-base md:text-lg placeholder:text-gray-400 placeholder:font-medium min-w-0"
              />
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
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
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 md:pb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[28px] font-black text-[#001A33] mb-6 sm:mb-8">
            Things to do wherever you're going
          </h2>
          <div className="relative">
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
                className="hidden sm:flex absolute left-2 sm:left-4 top-[40%] -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all border border-gray-200 items-center justify-center"
              >
                <ChevronLeft className="text-[#0071EB]" size={24} />
              </button>
            )}
            
            {/* Cards Container */}
            <div className="relative overflow-hidden px-0 sm:px-12 md:px-16 mx-auto">
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
                  const isLiveCity = ['agra', 'delhi', 'jaipur'].includes(city.id);
                  return (
                    <div 
                      key={city.id} 
                      className="flex-shrink-0 w-[170px] sm:w-[200px] md:w-[200px] cursor-pointer group snap-start"
                      onClick={() => {
                        const url = getCityUrl(city.name, city.id);
                        window.location.href = url;
                      }}
                    >
                      <div className="relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden mb-2 sm:mb-3 shadow-md hover:shadow-xl transition-all duration-300 bg-white border border-gray-100">
                        <div className="relative w-full h-full">
                          <img 
                            src={city.image} 
                            alt={`${city.name} tours and cultural experiences - Book local guides in ${city.name}`} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent"></div>
                          {isLiveCity && (
                            <div className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 bg-[#10B981] text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wide shadow-md">
                              Live
                            </div>
                          )}
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
                className="hidden sm:flex absolute right-2 sm:right-4 top-[40%] -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all border border-gray-200 items-center justify-center"
              >
                <ChevronRight className="text-[#0071EB]" size={24} />
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
      <footer className="bg-[#001A33] text-white pt-20 pb-10 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 lg:col-span-1">
              <p className="text-gray-400 text-[14px] leading-relaxed">
                Empowering local experts across Asia to share their heritage directly with curious travelers.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              <h5 className="font-black text-xs uppercase tracking-widest text-gray-500">Language</h5>
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex justify-between items-center text-sm font-bold text-gray-300 cursor-pointer">
                English (International) <ChevronRight size={14} className="rotate-90" />
              </div>
              <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mt-4">Currency</h5>
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg flex justify-between items-center text-sm font-bold text-gray-300 cursor-pointer">
                US Dollar ($) <ChevronRight size={14} className="rotate-90" />
              </div>
            </div>

            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-8">Support</h5>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li className="mb-4">
                  <div className="text-white mb-2">24/7 WhatsApp Support:</div>
                  <a href="https://wa.me/918449538716" target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:text-white block mb-1">+91 84495 38716</a>
                  <a href="https://wa.me/919897873562" target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:text-white block">+91 98978 73562</a>
                </li>
                <li onClick={() => window.location.href = '/safety-guidelines'} className="hover:text-white cursor-pointer">Safety Guidelines</li>
                <li onClick={() => window.location.href = '/privacy-policy'} className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li onClick={() => window.location.href = '/terms-and-conditions'} className="hover:text-white cursor-pointer">Terms & Conditions</li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-8">Company</h5>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li 
                  onClick={() => setShowSupplierPage(true)}
                  className="hover:text-white cursor-pointer"
                >
                  Become a Supplier
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-500 mb-4">
              <span>&copy; 2025 AsiaByLocals HQ • Authentic Experiences Only</span>
              <div className="flex gap-4 items-center grayscale opacity-50">
                <div className="bg-white/10 p-2 rounded">VISA</div>
                <div className="bg-white/10 p-2 rounded">MASTERCARD</div>
                <div className="bg-white/10 p-2 rounded">PAYPAL</div>
                <div className="bg-white/10 p-2 rounded">STRIPE</div>
              </div>
            </div>
            <div className="text-center text-gray-400 text-[12px] font-semibold">
              Branch Office: JBC 3 Building, Cluster Y, JLT Dubai
            </div>
          </div>
        </div>
      </footer>

      {/* Wishlist Modal */}
      {showWishlistModal && (
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
                            {tour.currency === 'INR' ? '₹' : '$'}{tour.pricePerPerson?.toLocaleString() || '0'} per person
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
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-black text-[#001A33]">Shopping Cart</h2>
              <button
                onClick={() => setShowCartModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-semibold text-lg mb-2">Your cart is empty</p>
                  <p className="text-gray-400 text-sm">Add tours to your cart to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((tour) => (
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
                            {tour.currency === 'INR' ? '₹' : '$'}{tour.pricePerPerson?.toLocaleString() || '0'} per person
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => window.location.href = `/india/${tour.city?.toLowerCase()}/${tour.slug}`}
                              className="px-4 py-2 bg-[#10B981] text-white font-bold rounded-lg hover:bg-[#059669] transition-colors text-sm"
                            >
                              Book Now
                            </button>
                            <button
                              onClick={() => removeFromCart(tour.id)}
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
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-lg text-[#001A33]">Total:</span>
                  <span className="font-black text-xl text-[#10B981]">
                    {cart[0]?.currency === 'INR' ? '₹' : '$'}
                    {cart.reduce((sum, tour) => sum + (tour.pricePerPerson || 0), 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={clearCart}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:border-gray-400 transition-colors"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={() => {
                      if (cart.length > 0) {
                        window.location.href = `/india/${cart[0].city?.toLowerCase()}/${cart[0].slug}`;
                      }
                    }}
                    className="flex-1 px-4 py-3 bg-[#10B981] text-white font-black rounded-lg hover:bg-[#059669] transition-colors"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
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
      )}

      {/* Tourist Login Modal */}
      {showTouristLogin && (
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
      )}

      {/* Tourist Signup Modal */}
      {showTouristSignup && (
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
      )}
    </div>
  );
};

export default App;