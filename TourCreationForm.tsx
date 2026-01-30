import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Upload, ArrowUp, ArrowDown, Trash2, CheckCircle2, AlertCircle, Phone, Mail, Plus, MapPin } from 'lucide-react';
import { CITY_LOCATIONS, TRANSPORTATION_TYPES, ENTRY_TICKET_OPTIONS, EntryTicketOption } from './constants';

interface TourCreationFormProps {
  supplierId: string;
  supplierEmail?: string;
  supplierPhone?: string;
  supplierWhatsApp?: string;
  tour?: any; // Tour data when editing
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
    'Fukuoka',
    'Nagoya',
    'Okinawa'
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

// CITY_LOCATIONS is now imported from constants.tsx to keep it in sync with CityPage

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

const TOUR_TYPES = [
  'Guided Tour',
  'Private Tour',
  'Group Tour',
  'Walking Tour',
  'Day Trip',
  'Multi-Day Tour',
  'City Tour',
  'Cultural Tour',
  'Heritage Tour',
  'Food Tour',
  'Adventure Tour',
  'Nature Tour',
  'Safari / Wildlife Tour',
  'Beach / Island Tour',
  'Cruise / Boat Tour',
  'Train / Rail Tour',
  'Spiritual / Pilgrimage Tour',
  'Photography Tour',
  'Luxury Tour',
  'Custom / Tailor-Made Tour'
];

const TourCreationForm: React.FC<TourCreationFormProps> = ({ 
  supplierId, 
  supplierEmail,
  supplierPhone,
  supplierWhatsApp,
  tour,
  onClose, 
  onSuccess,
  onProfileRequired
}) => {
  // Validate required props
  if (!supplierId) {
    console.error('TourCreationForm: supplierId is required but not provided');
    alert('Error: Supplier information is missing. Please log in again.');
    if (onClose) onClose();
    return null;
  }

  // Get language preference from localStorage
  const language = (typeof window !== 'undefined' && localStorage.getItem('supplierLanguage')) === 'ja' ? 'ja' : 'en';

  const isEditing = !!tour;
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transportationSearch, setTransportationSearch] = useState('');
  const [showEnglishNotice, setShowEnglishNotice] = useState(() => {
    // Check if notice was previously dismissed
    if (typeof window !== 'undefined') {
      return localStorage.getItem('englishNoticeDismissed') !== 'true';
    }
    return true;
  });
  
  // Parse tour data for editing
  const parseTourData = (tour: any) => {
    if (!tour) return null;
    try {
      return {
        country: tour.country || '',
        city: tour.city || '',
        category: tour.category || '',
        title: tour.title || '',
        locations: Array.isArray(tour.locations) ? tour.locations : (typeof tour.locations === 'string' ? JSON.parse(tour.locations || '[]') : []),
        duration: tour.duration || '',
        pricePerPerson: tour.pricePerPerson?.toString() || '',
        pricingType: (tour.groupPrice && tour.maxGroupSize) ? 'per_group' as const : 'per_person' as const,
        maxGroupSize: tour.maxGroupSize || undefined,
        groupPrice: tour.groupPrice?.toString() || '',
        groupPricingTiers: tour.groupPricingTiers ? (typeof tour.groupPricingTiers === 'string' ? JSON.parse(tour.groupPricingTiers) : tour.groupPricingTiers) : [],
        currency: tour.currency || 'INR',
        shortDescription: tour.shortDescription || '',
        fullDescription: tour.fullDescription || '',
        highlights: Array.isArray(tour.highlights) ? tour.highlights : (typeof tour.highlights === 'string' ? JSON.parse(tour.highlights || '[]') : ['', '', '']),
        included: tour.included || '',
        notIncluded: tour.notIncluded || '',
        meetingPoint: tour.meetingPoint || '',
        images: Array.isArray(tour.images) ? tour.images : (typeof tour.images === 'string' ? JSON.parse(tour.images || '[]') : []),
        languages: Array.isArray(tour.languages) ? tour.languages : (typeof tour.languages === 'string' ? JSON.parse(tour.languages || '[]') : []),
        tourTypes: Array.isArray(tour.tourTypes) ? tour.tourTypes : (typeof tour.tourTypes === 'string' ? JSON.parse(tour.tourTypes || '[]') : []),
        locationEntryTickets: tour.locationEntryTickets ? (typeof tour.locationEntryTickets === 'string' ? JSON.parse(tour.locationEntryTickets) : tour.locationEntryTickets) : {},
        usesTransportation: tour.usesTransportation || false,
        transportationTypes: Array.isArray(tour.transportationTypes) ? tour.transportationTypes : (typeof tour.transportationTypes === 'string' ? JSON.parse(tour.transportationTypes || '[]') : []),
        multiCityTravel: tour.multiCityTravel || false,
        tourOptions: tour.options || []
      };
    } catch (e) {
      console.error('Error parsing tour data:', e);
      return null;
    }
  };
  
