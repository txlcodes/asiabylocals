import React, { useState, useEffect, useRef } from 'react';
import { Star, Heart, MapPin, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface RelatedToursProps {
    currentTourId?: string;
    country: string;
    city: string;
}

const RelatedTours: React.FC<RelatedToursProps> = ({ currentTourId, country, city }) => {
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Preferred titles specified by the user to prioritize
    const preferredTitles = [
        'Female Guide for Taj Mahal',
        'Skip-the-Line Taj Mahal Sunrise Tour',
        'Book Official Tour Guide for Taj Mahal',
        'Book Entry Tickets of Taj Mahal'
    ];

    useEffect(() => {
        if (country && city) {
            fetchTours();
        } else {
            setLoading(false);
        }
    }, [country, city, currentTourId]);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'));
            const url = `${API_URL}/api/public/tours?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}&status=approved`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            if (data.success) {
                let toursArray: any[] = [];
                if (Array.isArray(data.tours)) {
                    toursArray = data.tours;
                } else if (data.tours && typeof data.tours === 'object' && Array.isArray(data.tours.tours)) {
                    toursArray = data.tours.tours;
                }

                // Filter out the current tour
                let filtered = toursArray.filter((t: any) => String(t.id) !== String(currentTourId));

                // Prioritize the user requested "preferred" tours to appear first if they exist
                filtered.sort((a, b) => {
                    const aIndex = preferredTitles.findIndex(title => a.title?.toLowerCase().includes(title.toLowerCase()));
                    const bIndex = preferredTitles.findIndex(title => b.title?.toLowerCase().includes(title.toLowerCase()));

                    if (aIndex !== -1 && bIndex === -1) return -1;
                    if (bIndex !== -1 && aIndex === -1) return 1;
                    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

                    // Fallback to sorting by rating if both or neither are preferred
                    const ratingA = calculateRating(a);
                    const ratingB = calculateRating(b);
                    return ratingB - ratingA;
                });

                // Add slugs
                const processedTours = filtered.map((tour: any) => ({
                    ...tour,
                    slug: tour.slug || `tour-${tour.id}`
                }));

                // Take up to 10
                setTours(processedTours.slice(0, 10));
            } else {
                setTours([]);
            }
        } catch (error) {
            console.error('RelatedTours - Error fetching tours:', error);
            setTours([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateRating = (tour: any) => {
        // Force high rating for preferred tours
        const title = tour.title?.toLowerCase() || '';
        const isPreferred = preferredTitles.some(pt => title.includes(pt.toLowerCase()));

        if (isPreferred) {
            // Return 4.9 or 5.0 for preferred tours to make them stand out
            return 4.9 + (Math.random() * 0.1);
        }

        const seed = parseInt(tour.id) || 0;
        const random = (seed * 9301 + 49297) % 233280;
        const normalized = random / 233280;
        return 4.0 + (normalized * 0.5); // Slightly lower non-preferred tours (4.0 to 4.5)
    };

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div className="mb-8 py-8 border-t border-gray-100">
                <h2 className="text-2xl font-black text-[#001A33] mb-6">You might also like...</h2>
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-[#10B981] w-8 h-8" />
                </div>
            </div>
        );
    }

    if (tours.length === 0) {
        return null;
    }

    const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="mb-10 pt-8 border-t border-gray-200 relative">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#001A33]">You might also like...</h2>
                <div className="flex gap-2">
                    <button
                        onClick={scrollLeft}
                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
                    >
                        <ChevronLeft size={20} className="text-[#001A33]" />
                    </button>
                    <button
                        onClick={scrollRight}
                        className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm"
                    >
                        <ChevronRight size={20} className="text-[#001A33]" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-5 pb-6 pt-2 px-1 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {tours.map((tour) => {
                    const rating = calculateRating(tour);
                    const displayRating = rating.toFixed(1);

                    let lowestPrice = 0;
                    if (tour.groupPricingTiers) {
                        try {
                            const tiers = typeof tour.groupPricingTiers === 'string'
                                ? JSON.parse(tour.groupPricingTiers)
                                : tour.groupPricingTiers;
                            if (Array.isArray(tiers) && tiers.length > 0 && tiers[0]?.price) {
                                lowestPrice = parseFloat(tiers[0].price) || 0;
                            }
                        } catch (e) { }
                    }
                    if (lowestPrice === 0 && tour.options && Array.isArray(tour.options) && tour.options.length > 0) {
                        for (const opt of tour.options) {
                            if (opt.groupPricingTiers) {
                                try {
                                    const tiers = typeof opt.groupPricingTiers === 'string'
                                        ? JSON.parse(opt.groupPricingTiers)
                                        : opt.groupPricingTiers;
                                    if (Array.isArray(tiers) && tiers.length > 0 && tiers[0]?.price) {
                                        const firstTierPrice = parseFloat(tiers[0].price) || 0;
                                        if (firstTierPrice > 0) {
                                            lowestPrice = lowestPrice === 0 ? firstTierPrice : Math.min(lowestPrice, firstTierPrice);
                                        }
                                    }
                                } catch (e) { }
                            }
                        }
                    }
                    if (lowestPrice === 0) {
                        lowestPrice = tour.pricePerPerson || 0;
                    }

                    const durationMatch = tour.duration?.match(/(\d+)\s*hours?/i) || tour.duration?.match(/(\d+)\s*hrs?/i);
                    const durationHours = durationMatch ? durationMatch[1] : null;

                    return (
                        <a
                            key={tour.id}
                            href={`/${countrySlug}/${citySlug}/${tour.slug}`}
                            className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group shrink-0 w-[240px] sm:w-[280px] md:w-[calc(33.333%-14px)] snap-start flex flex-col"
                        >
                            {tour.images && tour.images.length > 0 && (
                                <div className="relative h-48 overflow-hidden shrink-0">
                                    <img
                                        src={tour.images[0]}
                                        alt={tour.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {rating >= 4.5 && (
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 bg-[#10B981] text-white text-[10px] font-black rounded-md">
                                                Top rated
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                                    >
                                        <Heart size={16} className="text-gray-600" />
                                    </button>
                                </div>
                            )}

                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-[15px] font-black text-[#001A33] mb-2 line-clamp-2 group-hover:text-[#10B981] transition-colors leading-tight min-h-[44px]">
                                    {tour.title}
                                </h3>

                                {durationHours && (
                                    <div className="text-[12px] text-gray-500 font-semibold mb-2">
                                        {durationHours} {durationHours === '1' ? 'hour' : 'hours'}
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5 mb-auto">
                                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-[13px] font-black text-[#001A33]">{displayRating}</span>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between">
                                    <div className="text-[16px] font-black text-[#001A33]">
                                        <span className="text-[12px] text-gray-500 font-semibold block mb-0.5">Starting from</span>
                                        {tour.currency === 'INR' ? '₹' : '$'}{lowestPrice.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
        </div>
    );
};

export default RelatedTours;
