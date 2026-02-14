import React from 'react';
import { MessageCircle, ArrowLeft, Clock, HelpCircle, Mail, ShieldCheck, Shield, FileText } from 'lucide-react';

const SupportPage: React.FC = () => {
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
            <MessageCircle className="text-[#10B981]" size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#001A33]">Support</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg font-semibold mb-8">
            We're here to help! Our support team is available 24/7 to assist you with any questions, concerns, or issues you may have.
          </p>

          {/* 24/7 WhatsApp Support Section */}
          <section className="mb-10">
            <div className="bg-[#001A33] rounded-xl p-8 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-white mb-2">24/7 WhatsApp Support</h2>
                <p className="text-gray-300 font-semibold">
                  Get instant help via WhatsApp - we're always here for you!
                </p>
              </div>

              <div className="flex items-center justify-center gap-6 flex-wrap">
                <a
                  href="https://wa.me/918449538716"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 transition-all hover:scale-110 shadow-lg border-2 border-white flex items-center justify-center w-16 h-16"
                  title="WhatsApp Support - +91 84495 38716"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>

                <a
                  href="https://wa.me/919897873562"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 transition-all hover:scale-110 shadow-lg border-2 border-white flex items-center justify-center w-16 h-16"
                  title="WhatsApp Support - +91 98978 73562"
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Common Questions Section */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="text-[#10B981]" size={28} />
              <h2 className="text-2xl font-black text-[#001A33]">Common Questions</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-black text-[#001A33] mb-2">How do I book a tour?</h3>
                <p className="text-gray-700 font-semibold">
                  Browse our city pages, select a tour that interests you, choose your date and number of participants, and complete the booking. You'll receive a confirmation via email and WhatsApp.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-black text-[#001A33] mb-2">Can I cancel or modify my booking?</h3>
                <p className="text-gray-700 font-semibold">
                  Yes! Contact us via WhatsApp and we'll help you cancel or modify your booking according to our cancellation policy. Most tours offer free cancellation up to 24 hours before the start time.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-black text-[#001A33] mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-700 font-semibold">
                  We accept all major credit cards, debit cards, UPI (for India), PayPal, and bank transfers. All payments are processed securely.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-black text-[#001A33] mb-2">Are your guides verified?</h3>
                <p className="text-gray-700 font-semibold">
                  Absolutely! All our guides undergo a comprehensive verification process including identity checks, background verification, and local knowledge assessment. Your safety is our priority.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-black text-[#001A33] mb-2">What if I have special requirements?</h3>
                <p className="text-gray-700 font-semibold">
                  No problem! Contact us via WhatsApp before booking and we'll work with you and your guide to accommodate any special needs, dietary restrictions, or accessibility requirements.
                </p>
              </div>
            </div>
          </section>

          {/* Response Time Section */}
          <section className="mb-10">
            <div className="bg-[#F0FDF4] border-2 border-[#10B981] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="text-[#10B981]" size={24} />
                <h2 className="text-xl font-black text-[#001A33]">Response Time</h2>
              </div>
              <p className="text-gray-700 font-semibold">
                We typically respond to WhatsApp messages within <strong className="text-[#10B981]">5-10 minutes</strong> during business hours. For urgent matters, please call or send a message marked "URGENT" and we'll prioritize your request.
              </p>
            </div>
          </section>

          {/* Additional Resources */}
          <section className="mb-10">
            <h2 className="text-2xl font-black text-[#001A33] mb-6">Additional Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="/safety-guidelines"
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#10B981] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="text-[#10B981]" size={24} />
                  <h3 className="text-lg font-black text-[#001A33]">Safety Guidelines</h3>
                </div>
                <p className="text-gray-600 font-semibold text-sm">
                  Learn about our safety protocols and guidelines for a secure travel experience.
                </p>
              </a>

              <a
                href="/privacy-policy"
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#10B981] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="text-[#10B981]" size={24} />
                  <h3 className="text-lg font-black text-[#001A33]">Privacy Policy</h3>
                </div>
                <p className="text-gray-600 font-semibold text-sm">
                  Understand how we protect and handle your personal information.
                </p>
              </a>

              <a
                href="/terms-and-conditions"
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#10B981] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="text-[#10B981]" size={24} />
                  <h3 className="text-lg font-black text-[#001A33]">Terms & Conditions</h3>
                </div>
                <p className="text-gray-600 font-semibold text-sm">
                  Review our terms of service and booking conditions.
                </p>
              </a>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="text-[#10B981]" size={24} />
                  <h3 className="text-lg font-black text-[#001A33]">Email Support</h3>
                </div>
                <p className="text-gray-600 font-semibold text-sm mb-3">
                  For non-urgent inquiries, you can also reach us via email. We'll respond within 24 hours.
                </p>
                <a
                  href="mailto:support@asiabylocals.com"
                  className="text-[#10B981] font-black hover:underline"
                >
                  support@asiabylocals.com
                </a>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <div className="bg-gray-50 rounded-xl p-6 mt-10">
            <p className="text-gray-600 font-semibold text-center">
              <strong>We're here to help!</strong> Don't hesitate to reach out if you have any questions or concerns. Our support team is committed to ensuring you have the best possible experience with AsiaByLocals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
