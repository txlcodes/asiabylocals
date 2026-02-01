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
              <div className="flex items-center justify-center gap-4">
                <a 
                  href="https://wa.me/918449538716" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#10B981] hover:bg-[#059669] text-white rounded-full p-4 transition-all hover:scale-110 shadow-lg"
                  title="WhatsApp Support"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                <a 
                  href="https://wa.me/919897873562" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-[#10B981] hover:bg-[#059669] text-white rounded-full p-4 transition-all hover:scale-110 shadow-lg"
                  title="WhatsApp Support"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
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