  // Form data
  const [formData, setFormData] = useState(() => {
    if (tour) {
      const parsed = parseTourData(tour);
      if (parsed) {
        // Ensure all locations have entry ticket options when editing
        const locationEntryTickets = { ...parsed.locationEntryTickets };
        parsed.locations.forEach((loc: string) => {
          if (!locationEntryTickets[loc]) {
            locationEntryTickets[loc] = 'paid_included'; // Default value
          }
        });
        return { ...parsed, locationEntryTickets };
      }
    }
    return {
      country: '',
      city: '',
      category: '',
      title: '',
      locations: [] as string[],
      locationEntryTickets: {} as Record<string, EntryTicketOption>, // Entry ticket option for each location
      duration: '',
      pricePerPerson: '',
      pricingType: 'per_person' as 'per_person' | 'per_group',
      maxGroupSize: undefined as number | undefined,
      groupPrice: '',
      groupPricingTiers: [] as Array<{ minPeople: number; maxPeople: number; price: string }>,
      currency: 'INR',
      shortDescription: '',
      fullDescription: '',
      highlights: ['', '', ''] as string[], // 3-5 highlights, each max 80 chars
      included: '',
      notIncluded: '',
      meetingPoint: '',
      images: [] as string[],
      languages: [] as string[],
      tourTypes: [] as string[],
      usesTransportation: false,
      transportationTypes: [] as string[],
      multiCityTravel: false,
      tourOptions: [] as Array<{
        optionTitle: string;
        optionDescription: string;
        durationHours: string;
        price: string;
        currency: string;
        language: string;
        pickupIncluded: boolean;
        carIncluded: boolean;
        entryTicketIncluded: boolean;
        guideIncluded: boolean;
        pricingType: 'per_person' | 'per_group';
        maxGroupSize?: number;
        groupPrice?: string;
        groupPricingTiers?: Array<{ minPeople: number; maxPeople: number; price: string }>;
      }>
    };
  });

  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);

  const totalSteps = 8; // Tour options step, removed mini tours step

  // Check if supplier has required contact information
  const hasRequiredContactInfo = !!(supplierEmail && (supplierPhone || supplierWhatsApp));

  // Auto-fix missing locationEntryTickets when on step 3 (fixes editing issues)
  useEffect(() => {
    if (step === 3 && formData.locations.length > 0) {
      const missingEntryTickets = formData.locations.filter(loc => !formData.locationEntryTickets[loc]);
      if (missingEntryTickets.length > 0) {
        setFormData(prev => {
          const newEntryTickets = { ...prev.locationEntryTickets };
          missingEntryTickets.forEach(loc => {
            newEntryTickets[loc] = 'paid_included';
          });
          return { ...prev, locationEntryTickets: newEntryTickets };
        });
      }
    }
  }, [step, formData.locations.length]); // Only run when step changes or locations change

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationToggle = (location: string) => {
    setFormData(prev => {
      const isRemoving = prev.locations.includes(location);
      const newLocations = isRemoving
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location];
      
      // Remove entry ticket option if location is being removed
      const newEntryTickets = { ...prev.locationEntryTickets };
      if (isRemoving) {
        delete newEntryTickets[location];
      } else {
        // Set default entry ticket option when adding a location
        newEntryTickets[location] = 'paid_included';
      }
      
      return {
        ...prev,
        locations: newLocations,
        locationEntryTickets: newEntryTickets
      };
    });
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleTourTypeToggle = (tourType: string) => {
    setFormData(prev => ({
      ...prev,
      tourTypes: prev.tourTypes.includes(tourType)
        ? prev.tourTypes.filter(t => t !== tourType)
        : [...prev.tourTypes, tourType]
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
        // Check that title exists, locations are selected, and entry ticket options are set for all locations
        if (!formData.title || formData.title.trim() === '') return false;
        if (formData.locations.length === 0) return false;
        // Check that all locations have entry ticket options set
        const hasAllEntryTickets = formData.locations.every(loc => formData.locationEntryTickets[loc]);
        return hasAllEntryTickets;
      case 4:
        if (!formData.duration) return false;
        if (formData.pricingType === 'per_person') {
          return !!formData.pricePerPerson;
        } else {
          // For group pricing, check that maxGroupSize is set and all tiers have prices
          if (!formData.maxGroupSize || formData.maxGroupSize < 1 || formData.maxGroupSize > 20) return false;
          if (!formData.groupPricingTiers || formData.groupPricingTiers.length === 0) return false;
          return formData.groupPricingTiers.every(tier => tier.price && tier.price.trim() !== '' && !isNaN(parseFloat(tier.price)));
        }
      case 5:
        return formData.tourOptions.length > 0 && formData.tourOptions.every(opt => {
          const hasBasicFields = opt.optionTitle.trim() && opt.optionDescription.trim() && opt.durationHours;
          if (opt.pricingType === 'per_person') {
            return hasBasicFields && opt.price;
          } else {
            // For group pricing, check that maxGroupSize is set and all tiers have prices
            if (!hasBasicFields) return false;
            if (!opt.maxGroupSize || opt.maxGroupSize < 1 || opt.maxGroupSize > 20) return false;
            if (!opt.groupPricingTiers || opt.groupPricingTiers.length === 0) return false;
            return opt.groupPricingTiers.every(tier => tier.price && tier.price.trim() !== '' && !isNaN(parseFloat(tier.price)));
          }
        });
      case 6:
        return formData.fullDescription && formData.included && formData.highlights.filter(h => h.trim()).length >= 3;
      case 7:
        return formData.images.length >= 4 && formData.languages.length > 0;
      case 8:
        return true; // Mini tours selection is optional
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
    // Check pricing - intelligently detect if group pricing or per person pricing is configured
    const hasGroupPricingTiers = formData.groupPricingTiers && formData.groupPricingTiers.length > 0;
    const hasLegacyGroupPricing = formData.groupPrice && formData.maxGroupSize;
    const hasPerPersonPricing = formData.pricePerPerson && formData.pricePerPerson.trim() !== '';
    
    // Determine pricing type based on what's actually configured
    const isGroupPricing = hasGroupPricingTiers || hasLegacyGroupPricing || formData.pricingType === 'per_group';
    
    if (isGroupPricing) {
      if (!formData.maxGroupSize || formData.maxGroupSize < 1 || formData.maxGroupSize > 20) {
        missingFields.push('maxGroupSize (1-20)');
      }
      if (!hasGroupPricingTiers && !hasLegacyGroupPricing) {
        missingFields.push('group pricing tiers or group price');
      } else if (hasGroupPricingTiers) {
        const missingPrices = formData.groupPricingTiers.filter(tier => !tier.price || tier.price.trim() === '').length;
        if (missingPrices > 0) {
          missingFields.push(`group pricing (${missingPrices} tier${missingPrices > 1 ? 's' : ''} missing prices)`);
        }
      }
    } else {
      if (!hasPerPersonPricing) {
        missingFields.push('pricePerPerson');
      }
    }
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
        // For group pricing, use the first tier price as base, or calculate average
        pricePerPerson: formData.pricingType === 'per_group' && formData.groupPricingTiers && formData.groupPricingTiers.length > 0
          ? parseFloat(formData.groupPricingTiers[0].price || '0') / formData.groupPricingTiers[0].maxPeople
          : parseFloat(formData.pricePerPerson || '0'),
        currency: formData.currency,
        // Store group pricing tiers
        maxGroupSize: formData.maxGroupSize && formData.maxGroupSize >= 1 && formData.maxGroupSize <= 20 ? formData.maxGroupSize : null,
        groupPrice: formData.pricingType === 'per_group' && formData.groupPricingTiers && formData.groupPricingTiers.length > 0
          ? parseFloat(formData.groupPricingTiers[formData.groupPricingTiers.length - 1].price || '0')
          : (formData.groupPrice && !isNaN(parseFloat(formData.groupPrice)) ? parseFloat(formData.groupPrice) : null),
        groupPricingTiers: formData.pricingType === 'per_group' && formData.groupPricingTiers ? JSON.stringify(formData.groupPricingTiers) : null,
        shortDescription: formData.shortDescription?.trim() || null,
        fullDescription: formData.fullDescription.trim(),
        highlights: JSON.stringify(formData.highlights.filter(h => h.trim()).map(h => h.trim())), // Filter empty and trim each highlight
        included: formData.included.trim(),
        notIncluded: formData.notIncluded?.trim() || null,
        meetingPoint: formData.meetingPoint?.trim() || null,
        images: JSON.stringify(formData.images),
        languages: JSON.stringify(formData.languages),
        tourTypes: formData.tourTypes.length > 0 ? JSON.stringify(formData.tourTypes) : null,
        locationEntryTickets: JSON.stringify(formData.locationEntryTickets),
        usesTransportation: formData.usesTransportation || false,
        transportationTypes: JSON.stringify(formData.transportationTypes),
        multiCityTravel: formData.multiCityTravel || false,
        tourOptions: formData.tourOptions.map((opt, idx) => {
          // CRITICAL: Remove any ID fields AND pricingType to prevent database conflicts
          const { id, tourId, pricingType, pricing_type, ...cleanOpt } = opt;
          if (id || tourId || pricingType || pricing_type) {
            console.warn(`⚠️  Removing ID fields and pricingType from tour option ${idx + 1} to prevent conflicts`);
          }
          
          // CRITICAL: Explicitly remove pricingType from cleanOpt as well (double safety)
          delete cleanOpt.pricingType;
          delete cleanOpt.pricing_type;
          
          // Check if option has group pricing tiers
          const hasGroupPricingTiers = cleanOpt.groupPricingTiers && Array.isArray(cleanOpt.groupPricingTiers) && cleanOpt.groupPricingTiers.length > 0;
          const optionIsPerGroup = !!(cleanOpt.groupPrice && cleanOpt.maxGroupSize) || hasGroupPricingTiers;
          
          // Calculate price based on inferred pricing type
          let optionPrice = 0;
          if (hasGroupPricingTiers && cleanOpt.groupPricingTiers.length > 0) {
            // Use first tier price as base, or last tier for max group size
            optionPrice = parseFloat(cleanOpt.groupPricingTiers[cleanOpt.groupPricingTiers.length - 1].price || '0') || 0;
          } else if (optionIsPerGroup && cleanOpt.groupPrice) {
            optionPrice = parseFloat(cleanOpt.groupPrice) || 0;
          } else if (cleanOpt.price) {
            optionPrice = parseFloat(cleanOpt.price) || 0;
          } else {
            // Fallback to main tour price
            const mainIsPerGroup = !!(formData.groupPrice && formData.maxGroupSize) || (formData.groupPricingTiers && formData.groupPricingTiers.length > 0);
            if (mainIsPerGroup && formData.groupPricingTiers && formData.groupPricingTiers.length > 0) {
              optionPrice = parseFloat(formData.groupPricingTiers[formData.groupPricingTiers.length - 1].price || '0') || 0;
            } else if (mainIsPerGroup && formData.groupPrice) {
              optionPrice = parseFloat(formData.groupPrice) || 0;
            } else {
              optionPrice = parseFloat(formData.pricePerPerson || '0') || 0;
            }
          }
          
          // Build return object WITHOUT pricingType (backend will infer from groupPrice/maxGroupSize)
          const returnOpt: any = {
            optionTitle: cleanOpt.optionTitle.trim(),
            optionDescription: cleanOpt.optionDescription.trim(),
            durationHours: parseFloat(cleanOpt.durationHours) || 3,
            price: optionPrice,
            currency: cleanOpt.currency || formData.currency,
            language: cleanOpt.language || (formData.languages && formData.languages[0]) || 'English',
            pickupIncluded: cleanOpt.pickupIncluded || false,
            carIncluded: cleanOpt.carIncluded || false,
            entryTicketIncluded: cleanOpt.entryTicketIncluded || false,
            guideIncluded: cleanOpt.guideIncluded !== undefined ? cleanOpt.guideIncluded : true,
            maxGroupSize: cleanOpt.maxGroupSize && cleanOpt.maxGroupSize >= 1 && cleanOpt.maxGroupSize <= 20 ? cleanOpt.maxGroupSize : null,
            groupPrice: hasGroupPricingTiers && cleanOpt.groupPricingTiers.length > 0
              ? parseFloat(cleanOpt.groupPricingTiers[cleanOpt.groupPricingTiers.length - 1].price || '0')
              : (cleanOpt.groupPrice && !isNaN(parseFloat(cleanOpt.groupPrice)) ? parseFloat(cleanOpt.groupPrice) : null),
            groupPricingTiers: hasGroupPricingTiers ? JSON.stringify(cleanOpt.groupPricingTiers) : null,
            sortOrder: idx
          };
          
          // CRITICAL: Final check - ensure pricingType is NOT in return object
          delete returnOpt.pricingType;
          delete returnOpt.pricing_type;
          
          return returnOpt;
        })
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
        highlightsCount: formData.highlights.filter(h => h.trim()).length,
        tourOptionsCount: formData.tourOptions.length,
        isEditing,
        submitForReview,
        url: isEditing ? `${API_URL}/api/tours/${tour.id}` : `${API_URL}/api/tours`,
        method: isEditing ? 'PUT' : 'POST',
        tourOptions: formData.tourOptions.map(opt => ({
          title: opt.optionTitle,
          price: opt.price,
          duration: opt.durationHours,
          hasGroupPricingTiers: !!(opt.groupPricingTiers && opt.groupPricingTiers.length > 0)
        }))
      });

      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const url = isEditing ? `${API_URL}/api/tours/${tour.id}` : `${API_URL}/api/tours`;
      const method = isEditing ? 'PUT' : 'POST';
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      let response;
      try {
        response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tourData),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timed out. The server is taking too long to respond. Please try again.');
        }
        throw fetchError;
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          // If JSON parsing fails, try to get text response
          const textResponse = await response.text().catch(() => 'Unknown error');
          errorData = { 
            message: `Server error: ${response.status} ${response.statusText}. ${textResponse}`,
            error: 'Network error occurred'
          };
        }
        
        // Debug: Log the error response
        console.error('❌ Server error response:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData,
          fullResponse: errorData
        });
        
        // Use server's error message directly - prioritize message field
        const errorMessage = errorData.message || errorData.error || `Server error: ${response.status}`;
        const commonIssues = errorData.commonIssues || [];
        
        // Create error object with message and commonIssues
        const error = new Error(errorMessage) as any;
        error.commonIssues = commonIssues;
        error.errorData = errorData;
        
        console.error('❌ Throwing error:', errorMessage);
        throw error;
      }

      console.log('✅ Tour create/update response received:', {
        status: response.status,
        success: response.ok
      });

      const data = await response.json();
      
      console.log('✅ Tour create/update data:', {
        success: data.success,
        tourId: data.tour?.id,
        message: data.message
      });

      if (data.success) {
        if (isEditing) {
          // Tour edited successfully - status remains unchanged (approved stays approved)
          alert('Tour updated successfully!');
          onSuccess();
          onClose();
        } else if (submitForReview) {
          // Submit for review
          const submitController = new AbortController();
          const submitTimeoutId = setTimeout(() => submitController.abort(), 30000); // 30 second timeout
          
          let submitResponse;
          try {
            submitResponse = await fetch(`${API_URL}/api/tours/${data.tour.id}/submit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: submitController.signal
            });
            clearTimeout(submitTimeoutId);
          } catch (submitFetchError: any) {
            clearTimeout(submitTimeoutId);
            if (submitFetchError.name === 'AbortError') {
              throw new Error('Submission request timed out. The tour was created but may not have been submitted for review. Please check your dashboard.');
            }
            throw submitFetchError;
          }

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
        throw new Error(data.message || data.error || (isEditing ? 'Failed to update tour' : 'Failed to create tour'));
      }
    } catch (error: any) {
      console.error('Tour creation error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
        error: error
      });
      
      // Use the error message directly from the server or provide a clear default
      let errorMessage: string;
      
      // Prioritize showing the actual server error message
      if (error.message) {
        // Check if it's a ReferenceError (frontend issue)
        if (error.name === 'ReferenceError' && error.message.includes('supplier is not defined')) {
          errorMessage = 'An error occurred while processing your request. Please refresh the page and try again. If the problem persists, please log out and log back in.';
          console.error('ReferenceError detected - this might be a frontend issue');
        } else if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
          const apiUrl = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
          errorMessage = `Cannot connect to server at ${apiUrl}. Please check your connection and try again.`;
        } else if (error.message.includes('Network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          // Use server's error message as-is (it already has proper formatting)
          errorMessage = error.message;
        }
      } else {
        errorMessage = 'Failed to create tour. Please check your connection and try again.';
      }
      
      // Show error in alert with helpful information
      const commonIssues = (error as any).commonIssues || [
        'Your supplier account needs admin approval',
        'Check all required fields are filled',
        'Ensure you have at least 4 images uploaded'
      ];
      
      const issuesText = commonIssues.map(issue => `• ${issue}`).join('\n');
      alert(`❌ ${errorMessage}\n\nCommon issues:\n${issuesText}`);
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
            <h1 className="text-2xl font-black text-[#001A33]">{isEditing ? 'Edit Tour' : 'Create a new tour'}</h1>
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

      {/* English Only Notice */}
      {showEnglishNotice && (
        <div className="bg-blue-50 border-b-2 border-blue-400">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-start gap-3 relative">
              <AlertCircle className="text-blue-600 shrink-0 mt-1" size={24} />
              <div className="flex-1">
                {language === 'ja' ? (
                  <>
                    <h3 className="font-black text-[#001A33] text-[16px] mb-2">
                      📝 重要：ツアーは英語のみで作成してください
                    </h3>
                    <p className="text-[14px] text-gray-700 font-semibold leading-relaxed mb-3">
                      <strong>すべてのツアーコンテンツは英語のみで記入してください</strong>（タイトル、説明、ハイライトなど）。
                    </p>
                    <div className="bg-white rounded-xl p-4 border border-blue-200">
                      <p className="text-[13px] text-gray-600 font-semibold leading-relaxed">
                        <strong>English:</strong> All tour content (titles, descriptions, highlights) must be written in English only.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-black text-[#001A33] text-[16px] mb-2">
                      📝 Important: Tours Must Be Created in English Only
                    </h3>
                    <p className="text-[14px] text-gray-700 font-semibold leading-relaxed">
                      <strong>All tour content must be written in English only</strong> (titles, descriptions, highlights, etc.).
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => {
                  setShowEnglishNotice(false);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('englishNoticeDismissed', 'true');
                  }
                }}
                className="absolute top-0 right-0 p-1 hover:bg-blue-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                aria-label="Close notice"
              >
                <X size={18} />
              </button>
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
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <p className="text-[13px] text-blue-800 font-semibold">
                    💡 After creating your tour, you can add multiple pricing options (variations) in Step 5. These options will appear on the same tour page for customers to choose from.
                  </p>
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
                  Select Places to See * (Click to select up to 10 places)
                </label>
                {formData.city && CITY_LOCATIONS[formData.city] ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {CITY_LOCATIONS[formData.city].slice(0, 10).map((location) => {
                        const isSelected = formData.locations.includes(location);
                        return (
                          <div
                            key={location}
                            onClick={() => handleLocationToggle(location)}
                            className={`relative p-4 bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                              isSelected
                                ? 'border-[#10B981] bg-[#10B981]/5'
                                : 'border-gray-200 hover:border-[#10B981]/50'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center">
                                <CheckCircle2 size={16} className="text-white" />
                              </div>
                            )}
                            <div className="flex flex-col items-center text-center">
                              <MapPin 
                                size={24} 
                                className={`mb-2 ${isSelected ? 'text-[#10B981]' : 'text-gray-400'}`} 
                              />
                              <span className={`text-[13px] font-bold ${isSelected ? 'text-[#10B981]' : 'text-[#001A33]'}`}>
                                {location}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {formData.locations.length > 0 && (
                      <div className="mt-4 p-4 bg-[#10B981]/10 rounded-xl border border-[#10B981]/20">
                        <p className="text-[14px] font-bold text-[#10B981] mb-2">
                          ✓ {formData.locations.length} place{formData.locations.length > 1 ? 's' : ''} selected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {formData.locations.map((loc) => (
                            <span
                              key={loc}
                              className="px-3 py-1 bg-[#10B981] text-white text-[12px] font-bold rounded-full"
                            >
                              {loc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.locations.length === 0 && (
                      <p className="text-[12px] text-gray-500 font-semibold mt-3 text-center">
                        Click on places above to add them to your tour
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

              {/* Entry Ticket Options for Selected Locations */}
              {formData.locations.length > 0 && (
                <div className="mt-6">
                  <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                    Entry Ticket Options for Each Location *
                  </label>
                  <p className="text-[12px] text-gray-500 font-semibold mb-4">
                    Specify how entry to each location is handled
                  </p>
                  <div className="space-y-4">
                    {formData.locations.map((location) => (
                      <div key={location} className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative">
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => {
                              const newLocations = prev.locations.filter(l => l !== location);
                              const newEntryTickets = { ...prev.locationEntryTickets };
                              delete newEntryTickets[location];
                              return {
                                ...prev,
                                locations: newLocations,
                                locationEntryTickets: newEntryTickets
                              };
                            });
                          }}
                          className="absolute top-3 right-3 p-1 hover:bg-red-100 rounded-full transition-colors text-gray-400 hover:text-red-600"
                          aria-label={`Remove ${location}`}
                        >
                          <X size={16} />
                        </button>
                        <label className="block text-[13px] font-bold text-[#001A33] mb-2 pr-8">
                          {location}
                        </label>
                        <select
                          value={formData.locationEntryTickets[location] || 'paid_included'}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              locationEntryTickets: {
                                ...prev.locationEntryTickets,
                                [location]: e.target.value as EntryTicketOption
                              }
                            }));
                          }}
                          className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none"
                        >
                          {ENTRY_TICKET_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-gray-500 mt-1">
                          {ENTRY_TICKET_OPTIONS.find(opt => opt.value === (formData.locationEntryTickets[location] || 'paid_included'))?.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

              {/* Pricing Type Selection */}
              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Pricing Type *
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="pricingType"
                      value="per_person"
                      checked={formData.pricingType === 'per_person'}
                      onChange={(e) => {
                        handleInputChange('pricingType', e.target.value);
                        // Clear group pricing fields when switching to per person
                        handleInputChange('maxGroupSize', undefined);
                        handleInputChange('groupPrice', '');
                        handleInputChange('groupPricingTiers', []);
                        // Remove "Group Tour" from tour types if it exists
                        setFormData(prev => ({
                          ...prev,
                          tourTypes: prev.tourTypes.filter(t => t !== 'Group Tour')
                        }));
                      }}
                      className="w-5 h-5 text-[#10B981] focus:ring-[#10B981] cursor-pointer"
                    />
                    <span className="text-[14px] font-semibold text-[#001A33]">Per Person</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="pricingType"
                      value="per_group"
                      checked={formData.pricingType === 'per_group'}
                      onChange={(e) => {
                        handleInputChange('pricingType', e.target.value);
                        // Clear per person price when switching to per group
                        handleInputChange('pricePerPerson', '');
                        // Automatically add "Group Tour" to tour types
                        setFormData(prev => ({
                          ...prev,
                          tourTypes: prev.tourTypes.includes('Group Tour') 
                            ? prev.tourTypes 
                            : [...prev.tourTypes, 'Group Tour']
                        }));
                      }}
                      className="w-5 h-5 text-[#10B981] focus:ring-[#10B981] cursor-pointer"
                    />
                    <span className="text-[14px] font-semibold text-[#001A33]">Per Group</span>
                  </label>
                </div>
                {formData.pricingType === 'per_group' && (
                  <p className="text-[12px] text-[#10B981] font-semibold mt-2">
                    ✓ This tour will be automatically labeled as "Group Tour"
                  </p>
                )}
              </div>

              {/* Per Person Pricing */}
              {formData.pricingType === 'per_person' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                      Price per person *
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
              )}

              {/* Per Group Pricing - Tiered */}
              {formData.pricingType === 'per_group' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                        Maximum Group Size *
                      </label>
                      <input
                        type="number"
                        value={formData.maxGroupSize || ''}
                        onChange={(e) => {
                          const maxSize = e.target.value ? parseInt(e.target.value) : undefined;
                          handleInputChange('maxGroupSize', maxSize);
                          // Clear tiers if max size is cleared, or adjust existing tiers
                          if (!maxSize) {
                            handleInputChange('groupPricingTiers', []);
                          } else if (maxSize >= 1 && maxSize <= 20) {
                            setFormData(prev => {
                              // Keep existing tiers but adjust max values if needed
                              const adjustedTiers = prev.groupPricingTiers.map(tier => ({
                                ...tier,
                                maxPeople: Math.min(tier.maxPeople, maxSize)
                              })).filter(tier => tier.minPeople <= maxSize);
                              return {
                                ...prev,
                                groupPricingTiers: adjustedTiers.length > 0 ? adjustedTiers : []
                              };
                            });
                          }
                        }}
                        placeholder="e.g., 10"
                        min="1"
                        max="20"
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                      />
                      <p className="text-[11px] text-gray-400 mt-1">
                        Enter a single number (between 1 and 20) for maximum group size
                      </p>
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
                  
                  {/* Group Pricing Tiers - Custom Ranges */}
                  {formData.maxGroupSize && formData.maxGroupSize >= 1 && formData.maxGroupSize <= 20 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-[14px] font-bold text-[#001A33]">
                          Set Price for Group Size Ranges *
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => {
                              const lastTier = prev.groupPricingTiers[prev.groupPricingTiers.length - 1];
                              const nextMin = lastTier ? lastTier.maxPeople + 1 : 1;
                              const nextMax = Math.min(nextMin + 3, prev.maxGroupSize || 20);
                              
                              return {
                                ...prev,
                                groupPricingTiers: [
                                  ...prev.groupPricingTiers,
                                  {
                                    minPeople: nextMin,
                                    maxPeople: nextMax,
                                    price: ''
                                  }
                                ]
                              };
                            });
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-[#10B981] text-white rounded-xl text-[12px] font-bold hover:bg-[#059669] transition-colors"
                        >
                          <Plus size={14} />
                          Add Range
                        </button>
                      </div>
                      <div className="space-y-3">
                        {formData.groupPricingTiers.length === 0 ? (
                          <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                            <p className="text-[13px] text-gray-500 font-semibold mb-2">No pricing ranges added yet</p>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  groupPricingTiers: [{
                                    minPeople: 1,
                                    maxPeople: Math.min(4, prev.maxGroupSize || 20),
                                    price: ''
                                  }]
                                }));
                              }}
                              className="text-[#10B981] font-bold text-[13px] hover:underline"
                            >
                              Click to add first range
                            </button>
                          </div>
                        ) : (
                          formData.groupPricingTiers.map((tier, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="w-20">
                                    <input
                                      type="number"
                                      value={tier.minPeople}
                                      onChange={(e) => {
                                        const min = parseInt(e.target.value) || 1;
                                        setFormData(prev => {
                                          const newTiers = [...prev.groupPricingTiers];
                                          newTiers[index] = {
                                            ...newTiers[index],
                                            minPeople: Math.max(1, Math.min(min, newTiers[index].maxPeople - 1))
                                          };
                                          return {
                                            ...prev,
                                            groupPricingTiers: newTiers
                                          };
                                        });
                                      }}
                                      min="1"
                                      max={tier.maxPeople - 1}
                                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3 text-center font-bold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none"
                                    />
                                  </div>
                                  <span className="text-[14px] font-bold text-gray-600">-</span>
                                  <div className="w-20">
                                    <input
                                      type="number"
                                      value={tier.maxPeople}
                                      onChange={(e) => {
                                        const max = parseInt(e.target.value) || tier.minPeople + 1;
                                        setFormData(prev => {
                                          const newTiers = [...prev.groupPricingTiers];
                                          const nextTierMin = index < prev.groupPricingTiers.length - 1 
                                            ? prev.groupPricingTiers[index + 1].minPeople 
                                            : (prev.maxGroupSize || 20) + 1;
                                          newTiers[index] = {
                                            ...newTiers[index],
                                            maxPeople: Math.min(Math.max(max, tier.minPeople + 1), nextTierMin - 1, prev.maxGroupSize || 20)
                                          };
                                          return {
                                            ...prev,
                                            groupPricingTiers: newTiers
                                          };
                                        });
                                      }}
                                      min={tier.minPeople + 1}
                                      max={formData.maxGroupSize || 20}
                                      className="w-full bg-white border border-gray-300 rounded-xl py-2 px-3 text-center font-bold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none"
                                    />
                                  </div>
                                  <span className="text-[13px] font-semibold text-gray-600 ml-1">people</span>
                                </div>
                                <div className="flex-1 flex items-center gap-2">
                                  <span className="text-[14px] font-semibold text-gray-600">
                                    {formData.currency === 'INR' ? '₹' : '$'}
                                  </span>
                                  <input
                                    type="number"
                                    value={tier.price}
                                    onChange={(e) => {
                                      setFormData(prev => {
                                        const newTiers = [...prev.groupPricingTiers];
                                        newTiers[index] = {
                                          ...newTiers[index],
                                          price: e.target.value
                                        };
                                        return {
                                          ...prev,
                                          groupPricingTiers: newTiers
                                        };
                                      });
                                    }}
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.01"
                                    className="flex-1 bg-white border border-gray-300 rounded-xl py-2 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      groupPricingTiers: prev.groupPricingTiers.filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="p-2 hover:bg-red-100 rounded-full transition-colors text-gray-400 hover:text-red-600"
                                  aria-label="Remove range"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-2">
                        Define custom group size ranges and set prices for each. For example: 1-4 people = ₹5,000, 5-9 people = ₹8,000, 10-15 people = ₹12,000
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tour Types Selection */}
              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Tour Types (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {TOUR_TYPES.map((tourType) => {
                    const isSelected = formData.tourTypes.includes(tourType);
                    return (
                      <button
                        key={tourType}
                        type="button"
                        onClick={() => handleTourTypeToggle(tourType)}
                        className={`p-3 rounded-xl border-2 transition-all text-left text-[13px] font-semibold ${
                          isSelected
                            ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                            : 'border-gray-200 hover:border-[#10B981]/50 text-gray-700'
                        }`}
                      >
                        {tourType}
                      </button>
                    );
                  })}
                </div>
                {formData.tourTypes.length > 0 && (
                  <p className="text-[12px] text-gray-500 font-semibold mt-2">
                    {formData.tourTypes.length} tour type{formData.tourTypes.length > 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Tour Options */}
        {step === 5 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-black text-[#001A33] mb-2">Add Pricing Options</h2>
            <p className="text-[14px] text-gray-600 font-semibold mb-4">
              Create multiple pricing options for <span className="font-black text-[#001A33]">"{formData.title || 'this tour'}"</span>. All options belong to the same tour - customers will see one tour page and choose which option they prefer (like GetYourGuide).
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-[13px] font-bold text-green-800">
                💡 Example: For "Taj Mahal Tour", you can add options like "Basic Tour", "Tour with Pickup", and "Premium Tour" - all within the same tour!
              </p>
            </div>
            
            {formData.tourOptions.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <p className="text-[14px] text-blue-800 font-semibold mb-4">
                  Add at least one pricing option for this tour. You can add multiple options with different prices and features.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const newOption = {
                      optionTitle: '',
                      optionDescription: '',
                      durationHours: formData.duration.replace(/[^\d.]/g, '') || '3',
                      price: (formData.groupPrice && formData.maxGroupSize) ? '' : (formData.pricePerPerson || ''),
                      currency: formData.currency,
                      language: formData.languages[0] || 'English',
                      pickupIncluded: false,
                      carIncluded: false,
                      entryTicketIncluded: false,
                      guideIncluded: true,
                      pricingType: (formData.groupPrice && formData.maxGroupSize) || (formData.groupPricingTiers && formData.groupPricingTiers.length > 0) ? 'per_group' : 'per_person', // Keep for UI state
                      maxGroupSize: (formData.groupPrice && formData.maxGroupSize) || (formData.groupPricingTiers && formData.groupPricingTiers.length > 0) ? (formData.maxGroupSize || undefined) : undefined,
                      groupPrice: (formData.groupPrice && formData.maxGroupSize) ? (formData.groupPrice || '') : undefined,
                      groupPricingTiers: (formData.groupPricingTiers && formData.groupPricingTiers.length > 0) ? [...formData.groupPricingTiers] : undefined
                    };
                    setFormData(prev => ({
                      ...prev,
                      tourOptions: [...prev.tourOptions, newOption]
                    }));
                    setEditingOptionIndex(formData.tourOptions.length);
                  }}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-black py-3 px-6 rounded-xl text-[14px] transition-all flex items-center gap-2 mx-auto"
                >
                  <Plus size={18} />
                  Add First Tour Option
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.tourOptions.map((option, index) => (
                  <div key={index} className="border-2 border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-[#001A33] text-[16px]">
                        Option {index + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...formData.tourOptions];
                              [newOptions[index], newOptions[index - 1]] = [newOptions[index - 1], newOptions[index]];
                              setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Move up"
                          >
                            <ArrowUp size={16} className="text-gray-600" />
                          </button>
                        )}
                        {index < formData.tourOptions.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...formData.tourOptions];
                              [newOptions[index], newOptions[index + 1]] = [newOptions[index + 1], newOptions[index]];
                              setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Move down"
                          >
                            <ArrowDown size={16} className="text-gray-600" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const newOptions = formData.tourOptions.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                            if (editingOptionIndex === index) setEditingOptionIndex(null);
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete option"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                          Option Title *
                        </label>
                        <input
                          type="text"
                          value={option.optionTitle}
                          onChange={(e) => {
                            const newOptions = [...formData.tourOptions];
                            newOptions[index].optionTitle = e.target.value;
                            setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                          }}
                          placeholder="e.g., Sunrise Tour with Car & Guide"
                          className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                          Option Description *
                        </label>
                        <textarea
                          value={option.optionDescription}
                          onChange={(e) => {
                            const newOptions = [...formData.tourOptions];
                            newOptions[index].optionDescription = e.target.value;
                            setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                          }}
                          placeholder="Describe what's included in this option..."
                          rows={3}
                          className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                            Duration (hours) *
                          </label>
                          <input
                            type="number"
                            value={option.durationHours}
                            onChange={(e) => {
                              const newOptions = [...formData.tourOptions];
                              newOptions[index].durationHours = e.target.value;
                              setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                            }}
                            placeholder="e.g., 4"
                            min="0.5"
                            step="0.5"
                            className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                            Price per person *
                          </label>
                          <input
                            type="number"
                            value={option.price}
                            onChange={(e) => {
                              const newOptions = [...formData.tourOptions];
                              newOptions[index].price = e.target.value;
                              setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                            }}
                            placeholder="e.g., 595"
                            min="0"
                            disabled={option.pricingType === 'per_group'}
                            className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>

                      {/* Pricing Type Selection */}
                      <div>
                        <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                          Pricing Type *
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors flex-1">
                            <input
                              type="radio"
                              name={`pricingType-${index}`}
                              value="per_person"
                              checked={option.pricingType === 'per_person'}
                              onChange={(e) => {
                                const newOptions = [...formData.tourOptions];
                                newOptions[index].pricingType = 'per_person';
                                // Clear group pricing fields when switching to per person
                                newOptions[index].maxGroupSize = undefined;
                                newOptions[index].groupPrice = '';
                                newOptions[index].groupPricingTiers = [];
                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                              }}
                              className="w-4 h-4 text-[#10B981] focus:ring-[#10B981]"
                            />
                            <span className="text-[14px] font-semibold text-[#001A33]">Per Person</span>
                          </label>
                          <label className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors flex-1">
                            <input
                              type="radio"
                              name={`pricingType-${index}`}
                              value="per_group"
                              checked={option.pricingType === 'per_group'}
                              onChange={(e) => {
                                const newOptions = [...formData.tourOptions];
                                newOptions[index].pricingType = 'per_group';
                                if (!newOptions[index].maxGroupSize) {
                                  newOptions[index].maxGroupSize = 20;
                                }
                                if (!newOptions[index].groupPrice) {
                                  newOptions[index].groupPrice = '';
                                }
                                if (!newOptions[index].groupPricingTiers) {
                                  newOptions[index].groupPricingTiers = [];
                                }
                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                              }}
                              className="w-4 h-4 text-[#10B981] focus:ring-[#10B981]"
                            />
                            <span className="text-[14px] font-semibold text-[#001A33]">Per Group</span>
                          </label>
                        </div>
                      </div>

                      {/* Group Pricing Fields - Tiered (shown only when pricingType is 'per_group') */}
                      {option.pricingType === 'per_group' && (
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-4">
                          <div>
                            <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                              Maximum Group Size *
                            </label>
                            <input
                              type="number"
                              value={option.maxGroupSize || ''}
                              onChange={(e) => {
                                const newOptions = [...formData.tourOptions];
                                const maxSize = e.target.value ? parseInt(e.target.value) : undefined;
                                if (maxSize && maxSize >= 1 && maxSize <= 20) {
                                  newOptions[index].maxGroupSize = maxSize;
                                  // Initialize or adjust group pricing tiers
                                  if (!newOptions[index].groupPricingTiers || newOptions[index].groupPricingTiers.length === 0) {
                                    newOptions[index].groupPricingTiers = [];
                                  } else {
                                    // Adjust existing tiers to fit within new max size
                                    newOptions[index].groupPricingTiers = newOptions[index].groupPricingTiers.map((tier: any) => ({
                                      ...tier,
                                      maxPeople: Math.min(tier.maxPeople, maxSize)
                                    })).filter((tier: any) => tier.minPeople <= maxSize);
                                  }
                                } else if (e.target.value === '') {
                                  newOptions[index].maxGroupSize = undefined;
                                  newOptions[index].groupPricingTiers = [];
                                }
                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                              }}
                              placeholder="e.g., 10"
                              min="1"
                              max="20"
                              className="w-full bg-white border-none rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                            />
                            <p className="text-[11px] text-gray-400 mt-1">
                              Enter a single number (between 1 and 20) for maximum group size
                            </p>
                          </div>
                          
                          {/* Group Pricing Tiers - Custom Ranges */}
                          {option.maxGroupSize && option.maxGroupSize >= 1 && option.maxGroupSize <= 20 && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <label className="block text-[14px] font-bold text-[#001A33]">
                                  Set Price for Group Size Ranges *
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newOptions = [...formData.tourOptions];
                                    const lastTier = newOptions[index].groupPricingTiers?.[newOptions[index].groupPricingTiers.length - 1];
                                    const nextMin = lastTier ? lastTier.maxPeople + 1 : 1;
                                    const nextMax = Math.min(nextMin + 3, newOptions[index].maxGroupSize || 20);
                                    
                                    if (!newOptions[index].groupPricingTiers) {
                                      newOptions[index].groupPricingTiers = [];
                                    }
                                    newOptions[index].groupPricingTiers = [
                                      ...newOptions[index].groupPricingTiers,
                                      {
                                        minPeople: nextMin,
                                        maxPeople: nextMax,
                                        price: ''
                                      }
                                    ];
                                    setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 bg-[#10B981] text-white rounded-xl text-[12px] font-bold hover:bg-[#059669] transition-colors"
                                >
                                  <Plus size={14} />
                                  Add Range
                                </button>
                              </div>
                              <div className="space-y-3">
                                {(!option.groupPricingTiers || option.groupPricingTiers.length === 0) ? (
                                  <div className="text-center py-6 bg-white rounded-xl border-2 border-dashed border-gray-300">
                                    <p className="text-[13px] text-gray-500 font-semibold mb-2">No pricing ranges added yet</p>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newOptions = [...formData.tourOptions];
                                        newOptions[index].groupPricingTiers = [{
                                          minPeople: 1,
                                          maxPeople: Math.min(4, newOptions[index].maxGroupSize || 20),
                                          price: ''
                                        }];
                                        setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                      }}
                                      className="text-[#10B981] font-bold text-[13px] hover:underline"
                                    >
                                      Click to add first range
                                    </button>
                                  </div>
                                ) : (
                                  option.groupPricingTiers.map((tier: any, tierIndex: number) => (
                                    <div key={tierIndex} className="bg-white rounded-xl p-4 border border-gray-200">
                                      <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                          <div className="w-20">
                                            <input
                                              type="number"
                                              value={tier.minPeople}
                                              onChange={(e) => {
                                                const min = parseInt(e.target.value) || 1;
                                                const newOptions = [...formData.tourOptions];
                                                if (!newOptions[index].groupPricingTiers) return;
                                                newOptions[index].groupPricingTiers[tierIndex] = {
                                                  ...newOptions[index].groupPricingTiers[tierIndex],
                                                  minPeople: Math.max(1, Math.min(min, tier.maxPeople - 1))
                                                };
                                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                              }}
                                              min="1"
                                              max={tier.maxPeople - 1}
                                              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 text-center font-bold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none"
                                            />
                                          </div>
                                          <span className="text-[14px] font-bold text-gray-600">-</span>
                                          <div className="w-20">
                                            <input
                                              type="number"
                                              value={tier.maxPeople}
                                              onChange={(e) => {
                                                const max = parseInt(e.target.value) || tier.minPeople + 1;
                                                const newOptions = [...formData.tourOptions];
                                                if (!newOptions[index].groupPricingTiers) return;
                                                const nextTierMin = tierIndex < (newOptions[index].groupPricingTiers.length - 1)
                                                  ? newOptions[index].groupPricingTiers[tierIndex + 1].minPeople
                                                  : (newOptions[index].maxGroupSize || 20) + 1;
                                                newOptions[index].groupPricingTiers[tierIndex] = {
                                                  ...newOptions[index].groupPricingTiers[tierIndex],
                                                  maxPeople: Math.min(Math.max(max, tier.minPeople + 1), nextTierMin - 1, newOptions[index].maxGroupSize || 20)
                                                };
                                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                              }}
                                              min={tier.minPeople + 1}
                                              max={option.maxGroupSize || 20}
                                              className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 text-center font-bold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none"
                                            />
                                          </div>
                                          <span className="text-[13px] font-semibold text-gray-600 ml-1">people</span>
                                        </div>
                                        <div className="flex-1 flex items-center gap-2">
                                          <span className="text-[14px] font-semibold text-gray-600">
                                            {option.currency === 'INR' ? '₹' : option.currency === 'USD' ? '$' : '€'}
                                          </span>
                                          <input
                                            type="number"
                                            value={tier.price}
                                            onChange={(e) => {
                                              const newOptions = [...formData.tourOptions];
                                              if (!newOptions[index].groupPricingTiers) return;
                                              newOptions[index].groupPricingTiers[tierIndex] = {
                                                ...newOptions[index].groupPricingTiers[tierIndex],
                                                price: e.target.value
                                              };
                                              setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                            }}
                                            placeholder="Enter price"
                                            min="0"
                                            step="0.01"
                                            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl py-2 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                                          />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newOptions = [...formData.tourOptions];
                                            if (!newOptions[index].groupPricingTiers) return;
                                            newOptions[index].groupPricingTiers = newOptions[index].groupPricingTiers.filter((_: any, i: number) => i !== tierIndex);
                                            setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                          }}
                                          className="p-2 hover:bg-red-100 rounded-full transition-colors text-gray-400 hover:text-red-600"
                                          aria-label="Remove range"
                                        >
                                          <X size={18} />
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                              <p className="text-[11px] text-gray-400">
                                Define custom group size ranges and set prices for each. For example: 1-4 people = ₹5,000, 5-9 people = ₹8,000
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                            Currency *
                          </label>
                          <select
                            value={option.currency}
                            onChange={(e) => {
                              const newOptions = [...formData.tourOptions];
                              newOptions[index].currency = e.target.value;
                              setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                            }}
                            className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                            Language *
                          </label>
                          <select
                            value={option.language}
                            onChange={(e) => {
                              const newOptions = [...formData.tourOptions];
                              newOptions[index].language = e.target.value;
                              setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                            }}
                            className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                          >
                            {LANGUAGE_OPTIONS.map(lang => (
                              <option key={lang} value={lang}>{lang}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                          What's Included in this Option:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              checked={option.guideIncluded}
                              onChange={(e) => {
                                const newOptions = [...formData.tourOptions];
                                newOptions[index].guideIncluded = e.target.checked;
                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                              }}
                              className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                            />
                            <span className="text-[14px] font-semibold text-[#001A33]">Guide Included</span>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              checked={option.pickupIncluded}
                              onChange={(e) => {
                                const newOptions = [...formData.tourOptions];
                                newOptions[index].pickupIncluded = e.target.checked;
                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                              }}
                              className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                            />
                            <span className="text-[14px] font-semibold text-[#001A33]">Hotel Pickup</span>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              checked={option.carIncluded}
                              onChange={(e) => {
                                const newOptions = [...formData.tourOptions];
                                newOptions[index].carIncluded = e.target.checked;
                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                              }}
                              className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                            />
                            <span className="text-[14px] font-semibold text-[#001A33]">Private Car</span>
                          </label>
                          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              checked={option.entryTicketIncluded}
                              onChange={(e) => {
                                const newOptions = [...formData.tourOptions];
                                newOptions[index].entryTicketIncluded = e.target.checked;
                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                              }}
                              className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                            />
                            <span className="text-[14px] font-semibold text-[#001A33]">Entry Ticket</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newOption = {
                      optionTitle: '',
                      optionDescription: '',
                      durationHours: formData.duration.replace(/[^\d.]/g, '') || '3',
                      price: (formData.groupPrice && formData.maxGroupSize) ? '' : (formData.pricePerPerson || ''),
                      currency: formData.currency,
                      language: formData.languages[0] || 'English',
                      pickupIncluded: false,
                      carIncluded: false,
                      entryTicketIncluded: false,
                      guideIncluded: true,
                      pricingType: (formData.groupPrice && formData.maxGroupSize) ? 'per_group' : 'per_person', // Keep for UI state
                      maxGroupSize: (formData.groupPrice && formData.maxGroupSize) ? formData.maxGroupSize : undefined,
                      groupPrice: (formData.groupPrice && formData.maxGroupSize) ? (formData.groupPrice || '') : undefined
                    };
                    setFormData(prev => ({
                      ...prev,
                      tourOptions: [...prev.tourOptions, newOption]
                    }));
                  }}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-[#10B981] hover:bg-[#10B981]/5 transition-all flex items-center justify-center gap-2 text-[#10B981] font-black text-[14px]"
                >
                  <Plus size={18} />
                  Add Another Option
                </button>

                {formData.tourOptions.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-[14px] font-bold text-green-800">
                      ✓ {formData.tourOptions.length} option{formData.tourOptions.length > 1 ? 's' : ''} added to <span className="font-black">"{formData.title || 'this tour'}"</span>. Customers will see one tour page with {formData.tourOptions.length} option{formData.tourOptions.length > 1 ? 's' : ''} to choose from.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 6: Description */}
        {step === 6 && (
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
                  Excludes (Optional - One item per line)
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

        {/* Step 7: Images & Languages */}
        {step === 7 && (
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

        {/* Step 8: Review */}
        {step === 8 && (
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
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">PRICING</div>
                  {(() => {
                    // Check if group pricing tiers exist (most specific)
                    const hasGroupPricingTiers = formData.groupPricingTiers && formData.groupPricingTiers.length > 0;
                    // Check if legacy group pricing exists
                    const hasLegacyGroupPricing = formData.groupPrice && formData.maxGroupSize;
                    // Check if per person pricing exists
                    const hasPerPersonPricing = formData.pricePerPerson && formData.pricePerPerson.trim() !== '';
                    
                    // Show group pricing if tiers exist OR legacy group pricing exists
                    if (hasGroupPricingTiers || hasLegacyGroupPricing) {
                      return (
                        <div className="space-y-3">
                          <div className="text-[16px] font-black text-[#001A33] mb-3">
                            Group Tour Pricing ({formData.currency === 'INR' ? '₹' : '$'})
                          </div>
                          {hasGroupPricingTiers ? (
                            <div className="space-y-2">
                              {formData.groupPricingTiers.map((tier, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200">
                                  <span className="text-[14px] font-bold text-[#001A33]">
                                    {tier.minPeople}-{tier.maxPeople} {tier.maxPeople === 1 ? 'person' : 'people'}
                                  </span>
                                  <span className="text-[16px] font-black text-[#10B981]">
                                    {formData.currency === 'INR' ? '₹' : '$'}{tier.price ? parseFloat(tier.price).toLocaleString() : '0'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : hasLegacyGroupPricing ? (
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                              <span className="text-[14px] font-bold text-[#001A33]">
                                Up to {formData.maxGroupSize} people: 
                              </span>
                              <span className="text-[16px] font-black text-[#10B981] ml-2">
                                {formData.currency === 'INR' ? '₹' : '$'}{parseFloat(formData.groupPrice || '0').toLocaleString()}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      );
                    }
                    
                    // Show per person pricing if it exists
                    if (hasPerPersonPricing) {
                      return (
                        <div className="text-[16px] font-black text-[#001A33]">
                          {formData.currency === 'INR' ? '₹' : '$'}{formData.pricePerPerson || '0'} per person
                        </div>
                      );
                    }
                    
                    // Fallback if no pricing configured
                    return (
                      <div className="text-[14px] text-gray-500 font-semibold">No pricing configured</div>
                    );
                  })()}
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
          {(step === totalSteps) ? (
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
                  onClick={() => {
                    console.log('Submit for Review clicked', {
                      isSubmitting,
                      canProceed: canProceed(),
                      hasRequiredContactInfo,
                      step,
                      pricingType: formData.pricingType,
                      hasGroupPricingTiers: formData.groupPricingTiers?.length > 0,
                      hasPerPersonPricing: !!formData.pricePerPerson
                    });
                    handleSubmit(true);
                  }}
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
                onClick={() => {
                  setStep(Math.max(1, step - 1));
                }}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 font-black rounded-full text-[14px] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={() => {
                  setStep(Math.min(totalSteps, step + 1));
                }}
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

