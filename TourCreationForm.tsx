import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, ChevronDown, Upload, ArrowUp, ArrowDown, Trash2, CheckCircle2, AlertCircle, Phone, Mail, Plus, MapPin, Clock, Shield, Info, Car, Landmark, UtensilsCrossed, Star, CircleDot, Flag, FileText, Sparkles, PenLine, Loader2, Lightbulb } from 'lucide-react';
import { CITY_LOCATIONS, TRANSPORTATION_TYPES, ENTRY_TICKET_OPTIONS, EntryTicketOption } from './constants';
import { COUNTRIES, COUNTRY_CITIES } from './src/locations';

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
// Countries and cities data imported from src/locations.ts

// CITY_LOCATIONS is now imported from constants.tsx to keep it in sync with CityPage

const DURATION_OPTIONS = [
  '2 hours',
  '3 hours',
  '4 hours',
  '6 hours',
  '8 hours',
  '10 hours',
  '12 hours',
  '1 day',
  '2 days',
  '3 days',
  '4 days',
  '5 days',
  '6 days',
  '7 days',
  '8 days',
  '9 days',
  '10 days',
  '11 days',
  '12 days',
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
  const [showDurationError, setShowDurationError] = useState(false);
  const [showGroupSizeError, setShowGroupSizeError] = useState(false);
  const [showPricingError, setShowPricingError] = useState(false);
  const [showCountryError, setShowCountryError] = useState(false);
  const [showCityError, setShowCityError] = useState(false);
  const [showCategoryError, setShowCategoryError] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);
  const [showLocationsError, setShowLocationsError] = useState(false);
  const [showEntryTicketError, setShowEntryTicketError] = useState(false);
  const [showIncludedError, setShowIncludedError] = useState(false);
  const [showItineraryItemsError, setShowItineraryItemsError] = useState(false);
  const [showDetailedItineraryError, setShowDetailedItineraryError] = useState(false);
  const [showLanguagesError, setShowLanguagesError] = useState(false);
  const [itineraryMode, setItineraryMode] = useState<'choose' | 'manual' | 'ai'>('choose');
  const [aiCurrentQuestion, setAiCurrentQuestion] = useState(0);
  const [aiAnswers, setAiAnswers] = useState<Record<number, string>>({});
  const [aiGenerating, setAiGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string>('');
  // Track the tour ID after a draft has been saved so we can update (not create) on subsequent saves
  const [draftTourId, setDraftTourId] = useState<number | null>(tour?.id || null);
  const [draftSaveToast, setDraftSaveToast] = useState<string | null>(null);
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
      // CRITICAL: Extract groupPricingTiers from tour options if not on tour itself
      // Most tours store pricing on the main tour option (sortOrder: -1 or 0), not on the tour model
      let groupPricingTiers = tour.groupPricingTiers
        ? (typeof tour.groupPricingTiers === 'string' ? JSON.parse(tour.groupPricingTiers) : tour.groupPricingTiers)
        : [];

      let maxGroupSize = tour.maxGroupSize || undefined;

      // If groupPricingTiers is empty, try to extract from tour options
      if ((!groupPricingTiers || groupPricingTiers.length === 0) && tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
        // Try main tour option first (sortOrder: -1), then sortOrder 0, then first option
        const mainOption = tour.options.find((o: any) => o.sortOrder === -1)
          || tour.options.find((o: any) => o.sortOrder === 0)
          || tour.options[0];

        if (mainOption?.groupPricingTiers) {
          const optionTiers = typeof mainOption.groupPricingTiers === 'string'
            ? JSON.parse(mainOption.groupPricingTiers)
            : mainOption.groupPricingTiers;
          if (Array.isArray(optionTiers) && optionTiers.length > 0) {
            groupPricingTiers = optionTiers;
            console.log('✅ Extracted groupPricingTiers from tour option:', optionTiers.length, 'tiers');
          }
        }

        // Also extract maxGroupSize from option if not on tour
        if (!maxGroupSize && mainOption?.maxGroupSize) {
          maxGroupSize = mainOption.maxGroupSize;
        }
      }

      // If still no maxGroupSize, derive from groupPricingTiers
      if (!maxGroupSize && groupPricingTiers.length > 0) {
        maxGroupSize = Math.max(...groupPricingTiers.map((t: any) => t.maxPeople || 0));
        console.log('✅ Derived maxGroupSize from tiers:', maxGroupSize);
      }

      return {
        country: tour.country || '',
        city: tour.city || '',
        category: tour.category || '',
        title: tour.title || '',
        locations: Array.isArray(tour.locations) ? tour.locations : (typeof tour.locations === 'string' ? JSON.parse(tour.locations || '[]') : []),
        duration: tour.duration || '',
        pricePerPerson: tour.pricePerPerson?.toString() || '',
        pricingType: 'per_group' as const, // Always per group now
        maxGroupSize: maxGroupSize,
        groupPrice: tour.groupPrice?.toString() || '',
        groupPricingTiers: groupPricingTiers,
        unavailableDates: tour.unavailableDates ? (typeof tour.unavailableDates === 'string' ? JSON.parse(tour.unavailableDates) : tour.unavailableDates) : [], // Legacy
        unavailableDaysOfWeek: tour.unavailableDaysOfWeek ? (typeof tour.unavailableDaysOfWeek === 'string' ? JSON.parse(tour.unavailableDaysOfWeek) : tour.unavailableDaysOfWeek) : (tour.unavailableDaysOfWeek ? [] : []),
        currency: tour.currency || 'USD',
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
        pickupIncluded: tour.pickupIncluded || false,
        // Filter out system-generated "main tour option" (sortOrder -1 or sortOrder 0 with same title as tour)
        // The backend auto-creates these to store pricing data — they are NOT user-created options
        // Use case-insensitive + trimmed comparison to handle title changes on old live tours
        tourOptions: (tour.options || []).filter((o: any) => {
          if (o.sortOrder === -1) return false; // Always filter main tour option (current system)
          // Filter old-style system options at sortOrder 0: compare titles case-insensitively
          if (o.sortOrder === 0) {
            const normalize = (s: string) => (s || '').toLowerCase().trim();
            if (normalize(o.optionTitle) === normalize(tour.title)) return false;
          }
          return true;
        }).map((o: any) => ({
          ...o,
          groupPricingTiers: o.groupPricingTiers
            ? (typeof o.groupPricingTiers === 'string' ? JSON.parse(o.groupPricingTiers) : o.groupPricingTiers)
            : []
        })),
        itineraryItems: tour.itineraryItems ? (typeof tour.itineraryItems === 'string' ? JSON.parse(tour.itineraryItems) : tour.itineraryItems) : [],
        detailedItinerary: tour.detailedItinerary || ''
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
      groupPricingTiers: [] as Array<{ minPeople: number; maxPeople: number; price: string }>,
      unavailableDates: [] as string[], // Legacy - dates guide is not available
      unavailableDaysOfWeek: [] as number[], // Days of week guide is not available (0=Sunday, 1=Monday, ..., 6=Saturday)
      currency: 'USD',
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
      multiCityLocations: {} as Record<string, string[]>, // City -> locations mapping for multi-day tours
      isMultiDayTour: false,
      pickupIncluded: false,
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
      }>,
      itineraryItems: [] as Array<{ title: string; time: string; duration: string; description: string; type: 'pickup' | 'transport' | 'visit' | 'meal' | 'activity' | 'optional' | 'return'; optional: boolean }>,
      detailedItinerary: ''
    };
  });

  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);

  const totalSteps = 9;

  // Step labels for navigation
  const STEP_LABELS = [
    { num: 1, label: 'Country', short: 'Country' },
    { num: 2, label: 'City & Category', short: 'City' },
    { num: 3, label: 'Title & Locations', short: 'Locations' },
    { num: 4, label: 'Duration & Pricing', short: 'Pricing' },
    { num: 5, label: 'Description & Details', short: 'Description' },
    { num: 6, label: 'Itinerary', short: 'Itinerary' },
    { num: 7, label: 'Tour Options', short: 'Options' },
    { num: 8, label: 'Photos & Languages', short: 'Photos' },
    { num: 9, label: 'Review & Submit', short: 'Review' }
  ];

  // Check if supplier has required contact information
  const hasRequiredContactInfo = !!(supplierEmail && (supplierPhone || supplierWhatsApp));
  const missingContactInfo = [];
  if (!supplierEmail) missingContactInfo.push('Email address');
  if (!supplierPhone && !supplierWhatsApp) missingContactInfo.push('Phone or WhatsApp number');

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

  // --- AI Wizard Logic ---
  const getMajorStops = () => {
    const items = formData.itineraryItems || [];
    // Prioritize visits/activities
    const visits = items.filter(i => ['visit', 'activity', 'optional'].includes(i.type));
    if (visits.length >= 2) return [visits[0], visits[1]];
    if (visits.length === 1) return [visits[0], items.find(i => i !== visits[0] && !['pickup', 'return', 'transport'].includes(i.type)) || items[1]];

    // Fallback: exclude transport/pickup if possible
    const meaningful = items.filter(i => !['pickup', 'return', 'transport'].includes(i.type));
    return [meaningful[0] || items[1], meaningful[1] || items[2]];
  };

  const [stop1, stop2] = getMajorStops();

  // Itinerary examples by country
  const ITINERARY_EXAMPLES: Record<string, { label: string; items: any[] }> = {
    'India': {
      label: 'Agra Day Trip',
      items: [
        { title: 'Pickup location', time: '06:00', duration: '30 minutes', description: 'Pickup from your hotel or airport', type: 'pickup' as const, optional: false },
        { title: 'Car', time: '06:30', duration: '3.5 hours', description: 'Drive to Agra in private AC car', type: 'transport' as const, optional: false },
        { title: 'Taj Mahal', time: '10:00', duration: '3 hours', description: 'Visit and guided tour of the iconic Taj Mahal', type: 'visit' as const, optional: false },
        { title: 'Lunch at 5-star Hotel', time: '13:00', duration: '45 minutes', description: 'Enjoy a delicious meal at a premium restaurant', type: 'meal' as const, optional: false },
        { title: 'Agra Fort', time: '14:00', duration: '1 hour', description: 'Visit and guided tour of the historic Agra Fort', type: 'visit' as const, optional: false },
        { title: 'Baby Taj', time: '15:30', duration: '30 minutes', description: 'Visit the beautiful Tomb of Itmad-ud-Daulah', type: 'visit' as const, optional: true },
        { title: 'Car', time: '16:00', duration: '3.5 hours', description: 'Return drive to Delhi', type: 'transport' as const, optional: false },
        { title: 'Arrive back', time: '19:30', duration: '', description: 'Drop-off at your hotel or airport', type: 'return' as const, optional: false }
      ]
    },
    'Thailand': {
      label: 'Bangkok Highlights',
      items: [
        { title: 'Hotel Pickup', time: '08:30', duration: '30 minutes', description: 'Meeting at your hotel lobby in Bangkok', type: 'pickup' as const, optional: false },
        { title: 'Grand Palace', time: '09:00', duration: '2 hours', description: 'Explore the spectacular Grand Palace and Emerald Buddha', type: 'visit' as const, optional: false },
        { title: 'Wat Pho', time: '11:30', duration: '1 hour', description: 'See the famous Reclining Buddha', type: 'visit' as const, optional: false },
        { title: 'Local Thai Lunch', time: '12:30', duration: '1 hour', description: 'Authentic Thai meal near the river', type: 'meal' as const, optional: false },
        { title: 'Canal Boat Tour', time: '14:00', duration: '1.5 hours', description: 'Explore the "Venice of the East" by traditional long-tail boat', type: 'transport' as const, optional: false },
        { title: 'Wat Arun', time: '15:30', duration: '1 hour', description: 'Visit the stunning Temple of Dawn', type: 'visit' as const, optional: false },
        { title: 'Return Drop-off', time: '17:00', duration: '', description: 'Return to your hotel with memories of Bangkok', type: 'return' as const, optional: false }
      ]
    },
    'Japan': {
      label: 'Kyoto Cultural Day',
      items: [
        { title: 'Meeting at Station', time: '09:00', duration: '15 minutes', description: 'Meet your guide at Kyoto Station', type: 'pickup' as const, optional: false },
        { title: 'Fushimi Inari Shrine', time: '09:30', duration: '2 hours', description: 'Walk through the thousands of Torii gates', type: 'visit' as const, optional: false },
        { title: 'Kiyomizu-dera Temple', time: '12:00', duration: '1.5 hours', description: 'Iconic wooden temple with panoramic city views', type: 'visit' as const, optional: false },
        { title: 'Japanese Kaiseki Lunch', time: '13:30', duration: '1 hour', description: 'Traditional multi-course lunch in Gion', type: 'meal' as const, optional: false },
        { title: 'Gion District Walk', time: '14:30', duration: '1.5 hours', description: 'Explore the historic geisha district', type: 'activity' as const, optional: false },
        { title: 'Kinkaku-ji', time: '16:30', duration: '1 hour', description: 'Visit the spectacular Golden Pavilion', type: 'visit' as const, optional: false },
        { title: 'Tour Ends', time: '18:00', duration: '', description: 'Tour concludes in central Kyoto', type: 'return' as const, optional: false }
      ]
    }
  };

  const currentExample = ITINERARY_EXAMPLES[formData.country] || ITINERARY_EXAMPLES['India'];

  const aiQuestions = [
    {
      id: 0,
      question: 'What is the main title/heading for this itinerary?',
      placeholder: `e.g. ${formData.title || (formData.country === 'Thailand' ? 'Bangkok City Tour' : 'Agra Same Day Tour')} Itinerary (From ${formData.city || (formData.country === 'Thailand' ? 'Bangkok' : 'Delhi')})`,
      defaultValue: `${formData.title || (formData.country === 'Thailand' ? 'Bangkok City Tour' : 'Agra Same Day Tour')} Itinerary (From ${formData.city || (formData.country === 'Thailand' ? 'Bangkok' : 'Delhi')})`,
      hint: 'This becomes the H2 heading for SEO'
    },
    {
      id: 1,
      question: 'Describe the pickup — time, location, and vehicle type?',
      placeholder: formData.country === 'Thailand' ? 'e.g. 8:30 AM pickup from your hotel in Bangkok in a private AC SUV' : 'e.g. Early morning pickup at 6:00 AM from your hotel in Delhi/NCR in a comfortable AC sedan',
      defaultValue: formData.country === 'Thailand' ? '8:30 AM pickup from your hotel in Bangkok in a private AC SUV' : 'Early morning pickup at 6:00 AM from your hotel in Delhi/NCR in a comfortable AC sedan',
      hint: 'Include time, pickup point, and vehicle details'
    },
    {
      id: 2,
      question: 'What route do you take and how long is the drive?',
      placeholder: formData.country === 'Thailand' ? 'e.g. Direct drive to the city center, approximately 30-45 minutes depending on traffic' : 'e.g. 3.5 hour drive via Yamuna Expressway, scenic countryside views along the way',
      defaultValue: formData.country === 'Thailand' ? 'Direct drive to the city center, approximately 30-45 minutes depending on traffic' : '3.5 hour drive via Yamuna Expressway, scenic countryside views along the way',
      hint: 'Mention expressway/highway, duration, and scenery'
    },
    {
      id: 3,
      question: `Describe the first major stop — ${stop1 ? `${stop1.title} (${stop1.type})` : (formData.country === 'Thailand' ? 'Grand Palace' : 'Main Attraction')}?`,
      placeholder: `e.g. Visit ${stop1?.title || (formData.country === 'Thailand' ? 'the Grand Palace' : 'the main attraction')} — history, key highlights, time spent here`,
      defaultValue: `Visit ${stop1?.title || (formData.country === 'Thailand' ? 'the Grand Palace' : 'the main attraction')} and explore its history and key highlights.`,
      hint: 'Include history, what they\'ll see, time spent, and insider tips'
    },
    {
      id: 4,
      question: `Describe the second major stop — ${stop2 ? `${stop2.title} (${stop2.type})` : (formData.country === 'Thailand' ? 'Wat Pho' : 'Second Attraction')}?`,
      placeholder: `e.g. Explore ${stop2?.title || (formData.country === 'Thailand' ? 'Wat Pho' : 'the next site')} — architecture, cultural significance, views`,
      defaultValue: `Explore ${stop2?.title || (formData.country === 'Thailand' ? 'Wat Pho' : 'the next site')} and discover its cultural significance.`,
      hint: 'Historical significance, key highlights, approximate time'
    },
    {
      id: 5,
      question: 'What are the meal/lunch arrangements?',
      placeholder: formData.country === 'Thailand' ? 'e.g. Lunch at a riverside restaurant serving authentic Thai cuisine like Pad Thai and Green Curry' : 'e.g. Lunch at a local restaurant serving authentic Mughlai cuisine — both veg and non-veg options available (at traveller\'s own expense)',
      defaultValue: formData.country === 'Thailand' ? 'Lunch at a riverside restaurant serving authentic Thai cuisine.' : 'Lunch at a local restaurant serving authentic Mughlai cuisine.',
      hint: 'Restaurant type, cuisine, veg/non-veg, included or extra cost'
    },
    {
      id: 6,
      question: 'Any optional stops or add-ons available?',
      placeholder: formData.country === 'Thailand' ? 'e.g. Optional canal tour by long-tail boat, flower market visit, or Thai massage session' : 'e.g. Optional visit to Mehtab Bagh for sunset views, local marble handicraft workshop, or Fatehpur Sikri (additional charge)',
      defaultValue: 'Optional visits can be arranged upon request.',
      hint: 'Shopping, extra sightseeing, upgrades'
    },
    {
      id: 7,
      question: 'Describe the return journey?',
      placeholder: formData.country === 'Thailand' ? 'e.g. Depart at 5:00 PM, return to your hotel by 6:00 PM depending on traffic' : 'e.g. Depart around 5:00 PM, comfortable drive back, drop-off at hotel by 8:30 PM',
      defaultValue: 'Depart around 5:00 PM for a comfortable drive back, with drop-off at your hotel.',
      hint: 'Departure time, route, expected arrival'
    },
    {
      id: 8,
      question: 'What makes YOUR tour special compared to competitors?',
      placeholder: 'e.g. Skip-the-line entry, government-licensed guide, flexible itinerary, bottled water provided',
      defaultValue: 'Skip-the-line entry, professional guide, and a flexible itinerary.',
      hint: 'Your unique selling points — what sets you apart'
    },
    {
      id: 9,
      question: 'Share insider tips for travellers?',
      placeholder: formData.country === 'Thailand' ? 'e.g. Dress modestly for temples (knees and shoulders covered), carry water, wear slip-on shoes' : 'e.g. Wear comfortable shoes, carry sunscreen, best photos at sunrise',
      defaultValue: 'Wear comfortable shoes and carry sunscreen.',
      hint: 'Practical tips — clothing, weather, photography, dos & don\'ts'
    }
  ];

  const totalQuestions = aiQuestions.length;
  // Calculate answered count based on whether user typed OR we have a default (wait, answered count is visualized progress)
  // Progress should reflect TYPED answers probably? Or just current step?
  // Let's stick to simple progress: currentQuestion / totalQuestions?
  // Or typed answers.
  const answeredCount = Object.keys(aiAnswers).filter(k => aiAnswers[parseInt(k)]?.trim()).length;
  const currentQ = aiQuestions[aiCurrentQuestion];
  const allAnswered = answeredCount >= totalQuestions || aiCurrentQuestion === totalQuestions; // Allow generation if at end

  const handleGenerateItinerary = async () => {
    setAiGenerating(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      // Prepare answers with defaults
      const finalAnswers: Record<string, string> = {};
      aiQuestions.forEach(q => {
        finalAnswers[q.id] = aiAnswers[q.id] || q.defaultValue;
      });

      const response = await fetch(`${API_URL}/api/generate-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Switch to manual view to show streaming
      setItineraryMode('manual');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.startsWith('data: '));
          for (const line of lines) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullText += data.content;
                handleInputChange('detailedItinerary', fullText);
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseErr) {
              // Skip unparseable lines
            }
          }
        }
      }

      setAiGenerating(false);
    } catch (err) {
      console.error('AI generation failed, using template fallback:', err);
      alert('⚠️ AI Generation failed. Using offline template instead.\n\nError: ' + (err instanceof Error ? err.message : String(err)));
      // Fallback to template
      const a = (idx: number) => aiAnswers[idx] || aiQuestions[idx].defaultValue;
      const generated = `## ${a(0)}

## Pickup & Departure Details

${a(1)} ${a(2) ? `\n\n${a(2)}` : ''} Sit back and relax as your professional driver navigates the route.

## First Major Stop

${a(3)} Your expert guide will share fascinating stories and historical facts to bring the past to life.

## Second Major Stop

${a(4)} This stop offers a unique perspective on the region's rich cultural heritage.

## Lunch Break

${a(5)} This is a wonderful opportunity to savour authentic local cuisine.

## Optional Add-ons

${a(6)} These optional additions allow you to tailor the experience to your interests.

## Return Journey

${a(7)} Your driver will ensure a safe and comfortable return.

## Insider Tips

${a(9)}`;

      handleInputChange('detailedItinerary', generated);
      setAiGenerating(false);
      setItineraryMode('manual');
    }
  };

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
    setFormData(prev => {
      const newLanguages = prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language];
      if (newLanguages.length > 0) setShowLanguagesError(false);
      return { ...prev, languages: newLanguages };
    });
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

    Array.from(files).forEach((file: any) => {
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
      reader.readAsDataURL(file as unknown as Blob);
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
        if (!formData.maxGroupSize || formData.maxGroupSize < 1) return false;
        if (!formData.groupPricingTiers || formData.groupPricingTiers.length === 0) return false;
        // Must have at least price for 1 person
        const hasPriceForMin = formData.groupPricingTiers.some(tier => tier.minPeople === 1 && tier.price && tier.price.trim() !== '');
        if (!hasPriceForMin) return false;
        return true;
      case 5:
        // Step 5: Description & Details
        const shortLength = formData.shortDescription ? formData.shortDescription.trim().length : 0;
        const fullLength = formData.fullDescription ? formData.fullDescription.trim().length : 0;
        return shortLength >= 200 && fullLength >= 500 && formData.included && formData.highlights.filter(h => h.trim()).length >= 3;
      case 6:
        // Step 6: Itinerary
        if (formData.itineraryItems.length === 0) return false;
        if (!formData.itineraryItems.every(item => item.title.trim() && item.time.trim() && item.type)) return false;
        // Detailed itinerary must be 500+ words
        const wordCount = formData.detailedItinerary.trim().split(/\s+/).filter(w => w.length > 0).length;
        return wordCount >= 500;
      case 7:
        // Step 7: Tour Options
        return formData.tourOptions.every(opt => {
          const hasBasicFields = opt.optionTitle.trim() && opt.optionDescription.trim() && opt.durationHours;
          if (!hasBasicFields) return false;
          if (!opt.maxGroupSize || opt.maxGroupSize < 1) return false;
          // Must have at least price for 1 person
          if (!opt.groupPricingTiers || opt.groupPricingTiers.length === 0) return false;
          const hasPriceForMinOption = opt.groupPricingTiers.some((tier: any) => tier.minPeople === 1 && tier.price && tier.price.trim() !== '');
          if (!hasPriceForMinOption) return false;
          return true;
        });
      case 8:
        // Step 8: Photos & Languages
        return formData.images.length >= 4 && formData.languages.length > 0;
      default:
        return true;
    }
  };

  // Show a temporary toast notification
  const showToast = (msg: string) => {
    setDraftSaveToast(msg);
    setTimeout(() => setDraftSaveToast(null), 3500);
  };

  // Save as draft — keeps the form open, skips strict validation
  const handleSaveDraft = async () => {
    if (!supplierEmail || (!supplierPhone && !supplierWhatsApp)) {
      alert('❌ Please add your email and phone/WhatsApp to your profile before saving.');
      if (onProfileRequired) onProfileRequired();
      return;
    }
    if (!formData.country || !formData.city || !formData.title?.trim()) {
      alert('Please fill in at least Country, City, and Tour Title before saving as draft.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('Saving draft...');

    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

      // Upload any new base64 images first
      let imageUrls = formData.images;
      const hasBase64Images = formData.images.some(img => img.startsWith('data:image'));
      if (hasBase64Images && formData.images.length > 0) {
        setSubmissionStatus('Uploading images...');
        try {
          const uploadResponse = await fetch(`${API_URL}/api/tours/upload-images`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ images: formData.images, city: formData.city })
          });
          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            if (uploadData.success && uploadData.urls) imageUrls = uploadData.urls;
          }
        } catch (uploadErr) {
          console.warn('Image upload failed during draft save, will retry on final submit', uploadErr);
        }
      }

      setSubmissionStatus('Saving draft...');

      // Build a partial but safe payload
      let locationsToSave: string[] = [];
      if (formData.isMultiDayTour) {
        Object.values(formData.multiCityLocations).forEach((cityLocations: any) => {
          if (Array.isArray(cityLocations)) locationsToSave.push(...cityLocations);
        });
      } else {
        locationsToSave = formData.locations;
      }

      const draftPayload: any = {
        supplierId,
        status: 'draft',
        title: formData.title?.trim() || 'Untitled Tour',
        country: formData.country?.trim() || '',
        city: formData.city?.trim() || '',
        category: formData.category?.trim() || 'Guided Tour',
        locations: JSON.stringify(locationsToSave),
        duration: formData.duration?.trim() || 'Flexible',
        pricePerPerson: formData.groupPricingTiers?.length > 0 ? parseFloat(formData.groupPricingTiers[0].price || '0') : 0,
        currency: formData.currency || 'USD',
        shortDescription: formData.shortDescription?.trim() || null,
        fullDescription: formData.fullDescription?.trim() || '(Draft)',
        highlights: JSON.stringify(formData.highlights.filter(h => h.trim()).map(h => h.trim())),
        included: formData.included?.trim() || '(Draft)',
        notIncluded: formData.notIncluded?.trim() || null,
        meetingPoint: formData.meetingPoint?.trim() || null,
        images: JSON.stringify(imageUrls),
        languages: JSON.stringify(formData.languages),
        tourTypes: formData.tourTypes.length > 0 ? JSON.stringify(formData.tourTypes) : null,
        pickupIncluded: formData.pickupIncluded || false,
        locationEntryTickets: JSON.stringify(formData.locationEntryTickets),
        usesTransportation: formData.usesTransportation || false,
        transportationTypes: JSON.stringify(formData.transportationTypes),
        multiCityTravel: formData.multiCityTravel || false,
        itineraryItems: JSON.stringify(formData.itineraryItems),
        detailedItinerary: formData.detailedItinerary?.trim() || null,
        maxGroupSize: formData.maxGroupSize && formData.maxGroupSize >= 1 ? formData.maxGroupSize : null,
        groupPrice: formData.groupPricingTiers?.length > 0 ? parseFloat(formData.groupPricingTiers[formData.groupPricingTiers.length - 1].price || '0') : null,
        groupPricingTiers: formData.groupPricingTiers?.length > 0 ? JSON.stringify(formData.groupPricingTiers) : null,
        unavailableDates: null,
        unavailableDaysOfWeek: formData.unavailableDaysOfWeek?.length > 0 ? JSON.stringify(formData.unavailableDaysOfWeek) : null,
        tourOptions: (formData.tourOptions || []).map((opt, idx) => {
          const { id, tourId, pricingType, pricing_type, ...cleanOpt } = opt;
          return {
            optionTitle: cleanOpt.optionTitle?.trim() || `Option ${idx + 1}`,
            optionDescription: cleanOpt.optionDescription?.trim() || '(Draft)',
            durationHours: parseFloat(cleanOpt.durationHours) || 3,
            price: 0,
            currency: cleanOpt.currency || formData.currency,
            language: cleanOpt.language || formData.languages?.[0] || 'English',
            pickupIncluded: cleanOpt.pickupIncluded || false,
            carIncluded: cleanOpt.carIncluded || false,
            entryTicketIncluded: cleanOpt.entryTicketIncluded || false,
            guideIncluded: cleanOpt.guideIncluded !== undefined ? cleanOpt.guideIncluded : true,
            maxGroupSize: cleanOpt.maxGroupSize && cleanOpt.maxGroupSize >= 1 ? cleanOpt.maxGroupSize : null,
            groupPrice: null,
            groupPricingTiers: null,
            sortOrder: idx
          };
        })
      };

      // If we already have a draft ID, update it. Otherwise create a new one.
      const isUpdatingDraft = !!draftTourId;
      const url = isUpdatingDraft ? `${API_URL}/api/tours/${draftTourId}` : `${API_URL}/api/tours`;
      const method = isUpdatingDraft ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftPayload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Failed to save draft' }));
        throw new Error(err.message || 'Failed to save draft');
      }

      const data = await response.json();
      if (data.success) {
        const savedId = data.tour?.id || data.tourId;
        if (savedId && !isUpdatingDraft) {
          setDraftTourId(savedId);
        }
        // Stay on the form — just show a toast
        showToast('✅ Draft saved! Your progress is kept. Continue editing.');
        onSuccess(); // Refresh the dashboard list in background, does NOT close
      } else {
        throw new Error(data.message || 'Failed to save draft');
      }
    } catch (err: any) {
      console.error('Draft save error:', err);
      alert('❌ Failed to save draft: ' + err.message);
    } finally {
      setIsSubmitting(false);
      setSubmissionStatus('');
    }
  };

  const handleSubmit = async (submitForReview: boolean = false) => {
    console.log('🚀 handleSubmit CALLED', { submitForReview, isEditing, step, tourId: tour?.id });

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

    // When editing an existing tour, skip strict step-by-step validation
    // The tour already passed full validation when it was first created/approved
    // This allows suppliers to edit just photos, or just description, without re-filling everything
    if (!isEditing) {
      if (!canProceed()) {
        console.warn('Cannot proceed - validation failed', { step, canProceed: canProceed() });
        alert('Please complete all required fields before submitting.');
        return;
      }

      // Additional validation before sending to server (only for new tours)
      const missingFields: string[] = [];
      if (!supplierId) missingFields.push('supplierId');
      if (!formData.title || formData.title.trim() === '') missingFields.push('title');
      if (!formData.country || formData.country.trim() === '') missingFields.push('country');
      if (!formData.city || formData.city.trim() === '') missingFields.push('city');
      if (!formData.category || formData.category.trim() === '') missingFields.push('category');
      if (!formData.fullDescription || formData.fullDescription.trim() === '') missingFields.push('fullDescription');
      if (!formData.included || formData.included.trim() === '') missingFields.push('included');
      if (formData.images.length < 4) missingFields.push('images (need at least 4)');

      // Check locations properly for multi-day vs single tours
      let hasLocations = false;
      if (formData.isMultiDayTour) {
        hasLocations = Object.values(formData.multiCityLocations).some((locs: any) => locs.length > 0);
      } else {
        hasLocations = formData.locations && formData.locations.length > 0;
      }
      if (!hasLocations) missingFields.push('locations');
      if (!formData.duration || formData.duration.trim() === '') missingFields.push('duration');
      // Pricing - must have maxGroupSize and at least price for 1 person
      if (!formData.maxGroupSize || formData.maxGroupSize < 1) {
        missingFields.push('maxGroupSize (minimum 1)');
      }
      if (!formData.groupPricingTiers || formData.groupPricingTiers.length === 0) {
        missingFields.push('pricing for group sizes');
      } else {
        const hasPriceForMin = formData.groupPricingTiers.some(tier => tier.minPeople === 1 && tier.price && tier.price.trim() !== '');
        if (!hasPriceForMin) {
          missingFields.push('price for 1 person (required - this shows as "Starting from")');
        }
      }
      if (!formData.languages || formData.languages.length === 0) missingFields.push('languages');
      if (!formData.highlights || formData.highlights.filter(h => h.trim()).length < 3) missingFields.push('highlights (need at least 3)');

      if (missingFields.length > 0) {
        alert(`Missing required fields:\n${missingFields.join('\n')}\n\nPlease complete all fields before submitting.`);
        return;
      }
    } else {
      // For editing: minimal validation - just check essentials
      if (!supplierId) {
        alert('Error: Supplier information is missing. Please log in again.');
        return;
      }
      if (!formData.title || formData.title.trim() === '') {
        alert('Tour title is required.');
        return;
      }
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
        Object.values(formData.multiCityLocations).forEach((cityLocations: any) => {
          if (Array.isArray(cityLocations)) {
            locationsToSave.push(...cityLocations);
          }
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
        maxGroupSize: formData.maxGroupSize && formData.maxGroupSize >= 1 ? formData.maxGroupSize : null,
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
        pickupIncluded: formData.pickupIncluded || false,
        locationEntryTickets: JSON.stringify(formData.locationEntryTickets),
        usesTransportation: formData.usesTransportation || false,
        transportationTypes: JSON.stringify(formData.transportationTypes),
        multiCityTravel: formData.multiCityTravel || false,
        itineraryItems: JSON.stringify(formData.itineraryItems),
        detailedItinerary: formData.detailedItinerary?.trim() || null,
        // visitorInfo: formData.visitorInfo, // Removed
        // checklistItems: JSON.stringify(formData.checklistItems), // Removed
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
            maxGroupSize: cleanOpt.maxGroupSize && cleanOpt.maxGroupSize >= 1 ? cleanOpt.maxGroupSize : null,
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

        if (isEditing && submitForReview && tour?.status !== 'approved') {
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
          // This branch is now only reached from the final "Submit for Review" flow
          // Draft saving is handled by handleSaveDraft which doesn't close the form
          showToast('✅ Draft saved! Your progress is kept.');
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

  const getCurrencySymbol = (currencyCode: string) => {
    switch (currencyCode) {
      case 'INR': return '₹';
      case 'THB': return '฿';
      case 'USD': return '$';
      case 'EUR': return '€';
      default: return currencyCode;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Draft Save Toast */}
      {draftSaveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#001A33] text-white text-[14px] font-bold px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-fade-in">
          {draftSaveToast}
        </div>
      )}
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#001A33]">{isEditing ? 'Edit Tour' : 'Create a new tour'}</h1>
            <p className="text-[14px] text-gray-500 font-semibold mt-1">
              {isEditing ? STEP_LABELS[step - 1]?.label : `Step ${step} of ${totalSteps}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>
        {/* Step Navigation - Clickable when editing */}
        {isEditing ? (
          <div className="max-w-4xl mx-auto px-2 pb-2">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {STEP_LABELS.map((s) => (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`flex-none px-3 py-2 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${step === s.num
                    ? 'bg-[#10B981] text-white shadow-md'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-[#001A33]'
                    }`}
                >
                  {s.short}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-1 bg-gray-200">
            <div
              className="h-full bg-[#10B981] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}
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
                <div className="relative">
                  <select
                    id="country-select"
                    value={formData.country}
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      const newCurrency = 'USD';
                      if (newCountry) setShowCountryError(false);
                      setFormData(prev => ({
                        ...prev,
                        country: newCountry,
                        city: '',
                        currency: newCurrency,
                        tourOptions: prev.tourOptions.map(opt => ({
                          ...opt,
                          currency: newCurrency
                        }))
                      }));
                    }}
                    className={`w-full bg-white border-2 rounded-xl py-4 px-4 pr-10 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none appearance-none shadow-sm transition-all hover:border-gray-200 ${showCountryError && !formData.country ? 'border-red-400' : 'border-gray-100'}`}
                  >
                    <option value="">Select Country</option>
                    {COUNTRIES.map(country => (
                      <option key={country.code} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
                {showCountryError && !formData.country && (
                  <p className="text-red-500 text-[12px] font-bold mt-2 animate-pulse">Please select a country to continue</p>
                )}
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
              <div id="category-section">
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  What type of tour are you creating? *
                </label>
                {showCategoryError && !formData.category && (
                  <p className="text-red-500 text-[12px] font-bold mb-3 animate-pulse">Please select a tour type to continue</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => { handleInputChange('category', 'Entry Ticket'); setShowCategoryError(false); }}
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
                    onClick={() => { handleInputChange('category', 'Guided Tour'); setShowCategoryError(false); }}
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

              <div id="city-select">
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Select City *
                </label>
                <div className="relative">
                  <select
                    value={formData.city}
                    onChange={(e) => { handleInputChange('city', e.target.value); if (e.target.value) setShowCityError(false); }}
                    disabled={!formData.country}
                    className={`w-full bg-white border-2 rounded-xl py-4 px-4 pr-10 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none shadow-sm transition-all hover:border-gray-200 ${showCityError && !formData.city ? 'border-red-400' : 'border-gray-100'}`}
                  >
                    <option value="">{formData.country ? 'Select City' : 'Select country first'}</option>
                    {formData.country && COUNTRY_CITIES[formData.country]?.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
                {showCityError && !formData.city && (
                  <p className="text-red-500 text-[12px] font-bold mt-2 animate-pulse">Please select a city to continue</p>
                )}
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
                  id="tour-title-input"
                  type="text"
                  value={formData.title}
                  onChange={(e) => { handleInputChange('title', e.target.value); if (e.target.value.trim()) setShowTitleError(false); }}
                  placeholder={formData.country === 'Thailand' ? "e.g., Bangkok City Tour with Local Guide" : "e.g., Taj Mahal Sunrise Tour with Local Guide"}
                  maxLength={100}
                  className={`w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none ${showTitleError && !formData.title.trim() ? 'ring-2 ring-red-500' : ''}`}
                />
                {showTitleError && !formData.title.trim() && (
                  <p className="text-red-500 text-[12px] font-bold mt-2 ml-1 animate-pulse">Please enter a tour title to continue</p>
                )}
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
                <div id="locations-section">
                  <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                    Select Cities & Locations * (Choose multiple cities and their locations)
                  </label>
                  <div className="space-y-4">
                    {/* City Selector */}
                    <div>
                      <label className="block text-[13px] font-semibold text-[#001A33] mb-2">
                        Add City
                      </label>
                      <div className="relative">
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
                          className="w-full bg-white border-2 border-gray-100 rounded-xl py-3 px-4 pr-10 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none appearance-none shadow-sm transition-all hover:border-gray-200"
                        >
                          <option value="">Select a city to add...</option>
                          {formData.country && COUNTRY_CITIES[formData.country]?.filter(city => !formData.multiCityLocations[city]).map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                      </div>
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
                <div id="locations-section">
                  <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                    Select Places to See * (Click to select up to 10 places)
                  </label>
                  {showLocationsError && formData.locations.length === 0 && (
                    <p className="text-red-500 text-[12px] font-bold mb-3 animate-pulse">Please select at least one location to continue</p>
                  )}
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

                      {/* Custom Location Input */}
                      <div className="mt-4 flex gap-3">
                        <input
                          type="text"
                          id="custom-location-input"
                          placeholder="Add a custom location..."
                          className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              const value = input.value.trim();
                              if (value && !formData.locations.includes(value)) {
                                setFormData(prev => ({
                                  ...prev,
                                  locations: [...prev.locations, value]
                                }));
                                input.value = '';
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = document.getElementById('custom-location-input') as HTMLInputElement;
                            const value = input?.value?.trim();
                            if (value && !formData.locations.includes(value)) {
                              setFormData(prev => ({
                                ...prev,
                                locations: [...prev.locations, value]
                              }));
                              input.value = '';
                            }
                          }}
                          className="px-5 py-3 bg-[#10B981] text-white font-bold rounded-xl hover:bg-[#0d9668] transition-all text-[13px]"
                        >
                          + Add
                        </button>
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
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10B981] text-white text-[12px] font-bold rounded-full"
                              >
                                {loc}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      locations: prev.locations.filter(l => l !== loc),
                                    }));
                                  }}
                                  className="ml-0.5 hover:text-red-200 transition-colors"
                                >
                                  <X size={12} />
                                </button>
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
              {(() => {
                const allLocations = formData.isMultiDayTour
                  ? Object.values(formData.multiCityLocations).flat()
                  : formData.locations;

                if (allLocations.length === 0) return null;

                return (
                  <div className="mt-6">
                    <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                      Entry Ticket Options for Each Location *
                    </label>
                    <p className="text-[12px] text-gray-500 font-semibold mb-4">
                      Specify how entry to each location is handled
                    </p>
                    <div className="space-y-4">
                      {showEntryTicketError && (
                        <p className="text-red-500 text-[12px] font-bold animate-pulse">Please select an entry ticket option for all locations to continue</p>
                      )}
                      {allLocations.map((location) => (
                        <div id={`entry-ticket-${location}`} key={location} className="bg-gray-50 rounded-xl p-4 border border-gray-200 relative">
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => {
                                const newLocations = prev.locations.filter(l => l !== location);
                                const newEntryTickets = { ...prev.locationEntryTickets };
                                delete newEntryTickets[location];

                                // Also remove from multiCityLocations if it's a multi-day tour
                                const newMultiCityLocations = { ...prev.multiCityLocations };
                                if (prev.isMultiDayTour) {
                                  Object.keys(newMultiCityLocations).forEach(city => {
                                    newMultiCityLocations[city] = newMultiCityLocations[city].filter(loc => loc !== location);
                                  });
                                }

                                return {
                                  ...prev,
                                  locations: newLocations,
                                  locationEntryTickets: newEntryTickets,
                                  multiCityLocations: newMultiCityLocations
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
                );
              })()}


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
                  id="duration-select"
                  value={formData.duration}
                  onChange={(e) => {
                    handleInputChange('duration', e.target.value);
                    if (e.target.value) setShowDurationError(false);
                  }}
                  className={`w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none ${showDurationError && !formData.duration ? 'ring-2 ring-red-500' : ''}`}
                >
                  <option value="">Select Duration</option>
                  {DURATION_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {showDurationError && !formData.duration && (
                  <p className="text-red-500 text-[12px] font-bold mt-2 ml-1 animate-pulse">
                    Please select duration first
                  </p>
                )}
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
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                      <p className="text-[11px] font-black text-amber-800 leading-tight">
                        💡 PRO TIP: Set this to at least 10. Large group bookings (10+) are very common and will significantly increase your earnings!
                      </p>
                    </div>
                    <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                      Maximum Group Size *
                    </label>
                    <input
                      id="max-group-size-input"
                      type="number"
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                      value={formData.maxGroupSize || ''}
                      onChange={(e) => {
                        const maxSize = e.target.value ? parseInt(e.target.value) : undefined;
                        handleInputChange('maxGroupSize', maxSize);
                        if (maxSize && maxSize >= 1) setShowGroupSizeError(false);
                      }}
                      placeholder="e.g., 10"
                      min="1"
                      className={`w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${showGroupSizeError && (!formData.maxGroupSize || formData.maxGroupSize < 1) ? 'ring-2 ring-red-500' : ''}`}
                    />
                    {showGroupSizeError && (!formData.maxGroupSize || formData.maxGroupSize < 1) && (
                      <p className="text-red-500 text-[12px] font-bold mt-2 ml-1 animate-pulse">
                        Please enter the maximum group size
                      </p>
                    )}
                    <p className="text-[11px] text-gray-400 mt-2 font-semibold">
                      Maximum number of people you can guide in one group
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
                      <option value="USD">{getCurrencySymbol('USD')} USD</option>
                    </select>
                  </div>
                </div>

                {/* Pricing for Each Group Size */}
                {formData.maxGroupSize && formData.maxGroupSize >= 1 && (
                  <div id="pricing-tiers-section">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <label className="block text-[14px] font-bold text-[#001A33] mb-1">
                          Set Price for Each Group Size *
                        </label>
                        <p className="text-[11px] text-gray-500">
                          Enter price for 1 person, then we'll suggest prices for others. You can adjust manually.
                        </p>
                        {showPricingError && !formData.groupPricingTiers?.some((t: any) => t.minPeople === 1 && t.price && t.price.trim() !== '') && (
                          <p className="text-red-500 text-[12px] font-bold mt-1 animate-pulse">
                            Please enter a price for at least 1 person to continue
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const minTier = formData.groupPricingTiers?.find(t => t.minPeople === 1);
                          const priceForMin = minTier ? parseFloat(minTier.price) : 0;
                          if (priceForMin > 0) {
                            const newTiers = Array.from({ length: formData.maxGroupSize || 0 }, (_, i) => {
                              const numPeople = i + 1;
                              const calculatedPrice = numPeople === 1
                                ? priceForMin
                                : Math.round(priceForMin + (numPeople - 1) * priceForMin * 0.8);
                              return {
                                minPeople: numPeople,
                                maxPeople: numPeople,
                                price: calculatedPrice.toString()
                              };
                            });
                            setFormData(prev => ({ ...prev, groupPricingTiers: newTiers }));
                          }
                        }}
                        className="px-4 py-2 bg-[#10B981] text-white rounded-xl text-[14px] font-bold hover:bg-[#059669] transition-colors"
                      >
                        Auto-Fill All
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {Array.from({ length: formData.maxGroupSize || 0 }, (_, i) => i + 1).map((numPeople) => {
                        const existingTier = formData.groupPricingTiers?.find(t => t.minPeople === numPeople && t.maxPeople === numPeople);
                        const price = existingTier?.price || '';

                        // Calculate suggested price based on 1 person price
                        const baseTier = formData.groupPricingTiers?.find(t => t.minPeople === 1);
                        const basePrice = baseTier ? parseFloat(baseTier.price) : 0;
                        const suggestedPrice = basePrice > 0 && numPeople > 1 ? Math.round(basePrice + (numPeople - 1) * basePrice * 0.8) : null;

                        return (
                          <div key={numPeople} className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center gap-4">
                            <div className="w-24">
                              <span className="text-[14px] font-bold text-[#001A33]">{numPeople} {numPeople === 1 ? 'person' : 'people'}</span>
                            </div>
                            <div className="flex-1 flex items-center gap-3">
                              <span className="text-[16px] font-bold text-[#001A33]">{getCurrencySymbol(formData.currency)}</span>
                              <div className="flex-1 relative">
                                <input
                                  type="number"
                                  onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                  value={price}
                                  onChange={(e) => {
                                    const newPrice = e.target.value;
                                    if (numPeople === 1 && newPrice.trim() !== '') setShowPricingError(false);
                                    setFormData(prev => {
                                      const newTiers = [...(prev.groupPricingTiers || [])];
                                      const tierIndex = newTiers.findIndex(t => t.minPeople === numPeople && t.maxPeople === numPeople);
                                      if (tierIndex >= 0) {
                                        newTiers[tierIndex] = { ...newTiers[tierIndex], price: newPrice };
                                      } else {
                                        newTiers.push({ minPeople: numPeople, maxPeople: numPeople, price: newPrice });
                                      }
                                      return { ...prev, groupPricingTiers: newTiers.sort((a, b) => a.minPeople - b.minPeople) };
                                    });
                                  }}
                                  placeholder={suggestedPrice ? `Suggested: ${suggestedPrice}` : "Enter price"}
                                  className="w-full bg-white border border-gray-300 rounded-xl py-3 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                              </div>
                              {suggestedPrice && !price && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData(prev => {
                                      const newTiers = [...(prev.groupPricingTiers || [])];
                                      const tierIndex = newTiers.findIndex(t => t.minPeople === numPeople && t.maxPeople === numPeople);
                                      if (tierIndex >= 0) {
                                        newTiers[tierIndex] = { ...newTiers[tierIndex], price: suggestedPrice.toString() };
                                      } else {
                                        newTiers.push({ minPeople: numPeople, maxPeople: numPeople, price: suggestedPrice.toString() });
                                      }
                                      return { ...prev, groupPricingTiers: newTiers.sort((a, b) => a.minPeople - b.minPeople) };
                                    });
                                  }}
                                  className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[12px] font-bold hover:bg-blue-100 transition-colors whitespace-nowrap"
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
                      <p className="text-[12px] text-[#10B981] font-semibold mt-4">
                        ✓ Main card will show: "Starting from {getCurrencySymbol(formData.currency)}{parseFloat(formData.groupPricingTiers[0].price).toLocaleString()}"
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
                      const newHighlights = [...formData.highlights];
                      newHighlights.push('');
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
                  Short Description * (200 characters minimum)
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  placeholder="Provide a compelling short summary of your tour (at least 200 characters)..."
                  rows={4}
                  spellCheck={true}
                  autoComplete="off"
                  autoCorrect="on"
                  autoCapitalize="sentences"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className={`text-[12px] font-semibold ${formData.shortDescription.trim().length < 200 ? 'text-red-500' : 'text-[#10B981]'}`}>
                    {formData.shortDescription.trim().length} / 200 characters
                  </p>
                  {formData.shortDescription.trim().length < 200 && (
                    <p className="text-[11px] text-red-400 font-medium italic">Requirement: 200 characters minimum</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Full Description * (500 characters minimum)
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                  placeholder="Provide all the details about what customers will see and experience (at least 500 characters)..."
                  rows={8}
                  spellCheck={true}
                  autoComplete="off"
                  autoCorrect="on"
                  autoCapitalize="sentences"
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className={`text-[12px] font-semibold ${formData.fullDescription.trim().length < 500 ? 'text-red-500' : 'text-[#10B981]'}`}>
                    {formData.fullDescription.trim().length} / 500 characters
                  </p>
                  {formData.fullDescription.trim().length < 500 && (
                    <p className="text-[11px] text-red-400 font-medium italic">Requirement: 500 characters minimum</p>
                  )}
                </div>
              </div>

              <div id="included-textarea">
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  What's Included * (One item per line)
                </label>
                <textarea
                  value={formData.included}
                  onChange={(e) => { handleInputChange('included', e.target.value); if (e.target.value.trim()) setShowIncludedError(false); }}
                  placeholder="• Entry ticket&#10;• Professional guide&#10;• Transportation"
                  rows={5}
                  className={`w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none resize-none ${showIncludedError && !formData.included?.trim() ? 'ring-2 ring-red-500' : ''}`}
                />
                {showIncludedError && !formData.included?.trim() && (
                  <p className="text-red-500 text-[12px] font-bold mt-2 animate-pulse">Please fill in what's included in the tour to continue</p>
                )}
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

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pickupIncluded"
                  checked={formData.pickupIncluded}
                  onChange={(e) => handleInputChange('pickupIncluded', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]"
                />
                <label htmlFor="pickupIncluded" className="text-[14px] font-bold text-[#001A33] cursor-pointer">
                  Pickup Included from Hotel/Airport
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Detailed Itinerary */}
        {step === 6 && (
          <div className="space-y-8">
            {/* Part 1: Visual Itinerary Builder */}
            <div id="itinerary-items-section" className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#001A33]">Build Your Itinerary Timeline</h2>
                  <p className="text-[14px] text-gray-500 font-semibold mt-1">
                    Add time slots with activity types to create a visual journey for travelers.
                  </p>
                  {showItineraryItemsError && (formData.itineraryItems.length === 0 || !formData.itineraryItems.every((item: any) => item.title?.trim() && item.time?.trim() && item.type)) && (
                    <p className="text-red-500 text-[12px] font-bold mt-2 animate-pulse">
                      {formData.itineraryItems.length === 0
                        ? 'Please add at least one itinerary stop to continue'
                        : 'Please fill in the title, time, and type for all itinerary stops'}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newItems = [...formData.itineraryItems, { title: '', time: '', duration: '', description: '', type: 'visit' as const, optional: false }];
                    handleInputChange('itineraryItems', newItems);
                  }}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-black py-2.5 px-6 rounded-xl text-[14px] transition-all flex items-center gap-2 shadow-sm"
                >
                  <Plus size={18} /> Add Stop
                </button>
              </div>

              <div className="space-y-6">
                {formData.itineraryItems.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] p-12 text-center">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                      <Clock className="text-[#10B981]" size={32} />
                    </div>
                    <h3 className="text-[18px] font-black text-[#001A33] mb-2">No timeline items yet</h3>
                    <p className="text-[14px] text-gray-500 font-semibold max-w-sm mx-auto mb-6">
                      A detailed timeline helps travelers visualize the day and increases booking confidence.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleInputChange('itineraryItems', currentExample.items)}
                      className="text-[#10B981] font-bold hover:underline py-2 px-4"
                    >
                      + Start with an example ({currentExample.label})
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[24px] top-8 bottom-8 w-[4px] bg-gradient-to-b from-[#10B981] via-[#10B981] to-[#10B981] z-0 rounded-full" />

                    <div className="space-y-1">
                      {formData.itineraryItems.map((item, index) => {
                        const typeConfig: Record<string, { icon: React.ReactNode; bg: string; border: string }> = {
                          pickup: { icon: <MapPin size={18} className="text-white" />, bg: 'bg-[#10B981]', border: 'border-[#10B981]' },
                          transport: { icon: <Car size={18} className="text-[#10B981]" />, bg: 'bg-white', border: 'border-[#10B981]' },
                          visit: { icon: <Landmark size={18} className="text-white" />, bg: 'bg-[#10B981]', border: 'border-[#10B981]' },
                          meal: { icon: <UtensilsCrossed size={18} className="text-white" />, bg: 'bg-[#10B981]', border: 'border-[#10B981]' },
                          activity: { icon: <Star size={18} className="text-white" />, bg: 'bg-[#10B981]', border: 'border-[#10B981]' },
                          optional: { icon: <CircleDot size={18} className="text-gray-400" />, bg: 'bg-white', border: 'border-gray-300' },
                          return: { icon: <Flag size={18} className="text-white" />, bg: 'bg-[#10B981]', border: 'border-[#10B981]' }
                        };
                        const config = typeConfig[item.type] || typeConfig.visit;

                        return (
                          <div key={index} className="relative pl-16 group py-3">
                            <div className={`absolute left-[8px] top-6 w-[36px] h-[36px] rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center z-10 shadow-md`}>
                              {config.icon}
                            </div>

                            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all relative">
                              <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-20">
                                {index > 0 && (
                                  <button type="button" onClick={() => { const items = [...formData.itineraryItems];[items[index], items[index - 1]] = [items[index - 1], items[index]]; handleInputChange('itineraryItems', items); }} className="bg-white text-gray-500 hover:text-[#001A33] rounded-full p-1.5 shadow-md border border-gray-100"><ArrowUp size={14} /></button>
                                )}
                                {index < formData.itineraryItems.length - 1 && (
                                  <button type="button" onClick={() => { const items = [...formData.itineraryItems];[items[index], items[index + 1]] = [items[index + 1], items[index]]; handleInputChange('itineraryItems', items); }} className="bg-white text-gray-500 hover:text-[#001A33] rounded-full p-1.5 shadow-md border border-gray-100"><ArrowDown size={14} /></button>
                                )}
                                <button type="button" onClick={() => { handleInputChange('itineraryItems', formData.itineraryItems.filter((_: any, i: number) => i !== index)); }} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-full p-1.5 shadow-md"><Trash2 size={14} /></button>
                              </div>

                              <div className="grid grid-cols-12 gap-3 mb-3">
                                <div className="col-span-3">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Type</label>
                                  <select
                                    value={item.type}
                                    onChange={(e) => { const items = [...formData.itineraryItems]; items[index] = { ...items[index], type: e.target.value as any }; handleInputChange('itineraryItems', items); }}
                                    className="w-full bg-gray-50 border-none rounded-lg py-2.5 px-3 font-bold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none"
                                  >
                                    <option value="pickup">Pickup</option>
                                    <option value="transport">Transport</option>
                                    <option value="visit">Visit / Sightseeing</option>
                                    <option value="meal">Meal / Break</option>
                                    <option value="activity">Activity</option>
                                    <option value="optional">Optional Stop</option>
                                    <option value="return">Return / Drop-off</option>
                                  </select>
                                </div>
                                <div className="col-span-4">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Title</label>
                                  <input type="text" value={item.title} onChange={(e) => { const items = [...formData.itineraryItems]; items[index].title = e.target.value; handleInputChange('itineraryItems', items); }} placeholder="e.g. Taj Mahal" className="w-full bg-gray-50 border-none rounded-lg py-2.5 px-3 font-black text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none" />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    {formData.isMultiDayTour ? 'Day / Time' : 'Time'}
                                  </label>
                                  {formData.isMultiDayTour ? (
                                    <input
                                      type="text"
                                      value={item.time}
                                      onChange={(e) => { const items = [...formData.itineraryItems]; items[index].time = e.target.value; handleInputChange('itineraryItems', items); }}
                                      placeholder="e.g. Day 1, 9am"
                                      className="w-full bg-gray-50 border-none rounded-lg py-2.5 px-3 font-black text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none"
                                    />
                                  ) : (
                                    <select
                                      value={item.time}
                                      onChange={(e) => { const items = [...formData.itineraryItems]; items[index].time = e.target.value; handleInputChange('itineraryItems', items); }}
                                      className="w-full bg-gray-50 border-none rounded-lg py-2.5 px-3 font-black text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none appearance-none"
                                    >
                                      <option value="">Select</option>
                                      {Array.from({ length: 48 }, (_, i) => {
                                        const hour24 = Math.floor(i / 2);
                                        const minutes = i % 2 === 0 ? '00' : '30';
                                        const period = hour24 < 12 ? 'AM' : 'PM';
                                        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                                        const label = `${hour12}:${minutes} ${period}`;
                                        const value24 = `${String(hour24).padStart(2, '0')}:${minutes}`;
                                        return <option key={value24} value={value24}>{label}</option>;
                                      })}
                                    </select>
                                  )}
                                </div>
                                <div className="col-span-3">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Duration</label>
                                  <input type="text" value={item.duration} onChange={(e) => { const items = [...formData.itineraryItems]; items[index].duration = e.target.value; handleInputChange('itineraryItems', items); }} placeholder="e.g. 2 hours" className="w-full bg-gray-50 border-none rounded-lg py-2.5 px-3 font-bold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none" />
                                </div>
                              </div>

                              <div className="flex gap-3 items-start">
                                <div className="flex-1">
                                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                                  <input type="text" value={item.description} onChange={(e) => { const items = [...formData.itineraryItems]; items[index].description = e.target.value; handleInputChange('itineraryItems', items); }} placeholder="Brief description of this stop..." className="w-full bg-gray-50 border-none rounded-lg py-2.5 px-3 font-semibold text-gray-600 text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none" />
                                </div>
                                <div className="pt-5">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={item.optional} onChange={(e) => { const items = [...formData.itineraryItems]; items[index].optional = e.target.checked; if (e.target.checked) items[index].type = 'optional' as any; handleInputChange('itineraryItems', items); }} className="w-4 h-4 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]" />
                                    <span className="text-[11px] font-bold text-gray-400 uppercase whitespace-nowrap">Optional</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="relative pl-14 pt-2">
                      <div className="absolute left-[15px] top-4 w-5 h-5 rounded-full border-2 border-dashed border-gray-300 z-10" />
                      <button
                        type="button"
                        onClick={() => { handleInputChange('itineraryItems', [...formData.itineraryItems, { title: '', time: '', duration: '', description: '', type: 'visit' as const, optional: false }]); }}
                        className="text-[#10B981] font-bold text-[13px] hover:underline py-2"
                      >
                        + Add another stop
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Part 2: Detailed Text Itinerary */}
            <div id="detailed-itinerary-section" className="bg-white rounded-2xl p-8 border border-gray-200">
              <h2 className="text-2xl font-black text-[#001A33] mb-2">Detailed Itinerary Description</h2>
              <p className="text-[14px] text-gray-500 font-semibold mb-1">
                Write a comprehensive, detailed description of the entire tour experience. <span className="text-[#FF6B35] font-black">Minimum 500 words required.</span>
              </p>
              {(() => {
                const wc = formData.detailedItinerary.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
                return (
                  <p className={`text-[13px] font-bold mb-4 ${wc >= 500 ? 'text-[#10B981]' : 'text-gray-400'}`}>
                    {wc} / 500 words{wc >= 500 ? ' ✓' : ''}
                  </p>
                );
              })()}
              {showDetailedItineraryError && formData.detailedItinerary.trim().split(/\s+/).filter((w: string) => w.length > 0).length < 500 && (
                <p className="text-red-500 text-[12px] font-bold mb-4 animate-pulse">
                  Please write at least 500 words in the detailed itinerary to continue ({formData.detailedItinerary.trim().split(/\s+/).filter((w: string) => w.length > 0).length} words so far)
                </p>
              )}

              {/* Mode Toggle */}
              <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
                <button
                  type="button"
                  onClick={() => setItineraryMode('manual')}
                  className={`flex-1 py-3 rounded-lg text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${itineraryMode === 'manual' || itineraryMode === 'choose' ? 'bg-white shadow-sm text-[#001A33] ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                  <PenLine size={16} />
                  Manual Editor
                </button>
                <button
                  type="button"
                  onClick={() => { setItineraryMode('ai'); if (Object.keys(aiAnswers).length === 0) setAiCurrentQuestion(0); }}
                  className={`flex-1 py-3 rounded-lg text-[14px] font-bold transition-all flex items-center justify-center gap-2 ${itineraryMode === 'ai' ? 'bg-white shadow-sm text-[#10B981] ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                >
                  <Sparkles size={16} className={itineraryMode === 'ai' ? 'text-[#10B981]' : 'text-gray-400'} />
                  AI Writer (Recommended)
                </button>
              </div>

              {/* AI Questionnaire Mode */}
              {itineraryMode === 'ai' && (
                <div>
                  {/* Progress */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#10B981]" />
                      <span className="text-[13px] font-black text-[#10B981]">AsiaByLocals AI Writer (Recommended)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-gray-400">{answeredCount}/{totalQuestions} steps</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-[#10B981] rounded-full transition-all duration-300" style={{ width: `${(Math.min(answeredCount, totalQuestions) / totalQuestions) * 100}%` }} />
                  </div>

                  {/* Question Card */}
                  {currentQ && (
                    <div className="bg-gradient-to-br from-emerald-50/50 to-white border-2 border-[#10B981]/20 rounded-2xl p-6 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-7 h-7 bg-[#10B981] text-white text-[12px] font-black rounded-full flex items-center justify-center">{currentQ.id + 1}</span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Question {currentQ.id + 1} of {totalQuestions}</span>
                      </div>
                      <h3 className="text-[16px] font-black text-[#001A33] mb-2">{currentQ.question}</h3>
                      <p className="text-[12px] text-gray-400 font-semibold mb-4 flex items-start gap-1.5"><Lightbulb size={13} className="text-amber-400 mt-0.5 shrink-0" /> {currentQ.hint}</p>
                      <textarea
                        value={aiAnswers[currentQ.id] || ''}
                        onChange={(e) => setAiAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                        placeholder={currentQ.placeholder}
                        rows={3}
                        className="w-full bg-white border-2 border-gray-200 rounded-xl py-3 px-4 font-semibold text-gray-700 text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none resize-none leading-relaxed"
                        autoFocus
                      />
                      <div className="flex items-center justify-between mt-4">
                        <button
                          type="button"
                          onClick={() => setAiCurrentQuestion(Math.max(0, aiCurrentQuestion - 1))}
                          disabled={aiCurrentQuestion === 0}
                          className="px-4 py-2 text-[13px] font-bold text-gray-400 hover:text-gray-600 disabled:opacity-30 transition-colors"
                        >
                          ← Previous
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (aiCurrentQuestion < totalQuestions - 1) {
                              setAiCurrentQuestion(aiCurrentQuestion + 1);
                            } else {
                              // Finish - hide question card
                              setAiCurrentQuestion(totalQuestions);
                            }
                          }}
                          className="px-6 py-2.5 bg-[#10B981] text-white font-black text-[13px] rounded-xl hover:bg-[#0d9668] transition-all"
                        >
                          {aiCurrentQuestion === totalQuestions - 1 ? 'Finish' : 'Next →'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Question Pills - Quick nav */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {aiQuestions.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setAiCurrentQuestion(q.id)}
                        className={`w-8 h-8 rounded-full text-[11px] font-black transition-all ${aiAnswers[q.id]?.trim()
                          ? 'bg-[#10B981] text-white'
                          : aiCurrentQuestion === q.id
                            ? 'bg-[#10B981]/20 text-[#10B981] border-2 border-[#10B981]'
                            : 'bg-gray-100 text-gray-400'
                          }`}
                      >
                        {q.id + 1}
                      </button>
                    ))}
                  </div>

                  {/* Generate Button */}
                  {allAnswered && (
                    <button
                      type="button"
                      onClick={handleGenerateItinerary}
                      disabled={aiGenerating}
                      className="w-full py-4 bg-gradient-to-r from-[#10B981] to-emerald-600 text-white font-black text-[16px] rounded-xl hover:from-[#0d9668] hover:to-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#10B981]/20 disabled:opacity-60"
                    >
                      {aiGenerating ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Generating your itinerary...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          Generate Itinerary with AI
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Manual Editor */}
              {(itineraryMode === 'manual' || (itineraryMode === 'choose' && !itineraryMode.includes('ai'))) && (
                <>

                  {/* SEO Structure Guide */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <CheckCircle2 size={18} className="text-[#10B981] mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[14px] font-black text-[#001A33] mb-1">Structure your itinerary with clear sections</p>
                        <p className="text-[12px] text-gray-500 font-semibold">Organise your content under section headings. Well-structured itineraries rank higher on Google and convert more bookings.</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-emerald-100">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Recommended Sections</p>
                      <div className="flex flex-wrap gap-2">
                        {['Tour Overview', 'Pickup & Departure', 'Sightseeing Stops', 'Lunch Break', 'Optional Add-ons', 'Return Journey', 'Insider Tips', 'Important Notes'].map((section) => (
                          <span key={section} className="inline-flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 size={12} className="text-[#10B981]" /> {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Use Template Button */}
                  {!formData.detailedItinerary.includes('##') && (
                    <button
                      type="button"
                      onClick={() => {
                        const template = `## ${formData.title || 'Tour'} Itinerary${formData.city ? ` (${formData.city})` : ''}\n\nWrite a brief overview of your tour here. Mention the key highlights, duration, and what makes this experience special.\n\n## Pickup & Departure Details\n\nDescribe the pickup time, location, vehicle type, and the journey to the first stop. Include approximate travel times.\n\n## ${formData.itineraryItems?.[1]?.title || 'First Major Stop'}\n\nDescribe this stop in detail — its historical significance, what travelers will see and do, approximate time spent, and any insider tips.\n\n## ${formData.itineraryItems?.[2]?.title || 'Second Major Stop'}\n\nDescribe this stop in detail — its significance, the experience, and time spent here.\n\n## Lunch Break\n\nDescribe the meal arrangements — restaurant type, cuisine options, vegetarian/non-vegetarian availability, and whether the meal is included or at the traveller\'s own expense.\n\n## Optional Add-ons\n\nMention any optional stops, shopping opportunities, or additional experiences available upon request.\n\n## Return Journey\n\nDescribe the return trip — departure time, route, expected arrival time, and drop-off details.\n\n## Insider Tips\n\nShare practical tips — best time to visit, what to wear, what to carry, photography tips, and anything that will enhance the traveller\'s experience.`;
                        handleInputChange('detailedItinerary', template);
                      }}
                      className="w-full mb-4 py-3 px-4 bg-[#10B981]/10 border-2 border-dashed border-[#10B981]/30 rounded-xl text-[#10B981] font-black text-[13px] hover:bg-[#10B981]/20 hover:border-[#10B981]/50 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText size={16} />
                      Auto-fill with guided template
                    </button>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <p className="text-[13px] font-bold text-blue-800 flex items-start gap-2">
                      <Lightbulb size={15} className="text-blue-500 mt-0.5 shrink-0" /> <span><strong>Tips:</strong> Include pickup details, each stop with historical/cultural context, meal arrangements, travel times, what makes your tour special, insider tips, and return details. More detail = more bookings!</span>
                    </p>
                  </div>

                  <div className="relative">
                    {aiGenerating && (
                      <div className="absolute top-4 right-4 z-20 bg-[#10B981] text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold animate-pulse">
                        <Sparkles size={14} /> AI Writing...
                      </div>
                    )}
                    <textarea
                      readOnly={aiGenerating}
                      value={formData.detailedItinerary}
                      onChange={(e) => { handleInputChange('detailedItinerary', e.target.value); const wc = e.target.value.trim().split(/\s+/).filter((w: string) => w.length > 0).length; if (wc >= 500) setShowDetailedItineraryError(false); }}
                      placeholder={
                        formData.country === 'Thailand'
                          ? "Tour Overview\nWrite a brief overview of your tour — key highlights, duration, and what makes it special.\n\nPickup & Departure Details\nDescribe pickup time, location, vehicle type, and travel time to the first stop.\n\nGrand Palace Visit\nDescribe this stop in detail — history, what travellers will see, time spent here.\n\nWat Pho Exploration\nDescribe the experience, architecture, and cultural significance.\n\nLunch Break\nMeal arrangements — restaurant type, cuisine options, inclusions.\n\nReturn Journey\nReturn trip details — departure time, route, arrival time.\n\nInsider Tips\nPractical tips — best time to visit, what to wear, what to carry."
                          : formData.country === 'Japan'
                            ? "Tour Overview\nWrite a brief overview of your tour — key highlights, duration, and what makes it special.\n\nPickup & Departure Details\nDescribe pickup time, location, vehicle type, and travel time to the first stop.\n\nFushimi Inari Shrine Visit\nDescribe this stop in detail — history, what travellers will see, time spent here.\n\nKiyomizu-dera Temple Exploration\nDescribe the experience, architecture, and cultural significance.\n\nLunch Break\nMeal arrangements — restaurant type, cuisine options, exclusions.\n\nReturn Journey\nReturn trip details — departure time, route, arrival time.\n\nInsider Tips\nPractical tips — best time to visit, what to wear, what to carry."
                            : "Tour Overview\nWrite a brief overview of your tour — key highlights, duration, and what makes it special.\n\nPickup & Departure Details\nDescribe pickup time, location, vehicle type, and travel time to the first stop.\n\nTaj Mahal Visit\nDescribe this stop in detail — history, what travellers will see, time spent here.\n\nAgra Fort Exploration\nDescribe the experience, architecture, and cultural significance.\n\nLunch Break\nMeal arrangements — restaurant type, cuisine options, inclusions.\n\nReturn Journey\nReturn trip details — departure time, route, arrival time.\n\nInsider Tips\nPractical tips — best time to visit, what to wear, what to carry."
                      }
                      rows={16}
                      className={`w-full bg-gray-50 border-2 border-gray-200 rounded-2xl py-5 px-6 font-semibold text-gray-700 text-[15px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none resize-y leading-relaxed ${aiGenerating ? 'cursor-not-allowed opacity-80' : ''}`}
                    />
                  </div>

                  {/* Re-generate with AI button */}
                  {formData.detailedItinerary && (
                    <button
                      type="button"
                      onClick={() => { handleInputChange('detailedItinerary', ''); setItineraryMode('choose'); setAiAnswers({}); setAiCurrentQuestion(0); }}
                      className="mt-3 text-[12px] font-bold text-gray-400 hover:text-[#10B981] transition-colors flex items-center gap-1"
                    >
                      <Sparkles size={12} /> Start over / Use AI to rewrite
                    </button>
                  )}

                  {(() => {
                    const words = formData.detailedItinerary.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
                    const isValid = words >= 500;
                    const headings = formData.detailedItinerary.split('\n').filter((line: string) => line.trim().startsWith('##'));
                    const hasHeadings = headings.length >= 3;
                    return (
                      <div className="mt-3 px-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isValid ? <CheckCircle2 className="text-[#10B981]" size={16} /> : <AlertCircle className="text-[#FF6B35]" size={16} />}
                            <span className={`text-[13px] font-bold ${isValid ? 'text-[#10B981]' : 'text-[#FF6B35]'}`}>
                              {words} / 500 words {isValid ? '✓' : `(${500 - words} more needed)`}
                            </span>
                          </div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${isValid ? 'bg-[#10B981]' : 'bg-[#FF6B35]'}`} style={{ width: `${Math.min(100, (words / 500) * 100)}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasHeadings ? <CheckCircle2 className="text-[#10B981]" size={16} /> : <AlertCircle className="text-amber-500" size={16} />}
                          <span className={`text-[13px] font-bold ${hasHeadings ? 'text-[#10B981]' : 'text-amber-500'}`}>
                            {headings.length} section heading{headings.length !== 1 ? 's' : ''} found {hasHeadings ? '✓' : '(minimum 3 recommended for SEO)'}
                          </span>
                        </div>
                        {headings.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {headings.map((h: string, i: number) => (
                              <span key={i} className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg border border-emerald-200">
                                {h.replace(/^#+\s*/, '')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 7: Tour Options */}
        {step === 7 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-black text-[#001A33] mb-2">Add Pricing Options <span className="text-gray-400 font-semibold">(Optional)</span></h2>
            <p className="text-[14px] text-gray-600 font-semibold mb-4">
              Create multiple pricing options for <span className="font-black text-[#001A33]">"{formData.title || 'this tour'}"</span>. All options belong to the same tour - customers will see one tour page and choose which option they prefer.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-[13px] font-bold text-green-800">
                💡 Example: For "Taj Mahal Tour", you can add options like "Basic Tour", "Tour with Pickup", and "Premium Tour" - all within the same tour!
              </p>
            </div>

            {formData.tourOptions.length === 0 ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <p className="text-[14px] text-blue-800 font-semibold mb-4">
                  (Optional) You can add extra pricing options for this tour (e.g. "Tour with Pickup", "Premium Tour"). If you don't add any, customers will only see the basic price.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const newOption = {
                      optionTitle: '',
                      optionDescription: '',
                      durationHours: formData.duration.toLowerCase().includes('day')
                        ? (parseFloat(formData.duration.replace(/[^\d.]/g, '')) * 24).toString()
                        : (formData.duration.replace(/[^\d.]/g, '') || '3'),
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
                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
                            value={option.durationHours}
                            onChange={(e) => {
                              const newOptions = [...formData.tourOptions];
                              newOptions[index].durationHours = e.target.value;
                              setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                            }}
                            placeholder="e.g., 4"
                            min="0.5"
                            step="0.5"
                            className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-2">
                              <p className="text-[11px] font-black text-amber-800 leading-tight">
                                💡 PRO TIP: Set this to at least 10 to increase your chances of large bookings!
                              </p>
                            </div>
                            <label className="block text-[14px] font-bold text-[#001A33] mb-2">
                              Maximum Group Size *
                            </label>
                            <input
                              type="number"
                              onWheel={(e) => (e.target as HTMLInputElement).blur()}
                              value={option.maxGroupSize || ''}
                              onChange={(e) => {
                                const newOptions = [...formData.tourOptions];
                                const maxSize = e.target.value ? parseInt(e.target.value) : undefined;
                                newOptions[index].maxGroupSize = maxSize;
                                if (!maxSize) {
                                  newOptions[index].groupPricingTiers = [];
                                }
                                setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                              }}
                              placeholder="e.g., 10"
                              min="1"
                              className="w-full bg-white border-none rounded-xl py-3 px-4 font-semibold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <p className="text-[11px] text-gray-400 mt-2 font-semibold">
                              Maximum number of people you can guide in one group
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
                              <option value="USD">USD ($)</option>
                            </select>
                          </div>
                        </div>

                        {/* Pricing for Each Group Size */}
                        {option.maxGroupSize && option.maxGroupSize >= 1 && (
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
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = [...formData.tourOptions];
                                  const minTier = newOptions[index].groupPricingTiers?.find((t: any) => t.minPeople === 1);
                                  const priceForMin = minTier ? parseFloat(minTier.price) : 0;
                                  if (priceForMin > 0) {
                                    const newTiers = Array.from({ length: option.maxGroupSize || 0 }, (_, i) => {
                                      const numPeople = i + 1;
                                      const calculatedPrice = numPeople === 1
                                        ? priceForMin
                                        : Math.round(priceForMin + (numPeople - 1) * priceForMin * 0.8);
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
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                              {Array.from({ length: option.maxGroupSize || 0 }, (_, i) => i + 1).map((numPeople) => {
                                const existingTier = option.groupPricingTiers?.find((t: any) => t.minPeople === numPeople && t.maxPeople === numPeople);
                                const price = existingTier?.price || '';

                                const baseTier = option.groupPricingTiers?.find((t: any) => t.minPeople === 1);
                                const basePrice = baseTier ? parseFloat(baseTier.price) : 0;
                                const suggestedPrice = basePrice > 0 && numPeople > 1 ? Math.round(basePrice + (numPeople - 1) * basePrice * 0.8) : null;

                                return (
                                  <div key={numPeople} className="bg-white rounded-xl p-2.5 border border-gray-200 flex items-center gap-3">
                                    <div className="w-20">
                                      <span className="text-[13px] font-bold text-[#001A33]">{numPeople} {numPeople === 1 ? 'person' : 'people'}</span>
                                    </div>
                                    <div className="flex-1 flex items-center gap-2">
                                      <span className="text-[14px] font-bold text-[#001A33]">{getCurrencySymbol(option.currency)}</span>
                                      <div className="flex-1 relative">
                                        <input
                                          type="number"
                                          onWheel={(e) => (e.target as HTMLInputElement).blur()}
                                          value={price}
                                          onChange={(e) => {
                                            const newPrice = e.target.value;
                                            const newOptions = [...formData.tourOptions];
                                            const tiers = [...(newOptions[index].groupPricingTiers || [])];
                                            const tierIndex = tiers.findIndex((t: any) => t.minPeople === numPeople && t.maxPeople === numPeople);
                                            if (tierIndex >= 0) {
                                              tiers[tierIndex] = { ...tiers[tierIndex], price: newPrice };
                                            } else {
                                              tiers.push({ minPeople: numPeople, maxPeople: numPeople, price: newPrice });
                                            }
                                            newOptions[index].groupPricingTiers = tiers.sort((a: any, b: any) => a.minPeople - b.minPeople);
                                            setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                          }}
                                          placeholder={suggestedPrice ? `Suggested: ${suggestedPrice}` : "Enter price"}
                                          className="w-full bg-gray-50 border border-gray-300 rounded-xl py-2 px-3 font-bold text-[#001A33] text-[13px] focus:ring-2 focus:ring-[#10B981] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                      </div>
                                      {suggestedPrice && !price && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newOptions = [...formData.tourOptions];
                                            const tiers = [...(newOptions[index].groupPricingTiers || [])];
                                            const tierIndex = tiers.findIndex((t: any) => t.minPeople === numPeople && t.maxPeople === numPeople);
                                            if (tierIndex >= 0) {
                                              tiers[tierIndex] = { ...tiers[tierIndex], price: suggestedPrice.toString() };
                                            } else {
                                              tiers.push({ minPeople: numPeople, maxPeople: numPeople, price: suggestedPrice.toString() });
                                            }
                                            newOptions[index].groupPricingTiers = tiers.sort((a: any, b: any) => a.minPeople - b.minPeople);
                                            setFormData(prev => ({ ...prev, tourOptions: newOptions }));
                                          }}
                                          className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors whitespace-nowrap"
                                        >
                                          Use {suggestedPrice}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            {option.groupPricingTiers && option.groupPricingTiers.length > 0 && option.groupPricingTiers[0]?.price && (
                              <p className="text-[12px] text-[#10B981] font-semibold mt-3">
                                ✓ This option will show: "Starting from {getCurrencySymbol(option.currency)}{parseFloat(option.groupPricingTiers[0].price).toLocaleString()}"
                              </p>
                            )}
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
                            <option value="USD">USD ($)</option>
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
                      durationHours: formData.duration.toLowerCase().includes('day')
                        ? (parseFloat(formData.duration.replace(/[^\d.]/g, '')) * 24).toString()
                        : (formData.duration.replace(/[^\d.]/g, '') || '3'),
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

        {/* Step 8: Photos & Languages */}
        {step === 8 && (
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
                    accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
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
                        📱 Mobile: Tap to choose photos from your gallery
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

              <div id="languages-section">
                <label className="block text-[14px] font-bold text-[#001A33] mb-3">
                  Languages Offered * (Select all that apply)
                </label>
                {showLanguagesError && formData.languages.length === 0 && (
                  <p className="text-red-500 text-[12px] font-bold mb-3 animate-pulse">Please select at least one language to continue</p>
                )}
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

        {/* Step 9: Review */}
        {step === 9 && (
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
                  <div className="text-[16px] font-black text-[#001A33] break-words">
                    {formData.locations.length > 0 ? formData.locations.join(', ') : 'No locations selected'}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">DURATION</div>
                  <div className="text-[16px] font-black text-[#001A33]">{formData.duration}</div>
                </div>

                {/* Itinerary Preview */}
                {formData.itineraryItems.length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3">ITINERARY</div>
                    <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl p-4 mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Info size={14} className="text-[#10B981]" />
                        <span className="text-[13px] font-bold text-[#10B981]">Itineraries are customisable as per your request</span>
                      </div>
                      <p className="text-[12px] text-gray-500 font-semibold ml-5">The schedule below is a suggested plan and can be adjusted to suit your preferences.</p>
                    </div>
                    <div className="relative pl-10">
                      <div className="absolute left-[10px] top-2 bottom-2 w-[3px] bg-[#10B981]/30 rounded-full" />
                      <div className="space-y-3">
                        {formData.itineraryItems.map((item, index) => (
                          <div key={index} className="relative flex items-start gap-3">
                            <div className="absolute left-[-28px] top-1 w-[20px] h-[20px] rounded-full bg-[#10B981] flex items-center justify-center z-10">
                              <span className="text-white text-[10px] font-black">{index + 1}</span>
                            </div>
                            <div>
                              <div className="text-[14px] font-black text-[#001A33]">
                                {item.title}
                                {item.time && <span className="text-[12px] text-gray-400 font-bold ml-2">
                                  {(() => { const [h, m] = item.time.split(':'); const hr = parseInt(h); const period = hr < 12 ? 'AM' : 'PM'; const hr12 = hr === 0 ? 12 : hr > 12 ? hr - 12 : hr; return `${hr12}:${m} ${period}`; })()}
                                </span>}
                                {item.duration && <span className="text-[12px] text-gray-400 font-bold ml-1">· {item.duration}</span>}
                              </div>
                              {item.description && <div className="text-[12px] text-gray-500 font-semibold">{item.description}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Highlights */}
                {formData.highlights.filter(h => h.trim()).length > 0 && (
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">HIGHLIGHTS</div>
                    <ul className="space-y-2">
                      {formData.highlights.filter(h => h.trim()).map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-[#10B981] font-black mt-1">•</span>
                          <span className="text-[16px] font-semibold text-[#001A33] break-words">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Short Description */}
                {formData.shortDescription && (
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">SHORT DESCRIPTION</div>
                    <div className="text-[16px] font-black text-[#001A33] leading-relaxed break-words">{formData.shortDescription}</div>
                  </div>
                )}

                {/* Full Description */}
                {formData.fullDescription && (
                  <div>
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">FULL DESCRIPTION</div>
                    <div className="text-[16px] font-black text-[#001A33] leading-relaxed whitespace-pre-line break-words">{formData.fullDescription}</div>
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
                  <div className="text-[16px] font-black text-[#001A33] break-words">
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
                            Group Tour Pricing ({getCurrencySymbol(formData.currency)})
                          </div>
                          {hasGroupPricingTiers ? (
                            <div className="space-y-2">
                              {formData.groupPricingTiers.map((tier, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-200">
                                  <span className="text-[14px] font-bold text-[#001A33]">
                                    {tier.minPeople}-{tier.maxPeople} {tier.maxPeople === 1 ? 'person' : 'people'}
                                  </span>
                                  <span className="text-[16px] font-black text-[#10B981]">
                                    {getCurrencySymbol(formData.currency)}{tier.price ? parseFloat(tier.price).toLocaleString() : '0'}
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
                                {getCurrencySymbol(formData.currency)}{parseFloat(formData.groupPrice || '0').toLocaleString()}
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
                          {getCurrencySymbol(formData.currency)}{formData.pricePerPerson || '0'} per person
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
                    <div className="font-black text-[#001A33] text-[16px] mb-2">
                      {tour?.status === 'approved' ? 'Update & Keep Live' : 'Ready to submit?'}
                    </div>
                    {formData.images && formData.images.length >= 4 && (
                      <div className="text-[13px] text-gray-600 mt-2 mb-2">
                        💡 <strong>Note:</strong> Submission may take 10-30 seconds because we're uploading {formData.images.length} images. Please be patient and don't close this page.
                      </div>
                    )}
                    <div className="text-[14px] text-[#001A33] font-semibold leading-relaxed">
                      {tour?.status === 'approved'
                        ? 'Your changes will be applied instantly to the live page.'
                        : 'Once submitted, your listing will be reviewed within 24–48 hours. You can make edits later.'}
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
          {isEditing && step !== totalSteps ? (
            /* Editing mode: show Save Changes on every step */
            <>
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 font-black rounded-full text-[14px] hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    handleSubmit(true).catch(err => {
                      console.error('Save changes error:', err);
                      alert(`Error: ${err.message || 'Failed to save changes'}`);
                    });
                  }}
                  disabled={isSubmitting || !hasRequiredContactInfo}
                  className={`px-6 py-3 font-black rounded-full text-[14px] transition-all flex items-center gap-2 ${isSubmitting || !hasRequiredContactInfo
                    ? 'bg-gray-400 cursor-not-allowed opacity-50'
                    : 'bg-[#10B981] hover:bg-[#059669] text-white cursor-pointer'
                    }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      {submissionStatus || 'Saving...'}
                      <span className="animate-spin">⏳</span>
                    </span>
                  ) : (
                    <>
                      Save Changes
                      <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (step === 4 && !formData.duration) {
                      setShowDurationError(true);
                      document.getElementById('duration-select')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                    setStep(Math.min(totalSteps, step + 1));
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-full text-[14px] transition-all"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          ) : (step === totalSteps) ? (
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
                  onClick={handleSaveDraft}
                  disabled={isSubmitting || !hasRequiredContactInfo}
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
                        alert('Please add your contact information (phone or WhatsApp) in your profile first.');
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
                      ? 'Add contact info (phone or WhatsApp) in profile first'
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
                      {tour?.status === 'approved' ? 'Save and Go Live' : 'Submit for Review'}
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
                  if (step === 1) {
                    if (!formData.country) {
                      setShowCountryError(true);
                      document.getElementById('country-select')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                  }
                  if (step === 2) {
                    if (!formData.category) {
                      setShowCategoryError(true);
                      document.getElementById('category-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                    if (!formData.city) {
                      setShowCityError(true);
                      document.getElementById('city-select')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                  }
                  if (step === 3) {
                    if (!formData.title || formData.title.trim() === '') {
                      setShowTitleError(true);
                      document.getElementById('tour-title-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                    if (formData.isMultiDayTour) {
                      const multiCityKeys = Object.keys(formData.multiCityLocations);
                      const hasLocations = multiCityKeys.some(city => formData.multiCityLocations[city]?.length > 0);
                      if (!hasLocations) {
                        setShowLocationsError(true);
                        document.getElementById('locations-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        return;
                      }
                    } else {
                      if (formData.locations.length === 0) {
                        setShowLocationsError(true);
                        document.getElementById('locations-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        return;
                      }
                      const missingTicket = formData.locations.find(loc => !formData.locationEntryTickets[loc]);
                      if (missingTicket) {
                        setShowEntryTicketError(true);
                        document.getElementById(`entry-ticket-${missingTicket}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        return;
                      }
                    }
                  }
                  if (step === 4) {
                    if (!formData.duration) {
                      setShowDurationError(true);
                      document.getElementById('duration-select')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                    if (!formData.maxGroupSize || formData.maxGroupSize < 1) {
                      setShowGroupSizeError(true);
                      document.getElementById('max-group-size-input')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                    const hasPriceForMin = formData.groupPricingTiers?.some(
                      (tier: any) => tier.minPeople === 1 && tier.price && tier.price.trim() !== ''
                    );
                    if (!hasPriceForMin) {
                      setShowPricingError(true);
                      document.getElementById('pricing-tiers-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                  }
                  if (step === 5) {
                    if (!formData.included || formData.included.trim() === '') {
                      setShowIncludedError(true);
                      document.getElementById('included-textarea')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                  }
                  if (step === 6) {
                    if (formData.itineraryItems.length === 0 || !formData.itineraryItems.every((item: any) => item.title?.trim() && item.time?.trim() && item.type)) {
                      setShowItineraryItemsError(true);
                      document.getElementById('itinerary-items-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                    const wordCount = formData.detailedItinerary.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
                    if (wordCount < 500) {
                      setShowDetailedItineraryError(true);
                      document.getElementById('detailed-itinerary-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                  }
                  if (step === 8) {
                    if (formData.languages.length === 0) {
                      setShowLanguagesError(true);
                      document.getElementById('languages-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      return;
                    }
                  }
                  if (canProceed()) {
                    setStep(Math.min(totalSteps, step + 1));
                  }
                }}
                disabled={false}
                className="flex items-center gap-2 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-full text-[14px] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div >
  );
};

export default TourCreationForm;

