import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  ChevronRight, 
  TrendingUp, 
  CheckCircle, 
  Link2,
  Quote,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  CircleDollarSign,
  Clock,
  HeartHandshake,
  Search,
  Star
} from 'lucide-react';
import SupplierRegistration from './SupplierRegistration';
import SupplierLogin from './SupplierLogin';
import SupplierDashboard from './SupplierDashboard';

const NAV_LINKS = [
  { label: 'Why partner with us', id: 'why' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Pricing', id: 'stats' }
];

interface SupplierPageProps {
  onClose?: () => void;
}

const ASIAN_COUNTRIES = [
  { name: 'India', currency: '₹', amount: '4,50,000' },
  { name: 'Thailand', currency: '฿', amount: '1,95,000' },
  { name: 'Japan', currency: '¥', amount: '8,50,000' },
  { name: 'Singapore', currency: 'S$', amount: '7,500' },
  { name: 'Indonesia', currency: 'Rp', amount: '85,000,000' },
  { name: 'Malaysia', currency: 'RM', amount: '25,000' },
  { name: 'Vietnam', currency: '₫', amount: '140,000,000' },
  { name: 'South Korea', currency: '₩', amount: '7,500,000' },
  { name: 'Philippines', currency: '₱', amount: '3,10,000' },
  { name: 'China', currency: '¥', amount: '40,000' },
  { name: 'Taiwan', currency: 'NT$', amount: '1,80,000' },
  { name: 'Hong Kong', currency: 'HK$', amount: '44,000' }
];

const SupplierPage: React.FC<SupplierPageProps> = ({ onClose }) => {
  const [activeNav, setActiveNav] = useState('why');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [loggedInSupplier, setLoggedInSupplier] = useState<any>(null);
  const [currentCountryIndex, setCurrentCountryIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Check if supplier is already logged in
  useEffect(() => {
    const storedSupplier = localStorage.getItem('supplier');
    if (storedSupplier) {
      try {
        const supplier = JSON.parse(storedSupplier);
        // Validate supplier object has required fields
        if (supplier && supplier.id && supplier.email) {
          setLoggedInSupplier(supplier);
          setShowDashboard(true);
        } else {
          console.error('Invalid supplier data in localStorage:', supplier);
          localStorage.removeItem('supplier');
        }
      } catch (error) {
        console.error('Error parsing stored supplier:', error);
        localStorage.removeItem('supplier');
      }
    }
  }, []);

  // Check if returning from email verification
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get('verified');
    const register = urlParams.get('register');
    const email = urlParams.get('email');
    const supplierId = urlParams.get('supplierId');
    
    if (verified === 'true') {
      if (register === 'true' && supplierId) {
        // User just verified email, redirect to registration form at step 5 (license upload)
        setShowRegistration(true);
        // Store supplierId and verified status for registration form
        localStorage.setItem('pendingSupplierId', supplierId);
        localStorage.setItem('emailVerified', 'true');
        if (email) {
          sessionStorage.setItem('verifiedEmail', email);
        }
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        // User verified email but no register param, show login form with success message
        setShowLogin(true);
        // Clear URL params
        window.history.replaceState({}, '', window.location.pathname);
        // If email is provided, pre-fill it in the login form
        if (email) {
          // Store email for login form to use
          sessionStorage.setItem('verifiedEmail', email);
        }
      }
    }
  }, []);

  // Country rotation effect with fade animation
  useEffect(() => {
    if (showRegistration) return;
    
    const interval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      // After fade out completes, change country and fade in
      setTimeout(() => {
        setCurrentCountryIndex((prev) => (prev + 1) % ASIAN_COUNTRIES.length);
        setIsVisible(true);
      }, 300); // Half of transition duration
    }, 3500); // Increased interval for smoother feel

    return () => clearInterval(interval);
  }, [showRegistration]);

  const currentCountry = ASIAN_COUNTRIES[currentCountryIndex];

  // Reveal Animation Logic
  useEffect(() => {
    if (showRegistration) return; // Don't run observer if we are showing registration

    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [showRegistration]);

  const toggleRegistration = () => {
    setShowRegistration(!showRegistration);
    window.scrollTo(0, 0);
  };

  // Show dashboard if logged in
  if (showDashboard && loggedInSupplier) {
    // Validate supplier before passing to dashboard
    if (!loggedInSupplier.id || !loggedInSupplier.email) {
      console.error('Invalid supplier data:', loggedInSupplier);
      localStorage.removeItem('supplier');
      setLoggedInSupplier(null);
      setShowDashboard(false);
      return null;
    }
    
    return (
      <SupplierDashboard 
        supplier={loggedInSupplier}
        onLogout={() => {
          localStorage.removeItem('supplier');
          setLoggedInSupplier(null);
          setShowDashboard(false);
          setShowLogin(true);
          setShowRegistration(false);
          // Redirect to supplier page to show login form
          window.location.href = '/supplier';
        }}
      />
    );
  }

  // Show login page
  if (showLogin) {
    return (
      <SupplierLogin 
        onClose={() => setShowLogin(false)}
        onLoginSuccess={() => {
          const storedSupplier = localStorage.getItem('supplier');
          if (storedSupplier) {
            try {
              const supplier = JSON.parse(storedSupplier);
              setLoggedInSupplier(supplier);
              setShowLogin(false);
              setShowDashboard(true);
            } catch (error) {
              console.error('Error parsing stored supplier:', error);
            }
          }
        }}
        onCreateAccount={() => {
          setShowLogin(false);
          setShowRegistration(true);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  // Show registration form
  if (showRegistration) {
    return <SupplierRegistration onClose={() => setShowRegistration(false)} />;
  }

  return (
    <div className="bg-white min-h-screen relative font-['Plus_Jakarta_Sans']">
      {/* Header with Back Button */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-8 py-4 flex items-center justify-between">
          {onClose ? (
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-[#001A33] font-semibold hover:text-[#10B981] text-[14px] transition-colors"
            >
              <ChevronRight size={18} className="rotate-180" />
              Back to Home
            </button>
          ) : (
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = '/';
                }
              }}
              className="flex items-center gap-2 text-[#001A33] font-semibold hover:text-[#10B981] text-[14px] transition-colors"
            >
              <ChevronRight size={18} className="rotate-180" />
              Back to Home
            </button>
          )}
          <img 
            src="/logo.svg?v=4" 
            alt="AsiaByLocals" 
            className="h-16 w-auto"
          />
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-2 border-2 border-[#10B981] text-[#10B981] font-black rounded-full text-[14px] hover:bg-[#10B981] hover:text-white transition-all"
          >
            Sign In
          </button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="pt-16 pb-24 max-w-[1280px] mx-auto px-8 grid lg:grid-cols-2 gap-12 items-center reveal">
        <div className="z-10">
          <h1 className="text-5xl md:text-[68px] font-extrabold text-[#001A33] leading-[1.05] mb-6 tracking-tighter">
            You could earn <br />
            <span 
              className={`text-[#10B981] transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {currentCountry.currency}{currentCountry.amount} per month
            </span><br />
            in <span 
              className={`text-[#001A33] transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            >
              {currentCountry.name}
            </span>
          </h1>
          
          <p className="text-xl text-gray-500 font-medium mb-8 max-w-lg leading-relaxed">
            Create your activity on AsiaByLocals for free under 30 minutes.
          </p>

          <div className="mb-16 flex items-center gap-4">
            <button 
              onClick={toggleRegistration}
              className="bg-[#10B981] hover:bg-[#059669] text-white font-black px-10 py-5 rounded-full text-lg shadow-2xl shadow-green-200 flex items-center gap-3 transition-all active:scale-95 group"
            >
              Get Started <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setShowLogin(true)}
              className="border-2 border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white font-black px-8 py-5 rounded-full text-lg transition-all active:scale-95"
            >
              Sign In
            </button>
          </div>
          
          <div id="how-it-works" className="grid grid-cols-3 gap-6 border-t border-gray-200 pt-8">
            {[
              { n: '1', t: 'Register your business', d: 'Free signup' },
              { n: '2', t: 'Submit your activity for review', d: 'Quick approval' },
              { n: '3', t: 'Start earning', d: 'Get paid monthly' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center font-black text-sm text-white">
                    {step.n}
                  </span>
                  <span className="text-[13px] font-black text-[#001A33]">{step.t}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Mobile App Mockup */}
          <div className="relative mx-auto" style={{ width: '320px', height: '640px' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#001A33] to-[#003366] rounded-[40px] p-2 shadow-2xl">
              <div className="w-full h-full bg-white rounded-[32px] overflow-hidden">
                {/* Mobile App Header */}
                <div className="bg-white px-4 pt-12 pb-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-4 text-xs font-bold text-[#001A33]">
                    <span>9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-[#001A33] rounded-sm"></div>
                      <div className="w-1 h-1 bg-[#001A33] rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Search size={16} className="text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400">Tokyo Tours</span>
                  </div>
                </div>
                
                {/* Mobile App Content */}
                <div className="px-4 py-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 120px)' }}>
                  <div>
                    <h3 className="font-black text-[#001A33] text-sm mb-1">Tokyo</h3>
                    <p className="text-xs text-gray-500 font-semibold">Cultural Tours</p>
                    <p className="text-[10px] text-gray-400 mt-1">Booked 3,000+ times last week</p>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-bold text-[#001A33] whitespace-nowrap">Languages</div>
                    <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-bold text-[#001A33] whitespace-nowrap">Duration</div>
                    <div className="px-3 py-1.5 bg-gray-50 rounded-lg text-[10px] font-bold text-[#001A33] whitespace-nowrap">Time</div>
                  </div>
                  
                  <div className="text-[11px] font-bold text-gray-400 mb-3">25 activities found</div>
                  
                  {/* Activity Card */}
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400" 
                        className="w-full h-32 object-cover"
                        alt="Tokyo Tour"
                      />
                      <div className="absolute top-2 left-2 bg-[#10B981] text-white text-[9px] font-black px-2 py-1 rounded">TOP PICK</div>
                    </div>
                    <div className="p-3">
                      <div className="text-[9px] font-black text-[#10B981] uppercase mb-1">CULTURAL TOUR</div>
                      <h4 className="text-xs font-black text-[#001A33] mb-2 leading-tight">Tokyo: Gion District Evening Cultural Walk with Local Scholar</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-[10px] font-bold text-[#001A33]">4.9</span>
                        </div>
                        <span className="text-[9px] text-gray-400">(1,240 reviews)</span>
                      </div>
                      <div className="text-xs font-black text-[#001A33]">From $45.00 per person</div>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Bottom Nav */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-around">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-1 h-1 bg-[#10B981] rounded-full"></div>
                    <span className="text-[8px] font-bold text-[#10B981]">Discover</span>
                  </div>
                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  <div className="w-4 h-4 border border-gray-300 rounded"></div>
                  <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="absolute -right-8 top-20 space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-[280px]">
              <div className="text-2xl font-black text-[#001A33] mb-1">35,000+</div>
              <div className="text-sm font-bold text-gray-500">suppliers earn more with AsiaByLocals</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 max-w-[280px]">
              <div className="text-2xl font-black text-[#001A33] mb-1">40 million+</div>
              <div className="text-sm font-bold text-gray-500">global monthly platform users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Statistics */}
      <section id="stats" className="bg-gray-50 py-16 reveal">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="space-y-12">
            {/* Meet kind and curious travellers */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="w-16 h-16 bg-[#10B981]/10 rounded-2xl flex items-center justify-center mb-6">
                    <HeartHandshake size={32} className="text-[#10B981]" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#001A33] mb-6 leading-tight">
                    Meet kind and <span className="text-[#10B981] italic font-normal">curious travellers</span>
                  </h2>
                  <ul className="space-y-3 text-gray-600 font-medium leading-relaxed">
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-[#10B981] shrink-0 mt-0.5" />
                      <span>The travellers who use AsiaByLocals are passionate about exploring the world and are eager to learn more about you and the places you love.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-[#10B981] shrink-0 mt-0.5" />
                      <span>The travellers on our platform are value-oriented rather than price-oriented; they get energized by authentic, unique experiences.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-[#10B981] shrink-0 mt-0.5" />
                      <span>By being a part of AsiaByLocals, you can get to know other friendly and inspiring guides in your city and around the globe.</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-[32px] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800" 
                    alt="Travellers meeting" 
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Be supported in all that you do */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1 rounded-[32px] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800" 
                    alt="Support team" 
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                <div className="order-1 lg:order-2">
                  <div className="w-16 h-16 bg-[#001A33]/10 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck size={32} className="text-[#001A33]" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold text-[#001A33] mb-6 leading-tight">
                    Be supported in <span className="text-[#001A33] italic font-normal">all that you do</span>
                  </h2>
                  <ul className="space-y-3 text-gray-600 font-medium leading-relaxed">
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-[#001A33] shrink-0 mt-0.5" />
                      <span>We have your back. From the moment you become a guide with AsiaByLocals, you've got a team of caring staff cheering you on. We want you to succeed!</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-[#001A33] shrink-0 mt-0.5" />
                      <span>From practical advice for getting started to ongoing support with every booking you make, our staff are here to help you 24/7.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-[#001A33] shrink-0 mt-0.5" />
                      <span>No need to sweat the small stuff: our team takes care of payment processing in multiple currencies.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-[#001A33] shrink-0 mt-0.5" />
                      <span>You're protected from the pain of last minute no-shows with our guide-friendly cancellation policy.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Advantages */}
      <section id="why" className="pt-20 pb-0 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 reveal">
            <h2 className="text-[48px] font-extrabold text-[#001A33] tracking-tighter leading-none">The business of local travel</h2>
            <div className="h-0.5 flex-1 bg-gray-100 mx-12 mb-6 hidden lg:block opacity-40"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <div className="space-y-6 reveal pt-8">
              {/* Introductory Content */}
              <div className="space-y-4">
                <p className="text-2xl text-gray-600 font-medium leading-relaxed">
                  Join thousands of local experts across Asia who are building successful businesses by sharing their passion for authentic travel experiences.
                </p>
                <p className="text-xl text-gray-500 font-medium leading-relaxed">
                  Whether you're a seasoned guide or just starting out, AsiaByLocals provides the platform, tools, and support you need to connect with travelers who value genuine, local experiences over generic tours.
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-6 py-8 border-t border-b border-gray-100">
                <div>
                  <div className="text-5xl font-extrabold text-[#10B981] mb-2">35,000+</div>
                  <div className="text-base font-bold text-gray-500">Active Suppliers</div>
                </div>
                <div>
                  <div className="text-5xl font-extrabold text-[#10B981] mb-2">$5,614</div>
                  <div className="text-base font-bold text-gray-500">Avg. Monthly Earnings</div>
                </div>
              </div>

              {/* Feature Items */}
              <div className="grid grid-cols-1 gap-y-6">
              {[
                { icon: <CircleDollarSign />, title: "Increase your occupancy", desc: "Fill the gaps in your calendar by reaching high-intent travelers from around the world." },
                { icon: <HeartHandshake />, title: "No-risk partnership", desc: "Registration is free. We only keep a small commission when we send you a confirmed customer." },
                { icon: <Clock />, title: "Professional Tools", desc: "Manage availability, pricing, and bookings through a dashboard designed for experts on the go." },
                { icon: <CheckCircle />, title: "Brand integrity", desc: "Our vetting process ensures you are listed alongside the top 5% of local experts in Asia." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 group stagger-item" style={{animationDelay: `${idx * 100}ms`}}>
                  <div className="shrink-0 text-[#10B981] w-14 h-14 flex items-center justify-center bg-[#10B981]/10 rounded-[20px] transition-all group-hover:bg-[#10B981] group-hover:text-white">
                    {React.cloneElement(item.icon as React.ReactElement<{ size?: number | string }>, { size: 28 })}
                  </div>
                  <div>
                    <h3 className="text-3xl font-extrabold text-[#001A33] mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
              </div>
            </div>
            
            <div className="relative reveal flex items-center justify-center" style={{transitionDelay: '300ms'}}>
              <div className="rounded-[60px] overflow-hidden shadow-2xl relative w-full">
                <img 
                  src="/japan-pagoda.jpg" 
                  className="w-full h-[680px] object-cover" 
                  alt="Japanese Pagoda with Cherry Blossoms"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001A33]/80 via-transparent to-transparent"></div>
              </div>
              <div className="absolute bottom-12 left-12 right-12 text-white">
                 <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[40px] border border-white/20">
                    <h4 className="font-black text-xl mb-2">Global Exposure</h4>
                    <p className="text-sm font-medium opacity-80 leading-relaxed">
                      Your tours will be promoted to travelers specifically looking for authentic, scholar-led, and local experiences.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-12 reveal">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="bg-[#10B981] rounded-[60px] py-12 px-12 md:px-20 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-30px_rgba(255,90,0,0.4)]">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-none tracking-tighter">Start listing your <br />activities today</h2>
              <p className="text-white/80 text-xl font-medium mb-8 max-w-2xl mx-auto">Join the leading network of Asian local experts and start reaching a global audience.</p>
              <button 
                onClick={toggleRegistration}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-black px-16 py-7 rounded-full text-2xl shadow-3xl transition-all active:scale-95 flex items-center gap-4 mx-auto group"
              >
                Create Account <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SupplierPage;

