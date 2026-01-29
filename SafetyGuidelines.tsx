import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

const SafetyGuidelines: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-[#001A33] font-semibold hover:text-[#10B981] transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center">
            <ShieldCheck className="text-[#10B981]" size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#001A33]">Safety Guidelines</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg font-semibold mb-8">
            Your safety is our top priority. We've established comprehensive guidelines to ensure secure and enjoyable experiences for all travelers.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">Before Your Tour</h2>
            <ul className="space-y-3 text-gray-700 font-semibold">
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Verify Your Guide:</strong> Always confirm your guide's identity and contact information before meeting. Our guides are verified and will share their credentials.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Share Your Itinerary:</strong> Inform family or friends about your tour details, meeting point, and expected return time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Check Weather Conditions:</strong> Review local weather forecasts and dress appropriately for outdoor activities.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Review Tour Details:</strong> Read the full tour description, inclusions, and any special requirements before booking.</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">During Your Tour</h2>
            <ul className="space-y-3 text-gray-700 font-semibold">
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Stay with Your Group:</strong> Remain with your guide and group throughout the tour. Don't wander off alone.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Follow Guide Instructions:</strong> Your guide knows the area best. Follow their safety instructions and recommendations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Stay Hydrated:</strong> Drink plenty of water, especially during outdoor tours in warm climates.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Respect Local Customs:</strong> Be mindful of cultural norms and dress codes, especially at religious sites.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Keep Emergency Contacts Handy:</strong> Save our 24/7 support numbers: +91 84495 38716 and +91 98978 73562</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">Health & Medical</h2>
            <ul className="space-y-3 text-gray-700 font-semibold">
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Disclose Medical Conditions:</strong> Inform your guide about any allergies, medical conditions, or mobility limitations.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Carry Medications:</strong> Bring necessary medications and keep them accessible during the tour.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Travel Insurance:</strong> We recommend comprehensive travel insurance covering medical emergencies and trip cancellations.</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">Emergency Procedures</h2>
            <div className="bg-[#F0FDF4] border-2 border-[#10B981] rounded-xl p-6 mb-4">
              <h3 className="text-xl font-black text-[#001A33] mb-3">24/7 Emergency Support</h3>
              <p className="text-gray-700 font-semibold mb-4">
                If you encounter any safety concerns or emergencies during your tour, contact us immediately:
              </p>
              <div className="space-y-2">
                <a href="https://wa.me/918449538716" target="_blank" rel="noopener noreferrer" className="block text-[#10B981] font-black text-lg hover:underline">
                  +91 84495 38716 (WhatsApp)
                </a>
                <a href="https://wa.me/919897873562" target="_blank" rel="noopener noreferrer" className="block text-[#10B981] font-black text-lg hover:underline">
                  +91 98978 73562 (WhatsApp)
                </a>
              </div>
            </div>
            <ul className="space-y-3 text-gray-700 font-semibold">
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Local Emergency Services:</strong> In case of immediate danger, call local emergency services (112 or 911) first, then contact us.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span><strong>Report Incidents:</strong> Report any safety concerns or incidents to us immediately so we can take appropriate action.</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">Guide Vetting Process</h2>
            <p className="text-gray-700 font-semibold mb-4">
              All our guides undergo a comprehensive vetting process:
            </p>
            <ul className="space-y-3 text-gray-700 font-semibold">
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Identity verification and background checks</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Local knowledge and expertise assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Language proficiency verification</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Safety training and certification</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Ongoing performance monitoring and reviews</span>
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">Your Responsibilities</h2>
            <ul className="space-y-3 text-gray-700 font-semibold">
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Arrive on time at the designated meeting point</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Follow all safety instructions provided by your guide</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Respect local laws, customs, and cultural practices</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Behave responsibly and considerately toward guides and other travelers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#10B981] font-black mt-1">✓</span>
                <span>Inform your guide immediately if you feel unsafe or uncomfortable</span>
              </li>
            </ul>
          </section>

          <div className="bg-gray-50 rounded-xl p-6 mt-10">
            <p className="text-gray-600 font-semibold">
              <strong>Last Updated:</strong> January 2025
            </p>
            <p className="text-gray-600 font-semibold mt-2">
              These guidelines are subject to updates. Please check this page periodically for the latest safety information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuidelines;
