import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
            <Shield className="text-[#10B981]" size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#001A33]">Privacy Policy</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg font-semibold mb-8">
            <strong>Last Updated:</strong> January 2025
          </p>
          <p className="text-gray-600 text-lg font-semibold mb-8">
            At AsiaByLocals, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Personal Information</h3>
            <p className="text-gray-700 font-semibold mb-3">
              When you book a tour or create an account, we may collect:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold mb-4">
              <li>• Name and contact information (email, phone number)</li>
              <li>• Payment information (processed securely through third-party providers)</li>
              <li>• Travel preferences and special requirements</li>
              <li>• Booking history and tour reviews</li>
            </ul>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Automatically Collected Information</h3>
            <p className="text-gray-700 font-semibold mb-3">
              When you visit our website, we automatically collect:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold mb-4">
              <li>• IP address and device information</li>
              <li>• Browser type and version</li>
              <li>• Pages visited and time spent on pages</li>
              <li>• Referring website addresses</li>
              <li>• Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 font-semibold mb-3">
              We use the information we collect to:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Process and manage your bookings</li>
              <li>• Communicate with you about your tours and bookings</li>
              <li>• Send you booking confirmations, updates, and important notices</li>
              <li>• Respond to your inquiries and provide customer support</li>
              <li>• Improve our services and user experience</li>
              <li>• Send marketing communications (with your consent)</li>
              <li>• Detect and prevent fraud or unauthorized access</li>
              <li>• Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 font-semibold mb-3">
              We may share your information with:
            </p>
            
            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Tour Guides</h3>
            <p className="text-gray-700 font-semibold mb-3">
              When you book a tour, we share necessary information with your assigned guide, including:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold mb-4">
              <li>• Your name and contact information</li>
              <li>• Number of participants</li>
              <li>• Special requests or requirements</li>
              <li>• Meeting point and tour details</li>
            </ul>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Service Providers</h3>
            <p className="text-gray-700 font-semibold mb-3">
              We work with trusted third-party service providers who help us operate our platform:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold mb-4">
              <li>• Payment processors for secure payment handling</li>
              <li>• Email service providers for communications</li>
              <li>• Cloud hosting providers for data storage</li>
              <li>• Analytics providers to understand website usage</li>
            </ul>

            <h3 className="text-xl font-black text-[#001A33] mb-3 mt-6">Legal Requirements</h3>
            <p className="text-gray-700 font-semibold mb-3">
              We may disclose your information if required by law or to:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Comply with legal processes or government requests</li>
              <li>• Protect our rights, property, or safety</li>
              <li>• Prevent fraud or security threats</li>
              <li>• Enforce our Terms & Conditions</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">4. Data Security</h2>
            <p className="text-gray-700 font-semibold mb-3">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• SSL encryption for data transmission</li>
              <li>• Secure payment processing through certified providers</li>
              <li>• Regular security audits and updates</li>
              <li>• Access controls and authentication measures</li>
              <li>• Employee training on data protection</li>
            </ul>
            <p className="text-gray-700 font-semibold mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 font-semibold mb-3">
              We use cookies and similar technologies to:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Remember your preferences and settings</li>
              <li>• Analyze website traffic and usage patterns</li>
              <li>• Provide personalized content and recommendations</li>
              <li>• Improve website functionality</li>
            </ul>
            <p className="text-gray-700 font-semibold mt-4">
              You can control cookies through your browser settings. However, disabling cookies may limit some website features.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 font-semibold mb-3">
              You have the right to:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Access and review your personal information</li>
              <li>• Request corrections to inaccurate data</li>
              <li>• Request deletion of your personal information</li>
              <li>• Opt-out of marketing communications</li>
              <li>• Withdraw consent for data processing</li>
              <li>• Request data portability</li>
            </ul>
            <p className="text-gray-700 font-semibold mt-4">
              To exercise these rights, please contact us at our support numbers or email us through our contact form.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">7. Data Retention</h2>
            <p className="text-gray-700 font-semibold mb-3">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Provide our services and fulfill bookings</li>
              <li>• Comply with legal and regulatory requirements</li>
              <li>• Resolve disputes and enforce agreements</li>
              <li>• Maintain business records for legitimate purposes</li>
            </ul>
            <p className="text-gray-700 font-semibold mt-4">
              When information is no longer needed, we securely delete or anonymize it.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700 font-semibold mb-3">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 font-semibold mb-3">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 font-semibold mb-3">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by:
            </p>
            <ul className="space-y-2 text-gray-700 font-semibold">
              <li>• Posting the updated policy on our website</li>
              <li>• Sending email notifications for material changes</li>
              <li>• Updating the "Last Updated" date</li>
            </ul>
            <p className="text-gray-700 font-semibold mt-4">
              Your continued use of our services after changes indicates acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-4">11. Contact Us</h2>
            <p className="text-gray-700 font-semibold mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
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
          </section>

          <div className="bg-gray-50 rounded-xl p-6 mt-10">
            <p className="text-gray-600 font-semibold">
              This Privacy Policy is effective as of January 2025 and applies to all users of AsiaByLocals platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
