import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Upload, ArrowUp, ArrowDown, Trash2, CheckCircle2, AlertCircle, Phone, Mail } from 'lucide-react';

interface TourCreationFormProps {
  supplierId: string;
  supplierEmail?: string;
  supplierPhone?: string;
  supplierWhatsApp?: string;
  onClose: () => void;
  onSuccess: () => void;
  onProfileRequired?: () => void;
}

// Countries and their major tourist cities
const COUNTRIES = [
  { name: 'India', code: 'IN' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Japan', code: 'JP' },
  { name: 'Singapore', code: 'SG' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Philippines', code: 'PH' },
  { name: 'China', code: 'CN' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Hong Kong', code: 'HK' },
  { name: 'Sri Lanka', code: 'LK' },
  { name: 'Nepal', code: 'NP' },
  { name: 'Cambodia', code: 'KH' },
  { name: 'Myanmar', code: 'MM' },
  { name: 'Laos', code: 'LA' },
  { name: 'Bangladesh', code: 'BD' }
];

// Major tourist cities per country (Top 10 for India, top cities for others)
const COUNTRY_CITIES: Record<string, string[]> = {
  'India': [
    'Delhi',
    'Mumbai',
    'Agra',
    'Jaipur',
    'Goa',
    'Kerala',
    'Varanasi',
    'Udaipur',
    'Rishikesh',
    'Darjeeling'
  ],
  'Thailand': [
    'Bangkok',
    'Chiang Mai',
    'Phuket',
    'Pattaya',
    'Krabi',
    'Ayutthaya',
    'Sukhothai',
    'Hua Hin'
  ],
  'Japan': [
    'Tokyo',
    'Kyoto',
    'Osaka',
    'Hiroshima',
    'Nara',
    'Sapporo',
    'Yokohama',
    'Fukuoka'
  ],
  'Singapore': [
    'Singapore'
  ],
  'Indonesia': [
    'Bali',
    'Jakarta',
    'Yogyakarta',
    'Bandung',
    'Lombok',
    'Surabaya'
  ],
  'Malaysia': [
    'Kuala Lumpur',
    'Penang',
    'Malacca',
    'Langkawi',
    'Cameron Highlands',
    'Kota Kinabalu'
  ],
  'Vietnam': [
    'Hanoi',
    'Ho Chi Minh City',
    'Hoi An',
    'Hue',
    'Da Nang',
    'Nha Trang',
    'Sapa'
  ],
  'South Korea': [
    'Seoul',
    'Busan',
    'Jeju',
    'Gyeongju',
    'Incheon',
    'Daegu'
  ],
  'Philippines': [
    'Manila',
    'Cebu',
    'Boracay',
    'Palawan',
    'Davao',
    'Baguio'
  ],
  'China': [
    'Beijing',
    'Shanghai',
    'Guilin',
    'Xi\'an',
    'Chengdu',
    'Hangzhou',
    'Suzhou'
  ],
  'Taiwan': [
    'Taipei',
    'Kaohsiung',
    'Taichung',
    'Tainan',
    'Hualien'
  ],
  'Hong Kong': [
    'Hong Kong'
  ],
  'Sri Lanka': [
    'Colombo',
    'Kandy',
    'Galle',
    'Sigiriya',
    'Anuradhapura',
    'Ella'
  ],
  'Nepal': [
    'Kathmandu',
    'Pokhara',
    'Chitwan',
    'Lumbini',
    'Nagarkot'
  ],
  'Cambodia': [
    'Siem Reap',
    'Phnom Penh',
    'Battambang',
    'Kampot',
    'Kep'
  ],
  'Myanmar': [
    'Yangon',
    'Bagan',
    'Mandalay',
    'Inle Lake',
    'Mawlamyine'
  ],
  'Laos': [
    'Vientiane',
    'Luang Prabang',
    'Vang Vieng',
    'Pakse',
    'Phonsavan'
  ],
  'Bangladesh': [
    'Dhaka',
    'Chittagong',
    'Cox\'s Bazar',
    'Sylhet',
    'Rajshahi'
  ]
};

// Predefined locations per city (expanded for major cities)
const CITY_LOCATIONS: Record<string, string[]> = {
  // India
  'Delhi': [
    'India Gate', 'Jama Masjid', 'Qutb Minar', 'Red Fort', "Humayun's Tomb",
    'Lotus Temple', 'Chandni Chowk', 'Connaught Place', 'Rashtrapati Bhavan', 'Old Delhi'
  ],
  'Mumbai': [
    'Gateway of India', 'Marine Drive', 'Elephanta Caves', 'Chhatrapati Shivaji Terminus',
    'Haji Ali Dargah', 'Juhu Beach', 'Colaba Causeway', 'Bandra-Worli Sea Link'
  ],
  'Agra': [
    'Taj Mahal', 'Agra Fort', 'Baby Taj', 'Mehtab Bagh', 'Fatehpur Sikri',
    'Tomb of Akbar the Great', 'Itmad-ud-Daulah', 'Jama Masjid'
  ],
  'Jaipur': [
    'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Amber Fort', 'Jal Mahal',
    'Nahargarh Fort', 'Albert Hall Museum', 'Bapu Bazaar'
  ],
  'Goa': [
    'Calangute Beach', 'Baga Beach', 'Anjuna Beach', 'Dudhsagar Falls',
    'Basilica of Bom Jesus', 'Fort Aguada', 'Spice Plantations'
  ],
  'Kerala': [
    'Backwaters', 'Munnar', 'Alleppey', 'Kochi', 'Wayanad',
    'Thekkady', 'Kovalam Beach', 'Varkala'
  ],
  'Varanasi': [
    'Ganges River', 'Kashi Vishwanath Temple', 'Sarnath', 'Dashashwamedh Ghat',
    'Manikarnika Ghat', 'Assi Ghat', 'Banaras Hindu University'
  ],
  'Udaipur': [
    'City Palace', 'Lake Pichola', 'Jag Mandir', 'Jagdish Temple',
    'Monsoon Palace', 'Fateh Sagar Lake', 'Saheliyon Ki Bari'
  ],
  'Rishikesh': [
    'Laxman Jhula', 'Ram Jhula', 'Triveni Ghat', 'Neelkanth Mahadev Temple',
    'Beatles Ashram', 'Ganga Aarti', 'Adventure Activities'
  ],
  'Darjeeling': [
    'Tiger Hill', 'Darjeeling Himalayan Railway', 'Batasia Loop', 'Peace Pagoda',
    'Tea Gardens', 'Observatory Hill', 'Padmaja Naidu Himalayan Zoological Park'
  ],
  // Add more cities as needed - keeping existing ones for now
};

const DURATION_OPTIONS = [
  '2 hours',
  '3 hours',
  '4 hours',
  '6 hours',
  '8 hours',
  'Full day',
  'Flexible'
];

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Korean'];

const TourCreationForm: React.FC<TourCreationFormProps> = ({ 
  supplierId, 
  supplierEmail,
  supplierPhone,
  supplierWhatsApp,
  onClose, 
  onSuccess,
  onProfileRequired
}) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    country: '',
    city: '',
    category: '',
    title: '',
    locations: [] as string[],
    duration: '',
    pricePerPerson: '',
    currency: 'INR',
    shortDescription: '',
    fullDescription: '',
    highlights: ['', '', ''] as string[], // 3-5 highlights, each max 80 chars
    included: '',
    notIncluded: '',
    meetingPoint: '',
    guideType: '',
    images: [] as string[],
    languages: [] as string[]
  });

  const totalSteps = 7; // Added country step

  // Check if supplier has required contact information
  const hasRequiredContactInfo = !!(supplierEmail && (supplierPhone || supplierWhatsApp));

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationToggle = (location: string) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      // Validate file
      if (file.size > 7 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 7MB.`);
        return;
      }

      // Accept WebP, AVIF, SVG, and traditional formats
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/avif',
        'image/svg+xml'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a valid image format. Please use JPG, PNG, GIF, WebP, AVIF, or SVG.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...formData.images];
    if (direction === 'up' && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
    } else if (direction === 'down' && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    }
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.country !== '';
      case 2:
        return formData.city && formData.category;
      case 3:
        return formData.title && formData.locations.length > 0;
      case 4:
        return formData.duration && formData.pricePerPerson;
      case 5:
        return formData.fullDescription && formData.included && formData.highlights.filter(h => h.trim()).length >= 3;
      case 6:
        return formData.images.length >= 4 && formData.languages.length > 0;
      default:
        return true;
    }
  };

  const handleSubmit = async (submitForReview: boolean = false) => {
    // Check if supplier has required contact information
    if (!supplierEmail || (!supplierPhone && !supplierWhatsApp)) {
      const missing = [];
      if (!supplierEmail) missing.push('Email address');
      if (!supplierPhone && !supplierWhatsApp) missing.push('Phone number or WhatsApp number');
      
      alert(`❌ Cannot create tour!\n\nYou must have the following in your profile:\n${missing.join('\n')}\n\nThis information will be shared with customers when they book your tours.\n\nPlease go to your Profile tab and add this information first.`);
      
      if (onProfileRequired) {
        onProfileRequired();
      }
      return;
    }

    if (!canProceed()) {
      alert('Please complete all required fields before submitting.');
      return;
    }

    // Additional validation before sending to server
    const missingFields: string[] = [];
    if (!supplierId) missingFields.push('supplierId');
    if (!formData.title || formData.title.trim() === '') missingFields.push('title');
    if (!formData.country || formData.country.trim() === '') missingFields.push('country');
    if (!formData.city || formData.city.trim() === '') missingFields.push('city');
    if (!formData.category || formData.category.trim() === '') missingFields.push('category');
    if (!formData.fullDescription || formData.fullDescription.trim() === '') missingFields.push('fullDescription');
    if (!formData.included || formData.included.trim() === '') missingFields.push('included');
    if (!formData.images || formData.images.length < 4) missingFields.push('images (need at least 4)');
    if (!formData.locations || formData.locations.length === 0) missingFields.push('locations');
    if (!formData.duration || formData.duration.trim() === '') missingFields.push('duration');
    if (!formData.pricePerPerson || formData.pricePerPerson.trim() === '') missingFields.push('pricePerPerson');
    if (!formData.languages || formData.languages.length === 0) missingFields.push('languages');
    if (!formData.highlights || formData.highlights.filter(h => h.trim()).length < 3) missingFields.push('highlights (need at least 3)');

    if (missingFields.length > 0) {
      alert(`Missing required fields:\n${missingFields.join('\n')}\n\nPlease complete all fields before submitting.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const tourData = {
        supplierId,
        title: formData.title.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        category: formData.category.trim(),
        locations: JSON.stringify(formData.locations),
        duration: formData.duration.trim(),
        pricePerPerson: parseFloat(formData.pricePerPerson),
        currency: formData.currency,
        shortDescription: formData.shortDescription?.trim() || null,
        fullDescription: formData.fullDescription.trim(),
        highlights: JSON.stringify(formData.highlights.filter(h => h.trim())),
        included: formData.included.trim(),
        notIncluded: formData.notIncluded?.trim() || null,
        meetingPoint: formData.meetingPoint?.trim() || null,
        guideType: formData.guideType?.trim() || null,
        images: JSON.stringify(formData.images),
        languages: JSON.stringify(formData.languages)
      };

      // Debug: Log what we're sending
      console.log('📤 Sending tour data:', {
        supplierId,
        title: formData.title,
        country: formData.country,
        city: formData.city,
        category: formData.category,
        locationsCount: formData.locations.length,
        imagesCount: formData.images.length,
        languagesCount: formData.languages.length,
        hasFullDescription: !!formData.fullDescription,
        hasIncluded: !!formData.included,
        highlightsCount: formData.highlights.filter(h => h.trim()).length
      });

      const response = await fetch('http://localhost:3001/api/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tourData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error occurred' }));
        // Debug: Log the error response
        console.error('❌ Server error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        // Use server's error message directly
        throw new Error(errorData.message || errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        if (submitForReview) {
          // Submit for review
          const submitResponse = await fetch(`http://localhost:3001/api/tours/${data.tour.id}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });

          if (!submitResponse.ok) {
            const submitErrorData = await submitResponse.json().catch(() => ({ message: 'Failed to submit tour' }));
            throw new Error(submitErrorData.message || submitErrorData.error || 'Failed to submit tour for review');
          }

          const submitData = await submitResponse.json();
          if (submitData.success) {
            alert('Tour submitted for review! We\'ll review it within 24-48 hours.');
            onSuccess();
            onClose();
          } else {
            throw new Error(submitData.message || submitData.error || 'Failed to submit tour for review');
          }
        } else {
          alert('Tour saved as draft!');
          onSuccess();
          onClose();
        }
      } else {
        // Use server's error message directly, don't add prefix
        throw new Error(data.message || data.error || 'Failed to create tour');
      }
    } catch (error: any) {
      console.error('Tour creation error:', error);
      
      // Use the error message directly from the server or provide a clear default
      let errorMessage: string;
      
      if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to server. Please make sure the server is running on http://localhost:3001';
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.message) {
        // Use server's error message as-is (it already has proper formatting)
        errorMessage = error.message;
      } else {
        errorMessage = 'Failed to create tour. Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#001A33]">Create a new tour</h1>
            <p className="text-[14px] text-gray-500 font-semibold mt-1">
              Step {step} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-[#10B981] transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      {/* Contact Info Warning Banner */}
      {!hasRequiredContactInfo && (
        <div className="bg-yellow-50 border-b-2 border-yellow-400">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-600 shrink-0 mt-1" size={24} />
              <div className="flex-1">
                <h3 className="font-black text-[#001A33] text-[16px] mb-2">
                  ⚠️ Contact Information Required
                </h3>
                <p className="text-[14px] text-gray-700 font-semibold mb-3">
                  You cannot create a tour without adding your contact information to your profile. This information will be shared with customers when they book your tours.
                </p>
                <div className="bg-white rounded-xl p-4 mb-3 border border-yellow-200">
                  <p className="text-[14px] font-bold text-[#001A33] mb-2">Missing:</p>
                  <ul className="list-disc list-inside space-y-1 text-[14px] text-gray-700 font-semibold">
                    {missingContactInfo.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-gray-600 font-semibold">
                  <Mail size={16} />
                  <span>Your email: {supplierEmail || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2 text-[14px] text-gray-600 font-semibold mt-1">
                  <Phone size={16} />
                  <span>Your phone/WhatsApp: {supplierPhone || supplierWhatsApp || 'Not set'}</span>
                </div>
                {onProfileRequired && (
                  <button
                    onClick={() => {
                      onProfileRequired();
                    }}
                    className="mt-4 bg-[#10B981] hover:bg-[#059669] text-white font-black py-3 px-6 rounded-xl text-[14px] transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    Go to Profile & Add Contact Information
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Info Notice (when info is present) */}
      {hasRequiredContactInfo && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-4xl mx-auto px-6 py-3">
            <div className="flex items-center gap-2 text-[14px] text-blue-800 font-semibold">
              <CheckCircle2 size={16} />
              <span>Your contact information (email and phone/WhatsApp) will be shared with customers when they book this tour.</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step 1: Country */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-black text-[#001A33] mb-6">Select Country</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Which country will you provide services in? *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => {
                    handleInputChange('country', e.target.value);
                    handleInputChange('city', ''); // Reset city when country changes
                  }}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map(country => (
                    <option key={country.code} value={country.name}>{country.name}</option>
                  ))}
                </select>
                <p className="text-[12px] text-gray-500 font-semibold mt-2">
                  Select the country where you'll offer your tours and activities
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Category & City */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-black text-[#001A33] mb-6">Choose Category & City</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  What type of tour are you creating? *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('category', 'Entry Ticket')}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      formData.category === 'Entry Ticket'
                        ? 'border-[#10B981] bg-[#10B981]/5'
                        : 'border-gray-200 hover:border-[#10B981]/50'
                    }`}
                  >
                    <div className="font-black text-[#001A33] text-[16px] mb-2">Entry Ticket</div>
                    <div className="text-[13px] text-gray-600 font-semibold">
                      Tickets for attractions, monuments, museums
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('category', 'Guided Tour')}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      formData.category === 'Guided Tour'
                        ? 'border-[#10B981] bg-[#10B981]/5'
                        : 'border-gray-200 hover:border-[#10B981]/50'
                    }`}
                  >
                    <div className="font-black text-[#001A33] text-[16px] mb-2">Guided Tour</div>
                    <div className="text-[13px] text-gray-600 font-semibold">
                      Guided walking tours, day trips with a guide
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Select City * 
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!formData.country}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{formData.country ? 'Select City' : 'Select country first'}</option>
                  {formData.country && COUNTRY_CITIES[formData.country]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {formData.country && (
                  <p className="text-[12px] text-gray-500 font-semibold mt-2">
                    {COUNTRY_CITIES[formData.country]?.length || 0} cities available in {formData.country}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Title & Locations */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-black text-[#001A33] mb-6">Tour Title & Locations</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Tour Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Taj Mahal Sunrise Tour with Local Guide"
                  maxLength={100}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                />
                <p className="text-[12px] text-gray-500 font-semibold mt-2">
                  {formData.title.length} / 100 characters
                </p>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Select Locations/Attractions * (Select all that apply)
                </label>
                {formData.city && CITY_LOCATIONS[formData.city] ? (
                  <>
                    <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-2xl">
                      {CITY_LOCATIONS[formData.city].map((location) => (
                        <label
                          key={location}
                          className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.locations.includes(location)}
                            onChange={() => handleLocationToggle(location)}
                            className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                          />
                          <span className="text-[14px] font-semibold text-[#001A33]">{location}</span>
                        </label>
                      ))}
                    </div>
                    {formData.locations.length > 0 && (
                      <p className="text-[12px] text-[#10B981] font-bold mt-2">
                        {formData.locations.length} location(s) selected
                      </p>
                    )}
                  </>
                ) : (
                  <div className="p-8 bg-gray-50 rounded-2xl text-center">
                    <p className="text-[14px] text-gray-500 font-semibold">
                      Location list for {formData.city} will be available soon.
                    </p>
                    <p className="text-[12px] text-gray-400 font-semibold mt-2">
                      You can still create the tour, but location selection is not available for this city yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Duration & Price */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-black text-[#001A33] mb-6">Duration & Pricing</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Duration *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                >
                  <option value="">Select Duration</option>
                  {DURATION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                    Price per person (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.pricePerPerson}
                    onChange={(e) => handleInputChange('pricePerPerson', e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              {formData.category === 'Guided Tour' && (
                <div>
                  <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                    Guide Type
                  </label>
                  <select
                    value={formData.guideType}
                    onChange={(e) => handleInputChange('guideType', e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                  >
                    <option value="">Select Guide Type</option>
                    <option value="Tour Guide">Tour Guide</option>
                    <option value="Host/Greeter">Host/Greeter</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Description */}
        {step === 5 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-black text-[#001A33] mb-6">Description & Details</h2>
            
            <div className="space-y-6">
              {/* Highlights Section */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="block text-[14px] font-bold text-[#001A33]">
                    Highlights *
                  </label>
                  <span className="text-blue-500 cursor-help" title="Write 3-5 sentences explaining what makes your activity special">ⓘ</span>
                </div>
                <p className="text-[12px] text-gray-600 font-semibold mb-3">
                  Write 3-5 sentences explaining what makes your activity special and stand out from the competition. Customers will use these to compare between different activities.
                </p>
                
                {/* Requirement Banner */}
                {formData.highlights.filter(h => h.trim()).length < 3 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600">ⓘ</span>
                      <span className="text-[12px] font-bold text-blue-800">3 Highlights are required.</span>
                    </div>
                  </div>
                )}

                {/* Highlight Input Fields */}
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="mb-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => {
                          const newHighlights = [...formData.highlights];
                          newHighlights[index] = e.target.value;
                          handleInputChange('highlights', newHighlights);
                        }}
                        placeholder="Introduce your highlight here (e.g., Skip the long lines with priority access)"
                        maxLength={80}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-gray-500 font-semibold">
                        {highlight.length} / 80
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Another Highlight Button */}
                {formData.highlights.length < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newHighlights = [...formData.highlights, ''];
                      handleInputChange('highlights', newHighlights);
                    }}
                    className="flex items-center gap-2 text-[#10B981] text-[14px] font-bold hover:text-[#059669] transition-colors mt-2"
                  >
                    <span className="text-[18px]">+</span> Add another highlight
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Short Description (Optional)
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Give customers a taste of what they'll do in 2-3 sentences..."
                  maxLength={200}
                  rows={3}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none resize-none"
                />
                <p className="text-[12px] text-gray-500 font-semibold mt-2">
                  {formData.shortDescription.length} / 200 characters
                </p>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Full Description * (500-1000 words recommended)
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                  placeholder="Provide all the details about what customers will see and experience..."
                  rows={10}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none resize-none"
                />
                <p className="text-[12px] text-gray-500 font-semibold mt-2">
                  {formData.fullDescription.split(/\s+/).filter(Boolean).length} words
                </p>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  What's Included * (One item per line)
                </label>
                <textarea
                  value={formData.included}
                  onChange={(e) => handleInputChange('included', e.target.value)}
                  placeholder="• Entry ticket&#10;• Professional guide&#10;• Transportation"
                  rows={5}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  What's Not Included (Optional - One item per line)
                </label>
                <textarea
                  value={formData.notIncluded}
                  onChange={(e) => handleInputChange('notIncluded', e.target.value)}
                  placeholder="• Meals&#10;• Personal expenses"
                  rows={4}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Meeting Point (Optional)
                </label>
                <input
                  type="text"
                  value={formData.meetingPoint}
                  onChange={(e) => handleInputChange('meetingPoint', e.target.value)}
                  placeholder="e.g., Main entrance of Taj Mahal"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Images & Languages */}
        {step === 6 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-black text-[#001A33] mb-6">Photos & Languages</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Upload Photos * (Minimum 4, recommended 7+)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 md:p-8 text-center hover:border-[#10B981] transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/avif,image/svg+xml"
                    capture="environment"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-4 min-h-[200px] justify-center py-4"
                  >
                    <Upload className="text-[#10B981]" size={48} />
                    <div>
                      <div className="font-black text-[#001A33] text-[14px] md:text-[16px] mb-1">
                        Drag photos here or tap to upload
                      </div>
                      <div className="text-[11px] md:text-[12px] text-gray-500 font-semibold px-4">
                        JPG, PNG, GIF, WebP, AVIF, or SVG (Max 7MB each) • Landscape format recommended
                      </div>
                      <div className="text-[10px] md:text-[11px] text-[#10B981] font-semibold mt-2">
                        📱 Mobile: Tap to take photo or choose from gallery
                      </div>
                    </div>
                  </label>
                </div>

                {formData.images.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <div className="text-[14px] font-bold text-[#001A33]">
                      Uploaded Images ({formData.images.length} / 4 minimum)
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-[#10B981] text-white text-[10px] font-black px-2 py-1 rounded">
                              COVER
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                            {index > 0 && (
                              <button
                                onClick={() => moveImage(index, 'up')}
                                className="p-2 bg-white rounded-full hover:bg-gray-100"
                              >
                                <ArrowUp size={16} />
                              </button>
                            )}
                            {index < formData.images.length - 1 && (
                              <button
                                onClick={() => moveImage(index, 'down')}
                                className="p-2 bg-white rounded-full hover:bg-gray-100"
                              >
                                <ArrowDown size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => removeImage(index)}
                              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {formData.images.length < 4 && (
                      <p className="text-[12px] text-red-500 font-semibold">
                        ⚠️ At least 4 images are required
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Languages Offered * (Select all that apply)
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <label
                      key={lang}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.languages.includes(lang)}
                        onChange={() => handleLanguageToggle(lang)}
                        className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                      />
                      <span className="text-[14px] font-semibold text-[#001A33]">{lang}</span>
                    </label>
                  ))}
                </div>
                {formData.languages.length > 0 && (
                  <p className="text-[12px] text-[#10B981] font-bold mt-2">
                    {formData.languages.length} language(s) selected
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Review */}
        {step === 7 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-2xl font-black text-[#001A33] mb-8">Review & Submit</h2>
            
            <div className="space-y-6">
              {/* Tour Preview Card */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-6">
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">TITLE</div>
                  <div className="text-[20px] font-black text-[#001A33]">{formData.title}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">COUNTRY</div>
                    <div className="text-[16px] font-black text-[#001A33]">{formData.country}</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">CITY</div>
                    <div className="text-[16px] font-black text-[#001A33]">{formData.city}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">CATEGORY</div>
                  <div className="text-[16px] font-black text-[#001A33]">{formData.category}</div>
                </div>
                
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">LOCATIONS</div>
                  <div className="text-[16px] font-black text-[#001A33]">
                    {formData.locations.length > 0 ? formData.locations.join(', ') : 'No locations selected'}
                  </div>
                </div>
                
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">DURATION</div>
                  <div className="text-[16px] font-black text-[#001A33]">{formData.duration}</div>
                </div>
                
                {/* Highlights */}
                {formData.highlights.filter(h => h.trim()).length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">HIGHLIGHTS</div>
                    <ul className="space-y-2">
                      {formData.highlights.filter(h => h.trim()).map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[#10B981] font-black mt-1">•</span>
                          <span className="text-[16px] font-semibold text-[#001A33]">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Short Description */}
                {formData.shortDescription && (
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">SHORT DESCRIPTION</div>
                    <div className="text-[16px] font-black text-[#001A33] leading-relaxed">{formData.shortDescription}</div>
                  </div>
                )}
                
                {/* Full Description */}
                {formData.fullDescription && (
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">FULL DESCRIPTION</div>
                    <div className="text-[16px] font-black text-[#001A33] leading-relaxed whitespace-pre-line">{formData.fullDescription}</div>
                  </div>
                )}
                
                {/* Images Preview */}
                {formData.images.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">IMAGES</div>
                    <div className="text-[16px] font-black text-[#001A33] mb-3">{formData.images.length} photos</div>
                    <div className="grid grid-cols-4 gap-3">
                      {formData.images.slice(0, 8).map((image, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                          <img
                            src={image}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-[#10B981] text-white text-[10px] font-black px-2 py-0.5 rounded">
                              COVER
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {formData.images.length > 8 && (
                      <div className="text-[14px] text-gray-500 font-semibold mt-2">
                        +{formData.images.length - 8} more images
                      </div>
                    )}
                  </div>
                )}
                
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">LANGUAGES</div>
                  <div className="text-[16px] font-black text-[#001A33]">
                    {formData.languages.length > 0 ? formData.languages.join(', ') : 'No languages selected'}
                  </div>
                </div>
                
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">PRICE</div>
                  <div className="text-[16px] font-black text-[#001A33]">
                    {formData.currency === 'INR' ? '₹' : '$'}{formData.pricePerPerson} per person
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-yellow-700" size={20} />
                  </div>
                  <div>
                    <div className="font-black text-[#001A33] text-[16px] mb-2">Ready to submit?</div>
                    <div className="text-[14px] text-[#001A33] font-semibold leading-relaxed">
                      Once submitted, your listing will be reviewed within 24–48 hours. You can make edits later.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          {step === totalSteps ? (
            <>
              <button
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1 || isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 font-black rounded-full text-[14px] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={isSubmitting || !canProceed() || !hasRequiredContactInfo}
                  className="px-6 py-3 border-2 border-[#10B981] bg-white text-[#10B981] font-black rounded-full text-[14px] hover:bg-[#10B981]/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={isSubmitting || !canProceed() || !hasRequiredContactInfo}
                  className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-full text-[14px] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : (
                    <>
                      Submit for Review
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(prev => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 font-black rounded-full text-[14px] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={() => setStep(prev => Math.min(totalSteps, prev + 1))}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-full text-[14px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourCreationForm;

