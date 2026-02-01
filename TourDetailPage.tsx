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
  CheckCircle
} from 'lucide-react';

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
  const [customParticipants, setCustomParticipants] = useState(9);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [availabilityStatus, setAvailabilityStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [showOptionSelectionModal, setShowOptionSelectionModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showGuideContactModal, setShowGuideContactModal] = useState(false);
  const [guideContactInfo, setGuideContactInfo] = useState<any>(null);
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: ''
  });
  const bookingBoxRef = useRef<HTMLDivElement>(null);

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
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:82',message:'Checking tour.groupPricingTiers - tour object state',data:{tourExists:!!tour,tourId:tour?.id,tourTitle:tour?.title,hasGroupPricingTiers:!!tour?.groupPricingTiers,groupPricingTiersType:typeof tour?.groupPricingTiers,tourKeys:tour?Object.keys(tour).slice(0,20):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    if (tour && tour.groupPricingTiers) {
      console.log('🔍 PRIMARY: Checking tour.groupPricingTiers (Tour model - PRIMARY SOURCE)...');
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:85',message:'tour.groupPricingTiers exists - parsing',data:{type:typeof tour.groupPricingTiers,isString:typeof tour.groupPricingTiers==='string',isArray:Array.isArray(tour.groupPricingTiers),preview:typeof tour.groupPricingTiers==='string'?tour.groupPricingTiers.substring(0,100):JSON.stringify(tour.groupPricingTiers).substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      try {
        if (typeof tour.groupPricingTiers === 'string') {
          groupPricingTiers = JSON.parse(tour.groupPricingTiers);
        } else if (Array.isArray(tour.groupPricingTiers)) {
          groupPricingTiers = tour.groupPricingTiers;
        }
        if (groupPricingTiers && Array.isArray(groupPricingTiers) && groupPricingTiers.length > 0) {
          console.log('✅ PRIMARY: Found groupPricingTiers on Tour model:', groupPricingTiers);
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:91',message:'Successfully parsed tour.groupPricingTiers',data:{tiersCount:groupPricingTiers.length,firstTier:groupPricingTiers[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
          // #endregion
        }
      } catch (e) {
        console.error('❌ Failed to parse tour.groupPricingTiers:', e);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:94',message:'Failed to parse tour.groupPricingTiers',data:{error:e.message,errorStack:e.stack},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
      }
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:96',message:'tour.groupPricingTiers NOT found',data:{tourExists:!!tour,hasGroupPricingTiers:!!tour?.groupPricingTiers,reason:tour?'groupPricingTiers missing':'tour is null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
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
      document.title = `${tour.title} | ${city || 'Tour'} | AsiaByLocals`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', tour.shortDescription || tour.fullDescription?.substring(0, 155) || '');
      }
      
      // Set canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      // Build canonical URL from tour slug
      if (tour.slug && country && city) {
        const countrySlug = country.toLowerCase();
        const citySlug = city.toLowerCase();
        canonical.setAttribute('href', `https://www.asiabylocals.com/${countrySlug}/${citySlug}/${tour.slug}`);
      } else if (tour.id) {
        // Fallback to ID-based URL if slug not available
        canonical.setAttribute('href', `https://www.asiabylocals.com/tour/${tour.id}`);
      }
    }
  }, [tour, city, country]);

  const fetchTour = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
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
      
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:564',message:'API response received - checking tour.groupPricingTiers',data:{tourId:data.tour?.id,tourTitle:data.tour?.title,hasGroupPricingTiers:!!data.tour?.groupPricingTiers,groupPricingTiersType:typeof data.tour?.groupPricingTiers,groupPricingTiersValue:data.tour?.groupPricingTiers?typeof data.tour.groupPricingTiers==='string'?data.tour.groupPricingTiers.substring(0,100):JSON.stringify(data.tour.groupPricingTiers).substring(0,100):null,tourKeys:data.tour?Object.keys(data.tour).filter(k=>k.toLowerCase().includes('pricing')||k.toLowerCase().includes('group')):null,allTourKeys:data.tour?Object.keys(data.tour).slice(0,30):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
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
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:624',message:'API response received - checking tour.groupPricingTiers',data:{tourId:data.tour?.id,tourTitle:data.tour?.title,hasGroupPricingTiers:!!data.tour?.groupPricingTiers,groupPricingTiersType:typeof data.tour?.groupPricingTiers,groupPricingTiersValue:data.tour?.groupPricingTiers?typeof data.tour.groupPricingTiers==='string'?data.tour.groupPricingTiers.substring(0,100):JSON.stringify(data.tour.groupPricingTiers).substring(0,100):null,tourKeys:data.tour?Object.keys(data.tour).filter(k=>k.toLowerCase().includes('pricing')||k.toLowerCase().includes('group')):null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        
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
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:634',message:'Parsing groupPricingTiers from API response',data:{type:typeof data.tour.groupPricingTiers,isString:typeof data.tour.groupPricingTiers==='string',isArray:Array.isArray(data.tour.groupPricingTiers)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
          try {
            mainTourGroupPricingTiers = typeof data.tour.groupPricingTiers === 'string' 
              ? JSON.parse(data.tour.groupPricingTiers) 
              : data.tour.groupPricingTiers;
            mainTourHasGroupPricing = Array.isArray(mainTourGroupPricingTiers) && mainTourGroupPricingTiers.length > 0;
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:639',message:'Successfully parsed groupPricingTiers from API',data:{hasGroupPricing:mainTourHasGroupPricing,tiersCount:mainTourGroupPricingTiers?.length,firstTier:mainTourGroupPricingTiers?.[0]},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
          } catch (e) {
            console.error('Error parsing main tour groupPricingTiers:', e);
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:641',message:'Failed to parse groupPricingTiers from API',data:{error:e.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
          }
        } else {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/c1426495-b81c-4a08-aaea-9440216322e2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TourDetailPage.tsx:643',message:'API response has NO groupPricingTiers',data:{tourId:data.tour?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
          // #endregion
        }
        
        // Also check for legacy groupPrice + maxGroupSize
        if (!mainTourHasGroupPricing && data.tour.groupPrice && data.tour.maxGroupSize) {
          mainTourHasGroupPricing = true;
        }
        
        // If main tour has group pricing AND has options, create main tour as first option
        if (mainTourHasGroupPricing && data.tour.options && Array.isArray(data.tour.options) && data.tour.options.length > 0) {
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

  const handleCheckAvailability = async () => {
    if (!selectedDate) {
      alert('Please select a date first');
      return;
    }

    // If tour has options but none selected, prompt user to select one
    if (tour?.options && Array.isArray(tour.options) && tour.options.length > 0 && !selectedOption) {
      alert('Please select a tour option first');
      return;
    }

    setAvailabilityStatus('checking');
    
    // Simulate API call - in real app, this would check actual availability
    setTimeout(() => {
      // For demo purposes, assume it's always available
      // In production, this would call your backend API
      setAvailabilityStatus('available');
    }, 1000);
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
    setAvailabilityStatus('checking');
    
    // Simulate API call - in real app, this would check actual availability
    setTimeout(() => {
      setAvailabilityStatus('available');
    }, 1000);
  };

  const handleProceedToBooking = () => {
    // If tour has options but none selected, prompt user to select one
    if (tour?.options && Array.isArray(tour.options) && tour.options.length > 0 && !selectedOption) {
      alert('Please select a tour option first');
      return;
    }

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
    
    // Create booking via API
    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const bookingResponse = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: tour.id,
          tourOptionId: selectedOption?.id || null,
          bookingDate: selectedDate,
          numberOfGuests: participants,
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          specialRequests: bookingData.specialRequests,
          totalAmount: totalAmount,
          currency: currency
        }),
      });

      const bookingResult = await bookingResponse.json();
      
      if (bookingResult.success) {
        // Show guide contact information instead of payment
        const supplierInfo = bookingResult.supplier || tour.supplier;
        setGuideContactInfo({
          guideName: supplierInfo?.fullName || supplierInfo?.companyName || 'Your Guide',
          guideEmail: supplierInfo?.email || '',
          guidePhone: supplierInfo?.phone || '',
          guideWhatsApp: supplierInfo?.whatsapp || supplierInfo?.phone || '',
          bookingId: bookingResult.booking.id,
          tourTitle: tour.title,
          bookingDate: selectedDate,
          numberOfGuests: participants,
          totalAmount: totalAmount,
          currency: currency
        });
        setShowBookingModal(false);
        setShowGuideContactModal(true);
        // Clear draft after successful booking
        if (tour?.id) {
          const draftKey = `booking_draft_${tour.id}`;
          localStorage.removeItem(draftKey);
        }
        // Reset form
        setBookingData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          specialRequests: ''
        });
        setAvailabilityStatus('idle');
      } else {
        alert(bookingResult.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking. Please try again.');
    }
  };


  const initializeRazorpayPayment = async (bookingId: string, amount: number, currency: string) => {
    try {
      // Create payment order via backend
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const paymentResponse = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          amount: amount * 100, // Convert to paise/paisa
          currency: currency || 'INR'
        }),
      });

      const paymentData = await paymentResponse.json();
      
      if (!paymentData.success) {
        alert('Failed to initialize payment');
        return;
      }

      // Load Razorpay script dynamically
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: paymentData.razorpayKeyId, // Your Razorpay key ID from backend
          amount: paymentData.order.amount,
          currency: paymentData.order.currency,
          name: 'AsiaByLocals',
          description: `Booking for ${tour?.title}`,
          order_id: paymentData.order.id,
          handler: async function(response: any) {
            // Verify payment on backend
            const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
            const verifyResponse = await fetch(`${API_URL}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: bookingId
              }),
            });

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              alert('Payment successful! Your booking is confirmed.');
              setShowBookingModal(false);
              setAvailabilityStatus('idle');
              setBookingData({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                specialRequests: ''
              });
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: bookingData.customerName,
            email: bookingData.customerEmail,
            contact: bookingData.customerPhone
          },
          theme: {
            color: '#10B981'
          },
          modal: {
            ondismiss: function() {
              console.log('Payment cancelled');
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
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
  
  try {
    if (tour && tour.images) {
      const images = Array.isArray(tour.images) ? tour.images : (typeof tour.images === 'string' ? JSON.parse(tour.images) : []);
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
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Share2 size={20} className="text-gray-600" />
            </button>
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
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery - GetYourGuide Style: Main image left, 2 thumbnails right */}
            <div className="grid grid-cols-3 gap-2 h-[500px] overflow-hidden relative">
              {mainImage && (
                <div 
                  className="col-span-2 relative cursor-pointer group overflow-hidden rounded-2xl h-full"
                  onClick={() => {
                    setSelectedImageIndex(0);
                    setShowImageModal(true);
                  }}
                >
                  <img
                    src={mainImage}
                    alt={tour.title}
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl pointer-events-none"></div>
                </div>
              )}
              <div className="col-span-1 flex flex-col gap-2 h-full">
                {otherImages.slice(0, 2).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative flex-1 cursor-pointer group overflow-hidden rounded-2xl h-full"
                    onClick={() => {
                      setSelectedImageIndex(index + 1);
                      setShowImageModal(true);
                    }}
                  >
                    <img
                      src={image}
                      alt={`${tour.title} ${index + 2}`}
                      className="w-full h-full object-cover rounded-2xl"
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
            <div className="mb-8 pt-12">
              <p className="text-[16px] text-gray-700 font-semibold leading-relaxed">
                {tour.shortDescription || tour.fullDescription}
              </p>
            </div>

            {/* Highlights Section */}
            {tour.highlights && Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
              <div className="mb-8 pt-12">
                <h2 className="text-2xl font-black text-[#001A33] mb-4">Highlights</h2>
                <ul className="space-y-2">
                  {tour.highlights.map((highlight: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2 shrink-0"></div>
                      <span className="text-[16px] text-gray-700 font-semibold leading-relaxed">{highlight}</span>
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
              
              const shouldShowMainTourAsOption = mainTourHasGroupPricing && tour.options && tour.options.length > 0;
              
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
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-[#001A33] mb-6">Choose from {allOptions.length} available option{allOptions.length > 1 ? 's' : ''}</h2>
                    <div className="space-y-4">
                      {allOptions.map((option: any) => {
                    const isSelected = selectedOption?.id === option.id;
                    const currencySymbol = option.currency === 'USD' ? '$' : option.currency === 'EUR' ? '€' : '₹';
                    
                    return (
                      <div
                        key={option.id}
                        className={`bg-white border-2 rounded-2xl p-6 transition-all ${
                          isSelected
                            ? 'border-[#10B981] shadow-lg'
                            : 'border-gray-200 hover:border-[#10B981]/50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row items-start justify-between gap-4 md:gap-6">
                          {/* Left: Option Details */}
                          <div className="flex-1 w-full md:w-auto">
                            <h3 className="font-black text-[#001A33] text-[18px] mb-2">{option.optionTitle}</h3>
                            <p className="text-[14px] text-gray-600 font-semibold mb-4 leading-relaxed">
                              {option.optionDescription}
                              {option.optionDescription && option.optionDescription.length > 100 && (
                                <span className="text-[#0071EB] cursor-pointer ml-1">Read more</span>
                              )}
                            </p>
                            
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
                              className={`w-full md:w-auto px-6 py-3 rounded-xl font-black text-[14px] transition-all mb-2 ${
                                isSelected
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
              <p className="text-[16px] text-gray-700 font-semibold leading-relaxed whitespace-pre-line">
                {tour.fullDescription}
              </p>
            </div>

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
                    <div className="font-black text-[#001A33] text-[16px] mb-1">Reserve now & pay later</div>
                    <div className="text-[14px] text-gray-600 font-semibold">
                      Keep your travel plans flexible — book your spot and pay nothing today.{' '}
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
                            console.log('✅ Using selected option groupPricingTiers:', groupPrice);
                            console.log('═══════════════════════════════════════════════════════════');
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
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
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
                      min="9"
                      max="100"
                      value={customParticipants}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 9;
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
                    <div className="font-black text-[#001A33] text-[14px] mb-1 break-words">Reserve now & pay later</div>
                    <div className="text-[12px] text-gray-600 font-semibold break-words">
                      Keep your travel plans flexible — book your spot and pay nothing today.{' '}
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
                disabled={!selectedDate || availabilityStatus === 'checking' || (tour.options && tour.options.length > 0 && !selectedOption)}
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
              {tour.options && tour.options.length > 0 && !selectedOption && (
                <p className="text-[12px] text-red-500 font-semibold text-center mt-2">
                  Please select an option above
                </p>
              )}

              <p className="text-[12px] text-gray-500 font-semibold text-center mt-4">
                No payment required at booking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && tour.images && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="max-w-6xl w-full">
            <img
              src={tour.images[selectedImageIndex]}
              alt={tour.title}
              className="w-full h-auto rounded-2xl"
            />
            {tour.images.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => setSelectedImageIndex(prev => Math.max(0, prev - 1))}
                  disabled={selectedImageIndex === 0}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <span className="text-white font-bold text-[14px]">
                  {selectedImageIndex + 1} / {tour.images.length}
                </span>
                <button
                  onClick={() => setSelectedImageIndex(prev => Math.min(tour.images.length - 1, prev + 1))}
                  disabled={selectedImageIndex === tour.images.length - 1}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Calendar Modal */}
      {showCalendarModal && (
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
      )}

      {/* Option Selection Modal - GetYourGuide Style */}
      {showOptionSelectionModal && tour && tour.options && tour.options.length > 0 && (
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
                    className={`border-2 rounded-2xl p-6 transition-all ${
                      isSelected
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
                          className={`w-full px-6 py-3 rounded-xl font-black text-[14px] transition-all ${
                            isSelected
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
      )}

      {/* Booking Modal */}
      {showBookingModal && tour && (
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
              <div>
                <label className="block text-[14px] font-black text-[#001A33] mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={bookingData.customerName}
                    onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-black text-[#001A33] mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={bookingData.customerEmail}
                    onChange={(e) => setBookingData({ ...bookingData, customerEmail: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-black text-[#001A33] mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    required
                    value={bookingData.customerPhone}
                    onChange={(e) => setBookingData({ ...bookingData, customerPhone: e.target.value })}
                    placeholder="+91 1234567890"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-black text-[#001A33] mb-2">Special Requests (Optional)</label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                  placeholder="Any special requests or dietary requirements..."
                  rows={4}
                  className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] outline-none resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-black py-5 rounded-2xl text-[16px] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Complete Booking
                  <ChevronRight size={20} />
                </button>
                <p className="text-[12px] text-gray-500 font-semibold text-center mt-4">
                  You'll receive guide contact details after booking
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
            </div>
          </div>
        </div>
      )}

      {/* Guide Contact Information Modal */}
      {showGuideContactModal && guideContactInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" onClick={() => setShowGuideContactModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-[#10B981]" size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#001A33] mb-2">Booking Confirmed!</h3>
              <p className="text-[14px] text-gray-600 font-semibold">
                Your booking has been received. Contact your guide to complete payment and finalize details.
              </p>
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
                <div className="flex justify-between pt-4 border-t border-gray-200 mt-4">
                  <span className="text-gray-600 font-semibold">Total Amount:</span>
                  <span className="font-black text-[#001A33] text-[18px]">
                    {guideContactInfo.currency === 'INR' ? '₹' : '$'}{guideContactInfo.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Guide Contact Information */}
            <div className="bg-[#10B981]/5 rounded-2xl p-6 mb-6 border-2 border-[#10B981]/20">
              <h4 className="font-black text-[#001A33] text-[18px] mb-4 flex items-center gap-2">
                <User className="text-[#10B981]" size={20} />
                Contact Your Guide
              </h4>
              <p className="text-[12px] text-gray-500 font-semibold mb-4">
                Contact information from guide's profile
              </p>
              <div className="space-y-4">
                <div>
                  <div className="text-[12px] text-gray-500 font-bold uppercase mb-2">Guide Name</div>
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
                          The guide hasn't added their phone or WhatsApp number to their profile yet. Please contact them via email.
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="text-yellow-600 shrink-0 mt-1" size={20} />
                <div>
                  <div className="font-black text-[#001A33] text-[14px] mb-1">Next Steps</div>
                  <div className="text-[12px] text-gray-700 font-semibold">
                    Contact your guide via WhatsApp or phone to confirm the booking and arrange payment. The guide will provide you with meeting point details and finalize all arrangements.
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowGuideContactModal(false);
                window.location.reload(); // Refresh to reset state
              }}
              className="w-full bg-[#001A33] hover:bg-[#003366] text-white font-black py-4 rounded-2xl text-[16px] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TourDetailPage;

