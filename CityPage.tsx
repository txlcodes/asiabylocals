import React, { useState, useEffect } from 'react';
import {
  MapPin, Star, Clock, Users, Search, Filter, Heart, User, Globe, ChevronDown, Calendar, ChevronUp, Mail,
  HelpCircle,
  HelpCircle as HelpIcon, ArrowLeft, Ticket, Info, ChevronRight
} from 'lucide-react';
import { CITY_LOCATIONS } from './constants';
import { Helmet } from 'react-helmet-async';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

interface CityPageProps {
  country: string;
  city: string;
}

// City descriptions for SEO - Battle-tested structure
const CITY_DESCRIPTIONS: Record<string, {
  title: string;
  description: string;
  intro: string[];
  whyBook: string[];
  topAttractions: string[];
  bestTime: string;
  faqs: { question: string; answer: string }[];
}> = {
  'Agra': {
    title: 'Agra Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Agra with licensed local guides. Taj Mahal sunrise tours, heritage walks, food tours & day trips.',
    intro: [
      'At AsiaByLocals, discover expert-led [tours in Agra](/india/agra/things-to-do-in-agra) hosted by a licensed **local guide for Agra** and historians. From an **Agra tour by guide** for Taj Mahal sunrise visits to a comprehensive **Agra guided tour**, explore the city through authentic, locally curated [1-day itineraries](/india/agra/1-day-agra-itinerary).',
      'Agra is one of India\'s most visited cities, famous worldwide for the Taj Mahal and its rich Mughal heritage. Beyond the iconic monument, Agra offers a deep cultural experience through historic forts, bustling bazaars, traditional crafts, and local cuisine.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: CITY_LOCATIONS['Agra'] || [
      'Taj Mahal',
      'Agra Fort',
      'Baby Taj',
      'Mehtab Bagh',
      'Fatehpur Sikri',
      'Tomb of Akbar the Great',
      'Itmad-ud-Daulah',
      'Jama Masjid',
      'Kinari Bazaar',
      'Chini Ka Rauza'
    ],
    bestTime: 'The best time to visit Agra is from October to March when the weather is pleasant. Early mornings are highly recommended, especially for sunrise Taj Mahal tours when the monument glows in golden light and crowds are minimal.',
    faqs: [
      {
        question: "How long does a Taj Mahal visit take?",
        answer: "A comprehensive visit to the [Taj Mahal](/india/agra/agra-travel-guide-2026) typically requires between 2.5 to 3 hours of on-site exploration. This timeframe accounts for the mandatory security screening at the gates (which can vary depending on your arrival time), a guided walk through the Charbagh gardens, and a detailed tour of the main mausoleum platform. If your itinerary includes a 'Skip-The-Line' entry, you effectively bypass the manual ticket queues, but the internal distance of the complex still necessitates significant walking. For enthusiasts interested in photography or the intricate marble inlay work (Pietra Dura), we recommend allowing for the full 3 hours to capture the monument as the light transitions, particularly during the ethereal sunrise or sunset windows."
      },
      {
        question: "Is Taj Mahal closed on Friday?",
        answer: "Yes, the [Taj Mahal is strictly closed](/india/agra/is-taj-mahal-closed-on-friday) to the general public every Friday. This weekly closure is mandatory as the monument remains an active place of worship, with the mosque on the western side hosting afternoon prayers for local residents. It is a common traveler error to arrive in Agra on a Friday expecting a tour; instead, we recommend utilizing this day to visit the [Agra Fort](/india/agra/things-to-do-in-agra), the Itmad-ud-Daulah (Baby Taj), or the Mehtab Bagh across the river, which offers a stunning sunset view of the Taj's rear facade. The monument resumes its dawn-to-dusk operations every Saturday morning, often seeing a surge in visitors immediately following the Friday hiatus."
      },
      {
        question: "Can I visit the Taj Mahal at night?",
        answer: "Taj Mahal night viewing is a rare and highly regulated experience, permitted only for 5 nights each month—specifically on the full moon night and the two nights preceding and following it. However, if any of these dates fall on a Friday or during the month of Ramadan, night entry is prohibited. Tickets are extremely limited (capped at 400 people per night) and must be purchased exactly 24 hours in advance from the ASI office. The visit is divided into eight batches of 50 people, each lasting 30 minutes. While you cannot walk up to the main platform at night, viewing the moonlit white marble from the red sandstone platforms is a bucket-list experience. Check our [night viewing guide](/india/agra/taj-mahal-opening-time) for tactical booking advice."
      },
      {
        question: "Is tripod allowed inside the Taj Mahal?",
        answer: "For security and preservation reasons, the Archaeological Survey of India (ASI) strictly prohibits the use of tripods, monopods, or any specialized professional videography equipment inside the Taj Mahal complex without a pre-approved commercial permit from the New Delhi headquarters. Handheld photography with standard DSLR cameras and smartphones is perfectly acceptable and encouraged. If you are a professional photographer looking to capture symmetrical long-exposures, we recommend visiting the Mehtab Bagh (Moonlight Garden) located directly across the Yamuna River. There, security is slightly less restrictive regarding gear, and you can achieve perfectly centered shots of the monument reflecting in the water during the 'blue hour' without the logistical hurdles of the main complex security checks."
      },
      {
        question: "Is a passport required for entry?",
        answer: "Yes, carrying your **original physical passport** is a foundational requirement for all international visitors entering the Taj Mahal. While the digital ticket on your smartphone is sufficient for the turnstiles, the Central Industrial Security Force (CISF) personnel conduct random identification audits to ensure the ticket holder's identity matches the document used during the booking process. Indian nationals should carry an original Aadhaar card or Voter ID. In addition to identification, be prepared for an airport-style security check where items like drones, tobacco products, lighters, and large backpacks are prohibited. Carrying only a small daypack with your camera, phone, and original ID is the most tactical way to ensure a seamless and rapid entry through the gates."
      },
      {
        question: "Are sunrise tours worth it?",
        answer: "Yes — sunrise is widely considered the best time to visit the Taj Mahal. See our [detailed timing guide](/india/agra/taj-mahal-opening-time) for the best strategy. The marble glows softly in golden morning light, temperatures are cooler, and crowd levels are significantly lower. Photographers especially prefer sunrise for better symmetry shots and mist effects in winter."
      },
      {
        question: "How crowded is the Taj Mahal in winter?",
        answer: "Winter (November–February) is peak season. The monument can get crowded after 9:30 AM, especially on weekends. Early morning visits help avoid congestion. Fog is common in December and January mornings, sometimes delaying visibility but also creating atmospheric photography conditions. Plan with our [winter travel guide](/india/agra/1-day-agra-itinerary) for more tips."
      },
      {
        question: "Is Agra Fort included in most tours?",
        answer: "Most half-day and full-day [Agra tours](/india/agra/things-to-do-in-agra) include both the Taj Mahal and Agra Fort. Agra Fort offers important historical context about the Mughal Empire and provides one of the best distant views of the Taj Mahal from its balconies."
      },
      {
        question: "Safety & Practical Tips: Is Agra safe for solo travelers?",
        answer: "Agra is generally safe for tourists, including solo and female travelers, especially within monument and hotel zones. Like any major tourist city, awareness is important. Booking [verified guides](/india/agra/things-to-do-in-agra), avoiding isolated areas at night, and using trusted transport ensures a comfortable experience."
      },
      {
        question: "How can I avoid scams in Agra?",
        answer: "Purchase tickets only from official counters or verified online platforms like our [digital ticket service](/india/agra/taj-mahal-ticket-price-2026). Avoid strangers claiming monuments are “closed today” or offering special discounted access. Use [licensed guides](/india/agra/things-to-do-in-agra) and pre-arranged transportation. Most issues arise from unsolicited street offers, which are easy to avoid by politely declining."
      },
      {
        question: "What are “lapka” touts?",
        answer: "“Lapka” is a local term used for aggressive touts who approach tourists offering unofficial guide services or discounted tickets. They are common near major attractions. It is best to ignore unsolicited offers and rely only on [licensed professionals](/india/agra/things-to-do-in-agra)."
      },
      {
        question: "Is tap water safe in Agra?",
        answer: "No, tap water is not recommended for drinking. Bottled mineral water is widely available and inexpensive. Hotels typically provide filtered water. Travelers should also avoid ice in unknown establishments. See our [local survival tips](/india/agra/agra-travel-guide-2026) for more health advice."
      },
      {
        question: "Do I need cash in Agra?",
        answer: "While many hotels and larger restaurants accept cards, small shops, street vendors, and local markets often prefer cash. Carry small denominations of Indian Rupees for convenience. Note that [entry tickets](/india/agra/taj-mahal-ticket-price-2026) are now digital only and cannot be bought with cash at the gates."
      },
      {
        question: "Are cows common on the streets?",
        answer: "Yes, cows are occasionally seen walking freely in certain parts of Agra, especially older neighborhoods. They are generally calm and traffic naturally adjusts around them. Visitors should not feed or disturb them."
      },
      {
        question: "Food & Local Experience: What local food should I try in Agra?",
        answer: "Agra is known for Mughlai cuisine, rich gravies, and traditional sweets. Try petha (a famous local sweet), bedai with aloo sabzi for breakfast, and kebabs influenced by Mughal heritage. The old city area offers authentic flavors."
      },
      {
        question: "Where can I try Keeme ki Kachori?",
        answer: "Keeme ki Kachori is a local delicacy consisting of crispy fried puffs stuffed with spiced minced buff meat—it’s a must-try for any visitor. The best spot for this is open early in the morning and is located right next to **Joney's Place** in Tajganj. Arrive early (between 6:00 AM and 9:00 AM) to ensure you get them fresh before they sell out."
      },
      {
        question: "Is street food safe in Agra?",
        answer: "Street food is generally safe if you choose popular, busy vendors. Freshly cooked items served hot are safer options. Avoid raw salads and cut fruits from unknown stalls. Many travelers enjoy street snacks without issues when taking basic precautions."
      },
      {
        question: "Are vegetarian options widely available?",
        answer: "Yes. Agra has abundant vegetarian options due to cultural and religious influences. Most restaurants clearly mark vegetarian dishes, and many are fully vegetarian establishments."
      },
      {
        question: "What is Agra famous for besides the Taj Mahal?",
        answer: "Beyond the Taj Mahal, Agra is known for Agra Fort, Mehtab Bagh sunset views, marble inlay craftsmanship, leather goods, and Mughlai cuisine. The city holds deep historical importance from the Mughal period."
      },
      {
        question: "Weather & Planning: What is the best month to visit Agra?",
        answer: "October to March is the most comfortable period, with pleasant temperatures and clearer skies. Winter mornings can be foggy, especially in December and January."
      },
      {
        question: "How hot does Agra get in summer?",
        answer: "From April to June, temperatures can exceed 40°C (104°F). Morning tours are strongly recommended during summer months. Light cotton clothing, sunglasses, sunscreen, and hydration are essential."
      },
      {
        question: "Does it fog in winter?",
        answer: "Yes, dense fog is common in December and January mornings. Visibility can sometimes delay sunrise photography but usually clears by mid-morning."
      },
      {
        question: "How is traffic in Agra?",
        answer: "Traffic can be moderate to heavy near major monuments during peak season. The Taj Mahal area uses designated parking zones and electric shuttle vehicles to reduce pollution."
      },
      {
        question: "How many days are enough for Agra?",
        answer: "One full day is enough to see the Taj Mahal and Agra Fort. Check out our [1-day precision itinerary](/india/agra/1-day-agra-itinerary) to maximize your time. Two days allow for Mehtab Bagh, Itmad-ud-Daulah (Baby Taj), and a relaxed exploration of local markets and cuisine."
      },
      {
        question: "What are the travel options from Delhi to Agra?",
        answer: "Travelers can reach Agra from Delhi by train (Gatimaan Express is fastest), private car (3–4 hours via Yamuna Expressway), or guided day tour. See our [pricing guide](/india/agra/taj-mahal-ticket-price-2026) for transport and entry fees. Private transport offers flexibility, while trains are efficient for short visits."
      }
    ]
  },
  'Delhi': {
    title: 'Delhi Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Delhi with licensed local guides. Red Fort tours, Old Delhi heritage walks, street food tours & cultural experiences.',
    intro: [
      'Delhi, India\'s capital, is a vibrant blend of ancient history and modern energy. From the historic **Red Fort** and **Jama Masjid** to the bustling markets of [Old Delhi](/india/delhi) and the modern architecture of New Delhi, the city offers endless exploration opportunities.',
      'At AsiaByLocals, explore the capital through expert-led [tours in Delhi](/india/delhi) with licensed local guides. Discover authentic street food, hidden neighborhoods, and the real stories that make Delhi special. Experience the contrast between the narrow lanes and wide boulevards with knowledgeable local experts.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Red Fort',
      'Jama Masjid',
      'India Gate',
      'Qutub Minar',
      'Humayun\'s Tomb',
      'Old Delhi markets & street food'
    ],
    bestTime: 'The best time to visit Delhi is from October to March when the weather is pleasant. Early mornings and late afternoons are ideal for exploring outdoor sites and markets.',
    faqs: [
      {
        question: 'How long does a Delhi heritage tour take?',
        answer: 'A typical [Old Delhi heritage walk](/india/delhi) takes 3-4 hours, while combined tours covering multiple monuments like the Red Fort and Qutub Minar can take 6-8 hours. If you are starting your [Golden Triangle tour](/india/agra), we recommend at least 2 full days in Delhi before heading to Agra.'
      },
      {
        question: 'Are Delhi tours suitable for families?',
        answer: 'Yes, Delhi tours are very family-friendly. Our [licensed local guides](/india/delhi) adapt the experience for children, focusing on interactive stories and ensuring comfortable pacing for all ages. We also recommend private vehicles for family comfort between sites.'
      },
      {
        question: 'Do I need a licensed guide in Delhi?',
        answer: 'While not mandatory, a government-licensed guide is highly recommended to navigate Delhi\'s complex history and diverse neighborhoods. They ensure you receive verified historical context and help you avoid [common city scams](/india/delhi).'
      },
      {
        question: 'Are street food tours safe?',
        answer: 'Yes, our guides selectively take you to trusted vendors in Old Delhi with high hygiene standards. We ensure safe, authentic food experiences that showcase the real flavors of the capital. Check our [food safety guide](/india/delhi) for more tips.'
      }
    ]
  },
  'Jaipur': {
    title: 'Jaipur Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Jaipur with licensed local guides. City Palace tours, Hawa Mahal visits, heritage walks & authentic Rajasthan experiences.',
    intro: [
      'Jaipur, known as the **Pink City**, is the vibrant capital of Rajasthan. Famous for its stunning palaces, colorful markets, and rich cultural heritage, Jaipur offers visitors a glimpse into royal India.',
      'At AsiaByLocals, explore the royal capital through expert-led [tours in Jaipur](/india/jaipur) with licensed local guides. Discover the magnificent **City Palace**, the unique **Hawa Mahal** (Palace of Winds), and the ancient **Jantar Mantar** observatory. Our guides share the stories behind these architectural marvels and take you to authentic markets and hidden gems that showcase Jaipur\'s true character.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'City Palace',
      'Hawa Mahal',
      'Jantar Mantar',
      'Amber Fort',
      'Nahargarh Fort',
      'Local markets & traditional workshops'
    ],
    bestTime: 'The best time to visit Jaipur is from October to March when the weather is pleasant. Early mornings are ideal for exploring palaces and forts before the heat sets in.',
    faqs: [
      {
        question: 'How long does a Jaipur palace tour take?',
        answer: 'A typical City Palace and Hawa Mahal tour takes 3-4 hours. Combined tours with Amber Fort can take 6-8 hours. For those on a [Delhi-Agra-Jaipur circuit](/india/agra), we recommend spending at least 2 nights in the Pink City.'
      },
      {
        question: 'Are Jaipur tours suitable for families?',
        answer: 'Yes, Jaipur tours are exceptionally family-friendly. The majestic palaces and colorful bazaars of the [Pink City](/india/jaipur) are engaging for children, and our guides specialize in making history come alive through royal legends.'
      },
      {
        question: 'Do I need a licensed guide in Jaipur?',
        answer: 'A [licensed local guide](/india/jaipur) is essential to truly understand the architectural genius behind the Jantar Mantar observatory and the hidden history of the royal family. They also help navigate the bustling local markets safely.'
      },
      {
        question: 'Are heritage walks worth it?',
        answer: 'Absolutely. A [Jaipur heritage walk](/india/jaipur) reveals the city\'s unique urban planning, traditional jewelry workshops, and local storytelling that you simply cannot find on a standard bus tour.'
      }
    ]
  },
  'Mumbai': {
    title: 'Mumbai Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Mumbai with licensed local guides. Gateway of India tours, street food walks, heritage tours & cultural experiences.',
    intro: [
      'Mumbai, India\'s financial capital, is a city of contrasts where colonial architecture meets modern skyscrapers, and luxury hotels stand alongside vibrant street markets.',
      'At AsiaByLocals, explore Mumbai through expert-led tours with licensed local guides. Discover the iconic Gateway of India, Marine Drive, bustling markets of Colaba, and authentic street food. Our guides help you navigate this bustling metropolis and understand what makes Mumbai the city of dreams for millions.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Gateway of India',
      'Marine Drive',
      'Colaba Causeway',
      'Elephanta Caves',
      'Dharavi',
      'Street food & local markets'
    ],
    bestTime: 'The best time to visit Mumbai is from November to February when the weather is pleasant. Early mornings and evenings are ideal for exploring outdoor sites.',
    faqs: [
      {
        question: 'How long does a Mumbai city tour take?',
        answer: 'A typical Mumbai city tour covering major landmarks takes 4-6 hours. Street food tours usually take 2-3 hours.'
      },
      {
        question: 'Are Mumbai tours suitable for families?',
        answer: 'Yes, Mumbai tours are family-friendly. Our guides ensure comfortable pacing and adapt the experience for children.'
      },
      {
        question: 'Do I need a licensed guide in Mumbai?',
        answer: 'While not mandatory, a licensed local guide helps navigate Mumbai\'s complex neighborhoods and provides valuable cultural insights.'
      },
      {
        question: 'Are street food tours safe?',
        answer: 'Yes, our guides take you to trusted vendors with high hygiene standards. We ensure safe, authentic food experiences.'
      }
    ]
  },
  'Goa': {
    title: 'Goa Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Goa with licensed local guides. Beach tours, Portuguese heritage walks, spice plantation visits & cultural experiences.',
    intro: [
      'Goa, India\'s smallest state, is famous for its beautiful beaches, Portuguese colonial heritage, and laid-back atmosphere.',
      'At AsiaByLocals, explore Goa through expert-led tours with licensed local guides. Discover pristine beaches, historic churches, spice plantations, and local villages. Our guides take you to hidden beaches and cultural gems that showcase authentic Goan life.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Beaches',
      'Portuguese churches',
      'Spice plantations',
      'Local markets',
      'Heritage villages',
      'Waterfalls & nature spots'
    ],
    bestTime: 'The best time to visit Goa is from November to February when the weather is perfect for beach activities and sightseeing.',
    faqs: [
      {
        question: 'How long does a Goa heritage tour take?',
        answer: 'A typical Goa heritage tour covering churches and Portuguese architecture takes 3-4 hours. Spice plantation visits take 2-3 hours.'
      },
      {
        question: 'Are Goa tours suitable for families?',
        answer: 'Yes, Goa tours are very family-friendly with activities suitable for all ages including beaches, markets, and cultural sites.'
      },
      {
        question: 'Do I need a licensed guide in Goa?',
        answer: 'While not mandatory, a licensed local guide enhances your experience by explaining Goa\'s unique blend of Indian and Portuguese cultures.'
      },
      {
        question: 'Are spice plantation tours worth it?',
        answer: 'Absolutely. Spice plantation tours offer hands-on experiences, traditional Goan cuisine, and insights into local agriculture and culture.'
      }
    ]
  },
  'Udaipur': {
    title: 'Udaipur Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Udaipur with licensed local guides. City Palace tours, Lake Pichola boat rides, heritage walks & authentic Rajasthan experiences.',
    intro: [
      'Udaipur, known as the City of Lakes, is a romantic destination in Rajasthan famous for its stunning palaces, serene lakes, and rich Mewar heritage.',
      'At AsiaByLocals, explore Udaipur through expert-led tours with licensed local guides. Discover the magnificent City Palace overlooking Lake Pichola, the beautiful Jag Mandir and Jagdish Temple, and the historic Monsoon Palace. Our guides share the stories of Rajput royalty and take you to authentic markets, traditional workshops, and hidden gems that showcase Udaipur\'s timeless charm.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'City Palace',
      'Lake Pichola',
      'Jag Mandir',
      'Jagdish Temple',
      'Monsoon Palace',
      'Fateh Sagar Lake',
      'Saheliyon Ki Bari',
      'Local markets & traditional crafts'
    ],
    bestTime: 'The best time to visit Udaipur is from October to March when the weather is pleasant. Early mornings and evenings are ideal for lake activities and palace visits.',
    faqs: [
      {
        question: 'How long does a Udaipur palace tour take?',
        answer: 'A typical City Palace tour takes 2-3 hours. Combined tours with Lake Pichola boat ride and other attractions can take 4-6 hours.'
      },
      {
        question: 'Are Udaipur tours suitable for families?',
        answer: 'Yes, Udaipur tours are very family-friendly. The palaces, lakes, and markets are engaging for children, and our guides make history come alive for all ages.'
      },
      {
        question: 'Do I need a licensed guide in Udaipur?',
        answer: 'While not mandatory, a licensed local guide enhances your experience by explaining the rich history, architecture, and cultural significance of Udaipur\'s royal heritage.'
      },
      {
        question: 'Are boat rides on Lake Pichola worth it?',
        answer: 'Absolutely. Lake Pichola boat rides offer stunning views of the City Palace and Jag Mandir, especially during sunrise and sunset, providing a unique perspective of Udaipur\'s beauty.'
      }
    ]
  },
  'Jaisalmer': {
    title: 'Jaisalmer Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Jaisalmer with licensed local guides. Golden Fort tours, desert safaris, camel rides & authentic Rajasthan experiences.',
    intro: [
      'Jaisalmer, known as the Golden City, is a magical destination in the heart of the Thar Desert, famous for its golden sandstone architecture and desert adventures.',
      'At AsiaByLocals, explore Jaisalmer through expert-led tours with licensed local guides. Discover the magnificent Jaisalmer Fort, ancient havelis with intricate carvings, and experience authentic desert safaris with camel rides. Our guides share the stories of this desert kingdom and take you to authentic markets, traditional workshops, and hidden gems that showcase Jaisalmer\'s unique desert culture.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Jaisalmer Fort',
      'Patwon Ki Haveli',
      'Sam Sand Dunes',
      'Desert Safari',
      'Camel rides',
      'Gadisar Lake',
      'Bada Bagh',
      'Local markets & traditional crafts'
    ],
    bestTime: 'The best time to visit Jaisalmer is from October to March when the weather is pleasant. Early mornings and evenings are ideal for desert activities and fort visits.',
    faqs: [
      {
        question: 'How long does a Jaisalmer fort tour take?',
        answer: 'A typical Jaisalmer Fort tour takes 2-3 hours. Combined tours with havelis and markets can take 4-5 hours.'
      },
      {
        question: 'Are desert safaris suitable for families?',
        answer: 'Yes, desert safaris are family-friendly. Camel rides and cultural performances are enjoyable for all ages, though very young children may need special arrangements.'
      },
      {
        question: 'Do I need a licensed guide in Jaisalmer?',
        answer: 'While not mandatory, a licensed local guide enhances your experience by explaining the rich history, architecture, and cultural significance of Jaisalmer\'s desert heritage.'
      },
      {
        question: 'Are camel rides safe?',
        answer: 'Yes, camel rides are safe when conducted by experienced guides. Our tours use well-trained camels and follow safety protocols for a comfortable experience.'
      }
    ]
  },
  'Varanasi': {
    title: 'Varanasi Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Varanasi with licensed local guides. sunrise boat rides, temple walks, Sarnath tours & spiritual experiences.',
    intro: [
      'Varanasi, also known as Kashi or Benaras, is one of the world\'s oldest living cities and the spiritual capital of India. Located on the banks of the sacred Ganges River, it is a city of temples, ghats, and timeless rituals.',
      'At AsiaByLocals, explore Varanasi through expert-led tours with licensed local guides. Experience the mesmerizing Ganga Aarti, take a sunrise boat ride on the Ganges, and walk through the narrow alleys of the old city. Our guides share the deep spiritual significance and history of this holy city.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Deep spiritual and historical insights',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Ganges Ghats',
      'Kashi Vishwanath Temple',
      'Sarnath',
      'Ganga Aarti',
      'Ramnagar Fort',
      'Dashashwamedh Ghat'
    ],
    bestTime: 'The best time to visit Varanasi is from October to March when the weather is pleasant. Early mornings are essential for boat rides and witnessing the city wake up.',
    faqs: [
      {
        question: 'When is the best time for a boat ride?',
        answer: 'Sunrise is the best time for a boat ride on the Ganges to witness the morning rituals and the golden light on the ghats.'
      },
      {
        question: 'Is it safe to walk in the narrow alleys?',
        answer: 'Yes, but it can be overwhelming. A local guide helps you navigate the labyrinthine lanes safely and understand the hidden gems.'
      },
      {
        question: 'Can non-Hindus visit Kashi Vishwanath Temple?',
        answer: 'Non-Hindus can visit the temple complex but may have restricted access to the inner sanctum. Passports are required for entry.'
      },
      {
        question: 'How far is Sarnath from Varanasi?',
        answer: 'Sarnath is about 10-12 km from Varanasi and takes about 30-45 minutes by car. It\'s a perfect half-day trip.'
      }
    ]
  },
  'Jodhpur': {
    title: 'Jodhpur Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Jodhpur with licensed local guides. Mehrangarh Fort tours, Blue City walks, Bishnoi safaris & cultural experiences.',
    intro: [
      'Jodhpur, the Blue City, is dominated by the majestic Mehrangarh Fort and is a gateway to the Thar Desert. Its blue-painted houses and vibrant markets make it one of Rajasthan\'s most photogenic cities.',
      'At AsiaByLocals, explore Jodhpur through expert-led tours with licensed local guides. Visit the towering Mehrangarh Fort, stroll through the blue streets of the old city, and experience rural life on a Bishnoi village safari. Our guides help you discover the legends of the Rathore clan and the vibrant culture of Marwar.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Mehrangarh Fort',
      'Jaswant Thada',
      'Umaid Bhawan Palace',
      'Clock Tower Market',
      'Mandore Gardens',
      'Bishnoi Villages'
    ],
    bestTime: 'The best time to visit Jodhpur is from October to March. Evenings are perfect for exploring the markets and enjoying rooftop views of the fort.',
    faqs: [
      {
        question: 'How much time is needed for Mehrangarh Fort?',
        answer: 'You should allocate at least 2-3 hours to explore the extensive palaces and museums within Mehrangarh Fort.'
      },
      {
        question: 'What is a Bishnoi Village Safari?',
        answer: 'It\'s a tour to rural villages inhabited by the Bishnoi community, known for their nature conservation. You can see local crafts, wildlife, and traditional homes.'
      },
      {
        question: 'Where can I see the blue houses?',
        answer: 'The blue houses are located in the old city (Brahmpuri and Navchokiya areas) behind the fort. A guided walking tour is the best way to explore them.'
      },
      {
        question: 'Is Jodhpur safe for tourists?',
        answer: 'Yes, Jodhpur is generally very safe. Standard precautions apply, especially in crowded markets.'
      }
    ]
  },
  'Kochi': {
    title: 'Kochi Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Kochi with licensed local guides. Fort Kochi walks, backwater cruises, Kathakali shows & cultural experiences.',
    intro: [
      'Kochi (Cochin) is a vibrant port city in Kerala, known as the Queen of the Arabian Sea. It boasts a unique blend of Dutch, Portuguese, British, and Jewish influences, set against the backdrop of serene backwaters.',
      'At AsiaByLocals, explore Kochi through expert-led tours with licensed local guides. See the iconic Chinese fishing nets, visit historic churches and synagogues, and cruise the tranquil backwaters. Our guides share the fascinating history of the spice trade and the diverse cultural tapestry of this coastal city.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [
      'Chinese Fishing Nets',
      'Fort Kochi Beach',
      'Mattancherry Palace',
      'Paradesi Synagogue',
      'St. Francis Church',
      'Kerala Folklore Museum'
    ],
    bestTime: 'The best time to visit Kochi is from September to March when the weather is pleasant. December and January are peak tourist months.',
    faqs: [
      {
        question: 'How far are the backwaters from Kochi?',
        answer: 'The closest backwaters are in Alleppey, about 1-1.5 hours drive from Kochi. Day cruises are easily arranged.'
      },
      {
        question: 'What is unique about Fort Kochi?',
        answer: 'Fort Kochi is a historical area with colonial architecture, ancient churches, and the famous Chinese fishing nets, reflecting centuries of trade history.'
      },
      {
        question: 'Is one day enough for Kochi?',
        answer: 'One day is sufficient to see the main highlights of Fort Kochi and Mattancherry. Two days allow for a backwater cruise or a Kathakali performance.'
      },
      {
        question: 'What should I wear in Kochi?',
        answer: 'Light cotton clothing is best due to the humidity. Modest dress is recommended when visiting temples and churches.'
      }
    ]
  },
  'Bangkok': {
    title: 'Bangkok Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Bangkok with licensed local guides. Grand Palace visits, canal tours, street food walks & floating markets.',
    intro: [
      'Bangkok, the "City of Angels," is a vibrant metropolis that blends ancient spiritual traditions with modern luxury. From the shimmering spires of the Grand Palace to the neon-lit food markets of Chinatown, the city is a sensory masterpiece.',
      'At AsiaByLocals, explore Bangkok through world-class tours led by expert local guides. Discover the majestic Chao Phraya River, hidden canals, and historic temples through authentic, locally curated experiences that show you the soul of Thailand.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Direct support to local communities',
      'Ethical, small-group experiences',
      'Skip-the-line access to major monuments'
    ],
    topAttractions: [
      'Grand Palace',
      'Wat Pho',
      'Wat Arun',
      'Chinatown (Yaowarat)',
      'Chatuchak Weekend Market',
      'ICONSIAM',
      'Jim Thompson House',
      'Bangkok Canal Tour'
    ],
    bestTime: 'The best time to visit Bangkok is from November to February during the cool and dry season. March and April are the hottest months, while the monsoon lasts from June to October.',
    faqs: [
      {
        question: 'Is it easy to get around Bangkok for tours?',
        answer: 'Yes, Bangkok has excellent transport options. Most of our tours use a combination of the BTS Skytrain, MRT, and traditional Tuk-Tuks or private cars to ensure a smooth experience.'
      },
      {
        question: 'What is the dress code for Bangkok temples?',
        answer: 'Modest dress is strictly required for the Grand Palace and major temples. Shoulders and knees must be covered. Wearing comfortable, easy-to-remove shoes is also recommended.'
      },
      {
        question: 'Are street food tours safe in Bangkok?',
        answer: 'Our guides take you to trusted vendors with high hygiene standards. We ensure a safe and delicious introduction to Thailand\'s legendary street food scene.'
      }
    ]
  },
  'Chiang Mai': {
    title: 'Chiang Mai Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Chiang Mai with licensed local guides. Doi Suthep tours, ethical elephant encounters, cooking classes & night markets.',
    intro: [
      'Chiang Mai, the cultural heart of Northern Thailand, is a city of misty mountains, ancient temples, and vibrant night markets. It is a place where tradition meets modernity, offering a peaceful escape from the bustle of the south.',
      'At AsiaByLocals, experience the magic of Chiang Mai with expert local guides. From the sacred Doi Suthep mountain to ethical elephant sanctuaries and traditional cooking classes, discover the authentic spirit of the "Rose of the North."'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Direct support to local communities',
      'Ethical, small-group experiences',
      'Support for local artisans and farmers'
    ],
    topAttractions: [
      'Doi Suthep',
      'Old City Temples',
      'Elephant Sanctuary (ethical only)',
      'Doi Inthanon',
      'Sunday Walking Street',
      'Night Bazaar',
      'Chiang Rai (White Temple)'
    ],
    bestTime: 'The best time to visit Chiang Mai is from November to February when the weather is cool and clear. Note that "burning season" (air pollution) typically occurs from February to April.',
    faqs: [
      {
        question: 'Are elephant sanctuaries in Chiang Mai ethical?',
        answer: 'AsiaByLocals only partners with 100% ethical sanctuaries that prioritize animal welfare, with no riding or circus-style shows.'
      },
      {
        question: 'How far is the White Temple from Chiang Mai?',
        answer: 'The White Temple (Wat Rong Khun) is in Chiang Rai, about a 3-hour drive from Chiang Mai. We offer full-day trips that cover the major highlights of Chiang Rai.'
      }
    ]
  },
  'Phuket': {
    title: 'Phuket Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Phuket with licensed local guides. Phi Phi Islands, Phang Nga Bay cruises, Big Buddha visits & Old Town tours.',
    intro: [
      'Phuket, Thailand\'s largest island, is a tropical paradise of turquoise waters, white sand beaches, and historic Sino-Portuguese charm. It serves as the gateway to the stunning Phi Phi Islands and Phang Nga Bay.',
      'At AsiaByLocals, discover Phuket through expert-led tours that go beyond the beaches. Explore the colorful Old Town, visit the iconic Big Buddha, and cruise the Andaman Sea in private speedboats or sunset catamarans with knowledgeable local experts.'
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Direct support to local communities',
      'Ethical, small-group experiences',
      'Safety-first approach for all water activities'
    ],
    topAttractions: [
      'Phi Phi Islands',
      'Phang Nga Bay / James Bond Island',
      'Big Buddha',
      'Wat Chalong',
      'Phuket Old Town',
      'Promthep Cape'
    ],
    bestTime: 'The best time to visit Phuket is from December to March (dry season). May to October is the monsoon season, which can bring heavy rain and rougher seas.',
    faqs: [
      {
        question: 'Which is better: Phi Phi Islands or Phang Nga Bay?',
        answer: 'Both are unique! Phi Phi offers iconic beaches like Maya Bay and snorkeling, while Phang Nga Bay is famous for its towering limestone cliffs and sea caves.'
      },
      {
        question: 'Is Phuket Old Town worth visiting?',
        answer: 'Absolutely. It offers a fascinating look at the island\'s tin-mining history through beautiful Sino-Portuguese architecture, street art, and legendary local cafes.'
      },
      {
        question: 'How do I get around Phuket for tours?',
        answer: 'Most of our tours include door-to-door hotel transfers in air-conditioned vans. For independent travel, you can use Grab, local buses (Songthaews), or rent a scooter if you are an experienced rider with a valid international permit.'
      },
      {
        question: 'What is the best way to see the Big Buddha?',
        answer: 'The Big Buddha is best visited in the early morning to avoid the heat and crowds. A private half-day tour that combines it with Wat Chalong is the most efficient way to see both landmarks comfortably.'
      },
      {
        question: 'Are the elephant tours ethical?',
        answer: 'Yes, at AsiaByLocals, we only partner with reputable sanctuaries that follow strict ethical guidelines: no riding, no performances, and a focus on animal welfare and education.'
      },
      {
        question: 'What should I pack for a boat tour?',
        answer: 'Pack sunscreen, a hat, sunglasses, swimwear, a change of clothes, and a waterproof bag for your phone and camera. Most boat tours provide snorkeling gear, life jackets, and towels.'
      },
      {
        question: 'Is Phuket safe for solo female travelers?',
        answer: 'Absolutely. Phuket is a very safe destination for solo female travelers. Our private tours with vetted local guides provide an extra layer of comfort and security.'
      },
      {
        question: 'Can I customize my Phuket tour?',
        answer: 'Yes! All our private tours are fully customizable. Whether you want to spend more time at a specific beach or add a stop at a local cafe, our guides are happy to tailor the itinerary.'
      }
    ]
  }
};

