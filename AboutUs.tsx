import React from 'react';
import { ArrowLeft, Globe, Heart, Users, Code, Award } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                window.history.back();
              } else {
                window.location.href = '/';
              }
            }}
            className="flex items-center gap-2 text-[#001A33] font-semibold hover:text-[#10B981] transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center">
              <Globe className="text-[#10B981]" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-black text-[#001A33] mb-3">About AsiaByLocals</h1>
        </div>

        {/* Mission Section */}
        <section className="mb-16">
          <div className="bg-[#001A33] rounded-xl p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-[#10B981]" size={24} />
              <h2 className="text-2xl font-black">Our Mission</h2>
            </div>
            <p className="text-lg font-semibold text-gray-100 leading-relaxed">
              To provide excellent experiences and local guides all over Asia.
            </p>
            <p className="text-base font-semibold text-gray-200 leading-relaxed mt-4">
              We curate bespoke travel experiences across Asia, designed for discerning travelers who value comfort, culture, and genuine human connection. Our purpose is to offer premium, private, and culturally immersive tours, hosted by the finest local guides and storytellers.
            </p>
          </div>
        </section>

        {/* Founder Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#001A33] mb-6">Founder</h2>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-[#001A33]">Mr. Mohd Shahnawaz Khan</h3>
            <p className="text-gray-700 font-semibold leading-relaxed">
              A Senior Tour Guide officially approved by the Ministry of Tourism, Government of India. With over 18 years of professional excellence, he ensures every journey is guided by carefully selected, highly qualified local experts.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">Licensed by Govt. of India</span>
              <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">M.A. History</span>
              <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">Tourism Management</span>
              <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">18+ Years Experience</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-xl p-8 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-black mb-1">18+</div>
                <div className="text-sm font-semibold text-gray-100">Years</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1">50+</div>
                <div className="text-sm font-semibold text-gray-100">Employees</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1">50+</div>
                <div className="text-sm font-semibold text-gray-100">Cities</div>
              </div>
              <div>
                <div className="text-3xl font-black mb-1">1000+</div>
                <div className="text-sm font-semibold text-gray-100">Experiences</div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#001A33] mb-6">Our Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Users className="text-[#10B981]" size={24} />
                <h3 className="text-lg font-black text-[#001A33]">50+ Employees</h3>
              </div>
              <p className="text-gray-700 font-semibold text-sm">
                Tour guides, customer service, operations, and support staff dedicated to exceptional travel experiences.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <Code className="text-[#10B981]" size={24} />
                <h3 className="text-lg font-black text-[#001A33]">IT Engineers</h3>
              </div>
              <p className="text-gray-700 font-semibold text-sm">
                In-house team enhancing our platform with seamless booking, secure transactions, and innovative features.
              </p>
            </div>
          </div>
        </section>

        {/* Key Points */}
        <section className="mb-16">
          <h2 className="text-2xl font-black text-[#001A33] mb-6">Why Choose Us</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Award className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-black text-[#001A33] mb-1">Government Approved Guides</h3>
                <p className="text-gray-700 font-semibold text-sm">All guides licensed by respective tourism ministries across Asia.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Heart className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-black text-[#001A33] mb-1">Premium Private Tours</h3>
                <p className="text-gray-700 font-semibold text-sm">Culturally immersive experiences with personalized attention.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Award className="text-[#10B981] flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-black text-[#001A33] mb-1">Trusted by Leading Hotels</h3>
                <p className="text-gray-700 font-semibold text-sm">Patronized by 5-star hotels, embassies, and travel operators.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-16">
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
            <h2 className="text-xl font-black text-[#001A33] mb-6 text-center">Contact Us</h2>
            <div className="text-center mb-6">
              <div>
                <span className="text-3xl font-black text-[#10B981]">
                  AsiaByLocals
                </span>
              </div>
              <div className="mt-2">
                <span className="text-base font-semibold text-[#001A33] relative">
                  a unit of TajTourGuide
                  <sup className="text-xs ml-1">™</sup>
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-700 font-black mb-2">Registered Office:</p>
                <p className="text-gray-600 font-semibold">118 Rani Bagh Indirapuram<br />Agra 282001<br />Uttar Pradesh, India</p>
                <p className="text-gray-600 font-semibold mt-3">
                  Contact: +919897873562, +918938842594<br />
                  Email: info@asiabylocals.com, tajtourguide@gmail.com
                </p>
              </div>
              <div className="text-center pt-4 border-t border-gray-300">
                <p className="text-gray-700 font-semibold mb-2">Branch Office:</p>
                <p className="text-gray-600 font-semibold">JBC 3 Building, Cluster Y, JLT Dubai</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-[#001A33] rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-black mb-4">Join Our Community</h2>
            <p className="text-gray-200 font-semibold mb-6">
              Whether you're a traveler or a guide, we'd love to have you join AsiaByLocals.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/supplier"
                className="bg-[#10B981] hover:bg-[#059669] text-white font-black px-6 py-2 rounded-lg transition-colors"
              >
                Become a Guide
              </a>
              <a
                href="/"
                className="bg-white/10 hover:bg-white/20 text-white font-black px-6 py-2 rounded-lg border border-white/20 transition-colors"
              >
                Explore Tours
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
