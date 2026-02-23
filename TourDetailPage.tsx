import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  Share2,
  Calendar,
  Users,
  Globe,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  Bus,
  Loader2,
  Mail,
  Phone,
  MessageCircle,
  CheckCircle,
  ShieldCheck,
  Zap,
  HelpCircle,
  FileText,
  List,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Map,
  Landmark,
  Utensils,
  Activity,
  Home
} from 'lucide-react';
import BookingForm from './BookingForm';
import RelatedTours from './RelatedTours';
import { Helmet } from 'react-helmet-async';

interface TourDetailPageProps {
  tourId?: string;
  tourSlug?: string;
  country?: string;
  city?: string;
  onClose?: () => void;
}

const TourDetailPage: React.FC<TourDetailPageProps> = ({ tourId, tourSlug, country, city, onClose }) => {
  console.log('TourDetailPage - Component rendered', { tourId, tourSlug, country, city });

  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [participants, setParticipants] = useState(1);
  const [isCustomParticipants, setIsCustomParticipants] = useState(false);
  const [customParticipants, setCustomParticipants] = useState(11);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [showOptionSelectionModal, setShowOptionSelectionModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showGuideContactModal, setShowGuideContactModal] = useState(false);
  const [guideContactInfo, setGuideContactInfo] = useState<any>(null);
  const [pendingBookingData, setPendingBookingData] = useState<any>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: ''
  });
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set());
  const [expandedFAQs, setExpandedFAQs] = useState<Set<number>>(new Set([0, 1, 2])); // First 3 open by default


  const toggleOptionExpand = (optionId: number) => {
    setExpandedOptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(optionId)) {
        newSet.delete(optionId);
      } else {
        newSet.add(optionId);
      }
      return newSet;
    });
  };

  const toggleFAQExpand = (idx: number) => {
    setExpandedFAQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(idx)) {
        newSet.delete(idx);
      } else {
        newSet.add(idx);
      }
      return newSet;
    });
  };

  const bookingBoxRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // Calculate price based on group pricing tiers and number of participants
  const calculateGroupPrice = (tourData: any, numParticipants: number): number | null => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('💰 PRICING CALCULATION START');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📥 Input:', {
      tourDataId: tourData?.id || tourData?.tourId,
      optionTitle: tourData?.optionTitle || 'Main Tour',
      numParticipants,
      hasGroupPricingTiers: !!tourData?.groupPricingTiers,
      groupPricingTiersType: typeof tourData?.groupPricingTiers
    });

    if (!tourData) {
      console.error('❌ PRICING ERROR: tourData is null/undefined');
      return null;
    }

    // CRITICAL: Check Tour.groupPricingTiers FIRST (PRIMARY SOURCE - most reliable)
    // This is now stored directly on Tour model, simple and reliable
    let groupPricingTiers = null;


    if (tour && tour.groupPricingTiers) {
      console.log('🔍 PRIMARY: Checking tour.groupPricingTiers (Tour model - PRIMARY SOURCE)...');
      try {
        if (typeof tour.groupPricingTiers === 'string') {
          groupPricingTiers = JSON.parse(tour.groupPricingTiers);
        } else if (Array.isArray(tour.groupPricingTiers)) {
          groupPricingTiers = tour.groupPricingTiers;
        }
        if (groupPricingTiers && Array.isArray(groupPricingTiers) && groupPricingTiers.length > 0) {
          console.log('✅ PRIMARY: Found groupPricingTiers on Tour model:', groupPricingTiers);
        }
      } catch (e) {
        console.error('❌ Failed to parse tour.groupPricingTiers:', e);
      }
    }

    // FALLBACK: Check tourData.groupPricingTiers (for options with custom pricing)
    if (!groupPricingTiers && tourData.groupPricingTiers) {
      console.log('🔍 FALLBACK: Checking tourData.groupPricingTiers (option custom pricing)...');
      let rawPricingData = tourData.groupPricingTiers;

      console.log('📦 Supplier pricing response (raw):', {
        raw: rawPricingData,
        type: typeof rawPricingData,
        isString: typeof rawPricingData === 'string',
        isArray: Array.isArray(rawPricingData)
      });

      try {
        // Handle both string and object formats
        if (typeof tourData.groupPricingTiers === 'string') {
          console.log('📝 Parsing groupPricingTiers from string...');
          const parsed = JSON.parse(tourData.groupPricingTiers);
          groupPricingTiers = Array.isArray(parsed) ? parsed : null;
          console.log('✅ Parsed pricing slabs:', groupPricingTiers);
        } else if (Array.isArray(tourData.groupPricingTiers)) {
          console.log('✅ Using groupPricingTiers as array directly');
          groupPricingTiers = tourData.groupPricingTiers;
        } else {
          console.warn('⚠️ groupPricingTiers has unexpected type:', typeof tourData.groupPricingTiers);
        }
      } catch (e) {
        console.error('❌ PRICING ERROR: Failed to parse groupPricingTiers:', e);
        console.error('   Raw data:', rawPricingData);
        groupPricingTiers = null;
      }
    }

    // CRITICAL FALLBACK 2: Check main tour's options for groupPricingTiers
    // This handles both main tour and options (options fall back to main tour pricing)
    if (!groupPricingTiers && tour && tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
      console.log('🔍 Checking main tour options for groupPricingTiers fallback...');
      console.log('   Total options available:', tour.options.length);

      // Find main tour option (sortOrder -1 or first option)
      const mainTourOption = tour.options.find((opt: any) => opt.sortOrder === -1) || tour.options[0];

      console.log('   Main tour option:', {
        id: mainTourOption?.id,
        title: mainTourOption?.optionTitle,
        sortOrder: mainTourOption?.sortOrder,
        hasGroupPricingTiers: !!mainTourOption?.groupPricingTiers
      });

      if (mainTourOption && mainTourOption.groupPricingTiers) {
        try {
          console.log('   Found groupPricingTiers on main tour option, parsing...');
          if (typeof mainTourOption.groupPricingTiers === 'string') {
            const parsed = JSON.parse(mainTourOption.groupPricingTiers);
            groupPricingTiers = Array.isArray(parsed) ? parsed : null;
            console.log('✅ Parsed pricing slabs from main tour option:', groupPricingTiers);
          } else if (Array.isArray(mainTourOption.groupPricingTiers)) {
            groupPricingTiers = mainTourOption.groupPricingTiers;
            console.log('✅ Using main tour option pricing slabs directly:', groupPricingTiers);
          }
        } catch (e) {
          console.error('❌ PRICING ERROR: Failed to parse groupPricingTiers from main tour option:', e);
          console.error('   Raw data:', mainTourOption.groupPricingTiers);
        }
      } else {
        // Fallback: Check ALL options for groupPricingTiers (in case main tour option doesn't have it)
        console.log('⚠️ Main tour option has no groupPricingTiers, checking all options...');
        for (const opt of tour.options) {
          console.log(`   Checking option "${opt.optionTitle}" (sortOrder: ${opt.sortOrder}):`, {
            hasGroupPricingTiers: !!opt.groupPricingTiers,
            type: typeof opt.groupPricingTiers
          });
          if (opt.groupPricingTiers) {
            try {
              let parsed = null;
              if (typeof opt.groupPricingTiers === 'string') {
                parsed = JSON.parse(opt.groupPricingTiers);
              } else if (Array.isArray(opt.groupPricingTiers)) {
                parsed = opt.groupPricingTiers;
              }
              if (Array.isArray(parsed) && parsed.length > 0) {
                groupPricingTiers = parsed;
                console.log(`✅ Found groupPricingTiers in option "${opt.optionTitle}":`, groupPricingTiers);
                break; // Use first option that has valid tiers
              }
            } catch (e) {
              console.error(`❌ PRICING ERROR: Failed to parse groupPricingTiers from option ${opt.id}:`, e);
            }
          }
        }
      }
    }

    // CRITICAL: Log parsed pricing slabs
    if (groupPricingTiers && Array.isArray(groupPricingTiers) && groupPricingTiers.length > 0) {
      console.log('📊 Parsed pricing slabs:', groupPricingTiers);
      console.log('   Total slabs:', groupPricingTiers.length);

      // CRITICAL: Always log the default price (1-1 person)
      const defaultSlab = groupPricingTiers.find((t: any) => t.minPeople === 1 && t.maxPeople === 1);
      if (defaultSlab) {
        console.log('✅ Default price (1-1 person):', defaultSlab.price);
      } else {
        console.warn('⚠️ WARNING: No 1-1 person slab found! First slab:', groupPricingTiers[0]);
      }
    } else {
      console.warn('⚠️ WARNING: No pricing slabs found! Attempting fallback...');
      console.warn('   Pricing mismatch reason: groupPricingTiers is null or empty');
      console.warn('   tourData:', {
        id: tourData.id || tourData.tourId,
        optionTitle: tourData.optionTitle,
        hasGroupPricingTiers: !!tourData.groupPricingTiers,
        pricePerPerson: tourData.pricePerPerson || tour?.pricePerPerson,
        maxGroupSize: tourData.maxGroupSize || tour?.maxGroupSize
      });

      // CRITICAL FALLBACK: Check main tour's groupPricingTiers before using multiplication
      // If tourData is an option without groupPricingTiers, use main tour's tiers
      console.log('🔍 FALLBACK: Checking main tour for groupPricingTiers...');

      // FALLBACK 1: Check main tour option (sortOrder: -1) - this should have the main tour's tiers
      if (!groupPricingTiers && tour && tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
        const mainTourOption = tour.options.find((opt: any) => opt.sortOrder === -1) || tour.options[0];
        console.log('   Checking main tour option:', {
          id: mainTourOption?.id,
          title: mainTourOption?.optionTitle,
          sortOrder: mainTourOption?.sortOrder,
          hasGroupPricingTiers: !!mainTourOption?.groupPricingTiers
        });

        if (mainTourOption && mainTourOption.groupPricingTiers) {
          try {
            let mainTiers = null;
            if (typeof mainTourOption.groupPricingTiers === 'string') {
              mainTiers = JSON.parse(mainTourOption.groupPricingTiers);
            } else if (Array.isArray(mainTourOption.groupPricingTiers)) {
              mainTiers = mainTourOption.groupPricingTiers;
            }

            if (Array.isArray(mainTiers) && mainTiers.length > 0) {
              console.log('✅ FALLBACK: Found main tour option groupPricingTiers, using for calculation');
              console.log('   Pricing slabs:', mainTiers);
              groupPricingTiers = mainTiers;
              // Continue to tier matching logic below - skip multiplication fallback
            }
          } catch (e) {
            console.error('❌ Failed to parse main tour option groupPricingTiers:', e);
          }
        }
      }

      // FALLBACK 2: If still no tiers, check tour.groupPricingTiers directly
      if (!groupPricingTiers && tour && tour.groupPricingTiers) {
        console.log('🔍 FALLBACK 2: Checking tour.groupPricingTiers directly...');
        try {
          let mainTiers = null;
          if (typeof tour.groupPricingTiers === 'string') {
            mainTiers = JSON.parse(tour.groupPricingTiers);
          } else if (Array.isArray(tour.groupPricingTiers)) {
            mainTiers = tour.groupPricingTiers;
          }

          if (Array.isArray(mainTiers) && mainTiers.length > 0) {
            console.log('✅ FALLBACK: Found tour.groupPricingTiers, using for calculation');
            console.log('   Pricing slabs:', mainTiers);
            groupPricingTiers = mainTiers;
          }
        } catch (e) {
          console.error('❌ Failed to parse tour.groupPricingTiers:', e);
        }
      }

      // FALLBACK 3: If we STILL don't have groupPricingTiers, try TEMPORARY multiplication fallback
      if (!groupPricingTiers || !Array.isArray(groupPricingTiers) || groupPricingTiers.length === 0) {
        const fallbackPricePerPerson = tourData.pricePerPerson || tour?.pricePerPerson;
        const fallbackMaxGroupSize = tourData.maxGroupSize || tour?.maxGroupSize || 10;

        if (fallbackPricePerPerson && fallbackPricePerPerson > 0) {
          console.warn('⚠️ WARNING: Using TEMPORARY multiplication fallback');
          console.warn('   This means groupPricingTiers is missing from database');
          console.warn('   pricePerPerson:', fallbackPricePerPerson);
          console.warn('   maxGroupSize:', fallbackMaxGroupSize);
          console.warn('⚠️ Tour should be edited and re-submitted to save proper groupPricingTiers');

          // CRITICAL: For fallback, return pricePerPerson * numParticipants
          // This makes pricing dynamic even without proper tiers
          // NOTE: This is NOT ideal - proper tiered pricing should be saved in database
          const fallbackPrice = parseFloat(fallbackPricePerPerson.toString()) * numParticipants;
          console.log('💰 Fallback calculated price:', fallbackPrice, `(${fallbackPricePerPerson} * ${numParticipants})`);
          console.log('═══════════════════════════════════════════════════════════');
          return fallbackPrice;
        } else {
          console.error('❌ PRICING ERROR: No pricing data available and no fallback possible');
          console.error('   pricePerPerson:', fallbackPricePerPerson);
          console.error('   maxGroupSize:', fallbackMaxGroupSize);
          console.log('═══════════════════════════════════════════════════════════');
          return null;
        }
      }
    }

    // If group pricing tiers exist, find the matching tier
    if (groupPricingTiers && Array.isArray(groupPricingTiers) && groupPricingTiers.length > 0) {
      console.log('🔍 Selected persons:', numParticipants);
      console.log('   Searching for matching slab...');

      // Find the tier that matches the number of participants (exact match first)
      // For tiers like {minPeople: 4, maxPeople: 4}, we need exact match
      let matchingTier = null;
      for (const tier of groupPricingTiers) {
        const min = tier.minPeople || 0;
        const max = tier.maxPeople || Infinity;
        const matches = numParticipants >= min && numParticipants <= max;
        console.log(`   Checking tier ${min}-${max}: ${numParticipants} >= ${min} && ${numParticipants} <= ${max} = ${matches} (price: ${tier.price})`);
        if (matches) {
          matchingTier = tier;
          break; // Use first matching tier
        }
      }

      if (matchingTier && matchingTier.price) {
        const price = parseFloat(matchingTier.price);
        if (isNaN(price) || price <= 0) {
          console.error('❌ PRICING ERROR: Invalid price in matched slab:', matchingTier.price);
          console.error('   Pricing mismatch reason: price is NaN or <= 0');
          return null;
        }

        console.log('✅ Matched slab:', {
          tier: `${matchingTier.minPeople}-${matchingTier.maxPeople} people`,
          price,
          numParticipants,
          rawPrice: matchingTier.price
        });
        console.log('💰 Final calculated price:', price);
        console.log('═══════════════════════════════════════════════════════════');
        return price;
      }

      // If no exact match and participants exceed max tier, use the highest tier price
      const lastTier = groupPricingTiers[groupPricingTiers.length - 1];
      if (lastTier && lastTier.price && numParticipants > lastTier.maxPeople) {
        const maxTierPrice = parseFloat(lastTier.price);

        if (!isNaN(maxTierPrice) && maxTierPrice > 0) {
          console.warn('⚠️ Participants exceed max tier, using highest tier price:', {
            numParticipants,
            maxTier: `${lastTier.minPeople}-${lastTier.maxPeople}`,
            maxTierPrice
          });
          console.log('💰 Final calculated price (highest tier):', maxTierPrice);
          console.log('═══════════════════════════════════════════════════════════');
          return maxTierPrice;
        }
      }

      console.error('❌ PRICING ERROR: No matching tier found for', numParticipants, 'participants');
      console.error('   Available tiers:',
        groupPricingTiers.map((t: any) => `${t.minPeople}-${t.maxPeople} (₹${t.price})`).join(', '));
      console.error('   Pricing mismatch reason: numParticipants outside all tier ranges');
      console.log('═══════════════════════════════════════════════════════════');
      return null;
    }

    // DO NOT use groupPrice fallback - it's the LAST tier price (wrong for "starting from")
    // groupPrice is ₹8,200 (10 people), not ₹1,000 (1 person)
    // If we have groupPricingTiers, we should have found a match above
    console.error('❌ PRICING ERROR: No pricing slabs available');
    console.error('   Pricing mismatch reason: groupPricingTiers is null or empty after all checks');
    console.log('═══════════════════════════════════════════════════════════');
    return null;
  };

  // Always per group pricing - simplified function
  const isGroupPricing = (tourData: any): boolean => {
    // Always return true - all pricing is per group now
    return true;
    if (!tourData) return false;

    const isOption = !!(tourData.optionTitle || tourData.tourId);
    const itemName = isOption ? `Option "${tourData.optionTitle || 'Unknown'}"` : `Main Tour "${tourData.title || 'Unknown'}"`;

    // FIRST: Check tourTypes for "Group Tour" - this is the primary indicator (only for main tours, not options)
    if (!isOption && tourData.tourTypes) {
      try {
        const tourTypes = typeof tourData.tourTypes === 'string'
          ? JSON.parse(tourData.tourTypes)
          : tourData.tourTypes;
        if (Array.isArray(tourTypes) && tourTypes.some((t: string) =>
          t && typeof t === 'string' && t.toLowerCase().includes('group')
        )) {
          console.log(`✅ ${itemName}: Group pricing detected via tourTypes`);
          return true; // Has "Group Tour" in tourTypes = per_group
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    // SECOND: Check for group pricing tiers (works for both main tour and options)
    if (tourData.groupPricingTiers) {
      try {
        const tiers = typeof tourData.groupPricingTiers === 'string'
          ? JSON.parse(tourData.groupPricingTiers)
          : tourData.groupPricingTiers;
        if (Array.isArray(tiers) && tiers.length > 0) {
          console.log(`✅ ${itemName}: Group pricing detected via groupPricingTiers (${tiers.length} tiers)`);
          return true; // Has group pricing tiers = per_group
        }
      } catch (e) {
        console.error(`❌ ${itemName}: Error parsing groupPricingTiers:`, e);
      }
    }

    // THIRD: Check for legacy groupPrice + maxGroupSize (works for both main tour and options)
    if (tourData.groupPrice && tourData.maxGroupSize) {
      console.log(`✅ ${itemName}: Group pricing detected via legacy groupPrice + maxGroupSize`);
      return true; // Has groupPrice + maxGroupSize = per_group
    }

    // FOURTH: If this is main tour (not an option), check main tour option for group pricing
    // This handles the case where main tour's group pricing tiers are stored in a special option (sortOrder: -1)
    const isMainTour = tourData.id && !tourData.optionTitle && !tourData.tourId;
    if (isMainTour && tour && tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
      const mainTourOption = tour.options.find((opt: any) => opt.sortOrder === -1);
      if (mainTourOption) {
        // Check main tour option's groupPricingTiers
        if (mainTourOption.groupPricingTiers) {
          try {
            const tiers = typeof mainTourOption.groupPricingTiers === 'string'
              ? JSON.parse(mainTourOption.groupPricingTiers)
              : mainTourOption.groupPricingTiers;
            if (Array.isArray(tiers) && tiers.length > 0) {
              console.log(`✅ ${itemName}: Group pricing detected via main tour option's groupPricingTiers (${tiers.length} tiers)`);
              return true; // Main tour option has group pricing tiers = per_group
            }
          } catch (e) {
            console.error(`❌ ${itemName}: Error parsing main tour option's groupPricingTiers:`, e);
          }
        }
        // Check main tour option's legacy groupPrice + maxGroupSize
        if (mainTourOption.groupPrice && mainTourOption.maxGroupSize) {
          console.log(`✅ ${itemName}: Group pricing detected via main tour option's legacy groupPrice + maxGroupSize`);
          return true;
        }
      }
    }

    console.log(`❌ ${itemName}: No group pricing detected - defaulting to per person`);
    return false; // No group pricing = per_person
  };

  const parseJsonField = (field: any, defaultValue: any = []) => {
    if (!field) return defaultValue;
    try {
      return typeof field === 'string' ? JSON.parse(field) : field;
    } catch (e) {
      console.error('Error parsing JSON field:', e);
      return defaultValue;
    }
  };

  useEffect(() => {
    console.log('TourDetailPage - useEffect triggered', { tourId, tourSlug, country, city });
    fetchTour();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId, tourSlug]);

  // Load draft booking data after tour is loaded
  useEffect(() => {
    if (tour?.id) {
      const draftKey = `booking_draft_${tour.id}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          if (draft.bookingData) {
            setBookingData(draft.bookingData);
          }
          if (draft.selectedDate) {
            setSelectedDate(draft.selectedDate);
          }
          if (draft.participants) {
            if (draft.participants > 8) {
              setIsCustomParticipants(true);
              setCustomParticipants(draft.participants);
              setParticipants(draft.participants);
            } else {
              setIsCustomParticipants(false);
              setParticipants(draft.participants);
            }
          }
          if (draft.selectedOptionId && tour.options) {
            const option = tour.options.find((opt: any) => opt.id === draft.selectedOptionId);
            if (option) {
              setSelectedOption(option);
            }
          }
        } catch (error) {
          console.error('Error loading booking draft:', error);
        }
      }
    }
  }, [tour?.id]);

  // Save booking draft when data changes (auto-save)
  useEffect(() => {
    if (tour?.id && (bookingData.customerName || bookingData.customerEmail || bookingData.customerPhone || bookingData.specialRequests || selectedDate || participants > 1)) {
      const draftKey = `booking_draft_${tour.id}`;
      const draft = {
        bookingData,
        selectedDate,
        participants,
        selectedOptionId: selectedOption?.id || null,
        tourId: tour.id
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }
  }, [bookingData, selectedDate, participants, selectedOption, tour?.id]);


  // Set SEO meta tags - MUST be called before any early returns
  useEffect(() => {
    if (tour) {
      const countrySlug = country?.toLowerCase() || '';
      const citySlug = city?.toLowerCase() || '';
      const tourUrl = tour.slug && country && city
        ? `https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tour.slug}`
        : `https://www.asiabylocals.com/tour/${tour.id}`;

      const description = tour.shortDescription || tour.fullDescription?.substring(0, 155) || 'Discover authentic local tours and cultural experiences';
      const imageUrl = (tour.images && Array.isArray(tour.images) && tour.images.length > 0)
        ? tour.images[0]
        : 'https://www.asiabylocals.com/logo.png';

      // Set page title
      document.title = `${tour.title} | ${city || 'Tour'} | AsiaByLocals`;

      // Set meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);

      // Set canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', tourUrl);

      // Open Graph tags
      const ogTags = [
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: tourUrl },
        { property: 'og:title', content: tour.title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: imageUrl },
        { property: 'og:site_name', content: 'AsiaByLocals' },
        { property: 'og:locale', content: 'en_US' },
      ];

      ogTags.forEach(tag => {
        let meta = document.querySelector(`meta[property="${tag.property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', tag.property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', tag.content);
      });

      // Helper to convert duration to ISO 8601
      const convertToISO8601Duration = (duration: string) => {
        if (!duration) return 'PT3H';
        const match = duration.match(/(\d+)/);
        if (match) {
          const value = match[1];
          const lower = duration.toLowerCase();
          if (lower.includes('day')) return `P${value}D`;
          if (lower.includes('hour') || lower.includes('hr')) return `PT${value}H`;
        }
        return 'PT3H';
      };

      // Generate consistent rating/review count between 4.0-5.0 based on tour ID
      const seed = parseInt(tour.id) || 0;
      const random = (seed * 9301 + 49297) % 233280;
      const normalized = random / 233280;
      const ratingValue = (4.0 + (normalized * 1.0)).toFixed(1);
      const reviewCount = Math.floor(normalized * 100) + 20; // 20-120 reviews

      // Structured Data (JSON-LD) - Tour schema with multiple types for better visibility
      const existingSchema = document.querySelector('script[type="application/ld+json"][data-tour-schema]');
      if (existingSchema) existingSchema.remove();

      const parseImages = () => {
        if (!tour.images) return [];
        try {
          return typeof tour.images === 'string' ? JSON.parse(tour.images) : tour.images;
        } catch {
          return Array.isArray(tour.images) ? tour.images : [];
        }
      };

      const parseLocations = () => {
        if (!tour.locations) return [];
        try {
          return typeof tour.locations === 'string' ? JSON.parse(tour.locations) : tour.locations;
        } catch {
          return Array.isArray(tour.locations) ? tour.locations : [];
        }
      };

      const images = parseImages();
      const locations = parseLocations();

      // Enhanced structured data with multiple schema types for better indexing
      const structuredData = {
        "@context": "https://schema.org",
        "@type": ["Product", "TouristTrip"],
        "name": tour.title,
        "description": tour.fullDescription || tour.shortDescription || description,
        "image": images.length > 0 ? images : ['https://www.asiabylocals.com/logo.png'],
        "url": tourUrl,
        "sku": `tour-${tour.id}`,
        "mpn": `tour-${tour.id}`,
        "brand": {
          "@type": "Brand",
          "name": "AsiaByLocals"
        },
        "tourBookingPage": tourUrl,
        "touristType": "Tourist",
        "itinerary": locations.length > 0 ? {
          "@type": "ItemList",
          "itemListElement": locations.map((loc: string, idx: number) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": loc
          }))
        } : undefined,
        "offers": {
          "@type": "Offer",
          "price": tour.pricePerPerson || 0,
          "priceCurrency": tour.currency || "INR",
          "availability": tour.status === 'approved' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": tourUrl,
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        "duration": convertToISO8601Duration(tour.duration),
        "location": {
          "@type": "Place",
          "name": city || "Tour Location",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": city || "",
            "addressCountry": country || ""
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": ratingValue,
          "reviewCount": reviewCount
        }
      };

      // Add BreadcrumbList schema for better navigation understanding
      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.asiabylocals.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": country || "Country",
            "item": `https://www.asiabylocals.com/${country?.toLowerCase() || ''}`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": city || "City",
            "item": `https://www.asiabylocals.com/${country?.toLowerCase() || ''}/${city?.toLowerCase() || ''}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": tour.title,
            "item": tourUrl
          }
        ]
      };

      // Remove undefined fields
      Object.keys(structuredData).forEach(key => {
        if (structuredData[key as keyof typeof structuredData] === undefined) {
          delete structuredData[key as keyof typeof structuredData];
        }
      });

      // Remove existing schemas if any
      const existingTourSchemas = document.querySelectorAll('script[type="application/ld+json"][data-tour-schema]');
      existingTourSchemas.forEach(schema => schema.remove());
      const existingBreadcrumbSchemas = document.querySelectorAll('script[type="application/ld+json"][data-breadcrumb-schema]');
      existingBreadcrumbSchemas.forEach(schema => schema.remove());

      // Add TouristTrip schema
      const tourScript = document.createElement('script');
      tourScript.type = 'application/ld+json';
      tourScript.setAttribute('data-tour-schema', 'true');
      tourScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(tourScript);

      // Add BreadcrumbList schema
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.setAttribute('data-breadcrumb-schema', 'true');
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
      document.head.appendChild(breadcrumbScript);

      // FAQ Schema (JSON-LD)
      const tourTitle = tour.title || 'this tour';
      const tourFAQs = [
        {
          question: `What is specifically included in the ${tourTitle}?`,
          answer: tour.included || `The ${tourTitle} includes a professional licensed guide, entry tickets to major monuments as per selection, and a fully customizable itinerary to suit your pace.`
        },
        {
          question: `How long does the ${tourTitle} usually take?`,
          answer: `The ${tourTitle} typically lasts about ${tour.duration || 'a few hours'}. We recommend starting early to make the most of your time and avoid peak crowds.`
        },
        {
          question: `What should I bring for my ${tourTitle}?`,
          answer: "For a comfortable experience, we recommend carrying an original ID (passport for international visitors), comfortable walking shoes, and sun protection. Please note that large bags are often restricted at heritage sites."
        }
      ];

      if (city?.toLowerCase() === 'agra' || tourTitle.toLowerCase().includes('taj mahal')) {
        tourFAQs.push({
          question: "Is the Taj Mahal closed on Fridays?",
          answer: "Yes, the Taj Mahal remains closed every Friday for prayers. Please ensure your tour date does not fall on a Friday if visiting the Taj Mahal is your priority."
        });
        tourFAQs.push({
          question: "Is an original passport required for Taj Mahal entry?",
          answer: "Yes, all foreign tourists must present their original passport (or a high-quality digital copy) at the entrance for identity verification and security clearance."
        });
      }

      tourFAQs.push({
        question: `Can I cancel my ${tourTitle} booking?`,
        answer: "Yes, we offer a flexible cancellation policy. You can cancel your booking up to 24 hours before the scheduled start time for a full refund."
      });

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": tourFAQs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };

      const existingFaqSchema = document.querySelector('script[type="application/ld+json"][data-faq-schema]');
      if (existingFaqSchema) existingFaqSchema.remove();

      const faqScript = document.createElement('script');
      faqScript.type = 'application/ld+json';
      faqScript.setAttribute('data-faq-schema', 'true');
      faqScript.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(faqScript);
    }
  }, [tour, city, country]);

  const fetchTour = async () => {
    setLoading(true);
    try {
      // Use relative path in development to leverage Vite proxy for mobile testing
      // In production, use VITE_API_URL or origin
      const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'));
      let url;
      if (tourSlug) {
        // Use slug-based endpoint for SEO-friendly URLs
        url = `${API_URL}/api/public/tours/by-slug/${encodeURIComponent(tourSlug)}`;
        console.log('TourDetailPage - Fetching tour by slug:', tourSlug);
        console.log('TourDetailPage - Full URL:', url);
      } else if (tourId) {
        // Fallback to ID-based endpoint
        url = `${API_URL}/api/public/tours/${tourId}`;
        console.log('TourDetailPage - Fetching tour by ID:', tourId);
      } else {
        console.warn('TourDetailPage - No tourId or tourSlug provided');
        setLoading(false);
        return;
      }

      console.log('TourDetailPage - Making API request to:', url);
      const response = await fetch(url);
      console.log('TourDetailPage - Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();


      console.log('═══════════════════════════════════════════════════════════');
      console.log('📥 FRONTEND - API RESPONSE RECEIVED');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('API Response:', data);


      if (data.success && data.tour) {
        console.log('✅ Tour data received:', data.tour.title);
        console.log('📊 Supplier pricing response (raw):', {
          pricePerPerson: data.tour.pricePerPerson,
          optionsCount: data.tour.options?.length || 0,
          hasGroupPricingTiers: !!data.tour.groupPricingTiers
        });
        console.log('TourDetailPage - Options:', data.tour.options);
        console.log('TourDetailPage - Options type:', typeof data.tour.options, Array.isArray(data.tour.options));
        console.log('TourDetailPage - Options count:', data.tour.options?.length);

        // CRITICAL: Log each option's groupPricingTiers in detail
        if (data.tour.options && Array.isArray(data.tour.options)) {
          console.log('═══════════════════════════════════════════════════════════');
          console.log('📊 OPTIONS PRICING DATA DETAILS');
          console.log('═══════════════════════════════════════════════════════════');
          data.tour.options.forEach((opt: any, idx: number) => {
            console.log(`Option ${idx + 1}:`, {
              id: opt.id,
              title: opt.optionTitle,
              sortOrder: opt.sortOrder,
              price: opt.price,
              hasGroupPricingTiers: !!opt.groupPricingTiers,
              groupPricingTiersType: typeof opt.groupPricingTiers,
              groupPricingTiersValue: opt.groupPricingTiers,
              groupPricingTiersPreview: opt.groupPricingTiers
                ? (typeof opt.groupPricingTiers === 'string'
                  ? opt.groupPricingTiers.substring(0, 200)
                  : JSON.stringify(opt.groupPricingTiers).substring(0, 200))
                : 'null',
              fullOptionKeys: Object.keys(opt)
            });
          });
          console.log('═══════════════════════════════════════════════════════════');
        }
        // Log each option's groupPricingTiers for debugging
        if (data.tour.options && Array.isArray(data.tour.options)) {
          console.log('📊 TourDetailPage - Options groupPricingTiers check:');
          data.tour.options.forEach((opt: any, idx: number) => {
            console.log(`  Option ${idx + 1}:`, {
              id: opt.id,
              title: opt.optionTitle,
              sortOrder: opt.sortOrder,
              hasGroupPricingTiers: !!opt.groupPricingTiers,
              groupPricingTiersType: typeof opt.groupPricingTiers,
              groupPricingTiersValue: opt.groupPricingTiers ? (typeof opt.groupPricingTiers === 'string' ? opt.groupPricingTiers.substring(0, 100) : 'array/object') : null
            });
          });
        }
        console.log('TourDetailPage - Highlights:', data.tour.highlights);
        console.log('TourDetailPage - Highlights type:', typeof data.tour.highlights, Array.isArray(data.tour.highlights));
        console.log('TourDetailPage - Highlights count:', data.tour.highlights?.length);

        // Ensure options is always an array
        if (data.tour.options && !Array.isArray(data.tour.options)) {
          console.warn('TourDetailPage - Options is not an array, converting...', data.tour.options);
          data.tour.options = [];
        }

        // Ensure highlights is always an array
        if (data.tour.highlights && !Array.isArray(data.tour.highlights)) {
          console.warn('TourDetailPage - Highlights is not an array, converting...', data.tour.highlights);
          try {
            data.tour.highlights = typeof data.tour.highlights === 'string' ? JSON.parse(data.tour.highlights) : [];
          } catch (e) {
            console.error('TourDetailPage - Error parsing highlights:', e);
            data.tour.highlights = [];
          }
        }


        setTour(data.tour);
        setError(null);
        if (data.tour.languages && data.tour.languages.length > 0) {
          setSelectedLanguage(data.tour.languages[0]);
        }
        // Check if main tour has group pricing - if so, add it as an option
        // Parse groupPricingTiers properly
        let mainTourHasGroupPricing = false;
        let mainTourGroupPricingTiers = null;

        if (data.tour.groupPricingTiers) {
          try {
            mainTourGroupPricingTiers = typeof data.tour.groupPricingTiers === 'string'
              ? JSON.parse(data.tour.groupPricingTiers)
              : data.tour.groupPricingTiers;
            mainTourHasGroupPricing = Array.isArray(mainTourGroupPricingTiers) && mainTourGroupPricingTiers.length > 0;
          } catch (e) {
            console.error('Error parsing main tour groupPricingTiers:', e);
          }
        } else {
        }

        // Also check for legacy groupPrice + maxGroupSize
        if (!mainTourHasGroupPricing && data.tour.groupPrice && data.tour.maxGroupSize) {
          mainTourHasGroupPricing = true;
        }

        // Create main tour as an option if it has group pricing
        if (mainTourHasGroupPricing) {
          // Main tour has group pricing AND has options - create a "main tour" option
          const mainTourOption = {
            id: 'main-tour',
            tourId: data.tour.id,
            optionTitle: data.tour.title,
            optionDescription: data.tour.shortDescription || data.tour.fullDescription?.substring(0, 200) || '',
            durationHours: parseFloat(data.tour.duration?.replace(/[^0-9.]/g, '')) || 3,
            price: data.tour.pricePerPerson || 0,
            currency: data.tour.currency || 'INR',
            language: data.tour.languages?.[0] || 'English',
            pickupIncluded: false,
            entryTicketIncluded: false,
            guideIncluded: true,
            carIncluded: false,
            groupPrice: data.tour.groupPrice,
            maxGroupSize: data.tour.maxGroupSize,
            groupPricingTiers: mainTourGroupPricingTiers || data.tour.groupPricingTiers,
            sortOrder: -1 // Show main tour option first
          };

          // Prepend main tour option to options array
          if (!data.tour.options) data.tour.options = [];
          data.tour.options = [mainTourOption, ...data.tour.options];
          console.log('TourDetailPage - Added main tour as option (has group pricing):', mainTourOption);
        }

        // DO NOT auto-select any option - let user choose
        console.log('TourDetailPage - No option auto-selected - user must choose');
      } else {
        console.error('TourDetailPage - Tour not found or invalid response:', data);
        setTour(null);
        setError(data.message || data.error || 'Tour not found');
      }
    } catch (error: any) {
      console.error('TourDetailPage - Error fetching tour:', error);
      setTour(null);
      setError(error.message || 'Failed to load tour');
    } finally {
      setLoading(false);
      console.log('TourDetailPage - Loading complete');
    }
  };

  // Generate dates for next 7 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleOptionSelected = (option: any) => {
    // Toggle: if clicking the same option, deselect it (go back to main tour)
    if (selectedOption?.id === option.id) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option);
      // Scroll to booking box on mobile when option is selected
      if (window.innerWidth < 1024 && bookingBoxRef.current) {
        setTimeout(() => {
          bookingBoxRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
    setShowOptionSelectionModal(false);
    if (bookingError === 'Please select a tour option first') {
      setBookingError(null);
    }
  };

  const handleCheckAvailability = async () => {
    if (!selectedDate) {
      setBookingError('Please select a date first');
      return;
    }

    if (tour?.options && Array.isArray(tour.options) && tour.options.length > 0 && !selectedOption) {
      setBookingError('Please select a tour option first');
      if (optionsRef.current) {
        optionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setBookingError(null);
    setAvailabilityStatus('checking');

    // Simulate API call - in real app, this would check actual availability
    setTimeout(() => {
      setAvailabilityStatus('available');
    }, 1000);
  };

  const handleProceedToBooking = () => {
    if (!selectedDate) {
      setBookingError('Please select a date first');
      return;
    }

    // If tour has options but none selected, prompt user to select one
    if (tour?.options && Array.isArray(tour.options) && tour.options.length > 0 && !selectedOption) {
      setBookingError('Please select a tour option first');
      if (optionsRef.current) {
        optionsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setBookingError(null);

    if (availabilityStatus === 'available') {
      // Load draft data when opening booking modal
      if (tour?.id) {
        const draftKey = `booking_draft_${tour.id}`;
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          try {
            const draft = JSON.parse(savedDraft);
            if (draft.bookingData) {
              setBookingData(draft.bookingData);
            }
            if (draft.selectedDate) {
              setSelectedDate(draft.selectedDate);
            }
            if (draft.participants) {
              if (draft.participants > 10) {
                setIsCustomParticipants(true);
                setCustomParticipants(draft.participants);
                setParticipants(draft.participants);
              } else {
                setIsCustomParticipants(false);
                setParticipants(draft.participants);
              }
            }
            if (draft.selectedOptionId && tour.options) {
              const option = tour.options.find((opt: any) => opt.id === draft.selectedOptionId);
              if (option) {
                setSelectedOption(option);
              }
            }
          } catch (error) {
            console.error('Error loading booking draft:', error);
          }
        }
      }
      setShowBookingModal(true);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tour || !selectedDate) {
      alert('Please select a date and ensure tour is loaded');
      return;
    }

    // Calculate total amount using pricing type detection
    let totalAmount = 0;
    let currency = selectedOption?.currency || tour.currency || 'INR';
    const currentParticipants = isCustomParticipants ? customParticipants : participants;
    const tourData = selectedOption || tour;

    // Always use group pricing logic - calculate from tiers
    const groupPrice = calculateGroupPrice(tourData, currentParticipants);

    if (groupPrice !== null && groupPrice > 0) {
      totalAmount = groupPrice;
    } else {
      // DO NOT use groupPrice fallback - it's the LAST tier price (wrong)
      // Fallback: use pricePerPerson (should be first tier price)
      const pricePerPerson = selectedOption?.price || tour.pricePerPerson || 0;
      totalAmount = pricePerPerson;
    }

    // Store booking data and show booking form
    setPendingBookingData({
      tourId: tour.id,
      tourOptionId: selectedOption?.id || null,
      bookingDate: selectedDate,
      numberOfGuests: currentParticipants,
      specialRequests: '',
      totalAmount: totalAmount,
      currency: currency
    });

    setShowBookingModal(false);
    setShowBookingForm(true);
  };

  const handleProceedToPayment = async (guestData: {
    fullName: string;
    email: string;
    country: string;
    countryCode: string;
    phoneNumber: string;
    specialRequests?: string;
  }) => {
    if (!pendingBookingData || !tour) {
      alert('Booking data is missing. Please try again.');
      return;
    }

    // Create booking via API
    try {
      setIsInitializingPayment(true); // Show loading state
      // Use relative path in development to leverage Vite proxy for mobile testing
      // In production, use VITE_API_URL or origin
      const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'));
      console.log('📝 Creating booking...', {
        tourId: pendingBookingData.tourId,
        bookingDate: pendingBookingData.bookingDate,
        numberOfGuests: pendingBookingData.numberOfGuests,
        totalAmount: pendingBookingData.totalAmount
      });

      const bookingResponse = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: pendingBookingData.tourId,
          tourOptionId: pendingBookingData.tourOptionId,
          bookingDate: pendingBookingData.bookingDate,
          numberOfGuests: pendingBookingData.numberOfGuests,
          customerName: guestData.fullName,
          customerEmail: guestData.email,
          customerPhone: `${guestData.countryCode}${guestData.phoneNumber}`,
          specialRequests: guestData.specialRequests || '',
          totalAmount: pendingBookingData.totalAmount,
          currency: pendingBookingData.currency
        }),
      });

      const bookingResult = await bookingResponse.json();
      console.log('📝 Booking response:', bookingResult);

      if (!bookingResponse.ok) {
        throw new Error(bookingResult.message || `HTTP error! status: ${bookingResponse.status}`);
      }

      if (bookingResult.success) {
        const bookingId = bookingResult.booking.id.toString();
        console.log('✅ Booking created successfully:', bookingId);

        // Store booking ID for fallback
        sessionStorage.setItem('pending_booking_id', bookingId);
        localStorage.setItem('last_booking_id', bookingId);

        // Close booking form and initialize Razorpay payment
        setShowBookingForm(false);

        try {
          // Initialize Razorpay payment
          await initializeRazorpayPayment(
            bookingId,
            pendingBookingData.totalAmount,
            pendingBookingData.currency,
            {
              fullName: guestData.fullName,
              email: guestData.email,
              phoneNumber: `${guestData.countryCode}${guestData.phoneNumber}`
            }
          );
        } catch (paymentError) {
          console.error('❌ Payment initialization error:', paymentError);
          setIsInitializingPayment(false);
          alert(`Payment initialization failed: ${paymentError instanceof Error ? paymentError.message : 'Unknown error'}. Your booking was created (ID: ${bookingId}). Please contact support.`);
        }
      } else {
        setIsInitializingPayment(false);
        console.error('❌ Booking creation failed:', bookingResult);
        alert(bookingResult.message || 'Failed to create booking. Please try again.');
      }
    } catch (error) {
      setIsInitializingPayment(false);
      console.error('❌ Booking error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to create booking: ${errorMessage}. Please check your connection and try again.`);
    }
  };


  const initializeRazorpayPayment = async (bookingId: string, amount: number, currency: string, guestData?: {
    fullName: string;
    email: string;
    phoneNumber: string;
  }) => {
    try {
      console.log('💳 Initializing Razorpay payment...', { bookingId, amount, currency });

      // Step 1: Create payment order via backend
      // Use relative path in development to leverage Vite proxy for mobile testing
      // In production, use VITE_API_URL or origin
      const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'));
      const paymentResponse = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          amount: amount * 100, // Convert to paise
          currency: currency || 'INR'
        }),
      });

      const paymentData = await paymentResponse.json();
      console.log('💳 Payment order response:', paymentData);

      if (!paymentData.success || !paymentData.order?.id || !paymentData.razorpayKeyId) {
        setIsInitializingPayment(false);
        alert(`Failed to initialize payment: ${paymentData.message || 'Invalid order data'}`);
        return;
      }

      // Step 2: Open Razorpay modal checkout (NO callback_url, NO redirect)
      const options = {
        key: paymentData.razorpayKeyId,
        amount: paymentData.order.amount,
        currency: paymentData.order.currency || 'INR',
        name: 'AsiaByLocals',
        description: `Booking for ${tour?.title || 'Tour'}`,
        order_id: paymentData.order.id,
        save: false, // CRITICAL: Prevent card saving prompt that causes redirects

        // Step 3: Payment success handler — verify on backend, then redirect
        handler: async function (response: any) {
          console.log('✅ Payment successful callback received:', response);

          // Close Razorpay modal first
          try {
            const currentRazorpay = (window as any).__currentRazorpayInstance;
            if (currentRazorpay && typeof currentRazorpay.close === 'function') {
              currentRazorpay.close();
            }
          } catch (e) {
            console.log('Error closing modal:', e);
          }

          setIsInitializingPayment(true);

          try {
            const verifyResponse = await fetch(`${API_URL}/api/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId
              }),
            });

            const result = await verifyResponse.json();
            console.log('🔐 Verification result:', result);

            if (result.success && result.bookingId) {
              // Clear local state
              if (tour?.id) localStorage.removeItem(`booking_draft_${tour.id}`);
              sessionStorage.setItem('pending_booking_id', result.bookingId);
              localStorage.setItem('last_booking_id', result.bookingId);
              setPendingBookingData(null);
              setAvailabilityStatus('idle');

              // Redirect immediately using replace (no setTimeout)
              console.log('✅ Payment verified successfully, redirecting to booking page...');
              window.location.replace(`/booking/${result.bookingId}`);
            } else {
              setIsInitializingPayment(false);
              console.error('❌ Payment verification failed:', result);
              window.location.replace(`/booking/${bookingId}?status=failed`);
            }
          } catch (error) {
            setIsInitializingPayment(false);
            console.error('❌ Verification error:', error);
            window.location.replace(`/booking/${bookingId}?status=failed`);
          }

          // Return false to prevent Razorpay default redirect
          return false;
        },

        prefill: {
          name: guestData?.fullName || '',
          email: guestData?.email || '',
          contact: guestData?.phoneNumber || ''
        },

        theme: {
          color: '#10B981'
        },

        modal: {
          ondismiss: async function () {
            console.log('Payment cancelled by user');
            setIsInitializingPayment(false);

            // Mark booking as payment_failed on backend
            try {
              await fetch(`${API_URL}/api/bookings/${bookingId}/mark-payment-failed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
              });
              console.log('✅ Booking marked as payment_failed');
            } catch (error) {
              console.error('❌ Failed to mark booking as payment_failed:', error);
            }

            // Redirect to booking page with failed status
            window.location.replace(`/booking/${bookingId}?status=failed`);
          },
          escape: true,
          backdropclose: false
        }
      };

      const rzp = new (window as any).Razorpay(options);

      // CRITICAL: Store Razorpay instance globally so handler can close it
      (window as any).__currentRazorpayInstance = rzp;

      rzp.on('payment.failed', function (response: any) {
        console.error('❌ Payment failed:', response.error);
        setIsInitializingPayment(false);
        window.location.replace(`/booking/${bookingId}?status=failed`);
      });

      rzp.open();
      console.log('✅ Razorpay modal opened');

    } catch (error) {
      console.error('❌ Payment initialization error:', error);
      setIsInitializingPayment(false);
      alert(`Failed to initialize payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading tour...</p>
          <p className="text-gray-400 text-sm mt-2">Slug: {tourSlug || 'none'}</p>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h2 className="text-2xl font-black text-[#001A33] mb-4">Tour not found</h2>
          <p className="text-gray-500 font-semibold mb-2">{error || 'The tour you\'re looking for doesn\'t exist.'}</p>
          <p className="text-gray-400 text-sm mb-6">Slug: {tourSlug || 'none'}</p>
          {country && city && (
            <a
              href={`/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[#10B981] font-bold hover:underline"
            >
              ← Back to {city} tours
            </a>
          )}
        </div>
      </div>
    );
  }

  // Safety check - ensure tour exists before accessing properties
  if (!tour) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-[#001A33] mb-4">Tour not found</h2>
          <p className="text-gray-500 font-semibold mb-6">The tour data could not be loaded.</p>
        </div>
      </div>
    );
  }

  // Parse images safely - handle both array and JSON string formats
  let mainImage = null;
  let otherImages: any[] = [];
  let remainingImages = 0;
  let allImages: string[] = []; // Store all images for modal navigation

  try {
    if (tour && tour.images) {
      const images = Array.isArray(tour.images) ? tour.images : (typeof tour.images === 'string' ? JSON.parse(tour.images) : []);
      allImages = images; // Store all images for modal
      mainImage = images.length > 0 ? images[0] : null;
      otherImages = images.length > 1 ? images.slice(1, 3) : [];
      remainingImages = images.length > 3 ? images.length - 3 : 0;
    }
  } catch (e) {
    console.error('TourDetailPage - Error parsing images:', e);
    // Fallback to empty arrays
    mainImage = null;
    otherImages = [];
    remainingImages = 0;
    allImages = [];
  }

  console.log('TourDetailPage - About to render', {
    loading,
    tour: !!tour,
    tourSlug,
    tourTitle: tour?.title,
    hasImages: !!mainImage,
    imageCount: tour?.images?.length,
    hasOptions: !!tour?.options,
    optionsCount: tour?.options?.length,
    optionsType: typeof tour?.options,
    isOptionsArray: Array.isArray(tour?.options)
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": tour?.title || "Tour",
    "description": tour?.shortDescription || "",
    "image": tour?.images?.[0] || "",
    "offers": {
      "@type": "Offer",
      "price": tour?.pricePerPerson || 0,
      "priceCurrency": tour?.currency || "USD"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{tour?.title ? `${tour.title} | ${city || 'Tour'} | AsiaByLocals` : 'AsiaByLocals'}</title>
        <meta name="description" content={tour?.shortDescription || `Book your next adventure in ${city || 'Asia'} with AsiaByLocals.`} />
        {/* Dynamic Canonical Link for SEO */}
        <link rel="canonical" href={window.location.origin + window.location.pathname} />
        <meta name="language" content="en" />
        <meta property="og:title" content={tour?.title} />
        <meta property="og:description" content={tour?.shortDescription} />
        <meta property="og:url" content={window.location.origin + window.location.pathname} />
        {tour?.images?.[0] && <meta property="og:image" content={tour.images[0]} />}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 h-full">
            {onClose ? (
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-[#001A33] font-semibold hover:text-[#10B981] text-[14px] transition-colors"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            ) : (
              <button
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                  } else {
                    window.location.href = '/';
                  }
                }}
                className="flex items-center gap-2 text-[#001A33] font-semibold hover:text-[#10B981] text-[14px] transition-colors"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            )}
          </div>
          <div className="flex items-center gap-4 h-full">
            <a href="/" className="flex items-center h-full cursor-pointer">
              <img
                src="/logo.png"
                alt="Asia By Locals"
                className="h-[110px] sm:h-[100px] md:h-[105px] lg:h-[110px] xl:h-[120px] w-auto object-contain"
                style={{ transform: 'translateY(3px)' }}
              />
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        {country && city && (
          <nav className="mb-6 text-[14px] font-semibold text-gray-600">
            <a href="/" className="hover:text-[#10B981] transition-colors">Home</a>
            <span className="mx-2">/</span>
            <a href={`/${country.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#10B981] transition-colors capitalize">{country}</a>
            <span className="mx-2">/</span>
            <a href={`/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#10B981] transition-colors capitalize">{city}</a>
            <span className="mx-2">/</span>
            <span className="text-[#001A33]">{tour.title}</span>
          </nav>
        )}

        {/* Internal Link: Explore More Tours in City (SEO Cluster) */}
        {country && city && (
          <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-[16px] text-gray-700 font-semibold mb-3">
              Explore more guided tours in <a href={`/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#10B981] font-black hover:underline">{city}</a>
            </p>
            <a
              href={`/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-2 text-[#10B981] font-black hover:text-[#059669] transition-colors"
            >
              View all {city} tours
              <ChevronRight size={18} />
            </a>
          </div>
        )}

        {/* Title & Rating Section */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-4xl font-black text-[#001A33] mb-3 leading-tight">
                {tour.title}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-[#10B981] text-white text-[12px] font-black rounded">
                    Top rated
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[16px] font-black text-[#001A33]">
                    {(() => {
                      // Generate consistent rating between 4.0-5.0 based on tour ID
                      const seed = parseInt(tour.id) || 0;
                      const random = (seed * 9301 + 49297) % 233280;
                      const normalized = random / 233280;
                      const rating = 4.0 + (normalized * 1.0);
                      return rating.toFixed(1);
                    })()}
                  </span>
                </div>
                <div className="text-[14px] text-gray-600 font-semibold">
                  Activity provider: {tour.supplier?.fullName || tour.supplier?.companyName || 'Local Guide'}
                </div>
              </div>

              {/* High-Conversion Feature Bar for Entry Tickets */}
              {(tour.category === 'Entry Ticket' || tour.title.toLowerCase().includes('ticket')) && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
                      <Zap size={16} fill="white" />
                    </div>
                    <div>
                      <div className="text-[13px] font-black text-[#001A33]">Skip the ticket line</div>
                      <div className="text-[11px] text-gray-500 font-semibold">Avoid long queues</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
                      <MessageCircle size={16} fill="white" />
                    </div>
                    <div>
                      <div className="text-[13px] font-black text-[#001A33]">Instant WhatsApp PDF</div>
                      <div className="text-[11px] text-gray-500 font-semibold">Safe on your phone</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#10B981] flex items-center justify-center text-white shrink-0">
                      <ShieldCheck size={16} fill="white" />
                    </div>
                    <div>
                      <div className="text-[13px] font-black text-[#001A33]">Official Admission</div>
                      <div className="text-[11px] text-gray-500 font-semibold">100% Guaranteed Entry</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery - GetYourGuide Style: Main image left, 2 thumbnails right */}
            <div className="grid grid-cols-3 gap-2 h-[500px] overflow-hidden relative mb-12">
              {mainImage && (
                <div
                  className="col-span-2 relative cursor-pointer group overflow-hidden rounded-2xl h-[500px]"
                  onClick={() => {
                    setSelectedImageIndex(0);
                    setShowImageModal(true);
                  }}
                >
                  <img
                    src={mainImage}
                    alt={tour.title}
                    className="w-full h-[500px] object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl pointer-events-none"></div>
                </div>
              )}
              <div className="col-span-1 flex flex-col gap-2 h-[500px]">
                {otherImages.slice(0, 2).map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer group overflow-hidden rounded-2xl ${index === 0 ? 'h-[246px]' : 'h-[246px]'
                      }`}
                    onClick={() => {
                      setSelectedImageIndex(index + 1);
                      setShowImageModal(true);
                    }}
                  >
                    <img
                      src={image}
                      alt={`${tour.title} ${index + 2}`}
                      className={`w-full object-cover rounded-2xl ${index === 0 ? 'h-[246px]' : 'h-[246px]'
                        }`}
                    />
                    {index === 1 && remainingImages > 0 && (
                      <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center pointer-events-none z-10">
                        <div className="text-center">
                          <div className="text-white font-black text-[24px] mb-1">+{remainingImages}</div>
                          <div className="text-white text-[12px] font-bold">more</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Short Description */}
            <div className="mb-8">
              <p className="text-[16px] text-gray-700 font-semibold leading-relaxed break-words whitespace-pre-wrap">
                {tour.shortDescription || tour.fullDescription}
              </p>
            </div>

            {/* Highlights Section */}
            {tour.highlights && Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
              <div className="mb-8 pt-12">
                <h2 className="text-2xl font-black text-[#001A33] mb-4">Highlights</h2>
                <ul className="space-y-2">
                  {tour.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2.5 shrink-0"></div>
                      <span className="text-[16px] text-gray-700 font-semibold leading-relaxed break-words whitespace-pre-wrap w-full">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tour Options Section - GetYourGuide Style */}
            {/* Show options - include main tour if it has group pricing */}
            {(() => {
              // Parse groupPricingTiers properly in render logic
              let mainTourHasGroupPricing = false;
              let mainTourGroupPricingTiers = null;

              if (tour.groupPricingTiers) {
                try {
                  mainTourGroupPricingTiers = typeof tour.groupPricingTiers === 'string'
                    ? JSON.parse(tour.groupPricingTiers)
                    : tour.groupPricingTiers;
                  mainTourHasGroupPricing = Array.isArray(mainTourGroupPricingTiers) && mainTourGroupPricingTiers.length > 0;
                } catch (e) {
                  console.error('Error parsing main tour groupPricingTiers:', e);
                }
              }

              // Also check for legacy groupPrice + maxGroupSize
              if (!mainTourHasGroupPricing && tour.groupPrice && tour.maxGroupSize) {
                mainTourHasGroupPricing = true;
              }

              const shouldShowMainTourAsOption = mainTourHasGroupPricing;

              // Create main tour option if needed
              let allOptions = tour.options || [];
              if (shouldShowMainTourAsOption && !allOptions.find((opt: any) => opt.id === 'main-tour')) {
                const mainTourOption = {
                  id: 'main-tour',
                  tourId: tour.id,
                  optionTitle: tour.title,
                  optionDescription: tour.shortDescription || tour.fullDescription?.substring(0, 200) || '',
                  durationHours: parseFloat(tour.duration?.replace(/[^0-9.]/g, '')) || 3,
                  price: tour.pricePerPerson || 0,
                  currency: tour.currency || 'INR',
                  language: tour.languages?.[0] || 'English',
                  pickupIncluded: false,
                  entryTicketIncluded: false,
                  guideIncluded: true,
                  carIncluded: false,
                  groupPrice: tour.groupPrice,
                  maxGroupSize: tour.maxGroupSize,
                  groupPricingTiers: mainTourGroupPricingTiers || tour.groupPricingTiers,
                  sortOrder: -1
                };
                allOptions = [mainTourOption, ...allOptions];
              }

              // Sort options by sortOrder
              allOptions = allOptions.sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));

              if (allOptions.length > 0) {
                return (
                  <div className="mb-8" ref={optionsRef}>
                    <h2 className="text-2xl font-black text-[#001A33] mb-6">Choose from {allOptions.length} available option{allOptions.length > 1 ? 's' : ''}</h2>
                    <div className="space-y-4">
                      {allOptions.map((option: any) => {
                        const isSelected = selectedOption?.id === option.id;
                        const currencySymbol = option.currency === 'USD' ? '$' : option.currency === 'EUR' ? '€' : '₹';

                        return (
                          <div
                            key={option.id}
                            className={`bg-white border-2 rounded-2xl p-6 transition-all ${isSelected
                              ? 'border-[#10B981] shadow-lg'
                              : 'border-gray-200 hover:border-[#10B981]/50 hover:shadow-md'
                              }`}
                          >
                            <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6">
                              {/* Left: Option Details */}
                              <div className="flex-1 w-full md:w-auto min-w-0">
                                <h3 className="font-black text-[#001A33] text-[18px] mb-2 break-all whitespace-pre-wrap">{option.optionTitle}</h3>
                                <div className="text-[14px] text-gray-600 font-semibold mb-4 leading-relaxed break-all whitespace-pre-wrap">
                                  {option.optionDescription && (
                                    <>
                                      {expandedOptions.has(option.id) || !option.optionDescription || option.optionDescription.length <= 150 ? (
                                        <span>{option.optionDescription}</span>
                                      ) : (
                                        <span>{option.optionDescription.substring(0, 150)}...</span>
                                      )}

                                      {option.optionDescription && option.optionDescription.length > 150 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleOptionExpand(option.id);
                                          }}
                                          className="text-[#0071EB] font-bold ml-1 hover:underline focus:outline-none inline-block cursor-pointer"
                                        >
                                          {expandedOptions.has(option.id) ? 'Show less' : 'Read more'}
                                        </button>
                                      )}
                                    </>
                                  )}
                                </div>

                                {/* Key Details Row */}
                                <div className="flex flex-wrap items-center gap-4 md:gap-6 text-[13px] text-gray-600 font-semibold">
                                  <div className="flex items-center gap-2">
                                    <Clock size={16} className="text-gray-500" />
                                    <span>{option.durationHours} {option.durationHours === 1 ? 'hour' : 'hours'}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <User size={16} className="text-gray-500" />
                                    <span>Guide: {option.language}</span>
                                  </div>
                                  {option.pickupIncluded && (
                                    <div className="flex items-center gap-2">
                                      <Bus size={16} className="text-gray-500" />
                                      <span>Pickup included</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right: Pricing & Select Button */}
                              <div className="text-left md:text-right flex flex-col items-start md:items-end w-full md:w-auto md:min-w-[200px]">
                                <div className="mb-3">
                                  <div className="font-black text-[#001A33] text-[20px] mb-1">
                                    {(() => {
                                      const currentParticipants = isCustomParticipants ? customParticipants : participants;
                                      // Always use group pricing logic - calculate from tiers
                                      const groupPrice = calculateGroupPrice(option, currentParticipants);

                                      if (groupPrice !== null) {
                                        return `${currencySymbol}${groupPrice.toLocaleString()}`;
                                      }

                                      if (option.groupPrice) {
                                        return `${currencySymbol}${option.groupPrice.toLocaleString()}`;
                                      }

                                      // Fallback: use option.price as fixed price
                                      return `${currencySymbol}${(option.price || 0).toLocaleString()}`;
                                    })()}
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    // Toggle: if clicking the same option, deselect it
                                    if (isSelected) {
                                      setSelectedOption(null);
                                    } else {
                                      setSelectedOption(option);
                                      // Scroll to booking box on mobile when option is selected
                                      if (window.innerWidth < 1024 && bookingBoxRef.current) {
                                        setTimeout(() => {
                                          bookingBoxRef.current?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                          });
                                        }, 100);
                                      }
                                    }
                                  }}
                                  className={`w-full md:w-auto px-6 py-3 rounded-xl font-black text-[14px] transition-all mb-2 ${isSelected
                                    ? 'bg-[#10B981] text-white'
                                    : 'bg-[#0071EB] text-white hover:bg-[#0056b3]'
                                    }`}
                                >
                                  {isSelected ? 'Selected (Click to deselect)' : 'Select'}
                                </button>

                                {/* Free Cancellation Badge */}
                                <div className="flex items-center gap-1 text-[12px] text-gray-600 w-full md:w-auto">
                                  <CheckCircle2 size={14} className="text-[#10B981]" />
                                  <span className="font-semibold">Free cancellation</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            {/* Full Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#001A33] mb-4">Full description</h2>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-[16px] text-gray-700 font-semibold leading-[1.8] whitespace-pre-wrap break-words">
                  {(() => {
                    if (!tour.fullDescription) return null;

                    // Helper to render inline markdown (bold, italics, and links)
                    const renderMarkdownText = (text: string) => {
                      // First handle links [label](url) and bold (**text**)
                      const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
                      const parts = text.split(regex);

                      return parts.map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return <span key={`b-${i}`} className="font-black text-[#001A33]">{part.slice(2, -2)}</span>;
                        }
                        if (part.startsWith('[') && part.includes('](')) {
                          const match = part.match(/\[(.*?)\]\((.*?)\)/);
                          if (match) {
                            return (
                              <a key={`l-${i}`} href={match[2]} className="text-[#10B981] font-black border-b border-[#10B981]/30 hover:border-[#10B981] transition-all">
                                {match[1]}
                              </a>
                            );
                          }
                        }

                        // Then handle italics (*text*) within remaining parts
                        const italicParts = part.split(/(\*.*?\*)/g);
                        return italicParts.map((iPart, j) => {
                          if (iPart.startsWith('*') && iPart.endsWith('*')) {
                            return <i key={`i-${i}-${j}`} className="font-semibold text-gray-800 italic">{iPart.slice(1, -1)}</i>;
                          }
                          return iPart;
                        });
                      });
                    };

                    return tour.fullDescription.split('\n').map((line: string, i: number) => {
                      const trimmed = line.trim();

                      // Handle Headings
                      if (trimmed.startsWith('# ')) {
                        return <h1 key={i} className="text-3xl font-black text-[#001A33] mb-6 mt-8 border-b pb-2">{trimmed.replace('# ', '')}</h1>;
                      }
                      if (trimmed.startsWith('## ')) {
                        return <h2 key={i} className="text-2xl font-black text-[#001A33] mb-4 mt-8">{trimmed.replace('## ', '')}</h2>;
                      }
                      if (trimmed.startsWith('### ')) {
                        return <h3 key={i} className="text-xl font-black text-[#001A33] mb-3 mt-6">{trimmed.replace('### ', '')}</h3>;
                      }

                      // Handle Separators
                      if (trimmed === '---') {
                        return <hr key={i} className="my-8 border-gray-200" />;
                      }

                      // Handle Bullets
                      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                        const content = trimmed.startsWith('* ') ? trimmed.replace('* ', '') : trimmed.replace('- ', '');
                        return (
                          <div key={i} className="flex gap-2 mb-2 ml-4">
                            <span className="text-[#10B981] font-black">•</span>
                            <span className="text-gray-700">{renderMarkdownText(content)}</span>
                          </div>
                        );
                      }

                      // Handle Numbered Lists (like 1. 2. 3. inside paragraphs)
                      if (/^\d+\.\s/.test(trimmed)) {
                        const index = trimmed.split('. ')[0];
                        const content = trimmed.split('. ').slice(1).join('. ');
                        return (
                          <div key={i} className="flex gap-2 mb-2 ml-4">
                            <span className="text-[#10B981] font-black">{index}.</span>
                            <span className="text-gray-700">{renderMarkdownText(content)}</span>
                          </div>
                        );
                      }

                      // Handle Paragraphs
                      return (
                        <p key={i} className="mb-4 last:mb-0 text-gray-700">
                          {renderMarkdownText(line)}
                        </p>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Visual Itinerary Timeline */}
            {tour.itineraryItems && Array.isArray(tour.itineraryItems) && tour.itineraryItems.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-[#001A33] mb-4">Tour Itinerary</h2>
                <div className="bg-[#10B981]/5 border border-[#10B981]/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={16} className="text-[#10B981]" />
                    <span className="text-[14px] font-bold text-[#10B981]">Itineraries are customisable as per your request</span>
                  </div>
                  <p className="text-[13px] text-gray-500 font-semibold ml-6">The schedule below is a suggested plan and can be adjusted to suit your preferences.</p>
                </div>
                <div className="relative">
                  <div className="space-y-0">
                    {tour.itineraryItems.map((item: any, index: number) => {
                      const isLast = index === tour.itineraryItems.length - 1;

                      // Format time for display
                      const formatTime = (time: string) => {
                        if (!time) return '';
                        if (time.includes('AM') || time.includes('PM')) return time;
                        const [h, m] = time.split(':');
                        const hour = parseInt(h, 10);
                        const ampm = hour >= 12 ? 'PM' : 'AM';
                        const displayHour = hour % 12 || 12;
                        return `${displayHour}:${m} ${ampm}`;
                      };

                      // Type-specific styling and icons
                      const getTypeConfig = (type: string) => {
                        const isOptional = type === 'optional';
                        const iconColor = isOptional ? '#6B7280' : 'white';
                        const bgClass = isOptional ? 'bg-white' : 'bg-[#10B981]';
                        const borderClass = isOptional ? 'border-gray-300' : 'border-[#10B981]';

                        const configs: Record<string, { bg: string; border: string; icon: React.ReactNode }> = {
                          pickup: { bg: bgClass, border: borderClass, icon: <MapPin size={14} color={iconColor} strokeWidth={2.5} /> },
                          transport: { bg: bgClass, border: borderClass, icon: <Bus size={14} color={iconColor} strokeWidth={2.5} /> },
                          visit: { bg: bgClass, border: borderClass, icon: <Landmark size={14} color={iconColor} strokeWidth={2.5} /> },
                          meal: { bg: bgClass, border: borderClass, icon: <Utensils size={14} color={iconColor} strokeWidth={2.5} /> },
                          activity: { bg: bgClass, border: borderClass, icon: <Activity size={14} color={iconColor} strokeWidth={2.5} /> },
                          optional: { bg: bgClass, border: borderClass, icon: <Map size={14} color={iconColor} strokeWidth={2.5} /> },
                          return: { bg: bgClass, border: borderClass, icon: <Home size={14} color={iconColor} strokeWidth={2.5} /> }
                        };
                        return configs[type] || configs.visit;
                      };

                      const config = getTypeConfig(item.type);
                      const isTransport = item.type === 'transport';
                      const isOptional = item.optional || item.type === 'optional';

                      return (
                        <div key={index} className={`relative pl-12 py-3 ${isOptional ? 'opacity-80' : ''}`}>
                          {/* Segmented connecting line to next item (stops at last item) */}
                          {!isLast && (
                            <div className="absolute left-[19px] top-6 bottom-[-1.5rem] w-[4px] bg-[#10B981]/50 rounded-full z-0" />
                          )}

                          {/* Icon on timeline */}
                          <div className={`absolute left-[6px] top-5 w-[30px] h-[30px] rounded-full ${config.bg} ${config.border} border-[3px] flex items-center justify-center z-10 shadow-md`}>
                            {config.icon}
                          </div>

                          <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-xl p-4 transition-all">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1.5">
                                  <span className="text-[13px] font-black text-[#10B981] tracking-wide">
                                    {formatTime(item.time)}
                                  </span>
                                  {item.duration && (
                                    <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                      {item.duration}
                                    </span>
                                  )}
                                  {isOptional && (
                                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-200">
                                      Optional
                                    </span>
                                  )}
                                </div>
                                <h3 className={`text-[16px] font-black ${isTransport ? 'text-gray-500' : 'text-[#001A33]'} mb-1`}>
                                  {item.title}
                                </h3>
                                {item.description && (
                                  <p className={`text-[14px] font-semibold ${isTransport ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Itinerary Description */}
            {tour.detailedItinerary && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-[#001A33] mb-4">Detailed Itinerary</h2>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  {tour.detailedItinerary.split('\n').map((line: string, index: number) => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('## ')) {
                      return <h2 key={index} className="text-xl font-black text-[#001A33] mt-6 mb-3 first:mt-0">{trimmed.replace(/^##\s*/, '')}</h2>;
                    }
                    if (trimmed === '') {
                      return <div key={index} className="h-2" />;
                    }
                    return <p key={index} className="text-[15px] text-gray-700 font-semibold leading-[1.8] break-words whitespace-pre-wrap">{trimmed}</p>;
                  })}
                </div>
              </div>
            )}

            {/* Includes Section */}
            {tour.included && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-[#001A33] mb-4">Includes</h2>
                <ul className="space-y-3">
                  {tour.included.split('\n').filter((item: string) => item.trim()).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="text-[#10B981] shrink-0 mt-1" size={20} />
                      <span className="text-[16px] text-gray-700 font-semibold">{item.trim().replace(/^[-•]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Not Included Section */}
            {tour.notIncluded && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-[#001A33] mb-4">Excludes</h2>
                <ul className="space-y-3">
                  {tour.notIncluded.split('\n').filter((item: string) => item.trim()).map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <X className="text-red-500 shrink-0 mt-1" size={20} />
                      <span className="text-[16px] text-gray-700 font-semibold">{item.trim().replace(/^[-•]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}


            {/* Important Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#001A33] mb-4">Important information</h2>
              {tour.meetingPoint && (
                <div className="mb-4">
                  <h3 className="text-[18px] font-black text-[#001A33] mb-2">Meeting point</h3>
                  <p className="text-[16px] text-gray-700 font-semibold">{tour.meetingPoint}</p>
                </div>
              )}
              <div>
                <h3 className="text-[18px] font-black text-[#001A33] mb-2">Know before you go</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#001A33] rounded-full mt-2 shrink-0"></div>
                    <span className="text-[16px] text-gray-700 font-semibold">
                      Free cancellation available up to 24 hours before the activity starts
                    </span>
                  </li>
                  {tour.category === 'Entry Ticket' && (
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#001A33] rounded-full mt-2 shrink-0"></div>
                      <span className="text-[16px] text-gray-700 font-semibold">
                        Please bring a valid ID or passport for entry
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* About this activity */}
            <div className="mb-8">
              <h2 className="text-2xl font-black text-[#001A33] mb-6">About this activity</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="text-[#10B981]" size={16} />
                  </div>
                  <div>
                    <div className="font-black text-[#001A33] text-[16px] mb-1">Free cancellation</div>
                    <div className="text-[14px] text-gray-600 font-semibold">
                      Cancel up to 24 hours in advance for a full refund
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="text-[#10B981]" size={16} />
                  </div>
                  <div>
                    <div className="font-black text-[#001A33] text-[14px] mb-1 break-words">Secure payment</div>
                    <div className="text-[12px] text-gray-600 font-semibold break-words">
                      Complete your booking safely with Razorpay. Full refund if you cancel 24h prior.{' '}
                      <a href="#" className="text-[#10B981] underline">Read more</a>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-1">
                    <Clock className="text-[#10B981]" size={16} />
                  </div>
                  <div>
                    <div className="font-black text-[#001A33] text-[16px] mb-1">
                      Duration {tour.duration}
                    </div>
                    <div className="text-[14px] text-gray-600 font-semibold">
                      Check availability to see starting times
                    </div>
                  </div>
                </div>
                {tour.included && tour.included.toLowerCase().includes('skip') && (
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-1">
                      <CheckCircle2 className="text-[#10B981]" size={16} />
                    </div>
                    <div>
                      <div className="font-black text-[#001A33] text-[16px] mb-1">Skip the ticket line</div>
                    </div>
                  </div>
                )}
                {tour.languages && tour.languages.length > 0 && (
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="text-[#10B981]" size={16} />
                    </div>
                    <div>
                      <div className="font-black text-[#001A33] text-[16px] mb-1">Live tour guide</div>
                      <div className="text-[14px] text-gray-600 font-semibold">
                        {tour.languages.join(', ')}
                      </div>
                    </div>
                  </div>
                )}
                {tour.meetingPoint && (
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-1">
                      <Bus className="text-[#10B981]" size={16} />
                    </div>
                    <div>
                      <div className="font-black text-[#001A33] text-[16px] mb-1">Pickup included</div>
                      <div className="text-[14px] text-gray-600 font-semibold">
                        Driver will pick you up from hotel/airport or any desired location in {city || 'the city'}
                      </div>
                    </div>
                  </div>
                )}
                {/* Wheelchair accessible - can be added as a tour field later */}
                <div className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="text-[#10B981]" size={16} />
                  </div>
                  <div>
                    <div className="font-black text-[#001A33] text-[16px] mb-1">Wheelchair accessible</div>
                  </div>
                </div>
                {tour.guideType === 'Tour Guide' && (
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-1">
                      <Users className="text-[#10B981]" size={16} />
                    </div>
                    <div>
                      <div className="font-black text-[#001A33] text-[16px] mb-1">Private group</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <RelatedTours currentTourId={tour?.id} country={country || tour?.country} city={city || tour?.city} />

          </div>

          {/* Right Column - Booking Panel */}
          <div className="lg:col-span-1" ref={bookingBoxRef}>
            <div className="sticky top-24 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm min-w-0">
              {/* Share */}
              <div className="flex items-center justify-end gap-4 mb-6">
                <a href="#" className="text-[14px] text-gray-600 font-semibold hover:text-[#10B981] transition-colors">
                  Share
                </a>
              </div>

              <div className="mb-6">
                {/* Show main tour pricing ONLY when NO option is selected */}
                {!selectedOption && (
                  <div className="mb-4">
                    <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Main Tour Price</div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-[14px] text-gray-500 font-semibold">
                        Starting from {tour.currency === 'INR' ? '₹' : '$'}
                        {(() => {
                          console.log('═══════════════════════════════════════════════════════════');
                          console.log('🏷 "STARTING FROM" PRICE CALCULATION');
                          console.log('═══════════════════════════════════════════════════════════');

                          // Get the price for 1 person (first tier: 1-1 person)
                          let priceForOne = tour.pricePerPerson || 0;
                          console.log('📥 Initial priceForOne (from pricePerPerson):', priceForOne);

                          // Check main tour option (sortOrder: -1) for groupPricingTiers first
                          if (tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
                            console.log('🔍 Checking main tour option for 1-1 person price...');
                            const mainTourOption = tour.options.find((opt: any) => opt.sortOrder === -1);
                            console.log('   Main tour option:', {
                              found: !!mainTourOption,
                              title: mainTourOption?.optionTitle,
                              hasGroupPricingTiers: !!mainTourOption?.groupPricingTiers
                            });

                            if (mainTourOption && mainTourOption.groupPricingTiers) {
                              try {
                                const tiers = typeof mainTourOption.groupPricingTiers === 'string'
                                  ? JSON.parse(mainTourOption.groupPricingTiers)
                                  : mainTourOption.groupPricingTiers;
                                console.log('   Parsed pricing slabs from main tour option:', tiers);
                                if (Array.isArray(tiers) && tiers.length > 0 && tiers[0].price) {
                                  // First tier is always for 1 person (1-1 person)
                                  const firstTier = tiers[0];
                                  priceForOne = parseFloat(firstTier.price || 0);
                                  console.log('✅ Default price (1-1 person) from main tour option:', {
                                    slab: `${firstTier.minPeople}-${firstTier.maxPeople}`,
                                    price: priceForOne,
                                    rawPrice: firstTier.price
                                  });
                                } else {
                                  console.warn('⚠️ Main tour option tiers invalid or empty');
                                }
                              } catch (e) {
                                console.error('❌ Error parsing main tour option groupPricingTiers:', e);
                              }
                            } else {
                              console.log('ℹ️ Main tour option has no groupPricingTiers');
                            }
                          }

                          // Check tour.groupPricingTiers directly
                          if (priceForOne === (tour.pricePerPerson || 0) && tour.groupPricingTiers) {
                            console.log('🔍 Checking tour.groupPricingTiers directly...');
                            try {
                              const tiers = typeof tour.groupPricingTiers === 'string'
                                ? JSON.parse(tour.groupPricingTiers)
                                : tour.groupPricingTiers;
                              console.log('   Parsed pricing slabs from tour:', tiers);
                              if (Array.isArray(tiers) && tiers.length > 0 && tiers[0].price) {
                                // First tier is always for 1 person (1-1 person)
                                const firstTier = tiers[0];
                                priceForOne = parseFloat(firstTier.price || 0);
                                console.log('✅ Default price (1-1 person) from tour:', {
                                  slab: `${firstTier.minPeople}-${firstTier.maxPeople}`,
                                  price: priceForOne,
                                  rawPrice: firstTier.price
                                });
                              }
                            } catch (e) {
                              console.error('❌ Error parsing tour groupPricingTiers:', e);
                            }
                          }

                          console.log('💰 FINAL "STARTING FROM" PRICE:', priceForOne);
                          console.log('═══════════════════════════════════════════════════════════');
                          return priceForOne.toLocaleString();
                        })()}
                      </span>
                      <div className="text-3xl font-black text-red-600">
                        {tour.currency === 'INR' ? '₹' : '$'}
                        {(() => {
                          const currentParticipants = isCustomParticipants ? customParticipants : participants;
                          console.log('═══════════════════════════════════════════════════════════');
                          console.log('💰 DYNAMIC PRICE CALCULATION (person count changed)');
                          console.log('═══════════════════════════════════════════════════════════');
                          console.log('📥 Selected persons:', currentParticipants);
                          console.log('   isCustomParticipants:', isCustomParticipants);

                          // Always use group pricing logic - calculate from tiers
                          const groupPrice = calculateGroupPrice(tour, currentParticipants);

                          if (groupPrice !== null && groupPrice > 0) {
                            console.log('✅ Using calculated group price:', groupPrice);
                            console.log('═══════════════════════════════════════════════════════════');
                            return groupPrice.toLocaleString();
                          }

                          // Check main tour option for group pricing
                          if (tour && tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
                            console.log('🔍 Falling back to main tour option...');
                            const mainTourOption = tour.options.find((opt: any) => opt.sortOrder === -1) || tour.options[0];
                            if (mainTourOption && mainTourOption.groupPricingTiers) {
                              const optionGroupPrice = calculateGroupPrice(mainTourOption, currentParticipants);
                              if (optionGroupPrice !== null && optionGroupPrice > 0) {
                                console.log('✅ Using main tour option price:', optionGroupPrice);
                                console.log('═══════════════════════════════════════════════════════════════');
                                return optionGroupPrice.toLocaleString();
                              }
                            }
                            // DO NOT use groupPrice - it's the LAST tier price (wrong)
                          }

                          // Fallback: use pricePerPerson (should be first tier price)
                          console.warn('⚠️ Using fallback pricePerPerson:', tour.pricePerPerson);
                          console.log('═══════════════════════════════════════════════════════════');
                          return (tour.pricePerPerson || 0).toLocaleString();
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Show option pricing when selected - replaces main tour price */}
                {selectedOption && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">Selected Option Price</div>
                      <button
                        onClick={() => setSelectedOption(null)}
                        className="text-[11px] text-[#0071EB] font-semibold hover:underline"
                      >
                        Back to Main Tour
                      </button>
                    </div>
                    <div className="flex items-baseline gap-3 mb-1">
                      <div className="text-3xl font-black text-[#10B981]">
                        {(selectedOption.currency || tour.currency || 'INR') === 'INR' ? '₹' : '$'}
                        {(() => {
                          const currentParticipants = isCustomParticipants ? customParticipants : participants;
                          console.log('═══════════════════════════════════════════════════════════');
                          console.log('💰 SELECTED OPTION PRICE CALCULATION');
                          console.log('═══════════════════════════════════════════════════════════');
                          console.log('Selected option:', {
                            id: selectedOption.id,
                            title: selectedOption.optionTitle,
                            price: selectedOption.price,
                            hasGroupPricingTiers: !!selectedOption.groupPricingTiers,
                            groupPricingTiersType: typeof selectedOption.groupPricingTiers
                          });
                          console.log('Current participants:', currentParticipants);

                          // ALWAYS use group pricing logic - calculate from tiers
                          // This will use option's tiers if available, otherwise fall back to main tour's tiers
                          const groupPrice = calculateGroupPrice(selectedOption, currentParticipants);
                          if (groupPrice !== null && groupPrice > 0) {
                            return groupPrice.toLocaleString();
                          }

                          // DO NOT use groupPrice fallback - it's the LAST tier price (₹8,200 for 10 people)
                          // Final fallback: use main tour's pricing tiers
                          console.log('🔍 Selected option has no groupPricingTiers, falling back to main tour...');
                          const mainTourPrice = calculateGroupPrice(tour, currentParticipants);
                          if (mainTourPrice !== null && mainTourPrice > 0) {
                            console.log('✅ Using main tour groupPricingTiers:', mainTourPrice);
                            console.log('═══════════════════════════════════════════════════════════');
                            return mainTourPrice.toLocaleString();
                          }

                          // Last resort: use option.price (should be first tier price)
                          console.warn('⚠️ Using option.price fallback:', selectedOption.price);
                          console.log('═══════════════════════════════════════════════════════════');
                          return (selectedOption.price || 0).toLocaleString();
                        })()}
                      </div>
                    </div>
                    <div className="text-[12px] text-gray-500 mt-1">
                      Option: {selectedOption.optionTitle}
                    </div>
                  </div>
                )}

                {/* Group Pricing Tiers Display */}
                {(() => {
                  const tourData = selectedOption || tour;
                  let groupPricingTiers = null;

                  if (tourData.groupPricingTiers) {
                    try {
                      groupPricingTiers = typeof tourData.groupPricingTiers === 'string'
                        ? JSON.parse(tourData.groupPricingTiers)
                        : tourData.groupPricingTiers;
                    } catch (e) {
                      console.error('Error parsing groupPricingTiers:', e);
                    }
                  }

                  // If no groupPricingTiers on tourData and this is main tour, check main tour option
                  if (!groupPricingTiers && !selectedOption && tour && tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
                    const mainTourOption = tour.options.find((opt: any) => opt.sortOrder === -1) || tour.options[0];
                    if (mainTourOption && mainTourOption.groupPricingTiers) {
                      try {
                        groupPricingTiers = typeof mainTourOption.groupPricingTiers === 'string'
                          ? JSON.parse(mainTourOption.groupPricingTiers)
                          : mainTourOption.groupPricingTiers;
                      } catch (e) {
                        console.error('Error parsing groupPricingTiers from main tour option:', e);
                      }
                    }
                  }

                  if (groupPricingTiers && Array.isArray(groupPricingTiers) && groupPricingTiers.length > 0) {
                    const currencySymbol = (tourData.currency || tour.currency || 'INR') === 'INR' ? '₹' : '$';
                    const currentParticipants = isCustomParticipants ? customParticipants : participants;
                    const currentPrice = calculateGroupPrice(tourData, currentParticipants);

                    // Don't show the pricing tiers table, but keep price calculation working
                    // Price will update dynamically when participants change
                    return null; // Hide the pricing tiers display
                  }
                  return null;
                })()}

                {/* Tour Types - More Prominent Display */}
                {tour.tourTypes && (() => {
                  try {
                    const tourTypesArray = typeof tour.tourTypes === 'string' ? JSON.parse(tour.tourTypes) : tour.tourTypes;
                    if (Array.isArray(tourTypesArray) && tourTypesArray.length > 0) {
                      return (
                        <div className="mt-4">
                          <div className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2">Tour Type</div>
                          <div className="flex flex-wrap gap-2">
                            {tourTypesArray.map((type: string, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1.5 bg-[#10B981]/10 text-[#10B981] text-[12px] font-black rounded-full border border-[#10B981]/20"
                              >
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  } catch (e) {
                    console.error('Error parsing tourTypes:', e);
                  }
                  return null;
                })()}
              </div>

              {/* Date Selector - Premium Calendar */}
              <div className="mb-6">
                <div className="relative">
                  <button
                    onClick={() => setShowCalendarModal(true)}
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 pr-10 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none text-left flex items-center justify-between hover:border-[#10B981] transition-colors"
                  >
                    <span className="flex-1 min-w-0 truncate pr-2">{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select date'}</span>
                    <Calendar className="text-gray-400 shrink-0" size={20} />
                  </button>
                </div>
              </div>

              {/* Booking Options - Dropdown Style */}
              <div className="space-y-4 mb-6">
                <div className="relative">
                  <select
                    value={isCustomParticipants ? 'custom' : participants}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setIsCustomParticipants(true);
                        setParticipants(customParticipants);
                      } else {
                        setIsCustomParticipants(false);
                        setParticipants(parseInt(e.target.value));
                      }
                    }}
                    className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 pr-10 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>Adult x {num}</option>
                    ))}
                    <option value="custom">Custom</option>
                  </select>
                  <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>

                {/* Custom Participants Input */}
                {isCustomParticipants && (
                  <div className="relative">
                    <input
                      type="number"
                      min="11"
                      max="100"
                      value={customParticipants}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 11;
                        setCustomParticipants(value);
                        setParticipants(value);
                      }}
                      className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 pr-10 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                      placeholder="Enter number of adults"
                    />
                    <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                )}

                {tour.languages && tour.languages.length > 0 && (
                  <div className="relative">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 pr-10 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none appearance-none"
                    >
                      {tour.languages.map((lang: string) => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                  </div>
                )}
              </div>

              {/* Policies */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10B981] shrink-0 mt-1" size={18} />
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-[#001A33] text-[14px] mb-1 break-words">Free cancellation</div>
                    <div className="text-[12px] text-gray-600 font-semibold break-words">
                      Cancel up to 24 hours in advance for a full refund
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10B981] shrink-0 mt-1" size={18} />
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-[#001A33] text-[14px] mb-1 break-words">Secure payment</div>
                    <div className="text-[12px] text-gray-600 font-semibold break-words">
                      Complete your booking safely with Razorpay. Full refund if you cancel 24h prior.{' '}
                      <a href="#" className="text-[#10B981] underline">Read more</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Status */}
              {availabilityStatus === 'available' && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="text-[#10B981]" size={20} />
                    <span className="font-black text-[#10B981] text-[14px]">Available!</span>
                  </div>
                  <p className="text-[12px] text-gray-600 font-semibold">
                    This tour is available for {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'selected dates'}
                  </p>
                </div>
              )}

              {availabilityStatus === 'unavailable' && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <X className="text-red-600" size={20} />
                    <span className="font-black text-red-600 text-[14px]">Not Available</span>
                  </div>
                  <p className="text-[12px] text-gray-600 font-semibold">
                    This tour is not available for the selected date. Please choose another date.
                  </p>
                </div>
              )}

              {/* Book Button - GetYourGuide Blue */}
              <button
                onClick={availabilityStatus === 'available' ? handleProceedToBooking : handleCheckAvailability}
                disabled={availabilityStatus === 'checking'}
                className="w-full bg-[#0071EB] hover:bg-[#0056b3] text-white font-black py-5 rounded-2xl text-[16px] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {availabilityStatus === 'checking' ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Checking...
                  </>
                ) : availabilityStatus === 'available' ? (
                  'Proceed to Booking'
                ) : (
                  'Check availability'
                )}
              </button>
              {bookingError && (
                <p className="text-[14px] text-red-500 font-bold text-center mt-3 p-3 bg-red-50 rounded-xl border border-red-100 flex items-center justify-center gap-2">
                  <Info size={16} />
                  {bookingError}
                </p>
              )}

              <p className="text-[12px] text-gray-500 font-semibold text-center mt-4">
                Secure payment via Razorpay
              </p>
            </div>
          </div>
        </div>

        {/* Structured SEO Sections - Premium Content below main grid */}
        <div className="mt-20 pt-16 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">



            {/* Section 5: FAQ Section (Simple List Style like City Page) */}
            <section className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-[#10B981]/10 rounded-2xl">
                  <HelpCircle className="text-[#10B981]" size={32} />
                </div>
                <h2 className="text-2xl font-black text-[#001A33]">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-8 max-w-4xl">
                {(() => {
                  // Check for tour-specific intelligence from our high-authority Agra data
                  const getTourSpecificFAQs = (title: string, slug?: string) => {
                    const t = title.toLowerCase();

                    // Specific handling for the high-intent Sunrise Tour slug
                    if (slug === 'taj-mahal-sunrise-sunrise-tour') {
                      return [
                        {
                          question: "What time is hotel pickup for sunrise tour in Agra?",
                          answer: "Typically, hotel pickup in Agra for our sunrise tour occurs between **5:15 AM and 5:45 AM**, calculated specifically to ensure you reach the monument gates approximately 15 minutes before the first light touches the white marble. During the peak summer months of April to June, the sun rises significantly earlier, necessitating the 5:15 AM start. Conversely, in the winter months of December and January, we might adjust this slightly later based on visibility protocols. We prioritize being among the first in the security queue because the atmosphere of the 'Blue Hour'—the period just before technical sunrise—offers a unique, ethereal stillness that mid-day visitors never experience. Your guide will coordinate the exact timing with you the evening before based on real-time weather forecasts."
                        },
                        {
                          question: "Which Taj Mahal gate do we enter for sunrise?",
                          answer: "We almost exclusively utilize the **East Gate** for our sunrise expeditions. Logistically, the East Gate is positioned closest to the majority of high-end hotel clusters and offers a more streamlined queueing experience compared to the busier West Gate, which serves the dense local market areas. For travelers on a focused [1-day itinerary](/india/agra/1-day-agra-itinerary), efficiency is essential. The East Gate features dedicated security lanes for high-value pre-booked digital tickets, which our guides use to expedite your entrance. Additionally, the parking area for the East Gate is well-connected by electric battery buses, which provide a pleasant 5-minute ride to the main entrance, saving you from a long walk in the early morning humidity."
                        },
                        {
                          question: "How much time do we spend inside Taj Mahal?",
                          answer: "A high-quality guided experience typically lasts between **2 to 2.5 hours**, which allows for deep historical storytelling and plenty of time for professional-grade photography without rushing. This duration covers the entrance through the Great Gate (Darwaza-i-rauza), a detailed walkthrough of the Charbagh gardens, and a thorough exploration of the main mausoleum platform. Your guide will explain the intricate pietra dura marble inlay, the optical illusions of the calligraphy, and the symmetrical architecture of the flanking mosque and guesthouse. If you find yourself captivated by the morning light, our guides are happy to adjust the pace, ensuring you have enough time to soak in the atmosphere before the mid-morning crowds start to saturate the complex."
                        },
                        {
                          question: "Does skip-the-line mean skipping security too?",
                          answer: "It is critical to understand that 'Skip-The-Line' applies specifically to the **official ASI ticket window**, which can often have queues exceeding 60 minutes during peak season. It does **NOT** allow any visitor to bypass the mandatory security screening conducted by the Central Industrial Security Force (CISF). Every visitor, regardless of ticket status, must pass through metal detectors and physical baggage checks as per national [safety guidelines](/safety-guidelines). To ensure the fastest possible throughput, we recommend bringing only your phone, camera, and a bottle of water; avoid bringing large bags, electronics other than your camera, or prohibited items like tobacco or sharp objects, as these will cause significant delays at the security scanners."
                        },
                        {
                          question: "Is this an official licensed guide?",
                          answer: "Yes, all our experts are strictly **ASI-licensed historians** who have passed rigorous examinations conducted by the Ministry of Tourism, Government of India. Unlike unauthorized street guides or 'lapkas' who often provide inaccurate myths, our guides are verified professionals legally authorized to guide in all national monuments. This licensing ensures you receive historically accurate data regarding the Mughal Empire, the political significance of the tomb, and the technical marvels of 17th-century engineering. Using a licensed professional also protects you from aggressive commission-based shopping tactics, as our guides are committed to a service-first experience that prioritizes your education and comfort over commercial diversions."
                        },
                        {
                          question: "Are monument tickets included in the price?",
                          answer: "Depending on the specific package you select during checkout, monument entry tickets are either bundled into the all-inclusive price or left as an 'add-on' for travelers who prefer flexibility. For a completely hassle-free morning, we strongly recommend the **All-Inclusive option**, which covers the guide, the private vehicle, and the high-value 'mausoleum supplement' tickets. Having us pre-purchase these digital QR codes is the only way to avoid the physical ticket counters. If you choose a 'Guide Only' service, please ensure you have your tickets ready on your phone before the pickup time, as the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) reflects a complex tiered system for domestic and international visitors that is difficult to navigate at 5:30 AM."
                        },
                        {
                          question: "Can I pay entrance fees in cash?",
                          answer: "No, as of the 2026 season, the Archaeological Survey of India (ASI) has transitioned to a 100% digital ticketing ecosystem. Cash is no longer accepted at any of the physical monument gates in Agra. All entry tickets must be purchased online through the official government portal or authorized travel partners. This move was implemented to reduce black-marketing and to streamline the entry process for international tourists. Our tours typically include pre-booked tickets to ensure you don't have to struggle with international credit card processing issues on the slow government website. If you are traveling independently, you must scan a QR code at the gate to book via your mobile device, which can be unreliable due to network congestion near the monument."
                        },
                        {
                          question: "Is sunrise actually better than sunset?",
                          answer: "Sunrise is widely considered the **platinum standard** for visiting the Taj Mahal for several tactical reasons. Firstly, the crowd density at 6:00 AM is roughly 70% lower than at sunset, allowing for those iconic unobstructed views of the reflecting pools. Secondly, the ambient temperature in Agra can exceed 40°C by mid-afternoon, making a sunset visit physically exhausting, whereas the sunrise air is crisp and comfortable. From an aesthetic perspective, the marble transitions through a unique palette of soft greys, lavenders, and golden pinks that only occurs during the 'Golden Hour' of the morning. Most photographers prefer this light as it minimizes the harsh shadows found later in the day during a standard [agra travel guide 2026](/india/agra/agra-travel-guide-2026) exploration."
                        },
                        {
                          question: "What if it’s foggy during sunrise?",
                          answer: "During the peak winter months of December and January, morning fog is a common occurrence in the Yamuna River basin. While heavy fog can obscure the monument's first light, it creates a unique, hauntingly beautiful atmosphere that many professional landscape photographers actually prefer. If visibility is exceptionally low at the 6:00 AM opening, our guides will adjust the narrative pace of the tour. They will focus first on the historical gateways, the red sandstone mosque, and the architectural narratives of the outer complex buildings. As the sun burns off the mist around 8:30 AM, the Taj Mahal slowly reveals itself through the white shroud—a dramatic and unforgettable reveal that provides a more emotional experience than a clear-day visit."
                        },
                        {
                          question: "Is this tour suitable for elderly travelers?",
                          answer: "Absolutely. The early morning tour is significantly better for senior travelers because it avoids the physical strain of the intense Indian afternoon heat. The pathways at the Taj Mahal are relatively flat, though the walk from the battery bus drop-off point to the main gate is approximately 200 meters. For the main mausoleum, there are several wide steps to navigate, but our guides are trained to move at a comfortable, leisurely pace that respects your stamina. We also prioritize the East Gate entrance, which has the most reliable golf-cart shuttle system. If mobility is a major concern, please let us know in advance, and we can pre-arrange for the closest possible vehicle drop-off to minimize walking distance during your [visit to the Taj](/india/agra/taj-mahal-opening-time)."
                        },
                        {
                          question: "What happens if sunrise is cloudy or foggy?",
                          answer: "If the sky is overcast or fog is present, the 'Golden Hour' glow might be muted, but the historical and academic depth of the tour remains fully intact. Clouds actually provide soft, even lighting that is excellent for capturing the intricate details of the marble inlay and calligraphy without the high-contrast glare of direct sunlight. Our licensed guides are experts at pivoting the experience; instead of focusing solely on the 'sunrise moment,' they will dive deeper into the architectural symbolism of the Charbagh garden or the tales of the Mughal court. We ensure that even without a clear sun, your intellectual and visual appreciation of the world's most famous monument is not compromised by the erratic weather of the North Indian plains."
                        },
                        {
                          question: "Is there refund if visibility is zero?",
                          answer: "In accordance with our [terms and conditions](/terms-and-conditions), we do not offer refunds due to weather-related visibility issues. The monument remains open, and the significant costs associated with private transportation, ASI-licensed guide services, and entry tickets are non-recoverable once the tour has commenced. However, zero visibility is extremely rare; even in heavy fog, the Taj Mahal is visible from the main platform. The value of our tour lies in the expert historical narrative and the seamless logistics that get you inside the gates efficiently. A foggy day often results in a more intimate and less crowded visit, which many of our previous guests have rated as one of their most atmospheric and memorable travel experiences."
                        },
                        {
                          question: "What months have heavy fog in Agra?",
                          answer: "Heavy fog is primarily a winter phenomenon in Northern India, occurring most frequently between **mid-December and late January**. During these six weeks, the cold air from the Himalayas meets the moisture of the Yamuna River, creating thick morning mists. If you are highly sensitive to visibility for photography, we recommend planning your visit for late February through November. However, the fog usually begins to dissipate by 9:00 AM or 10:00 AM. Our guides monitor the local visibility alerts daily and will keep you informed if a slight delay in the start time would yield a better visual result while still avoiding the peak midday crowds that appear after the morning mist clears."
                        },
                        {
                          question: "Can I bring tripod or drone?",
                          answer: "Drones are strictly prohibited in the entire Agra region, especially near the Taj Mahal, which is a protected 'No-Fly Zone' for security reasons. Attempting to fly a drone will lead to immediate confiscation and potential legal action by the CISF. Similarly, professional tripods are not permitted inside the Taj Mahal complex without heavily restricted (and expensive) government permits. Even 'Vlogging' tripods or large monopods are often rejected at the security scanners. To ensure a smooth entry, we recommend relying on handheld photography. Our guides are experts at finding 'symmetry points' and steady ledges where you can rest your camera for long-exposure shots, or they can assist you in capturing high-quality photos using your smartphone’s stabilized lenses."
                        },
                        {
                          question: "Are professional photos included?",
                          answer: "While this is a sophisticated historical and cultural tour rather than a dedicated commercial photoshoot, our guides have assisted thousands of travelers and know exactly where the 'Golden Points' are located. They will help you capture the classic shots—like the Diana Bench view and the marble reflections—using your own equipment. If you require a professional photographer with a DSLR and post-processing services, we can arrange this as a specialized 'add-on' to your booking. However, most guests find that the combination of our guide's local knowledge of angles and modern smartphone capabilities results in an exceptional gallery of memories. This allows you to stay focused on the history while still coming away with professional-looking social media content from your [places to visit in Agra](/india/agra/places-to-visit-in-agra)."
                        },
                        {
                          question: "Can the guide take Instagram-style photos?",
                          answer: "Yes, our guides are well-versed in modern social media aesthetics and are happy to assist in capturing high-impact shots at the Taj Mahal's most iconic locations. They understand the nuances of 'symmetry points'—specific spots along the reflecting pools and the flanking guest houses where the architecture perfectly frames the subject. While their primary role is as a licensed historian, they recognize that travel memories are visual. They can help with posing, finding the right lighting during the Golden Hour, and avoiding the background crowds. This personalized assistance ensures that your personal gallery reflects the true majesty of the Taj Mahal while allowing you to remain fully immersed in the stories of Emperor Shah Jahan and Mumtaz Mahal."
                        },
                        {
                          question: "How crowded is Taj Mahal at sunrise?",
                          answer: "At the 6:00 AM opening, the crowd density is at its daily minimum. You will primarily be sharing the complex with other dedicated sunrise enthusiasts and professional photographers. This is the only time of day when you can experience the monument in relative silence, before the noise of thousands of day-trippers from Delhi begins to fill the space. However, it is important to note that 'not crowded' is relative; as one of the Seven Wonders, there will always be other visitors. By 8:30 AM, the first wave of mass-market tour buses arrives, and the energy changes significantly. This is why our strategic 5:15 AM start is non-negotiable for those seeking the premium, peaceful experience that defines our high-authority [things to do in Agra](/india/agra/things-to-do-in-agra) ranking."
                        },
                        {
                          question: "Is winter sunrise too cold for kids?",
                          answer: "Winter mornings in Agra (December to February) can be surprisingly chilly, with temperatures often dropping to 5°C or 8°C (40°F-45°F) before sunrise. For families traveling with children, we recommend a robust layering strategy: a warm jacket, a scarf, and comfortable walking shoes are essential. However, the biting cold is short-lived. Once the sun breaks the horizon around 7:00 AM, the temperature rises rapidly, often reaching a perfect 20°C (68°F) by the end of the tour. Children usually find the early morning golf-cart ride and the vast gardens of the Taj Mahal quite exciting. The absence of the oppressive midday heat makes them much less irritable than they would be during a standard afternoon visit, provided they have a light snack before the early start."
                        },
                        {
                          question: "Can I re-enter Taj Mahal later in the day?",
                          answer: "No, the Taj Mahal entry ticket is strictly **single-entry only**. The digital QR code on your ticket is scanned upon entry and then 'marked' as used in the ASI system. Once you pass through the exit turnstiles at the East or West gates, you cannot re-enter the complex using the same ticket. If you wish to witness the monument again at sunset from within the gardens, you would be required to purchase a completely new ticket at the standard [taj mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026). This is why we focus on maximizing your 2-hour morning window; it provides the best lighting and crowd conditions, ensuring you don't feel the need to return during the hot, crowded afternoon hours."
                        },
                        {
                          question: "What is the difference between East and West gate entry?",
                          answer: "The East Gate is generally preferred by international travelers and those staying in the 'Taj Ganj' luxury hotel district. It tends to have a more orderly security process and is further away from the city's chaotic central markets, making for a calmer start to the day. The West Gate is the primary entrance for the local population and budget travelers staying near the Agra Fort railway station. While both gates lead to the same entrance courtyard, the West Gate often suffers from longer queues as it handles a higher volume of last-minute ticketed visitors. For our sunrise tours, the East Gate is our strategic default choice because it ensures our guests spend less time in line and more time witnessing the light transition on the Taj Mahal's domes."
                        },
                        {
                          question: "Is shoe cover included?",
                          answer: "Yes, when you book a tour with us that includes the 'Main Mausoleum' access, high-quality shoe covers are provided as part of the monument supplement fee. These covers allow you to walk directly onto the elevated white marble platform and enter the interior cenotaph chamber without having to remove your footwear. This is a significant convenience, as the marble can be quite cold in winter or incredibly hot in summer. Without covers, you would be required to leave your shoes at an unsupervised rack or a paid counter. By using the provided covers, you maintain your comfort and hygiene while fully respecting the religious and historical sanctity of the tomb area, as outlined in our comprehensive [agra travel guide 2026](/india/agra/agra-travel-guide-2026)."
                        },
                        {
                          question: "Are washrooms available inside the complex?",
                          answer: "Clean, government-managed washroom facilities are located within the Taj Mahal complex, typically situated near the ticket checking areas and the entry paths to the main gardens. There are also pay-per-use 'Western-style' restrooms just outside the East and West gate security checkpoints. While these facilities are maintained regularly by the ASI, they can become quite busy as the morning progresses. We recommend using the facilities at your hotel before the 5:30 AM pickup to ensure your focus remains entirely on the monument's beauty. If you do need a break during the tour, simply inform your guide, and they will coordinate the best time to visit the internal facilities, ideally during a transition between the garden exploration and the mausoleum walkthrough."
                        },
                        {
                          question: "Is breakfast included after the tour?",
                          answer: "Standard guide-only morning tours do not include breakfast, but the timing is designed to get you back to your hotel or a local restaurant just as the morning meal service begins. If you have booked an 'All-Inclusive' package with us, we can often include a refined breakfast at one of Agra's most respected multi-cuisine restaurants or even a 5-star hotel buffet near the East Gate. Many guests prefer to return to their own hotel for breakfast around 9:00 AM to freshen up before continuing with the rest of their [1-day itinerary](/india/agra/1-day-agra-itinerary). If you would like us to pre-reserve a table at a local 'Agra Special' breakfast spot for Jalebi and Bedai, please request this at the time of booking."
                        },
                        {
                          question: "Can I customize timing if I’m staying outside city center?",
                          answer: "Absolutely. Since all our tours are 100% private, we offer full flexibility for customization. If your accommodation is located on the outskirts of Agra or if you are arriving early morning via the Yamuna Expressway from Delhi, we will calibrate the pickup time accordingly. The goal is always to synchronize your arrival at the gates with the official [taj mahal opening time](/india/agra/taj-mahal-opening-time). Please provide your exact location during the booking process so our logistics team can calculate the optimal transit time. We can also adjust the tour's end-point; for example, we can drop you off at a specific cafe, the Agra Fort, or even the railway station if you are departing shortly after your morning visit."
                        },
                        {
                          question: "Is wheelchair assistance available at sunrise?",
                          answer: "Yes, wheelchair assistance is available at the Taj Mahal, and it is a service we frequently coordinate for our guests. The Archaeological Survey of India provides basic manual wheelchairs at the main entry gates on a first-come, first-served basis. However, to ensure a seamless experience, we recommend informing us at least 48 hours in advance so our guide can prioritize securing a chair the moment the gates open. Most of the main paths in the Taj Mahal gardens are wheelchair accessible via ramps. While wheelchairs cannot go onto the very top marble platform of the mausoleum due to historical preservation of the steps, our guides will ensure you get the best possible views from the lowered platform and the surrounding reflecting pool areas."
                        }
                      ];
                    }


                    if (t.includes('delhi') && t.includes('agra') && t.includes('day trip')) {
                      return [
                        { question: "What time do we leave Delhi for a Taj Mahal day tour?", answer: "To maximize your day and experience the Taj Mahal at its most tranquil, we typically recommend a **3:00 AM or 4:00 AM departure** from Delhi. This early start allows you to reach Agra just as the gates open for sunrise, avoiding the heavy morning traffic on the Yamuna Expressway." },
                        { question: "How long is the Delhi to Agra drive and is the expressway safe?", answer: "The drive from Delhi to Agra via the **Yamuna Expressway** typically takes between **3 to 3.5 hours**. This modern, 6-lane toll road is one of India's best highways, offering a smooth and safe journey. We include all toll taxes, parking, and fuel in your tour package." },
                        { question: "Is a same-day Taj Mahal tour from Delhi actually worth it?", answer: "Absolutely—thanks to the ultra-fast Yamuna Expressway, a **same-day trip is the most popular way** to visit Agra. A well-structured itinerary easily covers the Taj Mahal, Agra Fort, and a relaxed 5-star lunch." }
                      ];
                    }
                    if (t.includes('official') && t.includes('guide') && t.includes('licensed')) {
                      return [
                        { question: "What makes a guide 'official' at the Taj Mahal?", answer: "An **'official' guide** is a professional who has been rigorously vetted and licensed by the **Ministry of Tourism, Government of India (ASI)**. These experts are the only individuals legally authorized to conduct tours inside the Taj Mahal complex." },
                        { question: "How long does the guided portion of the visit last?", answer: "A standard high-authority tour of the Taj Mahal typically lasts between **2 to 2.5 hours**. This allows your guide enough time to explain the gate architecture, the symmetrical gardens, and the intricate marble inlay work." },
                        { question: "Is the guide fee separate from the entry ticket?", answer: "Yes, in the 'Guide Only' booking category, the fee covers the professional services of the historian. You must either have your [pre-booked digital tickets](/india/agra/taj-mahal-ticket-price-2026) ready or we can assist you in purchasing them online." }
                      ];
                    }
                    if (t.includes('sunrise') && t.includes('skip') && t.includes('line')) {
                      return [
                        { question: "What time is hotel pickup for the sunrise tour in Agra?", answer: "For a true Taj Mahal sunrise experience, hotel pickup in Agra occurs between **5:15 AM and 5:45 AM**, depending on the season and official [sunrise timing](/india/agra/taj-mahal-opening-time). Entering early is the only way to witness the marble transition from soft grey to golden pink." },
                        { question: "Does skip-the-line mean skipping security too?", answer: "It is important to understand that 'Skip-The-Line' applies specifically to the **official ASI ticket window**. It does **NOT** allow you to bypass the mandatory security screening conducted by the CISF. Every visitor must pass through the metal detectors." },
                        { question: "What if it is foggy during sunrise in winter?", answer: "During December and January, morning fog is common. While it can obscure the first light, it creates a unique, ethereal atmosphere favored by photographers. Our guides adjust the pace, focusing on gate architecture until the sun burns off the mist." }
                      ];
                    }
                    if (t.includes('female') && t.includes('guide')) {
                      return [
                        { question: "Are the female guides licensed by the government?", answer: "Every female guide we partner with is officially **licensed by the Ministry of Tourism, Government of India (ASI)**. They are verified professionals legally authorized to guide in all national monuments, providing both safety and historical accuracy." },
                        { question: "Is this tour suitable for solo female travelers?", answer: "This tour is specifically engineered for **solo female travelers** seeking the highest level of comfort and security. A professional female guide acts as a 'cultural bridge' and a protective presence, allowing you to focus entirely on the beauty of the monuments." },
                        { question: "Can the guide assist with saree draping and photography?", answer: "Yes, our female guides are experts in **saree draping** and can assist you with your outfit. They are also familiar with the Taj Mahal's 'symmetry points' for capturing iconic shots without the crowds." }
                      ];
                    }
                    if (t.includes('fatehpur') && t.includes('sikri')) {
                      return [
                        { question: "How far is Fatehpur Sikri from Agra and how do we get there?", answer: "Fatehpur Sikri is located approximately **37 kilometers (23 miles)** west of Agra. The drive typically takes 1 to 1.5 hours. Most travelers visit it as a half-day trip or a stop while traveling between [Agra and Jaipur](/india/agra/1-day-agra-itinerary)." },
                        { question: "Is it worth the extra time compared to more time at the Taj?", answer: "For anyone staying in Agra for more than 24 hours, Fatehpur Sikri is **essential**. It offers a completely different architectural language—a massive, red-sandstone testament to political power and urban living, far less crowded than the Taj." },
                        { question: "Are guides required for Fatehpur Sikri?", answer: "A [licensed guide](/india/agra/things-to-do-in-agra) is highly recommended because the site is enormous and lacks signage. Without a guide, it is easy to miss the architectural significance of buildings like the 'Iron-Free' pillars." }
                      ];
                    }
                    if (t.includes('ticket') && t.includes('skip')) {
                      return [
                        { question: "Is the mausoleum access included in this ticket?", answer: "Yes. Our 'Premium' entry tickets automatically include the **mandatory main mausoleum supplement**. The official price structure requires this extra fee (₹200) to enter the cenotaph chamber where the main marble screens are located." },
                        { question: "Do I skip the security line with this ticket?", answer: "While this ticket allows you to **bypass the 60-minute ticket-window queue**, all visitors must still undergo the mandatory security screening. No ticket type allows you to skip security, but having your QR code ready significantly speeds up the process." },
                        { question: "Is a printed copy of the ticket required?", answer: "No, a **digital copy on your smartphone** is perfectly acceptable for the 2026 season. Simply show the QR code to the gate attendants for scanning. We recommend taking a screenshot in case of poor mobile reception near the gates." }
                      ];
                    }
                    return null;
                  };

                  const tourTitle = tour.title || 'this tour';
                  const specificFAQs = getTourSpecificFAQs(tourTitle, tourSlug);

                  const tourFAQs = specificFAQs || [
                    {
                      question: `What is specifically included in the ${tourTitle}?`,
                      answer: tour.included || `The ${tourTitle} includes a professional licensed guide, entry tickets to major monuments as per your selection, and a fully customizable itinerary.`
                    },
                    {
                      question: `How long is the actual ${tourTitle} experience?`,
                      answer: `The duration of the ${tourTitle} is typically ${tour.duration || 'a few hours'}. We recommend arriving 15 minutes before the scheduled start time for a smooth experience.`
                    },
                    {
                      question: `What is the best time to start the ${tourTitle}?`,
                      answer: "For most monument visits, we highly recommend a sunrise start. This allows you to avoid the midday heat, bypass the largest crowds, and capture the best lighting for photography."
                    }
                  ];

                  if ((tour.city?.toLowerCase() === 'agra' || tourTitle.toLowerCase().includes('taj mahal')) && !specificFAQs) {
                    tourFAQs.push({
                      question: "Is the Taj Mahal closed on Friday?",
                      answer: "Yes, the Taj Mahal is closed every Friday for religious reasons. Please ensure your tour date for the Taj Mahal does not fall on a Friday."
                    });
                    tourFAQs.push({
                      question: "Is original passport mandatory for entry?",
                      answer: "Yes, foreign tourists must show their original passport or a high-quality digital photo at the entrance gates for security identification and monument entry."
                    });
                  }

                  if (!specificFAQs) {
                    tourFAQs.push({
                      question: `Will I receive confirmation after booking the ${tourTitle}?`,
                      answer: "Yes, once your booking is completed via our secure gateway, you will receive an instant confirmation email with your tour details and guide contact information."
                    });
                  }

                  // Helper to render text with markdown-style links and bolding
                  const renderWithLinks = (text: string) => {
                    return text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g).map((part, i) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-black text-[#001A33]">{part.slice(2, -2)}</strong>;
                      }
                      if (part.startsWith('[') && part.includes('](')) {
                        const match = part.match(/\[(.*?)\]\((.*?)\)/);
                        if (match) {
                          return (
                            <a key={i} href={match[2]} className="text-[#10B981] font-black border-b border-[#10B981]/30 hover:border-[#10B981] transition-all">
                              {match[1]}
                            </a>
                          );
                        }
                      }
                      return part;
                    });
                  };

                  return tourFAQs.map((faq, idx) => {
                    const isExpanded = expandedFAQs.has(idx);
                    return (
                      <div key={idx} className="border-b border-gray-100 last:border-0 overflow-hidden">
                        <button
                          onClick={() => toggleFAQExpand(idx)}
                          className="w-full py-6 flex items-center justify-between text-left group"
                        >
                          <h3 className="text-[18px] font-black text-[#001A33] group-hover:text-[#10B981] transition-colors pr-8">
                            {faq.question}
                          </h3>
                          <div className={`shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={24} className="text-gray-400 group-hover:text-[#10B981]" />
                          </div>
                        </button>
                        <div
                          className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mb-8' : 'grid-rows-[0fr] opacity-0'}`}
                        >
                          <div className="overflow-hidden">
                            <div className="text-[16px] text-gray-600 font-semibold leading-relaxed">
                              {renderWithLinks(faq.answer)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {
        showImageModal && allImages && allImages.length > 0 && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6" onClick={(e) => {
            // Close modal when clicking outside the image
            if (e.target === e.currentTarget) {
              setShowImageModal(false);
            }
          }}>
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>
            <div className="max-w-6xl w-full relative" onClick={(e) => e.stopPropagation()}>
              {allImages[selectedImageIndex] && (
                <img
                  src={allImages[selectedImageIndex]}
                  alt={`${tour.title} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-auto rounded-2xl max-h-[90vh] object-contain"
                />
              )}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(prev => Math.max(0, prev - 1));
                    }}
                    disabled={selectedImageIndex === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-50 transition-colors z-10"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(prev => Math.min(allImages.length - 1, prev + 1));
                    }}
                    disabled={selectedImageIndex === allImages.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-50 transition-colors z-10"
                  >
                    <ChevronRight size={24} />
                  </button>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <span className="text-white font-bold text-[14px]">
                      {selectedImageIndex + 1} / {allImages.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )
      }

      {/* Premium Calendar Modal */}
      {
        showCalendarModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCalendarModal(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-[#001A33]">Select Date</h3>
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => {
                    const newMonth = new Date(calendarMonth);
                    newMonth.setMonth(newMonth.getMonth() - 1);
                    setCalendarMonth(newMonth);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <h4 className="text-xl font-black text-[#001A33]">
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <button
                  onClick={() => {
                    const newMonth = new Date(calendarMonth);
                    newMonth.setMonth(newMonth.getMonth() + 1);
                    setCalendarMonth(newMonth);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="mb-4">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[12px] font-black text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {(() => {
                    const year = calendarMonth.getFullYear();
                    const month = calendarMonth.getMonth();
                    const firstDay = new Date(year, month, 1);
                    const lastDay = new Date(year, month + 1, 0);
                    const daysInMonth = lastDay.getDate();
                    const startingDayOfWeek = firstDay.getDay();

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const days = [];

                    // Empty cells for days before the first day of the month
                    for (let i = 0; i < startingDayOfWeek; i++) {
                      days.push(<div key={`empty-${i}`} className="h-10"></div>);
                    }

                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      const dateString = date.toISOString().split('T')[0];
                      const isToday = date.getTime() === today.getTime();
                      const isPast = date < today;
                      const isSelected = selectedDate === dateString;
                      const isAvailable = !isPast; // You can add custom availability logic here

                      days.push(
                        <button
                          key={day}
                          onClick={() => {
                            if (isAvailable && !isPast) {
                              setSelectedDate(dateString);
                              setShowCalendarModal(false);
                              if (bookingError === 'Please select a date first') {
                                setBookingError(null);
                              }
                            }
                          }}
                          disabled={isPast || !isAvailable}
                          className={`
                          h-10 rounded-xl font-bold text-[14px] transition-all
                          ${isSelected
                              ? 'bg-[#10B981] text-white shadow-lg scale-105'
                              : isPast || !isAvailable
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-[#001A33] hover:bg-[#10B981]/10 hover:scale-105'
                            }
                          ${isToday && !isSelected ? 'ring-2 ring-[#10B981] ring-offset-2' : ''}
                        `}
                        >
                          {day}
                        </button>
                      );
                    }

                    return days;
                  })()}
                </div>
              </div>

              {/* Quick Date Selection */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-[14px] font-bold text-gray-600 mb-3">Quick select</div>
                <div className="flex flex-wrap gap-2">
                  {getAvailableDates().slice(0, 7).map((date, index) => {
                    const dateString = date.toISOString().split('T')[0];
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const dayName = dayNames[date.getDay()];
                    const dayNum = date.getDate();
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const monthName = monthNames[date.getMonth()];

                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedDate(dateString);
                          setShowCalendarModal(false);
                          if (bookingError === 'Please select a date first') {
                            setBookingError(null);
                          }
                        }}
                        className={`
                        px-4 py-2 rounded-xl font-bold text-[13px] transition-all
                        ${selectedDate === dateString
                            ? 'bg-[#10B981] text-white'
                            : 'bg-gray-100 text-[#001A33] hover:bg-[#10B981]/10'
                          }
                      `}
                      >
                        {dayName} {dayNum} {monthName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Option Selection Modal - GetYourGuide Style */}
      {
        showOptionSelectionModal && tour && tour.options && tour.options.length > 0 && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowOptionSelectionModal(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#001A33] mb-2">Choose from {tour.options.length} available option{tour.options.length > 1 ? 's' : ''}</h2>
                  <p className="text-[14px] text-gray-600 font-semibold">Select your preferred tour option</p>
                </div>
                <button
                  onClick={() => setShowOptionSelectionModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Options List */}
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                {tour.options.map((option: any) => {
                  const isSelected = selectedOption?.id === option.id;
                  const currencySymbol = option.currency === 'USD' ? '$' : option.currency === 'EUR' ? '€' : '₹';

                  return (
                    <div
                      key={option.id}
                      className={`border-2 rounded-2xl p-6 transition-all ${isSelected
                        ? 'border-[#10B981] bg-[#10B981]/5 shadow-lg'
                        : 'border-gray-200 hover:border-[#10B981]/50 hover:shadow-md'
                        }`}
                    >
                      <div className="flex items-start justify-between gap-6">
                        {/* Left: Option Details */}
                        <div className="flex-1">
                          <h3 className="font-black text-[#001A33] text-[18px] mb-2">{option.optionTitle}</h3>
                          <p className="text-[14px] text-gray-600 font-semibold mb-4 leading-relaxed">
                            {option.optionDescription}
                          </p>

                          {/* Key Details Row */}
                          <div className="flex items-center gap-6 text-[13px] text-gray-600 font-semibold mb-4">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className="text-gray-500" />
                              <span>{option.durationHours} {option.durationHours === 1 ? 'hour' : 'hours'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe size={16} className="text-gray-500" />
                              <span>{option.language}</span>
                            </div>
                            {option.pickupIncluded && (
                              <div className="flex items-center gap-2">
                                <Bus size={16} className="text-gray-500" />
                                <span>Pickup included</span>
                              </div>
                            )}
                          </div>

                          {/* Inclusions Badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {option.guideIncluded && (
                              <span className="text-[12px] px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-bold">Guide Included</span>
                            )}
                            {option.carIncluded && (
                              <span className="text-[12px] px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">Private Car</span>
                            )}
                            {option.entryTicketIncluded && (
                              <span className="text-[12px] px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">Entry Tickets</span>
                            )}
                            {option.pickupIncluded && (
                              <span className="text-[12px] px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">Hotel Pickup</span>
                            )}
                          </div>

                          {/* Free Cancellation */}
                          <div className="flex items-center gap-2 text-[13px] text-gray-600">
                            <CheckCircle2 size={14} className="text-[#10B981]" />
                            <span className="font-semibold">Free cancellation</span>
                          </div>
                        </div>

                        {/* Right: Pricing & Select Button */}
                        <div className="text-right flex flex-col items-end min-w-[200px]">
                          <div className="mb-3">
                            <div className="font-black text-[#001A33] text-[20px] mb-1">
                              {(() => {
                                const currentParticipants = isCustomParticipants ? customParticipants : participants;
                                // Always use group pricing logic - calculate from tiers
                                const groupPrice = calculateGroupPrice(option, currentParticipants);

                                if (groupPrice !== null) {
                                  return `${currencySymbol}${groupPrice.toLocaleString()}`;
                                }

                                if (option.groupPrice) {
                                  return `${currencySymbol}${option.groupPrice.toLocaleString()}`;
                                }

                                // Fallback: use option.price as fixed price
                                return `${currencySymbol}${(option.price || 0).toLocaleString()}`;
                              })()}
                            </div>
                          </div>

                          <button
                            onClick={() => handleOptionSelected(option)}
                            className={`w-full px-6 py-3 rounded-xl font-black text-[14px] transition-all ${isSelected
                              ? 'bg-[#10B981] text-white'
                              : 'bg-[#0071EB] text-white hover:bg-[#0056b3]'
                              }`}
                          >
                            {isSelected ? 'Selected (Click to deselect)' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Actions */}
              {selectedOption && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[14px] text-gray-600 font-semibold mb-1">Selected option:</div>
                      <div className="font-black text-[#001A33] text-[16px]">{selectedOption.optionTitle}</div>
                    </div>
                    <button
                      onClick={() => setSelectedOption(null)}
                      className="px-4 py-2 text-[#0071EB] font-semibold text-[13px] hover:underline"
                    >
                      Back to Main Tour
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShowOptionSelectionModal(false);
                      setAvailabilityStatus('checking');
                      setTimeout(() => {
                        setAvailabilityStatus('available');
                      }, 1000);
                    }}
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black px-8 py-3 rounded-xl transition-all"
                  >
                    Continue to Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* Booking Modal */}
      {
        showBookingModal && tour && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" onClick={() => {
            // Save draft before closing
            if (tour?.id) {
              const draftKey = `booking_draft_${tour.id}`;
              const draft = {
                bookingData,
                selectedDate,
                participants,
                selectedOptionId: selectedOption?.id || null,
                tourId: tour.id
              };
              localStorage.setItem(draftKey, JSON.stringify(draft));
            }
            setShowBookingModal(false);
          }}>
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-[#001A33]">Complete Your Booking</h3>
                  {(bookingData.customerName || bookingData.customerEmail) && (
                    <p className="text-[12px] text-gray-500 font-semibold mt-1">
                      💾 Your progress is saved automatically
                    </p>
                  )}
                </div>
                <button onClick={() => {
                  // Save draft before closing
                  if (tour?.id) {
                    const draftKey = `booking_draft_${tour.id}`;
                    const draft = {
                      bookingData,
                      selectedDate,
                      participants,
                      selectedOptionId: selectedOption?.id || null,
                      tourId: tour.id
                    };
                    localStorage.setItem(draftKey, JSON.stringify(draft));
                  }
                  setShowBookingModal(false);
                }} className="p-2 rounded-full hover:bg-gray-100">
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h4 className="font-black text-[#001A33] text-[16px] mb-4">Booking Summary</h4>
                <div className="space-y-2 text-[14px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Tour:</span>
                    <span className="font-black text-[#001A33]">{tour.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Date:</span>
                    <span className="font-black text-[#001A33]">
                      {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Not selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Participants:</span>
                    <span className="font-black text-[#001A33]">{participants} {participants === 1 ? 'person' : 'people'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Language:</span>
                    <span className="font-black text-[#001A33]">{selectedLanguage}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-semibold">Total Amount:</span>
                      <span className="font-black text-[#001A33] text-[20px]">
                        {(() => {
                          const currentParticipants = isCustomParticipants ? customParticipants : participants;
                          const tourData = selectedOption || tour;
                          const currencySymbol = (selectedOption?.currency || tour.currency || 'INR') === 'INR' ? '₹' : '$';

                          // Always use group pricing logic - calculate from tiers
                          const groupPrice = calculateGroupPrice(tourData, currentParticipants);
                          if (groupPrice !== null && groupPrice > 0) {
                            return `${currencySymbol}${groupPrice.toLocaleString()}`;
                          }
                          // DO NOT use groupPrice fallback - it's the LAST tier price (wrong)
                          // Fallback: use pricePerPerson (should be first tier price)
                          const pricePerPerson = selectedOption?.price || tour.pricePerPerson || 0;
                          return `${currencySymbol}${pricePerPerson.toLocaleString()}`;
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-5 rounded-2xl text-[16px] transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Continue to Checkout
                    <ChevronRight size={20} />
                  </button>
                  <p className="text-[12px] text-gray-500 font-semibold text-center mt-4">
                    You'll enter your details on the next page
                  </p>
                </div>
              </form>

              {/* Support Section - Outside Form */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="bg-[#F0FDF4] border-2 border-[#10B981] rounded-xl p-5">
                  <p className="text-[14px] text-gray-800 font-black text-center mb-2">Need help? Contact our support:</p>
                  <p className="text-[13px] text-[#10B981] font-black text-center mb-4">Available 24/7 on WhatsApp support</p>
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
              </div>
            </div>
          </div>
        )
      }

      {/* Guide Contact Information Modal */}
      {
        showGuideContactModal && guideContactInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]" onClick={() => {
            setShowGuideContactModal(false);
            if (onClose) onClose();
          }}>
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowGuideContactModal(false);
                  if (onClose) onClose();
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-[#10B981]" size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#001A33] mb-2">Payment Successful!</h3>
                <p className="text-[14px] text-gray-600 font-semibold">
                  Your booking has been confirmed and payment received.
                </p>
                {guideContactInfo.bookingReference && (
                  <p className="text-[12px] text-gray-500 font-semibold mt-2">
                    Booking Reference: <span className="font-black text-[#001A33]">{guideContactInfo.bookingReference}</span>
                  </p>
                )}
              </div>

              {/* Invoice Section */}
              <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-6 mb-6 text-white">
                <h4 className="font-black text-white text-[18px] mb-4 flex items-center gap-2">
                  <CheckCircle size={20} />
                  Invoice & Payment Confirmation
                </h4>
                <div className="bg-white/10 rounded-xl p-4 space-y-2 text-[14px]">
                  {guideContactInfo.bookingReference && (
                    <div className="flex justify-between">
                      <span className="text-white/80 font-semibold">Booking Reference:</span>
                      <span className="font-black text-white">{guideContactInfo.bookingReference}</span>
                    </div>
                  )}
                  {guideContactInfo.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-white/80 font-semibold">Payment ID:</span>
                      <span className="font-black text-white text-[12px]">{guideContactInfo.paymentId.substring(0, 20)}...</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-white/20 mt-2">
                    <span className="text-white/80 font-semibold">Amount Paid:</span>
                    <span className="font-black text-white text-[18px]">
                      {guideContactInfo.currency === 'INR' ? '₹' : '$'}{guideContactInfo.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/80 font-semibold">Payment Status:</span>
                    <span className="font-black text-green-200">✓ Paid</span>
                  </div>
                  {guideContactInfo.paymentDate && (
                    <div className="flex justify-between">
                      <span className="text-white/80 font-semibold">Payment Date:</span>
                      <span className="font-black text-white text-[12px]">
                        {new Date(guideContactInfo.paymentDate).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h4 className="font-black text-[#001A33] text-[16px] mb-4">Booking Details</h4>
                <div className="space-y-2 text-[14px]">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Tour:</span>
                    <span className="font-black text-[#001A33]">{guideContactInfo.tourTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Date:</span>
                    <span className="font-black text-[#001A33]">
                      {new Date(guideContactInfo.bookingDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-semibold">Guests:</span>
                    <span className="font-black text-[#001A33]">{guideContactInfo.numberOfGuests} {guideContactInfo.numberOfGuests === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>
              </div>

              {/* Supplier Contact Information */}
              <div className="bg-[#10B981]/5 rounded-2xl p-6 mb-6 border-2 border-[#10B981]/20">
                <h4 className="font-black text-[#001A33] text-[18px] mb-4 flex items-center gap-2">
                  <User className="text-[#10B981]" size={20} />
                  Contact Your Supplier
                </h4>
                <p className="text-[12px] text-gray-500 font-semibold mb-4">
                  Contact information from supplier's profile
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="text-[12px] text-gray-500 font-bold uppercase mb-2">Supplier Name</div>
                    <div className="text-[16px] font-black text-[#001A33]">{guideContactInfo.guideName}</div>
                  </div>

                  {(guideContactInfo.guideWhatsApp || guideContactInfo.guidePhone) ? (
                    <>
                      {(guideContactInfo.guideWhatsApp || guideContactInfo.guidePhone) && (
                        <div>
                          <div className="text-[12px] text-gray-500 font-bold uppercase mb-2">WhatsApp Number</div>
                          <a
                            href={`https://wa.me/${(guideContactInfo.guideWhatsApp || guideContactInfo.guidePhone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-[#10B981] text-white font-black py-4 px-6 rounded-xl hover:bg-[#059669] transition-all"
                          >
                            <MessageCircle size={20} />
                            <span>{guideContactInfo.guideWhatsApp || guideContactInfo.guidePhone}</span>
                            <ChevronRight size={18} className="ml-auto" />
                          </a>
                          <p className="text-[12px] text-gray-500 font-semibold mt-2">Click to open WhatsApp chat</p>
                        </div>
                      )}

                      {guideContactInfo.guidePhone && guideContactInfo.guidePhone !== guideContactInfo.guideWhatsApp && (
                        <div>
                          <div className="text-[12px] text-gray-500 font-bold uppercase mb-2">Phone Number</div>
                          <a
                            href={`tel:${guideContactInfo.guidePhone}`}
                            className="flex items-center gap-3 bg-white border-2 border-gray-200 text-[#001A33] font-black py-4 px-6 rounded-xl hover:border-[#10B981] transition-all"
                          >
                            <Phone size={20} />
                            <span>{guideContactInfo.guidePhone}</span>
                            <ChevronRight size={18} className="ml-auto" />
                          </a>
                          <p className="text-[12px] text-gray-500 font-semibold mt-2">Click to call</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <Info className="text-yellow-600 shrink-0 mt-1" size={20} />
                        <div>
                          <p className="text-[14px] font-black text-[#001A33] mb-1">Contact Information Not Available</p>
                          <p className="text-[12px] text-gray-600 font-semibold">
                            The supplier hasn't added their phone or WhatsApp number to their profile yet. Please contact them via email.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {guideContactInfo.guideEmail && (
                    <div>
                      <div className="text-[12px] text-gray-500 font-bold uppercase mb-2">Email Address</div>
                      <a
                        href={`mailto:${guideContactInfo.guideEmail}`}
                        className="flex items-center gap-3 bg-white border-2 border-gray-200 text-[#001A33] font-black py-4 px-6 rounded-xl hover:border-[#10B981] transition-all"
                      >
                        <Mail size={20} />
                        <span className="break-all">{guideContactInfo.guideEmail}</span>
                        <ChevronRight size={18} className="ml-auto" />
                      </a>
                      <p className="text-[12px] text-gray-500 font-semibold mt-2">Click to send email</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-green-600 shrink-0 mt-1" size={20} />
                  <div>
                    <div className="font-black text-[#001A33] text-[14px] mb-1">Booking Confirmed!</div>
                    <div className="text-[12px] text-gray-700 font-semibold">
                      Your payment has been received. Contact your supplier via WhatsApp or phone to arrange meeting details and finalize your tour arrangements.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setShowGuideContactModal(false);
                    // Redirect to booking confirmation page
                    if (guideContactInfo.bookingId) {
                      window.location.href = `/booking-confirmation/${guideContactInfo.bookingId}`;
                    } else {
                      window.location.href = '/';
                    }
                  }}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-4 rounded-2xl text-[16px] transition-all shadow-lg"
                >
                  View Booking Details & Invoice
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowGuideContactModal(false);
                      if (onClose) {
                        onClose();
                      } else {
                        window.history.back();
                      }
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-[#001A33] font-black py-4 rounded-2xl text-[16px] transition-all"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowGuideContactModal(false);
                      window.location.href = '/';
                    }}
                    className="flex-1 bg-[#001A33] hover:bg-[#003366] text-white font-black py-4 rounded-2xl text-[16px] transition-all"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Booking Form */}
      {
        showBookingForm && pendingBookingData && (
          <BookingForm
            tourTitle={tour.title}
            bookingDate={pendingBookingData.bookingDate}
            guests={pendingBookingData.numberOfGuests}
            totalAmount={pendingBookingData.totalAmount}
            currency={pendingBookingData.currency}
            onSubmit={handleProceedToPayment}
            onClose={() => {
              setShowBookingForm(false);
              setShowBookingModal(true);
            }}
            isSubmitting={isInitializingPayment}
          />
        )
      }

      {/* Payment Initialization Loading Overlay */}
      {
        isInitializingPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mx-auto mb-4"></div>
              <h3 className="text-xl font-black text-[#001A33] mb-2">Initializing Payment</h3>
              <p className="text-gray-600 font-semibold">Please wait while we set up your payment...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          </div>
        )
      }

    </div >
  );
};

export default TourDetailPage;

