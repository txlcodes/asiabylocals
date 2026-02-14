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
    specialRequests?: string;
  }) => void;
  cancellationDate?: string;
  tour?: any; // Tour data to add to cart
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  onClose, 
  onProceedToPayment,
  cancellationDate,
  tour
}) => {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [guestData, setGuestData] = useState({
    fullName: '',
    email: '',
    country: 'India',
    countryCode: '+91',
    phoneNumber: '',
    specialRequests: ''
  });

  // Add tour to cart when component mounts
  useEffect(() => {
    if (tour && (window as any).addToCart) {
      // Check if tour is already in cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const isInCart = cart.find((item: any) => item.id === tour.id);
      
      if (!isInCart) {
        (window as any).addToCart(tour);
        console.log('Tour added to cart:', tour.title);
      }
    }
  }, [tour]);

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

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submitted', guestData);
    
    if (!guestData.fullName || !guestData.email || !guestData.phoneNumber) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Calling onProceedToPayment');
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
    { name: 'Afghanistan', code: '+93' },
    { name: 'Albania', code: '+355' },
    { name: 'Algeria', code: '+213' },
    { name: 'American Samoa', code: '+1' },
    { name: 'Andorra', code: '+376' },
    { name: 'Angola', code: '+244' },
    { name: 'Anguilla', code: '+1' },
    { name: 'Antigua and Barbuda', code: '+1' },
    { name: 'Argentina', code: '+54' },
    { name: 'Armenia', code: '+374' },
    { name: 'Aruba', code: '+297' },
    { name: 'Austria', code: '+43' },
    { name: 'Azerbaijan', code: '+994' },
    { name: 'Bahamas', code: '+1' },
    { name: 'Bahrain', code: '+973' },
    { name: 'Bangladesh', code: '+880' },
    { name: 'Barbados', code: '+1' },
    { name: 'Belarus', code: '+375' },
    { name: 'Belgium', code: '+32' },
    { name: 'Belize', code: '+501' },
    { name: 'Benin', code: '+229' },
    { name: 'Bermuda', code: '+1' },
    { name: 'Bhutan', code: '+975' },
    { name: 'Bolivia', code: '+591' },
    { name: 'Bosnia and Herzegovina', code: '+387' },
    { name: 'Botswana', code: '+267' },
    { name: 'Brazil', code: '+55' },
    { name: 'British Virgin Islands', code: '+1' },
    { name: 'Brunei', code: '+673' },
    { name: 'Bulgaria', code: '+359' },
    { name: 'Burkina Faso', code: '+226' },
    { name: 'Burundi', code: '+257' },
    { name: 'Cambodia', code: '+855' },
    { name: 'Cameroon', code: '+237' },
    { name: 'Cape Verde', code: '+238' },
    { name: 'Cayman Islands', code: '+1' },
    { name: 'Central African Republic', code: '+236' },
    { name: 'Chad', code: '+235' },
    { name: 'Chile', code: '+56' },
    { name: 'China', code: '+86' },
    { name: 'Colombia', code: '+57' },
    { name: 'Comoros', code: '+269' },
    { name: 'Congo', code: '+242' },
    { name: 'Cook Islands', code: '+682' },
    { name: 'Costa Rica', code: '+506' },
    { name: 'Croatia', code: '+385' },
    { name: 'Cuba', code: '+53' },
    { name: 'Cyprus', code: '+357' },
    { name: 'Czech Republic', code: '+420' },
    { name: 'Denmark', code: '+45' },
    { name: 'Djibouti', code: '+253' },
    { name: 'Dominica', code: '+1' },
    { name: 'Dominican Republic', code: '+1' },
    { name: 'Ecuador', code: '+593' },
    { name: 'Egypt', code: '+20' },
    { name: 'El Salvador', code: '+503' },
    { name: 'Equatorial Guinea', code: '+240' },
    { name: 'Eritrea', code: '+291' },
    { name: 'Estonia', code: '+372' },
    { name: 'Eswatini', code: '+268' },
    { name: 'Ethiopia', code: '+251' },
    { name: 'Falkland Islands', code: '+500' },
    { name: 'Faroe Islands', code: '+298' },
    { name: 'Fiji', code: '+679' },
    { name: 'Finland', code: '+358' },
    { name: 'French Guiana', code: '+594' },
    { name: 'French Polynesia', code: '+689' },
    { name: 'Gabon', code: '+241' },
    { name: 'Gambia', code: '+220' },
    { name: 'Georgia', code: '+995' },
    { name: 'Ghana', code: '+233' },
    { name: 'Gibraltar', code: '+350' },
    { name: 'Greece', code: '+30' },
    { name: 'Greenland', code: '+299' },
    { name: 'Grenada', code: '+1' },
    { name: 'Guadeloupe', code: '+590' },
    { name: 'Guam', code: '+1' },
    { name: 'Guatemala', code: '+502' },
    { name: 'Guinea', code: '+224' },
    { name: 'Guinea-Bissau', code: '+245' },
    { name: 'Guyana', code: '+592' },
    { name: 'Haiti', code: '+509' },
    { name: 'Honduras', code: '+504' },
    { name: 'Hong Kong', code: '+852' },
    { name: 'Hungary', code: '+36' },
    { name: 'Iceland', code: '+354' },
    { name: 'Indonesia', code: '+62' },
    { name: 'Iran', code: '+98' },
    { name: 'Iraq', code: '+964' },
    { name: 'Ireland', code: '+353' },
    { name: 'Israel', code: '+972' },
    { name: 'Italy', code: '+39' },
    { name: 'Ivory Coast', code: '+225' },
    { name: 'Jamaica', code: '+1' },
    { name: 'Jordan', code: '+962' },
    { name: 'Kazakhstan', code: '+7' },
    { name: 'Kenya', code: '+254' },
    { name: 'Kiribati', code: '+686' },
    { name: 'Kosovo', code: '+383' },
    { name: 'Kuwait', code: '+965' },
    { name: 'Kyrgyzstan', code: '+996' },
    { name: 'Laos', code: '+856' },
    { name: 'Latvia', code: '+371' },
    { name: 'Lebanon', code: '+961' },
    { name: 'Lesotho', code: '+266' },
    { name: 'Liberia', code: '+231' },
    { name: 'Libya', code: '+218' },
    { name: 'Liechtenstein', code: '+423' },
    { name: 'Lithuania', code: '+370' },
    { name: 'Luxembourg', code: '+352' },
    { name: 'Macau', code: '+853' },
    { name: 'Madagascar', code: '+261' },
    { name: 'Malawi', code: '+265' },
    { name: 'Malaysia', code: '+60' },
    { name: 'Maldives', code: '+960' },
    { name: 'Mali', code: '+223' },
    { name: 'Malta', code: '+356' },
    { name: 'Marshall Islands', code: '+692' },
    { name: 'Martinique', code: '+596' },
    { name: 'Mauritania', code: '+222' },
    { name: 'Mauritius', code: '+230' },
    { name: 'Mayotte', code: '+262' },
    { name: 'Mexico', code: '+52' },
    { name: 'Micronesia', code: '+691' },
    { name: 'Moldova', code: '+373' },
    { name: 'Monaco', code: '+377' },
    { name: 'Mongolia', code: '+976' },
    { name: 'Montenegro', code: '+382' },
    { name: 'Montserrat', code: '+1' },
    { name: 'Morocco', code: '+212' },
    { name: 'Mozambique', code: '+258' },
    { name: 'Myanmar', code: '+95' },
    { name: 'Namibia', code: '+264' },
    { name: 'Nauru', code: '+674' },
    { name: 'Nepal', code: '+977' },
    { name: 'Netherlands', code: '+31' },
    { name: 'New Caledonia', code: '+687' },
    { name: 'New Zealand', code: '+64' },
    { name: 'Nicaragua', code: '+505' },
    { name: 'Niger', code: '+227' },
    { name: 'Nigeria', code: '+234' },
    { name: 'Niue', code: '+683' },
    { name: 'North Korea', code: '+850' },
    { name: 'North Macedonia', code: '+389' },
    { name: 'Northern Mariana Islands', code: '+1' },
    { name: 'Norway', code: '+47' },
    { name: 'Oman', code: '+968' },
    { name: 'Pakistan', code: '+92' },
    { name: 'Palau', code: '+680' },
    { name: 'Palestine', code: '+970' },
    { name: 'Panama', code: '+507' },
    { name: 'Papua New Guinea', code: '+675' },
    { name: 'Paraguay', code: '+595' },
    { name: 'Peru', code: '+51' },
    { name: 'Philippines', code: '+63' },
    { name: 'Poland', code: '+48' },
    { name: 'Portugal', code: '+351' },
    { name: 'Puerto Rico', code: '+1' },
    { name: 'Qatar', code: '+974' },
    { name: 'Réunion', code: '+262' },
    { name: 'Romania', code: '+40' },
    { name: 'Russia', code: '+7' },
    { name: 'Rwanda', code: '+250' },
    { name: 'Saint Kitts and Nevis', code: '+1' },
    { name: 'Saint Lucia', code: '+1' },
    { name: 'Saint Vincent and the Grenadines', code: '+1' },
    { name: 'Samoa', code: '+685' },
    { name: 'San Marino', code: '+378' },
    { name: 'São Tomé and Príncipe', code: '+239' },
    { name: 'Saudi Arabia', code: '+966' },
    { name: 'Senegal', code: '+221' },
    { name: 'Serbia', code: '+381' },
    { name: 'Seychelles', code: '+248' },
    { name: 'Sierra Leone', code: '+232' },
    { name: 'Slovakia', code: '+421' },
    { name: 'Slovenia', code: '+386' },
    { name: 'Solomon Islands', code: '+677' },
    { name: 'Somalia', code: '+252' },
    { name: 'South Africa', code: '+27' },
    { name: 'South Korea', code: '+82' },
    { name: 'South Sudan', code: '+211' },
    { name: 'Spain', code: '+34' },
    { name: 'Sri Lanka', code: '+94' },
    { name: 'Sudan', code: '+249' },
    { name: 'Suriname', code: '+597' },
    { name: 'Sweden', code: '+46' },
    { name: 'Switzerland', code: '+41' },
    { name: 'Syria', code: '+963' },
    { name: 'Taiwan', code: '+886' },
    { name: 'Tajikistan', code: '+992' },
    { name: 'Tanzania', code: '+255' },
    { name: 'Thailand', code: '+66' },
    { name: 'Timor-Leste', code: '+670' },
    { name: 'Togo', code: '+228' },
    { name: 'Tonga', code: '+676' },
    { name: 'Trinidad and Tobago', code: '+1' },
    { name: 'Tunisia', code: '+216' },
    { name: 'Turkey', code: '+90' },
    { name: 'Turkmenistan', code: '+993' },
    { name: 'Turks and Caicos Islands', code: '+1' },
    { name: 'Tuvalu', code: '+688' },
    { name: 'Uganda', code: '+256' },
    { name: 'Ukraine', code: '+380' },
    { name: 'Uruguay', code: '+598' },
    { name: 'Uzbekistan', code: '+998' },
    { name: 'Vanuatu', code: '+678' },
    { name: 'Vatican City', code: '+39' },
    { name: 'Venezuela', code: '+58' },
    { name: 'Vietnam', code: '+84' },
    { name: 'Virgin Islands (US)', code: '+1' },
    { name: 'Yemen', code: '+967' },
    { name: 'Zambia', code: '+260' },
    { name: 'Zimbabwe', code: '+263' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto mx-4 relative z-50" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Timer */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-6 flex items-center gap-2">
          <Clock className="text-green-600" size={20} />
          <span className="text-sm font-semibold text-gray-700">
            Your spot is reserved for {formatTime(timeLeft)} minutes. Complete payment to confirm your booking.
          </span>
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
              {countries.map((country, index) => (
                <option key={`${country.name}-${index}`} value={`${country.name}|${country.code}`}>
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

          <div>
            <label className="block text-sm font-black text-[#001A33] mb-2">Special Requests (Optional)</label>
            <textarea
              value={guestData.specialRequests}
              onChange={(e) => setGuestData({ ...guestData, specialRequests: e.target.value })}
              placeholder="Any special requests or dietary requirements..."
              rows={4}
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm font-semibold focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Button clicked', { guestData });
            }}
            className="w-full bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white font-black py-4 rounded-xl text-base transition-colors shadow-lg cursor-pointer pointer-events-auto relative"
          >
            Proceed to Secure Payment
          </button>
        </form>

        {/* Booking Benefits */}
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-[#10B981] mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-black text-[#001A33]">Instant Confirmation</p>
              <p className="text-xs text-gray-600 font-semibold">Receive booking confirmation immediately after payment</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="text-[#10B981] mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-black text-[#001A33]">Free cancellation</p>
              <p className="text-xs text-gray-600 font-semibold">
                {cancellationDate 
                  ? `Cancel free until ${cancellationDate}`
                  : 'Cancel free until 8:00 AM on March 18'
                }
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="text-[#10B981] mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-black text-[#001A33]">Secure Payment</p>
              <p className="text-xs text-gray-600 font-semibold">Protected by Razorpay - Industry-leading security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
