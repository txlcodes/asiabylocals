import React from 'react';
import {
    ArrowLeft,
    Clock,
    MapPin,
    Ticket,
    Calendar,
    Info,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    Globe,
    User,
    Star,
    Camera,
    CreditCard,
    Utensils,
    History,
    ShieldCheck,
    Navigation,
    Building
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface CityInfoPageProps {
    country: string;
    city: string;
    slug: string;
}

const CityInfoPage: React.FC<CityInfoPageProps> = ({ country, city, slug }) => {
    const handleBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = `/${country.toLowerCase()}/${city.toLowerCase()}`;
        }
    };

    const getContent = () => {
        switch (slug) {
            case 'things-to-do-in-agra':
                return {
                    title: '15 Best Things to Do in Agra: Beyond the Taj Mahal (2026)',
                    description: 'A comprehensive guide to Agra\'s premier attractions, historical sites, and local experiences. From UNESCO world heritage sites to authentic culinary trails.',
                    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1500',
                    sections: [
                        {
                            title: "1. Sunrise at the Taj Mahal: Timing and Entry Strategy",
                            content: "The Taj Mahal is best visited at sunrise for optimal lighting and minimal crowds. Doors open 30 minutes before sunrise. Use the East Gate (Shilpgram) for shorter queues compared to the West Gate. Security is high; avoid carrying large bags, batteries, or tobacco items to speed up entry. The first 30 minutes of light provide the iconic golden-pink glow on the Makrana marble."
                        },
                        {
                            title: "2. Strategic Exploration of Agra Fort",
                            content: "A 16th-century fortress and residence of the Mughal dynasty. This red sandstone complex spans 94 acres. Key structures include the Jahangir Palace, Khas Mahal, and the Musamman Burj where Shah Jahan was imprisoned. Allow 2.5 hours for a thorough walk. The fort offers unique photo perspectives of the Taj Mahal from the river-facing battlements."
                        },
                        {
                            title: "3. Itmad-ud-Daula: The 'Baby Taj'",
                            content: "Built by Empress Nur Jahan for her father between 1622 and 1628. It represents the transition from red sandstone Mughal architecture to the white marble era. It is the first structure in India to use extensive Pietra Dura (stone inlay) on marble. Its location on the Yamuna's east bank makes it significantly cooler and quieter than other city sites."
                        },
                        {
                            title: "4. Sunset View from Mehtab Bagh",
                            content: "Directly across the river from the Taj Mahal. This 25-acre garden complex is aligned with the main tomb. It is the best location for professional photography during the 'blue hour'. Entry is through a paid ticket, but a small sunset point just outside the gate offers similar views for free. It is particularly striking during the winter months (Nov–Feb)."
                        },
                        {
                            title: "5. Fatehpur Sikri: The Abandoned Capital",
                            content: "Located 40 km from Agra, this UNESCO site was Akbar's capital for just 14 years. It contains the Buland Darwaza (world's highest gateway) and the Jama Masjid. The Palace of Jodha Bai and Birbal's House demonstrate the fusion of Islamic and Hindu architectural styles. Hiring a licensed guide here is essential to understand the complex water management history."
                        },
                        {
                            title: "6. Akbar's Tomb at Sikandra",
                            content: "Set in 119 acres of deer park. The tomb has a multi-tiered structure with a unique five-storey pyramid facade. The calligraphic and geometric patterns at the entrance gateway are among the finest in Northern India. Entrance is less crowded, making it ideal for those seeking architectural photography without tourists in the frame."
                        },
                        {
                            title: "7. Culinary Walk: Authentic Agra Street Food",
                            content: "Agra's food scene is defined by two staples: Petha (ash gourd sweet) and Bedai with Jalebi. Deviram Sweets (Pratap Pura) is the local standard for breakfast. Avoid 'Angoori Petha' at tourist stalls; look for the original 'Panchhi Petha' store near Sadar Bazaar. For dinner, the kebabs at Mama Chicken are a local favorite, albeit in a no-frills setting."
                        },
                        {
                            title: "8. Exploring Chini Ka Rauza",
                            content: "The tomb of Afzal Khan, Persian courtier to Shah Jahan. It is the only building in Agra decorated entirely with glazed tile work (Kashi work). While partly in ruins, it remains a rare example of Persian architecture on the banks of the Yamuna, located between Itmad-ud-Daula and Ram Bagh."
                        },
                        {
                            title: "9. Wildlife SOS: Elephant & Bear Rescue",
                            content: "For a break from history, visit Wildlife SOS on the Agra-Delhi highway. This facility rescues mistreated elephants and 'dancing' sloth bears. It offers 2-hour guided educational tours. Pre-booking is mandatory. This is a non-monument, ethical travel experience that directly supports conservation."
                        },
                        {
                            title: "10. Shopping at Kinari Bazaar",
                            content: "The heart of Old Agra. This wholesale market is narrow, chaotic, and authentic. It's famous for Zardozi (gold embroidery), leather goods, and wedding accessories. Prices here are 50% lower than in tourist emporiums, provided you know how to negotiate. Best visited between 4 PM and 7 PM."
                        }
                    ],
                    faqs: [
                        { q: "What is the best month to visit Agra?", a: "October to March offers pleasant weather (10°C to 25°C). Avoid May and June due to extreme heat (45°C+)." },
                        { q: "Are guides necessary at Agra Fort?", a: "While not mandatory, a licensed guide is recommended for Agra Fort to navigate the complex history of the Mughal succession." }
                    ]
                };

            case 'places-to-visit-in-agra':
                return {
                    title: 'Places to Visit in Agra: Complete Historical Monument List',
                    description: 'A structural directory of Agra\'s monuments, archaeological sites, and botanical gardens. Location-focused data for efficient trip planning.',
                    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1500',
                    sections: [
                        {
                            title: "The Taj Mahal Complex",
                            content: "Primary Monument Site. Location: Dharmapuri, Forest Colony, Tajganj. Includes the main Mausoleum, Mosque (West), Jawab (East), and the Charbagh gardens. Entry requires separate tickets for the garden and the main dome. Open Sat-Thu."
                        },
                        {
                            title: "Agra Fort Archaeological Site",
                            content: "Location: 2.5 km northwest of the Taj Mahal. A semi-circular structure with 70-foot high walls. Contains the Delhi Gate and the Amar Singh Gate. Accessible areas include the public court, royal residences, and the Pearl Mosque (viewable from courtyard)."
                        },
                        {
                            title: "Mausoleum of Itimad-ud-Daula",
                            content: "Location: Moti Bagh. Located 5 km from Agra Fort on the northern bank of the Yamuna. Known as the 'Baby Taj'. Features a cruciform plan with octagonal towers. Entirely clad in Makrana marble with semi-precious stone inlays."
                        },
                        {
                            title: "Ram Bagh Colonial Garden",
                            content: "Location: Firozabad Road. The oldest Mughal garden in India, originally built by Babur in 1528 as a Persian-style retreat. Known for its sophisticated irrigation system using river water. It is a peaceful alternative to the crowded Taj gardens."
                        },
                        {
                            title: "Mariam's Tomb",
                            content: "Location: Sikandra (near Akbar's Tomb). The resting place of Mariam-uz-Zamani, the Hindu queen of Akbar. The architecture is unique as it lacks a dome, featuring a flat roof with pavilioned corners, reflecting a blend of Mughal and Rajput styles."
                        },
                        {
                            title: "Lower Tajganj and Local Craft Villages",
                            content: "The area south of the Taj Mahal. While not a single monument, it's home to the generational marble carvers who maintain the Taj. It offers a glimpse into the living history of Agra's artisan culture."
                        }
                    ]
                };

            case '1-day-agra-itinerary':
                return {
                    title: 'Agra 1-Day Itinerary: The High-Efficiency Route for 2026',
                    description: 'A tactical, hour-by-hour operational plan to see all major Agra sights in 15 hours. Designed for maximized photography and minimal queueing.',
                    heroImage: 'https://images.unsplash.com/photo-1548013146-285ac76d4f85?auto=format&fit=crop&q=80&w=1500',
                    sections: [
                        {
                            title: "Phase 1: The Sunrise Session (05:30 AM – 09:30 AM)",
                            content: "**05:30 AM:** Arrive at the Taj Mahal East Gate. Online tickets downloaded to phone. \n**06:00 AM:** Enter the complex. Walk directly to the central platform (The Bench) for reflections, then immediately proceed to the Mausoleum entry to avoid the 1-hour wait that forms by 9 AM.\n**08:30 AM:** Breakfast at 'The Salt Cafe' or 'Good Vibes Cafe' near Tajganj."
                        },
                        {
                            title: "Phase 2: The Royal Legacy (10:00 AM – 01:00 PM)",
                            content: "**10:00 AM:** Direct transfer to Agra Fort. Focus on the Jahangir Mahal and the view of the Taj from the balcony. \n**12:15 PM:** Lunch at 'Pinch of Spice' on Fatehabad Road. It’s consistent and provides reliable air conditioning during the midday heat."
                        },
                        {
                            title: "Phase 3: The Architecture Trail (01:30 PM – 04:30 PM)",
                            content: "**01:30 PM:** Cross the Yamuna Bridge to Itmad-ud-Daula (Baby Taj). This site is at its best in the harsh afternoon light due to its intricate white marble detail.\n**03:00 PM:** Quick stop at Chini Ka Rauza (just 1km from Baby Taj) to see the blue tile work."
                        },
                        {
                            title: "Phase 4: The Golden Hour (05:00 PM – 07:00 PM)",
                            content: "**05:00 PM:** Arrive at Mehtab Bagh (Moonlight Garden). Do not wait until the last minute as tickets stop being sold 15 minutes before sunset.\n**06:30 PM:** Dinner at a rooftop restaurant overlooking the Taj Mahal. 'Saniya Palace' or 'Bellevue' offer direct line-of-sight views."
                        }
                    ]
                };

            case 'taj-mahal-ticket-price-2026':
                return {
                    title: 'Taj Mahal Ticket Price 2026: Official Fees & Booking Steps',
                    description: 'Updated price charts for Taj Mahal entry in 2026. Coverage of new digital-only payment rules, camera fees, and differential pricing for all visitor types.',
                    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1500',
                    sections: [
                        {
                            title: "Visitor Price Breakdown (Official 2026 Rates)",
                            content: "Tickets consist of a base entry fee (garden access) and an optional dome entry fee (mausoleum access). \n\n*   **Foreign Tourists:** ₹1,100 (Entry) + ₹200 (Mausoleum) = **₹1,300 Total**\n*   **SAARC/BIMSTEC Citizens:** ₹540 (Entry) + ₹200 (Mausoleum) = **₹740 Total**\n*   **Indian Citizens:** ₹50 (Entry) + ₹200 (Mausoleum) = **₹250 Total**"
                        },
                        {
                            title: "Important: Mandatory Mausoleum Add-on",
                            content: "Since 2023, the 'Main Dome' visit is an optional add-on. If you do not pay the additional ₹200 fee, you can only walk around the gardens and see the building from the outside. Almost all first-time visitors should pay the add-on to see the interiors."
                        },
                        {
                            title: "Child Entry & Group Rules",
                            content: "Children under **15 years of age** are free (all nationalities). Valid ID may be requested for teenagers to verify age. School groups should process bulk permits 48 hours in advance for subsidized rates."
                        },
                        {
                            title: "Camera & Equipment Fees",
                            content: "Small digital cameras and phones: **Free**. \nProfessional Video Cameras: **₹25** (nominal fee, but requires entry declaration). \nDrones and Tripods: **Strictly Prohibited** inside the complex and the surrounding 500-meter buffer zone."
                        },
                        {
                            title: "How to Book: Digital-Only Policy",
                            content: "As of 2026, **no cash is accepted** at the ticket counters. Tickets are only available through:\n1. The ASI Payumoney portal.\n2. Scanning QR codes at the gate (requires active internet).\n3. Pre-booking through verified tour operators."
                        }
                    ]
                };

            case 'taj-mahal-opening-time':
                return {
                    title: 'Taj Mahal Opening Time 2026: Sunrise, Friday & Night Rules',
                    description: 'Operational schedule for the Taj Mahal. Includes sunrise entry tactics, seasonal changes in solar timing, and Friday closure details.',
                    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1500',
                    sections: [
                        {
                            title: "The 'Sunrise to Sunset' Rule",
                            content: "The Taj Mahal does not have a fixed 9-to-5 schedule. It opens officially **30 minutes before sunrise** and closes **30 minutes before sunset**. \n\n*   **Summer (Apr-Jul):** Gates typically open around 5:15 AM.\n*   **Winter (Nov-Feb):** Gates open as late as 6:45 AM due to late sunrise."
                        },
                        {
                            title: "The Friday Rule: Weekly Closure",
                            content: "**The Taj Mahal is closed every Friday.** This is the most critical planning fact. It is only open to local residents for afternoon prayers at the mosque. Do not book travel to Agra on a Friday if your goal is to enter the Taj Mahal."
                        },
                        {
                            title: "Night Viewing Schedule",
                            content: "Night viewing is permitted on 5 nights a month: the full moon night + 2 nights before + 2 nights after. \nException: No night viewing on Fridays or durante the month of Ramadan. \nHours: 8:30 PM to 12:30 AM. Tickets must be booked in person at the ASI office (Sikka Mall) 24 hours in advance."
                        }
                    ]
                };

            case 'is-taj-mahal-closed-on-friday':
                return {
                    title: 'Why is the Taj Mahal Closed on Friday? (Updated 2026)',
                    description: 'Explanatory guide on the Friday closure rule and how to maximize an Agra trip if you happen to be in the city on a Friday.',
                    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1500',
                    sections: [
                        {
                            title: "The Religious Significance",
                            content: "The Taj Mahal contains an active mosque located on the western side of the mausoleum. Every Friday, the monument is reserved for local Muslims to offer 'Jumma' (Friday prayers). This tradition has been maintained for centuries to honor the monument's heritage as a sacred site."
                        },
                        {
                            title: "Sites That Remain OPEN on Friday",
                            content: "If you are in Agra on a Friday, you can still visit almost every other major site. These monuments operate normally:\n*   Agra Fort (Red Fort)\n*   Fatehpur Sikri\n*   Itmad-ud-Daula (Baby Taj)\n*   Akbar's Tomb at Sikandra\n*   Mehtab Bagh"
                        },
                        {
                            title: "The Friday Strategy: Mehtab Bagh",
                            content: "While you cannot enter the Taj Mahal on Friday, you can still see it. Go to **Mehtab Bagh** between 5:00 PM and 6:30 PM. From this garden across the river, you get a full, unobstructed view of the Taj Mahal without the crowds. It is the best 'hack' for Friday visitors."
                        }
                    ]
                };

            case 'agra-travel-guide-2026':
                return {
                    title: 'Agra Travel Guide 2026: History, Safety, Food & Culture',
                    description: 'The master resource for Agra. Detailed logistics on how to reach, where to stay, what to eat, and how to avoid tourist pitfalls in the Mughal capital.',
                    heroImage: 'https://images.unsplash.com/photo-1585435421671-0c1676763909?auto=format&fit=crop&q=80&w=1500',
                    sections: [
                        {
                            title: "History: The Mughal Legacy",
                            content: "Agra served as the capital of the Mughal Empire under Akbar, Jahangir, and Shah Jahan. It was the center of arts, commerce, and learning. Most of the monuments you see today were built between 1550 and 1650. Understanding the rivalry between Aurangzeb and his father Shah Jahan adds immersion to your visit to Agra Fort, where the latter was eventually imprisoned."
                        },
                        {
                            title: "Transportation: Reaching & Navigating Agra",
                            content: "**From Delhi:** The Gatimaan Express (1h 40m) is the fastest train. The Yamuna Expressway is the road option (3.5h). \n**Within Agra:** Use e-rickshaws for short monument hops. For a day-long tour, hire a private app-based taxi (Uber/Ola) or a per-day driver. Avoid the 'cycle rickshaws' for long distances as they are slow and often lead to commission-based shops."
                        },
                        {
                            title: "District Overview: Where to Stay",
                            content: "*   **Tajganj (South Gate):** Ideal for budget travelers and sunrise hunters. Walkable to the Taj.\n*   **Fatehabad Road:** The modern hub. Home to high-end hotels like ITC Mughal and The Oberoi Amarvilas. Best for reliable dining and nightlife.\n*   **Sanjay Place:** The commercial center. Good for business travelers but far from monuments."
                        },
                        {
                            title: "Local Customs & Etiquette",
                            content: "Agra is a traditional city. Cover shoulders and knees when visiting tombs or mosques. Remove footwear before entering any sanctum. Tips (Bakshish) of ₹50-₹100 are standard for small services. Photography is allowed everywhere except inside the main dome of the Taj Mahal; respect this rule to avoid being escorted out by security."
                        },
                        {
                            title: "Safety: Real Advice on Scams",
                            content: "Agra is notorious for 'Touts' (Lapkas). They will often tell you a road is closed or a monument is free entry to lead you to a jewelry store. **Always buy tickets yourself online.** Never accept a 'free guide' from the street. Verified local guides carry an ASI or Ministry of Tourism ID card. Verify this before starting any tour."
                        },
                        {
                            title: "Agra Petha: The City's Gift",
                            content: "A translucent soft candy made from ash gourd. The 'Dry Petha' and 'Saffron Petha' are the original variants. Avoid buying bulk boxes from stores labeled only as 'Petha Shop'. Look for the legitimate **Panchhi Petha** brand, which has only a few authorized outlets in the city."
                        }
                    ],
                    faqs: [
                        { q: "Is Agra safe for solo female travelers?", a: "Yes, provided you stick to main monument areas and avoid walking alone in poorly lit backstreets of Old Agra after 9 PM. Always use app-based transport." },
                        { q: "Can I do a day trip from Delhi?", a: "Yes, thousands do it daily via the Gatimaan Express. However, staying one night allows you to see the Taj at sunrise, which is worth the extra time." }
                    ]
                };

            default:
                return null;
        }
    };

    const data = getContent();

    if (!data) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
                <div>
                    <h1 className="text-2xl font-black text-[#001A33] mb-4">Content Not Identified</h1>
                    <button onClick={handleBack} className="text-[#10B981] font-bold">Back to Search</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>{data.title} | AsiaByLocals Official Guide</title>
                <meta name="description" content={data.description} />
            </Helmet>

            {/* Hero Section */}
            <div className="relative h-[45vh] md:h-[65vh] overflow-hidden">
                <img
                    src={data.heroImage}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001A33] via-[#001A33]/30 to-transparent"></div>

                {/* Navigation Overlays */}
                <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
                    <button
                        onClick={handleBack}
                        className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="px-4 py-2 bg-[#10B981] rounded-full text-white text-[12px] font-black uppercase tracking-widest">
                            Agra 2026 Authority
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-0 right-0 px-6 max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                        {data.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-white/90">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                            <Clock size={18} className="text-[#10B981]" />
                            <span className="text-[14px] font-bold">15 Min Read</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                            <ShieldCheck size={18} className="text-[#10B981]" />
                            <span className="text-[14px] font-bold">Verified by Local Guides</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Content Column */}
                    <div className="flex-1">
                        {/* Lead Paragraph */}
                        <div className="mb-16">
                            <p className="text-2xl text-gray-600 font-semibold leading-relaxed border-l-4 border-[#10B981] pl-8">
                                {data.description}
                            </p>
                        </div>

                        {/* Content Body */}
                        <div className="space-y-24">
                            {data.sections.map((section, index) => (
                                <article key={index} className="group">
                                    <header className="mb-8">
                                        <span className="text-[#10B981] text-sm font-black uppercase tracking-widest mb-2 block">Chapter 0{index + 1}</span>
                                        <h2 className="text-3xl md:text-4xl font-black text-[#001A33] group-hover:text-[#10B981] transition-colors">
                                            {section.title}
                                        </h2>
                                    </header>
                                    <div className="text-[18px] text-gray-700 leading-relaxed font-medium space-y-6">
                                        {section.content.split('\n').map((para, pIdx) => (
                                            <p key={pIdx}>{para}</p>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>

                        {/* Bottom CTA */}
                        <section className="mt-32 p-1 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-[40px]">
                            <div className="bg-[#001A33] rounded-[38px] p-10 md:p-16 text-white text-center">
                                <h2 className="text-4xl md:text-5xl font-black mb-6">Don't visit as a spectator.</h2>
                                <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto font-medium">
                                    Agra's history is written in stone, but its stories are told by people. Book a licensed local guide today.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <button
                                        onClick={() => window.location.href = `/${country.toLowerCase()}/${city.toLowerCase()}`}
                                        className="w-full sm:w-auto px-10 py-5 bg-[#10B981] text-white font-black rounded-full hover:bg-[#059669] transition-all flex items-center justify-center gap-3 text-lg"
                                    >
                                        View Agra Tours
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* FAQs */}
                        {data.faqs && (
                            <section className="mt-32">
                                <h2 className="text-4xl font-black text-[#001A33] mb-12">Essential Intelligence</h2>
                                <div className="space-y-6">
                                    {data.faqs.map((faq, index) => (
                                        <div key={index} className="bg-gray-50 border border-gray-100 rounded-3xl p-8 transition-all hover:border-[#10B981]/30">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-[#10B981]/10 p-3 rounded-2xl">
                                                    <Info size={24} className="text-[#10B981]" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-[#001A33] mb-4">{faq.q}</h3>
                                                    <p className="text-gray-600 text-lg leading-relaxed font-medium">{faq.a}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-[400px] shrink-0">
                        <div className="sticky top-32 space-y-10">
                            {/* Pillar Nav */}
                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                <h4 className="text-xl font-black text-[#001A33] mb-6">Agra Authority Hub</h4>
                                <div className="space-y-3">
                                    {[
                                        { name: '15 Best Things to Do', slug: 'things-to-do-in-agra' },
                                        { name: 'Detailed Places Guide', slug: 'places-to-visit-in-agra' },
                                        { name: 'High-Efficiency Itinerary', slug: '1-day-agra-itinerary' },
                                        { name: 'Ticket Prices 2026', slug: 'taj-mahal-ticket-price-2026' },
                                        { name: 'Opening Times', slug: 'taj-mahal-opening-time' },
                                        { name: 'Friday Closure Hack', slug: 'is-taj-mahal-closed-on-friday' },
                                        { name: 'Master Travel Guide', slug: 'agra-travel-guide-2026' }
                                    ].map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={`/india/agra/${item.slug}`}
                                            className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${slug === item.slug
                                                    ? 'bg-[#10B981] text-white shadow-lg'
                                                    : 'bg-gray-50 hover:bg-[#10B981]/5 text-[#001A33]'
                                                }`}
                                        >
                                            <span className="font-bold">{item.name}</span>
                                            <ChevronRight size={18} className={`transition-transform group-hover:translate-x-1 ${slug === item.slug ? 'text-white' : 'text-gray-300'
                                                }`} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Contact Widget */}
                            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                        <History size={24} className="text-[#10B981]" />
                                    </div>
                                    <h4 className="font-black text-[#001A33]">Heritage Support</h4>
                                </div>
                                <p className="text-gray-600 font-medium text-sm leading-relaxed mb-6">
                                    Confused about logistics? Our local support team can help you orchestrate your perfect Agra experience.
                                </p>
                                <button className="w-full py-4 bg-[#001A33] text-white font-black rounded-2xl hover:bg-black transition-all">
                                    Contact Local Expert
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default CityInfoPage;
