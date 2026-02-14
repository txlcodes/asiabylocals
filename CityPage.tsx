import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Users, Search, Filter, Heart, ShoppingCart, User, Globe, ChevronDown, Calendar, ChevronUp, Mail, ArrowLeft } from 'lucide-react';
import { CITY_LOCATIONS } from './constants';

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
      'Agra is one of India\'s most visited cities, famous worldwide for the Taj Mahal and its rich Mughal heritage. Beyond the iconic monument, Agra offers a deep cultural experience through historic forts, bustling bazaars, traditional crafts, and local cuisine.',
      'At AsiaByLocals, discover expert-led tours in Agra hosted by licensed local guides and historians. From Taj Mahal sunrise visits to heritage walks, food tours, and day trips to Fatehpur Sikri, explore Agra through authentic, locally curated experiences.'
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
        question: 'How long does a Taj Mahal tour take?',
        answer: 'A typical Taj Mahal tour takes 2-3 hours, including entry, guided exploration, and photography time. Combined tours with Agra Fort usually take 5-6 hours.'
      },
      {
        question: 'Are Agra tours suitable for families?',
        answer: 'Yes, most Agra tours are family-friendly. Our guides adapt the pace and content for children, making history engaging and accessible for all ages.'
      },
      {
        question: 'Do I need a licensed guide in Agra?',
        answer: 'While not mandatory, a licensed local guide enhances your experience significantly by providing historical context, cultural insights, and helping navigate the sites efficiently.'
      },
      {
        question: 'Are sunrise tours worth it?',
        answer: 'Absolutely. Sunrise tours offer the best lighting for photography, cooler temperatures, fewer crowds, and a magical experience as the Taj Mahal glows in the morning light.'
      }
    ]
  },
  'Delhi': {
    title: 'Delhi Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Delhi with licensed local guides. Red Fort tours, Old Delhi heritage walks, street food tours & cultural experiences.',
    intro: [
      'Delhi, India\'s capital, is a vibrant blend of ancient history and modern energy. From the historic Red Fort and Jama Masjid to the bustling markets of Old Delhi and the modern architecture of New Delhi, the city offers endless exploration opportunities.',
      'At AsiaByLocals, explore Delhi through expert-led tours with licensed local guides. Discover authentic street food, hidden neighborhoods, and the real stories that make Delhi special. Experience the contrast between Old Delhi\'s narrow lanes and New Delhi\'s wide boulevards with knowledgeable local experts.'
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
        answer: 'A typical Old Delhi heritage walk takes 3-4 hours, while combined tours covering multiple monuments can take 6-8 hours.'
      },
      {
        question: 'Are Delhi tours suitable for families?',
        answer: 'Yes, Delhi tours are family-friendly. Our guides adapt the experience for children and ensure comfortable pacing for all ages.'
      },
      {
        question: 'Do I need a licensed guide in Delhi?',
        answer: 'While not mandatory, a licensed local guide helps navigate Delhi\'s complex history, diverse neighborhoods, and provides valuable cultural insights.'
      },
      {
        question: 'Are street food tours safe?',
        answer: 'Yes, our guides take you to trusted vendors with high hygiene standards. We ensure safe, authentic food experiences while respecting dietary restrictions.'
      }
    ]
  },
  'Jaipur': {
    title: 'Jaipur Tours & Things to Do | Guided Experiences by Locals',
    description: 'Discover the best tours in Jaipur with licensed local guides. City Palace tours, Hawa Mahal visits, heritage walks & authentic Rajasthan experiences.',
    intro: [
      'Jaipur, known as the Pink City, is the vibrant capital of Rajasthan. Famous for its stunning palaces, colorful markets, and rich cultural heritage, Jaipur offers visitors a glimpse into royal India.',
      'At AsiaByLocals, explore Jaipur through expert-led tours with licensed local guides. Discover the magnificent City Palace, the unique Hawa Mahal (Palace of Winds), and the ancient Jantar Mantar observatory. Our guides share the stories behind these architectural marvels and take you to authentic markets, traditional workshops, and hidden gems that showcase Jaipur\'s true character.'
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
        answer: 'A typical City Palace and Hawa Mahal tour takes 3-4 hours. Combined tours with Amber Fort can take 6-8 hours including travel time.'
      },
      {
        question: 'Are Jaipur tours suitable for families?',
        answer: 'Yes, Jaipur tours are very family-friendly. The palaces and markets are engaging for children, and our guides make history come alive for all ages.'
      },
      {
        question: 'Do I need a licensed guide in Jaipur?',
        answer: 'While not mandatory, a licensed local guide enhances your experience by explaining the rich history, architecture, and cultural significance of Jaipur\'s royal heritage.'
      },
      {
        question: 'Are heritage walks worth it?',
        answer: 'Absolutely. Heritage walks in Jaipur\'s old city reveal hidden gems, traditional crafts, local stories, and authentic experiences you won\'t find on your own.'
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

  // Things to do data for all cities (SEO-optimized) - Based on actual tour offerings
  const thingsToDoData: Record<string, Array<{
    title: string;
    image: string;
    shortDescription: string;
    fullDescription: string;
    seoKeywords: string[];
  }>> = {
    'Agra': [
      {
        title: 'From Delhi: Taj Mahal & Agra Private Day Trip with Transfers',
        image: '/things-to-do/agra-taj-mahal-sunrise.jpg', // .avif file with .jpg extension
        shortDescription: 'Begins your tour with the pickup from your hotel/airport in Delhi/Noida/Gurugram and depart to Agra. Meet your private guide when you arrive in Agra and proceed to the Taj Mahal, a UNESCO World Heritage Site and a living monument, which silently whispers the love of legendary Mughal emperor Shah Jahan for his beloved wife Mumtaz Mahal.',
        fullDescription: 'Begins your tour with the pickup from your hotel/airport in Delhi/Noida/Gurugram and depart to Agra. Meet your private guide when you arrive in Agra and proceed to the Taj Mahal, a UNESCO World Heritage Site and a living monument, which silently whispers the love of legendary Mughal emperor Shah Jahan for his beloved wife Mumtaz Mahal. Continue onto the second UNESCO World Heritage Site Agra Fort. The imposing red sandstone fort was built by Emperor Akbar in 1565 AD, it combines both Hindu and Central Asian architectural styles. Then take a break for lunch at a 5-star Hotel and enjoy a mouth-watering meal of local and international flavor. After lunch, head towards the marvelous Tomb of Itmad-Ud-Daulah also known as Baby Taj. This pure marble structure was constructed by Noor Jahan for her father. Your tour ends with a return journey back to your hotel/airport or desired location in Delhi/Noida/Gurugram.',
        seoKeywords: ['Taj Mahal', 'Agra Fort', 'Delhi to Agra', 'private day trip', 'Baby Taj']
      },
      {
        title: 'From Delhi: Private Taj Mahal and Agra Day Tour with 5* Meal',
        image: '/things-to-do/agra-fort.jpg',
        shortDescription: 'Experience a premium Private Taj Mahal and Agra Day Tour from Delhi, thoughtfully designed for comfort, flexibility, and unforgettable experiences. Includes a private chauffeur pick-up from Delhi in an air-conditioned car.',
        fullDescription: 'Experience a premium Private Taj Mahal and Agra Day Tour from Delhi, thoughtfully designed for comfort, flexibility, and unforgettable experiences. Includes a private chauffeur pick-up from Delhi in an air-conditioned car. Visit the world-famous Taj Mahal, one of the Seven Wonders of the World. For early risers, an optional sunrise visit offers fewer crowds, and exceptional photo opportunities. Explore the majestic Agra Fort (a UNESCO World Heritage Site), this site used to be the home to Mughal emperors before Delhi became the capital of India. If time permits, visit Itimad-ud-Daulah, often called the Baby Taj, known for its intricate marble inlay work. Enjoy a delicious 5-star breakfast or lunch at a premium restaurant. Experience personalized service, flexible timing, expert guidance, and a stress-free return to Delhi the same day.',
        seoKeywords: ['Taj Mahal sunrise', 'Agra Fort', '5-star meal', 'premium tour', 'private tour']
      },
      {
        title: 'From Delhi: Private Taj Mahal & Agra Tour with 5* Lunch',
        image: '/things-to-do/agra-baby-taj.jpg',
        shortDescription: 'Start your journey with an early pickup from your hotel in Delhi, Gurgaon, Noida, or the airport. Sit back in a private, air-conditioned car for a 3-hour drive to Agra. Upon arrival, meet your expert guide and proceed to the Taj Mahal to explore its beauty at sunrise for 2-3 hours.',
        fullDescription: 'Start your journey with an early pickup from your hotel in Delhi, Gurgaon, Noida, or the airport. Sit back in a private, air-conditioned car for a 3-hour drive to Agra. Upon arrival, meet your expert guide and proceed to the Taj Mahal to explore its beauty at sunrise for 2-3 hours. Continue to the Agra Fort, an impressive red sandstone fortress built by Emperor Akbar in 1565 AD, it combines both Hindu and Central Asian architectural styles. After the fort visit, enjoy a breakfast or lunch at a 5-star hotel (if included in the package). Next, explore the elegant Baby Taj (Itmad-ud-Daulah), a pure marble structure constructed by Noor Jahan for her father. Your tour concludes with a comfortable return drive to Delhi in a private car, with drop-off at your chosen location.',
        seoKeywords: ['Taj Mahal sunrise', 'Agra Fort', 'Baby Taj', '5-star lunch', 'private transfer']
      },
      {
        title: 'Agra: Skip-the-Line Taj Mahal & Agra Fort Private Tour',
        image: '/things-to-do/agra-fatehpur-sikri.jpg',
        shortDescription: 'Tour begins with a pick up from hotel/airport or any requested location in Agra city, meet with tour guide and proceed to visit Taj Mahal with an express entry ticket and discover the marble mausoleum of the Taj Mahal in Agra at your own pace.',
        fullDescription: 'Tour begins with a pick up from hotel/airport or any requested location in Agra city, meet with tour guide and proceed to visit Taj Mahal with an express entry ticket and discover the marble mausoleum of the Taj Mahal in Agra at your own pace. After visiting Taj Mahal, take a break for breakfast at a multi cuisine restaurant (pay by your own). Later, visit the historic Agra Fort, another UNESCO World Heritage Site, this site used to be the home to Mughal emperors before Delhi became the capital of India. Be transferred back to your hotel/airport or any desired location in Agra after the tour ends.',
        seoKeywords: ['Skip the line', 'Taj Mahal express entry', 'Agra Fort', 'private tour', 'Agra city tour']
      },
      {
        title: 'Delhi/Jaipur/Agra: Private One-Way Transfer',
        image: '/things-to-do/shared-private-transfer.jpg', // Shared image for all cities
        shortDescription: 'Enjoy a private transfer from Delhi, Agra, or Jaipur with driver in a private air-conditioned car. Be picked up from your preferred location and taken to your destination hassle-free.',
        fullDescription: 'Enjoy a private transfer from Delhi, Agra, or Jaipur with driver in a private air-conditioned car. Be picked up from your preferred location, whether it\'s the airport or your hotel, and be taken to your hotel or the airport in Delhi, Jaipur, or Agra. Don\'t waste your time trying to find a taxi and haggling over prices, pre-book your convenient transfer and have a more relaxing vacation. Sit back and relax knowing you\'re in safe hands and will end up exactly where you want to be. Sip on free water during the drive. The vehicle used depends on the number of people being transported: 1 to 3 people - AC Sedan, Toyota Etios, or Maruti Swift Dzire; 4 to 6 people - A/C Kia Carens or Innova; 12 to 26 people - Tempo Traveller or Mini Bus. Professional drivers ensure safe and comfortable journeys between these major tourist destinations.',
        seoKeywords: ['private transfer', 'Delhi Jaipur Agra', 'airport transfer', 'private car', 'Golden Triangle transfer']
      }
    ],
    'Delhi': [
      {
        title: 'Old Delhi Heritage Walk & Street Food Tour',
        image: '/things-to-do/delhi-old-delhi-heritage.jpg',
        shortDescription: 'Explore the historic lanes of Old Delhi, visit the magnificent Jama Masjid, and discover authentic street food in Chandni Chowk. Experience the vibrant culture and rich history of Delhi\'s oldest neighborhood with a local guide.',
        fullDescription: 'Explore the historic lanes of Old Delhi, visit the magnificent Jama Masjid, and discover authentic street food in Chandni Chowk. Experience the vibrant culture and rich history of Delhi\'s oldest neighborhood with a local guide. Your tour begins in the narrow, bustling streets of Old Delhi, where history comes alive. Visit the Jama Masjid, one of India\'s largest mosques, built by Emperor Shah Jahan in 1656. Walk through the colorful spice market of Khari Baoli, the largest wholesale spice market in Asia. Discover hidden gems like the Paranthe Wali Gali, famous for its traditional Indian flatbreads. Your guide will take you to trusted street food vendors where you can sample authentic Delhi delicacies like chaat, jalebi, and parathas. Learn about the Mughal history, colonial influences, and modern-day life in this fascinating part of Delhi.',
        seoKeywords: ['Old Delhi', 'heritage walk', 'street food tour', 'Jama Masjid', 'Chandni Chowk']
      },
      {
        title: 'Red Fort & India Gate Private Tour',
        image: '/things-to-do/delhi-red-fort.avif',
        shortDescription: 'Visit the iconic Red Fort, a UNESCO World Heritage Site, and the majestic India Gate. Explore the rich history of Mughal Delhi and modern India\'s capital with an expert local guide.',
        fullDescription: 'Visit the iconic Red Fort, a UNESCO World Heritage Site, and the majestic India Gate. Explore the rich history of Mughal Delhi and modern India\'s capital with an expert local guide. The Red Fort, built by Emperor Shah Jahan in 1639, served as the main residence of Mughal emperors for nearly 200 years. Your guide will take you through the fort\'s impressive structures including the Diwan-i-Am (Hall of Public Audience), Diwan-i-Khas (Hall of Private Audience), and the beautiful gardens. Learn about the fort\'s significance during India\'s independence movement. Then, visit India Gate, a war memorial dedicated to Indian soldiers who died in World War I. The monument stands as a symbol of national pride and is surrounded by beautiful gardens. Your guide will share stories of Delhi\'s transformation from Mughal capital to modern India\'s political center.',
        seoKeywords: ['Red Fort', 'India Gate', 'UNESCO World Heritage', 'Mughal Delhi', 'Delhi monuments']
      },
      {
        title: 'Qutub Minar & Humayun\'s Tomb Heritage Tour',
        image: '/things-to-do/delhi-qutub-minar.jpg',
        shortDescription: 'Discover two UNESCO World Heritage Sites: the towering Qutub Minar and the beautiful Humayun\'s Tomb. Explore Delhi\'s ancient Islamic architecture and learn about the city\'s rich historical legacy.',
        fullDescription: 'Discover two UNESCO World Heritage Sites: the towering Qutub Minar and the beautiful Humayun\'s Tomb. Explore Delhi\'s ancient Islamic architecture and learn about the city\'s rich historical legacy. Qutub Minar, built in the 12th century, is the world\'s tallest brick minaret at 73 meters. The complex includes ancient ruins, the Iron Pillar that has stood rust-free for over 1,600 years, and beautiful Indo-Islamic architecture. Your guide will explain the minaret\'s history and the Qutub Complex\'s significance. Then, visit Humayun\'s Tomb, a masterpiece of Mughal architecture that inspired the Taj Mahal\'s design. Built in 1570, this magnificent mausoleum is set in beautiful gardens and represents the first garden-tomb on the Indian subcontinent. Your guide will share stories of the Mughal dynasty and explain how this tomb influenced later Mughal architecture.',
        seoKeywords: ['Qutub Minar', 'Humayun\'s Tomb', 'UNESCO World Heritage', 'Islamic architecture', 'Delhi heritage']
      },
      {
        title: 'Delhi City Tour: Old & New Delhi Full Day Experience',
        image: '/things-to-do/delhi-city-tour.jpg',
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
                    alt={`${item.title} in ${city}`}
                    className="w-full h-40 md:h-40 object-cover"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    onError={(e) => {
                      // Fallback to placeholder if image not found
                      const target = e.target as HTMLImageElement;
                      // Try .avif extension if .jpg fails
                      if (target.src.endsWith('.jpg')) {
                        target.src = target.src.replace('.jpg', '.avif');
                      } else {
                        target.src = 'https://via.placeholder.com/600x400?text=' + encodeURIComponent(item.title);
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
                    {isExpanded ? (
                      <div>
                        <p className="mb-3">{item.shortDescription}</p>
                        <p className="text-gray-600">{item.fullDescription}</p>
                      </div>
                    ) : (
                      <p>{item.shortDescription}</p>
                    )}
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

  // City-specific images
  const cityImages: Record<string, string> = {
    'Agra': '/agra-itinerary-hero.jpg',
    'Delhi': '/delhi-itinerary-hero.jpg',
    'Jaipur': '/jaipur-itinerary-hero.jpg'
  };

  // Fallback to city hero image if itinerary-specific image doesn't exist
  const imageSrc = cityImages[city] || `/${city.toLowerCase()}-hero.jpg`;

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
          <div className="md:col-span-2 relative h-52 md:h-56 overflow-hidden">
            <img
              src={imageSrc}
              alt={`${city} travel experience`}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                // Fallback to a placeholder if image doesn't exist
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800';
              }}
            />
          </div>

          {/* Form Section */}
          <div className="md:col-span-1 bg-[#10B981]/10 p-4 md:p-5 flex flex-col justify-center">
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
      // Use explicit backend URL - check if we're in production
      const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');
      const url = `${API_URL}/api/public/tours?country=${encodeURIComponent(country)}&city=${encodeURIComponent(city)}&status=approved`;
      console.log('CityPage - Fetching tours from:', url);
      console.log('CityPage - Country:', country, 'City:', city);

      const response = await fetch(url);
      console.log('CityPage - Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
            slug: tour.slug || `tour-${tour.id}` // Fallback slug if missing
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
    description: `Discover the best tours in ${city} with licensed local guides. Book authentic experiences and cultural tours.`,
    intro: [
      `${city} offers rich cultural experiences and historical sites waiting to be explored.`,
      `At AsiaByLocals, discover expert-led tours in ${city} hosted by licensed local guides. Explore authentic, locally curated experiences that showcase the best of ${city}.`
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

  // Helper function to generate unique random rating between 4.0 and 5.0 for each tour
  const calculateRating = (tour: any) => {
    // Generate a consistent random rating based on tour ID (so it's unique but stable)
    // This creates a pseudo-random number between 4.0 and 5.0
    const seed = parseInt(tour.id) || 0;
    const random = (seed * 9301 + 49297) % 233280;
    const normalized = random / 233280;
    return 4.0 + (normalized * 1.0); // Range: 4.0 to 5.0
  };

  // Sort tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    if (sortBy === 'recommended') {
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
    "@type": "TravelAgency",
    "name": `AsiaByLocals - ${city} Tours`,
    "description": cityInfo.description,
    "url": `https://asiabylocals.com/${countrySlug}/${citySlug}`,
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
    },
    "offers": tours.map(tour => ({
      "@type": "Offer",
      "name": tour.title,
      "description": tour.shortDescription || tour.fullDescription,
      "price": tour.pricePerPerson,
      "priceCurrency": tour.currency,
      "availability": tour.status === 'approved' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }))
  };

  // Update SEO meta tags
  useEffect(() => {
    // Update title
    document.title = cityInfo.title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', cityInfo.description);

    // Update keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', `${city} tours, ${city} experiences, ${country} tours, local guides ${city}, ${city} travel guide, things to do in ${city}, ${city} activities`);

    // Update canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://www.asiabylocals.com/${countrySlug}/${citySlug}`);

    // Update Open Graph
    const ogTags = [
      { property: 'og:title', content: cityInfo.title },
      { property: 'og:description', content: cityInfo.description },
      { property: 'og:url', content: `https://asiabylocals.com/${countrySlug}/${citySlug}` },
      { property: 'og:type', content: 'website' }
    ];

    ogTags.forEach(tag => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', tag.property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', tag.content);
    });

    // Add structured data
    let existingScript = document.querySelector('script[type="application/ld+json"][data-city-page]');
    if (existingScript) {
      existingScript.remove();
    }
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-city-page', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [city, country, cityInfo, countrySlug, citySlug, structuredData]);

  return (
    <div className="min-h-screen bg-white">

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
                <ShoppingCart size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden lg:block text-[11px]">Cart</span>
              </button>
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
            <p key={index}>{paragraph}</p>
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
                        />
                        {/* Brand Logo Overlay */}
                        <div className="absolute top-3 right-12 z-10">
                          <img
                            src="/logo.png"
                            alt="AsiaByLocals"
                            className="h-8 w-auto object-contain brightness-0 invert"
                            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}
                          />
                        </div>
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

        {/* H2 #1: Things to Do Section */}
        {(city === 'Agra' || city === 'Delhi' || city === 'Jaipur') && (
          <ThingsToDoSection city={city} />
        )}

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

        {/* Email Signup Box - Only show for cities with itineraries */}
        {(city === 'Agra' || city === 'Delhi' || city === 'Jaipur') && (
          <EmailSignupBox city={city} country={country} />
        )}

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
                  <p className="text-[16px] text-gray-700 font-semibold leading-relaxed">
                    {faq.answer}
                  </p>
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
    </div>
  );
};

export default CityPage;
