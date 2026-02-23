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
    Building,
    Sunrise,
    Sun,
    Sunset,
    Moon,
    Plane,
    Train,
    Map,
    Wallet
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface CityInfoPageProps {
    country: string;
    city: string;
    slug: string;
}

interface CityInfoData {
    title: string;
    description: string;
    heroImage: string;
    sections: any[];
    faqs?: { q: string; a: string }[];
    jsonLd?: any;
    fastFacts?: { icon: string; label: string; value: string }[];
}

const CityInfoPage: React.FC<CityInfoPageProps> = ({ country, city, slug }) => {
    const handleBack = () => {
        window.history.back();
    };

    const getContent = (): CityInfoData | null => {
        switch (slug) {
            case "things-to-do-in-agra":
                return {
                    title: "The Ultimate Guide: In-Depth Exploration of Agra (2026 Edition)",
                    description: "Agra is much more than just the Taj Mahal. Discover the most comprehensive, 3000+ word guide to exploring Agra’s hidden Mughal monuments, authentic street food alleys, bustling bazaars, and unforgettable sunrise viewpoints that most tourists miss.",
                    heroImage: "/blog/things-to-do-agra-hero.jpg",
                    sections: [
                        {
                            "title": "1. Witness the Ultimate Sunrise at the Taj Mahal",
                            "content": "Seeing the Taj Mahal at sunrise is not just a tourist cliché; it is an absolute architectural and photographic necessity. Built by Mughal Emperor Shah Jahan in memory of his beloved wife Mumtaz Mahal, this monument of white Makrana marble reacts dynamically to light. At the break of dawn, the marble absorbs the early morning rays, casting a soft, translucent pink hue that slowly transforms into a blinding, crisp white as the sun rises higher.\n\nTo achieve this, you must set your alarm for 4:30 AM. Arrive at the East Gate (Shilpgram) or the West Gate by 5:15 AM to be among the first in line. Be aware that the security check is rigorous. To expedite your entry, strictly avoid carrying large backpacks, power banks, tobacco products, food, tripods, or books. Carry only your phone, camera, water bottle, and your [pre-booked digital ticket](/india/agra/taj-mahal-ticket-price-2026), which you should download offline, as cellular networks are often jammed near the entrance.\n\nOnce through the gates, resist the urge to stop at the massive red sandstone Darwaza-i-Rauza (Main Gateway) for too long. Walk purposefully to the central reflection pool—famously known as the Diana Bench—to capture the iconic symmetrical shot before the crowds assemble. Afterward, take your time walking around the massive plinth, admiring the intricate Pietra Dura (stone inlay) work featuring semi-precious stones like lapis lazuli, jade, and crystal embedded into the marble. Allow yourself at least two to three hours to truly absorb the majesty of this UNESCO World Heritage Site.",
                            "image": "/blog/taj-sunrise.jpg"
                        },
                        {
                            "title": "2. Explore the Imperial Grandeur of Agra Fort",
                            image: "/blog/agra-fort.jpg",
                            "content": "Agra Fort, a UNESCO World Heritage site, is a testament to the power and administrative brilliance of the Mughal Empire. Spanning 94 acres, this red sandstone fortress was the primary residence of the emperors until 1638. Inside, you will find a maze of palaces, mosques, and audience halls. Don't miss the Musamman Burj, the octagonal tower where Shah Jahan spent his final years in captivity, gazing at the Taj Mahal. The Jahangir Palace and the Diwan-i-Khas are equally stunning, showcasing the evolution of Mughal design from robust sandstone to delicate white marble inlays."
                        },
                        {
                            "title": "3. The Spiritual Heart: Jama Masjid & The Spice Markets",
                            image: "/blog/jama-masjid.jpg",
                            "content": "Located in the heart of the old city, the Jama Masjid is one of the largest mosques in India, built by Jahanara Begum, the daughter of Shah Jahan. Its massive red sandstone domes and marble minarets overlook the chaotic but fascinating Kinari Bazaar. Entering the 'Chilli Market' or 'Spice Market' nearby is a sensory overload—the air is thick with the scent of roasted cumin, turmeric, and dry chillies. This is where the descendants of the empire’s merchants still trade using methods that have remained unchanged for 400 years."
                        },
                        {
                            "title": "4. Chini-ka-Rauza: The Persian Tiled Masterpiece",
                            image: "/blog/chini-ka-rauza.jpg",
                            "content": "Often missed by 99% of tourists, Chini-ka-Rauza is a hidden gem on the eastern bank of the Yamuna. It is the tomb of Afzal Khan Shirazi, a poet and scholar who served as the Prime Minister to Shah Jahan. What makes this monument unique is its glazed tile work—an art form known as 'Kashi' or 'Chini.' While the exterior tiles have weathered over time, the vibrant blues, greens, and yellows that remain give a rare glimpse into the pure Persian aesthetics that influenced later Mughal architecture."
                        }
                    ],
                    faqs: [
                        {
                            "q": "How many days should I realistically spend in Agra?",
                            "a": "To truly experience the items on this list, you need 3 days and 2 nights. Most tourists only do a [1-day trip](/india/agra/1-day-agra-itinerary), which means they only see the Taj Mahal and Agra Fort. A 3-day itinerary allows you to explore the local food, the ghost city of Fatehpur Sikri, and the peaceful gardens without severe fatigue."
                        },
                        {
                            "q": "Are female guides available for Taj Mahal tours?",
                            "a": "Yes, licensed female historian guides are available and highly recommended, especially for groups interested in the history of the Mughal women and the Zenana politics."
                        }
                    ],
                    jsonLd: {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "The Ultimate Guide: In-Depth Exploration of Agra (2026 Edition)",
                        "description": "Agra is much more than just the Taj Mahal. Discover the most comprehensive, 3000+ word guide to exploring Agra’s hidden Mughal monuments, authentic street food alleys, bustling bazaars, and unforgettable sunrise viewpoints that most tourists miss.",
                        "author": { "@type": "Organization", "name": "AsiaByLocals" }
                    },
                    fastFacts: [
                        { icon: 'Ticket', label: 'Ticket Info', value: 'Digital Pre-Booking Required' },
                        { icon: 'Map', label: 'Best Strategy', value: 'Multi-Site Entry Pass' },
                        { icon: 'Star', label: 'Expert Tip', value: 'Hire a Female Historian' }
                    ]
                };

            case 'places-to-visit-in-agra':
                return {
                    title: 'Strategic Places to Visit in Agra: A Deep-Dive Directory (2026)',
                    description: 'Explore the definitive list of historical sites in Agra. This guide goes beyond the surface, offering architectural nuance, historical context, and tactical advice for visiting the city’s crown jewels during the 2026 season.',
                    heroImage: '/blog/places-hero.jpg',
                    sections: [
                        {
                            title: "The Taj Mahal – A Masterpiece of Emotional Architecture",
                            image: "/blog/taj-places.jpg",
                            content: "No exploration of Agra—or indeed India—can begin anywhere other than the Taj Mahal. Commissioned in 1632 by the Mughal Emperor Shah Jahan to house the tomb of his favorite wife, Mumtaz Mahal, this monument stands as the world's most recognizable symbol of love. Spanning approximately 42 acres, the complex is a triumph of Persian 'Charbagh' (four-part garden) design, intended to represent the gardens of paradise described in Islamic texts. The architectural layout is governed by strict, mathematically precise symmetry. Every minaret, archway, and floral motif has a mirrored counterpart, creating a sense of visual harmony that is almost hypnotic. \n\n**Architectural Highlights:** \n- **The White Makrana Marble:** Sourced from Rajasthan, the marble appears to change its hue with the shifting light of the sun—soft pink at dawn, brilliant white at noon, and a translucent cream under a full moon. \n- **The Pietra Dura Inlay:** Look closely at the walls to see thousands of semi-precious stones (like jasper, lapis lazuli, and turquoise) embedded into the marble. This technique, known locally as 'Parchin Kari,' remains one of the most difficult stone-crafting arts in the world. \n- **The Calligraphy:** The exterior is adorned with verses from the Quran, expertly scaled so that letters at the top appear the same size as those at eye level. \n\n**Strategic Tip:** Visit the museum on the west side of the complex to see original blueprints and tools used by the 20,000 artisans who built this wonder. This provides a deep appreciation for the human effort behind the marble facade."
                        },
                        {
                            title: "Agra Fort – The Crimson Epicenter of Empire",
                            image: "/blog/fort-places.jpg",
                            content: "Located just 2.5 kilometers from its more famous neighbor, Agra Fort is the tactical and political sibling to the Taj. While the Taj represents love and grief, the Fort represents imperial might and administrative brilliance. Originally a brick fort known as Badalgarh, it was transformed by Emperor Akbar the Great in 1565 using massive slabs of red sandstone. \n\nThis 94-acre complex functioned as the main residence of the Mughal emperors until 1638. It is less a single building and more a 'fortified city' within a city. \n\n**Zones of Significance:** \n- **Jahangir’s Palace:** A stunning fusion of Hindu and Islamic styles, featuring massive stone brackets and intricate carvings. \n- **Khas Mahal:** A serene white marble palace overlooking the river, showing the shift in Mughal taste from red sandstone to white marble. \n- **Musamman Burj:** This octagonal tower is where Shah Jahan spent his final eight years in captivity, gazing at the Taj Mahal across the river during his house arrest. \n- **Diwan-i-Aam:** The Hall of Public Audience, where the emperor would hear the grievances of his subjects while seated on a throne embedded with precious stones. \n\n**Strategic Tip:** Allow at least 2.5 hours to explore the fort. The distance between the different palaces and halls is substantial, and each section offers a different perspective on Mughal royal life."
                        },
                        {
                            title: "Tomb of Itimad-ud-Daula – The Architectural Blueprint",
                            image: "/blog/itmad-places.jpg",
                            content: "Often overshadowed by the sheer scale of and fame of the Taj Mahal, the Tomb of Itimad-ud-Daula is architecturally significant as the 'precursor' or 'draft' of the Taj. It was built between 1622 and 1628 by Empress Nur Jahan for her father, Mirza Ghiyas Beg. \n\nThis monument marks a critical transition in Mughal architecture. It was the first tomb in India to be built entirely of white marble and the first to use the extensive 'Pietra Dura' inlay work that would later become the defining feature of the Taj Mahal. \n\n**What to Observe:** \n- **Delicate Scale:** Unlike the grandiosity of the Taj, this tomb feels intimate and jewel-like, allowing for a closer look at the craftsmanship. \n- **Inlay Variety:** The geometric and floral patterns here are even more densely packed than those on the Taj, featuring unique motifs like wine carafes and cypress trees. \n- **Riverside Setting:** Situated on the eastern bank of the Yamuna, the gardens here are quieter and provide a serene atmosphere for those wanting to escape the heavy tourist traffic of central Agra. \n\n**Strategic Tip:** This is widely considered the best spot in Agra for close-up photography of Mughal tile-work and stone-carving without being jostled by crowds. It offers a much more relaxed experience than the larger monuments."
                        },
                        {
                            title: "Fatehpur Sikri – The Deserted Masterpiece",
                            image: "/blog/fatehpur-sikri.jpg",
                            content: "Located roughly 40 kilometers from the city center, Fatehpur Sikri is a ghost city with a history as grand as its architecture. Built by Emperor Akbar in the late 16th century to serve as his capital, it was abandoned only 14 years later due to a severe water crisis. \n\nWalking through its silent corridors today feels like stepping into a perfectly preserved 16th-century time capsule. \n\n**Architectural Highlights:** \n- **Buland Darwaza:** At 54 meters high, this 'Gate of Victory' is one of the tallest gateways in the world, built to commemorate Akbar's victory over Gujarat. \n- **Tomb of Salim Chishti:** A white marble shrine in the center of a red sandstone courtyard. It is an active site of pilgrimage where people of all faiths tie red threads on the marble screens (jalis) while making a wish. \n- **The Panch Mahal:** A five-story, open-pavilion structure that was used by the royal ladies for recreation and to enjoy the evening breeze. \n\n**Strategic Tip:** Hiring a reputable guide here is essential, as the history of the different wings—for his Hindu, Christian, and Muslim wives—is complex and reveals Akbar's unique approach to religious pluralism."
                        },
                        {
                            title: "Mehtab Bagh – The Sunset Reflection",
                            image: "/blog/mehtab-bagh.jpg",
                            content: "Mehtab Bagh, or the 'Moonlight Garden,' is the final piece of the Taj Mahal's architectural puzzle. Located directly across the Yamuna River, it is perfectly aligned with the Taj’s central axis. Initially built by Emperor Babur, it was restored by later emperors to serve as a viewing platform. \n\nIt is from this garden that the most iconic landscape shots of the Taj Mahal reaching toward the sky are taken, especially as the river provides a perfect foreground for long-exposure photography. \n\n**Why Visit:** \n- **Friday Hack:** Since the [Taj Mahal is closed on Fridays](/india/agra/is-taj-mahal-closed-on-friday), Mehtab Bagh is the best place to see the monument in its full glory without any tourists in your frame. \n- **Golden Hour:** As the sun sets, the Taj begins to glow with an orange-gold hue, and you can see its reflection shimmer in the river waters. \n- **Botanical Detail:** The garden is slowly being restored with the original plant species mentioned in Mughal texts, including hibiscus, citrus trees, and roses. \n\n**Strategic Tip:** Reach here at least 1 hour before sunset to find a quiet corner and enjoy the transformation of the monument's colors as the light shifts from gold to deep sapphire."
                        }
                    ],
                    faqs: [
                        { q: "What is the best order to visit these monuments?", a: "To optimize your lighting and avoid the worst crowds, we recommend the 'Sunrise-First' strategy. Start at the Taj Mahal at dawn (06:00 AM), move to the Agra Fort by 09:30 AM before the heat builds, and save the riverside sites like the Baby Taj and Mehtab Bagh for the late afternoon." },
                        { q: "Are these sites open every day?", a: "Most monuments are open from sunrise to sunset daily. However, the Taj Mahal is strictly CLOSED every Friday for regular tourists. No exceptions are made for national holidays or festivals." },
                        { q: "Can I walk between these places?", a: "Walking is not recommended for the main circuit. While the Taj and some markets are near each other, the distance between the Taj and Agra Fort is 2.5km, and the Baby Taj is on the opposite side of the river. Use app-based taxis (Uber) or e-rickshaws for efficiency." },
                        { q: "Do I need separate tickets for each site?", a: "Yes. Every monument requires its own entrance fee. As of 2026, most ticket sales have transitioned to digital-only formats. You can scan the ASI QR codes at each gate or pre-book through the official government portal." }
                    ],
                    jsonLd: {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Strategic Places to Visit in Agra: A Deep-Dive Directory (2026)",
                        "author": { "@type": "Organization", "name": "AsiaByLocals" }
                    },
                    fastFacts: [
                        { icon: 'Ticket', label: 'Ticket Plan', value: 'Book Taj & Fort Together' },
                        { icon: 'Map', label: 'Pro Route', value: 'East Bank Secret Path' },
                        { icon: 'Clock', label: 'Total Time', value: '48-72 Hours Core Path' }
                    ]
                };

            case '1-day-agra-itinerary':
                return {
                    title: '1-Day Agra Itinerary (2026): A Precision Tactical Plan',
                    description: 'Traveling to Agra for just 24 hours requires a carefully calibrated strategy. This 1-day guide is designed for high-efficiency explorers who want to see the Taj Mahal, Agra Fort, and local secrets without feeling rushed or overwhelmed by crowds. By optimizing your transport and timing, you can witness the emotional heart of the Mughal Empire in a single, powerful day.',
                    heroImage: '/blog/itinerary-hero.jpg',
                    sections: [
                        {
                            title: "The Sunrise Mission (05:30 AM – 09:30 AM)",
                            content: "Your day begins long before the sun rises. To truly experience the Taj Mahal, you must be in the queue at least 45 minutes before the gates open (around sunrise). Morning light transforms the white marble into soft shades of pink and gold, offering a tranquility that disappears by mid-morning. \n\n**Why the early start matters:** \n- **The Atmosphere:** The morning air is crisp and the distant morning calls to prayer provide a hauntingly beautiful backdrop to the sight of the white marble monument emerging from the mist. \n- **Photography:** Once the gates open, move efficiently to the central reflecting pool for the 'classic' shot before the crowds build. \n- **Temperature:** During the summer months, the marble remains cool underfoot until about 10:00 AM, making for a much more comfortable walk. \n\n**Expert Advice:** Use the East Gate entry. It is typically less crowded than the West Gate, which usually serves the large tour buses coming from the city center. Plan to spend about 2.5 hours total exploring the mausoleum and the surrounding gardens."
                        },
                        {
                            title: "Imperial Power at Agra Fort (10:00 AM – 12:30 PM)",
                            content: "After a quick breakfast, head 2.5 kilometers to the Agra Fort. This is the heavy-weight of Mughal architecture—a fortified city of red sandstone that held the empire's treasure, armory, and royalty for generations. Unlike the Taj, which is a quiet tomb, the Fort is a series of monumental palaces designed to impress and intimidate. \n\n**Must-See Highlights:** \n- **The Diwan-i-Khas:** Imagine the world's most powerful ambassadors waiting for an audience here under the gaze of the Emperor. \n- **The Musamman Burj:** Stand where Shah Jahan was imprisoned by his own son. From this balcony, you can capture a perfectly framed shot of the Taj Mahal in the distance—the same view the emperor lived with during his final years of captivity. \n\nAllow at least 2.5 hours here to appreciate the shift from red sandstone structures to the elegant marble additions made by later emperors."
                        },
                        {
                            title: "Midday Pause & Local Flavors (12:45 PM – 2:00 PM)",
                            content: "Escape the midday heat with a long lunch at a rooftop restaurant near the Taj East Gate Road. Many of these cafes are designed with 'Taj Views' in mind, allowing you to appreciate the landmark from a distance while you rest. \n\n**What to order:** \n- **Agra Petha:** The world-famous dried sweet made from ash gourd—try the saffron or pistachio flavors for an authentic taste of the city. \n- **Mughlai Thali:** A massive platter of butter chicken, dal makhani, and freshly baked garlic naans, reflecting the rich culinary heritage of the Mughal courts. \n- **Bedai & Jalebi:** If you're feeling adventurous and want to eat like a local, this spicy-sweet combination is the classic Agra choice. \n\n**Survival Tip:** Use this time to recharge your devices and hydrate extensively before the afternoon leg of the journey."
                        },
                        {
                            title: "The White Marble Transition (02:15 PM – 04:00 PM)",
                            content: "Cross the Yamuna River to visit the Tomb of Itimad-ud-Daula (The Baby Taj). This is often considered the 'sleeper hit' of Agra. It is architecturally sophisticated and significantly quieter than the previous two sites, offering a space for reflection. \n\n**Why it's in the 1-day plan:** \nIt provides essential historical context. This tomb was built only a few years before the Taj Mahal and shows the crucial transition in Mughal taste from red sandstone toward white marble. The inlay work here is arguably more intricate and colorful than the Taj itself. It takes about 60-75 minutes to explore the internal chambers and the quiet riverside gardens."
                        },
                        {
                            title: "The Sunset Perspective (04:30 PM – 06:00 PM)",
                            content: "Finish your sightseeing at Mehtab Bagh across the river. While thousands of people are currently crammed inside the Taj Mahal complex for sunset, you will be on the opposite bank with a wide-angle view of the entire structure. \n\nAs the sun dips behind the horizon, the white marble turns a deep orange and then a soft sapphire. It is the most peaceful way to say goodbye to the monument. This garden is also the best place for long-exposure photography, as you can use the river as a reflecting mirror for the monument's silhouette."
                        },
                        {
                            title: "Logistics & High-Efficiency Gear",
                            content: "**Transportation:** Do not attempt to walk between monuments. Hire an auto-rickshaw for the full 'circuit' (approx ₹800-₹1200 for the day) or use Uber for air-conditioned comfort. A private driver for the day is the most expensive but most reliable option. \n\n**Survival Pack:** \n- **Water:** Carry at least 2 liters. Dehydration is a common issue for travelers in Agra's dry heat. \n- **Footwear:** Wear shoes that are easy to slip on and off. You will need to remove your shoes to enter the inner sanctums of tombs and mosques. \n- **ID:** Keep your passport on you. Guards often check IDs at the foreigners' skip-the-line entrance to ensure the ticket matches the holder."
                        }
                    ],
                    faqs: [
                        { q: "Is 1 day honestly enough for Agra?", a: "Yes, it is enough to see the 'Big Three' (Taj, Fort, Baby Taj) and catch a sunset at Mehtab Bagh. However, you will be on your feet for 10-12 hours. If you want a relaxed pace and a trip to Fatehpur Sikri, we highly recommend extending your stay to 2 days." },
                        { q: "What is the best order to visit Taj and Fort?", a: "Always Taj Mahal first at sunrise. The physical and emotional experience of the Taj at 06:00 AM compared to 11:00 AM is night and day. Once the heat kicks in, the shade of the Fort's massive stone corridors is more welcome." },
                        { q: "Is it possible to do a day trip from Delhi?", a: "Absolutely. Take the Gatimaan Express (08:10 AM departure) and return by evening. If you use the Yamuna Expressway by car, leave Delhi by 05:00 AM to maximize your time at the monuments." }
                    ],
                    jsonLd: {
                        "@context": "https://schema.org",
                        "@type": "HowTo",
                        "name": "1-Day Agra Itinerary",
                        "step": [
                            { "@type": "HowToStep", "text": "Sunrise at Taj Mahal" },
                            { "@type": "HowToStep", "text": "Morning at Agra Fort" },
                            { "@type": "HowToStep", "text": "Sunset at Mehtab Bagh" }
                        ]
                    },
                    fastFacts: [
                        { icon: 'Clock', label: 'Wake Up Call', value: '05:15 AM Sunrise Entry' },
                        { icon: 'Map', label: 'Must-See Hub', value: 'Agra Fort & Taj Hub' },
                        { icon: 'AlertTriangle', label: 'Fog Alert', value: 'Visibility Check (Jan-Feb)' }
                    ]
                };

            case 'taj-mahal-ticket-price-2026':
                return {
                    title: 'Taj Mahal Ticket Price 2026: Official Fees, Categories & Digital Rules',
                    description: 'Planning a visit in 2026 requires understanding the new digital-only ticketing policy and updated fee structures for international and domestic travelers. This guide provides the complete price breakdown and how to avoid overpaying for your entry.',
                    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1500',
                    sections: [
                        {
                            title: "Official 2026 Entry Fee Structure",
                            content: "**As of 2026, the official Taj Mahal ticket price is ₹1,300 for foreign tourists and ₹250 for Indian citizens, including the mandatory main mausoleum supplement.** \n\nThe Archaeological Survey of India (ASI) has streamlined pricing for the 2026 season to manage the massive influx of tourists while funding the ongoing conservation of the white marble. Tickets are strictly divided into entry categories based on nationality and age. If you are planning a [1-day itinerary](/india/agra/1-day-agra-itinerary), ensure you book your slots at least 48 hours in advance. \n\n**Foreign Tourists (Non-SAARC):** \n- ₹1,100 (Monument Entry) + ₹200 (Main Mausoleum Supplement) = **₹1,300 Total** \n- High-Value Ticket benefits include a separate, prioritized queue for entry and security screening, which is essential during peak hours. \n\n**SAARC & BIMSTEC Citizens:** \n- ₹540 (Entry) + ₹200 (Mausoleum) = **₹740 Total** \n- This applies to citizens of Afghanistan, Bangladesh, Bhutan, Maldives, Nepal, Pakistan, Sri Lanka, Thailand, and Myanmar. A valid national passport is required for verification. \n\n**Indian Citizens:** \n- ₹50 (Entry) + ₹200 (Mausoleum) = **₹250 Total** \n\n**Children (All Nationalities):** \n- Children under 15 years of age are permitted **FREE** entry. However, parents must still register them in the online booking portal to receive a zero-value QR code for security tracking at the gate."
                        },
                        {
                            title: "The Main Mausoleum Supplement (₹200 Explained)",
                            content: "One of the most persistent points of confusion for travelers is the 'Double Ticket' system. The basic entry ticket allows you to explore the gardens, the mosque, and the peripheral red sandstone buildings. However, to actually step onto the raised marble platform and enter the inner sanctum containing the cenotaphs of Shah Jahan and Mumtaz Mahal, you must pay an additional ₹200 supplement. \n\n**Is it worth it?** \nWhile the exterior view is the most famous, the interior offers incredible acoustics, the famous marble screens (jalis), and the emotional center of the monument. We recommend 95% of first-time visitors pay for the full experience. If you are on a very tight budget or have visited before, the gardens still offer the best photographic opportunities. \n\n**Note:** This supplement price is uniform for all adults regardless of nationality."
                        },
                        {
                            title: "Digital-Only Policy & Payment Tactics",
                            content: "As of 2026, **no cash transactions are permitted** at the physical monument ticket windows. The Archaeological Survey of India has moved 100% to a paperless, digital ticketing infrastructure to improve data tracking and reduce fiscal leakage. \n\n**How to purchase your ticket:** \n- **Official Portal:** Use the ASI online ticketing website via your smartphone browser. \n- **QR Code at Gate:** Large QR code boards are located at the entrance. Scan these to be taken directly to the checkout page. \n- **Payment Methods:** UPI is the fastest method for anyone with an Indian bank account. International visitors can use Visa or Mastercard, but ensure you have 'International Usage' enabled with your bank before arriving at the gate. \n\n**Pro-Tip:** Don't wait until you reach the gate to book. Cellular data speeds can drop significantly near the monument due to the density of active users. Book while you are at your hotel during breakfast for a stress-free entry."
                        },
                        {
                            title: "Included Amenities & Supplementary Costs",
                            content: "Your 'High-Value' (Foreigner) ticket is more than just an entry pass. It is a bundled service package designed to provide a more comfortable experience. Upon arrival, proceed to the foreigner-specific amenities counter to collect: \n- **Water Bottle (500ml):** A necessary item for the 2-hour walk. \n- **Disposable Shoe Covers:** These are mandatory for walking on the white marble platform to prevent abrasion and staining. \n- **Agra Tourist Map:** A basic directional guide to the monument's layout. \n\n**Optional Extras to Budget For:** \n- **Electric Golf Carts:** These operate from the parking lots to the main gates (Approx ₹20-50). They are highly recommended if you are visiting during the peak heat of midday. \n- **Authorized Guides:** Only employ guides who carry a valid ASI-issued identification card. Standard rates for a 2-hour private tour generally range from ₹1,000 to ₹2,000 depending on the group size and the guide's experience."
                        },
                        {
                            title: "Operational Rules & Gate Validity",
                            content: "1. **Gate Specificity:** Your ticket is tied to the specific gate you selected during booking (East or West). You cannot enter through the West Gate if you purchased an East Gate ticket. \n2. **Time-Slotted Entry:** Tickets are now valid for specific 3-hour windows. If you arrive after your slot has expired, you may be denied entry. \n3. **Single Entry Only:** The Taj Mahal maintains a strict single-entry policy. Once you scan your QR code and exit the turnstiles, your ticket becomes void. Re-entry for lunch or rest is not allowed. \n4. **Restricted Items:** Avoid bringing large backpacks, tripods, cigarette lighters, or any food items. There are no safe locker facilities for these items at the gate; you will be asked to return to your vehicle or hotel to deposit them."
                        }
                    ],
                    faqs: [
                        { q: "Can I buy Taj Mahal tickets with cash at the gate?", a: "No. Since the 2026 digital transition, all physical ticket windows have ceased cash operations. You must purchase tickets online through the official ASI portal or scan the QR codes provided at the monuments." },
                        { q: "Is the main tomb entry included in the standard foreigner ticket?", a: "Not automatically. You must specifically select the 'Mausoleum' add-on (₹200) during the checkout process if you wish to climb the marble platform and see the royal cenotaphs." },
                        { q: "Are children under 15 years old really free?", a: "Yes, for all nationalities. However, they must still have a valid zero-value ticket booked through the online portal, and you may be asked to show a passport copy if the child appears to be near the age limit." },
                        { q: "Do SAARC citizens need to show their passport?", a: "Yes. To avail of the discounted SAARC rate (₹540 + supplement), you must present an original passport from a member nation at the security check. National IDs or drivers' licenses are often rejected." }
                    ],
                    jsonLd: {
                        "@context": "https://schema.org",
                        "@type": "PriceSpecification",
                        "price": "1300",
                        "priceCurrency": "INR",
                        "description": "Official Taj Mahal entry fee for foreign tourists 2026"
                    },
                    fastFacts: [
                        { icon: 'Wallet', label: 'Total Fee', value: '₹1,300 (Foreigners)' },
                        { icon: 'Ticket', label: 'Main Tomb', value: '₹200 Supplement' },
                        { icon: 'CheckCircle2', label: 'Payment Method', value: 'UPI & Card Only' }
                    ]
                };

            case 'taj-mahal-opening-time':
                return {
                    title: 'Taj Mahal Opening & Closing Time (2026): The Definitive Timing Guide',
                    description: 'Knowing the exact opening and closing times for the Taj Mahal can make the difference between a once-in-a-lifetime sunrise experience and standing in a three-hour queue in the heat. This 2026 guide covers seasonal variations, Friday closures, and tactical advice for every visiting window.',
                    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1500',
                    sections: [
                        {
                            title: "The Standard Operational Window (2026)",
                            content: "The Archaeological Survey of India (ASI) manages the Taj Mahal's timings based on the solar cycle. While generally advertised as 'Sunrise to Sunset,' the operational hours are standardized for 2026 to assist with crowd control and security. \n\n**Official Daily Timings:** \n- **Opening Time:** 06:00 AM (Sharp) \n- **Closing Time:** 06:30 PM (Varies by light) \n- **Last Entry:** Gates typically close to new visitors exactly 30 minutes before the official closing time. \n\n**Important Note:** These timings are strictly enforced. If you are standing in the mausoleum when the closing whistle blows, security will begin ushering all visitors toward the exits immediately."
                        },
                        {
                            title: "Seasonal Adjustments: Winter vs. Summer",
                            content: "Agra's weather and daytime light vary significantly throughout the year, impacting the 'feel' of the monument at different times. \n\n- **Winter Months (December – February):** This is peak season. The gates still open at 06:00 AM, but the sun may not rise until 06:45 AM or later. High-density morning fog is common in January, which can completely obscure the monument until 10:00 AM. If visiting in winter, check the local weather forecast for 'Visibility' metrics before choosing a sunrise slot. \n- **Summer Months (April – June):** Sunrise occurs as early as 05:15 AM. While the gates open at 06:00 AM, the heat rises rapidly. By 11:00 AM, the marble platform can become extremely hot. For summer visits, the 06:00 AM to 09:00 AM window is the only comfortable time for walking. \n- **Monsoon (July – September):** The sky is often dramatic and overcast, providing excellent soft lighting for photography. However, sudden downpours are frequent—carry a compact umbrella."
                        },
                        {
                            title: "The Friday Closure Policy (Absolute Rule)",
                            content: "One of the most frequent travel mistakes is arriving in Agra on a Friday only to find the Taj Mahal gates locked. **The Taj Mahal is closed every Friday to everyone.** \n\n**Why the closure?** \nThere is an active mosque within the complex (on the western side). Fridays are reserved for local residents to offer their congregational Jumma prayers. \n\n**Strategic Alternative:** If your only day in Agra is a Friday, you can still view the monument from Mehtab Bagh across the river or from the rooftop of various hotels. All other major monuments like Agra Fort and the Baby Taj remain open on Fridays."
                        },
                        {
                            title: "Night Viewing Timings (Full Moon Slots)",
                            content: "For a limited number of people, the ASI opens the Taj Mahal for night viewing. This happens for five nights around the full moon—the night of the full moon itself, and two nights before and after. \n\n**Night Timings:** \n- **Hours:** 08:30 PM to 12:30 AM \n- **Duration:** Visitors are allowed in batches of 50 for exactly 30 minutes each. \n- **Booking:** Tickets must be booked 24 hours in advance from the ASI office on Mall Road. Night viewing is highly dependent on weather; if it is cloudy, the moonlit effect is lost. \n\n**Note:** Night viewing is NOT available on Fridays or during the month of Ramadan."
                        },
                        {
                            title: "Strategic Entry Tactics",
                            content: "1. **The East Gate Advantage:** Typically serves the luxury hotels and is generally faster than the West Gate, which handles the mass-market tour buses. \n2. **Security Timing:** The 06:00 AM opening time refers to when the first person passes security. The queue itself starts as early as 05:15 AM. To be the 'first person in,' you must be in the queue by 05:30 AM. \n3. **The 3-Hour Limit:** As of 2026, entry tickets are valid for a duration of 3 hours. If you exceed this time, you may be asked to pay an additional fee at the exit gate. Use your time wisely."
                        },
                        {
                            title: "Best Timing for Photographers",
                            content: "If you want the 'Reflection' shot without a thousand people in the background, you have exactly 5 minutes from the time the gate opens. \n- **Sunrise:** Best for the pinkish glow on white marble. \n- **Golden Hour (4:30 PM - 5:30 PM):** Best for deep warm tones and the shadows that define the architectural carvings. \n- **Blue Hour (Post-Sunset):** The Taj takes on a hauntingly beautiful, cold sapphire tone for about 15 minutes after the sun goes down."
                        }
                    ],
                    faqs: [
                        { q: "What is the exact opening time of the Taj Mahal?", a: "The gates officially open at 06:00 AM daily, except on Fridays when the monument is closed to the public." },
                        { q: "Can I enter the Taj Mahal after 5:30 PM?", a: "No. The ticket counters and final entry gates usually stop admitting visitors 30 minutes before the official sunset closing time." },
                        { q: "Is the Taj Mahal open on public holidays?", a: "Yes, the monument remains open on all national and public holidays, unless the holiday falls on a Friday." },
                        { q: "How long can I stay inside the Taj Mahal?", a: "A standard entry ticket is valid for 3 hours from the time of entry. This is monitored via the QR code exit scan." },
                        { q: "What is the best time of year to visit?", a: "The 'Shoulder Season' of October-November and February-March offers the best balance of clear skies, comfortable temperatures, and good visibility." }
                    ],
                    jsonLd: {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Taj Mahal Opening & Closing Time (2026)",
                        "description": "Comprehensive guide to Taj Mahal timings, including sunrise entry, Friday closure, and night viewing rules for 2026.",
                        "author": { "@type": "Organization", "name": "AsiaByLocals" }
                    },
                    fastFacts: [
                        { icon: 'Clock', label: 'Standard Hours', value: '06:00 AM - Sunset' },
                        { icon: 'CheckCircle2', label: 'Friday Rule', value: 'Strictly Closed' },
                        { icon: 'History', label: 'Full Moon', value: 'Night Tours Available' }
                    ]
                };

            case 'is-taj-mahal-closed-on-friday':
                return {
                    title: 'Is the Taj Mahal Closed on Friday? (2026 Strategy Guide)',
                    description: 'The most common mistake travelers make in Agra is arriving at the Taj Mahal gates on a Friday. As of 2026, the policy remains absolute: the monument is closed for general tourism every single Friday. This guide explains why and how to salvage your Friday in Agra with a high-value alternative itinerary.',
                    heroImage: '/blog/friday-closure-hero.jpg',
                    sections: [
                        {
                            title: "Definitive Answer: Yes, It is Closed",
                            content: "**Yes, the Taj Mahal is closed every Friday for congregational prayers; however, the viewpoint at Mehtab Bagh remains open for sunset views.** \n\nThis rule applies year-round, including in 2026. \n\n🛑 **Every Friday:** No entry for general visitors \n🟢 **Except:** Special night viewing slots on select full-moon nights (separate booking required) \n\nThis closure is due to Friday congregational prayers inside the mosque located within the Taj Mahal complex."
                        },
                        {
                            title: "The Immutable Friday Policy",
                            content: "The Taj Mahal is not just a monument; it is a complex that contains an active place of worship. The mosque on the western side of the main mausoleum hosts congregational Jumu'ah prayers every Friday. \n\n- **General Visitors:** No entry permitted throughout the day. \n- **Worshippers:** Only local residents with valid identification are permitted to enter for prayer between 12:00 PM and 02:00 PM. \n- **Ticket Counters:** Physical and digital slots for Friday are disabled in the official ASI system. \n\n**Warning:** Do not believe touts or 'guides' near the gates who claim they can get you in for a special fee. The security is handled by the Central Industrial Security Force (CISF), and exceptions are never made."
                        },
                        {
                            title: "The 'Friday View' Hack: Mehtab Bagh",
                            content: "If Friday is your only day in Agra and you absolutely must see the monument, your best tactical move is to cross the Yamuna River to Mehtab Bagh (The Moonlit Garden). \n\nWhile you cannot enter the Taj Mahal complex itself, Mehtab Bagh sits directly across the river and offers a perfectly symmetrical, unobstructed view of the rear of the monument. In many ways, this is a better photographic perspective because there are no crowds in your frame. \n\n**Expert Tip:** Arrive at Mehtab Bagh by 04:30 PM. The sun sets behind you, illuminating the white marble in a deep orange glow. The river acts as a mirror, giving you the famous 'double-Taj' reflection shot."
                        },
                        {
                            title: "Full Friday Itinerary: The 'Everything Except Taj' Plan",
                            content: "Agra is far more than just one building. Use your Friday to explore the sites that usually get overshadowed. \n\n- **08:30 AM – Agra Fort:** This remains open on Fridays. Spend a full 3 hours here. It is a world-class UNESCO site in its own right and twice the size of the Taj complex. \n- **12:00 PM – Lunch at Sadar Bazaar:** Explore the local food scene. Try the authentic 'Petha' and spicy 'Bedai'. \n- **02:00 PM – The Baby Taj (Itimad-ud-Daula):** Often ignored by day-trippers, this is a gem of Mughal architecture and is open on Fridays. \n- **04:30 PM – Mehtab Bagh Sunset:** Cap off the day with the riverview of the Taj Mahal you missed in the morning."
                        }
                    ],
                    faqs: [
                        { q: "Is the Taj Mahal really closed every Friday?", a: "Yes, the monument is closed every Friday for general visitors. Only worshippers are allowed for mid-day prayers." },
                        { q: "Can I still see the Taj Mahal on a Friday?", a: "Yes, from Mehtab Bagh across the river or from a rooftop restaurant in Taj Ganj." }
                    ],
                    jsonLd: {
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [{
                            "@type": "Question",
                            "name": "Is the Taj Mahal closed on Friday?",
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": "Yes, the Taj Mahal is closed every Friday for congregational prayers. Mehtab Bagh remains open for views."
                            }
                        }]
                    },
                    fastFacts: [
                        { icon: 'AlertTriangle', label: 'Closure', value: 'Every single Friday' },
                        { icon: 'Map', label: 'Best Alternative', value: 'Mehtab Bagh Viewpoint' },
                        { icon: 'History', label: 'Worship Hours', value: '12:00 PM - 2:00 PM' }
                    ]
                };

            case "agra-travel-guide-2026":
                return {
                    title: "Agra Travel Guide 2026: The Ultimate 3000-Word Masterclass for Travelers",
                    description: "Agra is one of India’s most historically rich cities, standing as the former capital of the Mughal Empire. Known globally for the Taj Mahal, the city is a living museum of Persian-Indian fusion, intricate stonework, and royal heritage. This definitive 2026 guide provides the tactical intelligence required to navigate the city’s crowds, climate, and culture with ease.",
                    heroImage: "/blog/agra-guide-hero.jpg",
                    sections: [
                        {
                            "title": "A Brief History of Agra Mughal Legacy",
                            "content": "Agra rose to international prominence in the 16th century when the Mughal Empire shifted its seat of power from Delhi. Under the reigns of Akbar, Jahangir, and Shah Jahan, the city underwent an architectural revolution that redefined the skyline of northern India. \n\n**The Three Great Eras:** \n- **The Red Sandstone Era (Akbar):** Characterized by the massive walls of Agra Fort and the experimental city of Fatehpur Sikri. This period focused on defensibility and grand, bold structures. \n- **The Transitional Era (Jahangir):** Seen in the tomb of Itimad-ud-Daula, where the transition from sandstone to marble and the first uses of complex semi-precious stone inlays began. \n- **The White Marble Era (Shah Jahan):** Reaching its zenith with the Taj Mahal, where symmetry and emotional expression became the primary drivers of construction. \n\nToday, Agra is not just a tourist stop; it is the spiritual and historical heartbeat of South Asia, where centuries-old craftsmanship continues to thrive in the narrow lanes of the old city.",
                            "image": "/blog/agra-guide-1.jpg"
                        },
                        {
                            "title": "Must-Visit Attractions for the 2026 Season",
                            image: "/blog/agra-guide-2.jpg",
                            "content": "When planning a trip to a city with as much historical density as Agra, logistics must be meticulously handled. The climate is notoriously unforgiving. The peak tourist season runs from [October to March](/india/agra/taj-mahal-opening-time) when the daytime temperatures hover around a pleasant 20 to 25 degrees Celsius. However, traversing the city during the summer months is an exercise in endurance. During these months, the reflection off the white marble of the [Taj Mahal](/india/agra/things-to-do-in-agra) can be blinding, and the sandstone of [Agra Fort](/india/agra/places-to-visit-in-agra) can feel like walking through an oven. \n\nIf you must visit during the summer, it is imperative to adopt a split-itinerary strategy: explore from 5:30 AM to 10:30 AM, retreat to your air-conditioned hotel during the peak afternoon heat, and venture out again only after 4:30 PM. Equally critical is understanding the transportation network. While Agra is connected by the ultra-fast Gatimaan Express from Delhi (completing the journey in [just 100 minutes](/india/agra/1-day-agra-itinerary)), negotiating local transport requires tact. \n\nYou must avoid relying on random auto-rickshaws stationed directly outside major train stations like Agra Cantt, as they operate on severe commission models, taking tourists to inflated-price emporiums. Instead, heavily utilize app-based services like Uber and Ola, which provide transparent pricing and GPS tracking. For multi-monument days, renting a full-day air-conditioned taxi through a registered local agency is by far the most efficient use of your time. This allows you the flexibility to detour to hidden culinary spots in the old town without endlessly renegotiating fares."
                        },
                        {
                            "title": "The Art of Marble Inlay (Pietra Dura)",
                            "image": "/blog/agra-guide-art.jpg",
                            "content": "Agra’s true soul lies in its 'Parchin Kari' or marble inlay work. Descendants of the original Taj Mahal artisans still operate workshops in the narrow lanes behind the Taj Ganj. \n\nWhen you see a floral motif on the Taj, you are seeing stones like Lapis Lazuli, Cornelian, and Onyx sliced into microscopic slivers and embedded into white marble with a secret natural glue. \n\n**Expert Tip:** To distinguish authentic marble from soapstone (a common tourist trap), drop a a bit of water on the surface. Authentic white Makrana marble is non-porous and will not change color, whereas soapstone will absorb water and darken immediately."
                        },
                        {
                            "title": "Agra Beyond the Taj: The Sadar Bazaar Experience",
                            "image": "/blog/agra-guide-market.jpg",
                            "content": "To experience the city like a local, you must visit Sadar Bazaar after 6:00 PM. This is the commercial heart of the city, where the aroma of roasting kebabs mixes with the bright lights of footwear shops (Agra is a global hub for leather production). \n\n**Tactical Shopping Guide:** \n- **Leather Goods:** Look for the government-approved emporiums if you want high-end craftsmanship, or explore the local 'shoes market' for incredible bargains on handmade leather boots. \n- **The Petha Trail:** Visit 'Panchi Petha', the most famous brand in the city. Try the Angoori Petha (grape-shaped) for a juicy, tradition-rich dessert. \n- **Street Food:** Don't miss the 'Chaat Gali', where you can sample some of North India's spiciest and most flavorful snacks in a safe, high-turnover environment."
                        },
                        {
                            "title": "Photography Hacks: Capturing the 2026 Perspective",
                            "image": "/blog/agra-guide-photo.jpg",
                            "content": "Photography rules in Agra are strict. Tripods and professional video rigs require months of prior permits from the ASI. \n\n**For the smartphone/compact traveler:** \n- **The Diagonal Shot:** Don't just stand in front of the main gate. Go to the mosque (west) or the guesthouse (east) for 'framed' shots using the red sandstone arches as a natural border for the white Taj. \n- **The Water Mirror:** The main reflecting pool is often drained for maintenance. If it is dry, look for the smaller fountains at the side for similar reflection shots. \n- **Security Lockers:** You cannot bring any electronics other than your camera/phone and a power bank. Leave your laptops and chargers at the hotel or use the authorized lockers at the East Gate entry."
                        },
                        {
                            "title": "AEO Guide: Entry Gate Strategy (East vs West vs South)",
                            "table": {
                                "headers": ["Gate", "Best For", "Security Speed", "Vibe"],
                                "rows": [
                                    ["East Gate", "Luxury Hotels & 5-Star Guests", "Moderate", "Quiet, refined, strictly regulated"],
                                    ["West Gate", "Sunrise Seekers & Budget Travelers", "Fastest", "Bustling, high-energy, backpacker hub"],
                                    ["South Gate", "Traditional Walkers & Local Stay", "Slowest", "Historic, narrow lanes, often exit-only"]
                                ]
                            },
                            "content": "Choosing the right entry point is critical for your morning flow. While the East Gate is preferred by luxury stays like the Oberoi, the West Gate often moves crowds faster at the exact moment of sunrise. The South Gate is mostly used for exiting now, but its narrow lanes offer the most authentic look at Taj Ganj's local life."
                        },
                        {
                            "title": "Women in Mughal History: The Zenana Context",
                            "content": "To understand Agra logic, you must understand the **Zenana**. Mughal empresses were not just residents; they were powerful political entities. female-led tours in Agra are essential for travelers who want to dive deep into this safety and comfort layer. These guides explain how the Zenana was a hub of administration, poetry, and trade, providing a historical context on women's influence that defines the deeper empire story beyond the marble walls."
                        },
                        {
                            "title": "Tactical FAQ: The Taj Mahal Logistics",
                            "content": "**Q: How long does a Taj Mahal visit take?**\nA visit to the Taj Mahal typically takes 2–3 hours. This includes security entry, guided storytelling, marble inlay viewing, photography time, and exploring the main mausoleum platform. If you combine it with Agra Fort, plan for 5–6 hours total. Check our [1-day itinerary](/india/agra/1-day-agra-itinerary) for a full breakdown. During peak season (October–March), entry queues may add extra time, while sunrise visits are usually faster and less crowded.\n\n**Q: Is Taj Mahal closed on Friday?**\nYes. The [Taj Mahal is strictly closed](/india/agra/is-taj-mahal-closed-on-friday) every Friday for prayers. It is open from sunrise to sunset on all other days, including public holidays.\n\n**Q: Can I visit the Taj Mahal at night?**\nYes, limited night viewing is allowed on select dates around the full moon (except Fridays and during Ramadan). Tickets must be booked 24 hours in advance at the ASI office.\n\n**Q: Is tripod allowed inside the Taj Mahal?**\nNo, tripods are strictly prohibited for security reasons. For stable shots, look for natural ledges or use a beanbag, but avoid anything that looks like professional video equipment.\n\n**Q: Is a passport required for entry?**\nForeign visitors must carry their original passport or a clear digital copy. Indian citizens can present a government-issued ID.\n\n**Q: Are sunrise tours worth it?**\nYes — sunrise is the absolute best time. See our [timing guide](/india/agra/taj-mahal-opening-time) for the best entry strategy. The marble glows in golden light, and crowd levels are significantly lower than mid-day."
                        },
                        {
                            "title": "Safety & Practical Intelligence",
                            "content": "**Q: Is Agra safe for solo travelers?**\nAgra is generally safe for tourists, especially within monument and hotel zones. Booking verified guides, avoiding isolated areas at night, and using trusted transport like Uber ensures a comfortable experience.\n\n**Q: How can I avoid scams in Agra?**\nPurchase tickets only from official counters or verified online platforms. Avoid strangers claiming monuments are “closed today”. Use licensed guides and pre-arranged transportation.\n\n**Q: What are “lapka” touts?**\n“Lapka” is local slang for aggressive touts who approach tourists. It is best to ignore unsolicited offers and rely only on licensed professionals.\n\n**Q: Is tap water safe in Agra?**\nNo, tap water is not recommended. Bottled mineral water is widely available and inexpensive.\n\n**Q: Do I need cash in Agra?**\nWhile many hotels accept cards, small shops and local markets often prefer cash. Carry small denominations of Indian Rupees for convenience.\n\n**Q: Are cows common on the streets?**\nYes, cows are occasionally seen in older neighborhoods. They are generally calm and traffic naturally adjusts around them."
                        },
                        {
                            "title": "The Agra Culinary Masterclass",
                            "content": "**Q: What local food should I try in Agra?**\nAgra is known for Mughlai cuisine and traditional sweets. Try **Petha**, **Bedai** with aloo sabzi for breakfast, and heritage-style kebabs.\n\n**Q: Where can I try Keeme ki Kachori?**\n**Keeme ki Kachori** is a local delicacy consisting of crispy fried puffs stuffed with spiced minced buff meat—a must-try for any food lover. It is available early in the morning right next to **Joney's Place** in Tajganj. Arrive early (between 6:00 AM and 9:00 AM) before they sell out.\n\n**Q: Is street food safe in Agra?**\nStreet food is generally safe if you choose popular, busy vendors. Freshly cooked items served hot are the safest options.\n\n**Q: Are vegetarian options widely available?**\nYes. Agra has abundant vegetarian options due to cultural and religious influences. Most restaurants are either fully vegetarian or clearly mark their veg dishes."
                        },
                        {
                            "title": "Seasonal Strategy & Travel Planning",
                            "content": "**Q: What is the best month to visit Agra?**\nOctober to March is the most comfortable period. Winter mornings can be foggy, so check visibility if booking sunrise slots in January.\n\n**Q: How hot does Agra get in summer?**\nFrom April to June, temperatures can exceed 40°C (104°F). Morning tours are mandatory for comfort during these months.\n\n**Q: Does it fog in winter?**\nYes, dense fog is common in December and January mornings, sometimes delaying visibility until mid-morning.\n\n**Q: How is traffic in Agra?**\nTraffic can be heavy near monuments. The Taj Mahal area uses designated parking and electric shuttles to reduce pollution.\n\n**Q: How many days are enough for Agra?**\nOne full day is enough for the Taj and Fort. Two days allow for the Baby Taj, Mehtab Bagh, and old city exploration.\n\n**Q: What are the travel options from Delhi to Agra?**\nGatimaan Express is the fastest train (100 mins). Private cars via the Yamuna Expressway take 3-4 hours."
                        }
                    ],
                    faqs: [
                        {
                            "q": "Is Agra safe for solo travelers?",
                            "a": "Yes, Agra is generally safe. Use common sense, use app-based taxis for night travel, and stay in well-reviewed areas like Taj East Gate Road."
                        },
                        {
                            "q": "What is the best way to avoid the Taj Mahal crowds?",
                            "a": "Arrive at the West or East gate by 5:30 AM. The first 30 minutes after opening provide the only window for crowd-free photography."
                        }
                    ],
                    jsonLd: {
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": "Agra Travel Guide 2026",
                        "author": { "@type": "Organization", "name": "AsiaByLocals" }
                    },
                    fastFacts: [
                        { icon: 'Map', label: 'Total Duration', value: '3 Days (Recommended)' },
                        { icon: 'Wallet', label: 'Daily Budget', value: '₹3,500 - ₹7,000' },
                        { icon: 'Star', label: 'Culture Factor', value: 'Mughal Heritage Hub' }
                    ]
                };

            default:
                return null;
        }
    };

    const data = getContent() as CityInfoData;

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

    const renderIcon = (name: string) => {
        const props = { size: 20 };
        switch (name) {
            case 'Ticket': return <Ticket {...props} />;
            case 'Clock': return <Clock {...props} />;
            case 'Wallet': return <Wallet {...props} />;
            case 'Map': return <Map {...props} />;
            case 'AlertTriangle': return <AlertTriangle {...props} />;
            case 'Star': return <Star {...props} />;
            case 'CheckCircle2': return <CheckCircle2 {...props} />;
            case 'History': return <History {...props} />;
            default: return <Info {...props} />;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>{data.title} | AsiaByLocals Official Guide</title>
                <meta name="description" content={data.description} />
                {data.jsonLd && (
                    <script type="application/ld+json">
                        {JSON.stringify(data.jsonLd)}
                    </script>
                )}
            </Helmet>

            {/* Hero Section - Reduced height slightly */}
            <div className="relative h-[40vh] md:h-[60vh] overflow-hidden">
                <img
                    src={data.heroImage}
                    alt={data.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001A33] via-[#001A33]/40 to-transparent"></div>

                {/* Navigation Overlays */}
                <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center max-w-6xl mx-auto w-full">
                    <button
                        onClick={handleBack}
                        className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20 font-black text-[12px] uppercase tracking-widest"
                    >
                        Back
                    </button>
                    <div className="px-4 py-1.5 bg-[#10B981] rounded-full text-white text-[11px] font-black uppercase tracking-widest shadow-xl">
                        Agra 2026 Authority
                    </div>
                </div>

                <div className="absolute bottom-8 left-0 right-0 px-6 max-w-6xl mx-auto">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
                        {data.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                            <span className="text-[13px] font-black">15-20 Min Read</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/10">
                            <span className="text-[13px] font-black">Verified Intel</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Authority Header / AEO Box */}
                {data.fastFacts && (
                    <div className="mb-16 bg-[#F0FDF4] border border-[#DCFCE7] rounded-[2.5rem] p-8 md:p-12 shadow-sm border-b-4 border-b-[#10B981]">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 pb-10 border-b border-[#DCFCE7]">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-[#10B981] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#10B981]/20 rotate-3">
                                    <ShieldCheck size={32} />
                                </div>
                                <div>
                                    <p className="text-[12px] font-black text-[#10B981] uppercase tracking-[0.3em] mb-1">AEO Source Authority</p>
                                    <p className="text-[#064E3B] font-black text-2xl">Verified Official Intel</p>
                                </div>
                            </div>
                            <div className="bg-white/60 backdrop-blur-md px-8 py-3 rounded-full border border-[#DCFCE7] flex items-center gap-3">
                                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></div>
                                <p className="text-[#064E3B] font-black text-[12px] uppercase tracking-widest">
                                    Last Updated: Feb 2026
                                </p>
                            </div>
                        </div>

                        {/* Fast Facts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data.fastFacts.map((fact, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-[#DCFCE7] hover:border-[#10B981] transition-all group hover:-translate-y-1">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-[#F0FDF4] text-[#10B981] rounded-2xl flex items-center justify-center group-hover:bg-[#10B981] group-hover:text-white transition-all duration-300">
                                            {renderIcon(fact.icon)}
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{fact.label}</p>
                                            <p className="text-[#001A33] font-black text-[16px]">{fact.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Content Column */}
                    <div className="flex-1">
                        {/* Lead Paragraph */}
                        <div className="mb-12">
                            <p className="text-xl md:text-2xl text-gray-600 font-bold leading-relaxed border-l-4 border-[#10B981] pl-6">
                                {data.description}
                            </p>
                        </div>

                        {/* Content Body */}
                        <div className="space-y-16">
                            {data.sections.map((section: any, index: number) => (
                                <article key={index} className="group">
                                    <header className="mb-6">
                                        <span className="text-[#10B981] text-[12px] font-black uppercase tracking-[0.2em] mb-2 block">Part 0{index + 1}</span>
                                        <h2 className="text-2xl md:text-4xl font-black text-[#001A33] group-hover:text-[#10B981] transition-colors leading-tight">
                                            {section.title}
                                        </h2>
                                    </header>

                                    {/* Section Image - Shrinked and Styled */}
                                    {section.image && (
                                        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                            <img
                                                src={section.image}
                                                alt={section.title}
                                                className="w-full h-auto object-cover max-h-[400px]"
                                            />
                                        </div>
                                    )}

                                    <div className="text-[17px] md:text-[18px] text-gray-700 leading-[1.6] font-medium space-y-6">
                                        {section.content.split('\n').map((para: string, pIdx: number) => {
                                            if (!para.trim()) return null;

                                            // Handle bolding: **text** and links: [text](url)
                                            const parts = para.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g);
                                            return (
                                                <p key={pIdx}>
                                                    {parts.map((part, i) => {
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
                                                    })}
                                                </p>
                                            );
                                        })}
                                    </div>

                                    {section.table && (
                                        <div className="mt-8 overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        {section.table.headers.map((header: string, hIdx: number) => (
                                                            <th key={hIdx} className="p-4 text-[13px] font-black text-[#001A33] uppercase tracking-wider border-b border-gray-100">{header}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {section.table.rows.map((row: string[], rIdx: number) => (
                                                        <tr key={rIdx} className="hover:bg-gray-50/50 transition-colors">
                                                            {row.map((cell: string, cIdx: number) => (
                                                                <td key={cIdx} className="p-4 text-[15px] font-medium text-gray-600 border-b border-gray-50">{cell}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        {data.faqs && data.faqs.length > 0 && (
                            <section className="mt-24">
                                <h2 className="text-3xl md:text-4xl font-black text-[#001A33] mb-12">
                                    Frequently Asked Questions
                                </h2>
                                <div className="space-y-6">
                                    {data.faqs.map((faq: any, fIdx: number) => (
                                        <div key={fIdx} className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-[#10B981]/30 transition-all duration-300">
                                            <h3 className="text-xl font-black text-[#001A33] mb-4 flex gap-3">
                                                <span className="text-[#10B981]">Q.</span>
                                                {faq.q}
                                            </h3>
                                            <div className="text-gray-600 font-medium leading-relaxed pl-8 space-y-2">
                                                {faq.a.split('\n').map((line: string, lIdx: number) => (
                                                    <p key={lIdx}>
                                                        {line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g).map((part, pIdx) => {
                                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                                return <strong key={pIdx} className="text-[#001A33] font-black">{part.slice(2, -2)}</strong>;
                                                            }
                                                            if (part.startsWith('[') && part.includes('](')) {
                                                                const match = part.match(/\[(.*?)\]\((.*?)\)/);
                                                                if (match) {
                                                                    return (
                                                                        <a key={pIdx} href={match[2]} className="text-[#10B981] font-black border-b border-[#10B981]/30 hover:border-[#10B981] transition-all">
                                                                            {match[1]}
                                                                        </a>
                                                                    );
                                                                }
                                                            }
                                                            return part;
                                                        })}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Bottom CTA */}
                        <section className="mt-24 p-1 bg-gradient-to-r from-[#10B981] to-[#059669] rounded-[40px]">
                            <div className="bg-[#001A33] rounded-[38px] p-8 md:p-12 text-white text-center">
                                <h2 className="text-3xl md:text-5xl font-black mb-4">Discover the real Agra.</h2>
                                <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium">
                                    Experience the difference of local mastery. Our licensed guides ensure you see the soul of the city.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <button
                                        onClick={() => window.location.href = `/${country.toLowerCase()}/${city.toLowerCase()}`}
                                        className="w-full sm:w-auto px-10 py-5 bg-[#10B981] text-white font-black rounded-full hover:bg-white hover:text-[#10B981] transition-all duration-300 flex items-center justify-center text-xl shadow-xl hover:shadow-[#10B981]/40 hover:-translate-y-1 hover:scale-[1.05] active:scale-[0.95] group/cta"
                                    >
                                        Browse Agra Tours
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-[350px] shrink-0">
                        <div className="sticky top-32 space-y-8">
                            {/* Pillar Nav */}
                            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-md">
                                <h4 className="text-lg font-black text-[#001A33] mb-6">Agra Guide Hub</h4>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Things to Do', slug: 'things-to-do-in-agra' },
                                        { name: 'Places Guide', slug: 'places-to-visit-in-agra' },
                                        { name: '1-Day Itinerary', slug: '1-day-agra-itinerary' },
                                        { name: 'Pricing 2026', slug: 'taj-mahal-ticket-price-2026' },
                                        { name: 'Opening Times', slug: 'taj-mahal-opening-time' },
                                        { name: 'Friday Strategy', slug: 'is-taj-mahal-closed-on-friday' },
                                        { name: 'Master Guide', slug: 'agra-travel-guide-2026' }
                                    ].map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={`/india/agra/${item.slug}`}
                                            className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 group ${slug === item.slug
                                                ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/30 scale-[1.02] -translate-y-0.5'
                                                : 'bg-gray-50 hover:bg-white hover:shadow-md hover:border-[#10B981]/20 border border-transparent text-[#001A33] hover:-translate-y-1'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {slug === item.slug && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                                                <span className="font-black text-[14px] tracking-tight">{item.name}</span>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Support Widget */}
                            <div className="bg-[#10B981] rounded-[32px] p-8 text-white shadow-xl shadow-[#10B981]/20 relative overflow-hidden group/support">
                                <div className="relative z-10">
                                    <h4 className="text-lg font-black mb-4">Need Help?</h4>
                                    <p className="text-white/80 font-bold text-sm mb-6">
                                        Message a certified Agra guide to plan your perfect route.
                                    </p>
                                    <button
                                        onClick={() => window.location.href = `/${country.toLowerCase()}/${city.toLowerCase()}`}
                                        className="w-full py-4 bg-white text-[#10B981] font-black rounded-xl hover:bg-gray-50 transition-all text-[15px] shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                                    >
                                        Browse Agra Tours
                                    </button>
                                </div>
                                {/* Decorative glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover/support:scale-150 transition-transform duration-700" />
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div >
    );
};

export default CityInfoPage;
