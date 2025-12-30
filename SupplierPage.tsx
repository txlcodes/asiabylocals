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

const NAV_LINKS = [
  { label: 'Why partner with us', id: 'why' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Pricing', id: 'stats' }
];

interface SupplierPageProps {
  onClose?: () => void;
}

const SupplierPage: React.FC<SupplierPageProps> = ({ onClose }) => {
  const [activeNav, setActiveNav] = useState('why');
  const [showRegistration, setShowRegistration] = useState(false);

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

  if (showRegistration) {
    return <SupplierRegistration onClose={() => setShowRegistration(false)} />;
  }

  return (
    <div className="bg-white min-h-screen relative font-['Plus_Jakarta_Sans']">
      {/* Header with Back Button */}
      {onClose && (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-[1280px] mx-auto px-8 py-4 flex items-center justify-between">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 text-[#001A33] font-semibold hover:text-[#FF5A00] text-[14px] transition-colors"
            >
              <ChevronRight size={18} className="rotate-180" />
              Back to Home
            </button>
            <img 
              src="/logo.png" 
              alt="AsiaByLocals" 
              className="h-12 w-auto"
            />
          </div>
        </header>
      )}
      
      {/* Hero Section */}
      <section className="pt-24 pb-40 max-w-[1280px] mx-auto px-8 grid lg:grid-cols-2 gap-20 items-center reveal">
        <div className="z-10">
          <h1 className="text-5xl md:text-[68px] font-extrabold text-[#001A33] leading-[1.05] mb-6 tracking-tighter">
            You could earn <br />
            <span className="text-[#FF5A00]">$5,614 per month</span><br />
            in Asia
          </h1>
          
          <p className="text-xl text-gray-500 font-medium mb-8 max-w-lg leading-relaxed">
            Create your activity on AsiaByLocals for free under 30 minutes.
          </p>

          <div className="mb-16">
            <button 
              onClick={toggleRegistration}
              className="bg-[#0071EB] hover:bg-[#005bb8] text-white font-black px-10 py-5 rounded-full text-lg shadow-2xl shadow-blue-200 flex items-center gap-3 transition-all active:scale-95 group"
            >
              Get Started <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
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
                  <span className="w-10 h-10 rounded-full bg-[#FF5A00] flex items-center justify-center font-black text-sm text-white">
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
                      <div className="absolute top-2 left-2 bg-[#0071EB] text-white text-[9px] font-black px-2 py-1 rounded">TOP PICK</div>
                    </div>
                    <div className="p-3">
                      <div className="text-[9px] font-black text-[#FF5A00] uppercase mb-1">CULTURAL TOUR</div>
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
                    <div className="w-1 h-1 bg-[#0071EB] rounded-full"></div>
                    <span className="text-[8px] font-bold text-[#0071EB]">Discover</span>
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
      <section id="stats" className="bg-[#FF5A00] py-32 reveal">
        <div className="max-w-[1280px] mx-auto px-8">
          <h2 className="text-white text-4xl md:text-5xl font-extrabold mb-20 max-w-3xl leading-[1.1] tracking-tighter">
            A partnership built for your growth, with zero financial risk.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: '$0', lbl: 'Listing fees', d: 'Pay only when you get a booking' },
              { val: '100%', lbl: 'Payment Protection', d: 'Secure payouts for every tour' },
              { val: '48h', lbl: 'Fast verification', d: 'Get listed and live quickly' },
              { val: '24/7', lbl: 'Partner support', d: 'Dedicated team for your business' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-12 rounded-[48px] shadow-2xl transition-all hover:-translate-y-2 duration-500 stagger-item" style={{animationDelay: `${i * 150}ms`}}>
                <div className="text-[#FF5A00] text-5xl font-serif-header italic mb-3">{stat.val}</div>
                <div className="text-[#001A33] font-black text-xs uppercase tracking-widest mb-2">{stat.lbl}</div>
                <div className="text-gray-400 text-xs font-bold leading-relaxed">{stat.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Advantages */}
      <section id="why" className="py-40 bg-white">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 reveal">
            <h2 className="text-[48px] font-extrabold text-[#001A33] tracking-tighter leading-none">The business of local travel</h2>
            <div className="h-0.5 flex-1 bg-gray-100 mx-12 mb-6 hidden lg:block opacity-40"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-24 items-start">
            <div className="grid grid-cols-1 gap-y-16 reveal">
              {[
                { icon: <CircleDollarSign />, title: "Increase your occupancy", desc: "Fill the gaps in your calendar by reaching high-intent travelers from around the world." },
                { icon: <HeartHandshake />, title: "No-risk partnership", desc: "Registration is free. We only keep a small commission when we send you a confirmed customer." },
                { icon: <Clock />, title: "Professional Tools", desc: "Manage availability, pricing, and bookings through a dashboard designed for experts on the go." },
                { icon: <CheckCircle />, title: "Brand integrity", desc: "Our vetting process ensures you are listed alongside the top 5% of local experts in Asia." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-8 group stagger-item" style={{animationDelay: `${idx * 100}ms`}}>
                  <div className="shrink-0 text-[#FF5A00] w-14 h-14 flex items-center justify-center bg-[#FF5A00]/10 rounded-[20px] transition-all group-hover:bg-[#FF5A00] group-hover:text-white">
                    {React.cloneElement(item.icon as React.ReactElement<{ size?: number | string }>, { size: 28 })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-[#001A33] mb-3 tracking-tight">{item.title}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative reveal" style={{transitionDelay: '300ms'}}>
              <div className="rounded-[60px] overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80&w=800" 
                  className="w-full h-[680px] object-cover" 
                  alt="Professional Service"
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
      <section className="bg-white py-32 reveal">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="bg-[#FF5A00] rounded-[60px] py-24 px-12 md:px-24 text-center text-white relative overflow-hidden shadow-[0_40px_100px_-30px_rgba(255,90,0,0.4)]">
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-extrabold mb-8 leading-none tracking-tighter">Start listing your <br />activities today</h2>
              <p className="text-white/80 text-xl font-medium mb-16 max-w-2xl mx-auto">Join the leading network of Asian local experts and start reaching a global audience.</p>
              <button 
                onClick={toggleRegistration}
                className="bg-[#0071EB] hover:bg-[#005bb8] text-white font-black px-16 py-7 rounded-full text-2xl shadow-3xl transition-all active:scale-95 flex items-center gap-4 mx-auto group"
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