// Things to Do Section Component (GetYourGuide style)
interface ThingsToDoSectionProps {
  city: string;
}

const ThingsToDoSection: React.FC<ThingsToDoSectionProps> = ({ city }) => {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const thingsToDoData: Record<string, Array<{
    title: string;
    image: string;
    shortDescription: string;
    fullDescription: string;
    seoKeywords: string[];
    faqs?: Array<{ q: string; a: string }>;
  }>> = {
    'Agra': [
      {
        title: 'From Delhi: Taj Mahal & Agra Private Day Trip with Transfers',
        image: '/things-to-do/agra-taj-mahal-sunset.jpg',
        shortDescription: 'Begins your tour with the pickup from your hotel/airport in Delhi/Noida/Gurugram and depart to Agra. Meet your private guide when you arrive in Agra and proceed to the [Taj Mahal](/india/agra/agra-travel-guide-2026), a UNESCO World Heritage Site and a living monument, which silently whispers the love of legendary Mughal emperor Shah Jahan for his beloved wife Mumtaz Mahal.',
        fullDescription: 'Begins your tour with the pickup from your hotel/airport in Delhi/Noida/Gurugram and depart to Agra. Meet your private guide when you arrive in Agra and proceed to the Taj Mahal, a UNESCO World Heritage Site and a living monument, which silently whispers the love of legendary Mughal emperor Shah Jahan for his beloved wife Mumtaz Mahal. Continue onto the second UNESCO World Heritage Site **Agra Fort**. The imposing red sandstone fort was built by Emperor Akbar in 1565 AD, it combines both Hindu and Central Asian architectural styles. Then take a break for lunch at a 5-star Hotel and enjoy a mouth-watering meal of local and international flavor. After lunch, head towards the marvelous **Tomb of Itmad-Ud-Daulah** also known as **Baby Taj**. This pure marble structure was constructed by Noor Jahan for her father. Your tour ends with a return journey back to your hotel/airport or desired location in Delhi/Noida/Gurugram. Check our [1-day travel guide](/india/agra/1-day-agra-itinerary) for more planning tips.',
        seoKeywords: ['Taj Mahal', 'Agra Fort', 'Delhi to Agra', 'private day trip', 'Baby Taj'],
        faqs: [
          {
            q: "What time do we leave Delhi for a Taj Mahal day tour?",
            a: "To maximize your day and experience the Taj Mahal at its most tranquil, we typically recommend a **3:00 AM or 4:00 AM departure** from Delhi. This early start allows you to reach Agra just as the gates open for sunrise, avoiding the heavy morning traffic on the Yamuna Expressway. However, we can arrange departures as late as 8:00 AM if you prefer a more relaxed schedule. Your private vehicle will pick you up directly from your hotel or the airport in Delhi, Noida, or Gurugram for a seamless start to your [Agra itinerary](/india/agra/1-day-agra-itinerary)."
          },
          {
            q: "How long is the Delhi to Agra drive and is the expressway safe?",
            a: "The drive from Delhi to Agra via the **Yamuna Expressway** typically takes between **3 to 3.5 hours**. This modern, 6-lane toll road is one of India's best highways, offering a smooth and safe journey. Our professional drivers are well-versed in the route and prioritize your safety. We include all toll taxes, parking, and fuel in your tour package, so there are no hidden costs. For those arriving from long-haul flights, this private transfer is the most comfortable way to transition from the capital to the heart of the Mughal Empire."
          },
          {
            q: "Is a same-day Taj Mahal tour from Delhi actually worth it?",
            a: "Absolutely—thanks to the ultra-fast Yamuna Expressway, a **same-day trip is the most popular way** to visit Agra. While an overnight stay has its charms, a well-structured [1-day itinerary](/india/agra/1-day-agra-itinerary) easily covers the Taj Mahal, Agra Fort, and a relaxed lunch. It is a highly efficient way to see India's most iconic monuments without the logistical overhead of switching hotels. By departing early, you can witness the sunrise, explore with your [licensed guide](/india/agra/things-to-do-in-agra), and be back in Delhi by late evening."
          },
          {
            q: "Do we travel in a fully private vehicle throughout the day?",
            a: "Yes, this is a **100% private door-to-door service**. Your dedicated air-conditioned vehicle and professional driver stay with you from the moment of pickup in Delhi until your return. You won't be sharing the car with independent travelers, allowing you total flexibility to stop for photos, coffee breaks, or to adjust your pace as needed. This privacy is essential for maintaining control over your schedule, especially when coordinating between the [strict monument timings](/india/agra/taj-mahal-opening-time) and your return travel plans."
          },
          {
            q: "Is it possible to customize the monument list or add stops?",
            a: "One of the key benefits of our private tours is **complete customizability**. While the standard route includes the Taj Mahal and Agra Fort, you can easily add stops at the **Baby Taj** or the **Mehtab Bagh** sunset gardens. If you have specific interests, such as visiting a local marble inlay workshop or exploring the old city's food scene, just let your guide know. We aim to provide a high-authority experience that matches your personal interests while ensuring you see the essential [must-visit attractions in Agra](/india/agra/agra-travel-guide-2026)."
          }
        ]
      },
      {
        title: 'From Delhi: Private Taj Mahal and Agra Day Tour with 5* Meal',
        image: '/things-to-do/agra-fort-gate.jpg',
        shortDescription: 'Experience a premium Private Taj Mahal and Agra Day Tour from Delhi, thoughtfully designed for comfort, flexibility, and unforgettable experiences. Includes a private chauffeur pick-up from Delhi in an air-conditioned car.',
        fullDescription: 'Experience a premium Private Taj Mahal and Agra Day Tour from Delhi, thoughtfully designed for comfort, flexibility, and unforgettable experiences. Includes a private chauffeur pick-up from Delhi in an air-conditioned car. Visit the world-famous Taj Mahal, one of the Seven Wonders of the World. For early risers, an optional [sunrise visit](/india/agra/taj-mahal-opening-time) offers fewer crowds, and exceptional photo opportunities. Explore the majestic **Agra Fort** (a UNESCO World Heritage Site), this site used to be the home to Mughal emperors before Delhi became the capital of India. If time permits, visit **Itimad-ud-Daulah**, often called the **Baby Taj**, known for its intricate marble inlay work. Enjoy a delicious 5-star breakfast or lunch at a premium restaurant. Experience personalized service, flexible timing, expert guidance, and a stress-free return to Delhi the same day.',
        seoKeywords: ['Taj Mahal sunrise', 'Agra Fort', '5-star meal', 'premium tour', 'private tour']
      },
      {
        title: 'Book Official Tour Guide for Taj Mahal (ASI Licensed)',
        image: '/things-to-do/agra-official-guide.jpg',
        shortDescription: 'Secure a professional, Ministry of Tourism licensed guide for your Taj Mahal visit. Deep dive into Mughal history, architecture, and the hidden stories of the Taj.',
        fullDescription: 'Don\'t leave your Taj Mahal experience to chance. Book a verified, **ASI-licensed historian** who can navigate the crowds, explain the optical illusions in the calligraphy, and provide the deep cultural context of the Mughal Empire. Our official guides are government-vetted professionals who ensure you skip the unsolicited \'lapka\' touts and receive 100% accurate historical data. The tour includes personalized storytelling, photography assistance, and a flexible pace tailored to your interests. Check our [guide verification tips](/india/agra/agra-travel-guide-2026) for more.',
        seoKeywords: ['official guide Taj Mahal', 'ASI licensed guide', 'hiring guide Agra', 'historian tour Taj', 'verified guide'],
        faqs: [
          {
            q: "What makes a guide 'official' at the Taj Mahal?",
            a: "An **'official' guide** is a professional who has been rigorously vetted and licensed by the **Ministry of Tourism, Government of India (ASI)**. These experts are the only individuals legally authorized to conduct tours inside the Taj Mahal complex. Unlike unofficial 'street guides' or commission-based touts, official guides have a deep, academic understanding of Mughal history and architecture. When you book an official guide, you are guaranteed an experience supported by historical accuracy and cultural sensitivity."
          },
          {
            q: "How long does the guided portion of the visit last?",
            a: "A standard high-authority tour of the Taj Mahal typically lasts between **2 to 2.5 hours**. This allows your guide enough time to explain the [gate architecture](/india/agra/taj-mahal-opening-time), the symmetrical gardens, and the intricate marble inlay work of the main mausoleum. If you choose a combined tour with the **Agra Fort**, the total guided time extends to approximately 5 hours. Our guides are flexible and can adjust the depth of storytelling based on your interest level and schedule."
          },
          {
            q: "Is the guide fee separate from the entry ticket?",
            a: "Yes, in the 'Guide Only' booking category, the fee covers the professional services of the historian. You must either have your [pre-booked digital tickets](/india/agra/taj-mahal-ticket-price-2026) ready or we can assist you in purchasing them at the gate (though we strongly recommend booking online 48 hours in advance to avoid queues). For a fully hassle-free experience, we recommend our 'All-Inclusive' tours which cover the guide, transport, and all monument entry fees in a single price."
          }
        ]
      },
      {
        title: 'Skip-The-Line Taj Mahal Sunrise Tour With Guide',
        image: '/things-to-do/agra-taj-mahal-garden.jpg',
        shortDescription: 'Tour begins with a pick up from hotel/airport or any requested location in Agra city, meet with tour guide and proceed to visit Taj Mahal with an [express entry ticket](/india/agra/taj-mahal-ticket-price-2026) and discover the marble mausoleum of the Taj Mahal in Agra at your own pace.',
        fullDescription: 'Tour begins with a pick up from hotel/airport or any requested location in Agra city, meet with tour guide and proceed to visit Taj Mahal with an express entry ticket and discover the marble mausoleum of the Taj Mahal in Agra at your own pace. After visiting Taj Mahal, take a break for breakfast at a multi cuisine restaurant (pay by your own). Later, visit the historic **Agra Fort**, another UNESCO World Heritage Site, this site used to be the home to Mughal emperors before Delhi became the capital of India. Be transferred back to your hotel/airport or any desired location in Agra after the tour ends. Note: The [Taj is strictly closed on Fridays](/india/agra/is-taj-mahal-closed-on-friday).',
        seoKeywords: ['Skip the line', 'Taj Mahal express entry', 'Agra Fort', 'private tour', 'Agra city tour'],
        faqs: [
          {
            q: "What time is hotel pickup for the sunrise tour in Agra?",
            a: "For a true Taj Mahal sunrise experience, your day begins while the city is still asleep. Typically, hotel pickup in Agra occurs between **5:15 AM and 5:45 AM**, depending on the specific month and official [sunrise timing](/india/agra/taj-mahal-opening-time). In the summer (April to July), the sun rises earlier, requiring a 5:15 AM start. In winter (December to February), fog can delay visibility, but we still pick you up by 5:45 AM to ensure we are among the first in the security queue. Entering early is the only way to witness the marble transition from soft grey to a brilliant golden pink before the mid-morning heat and crowds arrive."
          },
          {
            q: "Does skip-the-line mean skipping security too?",
            a: "It is important to understand that 'Skip-The-Line' applies specifically to the **official ASI ticket window**, which often has queues exceeding 45–60 minutes. It does **NOT** allow you to bypass the mandatory security screening. Every visitor, regardless of ticket type, must pass through the metal detectors and baggage checks conducted by the CISF. Our 'High-Value' tickets include priority positioning, but security remains a standard government protocol. To ensure the fastest throughput, we recommend bringing only your phone, camera, and water; avoid large bags, tripods, or prohibited items which cause delays at the scanners."
          },
          {
            q: "Is this an official licensed guide?",
            a: "Yes, all guides provided for this tour are strictly **government-approved and licensed by the Ministry of Tourism (ASI)**. This is a critical distinction, as only licensed guides are legally permitted to guide inside the Taj Mahal and Agra Fort complexes. Beyond their legal status, these guides are local historians who offer deep intellectual context into Mughal architecture, calligraphy illusions, and the political significance of the 'Zenana' quarters. Using a licensed professional protects you from [local scams](/india/agra/agra-travel-guide-2026) and ensures you receive accurate, verified historical storytelling rather than common street myths."
          },
          {
            q: "What if it is foggy during sunrise in winter?",
            a: "During the months of **December and January**, heavy morning fog is a common occurrence in the Yamuna River basin. While fog can obscure the monument's first light, it creates a unique, ethereal atmosphere that many professional photographers actually prefer. If visibility is extremely low at 6:00 AM, our guides will adjust the storytelling pace, focusing first on the external gate architecture and historical narratives, moving toward the mausoleum once the sun burns off the mist. Visibility usually improves significantly by 10:00 AM. Check our [timing guide](/india/agra/taj-mahal-opening-time) for monthly fog patterns."
          },
          {
            q: "Is this sunrise tour worth it?",
            a: "Absolutely. A sunrise visit is widely considered the **platinum standard** for visiting the Taj Mahal. Beyond the cooler temperatures, which are essential from March to June, the 'Blue Hour' and 'Golden Hour' provide lighting conditions that simply cannot be replicated at sunset. Furthermore, the crowd density at 6:00 AM is 70% lower than at noon, allowing for unobstructed views of the reflecting pools. For those on a [1-day itinerary](/india/agra/1-day-agra-itinerary), starting at sunrise is the only way to complete the Taj, Agra Fort, and a relaxed lunch before departing back to Delhi or Jaipur comfortably."
          }
        ]
      },
      {
        title: 'Taj Mahal Entry Ticket 2026 – Skip the Line',
        image: '/things-to-do/agra-taj-ticket.jpg',
        shortDescription: 'Official digital entry tickets for the Taj Mahal and Agra Fort. Skip the long ticket-window queues and enter directly through the security gates.',
        fullDescription: 'The Archaeological Survey of India (ASI) has transitioned to a 100% digital ticketing system. Avoid the frustration of the physical ticket counters, which can have wait times of over an hour during peak [October to March season](/india/agra/taj-mahal-opening-time). Our pre-booked QR-code tickets allow you to proceed straight to the security screening. All tickets include the mandatory main mausoleum supplement for access to the interior tomb area. Ensure you have your passport or ID ready for verification at the gate alongside your digital ticket. Check our [price breakdown](/india/agra/taj-mahal-ticket-price-2026) for details.',
        seoKeywords: ['Taj Mahal ticket', 'skip the line ticket', 'official ASI ticket', 'Taj Mahal entry fee', 'digital ticket Agra'],
        faqs: [
          {
            q: "Is the mausoleum access included in this ticket?",
            a: "Yes. Our 'Premium' entry tickets automatically include the **mandatory main mausoleum supplement**. As of 2026, the [official price structure](/india/agra/taj-mahal-ticket-price-2026) requires this extra fee (₹200) to climb the marble platform and enter the cenotaph chamber. Standard entry-only tickets do not allow access to the interior marble screens, so we always provide the comprehensive ticket to ensure you don't miss the heart of the Taj Mahal."
          },
          {
            q: "Do I skip the security line with this ticket?",
            a: "While this ticket allows you to **bypass the 60-minute ticket-window queue**, all visitors must still undergo the mandatory security screening by the CISF. No ticket type allows you to skip security. However, having your digital QR code ready significantly speeds up the process. We recommend reaching the gates by **5:30 AM** for a [sunrise visit](/india/agra/taj-mahal-opening-time) to be among the first in the security line before the mass-market tour buses arrive."
          },
          {
            q: "Is a printed copy of the ticket required?",
            a: "No, a **digital copy on your smartphone** is perfectly acceptable for the 2026 season. Simply show the QR code to the gate attendants for scanning. However, we recommend taking a screenshot of your ticket in case of poor mobile reception near the monument gates. You must also carry a valid government-issued ID or passport to match the name on the ticket, as security checks are increasing to prevent black-marketing of entry slots."
          }
        ]
      },
      {
        title: 'Agra: Taj Mahal & Agra Fort Private Tour with Female Guide',
        image: '/things-to-do/agra-female-guide-tour.jpg',
        shortDescription: 'Experience the Taj Mahal and Agra Fort with a licensed local female guide. Perfect for families and solo female travelers seeking a unique perspective on India\'s history and culture.',
        fullDescription: 'Discover the iconic Taj Mahal and the majestic **Agra Fort** through the eyes of a professional female guide. This private tour is specially designed to provide a safe, comfortable, and deeply insightful experience. Your guide will share fascinating stories about the Mughal Empire, focusing on the influential roles of women in that era, while ensuring you see the best of Agra\'s heritage sites. The tour includes skip-the-line entry, personalized storytelling, and a flexible itinerary that can be tailored to your interests, including visits to local handicraft workshops or the beautiful **Mehtab Bagh** garden. Check our [complete Agra guide](/india/agra/agra-travel-guide-2026) for the ultimate context on the Mughal Zenana.',
        seoKeywords: ['female guide Agra', 'solo female travel India', 'Taj Mahal private tour', 'Agra local expert', 'licensed female guide'],
        faqs: [
          {
            q: "Are the female guides licensed by the government?",
            a: "Every female guide we partner with is officially **licensed by the Ministry of Tourism, Government of India (ASI)**. This means they have undergone rigorous historical training, passed national level examinations, and are verified professionals legally authorized to guide in all national monuments. At AsiaByLocals, we prioritize licensed experts to ensure that you receive not only a safe and culturally sensitive experience but also a high-authority historical narrative that respects the [academic and architectural significance](/india/agra/agra-travel-guide-2026) of the Taj Mahal."
          },
          {
            q: "Is this tour suitable for solo female travelers?",
            a: "This tour is specifically engineered for **solo female travelers** seeking the highest level of comfort and security in Agra. Navigating monument crowds as a lone woman can sometimes feel overwhelming due to unsolicited attention from unofficial touts. A professional female guide acts as a 'cultural bridge' and a protective presence, allowing you to focus entirely on the beauty of the monuments. Our guides are also experts at recommending safe cafes and secure transportation, ensuring your [Agra itinerary](/india/agra/1-day-agra-itinerary) is both enriching and stress-free."
          },
          {
            q: "Can the guide assist with saree draping and photography?",
            a: "Yes, our female guides are experts in the traditional art of **saree draping** and can assist you with your outfit for that perfect cultural immersion. Furthermore, they are deeply familiar with the Taj Mahal's 'symmetry points'—the specific locations where you can capture iconic reflection shots without the crowds. They understand the aesthetic nuances that make for great travel memories and are happy to help you pose for professional-looking photos. This is part of the personalized service that makes our [female-led experiences](/india/agra/things-to-do-in-agra) so unique."
          },
          {
            q: "Can a female guide handle larger family groups?",
            a: "Absolutely. Our female guides are highly skilled in managing diverse groups, including families with young children or elderly travelers. They bring a patient, empathetic approach to storytelling that keeps children engaged with fun historical facts while addressing the logistical needs of older family members. Whether it's finding a shaded spot for a break or explaining the Mughal history in an accessible way, they ensure that everyone in the family has a meaningful and comfortable [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time)."
          },
          {
            q: "Is it worth booking a female guide over a standard tour?",
            a: "Booking a female guide offers a unique **'Zenana' perspective**—a focus on the powerful influence of Mughal empresses like Mumtaz Mahal and Nur Jahan that is often glossed over in standard tours. This narrative depth, combined with the added layer of safety and cultural comfort for women and families, makes it an exceptionally worthwhile investment. It provides a more intimate, conversational, and historically nuanced understanding of Agra's heritage that goes beyond just architectural dates and figures."
          }
        ]
      },
      {
        title: 'Book Tour Guide for Fatehpur Sikri Visit',
        image: '/things-to-do/agra-fatehpur-sikri.jpg',
        shortDescription: 'Explore the 16th-century "Ghost City" of Fatehpur Sikri with a professional local guide. Discover the architecture and legends of Emperor Akbar\'s former capital.',
        fullDescription: 'Located 40km from Agra, **Fatehpur Sikri** is a UNESCO World Heritage Site that served as the capital of the Mughal Empire for 14 years. Often overlooked by day-trippers, this sprawling complex of red sandstone palaces and mosques offers some of India\'s best-preserved Mughal architecture. Your professional guide will walk you through the Panch Mahal, the Diwan-i-Khas, and the magnificent Jama Masjid, sharing stories of Akbar\'s court and the Sufi saint Salim Chishti. This tour is perfect for those seeking a more tranquil, yet historically dense experience outside the bustling city center. Combine it with our [1-day itinerary](/india/agra/1-day-agra-itinerary) for the ultimate Agra experience.',
        seoKeywords: ['Fatehpur Sikri guide', 'Ghost City Agra', 'Akbar capital tour', 'Buland Darwaza', 'Mughal architecture tour'],
        faqs: [
          {
            q: "How far is Fatehpur Sikri from Agra and how do we get there?",
            a: "Fatehpur Sikri is located approximately **37 kilometers (23 miles)** west of Agra. The drive typically takes 1 to 1.5 hours depending on traffic. Most travelers visit Fatehpur Sikri either as a half-day trip from Agra or as a half-way stop while traveling between [Agra and Jaipur](/india/agra/1-day-agra-itinerary). We provide private air-conditioned vehicles for this journey, ensuring you can comfortably explore the rural landscapes before reaching the majestic gates of the city."
          },
          {
            q: "Is it worth the extra time compared to more time at the Taj?",
            a: "For anyone staying in Agra for more than 24 hours, Fatehpur Sikri is **essential**. It offers a completely different architectural language than the Taj Mahal. While the Taj is a marble monument of love, Fatehpur Sikri is a massive, red-sandstone testament to political power and urban living. It is far less crowded, allowing for a contemplative experience. Many who visit find it more evocative than the Taj due to the sheer scale of the palaces and the atmospheric presence of the 'Ghost City' ruins."
          },
          {
            q: "How much walking is involved in a Fatehpur Sikri tour?",
            a: "Fatehpur Sikri is a vast complex, and you should expect to walk approximately **2 to 3 kilometers** to see the main palace area and the congregational mosque. The terrain is relatively flat but involves stone pathways and several steps. We recommend wearing comfortable walking shoes and carrying a hat, as there is limited shade in the larger courtyards. Our guides pace the tour according to your comfort level, ensuring plenty of time for rest and photography in the cooler arcade areas."
          },
          {
            q: "Are guides required for Fatehpur Sikri?",
            a: "While you can explore on your own, a [licensed guide](/india/agra/things-to-do-in-agra) is highly recommended because the site is physically enormous and lacks descriptive signage. Without a guide, it is easy to miss the architectural significance of buildings like the 'Iron-Free' pillars or the intricate symbolism of the shared Hindu-Islamic design elements. Furthermore, a guide helps manage the aggressive local vendors and unauthorized touts at the entrance, ensuring you have a focused and accurate historical experience."
          }
        ]
      },
    ],
    'Delhi': [
      {
        title: 'Old Delhi Heritage Walk & Street Food Tour',
        image: '/things-to-do/junaid-ahmad-ansari-9WP-NVh2d6U-unsplash (1).jpg',
        shortDescription: 'Explore the historic lanes of Old Delhi, visit the magnificent Jama Masjid, and discover authentic street food in Chandni Chowk. Experience the vibrant culture and rich history of Delhi\'s oldest neighborhood with a local guide.',
        fullDescription: 'Explore the historic lanes of Old Delhi, visit the magnificent Jama Masjid, and discover authentic street food in Chandni Chowk. Experience the vibrant culture and rich history of Delhi\'s oldest neighborhood with a local guide. Your tour begins in the narrow, bustling streets of Old Delhi, where history comes alive. Visit the Jama Masjid, one of India\'s largest mosques, built by Emperor Shah Jahan in 1656. Walk through the colorful spice market of Khari Baoli, the largest wholesale spice market in Asia. Discover hidden gems like the Paranthe Wali Gali, famous for its traditional Indian flatbreads. Your guide will take you to trusted street food vendors where you can sample authentic Delhi delicacies like chaat, jalebi, and parathas. Learn about the Mughal history, colonial influences, and modern-day life in this fascinating part of Delhi.',
        seoKeywords: ['Old Delhi', 'heritage walk', 'street food tour', 'Jama Masjid', 'Chandni Chowk']
      },
      {
        title: 'Red Fort & India Gate Private Tour',
        image: '/things-to-do/dewang-gupta-tFqGkt0iwnc-unsplash.jpg',
        shortDescription: 'Visit the iconic Red Fort, a UNESCO World Heritage Site, and the majestic India Gate. Explore the rich history of Mughal Delhi and modern India\'s capital with an expert local guide.',
        fullDescription: 'Visit the iconic Red Fort, a UNESCO World Heritage Site, and the majestic India Gate. Explore the rich history of Mughal Delhi and modern India\'s capital with an expert local guide. The Red Fort, built by Emperor Shah Jahan in 1639, served as the main residence of Mughal emperors for nearly 200 years. Your guide will take you through the fort\'s impressive structures including the Diwan-i-Am (Hall of Public Audience), Diwan-i-Khas (Hall of Private Audience), and the beautiful gardens. Learn about the fort\'s significance during India\'s independence movement. Then, visit India Gate, a war memorial dedicated to Indian soldiers who died in World War I. The monument stands as a symbol of national pride and is surrounded by beautiful gardens. Your guide will share stories of Delhi\'s transformation from Mughal capital to modern India\'s political center.',
        seoKeywords: ['Red Fort', 'India Gate', 'UNESCO World Heritage', 'Mughal Delhi', 'Delhi monuments']
      },
      {
        title: 'Qutub Minar & Humayun\'s Tomb Heritage Tour',
        image: '/things-to-do/sreehari-devadas-j4hGnHYl8ic-unsplash.jpg',
        shortDescription: 'Discover two UNESCO World Heritage Sites: the towering Qutub Minar and the beautiful Humayun\'s Tomb. Explore Delhi\'s ancient Islamic architecture and learn about the city\'s rich historical legacy.',
        fullDescription: 'Discover two UNESCO World Heritage Sites: the towering Qutub Minar and the beautiful Humayun\'s Tomb. Explore Delhi\'s ancient Islamic architecture and learn about the city\'s rich historical legacy. Qutub Minar, built in the 12th century, is the world\'s tallest brick minaret at 73 meters. The complex includes ancient ruins, the Iron Pillar that has stood rust-free for over 1,600 years, and beautiful Indo-Islamic architecture. Your guide will explain the minaret\'s history and the Qutub Complex\'s significance. Then, visit Humayun\'s Tomb, a masterpiece of Mughal architecture that inspired the Taj Mahal\'s design. Built in 1570, this magnificent mausoleum is set in beautiful gardens and represents the first garden-tomb on the Indian subcontinent. Your guide will share stories of the Mughal dynasty and explain how this tomb influenced later Mughal architecture.',
        seoKeywords: ['Qutub Minar', 'Humayun\'s Tomb', 'UNESCO World Heritage', 'Islamic architecture', 'Delhi heritage']
      },
      {
        title: 'Delhi City Tour: Old & New Delhi Full Day Experience',
        image: '/things-to-do/brijesh-anand-6eGxyrxTfD8-unsplash.jpg',
        shortDescription: 'Experience the best of both worlds with a comprehensive tour covering Old Delhi\'s historic sites and New Delhi\'s modern landmarks. Visit Red Fort, India Gate, Lotus Temple, and more in one day.',
        fullDescription: 'Experience the best of both worlds with a comprehensive tour covering Old Delhi\'s historic sites and New Delhi\'s modern landmarks. Visit Red Fort, India Gate, Lotus Temple, and more in one day. This full-day tour takes you through Delhi\'s fascinating history, from ancient monuments to modern architecture. Start with Old Delhi, visiting the Red Fort and Jama Masjid. Then explore New Delhi, including India Gate, the Parliament House area, and the beautiful Lotus Temple, a Bahá\'í House of Worship known for its unique flower-like architecture. Drive past the Rashtrapati Bhavan (Presidential Palace) and other government buildings. Your guide will explain Delhi\'s role as India\'s capital, its diverse cultures, and how the city has evolved over centuries. This tour offers a complete overview of Delhi\'s most important sites and is perfect for first-time visitors.',
        seoKeywords: ['Delhi city tour', 'Old Delhi', 'New Delhi', 'full day tour', 'Delhi landmarks']
      },
      {
        title: 'Delhi/Jaipur/Agra: Private One-Way Transfer',
        image: '/things-to-do/shared-private-transfer.jpg', // Shared image for all cities
        shortDescription: 'Enjoy a private transfer from Delhi, Agra, or Jaipur with driver in a private air-conditioned car. Be picked up from your preferred location and taken to your destination hassle-free.',
        fullDescription: 'Enjoy a private transfer from Delhi, Agra, or Jaipur with driver in a private air-conditioned car. Be picked up from your preferred location, whether it\'s the airport or your hotel, and be taken to your hotel or the airport in Delhi, Jaipur, or Agra. Don\'t waste your time trying to find a taxi and haggling over prices, pre-book your convenient transfer and have a more relaxing vacation. Sit back and relax knowing you\'re in safe hands and will end up exactly where you want to be. Sip on free water during the drive. The vehicle used depends on the number of people being transported: 1 to 3 people - AC Sedan, Toyota Etios, or Maruti Swift Dzire; 4 to 6 people - A/C Kia Carens or Innova; 12 to 26 people - Tempo Traveller or Mini Bus. Professional drivers ensure safe and comfortable journeys between these major tourist destinations.',
        seoKeywords: ['private transfer', 'Delhi Jaipur Agra', 'airport transfer', 'private car', 'Golden Triangle transfer']
      }
    ],
    'Jaipur': [
      {
        title: 'Jaipur: Private Sightseeing Day Tour with Guide by Car',
        image: '/things-to-do/jaipur-sightseeing-tour.jpg',
        shortDescription: 'Experience the rich culture and heritage of Jaipur on this full-day sightseeing tour. Visit Hawa Mahal, Amber Fort, City Palace, Jantar Mantar, and more with an expert local guide.',
        fullDescription: 'Experience the rich culture and heritage of Jaipur on this full-day sightseeing tour. Visit Hawa Mahal, Amber Fort, City Palace, Jantar Mantar, and more with an expert local guide. 1. Hawa Mahal - See the famous Hawa Mahal, or Palace of Winds, built by Maharaja Sawai Pratap Singh. Its many small windows and arches let royal women observe the city unseen. Duration: 1 hour. 2. Amber Fort and Palace - Explore this 16th-century fortress of red sandstone and white marble on the Aravalli hills, showcasing Rajput and Mughal design, symbolizing royal grandeur. Duration: 2 hours. 3. Panna Meena Ka Kund - Visit this ancient stepwell near Amber Fort, noted for its symmetrical stairways and water-harvesting system. Duration: 30 minutes. 4. Jal Mahal - See the Water Palace floating on Man Sagar Lake, an 18th-century structure with an elegant red sandstone façade reflecting Rajput architecture. Duration: 30 minutes. 5. City Palace - Explore the former royal residence of Jaipur\'s Maharajas, commissioned by Maharaja Jai Singh II, featuring ornate courtyards, regal halls, and museums. Duration: 1 hour. 6. Jantar Mantar - Visit this 18th-century astronomical observatory and UNESCO World Heritage site, with nineteen colossal instruments, including the world\'s largest stone sundial. Duration: 1 hour. 7. Royal Gaitor Tumbas - Discover this site at the base of the Nahargarh hills with beautifully carved marble memorials honoring Jaipur\'s old rulers. Duration: 1 hour. Enjoy this full-day journey through Jaipur\'s rich history, royal culture, and beautiful buildings with the help of your expert guide.',
        seoKeywords: ['Jaipur sightseeing', 'Hawa Mahal', 'Amber Fort', 'City Palace', 'Jantar Mantar', 'full day tour']
      },
      {
        title: 'Private Full Day Sightseeing Tour By Car with Guide',
        image: '/things-to-do/jaipur-full-day-sightseeing.jpg',
        shortDescription: 'Comprehensive full-day tour covering Amber Fort, Panna Meena Ka Kund, Jal Mahal, Hawa Mahal, City Palace, Jantar Mantar, and Royal Gaitor Tumbas. Includes comfortable hotel pick-up and drop-off.',
        fullDescription: 'Comprehensive full-day tour covering Amber Fort, Panna Meena Ka Kund, Jal Mahal, Hawa Mahal, City Palace, Jantar Mantar, and Royal Gaitor Tumbas. Includes comfortable hotel pick-up and drop-off. Start with Amber Fort and Palace, an exemplary blend of Hindu and Muslim architecture, constructed of red sandstone and white marble. Explore grand courtyards, the stunning Sheesh Mahal, Ganesh Pol, and royal chambers as your expert guide shares fascinating Rajput history and architectural secrets. Visit Panna Meena Ka Kund, a historic 16th-century stepwell with symmetrical stairways and an efficient rainwater catchment system, located near Amber Fort. See Jal Mahal, a captivating 18th-century water palace amidst Man Sagar Lake, showcasing Rajput culture with its red sandstone structure. After lunch, visit Hawa Mahal (Palace of Winds), envisioned by Sawai Pratap Singh, featuring tiered arches and intricate latticework screens. Explore City Palace, the Maharaja\'s City Palace built by Maharaja Jai Singh, housing the erstwhile royal family. Discover Jantar Mantar, a UNESCO World Heritage site with nineteen astronomical instruments built by Rajput king Sawai Jai Singh, including the world\'s largest stone sundial. End with Royal Gaitor Tumbas, an 18th-century complex adorned with intricate carvings and dedicated temples. Includes a 10-15 minute visit to a workshop for traditional crafts like hand block printing and stone cutting - an educational experience with no pressure to buy.',
        seoKeywords: ['Jaipur full day tour', 'Amber Fort', 'City Palace', 'Hawa Mahal', 'Jantar Mantar', 'private tour']
      },
      {
        title: 'From Jaipur: Ranthambore National Park Day Trip with Safari',
        image: '/things-to-do/jaipur-ranthambore-safari.jpg', // Tiger image
        shortDescription: 'Embark on an exciting day trip from Jaipur to Ranthambore National Park for a thrilling wildlife safari. Spot Bengal tigers, leopards, crocodiles, and diverse birdlife in their natural habitat.',
        fullDescription: 'Embark on an exciting day trip from Jaipur to Ranthambore National Park for a thrilling wildlife safari. Spot Bengal tigers, leopards, crocodiles, and diverse birdlife in their natural habitat. Be picked up from your Jaipur hotel or airport for a 3 to 4-hour scenic drive to Ranthambore National Park, admiring views of the Aravalli Hills, villages, and greenery along the way. Arrive in Sawai Madhopur for an afternoon safari led by a naturalist guide. Explore the park in an open 6-seater Jeep or 20-seater canter, encountering wildlife such as majestic Bengal tigers lounging in the shade, crocodiles basking in the sun, and leopards prowling through the undergrowth. Spot colorful birds flitting among the trees. Your guide will share insights into the park\'s ecology, animal behavior, and conservation efforts. Ranthambore is one of India\'s best tiger reserves, known for its high tiger density and beautiful landscapes. The park also features the historic Ranthambore Fort, adding to its scenic beauty. After the safari, enjoy a comfortable return drive to Jaipur with drop-off at your hotel or airport.',
        seoKeywords: ['Ranthambore National Park', 'tiger safari', 'wildlife tour', 'Bengal tiger', 'Jaipur day trip']
      },
      {
        title: 'Delhi/Jaipur/Agra: Private One-Way Transfer',
        image: '/things-to-do/shared-private-transfer.jpg', // Shared image for all cities
        shortDescription: 'Enjoy a private transfer from Delhi, Agra, or Jaipur with driver in a private air-conditioned car. Be picked up from your preferred location and taken to your destination hassle-free.',
        fullDescription: 'Enjoy a private transfer from Delhi, Agra, or Jaipur with driver in a private air-conditioned car. Be picked up from your preferred location, whether it\'s the airport or your hotel, and be taken to your hotel or the airport in Delhi, Jaipur, or Agra. Don\'t waste your time trying to find a taxi and haggling over prices, pre-book your convenient transfer and have a more relaxing vacation. Sit back and relax knowing you\'re in safe hands and will end up exactly where you want to be. Sip on free water during the drive. The vehicle used depends on the number of people being transported: 1 to 3 people - AC Sedan, Toyota Etios, or Maruti Swift Dzire; 4 to 6 people - A/C Kia Carens or Innova; 12 to 26 people - Tempo Traveller or Mini Bus. Professional drivers ensure safe and comfortable journeys between these major tourist destinations.',
        seoKeywords: ['private transfer', 'Delhi Jaipur Agra', 'airport transfer', 'private car', 'Golden Triangle transfer']
      }
    ],
    'Mumbai': [
      {
        title: 'Mumbai: Elephanta Caves Half-Day Guided Tour with Ferry',
        image: 'https://images.unsplash.com/photo-1628522339678-75218d6f5193?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Take a ferry from the Gateway of India to explore the ancient rock-cut temples of Elephanta Island. Discover 5th-century sculptures dedicated to Lord Shiva with an expert guide.',
        fullDescription: 'Take a ferry from the Gateway of India to explore the ancient rock-cut temples of Elephanta Island. Discover 5th-century sculptures dedicated to Lord Shiva with an expert guide. Your tour begins at the iconic Gateway of India, where you board a ferry for a scenic hour-long ride across Mumbai Harbour to Elephanta Island. Upon arrival, take a toy train or walk up the steps to the UNESCO World Heritage caves. Your guide will explain the history, mythology, and architectural significance of these 5th-century rock-cut temples. Marvel at the main cave\'s massive pillars and the famous Trimurti sculpture, depicting the three faces of Lord Shiva. Explore the smaller Buddhist stupa caves and enjoy panoramic views of the ocean before returning to Mumbai.',
        seoKeywords: ['Elephanta Caves', 'Mumbai caves', 'Gateway of India ferry', 'UNESCO World Heritage', 'rock-cut temples']
      },
      {
        title: 'Mumbai: Dharavi Slum Tour & Dhobi Ghat Experience',
        image: 'https://images.unsplash.com/photo-1570183244247-4952d75f306d?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Gain a unique perspective on Mumbai with an ethical walking tour of Dharavi. Witness the incredible industry and community spirit, then visit Dhobi Ghat, the world\'s largest open-air laundry.',
        fullDescription: 'Gain a unique perspective on Mumbai with an ethical walking tour of Dharavi. Witness the incredible industry and community spirit, then visit Dhobi Ghat, the world\'s largest open-air laundry. This tour challenges stereotypes by showcasing Dharavi as the economic engine it is. Visit small-scale industries producing leather, pottery, textiles, and recycled plastics, generating over $665 million annually. Meet local residents and learn about their daily lives, education, and community initiatives. Your guide, often from the community, ensures a respectful and insightful experience. Afterward, visit Dhobi Ghat to see hundreds of dhobis (washermen) washing clothes in traditional open-air troughs, a practice unchanged for over a century. This tour offers a profound understanding of Mumbai\'s resilience and industriousness.',
        seoKeywords: ['Dharavi slum tour', 'Dhobi Ghat', 'Mumbai walking tour', 'ethical tourism', 'community tour']
      },
      {
        title: 'Mumbai: Private Bollywood Studio Tour & Live Filming',
        image: 'https://images.unsplash.com/photo-1594165565349-2e6730302eb6?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Step into the glitz and glamour of Bollywood with a private studio tour. Visit film sets, learn about special effects, and try your hand at dubbing or dance moves.',
        fullDescription: 'Step into the glitz and glamour of Bollywood with a private studio tour. Visit film sets, learn about special effects, and try your hand at dubbing or dance moves. Mumbai is the heart of the Indian film industry, and this tour gives you a behind-the-scenes look. Visit a working film studio to see specially designed sets like a police station, hospital, or temple. Learn about the history of Bollywood, the filmmaking process, and advancements in VFX. If lucky, you might catch a glimpse of a live shoot (subject to availability). The tour includes fun interactive experiences like recording a song in a dubbing studio or learning a few Bollywood dance steps. It\'s a fun and colorful immersion into the world of Indian cinema.',
        seoKeywords: ['Bollywood tour', 'Mumbai film city', 'studio tour', 'Indian cinema', 'live filming']
      },
      {
        title: 'Mumbai: Private Airport Transfer to/from Hotel',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Enjoy a stress-free start or end to your Mumbai trip with a private airport transfer. reliable pick-up from Chhatrapati Shivaji Maharaj International Airport (BOM) to your hotel.',
        fullDescription: 'Enjoy a stress-free start or end to your Mumbai trip with a private airport transfer. Reliable pick-up from Chhatrapati Shivaji Maharaj International Airport (BOM) to your hotel in South Mumbai, Bandra, or Juhu. Your professional driver will wait for you at the arrivals hall with a name placard, assist with your luggage, and drive you safely to your destination in a comfortable, air-conditioned car. Avoid the hassle of negotiating with taxi drivers or navigating public transport with luggage. We monitor flight arrivals to account for delays, ensuring your driver is there when you land. Transfers are also available from your hotel to the airport for your departure flight.',
        seoKeywords: ['Mumbai airport transfer', 'BOM airport taxi', 'private car Mumbai', 'airport pickup', 'chauffeur service']
      }
    ],
    'Varanasi': [
      {
        title: 'Varanasi: Sunrise Boat Ride & Ganga Aarti Tour',
        image: 'https://images.unsplash.com/photo-1561361513-35bd4e7d07e3?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Experience the spiritual heart of India with a sunrise boat ride on the Ganges. Witness morning rituals on the ghats and return in the evening for the mesmerizing Ganga Aarti ceremony.',
        fullDescription: 'Experience the spiritual heart of India with a sunrise boat ride on the Ganges. Witness morning rituals on the ghats and return in the evening for the mesmerizing Ganga Aarti ceremony. Your day begins before dawn with a serene boat ride along the sacred river. Watch the city wake up as devotees perform morning prayers and ablutions in the holy water. See the burning ghats of Manikarnika and learn about the cycle of life and death in Hinduism. Walk through the narrow lanes of the old city, visiting the Kashi Vishwanath Temple. In the evening, witness the spectacular Ganga Aarti at Dashashwamedh Ghat, where priests perform a synchronized ritual with fire, incense, and chanting, creating a deeply spiritual atmosphere.',
        seoKeywords: ['Varanasi boat ride', 'Ganga Aarti', 'sunrise tour', 'Kashi Vishwanath', 'Ganges river']
      },
      {
        title: 'Sarnath Day Tour: Place of Buddha\'s First Sermon',
        image: 'https://images.unsplash.com/photo-1572886737332-9a0082f4817a?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Visit Sarnath, a major Buddhist pilgrimage site where Lord Buddha delivered his first sermon. Explore the Dhamek Stupa, ancient ruins, and the Sarnath Archaeological Museum.',
        fullDescription: 'Visit Sarnath, a major Buddhist pilgrimage site where Lord Buddha delivered his first sermon. Explore the Dhamek Stupa, ancient ruins, and the Sarnath Archaeological Museum. Located just 10km from Varanasi, Sarnath is a peaceful contrast to the bustling city. It is here that Buddha first taught the Dharma after attaining enlightenment. Visit the massive Dhamek Stupa, dating back to 500 CE, and the ruins of ancient monasteries. See the Ashoka Pillar, whose lion capital is India\'s national emblem. Explore the Mulagandhakuti Vihara temple with its beautiful frescoes depicting Buddha\'s life. The nearby Archaeological Museum houses a superb collection of Buddhist art and sculptures. This tour offers a profound insight into the origins of Buddhism.',
        seoKeywords: ['Sarnath tour', 'Buddhist pilgrimage', 'Dhamek Stupa', 'Buddha sermon', 'Varanasi day trip']
      },
      {
        title: 'Varanasi: Private City & Temple Walking Tour',
        image: 'https://images.unsplash.com/photo-1596541223961-758b9f7a77d7?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Explore the "City of Temples" on a private walking tour. Visit the famous Kashi Vishwanath Temple, Sankat Mochan, and Durga Temple while navigating the vibrant narrow alleys.',
        fullDescription: 'Explore the "City of Temples" on a private walking tour. Visit the famous Kashi Vishwanath Temple, Sankat Mochan, and Durga Temple while navigating the vibrant narrow alleys. Varanasi is one of the world\'s oldest living cities, and its spiritual energy is best experienced on foot. Visit the Golden Temple (Kashi Vishwanath), dedicated to Lord Shiva and the most important temple in Varanasi. (Note: Foreigners may have restricted access to the inner sanctum). Explore the Monkey Temple (Sankat Mochan) surrounded by greenery and the red-colored Durga Temple. Navigate the labyrinthine lanes (galis) of Godowlia, filled with shops selling silk, spices, and sweets. Taste local treats like "Mallaiyo" (seasonal) or "Lassi" and soak in the timeless atmosphere of this holy city.',
        seoKeywords: ['Varanasi temples', 'walking tour', 'Kashi Vishwanath', 'old city Varanasi', 'spiritual tour']
      },
      {
        title: 'Varanasi: Private Airport Transfer',
        image: 'https://images.unsplash.com/photo-1599540061218-c288593a2aee?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Ensure a smooth arrival or departure in Varanasi with a private transfer between Lal Bahadur Shastri International Airport (VNS) and your hotel.',
        fullDescription: 'Ensure a smooth arrival or departure in Varanasi with a private transfer between Lal Bahadur Shastri International Airport (VNS) and your hotel. Avoid the chaos of finding a taxi upon arrival. Your professional driver will greet you at the airport, assist with luggage, and drive you comfortably to your accommodation in Varanasi city or the ghats area. For departures, enjoy a punctual pick-up from your hotel to reach the airport on time. Our air-conditioned cars provide a respite from the city\'s heat and bustle, ensuring a relaxed start or end to your spiritual journey.',
        seoKeywords: ['Varanasi airport transfer', 'VNS airport taxi', 'private car Varanasi', 'airport pickup', 'hassle-free transfer']
      }
    ],
    'Udaipur': [
      {
        title: 'Udaipur: City Palace & Lake Pichola Boat Ride Tour',
        image: 'https://images.unsplash.com/photo-1595267154095-2c813fd4e304?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Discover the grandeur of the City Palace complex and enjoy a scenic boat ride on Lake Pichola. Visit Jag Mandir Island and admire the stunning architecture reflecting in the lake.',
        fullDescription: 'Discover the grandeur of the City Palace complex and enjoy a scenic boat ride on Lake Pichola. Visit Jag Mandir Island and admire the stunning architecture reflecting in the lake. Start your tour at the majestic City Palace, Rajasthan\'s largest palace complex, built over 400 years. Explore its labyrinths of courtyards, balconies, and halls adorned with mirrors and paintings. Visit the Crystal Gallery and the vintage car museum. In the evening, board a boat for a romantic cruise on Lake Pichola. Sail past the Lake Palace (now a luxury hotel) and stop at Jag Mandir Island, a 17th-century palace where you can stroll in the gardens and enjoy panoramic views of the city skyline and the Aravalli hills during sunset.',
        seoKeywords: ['City Palace Udaipur', 'Lake Pichola boat ride', 'Jag Mandir', 'Udaipur sightseeing', 'sunset cruise']
      },
      {
        title: 'Udaipur: Monsoon Palace & Fateh Sagar Lake Sunset',
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Visit the hilltop Monsoon Palace (Sajjangarh) for breathtaking panoramic views. Later, enjoy a relaxing evening at Fateh Sagar Lake, popular for its sunset views and street food.',
        fullDescription: 'Visit the hilltop Monsoon Palace (Sajjangarh) for breathtaking panoramic views. Later, enjoy a relaxing evening at Fateh Sagar Lake, popular for its sunset views and street food. Drive up the Bansdara hills to the Monsoon Palace, built in 1884 to watch the monsoon clouds. The palace offers the best vantage point in Udaipur, providing bird\'s-eye views of the city, lakes, and surrounding countryside – perfect for photography. Afterward, head to Fateh Sagar Lake, a picturesque artificial lake. Take a walk along the promenade, enjoy a boat ride to Nehru Park island, or savor local snacks like "Kulhad Coffee" at the lakeside stalls known as Bombay Market. It\'s a favorite spot for locals to unwind and enjoy the cool breeze.',
        seoKeywords: ['Monsoon Palace', 'Sajjangarh', 'Fateh Sagar Lake', 'Udaipur panoramic view', 'sunset point']
      },
      {
        title: 'Kumbhalgarh Fort & Ranakpur Jain Temple Day Trip',
        image: 'https://images.unsplash.com/photo-1598889980838-89c02fd76332?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Embark on a full-day excursion to the massive Kumbhalgarh Fort, with its Great Wall of India, and the exquisite Ranakpur Jain Temple, famous for its 1,444 stunning marble pillars.',
        fullDescription: 'Embark on a full-day excursion to the massive Kumbhalgarh Fort, with its Great Wall of India, and the exquisite Ranakpur Jain Temple, famous for its 1,444 stunning marble pillars. Drive through the Aravalli hills to Kumbhalgarh Fort, a UNESCO World Heritage Site with the second-longest wall in the world after China\'s. Explore its palaces, temples, and enjoy the stunning views. Then, proceed to Ranakpur (about 50km away) to visit the 15th-century Jain Temple dedicated to Adinatha. Marvel at its intricate architecture and the forest of white marble pillars, no two of which are carved alike. The serene atmosphere and artistic mastery make it one of India\'s most beautiful temples. This day trip combines military might and spiritual grace.',
        seoKeywords: ['Kumbhalgarh Fort', 'Ranakpur Jain Temple', 'Udaipur day trip', 'Great Wall of India', 'marble temple']
      },
      {
        title: 'Udaipur: Private Airport Transfer',
        image: 'https://images.unsplash.com/photo-1545622359-86f31776ce8d?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Travel comfortably between Maharana Pratap Airport (UDR) and your Udaipur hotel with a private transfer. Reliable, air-conditioned car service for a stress-free journey.',
        fullDescription: 'Travel comfortably between Maharana Pratap Airport (UDR) and your Udaipur hotel with a private transfer. Reliable, air-conditioned car service for a stress-free journey. Whether arriving for a romantic getaway or business, start your trip right. Your driver will track your flight and meet you at the airport exit. Relax on the approx. 45-minute to 1-hour drive into the city, enjoying views of the Rajasthan countryside. We also offer timely drop-offs for your departure flight, ensuring you reach the airport with plenty of time to spare.',
        seoKeywords: ['Udaipur airport transfer', 'UDR airport taxi', 'private car Udaipur', 'airport pickup', 'hotel transfer']
      }
    ],
    'Jodhpur': [
      {
        title: 'Jodhpur: Mehrangarh Fort & Jaswant Thada Private Tour',
        image: 'https://images.unsplash.com/photo-1592398555610-d9da95ba324b?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Explore the imposing Mehrangarh Fort, one of India\'s largest forts, and the beautiful Jaswant Thada cenotaph. Discover the history and legends of the Rathore clan with an expert guide.',
        fullDescription: 'Explore the imposing Mehrangarh Fort, one of India\'s largest forts, and the beautiful Jaswant Thada cenotaph. Discover the history and legends of the Rathore clan with an expert guide. Rising 125 meters above the city, Mehrangarh Fort is a masterpiece of Rajput architecture. Visit its palaces like Moti Mahal (Pearl Palace) and Phool Mahal (Flower Palace), known for their exquisite carvings and stained glass. See the museum\'s collection of royal palanquins, arms, and paintings. From the ramparts, enjoy panoramic views of Jodhpur\'s iconic blue houses. Next, visit the nearby Jaswant Thada, a milky-white marble memorial built for Maharaja Jaswant Singh II. Its serene gardens and intricate marble lattice screens offer a peaceful retreat and great photo opportunities.',
        seoKeywords: ['Mehrangarh Fort', 'Jaswant Thada', 'Jodhpur sightseeing', 'Blue City view', 'private tour']
      },
      {
        title: 'Jodhpur: Blue City Heritage Walk & Market Tour',
        image: 'https://images.unsplash.com/photo-1534234828569-1f480393f9c6?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Walk through the winding blue-hued streets of the old city. Visit the Clock Tower market, stepwells, and interact with locals to experience the authentic vibe of Jodhpur.',
        fullDescription: 'Walk through the winding blue-hued streets of the old city. Visit the Clock Tower market, stepwells, and interact with locals to experience the authentic vibe of Jodhpur. Start at the bustling Ghanta Ghar (Clock Tower) area, delving into the Sadar Market where you can buy spices, textiles, and handicrafts. Your guide will lead you through narrow medieval lanes lined with indigo-painted houses that give the city its nickname. Visit the ancient Toorji Ka Jhalra stepwell, a stunning architectural feature recently restored. Learn about the caste system, local traditions, and the reason behind the blue color. Stop for a cup of masala chai or try the famous "Makhaniya Lassi" at a local shop.',
        seoKeywords: ['Blue City walk', 'Jodhpur heritage tour', 'Clock Tower market', 'Toorji Ka Jhalra', 'cultural walk']
      },
      {
        title: 'Jodhpur: Bishnoi Village Safari & Desert Experience',
        image: 'https://images.unsplash.com/photo-1472911762194-e0eb3f769bf7?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Experience rural Rajasthan with a jeep safari to Bishnoi villages. Meet the eco-friendly Bishnoi community, watch potters and weavers at work, and spot wildlife like blackbucks.',
        fullDescription: 'Experience rural Rajasthan with a jeep safari to Bishnoi villages. Meet the eco-friendly Bishnoi community, watch potters and weavers at work, and spot wildlife like blackbucks. The Bishnoi people are known for their staunch protection of nature. Visit their clean, mud-plastered homes and learn about their unique lifestyle and beliefs. See local artisans creating pottery and dhurrie rugs. On the safari, keep an eye out for desert wildlife such as blackbuck antelopes, chinkara gazelles, and migratory cranes at Guda Bishnoi Lake. This tour offers a genuine connection with the rural culture and natural beauty of the Thar Desert region.',
        seoKeywords: ['Bishnoi village safari', 'Jodhpur desert safari', 'rural Rajasthan', 'wildlife tour', 'cultural experience']
      },
      {
        title: 'Jodhpur: Private Airport Transfer',
        image: 'https://images.unsplash.com/photo-1582283995574-d4b68e92a83e?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Enjoy a convenient private transfer between Jodhpur Airport (JDH) and your hotel. Skip the taxi queues and travel safely in a clean, air-conditioned vehicle.',
        fullDescription: 'Enjoy a convenient private transfer between Jodhpur Airport (JDH) and your hotel. Skip the taxi queues and travel safely in a clean, air-conditioned vehicle. Whether you are arriving to explore the Blue City or catching a flight out, our professional drivers ensure a punctual and smooth service. We track your flight status to handle early arrivals or delays. Benefit from door-to-door service with luggage assistance, allowing you to relax and enjoy the views of this historic city.',
        seoKeywords: ['Jodhpur airport transfer', 'JDH airport taxi', 'private car Jodhpur', 'airport pickup', 'shuttle service']
      }
    ],
    'Kochi': [
      {
        title: 'Kochi: Private Backwater Houseboat Day Cruise',
        image: 'https://images.unsplash.com/photo-1593693397690-362cb96667e3?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Relax on a private houseboat cruise through the serene Kerala backwaters. Enjoy a traditional lunch on board while drifting past coconut palms, paddy fields, and local villages.',
        fullDescription: 'Relax on a private houseboat cruise through the serene Kerala backwaters. Enjoy a traditional lunch on board while drifting past coconut palms, paddy fields, and local villages. Drive from Kochi to Alleppey (approx. 1.5 hours) to board your private houseboat (Kettuvallam). Cruise along the tranquil canals and Vembanad Lake, the heart of Kerala\'s backwater network. Observe the slow-paced village life, fishermen casting nets, and ducks paddling by. Savor an authentic Kerala lunch prepared fresh on the boat, featuring local fish and spices. This day cruise offers the quintessential Kerala experience without an overnight stay, perfect for those with limited time.',
        seoKeywords: ['Kerala houseboat', 'Alleppey backwaters', 'day cruise', 'Kochi day trip', 'Kerala lunch']
      },
      {
        title: 'Fort Kochi & Mattancherry Heritage Walking Tour',
        image: 'https://images.unsplash.com/photo-1516027879685-645391d4e412?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Explore the colonial history of Fort Kochi. See the Chinese Fishing Nets, St. Francis Church, Jewish Synagogue, and Dutch Palace on a guided walking tour.',
        fullDescription: 'Explore the colonial history of Fort Kochi. See the Chinese Fishing Nets, St. Francis Church, Jewish Synagogue, and Dutch Palace on a guided walking tour. Discover the unique blend of Portuguese, Dutch, and British influences in this historic port town. Watch fishermen operate the iconic Chinese Fishing Nets at the waterfront. Visit St. Francis Church, the oldest European church in India. Walk through Jew Town to see the Paradesi Synagogue (closed Fridays/Saturdays) with its hand-painted tiles. Explore the Mattancherry Palace (Dutch Palace) known for its stunning murals of Hindu mythology. Your guide will narrate stories of the spice trade and the diverse communities that call Kochi home.',
        seoKeywords: ['Fort Kochi tour', 'Chinese Fishing Nets', 'Jewish Synagogue', 'Mattancherry Palace', 'heritage walk']
      },
      {
        title: 'Munnar Tea Garden & Hill Station Private Day Trip',
        image: 'https://images.unsplash.com/photo-1597818919632-15f5d88698bf?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Escape to the cool hills of Munnar on a private day trip. Visit lush tea plantations, the Tea Museum, Mattupetty Dam, and enjoy breathtaking mountain views.',
        fullDescription: 'Escape to the cool hills of Munnar on a private day trip. Visit lush tea plantations, the Tea Museum, Mattupetty Dam, and enjoy breathtaking mountain views. Drive from Kochi to Munnar (approx. 4 hours), winding through scenic Western Ghats roads lined with waterfalls and spice gardens. Visit the Tata Tea Museum to learn about tea processing and taste different varieties. Walk through emerald-green tea estates for photos. Stop at Mattupetty Dam and Echo Point for boat rides or just to admire the landscape. Breathe in the fresh mountain air and enjoy the serenity before returning to Kochi. This tour is a refreshing break from the coastal humidity.',
        seoKeywords: ['Munnar day trip', 'tea plantation tour', 'Kerala hill station', 'Tea Museum', 'Western Ghats']
      },
      {
        title: 'Kochi: Private Airport Transfer to/from Hotel/Resort',
        image: 'https://images.unsplash.com/photo-1549488346-63300a89aa7d?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Start your Kerala vacation smoothly with a private transfer from Cochin International Airport (COK). Reliable service to hotels in Fort Kochi, Ernakulam, or Alleppey.',
        fullDescription: 'Start your Kerala vacation smoothly with a private transfer from Cochin International Airport (COK). Reliable service to hotels in Fort Kochi, Ernakulam, or even Alleppey/Kumarakom resorts. Our driver will meet you at the arrival terminal with a pager board. Enjoy a comfortable ride in a clean, sanitized car to your destination. We accommodate all flight schedules, ensuring a safe transport even for late-night arrivals. Avoid the hassle of local taxis and enjoy a fixed-price, professional service.',
        seoKeywords: ['Kochi airport transfer', 'COK airport taxi', 'private car Kerala', 'airport pickup', 'Fort Kochi transfer']
      }
    ],
    'Goa': [
      {
        title: 'Goa: Old Goa Churches & Spice Plantation Tour',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Discover Goa\'s Portuguese heritage at UNESCO World Heritage churches. Then, stimulate your senses with a guided walk and lunch at a tropical spice plantation.',
        fullDescription: 'Discover Goa\'s Portuguese heritage at UNESCO World Heritage churches. Then, stimulate your senses with a guided walk and lunch at a tropical spice plantation. Visit Old Goa, the former capital of Portuguese India. Admire the Basilica of Bom Jesus, holding the remains of St. Francis Xavier, and the majestic Se Cathedral. Your guide will explain the history of Portuguese rule. Next, drive inland to a lush spice plantation. Take a guided walk to identify spices like cardamom, pepper, vanilla, and cinnamon growing in their natural habitat. Enjoy a traditional Goan buffet lunch served on banana leaves, accompanied by Feni tasting (local cashew spirit). This tour combines history, nature, and gastronomy perfectly.',
        seoKeywords: ['Old Goa churches', 'spice plantation tour', 'Basilica of Bom Jesus', 'Goan lunch', 'cultural tour']
      },
      {
        title: 'Goa: Island Hopping & Snorkeling Boat Trip',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Enjoy a fun-filled day at sea with an island hopping boat trip. Spot dolphins, snorkel in clear waters, try fishing, and enjoy a BBQ lunch on a secluded beach.',
        fullDescription: 'Enjoy a fun-filled day at sea with an island hopping boat trip. Spot dolphins, snorkel in clear waters, try fishing, and enjoy a BBQ lunch on a secluded beach. Set sail from the jetty towards Grand Island. Keep your camera ready for playful dolphins swimming alongside the boat. Anchor near the island for snorkeling; equipment is provided to help you see colorful coral and fish. Try your hand at traditional bottom fishing. Relax on a quiet beach like Monkey Beach for a delicious BBQ lunch (veg/non-veg options) with drinks. This group tour is perfect for water lovers and those looking to relax and have fun in the sun.',
        seoKeywords: ['Goa boat trip', 'Grand Island snorkeling', 'dolphin watching', 'island hopping', 'water sports']
      },
      {
        title: 'Goa: Dudhsagar Waterfalls & Jeep Safari Day Trip',
        image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Adventure into the jungle to see the majestic Dudhsagar Waterfalls. Enjoy a thrilling jeep safari through the Mollem National Park and swim in the natural pool.',
        fullDescription: 'Adventure into the jungle to see the majestic Dudhsagar Waterfalls. Enjoy a thrilling jeep safari through the Mollem National Park and swim in the natural pool. Drive to the Goa-Karnataka border to reach the base of one of India\'s tallest waterfalls. Transfer to a 4x4 jeep for an exciting off-road ride through the jungle and river crossings. Hike a short distance to the waterfall\'s base where you can spot monkeys and exotic birds. Take a refreshing dip in the cool waters of the natural pool at the falls\' foot. The "Sea of Milk" cascading down four tiers is a spectacular sight. On the way back, visit a spice farm for lunch (optional inclusion).',
        seoKeywords: ['Dudhsagar Waterfalls', 'Goa jeep safari', 'jungle trek', 'waterfall tour', 'nature trip']
      },
      {
        title: 'Goa: Private Airport Transfer (Dabolim/Mopa)',
        image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7c1f?auto=format&fit=crop&q=80&w=800',
        shortDescription: 'Start your beach holiday without stress. Pre-book a private transfer from Dabolim (GOI) or Mopa (GOX) Airport to your hotel in North or South Goa.',
        fullDescription: 'Start your beach holiday without stress. Pre-book a private transfer from Dabolim (GOI) or Mopa (GOX) Airport to your hotel in North or South Goa. Whether you\'re staying in Calangute, Baga, Panjim, or Palolem, we provide reliable transport. Your driver will meet you with a name sign, assist with bags, and drive you safely in a well-maintained AC car. No need to haggle with taxi drivers or wait in long queues. We offer 24/7 service to suit any flight time, ensuring you reach your resort comfortably and quickly.',
        seoKeywords: ['Goa airport transfer', 'private taxi Goa', 'Dabolim airport', 'Mopa airport', 'hotel transfer']
      }
    ],
    'Phuket': [
      {
        title: 'Phuket: Phi Phi Islands, Maya Bay & Khai Islands Speedboat Tour',
        image: '/things-to-do/phuket-phi-phi.jpg',
        shortDescription: 'Explore the world-famous Phi Phi Islands, swim in the turquoise waters of Maya Bay, and relax on the white sands of Khai Island on a full-day speedboat adventure.',
        fullDescription: 'Discover the stunning beauty of the Phi Phi Islands on a full-day speedboat tour from Phuket. Visit Maya Bay, made famous by the movie "The Beach," and swim in the emerald waters of Loh Samah Bay. Explore Viking Cave and see the playful monkeys at Monkey Beach. Enjoy a delicious buffet lunch on Phi Phi Don and spend the afternoon snorkeling among colorful coral reefs and tropical fish at Khai Island. This tour offers the perfect blend of relaxation, adventure, and breathtaking scenery.',
        seoKeywords: ['Phi Phi Islands', 'Maya Bay', 'speedboat tour', 'snorkeling Phuket', 'Khai Island']
      },
      {
        title: 'Phuket: Phang Nga Bay & James Bond Island Canoe Tour',
        image: '/things-to-do/phuket-james-bond.jpg',
        shortDescription: 'Journey through the spectacular limestone karts of Phang Nga Bay, visit the iconic James Bond Island, and explore hidden sea caves by canoe.',
        fullDescription: 'Experience the magical landscape of Phang Nga Bay on a full-day tour from Phuket. Visit Khao Phing Kan, popularly known as James Bond Island for its role in "The Man with the Golden Gun." Navigate through the emerald waters in a sturdy canoe, exploring hidden sea caves and mangroves at Hong Island. Visit the unique floating village of Koh Panyee, built entirely on stilts. Enjoy a traditional Thai lunch and relax on a secluded beach. This tour showcases the unique geology and culture of one of Thailand\'s most beautiful national parks.',
        seoKeywords: ['James Bond Island', 'Phang Nga Bay', 'canoe tour', 'Koh Panyee', 'limestone karsts']
      },
      {
        title: 'Phuket: Old Town Heritage Walk & Street Food Discovery',
        image: '/things-to-do/phuket-old-town.jpg',
        shortDescription: 'Step back in time with a walk through Phuket Old Town\'s colorful Sino-Portuguese streets. Discover hidden temples, local markets, and sample authentic Phuket street food.',
        fullDescription: 'Immerse yourself in the rich history and vibrant culture of Phuket Old Town. Stroll past beautifully preserved Sino-Portuguese mansions, colorful shophouses, and intricate murals while learning about the island\'s tin-mining heritage. Visit hidden Chinese temples and the bustling local market. Your expert guide will lead you to the best street food stalls to sample authentic Phuket dishes like Hokkien mee, Moo Hong, and traditional Thai desserts. This tour is a feast for the senses and a deep dive into the island\'s unique cultural tapestry.',
        seoKeywords: ['Phuket Old Town', 'heritage walk', 'street food', 'Sino-Portuguese architecture', 'cultural tour']
      },
      {
        title: 'Phuket: Big Buddha & Wat Chalong Private Half-Day Tour',
        image: '/things-to-do/phuket-big-buddha.jpg',
        shortDescription: 'Visit Phuket\'s most iconic spiritual landmarks: the majestic 45-meter tall Big Buddha and the stunning Wat Chalong, the island\'s largest and most important temple.',
        fullDescription: 'Discover the spiritual heart of Phuket on a private half-day tour. Ascend the Nakkerd Hills to visit the Big Buddha, a massive white marble statue that offers breathtaking 360-degree views of the island and the Andaman Sea. Then, visit Wat Chalong, the island\'s most revered temple, known for its beautiful architecture and many golden statues of Buddhist monks. Explore the Grand Pagoda, which is said to house a fragment of Lord Buddha\'s bone. This tour provides a peaceful and insightful look at Thai Buddhism and the island\'s religious traditions.',
        seoKeywords: ['Big Buddha Phuket', 'Wat Chalong', 'spiritual landmarks', 'panoramic views', 'religious heritage']
      },
      {
        title: 'Phuket: Elephant Jungle Sanctuary Ethical Experience',
        image: '/things-to-do/phuket-elephant.jpg',
        shortDescription: 'Spend a meaningful day with rescued elephants in a natural jungle environment. Learn about elephant conservation, feed them, and enjoy a mud spa with these gentle giants.',
        fullDescription: 'Visit the Elephant Jungle Sanctuary Phuket for an ethical and educational experience with rescued elephants. Learn about the history and behavior of these majestic creatures and the importance of conservation efforts in Thailand. Spend time interacting with the elephants in a respectful way—feed them their favorite snacks, walk with them through the jungle, and join them for a traditional mud spa and a refreshing bath in a natural pond. This "no-riding" sanctuary ensures the welfare and happiness of the elephants while providing visitors with an unforgettable connection to nature.',
        seoKeywords: ['ethical elephant sanctuary', 'elephant conservation', 'Phuket wildlife', 'nature experience', 'no-riding sanctuary']
      }
    ]
  };

  const thingsToDo = thingsToDoData[city] || [];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-black text-[#001A33] mb-8">
        Our Most Recommended Things to Do in {city}
      </h2>
      <div className="space-y-6">
        {thingsToDo.map((item, index) => {
          const isExpanded = expandedCards.has(index);
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-0">
                {/* Image Section - Smaller, less distracting */}
                <div className="md:w-1/4 lg:w-1/5 shrink-0 self-start">
                  <img
                    src={item.image}
                    alt={`${item.title} in ${city} `}
                    className="w-full h-40 md:h-40 object-cover"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    onError={(e) => {
                      // Fallback to placeholder if image not found
                      const target = e.target as HTMLImageElement;
                      // Try .avif extension if .jpg fails
                      if (target.src.endsWith('.jpg')) {
                        target.src = target.src.replace('.jpg', '.avif');
                      } else {
                        target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800';
                      }
                    }}
                  />
                </div>

                {/* Content Section - Expands/contracts independently */}
                <div className="md:w-3/4 lg:w-4/5 p-6 flex flex-col">
                  <h3 className="text-2xl font-black text-[#001A33] mb-3">
                    {item.title}
                  </h3>

                  <div className="text-[16px] text-gray-700 font-semibold leading-relaxed mb-4">
                    {/* Helper to render text with markdown-style links and bolding */}
                    {(() => {
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

                      return isExpanded ? (
                        <div className="space-y-4">
                          <p className="text-gray-800">{renderWithLinks(item.shortDescription)}</p>
                          <p className="text-gray-600 border-l-4 border-[#10B981]/20 pl-4 italic">{renderWithLinks(item.fullDescription)}</p>

                          {item.faqs && item.faqs.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                              <h4 className="text-lg font-black text-[#001A33] mb-4 flex items-center gap-2">
                                <HelpCircle size={20} className="text-[#10B981]" />
                                Tactical Tour Intelligence (FAQs)
                              </h4>
                              <div className="space-y-4">
                                {item.faqs.map((faq, fIdx) => (
                                  <div key={fIdx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <p className="font-black text-[#001A33] mb-2">Q: {faq.q}</p>
                                    <div className="text-gray-700 font-medium text-[15px] leading-relaxed">
                                      {renderWithLinks(faq.a)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p>{renderWithLinks(item.shortDescription)}</p>
                      );
                    })()}
                  </div>

                  {/* See More/Less Button */}
                  <button
                    onClick={() => toggleCard(index)}
                    className="text-[#10B981] font-bold text-[14px] hover:text-[#059669] transition-colors flex items-center gap-1 self-start mt-auto"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={16} />
                        See less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} />
                        See more
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Email Signup Box Component
interface EmailSignupBoxProps {
  city: string;
  country: string;
}

const EmailSignupBox: React.FC<EmailSignupBoxProps> = ({ city, country }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Pool of high-quality itinerary hero images for the waitlist box
  const itineraryImages = [
    '/itinerary-heroes/hero-1.jpg',
    '/itinerary-heroes/hero-2.jpg',
    '/itinerary-heroes/hero-3.jpg',
    '/agra-itinerary-hero.jpg',
    '/jaipur-itinerary-hero.jpg'
  ];

  // Select an image based on the city name to ensures it's different per page but stable for each city
  const imageIndex = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % itineraryImages.length;
  const imageSrc = itineraryImages[imageIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const response = await fetch(`${API_URL}/api/email/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          city,
          country,
          subscriptionType: 'itinerary'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="mb-12">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-[#10B981] p-8 text-center">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-2xl font-black text-white mb-2">Check Your Email!</h2>
            <p className="text-white opacity-95">
              We've sent you a verification email. Click the link to receive your {city} itinerary.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Image Section */}
          <div className="md:col-span-2 relative h-52 md:h-56 overflow-hidden bg-gray-100">
            <img
              src={imageSrc}
              alt={`${city} travel experience`}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </div>

          {/* Form Section */}
          <div className="md:col-span-1 bg-[#10B981]/10 p-4 md:p-5 flex flex-col justify-center relative z-20">
            <h2 className="text-xl md:text-2xl font-black text-[#001A33] mb-2">
              Your {city} itinerary is waiting
            </h2>
            <p className="text-[13px] md:text-[14px] text-[#001A33] mb-4 font-semibold">
              Receive a curated 48-hour itinerary featuring the most iconic experiences in {city}, straight to your inbox.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent text-[14px]"
                  disabled={loading}
                />
                <Mail size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>

              {error && (
                <p className="text-red-600 text-xs font-semibold">{error}</p>
              )}
            </form>
          </div>
        </div>

        {/* Privacy Disclaimer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200">
          <p className="text-[11px] text-gray-600 text-center">
            By signing up, you agree to receive promotional emails on activities and insider tips. You can unsubscribe or withdraw your consent at any time with future effect. For more information, read our{' '}
            <a href="/privacy-policy" className="underline text-[#10B981] hover:text-[#059669]">
              Privacy statement
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
};

const CityPage: React.FC<CityPageProps> = ({ country, city }) => {
  const [tours, setTours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTime, setLoadingTime] = useState(0);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('recommended');

  useEffect(() => {
    console.log('CityPage - useEffect triggered:', { country, city });
    if (country && city) {
      fetchTours();
    } else {
      console.warn('CityPage - Missing country or city:', { country, city });
      setTours([]);
      setLoading(false);
    }
  }, [country, city]);

  // Loading timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (loading) {
      setLoadingTime(0);
      interval = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading]);

  const fetchTours = async () => {
    setLoading(true);
    setLoadingTime(0);
    try {
      // Use relative path in development to leverage Vite proxy for mobile testing
      // In production, use VITE_API_URL or origin
      const API_URL = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001'));
      const url = `${API_URL}/api/public/tours?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}&status=approved`;
      console.log('CityPage - Fetching tours from:', url);
      console.log('CityPage - Country:', country, 'City:', city);

      const response = await fetch(url);
      console.log('CityPage - Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} `);
      }

      const data = await response.json();
      console.log('CityPage - Response data:', data);
      console.log('CityPage - Tours count:', data.tours?.length || 0);

      if (data.success) {
        // Handle both array and object responses
        let toursArray: any[] = [];

        if (Array.isArray(data.tours)) {
          toursArray = data.tours;
        } else if (data.tours && typeof data.tours === 'object') {
          // Handle nested structure
          if (Array.isArray(data.tours.tours)) {
            toursArray = data.tours.tours;
          } else if (data.count !== undefined && data.count === 0) {
            toursArray = [];
          }
        }

        console.log('CityPage - Parsed tours array length:', toursArray.length);
        console.log('CityPage - Raw data.tours:', data.tours);
        console.log('CityPage - Data count:', data.count);

        if (toursArray.length > 0) {
          // Ensure all tours have slugs
          const toursWithSlugs = toursArray.map((tour: any) => ({
            ...tour,
            slug: tour.slug || `tour - ${tour.id} ` // Fallback slug if missing
          }));
          console.log('CityPage - ✅ Setting tours:', toursWithSlugs.length);
          console.log('CityPage - Tour titles:', toursWithSlugs.map((t: any) => t.title));
          console.log('CityPage - First tour sample:', toursWithSlugs[0]);
          setTours(toursWithSlugs);
        } else {
          console.warn('CityPage - ⚠️ API returned success=true but no tours found');
          console.warn('CityPage - Data structure:', {
            success: data.success,
            tours: data.tours,
            toursType: typeof data.tours,
            toursIsArray: Array.isArray(data.tours),
            count: data.count,
            hasToursProperty: !!data.tours
          });
          setTours([]);
        }
      } else {
        console.error('CityPage - API returned success=false:', data);
        console.error('CityPage - Data structure:', {
          success: data.success,
          hasTours: !!data.tours,
          toursIsArray: Array.isArray(data.tours),
          toursType: typeof data.tours,
          error: data.error,
          message: data.message
        });
        setTours([]);
      }
    } catch (error: any) {
      console.error('CityPage - Error fetching tours:', error);
      console.error('CityPage - Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setTours([]);
    } finally {
      setLoading(false);
      // Note: tours.length here is the OLD state value (React state updates are async)
      // The actual tours will be logged in the setTours callback above
      console.log('CityPage - Loading complete');
    }
  };

  // Get city info with defaults
  const cityInfo = CITY_DESCRIPTIONS[city] || {
    title: `${city} Tours & Things to Do | Guided Experiences by Locals`,
    description: `Discover the best tours in ${city} with licensed local guides.Book authentic experiences and cultural tours.`,
    intro: [
      `${city} offers rich cultural experiences and historical sites waiting to be explored.`,
      `At AsiaByLocals, discover expert - led tours in ${city} hosted by licensed local guides.Explore authentic, locally curated experiences that showcase the best of ${city}.`
    ],
    whyBook: [
      'Licensed & experienced local experts',
      'Cultural and historical context you won\'t find in guidebooks',
      'Ethical, small-group experiences',
      'Direct support to local communities'
    ],
    topAttractions: [],
    bestTime: `The best time to visit ${city} is during the cooler months when weather is pleasant for sightseeing.`,
    faqs: []
  };

  // Filter tours
  const filteredTours = tours.filter(tour => {
    const matchesCategory = filterCategory === 'all' || tour.category === filterCategory;
    const matchesSearch = searchQuery === '' ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tour.shortDescription && tour.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Generate country slug
  const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
  const citySlug = city.toLowerCase().replace(/\s+/g, '-');

  // Preferred top-rated tours to prioritize in the list
  const preferredTitles = [
    'Book Official Tour Guide for Taj mahal',
    'Skip-The-Line Tajmahal Sunrise Tour With Guide'
  ];

  // Helper function to generate unique random rating between 4.0 and 5.0 for each tour
  const calculateRating = (tour: any) => {
    const title = tour.title?.toLowerCase() || '';
    const isPreferred = preferredTitles.some(pt => title.includes(pt.toLowerCase()));

    if (isPreferred) {
      // Force 4.9+ rating for preferred tours
      return 4.9 + (Math.random() * 0.1);
    }

    // Generate a consistent random rating based on tour ID
    const seed = parseInt(tour.id) || 0;
    const random = (seed * 9301 + 49297) % 233280;
    const normalized = random / 233280;

    // Scale down the non-preferred tours so they receive between 4.1 and 4.6
    return 4.1 + (normalized * 0.5);
  };

  // Sort tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortBy === 'recommended') {
      const aTitle = a.title?.toLowerCase() || '';
      const bTitle = b.title?.toLowerCase() || '';

      const aIndex = preferredTitles.findIndex(pt => aTitle.includes(pt.toLowerCase()));
      const bIndex = preferredTitles.findIndex(pt => bTitle.includes(pt.toLowerCase()));

      // Prioritize preferred tours first
      if (aIndex !== -1 && bIndex === -1) return -1;
      if (bIndex !== -1 && aIndex === -1) return 1;
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

      // Sort by rating (descending)
      const ratingA = calculateRating(a) || 0;
      const ratingB = calculateRating(b) || 0;
      return ratingB - ratingA;
    } else if (sortBy === 'price-low') {
      return a.pricePerPerson - b.pricePerPerson;
    } else if (sortBy === 'price-high') {
      return b.pricePerPerson - a.pricePerPerson;
    }
    return 0;
  });

  // SEO Structured Data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "name": `AsiaByLocals - ${city} Tours`,
        "description": cityInfo.description,
        "url": `https://asiabylocals.com/${countrySlug}/${citySlug}`,
        "image": tours[0]?.image || "",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city,
          "addressCountry": country
        },
        "areaServed": {
          "@type": "City",
          "name": city,
          "containedIn": {
            "@type": "Country",
            "name": country
          }
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": cityInfo.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      ...tours.map(tour => ({
        "@type": "Offer",
        "name": tour.title,
        "description": tour.shortDescription || tour.fullDescription,
        "price": tour.pricePerPerson,
        "priceCurrency": tour.currency,
        "availability": tour.status === 'approved' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      }))
    ]
  };

  // Removed manual SEO meta tag DOM updates in favor of Helmet

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{cityInfo.title}</title>
        <meta name="description" content={cityInfo.description} />
        <meta name="language" content="en" />
        <meta name="keywords" content={`${city} tours, ${city} experiences, ${country} tours, local guides ${city}, ${city} travel guide, things to do in ${city}, ${city} activities`} />
        <link rel="canonical" href={`https://www.asiabylocals.com/${countrySlug}/${citySlug}`} />
        <meta property="og:title" content={cityInfo.title} />
        <meta property="og:description" content={cityInfo.description} />
        <meta property="og:url" content={`https://www.asiabylocals.com/${countrySlug}/${citySlug}`} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="w-full h-16 sm:h-20 md:h-24 flex items-center justify-between px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-3 h-full">
            {/* Logo - Clickable to Homepage */}
            <a href="/" className="flex items-center h-full cursor-pointer">
              <img
                src="/logo.png"
                alt="Asia By Locals"
                className="h-[110px] sm:h-[100px] md:h-[105px] lg:h-[110px] xl:h-[120px] w-auto object-contain"
                style={{ transform: 'translateY(3px)' }}
              />
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-[13px] font-semibold text-[#001A33]">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              <button className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#10B981] p-1.5 sm:p-2 min-w-[44px] min-h-[44px] justify-center">
                <Globe size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden lg:block text-[11px]">EN/USD</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 sm:gap-1 hover:text-[#10B981] p-1.5 sm:p-2 min-w-[44px] min-h-[44px] justify-center">
                <User size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden lg:block text-[11px]">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>


      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '/';
            }
          }}
          className="flex items-center gap-2 text-[#10B981] hover:text-[#059669] font-semibold mb-4 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <Breadcrumbs country={country} city={city} />

        {/* H1 - SEO Gold (ONLY ONE H1) */}
        <h1 className="text-4xl md:text-5xl font-black text-[#001A33] mb-8">
          Guided Tours & Things to Do in {city}
        </h1>

        {/* Loading State - Show right after H1 */}
        {loading && (
          <div className="mb-8 bg-white rounded-2xl border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center">
              {/* Animated Spinner */}
              <div className="relative mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#10B981]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Clock size={24} className="text-[#10B981]" />
                </div>
              </div>

              {/* Loading Text */}
              <h3 className="text-xl font-black text-[#001A33] mb-2">Loading tours...</h3>
              <p className="text-[14px] text-gray-500 font-semibold mb-4">
                Please wait while we fetch the best tours in {city}
              </p>

              {/* Loading Timer */}
              <div className="flex items-center gap-2 px-4 py-2 bg-[#10B981]/10 rounded-full border border-[#10B981]/20">
                <Clock size={16} className="text-[#10B981]" />
                <span className="text-[14px] font-black text-[#10B981]">
                  {loadingTime > 0 ? `${loadingTime}s` : 'Starting...'}
                </span>
              </div>

              {/* Animated Dots */}
              <div className="flex gap-2 mt-6">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Intro Content - 2-3 Paragraphs (Mandatory for SEO) */}
        <div className="mb-10 space-y-4 text-[16px] text-gray-700 font-semibold leading-relaxed max-w-4xl">
          {cityInfo.intro.map((paragraph, index) => (
            <p key={index}>
              {paragraph.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g).map((part, i) => {
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
          ))}
        </div>

        {/* Popular Tours & Experiences */}
        {sortedTours.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black text-[#001A33] mb-6">
              Popular Tours & Experiences in {city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {sortedTours.map((tour) => {
                const tourSlug = tour.slug || `tour-${tour.id}`;
                const hasSkipLine = tour.included && tour.included.toLowerCase().includes('skip');
                const hasPickup = tour.meetingPoint || (tour.included && tour.included.toLowerCase().includes('pickup'));

                // Calculate rating (random between 4.0 and 5.0, unique per tour)
                const rating = calculateRating(tour);
                const displayRating = rating.toFixed(1);
                const isTopRated = rating >= 4.5;

                // Parse duration to extract hours
                const durationMatch = tour.duration?.match(/(\d+)\s*hours?/i) || tour.duration?.match(/(\d+)\s*hrs?/i);
                const durationHours = durationMatch ? durationMatch[1] : null;

                // Get lowest price from first tier of groupPricingTiers (price for 1 person)
                let lowestPrice = 0;

                // PRIORITY 1: Check tour.groupPricingTiers directly (most reliable)
                if (tour.groupPricingTiers) {
                  try {
                    const tiers = typeof tour.groupPricingTiers === 'string'
                      ? JSON.parse(tour.groupPricingTiers)
                      : tour.groupPricingTiers;
                    if (Array.isArray(tiers) && tiers.length > 0 && tiers[0]?.price) {
                      lowestPrice = parseFloat(tiers[0].price) || 0;
                    }
                  } catch (e) {
                    console.error('Error parsing tour groupPricingTiers:', e);
                  }
                }

                // PRIORITY 2: Check tour options for groupPricingTiers
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
                      } catch (e) {
                        console.error('Error parsing option groupPricingTiers:', e);
                      }
                    }
                  }
                }

                // FALLBACK: Use pricePerPerson only if no tiers found
                if (lowestPrice === 0) {
                  lowestPrice = tour.pricePerPerson || 0;
                }

                return (
                  <a
                    key={tour.id}
                    href={`/${countrySlug}/${citySlug}/${tourSlug}`}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all group"
                  >
                    {/* Image Section */}
                    {tour.images && tour.images.length > 0 && (
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={tour.images[0]}
                          alt={`${tour.title} in ${city} - ${cityInfo.description}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {/* Brand Logo Overlay */}

                        {/* Top Rated Badge */}
                        {isTopRated && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-[#10B981] text-white text-[10px] font-black rounded-md">
                              Top rated
                            </span>
                          </div>
                        )}
                        {/* Wishlist Heart */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        >
                          <Heart size={18} className="text-gray-600" />
                        </button>
                      </div>
                    )}

                    {/* Content Section */}
                    <div className="p-4">
                      {/* H3 - Tour Title (SEO Gold) */}
                      <h3 className="text-[16px] font-black text-[#001A33] mb-3 line-clamp-2 group-hover:text-[#10B981] transition-colors leading-tight">
                        {tour.title}
                      </h3>

                      {/* Duration */}
                      {durationHours && (
                        <div className="text-[12px] text-gray-500 font-semibold mb-3">
                          {durationHours} {durationHours === '1' ? 'hour' : 'hours'}
                        </div>
                      )}

                      {/* Tour Types */}
                      {tour.tourTypes && (() => {
                        try {
                          const tourTypesArray = typeof tour.tourTypes === 'string' ? JSON.parse(tour.tourTypes) : tour.tourTypes;
                          if (Array.isArray(tourTypesArray) && tourTypesArray.length > 0) {
                            // Display up to 2-3 tour types to avoid clutter
                            const displayCount = Math.min(tourTypesArray.length, 3);
                            return (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {tourTypesArray.slice(0, displayCount).map((type: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 bg-[#10B981]/10 text-[#10B981] text-[10px] font-semibold rounded-full border border-[#10B981]/20"
                                  >
                                    {type}
                                  </span>
                                ))}
                                {tourTypesArray.length > displayCount && (
                                  <span className="px-2 py-1 text-gray-500 text-[10px] font-semibold">
                                    +{tourTypesArray.length - displayCount}
                                  </span>
                                )}
                              </div>
                            );
                          }
                        } catch (e) {
                          console.error('Error parsing tourTypes:', e);
                        }
                        return null;
                      })()}

                      {/* Rating & Activity Provider Row */}
                      <div className="flex items-center justify-between mb-3">
                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => {
                              const starRating = parseFloat(displayRating);
                              const filled = i < Math.floor(starRating);
                              const halfFilled = i === Math.floor(starRating) && starRating % 1 >= 0.5;
                              return (
                                <div key={i} className="relative">
                                  <Star
                                    size={14}
                                    className="text-gray-300"
                                  />
                                  {(filled || halfFilled) && (
                                    <Star
                                      size={14}
                                      className={`absolute top-0 left-0 text-yellow-400 fill-yellow-400 ${halfFilled ? 'clip-path-half' : ''}`}
                                      style={halfFilled ? { clipPath: 'inset(0 50% 0 0)' } : {}}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <span className="text-[14px] font-black text-[#001A33]">{displayRating}</span>
                        </div>
                      </div>

                      {/* Price Row */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="text-right w-full">
                          <div className="text-[18px] font-black text-[#001A33]">
                            Starting from {tour.currency === 'INR' ? '₹' : '$'}{lowestPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* No Tours Found Message */}
        {!loading && sortedTours.length === 0 && (
          <div className="mb-12 text-center py-12 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="bg-white inline-flex p-4 rounded-full shadow-sm mb-4">
              <MapPin size={32} className="text-[#10B981]" />
            </div>
            <h3 className="text-xl font-black text-[#001A33] mb-2">No tours found in {city}</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We're currently expanding our offerings. Check back soon for new experiences!
            </p>
            <button
              onClick={fetchTours}
              className="px-6 py-2.5 bg-[#10B981] text-white font-bold rounded-xl hover:bg-[#059669] transition-all"
            >
              Refresh Results
            </button>
          </div>
        )}

        {/* H2 #1: Things to Do Section */}
        <ThingsToDoSection city={city} />

        {/* H2 #2: Why Book with Local Guides */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-[#001A33] mb-6">
            Why Book {city} Tours with Local Guides?
          </h2>
          <ul className="space-y-3 max-w-3xl">
            {cityInfo.whyBook.map((reason, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2 shrink-0"></div>
                <span className="text-[16px] text-gray-700 font-semibold">{reason}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* H2 #3: Top Attractions */}
        {cityInfo.topAttractions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black text-[#001A33] mb-6">
              Top Attractions Covered in {city} Tours
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
              {cityInfo.topAttractions.map((attraction, index) => (
                <div key={index} className="flex items-center gap-2 text-[16px] text-gray-700 font-semibold">
                  <MapPin size={16} className="text-[#10B981] shrink-0" />
                  <span>{attraction}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* H2 #4: Best Time to Visit */}
        <section className="mb-12">
          <h2 className="text-3xl font-black text-[#001A33] mb-4">
            Best Time to Visit {city}
          </h2>
          <p className="text-[16px] text-gray-700 font-semibold leading-relaxed max-w-3xl">
            {cityInfo.bestTime}
          </p>
        </section>

        {/* Agra Essential Guides Section */}
        {city.toLowerCase() === 'agra' && (
          <section className="mb-16">
            <h2 className="text-3xl font-black text-[#001A33] mb-8">
              Everything You Need to Know Before Visiting Agra
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Things to Do in Agra', slug: 'things-to-do-in-agra', icon: <Star className="text-[#10B981]" size={20} /> },
                { title: 'Places to Visit in Agra', slug: 'places-to-visit-in-agra', icon: <MapPin className="text-[#10B981]" size={20} /> },
                { title: '1-Day Agra Itinerary', slug: '1-day-agra-itinerary', icon: <Calendar className="text-[#10B981]" size={20} /> },
                { title: 'Taj Mahal Ticket Price 2026', slug: 'taj-mahal-ticket-price-2026', icon: <Ticket className="text-[#10B981]" size={20} /> },
                { title: 'Taj Mahal Opening Time', slug: 'taj-mahal-opening-time', icon: <Clock className="text-[#10B981]" size={20} /> },
                { title: 'Is Taj Mahal Closed on Friday?', slug: 'is-taj-mahal-closed-on-friday', icon: <Info className="text-[#10B981]" size={20} /> },
                { title: 'Agra Travel Guide 2026', slug: 'agra-travel-guide-2026', icon: <Globe className="text-[#10B981]" size={20} /> },
              ].map((guide, idx) => (
                <a
                  key={idx}
                  href={`/india/agra/${guide.slug}`}
                  className="flex items-center justify-between p-5 md:p-6 bg-white border border-gray-100 rounded-2xl hover:border-[#10B981]/30 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] transition-all duration-300 group relative overflow-hidden active:scale-[0.98] hover:-translate-y-1.5"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-[#10B981]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:rotate-3 shadow-sm group-hover:shadow-[#10B981]/10">
                      {React.cloneElement(guide.icon as React.ReactElement, { className: "group-hover:text-[#10B981] transition-colors" })}
                    </div>
                    <span className="font-black text-[#001A33] group-hover:text-[#10B981] transition-colors text-[17px] tracking-tight">{guide.title}</span>
                  </div>

                  <div className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#10B981]/10 transition-colors">
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-[#10B981] transition-all duration-300 transform group-hover:translate-x-1" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Email Signup Box - Only show for cities with itineraries */}
        <EmailSignupBox city={city} country={country} />

        {/* H2 #5: FAQs */}
        {cityInfo.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-black text-[#001A33] mb-6">
              FAQs About {city} Tours
            </h2>
            <div className="space-y-6 max-w-3xl">
              {cityInfo.faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 pb-4">
                  <h3 className="text-[18px] font-black text-[#001A33] mb-2">
                    {faq.question}
                  </h3>
                  <div className="text-[16px] text-gray-700 font-semibold leading-relaxed space-y-2">
                    {faq.answer.split('\n').map((line, lIdx) => (
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

        {/* Filter Buttons Row - GetYourGuide Style */}
        {sortedTours.length > 0 && (
          <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Calendar size={16} />
              Dates
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Day trips
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Multi-day
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Photography
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Sunrise
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Private tours
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              Walking tours
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] hover:bg-gray-50 transition-colors whitespace-nowrap">
              <Filter size={16} className="inline mr-1" />
              Filters
            </button>
          </div>
        )}

        {/* Results Summary & Sort - Only show if tours exist */}
        {sortedTours.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <div className="text-[16px] font-black text-[#001A33]">
              {sortedTours.length} {sortedTours.length === 1 ? 'result' : 'results'}: {city}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-semibold text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-[14px] font-semibold text-[#001A33] focus:ring-2 focus:ring-[#10B981] outline-none cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {/* Empty State - Only show if no tours after loading */}
        {!loading && sortedTours.length === 0 && tours.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-black text-[#001A33] mb-2">No tours available yet</h3>
            <p className="text-[14px] text-gray-500 font-semibold">
              {searchQuery || filterCategory !== 'all'
                ? 'Try adjusting your filters'
                : `Be the first to create a tour in ${city}!`
              }
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CityPage;
