import React, { useState, useEffect } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { CITIES, EXPERIENCES, ATTRACTIONS } from './constants';
import SupplierRegistration from './SupplierRegistration';

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
  const [activeTab, setActiveTab] = useState('worldwide');
  const [citiesScrollPosition, setCitiesScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [showPlacesDropdown, setShowPlacesDropdown] = useState(false);
  const [showThingsDropdown, setShowThingsDropdown] = useState(false);
  const [showInspirationDropdown, setShowInspirationDropdown] = useState(false);
  const [showSupplierRegistration, setShowSupplierRegistration] = useState(false);

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
  const heroImages = [
    { url: '/kyoto-hero.jpg', city: 'Kyoto' },
    { url: '/tokyo-hero.jpg', city: 'Tokyo' },
    { url: '/agra-hero.jpg', city: 'Agra' },
    { url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=2000', city: 'Bangkok' },
    { url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=2000', city: 'Bali' },
    { url: '/dubai-hero.jpg', city: 'Dubai' }
  ];
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  if (showSupplierRegistration) {
    return <SupplierRegistration onClose={() => setShowSupplierRegistration(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-18 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <div className="flex items-center cursor-pointer">
              <img src="/logo.png" alt="Asia By Locals" className="h-14 md:h-16 lg:h-20 w-auto" />
            </div>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-semibold text-[#001A33]">
              <div 
                className="relative flex items-center gap-1 cursor-pointer hover:text-[#FF5A00]"
                onMouseEnter={() => setShowPlacesDropdown(true)}
                onMouseLeave={() => setShowPlacesDropdown(false)}
              >
                Places to see <ChevronRight size={14} className="rotate-90" />
                {showPlacesDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 p-6 w-[800px] z-50"
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
                className="relative flex items-center gap-1 cursor-pointer hover:text-[#FF5A00]"
                onMouseEnter={() => setShowThingsDropdown(true)}
                onMouseLeave={() => setShowThingsDropdown(false)}
              >
                Things to do <ChevronRight size={14} className="rotate-90" />
                {showThingsDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 p-4 w-[600px] z-50"
                    onMouseEnter={() => setShowThingsDropdown(true)}
                    onMouseLeave={() => setShowThingsDropdown(false)}
                  >
                    <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
                      {[
                        { name: 'Dubai', location: 'City in United Arab Emirates', image: '/dubai-hero.jpg' },
                        { name: 'Bangkok', location: 'City in Thailand', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Chiang Mai', location: 'City in Thailand', image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Abu Dhabi', location: 'City in United Arab Emirates', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Tokyo', location: 'City in Japan', image: '/tokyo-hero.jpg' },
                        { name: 'Krabi', location: 'City in Thailand', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Kyoto', location: 'City in Japan', image: '/kyoto-hero.jpg' },
                        { name: 'Singapore', location: 'City in Singapore', image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Seoul', location: 'City in South Korea', image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Hong Kong', location: 'City in Hong Kong', image: 'https://images.unsplash.com/photo-1536599018102-9f803c140fc1?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Kuala Lumpur', location: 'City in Malaysia', image: '/kuala-lumpur-hero.jpg' },
                        { name: 'Taipei', location: 'City in Taiwan', image: '/taipei-hero.jpg' },
                        { name: 'Osaka', location: 'City in Japan', image: '/osaka-hero.jpg' },
                        { name: 'Bali', location: 'Region in Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Phuket', location: 'Region in Thailand', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Agra', location: 'City in India', image: '/agra-hero.jpg' },
                        { name: 'Mumbai', location: 'City in India', image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Delhi', location: 'City in India', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Ho Chi Minh City', location: 'City in Vietnam', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=200' },
                        { name: 'Hanoi', location: 'City in Vietnam', image: '/hanoi-hero.jpg' }
                      ].map((place, idx) => (
                        <div key={idx} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg -m-2 transition-colors">
                          <img 
                            src={place.image} 
                            alt={place.name}
                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[#001A33] text-xs mb-0.5">Things to do in {place.name}</div>
                            <div className="text-gray-500 text-[10px]">{place.location}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-[#001A33] font-semibold cursor-pointer hover:text-[#FF5A00] text-xs">
                        Explore all 100+ cities <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div 
                className="relative flex items-center gap-1 cursor-pointer hover:text-[#FF5A00]"
                onMouseEnter={() => setShowInspirationDropdown(true)}
                onMouseLeave={() => setShowInspirationDropdown(false)}
              >
                Trip inspiration <ChevronRight size={14} className="rotate-90" />
                {showInspirationDropdown && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-100 p-4 w-[750px] z-50"
                    onMouseEnter={() => setShowInspirationDropdown(true)}
                    onMouseLeave={() => setShowInspirationDropdown(false)}
                  >
                    <div className="flex gap-6">
                      {/* Left Sidebar */}
                      <div className="flex-shrink-0 w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A00]"></div>
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
                      <div className="flex items-center gap-2 text-[#001A33] font-semibold cursor-pointer hover:text-[#FF5A00] text-xs underline">
                        Explore all <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-6 text-[13px] font-semibold text-[#001A33]">
            <button 
              onClick={() => setShowSupplierRegistration(true)}
              className="hidden md:block hover:text-[#FF5A00]"
            >
              Become a supplier
            </button>
            <div className="flex items-center gap-5">
              <button className="flex flex-col items-center gap-1 hover:text-[#FF5A00]">
                <Heart size={20} />
                <span className="hidden lg:block text-[11px]">Wishlist</span>
              </button>
              <button className="flex flex-col items-center gap-1 hover:text-[#FF5A00]">
                <ShoppingCart size={20} />
                <span className="hidden lg:block text-[11px]">Cart</span>
              </button>
              <button className="flex flex-col items-center gap-1 hover:text-[#FF5A00]">
                <Globe size={20} />
                <span className="hidden lg:block text-[11px]">EN/USD</span>
              </button>
              <button className="flex flex-col items-center gap-1 hover:text-[#FF5A00]">
                <User size={20} />
                <span className="hidden lg:block text-[11px]">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[480px] md:h-[520px] flex items-center justify-center overflow-hidden">
        {heroImages.map((hero, index) => (
          <img 
            key={index}
            src={hero.url} 
            alt={hero.city} 
            className={`absolute inset-0 w-full h-full object-cover brightness-[0.7] transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 z-0'
            }`}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute inset-0 hero-overlay z-10"></div>
        
        <div className="relative z-10 w-full max-w-[800px] px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight">
            Discover & book local Asia
          </h1>
          
          <div className="bg-white p-2 rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center gap-4 px-6 py-3 w-full">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Find places and things to do across Asia..." 
                className="w-full outline-none border-none ring-0 focus:ring-0 focus:border-none bg-transparent text-[#001A33] font-bold text-lg placeholder:text-gray-400 placeholder:font-medium"
              />
            </div>
            <button className="bg-[#0071EB] hover:bg-[#005bb8] text-white font-black px-12 py-4 rounded-full text-lg w-full md:w-auto transition-all shadow-lg active:scale-95">
              Search
            </button>
          </div>
        </div>
      </section>

      <main className="flex-1">
        {/* Row 1: Things to do wherever you're going */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-6 py-16">
          <h2 className="text-2xl md:text-[28px] font-black text-[#001A33] mb-8">
            Things to do wherever you're going
          </h2>
          <div className="relative">
            {/* Left Arrow */}
            {canScrollLeft && (
              <button
                onClick={() => {
                  const scrollContainer = document.getElementById('cities-scroll');
                  if (scrollContainer) {
                    const cardWidth = 185 + 16; // card width + gap
                    const newPosition = Math.max(0, scrollContainer.scrollLeft - (cardWidth * 5));
                    scrollContainer.scrollTo({ left: newPosition, behavior: 'smooth' });
                  }
                }}
                className="absolute left-0 top-[40%] -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
              >
                <ChevronLeft className="text-[#0071EB]" size={24} />
              </button>
            )}
            
            {/* Cards Container */}
            <div className="relative overflow-hidden px-12 mx-auto" style={{ maxWidth: 'calc(185px * 5 + 16px * 4 + 96px)' }}>
              <div 
                id="cities-scroll" 
                className="flex gap-4 overflow-x-auto no-scrollbar pb-4 group scroll-smooth"
                onScroll={(e) => {
                  const container = e.currentTarget;
                  const scrollLeft = container.scrollLeft;
                  const scrollWidth = container.scrollWidth;
                  const clientWidth = container.clientWidth;
                  
                  setCanScrollLeft(scrollLeft > 0);
                  setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
                }}
              >
                {CITIES.map((city) => (
                  <div 
                    key={city.id} 
                    className="flex-shrink-0 w-36 md:w-[185px] cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-sm hover:shadow-md transition-all">
                      <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/5 hover:bg-black/20 transition-colors pointer-events-none"></div>
                    </div>
                    <h3 className="text-[#001A33] font-bold text-[16px]">{city.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            {canScrollRight && (
              <button
                onClick={() => {
                  const scrollContainer = document.getElementById('cities-scroll');
                  if (scrollContainer) {
                    const cardWidth = 185 + 16; // card width + gap
                    const newPosition = scrollContainer.scrollLeft + (cardWidth * 5);
                    scrollContainer.scrollTo({ left: newPosition, behavior: 'smooth' });
                  }
                }}
                className="absolute right-0 top-[40%] -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
              >
                <ChevronRight className="text-[#0071EB]" size={24} />
              </button>
            )}
          </div>
        </section>

        {/* Row 2: Unforgettable travel experiences (Grid) */}
        <section className="max-w-[1200px] mx-auto px-6 py-8">
          <h2 className="text-2xl md:text-[28px] font-black text-[#001A33] mb-8">
            Unforgettable travel experiences
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {EXPERIENCES.map((exp) => (
              <div key={exp.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all cursor-pointer flex flex-col h-full">
                <div className="relative h-48 overflow-hidden">
                  <img src={exp.image} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <button className="absolute top-3 right-3 p-2 bg-white/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-[#FF5A00] transition-all">
                    <Heart size={18} />
                  </button>
                  {exp.isOriginal && (
                    <div className="absolute top-3 left-3 bg-[#FF5A00] text-white px-2 py-1 rounded text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                      <Award size={12} /> Locals Original
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    {exp.category}
                  </span>
                  <h4 className="text-[15px] font-bold text-[#001A33] leading-tight mb-2 group-hover:text-[#FF5A00] transition-colors line-clamp-2 h-[42px]">
                    {exp.title}
                  </h4>
                  <p className="text-gray-500 text-[13px] mb-3">{exp.duration}</p>
                  
                  <div className="mt-auto flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold text-[#001A33]">{exp.rating}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className={i < Math.floor(exp.rating) ? "text-[#FF5A00] fill-current" : "text-gray-200"} />
                        ))}
                      </div>
                      <span className="text-[12px] text-gray-400">({exp.reviews})</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[11px] font-bold text-gray-400">From</span>
                      <span className="text-lg font-black text-[#001A33]">${exp.price}</span>
                    </div>
                  </div>
                </div>
                {/* Visual Strip like GYG */}
                <div className="h-1.5 bg-[#FF5A00] w-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
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
                <img src={attr.image} alt={attr.title} className="absolute inset-0 w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-black text-xl leading-tight mb-1">{attr.title}</h4>
                  <p className="text-orange-400 text-[11px] font-black uppercase tracking-widest italic mb-2">
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
                <div className="w-16 h-16 bg-[#FF5A00]/10 text-[#FF5A00] rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h4 className="font-black text-lg mb-2">100% Verified</h4>
                <p className="text-sm text-gray-500">Every guide is personally interviewed and verified on-ground.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#FF5A00]/10 text-[#FF5A00] rounded-full flex items-center justify-center mb-4">
                  <Award size={32} />
                </div>
                <h4 className="font-black text-lg mb-2">Quality First</h4>
                <p className="text-sm text-gray-500">We prioritize storytelling and depth over mass-market tourism.</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-[#FF5A00]/10 text-[#FF5A00] rounded-full flex items-center justify-center mb-4">
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
              <div className="flex items-center mb-8">
                <img src="/logo.png" alt="Asia By Locals" className="h-10 w-auto brightness-0 invert" />
              </div>
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
                <li className="hover:text-white cursor-pointer">Contact</li>
                <li className="hover:text-white cursor-pointer">Safety Guidelines</li>
                <li className="hover:text-white cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
              </ul>
            </div>

            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-gray-500 mb-8">Company</h5>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li className="hover:text-white cursor-pointer">Our Vetting Process</li>
                <li 
                  onClick={() => setShowSupplierRegistration(true)}
                  className="hover:text-white cursor-pointer"
                >
                  Become a Supplier
                </li>
                <li className="hover:text-white cursor-pointer">Sustainability</li>
                <li className="hover:text-white cursor-pointer">Careers</li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-500">
            <span>&copy; 2025 AsiaByLocals HQ • Authentic Experiences Only</span>
            <div className="flex gap-4 items-center grayscale opacity-50">
              <div className="bg-white/10 p-2 rounded">VISA</div>
              <div className="bg-white/10 p-2 rounded">MASTERCARD</div>
              <div className="bg-white/10 p-2 rounded">PAYPAL</div>
              <div className="bg-white/10 p-2 rounded">STRIPE</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;