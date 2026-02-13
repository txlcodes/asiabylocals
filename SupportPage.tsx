import React from 'react';
import { MessageCircle, ArrowLeft, Clock, HelpCircle, Mail, ShieldCheck, Shield, FileText } from 'lucide-react';

const SupportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="cursor-pointer"
            onClick={() => window.location.href = '/'}
          >
            <img
              src="/logo.png"
              alt="Asia By Locals"
              className="h-[60px] md:h-[70px] w-auto object-contain"
            />
          </div>
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
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center">
            <HelpCircle className="text-[#10B981]" size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#001A33]">Support</h1>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 text-lg font-semibold mb-8">
            We're here to help! Our support team is available 24/7 to assist you with any questions, concerns, or issues you may have.
          </p>

          {/* 24/7 Support Section */}
          <section className="mb-10">
            <div className="bg-[#001A33] rounded-xl p-8 mb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-white mb-2">24/7 Support</h2>
                <p className="text-gray-300 font-semibold">
                  Get support via email - we're always here for you!
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <a
                  href="mailto:contact@asiabylocals.com"
                  className="bg-[#10B981] hover:bg-[#059669] text-white rounded-full px-8 py-4 font-black transition-all hover:scale-105 shadow-lg flex items-center gap-3"
                >
                  <Mail size={20} />
                  contact@asiabylocals.com
                </a>
                <a
                  href="mailto:info@asiabylocals.com"
                  className="text-gray-300 font-bold hover:text-white transition-colors"
                >
                  info@asiabylocals.com
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
                  Browse our city pages, select a tour that interests you, choose your date and number of participants, and complete the booking. You'll receive a confirmation via email.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-black text-[#001A33] mb-2">Can I cancel or modify my booking?</h3>
                <p className="text-gray-700 font-semibold">
                  Yes! Contact us via email and we'll help you cancel or modify your booking according to our cancellation policy. Most tours offer free cancellation up to 24 hours before the start time.
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
                  No problem! Contact us via email before booking and we'll work with you and your guide to accommodate any special needs, dietary restrictions, or accessibility requirements.
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
                We typically respond to emails within <strong className="text-[#10B981]">a few hours</strong>. For urgent matters, please send an email marked "URGENT" and we'll prioritize your request.
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
                  href="mailto:contact@asiabylocals.com"
                  className="text-[#10B981] font-black hover:underline"
                >
                  contact@asiabylocals.com
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
