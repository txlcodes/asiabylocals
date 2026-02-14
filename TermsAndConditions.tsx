import React from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto h-16 sm:h-20 md:h-24 flex items-center justify-between px-6">
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
          <a href="/" className="flex items-center h-full cursor-pointer">
            <img
              src="/logo.png"
              alt="Asia By Locals"
              className="h-[110px] sm:h-[100px] md:h-[105px] lg:h-[110px] xl:h-[120px] w-auto object-contain"
              style={{ transform: 'translateY(3px)' }}
            />
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center">
            <FileText className="text-[#10B981]" size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#001A33]">Terms & Conditions</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg font-semibold mb-8">
            <strong>Last Updated:</strong> January 2025
          </p>
          <p className="text-gray-600 text-lg font-semibold mb-8">
            Please read these Terms & Conditions carefully before using AsiaByLocals platform. By accessing or using our services, you agree to be bound by these terms.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 font-semibold mb-3">
              By accessing and using AsiaByLocals ("we," "us," or "our"), you accept and agree to be bound by these Terms & Conditions. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">2. Definitions</h2>
            <ul className="space-y-3 text-gray-700 font-semibold">
              <li><strong>"Platform"</strong> refers to the AsiaByLocals website and mobile applications.</li>
              <li><strong>"User"</strong> or <strong>"Traveler"</strong> refers to any person who books or uses our services.</li>
              <li><strong>"Guide"</strong> or <strong>"Supplier"</strong> refers to local experts who provide tours and experiences.</li>
              <li><strong>"Tour"</strong> or <strong>"Experience"</strong> refers to any activity, tour, or service offered through our platform.</li>
              <li><strong>"Booking"</strong> refers to a confirmed reservation for a tour or experience.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">3. Use of the Platform</h2>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Eligibility</h3>
            <p className="text-gray-700 font-semibold mb-3">
              You must be at least 18 years old to use our platform. By using our services, you represent that you are of legal age and have the capacity to enter into binding agreements.
            </p>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Account Registration</h3>
            <p className="text-gray-700 font-semibold mb-3">
              When creating an account, you agree to:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Provide accurate, current, and complete information</li>
              <li>• Maintain and update your information as necessary</li>
              <li>• Keep your account credentials secure and confidential</li>
              <li>• Notify us immediately of any unauthorized access</li>
              <li>• Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">4. Bookings and Payments</h2>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Booking Process</h3>
            <p className="text-gray-700 font-semibold mb-3">
              When you book a tour:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• You receive a booking confirmation via email</li>
              <li>• Your booking is subject to guide availability</li>
              <li>• We reserve the right to cancel bookings if necessary</li>
              <li>• Prices are displayed in the selected currency and may vary</li>
            </ul>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Payment Terms</h3>
            <p className="text-gray-700 font-semibold mb-3">
              Payment terms:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Full payment is required at the time of booking unless otherwise stated</li>
              <li>• We accept major credit cards and other payment methods as displayed</li>
              <li>• All prices include applicable taxes unless otherwise noted</li>
              <li>• Currency conversion rates are approximate and may vary</li>
              <li>• Payment processing is handled by secure third-party providers</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">5. Cancellations and Refunds</h2>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Cancellation by Traveler</h3>
            <p className="text-gray-700 font-semibold mb-3">
              Cancellation policies vary by tour. Generally:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Free cancellation is available up to 24-48 hours before the tour (varies by tour)</li>
              <li>• Cancellations made within the cancellation period may be subject to fees</li>
              <li>• No-shows are not eligible for refunds</li>
              <li>• Refunds, if applicable, will be processed within 7-14 business days</li>
            </ul>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Cancellation by Guide or Platform</h3>
            <p className="text-gray-700 font-semibold mb-3">
              If we or your guide cancel your booking:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• You will receive a full refund</li>
              <li>• We will attempt to offer alternative dates or tours</li>
              <li>• We are not liable for additional expenses incurred</li>
            </ul>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Weather and Force Majeure</h3>
            <p className="text-gray-700 font-semibold mb-3">
              Tours may be canceled or modified due to:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Severe weather conditions</li>
              <li>• Natural disasters</li>
              <li>• Government restrictions or travel advisories</li>
              <li>• Other circumstances beyond our control</li>
            </ul>
            <p className="text-gray-700 font-semibold mt-4">
              In such cases, we will work with you to reschedule or provide refunds as appropriate.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">6. Tour Conduct and Responsibilities</h2>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Traveler Responsibilities</h3>
            <p className="text-gray-700 font-semibold mb-3">
              You agree to:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Arrive on time at the designated meeting point</li>
              <li>• Follow all safety instructions provided by your guide</li>
              <li>• Respect local laws, customs, and cultural practices</li>
              <li>• Behave respectfully toward guides and other travelers</li>
              <li>• Inform your guide of any medical conditions or special requirements</li>
              <li>• Take responsibility for your personal belongings</li>
            </ul>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Prohibited Conduct</h3>
            <p className="text-gray-700 font-semibold mb-3">
              You may not:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Engage in illegal activities during tours</li>
              <li>• Harass, abuse, or threaten guides or other travelers</li>
              <li>• Damage property or cause disturbances</li>
              <li>• Use tours for commercial purposes without authorization</li>
              <li>• Share guide contact information with third parties</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 font-semibold mb-3">
              To the maximum extent permitted by law:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• AsiaByLocals acts as an intermediary between travelers and guides</li>
              <li>• We are not responsible for the actions, omissions, or conduct of guides</li>
              <li>• We are not liable for injuries, losses, or damages during tours</li>
              <li>• We recommend comprehensive travel insurance</li>
              <li>• Our total liability is limited to the amount paid for the specific booking</li>
            </ul>
            <p className="text-gray-700 font-semibold mt-4">
              You participate in tours at your own risk and are responsible for your safety and well-being.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 font-semibold mb-3">
              All content on our platform, including:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Text, graphics, logos, and images</li>
              <li>• Software and code</li>
              <li>• Tour descriptions and content</li>
              <li>• User reviews and ratings</li>
            </ul>
            <p className="text-gray-700 font-semibold mt-4">
              ...is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or use our content without written permission.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">9. Reviews and Content</h2>
            <p className="text-gray-700 font-semibold mb-3">
              When you submit reviews, photos, or other content:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• You grant us a license to use, display, and distribute your content</li>
              <li>• You represent that your content is accurate and does not violate any rights</li>
              <li>• We reserve the right to remove inappropriate or offensive content</li>
              <li>• Reviews must be honest and based on actual experiences</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">10. Dispute Resolution</h2>
            <p className="text-gray-700 font-semibold mb-3">
              If you have a complaint or dispute:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Contact us first through our 24/7 support channels</li>
              <li>• We will attempt to resolve disputes amicably</li>
              <li>• If resolution is not possible, disputes may be subject to binding arbitration</li>
              <li>• These terms are governed by the laws of the jurisdiction where we operate</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">11. Modifications to Terms</h2>
            <p className="text-gray-700 font-semibold mb-3">
              We reserve the right to modify these Terms & Conditions at any time. Changes will be effective immediately upon posting. Your continued use of our platform after changes indicates acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">12. Termination</h2>
            <p className="text-gray-700 font-semibold mb-3">
              We may suspend or terminate your account if you:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Violate these Terms & Conditions</li>
              <li>• Engage in fraudulent or illegal activities</li>
              <li>• Misuse our platform or services</li>
              <li>• Provide false or misleading information</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">13. Contact Information</h2>
            <p className="text-gray-700 font-semibold mb-4">
              For questions about these Terms & Conditions, please contact us:
            </p>
            <div className="bg-[#F0FDF4] border-2 border-[#10B981] rounded-xl p-6">
              <h3 className="text-xl font-black text-[#001A33] mb-3">24/7 Support</h3>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://wa.me/918449538716"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#10B981] hover:bg-[#059669] text-white rounded-full p-4 transition-all hover:scale-110 shadow-lg"
                  title="WhatsApp Support"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <div className="bg-gray-50 rounded-xl p-6 mt-10">
            <p className="text-gray-600 font-semibold">
              By using AsiaByLocals, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
            </p>
            <p className="text-gray-600 font-semibold mt-2">
              <strong>Last Updated:</strong> January 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
