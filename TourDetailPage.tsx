import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Heart, 
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
      console.log('TourDetailPage - API Response:', data);
      
      if (data.success && data.tour) {
        console.log('TourDetailPage - Tour data received:', data.tour.title);
        console.log('TourDetailPage - Options:', data.tour.options);
        console.log('TourDetailPage - Options type:', typeof data.tour.options, Array.isArray(data.tour.options));
        console.log('TourDetailPage - Options count:', data.tour.options?.length);
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
        // Auto-select first option if available
        if (data.tour.options && Array.isArray(data.tour.options) && data.tour.options.length > 0) {
          console.log('TourDetailPage - Auto-selecting first option:', data.tour.options[0]);
          setSelectedOption(data.tour.options[0]);
        } else {
          console.log('TourDetailPage - No options found or empty array');
        }
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
    setSelectedOption(option);
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

    // Calculate total amount - infer pricing type from groupPrice/maxGroupSize presence
    let totalAmount = 0;
    let currency = selectedOption?.currency || tour.currency || 'INR';
    
    if (selectedOption) {
      // Infer pricing type: if groupPrice and maxGroupSize exist, it's per_group
      const isPerGroup = !!(selectedOption.groupPrice && selectedOption.maxGroupSize);
      
      if (isPerGroup) {
        // Per group pricing - fixed price regardless of participants
        totalAmount = selectedOption.groupPrice || 0;
      } else {
        // Per person pricing
        const pricePerPerson = selectedOption.price || 0;
        totalAmount = pricePerPerson * participants;
      }
    } else {
      // Fallback to tour price (per person)
      const pricePerPerson = tour.pricePerPerson || 0;
      totalAmount = pricePerPerson * participants;
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
              <a href="/" className="flex items-center gap-3">
                <img src="/logo.svg?v=3" alt="AsiaByLocals" className="h-12 w-12 object-contain" />
                <span className="font-black text-[#001A33] text-lg">AsiaByLocals</span>
              </a>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart size={20} className="text-gray-600" />
            </button>
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
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery - GetYourGuide Style: Main image left, 2 thumbnails right */}
            <div className="grid grid-cols-3 gap-2 h-[500px]">
              {mainImage && (
                <div 
                  className="col-span-2 relative cursor-pointer group"
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
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl"></div>
                </div>
              )}
              <div className="col-span-1 flex flex-col gap-2">
                {otherImages.slice(0, 2).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative flex-1 cursor-pointer group"
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
                      <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-white font-black text-[24px] mb-1">+{remainingImages}</div>
                          <div className="text-white text-[12px] font-bold">more</div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tour Options Section - GetYourGuide Style */}
            {tour.options && Array.isArray(tour.options) && tour.options.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-black text-[#001A33] mb-6">Choose from {tour.options.length} available option{tour.options.length > 1 ? 's' : ''}</h2>
                <div className="space-y-4">
                  {tour.options.map((option: any) => {
                    const isSelected = selectedOption?.id === option.id;
                    const currencySymbol = option.currency === 'USD' ? '$' : option.currency === 'EUR' ? '€' : '₹';
                    // Infer pricing type: if groupPrice and maxGroupSize exist, it's per_group
                    const isPerGroup = !!(option.groupPrice && option.maxGroupSize);
                    
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
                              {isPerGroup ? (
                                <>
                                  <div className="font-black text-[#001A33] text-[20px] mb-1">
                                    From {currencySymbol}{option.groupPrice?.toLocaleString()}
                                  </div>
                                  <div className="text-[12px] text-gray-600 font-semibold">
                                    per group (up to {option.maxGroupSize} people)
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="font-black text-[#001A33] text-[20px] mb-1">
                                    From {currencySymbol}{option.price.toLocaleString()}
                                  </div>
                                  <div className="text-[12px] text-gray-600 font-semibold">
                                    per person
                                  </div>
                                </>
                              )}
                            </div>
                            
                            <button
                              onClick={() => setSelectedOption(option)}
                              className={`w-full md:w-auto px-6 py-3 rounded-xl font-black text-[14px] transition-all mb-2 ${
                                isSelected
                                  ? 'bg-[#10B981] text-white'
                                  : 'bg-[#0071EB] text-white hover:bg-[#0056b3]'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
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
            )}

            {/* Short Description */}
            <div className="mb-8">
              <p className="text-[16px] text-gray-700 font-semibold leading-relaxed">
                {tour.shortDescription || tour.fullDescription}
              </p>
            </div>

            {/* Highlights Section */}
            {tour.highlights && Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
              <div className="mb-8">
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
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm">
              {/* Add to wishlist & Share */}
              <div className="flex items-center justify-end gap-4 mb-6">
                <a href="#" className="text-[14px] text-gray-600 font-semibold hover:text-[#10B981] transition-colors">
                  Add to wishlist
                </a>
                <a href="#" className="text-[14px] text-gray-600 font-semibold hover:text-[#10B981] transition-colors">
                  Share
                </a>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-[18px] text-gray-400 font-bold line-through">
                    From {tour.currency === 'INR' ? '₹' : '$'}1,300
                  </span>
                  <div className="text-3xl font-black text-red-600">
                    {(selectedOption?.currency || tour.currency || 'INR') === 'INR' ? '₹' : '$'}{selectedOption?.price || tour.pricePerPerson}
                  </div>
                </div>
                <div className="text-[14px] text-gray-600 font-semibold">per person</div>
                {/* Tour Types */}
                {tour.tourTypes && (() => {
                  try {
                    const tourTypesArray = typeof tour.tourTypes === 'string' ? JSON.parse(tour.tourTypes) : tour.tourTypes;
                    if (Array.isArray(tourTypesArray) && tourTypesArray.length > 0) {
                      return (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {tourTypesArray.map((type: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded"
                            >
                              {type}
                            </span>
                          ))}
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
                    <span>{selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) : 'Select date'}</span>
                    <Calendar className="text-gray-400" size={20} />
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
                  <div>
                    <div className="font-black text-[#001A33] text-[14px] mb-1">Free cancellation</div>
                    <div className="text-[12px] text-gray-600 font-semibold">
                      Cancel up to 24 hours in advance for a full refund
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-[#10B981] shrink-0 mt-1" size={18} />
                  <div>
                    <div className="font-black text-[#001A33] text-[14px] mb-1">Reserve now & pay later</div>
                    <div className="text-[12px] text-gray-600 font-semibold">
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
                // Infer pricing type: if groupPrice and maxGroupSize exist, it's per_group
                const isPerGroup = !!(option.groupPrice && option.maxGroupSize);
                
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
                          {isPerGroup ? (
                            <>
                              <div className="font-black text-[#001A33] text-[20px] mb-1">
                                {currencySymbol}{option.groupPrice?.toLocaleString()}
                              </div>
                              <div className="text-[12px] text-gray-600 font-semibold">
                                per group (up to {option.maxGroupSize} people)
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="font-black text-[#001A33] text-[20px] mb-1">
                                {currencySymbol}{option.price.toLocaleString()}
                              </div>
                              <div className="text-[12px] text-gray-600 font-semibold">
                                per person
                              </div>
                            </>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleOptionSelected(option)}
                          className={`w-full px-6 py-3 rounded-xl font-black text-[14px] transition-all ${
                            isSelected
                              ? 'bg-[#10B981] text-white'
                              : 'bg-[#0071EB] text-white hover:bg-[#0056b3]'
                          }`}
                        >
                          {isSelected ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Actions */}
            {selectedOption && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <div className="text-[14px] text-gray-600 font-semibold mb-1">Selected option:</div>
                  <div className="font-black text-[#001A33] text-[16px]">{selectedOption.optionTitle}</div>
                </div>
                <button
                  onClick={() => {
                    setShowOptionSelectionModal(false);
                    setAvailabilityStatus('checking');
                    setTimeout(() => {
                      setAvailabilityStatus('available');
                    }, 1000);
                  }}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-black px-8 py-3 rounded-xl transition-all"
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
                      {selectedOption?.currency || tour.currency || '₹'}{((selectedOption?.price || tour.pricePerPerson || 0) * participants).toLocaleString()}
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
                <div className="flex flex-col items-center gap-3">
                  <a href="https://wa.me/918449538716" target="_blank" rel="noopener noreferrer" className="w-full max-w-[280px] text-[15px] text-[#10B981] font-black hover:underline flex items-center justify-center gap-2 px-5 py-3 bg-white rounded-lg border-2 border-[#10B981] hover:bg-[#10B981] hover:text-white transition-all shadow-sm">
                    <span>+91 84495 38716</span>
                  </a>
                  <a href="https://wa.me/919897873562" target="_blank" rel="noopener noreferrer" className="w-full max-w-[280px] text-[15px] text-[#10B981] font-black hover:underline flex items-center justify-center gap-2 px-5 py-3 bg-white rounded-lg border-2 border-[#10B981] hover:bg-[#10B981] hover:text-white transition-all shadow-sm">
                    <span>+91 98978 73562</span>
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

