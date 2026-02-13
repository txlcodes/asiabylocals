import React, { useState, useEffect } from 'react';
import { Clock, X, CheckCircle } from 'lucide-react';

interface CheckoutPageProps {
  onClose: () => void;
  onProceedToPayment: (guestData: {
    fullName: string;
    email: string;
    country: string;
    countryCode: string;
    phoneNumber: string;
  }) => void;
  cancellationDate?: string;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  onClose, 
  onProceedToPayment,
  cancellationDate 
}) => {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [guestData, setGuestData] = useState({
    fullName: '',
    email: '',
    country: 'India',
    countryCode: '+91',
    phoneNumber: ''
  });

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    // TODO: Implement social login
    console.log(`Login with ${provider}`);
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestData.fullName || !guestData.email || !guestData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }
    onProceedToPayment(guestData);
  };

  const countries = [
    { name: 'India', code: '+91' },
    { name: 'United States', code: '+1' },
    { name: 'United Kingdom', code: '+44' },
    { name: 'Australia', code: '+61' },
    { name: 'Canada', code: '+1' },
    { name: 'Germany', code: '+49' },
    { name: 'France', code: '+33' },
    { name: 'Japan', code: '+81' },
    { name: 'Singapore', code: '+65' },
    { name: 'UAE', code: '+971' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Timer */}
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 mb-6 flex items-center gap-2">
          <Clock className="text-red-500" size={20} />
          <span className="text-sm font-semibold text-gray-700">
            We'll hold your spot for {formatTime(timeLeft)} minutes.
          </span>
        </div>

        {/* Login/Sign Up Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-black text-[#001A33] mb-4">Log in or sign up</h2>
          
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold text-gray-700">Continue with Google</span>
            </button>

            <button
              onClick={() => handleSocialLogin('apple')}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.17 2.08-1.85 3.86-3.74 4.25z"/>
              </svg>
              <span className="font-semibold text-gray-700">Continue with Apple</span>
            </button>

            <button
              onClick={() => handleSocialLogin('facebook')}
              className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="font-semibold text-gray-700">Continue with Facebook</span>
            </button>
          </div>

          {/* Terms and Privacy */}
          <p className="text-xs text-gray-600 text-center">
            By creating an account, you agree to our{' '}
            <a href="/terms-and-conditions" className="underline font-semibold">Terms and Conditions</a>.
            See our{' '}
            <a href="/privacy-policy" className="underline font-semibold">Privacy Policy</a>.
          </p>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 font-semibold">Or continue as guest</span>
          </div>
        </div>

        {/* Guest Form */}
        <form onSubmit={handleGuestSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-black text-[#001A33] mb-2">Full name *</label>
            <input
              type="text"
              required
              value={guestData.fullName}
              onChange={(e) => setGuestData({ ...guestData, fullName: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-[#001A33] mb-2">Email *</label>
            <input
              type="email"
              required
              value={guestData.email}
              onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-black text-[#001A33] mb-2">Country *</label>
            <select
              required
              value={`${guestData.country}|${guestData.countryCode}`}
              onChange={(e) => {
                const [country, code] = e.target.value.split('|');
                setGuestData({ ...guestData, country, countryCode: code });
              }}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
            >
              {countries.map((country) => (
                <option key={country.code} value={`${country.name}|${country.code}`}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-black text-[#001A33] mb-2">Mobile phone number *</label>
            <input
              type="tel"
              required
              value={guestData.phoneNumber}
              onChange={(e) => setGuestData({ ...guestData, phoneNumber: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
              placeholder="Enter your phone number"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll only contact you with essential updates or changes to your booking
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl text-base transition-colors shadow-lg"
          >
            Go to payment
          </button>
        </form>

        {/* Booking Benefits */}
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-[#10B981] mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-black text-[#001A33]">Pay nothing today</p>
              <p className="text-xs text-gray-600 font-semibold">Book now and pay later</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="text-[#10B981] mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-black text-[#001A33]">Free cancellation</p>
              <p className="text-xs text-gray-600 font-semibold">
                {cancellationDate 
                  ? `Until ${cancellationDate}`
                  : 'Until 8:00 AM on March 18'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
