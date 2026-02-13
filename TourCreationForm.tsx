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
  const [submissionStatus, setSubmissionStatus] = useState<string>('');
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
        pricingType: 'per_group' as const, // Always per group now
        maxGroupSize: tour.maxGroupSize || undefined,
        groupPrice: tour.groupPrice?.toString() || '',
        groupPricingTiers: tour.groupPricingTiers ? (typeof tour.groupPricingTiers === 'string' ? JSON.parse(tour.groupPricingTiers) : tour.groupPricingTiers) : [], // Legacy
        unavailableDates: tour.unavailableDates ? (typeof tour.unavailableDates === 'string' ? JSON.parse(tour.unavailableDates) : tour.unavailableDates) : [], // Legacy
        unavailableDaysOfWeek: tour.unavailableDaysOfWeek ? (typeof tour.unavailableDaysOfWeek === 'string' ? JSON.parse(tour.unavailableDaysOfWeek) : tour.unavailableDaysOfWeek) : (tour.unavailableDaysOfWeek ? [] : []),
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
      pricingType: 'per_group' as 'per_person' | 'per_group', // Always per group now
      maxGroupSize: undefined as number | undefined,
      groupPrice: '',
      groupPricingTiers: [] as Array<{ minPeople: number; maxPeople: number; price: string }>, // Legacy - will be removed
      unavailableDates: [] as string[], // Legacy - dates guide is not available
      unavailableDaysOfWeek: [] as number[], // Days of week guide is not available (0=Sunday, 1=Monday, ..., 6=Saturday)
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
      isMultiDayTour: false,
      multiCityLocations: {} as Record<string, string[]>, // City -> locations mapping for multi-day tours
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
  const hasRequiredContactInfo = !!supplierEmail;

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
        // Check that title exists
        if (!formData.title || formData.title.trim() === '') return false;

        // For multi-day tours, check multiCityLocations
        if (formData.isMultiDayTour) {
          const multiCityKeys = Object.keys(formData.multiCityLocations);
          if (multiCityKeys.length === 0) return false;
          // Check that at least one city has at least one location selected
          const hasLocations = multiCityKeys.some(city =>
            formData.multiCityLocations[city] && formData.multiCityLocations[city].length > 0
          );
          return hasLocations;
        } else {
          // For regular tours, check single city locations
          if (formData.locations.length === 0) return false;
          // Check that all locations have entry ticket options set
          const hasAllEntryTickets = formData.locations.every(loc => formData.locationEntryTickets[loc]);
          return hasAllEntryTickets;
        }
      case 4:
        if (!formData.duration) return false;
        // Check that maxGroupSize is set and at least price for 1 person is entered
        if (!formData.maxGroupSize || formData.maxGroupSize < 1 || formData.maxGroupSize > 20) return false;
        if (!formData.groupPricingTiers || formData.groupPricingTiers.length === 0) return false;
        // Must have at least price for 1 person
        const hasPriceForOne = formData.groupPricingTiers.some(tier => tier.minPeople === 1 && tier.price && tier.price.trim() !== '');
        if (!hasPriceForOne) return false;
        return true;
      case 5:
        // Step 5: Description & Details
        return formData.fullDescription && formData.included && formData.highlights.filter(h => h.trim()).length >= 3;
      case 6:
        // Step 6: Photos & Languages
        return formData.images.length >= 4 && formData.languages.length > 0;
      case 7:
        // Step 7: Tour Options (last before preview)
        return formData.tourOptions.length > 0 && formData.tourOptions.every(opt => {
          const hasBasicFields = opt.optionTitle.trim() && opt.optionDescription.trim() && opt.durationHours;
          if (!hasBasicFields) return false;
          if (!opt.maxGroupSize || opt.maxGroupSize < 1 || opt.maxGroupSize > 20) return false;
          // Must have at least price for 1 person
          if (!opt.groupPricingTiers || opt.groupPricingTiers.length === 0) return false;
          const hasPriceForOne = opt.groupPricingTiers.some((tier: any) => tier.minPeople === 1 && tier.price && tier.price.trim() !== '');
          if (!hasPriceForOne) return false;
          return true;
        });
      case 8:
        return true; // Mini tours selection is optional
      default:
        return true;
    }
  };

  const handleSubmit = async (submitForReview: boolean = false) => {
    console.log('🚀 handleSubmit CALLED', { submitForReview, isEditing, step, tourId: tour?.id });

    // Check if supplier has required contact information
    if (!supplierEmail) {
      alert(`❌ Cannot create tour!\n\nYou must have your email in your profile.\n\nPlease go to your Profile tab and add this information first.`);

      if (onProfileRequired) {
        onProfileRequired();
      }
      return;
    }

    if (!canProceed()) {
      console.warn('Cannot proceed - validation failed', { step, canProceed: canProceed() });
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
    // Pricing - must have maxGroupSize and at least price for 1 person
    if (!formData.maxGroupSize || formData.maxGroupSize < 1 || formData.maxGroupSize > 20) {
      missingFields.push('maxGroupSize (1-20)');
    }
    if (!formData.groupPricingTiers || formData.groupPricingTiers.length === 0) {
      missingFields.push('pricing for group sizes');
    } else {
      const hasPriceForOne = formData.groupPricingTiers.some(tier => tier.minPeople === 1 && tier.price && tier.price.trim() !== '');
      if (!hasPriceForOne) {
        missingFields.push('price for 1 person (required - this shows as "Starting from")');
      }
    }
    if (!formData.languages || formData.languages.length === 0) missingFields.push('languages');
    if (!formData.highlights || formData.highlights.filter(h => h.trim()).length < 3) missingFields.push('highlights (need at least 3)');

    if (missingFields.length > 0) {
      alert(`Missing required fields:\n${missingFields.join('\n')}\n\nPlease complete all fields before submitting.`);
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('Preparing tour data...');

    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      // STEP 1: Upload images to Cloudinary FIRST (if they're base64)
      // This makes tour creation MUCH faster (small payload instead of 10-20MB)
      let imageUrls = formData.images;
      const hasBase64Images = formData.images.some(img => img.startsWith('data:image'));

      if (hasBase64Images && formData.images.length > 0) {
        setSubmissionStatus(`Uploading ${formData.images.length} images to Cloudinary...`);
        console.log(`📤 Step 1: Uploading ${formData.images.length} images to Cloudinary...`);
        const uploadStartTime = Date.now();

        try {
          const uploadResponse = await fetch(`${API_URL}/api/tours/upload-images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              images: formData.images,
              city: formData.city
            })
          });

          if (!uploadResponse.ok) {
            if (uploadResponse.status === 404) {
              throw new Error('Image upload endpoint not found. Please restart the backend server.');
            }
            const uploadError = await uploadResponse.json().catch(() => ({ message: 'Failed to upload images' }));
            throw new Error(uploadError.message || `Failed to upload images (${uploadResponse.status})`);
          }

          const uploadData = await uploadResponse.json();
          if (uploadData.success && uploadData.urls) {
            imageUrls = uploadData.urls;
            const uploadTime = Date.now() - uploadStartTime;
            console.log(`✅ Images uploaded in ${uploadTime}ms. URLs received:`, imageUrls.length);
            setSubmissionStatus('Images uploaded! Creating tour...');
          } else {
            throw new Error(uploadData.message || 'Failed to upload images');
          }
        } catch (uploadError: any) {
          console.error('❌ Image upload failed:', uploadError);
          // Fallback: continue with base64 images (backend will handle it)
          console.warn('⚠️ Continuing with base64 images (backend will upload in background)');
          imageUrls = formData.images;
          setSubmissionStatus('Creating tour with images...');
        }
      } else {
        console.log('ℹ️ Images are already URLs, skipping upload step');
      }

      // STEP 2: Create tour with image URLs (much smaller payload - just URLs, not base64)
      setSubmissionStatus('Creating tour...');
      // Handle locations for multi-day vs single-city tours
      let locationsToSave: string[] = [];
      if (formData.isMultiDayTour) {
        // For multi-day tours, flatten all cities' locations into one array
        Object.values(formData.multiCityLocations).forEach(cityLocations => {
          locationsToSave.push(...cityLocations);
        });
      } else {
        // For regular tours, use the single city locations
        locationsToSave = formData.locations;
      }

      const tourData = {
        supplierId,
        title: formData.title.trim(),
        country: formData.country.trim(),
        city: formData.city.trim(),
        category: formData.category.trim(),
        locations: JSON.stringify(locationsToSave),
        // Note: multiCityLocations and isMultiDayTour are stored in locations field for now
        // Backend schema doesn't have these fields yet, but locations JSON can handle the structure
        duration: formData.duration.trim(),
        // Use first tier price (price for 1 person) as pricePerPerson for display - shows as "Starting from"
        pricePerPerson: formData.groupPricingTiers && formData.groupPricingTiers.length > 0 && formData.groupPricingTiers[0]?.price
          ? parseFloat(formData.groupPricingTiers[0].price)
          : null,
        currency: formData.currency,
        // Store group pricing tiers and maxGroupSize
        maxGroupSize: formData.maxGroupSize && formData.maxGroupSize >= 1 && formData.maxGroupSize <= 20 ? formData.maxGroupSize : null,
        groupPrice: formData.groupPricingTiers && formData.groupPricingTiers.length > 0
          ? parseFloat(formData.groupPricingTiers[formData.groupPricingTiers.length - 1].price || '0')
          : null,
        groupPricingTiers: formData.groupPricingTiers && formData.groupPricingTiers.length > 0
          ? JSON.stringify(formData.groupPricingTiers)
          : null,
        unavailableDates: formData.unavailableDates && formData.unavailableDates.length > 0 ? JSON.stringify(formData.unavailableDates) : null, // Legacy
        unavailableDaysOfWeek: formData.unavailableDaysOfWeek && formData.unavailableDaysOfWeek.length > 0 ? JSON.stringify(formData.unavailableDaysOfWeek) : null,
        shortDescription: formData.shortDescription?.trim() || null,
        fullDescription: formData.fullDescription.trim(),
        highlights: JSON.stringify(formData.highlights.filter(h => h.trim()).map(h => h.trim())), // Filter empty and trim each highlight
        included: formData.included.trim(),
        notIncluded: formData.notIncluded?.trim() || null,
        meetingPoint: formData.meetingPoint?.trim() || null,
        images: JSON.stringify(imageUrls), // Use uploaded URLs or original base64
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

          // Use first tier price (price for 1 person) as base price for display
          const hasGroupPricingTiers = cleanOpt.groupPricingTiers && Array.isArray(cleanOpt.groupPricingTiers) && cleanOpt.groupPricingTiers.length > 0;

          // CRITICAL: If option doesn't have its own groupPricingTiers, inherit from main tour
          let optionGroupPricingTiers = cleanOpt.groupPricingTiers;
          if (!hasGroupPricingTiers && formData.groupPricingTiers && Array.isArray(formData.groupPricingTiers) && formData.groupPricingTiers.length > 0) {
            console.log(`Option ${idx + 1} inheriting main tour groupPricingTiers`);
            optionGroupPricingTiers = formData.groupPricingTiers;
          }

          const finalHasGroupPricingTiers = optionGroupPricingTiers && Array.isArray(optionGroupPricingTiers) && optionGroupPricingTiers.length > 0;

          const optionPrice = finalHasGroupPricingTiers && optionGroupPricingTiers.length > 0
            ? parseFloat(optionGroupPricingTiers[0].price || '0')
            : (formData.groupPricingTiers && formData.groupPricingTiers.length > 0
              ? parseFloat(formData.groupPricingTiers[0].price || '0')
              : 0);

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
            groupPrice: finalHasGroupPricingTiers && optionGroupPricingTiers.length > 0
              ? parseFloat(optionGroupPricingTiers[optionGroupPricingTiers.length - 1].price || '0')
              : null,
            // CRITICAL: Always include groupPricingTiers - either option's own or inherited from main tour
            groupPricingTiers: finalHasGroupPricingTiers ? JSON.stringify(optionGroupPricingTiers) : (formData.groupPricingTiers && formData.groupPricingTiers.length > 0 ? JSON.stringify(formData.groupPricingTiers) : null),
            sortOrder: idx
          };

          // CRITICAL: Final check - ensure pricingType is NOT in return object
          delete returnOpt.pricingType;
          delete returnOpt.pricing_type;

          return returnOpt;
        })
      };

      // Calculate payload size for debugging (should be much smaller now with URLs)
      const payloadString = JSON.stringify(tourData);
      const payloadSizeMB = (new Blob([payloadString]).size / (1024 * 1024)).toFixed(2);
      const imageCount = imageUrls.length;
      const usingUrls = imageUrls.some(url => url.startsWith('http'));

      // Debug: Log what we're sending
      console.log('📤 Preparing tour data:', {
        supplierId,
        title: formData.title,
        country: formData.country,
        city: formData.city,
        category: formData.category,
        locationsCount: formData.locations.length,
        imagesCount: imageCount,
        payloadSize: `${payloadSizeMB} MB`,
        usingCloudinaryUrls: usingUrls,
        languagesCount: formData.languages.length,
        hasFullDescription: !!formData.fullDescription,
        hasIncluded: !!formData.included,
        highlightsCount: formData.highlights.filter(h => h.trim()).length,
        tourOptionsCount: formData.tourOptions.length,
        isEditing,
        submitForReview,
        url: isEditing ? `${API_URL}/api/tours/${tour.id}` : `${API_URL}/api/tours`,
        method: isEditing ? 'PUT' : 'POST'
      });

      const url = isEditing ? `${API_URL}/api/tours/${tour.id}` : `${API_URL}/api/tours`;
      const method = isEditing ? 'PUT' : 'POST';

      // Serialize JSON (should be fast now with URLs instead of base64)
      console.log('⏳ Serializing tour data...');
      const serializeStartTime = Date.now();
      let requestBody: string;
      try {
        requestBody = JSON.stringify(tourData);
        const serializeTime = Date.now() - serializeStartTime;
        console.log(`✅ Data serialized in ${serializeTime}ms (${payloadSizeMB} MB)`);
      } catch (serializeError: any) {
        console.error('❌ Failed to serialize tour data:', serializeError);
        setSubmissionStatus('');
        throw new Error('Failed to prepare tour data. Please try again.');
      }

      // Send request (should be much faster now)
      setSubmissionStatus('Sending tour data to server...');
      console.log('⏳ Sending tour data to server...');
      const sendStartTime = Date.now();

      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      let response;
      try {
        response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: requestBody,
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        const sendTime = Date.now() - sendStartTime;
        console.log(`✅ Request sent and response received in ${sendTime}ms`);
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

      // Step 3: Parse response
      console.log('⏳ Step 3/3: Processing server response...');
      const parseStartTime = Date.now();
      const data = await response.json();
      const parseTime = Date.now() - parseStartTime;
      console.log(`✅ Response parsed in ${parseTime}ms`);

      console.log('✅ Tour create/update data:', {
        success: data.success,
        tourId: data.tour?.id,
        message: data.message,
        fullData: data
      });

      if (data.success) {
        // Extract tour ID - handle both data.tour.id and data.tourId formats
        const tourId = data.tour?.id || data.tourId;

        if (!tourId) {
          console.error('❌ No tour ID in response:', data);
          throw new Error('Tour was created but no tour ID was returned. Please check your dashboard.');
        }

        console.log('📋 Extracted tour ID:', tourId);

        if (isEditing && submitForReview) {
          // Tour edited and needs to be submitted for review
          console.log('📤 Tour updated, now submitting for review...', { tourId });

          const submitController = new AbortController();
          const submitTimeoutId = setTimeout(() => submitController.abort(), 30000); // 30 second timeout

          let submitResponse;
          try {
            console.log(`📤 Calling submit endpoint: ${API_URL}/api/tours/${tourId}/submit`);
            submitResponse = await fetch(`${API_URL}/api/tours/${tourId}/submit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: submitController.signal
            });
            clearTimeout(submitTimeoutId);
            console.log('✅ Submit response received:', { status: submitResponse.status, ok: submitResponse.ok });
          } catch (submitFetchError: any) {
            clearTimeout(submitTimeoutId);
            console.error('❌ Submit fetch error:', {
              name: submitFetchError.name,
              message: submitFetchError.message,
              error: submitFetchError
            });
            if (submitFetchError.name === 'AbortError') {
              throw new Error('Submission request timed out. The tour was updated but may not have been submitted for review. Please check your dashboard.');
            }
            if (submitFetchError.message?.includes('Failed to fetch') || submitFetchError.message?.includes('ERR_CONNECTION_REFUSED')) {
              throw new Error('Cannot connect to server. Please ensure the backend server is running and try again.');
            }
            throw submitFetchError;
          }

          if (!submitResponse.ok) {
            const submitErrorData = await submitResponse.json().catch(() => ({ message: 'Failed to submit tour' }));
            console.error('❌ Submit response not OK:', { status: submitResponse.status, error: submitErrorData });
            throw new Error(submitErrorData.message || submitErrorData.error || 'Failed to submit tour for review');
          }

          const submitData = await submitResponse.json();
          console.log('✅ Submit data received:', submitData);
          if (submitData.success) {
            alert('Tour updated and submitted for review! We\'ll review it within 24-48 hours.');
            onSuccess();
            onClose();
          } else {
            throw new Error(submitData.message || submitData.error || 'Failed to submit tour for review');
          }
        } else if (isEditing) {
          // Tour edited successfully - status remains unchanged (approved stays approved)
          alert('Tour updated successfully!');
          onSuccess();
          onClose();
        } else if (submitForReview) {
          // Submit for review
          setSubmissionStatus('Submitting tour for review...');
          console.log('📤 Submitting new tour for review...', { tourId });

          const submitController = new AbortController();
          const submitTimeoutId = setTimeout(() => submitController.abort(), 30000); // 30 second timeout

          let submitResponse;
          try {
            console.log(`📤 Calling submit endpoint: ${API_URL}/api/tours/${tourId}/submit`);
            submitResponse = await fetch(`${API_URL}/api/tours/${tourId}/submit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: submitController.signal
            });
            clearTimeout(submitTimeoutId);
            console.log('✅ Submit response received:', { status: submitResponse.status, ok: submitResponse.ok });
          } catch (submitFetchError: any) {
            clearTimeout(submitTimeoutId);
            console.error('❌ Submit fetch error:', {
              name: submitFetchError.name,
              message: submitFetchError.message,
              error: submitFetchError
            });
            if (submitFetchError.name === 'AbortError') {
              throw new Error('Submission request timed out. The tour was created but may not have been submitted for review. Please check your dashboard.');
            }
            if (submitFetchError.message?.includes('Failed to fetch') || submitFetchError.message?.includes('ERR_CONNECTION_REFUSED')) {
              throw new Error('Cannot connect to server. Please ensure the backend server is running and try again.');
            }
            throw submitFetchError;
          }

          if (!submitResponse.ok) {
            const submitErrorData = await submitResponse.json().catch(() => ({ message: 'Failed to submit tour' }));
            console.error('❌ Submit response not OK:', { status: submitResponse.status, error: submitErrorData });
            throw new Error(submitErrorData.message || submitErrorData.error || 'Failed to submit tour for review');
          }

          const submitData = await submitResponse.json();
          console.log('✅ Submit data received:', submitData);
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
        setSubmissionStatus('');
        throw new Error(data.message || data.error || (isEditing ? 'Failed to update tour' : 'Failed to create tour'));
      }
    } catch (error: any) {
      setSubmissionStatus('');
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
      setSubmissionStatus('');
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
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${formData.category === 'Entry Ticket'
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
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${formData.category === 'Guided Tour'
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

              {/* Multi-Day Tour Checkbox */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMultiDayTour}
                    onChange={(e) => {
                      handleInputChange('isMultiDayTour', e.target.checked);
                      if (!e.target.checked) {
                        // Clear multi-city data when unchecked
                        handleInputChange('multiCityLocations', {});
                      }
                    }}
                    className="w-5 h-5 text-[#10B981] rounded border-gray-300 focus:ring-[#10B981]"
                  />
                  <div>
                    <span className="text-[14px] font-bold text-[#001A33]">Multi-Day Tour</span>
                    <p className="text-[12px] text-gray-600 font-semibold mt-1">
                      Check this if your tour visits multiple cities/locations across different days
                    </p>
                  </div>
                </label>
              </div>

              {/* Multi-Day Tour: Multiple Cities Selection */}
              {formData.isMultiDayTour ? (
                <div>
                  <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                    Select Cities & Locations * (Choose multiple cities and their locations)
                  </label>
                  <div className="space-y-4">
                    {/* City Selector */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#001A33] mb-2">
                        Add City
                      </label>
                      <select
                        value=""
                        onChange={(e) => {
                          const selectedCity = e.target.value;
                          if (selectedCity && !formData.multiCityLocations[selectedCity]) {
                            setFormData(prev => ({
                              ...prev,
                              multiCityLocations: {
                                ...prev.multiCityLocations,
                                [selectedCity]: []
                              }
                            }));
                            e.target.value = '';
                          }
                        }}
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                      >
                        <option value="">Select a city to add...</option>
                        {formData.country && COUNTRY_CITIES[formData.country]?.filter(city => !formData.multiCityLocations[city]).map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>

                    {/* Selected Cities and Their Locations */}
                    {Object.keys(formData.multiCityLocations).length > 0 && (
                      <div className="space-y-4">
                        {Object.keys(formData.multiCityLocations).map((city) => (
                          <div key={city} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-black text-[#001A33] text-[16px]">{city}</h4>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData(prev => {
                                    const newMultiCity = { ...prev.multiCityLocations };
                                    delete newMultiCity[city];
                                    return { ...prev, multiCityLocations: newMultiCity };
                                  });
                                }}
                                className="p-1 hover:bg-red-100 rounded-full text-red-600"
                              >
                                <X size={16} />
                              </button>
                            </div>
                            {CITY_LOCATIONS[city] ? (
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {CITY_LOCATIONS[city].slice(0, 10).map((location) => {
                                  const isSelected = formData.multiCityLocations[city]?.includes(location);
                                  return (
                                    <button
                                      key={location}
                                      type="button"
                                      onClick={() => {
                                        setFormData(prev => {
                                          const cityLocs = prev.multiCityLocations[city] || [];
                                          const newLocs = isSelected
                                            ? cityLocs.filter(l => l !== location)
                                            : [...cityLocs, location];
                                          return {
                                            ...prev,
                                            multiCityLocations: {
                                              ...prev.multiCityLocations,
                                              [city]: newLocs
                                            }
                                          };
                                        });
                                      }}
                                      className={`p-2 rounded-lg border-2 text-[12px] font-semibold transition-all ${isSelected
                                        ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                                        : 'border-gray-200 hover:border-[#10B981]/50 text-[#001A33]'
                                        }`}
                                    >
                                      {location}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="text-[12px] text-gray-500 font-semibold">Location list for {city} coming soon</p>
                            )}
                            {formData.multiCityLocations[city]?.length > 0 && (
                              <p className="text-[12px] text-[#10B981] font-bold mt-2">
                                ✓ {formData.multiCityLocations[city].length} location{formData.multiCityLocations[city].length > 1 ? 's' : ''} selected
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Regular Single City Location Selection */
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
                              className={`relative p-4 bg-white rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${isSelected
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
              )}

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

              {/* Entry Ticket Options for Selected Locations - Only for single city tours */}
              {!formData.isMultiDayTour && formData.locations.length > 0 && (
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

              {/* Pricing Type - Always Per Group */}
              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Pricing Type *
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <span className="text-[14px] font-semibold text-[#001A33]">Per Group</span>
                </div>
                <p className="text-[12px] text-[#10B981] font-semibold mt-2">
                  ✓ All tours use per group pricing. This tour will be automatically labeled as "Group Tour"
                </p>
              </div>

              {/* Simplified Pricing - Single Price for Max Group Size */}
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
                      }}
                      placeholder="e.g., 10"
                      min="1"
                      max="20"
                      className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Maximum number of people you can guide in a day
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

                {/* Pricing for Each Group Size */}
                {formData.maxGroupSize && formData.maxGroupSize >= 1 && formData.maxGroupSize <= 20 && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="block text-[14px] font-bold text-[#001A33] mb-1">
                          Set Price for Each Group Size *
                        </label>
                        <p className="text-[11px] text-gray-500">
                          Enter price for 1 person, then we'll suggest prices for others. You can adjust manually.
                        </p>
                      </div>
                      {formData.groupPricingTiers && formData.groupPricingTiers.length > 0 && formData.groupPricingTiers[0]?.price && (
                        <button
                          type="button"
                          onClick={() => {
                            const priceForOne = parseFloat(formData.groupPricingTiers[0].price);
                            if (!isNaN(priceForOne) && priceForOne > 0) {
                              // Auto-fill: Use a simple multiplier (each additional person adds 80% of base price)
                              // This gives discounts for larger groups
                              const newTiers = Array.from({ length: formData.maxGroupSize }, (_, i) => {
                                const numPeople = i + 1;
                                // Calculate: base price + (additional people * 0.8 * base price)
                                // Example: ₹500 for 1, ₹900 for 2, ₹1300 for 3, etc.
                                const calculatedPrice = numPeople === 1
                                  ? priceForOne
                                  : Math.round(priceForOne + (numPeople - 1) * priceForOne * 0.8);

                                return {
                                  minPeople: numPeople,
                                  maxPeople: numPeople,
                                  price: calculatedPrice.toString()
                                };
                              });

                              setFormData(prev => ({
                                ...prev,
                                groupPricingTiers: newTiers
                              }));
                            }
                          }}
                          className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg text-[12px] font-bold hover:bg-[#059669] transition-colors"
                        >
                          Auto-Fill All
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {Array.from({ length: formData.maxGroupSize }, (_, i) => i + 1).map((numPeople) => {
                        // Find existing tier for this number of people, or create a new one
                        const existingTier = formData.groupPricingTiers?.find(
                          tier => tier.minPeople === numPeople && tier.maxPeople === numPeople
                        );
                        const price = existingTier?.price || '';

                        // Calculate suggested price based on price for 1 person
                        const priceForOne = formData.groupPricingTiers?.find(t => t.minPeople === 1)?.price;
                        const suggestedPrice = priceForOne && numPeople > 1 && !price
                          ? Math.round(parseFloat(priceForOne) + (numPeople - 1) * parseFloat(priceForOne) * 0.8)
                          : null;

                        return (
                          <div key={numPeople} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                            <div className="w-24 flex-shrink-0">
                              <span className="text-[14px] font-bold text-[#001A33]">
                                {numPeople} {numPeople === 1 ? 'person' : 'people'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-[14px] font-semibold text-gray-600">
                                {formData.currency === 'INR' ? '₹' : '$'}
                              </span>
                              <input
                                type="number"
                                value={price}
                                onChange={(e) => {
                                  const newPrice = e.target.value;
                                  setFormData(prev => {
                                    const newTiers = [...(prev.groupPricingTiers || [])];
                                    const tierIndex = newTiers.findIndex(
                                      t => t.minPeople === numPeople && t.maxPeople === numPeople
                                    );

                                    if (newPrice) {
                                      const tier = { minPeople: numPeople, maxPeople: numPeople, price: newPrice };
                                      if (tierIndex >= 0) {
                                        newTiers[tierIndex] = tier;
                                      } else {
                                        newTiers.push(tier);
                                      }
                                    } else {
                                      // Remove tier if price is cleared
                                      if (tierIndex >= 0) {
                                        newTiers.splice(tierIndex, 1);
                                      }
                                    }

                                    // Sort by minPeople
                                    newTiers.sort((a, b) => a.minPeople - b.minPeople);

                                    return {
                                      ...prev,
                                      groupPricingTiers: newTiers
                                    };
                                  });
                                }}
                                placeholder={suggestedPrice ? `Suggested: ${suggestedPrice}` : "Enter price"}
                                min="0"
                                step="0.01"
                                className="flex-1 bg-white border border-gray-300 rounded-xl py-2 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                              />
                              {suggestedPrice && !price && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => {
                                      const newTiers = [...(prev.groupPricingTiers || [])];
                                      const tierIndex = newTiers.findIndex(
                                        t => t.minPeople === numPeople && t.maxPeople === numPeople
                                      );

                                      const tier = { minPeople: numPeople, maxPeople: numPeople, price: suggestedPrice.toString() };
                                      if (tierIndex >= 0) {
                                        newTiers[tierIndex] = tier;
                                      } else {
                                        newTiers.push(tier);
                                      }

                                      newTiers.sort((a, b) => a.minPeople - b.minPeople);

                                      return {
                                        ...prev,
                                        groupPricingTiers: newTiers
                                      };
                                    });
                                  }}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[11px] font-semibold hover:bg-blue-200 transition-colors"
                                >
                                  Use {suggestedPrice}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {formData.groupPricingTiers && formData.groupPricingTiers.length > 0 && formData.groupPricingTiers[0]?.price && (
                      <p className="text-[11px] text-green-600 font-semibold mt-2">
                        ✓ Main card will show: "Starting from {formData.currency === 'INR' ? '₹' : '$'}{formData.groupPricingTiers[0].price}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Availability - Days of Week Guide is NOT Available */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Days of Week You Are Not Available
                </label>
                <p className="text-[11px] text-gray-500 mb-3">
                  Select days of the week when you cannot guide tours (e.g., every Monday, every weekend)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 0, label: 'Sunday' },
                    { value: 1, label: 'Monday' },
                    { value: 2, label: 'Tuesday' },
                    { value: 3, label: 'Wednesday' },
                    { value: 4, label: 'Thursday' },
                    { value: 5, label: 'Friday' },
                    { value: 6, label: 'Saturday' }
                  ].map((day) => {
                    const isSelected = formData.unavailableDaysOfWeek.includes(day.value);
                    return (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => {
                          setFormData(prev => {
                            const currentDays = prev.unavailableDaysOfWeek || [];
                            if (isSelected) {
                              return {
                                ...prev,
                                unavailableDaysOfWeek: currentDays.filter(d => d !== day.value)
                              };
                            } else {
                              return {
                                ...prev,
                                unavailableDaysOfWeek: [...currentDays, day.value].sort()
                              };
                            }
                          });
                        }}
                        className={`p-3 rounded-xl border-2 transition-all text-[13px] font-semibold ${isSelected
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-red-300 text-gray-700 bg-white'
                          }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
                {formData.unavailableDaysOfWeek.length > 0 && (
                  <p className="text-[11px] text-red-600 font-semibold mt-3">
                    ⚠️ You will not be available on: {formData.unavailableDaysOfWeek
                      .sort()
                      .map(d => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d])
                      .join(', ')}
                  </p>
                )}
              </div>

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
                        className={`p-3 rounded-xl border-2 transition-all text-left text-[13px] font-semibold ${isSelected
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

        {/* Step 5: Description & Details */}
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
                        spellCheck={true}
                        autoComplete="off"
                        autoCorrect="on"
                        autoCapitalize="words"
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
                  spellCheck={true}
                  autoComplete="off"
                  autoCorrect="on"
                  autoCapitalize="sentences"
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
                  spellCheck={true}
                  autoComplete="off"
                  autoCorrect="on"
                  autoCapitalize="sentences"
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

        {/* Step 7: Tour Options */}
        {step === 7 && (
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
                      price: formData.groupPricingTiers && formData.groupPricingTiers.length > 0
                        ? formData.groupPricingTiers[0].price
                        : '',
                      currency: formData.currency,
                      language: formData.languages[0] || 'English',
                      pickupIncluded: false,
                      carIncluded: false,
                      entryTicketIncluded: false,
                      guideIncluded: true,
                      pricingType: 'per_group' as const, // Always per group
                      maxGroupSize: formData.maxGroupSize || undefined,
                      groupPrice: '',
                      groupPricingTiers: [] // Will be filled when supplier enters prices
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
                      </div>

                      {/* Pricing Type Selection - Always Per Group */}
                      <div>
                        <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                          Pricing Type *
                        </label>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          <span className="text-[14px] font-semibold text-[#001A33]">Per Group</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                          All options use per group pricing
                        </p>
                      </div>

                      {/* Pricing for Each Group Size */}
                      <div className="bg-green-50 p-4 rounded-xl border border-green-200 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                newOptions[index].maxGroupSize = maxSize;
                                // Clear pricing tiers if max size changes
                                if (!maxSize) {
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
                              Maximum number of people for this option
                            </p>
                          </div>
                          <div>
                            <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                              Currency
                            </label>
                            <select
                              value={option.currency}
                              onChange={(e) => {
                                const newOptions = [...formData.tourOptions];
                                newOptions[index].currency = e.target.value;
                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                              }}
                              className="w-full bg-white border-none rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                            >
                              <option value="INR">INR (₹)</option>
                              <option value="USD">USD ($)</option>
                            </select>
                          </div>
                        </div>

                        {/* Pricing for Each Group Size */}
                        {option.maxGroupSize && option.maxGroupSize >= 1 && option.maxGroupSize <= 20 && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <label className="block text-[14px] font-bold text-[#001A33] mb-1">
                                  Set Price for Each Group Size *
                                </label>
                                <p className="text-[11px] text-gray-500">
                                  Enter price for 1 person, then we'll suggest prices for others. You can adjust manually.
                                </p>
                              </div>
                              {(() => {
                                // Check if there's a price for 1 person in the tiers
                                const priceForOneTier = option.groupPricingTiers?.find((t: any) => t.minPeople === 1);
                                const priceForOne = priceForOneTier?.price;
                                const hasPriceForOne = priceForOne && parseFloat(priceForOne) > 0;

                                return hasPriceForOne ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const priceForOneValue = parseFloat(priceForOne);
                                      if (!isNaN(priceForOneValue) && priceForOneValue > 0) {
                                        const newOptions = [...formData.tourOptions];
                                        const newTiers = Array.from({ length: option.maxGroupSize }, (_, i) => {
                                          const numPeople = i + 1;
                                          // Calculate: base price + (additional people * 0.8 * base price)
                                          // Example: ₹500 for 1, ₹900 for 2, ₹1300 for 3, etc.
                                          const calculatedPrice = numPeople === 1
                                            ? priceForOneValue
                                            : Math.round(priceForOneValue + (numPeople - 1) * priceForOneValue * 0.8);

                                          return {
                                            minPeople: numPeople,
                                            maxPeople: numPeople,
                                            price: calculatedPrice.toString()
                                          };
                                        });

                                        newOptions[index].groupPricingTiers = newTiers;
                                        setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                      }
                                    }}
                                    className="px-3 py-1.5 bg-[#10B981] text-white rounded-lg text-[12px] font-bold hover:bg-[#059669] transition-colors"
                                  >
                                    Auto-Fill All
                                  </button>
                                ) : null;
                              })()}
                            </div>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {Array.from({ length: option.maxGroupSize }, (_, i) => i + 1).map((numPeople) => {
                                const existingTier = option.groupPricingTiers?.find(
                                  (tier: any) => tier.minPeople === numPeople && tier.maxPeople === numPeople
                                );
                                const price = existingTier?.price || '';

                                // Calculate suggested price based on price for 1 person
                                const priceForOne = option.groupPricingTiers?.find((t: any) => t.minPeople === 1)?.price;
                                const suggestedPrice = priceForOne && numPeople > 1 && !price
                                  ? Math.round(parseFloat(priceForOne) + (numPeople - 1) * parseFloat(priceForOne) * 0.8)
                                  : null;

                                return (
                                  <div key={numPeople} className="flex items-center gap-3 bg-white rounded-xl p-2 border border-gray-200">
                                    <div className="w-20 flex-shrink-0">
                                      <span className="text-[13px] font-bold text-[#001A33]">
                                        {numPeople} {numPeople === 1 ? 'person' : 'people'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="text-[13px] font-semibold text-gray-600">
                                        {option.currency === 'INR' ? '₹' : '$'}
                                      </span>
                                      <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => {
                                          const newPrice = e.target.value;
                                          const newOptions = [...formData.tourOptions];
                                          const tiers = [...(option.groupPricingTiers || [])];
                                          const tierIndex = tiers.findIndex(
                                            (t: any) => t.minPeople === numPeople && t.maxPeople === numPeople
                                          );

                                          if (newPrice) {
                                            const tier = { minPeople: numPeople, maxPeople: numPeople, price: newPrice };
                                            if (tierIndex >= 0) {
                                              tiers[tierIndex] = tier;
                                            } else {
                                              tiers.push(tier);
                                            }
                                          } else {
                                            if (tierIndex >= 0) {
                                              tiers.splice(tierIndex, 1);
                                            }
                                          }

                                          tiers.sort((a: any, b: any) => a.minPeople - b.minPeople);
                                          newOptions[index].groupPricingTiers = tiers;
                                          setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                        }}
                                        placeholder={suggestedPrice ? `Suggested: ${suggestedPrice}` : "Enter price"}
                                        min="0"
                                        step="0.01"
                                        className="flex-1 bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 font-bold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none"
                                      />
                                      {suggestedPrice && !price && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newOptions = [...formData.tourOptions];
                                            const tiers = [...(option.groupPricingTiers || [])];
                                            const tierIndex = tiers.findIndex(
                                              (t: any) => t.minPeople === numPeople && t.maxPeople === numPeople
                                            );

                                            const tier = { minPeople: numPeople, maxPeople: numPeople, price: suggestedPrice.toString() };
                                            if (tierIndex >= 0) {
                                              tiers[tierIndex] = tier;
                                            } else {
                                              tiers.push(tier);
                                            }

                                            tiers.sort((a: any, b: any) => a.minPeople - b.minPeople);
                                            newOptions[index].groupPricingTiers = tiers;
                                            setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                          }}
                                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-semibold hover:bg-blue-200 transition-colors"
                                        >
                                          Use {suggestedPrice}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

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
                      price: formData.groupPricingTiers && formData.groupPricingTiers.length > 0
                        ? formData.groupPricingTiers[0].price
                        : '',
                      currency: formData.currency,
                      language: formData.languages[0] || 'English',
                      pickupIncluded: false,
                      carIncluded: false,
                      entryTicketIncluded: false,
                      guideIncluded: true,
                      pricingType: 'per_group' as const, // Always per group
                      maxGroupSize: formData.maxGroupSize || undefined,
                      groupPrice: '',
                      groupPricingTiers: [] // Will be filled when supplier enters prices
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

        {/* Step 6: Photos & Languages */}
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
                    const isPerGroup = formData.pricingType === 'per_group';
                    const isPerPerson = formData.pricingType === 'per_person';
                    // Check if group pricing tiers exist (most specific)
                    const hasGroupPricingTiers = formData.groupPricingTiers && formData.groupPricingTiers.length > 0;
                    // Check if legacy group pricing exists
                    const hasLegacyGroupPricing = formData.groupPrice && formData.maxGroupSize;
                    // Check if per person pricing exists
                    const hasPerPersonPricing = formData.pricePerPerson && formData.pricePerPerson.trim() !== '';

                    // Show group pricing only when Per Group is selected
                    if (isPerGroup && (hasGroupPricingTiers || hasLegacyGroupPricing)) {
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

                    // Show per person pricing only when Per Person is selected
                    if (isPerPerson && hasPerPersonPricing) {
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
                    {formData.images && formData.images.length >= 4 && (
                      <div className="text-[13px] text-gray-600 mt-2 mb-2">
                        💡 <strong>Note:</strong> Submission may take 10-30 seconds because we're uploading {formData.images.length} images. Please be patient and don't close this page.
                      </div>
                    )}
                    <div className="text-[14px] text-[#001A33] font-semibold leading-relaxed">
                      Once submitted, your listing will be reviewed within 24–48 hours. You can make edits later.
                    </div>
                    {formData.images && formData.images.length >= 4 && (
                      <div className="text-[13px] text-gray-600 mt-3 p-3 bg-white rounded-lg border border-yellow-300">
                        <strong>⏱️ Submission Time:</strong> With {formData.images.length} images, submission may take 10-30 seconds. This is normal - we're uploading your images. Please don't close this page.
                      </div>
                    )}
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
              {/* Debug info - remove after fixing */}
              {process.env.NODE_ENV === 'development' && (
                <div className="absolute bottom-20 left-4 bg-black text-white text-xs p-2 rounded z-50">
                  Debug: canProceed={canProceed() ? 'true' : 'false'},
                  hasContact={hasRequiredContactInfo ? 'true' : 'false'},
                  isSubmitting={isSubmitting ? 'true' : 'false'}
                </div>
              )}
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
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔵 Submit for Review button CLICKED!', {
                      isSubmitting,
                      canProceed: canProceed(),
                      hasRequiredContactInfo,
                      step,
                      totalSteps,
                      isEditing,
                      tourId: tour?.id,
                      pricingType: formData.pricingType,
                      hasGroupPricingTiers: formData.groupPricingTiers?.length > 0,
                      hasPerPersonPricing: !!formData.pricePerPerson,
                      supplierEmail,
                      supplierPhone,
                      supplierWhatsApp,
                      buttonDisabled: isSubmitting || !canProceed() || !hasRequiredContactInfo
                    });

                    // Force alert to confirm click is registered
                    if (!isSubmitting && canProceed() && hasRequiredContactInfo) {
                      console.log('✅ All checks passed, calling handleSubmit(true)...');
                      handleSubmit(true).catch(err => {
                        console.error('❌ handleSubmit error:', err);
                        alert(`Error: ${err.message || 'Failed to submit tour'}`);
                      });
                    } else {
                      console.warn('⚠️ Button click blocked:', {
                        isSubmitting,
                        canProceed: canProceed(),
                        hasRequiredContactInfo
                      });
                      if (!hasRequiredContactInfo) {
                        alert('Please complete your profile details first.');
                      } else if (!canProceed()) {
                        alert('Please complete all required fields before submitting.');
                      }
                    }
                  }}
                  disabled={isSubmitting || !canProceed() || !hasRequiredContactInfo}
                  className={`px-6 py-3 font-black rounded-full text-[14px] transition-all flex items-center gap-2 ${isSubmitting || !canProceed() || !hasRequiredContactInfo
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-[#10B981] hover:bg-[#059669] text-white cursor-pointer'
                    }`}
                  title={
                    !hasRequiredContactInfo
                      ? 'Complete profile first'
                      : !canProceed()
                        ? 'Complete all required fields'
                        : isSubmitting
                          ? 'Submitting...'
                          : 'Submit tour for admin review'
                  }
                  style={{
                    pointerEvents: (isSubmitting || !canProceed() || !hasRequiredContactInfo) ? 'none' : 'auto',
                    position: 'relative',
                    zIndex: 10
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      {submissionStatus || 'Submitting...'}
                      <span className="animate-spin">⏳</span>
                    </span>
                  ) : (
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

