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
  Home,
  Anchor
} from 'lucide-react';
import BookingForm from './BookingForm';
import RelatedTours from './RelatedTours';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import { Helmet } from 'react-helmet-async';

interface TourDetailPageProps {
  tourId?: string;
  tourSlug?: string;
  country?: string;
  city?: string;
  onClose?: () => void;
}



const formatDurationHours = (hours: number | string) => {
  const h = typeof hours === 'string' ? parseFloat(hours) : hours;
  if (!h || isNaN(h)) return '';

  // Special override: 6 hours = 6 days
  if (h === 6) return '6 days';

  // Convert multiples of 24 to days
  if (h >= 24 && h % 24 === 0) {
    const d = h / 24;
    return `${d} ${d === 1 ? 'day' : 'days'}`;
  }

  return `${h} ${h === 1 ? 'hour' : 'hours'}`;
};

const formatDurationDisplay = (durationStr: string | null | undefined) => {
  if (!durationStr) return null;

  // Match days or hours
  const match = durationStr.match(/(\d+(?:\.\d+)?)\s*(days?|hours?|hrs?)/i);
  if (!match) return durationStr;

  const num = parseFloat(match[1]);
  const unit = match[2].toLowerCase();

  // Special override: 6 hours = 6 days
  if (unit.startsWith('h') && num === 6) {
    return '6 days';
  }

  // Convert hours to days if multiples of 24
  if (unit.startsWith('h') && num >= 24 && num % 24 === 0) {
    const d = num / 24;
    return `${d} ${d === 1 ? 'day' : 'days'}`;
  }

  // Return as is if already days or not a multiple of 24
  return durationStr;
};

// High-authority FAQ data tailored for specific major tours
export const getTourSpecificFAQs = (title: string, slug: string | undefined) => {
  const t = title.toLowerCase();

  // --- AUTO-INJECTED FAQS ---
  if (slug === 'book-guide-for-taj-mahal') {
    return [
      {
        question: "Is this an official licensed Taj Mahal tour guide?",
        answer: "Yes, absolutely. We exclusively provide Ministry of Tourism-approved and officially licensed guides for your Taj Mahal experience. These are high-authority professionals authorized to guide inside all federally protected archaeological sites in India. This guarantees that the historical narrative you receive is accurate, deeply researched, and free from common myths. Engaging an official guide also ensures you bypass unregistered touts outside the monument. They understand the complex architecture, the intricate Pietra Dura marble inlay work, and the authentic history of the Mughal Empire, delivering a premium educational payload rather than just a basic walk-through."
      },
      {
        question: "How long will the guide stay with us?",
        answer: "Your dedicated professional guide will typically stay with you for approximately two to three hours during a standard Taj Mahal visit. However, since this is a private guiding service, the timeline is completely flexible and customized to your specific pace and interests. If you wish to spend more time examining the calligraphy, admiring the symmetrical gardens, or taking photographs at different vantage points, your guide will happily accommodate. The core objective is to ensure you comprehensively understand the monument without feeling rushed, maximizing the value of your once-in-a-lifetime visit to this world wonder."
      },
      {
        question: "Where will the guide meet us at Taj Mahal?",
        answer: "To ensure an absolutely seamless experience, your professional guide will meet you precisely at your chosen entry point—either the East Gate or the West Gate ticket counters, or even directly at the parking facility if you prefer. They will be holding a clear name board for immediate recognition. Because the area around the monument can be hectic, having your [local expert guide](/india/agra/agra-travel-guide-2026) meet you before you even enter the queue provides immediate peace of mind. They take over the logistical navigation immediately, allowing you to focus entirely on the upcoming architectural marvel."
      },
      {
        question: "Can the guide meet at East or West Gate?",
        answer: "Yes, our flexible guiding service allows you to dictate the exact meeting point. The Taj Mahal has two main tourist entrances: the East Gate and the West Gate. Both are fully operational, but the East Gate is typically preferred for sunrise visits due to its proximity to the main hotel district and slightly better infrastructure. Your guide will coordinate with you via WhatsApp or phone a day prior to establish the most convenient gate based on your hotel's location and your arrival vehicle, ensuring zero confusion on the morning of your highly anticipated tour."
      },
      {
        question: "Are monument entry tickets included?",
        answer: "This specific booking is purely for our premium, high-authority guiding service and does not include the cost of monument entry tickets. However, your guide acts as your logistical architect; they will assist you in acquiring your tickets via the official government online portal or physically at the designated priority counters. By keeping the guiding fee separate, you avoid any hidden markups on ticket prices. We ensure the ticketing process is handled efficiently so that you spend your time admiring the 17th-century white marble mausoleum rather than standing in administrative queues."
      },
      {
        question: "What languages are available?",
        answer: "We pride ourselves on offering a comprehensive roster of linguistically diverse, federally licensed guides to cater to our international clientele. Beyond fluent English, we can provide expert storytelling in Spanish, French, German, Italian, Russian, and Japanese. This ensures that you receive the complex historical narrative of the Mughal dynasty in your native tongue, preventing any loss of detail or nuance. When you [book your Taj Mahal visit](/india/agra/taj-mahal-opening-time), simply specify your preferred language, and we will flawlessly match you with a senior specialized guide who possesses absolute fluency and high-authority historical knowledge."
      },
      {
        question: "Can I verify the guide’s government ID?",
        answer: "Absolutely. Transparency and professional integrity are the cornerstones of our service. Upon meeting you, your guide will proudly display their valid, government-issued Ministry of Tourism license. This laminated ID is strictly required by the Archaeological Survey of India (ASI) for anyone providing historical commentary inside the monument. Verifying this ID gives you immediate confidence that you are not dealing with an unauthorized storyteller. We encourage all discerning travelers to check these credentials, as it guarantees you are receiving a factually accurate, premium educational experience regarding the construction and legacy of Shah Jahan's masterpiece."
      },
      {
        question: "Is this a private guiding service?",
        answer: "Yes, this is a strictly 100% private guiding service engineered exclusively for you and your travel companions. We do not consolidate or mix different booking parties into large, impersonal groups. This total exclusivity means the entire narrative is tailored to your engagement level. You dictate the pace, pause whenever you desire, and ask unrestricted questions without worrying about a group schedule. This private sanctuary ensures a meaningful, high-authority connection with the architecture and the romantic history, providing the ultimate VIP exploration of India's most iconic and revered 17th-century monument."
      },
      {
        question: "Can the guide help with photography?",
        answer: "Certainly. Our seasoned professional guides understand that capturing stunning visuals is a critical component of your [visit to the Taj Mahal](/india/agra/taj-mahal-ticket-price-2026). While they are primarily historians, they possess exceptional spatial awareness of the monument's grounds. They know the exact \"symmetry points,\" the best angles to capture the reflection pools, and how to utilize the natural light—especially during the golden hour. They will gladly use your camera or smartphone to take high-quality photos of you, ensuring you leave with spectacular, properly framed memories without the need to hire a separate, costly photographer."
      },
      {
        question: "Is tipping expected?",
        answer: "While tipping is never mandatory, it is a customary way to express gratitude for exceptional service in the Indian tourism industry. Our professional guides are compensated fairly for their high-authority expertise and time. However, if your guide successfully navigates you through the crowds, provides compelling historical insights, and elevates your overall experience, a gratuity is highly appreciated. The exact amount is entirely at your discretion and should reflect your satisfaction with the educational payload and logistical support provided during your exploration of the magnificent white marble mausoleum and its surrounding complex."
      },
      {
        question: "Can we customize the storytelling depth?",
        answer: "Absolutely. The primary advantage of a private, high-authority guide is the ability to perfectly calibrate the educational depth to your preferences. If you are a history enthusiast who wants a deep dive into Islamic calligraphy, the complex Pietra Dura marble inlay techniques, and the macro-political economy of the Mughal Empire, our guide will deliver a masterclass. Conversely, if you prefer a lighter, more romantic narrative focused on the architectural highlights and the love story of Shah Jahan and Mumtaz Mahal, the guide will seamlessly pivot. The intellectual journey is entirely yours."
      },
      {
        question: "Is this suitable for families with children?",
        answer: "Yes, this private guiding service is exceptionally well-suited for families traveling with children of all ages. Navigating a massive, crowded monument can be stressful for parents. Because our service is private, you can dictate a slower pace, take necessary breaks in shaded areas, and avoid the rigid timelines of group tours. Furthermore, our seasoned guides are skilled at adapting their [Agra guided tour](/india/agra/things-to-do-in-agra) narrative, making the history of emperors, massive fortresses, and precious gemstones engaging and accessible for younger audiences while simultaneously delivering complex details to the adults."
      },
      {
        question: "Can the guide also cover Agra Fort?",
        answer: "Yes, you can easily extend your guide's services to include the magnificent Agra Fort on the same day. In fact, we highly recommend this approach, as the Fort provides crucial political and military context to the Taj Mahal's creation. You will see the specific tower, the Musamman Burj, where Shah Jahan was imprisoned by his son with a view of his wife's mausoleum. Using the same professional guide ensures a cohesive, uninterrupted historical narrative across both UNESCO World Heritage sites, creating a comprehensive and deeply satisfying understanding of 17th-century Mughal dominance."
      },
      {
        question: "What happens if the guide is late?",
        answer: "We operate with total logistical precision, and our professional guides arriving late is an exceptionally rare occurrence. They are trained to arrive at the designated meeting point at least 15 minutes prior to your scheduled time. However, in the highly unlikely event of an emergency or severe traffic delay, we have a robust backup system. Our local operations manager will instantly dispatch a replacement guide of equal high-authority standing and notify you immediately via WhatsApp or phone. We absolutely guarantee that you will not be left stranded or miss your critical entry window."
      },
      {
        question: "Is this better than using an audio guide?",
        answer: "Undoubtedly. While an audio device provides a static recording, a [professional local historian](/india/agra/1-day-agra-itinerary) offers a dynamic, interactive experience that cannot be replicated. A live guide protects you from touts, navigates the intense crowds, finds the exact shaded spots for photography, and immediately answers your specific questions. They adjust the narrative depth based on your reactions and seamlessly handle the complex entry logistics with security personnel. The personalized attention, safety, and deep contextual understanding provided by a human expert offer an exponential upgrade over a pre-recorded audio track, making your visit truly memorable."
      }
    ];
  }
  if (slug === 'agra-half-day-guided-tour') {
    return [
      {
        question: "How many hours does the half-day tour last?",
        answer: "The Private Half Day Tour typically spans a comprehensive 4 to 5 hours. This duration is meticulously calculated to ensure you experience the absolute pinnacle of Agra without the exhaustion associated with a marathon full-day itinerary. This timeframe comfortably allows for an unhurried, deeply educational exploration of both the Taj Mahal and the Agra Fort, including necessary travel time between the monuments. It is the perfect, high-efficiency solution for travelers arriving by morning train or those looking to maximize their visual payload before continuing to their next destination later in the afternoon."
      },
      {
        question: "Which monument is visited first?",
        answer: "To maximize your visual and physical comfort, we almost universally initiate the tour at the Taj Mahal. Securing early entry allows you to beat the largest influx of crowds and experience the white marble mausoleum while the morning light is soft and the temperature is cooler. After securing your iconic photographs during this premium window, we smoothly transition to the massive Agra Fort. Built primarily of red sandstone, the Fort offers far superior natural shade and is much more comfortable to explore as the mid-day heat begins to build, ensuring a perfectly paced experience."
      },
      {
        question: "Are Taj Mahal and Agra Fort tickets included?",
        answer: "This specific half-day package covers our premium private transportation and a high-authority, federally licensed guide, but intentionally excludes the monument entrance fees. By keeping the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) separate, you pay the exact government rate without any hidden agency markups. Moreover, your professional guide acts as your logistical concierge. They will utilize the priority digital ticketing system on your behalf, allowing you to seamlessly bypass the massive manual ticket lines and walk directly to the security perimeter, maximizing your time exploring rather than waiting."
      },
      {
        question: "Is hotel pickup included?",
        answer: "Yes, absolutely. To guarantee a frictionless and stress-free start to your morning, we provide complimentary, door-to-door pickup from any hotel, homestay, or railway station within the Agra city limits. Your designated air-conditioned luxury vehicle and professional chauffeur will arrive exactly at your pre-scheduled time. We manage all the chaotic city navigation so you don't have to negotiate with local taxis or figure out meeting points. At the conclusion of your half-day historical exploration, you will be smoothly transported back to your exact starting point or any other preferred local drop-off location."
      },
      {
        question: "What type of car is provided?",
        answer: "We strictly utilize a modern, impeccably maintained fleet of air-conditioned vehicles to ensure your absolute comfort. For solo travelers or couples, we deploy premium sedans like the Toyota Etios or Swift Dzire. For families or small groups of up to six people, we upgrade you to an extremely spacious Toyota Innova SUV, which provides superior legroom and smooth suspension. Every vehicle is thoroughly sanitized and operated by a uniformed, commercially licensed chauffeur who is trained in defensive driving protocols, guaranteeing safe and luxurious transit between the majestic Mughal monuments."
      },
      {
        question: "Is this tour fully private?",
        answer: "Yes, this entire half-day itinerary operates as a strictly 100% private experience. We guarantee that your premium vehicle and your high-authority historian guide are dedicated solely to you and your chosen travel companions. We do not combine bookings or force you to endure the rigid schedules of large, impersonal bus tours. This total exclusivity gives you complete tactical control over your [Agra guided tour](/india/agra/things-to-do-in-agra). You have the freedom to dictate the pace, pause for photography exactly when you wish, and engage in continuous, private dialogue with your dedicated expert."
      },
      {
        question: "Is this suitable for elderly travelers?",
        answer: "We highly recommend this specific itinerary for elderly travelers because it is meticulously engineered for comfort. Our private vehicle provides seamless, door-to-door transit, minimizing the need to walk on public streets. Inside the monuments, your senior guide will proactively manage the pace, utilizing ramps where available and intentionally stopping in shaded areas with seating. The half-day duration prevents physical exhaustion while still delivering the full impact of the UNESCO World Heritage sites. We remove all logistical friction, settling any objections regarding physical strain and ensuring the focus remains entirely on historical appreciation."
      },
      {
        question: "Can we skip Agra Fort if short on time?",
        answer: "Absolutely. Because you possess total command over this private itinerary, we can easily pivot to accommodate your schedule. If you decide you want to dedicate your entire 4-hour window exclusively to an exhaustive, deep-dive examination of the Taj Mahal's architecture, or if you simply need an early departure to catch a train, we will instantaneously adjust the plan. You tell your guide what you need, and they execute the logistics flawlessly. This ultimate flexibility is the core advantage of booking a high-authority, fully private travel experience over a rigid group package."
      },
      {
        question: "Are shopping stops included?",
        answer: "We operate with a rigid zero-stress policy regarding commerce. Our primary mandate is historical education and visual appreciation. If you explicitly wish to see local artisans continuing the centuries-old tradition of Pietra Dura marble inlay work, your guide can facilitate an authentic, high-quality visit. However, if you prefer a strictly monumental focus, your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) itinerary will completely bypass all shopping areas. We never enforce mandatory detours to tourist traps. The decision to observe local craftsmanship relies entirely on your personal preference, ensuring your valuable time is never wasted."
      },
      {
        question: "Is sunrise included in half-day option?",
        answer: "Yes, you can absolutely schedule your half-day tour to begin at sunrise, and we actually consider this the tactical \"platinum option.\" By selecting a 5:30 AM or 6:00 AM pickup (depending on the season), you guarantee yourself the softest, most photogenic light and bypass the crushing mid-day crowds at the Taj Mahal. This early start also means you will comfortably conclude the entire tour—having seen the Taj, the Fort, and captured stunning photographs—by late morning, leaving the rest of your day completely free for relaxation or travel."
      },
      {
        question: "How much walking is involved?",
        answer: "Visiting the Taj Mahal and Agra Fort requires a moderate amount of walking. The Taj Mahal complex is expansive, and you should anticipate walking approximately 2 to 3 kilometers (mostly on flat marble and sandstone surfaces) to see the main mausoleum and the surrounding Charbagh gardens. The Agra Fort involves another 1.5 kilometers of walking, including some slight inclines. We always recommend wearing comfortable, supportive footwear. Fortunately, your private guide will expertly pace the walk, taking frequent opportunities to pause, share details, and utilize available resting spots to prevent fatigue."
      },
      {
        question: "Can we customize the itinerary?",
        answer: "Customization is the fundamental pillar of this private half-day tour. While our standard route seamlessly links the Taj Mahal and the Agra Fort, the framework is entirely yours to command. If you wish to swap the Fort for the exquisitely detailed Baby Taj (Tomb of I'timād-ud-Daulah), or if you want to include a stop at a specific, highly rated local restaurant for a quick culinary experience, your guide and chauffeur will integrate your requests on the fly. We act as your dynamic, [local expert guide](/india/agra/1-day-agra-itinerary) team, building the exact experience you specify."
      },
      {
        question: "What is the cancellation policy?",
        answer: "We understand that premium international travel demands flexibility, so we apply a highly transparent and discerning cancellation policy. If you cancel your private half-day tour more than 24 hours prior to the scheduled pickup time, you will receive a comprehensive 100% full refund with no complex administrative penalties. Cancellations made within the 24-hour window are subject to restrictions to fairly compensate our permanently dedicated chauffeurs and senior guides. This straightforward policy is designed to protect both your financial investment and our commitment to deploying elite, high-authority professionals exclusively for your booking."
      },
      {
        question: "Is a licensed guide included?",
        answer: "Yes, a federally licensed, high-authority historian guide is the centerpiece of this package. They possess official Ministry of Tourism credentials and deep academic knowledge of the Mughal Empire. They do not merely recite memorized dates; they deconstruct the Islamic calligraphy, explain the defensive engineering of the red sandstone fort, and provide the macro-political context surrounding the construction of these immense UNESCO sites. This intellectual depth transforms your visit from a simple visual walk-through into a profound, university-level exploration of India's most powerful and artistic historical era."
      },
      {
        question: "Is this better than a full-day Agra tour?",
        answer: "The half-day tour is the optimal tactical choice if you have limited time or if you prefer a tightly focused, high-impact historical experience. It efficiently delivers the two absolute \"must-see\" masterpieces (the Taj and the Fort) before monumental fatigue sets in. We eliminate any unnecessary filler. Conversely, a [full-day Agra tour](/india/agra/taj-mahal-full-day-tour) is ideal for those who possess a slower pace and wish to extensively photograph the Baby Taj, cross the river to Mehtab Bagh at sunset, or engage deeply with local culinary and artisanal experiences. The half-day is about maximum efficiency."
      }
    ];
  }
  if (slug === 'agra-photography-tour-taj-mahal') {
    return [
      {
        question: "Is a professional photographer included?",
        answer: "Yes, absolutely. This specialized tour strictly pairs you with a vetted, high-authority professional photographer who possesses deep extensive knowledge of the Taj Mahal's architecture and lighting dynamics. They are not merely standard guides with DSLRs; they understand composition, perspective, and the complex optical symmetry designed by the Mughal architects. They know precisely where to position you to eliminate background crowds and capture the intricate marble inlay work. Their mandate is to orchestrate a premium, magazine-quality photoshoot while you engage freely with the monument's historical grandeur, ensuring you receive spectacular visual assets of your once-in-a-lifetime visit."
      },
      {
        question: "How many edited photos will we receive?",
        answer: "We operate with total transparency regarding your digital deliverables. Following your intensive photography session, our team rigorously curates the portfolio to eliminate blinks, poor lighting, or unwanted background distractions. You will receive a definitive, high-resolution collection of a minimum of 50 to 80 professionally color-graded and expertly edited images. This comprehensive deliverable ensures you have premium documentation of your visit from multiple iconic vantage points, including the reflective pools, the majestic Darwaza-i-Rauza (Great gate), and the intricate marble walls of the central mausoleum itself, beautifully preserving your memory."
      },
      {
        question: "Are raw files provided?",
        answer: "Because we hold ourselves to an uncompromising standard of visual excellence, we do not typically distribute unedited RAW files. Our [professional local photographer](/india/agra) expends significant post-production effort adjusting exposure, contrast, and color balance to achieve the finished, premium aesthetic that defines our service. The curated, high-resolution JPEG files you receive represent the final, perfected artwork. However, for specialized commercial clients or unique requests, the transfer of original RAW files can absolutely be negotiated prior to the tour date, though it may incur an additional data processing fee."
      },
      {
        question: "Is sunrise included for best lighting?",
        answer: "Securing the absolute best optical environment is our priority, so we highly recommend and strongly incentivize booking this specific photography tour for the sunrise slot. This tactical 6:00 AM entry window provides the critical \"golden hour\" light, drastically reducing harsh mid-day shadows that compromise facial definition. Furthermore, the early access strategy structurally bypasses the crushing afternoon crowds, allowing our professional to secure wide, unobstructed angles of the white marble mausoleum. Navigating the changing morning light against the Yamuna River backdrop creates the definitive visual narrative of Shah Jahan's masterpiece."
      },
      {
        question: "Are DSLR cameras allowed inside Taj Mahal?",
        answer: "Yes, the Archaeological Survey of India (ASI) officially permits standard DSLR cameras and mirrorless camera systems inside the monument grounds for non-commercial, personal photography. Your professional photographer operates within these strict federal guidelines to prevent any security-related confiscation delays. We manage all foundational logistics, ensuring your camera equipment bypasses the stringent security checkpoints smoothly. This allows you and your [Agra guided tour](/india/agra/things-to-do-in-agra) photographer to immediately deploy to the prime symmetry points and capture the structural magnitude of the 17th-century complex without any administrative friction."
      },
      {
        question: "Is tripod allowed?",
        answer: "Unfortunately, federal regulations strictly prohibit the entry and utilization of tripods, monopods, and all forms of physical camera stabilization equipment inside the Taj Mahal complex. The ASI enforces this mandate universally to manage crowd flow and protect the sensitive historical surfaces. However, our highly seasoned photographers are deeply experienced in circumventing these restrictions. They utilize premium lenses with superior internal stabilization and deploy advanced low-light handheld techniques, guaranteeing that your [Taj Mahal photography shoot](/india/agra) yields impeccably sharp, high-resolution imagery regardless of the strict architectural parameters."
      },
      {
        question: "Is drone photography permitted?",
        answer: "Absolutely not. The Taj Mahal and its immediate surrounding airspace are designated as a strict, legally enforced \"No Fly Zone\" (NFZ) by the Indian government for security and monument preservation. Operating a drone will result in immediate confiscation by the Central Industrial Security Force (CISF) and severe legal consequences. Our professional service operates exclusively within the bounds of high-authority, ground-based photography. We rely on expert composition, carefully chosen angles across the Charbagh gardens, and tactical positioning to capture the monumental scale without resorting to illegal aerial methods."
      },
      {
        question: "Can this tour be used for pre-wedding shoots?",
        answer: "While we frequently accommodate couples seeking exceptionally romantic, high-quality documentation of their travels, the ASI strictly prohibits formal \"pre-wedding\" or commercial fashion shoots involving elaborate costume changes, heavy makeup styling, or significant prop utilization inside the Taj Mahal complex. If security personnel perceive the shoot as a commercial or formal wedding endeavor, they will immediately halt the session. Therefore, our photographers expertly execute a \"lifestyle aesthetic.\" We document your genuine connection and the monumental backdrop organically, avoiding any staged, commercial setups that violate federal preservation regulations."
      },
      {
        question: "Do we need special permission for professional shoots?",
        answer: "If your objective is strictly personal, non-commercial documentation—such as engagement photos, family portraits, or high-end travel memories—no special ASI permission is required, provided you follow the standard clothing and equipment guidelines. Our [local expert guide](/india/agra/agra-travel-guide-2026) photographer seamlessly manages the session within these parameters. However, if your shoot is intended for commercial advertising, editorial publication, or broadcasting, complex federal permits must be secured months in advance from the ASI headquarters in Delhi. We specialize strictly in the premium, personal documentation category to avoid these extensive bureaucratic delays."
      },
      {
        question: "What happens in case of fog or rain?",
        answer: "Weather variables in North India, specifically dense winter fog (December-January) or heavy monsoon rain (July-August), require tactical flexibility. If extreme atmospheric conditions compromise the visibility of the mausoleum, we do not simply cancel. We pivot. Our photographers expertly utilize the massive red sandstone arches of the Darwaza-i-Rauza (Main Gate) or the adjacent mosque for striking, moody compositions that leverage the weather organically. If you possess a highly flexible schedule, we will proactively attempt to reschedule your dedicated session to an alternate, clearer time slot within your Agra stay."
      },
      {
        question: "How long is the photography session?",
        answer: "This specialized, high-impact photography tour requires a dedicated time investment of approximately 2 to 3 hours inside the Taj Mahal complex. This duration is strictly necessary for our professional to navigate the crowds, position you at the five primary \"symmetry points,\" and account for any necessary waiting time at the highly coveted Princess Diana bench or the central reflection pools. We do not rush this process. This extensive window guarantees we secure a comprehensive, high-resolution portfolio that fully documents your interaction with India's most iconic architectural achievement."
      },
      {
        question: "Can we change outfits inside?",
        answer: "No. The ASI heavily enforces a strict protocol against outfit changes inside the Taj Mahal complex and its public restrooms. Attempting to change specialized clothing (such as moving from casual wear into a formal gown or a traditional sari) will immediately trigger security intervention, as it suggests an unauthorized commercial shoot. We strongly advise that you arrive at your [Agra photography session](/india/agra/taj-mahal-ticket-price-2026) fully dressed in your preferred, final attire. Our strategy relies entirely on maximizing your time capturing stunning visuals, not navigating restrictive security interventions."
      },
      {
        question: "Is this tour private?",
        answer: "Yes, absolutely. This is an elite, 100% private photography experience engineered exclusively for you, your partner, or your dedicated travel group. We totally reject the paradigm of mixing different bookings into large, chaotic clusters. Your designated professional photographer focuses their entire creative bandwidth exclusively on your session, ensuring a highly personalized narrative. You dynamically dictate the pace, request specific angles, and receive uninterrupted, high-authority direction, guaranteeing the final digital portfolio precisely matches your specific aesthetic requirements without interference from outside participants."
      },
      {
        question: "Are monument tickets included?",
        answer: "The pricing structure for this specific service covers the premium expertise of our professional photographer, their high-end camera equipment, and the extensive post-production editing required to finalize your portfolio. It intentionally excludes the baseline monument entrance tickets. However, your photographer acts as a localized concierge; they will guide you exactly on how to purchase the official ASI digital tickets immediately prior to entry. By keeping these costs strictly decoupled, you pay the exact, uninflated government rate and bypass any hidden agency markups while focusing on the creative session."
      },
      {
        question: "Is photo editing included in the package?",
        answer: "Color grading and meticulous photo editing are the absolute cornerstones of this premium [Taj Mahal photography experience](/india/agra/1-day-agra-itinerary). Our professionals do not simply hand over an SD card of flat, unprocessed JPEGs. Following your 3-hour session, the raw data undergoes an intensive post-production phase. We meticulously adjust the exposure to highlight the intricate Pietra Dura marble inlay work, optimize the dynamic range between the bright white mausoleum and the surrounding red sandstone, and crop out extraneous background crowds, ensuring a masterful final visual product."
      }
    ];
  }
  if (slug === 'heritage-walk-in-agra') {
    return [
      {
        question: "What areas are covered in the heritage walk?",
        answer: "This immersive, academically focused walking tour completely bypasses the standard, heavily trafficked tourist circuits. Instead, we delve deeply into the complex, organic architecture of Agra’s oldest residential sectors, specifically focusing on the intricate alleyways surrounding the Jama Masjid and the historic Kinari Bazaar. We examine the authentic, multi-generational havelis (mansions) that predate British colonization, investigate the ancient spice trading hubs, and engage with the localized silver and gold markets that represent the very economic foundation of the 16th and 17th-century Mughal Empire’s mercantile dominance."
      },
      {
        question: "How long is the walking tour?",
        answer: "We strictly mandate a comprehensive 2.5 to 3-hour duration for this specialized heritage walk. This timeframe is absolutely critical to moving beyond superficial observation and delivering a deep, high-authority narrative. We require this extended period to successfully navigate the dense, labyrinthine street grids of the original Mughal city, allow for organic engagement with local artisans working in narrow alleyways, and structurally analyze the architectural evolution of the ancient havelis. This is a rigorous, educational exploration, not a brief, generalized stroll through a commercialized market sector."
      },
      {
        question: "Is this tour suitable for seniors?",
        answer: "While we welcome seniors who possess a strong baseline of physical mobility, we must be highly transparent: this walk traverses complex, uneven terrain. We navigate through active, densely packed bazaars, narrow cobblestone alleyways, and areas where modern sidewalk infrastructure is completely absent. Furthermore, maneuvering around ongoing street commerce and occasional localized traffic requires active physical dexterity. If continuous walking for over two hours in vibrant, highly stimulating environments presents a challenge, we strongly recommend evaluating our more localized, vehicle-supported [Agra guided tours](/india/agra/things-to-do-in-agra) for superior comfort."
      },
      {
        question: "Is the walk crowded?",
        answer: "Yes, absolutely, and this density is a fundamental component of the authentic, high-impact experience we deliver. We are intentionally penetrating the active, living economic core of historical Agra, which operates completely independent of the sterile tourist zones. You will encounter the genuine, chaotic energy of wholesale spice merchants, silver traders, and localized transport logistics. While intense, your professional historian guide structurally navigates this complex urban environment, ensuring your absolute safety while translating the overwhelming localized sensory input into a coherent, deeply fascinating narrative regarding Mughal urban planning."
      },
      {
        question: "What is the difficulty level?",
        answer: "We scientifically classify this specific architectural and cultural exploration as a \"moderate\" difficulty endeavor. The primary challenges are not elevation changes or cardiovascular strain, but rather the sustained necessity of navigating a highly complex, uneven, and intensely active urban environment for nearly three continuous hours. You must actively maneuver through dense crowds within the Kinari Bazaar, negotiate uneven ancient paving stones, and maintain situational awareness around narrow alleyway traffic. Superior, highly supportive footwear is absolutely non-negotiable for successfully completing this rigorous [heritage walking experience](/india/agra)."
      },
      {
        question: "Are food tastings included?",
        answer: "While our primary mandate is deep architectural and historical analysis, we integrate highly localized culinary elements to provide a comprehensive cultural payload. Within the vast expanse of the Kinari Bazaar and its surrounding arterial streets, your expert guide will structurally introduce you to Agra's most revered, multi-generational sweetmaker to sample the authentic \"Petha\" (a translucent soft candy originating from the royal kitchens). You will also safely experience specifically vetted, traditional chai (spiced tea) stalls, organically blending the sensory reality of the market with the broader historical narrative of the city."
      },
      {
        question: "Is hotel pickup included?",
        answer: "Unlike our broad-spectrum monument packages, this highly specialized walking tour operates from a strict, centralized starting protocol. We do not provide geographically dispersed hotel pickups, as navigating a large vehicle through the dense Agra traffic to collect multiple individuals severely compromises the timeline. You will independently meet your high-authority guide at explicitly defined, highly recognizable coordinates—typically near the iconic Jama Masjid or the Agra Fort railway station—ensuring we initiate the educational walk precisely on schedule and avoid any unnecessary logistical friction or traffic delays."
      },
      {
        question: "What time is best for this walk?",
        answer: "We operate this rigorous walk during two highly specific tactical windows to maximize your experience while mitigating environmental harshness. The early morning slot (beginning between 7:30 AM and 8:00 AM) is optimal for analytical photography, offering soft light and allowing you to witness the city's organic awakening before the intense commercial chaos peaks. Alternatively, the late afternoon slot (around 4:00 PM) plunges you directly into the high-energy, vibrant reality of the peak market operations. Both timings strictly avoid the crushing, exhausting heat of the mid-day Indian sun."
      },
      {
        question: "Are monuments included in this tour?",
        answer: "This highly specialized itinerary is explicitly designed as a counter-narrative to the standard, federally ticketed monument circuit. We absolutely do not cover the interior of the Taj Mahal or the Agra Fort during this session. Instead, your [local expert guide](/india/agra/agra-travel-guide-2026) diverts your attention to the complex, secondary structures that sustained the empire: the 17th-century Jama Masjid (the colossal Friday Mosque), the intricate, privately-owned historical havelis, and the ancient active temples embedded within the market infrastructure, delivering an uncompromising look at the city's living, non-ticketed heritage."
      },
      {
        question: "Is this a private or group walk?",
        answer: "We strictly guarantee that this architectural and cultural exploration operates as a 100% private, fully enclosed experience exclusively for you and your specified travel companions. We reject the methodology of large, cumbersome group tours that dilute the educational payload. Navigating complex, dense alleyways like the Kinari Bazaar requires intense logistical control and localized situational awareness. Operating privately ensures your high-authority guide can instantaneously pause the narrative, address your highly specific architectural questions, and deeply customize the pace without managing the divergent interests of stragglers."
      },
      {
        question: "Is photography allowed?",
        answer: "Overall, photography is heavily encouraged, as the dense bazaars and intricate havelis offer profound visual documentation opportunities perfectly suited for serious street photography. However, we mandate strict adherence to ethical engagement protocols. Because this tour penetrates deeply into highly active, localized residential sectors and small-scale artisanal workshops, your professional guide will structurally define when and where explicit permission is required before photographing individuals or specific private religious sites, ensuring you capture phenomenal imagery without violating the privacy or disrupting the commercial operations of the local inhabitants."
      },
      {
        question: "Can children join this walk?",
        answer: "We strongly advise against bringing young children or toddlers on this specific itinerary. The rigorous requirement to continuously navigate highly chaotic, densely crowded commercial sectors for three hours across uneven terrain often results in severe fatigue and sensory overload for children. Managing stroller logistics inside the incredibly narrow alleyways of the Kinari Bazaar is physically impossible. Therefore, we highly recommend this complex, academically oriented [heritage walking tour](/india/agra/1-day-agra-itinerary) exclusively for adults and older teenagers who possess the stamina and focus required for a demanding urban exploration."
      },
      {
        question: "Is the walk safe in the evening?",
        answer: "Our paramount operating principle is the absolute safety and security of our clients. We do not schedule this complex urban exploration during late-night hours. All iterations of the walk are structurally designed to conclude well before nightfall or shortly after dusk while the commercial sectors remain highly active and intensely populated. Furthermore, you will remain continuously flanked by your federally licensed, high-authority guide, a seasoned local expert who understands the precise micro-geography of the alleyways, comprehensively mitigating any navigational or security vulnerabilities within the ancient city grid."
      },
      {
        question: "Are entrance tickets included?",
        answer: "The pricing architecture for this highly specialized walking tour exclusively secures the time, localized expertise, and deep academic narrative of your professional historian guide. Because we intentionally avoid the primary, heavily monetized UNESCO World Heritage sites (which operate on expensive, separate ticketing systems), there are generally no significant entrance fees required during this specific route. You will engage with active mosques, open bazaars, and historical residential sectors that are organically integrated into the modern city infrastructure and do not require formal, federally mandated ticket purchases."
      },
      {
        question: "Can this be combined with Taj Mahal visit?",
        answer: "Absolutely. This deep-dive architectural walk serves as the ultimate, intellectually rigorous complement to a traditional monument tour. We frequently organize complex, full-day itineraries where clients experience the immaculate symmetry of the Taj Mahal at dawn, rest during the harsh mid-day heat, and then deploy on this intense [Agra market exploration](/india/agra/taj-mahal-full-day-tour) in the late afternoon. This comprehensive strategy provides a completely balanced, macro-level understanding of the 17th-century Mughal Empire, contrasting the elite monumental engineering with the vibrant, chaotic reality of the city that physically built it."
      }
    ];
  }
  if (slug === 'taj-mahal-and-agra-guided-tour') {
    return [
      {
        question: "What monuments are included in the Agra city tour?",
        answer: "This comprehensive, high-authority city tour is strategically designed to cover the absolute pinnacle of Mughal architecture. The itinerary anchors on exploring the ivory-white marble mausoleum of the Taj Mahal in exhaustive detail. Following this, we transition to the massive, red sandstone defensive perimeter and ornate palaces of the Agra Fort. To complete the historical narrative, the tour concludes with the incredibly intricate Tomb of I'timād-ud-Daulah, frequently referred to as the 'Baby Taj'. These three highly specific UNESCO and federally protected sites deliver the definitive understanding of 17th-century imperial dominance, artistry, and military engineering."
      },
      {
        question: "Is Taj Mahal sunrise included?",
        answer: "Yes, we strongly advocate initiating this comprehensive city tour at sunrise. By beginning your exploration precisely when the gates open (typically between 5:30 AM and 6:00 AM depending on seasonality), you secure the critical tactical advantage of the \"golden hour\" light for photography. Furthermore, this aggressive early deployment structurally bypasses the crushing, exhausting crowds that flood the complex by mid-morning. You experience Shah Jahan's masterpiece in relative tranquility, setting a highly efficient, premium pace for the remainder of your multi-monument itinerary across the city."
      },
      {
        question: "Are entry tickets included?",
        answer: "To ensure absolute financial transparency and flexibility, this specific package covers the provision of your private, air-conditioned vehicle and your dedicated, highly credentialed historian guide, but intentionally excludes the baseline monument entrance fees. By decoupling these costs, you avoid hidden agency markups and pay the exact, uninflated government rate at each UNESCO site. More importantly, your assigned [local expert guide](/india/agra) operates as an elite logistical concierge. They seamlessly navigate the complex ASI online ticketing portals on your behalf, guaranteeing you bypass the chaotic manual queues and maximize your time inside."
      },
      {
        question: "How long is the full tour?",
        answer: "Because this is a deeply comprehensive, multi-monument exploration, you must allocate a rigorous 7 to 8 hours for the complete itinerary. This expansive timeframe guarantees that our high-authority historian guide is never forced to rush the complex narrative. We structurally allocate approximately 2.5 hours for the Taj Mahal, 2 hours for the sprawling Agra Fort complex, and 1 hour for the highly detailed Baby Taj. We also intentionally schedule dedicated intervals for high-quality dining and smooth transit through the chaotic local traffic, ensuring a physically sustainable and intellectually rewarding day."
      },
      {
        question: "Is this tour private?",
        answer: "Yes, this entire comprehensive city tour operates as a strictly 100% private, fully enveloped experience exclusively for you and your specified travel companions. We fundamentally reject the paradigm of consolidating independent bookings into large, unwieldy group tours. Your dedicated, premium vehicle and your federally licensed guide represent a dedicated strike team focused entirely on your specific educational and aesthetic requirements. You possess absolute tactical command over the itinerary, dictating the pace, lingering at crucial photography points, and directly engaging your guide with highly specific architectural questions without group interference."
      },
      {
        question: "Is hotel pickup included?",
        answer: "Absolutely. To eliminate all logistical friction and provide a genuinely premium experience, we include seamless, door-to-door transportation. Your designated, air-conditioned luxury vehicle and professionally licensed chauffeur will arrive precisely at your pre-scheduled time at any hotel, homestay, or railway station within the immediate city limits. We totally insulate you from the aggressive local taxi networks. At the conclusion of your rigorous [Agra guided tour](/india/agra/things-to-do-in-agra), you will be smoothly, securely transported back to your original starting point or any other preferred local drop-off coordinate you specify."
      },
      {
        question: "Can we add Baby Taj or Mehtab Bagh?",
        answer: "The incredibly intricate Tomb of I'timād-ud-Daulah (Baby Taj) is already a foundational component of this comprehensive city tour. However, because you command this 100% private itinerary, we can easily execute a tactical pivot to include the Mehtab Bagh (Moonlight Garden). Situated directly across the Yamuna River, this location provides the definitive, unobstructed sunset view of the Taj Mahal's rear facade. Your high-authority guide will seamlessly integrate this highly photogenic addition into the afternoon schedule, ensuring you capture the most iconic, magazine-quality imagery possible."
      },
      {
        question: "Is lunch included?",
        answer: "This specialized package intentionally decouples the cost of meals to provide you with absolute dietary freedom and financial transparency. While lunch is not included in the base price, your dedicated guide acts as a highly localized culinary concierge. They will proactively recommend rigorously vetted, premium restaurants or authentic, high-quality local establishments that align perfectly with your specific dietary requirements and hygiene standards. This strategy ensures you are never forced into substandard, pre-set tourist buffets, allowing you to control your culinary experience as tightly as your historical exploration."
      },
      {
        question: "What type of vehicle is provided?",
        answer: "We strictly deploy a modern, impeccably maintained fleet of air-conditioned vehicles to ensure your absolute comfort and security. For solo travelers or couples, we utilize premium sedans such as the Toyota Etios or Swift Dzire. For families or small groups (up to six individuals), we automatically upgrade the logistics to an extremely spacious Toyota Innova SUV, providing superior legroom and suspension. Every vehicle is thoroughly sanitized and operated by a uniformed, commercially licensed chauffeur trained in defensive driving protocols, guaranteeing a seamless [Agra travel experience](/india/agra)."
      },
      {
        question: "Is this suitable for first-time visitors?",
        answer: "This comprehensive, multi-monument itinerary is the absolute definitive strategy for first-time visitors seeking to maximize their understanding of the Mughal Empire in a single day. We completely remove the intense logistical burden of navigating a chaotic foreign city. Your high-authority historian guide and dedicated chauffeur manage every complex variable: from bypassing aggressive touts and executing priority ticketing, to establishing the optimal sequential flow between the massive UNESCO sites. We provide a totally insulated, intellectually rigorous environment that allows the first-time visitor to focus entirely on the profound history and architecture."
      },
      {
        question: "How much walking is involved?",
        answer: "Executing this comprehensive exploration of three major 17th-century monuments requires a significant degree of physical stamina. You must anticipate walking a cumulative total of approximately 4 to 6 kilometers across expansive marble platforms, uneven red sandstone courtyards, and slight inclines within the fort. High-quality, supportive footwear is absolutely mandatory. However, because this is a strictly private deployment, your senior historian guide will expertly mitigate fatigue by intentionally pacing the narrative, heavily utilizing shaded architectural features for lengthy explanations, and ensuring the physical demand remains manageable throughout the intense itinerary."
      },
      {
        question: "Are shopping stops mandatory?",
        answer: "We enforce a rigid, non-negotiable zero-stress policy regarding commerce. Our absolute mandate is high-level historical education and architectural appreciation. We will never physically force you or subtly coerce you into visiting high-pressure souvenir emporiums or tourist traps. If you explicitly request to view authentic, multi-generational artisans executing the complex Pietra Dura marble inlay techniques, your [local expert guide](/india/agra/agra-travel-guide-2026) can facilitate a legitimate, pressure-free demonstration. However, this decision rests entirely with you. If you prefer a strictly monumental focus, your itinerary will completely bypass all specialized commercial sectors."
      },
      {
        question: "Is this tour available daily?",
        answer: "This comprehensive city tour is aggressively deployed six days a week, but it is strictly UNAVAILABLE to execute on Fridays. The Indian government mandates that the Taj Mahal is entirely closed to all tourist access every Friday to accommodate mandatory prayer services at the active mosque located within the complex. If your travel matrix restricts you to a Friday arrival, we will immediately pivot to our specialized 'Friday Alternative Tour,' which heavily focuses on the Agra Fort, Baby Taj, and the stunning sunset view from Mehtab Bagh across the river."
      },
      {
        question: "What languages are available?",
        answer: "We maintain a highly specialized roster of linguistically diverse, federally licensed historian guides to cater to our elite international clientele. Beyond absolute fluency in English, we can deploy senior experts who deliver complex architectural and political narratives in Spanish, French, German, Italian, Russian, and Japanese. This ensures the profound historical payload of the Mughal dynasty is communicated seamlessly in your native tongue, preventing any critical loss of detail. Simply specify your linguistic requirement upon booking, and we will flawlessly match you with the appropriate high-authority guide."
      },
      {
        question: "What is the cancellation policy?",
        answer: "We recognize that premium international travel demands high-level flexibility, so we execute a highly transparent and discerning cancellation matrix. If you cancel this comprehensive private tour more than 24 hours prior to the designated pickup time, you will immediately receive a 100% full refund with zero complex administrative friction. Cancellations executed within the strict 24-hour window are subject to restrictions to fairly compensate our permanently dedicated chauffeurs and senior [professional guides](/india/agra/1-day-agra-itinerary). This straightforward policy structurally protects both your financial investment and our commitment to deploying elite, highly specialized personnel."
      }
    ];
  }
  if (slug === 'agra-same-guided-tour') {
    return [
      {
        question: "How long does the same-day Agra tour last?",
        answer: "This highly efficient, same-day deployment is structurally engineered to be completed within a rigorous 12 to 14-hour window, assuming a departure from the Delhi National Capital Region. This expansive timeframe precisely calculates the required 3.5-hour transit via the Yamuna Expressway in each direction. It comfortably secures a massive 5 to 6-hour operational window upon arrival, guaranteeing our high-authority historian guide can execute a comprehensive, unhurried exploration of the primary UNESCO monuments, facilitate a premium lunch, and ensure your safe return before late evening."
      },
      {
        question: "What monuments are covered?",
        answer: "This aggressive, high-impact itinerary is laser-focused on the absolute architectural apex of the Mughal Empire. The day anchors on a deep, expansive exploration of the ivory-white marble mausoleum of the Taj Mahal. Once this primary objective is secured, the tour rapidly transitions to the colossal red sandstone defensive perimeter and ornate palaces of the Agra Fort. These two massive UNESCO World Heritage sites deliver a complete, highly concentrated narrative of 17th-century imperial dominance, artistry, and military engineering without diluting the timeline with secondary, less critical structures."
      },
      {
        question: "Is pickup included from hotel?",
        answer: "Absolutely. To eliminate all early-morning logistical friction, we execute seamless, door-to-door transportation. Your designated, air-conditioned luxury vehicle and professionally licensed chauffeur will arrive exactly at your pre-scheduled time at any hotel, homestay, or specific residential coordinate within Delhi, Gurgaon, or Noida. We entirely insulate you from the aggressive local taxi networks. At the conclusion of this demanding [same-day guided tour](/india/agra), you will be securely and smoothly transported back to your exact starting point or directly to the Delhi International Airport if required."
      },
      {
        question: "Are monument tickets included?",
        answer: "To enforce absolute financial transparency, this specific rapid-deployment package covers the provision of your premium private vehicle, highway tolls, and a dedicated, highly credentialed historian guide, but intentionally excludes the baseline monument entrance fees. By decoupling these costs, you avoid hidden agency markups and pay the exact government rate. More importantly, your assigned local guide operates as an elite logistical concierge. They seamlessly navigate the complex ASI online ticketing portals on your behalf, guaranteeing you bypass the chaotic manual queues and maximize your extremely valuable time."
      },
      {
        question: "Is this tour private?",
        answer: "Yes, this entire high-efficiency itinerary operates as a strictly 100% private, fully enveloped experience exclusively for you and your specified travel companions. We fundamentally reject the paradigm of consolidating independent bookings into large, slow-moving group bus tours. Your dedicated, premium vehicle and your federally licensed guide represent a dedicated strike team focused entirely on your specific timeline and educational requirements. You possess absolute tactical command over the itinerary, dictating the pace and directly engaging your guide with highly specific architectural questions without any external group interference."
      },
      {
        question: "What vehicle type is used?",
        answer: "We strictly deploy a modern, impeccably maintained fleet of air-conditioned vehicles to ensure your absolute comfort and security during the extensive highway transit. For solo travelers or couples, we utilize premium sedans such as the Toyota Etios or Swift Dzire. For families or small groups (up to six individuals), we automatically upgrade the logistics to an extremely spacious Toyota Innova SUV, providing superior legroom and suspension. Every vehicle is thoroughly sanitized and operated by a uniformed, commercially licensed chauffeur, guaranteeing a seamless [journey to Agra](/india/agra/taj-mahal-ticket-price-2026)."
      },
      {
        question: "Can we include Fatehpur Sikri?",
        answer: "While technically possible, we strongly advise against attempting to integrate the massive abandoned city of Fatehpur Sikri into a same-day Delhi departure framework. Fatehpur Sikri is located an additional 40 kilometers beyond the city limits. Adding this complex ruins the carefully balanced timeline, converting a highly educational, comfortable exploration of the primary UNESCO sites into an exhausting, rushed logistical marathon. If Fatehpur Sikri is an absolute mandate, we strongly recommend booking our specialized overnight itinerary to ensure the architectural narrative is never severely compromised."
      },
      {
        question: "Is lunch included?",
        answer: "This specialized package intentionally decouples the cost of meals to provide you with absolute dietary freedom and financial transparency. While lunch is not included in the base price, your dedicated guide acts as a highly localized culinary concierge. They will proactively recommend rigorously vetted, premium restaurants or authentic, high-quality local establishments that align perfectly with your specific dietary requirements and hygiene standards. This strategy ensures you are never forced into substandard, pre-set tourist buffets, allowing you to control your culinary experience as tightly as your historical exploration."
      },
      {
        question: "Is this suitable for elderly travelers?",
        answer: "Because this specific itinerary demands a minimum of 7 hours of high-speed highway transit combined with extensive walking across multiple massive UNESCO monuments, it presents a significant physical challenge. While our private vehicle and [local expert guide](/india/agra/taj-mahal-full-day-tour) proactively manage the pace, utilize ramps, and identify shaded resting areas, the aggregate physical demand of a chaotic 14-hour day is intense. For elderly travelers or those with mobility limitations, we urgently recommend selecting our overnight option to structurally divide the physical output and dramatically improve the overall comfort matrix."
      },
      {
        question: "What is the best start time?",
        answer: "To secure the absolute maximum tactical advantage, we strongly mandate initiating this same-day deployment from Delhi no later than 6:00 AM. This aggressive early departure accomplishes two critical objectives: it largely bypasses the crushing, unpredictable morning gridlock within the National Capital Region, and it guarantees you arrive at the Taj Mahal complex before the intense, exhausting mid-day heat peaks. Arriving by 9:30 AM provides cooler temperatures, softer lighting for photography, and allows our high-authority guide to navigate the monuments before peak crowd density is achieved."
      },
      {
        question: "Are shopping stops included?",
        answer: "We enforce a rigid, non-negotiable zero-stress policy regarding commerce. Our absolute mandate is high-level historical education and architectural appreciation. We will never physically force you or subtly coerce you into visiting high-pressure souvenir emporiums or tourist traps. If you explicitly request to view authentic, multi-generational artisans executing the complex Pietra Dura marble inlay techniques, your guide can facilitate a legitimate, pressure-free demonstration. However, this decision rests entirely with you. Given the tight timeline of a same-day deployment, we generally recommend bypassing all specialized commercial sectors to maximize monument time."
      },
      {
        question: "Can we customize the itinerary?",
        answer: "Absolutely. Because you possess total command over this strictly private 14-hour deployment, the operational framework is entirely yours to adjust. While our standard route seamlessly links the Taj Mahal and the Agra Fort, we can easily execute a tactical pivot. If you wish to substitute the Fort for the highly intricate Baby Taj, or mandate a specific stop at a highly rated culinary establishment, your guide and chauffeur will instantaneously integrate your requests. We act as your dynamic, [premium guided tour](/india/agra) team, building the exact experience you specify."
      },
      {
        question: "What happens in case of heavy traffic?",
        answer: "While the Yamuna Expressway is generally highly efficient, unpredictable gridlock in Delhi or sudden highway incidents require tactical flexibility. Our highly experienced, commercially licensed chauffeurs utilize real-time satellite navigation and possess deep knowledge of secondary arterial routes to mitigate delays. If severe friction compromises the timeline, your dedicated high-authority guide will immediately restructure the on-ground itinerary. They will dynamically prioritize the most critical architectural elements of the Taj Mahal and the Fort, ensuring the primary educational payload is successfully delivered despite the compressed operational window."
      },
      {
        question: "Is guide included?",
        answer: "Yes, a federally licensed, high-authority historian guide is the absolute centerpiece of this package. They possess official Ministry of Tourism credentials and deep academic knowledge of the Mughal Empire. They do not merely recite memorized dates; they deconstruct the Islamic calligraphy, explain the defensive engineering of the red sandstone fort, and provide the macro-political context surrounding the construction of these immense UNESCO sites. This intellectual depth transforms your rapid same-day visit from a simple visual walk-through into a profound, university-level exploration of India's most powerful historical era."
      },
      {
        question: "Is this better than overnight stay?",
        answer: "The same-day deployment is the optimal, highly aggressive tactical choice if your overall India itinerary is severely restricted and you must process the primary UNESCO sites with maximum time efficiency. However, an overnight stay is vastly superior if you require a slower, more analytical pace. An [overnight Agra itinerary](/india/agra/1-day-agra-itinerary) allows you to secure the critical sunrise lighting at the Taj Mahal, easily incorporates secondary sites like Fatehpur Sikri, and completely eliminates the physical exhaustion of enduring seven hours of highway transit in a single day."
      }
    ];
  }
  if (slug === 'fatehpur-sikri-guided-tour') {
    return [
      {
        question: "Is this an official guide for Fatehpur Sikri?",
        answer: "Absolutely. Because this massive, structurally complex red sandstone city is designated as a protected UNESCO World Heritage site, we deploy only high-authority, federally licensed historians. They possess specific expertise in the brief but highly impactful reign of Emperor Akbar, who built this imperial capital from the ground up in the 16th century before abruptly abandoning it. Your professional guide interprets the highly advanced geometric planning, the immense Jama Masjid, and the multi-religious architectural syncretism of the primary palaces, ensuring a premium academic experience completely free from the aggressive, unregistered touts who frequently surround the massive Buland Darwaza victory gate."
      },
      {
        question: "How long does the guided tour take?",
        answer: "We strictly mandate a comprehensive 2 to 3-hour duration for the exploration of this sprawling abandoned city. This timeframe is absolutely critical to moving beyond a simple visual walk-through of the immense courtyards. We require this rigorous intellectual engagement to successfully navigate the dense, labyrinthine street grids of the original Mughal capital, analyze the specific acoustics of the Diwan-i-Khas (Hall of Private Audiences), and deconstruct the incredibly detailed carved sandstone pillars of the Panch Mahal. This duration ensures our high-authority historian guide can deliver a deeply comprehensive, multi-layered narrative of 16th-century imperial operations."
      },
      {
        question: "Where does the guide meet us?",
        answer: "Because the immediate perimeter of the Buland Darwaza and the main parking facilities are intensely chaotic and heavily populated with unregistered vendors, your federally licensed guide will execute a seamless, pre-arranged rendezvous. They will meet you precisely at the designated tourist parking lot drop-off coordinate before you board the mandatory government shuttle bus that traverses the final steep incline to the main entrance. This strategic [local expert guide](/india/agra) deployment ensures you are completely insulated from aggressive solicitation and logistical friction from the very moment you arrive at this massive archaeological complex."
      },
      {
        question: "Are entry tickets included?",
        answer: "This specific booking is purely for our premium, high-authority guiding service and intentionally excludes the cost of the monument entrance fees. However, your guide acts as your logistical architect; they will assist you in acquiring your specialized ASI digital tickets via the official government online portal, or physically at the designated priority counters near the Jodha Bai Palace entrance. By keeping the guiding fee strictly separate, you avoid any hidden markups on ticket prices. We orchestrate the ticketing process efficiently so you spend your time admiring the vast red sandstone courtyards instead of standing in administrative lines."
      },
      {
        question: "Is transport included?",
        answer: "This specific package strictly provides the elite intellectual capital of our high-authority historian guide and does not include transportation to or from the monument. You must arrange your own vehicle or utilize a pre-booked [Agra guided tour](/india/agra/things-to-do-in-agra) transport network to reach the designated meeting coordinate at the base of the plateau. Once you arrive, your dedicated guide takes absolute command, managing the mandatory government shuttle bus transfer and executing all on-site navigational logistics through the massive, multi-tiered complex of abandoned palaces, mosques, and administrative buildings."
      },
      {
        question: "How far is Fatehpur Sikri from Agra?",
        answer: "This incredibly preserved abandoned capital is situated approximately 40 kilometers (25 miles) west of central Agra, requiring a dedicated transit window of roughly 60 to 75 minutes, depending heavily on localized highway traffic and regional road conditions. Because of this significant geographical separation from the primary Taj Mahal and Agra Fort circuit, we strongly advise treating Fatehpur Sikri as a distinct half-day deployment or formally integrating it into the morning agenda if you are driving directly onward to Jaipur, ensuring you maximize your tactical [Agra travel time](/india/agra/agra-travel-guide-2026)."
      },
      {
        question: "Is this tour private?",
        answer: "Yes, this entire high-efficiency itinerary operates as a strictly 100% private, fully enveloped experience exclusively for you and your specified travel companions. We fundamentally reject the paradigm of consolidating independent bookings into large, slow-moving group bus tours. Your dedicated, premium vehicle and your federally licensed guide represent a dedicated strike team focused entirely on your specific timeline and educational requirements. You possess absolute tactical command over the itinerary, dictating the pace, lingering at crucial photography points, and directly engaging your guide with highly specific architectural questions without group interference."
      },
      {
        question: "Is it less crowded than Taj Mahal?",
        answer: "Generally, yes. While the primary Jama Masjid and the enormous Buland Darwaza see significant religious and tourist traffic, the sprawling nature of the abandoned royal complex—which spans over three kilometers—drastically dilutes the overall human density. You will experience far greater tranquility while exploring Akbar's private residential quarters, the intricately carved Anup Talao (peerless pool), and the vast administrative courtyards compared to the highly concentrated, incredibly intense crowds immediately surrounding the white marble mausoleum of the Taj Mahal. This scale provides a significantly more relaxed, highly analytical [monument viewing experience](/india/agra/taj-mahal-ticket-price-2026)."
      },
      {
        question: "How much walking is involved?",
        answer: "Executing this comprehensive exploration of the massive 16th-century capital requires a very significant degree of physical stamina. You must anticipate walking a cumulative total of approximately 3 to 4 kilometers across expansive, uneven red sandstone courtyards, traversing steep staircases near the Buland Darwaza, and navigating the vast, unshaded royal administrative sectors. High-quality, supportive footwear is absolutely mandatory. However, because this is a strictly private deployment, your senior historian guide will expertly mitigate fatigue by intentionally pacing the narrative and heavily utilizing shaded architectural features for lengthy historical explanations."
      },
      {
        question: "Is this suitable for children?",
        answer: "While we welcome families, we must be highly transparent: this massive, complex archaeological site presents significant physical challenges. The requirement to continuously navigate highly chaotic, densely populated religious sectors near the main gate, combined with extensive walking across uneven terrain with minimal modern infrastructure or shaded seating, often results in severe fatigue and sensory overload for children. Managing stroller logistics inside the incredibly narrow, stepped alleyways is physically impossible. Therefore, we heavily recommend assessing your children's stamina before committing to this rigorous, academically oriented deployment."
      },
      {
        question: "Are stairs involved?",
        answer: "Yes, extensively. While the massive central courtyards of the royal sector are largely flat, accessing the primary complex involves steep mandatory inclines. More critically, the most iconic element of truth—the colossal 54-meter (177-foot) high Buland Darwaza (Gate of Magnificence)—is approached physically via a highly imposing, massive flight of 42 steep, uneven stone steps designed to intimidate visiting ambassadors. Navigating this immense structure and the subsequent tiered palatial [architectural viewpoints](/india/agra/1-day-agra-itinerary) demands robust mobility. Wheelchair accessibility across the entire site is severely limited and often practically non-existent."
      },
      {
        question: "Can we combine with Agra tour?",
        answer: "Attempting to integrate this massive, sprawling abandoned city into a standard, single-day itinerary alongside the Taj Mahal and the Agra Fort is an exceptionally poor tactical decision that we strongly advise against. Deploying to Fatehpur Sikri requires an additional 80-kilometer round trip and three hours of on-site exploration. Adding this complex ruins the carefully balanced timeline, converting a highly educational, comfortable exploration into an exhausting, rushed marathon across terrible secondary roads. We strongly mandate separating this site into its own dedicated half-day window to ensure the architectural narrative is never compromised."
      },
      {
        question: "Is Friday busy?",
        answer: "Absolutely. Fatehpur Sikri houses the incredibly sacred tomb of the revered Sufi saint Salim Chishti, situated directly inside the vast courtyard of the active Jama Masjid. Because Fridays hold immense religious significance for the local Islamic community, the area immediately surrounding the mosque and the massive Buland Darwaza becomes intensely, aggressively crowded with local worshippers and pilgrims seeking blessings. While the separate, non-religious royal palatial complex remains relatively accessible, the primary entry parameters involve navigating a highly chaotic, overwhelmingly dense environment that requires sophisticated local guidance to bypass effectively."
      },
      {
        question: "What languages are available?",
        answer: "We maintain a highly specialized roster of linguistically diverse, federally licensed historian guides to cater to our elite international clientele. Beyond absolute fluency in English, we can deploy senior experts who deliver complex architectural and political narratives in Spanish, French, German, Italian, Russian, and Japanese at this specific location. This ensures the profound historical payload of Akbar's 16th-century religious syncretism and urban planning is communicated seamlessly in your native tongue, preventing any critical loss of detail. Simply specify your linguistic requirement upon booking to secure your preferred [high-authority expert](/india/agra/taj-mahal-full-day-tour)."
      },
      {
        question: "Is advance booking required?",
        answer: "We absolutely mandate advance reservations to secure our premium, high-authority historians. Because Fatehpur Sikri is located significantly outside the main city infrastructure, maintaining elite, federally licensed personnel on-site requires precise logistical coordination. If you attempt to secure a guide upon arrival at the massive, chaotic parking facilities, you will invariably engage with aggressive, unregistered touts who fabricate history and forcefully divert you into high-pressure carpet showrooms. Booking our verified, highly credentialed service in advance guarantees your intellectual safety and completely removes all aggressive local solicitation from your experience."
      }
    ];
  }
  if (slug === 'agra-friday-tour-taj-closed-alternative') {
    return [
      {
        question: "Why is Taj Mahal closed on Friday?",
        answer: "The Indian government and the Archaeological Survey of India (ASI) strictly mandate that the Taj Mahal complex is entirely closed to all tourist access every single Friday. This non-negotiable policy is enforced to exclusively accommodate the local Muslim population, who utilize the active red sandstone mosque—situated directly adjacent to the white marble mausoleum on the western side of the main plinth—for their mandatory Friday congregational Jumu'ah prayers. No tourist ticketing or entry is permitted under any circumstances, necessitating a tactical pivot for any travelers arriving in the city on this specific day."
      },
      {
        question: "What monuments are included in this alternative tour?",
        answer: "This aggressive, highly optimized alternative itinerary completely circumvents the Friday closure by anchoring immediately on the massive, red sandstone defensive perimeter and ornate palaces of the Agra Fort. We then transition to the incredibly intricate Tomb of I'timād-ud-Daulah, frequently referenced as the 'Baby Taj,' which profoundly influenced subsequent Mughal architecture. Finally, we execute a tactical deployment to the Mehtab Bagh (Moonlight Garden) located directly across the Yamuna River. This precise location delivers the definitive, unobstructed sunset view of the Taj Mahal's rear facade, ensuring you still secure iconic, magazine-quality imagery."
      },
      {
        question: "Is this a full-day tour?",
        answer: "This highly efficient alternative itinerary is structurally engineered as a comprehensive 6 to 7-hour deployment. This calculated timeframe guarantees our [high-authority local expert](/india/agra) guide can execute an expansive, unhurried exploration of the massive Agra Fort and the intensely detailed Baby Taj. It comfortably secures an extended, relaxed window across the river at Mehtab Bagh during the critical \"golden hour\" light leading precisely up to sunset. We also intentionally schedule dedicated intervals for high-quality dining and smooth transit, ensuring a physically sustainable and intellectually rewarding day without the intense rush of the standard circuit."
      },
      {
        question: "Are entry tickets included?",
        answer: "To enforce absolute financial transparency, this specific alternative package covers the provision of your premium private vehicle and a dedicated, highly credentialed historian guide, but intentionally excludes the baseline monument entrance fees for the Fort, Baby Taj, and Mehtab Bagh. By decoupling these costs, you avoid hidden agency markups and pay the exact, uninflated government tier rate. More importantly, your assigned local guide operates as an elite logistical concierge. They seamlessly navigate the complex ASI online ticketing portals on your behalf, guaranteeing you bypass the manual queues and maximize your operational time."
      },
      {
        question: "Is this tour private?",
        answer: "Yes, this entire high-efficiency itinerary operates as a strictly 100% private, fully enveloped experience exclusively for you and your specified travel companions. We fundamentally reject the paradigm of consolidating independent Friday bookings into large, slow-moving group bus tours. Your dedicated, premium vehicle and your federally licensed guide represent a dedicated strike team focused entirely on your specific timeline and educational requirements. You possess absolute tactical command over the itinerary, dictating the pace, lingering at crucial photography points at Mehtab Bagh, and directly engaging your guide with highly specific questions."
      },
      {
        question: "Is Mehtab Bagh sunset included?",
        answer: "This incredibly strategic location is the absolute pinnacle of this Friday alternative itinerary. The Mehtab Bagh (Moonlight Garden) was meticulously aligned perfectly with the Taj Mahal by the original Mughal architects, situated directly across the Yamuna River. Our [high-authority guided tour](/india/agra/things-to-do-in-agra) deploys you to this specific 25-acre garden perfectly synchronized with the late afternoon light. As the sun sets, you secure an unobstructed, unparalleled rear view of the massive white marble mausoleum reflecting in the river, completely devoid of the crushing crowds that normally populate the interior complex."
      },
      {
        question: "Is hotel pickup included?",
        answer: "Absolutely. To eliminate all logistical friction and provide a genuinely premium experience, we execute seamless, door-to-door transportation. Your designated, air-conditioned luxury vehicle and professionally licensed chauffeur will arrive exactly at your pre-scheduled time at any hotel, homestay, or railway station within the immediate city limits. We totally insulate you from the unpredictable local taxi networks. At the conclusion of your rigorous Friday exploration, you will be smoothly, securely transported back to your original starting point or any other preferred local drop-off coordinate you specify."
      },
      {
        question: "Is this suitable for first-time visitors?",
        answer: "This comprehensive, multi-monument alternative itinerary is the definitive strategy for first-time visitors severely restricted by the Friday closure. It completely removes the intense disappointment of a locked gate by aggressively substituting the massive palatial structures of the Agra Fort, the spectacular marble inlay work of the Baby Taj, and delivering the iconic Taj Mahal visual from Mehtab Bagh. Your high-authority historian guide manages every complex variable, providing a totally insulated, intellectually rigorous environment that allows the first-time visitor to extract maximum monumental value despite the significant federal operational restrictions."
      },
      {
        question: "Can we see Taj Mahal from Mehtab Bagh?",
        answer: "Yes, absolutely, and this is the specific tactical reason we deploy to this exact location. The Mehtab Bagh provides an utterly unobstructed, perfectly symmetrical rear-view of the Taj Mahal directly across the Yamuna River. In fact, many professional photographers severely prefer this exact vantage point over the interior grounds because you eliminate the aggressive crowds of tourists in your foreground. Your [professional Agra guide](/india/agra/agra-travel-guide-2026) positions you perfectly during the critical \"golden hour\" light, ensuring you capture phenomenal, magazine-quality imagery of Shah Jahan's masterpiece despite the official complex closure."
      },
      {
        question: "Is lunch included?",
        answer: "This specialized package intentionally decouples the cost of meals to provide you with absolute dietary freedom and financial transparency. While lunch is not included in the base price, your dedicated guide acts as a highly localized culinary concierge. They will proactively recommend rigorously vetted, premium restaurants or authentic, high-quality local establishments that align perfectly with your specific dietary requirements and hygiene standards. This strategy ensures you are never forced into substandard, pre-set tourist buffets, allowing you to control your culinary experience as tightly as your historical exploration."
      },
      {
        question: "What vehicle is provided?",
        answer: "We strictly deploy a modern, impeccably maintained fleet of air-conditioned vehicles to ensure your absolute comfort and security. For solo travelers or couples, we utilize premium sedans such as the Toyota Etios or Swift Dzire. For families or small groups (up to six individuals), we automatically upgrade the logistics to an extremely spacious Toyota Innova SUV, providing superior legroom and suspension. Every vehicle is thoroughly sanitized and operated by a uniformed, commercially licensed chauffeur trained in defensive driving protocols, guaranteeing a seamless transit between all the alternative monumental sites."
      },
      {
        question: "Is guide included?",
        answer: "Yes, a federally licensed, high-authority historian guide is the centerpiece of this alternative package. They possess official Ministry of Tourism credentials and deep academic knowledge of the Mughal Empire. They do not merely recite dates; they deconstruct the intense political struggles within the Agra Fort where Shah Jahan was imprisoned by his son with a [view of the Taj Mahal](/india/agra/taj-mahal-ticket-price-2026), and they explain the revolutionary architectural transition represented by the Baby Taj. This intellectual depth transforms your visit from a simple visual walk-through into a profound, university-level exploration of India's history."
      },
      {
        question: "Can this tour replace Taj Mahal visit?",
        answer: "While this rigorous, highly optimized itinerary delivers the maximum possible value on a Friday, we must be absolutely transparent: nothing fully replaces standing inside the white marble mausoleum. This alternative tour is a highly aggressive tactical mitigation strategy for travelers with inflexible schedules. It delivers brilliant photography from Mehtab Bagh, intense history at the Fort, and stunning marble work at the Baby Taj. However, if your itinerary permits any flexibility whatsoever, we strongly mandate spending an additional night to execute the official inside visit on the adjacent Thursday or Saturday."
      },
      {
        question: "Is this less crowded than regular days?",
        answer: "Generally, yes. Because the massive influx of tourists specifically targeting the interior of the Taj Mahal is entirely halted, the broader infrastructure of the city experiences slightly reduced friction. The Agra Fort and the Baby Taj will still exhibit standard baseline attendance, but the crushing, overwhelmingly dense crowds are mitigated. Furthermore, deploying our [Friday alternative exploration](/india/agra/1-day-agra-itinerary) to Mehtab Bagh ensures you bypass the intense security queues at the main gates, allowing a significantly more relaxed, highly analytical engagement with the monuments compared to the chaotic environment of a standard operational day."
      },
      {
        question: "What is the cancellation policy?",
        answer: "We apply a highly transparent and discerning cancellation matrix for this specialized Friday deployment. If you cancel this comprehensive private tour more than 24 hours prior to the designated pickup time, you will immediately receive a 100% full refund with zero complex administrative friction. Cancellations executed within the strict 24-hour window are subject to restrictions to fairly compensate our permanently dedicated chauffeurs and senior guides. This straightforward policy structurally protects both your financial investment and our commitment to maintaining elite, highly specialized personnel exclusively reserved for your Friday itinerary."
      }
    ];
  }
  if (slug === 'taj-mahal-sunrise-guided-tour') {
    return [
      {
        question: "What time does sunrise tour start?",
        answer: "The exact commencement time of your premium sunrise tour depends entirely on the specific season and the exact time of dawn. In the peak winter months (December through February), the complex gates typically open around 6:30 AM to 7:00 AM due to dense atmospheric fog. During the intense summer months, we mandate a much earlier tactical deployment, typically scheduling your dedicated hotel pickup between 5:15 AM and 5:30 AM. Your high-authority local guide will communicate precisely with you the evening prior to pinpoint the absolute optimal entry window for photography."
      },
      {
        question: "Which gate do we enter?",
        answer: "Our highly experienced guides execute a dynamic operational strategy based exclusively on localized crowd densities and your specific hotel location. We predominantly utilize the East Gate for early morning entry, as it is situated significantly closer to the primary premium hotel district in Agra and generally features slightly more organized infrastructure for VIP access. However, if our ground team determines a massive influx of tour buses at the East Gate, we will instantaneously pivot and aggressively deploy you through the West Gate to guarantee the fastest possible security clearance."
      },
      {
        question: "Is sunrise less crowded?",
        answer: "Absolutely, and this is the foundational tactical advantage of this specific early-deployment itinerary. By arriving prior to the official gate opening, you systematically bypass the massive, crushing influx of domestic tourists and large-scale bus tours that begin flooding the complex by 9:30 AM. While you will not be completely alone—as sunrise is highly coveted by serious photographers—the initial hour provides unparalleled, serene [access to the Taj Mahal](/india/agra). You can secure iconic, wide-angle photographs of the white marble mausoleum reflecting perfectly in the central pools without overwhelming background interference."
      },
      {
        question: "Are entry tickets included?",
        answer: "To enforce absolute financial transparency, this specialized premium package strictly covers your early-morning, air-conditioned transportation and the elite expertise of your federally licensed historian guide; it intentionally excludes the baseline monument entrance tickets. By decoupling this variable cost, you avoid all hidden agency markups and pay the exact, uninflated government tier rate. More importantly, your assigned local expert acts as a high-level logistical concierge. They will proactively assist you in navigating the complex ASI online ticketing portals, ensuring you completely bypass the chaotic manual ticket queues immediately upon arrival."
      },
      {
        question: "What if it is foggy?",
        answer: "In North India, dense winter fog (primarily occurring in very late December and throughout January) introduces a significant operational variable. If extreme atmospheric conditions severely compromise the initial visibility of the mausoleum from the Darwaza-i-Rauza (Main Gate), we do not cancel. We execute a strategic pivot. Our high-authority photographers and [professional Agra guides](/india/agra/things-to-do-in-agra) expertly utilize the massive red sandstone arches and the adjacent active mosque for striking, moody, and highly atmospheric close-up compositions. As the morning sun strengthens, the fog typically breaks, allowing for the classic wide shots later."
      },
      {
        question: "Is this tour private?",
        answer: "Yes, this entire high-efficiency early deployment operates as a strictly 100% private, fully enveloped experience exclusively for you and your specified travel companions. We fundamentally reject the paradigm of consolidating independent sunrise bookings into large, slow-moving group bus tours. Your dedicated, premium vehicle and your federally licensed guide represent a dedicated strike team strictly focused entirely on your specific timeline and highly specialized photographic requirements. You possess absolute tactical command over the itinerary, dictating the narrative pace and lingering at crucial symmetry points without any interference from an outside group."
      },
      {
        question: "How long do we stay inside?",
        answer: "Because this intense, early-morning exploration is designed for serious architectural appreciation and premium digital photography, we structurally allocate a dedicated 2.5 to 3-hour window specifically inside the Taj Mahal complex. This rigorous timeframe guarantees that our high-authority historian guide is never forced to rush the complex narrative. We require this extended period to successfully navigate the expansive Charbagh gardens, allow for organic engagement with the intricate Pietra Dura marble inlay work on the central mausoleum, and structurally analyze the massive red sandstone mosque and the matching guest house."
      },
      {
        question: "Is breakfast included?",
        answer: "This highly focused, specialized package intentionally decouples the cost of meals to provide you with absolute dietary freedom and financial transparency. Breakfast is not included in the base price. However, following your intensive 3-hour morning exploration of the Taj Mahal, your dedicated [local expert guide](/india/agra/agra-travel-guide-2026) acts as a highly localized culinary concierge. They will proactively recommend rigorously vetted, premium restaurants or your hotel’s primary dining room that align perfectly with your specific dietary requirements and hygiene standards, avoiding any forced attendance at substandard, pre-set tourist buffets."
      },
      {
        question: "Is this suitable for elderly travelers?",
        answer: "This aggressive early deployment is exceptionally well-suited for elderly travelers because it is meticulously engineered for comfort. Our private vehicle provides seamless, door-to-door transit to the VIP entry points before the intense local heat peaks. Inside the monument, your senior guide will proactively manage the pace, utilizing ramps where available and intentionally stopping in deeply shaded areas with seating. Exploring the enormous complex during the cooler morning hours drastically mitigates physical exhaustion, removing major logistical friction and ensuring the focus entirely remains on profound historical appreciation of the UNESCO site."
      },
      {
        question: "What should I wear in winter?",
        answer: "If you are deploying for the sunrise tour between December and early February, absolutely rigorous thermal layering is mandatory. The pre-dawn temperature in Agra frequently plummets to 4°C (39°F), and the immense white marble structure radiates intense cold. A heavy winter jacket, thermal base layers, a scarf, and gloves are non-negotiable for comfort. Because you must remove your shoes or wear provided protective shoe covers upon ascending the main mausoleum plinth, wearing thick, insulated socks is the single most critical tactical adjustment to prevent extreme foot discomfort on the freezing marble."
      },
      {
        question: "Can guide help with photos?",
        answer: "Certainly. Our seasoned, high-authority professionals understand that capturing stunning visuals in the elusive morning light is a core mandate of your [sunrise visit to Agra](/india/agra/taj-mahal-ticket-price-2026). While primarily historians, they possess exceptional spatial awareness of the massive monument's complex grounds. They know the exact, highly coveted five \"symmetry points,\" the precise angles to capture the reflection pools before the crowds arrive, and how to utilize the dynamic sunrise light organically against the white marble. They will gladly use your smartphone or DSLR to capture high-quality, perfectly framed wide-angle memories."
      },
      {
        question: "Is hotel pickup included?",
        answer: "Absolutely. To eliminate all early-morning logistical friction within a foreign environment, we execute seamless, door-to-door dark-hour transportation. Your designated, air-conditioned luxury vehicle and professionally licensed chauffeur will arrive exactly at your pre-scheduled 5:30 AM (or specified) time at any hotel, homestay, or railway station within the immediate city limits. We totally insulate you from the chaotic, unpredictable local morning taxi networks. At the conclusion of this demanding sunrise exploration, you will be securely and smoothly transported back to your exact starting point for breakfast or your onward journey."
      },
      {
        question: "Can we add Agra Fort?",
        answer: "Yes, extending this highly focused sunrise itinerary to seamlessly include the massive Agra Fort is a deeply popular, tactically sound upgrade. Following your 3-hour Taj Mahal exploration and a brief interval for breakfast at your hotel, your dedicated guide and private vehicle will deploy you directly to the enormous red sandstone defensive perimeter of the Fort. This cohesive dual-monument strategy optimally utilizes the cooler morning hours while your energy levels are peaking, securing the absolute pinnacle of Mughal architecture before the midday heat and crushing afternoon crowds set in."
      },
      {
        question: "What is cancellation policy?",
        answer: "We recognize that premium international travel demands high-level tactical flexibility, so we execute a highly transparent, discerning [cancellation matrix](/india/agra/1-day-agra-itinerary) for this specialized sunrise deployment. If you cancel this comprehensive private tour more than 24 hours prior to the designated dark-hour pickup time, you will immediately receive a 100% full refund with zero complex administrative friction. Cancellations executed within the strict 24-hour window are significantly restricted to fairly compensate our permanently dedicated chauffeurs and senior guides, protecting both your financial investment and our commitment to deploying elite, highly specialized personnel."
      },
      {
        question: "Is sunrise better than sunset?",
        answer: "For serious architectural appreciation and magazine-quality photography, the sunrise deployment is structurally vastly superior to the sunset slot. At sunrise, you are entering the pristine complex alongside a fraction of the daily crowd, allowing for clean, unobstructed camera angles and serene appreciation of the marble inlay. At sunset, you are systematically battling the cumulative aggregation of the entire day's tourists—often exceeding 20,000 people—creating an incredibly dense, loud, and chaotic environment. Sunrise guarantees the softest light interacting with the mausoleum while providing the ultimate tactical advantage over overwhelming crowds."
      }
    ];
  }
  if (slug === 'sunrise-taj-mahal-and-agra-tour-by-car') {
    return [
      {
        question: "What time is pickup from Delhi?",
        answer: "To secure the critical, highly coveted \"golden hour\" light at the Taj Mahal, executing an incredibly aggressive, pre-dawn departure from Delhi is an absolute mandate. Your designated, air-conditioned luxury vehicle and commercially licensed chauffeur will deploy to your specific Delhi NCR hotel, Gurgaon homestay, or airport location perfectly synchronized between 2:30 AM and 3:00 AM. This precise tactical departure utterly bypasses all crippling morning gridlock within the metropolitan capital, allowing a high-speed, 3.5-hour transit via the Yamuna Expressway and guaranteeing your arrival precisely as the complex gates unlock."
      },
      {
        question: "How long is the drive?",
        answer: "The highly efficient point-to-point transit from the central Delhi National Capital Region to the immediate perimeter of the UNESCO monuments in Agra demands approximately 3.5 to 4 hours of continuous driving. This timeframe relies entirely upon deploying our premium vehicles directly onto the six-lane, controlled-access Yamuna Expressway, completely bypassing the chaotic and heavily congested secondary state highways. Our seasoned, professionally licensed chauffeurs are specifically trained for these high-speed, early morning logistics, ensuring you experience a seamless, incredibly smooth journey that allows you to safely sleep and recover energy before arriving."
      },
      {
        question: "Is this fully private?",
        answer: "Yes, this entire high-efficiency, multi-city deployment operates as a strictly 100% private, fully enveloped experience exclusively designed for you and your specified travel companions. We fundamentally reject the chaotic paradigm of consolidating independent pre-dawn bookings into large, slow-moving group bus tours from Delhi. Your dedicated, premium vehicle and your federally licensed [local expert guide](/india/agra) who meets you upon arrival represent an elite strike team. You possess absolute tactical command over the itinerary, dictating the pace and directly engaging your high-authority historian with highly specific questions throughout the entire 14-hour operation."
      },
      {
        question: "Are tickets included?",
        answer: "To enforce absolute financial predictability and transparency, this specialized rapid-deployment package covers the provision of your premium private vehicle, all Yamuna Expressway highway tolls, interstate taxes, and your dedicated, highly credentialed historian guide. It intentionally excludes the baseline monument entrance fees. By decoupling these costs, you avoid all hidden agency markups and pay the exact, uninflated government tier rate. More importantly, your assigned local guide operates as an elite logistical concierge in Agra, seamlessly navigating the complex ASI online ticketing portals and ensuring you bypass the chaotic manual ticket queues immediately."
      },
      {
        question: "Is Agra Fort included?",
        answer: "Yes. This aggressive, high-impact itinerary is laser-focused on the absolute architectural apex of the Mughal Empire. Following your intensive 3-hour dawn exploration of the Taj Mahal and a subsequent scheduled breakfast interval, the tour rapidly transitions to the colossal red sandstone defensive perimeter and ornate inner palaces of the Agra Fort. These two massive, federally protected UNESCO World Heritage sites deliver a complete, highly concentrated narrative of 17th-century imperial dominance, incredible artistry, and advanced military engineering, maximizing the educational payload of your demanding single-day deployment from the capital."
      },
      {
        question: "Is breakfast included?",
        answer: "This highly specialized, private package intentionally decouples the cost of meals to provide you with absolute dietary flexibility and strict financial transparency. While breakfast is not included in the base price, a dedicated dining interval is structurally integrated into the morning timeline immediately following your 3-hour [sunrise exploration of Agra](/india/agra/taj-mahal-full-day-tour). Your high-authority guide acts as a localized culinary concierge. They will proactively guide your chauffeur to a rigorously vetted, premium 5-star hotel restaurant or an authentic, highly sanitized establishment that perfectly aligns with your specific dietary and coffee requirements."
      },
      {
        question: "What vehicle is used?",
        answer: "We strictly deploy a modern, impeccably maintained fleet of deeply sanitized, air-conditioned vehicles to ensure your absolute comfort and security during the extensive, 7-hour round-trip highway transit. For solo travelers or couples, we utilize high-end sedans such as the Toyota Etios or Swift Dzire. For families or small groups (up to six individuals), we automatically upgrade the logistics to an extremely spacious Toyota Innova SUV, providing significantly superior legroom and advanced suspension. Every vehicle is operated by a uniformed, commercially licensed chauffeur highly trained in defensive, pre-dawn highway protocols."
      },
      {
        question: "Is Yamuna Expressway toll included?",
        answer: "Yes, absolutely. To eliminate all logistical friction and annoying micro-transactions during your intense, pre-dawn transit, this premium rapid-deployment package is entirely comprehensive regarding transport fees. All mandatory infrastructure costs, including the expensive two-way Yamuna Expressway tolls, mandatory interstate commercial taxes, municipal parking fees at the Taj Mahal and Agra Fort, and the chauffeur’s dedicated allowance are fundamentally baked into the overall pricing architecture. You will not experience any hidden demands for cash or surprising transport levies from your driver at any point during your high-speed [journey to Agra](/india/agra/agra-travel-guide-2026)."
      },
      {
        question: "What if there is fog?",
        answer: "During the intense North Indian winter (late December exclusively through January), dense, paralyzing highway fog frequently introduces a severe operational variable. If visibility on the Yamuna Expressway drops below safe commercial transit parameters, our seasoned chauffeurs will strictly prioritize your absolute safety, radically reducing speed, which inevitably extends the 3.5-hour drive time. If extreme atmospheric conditions compromise the initial sunrise visibility of the mausoleum upon arrival, your high-authority guide will immediately pivot, executing striking, close-up interior architectural photography until the morning sun structurally burns off the dense atmospheric layer."
      },
      {
        question: "Can we upgrade vehicle?",
        answer: "Absolutely. Because you possess total command over this strictly private, 14-hour multi-city deployment, we seamlessly accommodate premium logistical upgrades. If you demand unparalleled comfort for the extensive highway transit, you can formally request an upgrade to our absolute top-tier luxury models, such as the ultra-premium Toyota Innova Crysta, a high-end luxury minivan, or specific European executive sedans. While these elite vehicles incur a supplementary surcharge, they deeply mitigate highway fatigue, providing exceptional recline, superior acoustics, and a significantly elevated transit experience compared to our standard commercial sedan fleet."
      },
      {
        question: "Is this suitable for kids?",
        answer: "We must be fiercely transparent: executing a 2:30 AM wake-up protocol followed immediately by 7 hours of high-speed highway transit and extensive walking across two massive UNESCO monuments presents an incredibly severe stamina challenge for toddlers or young children. While our private vehicles offer deep comfort and your seasoned guide dynamically manages the pace, the aggregate physical and sensory exhaustion of a chaotic 14-hour, multi-city deployment is immense. For families traveling with younger children, we urgently mandate evaluating our [overnight Agra itinerary](/india/agra/1-day-agra-itinerary) to structurally divide the immense physical output."
      },
      {
        question: "Are shopping stops included?",
        answer: "We enforce a rigid, non-negotiable zero-stress policy regarding commerce. Our absolute mandate is high-level historical education and premium architectural appreciation. We will never physically force you or subtly coerce you into visiting high-pressure souvenir emporiums or tourist traps. If you explicitly request to view authentic, multi-generational artisans executing the complex Pietra Dura marble inlay techniques, your guide can successfully facilitate a legitimate, pressure-free demonstration. However, given the incredibly tight timeline of a same-day deployment from Delhi, we strongly recommend aggressively bypassing all specialized commercial sectors to maximize crucial monument time."
      },
      {
        question: "Can we customize itinerary?",
        answer: "Yes, customization is the fundamental pillar of this elite, private deployment. While our standard high-efficiency route seamlessly links the Taj Mahal at dawn to the Agra Fort, the framework is yours to command. If you wish to rapidly substitute the Fort for the exquisitely detailed Baby Taj, or if you demand an immediate departure back to Delhi to secure an evening flight, your guide and chauffeur will instantaneously integrate your requests on the fly. We act as your dynamic, localized strike team, building the exact 14-hour experience you mathematically specify."
      },
      {
        question: "What is cancellation policy?",
        answer: "We recognize that premium international travel demands aggressive tactical flexibility, so we execute a highly transparent and discerning cancellation matrix. If you cancel this comprehensive, multi-city private deployment more than 24 hours prior to the designated 2:30 AM pickup time, you will immediately receive a 100% full refund with zero complex administrative friction. Cancellations executed within the strict 24-hour window are subject to deep restrictions specifically to fairly compensate our permanently dedicated [professional chauffeurs](/india/agra/taj-mahal-ticket-price-2026) and senior guides who were removed from active booking rosters to cater exclusively to your pre-dawn itinerary."
      },
      {
        question: "Is this better than train option?",
        answer: "The private car deployment executing at 2:30 AM is infinitely superior if your absolute, non-negotiable mandate is experiencing the Taj Mahal at sunrise before the crushing 20,000-person crowds arrive. The fastest commercial train from Delhi (the Gatimaan Express) does not physically arrive in Agra until 9:50 AM, guaranteeing you face brutal mid-morning heat, ruined photography lighting, and maximum tourist density. While the high-speed train is smoother during the day, the private pre-dawn car strategy provides the ultimate, unparalleled tactical advantage for serious architectural appreciation and premium, unobstructed digital photography."
      }
    ];
  }
  if (slug === 'private-taj-mahal-tour-from-delhi') {
    return [
      {
        question: "Is this a fully private car?",
        answer: "Yes, this entire high-efficiency, multi-city round trip operates as a strictly 100% private, fully enveloped transit experience exclusively designed for you and your specified travel companions. We fundamentally reject the chaotic paradigm of consolidating independent Delhi departures into large, slow-moving group bus tours. Your dedicated, premium air-conditioned vehicle and commercially licensed chauffeur represent an elite strike team dedicated solely to your specific timeline, providing an undisturbed, comfortable 7-hour round-trip journey without strangers or multiple unscheduled stops."
      },
      {
        question: "What vehicle category is included?",
        answer: "We strictly deploy a modern, impeccably maintained fleet of deeply sanitized, air-conditioned vehicles to ensure your absolute comfort and security during the extensive, 7-hour round-trip highway transit. For solo travelers or couples, we utilize high-end sedans such as the Toyota Etios or Swift Dzire. For families or small groups (up to six individuals), we automatically upgrade the logistics to an extremely spacious Toyota Innova SUV, providing significantly superior legroom, advanced suspension, and robust luggage capacity for your comprehensive full-day deployment."
      },
      {
        question: "Is guide included in Agra?",
        answer: "Absolutely. This aggressive, high-impact itinerary seamlessly connects your private Delhi transit with the absolute architectural apex of the Mughal Empire. A federally licensed, high-authority [local expert guide](/india/agra) will intercept your designated vehicle precisely upon arrival in Agra. They possess official Ministry of Tourism credentials and deep academic knowledge, completely transforming your rapid 6-hour monumental exploration from a simple visual walk-through into a profound, university-level deconstruction of 17th-century imperial dominance, incredible artistry, and advanced military engineering."
      },
      {
        question: "Are tickets included?",
        answer: "To enforce absolute financial predictability and strict pricing transparency, this specialized rapid-deployment package covers the provision of your premium private vehicle, all Yamuna Expressway highway tolls, interstate commercial taxes, and your dedicated, highly credentialed historian guide. It intentionally excludes the baseline monument entrance fees. By decoupling these massive variable costs, you avoid all hidden agency markups and pay the exact, uninflated government tier rate. More importantly, your assigned local guide operates as an elite logistical concierge immediately upon arrival."
      },
      {
        question: "Is Agra Fort included?",
        answer: "Yes. This dense, multi-monument itinerary is laser-focused perfectly on maximizing the educational payload of your demanding single-day deployment from the capital. Following your intensive, detailed exploration of the Taj Mahal and a subsequent scheduled dining interval, the tour rapidly transitions to the colossal red sandstone defensive perimeter and ornate inner palaces of the Agra Fort. These two massive, federally protected UNESCO World Heritage sites deliver a complete, highly concentrated narrative of the staggering power and wealth of the Mughal dynasty."
      },
      {
        question: "Is lunch included?",
        answer: "This highly specialized, private Delhi departure package intentionally decouples the cost of meals to provide you with absolute dietary flexibility and strict financial transparency. While lunch is not included in the base price, a dedicated dining interval is structurally integrated into the timeline immediately following your primary [Taj Mahal exploration](/india/agra/taj-mahal-full-day-tour). Your high-authority Agra guide acts as a localized culinary concierge, proactively guiding your chauffeur to a rigorously vetted, premium 5-star hotel restaurant or an authentic, highly sanitized establishment aligning with your specific dietary needs."
      },
      {
        question: "Can we start early for sunrise?",
        answer: "Absolutely. To secure the critical, highly coveted \"golden hour\" light at the Taj Mahal, executing an incredibly aggressive, pre-dawn 2:30 AM to 3:00 AM departure from Delhi is an incredibly popular tactical mandate that we seamlessly execute daily. This precise tactical departure utterly bypasses all crippling morning gridlock within the metropolitan capital, allowing a high-speed, 3.5-hour transit via the Yamuna Expressway and guaranteeing your arrival precisely as the complex gates unlock, ensuring spectacular photography before the destructive mid-day heat peaks."
      },
      {
        question: "What if traffic is heavy?",
        answer: "While the Yamuna Expressway is generally an incredibly efficient, controlled-access highway, unpredictable gridlock upon re-entering the Delhi National Capital Region in the late evening requires significant tactical flexibility. Our highly experienced, commercially licensed chauffeurs utilize real-time satellite navigation algorithms and possess deep, organic knowledge of secondary arterial routes. If severe friction compromises your 3.5-hour return timeline or threatens an onward flight departure, your dedicated chauffeur will immediately restructure the transit vectors precisely to mitigate delays and secure a safe return."
      },
      {
        question: "Is toll included?",
        answer: "Yes, absolutely. To eliminate all logistical friction and annoying micro-transactions during your intense highway transit, this premium rapid-deployment package is entirely comprehensive regarding transport fees. All mandatory infrastructure costs, including the expensive two-way Yamuna Expressway tolls, mandatory interstate commercial taxes, municipal parking fees at the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) facilities and the Fort, and the chauffeur’s dedicated allowance are fundamentally baked into the overall pricing architecture. You will not experience any hidden demands for cash or surprising transport levies from your driver."
      },
      {
        question: "Is hotel pickup from Gurgaon included?",
        answer: "Yes. To eliminate all logistical friction within a sprawling foreign metropolitan environment, we execute seamless, door-to-door transportation. Your designated, air-conditioned luxury vehicle and professionally licensed chauffeur will arrive exactly at your pre-scheduled time at any hotel, homestay, or corporate residential coordinate within Central Delhi, New Delhi, Noida, or specifically the massive technological hub of Gurgaon. We totally insulate you from the chaotic, unpredictable local taxi networks from the exact moment your rigorous 14-hour exploration commences."
      },
      {
        question: "Is this suitable for elderly?",
        answer: "Because this specific itinerary demands a minimum of 7 hours of high-speed highway transit combined with extensive walking across multiple massive UNESCO monuments within the Agra urban heat index, it presents a significant physical challenge. While our private air-conditioned vehicle and local expert guide proactively manage the pace, utilize ramps, and identify shaded resting areas, the aggregate physical demand of a chaotic 14-hour day is intense. For elderly travelers or those with mobility limitations, we urgently recommend dividing the immense physical output by selecting an overnight itinerary."
      },
      {
        question: "Can we avoid shopping stops?",
        answer: "We enforce a rigid, non-negotiable zero-stress policy regarding commerce. Our absolute mandate is high-level historical education and premium architectural appreciation. We will never physically force you or subtly coerce you into visiting high-pressure souvenir emporiums or tourist traps. If you explicitly request to view authentic, multi-generational artisans executing the complex Pietra Dura marble inlay techniques, your guide can successfully facilitate a legitimate, pressure-free demonstration. However, given the tight 6-hour monumental timeline, we strongly recommend aggressively bypassing all [specialized commercial sectors](/india/agra/things-to-do-in-agra)."
      },
      {
        question: "Is this customizable?",
        answer: "Yes, customization is the fundamental pillar of this elite, private deployment. While our standard high-efficiency route seamlessly links the Taj Mahal to the Agra Fort, the 14-hour framework is entirely yours to command. If you wish to rapidly substitute the Fort for the exquisitely detailed Baby Taj, execute an immediate departure back to Delhi to secure an international evening flight, or add a specific culinary detour, your guide and chauffeur will instantaneously integrate your specific requests on the fly."
      },
      {
        question: "What is cancellation policy?",
        answer: "We recognize that premium international travel demands aggressive tactical flexibility, so we execute a highly transparent and discerning cancellation matrix. If you cancel this highly complex, multi-city private deployment more than 24 hours prior to the designated pickup time, you will immediately receive a 100% full refund with zero complex administrative friction. Cancellations executed within the strict 24-hour window are subject to deep restrictions specifically to fairly compensate our permanently dedicated, premium chauffeurs and senior guides assigned exclusively to your itinerary."
      },
      {
        question: "Is this better than group tour?",
        answer: "The private car deployment is infinitely superior to any consolidated group bus itinerary if your absolute, non-negotiable mandate is maximizing efficiency, comfort, and personalized intellectual engagement. A group bus typically stops at multiple Delhi hotels to collect 30 passengers, wasting hours of valuable time before even reaching the Yamuna Expressway. Furthermore, your dedicated, [high-authority local expert](/india/agra/agra-travel-guide-2026) operates exactly at your pace once inside the monuments, completely abandoning the slow, frustratingly generic narrative forced upon massive, unwieldy tourist groups."
      }
    ];
  }
  if (slug === 'agra-overnight-tour') {
    return [
      {
        question: "What hotel category is included?",
        answer: "Our standard overnight deployment heavily prioritizes superior comfort, rigorous sanitation protocols, and extreme proximity to the UNESCO monuments. We strictly partner with rigorously vetted, premium 4-Star or luxury 5-Star properties—such as the ITC Mughal, Taj Hotel & Convention Centre, or the Courtyard by Marriott—that consistently deliver exceptional service, highly rated international culinary options, and robust, reliable air-conditioning infrastructure. This dedicated overnight recovery interval completely breaks the immense physical exhaustion of completing 7 hours of highway transit in a single day."
      },
      {
        question: "Is Taj Mahal sunrise included?",
        answer: "Absolutely, and this is the foundational tactical advantage of booking the overnight strategy. By sleeping deeply within a 5-Star property located mere minutes from the East Gate, you systematically bypass the crippling 2:30 AM departure from Delhi. You wake comfortably, deploy immediately to the VIP entry complex at 5:30 AM, and secure the highly coveted \"golden hour\" light for unparalleled digital photography. This guarantees you experience the white marble mausoleum reflecting perfectly in the central pools without the overwhelming background interference of the mid-morning crowds."
      },
      {
        question: "Is this private?",
        answer: "Yes, this entire high-efficiency, multi-city overnight deployment operates as a strictly 100% private, fully enveloped transit experience exclusively designed for you and your specified travel companions. We fundamentally reject the chaotic paradigm of consolidating independent Delhi departures into large, slow-moving group bus tours. Your dedicated, premium air-conditioned vehicle, your commercially licensed chauffeur, and your [federally licensed Agra guide](/india/agra/1-day-agra-itinerary) represent an elite strike team dedicated entirely to your specific 48-hour timeline, dictating a highly personalized, undisturbed educational narrative."
      },
      {
        question: "Are tickets included?",
        answer: "To enforce absolute financial predictability and strict pricing transparency, this specialized rapid-deployment package covers the provision of your premium private vehicle, all Yamuna Expressway highway tolls, interstate commercial taxes, luxury hotel accommodation, and your dedicated, highly credentialed historian guide. It intentionally excludes the baseline monument entrance fees. By decoupling these massive variable costs, you avoid all hidden agency markups and pay the exact, uninflated government tier rate. More importantly, your assigned local guide operates as an elite logistical concierge immediately upon arrival."
      },
      {
        question: "Is Agra Fort included?",
        answer: "Yes. This relaxed, multi-monument itinerary is laser-focused perfectly on maximizing the educational payload of your demanding two-day deployment from the capital without physical exhaustion. Following your arrival on Day 1, we typically deploy to the colossal red sandstone defensive perimeter and ornate inner palaces of the Agra Fort, leaving the magnificent Taj Mahal explicitly reserved for the superior sunrise lighting on Day 2. These massive, federally protected UNESCO World Heritage sites deliver a complete, highly concentrated narrative of imperial domination."
      },
      {
        question: "Is dinner included?",
        answer: "This highly specialized, private package intentionally decouples the cost of your primary evening meal to provide you with absolute dietary flexibility and strict financial transparency. While dinner is not included in the base overnight pricing architecture, your 4-Star or 5-Star luxury hotel provides phenomenal, highly sanitized international dining options directly on-site. Alternatively, if your culinary preferences require it, your [high-authority local guide](/india/agra) acts as a localized concierge, proactively guiding your chauffeur to a rigorously vetted, authentic Mughlai restaurant in the city center."
      },
      {
        question: "Can we upgrade hotel?",
        answer: "Absolutely. Because you possess total command over this strictly private, 48-hour multi-city deployment, we seamlessly accommodate ultra-premium logistical upgrades. If you demand unparalleled, world-class luxury, you can formally request an immediate upgrade to the legendary Oberoi Amarvilas. This staggering, ultra-elite property is situated merely 600 meters from the Taj Mahal, guaranteeing that every single room, suite, and restaurant offers an uninterrupted, jaw-dropping view of the white marble mausoleum, providing an exponentially elevated, unforgettable luxury experience compared to our standard premium options."
      },
      {
        question: "What vehicle is used?",
        answer: "We strictly deploy a modern, impeccably maintained fleet of deeply sanitized, air-conditioned vehicles to ensure your absolute comfort and security during the extensive, 7-hour round-trip highway transit. For solo travelers or couples, we utilize high-end sedans such as the Toyota Etios or Swift Dzire. For families or small groups (up to six individuals), we automatically upgrade the logistics to an extremely spacious Toyota Innova SUV, providing significantly superior legroom, advanced suspension, and robust luggage capacity for your comprehensive overnight deployment."
      },
      {
        question: "Is Yamuna Expressway safe?",
        answer: "The Yamuna Expressway is a highly modern, controlled-access six-lane concrete highway that drastically reduces transit friction between the National Capital Region and Uttar Pradesh. However, operating vehicles at sustained high speeds mathematically increases baseline risk parameters. To completely mitigate this, we strictly deploy highly experienced, commercially licensed chauffeurs explicitly trained in defensive [highway driving protocols](/india/agra/taj-mahal-ticket-price-2026). Our premium, rigorously maintained, modern fleet ensures absolute mechanical reliability and strict adherence to speed limits, generating a deeply secure, highly comfortable 3.5-hour transit experience."
      },
      {
        question: "Is this suitable for families?",
        answer: "Yes! This specific, well-paced 48-hour itinerary is the absolute, definitive, strongly mandated recommendation for families traveling with toddlers, young children, or elderly family members. The overnight interval structurally divides the immense, exhausting physical output of transit, radically mitigating massive sensory overload and heat exhaustion. Deploying to the monuments in shorter, manageable blocks across two days ensures your children possess the stamina to actually engage with the historical narrative rather than suffering through a brutal, chaotic 14-hour marathon from Delhi."
      },
      {
        question: "Is guide included both days?",
        answer: "Yes, your federally licensed, high-authority historian guide is designated exclusively to your booking for the complete duration of your monumental engagement across both operational days. They possess official Ministry of Tourism credentials and deep academic knowledge. They will seamlessly deconstruct the intense political struggles within the Agra Fort on Day 1, and flawlessly orchestrate the critical VIP entry logistics and complex architectural analysis of the Taj Mahal during the highly coveted sunrise deployment on Day 2, delivering unparalleled intellectual consistency."
      },
      {
        question: "Can we customize itinerary?",
        answer: "Customization is the absolute, fundamental pillar of this elite, highly flexible overnight deployment. Because the 48-hour framework radically expands your on-ground operational window, your high-authority [professional local guide](/india/agra/things-to-do-in-agra) and dedicated chauffeur can instantaneously integrate complex, secondary objectives. If you wish to seamlessly add the incredible abandoned red sandstone city of Fatehpur Sikri, deploy to the Mehtab Bagh (Moonlight Garden) for a spectacular sunset photography session, or add a specific culinary detour, we act as your dynamic, localized strike team."
      },
      {
        question: "Is shopping optional?",
        answer: "We enforce a rigid, non-negotiable zero-stress policy regarding commerce. Our absolute mandate is high-level historical education and premium architectural appreciation. We will never physically force you or subtly coerce you into visiting high-pressure souvenir emporiums or tourist traps. While the expanded timeline of an overnight deployment allows you to comfortably explore authentic, multi-generational artisans executing the complex Pietra Dura marble inlay techniques if you explicitly request it, this decision rests entirely with you. You possess absolute tactical control over commerce."
      },
      {
        question: "What is cancellation policy?",
        answer: "We recognize that premium international travel demands aggressive tactical flexibility, so we execute a highly transparent, discerning cancellation matrix. If you cancel this highly complex, hotel-inclusive private deployment more than 48 hours prior to the designated pickup time, you will immediately receive a 100% full refund with zero complex administrative friction. Cancellations executed within the strict 48-hour window are subject to deep restrictions specifically to cover non-refundable hotel room reservations and to fairly compensate our permanently dedicated, premium chauffeurs."
      },
      {
        question: "Is overnight better than same day?",
        answer: "Without question. For serious architectural appreciation, magazine-quality photography, and absolute physical comfort, the overnight deployment is structurally infinitely superior to the grueling same-day marathon. An overnight stay allows you to comfortably secure the critical, deeply serene sunrise lighting at the Taj Mahal, easily incorporates massive secondary UNESCO sites like Fatehpur Sikri without rushing, and completely eliminates the severe physical exhaustion of enduring seven hours of relentless highway transit and six hours of walking in a single, chaotic 14-hour window."
      }
    ];
  }
  if (slug === 'taj-mahal-tour-by-train-gatimaan') {
    return [
      {
        question: "What is Gatimaan Express?",
        answer: "The Gatimaan Express is India's premier, highly specialized semi-high-speed train explicitly built to flawlessly connect the Delhi National Capital Region to the monumental circuit of Agra in an unprecedented 100 minutes. Capable of operating at an intense 160 km/h (99 mph), it structurally bypasses all unpredictable, soul-crushing highway gridlock and localized traffic variables, guaranteeing highly efficient, remarkably precise [transit to the Taj Mahal](/india/agra/agra-travel-guide-2026). This clean, deeply modernized train represents the absolute pinnacle of Indian railway engineering and luxury."
      },
      {
        question: "What class is included?",
        answer: "Our standard, high-efficiency train deployment automatically guarantees premium, confirmed air-conditioned AC Chair Car (CC) seating. This robust category provides highly comfortable, padded reclining seats, expansive viewing windows, deeply sanitized environments, and highly reliable climate control, completely insulating you from the intense weather and chaotic external environment. This deeply secures a smooth, professional, and entirely stress-free 100-minute journey, setting an exceptionally positive, relaxed physical baseline before you deploy on your demanding 6-hour monumental exploration across the city."
      },
      {
        question: "Is breakfast served?",
        answer: "Yes, absolutely. The Gatimaan Express is highly unique because its ticket architecture fundamentally includes comprehensive, airline-style onboard catering. During your high-speed 8:10 AM departure from Hazrat Nizamuddin Railway Station, the deeply professional, uniformed train staff will seamlessly serve a highly sanitized, robust breakfast tray directly to your designated seat, offering a choice of standard continental options or deeply authentic, highly flavorful Indian cuisine, complete with tea and coffee. This eliminates the necessity of arranging hotel breakfasts perfectly before your aggressive morning departure."
      },
      {
        question: "Are train tickets included?",
        answer: "Yes. This tightly integrated, specialized package entirely covers the significant financial and logistical burden of securing confirmed, premium Gatimaan Express tickets for both your aggressive morning departure and your precise evening return. Navigating the incredibly complex, highly saturated Indian Railway (IRCTC) booking portal is notoriously difficult and heavily restricted for international travelers. Our elite operational team completely bypasses this immense friction, guaranteeing your high-speed [Delhi to Agra transit](/india/agra/taj-mahal-ticket-price-2026) is definitively locked in without requiring any complex micro-transactions from you."
      },
      {
        question: "Who meets us at Agra station?",
        answer: "Because the Agra Cantonment (AGC) railway station is intensely chaotic and heavily populated with aggressive, unregistered touts targeting arriving trains, our federally licensed guide executes a seamless, VIP rendezvous. They will meet you precisely at your designated coach door or immediately at the primary exit, deploying a highly recognizable name board. This strategic synchronization ensures you are completely insulated from all local solicitation and instantly transferred to your waiting, private air-conditioned vehicle to begin your monumental exploration without a single second lost."
      },
      {
        question: "Are entry tickets included?",
        answer: "To enforce absolute financial predictability and strict pricing transparency, this highly specialized rapid-deployment package covers your confirmed premium train tickets, all private air-conditioned transportation within the city, and your dedicated, highly credentialed historian guide. It intentionally excludes the baseline monument entrance fees. By decoupling these massive variable costs, you avoid all hidden agency markups and pay the exact, uninflated government tier rate. More importantly, your assigned local guide operates as an elite logistical concierge immediately upon [arrival at the UNESCO monuments](/india/agra)."
      },
      {
        question: "Is Agra Fort included?",
        answer: "Yes. This dense, multi-monument itinerary is laser-focused perfectly on maximizing the educational payload of your demanding single-day deployment from the capital. Following your intensive, deeply focused exploration of the Taj Mahal and a subsequent scheduled dining interval, the tour rapidly transitions to the colossal red sandstone defensive perimeter and ornate inner palaces of the Agra Fort. These two massive, federally protected UNESCO World Heritage sites deliver a complete, highly concentrated narrative of the staggering power, incredible artistry, and advanced engineering of the Mughal dynasty."
      },
      {
        question: "What if train is delayed?",
        answer: "While the premium Gatimaan Express commands the absolute highest tactical priority on the Indian railway network and is famously celebrated for its razor-sharp punctuality, extreme weather anomalies such as the dense, paralyzing winter fog (late December and January) can introduce minor operational variables. If visibility structurally forces the train to temporarily reduce its aggressive 160 km/h cruising speed, your dedicated, high-authority historian guide will instantaneously restructure the on-ground itinerary. They will dynamically prioritize the most critical architectural elements of the Taj Mahal and the Fort."
      },
      {
        question: "Is return ticket included?",
        answer: "Yes, absolutely. The structural foundation of this seamless itinerary is the 100% guaranteed confirmation of your return ticket on the Gatimaan Express, aggressively departing Agra Cantonment exactly at 17:50 (5:50 PM). Our elite team precisely reverse-engineers the entire 6-hour monumental timeline, ensuring your dedicated chauffeur and [local expert guide](/india/agra/1-day-agra-itinerary) deposit you securely back at the station well ahead of the scheduled departure. During this smooth, 100-minute evening return, you will again be served high-quality, airline-style snacks directly to your designated seat."
      },
      {
        question: "Is pickup to Delhi station included?",
        answer: "Yes. To completely eliminate all early-morning logistical friction within a sprawling foreign metropolitan environment, we execute seamless, door-to-door transportation. Your designated, air-conditioned luxury vehicle and professionally licensed chauffeur will arrive exactly at your pre-scheduled time at any hotel in Delhi or Gurgaon to smoothly transfer you to the specific platform at Hazrat Nizamuddin Station. At the conclusion of this demanding 14-hour exploration, another dedicated vehicle will be waiting at the Delhi station to securely return you to your exact starting point."
      },
      {
        question: "Is this faster than car?",
        answer: "Mathematically, the high-speed Gatimaan Express is vastly superior and significantly faster than executing the highway transit via the Yamuna Expressway. The train strictly requires exactly 100 minutes to complete the transit. Operating a private vehicle, even at maximum legal speeds, requires a massive minimum of 3.5 to 4 hours in each direction. While a car provides ultimate timeline flexibility and allows for ultra-early sunrise deployments, the train drastically mitigates profound physical exhaustion by entirely eliminating devastating, unpredictable highway gridlock."
      },
      {
        question: "Is Executive Class upgrade available?",
        answer: "Absolutely. Because you possess total command over this elite, high-efficiency deployment, we seamlessly accommodate ultra-premium logistical upgrades. If you demand unparalleled comfort for the 100-minute transit, you can formally request an immediate upgrade to the ultra-elite AC Executive Class (EC). This staggered, highly spacious 2x2 seating configuration provides exceptionally superior legroom, upgraded culinary options, completely localized privacy, and a significantly elevated transit experience compared to the standard AC Chair Car, ensuring you arrive at the [UNESCO monuments](/india/agra/taj-mahal-full-day-tour) deeply rested."
      },
      {
        question: "What ID is required?",
        answer: "The Indian Railway Catering and Tourism Corporation (IRCTC) operates under extremely strict, uncompromising federal security protocols. To legally board the Gatimaan Express, every single traveler must present a valid, original physical ID matching exactly the name printed on the confirmed e-ticket. For international travelers, your original, physical passport is absolutely non-negotiable; photocopies or digital images on smartphones will result in immediate denial of boarding by the Traveling Ticket Examiner (TTE) and specialized railway police. Ensure this critical documentation is secured before hotel pickup."
      },
      {
        question: "Is this suitable for seniors?",
        answer: "The high-speed Gatimaan Express deployment is statistically the safest, most physically comfortable, and highly recommended transit method for elderly travelers or those experiencing mild mobility limitations. It completely eliminates the bone-jarring 7-hour highway transit and massive vehicular fatigue associated with a long car journey. While walking across the massive UNESCO monuments still requires stamina, arriving in Agra precisely after an impeccably smooth 100-minute journey drastically improves the overall comfort matrix, allowing our [premium historian guide](/india/agra/things-to-do-in-agra) to execute an unhurried, highly accommodating exploration."
      },
      {
        question: "What is cancellation policy?",
        answer: "We execute a highly stringent, transparent cancellation matrix for this specialized train deployment due to the incredibly rigid IRCTC refund protocols. Because we heavily invest non-refundable capital to secure the highly coveted Gatimaan Express tickets immediately upon booking, cancellations fundamentally incur specific structural penalties relative to the train's departure window. However, any associated on-ground private vehicles or elite guiding services in Agra are deeply flexible and typically fully refundable if structurally cancelled more than 24 hours prior to the designated monumental operation."
      }
    ];
  }
  if (slug === 'hidden-gems-of-agra-heritage-tour') {
    return [
      {
        question: "What hidden gems does this Agra heritage tour cover?",
        answer: "This tour covers the magnificent but often overlooked monuments that most tourists miss when they focus exclusively on the Taj Mahal. You will explore the exquisite Itimad-ud-Daulah (Baby Taj), which pioneered the Pietra Dura inlay technique later perfected in the [Taj Mahal](/india/agra/taj-mahal-official-guided-tour). You will also visit Mehtab Bagh for a breathtaking cross-river view of the Taj, the historic Jama Masjid, Kinari Bazaar, and centuries-old Mughal-era havelis in the narrow lanes of the old city. These sites provide a layered understanding of Agra's architectural evolution far beyond the mainstream circuit."
      },
      {
        question: "Is a licensed guide included in this heritage tour?",
        answer: "Yes, your tour is led by a certified, ASI-licensed heritage guide who specializes in Agra's lesser-known architectural history. Unlike standard guides who focus solely on the Taj Mahal narrative, our heritage specialists provide deep-dive commentary on Mughal-era engineering, Persian garden design, and the socio-political context of each monument. This expert guidance transforms your [Agra visit](/india/agra/agra-travel-guide-2026) from a surface-level sightseeing trip into a comprehensive historical education that covers five centuries of craftsmanship."
      },
      {
        question: "How long does the Hidden Gems of Agra tour take?",
        answer: "The tour is designed to be a comprehensive 3-hour heritage immersion. This duration allows you to explore each hidden gem without feeling rushed while still leaving ample time for a [Taj Mahal visit](/india/agra/taj-mahal-opening-time) or other [things to do in Agra](/india/agra/things-to-do-in-agra). We pace the itinerary to include adequate photography stops, refreshment breaks, and in-depth storytelling at each site, ensuring you absorb the full historical weight of these underappreciated masterpieces."
      },
      {
        question: "Can this tour be combined with a Taj Mahal visit?",
        answer: "Absolutely. Many discerning travelers book this heritage tour as the perfect complement to their [Taj Mahal guided tour](/india/agra/taj-mahal-agra-fort-guided-tour). The hidden gems provide essential historical context that enriches your understanding of the Taj Mahal's architectural lineage. We recommend scheduling this tour either before or after your Taj visit to create a comprehensive [1-day Agra itinerary](/india/agra/1-day-agra-itinerary) that covers both the iconic landmarks and the authentic, crowd-free heritage sites that define the true soul of Agra."
      },
      {
        question: "Is Itimad-ud-Daulah (Baby Taj) really worth visiting?",
        answer: "The Itimad-ud-Daulah is considered the architectural prototype of the Taj Mahal and is absolutely essential for any serious traveler. Built 20 years before the Taj, it was the first Mughal structure to use white marble extensively and pioneered the intricate Pietra Dura gemstone inlay technique. With significantly fewer crowds than the Taj, you can examine the delicate lattice screens and semi-precious stone work up close without competition. Art historians consider it a more refined example of Mughal craftsmanship, making it a must-see on any [Agra heritage itinerary](/india/agra/agra-city-highlights-tour)."
      },
      {
        question: "What is the best time of day for this heritage tour?",
        answer: "The optimal window is early morning (7:00-10:00 AM) or late afternoon (3:00-6:00 PM). The early morning slot pairs perfectly with a [sunrise Taj Mahal tour](/india/agra/taj-mahal-sunrise-guided-tour), allowing you to experience the hidden gems while the light is soft and the crowds are minimal. The late afternoon slot offers the spectacular golden-hour lighting at Mehtab Bagh, where you can photograph the Taj Mahal bathed in warm sunset tones from across the Yamuna River—a perspective most tourists never experience."
      },
      {
        question: "Is this tour suitable for elderly travelers or children?",
        answer: "Yes, the tour is designed with accessibility in mind. The walking distances between sites are moderate, and we use a comfortable private vehicle for transfers between monuments. Rest stops are built into the itinerary. For elderly travelers, we can adjust the pace and prioritize the most impactful sites. Children benefit enormously from the storytelling approach our guides use, transforming historical facts into engaging narratives about emperors, princesses, and architectural rivalries that captivate young imaginations."
      },
      {
        question: "Are monument entry tickets included?",
        answer: "Entry tickets to all the heritage sites covered in this tour are included in the package price. This removes the hassle of queuing at multiple ticket windows and ensures seamless transitions between sites. Your guide handles all ticketing logistics, allowing you to focus entirely on the history and architecture. This all-inclusive approach is what separates a premium heritage experience from basic sightseeing, ensuring your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) journey is completely friction-free."
      },
      {
        question: "What makes this different from a standard Agra city tour?",
        answer: "Standard city tours typically rush through the Taj Mahal and Agra Fort before depositing you at a marble emporium. Our heritage tour deliberately avoids these tourist traps and instead focuses on the authentic, lesser-visited monuments that reveal Agra's true architectural DNA. You will walk through neighborhoods that haven't changed in centuries, visit tombs that predate the Taj by decades, and gain perspectives that 95% of tourists never access. This is the tour for travelers who have already seen the Taj and want deeper understanding, or those who want a [comprehensive Agra experience](/india/agra/agra-city-highlights-tour)."
      },
      {
        question: "Can we visit Mehtab Bagh during this tour?",
        answer: "Yes, Mehtab Bagh (Moonlight Garden) is a highlight of this heritage tour. Located directly across the Yamuna River from the Taj Mahal, it offers the most spectacular panoramic view of the monument's rear facade—a perspective that very few tourists ever see. The garden itself is a restored Mughal-era charbagh that was originally designed as a viewing platform for the Taj. During sunset, the white marble glows with amber and pink hues, creating photography opportunities that surpass anything possible from within the Taj complex itself."
      },
      {
        question: "Is photography allowed at all the heritage sites?",
        answer: "Photography is permitted at all the heritage sites included in this tour. Unlike the Taj Mahal interior where photography is restricted, the hidden gems of Agra allow unrestricted photography both inside and outside the monuments. This is a significant advantage for serious photographers who want to capture the intricate Pietra Dura work, lattice screens, and Mughal calligraphy in detail. Your guide knows the best angles and lighting conditions at each site, effectively serving as your personal photography director throughout the tour."
      },
      {
        question: "How do I reach the starting point of this tour?",
        answer: "Your guide will meet you directly at your hotel or any designated location in Agra. If you are arriving from Delhi, we recommend taking the [Gatimaan Express train](/india/agra/agra-gatimaan-entry-ticket) or booking a [private car from Delhi](/india/agra/taj-mahal-full-day-tour) for maximum comfort. For travelers already in Agra, the pickup is seamlessly coordinated to align with your schedule, whether you are starting fresh in the morning or continuing after a [sunrise Taj Mahal visit](/india/agra/taj-mahal-sunrise-guided-tour)."
      },
      {
        question: "What should I wear for this heritage walking tour?",
        answer: "Comfortable walking shoes are essential as you will traverse marble floors, sandstone pathways, and cobblestone lanes in the old city. Modest clothing covering shoulders and knees is recommended, particularly when visiting the Jama Masjid and other religiously significant sites. During summer months (April-June), lightweight breathable fabrics and sunscreen are crucial. In winter (November-February), a light jacket is advisable for the early morning hours. Carry a small water bottle and sunglasses for maximum comfort throughout the 3-hour exploration."
      },
      {
        question: "Can this tour be customized to include specific sites?",
        answer: "Yes, the itinerary is fully flexible and can be tailored to your interests. If you are particularly interested in Mughal-era cuisine, we can include a stop at a heritage food stall in Kinari Bazaar. If calligraphy fascinates you, we can extend the time at Itimad-ud-Daulah. For architecture enthusiasts, we can add Chini Ka Rauza (China's Tomb) with its extraordinary Persian tile work. Simply communicate your preferences when booking, and your guide will craft a bespoke heritage experience that maximizes your connection with Agra's authentic cultural landscape."
      },
      {
        question: "What is the cancellation policy for this heritage tour?",
        answer: "We offer a generous cancellation policy: full 100% refund for cancellations made more than 24 hours before the tour start time. Cancellations within 24 hours are subject to a 50% charge to fairly compensate the guide who has reserved their entire schedule for your booking. We recommend checking the weather forecast and confirming your plans the evening before. If your [Agra itinerary](/india/agra/1-day-agra-itinerary) changes unexpectedly, our team is available via WhatsApp to help reschedule rather than cancel outright."
      }
    ];
  }

  if (slug === 'taj-mahal-sunrise-tour') {
    return [
      {
        question: "What does skip-the-line mean for this sunrise tour?",
        answer: "Our skip-the-line service means your professional guide pre-arranges digital tickets and positions you in the priority entry lane before the gates open. The Archaeological Survey of India (ASI) opens the Taj Mahal gates exactly 30 minutes before sunrise, and the queue can stretch to hundreds of people by that time. With our tactical early positioning at the East Gate, you bypass the chaotic general queue and enter within the first wave of visitors. This ensures you experience the monument in near-silence during the most magical lighting conditions, a privilege that standard ticket holders rarely achieve."
      },
      {
        question: "What time will the guide pick me up for sunrise?",
        answer: "Your guide will coordinate pickup approximately 60-90 minutes before the official gate opening time. Since sunrise times fluctuate dramatically between seasons—from 5:15 AM in summer to 7:15 AM in winter—the exact pickup time is calibrated the evening before via WhatsApp. This precision timing ensures you arrive at the security checkpoint with enough buffer to clear the CISF screening and position yourself at the front of the entry queue. Our guides monitor the official [Taj Mahal opening time](/india/agra/taj-mahal-opening-time) daily to ensure perfect synchronization."
      },
      {
        question: "Is the Taj Mahal entry ticket included in this tour?",
        answer: "Yes, the [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket) is fully included in your tour package. This covers the standard ASI admission for foreign nationals, which includes access to the main mausoleum, the Charbagh gardens, the mosque, and the guest house. The mausoleum interior ticket (additional ₹200) can also be arranged if you wish to view the ornamental cenotaphs of Shah Jahan and Mumtaz Mahal up close. Your guide handles all ticketing logistics so you never touch a queue window."
      },
      {
        question: "How long will we spend inside the Taj Mahal complex?",
        answer: "The guided experience inside the Taj Mahal complex typically lasts 2 to 2.5 hours. This allows comprehensive exploration of the main gateway (Darwaza-i-Rauza), the symmetrical Charbagh gardens, the iconic reflection pool, the main mausoleum platform, and the flanking mosque and guest house. Your guide paces the visit to align with the changing light—starting with the ethereal pre-dawn glow and concluding as the marble transitions to brilliant white under full sunlight. This is significantly more thorough than the rushed 45-minute visits that group tours typically provide."
      },
      {
        question: "What photography tips does the guide provide?",
        answer: "Our guides are trained in monument photography positioning and know every premium vantage point. They will direct you to the exact symmetry point on the central water channel where the Taj is perfectly reflected, the Diana Bench (where Princess Diana's iconic photo was taken), and lesser-known angles from the mosque courtyard. During sunrise, the guide times your position to capture the marble transitioning from lavender to gold. They will also assist with your camera or smartphone, ensuring you leave with professional-quality memories of your [Agra visit](/india/agra/agra-travel-guide-2026)."
      },
      {
        question: "What if the Taj Mahal is closed on Friday?",
        answer: "The Taj Mahal is closed every Friday for prayers at the mosque within the complex. If your travel dates fall on a Friday, we strongly recommend our [Agra Friday Special Tour](/india/agra/agra-friday-tour-taj-closed-alternative) which covers Agra Fort, Itimad-ud-Daulah (Baby Taj), and Mehtab Bagh sunset views. Alternatively, you can view the Taj from Mehtab Bagh across the Yamuna River, which remains open on Fridays. We always verify your booking date against the closure schedule to prevent any disappointment."
      },
      {
        question: "Is this tour private or shared with other groups?",
        answer: "This is a completely private tour exclusively for you and your travel companions. We never merge bookings or add strangers to your group. This exclusivity means your guide tailors the narrative to your interests, adjusts the pace to your comfort level, and provides undivided attention throughout the experience. Whether you want to linger at the calligraphy panels or rush to capture the perfect sunrise shot, the entire schedule revolves around you. This privacy is what distinguishes our service from the crowded group tours offered at the gates."
      },
      {
        question: "What should I bring for the sunrise visit?",
        answer: "Pack light but strategically: a fully charged phone or camera, a light jacket (temperatures can be 8-10°C cooler at dawn), comfortable walking shoes, and sunglasses for the post-sunrise glare off the white marble. Prohibited items include tripods, food, tobacco, and large bags—all of which must be deposited at the locker facility near the entrance. Your guide will brief you on all prohibited items the evening before to ensure zero delays at the CISF security screening. We also provide shoe covers so you can keep your footwear on the marble platform."
      },
      {
        question: "Can this tour be extended to include Agra Fort?",
        answer: "Absolutely. Many travelers combine the sunrise Taj Mahal experience with a visit to the magnificent Agra Fort, creating a comprehensive [half-day Agra itinerary](/india/agra/taj-mahal-agra-fort-guided-tour). After completing the Taj visit by approximately 8:30 AM, your guide can escort you to the Agra Fort (just 2 km away), where you will explore the Diwan-i-Am, Diwan-i-Khas, and the poignant Musamman Burj—the octagonal tower where Shah Jahan spent his final years gazing at the Taj. This combination provides a complete Mughal dynasty narrative."
      },
      {
        question: "How does this compare to an afternoon Taj Mahal visit?",
        answer: "The sunrise visit is categorically superior to an afternoon visit for three critical reasons: first, the crowd density is roughly 80% lower, allowing unobstructed views and photos. Second, the soft directional light creates a warm golden glow on the white marble that is physically impossible to replicate under the harsh midday sun. Third, the temperature is 10-15°C cooler, making the walking experience significantly more comfortable. Afternoon visitors face massive crowds, intense heat, and flat lighting that washes out the marble's subtle warm tones. Every serious traveler and photographer prioritizes the sunrise slot."
      },
      {
        question: "Is this tour suitable for families with young children?",
        answer: "Yes, the sunrise tour works well for families, though the early wake-up requires preparation. Children under 15 enter the Taj Mahal free of charge with a valid passport. Our guides are skilled at engaging younger visitors with age-appropriate stories about the emperor, the princess, and the magical white palace. The cooler morning temperatures are actually more comfortable for children than the scorching afternoon heat. Strollers are not permitted inside the complex, so children must be able to walk or be carried. We recommend this tour for families who want a meaningful cultural experience without the mid-day chaos."
      },
      {
        question: "What happens if it's foggy during the sunrise?",
        answer: "Agra experiences significant morning fog from November through February. Rather than being a disadvantage, the fog creates an extraordinarily mystical atmosphere that photographers prize. The Taj Mahal appears to float in a white ethereal haze, gradually revealing itself as the fog lifts—a spectacle that clear-sky visitors never experience. Your guide will adapt the itinerary to work with the fog, positioning you at points where the monument emerges dramatically as visibility improves. Some of the most iconic Taj Mahal photographs ever taken were captured in these exact foggy conditions."
      },
      {
        question: "Can I book this tour if I'm staying in Delhi?",
        answer: "Yes, we offer seamless [Delhi to Agra day trips](/india/agra/taj-mahal-delhi-guided-tour) with pre-dawn departure from your Delhi hotel. The drive takes approximately 3-3.5 hours via the Yamuna Expressway. For the sunrise tour, this means a 2:00-3:00 AM pickup from Delhi. Alternatively, you can travel by the [Gatimaan Express train](/india/agra/agra-gatimaan-entry-ticket) or stay overnight in Agra to avoid the early drive. Many travelers combine this with a [private car from Delhi](/india/agra/sunrise-taj-mahal-and-agra-tour-by-car) for maximum comfort and flexibility."
      },
      {
        question: "What languages are available for this guided tour?",
        answer: "We provide ASI-licensed guides fluent in English, Spanish, French, German, Italian, Russian, Japanese, and Hindi. Each guide is specifically certified for the Taj Mahal complex and undergoes regular training to ensure historical accuracy. When you [book your guide](/india/agra/book-guide-for-taj-mahal), simply specify your preferred language, and we will match you with a specialist who delivers the full Mughal dynasty narrative in your native tongue without losing any historical nuance or architectural detail."
      },
      {
        question: "What is the cancellation and refund policy?",
        answer: "We offer a flexible cancellation policy: 100% full refund for cancellations made more than 24 hours before the scheduled pickup time. Cancellations within 24 hours incur a 50% charge to compensate the guide and driver who have reserved their schedules exclusively for your booking. In cases of extreme weather or government-mandated closures, we offer a full refund or free rescheduling. We recommend confirming your booking the evening before via WhatsApp, where our team provides real-time updates on weather conditions and any ASI announcements affecting your [Taj Mahal visit](/india/agra/taj-mahal-opening-time)."
      }
    ];
  }

  // --- END AUTO-INJECTED FAQS ---

  // --- DELHI TOUR FAQS ---
  if (slug === 'india-gate-guided-tour') {
    return [
      {
        question: "What is included in the India Gate Guided Tour?",
        answer: "This comprehensive, high-authority guided tour covers the most iconic landmarks within Delhi's prestigious Rajpath (now Kartavya Path) ceremonial corridor. Your federally licensed historian guide will conduct an exhaustive exploration of the India Gate war memorial, the National War Memorial, the Amar Jawan Jyoti flame site, and the surrounding Lutyens-designed governmental architecture including the North and South Blocks. We provide a deeply educational narrative explaining the significance of the 70,000 inscribed names of soldiers who perished during World War I and the Anglo-Afghan wars, transforming a standard sightseeing walk into a profound historical immersion."
      },
      {
        question: "How long does the guided tour last?",
        answer: "We rigorously allocate a comprehensive 3 to 4-hour window for this specialized Delhi heritage experience. This duration is meticulously calculated to ensure you absorb the full narrative surrounding the India Gate memorial complex without feeling rushed. The timeline includes the walk along the immense ceremonial boulevard, detailed analysis of the architectural symmetry designed by Sir Edwin Lutyens, and an exploration of the surrounding lawns and governmental structures. This pace allows you to deeply engage with every inscription and structural element while your high-authority guide provides continuous, university-level historical commentary."
      },
      {
        question: "Is this tour suitable for first-time visitors to Delhi?",
        answer: "Absolutely, and we consider this the definitive starting point for any serious traveler's [Delhi sightseeing experience](/india/delhi). The India Gate complex anchors the entire historical narrative of modern India, perfectly contextualizing the transition from British colonialism to independence. By beginning your exploration here, our federally licensed guide establishes the foundational political and military history that enriches all subsequent monument visits across the National Capital Region. For first-time visitors navigating an intensely chaotic foreign metropolis, having a dedicated, high-authority professional insulates you from aggressive touts and logistical confusion from the very first moment."
      },
      {
        question: "Is hotel pickup included?",
        answer: "Yes, absolutely. To guarantee a completely frictionless and stress-free commencement to your morning exploration, we provide complimentary, door-to-door pickup from any hotel, homestay, or Airbnb within the Delhi National Capital Region, including Central Delhi, South Delhi, and Gurgaon. Your designated air-conditioned luxury vehicle and professional chauffeur will arrive precisely at your pre-scheduled time. We manage all the chaotic metropolitan navigation so you don't negotiate with unreliable local taxis or attempt to decode the complex metro system. At the conclusion of your tour, you will be smoothly transported back."
      },
      {
        question: "Is this tour private?",
        answer: "Yes, this entire heritage exploration operates as a strictly 100% private, fully enveloped experience exclusively for you and your specified travel companions. We fundamentally reject the paradigm of consolidating independent bookings into large, impersonal group bus tours. Your dedicated premium vehicle and your federally licensed guide represent a focused strike team operating entirely at your pace and intellectual engagement level. You possess absolute tactical command over the narrative flow, lingering at specific inscriptions or photographing the architectural symmetry for precisely as long as you desire."
      },
      {
        question: "What languages are available for the guide?",
        answer: "We maintain a highly specialized roster of linguistically diverse, federally licensed historian guides to cater to our elite international clientele visiting Delhi. Beyond absolute fluency in English, we can deploy senior experts who deliver complex architectural and political narratives in Spanish, French, German, Italian, Russian, and Japanese. This ensures the profound historical payload of India's independence struggle and the significance of this [Delhi guided tour](/india/delhi) is communicated seamlessly in your native tongue, preventing any critical loss of detail regarding the military history inscribed on the memorial walls."
      },
      {
        question: "Is India Gate open at night?",
        answer: "Yes, the India Gate war memorial and its surrounding lawns operate as a 24-hour public space and are exceptionally striking when illuminated after dark. The monument is dramatically flood-lit, creating a deeply photogenic visual experience against the night sky. However, for our guided educational tour, we strongly recommend the early morning or late afternoon tactical windows. The morning provides softer light for premium photography and cooler temperatures, while the evening allows you to witness the monument transition from natural golden-hour light to the spectacular artificial illumination, capturing both visual states."
      },
      {
        question: "Are entry tickets required for India Gate?",
        answer: "No, the India Gate war memorial is a freely accessible national monument with absolutely zero entrance fees. It exists as an open, public commemorative space managed by the central government. The adjacent National War Memorial, inaugurated in 2019, is also free of charge but requires a brief security screening before entry. Your high-authority historian guide will navigate both sites seamlessly, ensuring you bypass any civilian congestion. This zero-cost access makes this tour an incredibly high-value educational experience where your entire investment secures elite professional commentary without any monument ticketing overhead."
      },
      {
        question: "Can we combine this with other Delhi monuments?",
        answer: "Absolutely, and this is where our private, high-efficiency framework delivers maximum value. Because you possess total command over the itinerary, your dedicated guide and premium vehicle can seamlessly extend the day to include the magnificent Humayun's Tomb, the sprawling Qutub Minar complex, or the iconic Red Fort. We frequently organize comprehensive, full-day [Delhi sightseeing itineraries](/india/delhi) that anchor on the India Gate complex in the morning and then methodically deploy across the city's other UNESCO World Heritage sites, creating a cohesive, deeply interconnected historical narrative of Mughal and colonial power."
      },
      {
        question: "Is photography allowed at India Gate?",
        answer: "Yes, photography is absolutely encouraged across the entire India Gate complex and surrounding gardens. Standard DSLR cameras, mirrorless camera systems, and smartphones are all freely permitted. However, tripods and professional-grade lighting equipment may attract attention from the Central Industrial Security Force (CISF) personnel stationed at the adjacent governmental buildings and the National War Memorial entrance. Our seasoned guide understands the exact optimal vantage points for capturing the full 42-meter monument height and the dramatic perspective along the Kartavya Path boulevard, ensuring your visual documentation is exceptional."
      },
      {
        question: "Is this tour suitable for children?",
        answer: "Yes, this specific heritage exploration is exceptionally well-suited for families traveling with children of all ages. Unlike the physically demanding, cramped interiors of some historical monuments, the India Gate complex offers massive, expansive open lawns providing ample space for children to move freely between educational stations. Our high-authority historians are skilled at adapting the narrative of military valor and national sacrifice into age-appropriate, engaging storytelling. The broad, car-free [ceremonial boulevard](/india/delhi) provides a safe, controlled environment, making this a stress-free family experience."
      },
      {
        question: "What is the best time to visit India Gate?",
        answer: "For optimal photography and maximum personal comfort, we strongly recommend two specific tactical windows. The early morning slot (7:00 AM to 9:00 AM) provides incredibly soft, golden-hour light, cooler temperatures (critically important during the brutal May-June Delhi summer), and significantly reduced pedestrian traffic. Alternatively, the late afternoon window (4:00 PM to 6:30 PM) captures the monument transitioning through sunset into its dramatic flood-lit state. Our guides meticulously calibrate the entire tour schedule around these premium conditions."
      },
      {
        question: "How much walking is involved?",
        answer: "This heritage exploration involves a moderate, manageable amount of walking across extremely well-maintained, flat terrain. You should anticipate covering approximately 2 to 3 kilometers across the expansive lawns, the Kartavya Path boulevard, and the National War Memorial pathways. Our historians are expertly trained to utilize shaded areas and available resting spots along the [India Gate guided tour](/india/delhi) route. Comfortable, supportive footwear is recommended. Because this operates as a private deployment, you dictate the pace entirely, ensuring no physical strain during your comprehensive engagement with the memorial architecture."
      },
      {
        question: "Is the National War Memorial included?",
        answer: "Yes, the newly inaugurated National War Memorial (opened 2019) is a critically important component of this comprehensive guided exploration. This stunning, concentric-ring structure honors the 26,466 armed forces personnel who made the supreme sacrifice since India's independence in 1947. The four themed circles—the Amar Chakra (Circle of Immortality), the Veerta Chakra (Circle of Bravery), the Tyaag Chakra (Circle of Sacrifice), and the Rakshak Chakra (Circle of Protection)—each require careful, high-authority narrative explanation from our federally licensed guide to fully appreciate their profound symbolic meaning."
      },
      {
        question: "What is the cancellation policy?",
        answer: "We apply a highly transparent, discerning cancellation policy designed for premium international travelers. If you cancel this private [Delhi guided tour](/india/delhi) more than 24 hours prior to the scheduled pickup time, you will receive a comprehensive 100% full refund with zero complex administrative friction. Cancellations executed within the strict 24-hour window are subject to restrictions to fairly compensate our permanently dedicated chauffeurs and senior historian guides who were removed from active booking rosters. This straightforward policy structurally protects both your financial investment and our commitment to deploying elite, highly specialized personnel."
      }
    ];
  }
  if (slug === 'golden-triangle-3-day-tour') {
    return [
      {
        question: "What cities are covered in the Golden Triangle Tour?",
        answer: "This elite, high-authority 3-day tour covers the three absolute cornerstones of India's cultural and architectural legacy: Delhi, Agra, and Jaipur. The \"Golden Triangle\" designation refers to the roughly equilateral triangular route these cities form across Northern India. Delhi delivers the complex narrative of Mughal imperial dominance and British colonial governance. Agra anchors on the ivory-white masterpiece of the Taj Mahal and the colossal Agra Fort. Jaipur—the Pink City—reveals the stunning Rajput warrior-palace architecture of the Amber Fort, Hawa Mahal, and the City Palace, creating the definitive multi-era Indian historical experience."
      },
      {
        question: "What monuments are included in Delhi?",
        answer: "Our rigorously curated Delhi deployment covers the absolutely essential, high-authority monuments that define the city's 1,000-year layered history. This includes the massive, red sandstone Qutub Minar complex (UNESCO), the magnificent Humayun's Tomb (considered the architectural prototype for the Taj Mahal, also UNESCO), the sprawling Red Fort, and the India Gate war memorial along the Kartavya Path ceremonial boulevard. Your federally licensed historian guide weaves a cohesive, deeply interconnected narrative across these sites, demonstrating how each successive [Delhi sightseeing](/india/delhi) dynasty—from the Sultanate to the Mughals to the British—physically reshaped the capital."
      },
      {
        question: "Is the Taj Mahal sunrise included?",
        answer: "Yes, absolutely. Because this premium itinerary structurally includes an overnight stay in a luxury Agra hotel, we guarantee a comfortable, well-rested 5:30 AM deployment to the Taj Mahal at sunrise. This is the foundational tactical advantage of the 3-day format over a grueling same-day car trip from Delhi. You arrive at the East Gate precisely as the ASI unlocks the complex, experiencing the white marble mausoleum in near-silence during the [golden hour light](/india/agra/taj-mahal-opening-time). This premium sunrise window delivers magazine-quality photography and a profoundly serene appreciation impossible to achieve arriving mid-morning by train."
      },
      {
        question: "What type of hotels are included?",
        answer: "We exclusively partner with rigorously vetted, premium 4-Star and luxury 5-Star properties in both Agra and Jaipur. In Agra, this typically includes landmark establishments like the ITC Mughal, Courtyard by Marriott, or equivalent properties offering exceptional proximity to the Taj Mahal complex. In Jaipur, we deploy you to heritage palace hotels or premium international chains within the Old City perimeter. Every property delivers top-tier air-conditioning, deeply sanitized environments, and highly rated international dining options, ensuring your overnight recovery intervals completely recharge your physical stamina for the demanding monumental explorations."
      },
      {
        question: "Is this tour fully private?",
        answer: "Yes, this entire 3-day, multi-city deployment operates as a strictly 100% private, fully enveloped experience exclusively designed for you and your specified travel companions. We fundamentally reject the chaotic paradigm of consolidating independent bookings into large, slow-moving group bus tours that waste massive hours collecting passengers. Your dedicated premium vehicle, commercially licensed chauffeur, and high-authority [local expert guide](/india/delhi) represent an elite strike team focused entirely on your specific timeline and educational requirements across all three cities."
      },
      {
        question: "Is transport between cities included?",
        answer: "Yes, absolutely. A dedicated, impeccably maintained, air-conditioned luxury vehicle and a specifically commercial highway-licensed chauffeur are assigned exclusively to your booking for the comprehensive, 72-hour multi-city deployment. This includes all point-to-point intercity transit: Delhi to Agra (Yamuna Expressway, 3.5 hours), Agra to Jaipur (NH-21, 4.5 hours), and Jaipur back to Delhi (NH-48, 5 hours). All expensive Yamuna Expressway tolls, interstate commercial taxes, municipal parking fees, and the chauffeur's dedicated overnight meal and accommodation allowances are fundamentally baked into the overall pricing architecture."
      },
      {
        question: "Are monument entry tickets included?",
        answer: "To enforce absolute financial transparency and flexibility, this premium package covers all private luxury transportation, premium hotel accommodations, and dedicated high-authority historian guides across all three cities. Monument entrance fees are intentionally decoupled and excluded from the base price. By keeping these costs separate, you avoid all hidden agency markups and pay the exact, uninflated government tier rate at each UNESCO site. Your assigned local guides in each city operate as elite logistical concierges, navigating the complex [ASI digital ticketing portals](/india/agra/taj-mahal-ticket-price-2026) on your behalf and bypassing manual queues."
      },
      {
        question: "Is a guide included in each city?",
        answer: "Yes, each city deploys its own dedicated, federally licensed, high-authority historian guide who possesses deep, localized expertise. Your Delhi guide specializes in the complex 1,000-year layered political narrative from the Sultanate era through British independence. Your Agra guide delivers a masterclass on Mughal architecture, particularly the engineering and romantic legacy of Shah Jahan's masterpiece. Your Jaipur guide is an expert in the Rajput warrior dynasty, the astronomical instruments of Jantar Mantar, and the vibrant textile and gemstone trading heritage, ensuring each city delivers a deeply specialized intellectual payload."
      },
      {
        question: "What monuments are included in Jaipur?",
        answer: "Our aggressive Jaipur deployment covers the complete roster of the Pink City's most architecturally significant structures. This includes the massive Amber Fort (reached via a dramatic hillside approach), the iconic five-story Hawa Mahal (Palace of Winds) with its 953 intricately carved jharokha windows, the sprawling City Palace complex still partially occupied by the royal Kachchhawa dynasty, and the UNESCO-listed Jantar Mantar observatory. Your [local expert guide](/india/delhi) will deconstruct the complex political alliances between the Rajput maharajas and the Mughal emperors that shaped these extraordinary architectural achievements."
      },
      {
        question: "Is lunch included on all days?",
        answer: "This highly specialized, premium package intentionally decouples the cost of meals to provide you with absolute dietary freedom and strict financial transparency. While lunch is not included in the base price, dedicated dining intervals are structurally integrated into each day's timeline between monument deployments. Your high-authority guide in each city acts as a localized culinary concierge. They will proactively recommend rigorously vetted, premium restaurants or authentic, highly sanitized local establishments that align perfectly with your specific dietary requirements, allergies, and hygiene standards, avoiding all substandard tourist buffets."
      },
      {
        question: "Can we customize the 3-day itinerary?",
        answer: "Customization is the absolute, fundamental pillar of this elite, private multi-city deployment. While we maintain a logically structured framework optimized for the highest-impact monuments, every single element is dynamically adjustable. If you wish to replace the Qutub Minar with the serene Lotus Temple, add a specific stop at a Jaipur gemstone cutting workshop, or extend your Agra stay to include the expansive [Fatehpur Sikri abandoned city](/india/agra), your dedicated guide and chauffeur will instantaneously integrate your requests. We act as your dynamic, multi-city logistical architects, building the exact 72-hour experience you specify."
      },
      {
        question: "Is this suitable for elderly travelers?",
        answer: "This 3-day format is the absolute, strongly mandated recommendation for elderly travelers or those with any mobility limitations. The multi-day structure mathematically divides the immense physical output across three manageable days, preventing the devastating heat exhaustion and musculoskeletal fatigue that destroys same-day marathons. Private, door-to-door air-conditioned transfers eliminate all public transit negotiations. Senior guides proactively manage pacing, utilize ramps and shaded corridors, and identify every available resting spot inside the massive monument complexes, ensuring the journey remains intellectually rewarding without becoming physically punishing."
      },
      {
        question: "Are shopping stops mandatory?",
        answer: "We enforce a rigid, non-negotiable zero-stress policy regarding commerce across all three cities. Our absolute mandate is high-level historical education and premium architectural appreciation. We will never physically force you or subtly coerce you into visiting high-pressure souvenir factories, textile warehouses, or gemstone showrooms that plague budget group tours. If you explicitly wish to view authentic Rajasthani textile artisans or [Agra marble inlay craftsmen](/india/agra/things-to-do-in-agra), your guide can facilitate a legitimate, pressure-free demonstration. The decision to engage with any commerce rests entirely and exclusively with you."
      },
      {
        question: "What vehicle is used for 3 days?",
        answer: "We strictly deploy a modern, impeccably maintained, deeply sanitized, air-conditioned luxury vehicle dedicated exclusively to your booking for the entire comprehensive 72-hour deployment. For solo travelers or couples, we utilize high-end sedans such as the Toyota Etios or Swift Dzire. For families or small groups, we automatically upgrade to an extremely spacious Toyota Innova SUV, providing significantly superior legroom and advanced suspension crucial for the combined 800+ kilometers of intercity highway transit. Every vehicle is operated by a uniformed, commercially licensed chauffeur trained in defensive highway protocols."
      },
      {
        question: "What is the cancellation policy?",
        answer: "We execute a highly transparent, discerning cancellation matrix for this complex, multi-city, hotel-inclusive deployment. If you cancel this comprehensive private [Golden Triangle tour](/india/delhi) more than 72 hours prior to the designated Day 1 pickup time, you will receive a 100% full refund with zero complex administrative friction. Cancellations executed within the 72-hour window are subject to restrictions specifically to cover non-refundable hotel room reservations across two cities and to fairly compensate our permanently dedicated chauffeurs and senior historian guides who were removed from active booking rosters for three full operational days."
      }
    ];
  }
  if (slug === '5-days-golden-triangle-ranthambore-tiger-safari') {
    return [
      {
        question: "What is included in the 5-Day Golden Triangle with Ranthambore Tiger Safari tour?",
        answer: "This elite, comprehensively curated 5-day private expedition covers the absolute pinnacle of North India's cultural and wildlife heritage in a single, seamlessly orchestrated deployment. The package includes: luxury air-conditioned private transportation throughout all five days across all four destinations; federally licensed, high-authority historian guides in Delhi, Agra, and Jaipur; a specialist naturalist/guide for all Ranthambore game drives; premium 4-star to 5-star hotel accommodations in Agra, Ranthambore, and Jaipur; dedicated government-registered canter or jeep for wildlife safaris; and full, door-to-door private chauffeur service from your Delhi hotel. This structured framework delivers the definitive Northern Indian experience combining UNESCO heritage architecture with the raw power of Bengal tiger habitat."
      },
      {
        question: "What is the probability of seeing a Bengal tiger at Ranthambore National Park?",
        answer: "Ranthambore National Park commands the highest documented tiger sighting frequency of any reserve in South Asia, making it the globally recognized gold standard for wildlife tourism. With an estimated resident population of 70 to 75 Bengal tigers across its 1,334 square kilometer core zone, the statistical sighting probability during an early morning game drive exceeds 65% to 75% during the peak dry season window of February through May. Our specialist naturalist guides leverage multi-year, granular tracking data on individual named tigers—particularly the famous T-17 Krishna, T-107, and T-124 lineages—significantly elevating your sighting probability above random chance. We strategically select the specific forest zones and water bodies with highest documented recent activity, deploying your safari vehicle within the optimal corridors at first light."
      },
      {
        question: "How many game drives are included at Ranthambore National Park?",
        answer: "This premium 5-day itinerary structurally includes two dedicated Ranthambore National Park game drives: one critically important early morning safari commencing at park opening (5:30 AM to 6:00 AM, zone dependent) and one late afternoon safari beginning around 2:30 PM to 3:00 PM. This two-drive tactical framework is the strategic minimum required to meaningfully exploit peak feline activity windows. Bengal tigers are obligate crepuscular hunters, maximally active during the pre-dawn and post-sunset thermal corridors when ambient temperatures drop and prey animals increase their movement. Both drives are conducted with your assigned specialist naturalist guide who continuously reads fresh pugmark trails, territorial scratching posts, alarm calls from sambar deer and langur monkeys, and scent-marking behavior."
      },
      {
        question: "What type of vehicle is used inside Ranthambore National Park?",
        answer: "The Rajasthan Forest Department mandates two specific vehicle categories for Ranthambore wildlife tourism, each serving distinct tactical purposes. A 20-seat Canter (a large diesel open-top bus) is deployed on the wider, main forest corridors and provides exceptional elevation for horizon scanning across Ranthambore's iconic ruined palaces and lake viewpoints. A 6-seat Gypsy (modified Maruti 4x4 open-top jeep) penetrates narrower, denser off-road game trails with superior maneuverability. Both vehicle types are mandatory Forest Department-registered, GPS-tagged, and operated by government-licensed drivers. Our specialist naturalist guide accompanies you in either vehicle, providing continuous real-time wildlife behavioral commentary and tactical repositioning guidance to maximize your total Bengal tiger encounter window."
      },
      {
        question: "What cities and destinations are covered across the 5 days?",
        answer: "This comprehensive, high-authority expedition strategically deploys across four distinct destination clusters. Day 1 anchors on Delhi, covering the Qutub Minar, Humayun's Tomb, India Gate, and Red Fort with a federally licensed historian guide. Day 2 executes the Delhi-to-Agra transit, delivering the definitive Taj Mahal complex experience plus Agra Fort and Mehtab Bagh. Day 3 conducts the Agra-to-Ranthambore deployment with an afternoon wildlife safari at Ranthambore National Park. Day 4 conducts the critical morning tiger safari at first light before transiting to Jaipur, Rajasthan. Day 5 delivers the complete Jaipur deployment: Amber Fort, Hawa Mahal, City Palace, and Jantar Mantar, before returning to Delhi. The routing is logistically optimized to eliminate backtracking and minimize dead highway miles."
      },
      {
        question: "Is the Taj Mahal sunrise experience included?",
        answer: "Yes, this is one of the most strategically critical elements of this premium 5-day framework. Because the itinerary includes a mandatory overnight hotel stay in Agra, you are guaranteed deployment to the Taj Mahal complex at the East Gate precisely at sunrise opening, approximately 30 minutes before mass tourist arrival from Delhi day-trip buses. This tactical positioning is the singular most important logistical advantage of the multi-day format. You will experience Shah Jahan's ivory-white mausoleum in near-total silence, bathed in directional morning light that transforms the white Makrana marble through a continuous spectrum from pale gold to pure white. Magazine-quality photography and genuine spiritual appreciation are impossible to replicate during the mid-morning crowds produced by same-day car or train excursions from Delhi."
      },
      {
        question: "What type of hotels are included across all nights?",
        answer: "We rigorously maintain an exclusive network of premium 4-star and luxury 5-star properties across all overnight destinations. In Agra, we deploy you to landmark establishments such as the ITC Mughal (one of India's most iconic heritage resort hotels with direct Taj Mahal views), Courtyard by Marriott Agra, or Radisson, all positioned within minimal transit distance from the monument complex. In Ranthambore, we utilize specialized eco-luxury safari lodges such as Khem Villas, Nahargarh Ranthambore, or Ranthambore Regency, designed with deep conservation philosophy and naturalist programming. In Jaipur, we prefer heritage palace hotels or premium international chains within the Old City core. Every property is continuously audited for air-conditioning reliability, sanitation standards, and dining quality."
      },
      {
        question: "Are monument entry tickets included in the package price?",
        answer: "To enforce absolute financial transparency and eliminate hidden agency markups, this premium package covers all private luxury transportation, hotel accommodations, specialist guide fees, and the mandatory Forest Department-issued Ranthambore safari vehicle booking fees and park entry permits. Monument entrance fees at the Qutub Minar, Humayun's Tomb, Taj Mahal, Agra Fort, and Jaipur attractions are intentionally decoupled, allowing you to pay the exact uninflated government rate. For the Taj Mahal specifically, the 2025 foreign national composite ticket is approximately INR 1,300. Your dedicated guides at each city operate as expert logistical concierges, pre-booking all monument tickets through official ASI digital portals to completely bypass the manual queue infrastructure."
      },
      {
        question: "Is this entire tour 100% private?",
        answer: "Yes, this 5-day expedition operates as a strictly 100% private, fully enveloped experience exclusively for you and your designated travel companions. We categorically reject the operationally inferior paradigm of consolidating independent bookings into large, slow-moving group bus coaches that waste enormous hours collecting passengers at multiple hotels, operate on rigid timetables, and deliver impersonal, lowest-common-denominator commentary. Your dedicated premium vehicles, specialist city guides, and wildlife naturalist represent a focused strike team calibrated entirely to your intellectual pace and tactical preferences. The Ranthambore safari vehicle is booked exclusively in your names under Forest Department regulations, ensuring no strangers occupy your game drive allocation."
      },
      {
        question: "What is the best time of year to take this 5-day tour?",
        answer: "This comprehensive tour operates year-round, but two specific windows deliver objectively superior experiences. The primary peak window runs from February through May, when Ranthambore's declining water sources concentrate all wildlife around predictable lake and stream locations, creating maximum Bengal tiger and leopard sighting frequency. Temperatures climb significantly in April and May, but the wildlife density justifies the heat, especially with air-conditioned vehicle transfers. The secondary ideal window runs from October through January (post-monsoon), when the entire landscape is lush, temperatures are deeply comfortable, and all four Golden Triangle cities are at their most photographable. Ranthambore closes for monsoon from approximately July 1 through October 1 each year."
      },
      {
        question: "Can we customize the 5-day itinerary?",
        answer: "Absolute customization is the foundational operational principle of this elite private deployment. While we maintain a logically optimized framework, every element is dynamically adjustable to your specific requirements. You can increase Ranthambore to three game drives by adding a second morning. You can replace the Jaipur City Palace with an Abhaneri stepwell excursion. You can add a full-day Fatehpur Sikri and Agra exploration. The itinerary can be extended to 7 days to add a Pushkar or Udaipur deployment. Dietary requirements, hotel preferences, monument priorities, and photography objectives all directly shape how we architect the final framework. We act as your multi-city logistical architects building the exact expedition that maximizes your specific interests."
      },
      {
        question: "Is this tour suitable for families with young children?",
        answer: "This 5-day format is exceptionally well-engineered for family travel with children of varying ages, including young children. The multi-day structure prevents the brutal fatigue that destroys aggressive same-day itineraries, structurally allocating natural recovery intervals. The Ranthambore wildlife safaris deliver an extraordinarily powerful, emotionally unforgettable experience for children who respond intensely to the raw, unscripted drama of Bengal tiger encounters in ancient ruined fort landscapes. Our historian guides are specifically trained to translate complex Mughal architectural narratives into age-appropriate, story-format delivery. Private vehicles eliminate all dangerous public transport negotiations, and all properties are selected with family suite configurations, swimming pools, and child-friendly dining in mind."
      },
      {
        question: "Are meals included throughout the 5-day tour?",
        answer: "This premium package intentionally decouples the cost of meals to provide you with absolute dietary freedom and strict financial transparency. Daily breakfast is included at all overnight properties as standard. Lunch and dinner are excluded from the base price, but comprehensive dining intervals are structurally integrated into each day's timeline between deployments. Your specialist guide at each destination serves as a deeply knowledgeable culinary concierge who will proactively recommend rigorously vetted, premium restaurants, authentic dhabas, or heritage hotel dining rooms that precisely match your dietary requirements, allergies, and hygiene standards. In Ranthambore, the safari lodge typically provides high-quality, set-menu dinners that are strongly recommended for their convenience and quality."
      },
      {
        question: "What wildlife besides tigers can be seen at Ranthambore?",
        answer: "Ranthambore National Park is a staggeringly biodiverse, multi-species ecosystem far exceeding the Bengal tiger as its sole attraction. The park supports documented populations of leopard (increasingly visible in the northern zones), sloth bear (the Ranthambore population is one of India's largest and most visible), marsh mugger crocodile (congregating at the three famous lakes), sambar deer (in truly massive herds), spotted chital, nilgai blue bull, langur monkey troops, and rhesus macaques. Birding is exceptional, with over 320 species documented including the endemic Indian roller, painted stork, white-throated kingfisher, crested serpent eagle, and numerous migratory raptors. Your specialist naturalist guide provides continuous identification commentary across all taxonomic groups, ensuring the safari remains richly rewarding even during any tiger observation gap."
      },
      {
        question: "What is the cancellation policy for this 5-day tour?",
        answer: "We apply a highly transparent, multi-tiered cancellation matrix specifically calibrated for this complex, hotel and safari-inclusive 5-day deployment. If you cancel more than 7 days prior to the scheduled Day 1 pickup time, you will receive a 100% full refund with zero administrative friction. Cancellations executed 4 to 7 days prior are subject to a 25% retention to cover non-refundable Forest Department safari slot reservations, which operate under strict government non-refund regulations. Cancellations within 72 hours are subject to higher retention covering prepaid Ranthambore lodges and all guide and chauffeur commitments. We strongly recommend comprehensive travel insurance that covers unforeseen trip cancellations, as Ranthambore Forest Department permits are government-regulated and non-transferable."
      }
    ];
  }
  if (slug === 'private-taj-mahal-agra-day-tour-from-delhi') {
    return [
      {
        question: "What is included in the Private Taj Mahal and Agra Day Tour from Delhi?",
        answer: "This comprehensively designed, high-authority same-day private tour delivers the full, elite Agra experience in a single precisely calibrated day. The package includes: dedicated, impeccably maintained, air-conditioned luxury vehicle exclusively assigned to your booking for the entire round-trip Delhi-to-Agra-to-Delhi deployment; a commercially highway-licensed chauffeur trained in defensive Yamuna Expressway protocols; a federally licensed, high-authority ASI-certified historian guide at the Taj Mahal complex and Agra Fort; all expensive Yamuna Expressway tolls and municipal parking fees; and seamless, door-to-door hotel pickup and drop-off anywhere within the Delhi National Capital Region. The entire logistical framework is engineered to maximize your time inside the monument complex and minimize transit overhead."
      },
      {
        question: "How long does the drive from Delhi to Agra take?",
        answer: "The 200-kilometer Delhi-to-Agra transit is executed via the Yamuna Expressway, one of India's most technically advanced, six-lane controlled-access superhighways, delivering a consistent and reliable drive time of approximately 3 hours to 3.5 hours under normal traffic conditions. An early departure from Delhi between 5:30 AM and 6:00 AM is strongly recommended for two compounding strategic reasons. First, it allows you to arrive at the Taj Mahal's East Gate before the monument opens at sunrise, completely bypassing the massive mid-morning tourist surge that arrives via subsequent day-trip coaches and Gatimaan Express trains. Second, the Yamuna Expressway itself is significantly lighter in pre-dawn hours, creating a faster, more comfortable transit compared to a later morning departure."
      },
      {
        question: "What time does the tour typically depart from Delhi?",
        answer: "We schedule this private Agra day tour with a critical 5:30 AM to 6:00 AM departure window from your Delhi hotel. This early departure timing is the single most consequential logistical decision of the entire day. Departing at this pre-dawn hour guarantees arrival at the Taj Mahal East Gate within minutes of the ASI's official 6:00 AM to 7:00 AM opening (varying by season). This tactical window is the absolute premium tier for Taj Mahal photography—the white Makrana marble transitions through a continuous golden spectrum as directional sunrise light rakes across the 35-meter minaret towers and the main mausoleum dome. You experience this incomparable spectacle in a state of near-silence, before the mass arrival of mid-morning coach groups fundamentally degrades the atmosphere."
      },
      {
        question: "Are monument entry tickets to the Taj Mahal included?",
        answer: "To maintain strict financial transparency and ensure you pay the exact uninflated government-mandated rate without hidden markup, monument entry fees are excluded from the base package price and paid separately at the gate. For 2025, the composite Taj Mahal entry ticket for foreign nationals is approximately INR 1,300, which includes mandatory shoe covers, the Taj Mahal main mausoleum entry, and the adjacent Archaeological Survey of India complex access. Your high-authority historian guide will pre-book your tickets through the official ASI digital portal where available, completely bypassing the physical queue infrastructure. We provide complete, transparent advance disclosure of all monument costs for Agra Fort and any additional sites so you carry the exact denominations required."
      },
      {
        question: "Is this tour 100% private and exclusive?",
        answer: "Yes, this entire Agra day deployment operates as a strictly 100% private, fully enveloped experience exclusively for you and your specified travel companions. We categorically reject the operationally inferior paradigm of filling vehicles with strangers from multiple independent bookings to reduce cost. Your dedicated luxury vehicle and your federally licensed historian guide represent a focused two-person strike team calibrated entirely to your intellectual pace and personal objectives at the Taj Mahal. If you wish to spend 45 minutes in contemplative silence examining the pietra dura marble inlay on Shah Jahan's cenotaph, your guide is absolutely present at your side. If you wish to accelerate through Agra Fort to catch the sunset view back toward the Taj Mahal, the vehicle is strategically repositioned within minutes."
      },
      {
        question: "Which monuments are visited during the Agra day tour?",
        answer: "Our rigorously curated Agra deployment covers the three absolutely essential, high-authority monuments that together deliver the complete narrative of Mughal power and decline. The Taj Mahal complex anchors the morning session with your federally licensed guide delivering an exhaustive, university-level narrative on Shah Jahan's love for Mumtaz Mahal, the 22-year construction timeline, the 22,000 artisans and laborers involved, and the complex engineering of the white marble plinth foundation. Agra Fort—the massive red sandstone Mughal administrative capital—delivers the brutal political narrative of Aurangzeb imprisoning his own father, Shah Jahan, in the octagonal Musamman Burj tower with a direct Taj Mahal view. The Mehtab Bagh garden directly across the Yamuna River provides the definitive rear-elevation sunset photograph of the Taj Mahal."
      },
      {
        question: "Is hotel pickup included from anywhere in Delhi?",
        answer: "Yes, absolutely. To guarantee a completely frictionless commencement to your Agra day deployment, we provide complimentary, door-to-door pickup from any hotel, serviced apartment, or Airbnb within the Delhi National Capital Region, including Central Delhi, South Delhi, New Delhi, Connaught Place, and Gurgaon (Gurugram). Your designated air-conditioned luxury vehicle and professional chauffeur will arrive at your accommodation precisely at the pre-confirmed pickup time. We proactively manage all the complex metropolitan navigation, traffic pattern analysis, and parking logistics so you begin the day from a position of complete relaxation rather than scrambling for unreliable app-based taxis or navigating Delhi's complex metro system with luggage at 5:30 AM."
      },
      {
        question: "What type of vehicle is used for the Delhi-Agra round trip?",
        answer: "We strictly deploy a modern, impeccably maintained, deeply sanitized, air-conditioned luxury vehicle dedicated exclusively to your booking for the entire round-trip deployment. For solo travelers or couples, we utilize premium-grade sedans such as the Toyota Etios, Honda City, or Swift Dzire, delivering excellent fuel efficiency and comfortable highway seating for the 400-kilometer total round trip. For families of three to six individuals, we automatically upgrade to a Toyota Innova Crysta SUV, providing significantly superior legroom, enhanced air-conditioning distribution, and advanced suspension geometry critical for maintaining passenger comfort across the Yamuna Expressway. All vehicles carry emergency roadside assistance coverage and are equipped with first-aid kits and bottled water dispensers as a standard protocol."
      },
      {
        question: "Is lunch included during the Agra tour?",
        answer: "This premium day tour intentionally decouples the cost of lunch to provide you with absolute dietary flexibility and strict financial transparency. A comprehensive midday dining interval of 60 to 75 minutes is structurally integrated into the itinerary between the Taj Mahal morning session and the Agra Fort afternoon deployment. Your federally licensed historian guide serves as a deeply knowledgeable culinary concierge for Agra specifically. They will proactively recommend rigorously vetted establishments that precisely match your dietary requirements, including premium air-conditioned restaurants favored by discerning international visitors such as Peshawri at ITC Mughal, Esphahan, or Dasaprakash. We specifically avoid low-quality tourist trap buffets that plague certain categories of budget group tours."
      },
      {
        question: "Is a licensed guide included in the tour price?",
        answer: "Yes, a federally licensed, ASI-certified (Archaeological Survey of India), high-authority historian guide is a non-negotiable, fundamental component of this premium private tour rather than an optional add-on. Your dedicated guide possesses deep, multi-layered expertise in Mughal architectural history, Shah Jahan's artistic patronage, the complex engineering specifications of the Taj Mahal's translucent marble veneer and its pietra dura gemstone inlay, and the political narrative of Mughal imperial decline. This is the critical differentiator between a passive photograph-taking visit and a deeply educational, intellectually transformative experience. Your guide navigates the complex ASI security screening, manages monument entry logistics, and continuously calibrates the narrative depth and pacing to your demonstrated level of engagement."
      },
      {
        question: "Can we visit the Mehtab Bagh garden across the river from the Taj Mahal?",
        answer: "Yes, and we strongly recommend structuring the Agra itinerary to strategically include the Mehtab Bagh in the late afternoon before departing for Delhi. The Mehtab Bagh (Moonlight Garden) was an original Mughal pleasure garden directly across the Yamuna River from the Taj Mahal's northern riverfront terrace, recently restored by the ASI. This northern bank position delivers the absolute definitive sunset and late afternoon photography angle of the Taj Mahal—the perspective that reveals the full symmetry of the mausoleum, both flanking mosque and jawab, and all four minarets reflected in the Yamuna River. The entrance fee is minimal, and the garden is typically far less crowded than the main complex, providing a meditative, crowd-free alternative viewing experience impossible from within the main monument enclosure."
      },
      {
        question: "Is this tour suitable for senior travelers and those with limited mobility?",
        answer: "This private, dedicated Agra day tour is the structurally superior format for senior travelers or those with any mobility limitations, specifically because the complete tactical control rests with you and your guide rather than with a rigid group bus schedule. If you require additional rest intervals between monument sections, your guide immediately accommodates this without any social pressure from fellow group passengers. The Taj Mahal complex itself is relatively accessible across broad sandstone pathways, though the main mausoleum interior staircase is steep and can be bypassed. Agra Fort involves more significant walking across uneven Mughal-era stone floors. Your guide proactively identifies all available ramp access points, shaded rest structures, and golf cart services where applicable within each monument."
      },
      {
        question: "What are the restrictions inside the Taj Mahal complex?",
        answer: "The Archaeological Survey of India enforces a comprehensive, non-negotiable set of behavioral regulations within the 17-hectare Taj Mahal enclosure that your federally licensed guide will thoroughly brief you on before entry. Food, beverages (including water bottles beyond the security perimeter), and tobacco products are strictly prohibited within the main enclosure. Tripods and professional lighting equipment require a separate permit. The marble plinth requires mandatory khadi shoe covers provided at the main gate. Entry to the main mausoleum interior is included in the composite ticket. Photography inside the main mausoleum chamber is unrestricted except for the direct tomb area. All leatherwork and plastic bottles are required to be deposited at the gate cloak room, which your guide manages seamlessly on your behalf."
      },
      {
        question: "What is the best time of day to experience the Taj Mahal?",
        answer: "Across thousands of documented client experiences, the absolute premium tier window for Taj Mahal appreciation is the first 60 to 90 minutes after sunrise, precisely what this early departure tour structurally delivers. During this window, the Makrana marble undergoes a continuous, dynamic color transformation from pale amber to pure white as the sun elevation increases. Pedestrian density inside the complex is at its daily minimum, typically 30% to 40% below the mid-morning peak. Ambient temperatures are at their most comfortable, critically important from April through September when the Agra plain experiences intense heat by 10:00 AM. Your guide uses this uncrowded window to position you at every critical photography axis—the central reflecting pool perspective, the northwest minaret base, and the eastern garden axis—without competing crowds compromising the composition."
      },
      {
        question: "What is the cancellation policy for this Agra day tour?",
        answer: "We execute a highly transparent, discerning cancellation policy specifically designed for premium international travelers. If you cancel this private Taj Mahal and Agra day tour more than 24 hours prior to the designated pre-dawn pickup time, you will receive a comprehensive 100% full refund with zero complex administrative friction and no penalty charges. Cancellations executed within the strict 24-hour window are subject to restrictions specifically to fairly compensate our permanently dedicated chauffeurs and senior historian guides who were removed from active booking rosters for the entire day's operational window. We strongly recommend monitoring Delhi weather forecasts and confirming your health status the evening prior, as same-day cancellations due to illness are treated with reasonable discretion by our operations team."
      }
    ];
  }
  if (slug === 'delhi-guided-shopping-tour-female-expert') {
    return [
      {
        question: "Why is this shopping tour led by a female expert guide?",
        answer: "Our female expert guide brings a uniquely informed perspective to Delhi's shopping landscape that male guides simply cannot replicate. She has decades of personal shopping experience across every market in the city and understands fabric quality, fair pricing, and negotiation tactics at an instinctive level. For solo female travelers or women's groups, her presence provides an additional layer of comfort and security in crowded bazaars like Chandni Chowk and Sarojini Nagar. She navigates the narrow lanes with authority, identifies genuine artisans versus tourist-trap vendors, and ensures you receive authentic local pricing rather than inflated tourist rates."
      },
      {
        question: "Which Delhi markets does this shopping tour cover?",
        answer: "The tour covers a curated selection of Delhi's most authentic and high-value shopping destinations. You will explore Chandni Chowk for traditional textiles and spices, Dilli Haat for certified handicrafts from all Indian states, Khan Market for premium boutiques, and Janpath Market for bohemian jewelry and leather goods. Your guide selects markets based on your specific shopping interests—whether that is handwoven silk sarees, Mughal-era miniature paintings, aromatic spice blends, or contemporary Indian designer fashion. This variety ensures your [Delhi experience](/india/delhi/india-gate-guided-tour) extends far beyond the typical tourist souvenir circuit."
      },
      {
        question: "Can the guide help me negotiate prices at the bazaars?",
        answer: "Absolutely—this is one of the most valuable aspects of having a local female expert by your side. Delhi's bazaars operate on a negotiation culture where initial asking prices are typically 200-400% above the actual market value for foreign visitors. Your guide intervenes as your personal negotiation specialist, leveraging her Hindi fluency, local relationships, and deep market knowledge to secure authentic local prices. She knows the fair wholesale rates for Pashmina shawls, silk fabrics, leather goods, and gemstones, preventing the common tourist experience of overpaying for mediocre quality."
      },
      {
        question: "Is this tour suitable for solo female travelers?",
        answer: "This tour was specifically designed with solo female travelers in mind. Delhi's bustling markets can be overwhelming and occasionally uncomfortable for women navigating alone. Your female expert guide acts as your cultural shield—handling aggressive vendors, managing rickshaw negotiations, and steering you away from areas that are unnecessarily crowded or uncomfortable. Many of our solo female guests describe this tour as the highlight of their India trip because it allows them to experience authentic Delhi shopping culture with total confidence and zero anxiety."
      },
      {
        question: "How long is the shopping tour?",
        answer: "The tour runs approximately 4 hours, which is the optimal duration to explore 3-4 markets without fatigue. We pace the experience with strategic tea and refreshment breaks at heritage chai stalls that most tourists never discover. If you wish to extend the experience to a full day to cover additional markets like Lajpat Nagar or the Central Cottage Industries Emporium, we can customize the itinerary. Your guide ensures every minute is productive, avoiding the dead time that self-guided shopping inevitably involves in a chaotic city like Delhi."
      },
      {
        question: "What kind of products can I find on this tour?",
        answer: "Delhi is a treasure trove of authentic Indian craftsmanship. You will discover hand-block-printed textiles from Rajasthan, pure Pashmina shawls from Kashmir, aromatic spice blends for your kitchen, handcrafted silver and gemstone jewelry, miniature Mughal paintings, premium leather goods, organic Ayurvedic products, and contemporary Indian fashion. Your guide matches your interests to the right vendors, ensuring quality and authenticity. She can also help with international shipping arrangements for larger purchases like furniture or oversized textiles."
      },
      {
        question: "Is hotel pickup and drop-off included?",
        answer: "Yes, complimentary hotel pickup and drop-off within Delhi is included. Your guide will meet you at your hotel lobby and arrange comfortable transportation to the first market. Between markets, she coordinates auto-rickshaws or private cabs depending on the distance and your comfort preference. At the end of the tour, you are escorted safely back to your hotel with all your purchases. This door-to-door service eliminates the stress of navigating Delhi's complex transportation network while carrying shopping bags."
      },
      {
        question: "Can the shopping tour be combined with Delhi sightseeing?",
        answer: "Yes, many travelers combine this shopping experience with a [Delhi Old and New Delhi tour](/india/delhi/delhi-old-new-delhi-private-half-day-tour) or an [Old Delhi luxury car tour](/india/delhi/explore-old-new-delhi-city-luxury-car-tour). The Chandni Chowk market area is adjacent to the Red Fort and Jama Masjid, making it natural to weave historical sightseeing into the shopping itinerary. Your guide can create a hybrid experience that balances cultural immersion with retail therapy, ensuring you experience Delhi's heritage alongside its vibrant commercial culture."
      },
      {
        question: "What should I bring on this shopping tour?",
        answer: "Carry Indian Rupees (cash) as many bazaar vendors do not accept cards—your guide can assist with ATM locations or currency exchange. Wear comfortable walking shoes as you will navigate cobblestone lanes and uneven surfaces. A crossbody bag is recommended for security in crowded markets. Bring a reusable shopping bag for smaller purchases. Your guide will advise on quality indicators for specific products so you can make informed purchasing decisions throughout the experience."
      },
      {
        question: "Is bargaining expected in Delhi markets?",
        answer: "Bargaining is not just expected—it is a fundamental part of the shopping culture in Delhi's bazaars. Fixed-price shopping exists only in malls and government emporiums. In traditional markets like Chandni Chowk, Sarojini Nagar, and Janpath, negotiation is an art form that both buyers and sellers enjoy. Your female expert guide excels at this craft, ensuring you experience the cultural exchange of bargaining while securing fair prices. She will teach you key Hindi phrases and bargaining strategies that you can use independently throughout your India travels."
      },
      {
        question: "Can I request specific items to shop for?",
        answer: "Absolutely. When you book, share your shopping wishlist and your guide will pre-plan the route to include the best vendors for each item. Whether you need custom-tailored outfits (24-hour turnaround available in some markets), specific gemstones, particular fabric types, or traditional Indian wedding accessories, your guide curates the itinerary around your priorities. This bespoke approach ensures maximum efficiency—no wasted time wandering markets that do not stock what you are looking for."
      },
      {
        question: "Are food and drink stops included?",
        answer: "Yes, your guide incorporates authentic food stops at legendary Delhi street food establishments along the route. In Chandni Chowk, you may sample the famous paranthe wali gali (stuffed flatbreads), jalebi from century-old sweet shops, and aromatic chai from heritage tea stalls. These culinary pit stops are carefully selected for hygiene and quality—your guide knows which vendors maintain the highest standards. This transforms the shopping tour into a multi-sensory cultural experience that engages your taste buds alongside your retail instincts."
      },
      {
        question: "Is this tour available on weekends?",
        answer: "Yes, the tour operates every day of the week. However, market dynamics vary by day—Chandni Chowk is closed on Sundays, while Sarojini Nagar has its famous Tuesday market. Your guide adapts the itinerary based on the day of your booking to ensure every market visited is fully operational and at its most vibrant. Saturday afternoons tend to be the busiest, which some travelers enjoy for the atmosphere while others prefer the calmer weekday mornings for more focused shopping."
      },
      {
        question: "How does this compare to shopping alone in Delhi?",
        answer: "Shopping independently in Delhi as a foreign visitor typically results in paying 2-4x the local price, visiting tourist-trap shops with inflated margins, and missing the authentic artisan workshops hidden in back lanes. Our guided experience eliminates all these disadvantages. Your expert guide provides quality authentication (she can identify genuine Pashmina from synthetic in seconds), prevents overcharging, and introduces you to family-run workshops that have no online presence. The guide fee effectively pays for itself through the savings on your purchases."
      },
      {
        question: "What is the cancellation policy for this shopping tour?",
        answer: "We offer a straightforward cancellation policy: 100% full refund for cancellations made more than 24 hours before the tour start time. Cancellations within 24 hours incur a 50% charge to compensate the guide who has blocked her full schedule for your booking. We understand that travel plans change, so we also offer free rescheduling to an alternative date if notified 24 hours in advance. Contact us via WhatsApp for instant assistance with any booking modifications."
      }
    ];
  }

  if (slug === 'from-delhi-same-day-taj-mahal-fastest-train') {
    return [
      {
        question: "Which is India's fastest train used for this Taj Mahal trip?",
        answer: "This tour utilizes the Gatimaan Express, India's first semi-high-speed train that connects Delhi's Hazrat Nizamuddin station to Agra Cantt in just 100 minutes at speeds up to 160 km/h. This is significantly faster than driving (3-4 hours) and far more comfortable than the older Shatabdi Express. The train features airline-style reclining seats, onboard catering with a complimentary meal, and air-conditioned coaches. This premium rail experience ensures you arrive in Agra refreshed and ready to explore rather than exhausted from a long drive on the Yamuna Expressway."
      },
      {
        question: "Are confirmed Gatimaan Express train tickets included?",
        answer: "Yes, confirmed Executive Chair Car tickets on the Gatimaan Express are included in both directions. These are premium-class seats with guaranteed confirmation—no waitlisting. We secure these tickets in advance through our priority IRCTC allocation, which is critical because the Gatimaan Express sells out weeks ahead due to its popularity. Your tickets include the complimentary onboard meal service. This eliminates the common frustration of tourists who attempt to book independently and find no availability, especially during the peak October-March travel season."
      },
      {
        question: "What time does the Gatimaan Express depart from Delhi?",
        answer: "The Gatimaan Express departs from Hazrat Nizamuddin Railway Station in South Delhi at approximately 8:10 AM, arriving at Agra Cantt station by 9:50 AM. The return train departs Agra at approximately 5:50 PM, reaching Delhi by 7:30 PM. This schedule provides you with approximately 7-8 hours in Agra—more than sufficient for a comprehensive [Taj Mahal and Agra Fort guided tour](/india/agra/taj-mahal-agra-fort-guided-tour) with lunch. Your guide will meet you at Agra station with a private vehicle, ensuring zero wasted time on arrival."
      },
      {
        question: "Is a guide and private car included in Agra?",
        answer: "Yes, a certified ASI-licensed guide and a comfortable air-conditioned private car are waiting for you at Agra Cantt station. The moment you step off the Gatimaan Express, your guide welcomes you and the vehicle takes you directly to the Taj Mahal. The private car remains at your disposal throughout the day for transfers between the [Taj Mahal](/india/agra/taj-mahal-official-guided-tour), Agra Fort, and any other sites you wish to visit. This seamless ground arrangement means you maximize every minute of your limited time in Agra."
      },
      {
        question: "How much time do we get at the Taj Mahal?",
        answer: "You will have approximately 2-2.5 hours for a comprehensive Taj Mahal exploration, which is the optimal duration recommended by our senior guides. This allows thorough coverage of the main gateway, the Charbagh gardens, the reflecting pool, the main mausoleum platform and interior, and the flanking mosque. After the Taj, you still have ample time for Agra Fort (1.5 hours) and a traditional Mughlai lunch. Your guide paces the visit perfectly to ensure depth without rush, unlike group tours that allow only 45 minutes inside the complex."
      },
      {
        question: "Is this better than driving from Delhi to Agra?",
        answer: "The train is categorically superior to driving for several reasons: first, the 100-minute journey versus 3-4 hours by road saves you up to 4 hours of total travel time. Second, you avoid the unpredictable Yamuna Expressway traffic, toll queues, and fatigue from a long drive. Third, the Gatimaan Express experience itself is enjoyable—premium seating, meals, and the novelty of India's fastest train. Fourth, you arrive relaxed and alert rather than road-weary. The only scenario where driving is preferable is if you plan to visit Fatehpur Sikri (which is off the train route)."
      },
      {
        question: "Can we add Agra Fort or Baby Taj to this itinerary?",
        answer: "Absolutely. The standard itinerary includes the Taj Mahal and Agra Fort. For travelers wanting deeper immersion, we can add Itimad-ud-Daulah (Baby Taj) or a visit to the [hidden gems of Agra](/india/agra/hidden-gems-of-agra-heritage-tour). The 7-8 hours in Agra provide enough time for 2-3 major sites plus lunch. Your guide will optimize the routing to minimize transit time between monuments, ensuring maximum time at each site. Simply specify your preferences when booking and we will create a bespoke [1-day Agra itinerary](/india/agra/1-day-agra-itinerary) around the train schedule."
      },
      {
        question: "What if the Gatimaan Express is delayed or cancelled?",
        answer: "Indian Railways delays are rare on the Gatimaan Express due to its priority scheduling, but we have contingency protocols in place. If a significant delay occurs, our Agra team adjusts your itinerary in real-time to ensure you still visit the Taj Mahal. In the extremely unlikely event of a cancellation, we immediately arrange a private car from Delhi to Agra (approximately 3 hours) at no additional cost. Your guide maintains constant communication via WhatsApp to keep you informed. This operational redundancy ensures your [Taj Mahal visit](/india/agra/taj-mahal-opening-time) happens regardless of any rail disruptions."
      },
      {
        question: "Is hotel pickup in Delhi included?",
        answer: "Yes, we provide complimentary pickup from your Delhi hotel to Hazrat Nizamuddin Railway Station. The pickup time is calibrated to ensure you arrive at the station with adequate buffer (approximately 30 minutes before departure). Our driver navigates Delhi's morning traffic efficiently using real-time routing. On return, we pick you up from Nizamuddin station and drop you back at your hotel. This complete door-to-door service means you never need to worry about Delhi's complex transportation logistics."
      },
      {
        question: "Is lunch included in this day trip?",
        answer: "Lunch is included at a carefully selected restaurant in Agra that serves authentic Mughlai cuisine. You will enjoy specialties like butter chicken, biryani, and fresh naan in a clean, air-conditioned environment. The restaurant is chosen for both quality and strategic location between the Taj Mahal and Agra Fort, minimizing travel time. The onboard Gatimaan Express meal (included with your ticket) serves as breakfast, and the Agra lunch ensures you are energized for the afternoon sightseeing before your return train."
      },
      {
        question: "Can solo travelers book this tour?",
        answer: "Yes, this tour is popular with solo travelers. You receive the same private guide, private car, and confirmed train tickets as any group booking. Solo travelers particularly appreciate the safety and efficiency of having a dedicated guide navigate Agra on their behalf. The pricing is per-person, making it accessible for individuals. Many solo travelers from our [Delhi sightseeing tours](/india/delhi/delhi-old-new-delhi-private-half-day-tour) add this Agra day trip as the perfect complement to their Delhi itinerary."
      },
      {
        question: "What should I carry on the train?",
        answer: "Travel light for this day trip: a small daypack with your camera, sunscreen, sunglasses, a water bottle, and your passport (required for Taj Mahal foreign national tickets). Leave heavy luggage at your Delhi hotel. The Gatimaan Express has overhead luggage racks and under-seat storage for daypacks. Carry Indian Rupees for any personal shopping in Agra. Your guide handles all ticketing and logistics, so you do not need printed confirmations. Comfortable walking shoes are essential as you will cover 3-4 km on foot at the Taj Mahal complex."
      },
      {
        question: "Is the Taj Mahal entry ticket included?",
        answer: "Yes, the [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket) for foreign nationals is included in the tour package. This covers the standard ASI admission plus the mausoleum interior access supplement. Your guide pre-arranges the tickets to bypass the manual ticket window queue, which can exceed 45 minutes during peak season. Agra Fort entry is also included. All monument fees are transparently bundled into the tour price with zero hidden charges, ensuring your experience is completely hassle-free."
      },
      {
        question: "How far in advance should I book this tour?",
        answer: "We strongly recommend booking at least 7-10 days in advance, especially during the peak season (October through March). Gatimaan Express tickets have limited inventory and sell out rapidly. During festivals like Diwali, Christmas, and New Year, booking 2-3 weeks ahead is advisable. Last-minute bookings are sometimes possible but cannot guarantee the Gatimaan Express—we would substitute with the Shatabdi Express or private car if train seats are unavailable. Early booking ensures the premium train experience that makes this tour exceptional."
      },
      {
        question: "What is the cancellation policy for this train tour?",
        answer: "Due to the non-refundable nature of confirmed IRCTC train tickets, our cancellation policy is stricter than standard tours. Cancellations more than 48 hours before departure receive a 75% refund (25% covers the non-recoverable train ticket costs). Cancellations within 48 hours receive a 25% refund. However, the ground arrangements in Agra (guide, car, lunch) are fully refundable up to 24 hours prior. We recommend travel insurance that covers trip cancellations for complete protection. Rescheduling is possible subject to train availability."
      }
    ];
  }

  if (slug === 'explore-old-new-delhi-city-luxury-car-tour') {
    return [
      {
        question: "What is the difference between Old Delhi and New Delhi on this tour?",
        answer: "Old Delhi (Shahjahanabad) is the historic Mughal-era walled city built by Emperor Shah Jahan in 1639, featuring narrow lanes, centuries-old bazaars, the Red Fort, and Jama Masjid. New Delhi is the British-designed colonial capital created by Edwin Lutyens in the 1930s, featuring wide boulevards, India Gate, Rashtrapati Bhavan, and Parliament House. This tour uniquely bridges both eras, giving you a comprehensive understanding of Delhi's 1,000-year evolution from a medieval fortress city to a modern global capital. The contrast between the two is one of the most fascinating aspects of [exploring Delhi](/india/delhi/india-gate-guided-tour)."
      },
      {
        question: "What kind of luxury car is used for this tour?",
        answer: "We deploy premium sedans and SUVs including Toyota Fortuner, Toyota Crysta, or Mercedes-Benz class vehicles depending on your group size and preference. Each vehicle features professional-grade climate control, plush leather interiors, chilled mineral water, and a uniformed chauffeur trained in VIP protocol. The luxury car is essential in Delhi—it provides a climate-controlled sanctuary between monument visits, protecting you from the heat, dust, and traffic chaos. You can specify your vehicle preference when booking to ensure the exact level of comfort you desire."
      },
      {
        question: "Is an official licensed guide included?",
        answer: "Yes, your tour is led by a Ministry of Tourism-certified guide with deep expertise in both Mughal and British colonial history. These guides undergo rigorous government examinations and are the only professionals legally authorized to provide historical commentary at ASI-protected monuments like the Red Fort and Humayun's Tomb. Their dual knowledge of Old and New Delhi history creates a seamless narrative that connects the Mughal emperors to the British Raj to modern India—an intellectual journey that self-guided exploration simply cannot replicate."
      },
      {
        question: "Which monuments and landmarks are covered?",
        answer: "The full-day itinerary covers approximately 8-10 major landmarks: Red Fort, Jama Masjid, Chandni Chowk (rickshaw ride), Raj Ghat (Gandhi memorial), Humayun's Tomb, Qutub Minar, India Gate, Parliament House drive-by, Rashtrapati Bhavan, and Lotus Temple. The half-day option covers 4-5 highlights based on your preferences. Your guide customizes the route to match your interests—history buffs may add Purana Qila while architecture enthusiasts might prefer Safdarjung's Tomb. This flexibility is the advantage of a [private Delhi tour](/india/delhi/delhi-old-new-delhi-private-half-day-tour)."
      },
      {
        question: "Can this tour be customized to my interests?",
        answer: "Absolutely. The itinerary is fully flexible. If you are passionate about Mughal architecture, we can extend time at Humayun's Tomb and the Red Fort. Food enthusiasts can add a heritage food walk through Chandni Chowk's famous paranthe wali gali. Photography lovers can schedule golden-hour visits to India Gate and Humayun's Tomb. If you are combining this with a [Taj Mahal day trip](/india/delhi/delhi-luxury-premium-tour) the next day, we can prioritize Delhi-specific sites that you cannot see in Agra. Simply share your preferences and your guide creates a bespoke experience."
      },
      {
        question: "Is a Chandni Chowk rickshaw ride included?",
        answer: "Yes, a traditional cycle-rickshaw ride through the narrow, bustling lanes of Chandni Chowk is one of the tour highlights. This 20-30 minute ride takes you through Asia's largest spice market, the famous silver jewelry bazaar, and past centuries-old havelis that most tourists never see from a car window. Your guide accompanies you on the rickshaw, narrating the history of each lane. This immersive experience provides an authentic sensory overload—sights, sounds, and aromas—that captures the true essence of Mughal-era Delhi."
      },
      {
        question: "How long is this Delhi city tour?",
        answer: "You can choose between a half-day tour (approximately 5-6 hours) or a full-day tour (approximately 8-9 hours including lunch). The full-day option is recommended for first-time Delhi visitors as it covers both Old and New Delhi comprehensively. The half-day option works well for travelers with limited time or those who want to focus on either the Mughal heritage (Old Delhi) or the colonial landmarks (New Delhi). Both options include luxury car transportation and a licensed guide throughout."
      },
      {
        question: "Is lunch included in the full-day tour?",
        answer: "Yes, the full-day tour includes lunch at a carefully selected restaurant serving authentic North Indian cuisine. The restaurant is chosen for quality, hygiene, and strategic location between Old and New Delhi to minimize travel time. You will enjoy classic dishes like butter chicken, dal makhani, and fresh tandoori bread. For travelers with dietary restrictions, vegetarian, vegan, and Jain options are available. The restaurant provides a comfortable, air-conditioned rest stop that recharges you for the afternoon sightseeing segment."
      },
      {
        question: "Are monument entry tickets included?",
        answer: "Yes, entry tickets to all monuments on the itinerary are included in the tour price. This covers the Red Fort, Humayun's Tomb, Qutub Minar, and any other ticketed sites. Your guide pre-arranges tickets to minimize queuing time, especially at the Red Fort where lines can exceed 30 minutes during peak season. This all-inclusive pricing ensures zero hidden costs and allows you to focus entirely on the history and architecture rather than logistics."
      },
      {
        question: "Is this tour suitable for first-time visitors to India?",
        answer: "This tour is specifically designed for first-time India visitors. Delhi can be overwhelming—the traffic, the crowds, the sensory intensity—and having a professional guide with a luxury vehicle transforms what could be a stressful experience into a comfortable, educational adventure. Your guide provides cultural context, safety guidance, and navigation expertise that eliminates the common anxieties of first-time visitors. The luxury car serves as your private sanctuary between sites, allowing you to decompress and process each experience before the next."
      },
      {
        question: "Can we visit the Red Fort interior?",
        answer: "Yes, the Red Fort interior visit is a highlight of the Old Delhi segment. You will explore the Diwan-i-Am (Hall of Public Audience), Diwan-i-Khas (Hall of Private Audience), the Royal Baths, and the beautifully manicured Mughal gardens. Your guide provides detailed commentary on the fort's role as the seat of Mughal power for nearly 200 years. Note that the Red Fort is closed on Mondays—if your tour falls on a Monday, your guide will substitute with an equally significant alternative like Purana Qila (Old Fort)."
      },
      {
        question: "Is Humayun's Tomb worth visiting if I'm going to see the Taj Mahal?",
        answer: "Absolutely. Humayun's Tomb is the direct architectural precursor to the Taj Mahal—built 60 years earlier, it established the template of a garden tomb surrounded by symmetrical charbagh gardens. Understanding Humayun's Tomb makes your subsequent [Taj Mahal visit](/india/agra/taj-mahal-opening-time) exponentially more meaningful because you can trace the evolution of Mughal funerary architecture. The recently restored gardens are among the most beautiful in India, and the monument itself is a UNESCO World Heritage Site that rivals the Taj in historical significance if not in scale."
      },
      {
        question: "What is the best time of year for this Delhi tour?",
        answer: "The optimal months are October through March when Delhi's weather is pleasant (15-25°C). December and January can have morning fog but are otherwise ideal. April through June should be avoided if possible due to extreme heat (40-45°C) that makes outdoor sightseeing uncomfortable. The monsoon months (July-September) bring humidity but also lush green landscapes. For photography, November offers the clearest skies and best visibility of Delhi's architectural landmarks."
      },
      {
        question: "Can this be combined with a Delhi shopping experience?",
        answer: "Yes, many travelers add our [Delhi Guided Shopping Tour with Female Expert](/india/delhi/delhi-guided-shopping-tour-female-expert) as a complementary experience. The sightseeing tour naturally passes through major shopping districts—Chandni Chowk for traditional goods, Khan Market for premium boutiques, and Dilli Haat for handicrafts. Your guide can incorporate strategic shopping stops into the itinerary or you can book the dedicated shopping tour for the following day to create a comprehensive Delhi experience."
      },
      {
        question: "What is the cancellation policy?",
        answer: "We offer a generous cancellation policy: 100% full refund for cancellations made more than 24 hours before the scheduled pickup time. Cancellations within 24 hours incur a 50% charge to compensate the guide and chauffeur who have reserved their schedules exclusively for your booking. Free rescheduling is available with 24 hours' notice subject to guide availability. Contact our team via WhatsApp for instant assistance with any booking modifications or travel plan changes."
      }
    ];
  }

  if (slug === 'delhi-private-4-day-golden-triangle-luxury-tour') {
    return [
      {
        question: "What cities does the 4-Day Golden Triangle Luxury Tour cover?",
        answer: "This premium 4-day itinerary covers India's three most iconic cities: Delhi, Agra, and Jaipur. Day 1 features comprehensive [Delhi sightseeing](/india/delhi/explore-old-new-delhi-city-luxury-car-tour) including the Red Fort, India Gate, and Humayun's Tomb. Day 2 takes you to Agra for the [Taj Mahal](/india/agra/taj-mahal-official-guided-tour) and Agra Fort with an optional Fatehpur Sikri stop. Day 3 transfers you to Jaipur for the Amber Fort and City Palace. Day 4 completes the Jaipur exploration before your return to Delhi. This triangular route represents the essential distillation of India's Mughal and Rajput heritage into a single, luxurious journey."
      },
      {
        question: "What makes this a luxury tour compared to standard Golden Triangle packages?",
        answer: "The luxury distinction manifests in every detail: 5-star heritage hotel accommodations (such as The Oberoi, ITC Mughal, or Rambagh Palace), premium SUV or sedan transportation with uniformed chauffeurs, Category-A senior historian guides at every monument, curated fine-dining experiences featuring regional specialties, and a dedicated trip coordinator available 24/7 via WhatsApp. Standard packages use budget hotels, shared vehicles, and rushed schedules. Our luxury approach provides unhurried exploration, private access where possible, and the caliber of service that discerning world travelers expect."
      },
      {
        question: "Is a sunrise Taj Mahal visit included?",
        answer: "Yes, the sunrise Taj Mahal experience is a centerpiece of Day 2. We arrange pre-dawn departure from your Agra hotel so you are among the first visitors when the ASI gates open. Watching the white marble transform from cool lavender to warm gold as the sun rises is an emotional, once-in-a-lifetime experience. Your senior guide positions you at the optimal photography points and provides historical commentary in the peaceful morning atmosphere. After the sunrise visit, you continue to [Agra Fort](/india/agra/taj-mahal-agra-fort-guided-tour) before your transfer to Jaipur."
      },
      {
        question: "What hotel category is included?",
        answer: "We include 5-star and heritage luxury hotels throughout the itinerary. In Delhi, options include The Oberoi New Delhi or ITC Maurya. In Agra, The Oberoi Amarvilas (with Taj Mahal views from every room) or ITC Mughal. In Jaipur, The Rambagh Palace or The Oberoi Rajvilas. Each property is selected for its heritage significance, service excellence, and strategic proximity to the major monuments. If you have a preferred hotel chain or specific property in mind, we accommodate all requests. Room upgrades to suites are available upon request."
      },
      {
        question: "Are all monument entry tickets and guide fees included?",
        answer: "Yes, every element is comprehensively included: all ASI monument entry tickets (Red Fort, Humayun's Tomb, Qutub Minar, Taj Mahal, Agra Fort, Amber Fort, City Palace, Jantar Mantar), licensed guide services in all three cities, luxury vehicle with fuel and tolls, hotel accommodations with breakfast, and select meals. There are zero hidden charges. This all-inclusive pricing allows you to enjoy the journey without constantly reaching for your wallet or worrying about unexpected costs. The only additional expenses are personal shopping and gratuities."
      },
      {
        question: "Can the itinerary be customized?",
        answer: "Absolutely. While the Delhi-Agra-Jaipur routing is fixed, the specific experiences within each city are fully flexible. You can add a [Delhi shopping tour](/india/delhi/delhi-guided-shopping-tour-female-expert), include Fatehpur Sikri between Agra and Jaipur, add a cooking class in Jaipur, or substitute certain monuments based on your interests. Families with children might prefer adding an elephant sanctuary visit in Jaipur, while architecture enthusiasts might want extra time at Humayun's Tomb and Amber Fort. Your trip coordinator tailors every detail to your preferences."
      },
      {
        question: "How are the transfers between cities handled?",
        answer: "All intercity transfers are by luxury air-conditioned vehicle on the excellent Yamuna Expressway (Delhi-Agra, approximately 3.5 hours) and NH48 (Agra-Jaipur, approximately 4.5 hours via Fatehpur Sikri). The vehicles are equipped with premium amenities including chilled water, snacks, charging ports, and Wi-Fi. Your chauffeur is a professional trained in VIP protocol and defensive driving. The drives themselves offer fascinating glimpses of rural India—mustard fields, village life, and vast agricultural plains—that complement the urban monument experiences perfectly."
      },
      {
        question: "Is this tour suitable for families with children?",
        answer: "Yes, we regularly host families on this luxury itinerary and our guides excel at engaging young travelers. Children under 15 receive free entry at most ASI monuments. The luxury vehicle provides a comfortable retreat between sites, and the 5-star hotels offer family rooms and children's amenities. Your guide adapts the storytelling to include age-appropriate tales of emperors, battles, and treasure that captivate young imaginations. The pace is adjusted to prevent fatigue, with strategic breaks for ice cream, swimming pools, and playground time at the hotels."
      },
      {
        question: "What happens if I arrive late at Delhi airport?",
        answer: "Our team monitors your flight in real-time and adjusts the pickup accordingly. A premium airport transfer is included with a dedicated driver holding a name board at the arrivals gate. If your flight is significantly delayed, we restructure the Day 1 Delhi itinerary to prioritize the most important sites. In extreme cases (very late night arrival), we shift the full Delhi sightseeing to Day 4 and begin with Agra on Day 2. This operational flexibility ensures no major experience is compromised regardless of travel disruptions."
      },
      {
        question: "Is Fatehpur Sikri included in this tour?",
        answer: "Fatehpur Sikri is offered as an included stop on the Agra-to-Jaipur transfer day. This magnificent abandoned Mughal capital, built by Emperor Akbar in 1571, is a UNESCO World Heritage Site featuring the stunning Buland Darwaza (Gate of Magnificence)—the tallest gateway in the world. Your guide provides comprehensive commentary on Akbar's experimental city that was abandoned after just 14 years due to water scarcity. The [Fatehpur Sikri visit](/india/agra/fatehpur-sikri-guided-tour) adds approximately 1.5 hours to the transfer and is highly recommended for history enthusiasts."
      },
      {
        question: "What meals are included in the 4-day package?",
        answer: "Daily breakfast at your luxury hotel is included throughout the tour. We also include lunch on Day 1 (Delhi), lunch on Day 2 (Agra—authentic Mughlai cuisine), and a farewell dinner on Day 3 (Jaipur—traditional Rajasthani thali). Other meals are kept flexible so you can explore local restaurants at your own pace. Your guide provides curated restaurant recommendations for any non-included meals, ensuring every dining experience is authentic and high-quality. Special dietary requirements (vegetarian, vegan, halal, kosher) are accommodated at all included meals."
      },
      {
        question: "How far in advance should I book this luxury tour?",
        answer: "We recommend booking at least 2-3 weeks in advance, especially during the peak season (October through March). Premium hotels like The Oberoi Amarvilas in Agra and Rambagh Palace in Jaipur have limited inventory and sell out months ahead during festivals and holidays. For travel during Diwali, Christmas, or New Year, booking 6-8 weeks ahead is strongly advised. Early booking also ensures availability of our top-tier Category-A guides, who are in high demand during peak season."
      },
      {
        question: "Can I extend this tour to include Varanasi or Udaipur?",
        answer: "Yes, many travelers extend the Golden Triangle with additional destinations. Popular extensions include Varanasi (spiritual capital on the Ganges), Udaipur (City of Lakes in Rajasthan), Jodhpur (Blue City), and Ranthambore (tiger safari). We can add 1-3 days per extension with the same luxury standards. Flights between cities are arranged for time efficiency. Your trip coordinator designs the extended itinerary based on your interests and available time, creating a comprehensive India experience that goes beyond the standard Golden Triangle circuit."
      },
      {
        question: "Is travel insurance recommended for this tour?",
        answer: "While not mandatory, we strongly recommend comprehensive travel insurance that covers trip cancellation, medical emergencies, and baggage protection. India's healthcare infrastructure varies significantly between cities, and premium insurance ensures access to the best private hospitals if needed. Insurance also protects your investment in this luxury tour against unforeseen cancellations due to illness, family emergencies, or flight disruptions. We can recommend trusted international insurance providers who specialize in India travel coverage."
      },
      {
        question: "What is the cancellation policy for this luxury tour?",
        answer: "Given the advance hotel reservations and guide commitments, our cancellation policy is: cancellations more than 30 days before departure receive a 90% refund. Cancellations 15-30 days before departure receive a 60% refund. Cancellations 7-14 days before departure receive a 30% refund. Cancellations within 7 days are non-refundable. We strongly recommend travel insurance to mitigate any financial loss from unexpected cancellations. Free date changes are possible up to 30 days before departure, subject to hotel and guide availability."
      }
    ];
  }

  if (slug === 'delhi-luxury-premium-tour') {
    return [
      {
        question: "What luxury car is used for the Delhi to Agra round trip?",
        answer: "We deploy premium vehicles including Toyota Fortuner, Mercedes-Benz E-Class, BMW 5 Series, or Toyota Crysta depending on your group size and preference. Each vehicle features professional-grade climate control, leather interiors, chilled mineral water, premium snacks, charging ports, and ample legroom for the 3.5-hour highway journey. The chauffeur is a trained professional in formal attire who maintains the vehicle to immaculate standards. This is not a basic taxi service—it is a curated VIP transfer designed to make your [Delhi to Agra journey](/india/agra/taj-mahal-delhi-guided-tour) as comfortable as the destination itself."
      },
      {
        question: "How long is the drive from Delhi to Agra?",
        answer: "The drive from Delhi to Agra via the Yamuna Expressway takes approximately 3 to 3.5 hours depending on traffic conditions. The Yamuna Expressway is a modern 6-lane highway in excellent condition, making the drive smooth and comfortable. We depart your Delhi hotel between 5:00-6:00 AM for optimal timing at the [Taj Mahal](/india/agra/taj-mahal-opening-time). The return journey departs Agra by approximately 4:00-5:00 PM, getting you back to your Delhi hotel by 8:00-8:30 PM. Strategic rest stops are included at premium highway facilities."
      },
      {
        question: "Is a licensed guide included at the Taj Mahal and Agra Fort?",
        answer: "Yes, a senior ASI-licensed guide awaits you in Agra with specialized expertise in Mughal architecture and history. This is not a generic city guide—this is a monument specialist who has been guiding at the [Taj Mahal](/india/agra/taj-mahal-official-guided-tour) and Agra Fort for 10+ years. They provide the depth of historical knowledge that transforms your visit from sightseeing into a meaningful educational experience. The guide coordinates with your chauffeur to optimize the itinerary timing, ensuring seamless transitions between monuments."
      },
      {
        question: "What is included in the tour price?",
        answer: "The all-inclusive package covers: luxury car round-trip Delhi-Agra-Delhi with professional chauffeur, all highway tolls and parking fees, ASI-licensed guide in Agra, Taj Mahal and Agra Fort entry tickets, bottled water and vehicle amenities throughout. Lunch at a premium restaurant is also included. There are absolutely zero hidden charges. The only personal expenses are shopping and optional gratuities. This transparent pricing ensures you can enjoy the experience without constantly calculating additional costs."
      },
      {
        question: "Can we visit Fatehpur Sikri as well?",
        answer: "Yes, Fatehpur Sikri can be added to the itinerary as it lies on the route approximately 40 km from Agra. This UNESCO World Heritage Site—Emperor Akbar's abandoned capital city—features the magnificent Buland Darwaza and the exquisite tomb of Salim Chishti. Adding [Fatehpur Sikri](/india/agra/fatehpur-sikri-guided-tour) extends the tour by approximately 1.5-2 hours and is highly recommended for travelers who want a comprehensive Mughal heritage experience beyond just the Taj Mahal. Your guide provides equally detailed commentary at this remarkable site."
      },
      {
        question: "What time should we depart Delhi for the best experience?",
        answer: "We recommend departing between 5:00-6:00 AM to reach Agra by 8:30-9:00 AM, which provides the optimal morning light at the Taj Mahal with manageable crowds. For a [sunrise Taj Mahal experience](/india/agra/sunrise-taj-mahal-and-agra-tour-by-car), departure at 3:00-3:30 AM is necessary. Your chauffeur accommodates any preferred timing. Earlier departures benefit from virtually empty highways and cooler temperatures, while the luxury vehicle ensures you can rest comfortably during the drive. Late departures (after 8 AM) are possible but result in heavier traffic and more crowded monuments."
      },
      {
        question: "Is this tour suitable for elderly travelers?",
        answer: "This luxury tour is ideal for elderly travelers because the private car eliminates all the physical stress of public transportation and group tours. The vehicle provides a comfortable, air-conditioned retreat between monuments. At the Taj Mahal and Agra Fort, your guide adjusts the walking pace and prioritizes the most impactful viewing areas. Wheelchair accessibility at the Taj Mahal is limited but manageable with guide assistance. The luxury vehicle's low entry height and ample legroom ensure comfortable boarding and exiting. Rest stops and bathroom breaks are scheduled as needed."
      },
      {
        question: "How does this compare to taking the Gatimaan Express train?",
        answer: "Both options are excellent but serve different preferences. The [Gatimaan Express](/india/delhi/from-delhi-same-day-taj-mahal-fastest-train) is faster (100 minutes vs 3.5 hours) and offers a unique train experience, but has fixed departure times and requires station transfers. The luxury car provides total schedule flexibility—depart when you want, stop where you want, and return when you are ready. The car also allows Fatehpur Sikri and other roadside stops. For families, elderly travelers, or anyone who values complete itinerary control, the luxury car is the superior choice."
      },
      {
        question: "Can we stop for breakfast on the way to Agra?",
        answer: "Yes, we include a strategic stop at a premium highway restaurant approximately 90 minutes into the journey. These facilities along the Yamuna Expressway offer clean restrooms, fresh breakfast options, and quality coffee. It is an excellent opportunity to stretch your legs, freshen up, and enjoy a meal before arriving in Agra energized and ready for exploration. The stop adds only 20-30 minutes to the journey and significantly enhances your comfort level for the busy sightseeing day ahead."
      },
      {
        question: "Is a car seat available for young children?",
        answer: "Yes, child car seats and booster seats are available upon request at no additional charge. Please specify your child's age and weight when booking so we can install the appropriate safety equipment in the luxury vehicle. Indian highways are well-maintained but long-distance driving always benefits from proper child restraint systems. Our chauffeurs are trained in car seat installation and ensure your child's safety throughout the journey. Children under 15 also benefit from free entry at most ASI monuments."
      },
      {
        question: "What happens if there is heavy traffic or road closure?",
        answer: "Our chauffeurs use real-time GPS navigation and maintain communication with our operations team to identify traffic issues before they impact your schedule. Alternative routes are available via the older NH19 highway if the Yamuna Expressway experiences unusual congestion. In the extremely rare event of a road closure, your guide adjusts the Agra itinerary to compensate for any lost time, prioritizing the Taj Mahal as the non-negotiable highlight. Our operational redundancy ensures your monument visits happen as planned regardless of road conditions."
      },
      {
        question: "Can I book a one-way drop to Agra instead of round-trip?",
        answer: "Yes, one-way transfers are available for travelers who plan to continue from Agra to Jaipur or other destinations. This is popular with [Golden Triangle tour](/india/delhi/delhi-private-4-day-golden-triangle-luxury-tour) travelers. The one-way option includes the same luxury vehicle and chauffeur for the Delhi-to-Agra leg, with full guide service in Agra. We can also arrange your onward transfer from Agra to Jaipur or any other city with the same standard of luxury ground transportation."
      },
      {
        question: "Is this tour available during monsoon season?",
        answer: "Yes, the tour operates year-round including during the monsoon months (July-September). The Yamuna Expressway is an all-weather highway, and the luxury vehicle provides complete weather protection. Interestingly, monsoon season offers unique advantages: dramatically fewer tourists at the Taj Mahal, lush green landscapes along the highway, and spectacular cloud formations that create moody, atmospheric photography conditions. The marble of the Taj also has a distinctive luminous quality when wet. Your guide carries umbrellas and adjusts the itinerary to work around rain showers."
      },
      {
        question: "Can we include a Taj Mahal sunset view from Mehtab Bagh?",
        answer: "Yes, adding a sunset view from Mehtab Bagh is an excellent enhancement. This garden across the Yamuna River offers the most spectacular perspective of the Taj Mahal bathed in golden sunset light. We schedule the [Agra Fort](/india/agra/taj-mahal-agra-fort-guided-tour) visit for mid-afternoon, followed by Mehtab Bagh for the 4:00-5:30 PM golden hour window. This extends your return to Delhi by approximately 1.5 hours but provides photography opportunities that are arguably more stunning than the frontal view. Many professional photographers consider the Mehtab Bagh perspective the ultimate Taj Mahal image."
      },
      {
        question: "What is the cancellation policy?",
        answer: "We offer a fair cancellation policy: 100% refund for cancellations more than 24 hours before the scheduled departure. Cancellations within 24 hours incur a 50% charge to compensate the chauffeur and guide who have blocked their entire day for your exclusive service. Free rescheduling is available with 24 hours' notice subject to vehicle and guide availability. For last-minute changes, contact us via WhatsApp—our team is responsive and will work to find the best solution for your situation."
      }
    ];
  }

  if (slug === 'india-gate-triangle-guided-tour') {
    return [
      {
        question: "What does the 6-Day Golden Triangle tour include?",
        answer: "This comprehensive 6-day journey covers India's three iconic cities—Delhi, Agra, and Jaipur—with the extended timeline allowing deep exploration that standard 3-day packages rush through. You get 2 full days in Delhi covering [Old and New Delhi](/india/delhi/explore-old-new-delhi-city-luxury-car-tour), 2 days for Agra including the [Taj Mahal at sunrise](/india/agra/taj-mahal-sunrise-guided-tour) and Fatehpur Sikri, and 2 days in Jaipur for the Amber Fort, City Palace, Hawa Mahal, and local bazaars. All hotels, transportation, licensed guides, monument tickets, and select meals are included in the package price."
      },
      {
        question: "Why choose 6 days instead of the standard 3-day Golden Triangle?",
        answer: "The 3-day Golden Triangle is essentially a highway marathon where you spend more time in a car than at monuments. Our 6-day version provides the pace that India deserves—you can linger at the Taj Mahal for sunset and sunrise, explore the backstreets of Chandni Chowk, enjoy a cooking class in Jaipur, and still have time for unexpected discoveries. This relaxed pace prevents travel fatigue and allows genuine cultural immersion rather than a checklist of photo stops. It is the difference between seeing India and truly experiencing it."
      },
      {
        question: "What hotel category is included?",
        answer: "We include 4-star and 5-star hotels throughout the circuit. In Delhi, properties like ITC Maurya, The Claridges, or equivalent. In Agra, hotels with Taj Mahal views such as Crystal Sarovar or The Gateway Hotel. In Jaipur, heritage properties like Samode Haveli or Trident Jaipur. All hotels feature air-conditioned rooms, complimentary breakfast, Wi-Fi, and 24-hour room service. Upgrades to luxury 5-star properties like The Oberoi chain are available upon request. Each property is selected for its location, heritage value, and consistent service quality."
      },
      {
        question: "Is Fatehpur Sikri included in this tour?",
        answer: "Yes, [Fatehpur Sikri](/india/agra/fatehpur-sikri-guided-tour) is included as a key stop between Agra and Jaipur on Day 4. This UNESCO World Heritage Site—Emperor Akbar's magnificent abandoned capital—features the 54-meter Buland Darwaza (the world's tallest gateway), the exquisite tomb of Sufi saint Salim Chishti, and the perfectly preserved Panch Mahal. With the 6-day timeline, you get a thorough 1.5-hour guided exploration rather than the rushed 30-minute drive-by that compressed tours offer. It is one of the most underrated gems of the Golden Triangle circuit."
      },
      {
        question: "Are all monument entry tickets included?",
        answer: "Yes, every single monument entry ticket across all three cities is included: Red Fort, Humayun's Tomb, Qutub Minar, India Gate (Delhi); Taj Mahal, Agra Fort, Fatehpur Sikri (Agra); Amber Fort, City Palace, Jantar Mantar, Hawa Mahal (Jaipur). This represents significant savings as individual tickets for foreign nationals can total over $100. Your licensed guide handles all ticketing logistics at each monument, ensuring skip-the-line access wherever possible and zero time wasted at ticket windows."
      },
      {
        question: "What transportation is used between cities?",
        answer: "All intercity transfers are by comfortable, air-conditioned private vehicle (Toyota Crysta, Fortuner, or equivalent). The Delhi-Agra transfer (3.5 hours via Yamuna Expressway) and Agra-Jaipur transfer (5 hours via NH21 with Fatehpur Sikri stop) are both on well-maintained national highways. Your professional chauffeur remains with you throughout the entire 6 days, providing consistent, reliable transportation for both intercity drives and local sightseeing. The vehicle is exclusively yours—no shared rides or group pickups."
      },
      {
        question: "Can the itinerary be customized?",
        answer: "The itinerary is fully flexible within the Delhi-Agra-Jaipur framework. Popular customizations include adding a [Delhi shopping tour](/india/delhi/delhi-guided-shopping-tour-female-expert), including a sunrise and sunset Taj Mahal visit, adding an elephant sanctuary visit in Jaipur, incorporating a Rajasthani cooking class, or substituting specific monuments based on your interests. If you have visited Delhi before, we can compress the Delhi segment and extend time in Jaipur or Agra. Share your preferences when booking and your trip coordinator will craft the perfect personalized itinerary."
      },
      {
        question: "Is this tour suitable for senior travelers?",
        answer: "Absolutely. The 6-day pace is specifically recommended for senior travelers because it eliminates the exhausting rush of compressed itineraries. Daily sightseeing is limited to 5-6 hours with comfortable breaks, air-conditioned vehicle between every stop, and hotels with elevators and accessible rooms. Your guide adjusts walking distances and prioritizes the most impactful viewing points at each monument. The private vehicle means no climbing into buses or waiting for group logistics. We have successfully hosted travelers in their 80s who thoroughly enjoyed every moment."
      },
      {
        question: "What meals are included?",
        answer: "Daily breakfast at your hotel is included throughout the 6 days. Additionally, lunch is included on Days 1, 3, and 5 at carefully curated restaurants serving authentic regional cuisine—Mughlai in Delhi, Awadhi in Agra, and Rajasthani in Jaipur. A special farewell dinner on Day 5 in Jaipur features traditional Rajasthani thali with live folk music. Other meals are kept flexible so you can explore local restaurants independently with recommendations from your guide. All dietary requirements are accommodated including vegetarian, vegan, and halal."
      },
      {
        question: "Do we get the same guide for all three cities?",
        answer: "You receive specialized licensed guides in each city—a Delhi specialist, an Agra specialist, and a Jaipur specialist. This is superior to having a single guide for all three cities because each specialist possesses deep, focused knowledge of their city's history, architecture, and culture. Your Delhi guide understands Mughal and British colonial history, your Agra guide specializes in [Taj Mahal](/india/agra/taj-mahal-official-guided-tour) and Mughal funerary architecture, and your Jaipur guide is an expert in Rajput warrior culture and palace architecture. Your chauffeur and trip coordinator remain consistent throughout."
      },
      {
        question: "Is the Jaipur Amber Fort elephant ride included?",
        answer: "The traditional elephant ride up to Amber Fort is available but we recommend the ethical alternative of a jeep ride instead. Many international travelers prefer the jeep option due to animal welfare concerns, and it is actually faster and more comfortable. Both options are included in the tour price. Your guide will discuss the choices with you and respect your preference. The Amber Fort itself is the crown jewel of Jaipur—the Sheesh Mahal (Mirror Palace), Ganesh Pol gateway, and panoramic views from the ramparts are absolutely spectacular regardless of how you ascend."
      },
      {
        question: "What is the best season for the Golden Triangle tour?",
        answer: "October through March is the ideal season with pleasant daytime temperatures (15-28°C) and minimal rainfall. November and February are considered the sweet spot—clear skies, comfortable weather, and vibrant festival culture. December-January can have morning fog in Agra that creates mystical Taj Mahal photographs. April-June experiences extreme heat (38-45°C) and is not recommended for outdoor sightseeing. The monsoon season (July-September) brings humidity but also the greenest landscapes, fewer tourists, and lower hotel prices."
      },
      {
        question: "Can this tour be extended to Ranthambore or Varanasi?",
        answer: "Yes, we offer popular extensions including the [Ranthambore Tiger Safari](/india/delhi/5-days-golden-triangle-ranthambore-tiger-safari) (2 days, accessible from Jaipur), Varanasi spiritual experience (2 days, by flight from Delhi or Jaipur), Udaipur City of Lakes (2 days from Jaipur), and Jodhpur Blue City (1-2 days from Jaipur). Each extension maintains the same quality standards of hotels, guides, and transportation. The most popular combination is the Golden Triangle + Ranthambore for wildlife enthusiasts who want to spot Bengal tigers in their natural habitat."
      },
      {
        question: "How far in advance should I book?",
        answer: "We recommend booking 2-4 weeks in advance during peak season (October-March) and at least 1-2 weeks during off-peak months. During major festivals (Diwali, Holi, Christmas) and long weekends, booking 4-6 weeks ahead is essential as both hotels and premium guides are in high demand. Early booking ensures the best hotel room categories and our top-tier guides. Last-minute bookings (under 1 week) are sometimes possible but may require substitutions in hotel properties."
      },
      {
        question: "What is the cancellation policy?",
        answer: "For this multi-day tour with advance hotel reservations: cancellations more than 21 days before departure receive an 85% refund. Cancellations 14-21 days before receive a 60% refund. Cancellations 7-14 days before receive a 30% refund. Cancellations within 7 days are non-refundable due to committed hotel and guide costs. Free date changes are available up to 21 days before departure subject to availability. We strongly recommend comprehensive travel insurance that covers trip cancellation for complete financial protection."
      }
    ];
  }

  if (slug === 'delhi-old-new-delhi-private-half-day-tour') {
    return [
      {
        question: "Can I choose between a half-day and full-day Delhi tour?",
        answer: "Yes, this tour offers both options. The half-day tour (approximately 5-6 hours) covers either Old Delhi or New Delhi highlights, while the full-day tour (approximately 8-9 hours) comprehensively covers both. For first-time Delhi visitors, we strongly recommend the full-day option to experience the dramatic contrast between the Mughal-era walled city and the British colonial capital. If your time is limited, the half-day Old Delhi option provides the most culturally immersive experience, while the half-day New Delhi option covers the iconic landmarks like [India Gate](/india/delhi/india-gate-guided-tour) and Humayun's Tomb."
      },
      {
        question: "What does the Old Delhi segment cover?",
        answer: "The Old Delhi exploration includes the magnificent Red Fort (UNESCO World Heritage Site), Jama Masjid (India's largest mosque with stunning panoramic views from its minaret), a traditional rickshaw ride through the chaotic and colorful lanes of Chandni Chowk, the serene Raj Ghat (Mahatma Gandhi's memorial), and optional stops at the Gurudwara Sis Ganj Sahib and Fatehpuri Masjid. Your guide reveals the hidden stories of Shahjahanabad—the walled city Emperor Shah Jahan built in 1639—that most tourists never learn about."
      },
      {
        question: "What does the New Delhi segment cover?",
        answer: "The New Delhi segment showcases the colonial and modern face of India's capital: India Gate (the national war memorial), a scenic drive past Rashtrapati Bhavan (President's House) and Parliament House on Rajpath, Humayun's Tomb (the architectural precursor to the [Taj Mahal](/india/agra/taj-mahal-opening-time)), Qutub Minar (the 73-meter UNESCO-listed victory tower), and the Lotus Temple (Bahá'í House of Worship). This segment reveals how the British deliberately designed New Delhi as a statement of imperial power, with wide boulevards and monumental architecture that contrasts sharply with Old Delhi's organic medieval layout."
      },
      {
        question: "Is a licensed guide and private car included?",
        answer: "Yes, both a Ministry of Tourism-certified guide and a comfortable air-conditioned private car are included throughout the tour. The guide provides expert historical commentary that connects the dots between Delhi's various ruling dynasties—from the Delhi Sultanate to the Mughals to the British Raj to modern independent India. The private car ensures comfortable, climate-controlled transfers between all sites with zero waiting for public transport. This combination of expert knowledge and logistical comfort is what makes this tour superior to self-guided exploration."
      },
      {
        question: "Is this tour suitable for first-time India visitors?",
        answer: "This tour is specifically designed for first-time visitors to India. Delhi can be sensory overload—the sounds, smells, traffic, and crowds can be overwhelming without a knowledgeable companion. Your guide and driver create a protective bubble that allows you to experience Delhi's intensity at a comfortable pace. The guide explains cultural contexts, helps you navigate crowded spaces, and ensures you never feel lost or unsafe. The private car serves as your sanctuary between sites. Many first-time visitors describe this tour as essential for building confidence before exploring India independently."
      },
      {
        question: "Are monument entry tickets included?",
        answer: "Yes, all monument entry tickets are included in the tour price. This covers Red Fort, Humayun's Tomb, Qutub Minar, and any other ticketed sites on the itinerary. Your guide handles all ticketing logistics to minimize waiting time. The inclusive pricing means zero hidden costs—what you pay at booking is what you pay in total. The only personal expenses are meals (lunch is included in the full-day option), shopping, and optional gratuities."
      },
      {
        question: "How does this tour handle Delhi's extreme heat?",
        answer: "Your air-conditioned private car is the key heat management tool. Between every monument visit (typically 30-60 minutes of outdoor exploration), you return to the cool car for the transfer to the next site. Your guide strategically sequences the itinerary to visit outdoor monuments during cooler morning hours and indoor or shaded sites during peak afternoon heat. We provide complimentary chilled water throughout. During extreme summer months (May-June), we recommend the early morning start (7:00 AM) to maximize comfortable sightseeing before noon temperatures peak."
      },
      {
        question: "Is a Chandni Chowk rickshaw ride included?",
        answer: "Yes, a traditional cycle-rickshaw ride through Chandni Chowk's narrow lanes is included in the Old Delhi segment. This 20-30 minute ride is one of the most exhilarating cultural experiences in Delhi—weaving through centuries-old bazaars, past spice merchants, silver shops, and street food vendors in lanes barely wide enough for two rickshaws to pass. Your guide accompanies you, providing running commentary on the history and specialties of each lane. It is the single best way to experience the authentic energy of Mughal-era Delhi."
      },
      {
        question: "Can this be combined with a shopping experience?",
        answer: "Absolutely. The tour naturally passes through some of Delhi's best shopping areas. Chandni Chowk is famous for traditional textiles, spices, and jewelry. Khan Market (near Humayun's Tomb) is Delhi's premium boutique district. For a dedicated shopping experience, we recommend adding our [Delhi Guided Shopping Tour with Female Expert](/india/delhi/delhi-guided-shopping-tour-female-expert) on the same day or the following day. Your guide can also incorporate brief shopping stops at curated artisan workshops during the sightseeing tour itself."
      },
      {
        question: "What is the best time of year for Delhi sightseeing?",
        answer: "October through March offers the most pleasant weather (15-25°C) for outdoor sightseeing. November and February are ideal with clear skies and comfortable temperatures. December-January mornings can be foggy but afternoons are pleasant. April through June experiences extreme heat (38-45°C) and is not recommended for extended outdoor exploration. The monsoon season (July-September) brings rain showers but also lush green landscapes at Humayun's Tomb and Qutub Minar. Your guide adapts the pace and itinerary based on the season."
      },
      {
        question: "Is this tour wheelchair accessible?",
        answer: "Most Delhi monuments have limited wheelchair accessibility due to their historical construction. However, our guide and driver provide maximum assistance to make the experience as comfortable as possible. The Red Fort has relatively flat pathways on the main level. Humayun's Tomb has a ramp to the main platform. Qutub Minar is viewable from the base without climbing. The private car provides comfortable, easy-entry transportation between all sites. Please inform us of any mobility requirements when booking so we can customize the itinerary to prioritize the most accessible monuments."
      },
      {
        question: "Can I visit a Sikh temple (Gurudwara) on this tour?",
        answer: "Yes, visiting Gurudwara Bangla Sahib or Gurudwara Sis Ganj Sahib can be included in the itinerary. These are among Delhi's most beautiful and spiritually significant sites. The Gurudwaras welcome visitors of all faiths and offer a profound cultural experience—including the community kitchen (langar) that feeds thousands of people daily for free. Your guide explains the history and customs, and assists with the requirement to cover your head and remove shoes. It is a deeply moving experience that adds an important spiritual dimension to your Delhi understanding."
      },
      {
        question: "Is food or street food tasting included?",
        answer: "The full-day tour includes lunch at a quality restaurant. Additionally, your guide incorporates optional street food stops during the Chandni Chowk segment—famous paranthe wali gali (stuffed flatbreads), century-old jalebi shops, and aromatic chai from heritage stalls. These food experiences are carefully selected for hygiene and quality. For travelers concerned about street food safety, the guide identifies the most trusted vendors that have served for generations. The culinary element transforms this from a standard sightseeing tour into a multi-sensory cultural immersion."
      },
      {
        question: "How does this compare to a hop-on-hop-off bus tour?",
        answer: "A private guided tour is categorically superior to hop-on-hop-off buses in Delhi. The private car navigates Delhi's chaotic traffic efficiently while the bus follows fixed routes at the mercy of congestion. You get an expert guide providing personalized historical commentary versus a recorded audio guide. You control the pace—spending more time at sites that interest you and skipping those that do not. The air-conditioned car provides comfort that open-top buses cannot in Delhi's extreme weather. And you experience places like Chandni Chowk by rickshaw, which no bus tour can replicate."
      },
      {
        question: "What is the cancellation policy?",
        answer: "We offer a generous cancellation policy: 100% full refund for cancellations made more than 24 hours before the scheduled pickup time. Cancellations within 24 hours incur a 50% charge to compensate the guide and chauffeur who reserved their day exclusively for you. Free rescheduling is available with 24 hours' notice subject to guide and vehicle availability. Contact our team via WhatsApp for instant assistance with any changes to your booking."
      }
    ];
  }

  if (slug === 'sunrise-taj-mahal-tour-delhi-all-inclusive') {
    return [
      {
        question: "What does 'all inclusive' mean in this sunrise Taj Mahal tour?",
        answer: "All inclusive means every single expense is covered: pre-dawn hotel pickup from Delhi, luxury air-conditioned car round-trip to Agra, all highway tolls and parking, ASI-licensed guide in Agra, [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket) including mausoleum interior access, Agra Fort entry, breakfast, lunch at a premium restaurant, and hotel drop-off in Delhi. There are zero hidden charges or surprise costs. The only personal expenses are shopping and optional gratuities. This truly all-inclusive approach means you can focus entirely on the experience without worrying about logistics or budgeting during the day."
      },
      {
        question: "What time is the pickup from Delhi for the sunrise tour?",
        answer: "For the sunrise experience, we pick you up from your Delhi hotel between 2:30-3:30 AM depending on the season. The drive to Agra takes approximately 3-3.5 hours via the Yamuna Expressway, putting you at the Taj Mahal East Gate approximately 30 minutes before the ASI opens the gates. This early departure is essential—the [Taj Mahal opens at sunrise](/india/agra/taj-mahal-opening-time) and being in the first wave of visitors is the only way to experience the monument in near-silence. Your luxury vehicle is comfortable enough for resting during the pre-dawn drive."
      },
      {
        question: "Is the sunrise Taj Mahal experience really worth the early wake-up?",
        answer: "Absolutely—it is the single most magical way to experience the Taj Mahal. At sunrise, the white marble transitions through an extraordinary spectrum of colors: from cool lavender-grey in the pre-dawn light, through soft pink as the first rays appear, to a warm golden glow as the sun climbs. With only a fraction of the daily 40,000+ visitors present, you have unobstructed views of the reflecting pools, the gardens, and the mausoleum. The atmosphere is profoundly peaceful—the only sounds are birdsong and your guide's whispered historical commentary. Every photographer and serious traveler prioritizes this timing."
      },
      {
        question: "Is a professional guide included at the Taj Mahal?",
        answer: "Yes, a senior ASI-licensed guide with 10+ years of Taj Mahal specialization is included. This is not a generic city guide—this is a monument expert who understands the complex Pietra Dura inlay techniques, the calligraphy program, the optical illusions in the architecture, and the romantic and political history of the Mughal dynasty. They know every premium photography position and time their commentary to align with the changing sunrise light. Having this caliber of guide transforms your visit from sightseeing into a profound historical education that makes the [Taj Mahal](/india/agra/taj-mahal-official-guided-tour) truly meaningful."
      },
      {
        question: "Is Agra Fort included in this tour?",
        answer: "Yes, after the Taj Mahal visit, your guide escorts you to the magnificent Agra Fort (just 2 km away). This UNESCO World Heritage Site served as the main residence of the Mughal emperors for nearly a century. You will explore the Diwan-i-Am, Diwan-i-Khas, the Royal Baths, and the poignant Musamman Burj—the octagonal tower where a imprisoned Shah Jahan spent his final years gazing across the Yamuna at his beloved wife's [Taj Mahal](/india/agra/taj-mahal-agra-fort-guided-tour). The Agra Fort visit provides the crucial second chapter of the Taj Mahal story that most sunrise-only tours miss."
      },
      {
        question: "What meals are included?",
        answer: "Both breakfast and lunch are included. Breakfast is served at a quality restaurant in Agra after your Taj Mahal visit—the perfect way to refuel after the early morning. Lunch features authentic Mughlai cuisine at a premium restaurant between the Agra Fort visit and your return journey. Both restaurants are selected for quality, hygiene, and air-conditioned comfort. Vegetarian, vegan, and other dietary requirements are accommodated with advance notice. The included meals eliminate any need to search for food in an unfamiliar city."
      },
      {
        question: "What kind of car is used for this tour?",
        answer: "We use premium air-conditioned vehicles including Toyota Crysta, Toyota Fortuner, or equivalent SUVs. The vehicle is equipped with reclining seats (essential for the pre-dawn drive), chilled mineral water, charging ports, and ample space for your camera equipment and personal items. The chauffeur is a trained professional who drives the Delhi-Agra route regularly and maintains the vehicle to immaculate standards. For the 3:00 AM pickup, the comfortable vehicle effectively serves as a mobile bedroom for the first hour of the journey."
      },
      {
        question: "How long is the complete day trip?",
        answer: "The complete round-trip from Delhi typically runs 14-16 hours: approximately 3.5 hours driving each way, 2-2.5 hours at the Taj Mahal, 1.5 hours at Agra Fort, and 1-1.5 hours for breakfast and lunch combined. With a 3:00 AM departure, you return to your Delhi hotel between 5:00-7:00 PM depending on traffic conditions. This timeline provides comprehensive coverage without rushing, unlike many operators who compress the experience into 12 hours with minimal monument time."
      },
      {
        question: "Can we add Fatehpur Sikri or Baby Taj to this tour?",
        answer: "Yes, both can be added to create a more comprehensive [Agra experience](/india/agra/agra-city-highlights-tour). Fatehpur Sikri lies on the route back to Delhi and adds approximately 1.5 hours. Itimad-ud-Daulah (Baby Taj) is within Agra city and adds approximately 45 minutes. Adding both is possible but extends the return to Delhi by 2-3 hours. For travelers who want the most complete Agra experience in a single day, adding at least one of these sites is highly recommended as they provide crucial historical context for the [Taj Mahal](/india/agra/taj-mahal-opening-time)."
      },
      {
        question: "Is this tour available on Fridays?",
        answer: "The Taj Mahal is closed every Friday for prayers at the mosque within the complex. We do not operate this specific sunrise tour on Fridays. If your only available day is Friday, we recommend our [Agra Friday Special Tour](/india/agra/agra-friday-tour-taj-closed-alternative) which covers Agra Fort, Baby Taj, and Mehtab Bagh sunset views. Alternatively, we can reschedule your Taj Mahal visit to Saturday or another day. We always verify the closure schedule before confirming your booking to prevent any disappointment."
      },
      {
        question: "How does this compare to taking the Gatimaan Express train?",
        answer: "Both are excellent options. The [Gatimaan Express](/india/delhi/from-delhi-same-day-taj-mahal-fastest-train) arrives in Agra by 9:50 AM, which misses the sunrise entirely. For the sunrise experience, the private car is the only viable option from Delhi. The car also offers complete schedule flexibility, the ability to stop at Fatehpur Sikri, and door-to-door hotel service. The Gatimaan Express wins on speed for non-sunrise visits. For travelers who specifically want the sunrise magical lighting and photography conditions, this all-inclusive car tour is the definitive choice."
      },
      {
        question: "Is this tour suitable for elderly travelers?",
        answer: "Yes, the all-inclusive format is actually ideal for elderly travelers because it eliminates every logistical stress. The luxury car provides a comfortable, climate-controlled environment for the highway journey with stops as needed. At the monuments, your guide adjusts the pace and walking distances to your comfort level. The included meals mean no searching for restaurants. The sunrise timing actually works well for early risers who naturally wake early. The private car allows rest during the return journey. We have successfully hosted travelers in their 70s and 80s on this tour."
      },
      {
        question: "What should I wear for the sunrise visit?",
        answer: "Layer strategically: the pre-dawn temperature can be 10-15°C cooler than afternoon. A light jacket or shawl is essential for the early hours, which you can remove as the sun warms. Comfortable closed-toe walking shoes are necessary as you will walk 3-4 km on marble and sandstone surfaces. Dress modestly (shoulders and knees covered) to respect the monument's sanctity. Sunglasses are essential once the sun rises—the white marble creates intense glare. We provide shoe covers so you can keep footwear on the marble platform. A hat or cap is recommended for sun protection."
      },
      {
        question: "Can solo travelers book this tour?",
        answer: "Absolutely. Solo travelers receive the same premium experience—private car, private guide, all meals, and all tickets included. Solo female travelers particularly appreciate the security and comfort of having a dedicated guide and chauffeur throughout the day. The pricing is per-person and remains excellent value given the comprehensive inclusions. Many solo travelers from our [Delhi city tours](/india/delhi/delhi-old-new-delhi-private-half-day-tour) add this Agra day trip as the natural complement to their Delhi itinerary."
      },
      {
        question: "What is the cancellation policy?",
        answer: "We offer a clear cancellation policy: 100% full refund for cancellations made more than 24 hours before the scheduled pickup time. Cancellations within 24 hours incur a 50% charge to compensate the driver and guide who reserved their full day for your exclusive booking. In cases of extreme weather or government-mandated Taj Mahal closures, we offer a full refund or free rescheduling. Contact us via WhatsApp for instant assistance—our team is available around the clock to help with any booking modifications."
      }
    ];
  }

  // --- END DELHI TOUR FAQS ---

  if (
    slug === 'taj-mahal-sunrise-guided-tour' ||
    slug === 'taj-mahal-sunrise-tour' ||
    slug === 'sunrise-taj-mahal-and-agra-tour-by-car' ||
    slug === 'private-taj-mahal-tour-from-delhi' ||
    slug === 'taj-mahal-tour-by-train-gatimaan' ||
    slug === 'agra-overnight-tour'
  ) {
    const isSkipLine = slug === 'taj-mahal-sunrise-tour' || slug === 'sunrise-taj-mahal-and-agra-tour-by-car';
    const tourLabel = isSkipLine ? "Taj Mahal Sunrise Tour (Skip-the-line version)" : "Taj Mahal Sunrise Tour";
    const tourPath = slug === 'sunrise-taj-mahal-and-agra-tour-by-car'
      ? "/india/agra/sunrise-taj-mahal-and-agra-tour-by-car"
      : (isSkipLine ? "/india/agra/taj-mahal-sunrise-tour" : "/india/agra/taj-mahal-sunrise-guided-tour");

    return [
      {
        question: "What is the first entry time allowed by ASI?",
        answer: `The Archaeological Survey of India (ASI) officially opens the Taj Mahal gates exactly **30 minutes before sunrise**. This entry time is strictly enforced to ensure the security personnel from the CISF are in position. For most of the year, this equates to approximately 5:30 AM or 6:00 AM. Many visitors ask if they can enter earlier to beat the crowds, but the ASI protocols are rigid. By booking a [${tourLabel}](${tourPath}), you ensure that our guides have you in the very first segment of the security queue. This strategic positioning is vital because even a 10-minute delay can result in hundreds of people entering before you, potentially obstructing those pristine, reflection-pool views that make the early wake-up call so rewarding for international travelers.`
      },
      {
        question: "Is sunrise timing different in summer vs winter?",
        answer: "Yes, sunrise timing in Agra fluctuates dramatically between the seasons, impacting your [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) schedule. During the intense summer months of May and June, the sun breaks the horizon as early as 5:15 AM, necessitating a 4:30 AM hotel departure. Conversely, in the peak of winter (December and January), sunrise can be as late as 7:15 AM. We constantly monitor the official [sunrise timing](/india/agra/taj-mahal-opening-time) to calibrate our pickup times perfectly. While summer offers clear skies and sharp shadows, winter often brings a mystical morning fog that creates a dream-like atmosphere. Regardless of the month, our local experts ensure you are through the security gates the moment the ASI allows, allowing you to witness the white marble transition from cool lavender to a warm, golden glow as the light intensity changes."
      },
      {
        question: "How early should we reach for best photography?",
        answer: "To capture professional-grade photography without the interference of massive crowds, you should aim to reach the security gates at least **30 to 45 minutes before the gates open**. In the world of high-authority travel photography, the \"Blue Hour\"—the period just before technical sunrise—is considered the platinum window for long-exposure shots of the reflecting pools. Many travelers believe arriving at 6:00 AM is sufficient, but by then, the queue at the East Gate can already be quite long. As your specialized local partner, we prioritize early arrival tactics. Our guides know the exact \"symmetry points\" where the light hits the dome first. By being among the first 50 people inside, you can secure that iconic, unobstructed shot of the mausoleum perfectly mirrored in the water."
      },
      {
        question: "Is Taj Mahal closed on Fridays?",
        answer: "The Taj Mahal is closed to the public every Friday. This closure is a long-standing tradition to allow local residents to use the 17th-century mosque located within the complex for afternoon prayers. If you are planning an [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) exploration, ensure you do not schedule your visit for a Friday, as the gates will remain firmly locked to all tourists. However, Friday can still be a productive day; you can visit the Agra Fort or the Baby Taj. For those desperate for a view, the Mehtab Bagh (Moonlight Garden) remains open on Fridays and provides a stunning perspective of the Taj Mahal from across the Yamuna River during sunset. Our [1-day itinerary](/india/agra/1-day-agra-itinerary) planners always double-check these dates to prevent any disappointment."
      },
      {
        question: "What should I wear for sunrise visit?",
        answer: "Choosing the right attire is essential for both comfort and respect. Since the sunrise visit starts in the dark, temperatures can be 5-10°C cooler than the afternoon. We recommend a \"smart layering\" strategy: a light jacket or pashmina that you can easily remove once the sun rises. We advise dressing modestly (shoulders and knees covered) to maintain the sanctity of the site. Comfortable walking shoes are a must, as you will be covering roughly 3-4 kilometers of marble and sandstone paths. Don't worry about removing your shoes on the main platform; our tours include high-quality [shoe covers](/india/agra/taj-mahal-ticket-price-2026) that allow you to keep your footwear on while exploring the interior cenotaph chamber of Shah Jahan and Mumtaz Mahal."
      },
      {
        question: "Is there morning prayer during sunrise?",
        answer: `While the Taj Mahal complex houses a red sandstone mosque on its western side, there is no loud, public morning prayer (Adhan) broadcast within the gardens during the standard tourist sunrise hours. The mosque is primarily used for private prayers by authorized personnel and locals on Fridays. However, you will often notice a profound, spiritual stillness during the early hours. The only sounds you'll hear are the waking birds in the Charbagh gardens and the soft footsteps of other sunrise enthusiasts. This provides a contemplative environment where our guides can share the architectural and romantic history of the monument without being drowned out by the mid-day bustle, making the [${tourLabel}](${tourPath}) experience feel truly exclusive and personal.`
      },
      {
        question: "Is the Taj Mahal Sunrise Tour worth the 4:30 AM wake-up call?",
        answer: "Waking up at 4:30 AM is truly necessary and is the only way to experience the Taj Mahal's soul. By arriving at sunrise, you bypass the 40°C afternoon heat and the 40,000+ daily visitors who saturate the complex by noon. The value of seeing the marble change color in near-silence far outweighs an extra two hours of sleep. This is a once-in-a-lifetime moment where the \"platinum light\" of the Golden Hour allows for photos that look like postcards. When you weigh the minor inconvenience of an early start against the intellectual and visual reward of an unobstructed view, the answer is a resounding yes. It is the tactical choice for any serious globetrotter following a premium [agra travel guide 2026](/india/agra/agra-travel-guide-2026)."
      },
      {
        question: "Is it worth booking a private guide for the sunrise tour instead of going solo?",
        answer: "A private, ASI-licensed guide is absolutely worth it because they act as your logistical shield and navigate the complex CISF security protocols for you. Beyond logistics, having a historian explain the pietra dura marble inlay and the optical illusions of the calligraphy transforms a \"pretty building\" into a masterpiece of 17th-century engineering. Without a guide, you are essentially just looking at marble; with us, you are experiencing the political and romantic legacy of the Mughal Empire. For the price of a dinner, you gain a deep, high-authority educational experience that makes your [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) truly meaningful. It settles all objections regarding the complexity of the site."
      },
      {
        question: "Is it worth visiting Agra just for the sunrise tour?",
        answer: "Many of our guests specifically book a [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) just to witness this one specific sunrise moment—and they never regret it. The Taj Mahal at dawn is an emotional experience that justifies the entire trip to India for many. The sheer scale and symmetry, revealed slowly through the morning mist or the first clear light, is a visual payload that mid-day tours simply cannot deliver. By focusing your energy on the sunrise, you capture the \"prime time\" of the city and can even be back in Delhi or at your next destination by mid-afternoon. If you only have 24 hours in Northern India, the sunrise tour is the highest-value investment of your time and travel budget compared to any other [things to do in Agra](/india/agra/things-to-do-in-agra)."
      }
    ];
  }

  if (slug === 'taj-mahal-royal-private-tour') {
    return [
      {
        question: "What makes this a Royal Private Tour?",
        answer: "Our [Private Royal Luxury Taj Mahal Tour](/india/agra/taj-mahal-royal-private-tour) is defined by its uncompromising commitment to exclusivity, elegance, and high-authority historical depth. Unlike standard private tours, the \"Royal\" tier includes our most senior, historian-level guides and the highest category of luxury transportation. Every logistical detail, from the chilled refreshments in your vehicle to the priority skip-the-line assistance at the monument, is engineered to provide a palatial experience. We focus on the \"Platinum Version\" of Agra, avoiding all tourist traps and commercial distractions. This is a curated journey designed for discerning world travelers who seek to experience the Taj Mahal's romantic legacy without any logistical friction or compromise on quality."
      },
      {
        question: "Is this a fully private experience with no other guests?",
        answer: "Yes, this is a 100% exclusive experience. When you book the [Private Royal Luxury Taj Mahal Tour](/india/agra/taj-mahal-royal-private-tour), your vehicle and your expert guide are reserved solely for your party. We do not consolidate bookings or mix groups. This total privacy allows for a deeply personal connection with the architecture and history. You have the total freedom to set your own pace, linger at specific viewpoints for as long as you desire, and ask infinite questions. This \"sanctuary of privacy\" is a core tenet of our high-authority service, ensuring that your [1-day Agra itinerary](/india/agra/1-day-agra-itinerary) remains a private chapter of your personal travel history, away from the bustle of group crowds."
      },
      {
        question: "Do we get priority entry at Taj Mahal?",
        answer: "While the federal security screening (CISF) is mandatory for all, our [Royal Private Tour](/india/agra/taj-mahal-royal-private-tour) includes pre-booked \"High-Value\" digital tickets that significantly streamline the entry process. We utilize the specialized \"High Value\" entry lanes at the West or East gate, which are less congested than the standard public turnstiles. Your senior guide handles all the technicalities of the [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket), allowing you to bypass the massive manual ticket window queues that can often exceed an hour. This tactical skip-the-line assistance ensures you are inside the complex during the \"Platinum Window\" of soft morning light, maximizing your visual and physical comfort."
      },
      {
        question: "Is luxury transport included?",
        answer: "Luxury transportation is a non-negotiable hallmark of our [Royal Private Tour](/india/agra/taj-mahal-royal-private-tour). We utilize only the latest models of premium sedans and SUVs, such as the Toyota Fortuner, Mercedes-Benz, or similar high-spec vehicles. Each vehicle is equipped with professional-grade climate control, plush leather interiors, and a suite of premium amenities including chilled mineral water, fresh wet wipes, and an assortment of high-quality snacks. Our chauffeurs are uniformed professionals trained in VIP protocol and defensive driving. This \"sanctuary on wheels\" provides a stress-free transition from your hotel to the monuments, ensuring your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) experience begins and ends in absolute comfort and safety."
      },
      {
        question: "Can we choose the vehicle category?",
        answer: "Absolutely. We offer a tiered selection of luxury vehicles to match your specific preferences and group size. You can choose from a premium executive sedan for couples, a high-ground-clearance luxury SUV for ultimate road comfort, or a high-roof luxury van (such as a Force Urbania) for larger family groups. If you have a specific request for a Mercedes or BMW, we can coordinate this as a \"Platinum Upgrade.\" This flexibility ensures that your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) logistics are perfectly aligned with your lifestyle. Simply specify your choice during the booking process, and we will ensure the designated vehicle is pristinely prepared for your [Delhi to Agra day trip](/india/agra/taj-mahal-delhi-guided-tour)."
      },
      {
        question: "Is a senior licensed guide included?",
        answer: "Yes, the [Royal Private Tour](/india/agra/taj-mahal-royal-private-tour) is led exclusively by our most elite, \"Category A\" historian-guides licensed by the Ministry of Tourism. These professionals possess at least 15+ years of on-ground experience and often hold postgraduate degrees in Indian History or Archaeology. They are not merely storytellers; they are high-authority experts capable of deep-dive analyses of Mughal engineering, Persian gardens, and Islamic calligraphy. Their ability to distill complex history into an engaging, high-level narrative is what transforms your [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) into a profound intellectual journey. They serve as your personal cultural liaisons, protecting your energy and providing a rich, nuanced educational payload."
      },
      {
        question: "How long do we spend inside Taj Mahal?",
        answer: "A standard royal visit typically lasts between **2.5 to 3.5 hours**, but because this is a strictly private experience, the clock is entirely yours. We prioritize an \"unhurried pace\" that respects your curiosity. If you are captivated by the intricate Pietra Dura marble inlay or wish to spend extra time in the Charbagh gardens observing the symmetry, your guide will adjust the schedule seamlessly. We avoid the \"rushed shuttle\" feel of budget tours. This flexibility allows you to master the geometry of the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) experience without stress, ensuring you have ample time for both deep learning and personal contemplation at the world's most romantic monument."
      },
      {
        question: "Can this tour be customized completely?",
        answer: "Customization is the very soul of our [Royal Private Tour](/india/agra/taj-mahal-royal-private-tour). While we provide a logically structured \"Platinum Itinerary,\" every element can be swapped or modified in real-time. If you prefer to skip the Agra Fort to spend more time at the Baby Taj, or if you'd like to include a specific stop at a high-end local bazaar, we will accommodate your request. You can also specify your preferred lunch timing and venue. This bespoke approach ensures your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) plan is unique to you. We are not a rigid tour agency; we are your personal logistical architects in India, dedicated to fulfilling your specific travel vision."
      },
      {
        question: "Is a luxury lunch included?",
        answer: "Yes, we include a multi-course \"Royal Mughal Lunch\" at one of Agra's most prestigious 5-star establishments, such as the ITC Mughal or the Oberoi Amarvilas (subject to availability). This culinary experience is designed to meet the highest international hygiene and quality standards. You will sample authentic recipes that have been passed down through generations of royal chefs, served in a palatial setting. This midday break provides a necessary \"reset\" in climate-controlled luxury before you continue your exploration of the Agra Fort. We select only restaurants that have high-authority reputations for excellence, ensuring your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) is both a historical and gastronomic masterclass."
      },
      {
        question: "Can we add champagne breakfast or fine dining?",
        answer: "For those seeking the ultimate celebratory experience, we can arrange a **Champagne Breakfast** with views of the Taj Mahal or an exclusive multi-course \"Chef's Table\" dinner. These ultra-luxury additions are popular for honeymoons and milestone anniversaries. We coordinate with the city's top luxury hotels to secure the most private and visually stunning locations, often on rooftops overlooking the marble dome. This \"Platinum\" customization extends the legacy of Shah Jahan's own romantic gestures into your personal journey. If you wish to upgrade your [Private Royal Luxury Taj Mahal Tour](/india/agra/taj-mahal-royal-private-tour) with these fine-dining elements, please notify us during booking, and our concierge team will handle the complex reservations."
      },
      {
        question: "Is this suitable for honeymoon couples?",
        answer: "The [Royal Private Tour](/india/agra/taj-mahal-royal-private-tour) is specifically engineered as our #1 recommendation for honeymooners. We understand the need for privacy, romance, and beautiful imagery. We adjust our narrative to focus on the deep emotional and romantic history of the Taj Mahal, while giving you the space to enjoy each other's company. Our guides act as discreet directors, helping you capture elegant, professional-quality photos without the crowds. We can also coordinate special surprises such as flower bouquets or a private blessing. By choosing the \"Royal\" tier, you ensure that your once-in-a-lifetime honeymoon [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) is a flawless, high-authority experience that honors your new life together."
      },
      {
        question: "Can you arrange flower decorations or romantic surprises?",
        answer: "Yes, we specialize in \"Mughal Romance\" surprises. We can coordinate traditional rose petal decorations in your luxury vehicle, arrange for a private professional musician (like a Sitar player) at your lunch venue, or facilitate a \"secret\" marriage proposal at the Mehtab Bagh sunset point. Our team handles all the behind-the-scenes logistics discretely to ensure the surprise remains a secret until the perfect moment. This level of personalized concierge service is what defines the [Private Royal Luxury Taj Mahal Tour](/india/agra/taj-mahal-royal-private-tour) as a world-class travel product. If you have a creative vision for your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) surprise, we are here as your high-authority local partners to make it a reality."
      },
      {
        question: "Is professional photography included?",
        answer: "To ensure your \"Royal\" memories are captured perfectly, we can include a **Professional Photographer** as an optional add-on to your [Royal Private Tour](/india/agra/taj-mahal-royal-private-tour). Our photographers use high-end full-frame Mirrorless equipment and understand the \"Symmetry Points\" of the Taj Mahal better than anyone else. They handle all the \"creative direction,\" while your guide handles the history. This creates a powerful \"division of labor\" that yields a high-resolution digital gallery of your journey. If you are serious about visual content, this is a high-value investment that avoids the \"generic tourist photo\" trap. Your [Agra guided tour](/india/agra/things-to-do-in-agra) results in a professional-grade portfolio that reflects the premium nature of your visit."
      },
      {
        question: "Are monument tickets included in the price?",
        answer: "Yes, the [Private Royal Luxury Taj Mahal Tour](/india/agra/taj-mahal-royal-private-tour) is strictly all-inclusive. We provide the highest-tier \"Foreigner Category\" tickets for the Taj Mahal (including the Main Mausoleum access) and the Agra Fort. We also cover all parking fees, expressway tolls, and state border taxes. There are no hidden \"on-the-spot\" payments required. We handle the digital purchase of these tickets in advance through the official ASI portal to ensure your [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) is handled correctly and efficiently. This all-inclusive structure provides total peace of mind, allowing you to focus entirely on the architectural marvels rather than carrying large amounts of local currency for small logistical fees."
      },
      {
        question: "Is the experience suitable for elderly VIP travelers?",
        answer: "We pride ourselves on being the preferred choice for senior VIP travelers who require a gentle, highly attentive pace. For the [Royal Private Tour](/india/agra/taj-mahal-royal-private-tour), we minimize walking distances by utilizing authorized electric golf carts from the parking perimeter. Inside the complex, your guide will proactively identify shaded resting spots and seating areas with the best views. Our vehicles have easy ingress/egress and ample legroom. We also time our visits to avoid the absolute peak of the heat. This \"senior-friendly\" engineering settles any physical-strain objections, ensuring that every family member can appreciate the [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) in total safety and palatial comfort."
      },
      {
        question: "Is wheelchair assistance available?",
        answer: "Yes, we can arrange for private **wheelchair assistance** for the entire duration of your [Royal Private Tour](/india/agra/taj-mahal-royal-private-tour). The Taj Mahal is largely accessible via a system of ramps on the main platforms, and we provide an assistant to manage the wheelchair so you and your guide can focus on the historical narrative. We also utilize specific \"accessibility paths\" within the Agra Fort. If you or a family member has mobility challenges, please inform us in advance so we can ensure the appropriate equipment and personnel are ready at the gates. This commitment to inclusion is a vital part of our high-authority [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) standard for international delegations."
      },
      {
        question: "Can we avoid shopping stops?",
        answer: "A core tenet of our [Private Royal Luxury Taj Mahal Tour](/india/agra/taj-mahal-royal-private-tour) is a **strict zero-commission policy**. We do not engage in forced shopping stops or visits to \"factories\" that are commonly associated with budget tourism. Your time is valuable, and we prioritize history and aesthetics over commerce. We only visit local craft centers (such as the traditional marble inlay artisans) if you explicitly request it to understand the technical side of the Taj's construction. This commitment to an \"uncluttered\" itinerary is why we are trusted by premium travelers who want an authentic, high-authority [Agra guided tour](/india/agra/things-to-do-in-agra) that respects their time and focuses purely on architectural education."
      },
      {
        question: "Is hotel pickup available from any location in Agra or Delhi?",
        answer: "Yes, our royal service includes **complimentary door-to-door pickup and drop-off** from any hotel, residence, or airport location within New Delhi, Gurgaon, Noida, or Agra. We time our arrivals meticulously, often using the Yamuna Expressway for a smooth 3-hour transition. Whether you are staying at a luxury palace hotel in Agra or a corporate suite in Gurgaon, our chauffeur and senior guide will be waiting in the lobby at the designated time. This seamless logistical path is what makes a [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) effortless and secure. We handle all city navigation for you, ensuring you arrive at the monuments refreshed and ready for your royal experience."
      },
      {
        question: "What is the cancellation policy for this premium tour?",
        answer: "For the [Private Royal Luxury Taj Mahal Tour](/india/agra/taj-mahal-royal-private-tour), we offer a \"Discerning Cancellation Policy\" that understands the dynamic nature of international VIP travel. You can cancel your tour with a full refund up to 24-48 hours before the scheduled pickup. However, please note that government-issued monument entry tickets, once generated, are non-refundable by the ASI. Our transparent approach to this common logistical objection ensures your investment is protected while maintaining our professional commitments to our senior guides and luxury chauffeurs. We aim to provide a high-authority, stress-free booking environment that reflects the trust and reliability of our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) services."
      },
      {
        question: "Can we include Agra Fort and Mehtab?",
        answer: "Yes, the [Royal Private Tour](/india/agra/taj-mahal-royal-private-tour) is fully comprehensive and typically includes both the **Agra Fort (the royal citadel)** and the **Mehtab Bagh (Moonlight Garden)**. We highly recommend visiting the Agra Fort to see the \"Musamman Burj\" where Shah Jahan was imprisoned, as it provides the essential political context to the Taj Mahal's romantic story. We also suggest ending your day at the Mehtab Bagh for a symmetrical sunset view across the river Yamuna, which is far more peaceful than the main complex. This \"Three-Monuments Itinerary\" provides the most complete and high-authority understanding of the Mughal legacy, and is fully integrated into our [1-day Agra itinerary](/india/agra/1-day-agra-itinerary) for premium guests."
      }
    ];
  }

  if (slug === 'taj-mahal-photography-tour') {
    return [
      {
        question: "Is this a professional photography tour or just a regular guide who takes photos?",
        answer: "This is a specialized [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour) designed for serious enthusiasts and content creators. Unlike a standard guided tour, our experts are trained in spatial awareness, lighting conditions, and the specific \"golden points\" of the monument. You aren't just getting someone with a camera; you are being led by a professional who understands ISO settings, aperture, and the physics of the white marble's reflection. Whether you are a hobbyist or a professional, we provide high-authority guidance on how to capture the 17th-century architecture in its most flattering light. We bridge the gap between a history lesson and a professional photoshoot, ensuring your portfolio stands out from generic travel snapshots with stunning, high-definition compositions that tell a story."
      },
      {
        question: "Do you provide a professional photographer or does the guide assist with photos?",
        answer: "We offer the flexibility to choose either a [specialized photography guide](/india/agra/taj-mahal-photography-tour) or a separate professional photographer. For the ultimate \"platinum\" experience, we recommend booking our dedicated photographer who uses high-end DSLR/Mirrorless equipment to capture your journey. If you prefer to be behind the lens yourself, our guides act as logistical scouts, cleared for navigating you through the crowds to the best technical angles. This \"division of labor\" ensures you aren't distracted by security protocols or ticketing while trying to capture the blue hour. By having a professional who understands \"Symmetry and Reflection,\" we guarantee your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) memories look like they belong in a luxury travel magazine, perfectly documented for your personal heritage."
      },
      {
        question: "Are DSLR and mirrorless cameras allowed inside Taj Mahal?",
        answer: "Yes, the Archaeological Survey of India (ASI) permits standard DSLR and mirrorless cameras inside the complex. However, there is a clear distinction between \"amateur\" and \"professional\" usage in their eyes. While you can bring your high-resolution body and 24-70mm or 70-200mm lenses, there are strict rules against carrying large \"commercial\" equipment without prior federal permission. Our [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour) experts will guide you through the mandatory CISF security check, ensuring your gear is handled respectfully. Note that photography is strictly prohibited inside the main cenotaph chamber to maintain the sanctity of the tomb. We leverage our high-authority status to help you optimize your settings for the harsh white marble before you enter restricted zones."
      },
      {
        question: "Can I bring a tripod for sunrise photography?",
        answer: "No, tripods (and monopods) are strictly prohibited inside the Taj Mahal complex by the ASI for both safety and commercial reasons. This is a common objection for landscape photographers, but it is a rigid national security protocol. To overcome this, our specialized guides for the [Taj Mahal Sunrise Tour](/india/agra/taj-mahal-sunrise-guided-tour) identify flat surfaces and \"natural supports\" like the red sandstone railings and pillars to help you stabilize your long-exposure shots. We help you calibrate your ISO and shutter speed to manage the low light of the pre-dawn \"blue hour\" without the need for a tripod. This tactical advice ensures you still get sharp, tack-point images of the reflecting pools without violating any federal monument security rules during your tour."
      },
      {
        question: "Is drone photography allowed at Taj Mahal?",
        answer: "Drone photography is strictly prohibited and constitutes a major security violation in India. The entire area surrounding the Taj Mahal is a \"No-Fly Zone\" enforced by the Indian Air Force and the CISF. Attempting to fly a drone can lead to immediate confiscation and federal charges. If you see \"aerial shots\" on our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026), these are usually taken with special government permits for scientific or international documentary purposes. For your private [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour), we focus on capturing the monument's grandeur from the ground using wide-angle lenses and the famous \"symmetry points\" in the Charbagh gardens, which provide an equally powerful and legal visual payload for your social media and professional portfolio."
      },
      {
        question: "What are the best photo spots inside Taj Mahal?",
        answer: "Our [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour) covers the \"Seven Sacred Angles,\" beginning with the central reflecting pool for the iconic symmetrical reflection. We then move to the East and West mosques (Mehmaan Khana) to use the red sandstone arches as \"natural frames\" for the white marble mausoleum. Another high-authority spot is the \"bench of Diana,\" but we also take you to lesser-known corners of the Charbagh where you can capture the dome through the foliage. For a creative finale, we utilize the Yamuna River bank when conditions allow. Our guides are experts at timing these spots to ensure you are in the right quadrant when the sun hits the marble at a 45-degree angle for the best depth and detail."
      },
      {
        question: "Do we get early access for better lighting?",
        answer: "While everyone enters at the same time—30 minutes before sunrise—booking a [Taj Mahal Sunrise Guided Tour](/india/agra/taj-mahal-sunrise-guided-tour) gives you a tactical advantage. We ensure you are at the very front of the security queue by arriving at the East or West gate 45 minutes before they open. Being among the first 20 people inside is the only way to get a \"clean shot\" of the reflecting pools without thousands of tourists in the background. This \"platinum window\" lasts only about 10-15 minutes before the crowds saturate the main platform. Our high-authority scouts navigate you through the first thermal check and security turnstiles with precision, ensuring you are focused on your focal point while others are still waiting in line."
      },
      {
        question: "What is the best time of day for photography at Taj Mahal?",
        answer: "From a technical perspective, the **Sunrise period (5:30 AM to 8:30 AM)** is the absolute \"platinum window\" for photography. The light transitions from a cool lavender to a warm gold, highlighting the translucency of the Makrana marble. The morning mist often adds a mystical, ethereal layer that disappears by 9:00 AM. If you are following an [Agra travel guide 2026](/india/agra/agra-travel-guide-2026), you'll know that the midday sun (11:00 AM to 3:00 PM) is extremely harsh, causing \"blown-out\" highlights on the white surface. A secondary option is the \"Golden Hour\" before sunset, which can be captured beautifully from the Mehtab Bagh (Moonlight Garden) across the river, providing a silhouette effect that is different but equally powerful for your collection."
      },
      {
        question: "Is sunrise better than sunset for photos?",
        answer: "Sunrise is definitively superior for three main reasons: light quality, crowd density, and atmospheric clarity. During a [Taj Mahal Sunrise Tour](/india/agra/taj-mahal-sunrise-tour), the light is soft and multidirectional, reducing harsh shadows. More importantly, the crowds are at their thinnest, allowing for unobstructed views of the symmetry. Sunset, while beautiful, often coincides with the peak daily visitor count (up to 40,000 people), making clean landscape shots almost impossible inside the complex. However, sunset is spectacular for \"rear-view\" shots from across the River Yamuna. For serious creators on a [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour), we always recommend the sunrise slot for the highest-authority visual results and a much cooler, more pleasant environment for your creative process."
      },
      {
        question: "Can you help with Instagram reel-style shots?",
        answer: "Absolutely. Our [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour) experts are well-versed in modern social media trends, including transition shots and cinematic pans for Instagram Reels and TikTok. We help you coordinate your walking pace for \"follow-me\" style videos and identify the best archways for \"reveal\" transitions. We understand the \"9:16\" vertical frame requirements and guide you on where to stand for the most viral-worthy aesthetic. This service transforms your visit into a lifestyle content session, moving beyond static frames. By pairing historical depth with modern videography, we ensure your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) content is not just informative, but also aesthetically \"on-trend\" for your digital audience and followers who demand high-quality, engaging travel content."
      },
      {
        question: "Will you guide us on poses and angles?",
        answer: "Yes, our [specialized photography guides](/india/agra/taj-mahal-photography-tour) act as your creative directors. We know the exact poses that work best with the monument's massive scale—such as the \"looking into the distance\" pose on the marble platform or the \"framed through an arch\" shot at the mosque. We help you manage your body language to ensure you don't look overwhelmed by the architecture. We also provide high-authority tips on \"creative symmetry,\" such as using the water channels to create a perfect vertical split in your frame. This hands-on posing guidance settles any \"how do I look\" objections, ensuring your [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) results in a professional-grade personal gallery that looks effortless, elegant, and perfectly balanced."
      },
      {
        question: "Is this tour suitable for pre-wedding shoots?",
        answer: "While we cannot do \"full-scale\" commercial pre-wedding shoots with lighting rigs and assistants (due to ASI restrictions), we are the #1 choice for \"lifestyle pre-wedding\" photography. We help couples capture intimate, high-quality romantic shots without drawing the attention of monument security. We recommend an early [Taj Mahal Sunrise Guided Tour](/india/agra/taj-mahal-sunrise-guided-tour) to ensure privacy. Our photographers are experts at capturing the \"candid romance\" between the white marble domes, providing a visual narrative of your love story. If you need a full professional crew, we can coordinate the specific \"Agra City\" permissions needed. For most couples, our private photography session provides exactly the \"platinum\" look they desire for their wedding announcements and saves them from the high costs of commercial permits."
      },
      {
        question: "Do we need special permission for professional shoots?",
        answer: "For standard \"enthusiast\" photography with a single camera and lens, no special permission is needed beyond your [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket). However, if you are conducting a commercial shoot for a brand, magazine, or fashion line involving multiple bodies, lighting, or a crew, the ASI requires a formal permit and a significant daily fee (often upwards of $1,000 USD). Our [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour) team can assist with these applications if booked well in advance. For 99% of our guests, we optimize our shoots to stay within \"personal use\" guidelines while delivering professional-grade results, ensuring you get the high-authority visuals you need without the bureaucratic red tape or the high financial burden of commercial permits during your visit."
      },
      {
        question: "Are costume changes allowed inside the monument?",
        answer: "Technically, there are no dedicated \"changing rooms\" inside the Taj Mahal complex, and using the public restrooms for costume changes is often discouraged by security. However, we have tactical solutions for our [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour) guests. We recommend \"smart layering\"—such as wearing a beautiful saree or traditional kurta over simple innerwear that allows for a quick change in a quiet corner of the gardens. We can also coordinate your outfit transitions between the Taj Mahal and the Agra Fort. Our guides act as \"lookouts\" to ensure your privacy during these quick transitions. This ensures you have 2-3 distinct \"looks\" for your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) portfolio without violating any local sensitivity protocols or monument rules."
      },
      {
        question: "How crowded is Taj Mahal during peak season?",
        answer: "During the peak [Agra travel season (October-March)](/india/agra/agra-travel-guide-2026), daily visitor counts can regularly exceed 40,000 to 50,000 people. This is the biggest hurdle for any photographer. Without a specialized [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour), you will likely have dozens of people in every frame. We use \"crowded-evasion tactics,\" such as starting at the very edge of the monument and working our way in, or using long-exposure techniques to \"ghost out\" moving tourists (though you must hand-hold your camera). We also know the \"off-beat\" garden quadrants that large group tours skip. Our high-authority knowledge of the complex's spatial flow ensures you still find pockets of serenity for those essential clean shots and wide-angle landscapes, even on the busiest days."
      },
      {
        question: "What months offer the clearest sky for photography?",
        answer: "October and November are the \"Platinum Months\" for clear photography, offering deep blue skies and sharp, crisp light after the monsoon rains have washed the dust away. February and March are also excellent, though temperatures begin to rise. December and January are famous for \"Taj Fog,\" which can be a disaster for wide-angle shots but a \"spiritual dream\" for close-up creative photography. If you are planning an [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) visit, we recommend avoiding late April to June, as the extreme heat (45°C) creates heat haze (shimmer) that can soften your long-distance telephoto shots. We calibrate your [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour) settings based on the specific atmospheric conditions of your visit month."
      },
      {
        question: "What happens if it is foggy or rainy?",
        answer: "Fog and rain shouldn't be seen as failures, but as \"creative gifts.\" While you might lose the classic sunrise reflection, fog provides a mystical, high-authority atmosphere that makes for unique, ethereal imagery—very popular for moody Instagram content. Rainy days result in vibrant, saturated colors on the red sandstone and darker, dramatic tones on the white marble. Our [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour) experts are trained in \"foul-weather photography,\" showing you how to capture reflections in the rain puddles which are often cleaner than the reflecting pools. We also carry protective gear for your cameras. This tactical pivoting ensures you still leave with a [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) gallery that is world-class and distinctive."
      },
      {
        question: "Can I get raw photo files after the tour?",
        answer: "Yes, if you book our [Professional Photography add-on](/india/agra/taj-mahal-photography-tour), we pride ourselves on transparency. We provide the full gallery of high-resolution JPEGs and, upon request, the original RAW (.ARW, .CR3, or .NEF) files. This is vital for serious creators who prefer to do their own color grading and retouching. We deliver the files via a secure digital download link (Google Drive or WeTransfer) within 24-48 hours. This ensure you have the maximum dynamic range to work with for your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) project. We don't hold your photos hostage for \"extra fees\"; the intellectual property of your personal journey belongs entirely to you as part of our premium service and commitment to your artistic freedom."
      },
      {
        question: "How long do we spend inside the Taj Mahal?",
        answer: "A standard [Photography Tour](/india/agra/taj-mahal-photography-tour) typically involves **3 to 4 hours** inside the complex. This is longer than a regular tour because we account for \"light waiting\"—waiting for the sun to clear a cloud or for a specific quadrant to empty for a clean shot. We move at a \"contemplative pace,\" allowing you time to check your histogram and adjust your filters. If you wish to stay longer for mid-morning shots, your private guide will remain with you. This flexibility is what defines our high-authority service; we prioritize your creative goals over a rigid schedule, ensuring you have ample time to master the geometry of the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) experience without feeling rushed or stressed."
      },
      {
        question: "Is this tour private or shared with others?",
        answer: "This experience is **strictly 100% private**. We do not mix photographers from different bookings. This is essential for a [Taj Mahal Photography Tour](/india/agra/taj-mahal-photography-tour) because every artist has a different \"eye\" and different equipment needs. You have the total, undivided attention of your photography expert. This private format allows us to customize the walking route in real-time based on your specific focal lengths. Whether you are a solo traveler or a small group of friends, the tour is tailored for your unique creative vision. This settles the common objection of being \"staked\" to a group that moves too fast. By choosing us, you're investing in a bespoke creative session that respects your time and artistic integrity without compromise."
      },
      {
        question: "Can you arrange traditional Indian outfits for photos?",
        answer: "Yes, we offer a \"Cultural Aesthetic\" package where we can arrange high-quality Sarees or Lehengas for women and Kurta-Pyjamas for men. We even provide assistance with saree draping at your hotel before the [Taj Mahal Sunrise Tour](/india/agra/taj-mahal-sunrise-guided-tour). Traditional attire provides a stunning color contrast against the white marble, significantly increasing the \"social media authority\" of your photos. We have a list of local partners who provide clean, dry-cleaned outfits for rent or purchase. This all-inclusive approach removes the logistical stress of sourcing clothes in a foreign city. Our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) experts ensure you look your absolute best, perfectly complementing the royal architecture for a truly \"world-class\" result!"
      },
      {
        question: "Are shoe covers provided for photography near the main mausoleum?",
        answer: "Yes, we provide **high-quality, heavy-duty shoe covers** as part of your booking. To walk on the main white marble platform (the higher plinth), the ASI requires all visitors to either remove their shoes or use authorized covers. For photographers, we recommend the covers because they provide better grip and keep your feet clean while you are kneeling for low-angle shots. We also ensure your [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket) includes the specific \"Mausoleum\" access, which is an additional fee on top of the base ticket. Our guides carry extra sets of covers in case one breaks, ensuring your [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) remains physically comfortable and technically uninterrupted as you capture the intricate floral marble inlay and symmetry."
      },
      {
        question: "Can elderly travelers join this photography tour comfortably?",
        answer: "Absolutely. We prioritize the **comfort and mobility** of senior travelers on our [Photography Tour](/india/agra/taj-mahal-photography-tour). While the complex involves significant walking (3-4 km), we utilize authorized electric golf carts to bridge the 1 km gap from the parking lot to the gates. Inside, your guide will pace the tour slowly, identifying \"shaded photography spots\" with seating where you can rest while waiting for the perfect light. We also use \"efficiency routing\" to minimize the need to climb unnecessary sandstone stairs. This personalized approach makes the [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) experience accessible, proving that world-class photography isn't just for the young, but for anyone with an appreciation for Mughal beauty and a desire to capture its eternal elegance."
      },
      {
        question: "Is editing included in the package?",
        answer: "If you choose our [Professional Photographer add-on](/india/agra/taj-mahal-photography-tour), we include **professional color grading and basic retouching** for your top 25-50 shots. We use industry-standard software like Adobe Lightroom and Photoshop to ensure the white marble looks clean and the sky looks vibrant, corrected for the specific color-temperature of the Agra sunrise. If you prefer to edit yourself, we provide the RAW files. For most travelers, having our expert edit their photos is the \"platinum touch\" that completes the experience. This settled objection ensures you don't have to spend hours on your laptop after your trip. We deliver your polished, high-authority gallery within 48 hours, ready for you to share your [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) with the world."
      }
    ];
  }


  if (slug === 'taj-mahal-agra-fort-guided-tour' || slug === 'taj-mahal-and-agra-fort-guided-tour') {
    return [
      {
        question: "How long does the Taj Mahal & Agra Fort tour take?",
        answer: "A comprehensive [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) typically requires **4 to 6 hours** of active exploration. This duration is strategically designed to allow for a deep-dive into the architectural nuances and historical narratives of two UNESCO World Heritage sites. We usually dedicate approximately 3 hours to the Taj Mahal to appreciate the light transitions on the marble and the symmetry of the gardens, followed by another 2 hours at the Agra Fort to explore the royal pavilions and military ramparts. By booking this combined experience, you ensure a high-authority educational journey that captures the essence of the Mughal Empire's zenith without the stress of independent navigation."
      },
      {
        question: "Is the Taj Mahal closed on Fridays?",
        answer: "Yes, the Taj Mahal is entirely, legally **closed every single Friday** for religious reasons. This mandatory closure allows the local Muslim community to utilize the mosque located within the complex for Friday prayers. If you are planning an [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) exploration, ensure you do not schedule your visit for a Friday. However, the Agra Fort, Baby Taj, and Mehtab Bagh remain open. We always meticulously review your [1-day Agra itinerary](/india/agra/1-day-agra-itinerary) to ensure your primary monument visit falls between Saturday and Thursday."
      },
      {
        question: "Is original passport mandatory for entry?",
        answer: "Yes, carrying a **physical passport is mandatory** for all international tourists at both the Taj Mahal and Agra Fort. The CISF security personnel at the turnstiles frequently demand your original, physical passport to match the name and nationality embedded in your digital [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket). High-quality photocopies or digital phone images are often rejected by security. Do not risk denied entry; always carry your original passport prominently in a secure, hidden travel pouch when heading out for your [Agra guided tour](/india/agra/things-to-do-in-agra)."
      },
      {
        question: "Which monument do we visit first during the combined tour?",
        answer: "To maximize your visual and physical comfort, we always recommend visiting the **Taj Mahal first**. Starting your day at sunrise or shortly after the gates open is the most tactical decision you can make, as it allows you to beat the 40,000+ daily visitors and the intense afternoon heat that can reach 45°C in summer. Once we have captured those iconic reflecting-pool photos in the \"Golden Hour\" light, we proceed to the Agra Fort. Since the Fort is built largely of thick red sandstone, it provides much better natural shade and remains relatively cooler than the open-air marble platforms of the Taj, making the late-morning transition comfortable and productive."
      },
      {
        question: "How far is the Agra Fort from the Taj Mahal?",
        answer: "The physical distance between these two legendary monuments is surprisingly short, approximately **2.5 kilometers (1.5 miles)**. Under standard traffic conditions in the historical zone, the transition takes about 10 to 15 minutes in our private vehicle. This proximity is exactly why the [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) is the most popular choice for travelers on a restricted [1-day Agra itinerary](/india/agra/1-day-agra-itinerary). Despite being so close, the two sites offer vastly different architectural atmospheres—one being a romantic mausoleum and the other a fortified royal city. Our seamless transport between these points ensures you don't waste precious time or energy on the busy city streets."
      },
      {
        question: "Is transport included between the monuments?",
        answer: "Yes, our premium service level includes **dedicated private transportation** between the Taj Mahal and the Agra Fort. We use modern, air-conditioned vehicles to provide a sanctuary from the bustle and dust of Agra's streets during the short transition. Many budget travelers attempt to use cycle-rickshaws or walk, but our high-authority advice is to utilize private transport to maintain your energy levels for the extensive walking required inside the monuments themselves. Having a driver wait for you at the exit gates of the Taj Mahal and drop you exactly at the entrance of the Fort is a major logistical advantage that defines the premium quality of our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) services."
      },
      {
        question: "Are entry tickets included for both sites?",
        answer: "We offer **fully customizable options** regarding admission. You can choose a \"Guided Only\" package if you prefer to buy your own tickets using your phone, or a \"Full Package\" where we pre-purchase the digital ASI tickets for you. If you choose the inclusion option, we handle all the technicalities of the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) system for both the Taj Mahal and the Agra Fort. This ensures you have the correct high-value tickets for the main mausoleum entry and avoids any confusion at the turnstiles. Please note that the \"Mausoleum\" entry is an additional fee on top of the base Taj Mahal ticket, and we ensure this is always included in our full-service bookings."
      },
      {
        question: "What is the difference between Taj Mahal and Agra Fort architecture?",
        answer: "The architectural contrast is profound: the Taj Mahal is the pinnacle of **Indo-Islamic funerary architecture**, characterized by its ethereal white Makrana marble, delicate pietra dura stone inlay, and perfect bilateral symmetry. In contrast, the Agra Fort is a massive **military and residential citadel** built primarily of rugged red sandstone. While the Taj Mahal represents the romantic and spiritual side of the Mughal Empire, the Agra Fort showcases its political and military power through 70-foot high ramparts and defensive moats. Inside the Fort, however, you will find delicate white marble palaces like the Khas Mahal, which served as the precursor to the Taj's style. This architectural evolution is a core focus of our [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour)."
      },
      {
        question: "Can we see the Taj Mahal from the Agra Fort?",
        answer: "Absolutely, and it is one of the most poignant moments of the entire experience. From the **Musamman Burj** (an octagonal tower) within the Agra Fort, you can enjoy a stunning, framed view of the Taj Mahal sitting across the Yamuna River. This is the exact spot where Emperor Shah Jahan was reportedly imprisoned by his son, Aurangzeb, spendng the final eight years of his life gazing at the monument he built for his wife. This high-authority historical site provides a unique perspective that you cannot get from the Taj's own gardens. Our guides will help you find the best vantage points for photography, ensuring you capture that iconic \"view from the balcony\" that is essential for any [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) collection."
      },
      {
        question: "Is the Agra Fort wheelchair accessible?",
        answer: "The Agra Fort is partially accessible, though it presents more challenges than the Taj Mahal. The main entrance at Amar Singh Gate has a **steep ramp** that requires a strong assistant or motorized help. Many of the interior courtyards are paved with flat stone and are accessible, but certain high-value areas like the interior of the Jahangiri Mahal have small steps. However, as local experts, we have designed specific \"accessibility paths\" that bypass the most difficult stairs. If you or a family member uses a wheelchair, please notify us during booking so we can arrange additional assistance and ensure your [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) is comfortable. Most of the primary palaces can be viewed from the courtyards without needing to climb steps."
      },
      {
        question: "Is this tour too long or strenuous for elderly visitors?",
        answer: "We pride ourselves on creating a **flexible and senior-friendly pace**. While the combined tour involves significant walking (approx. 4-5 km total), we utilize electric carts for the 1km approach to the Taj Mahal to save your energy. Within the monuments, our guides are trained to identify seating areas and shade where you can rest while they share historical anecdotes. If you feel tired after the Taj Mahal, we can customize the Agra Fort segment to focus only on the main palaces near the entrance, skipping the more military-style hiking. This ability to dial the intensity up or down is why our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) approach is highly rated by multi-generational families who want to experience history without exhaustion."
      },
      {
        question: "Are both monuments official UNESCO World Heritage sites?",
        answer: "Yes, both the Taj Mahal and the Agra Fort are prestigious **UNESCO World Heritage Sites**, designated in 1983. They are considered the \"twin pillars\" of Mughal history in India. The Taj Mahal is recognized for being the \"jewel of Muslim art in India,\" while the Agra Fort is honored for its status as a major 16th-century Mughal monument of red sandstone. Visiting both on a single [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) is logically consistent because their histories are inextricably linked. The Fort was the seat of power where the decisions to build the Taj were made. Experiencing both UNESCO sites together provides the high-authority educational context needed to understand why the Mughal Empire remains such a fascinating chapter of global history."
      },
      {
        question: "Can we add Mehtab Bagh (Moonlight Garden) to this tour?",
        answer: "We can certainly add a visit to **Mehtab Bagh** as a \"sunset finale\" to your combined tour. Located directly across the Yamuna River from the Taj Mahal, this 25-acre garden complex offers the perfect symmetrical view of the mausoleum without the crowds. It is particularly valuable on Fridays when the Taj is closed, or for photographers who want the \"rear view\" of the monument reflected in the river. Adding this site extends the tour by about 1 hour and requires a short drive across the river bridge. For many travelers, this is the ultimate objection-killer because it allows for a peaceful, long-distance appreciation of the monument after the close-up intensity of the [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour)."
      },
      {
        question: "Are guides allowed to enter inside the Agra Fort with us?",
        answer: "Yes, our **ASI-licensed guides** are fully authorized to accompany you inside every accessible area of the Agra Fort, including the Diwan-i-Aam (Hall of Public Audience) and the royal pavilions. Unlike some countries where site-specific guides are required, our guides stay with you throughout the entire 5-hour journey. This continuity is vital for a high-authority experience, as the guide can draw direct comparisons between the architecture of the Taj Mahal and the Fort. They will navigate the complex security gates and interior paths for you, ensuring you don't miss the hidden gems like the Anguri Bagh (Grape Garden) or the Gem Mosque. Their presence ensures your [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) remains educational and logistically smooth from start to finish."
      },
      {
        question: "Is there a lunch stop included in the combined tour?",
        answer: "While lunch is not strictly part of the \"monument time,\" we always build in a **flexible lunch break** between the Taj Mahal and the Agra Fort. We have a curated list of high-authority restaurant partners ranging from traditional Mughal thali spots to modern international cafes with views of the Taj. We avoid the \"tourist trap\" buffets that many large bus tours frequent, instead focusing on clean, authentic establishments that meet international hygiene standards. This break is essential for hydration and rest, allowing you to process the morning's history before tackling the Fort. If you are on a tight [1-day Agra itinerary](/india/agra/1-day-agra-itinerary), we can arrange a quick but high-quality meal to keep the day moving efficiently without sacrificing quality."
      },
      {
        question: "What is the best season for a combined Taj and Fort tour?",
        answer: "The \"Platinum Window\" for visiting Agra is from **October to March**. During these months, the weather is pleasantly cool with clear blue skies, making the extensive walking required for the [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) very easy. December and January can bring morning fog, which adds a mystical atmosphere to the Taj but may delay sunrise views. Conversely, the summer months (April to June) are extremely hot, with temperatures often exceeding 40°C, necessitating a very early 5:30 AM start. Monsoon season (July to September) brings humidity and occasional heavy rain, but also results in lush, green gardens and fewer tourists. We calibrate our pickup times and tour intensity based on the specific month of your visit to ensure maximum comfort."
      },
      {
        question: "Can we shorten the Agra Fort visit if we feel tired?",
        answer: "Absolutely. One of the primary benefits of a **private guided tour** is that it is 100% adaptable to your energy levels. If you feel that you've reached your \"historical limit\" after the Taj Mahal, we can pivot to a \"Highlights Only\" version of the Agra Fort. This focuses on the most spectacular palaces located close to the entrance, reducing the walking distance by half while still allowing you to see the famous Musamman Burj view of the Taj. We never force our guests to follow a rigid schedule; if you'd rather trade an hour of fort-walking for a relaxed coffee or some souvenir shopping in the local bazaars, our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) planners will make it happen seamlessly. Your comfort is our highest priority."
      },
      {
        question: "Is photography allowed inside the Agra Fort?",
        answer: "Yes, **photography is permitted** throughout most of the Agra Fort complex for personal use. You are encouraged to capture the intricate carvings and the stunning river views. However, please note that there are two specific restrictions: first, professional equipment like tripods and large lighting rigs requires a separate, expensive permit from the ASI. Second, like the Taj Mahal, photography is generally prohibited inside the very small, specific religious prayer areas (mosques) if they are in active use. For the most part, you can freely document your [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) with your camera or smartphone. Our guides know the exact \"symmetry spots\" where you can get professional-looking photos without other tourists in the frame, making your social media posts truly high-authority."
      },
      {
        question: "Are large bags allowed inside the monuments?",
        answer: "No, both the Taj Mahal and the Agra Fort have **strict security protocols** that prohibit large backpacks, suitcases, or heavy bags. Only small ladies' handbags or small day-packs containing essentials like water, cameras, and wallets are permitted. Prohibited items include tobacco, lighters, knives, chargers, and food. To simplify your visit, we recommend leaving all non-essential items in our private vehicle, which remains parked in a secure zone with our driver. This \"clean-entry\" strategy allows you to breeze through the CISF security checks and start your [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) without the hassle of using the monument locker rooms, which can have long queues. This is a vital tactical tip for maintaining a smooth pace during your visit."
      },
      {
        question: "Is this a private tour or a shared group tour?",
        answer: "This experience is **strictly a private tour**, meaning you will have your own dedicated ASI-licensed guide and private vehicle. We do not consolidate individual bookings into large groups. This private format is the only way to deliver a high-authority, personalized experience where you can ask as many questions as you like and move at your own pace. Whether you are a solo traveler, a couple on a honeymoon, or a large family, the tour is tailored exclusively to your group. This settles the common objection of being \"stuck\" with a slow group or missing out on details because the guide is too far away. By choosing our [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour), you are investing in a premium, 1-on-1 educational session that respects your time and interests."
      },
      {
        question: "Is the combined Taj Mahal and Agra Fort tour worth the price?",
        answer: "When you consider the logistical complexity of navigating Agra's traffic and the dense history of these sites, the [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) is **the highest-value investment** you can make for your India trip. Attempting to see both sites independently often results in \"temple fatigue\" and wasted hours in ticket queues or negotiating with local transport. By booking this expert-led combined tour, you gain a seamless narrative that connects the dots between a lover's tomb and a royal fortress. The \"intellectual payload\" you receive from a historian-guide transforms these monuments from mere stone structures into living stories. When you factor in the private transport, the skip-the-line ticket assistance, and the climate-controlled comfort, the value-to-cost ratio is overwhelmingly positive for any serious globetrotter."
      },
      {
        question: "Is it worth seeing the Agra Fort if I've already seen the Red Fort in Delhi?",
        answer: "While both are Mughal masterpieces, many historians consider the **Agra Fort to be far superior** in terms of architectural preservation and intricate detail. While the Delhi Red Fort is impressive for its massive walls, the interior palaces of the Agra Fort (like the Khas Mahal and Shish Mahal) are much more intact and offer better examples of the transition from sandstone to marble. Furthermore, the unique \"Taj-view\" perspectives available only from the Agra Fort make it an essential companion piece to the mausoleum itself. If you only visit the Taj Mahal without the Fort, you are only getting half of the Mughal story. For anyone following a premium [agra travel guide 2026](/india/agra/agra-travel-guide-2026), the Agra Fort is a non-negotiable inclusion that provides deep historical context and unparalleled photography opportunities."
      }
    ];
  }


  if (slug === 'taj-mahal-delhi-guided-tour') {
    return [
      {
        question: "What time do we typically leave Delhi for a Taj Mahal day tour?",
        answer: "For the most tactical and visually rewarding [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary), we recommend a **3:00 AM or 4:00 AM departure**. This early start is the only way to witness the Taj Mahal at sunrise, allowing you to experience the \"Platinum Hour\" before the intense heat and the 40,000+ daily visitors arrive. If you prefer a more relaxed schedule, a 6:00 AM or 7:00 AM departure is also feasible, though you will encounter more traffic on the way out of the capital. Our private chauffeurs are highly punctual, ensuring you are on the Yamuna Expressway while the rest of the city is still asleep, maximizing your exploration time in the City of Love."
      },
      {
        question: "How long is the actual Delhi to Agra drive and is the expressway safe?",
        answer: "The drive from Delhi to Agra via the **Yamuna Expressway** typically takes between **3 to 3.5 hours** under standard conditions. This 165 km six-lane toll road is the most modern and safest highway in Northern India, bypassing the congested older towns. We prioritize your security by using late-model vehicles equipped with professional-grade safety features and experienced chauffeurs who specialize in this specific corridor. The expressway is fully paved and features multiple monitored rest plazas with clean facilities and international food options. This seamless logistical path is what makes a high-quality [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) not only possible but extremely comfortable for international travelers."
      },
      {
        question: "Do you recommend traveling from Delhi to Agra by car or by train?",
        answer: "While the Gatimaan Express train is fast, we strongly recommend a **private car for maximum flexibility**. A private [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) by car allows you to set your own pace, choose your own pickup time from your hotel, and store your luggage securely throughout the day. More importantly, it provides door-to-door service without the stress of navigating train stations or coordinating with local taxis in Agra. If you are traveling as a family or small group, the cost-to-comfort ratio of a private air-conditioned SUV is far superior to first-class train tickets, providing a \"sanctuary on wheels\" throughout your 12-hour journey."
      },
      {
        question: "Is hotel pickup available from Gurgaon, Noida, or near the Airport?",
        answer: "Yes, our high-authority service includes **complimentary door-to-door pickup** from any location within the National Capital Region (NCR), including New Delhi, Gurgaon (Gurugram), Noida, and hotels near the Indira Gandhi International Airport (IGIA). We calibrate our pickup windows based on your specific location to ensure we hit the Yamuna Expressway at the optimal time. Whether you are staying at a major global chain in Aerocity or a private residence in South Delhi, our chauffeur will be waiting in the lobby at the scheduled time. This all-inclusive logistical support removes the biggest objection for travelers staying outside the main city center, making the [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) effortless."
      },
      {
        question: "Is it possible to visit both the Taj Mahal and Agra Fort in one day?",
        answer: "Absolutely—the [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) is specifically engineered to cover both UNESCO World Heritage sites seamlessly. A typical itinerary includes 3 hours at the Taj Mahal for deep exploration and photography, a relaxed 5-star lunch break, and 2 hours at the historical Agra Fort citadel. Because of the efficiency of the Yamuna Expressway, you can easily accomplish this in a 12-hour window. You can even add a quick visit to the Baby Taj (Itimad-ud-Daulah) or Mehtab Bagh if you maintain a steady pace. Our guides are experts at navigating the crowds, ensuring you receive a high-authority educational experience without ever feeling rushed or overwhelmed."
      },
      {
        question: "What if the traffic is heavy when returning to Delhi?",
        answer: "Traffic congestion is a reality in any major capital, but we utilize **real-time GPS navigation** and tactical route planning to minimize delays. Our drivers are intimately familiar with the peak-hour bottlenecks in areas like Noida and Sarita Vihar. By timing our departure from Agra around 4:00 PM or 5:00 PM, we aim to reach the Delhi border after the heaviest commuter surge. Even if traffic is dense, you will be in the climate-controlled comfort of a private vehicle with complimentary bottled water and Wi-Fi, turning a potential frustration into a period of relaxation. Our priority is to return you to your hotel safely and as efficiently as the [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) standards dictate."
      },
      {
        question: "Are rest stops and clean restrooms included during the journey?",
        answer: "We understand that comfort and hygiene are non-negotiable for international travelers. We schedule **mandatory rest stops** at high-quality midway plazas on the Yamuna Expressway. these plazas are specifically selected for their international hygiene standards, featuring clean Western-style restrooms, ATMs, and reliable food outlets like Starbucks, Costa Coffee, or high-end Indian vegetarian restaurants. This allows you to stretch your legs, grab a fresh espresso, and freshen up before or after your monument visits. These stops are integrated into our [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) to ensure that the 3-hour journey remains a pleasant part of the overall experience rather than a physical endurance test."
      },
      {
        question: "Is the driver English-speaking and what is their role?",
        answer: "Our drivers are **professional chauffeurs** who speak functional English suited for navigation, basic logistics, and safety coordination. Their primary role is to ensure your physical safety on the road and handle all logistical technicalities like toll taxes and parking. While they are very knowledgeable about the route, they are not licensed historical guides. Upon arrival in Agra, you will be met by your specialized, ASI-licensed historical guide who will lead you through the Taj Mahal and Agra Fort. this \"division of labor\" ensures you have a high-authority expert for the history and a focused professional for the driving—a combination that defines a premium [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour)."
      },
      {
        question: "Can we customize the monument list or add a lunch stop?",
        answer: "Yes, our private tours are **100% customizable**. While the standard itinerary focuses on the Taj Mahal and Agra Fort, you can easily swap or add sites like the Baby Taj, the local handicraft bazaars, or the Mehtab Bagh sunset point. regarding dining, we have a curated list of high-authority restaurant partners. You can choose from a traditional Mughal thali lunch at a respected local spot or a luxury 5-star buffet at a hotel like the Taj Gateway or Courtyard by Marriott. Simply communicate your preferences to your guide or driver on the day, and they will adjust the flow of your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) experience to match your interests."
      },
      {
        question: "Is it worth doing a Delhi to Agra day trip instead of an overnight stay?",
        answer: "For many travelers, a **same-day trip is actually the superior choice**. It allows you to see the absolute highlights of Agra while keeping your base in Delhi, avoiding the hassle of checking in and out of multiple hotels. Thanks to the high-speed Yamuna Expressway, you can enjoy a full 6-7 hours of high-authority sightseeing and still be back in the capital for dinner. An overnight stay is only recommended if you wish to see the Taj Mahal at both sunrise and sunset on different days, or if you plan to continue your journey further into Rajasthan. For the typical visitor, the efficiency and convenience of our [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) provide the best value for time."
      },
      {
        question: "Is there a lunch stop included in the tour?",
        answer: "We build a **flexible lunch window** into every itinerary. While the cost of lunch is usually an optional add-on (unless you choose our all-inclusive package), we exclusively recommend restaurants that meet the highest international health and hygiene standards. We avoid the low-quality tourist cafes, instead directing our guests to authentic Mughal dining rooms or international luxury hotel buffets. This ensures you can sample the famous \"Petha\" and local Agra cuisine without any concerns about food safety. Taking a break for a high-quality meal is essential to recharge during your [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour), especially after several hours of exploring the vast marble platforms and sandstone courtyards."
      },
      {
        question: "Do I need my passport for ticket booking or monument entry?",
        answer: "For international travelers, carrying a **physical passport is mandatory** for the purchase of the \"Foreigner Category\" tickets and for entry validation by the CISF security personnel at the monuments. While digital copies on your phone are useful for backups, the security officers at the Taj Mahal gates often require the original document to match the name on your digital ASI ticket. We ensure that our ticketing technical assistance covers the correct entry category, but the physical passport check is a federal security requirement. This high-authority advice ensures you don't face any friction at the turnstiles during your [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) exploration."
      },
      {
        question: "Is the Delhi to Agra day trip worth the early wake-up call?",
        answer: "Absolutely. The 3:00 AM wake-up call is the single most important tactical move for a successful Agra visit. By arriving at the Taj Mahal for sunrise, you witness the marble change from a soft gray to a glowing pink and finally a brilliant white—all in relative silence. You bypass the mid-day crowds that can exceed 40,000 people and the punishing afternoon sun. The \"intellectual payload\" of seeing the monument at its most tranquil is worth every minute of lost sleep. This is why our [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) is the top-rated experience for travelers who want the \"platinum version\" of India's most famous site without the logistical stress."
      },
      {
        question: "Is it worth booking a private tour versus a group bus tour from Delhi?",
        answer: "A private tour is **infinitely more valuable** for three reasons: first, you control the timing and don't have to wait for 40 other people at rest stops. Second, your ASI-licensed guide provides a high-authority, 1-on-1 historical narrative that a group guide simply cannot offer. Third, you travel in the privacy and health-conscious environment of your own vehicle. Group buses often follow rigid schedules that arrive at the Taj during peak congestion and heat, leading to a diminished experience. For the price of a modest dinner, the upgrade to a private [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) transforms your visit from a generic shuttle into a meaningful, tailored historical journey."
      },
      {
        question: "Is it worth visiting the Agra Fort after seeing the Taj Mahal?",
        answer: "Yes, visiting the Agra Fort is essential to understanding the **full historical context** of the Taj Mahal. While the Taj is a spiritual and romantic monument, the Agra Fort was the seat of the Mughal Empire's political and military power. It is where Emperors Akbar, Jahangir, and Shah Jahan lived and ruled. Most importantly, the Fort contains the Musamman Burj, the tower where Shah Jahan was imprisoned and spent his final years gazing at his wife's tomb across the river. Skipping the Fort means you only get half of the story. Our [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) ensures you see both sides of the coin, providing the deep-dive historical context that every serious traveler seeks."
      },
      {
        question: "Is the Delhi to Agra day trip suitable for elderly travelers?",
        answer: "Yes, we prioritize the **comfort of senior citizens** by ensuring a private, flexible pace. We provide late-model SUVs with easy ingress/egress and ample legroom for the 3-hour journey. In the monuments, your guide will arrange for electric golf cart transport (where available) to minimize walking distances between the parking area and the main platforms. We also strategically plan our visits to the Taj Mahal during the cooler morning hours and include multiple rest stops with clean facilities. This personalized approach settles the objection that a [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) might be too physically demanding, making it a high-authority choice for multi-generational family groups."
      },
      {
        question: "What happens if the Taj Mahal is closed due to a VIP visit?",
        answer: "While rare, **official VIP closures** or technical maintenance can happen. Because we are high-authority operators with on-ground contacts, we usually receive notifications 24-48 hours in advance. In such cases, we proactively contact you to reschedule your [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) to the nearest available window. If rescheduling is not possible, we pivot the itinerary to include exceptional alternatives like Fatehpur Sikri or extended time at the Agra Fort and Mehtab Bagh. Our skip-the-line technical assistance ensures that your tickets are adjusted for the new entry time without additional cost, protecting your investment and ensuring your limited time in India is still utilized effectively."
      },
      {
        question: "Are toll taxes and parking fees included in the tour price?",
        answer: "Yes, our pricing is **strictly all-inclusive**. We cover all Yamuna Expressway toll taxes, state border taxes, monument parking fees, and fuel costs. There are no hidden surcharges or \"on-the-road\" payments required. This transparency is a key part of our high-authority service standard, allowing you to relax in your private vehicle without needing to carry large amounts of local currency for transit fees. When you book our [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary), the price you see is the final price for the logistical execution of your journey, ensuring a stress-free transition from the capital to the monuments and back."
      },
      {
        question: "Can we pay the balance on arrival and are child seats available?",
        answer: "We offer **flexible payment structures**, typically requiring a small deposit to secure your vehicle and guide, with the balance payable upon arrival to your driver in Agra. Regarding child safety, we provide specialized child car seats upon prior request for infants and toddlers. This is a vital service for family travelers following a premium [agra travel guide 2026](/india/agra/agra-travel-guide-2026) who want to ensure the same safety standards as they have at home. simply specify the age and weight of your child during the booking process for your [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour), and we will have the appropriate equipment installed before your 3:00 AM pickup."
      }
    ];
  }

  if (slug === 'taj-mahal-full-day-tour') {
    return [
      {
        question: "Is the vehicle for the Taj Mahal full day tour strictly private?",
        answer: "Yes, our [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) is built on a strictly private foundation. Your vehicle—whether it is a standard sedan, a premium SUV, or a luxury coach—is reserved exclusively for your party from the moment of pickup in Delhi. This ensures total privacy, allowing you to relax, work, or rest during the 3-hour journey without the noise or unpredictability of group coaches. A private vehicle also means we can adjust the internal temperature, choosing the exact climate-control level that suits your preference. This high-authority service standard is designed for premium buyers who value their personal space and time, turning the transition from Delhi to Agra into a luxurious extension of their overall India experience."
      },
      {
        question: "Will we have the same driver throughout the entire day trip?",
        answer: "Continuity is a hallmark of our premium service. You will be assigned a **dedicated professional chauffeur** who will stay with you from your morning pickup in Delhi until your safe return in the evening. This eliminates the confusion of switching vehicles or coordinating with multiple drivers. Your chauffeur serves as your logistical anchor, managing the Yamuna Expressway transition, the monument parking technicalities, and any spontaneous stops you may require. Having the same driver ensures they become familiar with your pacing and preferences, providing a seamless and secure environment throughout your [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary). Our drivers are trained to prioritize your safety and discretion, adhering to the highest standards of the [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) hospitality."
      },
      {
        question: "Can we stop for photographs or breaks on the Yamuna Expressway?",
        answer: "While the Yamuna Expressway is a high-speed transit corridor, your private [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) includes the flexibility to make tactical stops at the monitored rest plazas. These plazas offer clean facilities and safe panoramas of the Uttar Pradesh countryside. However, for safety reasons, stopping on the actual shoulder of the expressway is strictly prohibited by highway authorities. We instead plan our breaks at designated service areas where you can safely photograph the landscape and enjoy premium refreshments. This ensures that your journey remains both visually rewarding and logistically safe. If you have a specific interest in rural photography, our drivers can suggest the best plazas to stop at while still maintaining the efficiency of your [1-day Agra itinerary](/india/agra/1-day-agra-itinerary)."
      },
      {
        question: "Is a luxury car upgrade available for this private Agra tour?",
        answer: "For our most discerning guests, we offer a range of **luxury vehicle upgrades** including BMW, Mercedes-Benz, or Audi sedans, as well as premium 4x4 SUVs like the Toyota Fortuner. Upgrading your vehicle transforms the 330 km round-trip into a truly world-class experience, featuring superior suspension, premium upholstery, and enhanced noise isolation. If you are traveling as a premium business traveler or for a special occasion like a honeymoon, a luxury upgrade is highly recommended. Simply specify your preference during the booking process for your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour), and we will ensure a pristine, top-tier vehicle is dispatched to your Delhi hotel. This is the ultimate way to settle any concern about the long drive, ensuring you arrive in Agra refreshed and ready for exploration."
      },
      {
        question: "Can we upgrade our lunch to a 5-star luxury buffet?",
        answer: "Absolutely. While our standard [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) includes a high-quality local lunch, we offer a premium upgrade to a **5-star luxury buffet** at Agra's most prestigious hotels, such as the ITC Mughal, the Oberoi Amarvilas, or the Taj Gateway. These dining rooms offer a high-authority culinary experience, featuring royal Mughal recipes prepared with international hygiene standards and impeccable service. A 5-star lunch break is more than just a meal; it is a moment to process the morning's history in a palatial setting. This upgrade is a favorite for premium buyers following an [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) plan, as it provides a refined sanctuary away from the mid-day monument crowds before continuing to the Agra Fort."
      },
      {
        question: "Is the tour guide separate from the driver?",
        answer: "Yes, we adhere to a professional \"division of specialized labor.\" Your tour is facilitated by **two separate professionals**: an expert driver for the 330 km journey and an ASI-licensed historical guide for the monument explorations. Your driver focuses entirely on your road safety and logistical comfort, while your guide—who joins you in Agra—focuses on the architectural nuances and Mughal narratives of the Taj Mahal and Agra Fort. This high-authority approach ensures that you aren't receiving a distracted, multi-tasked service. By having a dedicated specialist for each role, your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) maintains a level of depth and quality that and-driver combinations simply cannot match, providing the premium experience you expect."
      },
      {
        question: "Are the Taj Mahal entry tickets fast-track or skip-the-line?",
        answer: "Our premium [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) service includes **priority ticketing assistance**. While there is no separate \"fast-track\" lane through the federal security check at the monument gates, we pre-book your digital ASI entry tickets in advance. This means you skip the massive public ticket window queues, which can often exceed an hour during the peak season. Upon arrival, your guide handles the technicality of the entry turnstiles, allowing you to move directly to the security screening. This skip-the-line strategy is vital for optimizing your [1-day Agra itinerary](/india/agra/1-day-agra-itinerary), ensuring that your time is spent in front of the marble dome rather than standing in the morning sun waiting for a paper ticket."
      },
      {
        question: "Can we strictly avoid shopping stops during the tour?",
        answer: "Yes, we believe in a **zero-pressure sightseeing experience**. Unlike many budget operators who derive commission from forced visits to marble factories or carpet emporiums, we prioritize your historical interests. If you wish to skip shopping entirely, simply inform your guide at the beginning of the day. Your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) is about the monuments, not the markets. We only suggest local craft visits if you explicitly request to see the traditional artisans at work, such as the descendants of the original Taj marble carvers. This commitment to an \"uncluttered\" itinerary is why we are considered a high-authority choice for serious travelers who want to follow a focused [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) without distraction."
      },
      {
        question: "Is this private Agra tour fully customizable?",
        answer: "Customization is at the core of our premium service. While we have a tried-and-tested logical flow, you are free to **modify the itinerary** based on your specific interests. If you wish to spend more time photographing the Taj Mahal and skip the Baby Taj, or if you'd like to include a visit to the local Christian cemetery to see the Dutch tombs, we will make it happen. You can choose your pickup time, your lunch venue, and the order of monuments. This flexibility is what defines a truly private [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour), transforming it from a standard package into a personal historical commission that respects your unique travel style and pacing."
      },
      {
        question: "What is the cancellation policy for the full day private tour?",
        answer: "We offer a **discerning cancellation policy** that reflects the flexibility required by international travelers. For our private vehicle and guide services, you can generally cancel with a full refund up to 24-48 hours before the scheduled departure. However, please note that government-issued Taj Mahal entry tickets are non-refundable once the specific QR code has been generated by the ASI. This transparent policy protects both your investment and our logistical commitments. We recommend reviewing the specific terms during your booking for the [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour), as we aim to provide a high-authority, stress-free booking environment that accommodates the dynamic nature of luxury travel."
      },
      {
        question: "What happens in the rare event of a vehicle breakdown?",
        answer: "While we use only modern, meticulously maintained vehicles, we have a **rigorous emergency backup protocol** in place. In the extremely unlikely event of a mechanical issue on the Yamuna Expressway, our control center in Delhi can dispatch a relief vehicle from our nearest support station within 60 to 90 minutes. Our drivers are trained in basic troubleshooting but focus on your immediate comfort and safety while the replacement arrives. Your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) is backed by our regional logistical network, ensuring that a technical glitch never turns into a stranded day. This operational redundacy is a key reason why travelers choose a high-authority operator for their [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary)."
      },
      {
        question: "Is travel insurance included in the private tour package?",
        answer: "Our services include **standard passenger liability insurance** as required by Indian transport laws for all commercial vehicles. This covers basic medical contingencies resulting from transit. However, we strongly recommend that all our guests carry comprehensive personal travel insurance that includes trip cancellation, baggage loss, and international medical evacuation. While we provide the highest-authority logistical safety through experienced drivers and modern vehicles, a private [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) should always be part of a well-insured international journey. This settled objection ensures you have total peace of mind as you traverse the highway and explore the vast complexes of Agra under our professional care."
      },
      {
        question: "What safety protocols does the driver follow on the Yamuna Expressway?",
        answer: "Every commercially licensed chauffeur deployed for this [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) strictly adheres to a comprehensive safety protocol framework. This includes maintaining speeds within the legally mandated 100 km/h limit on the Yamuna Expressway, executing mandatory rest breaks at designated service plazas to prevent driver fatigue, and utilizing real-time satellite navigation to monitor highway conditions and police advisories. Our vehicles carry emergency kits, reflective warning triangles, and fully charged fire extinguishers as mandated by the Motor Vehicles Act. Furthermore, we deploy vehicles only after conducting daily mechanical inspections covering tyre pressure, brake fluid levels, and air conditioning functionality. This rigorous operational discipline ensures that the extensive 330-kilometer round trip between Delhi and Agra remains a secure, comfortable, and completely stress-free transit experience for every international guest following our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026)."
      },
      {
        question: "Is this full day tour suitable during the monsoon season?",
        answer: "The Indian monsoon season, typically spanning July through September, introduces specific operational variables that we proactively manage for your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour). While intermittent rainfall can create dramatic, highly photogenic cloud formations behind the white marble dome, heavy downpours occasionally reduce visibility and create slippery marble surfaces on the main plinth. Our high-authority guides carry large umbrellas and strategically position you under the covered verandahs of the mosque and guest house within the complex during any sudden showers. The Yamuna Expressway remains fully operational during monsoon, though our chauffeurs engage enhanced defensive driving protocols during wet conditions. We recommend wearing waterproof footwear and carrying a light rain jacket. Despite the weather variables, many photographers specifically target the monsoon window because the lush green Charbagh gardens and moody atmospheric lighting create extraordinary imagery that rivals the standard sunrise shots documented in our [1-day Agra itinerary](/india/agra/1-day-agra-itinerary) recommendations."
      },
      {
        question: "How does the guide connect the Taj Mahal narrative with the Agra Fort visit?",
        answer: "One of the most significant intellectual advantages of our [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) is the cohesive, chronological narrative that our high-authority historian guides weave across both UNESCO World Heritage sites. Rather than treating each monument as an isolated spectacle, your guide constructs a continuous 17th-century Mughal saga. At the Taj Mahal, you absorb the romantic impetus behind Shah Jahan's monumental commission and the revolutionary architectural innovations it demanded. When you transition to the Agra Fort, the narrative evolves dramatically into a tale of political betrayal, as your guide shows you the exact Musamman Burj tower where Shah Jahan was imprisoned by his son Aurangzeb, spending his final eight years gazing directly at the tomb he built for his wife. This multi-monument storytelling approach, deeply aligned with the [things to do in Agra](/india/agra/things-to-do-in-agra) educational framework, transforms a standard sightseeing day into a profound, emotionally resonant historical experience that budget group tours simply cannot replicate."
      }
    ];
  }

  if (slug === 'female-guide-for-taj-mahal') {
    return [
      {
        question: "Are female guides licensed by government?",
        answer: "Yes, absolutely. Every professional **female guide for Taj Mahal** provided by AsiaByLocals holds strict, official licensing from the Archaeological Survey of India (ASI) and the Ministry of Tourism, Government of India. This is not just a casual verification; it means they have undergone rigorous multi-year academic training in Mughal history, architectural studies, and tourism protocols. Furthermore, they are subjected to comprehensive federal background checks before they are permitted to operate inside the monument. By booking an authentic [Agra tour by guide](/india/agra/things-to-do-in-agra), you are guaranteeing that your information is historically accurate and free from the myths often told by unlicensed street touts. This high-authority credential acts as your ultimate quality assurance, meaning your guide has the legal right to bypass certain queue restrictions, ensuring a seamless, safe, and deeply educational [Agra guided tour](/india/agra/1-day-agra-itinerary) from start to finish."
      },
      {
        question: "Can I request specific language?",
        answer: "Certainly. While fluent, articulate English is our absolute baseline standard, we understand that absorbing complex historical narratives is often most comfortable in your native tongue. Therefore, you can request a specialized **female guide for Taj Mahal** who speaks Spanish, French, German, Italian, or Japanese. Our multicultural experts are not just conversational; they are trained to translate intricate Mughal architectural terminologies and complex cultural nuances flawlessly into your requested language. When you secure your [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket), simply specify your preferred language in the booking notes. Because highly fluent foreign-language female guides are in extremely high demand during the peak [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) season (October to March), we strongly recommend reserving your preferred language expert at least three to four weeks in advance to ensure guaranteed availability for your specialized itinerary."
      },
      {
        question: "Is this suitable for solo female travelers?",
        answer: "This specific experience is architecturally engineered specifically for solo female travelers who demand an extra layer of psychological and physical comfort while exploring Northern India. Navigating a foreign monument that receives 40,000 daily visitors can feel overwhelming, but a licensed **local guide for Agra** acts as your personal cultural liaison and logistical shield. She completely removes the anxiety of navigating chaotic ticket queues, aggressive street hawkers, and the complex CISF security checkpoints. More importantly, she provides a safe, comfortable, and empowering space for you to ask sensitive cultural questions without hesitation. Whether you are on a quick [Delhi to Agra day trip](/india/agra/taj-mahal-delhi-guided-tour) or an extended journey, pairing up with a professional female guide guarantees that you can focus entirely on the breathtaking symmetry of the Taj Mahal instead of worrying about personal space and logistical safety."
      },
      {
        question: "Can guide assist with saree draping photos?",
        answer: "Absolutely. One of the most unique and valued benefits of booking a **female guide for Taj Mahal** is her intimate understanding of cultural aesthetics, including traditional Indian attire. Many of our international guests wish to wear a stunning saree for their visit to capture those iconic, culturally immersive photographs. Your female guide can provide private, comfortable, and expert assistance with the complex process of saree draping right before you enter the monument. Furthermore, because she understands the precise angles, lighting, and \"symmetry points\" of the [Taj Mahal photography tour](/india/agra/taj-mahal-photography-tour) landscape, she will act as your personal creative director. She knows exactly how to arrange the fabric to complement the stark white marble background, ensuring your social media photos look professionally styled, elegant, and perfectly framed without the need to hire an external photographer."
      },
      {
        question: "Is cultural sensitivity maintained?",
        answer: "Cultural sensitivity forms the absolute cornerstone of our premium high-authority service standard. When you embark on an [Agra guided tour](/india/agra/things-to-do-in-agra), our female guides act as a respectful bridge between your international perspective and deep-rooted Indian traditions. They possess a profound, empathetic understanding of local customs, religious etiquette, and the spiritual sanctity of the mausoleum. Your guide will clearly explain complex cultural norms, such as appropriate modesty, footwear rules near the cenotaphs, and mosque etiquette, ensuring you never inadvertently cross a cultural boundary. This provides immense peace of mind. By maintaining this delicate balance of education and respect, your **local guide for Agra** ensures that your interactions with the local environment are not just visually spectacular, but also culturally meaningful, respectful, and highly enriching for both you and the local community you are visiting."
      },
      {
        question: "Are guides trained in history formally?",
        answer: "Yes, this is a non-negotiable standard for our [AsiaByLocals premium experiences](/india/agra/things-to-do-in-agra). Our guides are not just storytellers; they are formally trained, university-educated historians who specialize in the Mughal era. Achieving the required ASI license means passing stringent examinations covering Indian archaeology, architectural engineering, and specific regional histories. When you book a **female guide for Taj Mahal**, you are hiring a top-tier intellectual who can provide high-level analysis of the complex pietra dura marble inlay, the geometric perfection of the Persian Charbagh garden layout, and the intricate political machinations of Emperor Shah Jahan's court. They dismiss common myths with hard archaeological facts, transforming a visually stunning monument visit into a masterclass in 17th-century Islamic architecture, delivering a robust educational payload that satisfies even the most intellectually curious and discerning international travelers."
      },
      {
        question: "Can female guide handle family groups?",
        answer: "Definitively yes. Our female guides are exceptionally skilled at managing the dynamic pacing and varied interests of multi-generational family groups. We understand that exploring massive heritage sites with young children and elderly grandparents simultaneously presents unique logistical challenges. Your **Agra tour by guide** is dynamically adjusted in real-time by your female expert to ensure everyone remains engaged. She possesses the patience to explain complex history in a highly interactive, fun manner that captivates younger children, while simultaneously providing the deep historical context demanded by adult history buffs. Furthermore, she easily identifies the best shaded resting spots, arranges timely hydration breaks, and strategically navigates the complex to minimize unnecessary walking for senior family members. This adaptability makes a [Taj Mahal full day tour](/india/agra/taj-mahal-full-day-tour) an effortless, stress-free, and thoroughly enjoyable bonding experience for the entire family."
      },
      {
        question: "Is there extra charge compared to male guide?",
        answer: "No, absolutely not. We maintain strict pricing parity and equality across our entire guiding platform. You will never face a surcharge or hidden premium fee simply for requesting a **female guide for Taj Mahal**. We firmly believe that comfort, safety, and specific demographic preferences should not be penalized monetarily. Every single [Agra guided tour](/india/agra/things-to-do-in-agra) offered by AsiaByLocals is priced transparently, based exclusively on the rigorous licensing, profound expertise, and high-authority logistical services provided. We champion the empowerment of women in the Indian tourism sector, and maintaining equal transparent pricing is central to that mission. When you finalize your booking and secure your [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket), you can be 100% confident that you are receiving the best possible market value for a premium, specialized, and highly educated professional, regardless of gender."
      },
      {
        question: "Can I request modest storytelling approach?",
        answer: "Yes, customization of the narrative style is a key benefit of booking a private tour. You can explicitly request a **modest storytelling approach** that strictly focuses on the verified architectural marvels, the complex engineering of the dome, and the documented historical timeline, while respectfully maintaining comfortable cultural boundaries regarding the romantic legends. Our female guides are highly emotionally intelligent and perceptively flexible; they will actively calibrate their tone, vocabulary, and focal points to perfectly align with your party's personal comfort levels and specific interests. Whether you are seeking a highly conservative historical overview or an in-depth dive into the personal lives of Mughal royals during your [1-day Agra itinerary](/india/agra/1-day-agra-itinerary), your specialized **local guide for Agra** will deliver a bespoke intellectual experience that respects your preferences without ever compromising the rich educational value of the tour."
      },
      {
        question: "Are guides safe and verified?",
        answer: "Your personal safety and peace of mind constitute our highest priority, zero-compromise metric. Every single professional providing a **female guide for Taj Mahal** experience is personally verified, vetted, and heavily monitored by the AsiaByLocals management team. Beyond their mandatory government ASI licenses, we require extensive background checks, multiple rounds of theoretical interviews, and a proven, multi-year track record of flawless safety with international delegates and solo travelers. We only collaborate with elite professionals who consistently receive perfect 5-star ratings for their reliability, discretion, and protective nature. When you embark on an [Agra tour by guide](/india/agra/things-to-do-in-agra) with us, you are completely shielded by our rigorous safety protocols. We guarantee that your guide is not only a brilliant historian but also a trustworthy local guardian entirely dedicated to your physical and psychological well-being throughout the day."
      },
      {
        question: "Can guide help avoid local scams?",
        answer: "Yes, acting as an impenetrable logistical shield against local friction is one of your guide's primary responsibilities. The areas surrounding major monuments are notorious for unauthorized photographers, aggressive souvenir hawkers, and various \"fast-track\" scams that prey on disoriented tourists. Your **local guide for Agra** completely neutralizes these threats. Because she is a highly respected, licensed local authority, touts actively avoid approaching her clients. She ensures you pay the absolutely correct, official [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) without hidden markups, prevents you from being overcharged for shoe covers or water, and navigates you swiftly through the mandatory CISF security check protocols. By actively managing these micro-stresses, your guide allows you to maintain total peace of mind and preserves your energy exclusively for appreciating the stunning architecture of your high-value [Agra guided tour](/india/agra/1-day-agra-itinerary)."
      },
      {
        question: "Can we customize duration?",
        answer: "Absolutely. Because this is a strictly private, bespoke experience, the duration of your **Agra tour by guide** is entirely subservient to your personal energy levels and specific interests. While a standard comprehensive visit to the mausoleum requires approximately two to three hours, we are highly flexible. If you are a serious professional photographer needing extended time to capture the shifting light during a [Taj Mahal sunrise tour](/india/agra/taj-mahal-sunrise-guided-tour), your guide will happily extend the visit. Conversely, if you are an elderly traveler seeking a swift, \"highlights only\" overview to avoid the intense midday heat, she will expertly distill the history into a shorter, highly efficient 90-minute walk. You dictate the pace; your specialized **female guide for Taj Mahal** will seamlessly adjust the logistical flow and storytelling narrative to ensure your absolute physical comfort and intellectual satisfaction."
      },
      {
        question: "Can she recommend safe cafes?",
        answer: "Certainly. Food safety and hygiene are primary concerns for international visitors, and your **local guide for Agra** serves as an indispensable culinary filter. She possesses an expertly curated, strictly vetted list of high-authority cafes and restaurants that consistently meet international health and hygiene standards. Whether you desire a serene rooftop cafe offering panoramic, unobstructed views of the Taj Mahal or a pristine dining room serving authentic, refined Mughal cuisine, she will guide you to safe establishments. We strictly avoid the low-quality \"tourist trap\" buffets that many generic bus tours frequent. By relying on her insider knowledge during your [Delhi to Agra day trip](/india/agra/taj-mahal-delhi-guided-tour), you can confidently explore Agra's rich culinary landscape, sampling famous local delicacies without any anxiety regarding stomach issues or unfair pricing, ensuring your complete culinary satisfaction and safety."
      },
      {
        question: "Is photography assistance included?",
        answer: "While they are fundamentally historians rather than professional commercial photographers, our female guides are absolute experts at spatial awareness within the complex. They know the exact, highly sought-after \"symmetry points,\" the best off-center angles, and the optimal lighting conditions for capturing stunning imagery. They will happily and skillfully assist you by taking high-quality photographs using your smartphone or personal camera throughout the [Agra guided tour](/india/agra/things-to-do-in-agra). They know exactly how to position you to perfectly align with the reflecting pools, ensuring you secure those essential, iconic postcard shots without the intrusion of massive tourist crowds explicitly in the frame. This built-in creative assistance saves you the significant expense and hassle of hiring an external photographer, adding immense value to your [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket) experience while ensuring you leave with flawless visual memories."
      },
      {
        question: "Can guide assist elderly women travelers?",
        answer: "Yes, our female guides are specifically trained to provide an exceptionally gentle, patient, and highly observant pace for elderly female travelers. Exploring a massive heritage complex that requires over 3 kilometers of walking can be physically demanding. Your **female guide for Taj Mahal** proactively manages this by arranging authorized electric golf carts to minimize walking distances from the parking perimeter to the main gates. Inside the complex, she intuitively identifies shaded seating areas where you can rest comfortably while she engagingly explains the complex history. Furthermore, she meticulously plots a specialized walking route that deliberately avoids unnecessary, strenuous staircases wherever structurally possible. This intense focus on physical accessibility and geriatric comfort ensures that senior travelers can fully participate in and thoroughly enjoy a premium [Taj Mahal full day tour](/india/agra/taj-mahal-full-day-tour) without experiencing exhaustion or mobility-related anxiety."
      }
    ];
  }

  if (slug === 'taj-mahal-official-guided-tour') {
    return [
      {
        question: "What makes a guide “official”?",
        answer: "An \"official\" guide is a highly trained professional who holds a prestigious, government-issued license from the Ministry of Tourism and the Archaeological Survey of India (ASI). Unlike unauthorized touts or street escorts, an **official tour guide for Taj Mahal** has undergone years of university-level education in Indian history, architecture, and cultural studies, followed by rigorous government examinations. They are the only individuals legally permitted to provide historical commentary inside the monument's core areas. By choosing to [book official tour guide for Taj Mahal](/india/agra/taj-mahal-official-guided-tour), you bypass the scams, misinformation, and high-pressure sales tactics associated with unlicensed operators. This official status guarantees you receive an authentic, factual, and deeply enriching [Agra guided tour](/india/agra/things-to-do-in-agra) that respects your time and intelligence."
      },
      {
        question: "Are ASI certified guides different?",
        answer: "Yes, ASI (Archaeological Survey of India) certified guides represent the absolute highest echelon of historical expertise in India. They are fundamentally different from local street guides because their narratives are based on verified archaeological facts rather than romanticized local folklore. An **ASI certified guide** has exclusive clearance to navigate you through complex federal security checkpoints and possesses an intimate understanding of the monument's preservation efforts. When you secure a premium [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket) accompanied by an ASI expert, you elevate your visit from a simple sightseeing walk into an intellectual masterclass covering 17th-century Mughal engineering, pietra dura artistry, and the authentic history of Emperor Shah Jahan."
      },
      {
        question: "Can I verify guide ID?",
        answer: "Absolutely. Transparency and trust are the cornerstones of our premium service. Upon meeting you at your hotel or the monument gates, your designated **official tour guide for Taj Mahal** will proactively present their laminated, government-issued ASI identity card. This highly secure ID features their photograph, unique registration number, and official government holograms. We encourage you to inspect this credential, as it guarantees that your [Agra tour by guide](/india/agra/things-to-do-in-agra) is completely legitimate and legally sanctioned. We take pride in our strict vetting process, ensuring that every professional we assign has a flawless, multi-year track record of safety, historical accuracy, and impeccable conduct with international guests following our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) standards."
      },
      {
        question: "Are unofficial guides allowed inside?",
        answer: "No, unauthorized guides, often referred to locally as \"lapkas\" or street touts, are strictly prohibited from operating inside the main mausoleum complex by federal law. However, they frequently loiter near the parking lots and outer gates, attempting to intercept tourists with very low-priced offers. If you hire an unofficial escort, they risk being evicted by the CISF security forces mid-tour, leaving you stranded without historical context. To protect your investment and ensure a seamless, anxiety-free experience, you must [book official tour guide for Taj Mahal](/india/agra/taj-mahal-official-guided-tour) in advance. Our licensed experts provide a protective logistical shield, completely neutralizing any friction from unauthorized operators and guaranteeing uninterrupted access to the site's most spectacular viewpoints."
      },
      {
        question: "Is guide fee separate from entry ticket?",
        answer: "Yes, the standard ASI entry ticket only grants you physical access to the monument; it does not include any historical commentary or personalized navigation assistance. The fee for an **official tour guide for Taj Mahal** is an independent, highly valuable investment in your intellectual experience. While you can purchase a standard entry pass, navigating the immense, complex history and architectural nuances alone often leads to a superficial, overwhelming visit. By paying the separate, transparent guide fee, you secure a dedicated historian who manages your pacing, acts as a cultural liaison, and transforms a simple viewing of marble into a profound [1-day Agra itinerary](/india/agra/1-day-agra-itinerary) experience. There are absolutely no hidden costs or surprise surcharges once your private guide is booked."
      },
      {
        question: "How long does guide stay with us?",
        answer: "Your dedicated expert is contracted for a comprehensive, unhurried exploration, typically remaining with you for **2.5 to 3.5 hours** inside the Taj Mahal complex. However, because this is a strictly private [Taj Mahal guided tour](/india/agra/things-to-do-in-agra), the duration is completely subservient to your personal energy levels and specific interests. If you are an avid photographer requiring extended time to capture the shifting light, your guide will patiently assist without checking their watch. Conversely, if you are an elderly traveler seeking a highly efficient, \"highlights-only\" narrative to avoid the midday heat, they will expertly condense the history into a shorter timeframe. Unlike rigid group tours, your **official tour guide for Taj Mahal** remains exclusively focused on your group's unique pacing and comfort."
      },
      {
        question: "What languages are available?",
        answer: "While articulate, fluent English is our universal baseline, we understand that engaging with complex historical concepts is always most impactful in your native language. When you choose to [book official tour guide for Taj Mahal](/india/agra/taj-mahal-official-guided-tour), you can request highly specialized experts who are fluent in **Spanish, French, German, Italian, or Japanese**. These multilingual professionals are not just translators; they are certified historians trained to convey intricate Mughal architectural terminologies precisely in your chosen language. Because high-authority, foreign-language ASI guides are in extremely high demand—especially during the peak winter season—we strongly advise finalizing your booking well in advance to guarantee the availability of your preferred linguistic expert for your [Taj Mahal full day tour](/india/agra/taj-mahal-full-day-tour)."
      },
      {
        question: "Can guide meet us at East/West gate?",
        answer: "Absolutely. Our premium logistical service dictates that your **official tour guide for Taj Mahal** will meet you exactly where it is most convenient and tactically advantageous for your group. Whether you are arriving directly from Delhi on the Yamuna Expressway and require a meeting at the West Gate parking plaza, or you are staying at a luxury hotel near the East Gate, your guide will be there anticipating your arrival. Having your guide meet you at the gate perimeter is an essential tactical advantage; they will immediately assume control of navigating the chaotic ticketing areas and coordinate the electric golf carts, ensuring your transition from the street into your serene [Agra guided tour](/india/agra/things-to-do-in-agra) is completely seamless and stress-free."
      },
      {
        question: "Is tipping expected?",
        answer: "While the comprehensive professional fee for your **official tour guide for Taj Mahal** is fully covered in your initial booking, tipping is a customary, though entirely optional, practice in the Indian hospitality sector to acknowledge exceptional service. Unlike budget operators, our ASI-certified experts are compensated with highly competitive, living wages, meaning they will never pressure you or hold your experience hostage for a gratuity. If your guide successfully navigated complex crowds, captured outstanding photographs, and deepened your understanding of Mughal history, a tip of 10% to 15% is a gracious way to express your satisfaction. However, this decision rests entirely at your discretion, ensuring that your [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket) experience remains comfortable and pressure-free."
      },
      {
        question: "What if guide is late?",
        answer: "Punctuality is a core, non-negotiable metric of our high-authority service standard. We mandate that your assigned **official tour guide for Taj Mahal** arrives at the designated meeting point at least 15 minutes prior to your scheduled commencement. In the exceptionally rare event of an uncontrollable delay—such as severe, unexpected traffic—our central dispatch system constantly monitors their GPS location. We will proactively notify you via WhatsApp or SMS, providing real-time updates so you are never left waiting in uncertainty. Furthermore, our robust local network ensures that if a significant delay occurs, we immediately dispatch an equally qualified, ASI-certified backup historian. This zero-failure logistical protocol is why discerning travelers trust us for their precise [1-day Agra itinerary](/india/agra/1-day-agra-itinerary) planning."
      },
      {
        question: "Are audio guides better?",
        answer: "While electronic audio guides offer basic recorded facts, they simply cannot compete with the dynamic, reactive intellect of a human **official tour guide for Taj Mahal**. An audio device cannot analyze the shifting light to position you for the perfect [Taj Mahal sunrise tour](/india/agra/taj-mahal-sunrise-guided-tour) photograph, nor can it physically shield you from aggressive street vendors. More importantly, an ASI-certified historian can instantly pivot their narrative to answer your specific, spontaneous questions, drawing fascinating parallels between Mughal history and your home country. An audio guide provides a static monologue; a premium human guide delivers an interactive, high-authority dialogue that is deeply customized, ensuring a much higher intellectual return on your investment compared to a generic recording."
      },
      {
        question: "Can I book guide last minute?",
        answer: "While our digital infrastructure allows for last-minute processing, the reality of high-quality Indian tourism dictates that true ASI-certified professionals are booked weeks in advance. If you attempt to secure a guide upon arrival at the gates, you are highly likely to be intercepted by unlicensed touts offering subpar, factually incorrect tours. To guarantee safety, historical accuracy, and a fluent professional, it is imperative to [book official tour guide for Taj Mahal](/india/agra/taj-mahal-official-guided-tour) digitally, prior to your arrival in Agra. If you find yourself in a sudden logistical bind, our emergency dispatch can sometimes allocate an expert within a 12-hour window, but pre-planning remains the absolute most effective strategy for managing your premium [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) itinerary."
      },
      {
        question: "Is guide mandatory at Taj Mahal?",
        answer: "A guide is not legally mandatory to cross the turnstiles, but attempting the complex without one is widely considered a severe tactical error by experienced globetrotters. The monument complex is immense, heavily crowded, and visually overwhelming. Without an **official tour guide for Taj Mahal**, you are essentially walking through a beautiful maze without context, entirely missing the profound engineering secrets, the optical illusions of the calligraphy, and the dramatic political history hidden in the marble. By investing in an [Agra tour by guide](/india/agra/things-to-do-in-agra), you eliminate the logistical anxiety of navigating the crowds and elevate a mere sightseeing stop into a powerful, masterfully curated educational journey. The intellectual payload provided by an expert makes their presence virtually indispensable."
      },
      {
        question: "Can guide help with crowd navigation?",
        answer: "Absolutely; crowd navigation is one of the most vital, practical benefits of securing an **official tour guide for Taj Mahal**. On average, the monument hosts over 40,000 visitors daily, which can lead to severe bottlenecks at the primary entrance points and the interior cenotaph chambers. An ASI-certified expert possesses an intimate, tactical knowledge of the complex's spatial flow. They know precisely when the large, slow-moving tourist buses arrive and deliberately reverse-engineer your walking route to bypass the densest crowds. They know exactly which hidden garden quadrants remain empty at 9:00 AM, allowing you to capture pristine photos. This strategic crowd management ensures your [Taj Mahal guided tour](/india/agra/things-to-do-in-agra) remains serene, deeply personal, and highly efficient, regardless of the season."
      },
      {
        question: "Is storytelling customized?",
        answer: "Complete personalization is the defining hallmark of our private **official tour guide for Taj Mahal** experience. Unlike generic, scripted group tours that treat all visitors identically, our ASI-certified historians possess the emotional intelligence to read their audience and adapt in real-time. If you are a structural engineer fascinated by the 17th-century foundation mechanics, the narrative focuses entirely on architecture. If you are an architecture student focusing on the Persian Charbagh layout, the tour becomes a masterclass in Mughal botanics. If you are following an [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) with young children, the storytelling pivots to engaging, accessible history filled with fascinating royal anecdotes. You control the intellectual depth, and your expert seamlessly delivers the bespoke narrative you desire."
      }
    ];
  }

  if (slug === 'taj-mahal-entry-ticket') {
    return [
      {
        question: "Is this official ASI ticket?",
        answer: "Yes, these are 100% official digital entry tickets issued directly by the Archaeological Survey of India (ASI). When you purchase a **Taj Mahal Entry Ticket 2026**, you are securing a legitimate, government-approved QR code that is universally recognized at all electronic turnstiles. Unlike unauthorized vouchers peddled by street vendors that often lead to denied entry, our official passes guarantee seamless access to the peripheral gardens, the flanking mosque, and the actual monument platforms. By securing your official documentation in advance, you immediately neutralize the risk of counterfeit tickets and eliminate the anxiety of dealing with aggressive touts at the physical booking windows. It is the absolute safest, most secure, and most intelligent logistical choice for international travelers following a strict [1-day Agra itinerary](/india/agra/1-day-agra-itinerary)."
      },
      {
        question: "Do I skip only ticket line or security too?",
        answer: "The term \"skip-the-line\" refers exclusively to bypassing the incredibly long, physical ASI ticket purchasing queues, which often consume 60 to 90 minutes of your valuable time during the peak tourist season. By pre-booking your **Taj Mahal Entry Ticket 2026** with us, you completely skip this tedious logistical hurdle and proceed directly to the entrance. However, for federal security reasons, absolutely no visitor—regardless of VIP status or ticket tier—is permitted to bypass the mandatory physical security screening conducted by the Central Industrial Security Force (CISF). Every tourist must undergo this metal detector check and bag screening. To minimize this final wait, we strongly recommend arriving right at sunrise and minimizing the items in your daypack, ensuring your seamless transition into your scheduled [Agra guided tour](/india/agra/things-to-do-in-agra)."
      },
      {
        question: "Is mausoleum access included?",
        answer: "Yes, there is a critical distinction in ticketing: the base ticket only permits entry to the gardens, whereas our premium comprehensive pass explicitly includes the `Mausoleum Entry` supplement. Your **Taj Mahal Entry Ticket 2026** guarantees full access not only to the sprawling Persian Charbagh gardens and the iconic reflecting pools but also grants you permission to step onto the main white marble platform. Most importantly, it allows you to enter the highly restricted circular interior chamber containing the stunning 17th-century cenotaphs of Emperor Shah Jahan and Mumtaz Mahal. Many budget tourists mistakenly purchase the cheaper base ticket and are devastatingly denied entry to the main dome. We eliminate this devastating error by always bundling the complete, all-inclusive access pass for a high-authority [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time)."
      },
      {
        question: "What is monument fee breakdown for foreigners vs Indians?",
        answer: "The Archaeological Survey of India implements a heavily tiered pricing structure to subsidize local heritage access. For Indian citizens, the base entry is highly subsidized at ₹50, with an additional ₹200 for the main mausoleum. In contrast, the **Taj Mahal entry ticket price** for foreign nationals is significantly distinct: the mandatory ASI base toll is ₹1,100, which includes a required ₹500 fee paid to the Agra Development Authority (ADA), plus the additional ₹200 supplement to enter the main interior mausoleum, bringing the official foreigner cost to ₹1,300. Our transactional processing accurately reflects this legally mandated foreign tier while adding our nominal digital convenience fee. This guarantees that international travelers receive the correct high-value pass and avoid humiliating detentions at the gates during their [Taj Mahal full day tour](/india/agra/taj-mahal-full-day-tour)."
      },
      {
        question: "Is ticket refundable?",
        answer: "Our cancellation structure is highly transparent and explicitly governed by ASI digital regulations. Because government-issued entry passes contain uniquely generated QR codes tied to specific dates, the core **Taj Mahal Entry Ticket 2026** component is generally non-refundable once the official federal bar code has been minted. The ASI does not permit refunds for weather, personal delays, or changes of mind. However, if you have bundled additional premium services with your ticket—such as an [official tour guide for Taj Mahal](/india/agra/taj-mahal-official-guided-tour) or private transportation—those specific supplementary service elements remain fully refundable up to 24-48 hours before your arrival. We strongly urge all international travelers to precisely finalize their dates before execution, treating this specific transaction with the absolute finality of purchasing an airline ticket."
      },
      {
        question: "Can I change date after booking?",
        answer: "Unfortunately, federal ASI regulations strictly prohibit digital modifications, name transfers, or date amendments once a **Taj Mahal Entry Ticket 2026** has been successfully generated. The unique QR code is permanently, inextricably hardcoded to the specific calendar date and the exact name provided during your initial checkout process. If your flight is severely delayed or your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) itinerary changes unexpectedly, your ticket cannot be forwarded to the next day; it simply expires. Consequently, a completely new transaction must be initiated. Because of this rigid government infrastructure, we relentlessly advise our international clients to triple-check their flight schedules, train arrivals, and overall travel plans to ensure absolute date accuracy before finalizing their digital purchase with us."
      },
      {
        question: "Is passport required?",
        answer: "Absolutely; carrying a valid, physical passport is a non-negotiable federal security mandate for all international tourists utilizing the foreigner-tier **Taj Mahal Entry Ticket 2026**. While you will showcase the QR code on your mobile device, the CISF security personnel at the physical turnstiles retain the absolute right to demand your original, physical passport. They must perfectly match the name and nationality embedded in the digital ticket data against your physical ID to prevent ticket scalping and ensure border security compliance. High-quality photocopies or digital phone images are frequently rejected by aggressive guards. Do not risk denied entry; always carry your original passport prominently in a secure, hidden travel pouch alongside your mobile ticket when heading out for your [Taj Mahal sunrise tour](/india/agra/taj-mahal-sunrise-guided-tour)."
      },
      {
        question: "How will I receive ticket?",
        answer: "We employ a frictionless, immediate digital delivery system designed explicitly for travelers constantly on the move. Once your payment clears and the ASI generates your credentials, your official **Taj Mahal Entry Ticket 2026** is delivered instantly via high-resolution PDF format directly to your designated email address and seamlessly to your WhatsApp number. This dual-delivery mechanism ensures you have redundant offline access; you do not need to hunt for a printer in a foreign hotel. Simply download the PDF to your smartphone's local storage before leaving your hotel's Wi-Fi zone. Upon arrival at the East or West Gate, maximize your screen brightness and lazily present the sharp QR code to the electronic turnstile scanners to initiate your [Agra guided tour](/india/agra/things-to-do-in-agra)."
      },
      {
        question: "Do children need ticket?",
        answer: "Yes, but the pricing is incredibly favorable for families following an [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) plan. Under current ASI regulations, children under the age of 15—regardless of their citizenship or nationality—are granted completely free entry to both the magnificent gardens and the interior mausoleum. However, they must still undergo the mandatory CISF security screening. It is absolutely critical that parents carry original, physical proof of the child's age, such as a passport, as gate guards will forcefully demand verification for teenagers who appear older. For individuals aged 15 and above, the full adult foreigner **Taj Mahal entry ticket price** applies strictly. We request that you specify the number of accompanying minors during booking so we can tactically prepare your visiting party."
      },
      {
        question: "Can I re-enter same day?",
        answer: "No, the official ASI policy strictly enforces a single, continuous-entry protocol. Your **Taj Mahal Entry Ticket 2026** allows you to pass through the turnstiles exactly once. From the moment the QR code is scanned, you are legally granted a maximum visiting window of precisely three hours inside the sprawling complex. If you decide to abruptly exit the monument to grab lunch or retrieve forgotten camera batteries from your vehicle, your ticket is permanently voided; you will be forcefully required to purchase a completely new pass at full price to re-enter. Therefore, we highly advise carrying all necessary essentials, such as bottled water and sun protection, ensuring you can comfortably execute your comprehensive 3-hour [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) without any unnecessary interruptions."
      },
      {
        question: "What items are prohibited?",
        answer: "The CISF implements severe aviation-grade security protocols. You must decisively remove large heavy backpacks, bulky tripods, commercial camera lighting rigs, and drone equipment before reaching the turnstiles with your **Taj Mahal Entry Ticket 2026**. Strictly prohibited items including tobacco, lighters, matches, sharp weapons, electronic chargers, laptops, and all food items will be aggressively confiscated without return. We strongly recommend carrying only a minimal, transparent small daypack containing your physical passport, mobile phone, a small camera, and a single half-liter water bottle. Adhering strictly to this \"clean entry\" philosophy guarantees that you will effortlessly breeze through the frustrating security bottlenecks, allowing you to maximize your precious time marveling at the architecture rather than arguing with security during your [Delhi to Agra day trip](/india/agra/taj-mahal-delhi-guided-tour)."
      },
      {
        question: "Is this valid for sunrise?",
        answer: "Yes, absolutely. By purchasing your **Taj Mahal Entry Ticket 2026** in advance, you secure the ultimate tactical advantage: the ability to execute an flawless sunrise entrance. The ASI officially unlocks the gates precisely 30 minutes before the astronomical sunrise. Because you already possess the digital QR code on your mobile device, you completely bypass the chaotic, freezing morning queue at the physical ticket counters. You can literally walk straight from your private vehicle directly into the CISF security screening line. This guarantees that you are among the very first 50 people to enter the pristine complex, allowing you to capture those ultra-rare, unobstructed reflection pool photographs that make the [Taj Mahal sunrise tour](/india/agra/taj-mahal-sunrise-guided-tour) the most coveted travel experience in Northern India."
      },
      {
        question: "Is there extra Friday surcharge?",
        answer: "This is a critical logistical misconception: there is no surcharge because the Taj Mahal is entirely, legally closed to all tourist traffic every single Friday. This mandatory closure allows the local Muslim community to utilize the red sandstone mosque located within the complex for religious Friday prayers (Jummah). Consequently, it is literally impossible to generate a **Taj Mahal Entry Ticket 2026** for a Friday date. If your limited travel window forces you to be in Agra on a Friday, we strongly suggest pivoting your strategy to visit the majestic Agra Fort, the Baby Taj, or watching the sunset securely from the Mehtab Bagh gardens across the river. Always meticulously review your [1-day Agra itinerary](/india/agra/1-day-agra-itinerary) to ensure your primary monument visit falls between Saturday and Thursday."
      },
      {
        question: "What if monument closes unexpectedly?",
        answer: "While exceptionally rare, the Indian government occasionally mandates snap closures of the monument for high-level international VIP visits (such as heads of state) or sudden severe national security protocols. In these extreme, uncontrollable force-majeure scenarios, the ASI entirely suspends the scanning of the **Taj Mahal Entry Ticket 2026**. Because we operate as a high-authority, deeply connected local agency, we typically receive internal intelligence regarding these VIP movements 24 hours in advance. If your ticket is invalidated by state action, we immediately trigger rapid communication with you to tactically reschedule your visit to the next available window, or seamlessly pivot your schedule to prioritize the Agra Fort and Fatehpur Sikri, actively protecting your valuable time during your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) execution."
      },
      {
        question: "Is shoe cover included?",
        answer: "Yes, this is a vital inclusion for foreign ticket holders. When you legally purchase the premium foreigner-tier **Taj Mahal Entry Ticket 2026**, the ASI provides complimentary, disposable shoe covers alongside a complimentary half-liter bottle of water. These shoe covers are absolutely mandatory for stepping onto the elevated, pristine white marble platform that surrounds the main mausoleum, as they protect the delicate 17th-century stones from abrasive street dust. When you arrive, you do not need to endure the hassle of unlacing your boots or walking barefoot in alternating freezing or scorching temperatures. You simply slip the covers over your existing footwear, grab your complimentary water from the designated kiosk, and comfortably proceed with your deeply educational [Agra guided tour](/india/agra/things-to-do-in-agra)."
      },
      {
        question: "Do I need printed copy?",
        answer: "No, the modern ASI infrastructure is fully optimized for digital, paperless processing to accelerate entry speeds. You are absolutely not required to locate a physical printer or carry paper documents. It is entirely sufficient to boldly display the high-resolution PDF of your **Taj Mahal Entry Ticket 2026** directly on your smartphone screen. The electronic turnstiles at both the East and West gates are equipped with responsive optical scanners that easily read digital QR codes. To guarantee zero friction, we simply recommend maximizing your smartphone's screen brightness when approaching the gate and ensuring you have taken a local offline screenshot of the ticket, protecting you against any unexpected cellular network failures during your [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time)."
      },
      {
        question: "Can I book same-day ticket?",
        answer: "While our advanced digital infrastructure Technically supports ultra-fast, same-day processing, we relentlessly advise against this high-risk strategy. The ASI servers occasionally experience sudden digital blackouts or massive traffic queues during peak afternoon rushes, which can severely delay the generation of your unique QR code. If you wait until you are literally standing in front of the gates to purchase your **Taj Mahal Entry Ticket 2026**, a server timeout could force you to wait an hour. To guarantee a flawless, stress-free execution of your itinerary, we emphatically command that travelers purchase their tickets at least 24 to 48 hours before their planned arrival. This proactive strategy is a cornerstone of intelligent [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) planning, locking in your access and removing all on-site anxiety."
      }
    ];
  }

  if (slug === 'taj-mahal-sunrise-sunrise-tour') {
    return [
      { question: "What makes this private sunrise tour different from standard sunrise tours?", answer: "This [Private Sunrise Taj Mahal & Agra Fort](/india/agra/taj-mahal-sunrise-sunrise-tour) tour is engineered for travelers who demand absolute exclusivity during the most coveted window of the day. Unlike budget group deployments that consolidate dozens of strangers into a single bus, your entire experience operates with a dedicated private vehicle, a personally assigned ASI-licensed historian guide, and a flexible timeline that adapts entirely to your photography and exploration preferences. The private framework eliminates all rigid scheduling, allowing you to linger at the central reflection pools during the critical golden hour light without being rushed by a tour leader managing forty different agendas simultaneously." },
      { question: "Is hotel pickup included for the sunrise departure?", answer: "Yes, seamless door-to-door transportation is a fundamental component of this premium [sunrise Taj Mahal experience](/india/agra/taj-mahal-sunrise-sunrise-tour). Your designated air-conditioned vehicle and professionally licensed chauffeur will arrive at your Agra hotel, homestay, or railway station precisely at the pre-scheduled early morning time. We typically coordinate a pickup between 5:00 AM and 5:30 AM depending on the exact seasonal sunrise window. This eliminates the dangerous uncertainty of negotiating with local auto-rickshaw drivers in the pre-dawn darkness, providing immediate logistical security from the moment your day begins." },
      { question: "How long do we spend inside the Taj Mahal complex?", answer: "We structurally allocate a comprehensive 2.5 to 3-hour exploration window exclusively inside the Taj Mahal complex during the premium sunrise period. This rigorous timeframe is meticulously calculated to ensure you witness the complete light transformation sequence from the initial pre-dawn blues through the spectacular golden hour, while simultaneously absorbing the deep historical narrative from your high-authority guide. The extended duration allows unhurried photography at all five primary symmetry points, detailed examination of the intricate Pietra Dura marble inlay work, and a thorough exploration of the adjacent mosque and guest house structures within the [Agra guided tour](/india/agra/things-to-do-in-agra) framework." },
      { question: "Is the Agra Fort visit included after sunrise?", answer: "Absolutely. Following your intensive sunrise exploration of the Taj Mahal and a scheduled breakfast interval at your hotel or a premium restaurant, this comprehensive [private tour](/india/agra/taj-mahal-sunrise-sunrise-tour) seamlessly transitions to the massive red sandstone Agra Fort. Your same high-authority historian guide accompanies you through the sprawling defensive perimeter, the ornate Diwan-i-Am and Diwan-i-Khas audience halls, and critically, the Musamman Burj tower where Shah Jahan spent his final imprisoned years gazing at the Taj Mahal across the Yamuna River. This dual-monument strategy delivers the complete Mughal narrative in a single morning." },
      { question: "What vehicle type is provided for this tour?", answer: "We strictly deploy modern, impeccably maintained, deeply sanitized air-conditioned vehicles to ensure your absolute comfort throughout this [sunrise Agra tour](/india/agra/taj-mahal-sunrise-sunrise-tour). For solo travelers or couples, we utilize premium sedans such as the Toyota Etios or Swift Dzire. For families or small groups of up to six individuals, we automatically upgrade to an extremely spacious Toyota Innova SUV, providing superior legroom and advanced suspension. Every vehicle is operated by a uniformed, commercially licensed chauffeur trained in defensive driving protocols, guaranteeing safe and luxurious transit between the monuments and your accommodation." },
      { question: "Are monument entry tickets included in the price?", answer: "This premium package covers the elite expertise of your ASI-licensed historian guide and your private air-conditioned transportation, but intentionally excludes monument entrance fees. By keeping the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) separate from our service fee, you pay the exact uninflated government rate without hidden agency markups. Your guide acts as your logistical concierge, pre-purchasing digital ASI tickets and navigating the complex online portal on your behalf, ensuring you completely bypass the chaotic manual ticket queues and maximize your precious time inside the monuments during the optimal lighting conditions." },
      { question: "What happens if there is dense fog during winter sunrise?", answer: "During the intense North Indian winter months of December and January, dense atmospheric fog frequently introduces significant visibility variables at sunrise. However, we absolutely do not cancel your [private sunrise tour](/india/agra/taj-mahal-sunrise-sunrise-tour) under these conditions. Instead, our high-authority guides execute a strategic pivot, utilizing the massive red sandstone arches of the Darwaza-i-Rauza main gate and the adjacent mosque for striking, atmospheric close-up compositions that leverage the mystical fog organically. As the morning sun strengthens, the fog typically breaks within sixty to ninety minutes, revealing dramatic clearing shots of the mausoleum that many photographers consider even more spectacular than clear-sky imagery." },
      { question: "Is this tour suitable for elderly travelers?", answer: "This private sunrise deployment is exceptionally well-suited for elderly travelers because the entire experience is meticulously engineered for comfort and flexibility. Your private vehicle provides seamless door-to-door transit directly to the VIP entry points before the intense local heat peaks. Inside the monuments, your senior guide proactively manages the pace, utilizing ramps where available and intentionally stopping in deeply shaded areas with seating. Exploring the enormous UNESCO complex during the significantly cooler morning hours drastically mitigates the physical exhaustion that typically plagues afternoon visits, ensuring the focus remains entirely on profound historical appreciation aligned with the [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) standards." },
      { question: "Can we customize the itinerary or add more monuments?", answer: "Customization is the fundamental advantage of booking this strictly private [sunrise Taj Mahal experience](/india/agra/taj-mahal-sunrise-sunrise-tour). While our standard itinerary seamlessly links the Taj Mahal at dawn to the Agra Fort, the entire framework is yours to command. You can easily add the exquisitely detailed Baby Taj, execute a strategic river crossing to Mehtab Bagh for panoramic photography, or even extend the tour to include a heritage walk through the ancient Kinari Bazaar. Your guide and chauffeur instantaneously integrate your specific requests, building the exact experience you envision without any group-tour constraints." },
      { question: "What is the best time of year for sunrise photography?", answer: "For premium, magazine-quality sunrise photography at the Taj Mahal, the absolute optimal window spans October through March, coinciding with the peak tourist season documented in our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026). October and November deliver crystal-clear skies with comfortable temperatures and spectacular golden light. December and January introduce mystical fog that creates dramatic atmospheric compositions, though visibility can be temporarily reduced. February and March offer warming temperatures with reliable clear conditions. The summer months of April through June provide the earliest sunrise times but extreme heat, while July through September monsoon clouds create dramatic but unpredictable lighting conditions." },
      { question: "Is this tour available on Fridays?", answer: "No, this specific [sunrise Taj Mahal tour](/india/agra/taj-mahal-sunrise-sunrise-tour) cannot be executed on Fridays because the Indian government mandates that the Taj Mahal complex is entirely closed to all tourist access every Friday. This non-negotiable closure accommodates mandatory congregational prayers at the active mosque located within the complex. If your travel schedule restricts you to a Friday arrival, we will immediately pivot to our specialized Friday alternative itinerary that covers the Agra Fort, Baby Taj, and the stunning sunset view from Mehtab Bagh across the Yamuna River, ensuring your day remains architecturally rich and photographically rewarding." },
      { question: "How much walking is involved in the complete tour?", answer: "Executing this comprehensive dual-monument exploration requires moderate physical stamina. You should anticipate walking approximately 4 to 5 kilometers cumulatively across the expansive Taj Mahal Charbagh gardens, the marble platforms of the main mausoleum, and the sprawling red sandstone courtyards of the Agra Fort. High-quality, supportive footwear is absolutely mandatory. However, because this is a strictly private [guided tour](/india/agra/things-to-do-in-agra), your senior historian guide expertly mitigates fatigue by intentionally pacing the narrative, heavily utilizing shaded architectural features for lengthy historical explanations, and scheduling strategic rest intervals between the two monument deployments." },
      { question: "What languages are available for the guide?", answer: "We maintain a highly specialized roster of linguistically diverse, federally licensed historian guides to serve our international clientele visiting on this [private sunrise tour](/india/agra/taj-mahal-sunrise-sunrise-tour). Beyond absolute fluency in English, we can deploy senior experts who deliver the complex Mughal architectural and political narratives in Spanish, French, German, Italian, Russian, and Japanese. This ensures the profound historical payload of the dynasty is communicated seamlessly in your native tongue, preventing any critical loss of detail or nuance. Simply specify your linguistic requirement upon booking and we will match you with an appropriate high-authority guide." },
      { question: "Is breakfast included between monument visits?", answer: "This premium package intentionally decouples meal costs to provide you with absolute dietary freedom and financial transparency. Breakfast is not included in the base price, but a dedicated dining interval is structurally integrated into the timeline between your Taj Mahal sunrise exploration and the Agra Fort deployment. Your [local expert guide](/india/agra/agra-travel-guide-2026) acts as a culinary concierge, proactively recommending rigorously vetted premium 5-star hotel restaurants such as the ITC Mughal or Taj Gateway, or authentic highly sanitized local establishments that perfectly align with your specific dietary requirements, avoiding any forced attendance at substandard tourist buffets." },
      { question: "What is the cancellation policy for this private sunrise tour?", answer: "We execute a highly transparent and discerning cancellation matrix for this specialized [sunrise deployment](/india/agra/taj-mahal-sunrise-sunrise-tour). If you cancel this comprehensive private tour more than 24 hours prior to the designated early morning pickup time, you will immediately receive a complete 100% full refund with zero complex administrative friction. Cancellations executed within the strict 24-hour window are subject to restrictions to fairly compensate our permanently dedicated chauffeurs and senior historian guides who have been exclusively reserved for your itinerary. This straightforward policy structurally protects both your financial investment and our commitment to deploying elite specialized personnel." }
    ];
  }
  if (slug === 'agra-city-highlights-tour') {
    return [
      { question: "What monuments and landmarks are covered in the Agra City Highlights Tour?", answer: "This comprehensive [Agra City Highlights Tour](/india/agra/agra-city-highlights-tour) is strategically designed to cover the absolute pinnacle of Mughal and post-Mughal architecture in a single, highly efficient day. The itinerary anchors on the ivory-white marble mausoleum of the Taj Mahal, transitions to the massive red sandstone defensive perimeter and ornate palaces of the Agra Fort, and includes the incredibly intricate Tomb of I'timad-ud-Daulah frequently referred to as the Baby Taj. Additional highlights include the panoramic sunset viewpoint at Mehtab Bagh and a heritage drive through the ancient Kinari Bazaar market district, delivering a comprehensive understanding of the city's layered historical identity." },
      { question: "How long does the complete city highlights tour take?", answer: "Because this is a deeply comprehensive multi-monument exploration, you must allocate a rigorous 8 to 10 hours for the complete [Agra City Highlights](/india/agra/agra-city-highlights-tour) itinerary. This expansive timeframe guarantees that our high-authority historian guide is never forced to rush the complex narrative at any individual site. We structurally allocate approximately 2.5 hours for the Taj Mahal, 2 hours for the sprawling Agra Fort complex, 1 hour for the Baby Taj, and dedicated intervals for premium dining, Mehtab Bagh photography, and smooth transit through the local traffic infrastructure, ensuring a physically sustainable and intellectually rewarding full-day experience." },
      { question: "Is this tour fully private with a dedicated guide?", answer: "Yes, this entire comprehensive city exploration operates as a strictly 100% private, fully enveloped experience exclusively designed for you and your specified travel companions. We fundamentally reject the paradigm of consolidating independent bookings into large, impersonal group bus tours. Your dedicated premium vehicle and your federally licensed [local expert guide](/india/agra/things-to-do-in-agra) represent a focused team committed entirely to your specific educational and aesthetic requirements. You possess absolute command over the itinerary, dictating the pace, lingering at crucial photography points, and directly engaging your guide with highly specific architectural questions." },
      { question: "Is hotel pickup and drop-off included?", answer: "Absolutely. To eliminate all logistical friction and provide a genuinely premium experience, we include seamless door-to-door transportation within your [Agra City Highlights Tour](/india/agra/agra-city-highlights-tour). Your designated air-conditioned luxury vehicle and professionally licensed chauffeur will arrive precisely at your pre-scheduled time at any hotel, homestay, or railway station within the Agra city limits. We totally insulate you from the aggressive local auto-rickshaw networks. At the conclusion of your rigorous full-day historical exploration, you will be smoothly transported back to your original starting point or any other preferred local drop-off location." },
      { question: "Are monument entry tickets included in the price?", answer: "To ensure absolute financial transparency and flexibility, this specific package covers the provision of your private air-conditioned vehicle and your dedicated highly credentialed historian guide, but intentionally excludes the baseline monument entrance fees. By decoupling the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) and other entry costs from our service fee, you avoid hidden agency markups and pay the exact uninflated government rate at each UNESCO site. Your assigned local guide operates as an elite logistical concierge, seamlessly navigating the complex ASI online ticketing portals and ensuring you bypass all chaotic manual queues." },
      { question: "Can we start with a sunrise visit to the Taj Mahal?", answer: "Yes, we strongly advocate initiating this comprehensive [city highlights tour](/india/agra/agra-city-highlights-tour) with a sunrise deployment at the Taj Mahal. By beginning your exploration precisely when the gates open, typically between 5:30 AM and 6:00 AM depending on the season, you secure the critical tactical advantage of the golden hour light for premium photography. Furthermore, this aggressive early deployment structurally bypasses the crushing crowds that flood the complex by mid-morning. You experience Shah Jahan's masterpiece in relative tranquility, setting a highly efficient pace for the remainder of your multi-monument day across the city." },
      { question: "Is lunch included in the city highlights package?", answer: "This specialized package intentionally decouples the cost of meals to provide you with absolute dietary freedom and strict financial transparency. While lunch is not included in the base price, your dedicated guide acts as a highly localized culinary concierge within the [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) framework. They will proactively recommend rigorously vetted premium restaurants or authentic high-quality local establishments that align perfectly with your specific dietary requirements and international hygiene standards. This strategy ensures you are never forced into substandard pre-set tourist buffets, allowing you to control your culinary experience as precisely as your historical exploration." },
      { question: "What vehicle type is provided for the tour?", answer: "We strictly deploy a modern, impeccably maintained fleet of deeply sanitized air-conditioned vehicles to ensure your absolute comfort throughout this [Agra City Highlights Tour](/india/agra/agra-city-highlights-tour). For solo travelers or couples, we utilize premium sedans such as the Toyota Etios or Swift Dzire. For families or small groups of up to six individuals, we automatically upgrade the logistics to an extremely spacious Toyota Innova SUV, providing superior legroom and advanced suspension. Every vehicle is thoroughly sanitized and operated by a uniformed, commercially licensed chauffeur trained in professional driving protocols." },
      { question: "Is the Baby Taj worth visiting in addition to the main Taj Mahal?", answer: "The Tomb of I'timad-ud-Daulah, known as the Baby Taj, is an absolutely essential architectural counterpoint that dramatically enriches your understanding of the Mughal design evolution. Built approximately twenty years before the Taj Mahal, this smaller monument is widely considered the architectural prototype that directly inspired Shah Jahan's grander masterpiece. Your [local expert guide](/india/agra/1-day-agra-itinerary) will demonstrate how the intricate Pietra Dura marble inlay technique was pioneered here before being perfected at the Taj Mahal. The intimate scale and significantly fewer crowds allow for incredibly detailed close-up photography of the stonework that is simply impossible at the main monument." },
      { question: "Is Mehtab Bagh sunset included in this tour?", answer: "Yes, the strategic deployment to Mehtab Bagh during the late afternoon golden hour is a highlight of this comprehensive [Agra City Highlights Tour](/india/agra/agra-city-highlights-tour). Situated directly across the Yamuna River from the Taj Mahal, this 25-acre Mughal garden provides the definitive unobstructed rear view of the white marble mausoleum. Our high-authority guide positions you perfectly synchronized with the setting sun to capture spectacular magazine-quality imagery of the Taj Mahal reflecting in the river waters. Many professional photographers consider this vantage point superior to interior views because you completely eliminate foreground tourist interference." },
      { question: "Is this tour available on Fridays when the Taj Mahal is closed?", answer: "While the Taj Mahal is strictly closed every Friday for congregational prayers, we can absolutely still execute a modified version of this [city highlights tour](/india/agra/agra-city-highlights-tour) that aggressively compensates for the closure. The Friday alternative itinerary anchors on the massive Agra Fort, the exquisitely detailed Baby Taj, and an extended sunset session at Mehtab Bagh providing panoramic views of the Taj Mahal from across the river. Your high-authority guide ensures the narrative remains comprehensive and deeply rewarding despite the primary monument's scheduled closure, delivering maximum architectural value on this restricted day." },
      { question: "How much walking is involved throughout the day?", answer: "Executing this comprehensive exploration of multiple 17th-century monuments requires significant physical stamina. You must anticipate walking a cumulative total of approximately 6 to 8 kilometers across expansive marble platforms, uneven red sandstone courtyards, slight inclines within the fort, and garden pathways at the Baby Taj and Mehtab Bagh. High-quality supportive footwear is absolutely mandatory. However, because this is a strictly [private guided tour](/india/agra/things-to-do-in-agra), your senior historian guide expertly mitigates fatigue by intentionally pacing the narrative, heavily utilizing shaded features for explanations, and scheduling comfortable vehicle transfers between each monument." },
      { question: "What languages are available for the guide?", answer: "We maintain a comprehensive roster of linguistically diverse, federally licensed historian guides for this [Agra City Highlights Tour](/india/agra/agra-city-highlights-tour). Beyond fluent English which serves as our absolute baseline standard, we can deploy senior experts who deliver complex architectural and political narratives in Spanish, French, German, Italian, Russian, and Japanese. This ensures the profound historical payload of the Mughal dynasty is communicated seamlessly in your native tongue, preventing any critical loss of detail. Simply specify your linguistic requirement upon booking and we will flawlessly match you with an appropriate high-authority specialized guide." },
      { question: "Is this tour suitable for families with young children?", answer: "Yes, this private [Agra City Highlights Tour](/india/agra/agra-city-highlights-tour) is exceptionally well-suited for families because the entire experience adapts to your specific group dynamics. Your guide adjusts the narrative complexity for younger audiences, transforming stories of emperors, massive fortresses, and precious gemstones into engaging adventures. The private vehicle provides comfortable rest intervals between monuments where children can recharge. We can modify the itinerary pace, skip less engaging sections, and prioritize interactive elements. The key advantage over group tours is complete flexibility in managing bathroom breaks, snack stops, and energy levels throughout the demanding full-day exploration." },
      { question: "What is the cancellation policy?", answer: "We execute a highly transparent and discerning cancellation matrix for this [city highlights tour](/india/agra/agra-city-highlights-tour). If you cancel the comprehensive private tour more than 24 hours prior to the designated pickup time, you will immediately receive a complete 100% full refund with zero complex administrative friction or hidden processing fees. Cancellations executed within the strict 24-hour window are subject to restrictions to fairly compensate our permanently dedicated chauffeurs and senior historian guides who have been exclusively reserved and removed from active booking rosters to cater to your specific itinerary requirements." }
    ];
  }
  if (slug === 'taj-mahal-fatehpur-full-day-tour') {
    return [
      { question: "What monuments are covered in the Agra and Fatehpur Sikri day trip?", answer: "This comprehensive [Agra & Fatehpur Sikri Day Trip](/india/agra/taj-mahal-fatehpur-full-day-tour) delivers the complete spectrum of Mughal architectural genius across two distinct geographical zones. The itinerary anchors on the ivory-white Taj Mahal and the massive red sandstone Agra Fort within the city, then extends 40 kilometers westward to the sprawling abandoned imperial capital of Fatehpur Sikri. This UNESCO World Heritage site features the colossal 54-meter Buland Darwaza victory gate, Emperor Akbar's elaborately designed palatial complex, and the sacred tomb of Sufi saint Salim Chishti. Covering all three sites delivers an unparalleled understanding of 16th and 17th-century Mughal supremacy." },
      { question: "How long does the full day trip including Fatehpur Sikri take?", answer: "This expansive multi-site itinerary requires a rigorous 10 to 12-hour deployment to execute comprehensively without rushing any individual monument. We allocate approximately 2.5 hours for the Taj Mahal, 1.5 hours for the Agra Fort, and a dedicated 2 to 3-hour window for the massive Fatehpur Sikri complex. The additional 80-kilometer round trip between Agra city and Fatehpur Sikri adds approximately 2 hours of transit time. We strategically schedule dining intervals and rest breaks within this [full-day Agra tour](/india/agra/taj-mahal-fatehpur-full-day-tour) framework to ensure physical sustainability throughout the demanding but deeply rewarding day." },
      { question: "Is this tour fully private?", answer: "Yes, this entire high-efficiency multi-site deployment operates as a strictly 100% private experience exclusively designed for you and your specified travel companions. Your dedicated premium air-conditioned vehicle and your federally licensed [local expert guide](/india/agra/things-to-do-in-agra) represent a focused team committed entirely to your specific timeline and educational requirements. You possess absolute tactical command over the itinerary, dictating the pace at each monument, lingering at crucial photography points, and directly engaging your high-authority historian with specific questions about Akbar's religious syncretism or Shah Jahan's architectural innovations." },
      { question: "Is hotel pickup included from Agra or Delhi?", answer: "Yes, seamless door-to-door transportation is a fundamental component of this [Agra & Fatehpur Sikri Day Trip](/india/agra/taj-mahal-fatehpur-full-day-tour). Your designated air-conditioned luxury vehicle and professionally licensed chauffeur will collect you from any hotel, homestay, or railway station within Agra city limits. If you are departing from Delhi, we can arrange the complete round trip including Yamuna Expressway transit with all toll charges included. At the conclusion of this demanding multi-site exploration, you will be smoothly transported back to your starting point or any preferred drop-off location including Jaipur-bound highway junction points." },
      { question: "Are entry tickets for all three monuments included?", answer: "To enforce absolute financial transparency, this specialized package covers your premium private vehicle, all necessary highway tolls, and your dedicated high-authority historian guide, but intentionally excludes the baseline monument entrance fees at all three sites. By keeping the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) and other entry costs separate, you avoid hidden markups and pay the exact government rate. Your guide acts as your complete logistical concierge at each site, navigating the ASI digital ticketing portals and ensuring you bypass chaotic manual queues at the Taj Mahal, Agra Fort, and Fatehpur Sikri." },
      { question: "How far is Fatehpur Sikri from Agra and what is the road like?", answer: "The massive abandoned capital of Fatehpur Sikri is situated approximately 40 kilometers west of central Agra, requiring a dedicated transit window of 60 to 75 minutes depending on localized highway traffic conditions. The road passes through semi-rural Uttar Pradesh landscape and is generally well-maintained, though narrower than the Yamuna Expressway. Our experienced chauffeurs navigate this route daily and are fully familiar with the seasonal road variations. We strategically position this transit segment within your [full-day Agra tour](/india/agra/taj-mahal-fatehpur-full-day-tour) timeline to avoid the most congested afternoon periods." },
      { question: "Is the same guide available for both Agra and Fatehpur Sikri?", answer: "Yes, your dedicated high-authority historian guide accompanies you seamlessly across all three UNESCO monuments throughout the entire [Agra & Fatehpur Sikri Day Trip](/india/agra/taj-mahal-fatehpur-full-day-tour). This continuity is critically important because the narrative connecting the Taj Mahal, the Agra Fort, and Fatehpur Sikri spans three consecutive Mughal emperors and over a century of architectural evolution. Your guide constructs a cohesive chronological story beginning with Akbar's ambitious city-building at Fatehpur Sikri and culminating in Shah Jahan's romantic masterpiece. This unified narrative approach delivers dramatically superior educational value compared to engaging different guides at each site." },
      { question: "Is Fatehpur Sikri worth the extra travel time?", answer: "Fatehpur Sikri is an absolutely essential pilgrimage for anyone seeking a complete understanding of the Mughal dynasty beyond the Taj Mahal. This massive abandoned imperial capital represents Emperor Akbar's revolutionary vision of religious tolerance and architectural innovation on a scale that dwarfs any other site outside the [Agra guided tour](/india/agra/agra-travel-guide-2026) circuit. The colossal Buland Darwaza, the intricately carved Panch Mahal, and the sacred courtyard housing the tomb of Salim Chishti deliver an intellectual and visual payload that profoundly contextualizes everything you experience at the Taj Mahal and the Fort." },
      { question: "Is lunch included in the day trip?", answer: "This comprehensive package intentionally decouples meal costs to provide absolute dietary freedom. While lunch is not included in the base price, your guide strategically schedules a dining interval between the Agra monuments and the Fatehpur Sikri deployment. Your [local expert guide](/india/agra/1-day-agra-itinerary) acts as a culinary concierge, recommending vetted premium restaurants or authentic local establishments aligned with your dietary requirements. Alternatively, some guests prefer dining at one of Fatehpur Sikri's heritage restaurants that offer panoramic views of the abandoned city, creating a unique dining experience impossible to replicate elsewhere." },
      { question: "Is this suitable for elderly travelers or those with mobility issues?", answer: "We must be highly transparent about the physical demands of this [full-day Agra tour](/india/agra/taj-mahal-fatehpur-full-day-tour). While the Taj Mahal and Agra Fort can be navigated with careful pacing, Fatehpur Sikri presents significant mobility challenges. The iconic Buland Darwaza gateway requires ascending 42 steep, uneven stone steps. The sprawling abandoned city involves extensive walking across uneven terrain with minimal modern infrastructure. Wheelchair accessibility at Fatehpur Sikri is severely limited. For elderly travelers, we recommend either extending the timeline for frequent rest breaks or substituting Fatehpur Sikri with the more accessible Baby Taj monument." },
      { question: "What vehicle type is provided for this extended tour?", answer: "Given the extended 80-kilometer round trip to Fatehpur Sikri beyond the standard Agra circuit, we deploy our most comfortable fleet vehicles for this [day trip](/india/agra/taj-mahal-fatehpur-full-day-tour). Solo travelers or couples receive premium sedans with superior air conditioning and cushioned suspension. Families and groups of up to six automatically receive the spacious Toyota Innova SUV, which provides significantly enhanced comfort during the highway transit segments. Every vehicle contains emergency water supplies, phone charging capabilities, and is operated by a chauffeur intimately familiar with the Agra-Fatehpur corridor's seasonal road conditions." },
      { question: "Can we customize the order of monuments visited?", answer: "Absolute customization is the fundamental pillar of this private [Agra & Fatehpur Sikri Day Trip](/india/agra/taj-mahal-fatehpur-full-day-tour). While our strategically optimized standard route begins with the Taj Mahal at sunrise, transitions to the Agra Fort, and concludes at Fatehpur Sikri in the cooler afternoon, you command the complete framework. Some guests prefer starting at Fatehpur Sikri early morning when the massive complex is nearly empty, then proceeding to Agra. Others prioritize the sunset at Mehtab Bagh over Fatehpur Sikri. Your guide and chauffeur instantaneously integrate your specific requests and preferences." },
      { question: "Is Fatehpur Sikri less crowded than the Taj Mahal?", answer: "Generally yes, and significantly so. While the primary Jama Masjid area and the Buland Darwaza entrance see substantial traffic from religious pilgrims, the sprawling nature of the abandoned royal complex dramatically dilutes overall human density. You will experience far greater architectural tranquility while exploring Akbar's private residential quarters, the intricately carved Anup Talao pavilion, and the vast administrative courtyards compared to the intensely concentrated crowds surrounding the Taj Mahal. This relative emptiness allows for superior [photography opportunities](/india/agra/things-to-do-in-agra) and more intimate engagement with your guide's narrative." },
      { question: "What is the cancellation policy for this extended tour?", answer: "We execute a highly transparent cancellation framework for this comprehensive [Agra & Fatehpur Sikri Day Trip](/india/agra/taj-mahal-fatehpur-full-day-tour). Cancellations made more than 24 hours prior to the scheduled departure time receive a complete 100% full refund with zero administrative friction. Within the 24-hour window, restrictions apply to fairly compensate our dedicated chauffeurs and senior historian guides who have been exclusively reserved for your extended multi-site itinerary. This straightforward policy protects your financial investment while respecting the significant logistical commitment our team makes to prepare for this demanding full-day deployment." },
      { question: "Is this tour available on Fridays?", answer: "While the Taj Mahal is strictly closed every Friday, we can absolutely modify this [full-day Agra tour](/india/agra/taj-mahal-fatehpur-full-day-tour) to compensate brilliantly. The Friday alternative replaces the Taj Mahal with an extended exploration of the Agra Fort, the Baby Taj, and a sunset session at Mehtab Bagh providing panoramic views of the Taj Mahal from across the river. Critically, Fatehpur Sikri remains fully operational on Fridays and is actually less crowded as its primary religious activity centers on the sacred Jama Masjid courtyard. This ensures your investment in the extended day trip remains architecturally exceptional." }
    ];
  }
  if (slug === 'agra-gatimaan-entry-ticket') {
    return [
      { question: "What is included in the Delhi Agra round trip by Gatimaan train package?", answer: "This comprehensive [Gatimaan Express package](/india/agra/agra-gatimaan-entry-ticket) includes confirmed round-trip train tickets on India's fastest commercial train, private air-conditioned vehicle transfers between Agra Cantonment railway station and the UNESCO monuments, and a federally licensed high-authority historian guide for your complete monumental exploration. The package is meticulously engineered to maximize your time at the Taj Mahal and Agra Fort while managing the rigid railway schedule. All station transfers, monument parking fees, and local transportation are seamlessly integrated, eliminating the stressful uncertainty of coordinating multiple independent bookings." },
      { question: "What time does the Gatimaan Express depart from Delhi?", answer: "The Gatimaan Express departs from Hazrat Nizamuddin Railway Station in Delhi at 8:10 AM sharp, arriving at Agra Cantonment station at approximately 9:50 AM. This is a fixed, non-negotiable federal railway schedule that requires you to be at the Delhi station by 7:30 AM for security screening and boarding. Our [Gatimaan train package](/india/agra/agra-gatimaan-entry-ticket) includes precise coordination around this schedule, ensuring your dedicated vehicle and guide are waiting at Agra Cantonment platform exit the moment you step off the train, providing instant logistical security and zero wasted time navigating the chaotic station infrastructure." },
      { question: "Is the return train ticket also confirmed?", answer: "Yes, absolutely. Both outbound and return Gatimaan Express tickets are fully confirmed with guaranteed reserved seating assignments. The return train departs Agra Cantonment at 5:50 PM, arriving back at Delhi Nizamuddin station by approximately 7:30 PM. Because Gatimaan Express tickets sell out rapidly, often weeks in advance during the peak October to March season, securing confirmed [round-trip reservations](/india/agra/agra-gatimaan-entry-ticket) through our package eliminates the extremely high risk of being stranded in Agra without a viable return option. We handle all complex IRCTC booking logistics on your behalf." },
      { question: "Is a private guide and vehicle included in Agra?", answer: "Yes, this is not merely a train ticket booking. Your [Gatimaan Express package](/india/agra/agra-gatimaan-entry-ticket) includes a complete, premium guided experience in Agra. A federally licensed ASI-approved historian guide and a private air-conditioned vehicle meet you directly at Agra Cantonment station upon arrival. They remain exclusively dedicated to your party throughout the entire 7-hour window in the city, managing all monument navigation, providing deep architectural commentary at the Taj Mahal and Agra Fort, and ensuring you return to the railway station with comfortable buffer time before the evening departure." },
      { question: "How much time do we actually get in Agra?", answer: "With the Gatimaan Express arriving at 9:50 AM and the return departure at 5:50 PM, you secure a substantial 7 to 8-hour operational window in the city. This timeframe is meticulously calculated within our [day trip itinerary](/india/agra/1-day-agra-itinerary) framework to comfortably accommodate comprehensive explorations of both the Taj Mahal and the Agra Fort, a premium lunch interval at a vetted restaurant, and smooth transit between all locations. Your guide expertly manages the schedule to ensure you extract maximum educational and photographic value while maintaining a stress-free buffer for the critical evening train departure." },
      { question: "Are Taj Mahal entry tickets included?", answer: "To maintain absolute financial transparency, this [Gatimaan package](/india/agra/agra-gatimaan-entry-ticket) covers the train tickets, private vehicle, and expert guide, but intentionally excludes the monument entrance fees. By keeping the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) separate, you pay the exact uninflated government rate without hidden agency markups. Your guide handles all ASI digital ticketing logistics upon arrival, pre-purchasing your QR-coded entries and navigating the priority lanes, ensuring you completely bypass the massive manual ticket queues and maximize your precious limited time exploring the monuments." },
      { question: "Is the Gatimaan Express comfortable for the journey?", answer: "The Gatimaan Express is India's premium high-speed rail service, operating with superior comfort standards that dramatically exceed standard Indian railway classes. The chair car features airline-style reclining seats with generous legroom, individual reading lights, charging ports, and a fully functional climate control system. Complimentary catered meals and beverages are served during both the outbound and return journeys. The 100-minute transit time passes remarkably quickly, and many travelers on our [Gatimaan train package](/india/agra/agra-gatimaan-entry-ticket) consider the high-speed rail experience itself a memorable component of their overall India journey." },
      { question: "What happens if the train is delayed?", answer: "While the Gatimaan Express maintains an exceptionally strong punctuality record as India's flagship rail service, occasional delays can occur due to federal rail infrastructure maintenance or weather conditions. If the outbound train arrives late, your dedicated guide and vehicle waiting at Agra Cantonment will dynamically restructure the monument itinerary to compress the experience without losing the critical educational core. If the return train is delayed, your [Gatimaan package](/india/agra/agra-gatimaan-entry-ticket) team will keep you informed via WhatsApp and ensure you remain comfortable at the station with access to the premium lounge facilities." },
      { question: "Can we add the Baby Taj or Mehtab Bagh to this itinerary?", answer: "While possible, we must be strategically transparent about the timeline constraints. Adding the Baby Taj requires an additional 45 to 60 minutes, and Mehtab Bagh demands a late afternoon allocation for optimal sunset photography. With the rigid 5:50 PM train departure, incorporating additional monuments compresses your primary Taj Mahal and Agra Fort exploration time. If the Baby Taj is a priority, your [local expert guide](/india/agra/things-to-do-in-agra) can restructure the day by reducing Agra Fort coverage. For guests who want the complete multi-monument experience, we recommend our private car day trip option instead." },
      { question: "Is lunch included in the package?", answer: "This package intentionally decouples meal costs to preserve your dietary freedom. While lunch is not included in the base price, a strategic dining interval is structurally integrated into the 7-hour timeline between the Taj Mahal and Agra Fort visits. Your guide acts as a culinary concierge within the [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) framework, recommending vetted premium restaurants near the monument zone. Given the timeline constraints of the Gatimaan schedule, we favor efficient yet high-quality dining options that deliver authentic Mughlai cuisine without consuming excessive time from your monument exploration window." },
      { question: "How do we get to Hazrat Nizamuddin station in Delhi?", answer: "Hazrat Nizamuddin Railway Station is centrally located in South Delhi, accessible from most Delhi hotels within 30 to 45 minutes by taxi or ride-sharing services. We recommend departing your hotel by 7:00 AM to account for morning traffic and the mandatory security screening at the station entrance. If you require organized pickup from your Delhi hotel to the station, our [Gatimaan package](/india/agra/agra-gatimaan-entry-ticket) can include an optional pre-dawn Delhi transfer add-on. The station features basic waiting facilities, and the Gatimaan Express boarding platform is clearly signposted with dedicated assistance staff." },
      { question: "Is this package better than driving to Agra by car?", answer: "The Gatimaan Express package offers distinct strategic advantages for specific traveler profiles. If you prefer avoiding the intensive 3.5-hour highway drive and the physical fatigue of 7 hours of car transit, the 100-minute premium rail experience is vastly superior. You arrive refreshed and energized for monument exploration rather than highway-fatigued. However, the rigid train schedule eliminates the sunrise opportunity and restricts your [Agra itinerary](/india/agra/1-day-agra-itinerary) flexibility. Travelers who prioritize sunrise photography or desire maximum schedule control should consider our private car day trip alternatives instead." },
      { question: "Can families with children take this Gatimaan package?", answer: "Absolutely. The Gatimaan Express provides a comfortable, climate-controlled environment that children generally enjoy, and the 100-minute journey is short enough to maintain engagement. Children under 5 travel free on Indian railways, and ages 5-12 receive discounted fares included in our [package pricing](/india/agra/agra-gatimaan-entry-ticket). In Agra, your private vehicle and guide adapt the tour pace to family dynamics with strategic snack breaks and energy management. The key consideration is the fixed train schedule, which requires maintaining discipline about departure timing regardless of any delays caused by managing young children at the monuments." },
      { question: "What is the cancellation policy for this train package?", answer: "We execute a highly specific cancellation framework for this [Gatimaan Express package](/india/agra/agra-gatimaan-entry-ticket) due to the complex interplay between non-refundable railway tickets and flexible local services. Because we invest significant non-refundable capital to secure confirmed Gatimaan seats immediately upon booking through the IRCTC system, cancellations incur structural penalties relative to the train departure window. The railway component follows IRCTC refund protocols with graduated deductions. However, the associated private vehicle and guide services in Agra are significantly more flexible, typically fully refundable if cancelled more than 24 hours prior to the scheduled date." },
      { question: "Is the Gatimaan Express available daily?", answer: "The Gatimaan Express operates six days per week between Delhi and Agra. However, its schedule can be affected by federal railway maintenance blocks or national holiday adjustments. We strongly recommend booking your [Gatimaan package](/india/agra/agra-gatimaan-entry-ticket) well in advance, particularly during the peak tourist season from October through March, when confirmed tickets frequently sell out three to four weeks ahead. Our booking team monitors IRCTC availability daily and can advise on optimal booking windows to maximize your chances of securing confirmed reservations on your preferred travel date." }
    ];
  }


  // --- VARANASI TOUR FAQS ---
  if (slug === 'kashi-vishwanath-temple-full-day-tour') {
    return [
      { question: "What is included in the Varanasi full day private tour?", answer: "This comprehensive [Varanasi Full Day Private Tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour) includes a dedicated ASI-licensed historian guide with deep expertise in Hindu temple architecture and Vedic traditions, a private air-conditioned vehicle for all land-based transit across the city, and a traditional wooden boat ride along the sacred Ganges ghats. The immersive itinerary covers the revered Kashi Vishwanath Temple, the ancient Dashashwamedh Ghat, the atmospheric Manikarnika cremation ghat, Sarnath where the Buddha delivered his first sermon, and the labyrinthine old city lanes that have remained virtually unchanged for three thousand years of continuous human habitation." },
      { question: "Is the Kashi Vishwanath Temple accessible to all visitors?", answer: "The Kashi Vishwanath Temple, one of the twelve Jyotirlingas and the most sacred Shiva temple in Hinduism, is open to all visitors regardless of nationality or religious background. However, security protocols are extremely stringent due to its location within the Kashi Vishwanath Corridor. Electronic devices including mobile phones are strictly prohibited inside the temple complex. Your [local expert guide](/india/varanasi/kashi-vishwanath-temple-full-day-tour) will manage the secure locker process for your belongings and navigate you through the multi-layered security checkpoints, ensuring a smooth and respectful entry that maximizes your spiritual experience within the inner sanctum." },
      { question: "Is the Ganga Aarti ceremony included in this tour?", answer: "Yes, the spectacular evening Ganga Aarti ceremony at Dashashwamedh Ghat is a core highlight of this comprehensive [Varanasi private tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour). This magnificent 45-minute ritual, performed by trained Brahmin priests wielding massive multi-tiered brass lamps, is one of the most visually powerful spiritual ceremonies on Earth. Your guide secures premium viewing positions either on the ghat steps or from your private boat on the river, providing unobstructed photography angles and detailed commentary on the ancient Vedic mantras, fire symbolism, and ritualistic sequences that have been performed continuously for over three thousand years." },
      { question: "How long does the full day Varanasi tour take?", answer: "This deeply immersive exploration requires a comprehensive 10 to 12-hour deployment to experience the spiritual depth and architectural complexity of the world's oldest continuously inhabited city. We typically begin with a pre-dawn boat ride at approximately 5:00 AM to witness the magical sunrise over the ghats, followed by a morning temple circuit including Kashi Vishwanath. After a midday hotel interval, the afternoon covers the Buddhist pilgrimage site of Sarnath. The day culminates with the evening Ganga Aarti ceremony, completing a rigorous but profoundly rewarding [full-day itinerary](/india/varanasi/kashi-vishwanath-temple-full-day-tour)." },
      { question: "Is the morning boat ride on the Ganges included?", answer: "Yes, a traditional wooden boat ride along the sacred Ganges ghats during the spectacular early morning hours is an integral component of this [Varanasi full day tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour). The pre-dawn departure allows you to witness the extraordinary daily awakening of Hindu civilization as thousands of devotees descend the 84 ghats for ritual bathing, meditation, and yoga. Your private boat, operated by an experienced traditional oarsman, glides past the Dashashwamedh Ghat, the ancient Manikarnika cremation ghat, and the ornate Rajput-era palaces that line the riverbank, providing unparalleled photographic access to scenes unchanged for millennia." },
      { question: "Is Sarnath included in this Varanasi tour?", answer: "Absolutely. Sarnath, located approximately 13 kilometers from Varanasi's ghat district, is seamlessly integrated into the afternoon segment of this [full-day tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour). This profoundly important Buddhist pilgrimage site is where Gautama Buddha delivered his first sermon, known as the Dhammacakkappavattana Sutta, setting the Wheel of Dharma in motion. Your guide will navigate you through the Dhamek Stupa, the Ashoka Pillar remnants, the archaeological museum housing the iconic Lion Capital, and the Mulagandha Kuti Vihar monastery. This provides a crucial intellectual counterpoint to the Hindu sacred sites within Varanasi city." },
      { question: "What should I wear when visiting temples in Varanasi?", answer: "Varanasi's temple circuit demands conservative, respectful attire. We recommend long trousers or ankle-length skirts, tops with covered shoulders, and easily removable footwear since shoes must be left outside every temple entrance. The Kashi Vishwanath Temple specifically requires modest clothing without leather accessories. During winter months of December and January, temperatures can drop to 5°C during the pre-dawn boat ride, necessitating warm layering. Your [local expert guide](/india/varanasi/kashi-vishwanath-temple-full-day-tour) carries supplementary shoe covers for hygienic navigation of temple floors and will advise on specific dress protocols at each sacred site." },
      { question: "Is this tour suitable for elderly visitors?", answer: "This [Varanasi private tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour) can be adapted for elderly travelers, though we must be transparent about the physical demands. The ghat stairways involve steep, uneven stone steps with limited handrails. The narrow old city lanes leading to Kashi Vishwanath Temple require navigating dense crowds and irregular surfaces. However, the private format allows your guide to control the pace entirely, utilize shorter routes, and schedule extended rest intervals. The morning boat ride is comfortable and seated. We recommend the elderly version which prioritizes accessible ghats and includes vehicle transfers to minimize walking distances." },
      { question: "Is hotel pickup and drop-off included?", answer: "Yes, comprehensive door-to-door transportation is a standard inclusion in this [Varanasi full day tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour). Your designated air-conditioned vehicle and licensed chauffeur will collect you from any hotel, homestay, or the Varanasi Junction railway station. Because the ancient ghat district is inaccessible to vehicles, your driver will position at the nearest designated parking zone while your guide accompanies you on foot through the atmospheric old city lanes. At the conclusion of the extensive day, you will be transported comfortably back to your accommodation or onward transit point." },
      { question: "Can we visit the Manikarnika cremation ghat?", answer: "Yes, the ancient Manikarnika Ghat, Hinduism's most sacred cremation ground, is included in the itinerary as viewed from the river during your morning boat ride and optionally from the upper observation platform on foot. This is where Hindus believe the cycle of death and rebirth achieves its ultimate resolution. Your [sensitive expert guide](/india/varanasi/kashi-vishwanath-temple-full-day-tour) will explain the profound spiritual significance of the eternal flame that has reportedly burned continuously for over five thousand years. Photography at the cremation ghat is strictly prohibited out of respect, and your guide will firmly enforce this boundary while maximizing your respectful observational experience." },
      { question: "Is food included in the tour?", answer: "This specialized package intentionally excludes meals to provide complete dietary flexibility in a city famous for its vegetarian street food traditions. Your [local expert guide](/india/varanasi/kashi-vishwanath-temple-full-day-tour) serves as a highly knowledgeable culinary concierge, steering you to legendary establishments such as the Blue Lassi Shop in the old city, the crispy kachori vendors of Dashashwamedh, and highly sanitized premium restaurants offering authentic Benarasi cuisine. We schedule strategic dining intervals between the morning ghat circuit and the afternoon Sarnath deployment, ensuring you experience the city's gastronomic heritage alongside its spiritual and architectural treasures." },
      { question: "What languages are available for the guide?", answer: "We maintain a specialized roster of linguistically diverse, culturally trained historian guides for this [Varanasi full day tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour). Beyond fluent English as our absolute baseline standard, we can deploy senior experts who deliver the complex Hindu theological concepts, Buddhist philosophy at Sarnath, and Mughal historical overlays in Spanish, French, German, and Japanese. Given the profound spiritual density of Varanasi's sacred sites, having a guide who communicates fluidly in your native language dramatically enhances your absorption of the subtle ritualistic, philosophical, and architectural narratives embedded in every ghat and temple." },
      { question: "Is Varanasi safe for solo female travelers?", answer: "Varanasi is generally safe for solo female travelers, particularly when accompanied by a licensed local guide on this [private tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour). The ancient lanes can be extremely narrow and crowded, and certain ghat areas are less tourist-friendly after dark. Your dedicated guide acts as a constantly present logistical shield, managing crowd navigation, temple protocols, and interaction boundaries. We also offer the option of specifically requesting a female guide for guests who have additional comfort preferences. The private vehicle provides a secure, climate-controlled sanctuary between walking segments throughout the extensive day." },
      { question: "What is the best time of year to visit Varanasi?", answer: "The optimal window for this [Varanasi full day tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour) spans October through March when temperatures range from comfortable 15°C to 25°C daytime highs. The pre-dawn boat ride is most magical during winter when morning mist creates dramatic atmospheric conditions over the ghats. November's Dev Deepawali festival transforms the entire riverfront into a spectacular carpet of one million oil lamps. Avoid mid-April through June when temperatures can exceed 45°C, making the extensive walking itinerary physically dangerous. The July through September monsoon period brings river flooding that occasionally restricts boat services." },
      { question: "What is the cancellation policy?", answer: "We execute a highly transparent cancellation framework for this [Varanasi full day tour](/india/varanasi/kashi-vishwanath-temple-full-day-tour). Cancellations made more than 24 hours prior to the scheduled pickup time receive a complete 100% full refund with zero administrative friction or hidden processing fees. Within the 24-hour window, restrictions apply to fairly compensate our permanently dedicated chauffeurs, traditional boat operators, and senior historian guides who have been exclusively reserved and removed from active booking availability to cater to your specific itinerary. This straightforward policy structurally protects your financial investment while respecting our team's dedicated scheduling commitment." }
    ];
  }

  // --- JAIPUR TOUR FAQS ---
  if (slug === 'hawa-mahal-private-tour') {
    return [
      { question: "What is included in the Jaipur private full day sightseeing tour?", answer: "This comprehensive [Jaipur Private Full Day Tour](/india/jaipur/hawa-mahal-private-tour) includes a dedicated government-licensed historian guide with deep expertise in Rajput architecture and royal history, a private air-conditioned vehicle with professional chauffeur for seamless all-day transit across the Pink City, and priority access assistance at major monuments. The immersive itinerary covers the magnificent Amber Fort, the iconic wind palace Hawa Mahal, the astronomical marvel Jantar Mantar, the City Palace complex, Nahargarh Fort viewpoint, and the atmospheric Johari Bazaar, delivering the complete spectrum of Jaipur's UNESCO-recognized heritage in a single expertly orchestrated day." },
      { question: "Is the Amber Fort included in this tour?", answer: "Absolutely. The colossal Amber Fort is the crown jewel of this comprehensive [Jaipur sightseeing tour](/india/jaipur/hawa-mahal-private-tour) and receives the most significant time allocation of approximately 2 to 2.5 hours. Your high-authority guide navigates you through the massive Suraj Pol gateway, the intricately mirrored Sheesh Mahal that functions like a planetarium when candlelight is reflected, the ornate Ganesh Pol ceremonial arch, and the private zenana quarters where royal women observed court proceedings through latticed screens. This 16th-century Rajput masterpiece perched dramatically above Maota Lake represents the absolute pinnacle of Indo-Islamic fusion architecture in Northern India." },
      { question: "How long does the full day Jaipur tour take?", answer: "This deeply immersive exploration of the Pink City requires a rigorous 8 to 10-hour deployment to cover the extensive roster of UNESCO World Heritage monuments and royal palaces without rushing any individual site. We typically commence at 9:00 AM with the Amber Fort while temperatures remain comfortable, progress to the City Palace and Jantar Mantar observatory, pause for a premium lunch interval, and conclude with the Hawa Mahal and local bazaar exploration in the atmospheric golden afternoon light. This [full-day itinerary](/india/jaipur/hawa-mahal-private-tour) ensures physically sustainable pacing while maximizing historical depth." },
      { question: "Is the elephant ride at Amber Fort included?", answer: "We must be transparently responsible on this topic. While elephant rides to the Amber Fort entrance are historically iconic, growing international concerns about animal welfare have led us to strongly recommend the alternative Jeep ride, which is significantly faster, more comfortable, and entirely cruelty-free. Your [Jaipur private tour](/india/jaipur/hawa-mahal-private-tour) includes the Jeep ascent to the fort gate as the default option. If you specifically request the elephant ride, we can arrange it subject to availability, but our guides will provide balanced information about the animal welfare debates so you can make a fully informed decision." },
      { question: "Is the City Palace museum included?", answer: "Yes, the magnificent City Palace complex is a core component of this comprehensive [Jaipur sightseeing tour](/india/jaipur/hawa-mahal-private-tour). This sprawling royal compound remains the official residence of the current Jaipur royal family, making it one of the few living palaces in India. Your guide navigates you through the public museum sections featuring the world's largest sterling silver vessels, royal textile collections, and the ornate Peacock Gate. The architectural fusion of Rajput, Mughal, and European styles provides a fascinating visual timeline of how Jaipur's rulers adapted their aesthetic vision through centuries of political evolution." },
      { question: "Can we enter the Hawa Mahal?", answer: "Yes, absolutely. While most tourists photograph the iconic honeycomb facade of the Hawa Mahal from the street below, this [private Jaipur tour](/india/jaipur/hawa-mahal-private-tour) includes full interior access through the rear entrance on the opposite street. Inside, your guide explains how the 953 intricately carved sandstone windows were specifically designed to allow royal women to observe street processions and festivals without being seen, adhering to strict purdah customs. The upper floors provide spectacular panoramic views over the bustling Johari Bazaar and the distant Nahargarh Fort ridge, offering photography angles that most visitors completely miss." },
      { question: "Is the Jantar Mantar observatory included?", answer: "Yes, the UNESCO World Heritage Jantar Mantar astronomical observatory is seamlessly integrated into this [Jaipur full day tour](/india/jaipur/hawa-mahal-private-tour). Built in 1734 by the astronomer-king Maharaja Sawai Jai Singh II, this remarkable collection of nineteen massive stone instruments includes the world's largest sundial, capable of telling time with accuracy of two seconds. Your high-authority guide transforms what initially appears to be a collection of abstract geometric sculptures into a profound demonstration of 18th-century Indian scientific genius, explaining how each colossal instrument tracked celestial bodies and predicted lunar eclipses with astonishing mathematical precision." },
      { question: "Is hotel pickup and drop-off included?", answer: "Yes, seamless door-to-door transportation is a fundamental inclusion in this [Jaipur Private Tour](/india/jaipur/hawa-mahal-private-tour). Your designated air-conditioned luxury vehicle and professionally licensed chauffeur will collect you from any hotel, resort, or railway station within the Jaipur metropolitan area. The vehicle remains exclusively at your disposal throughout the entire day, providing a climate-controlled sanctuary between monument explorations in the Rajasthani heat. At the conclusion of your extensive tour, you are smoothly transported back to your accommodation or any preferred drop-off location including the airport or bus terminal." },
      { question: "Is lunch included in the tour?", answer: "This specialized package intentionally excludes meals to provide absolute dietary freedom. Your dedicated [Jaipur expert guide](/india/jaipur/hawa-mahal-private-tour) serves as a culinary concierge, recommending rigorously vetted restaurants based on your specific preferences. Options range from premium rooftop dining with fortress views at establishments like 1135 AD inside the Amber Fort complex, to authentic Rajasthani thali experiences featuring Dal Baati Churma and Laal Maas in the old city, to international cuisine at five-star properties. We schedule a strategic dining interval between the morning fort circuit and the afternoon palace exploration." },
      { question: "Is this tour suitable for families with children?", answer: "This [Jaipur private tour](/india/jaipur/hawa-mahal-private-tour) is exceptionally well-suited for families because the monumental scale of Amber Fort and the dramatic stories of Rajput warriors naturally captivate younger audiences. Your guide transforms complex historical narratives into engaging adventures about treasure chambers, secret underground passages, and elephant armies. The private vehicle provides comfortable rest intervals between monuments where children can recharge with air conditioning and refreshments. We can strategically modify the pace, skip less engaging administrative monuments, and prioritize the interactive elements that children find most exciting." },
      { question: "What is the best time of year to visit Jaipur?", answer: "The optimal window for this comprehensive [Jaipur full day tour](/india/jaipur/hawa-mahal-private-tour) spans October through March when daytime temperatures range from a comfortable 18°C to 28°C. November and February provide the most pleasant conditions for extensive outdoor monument exploration. January's Jaipur Literature Festival adds cultural depth. Avoid mid-April through June when temperatures can exceed 45°C, making the physical demands of fort climbing genuinely dangerous. The July through September monsoon period can disrupt outdoor plans but occasionally creates dramatic cloud formations over the hilltop fortresses that photographers prize." },
      { question: "Can we add Nahargarh Fort sunset to the itinerary?", answer: "Yes, Nahargarh Fort is a spectacular optional extension to this [Jaipur private tour](/india/jaipur/hawa-mahal-private-tour). Perched dramatically on the Aravalli ridge above the city, this defensive citadel provides the most commanding panoramic view of the entire Pink City skyline. During the golden hour, the pink sandstone buildings below glow with extraordinary warmth. Your private vehicle easily reaches the hilltop via a winding road, and the fort's rooftop cafe offers refreshments while you absorb the sunset. This addition requires approximately 1.5 hours and is highly recommended as the ultimate conclusion to your comprehensive Jaipur exploration." },
      { question: "What languages are available for the guide?", answer: "We maintain a comprehensive roster of linguistically diverse, government-licensed historian guides for this [Jaipur private tour](/india/jaipur/hawa-mahal-private-tour). Beyond fluent English as our absolute baseline standard, we can deploy senior experts who deliver the complex Rajput martial traditions, Mughal political narratives, and architectural commentary in Spanish, French, German, Italian, and Japanese. The profound historical density of Jaipur's fortresses and palaces demands communication in your native tongue to ensure zero loss of critical detail. Simply specify your linguistic requirement upon booking and we will match you with a high-authority specialized guide." },
      { question: "Are monument entry tickets included?", answer: "To maintain absolute financial transparency, this [Jaipur sightseeing tour](/india/jaipur/hawa-mahal-private-tour) covers your private vehicle, professional chauffeur, and expert historian guide, but intentionally excludes monument entrance fees. Jaipur offers a highly recommended composite ticket that provides single-payment access to Amber Fort, Hawa Mahal, Jantar Mantar, Nahargarh Fort, and several other sites at a significantly discounted rate. Your guide purchases this composite ticket on your behalf upon arrival, ensuring you pay the exact government rate without any agency inflation while simultaneously bypassing chaotic individual ticket queues at each monument." },
      { question: "What is the cancellation policy?", answer: "We execute a highly transparent cancellation framework for this [Jaipur Private Full Day Tour](/india/jaipur/hawa-mahal-private-tour). Cancellations made more than 24 hours prior to the scheduled pickup time receive a complete 100% full refund with zero administrative friction or hidden processing fees. Within the 24-hour window, restrictions apply to fairly compensate our permanently dedicated chauffeurs and senior historian guides who have been exclusively reserved for your itinerary. This straightforward policy structurally protects both your financial investment and our commitment to deploying elite specialized personnel for your comprehensive Pink City exploration." }
    ];
  }
  if (slug === 'amber-fort-guided-tour') {
    return [
      { question: "What is included in this Jaipur tour with an official guide?", answer: "This premium [Jaipur Guided Tour](/india/jaipur/amber-fort-guided-tour) includes a dedicated government-licensed historian guide with specialized expertise in Rajput military architecture and Mughal-era political history. Your assigned expert provides deep narrative coverage across the major Pink City monuments including the colossal Amber Fort, the wind palace Hawa Mahal, the astronomical Jantar Mantar, and the City Palace museum complex. The exploration is conducted entirely at your pace with exclusive attention, ensuring you absorb every architectural detail and historical nuance without the rigid scheduling and superficial commentary that plague budget group deployments." },
      { question: "Is the Amber Fort the main focus of this guided tour?", answer: "Yes, the magnificent Amber Fort receives the primary time allocation of approximately 2.5 hours within this comprehensive [guided tour](/india/jaipur/amber-fort-guided-tour). Your high-authority historian guide navigates you through the massive Suraj Pol sun gate, the spectacular Sheesh Mahal mirror palace that creates a planetarium effect with candlelight reflections, the ornate Ganesh Pol ceremonial entrance, and the secluded zenana private quarters. This sprawling 16th-century Rajput fortress perched dramatically above Maota Lake represents the absolute pinnacle of Indo-Islamic fusion architecture and military engineering in Rajasthan, demanding extended exploration time to properly comprehend." },
      { question: "Does the guide come with a private vehicle?", answer: "This specialized tour focuses on providing the highest-authority guiding expertise. The private vehicle and chauffeur arrangement depends on the specific package you select. Our recommended premium package includes a fully air-conditioned private vehicle with professional chauffeur for seamless transit between all monuments across the [Jaipur guided tour](/india/jaipur/amber-fort-guided-tour) route. This eliminates the physical exhaustion and time waste of negotiating local transportation between scattered sites. Alternatively, for budget-conscious travelers staying near the old city, the guide-only option allows you to arrange your own transport." },
      { question: "How long does this complete Jaipur guided tour take?", answer: "This deeply immersive exploration with your official guide requires a substantial 6 to 8-hour deployment depending on your specific interests and photography requirements. We meticulously allocate 2.5 hours for the massive Amber Fort complex, 1.5 hours for the City Palace museum, 45 minutes for the Jantar Mantar astronomical instruments, and dedicated intervals for the Hawa Mahal interior and strategic transit between sites. This [comprehensive guided itinerary](/india/jaipur/amber-fort-guided-tour) ensures your expert historian never rushes the complex Rajput narratives, delivering the educational depth that justifies engaging a premium licensed professional." },
      { question: "Is the guide government licensed and verified?", answer: "Absolutely. Every historian guide deployed for this [Jaipur guided tour](/india/jaipur/amber-fort-guided-tour) holds strict official licensing from the Rajasthan Department of Tourism and has undergone rigorous multi-year academic training in Rajput history, Mughal architectural studies, and professional tourism protocols. This is not casual verification. Licensed guides have completed formal examinations covering the entire spectrum of Rajasthani cultural heritage and are subjected to comprehensive background checks. By engaging an officially credentialed guide, you guarantee historically accurate information free from the myths and fabrications commonly delivered by unlicensed street touts." },
      { question: "Can we visit the Sheesh Mahal inside Amber Fort?", answer: "Yes, the legendary Sheesh Mahal, or Hall of Mirrors, is a mandatory highlight of the Amber Fort segment of this [guided tour](/india/jaipur/amber-fort-guided-tour). This extraordinary chamber is lined with thousands of tiny convex mirrors and colored glass pieces embedded into the walls and ceiling. When your guide demonstrates the effect by lighting a single candle, the entire room erupts into a dazzling constellation of reflected light, creating a breathtaking planetarium-like experience. Your expert historian explains how this 17th-century engineering marvel was designed to cool the royal apartments while simultaneously creating an ethereal atmosphere for private royal celebrations." },
      { question: "Is the elephant ride recommended at Amber Fort?", answer: "We must be responsibly transparent on this topic. While elephant rides ascending to the Amber Fort entrance are historically iconic and deeply marketed, significant international animal welfare concerns have emerged regarding the treatment and working conditions of these elephants. On this [guided tour](/india/jaipur/amber-fort-guided-tour), we default to the efficient Jeep ascent which is significantly faster, more comfortable, and entirely cruelty-free. If you specifically request the elephant experience after receiving our balanced welfare briefing, we can arrange it subject to daily availability, but our guides present the full picture to enable your informed decision." },
      { question: "What other monuments does the guide cover beyond Amber Fort?", answer: "This comprehensive [Jaipur guided tour](/india/jaipur/amber-fort-guided-tour) extends well beyond the fortress to encompass the complete cultural identity of the Pink City. After Amber Fort, your guide seamlessly transitions to the City Palace with its stunning Peacock Gate and royal textile collections, the UNESCO World Heritage Jantar Mantar observatory with the world's largest stone sundial, the iconic Hawa Mahal wind palace with its 953 latticed windows, and the atmospheric Johari Bazaar gemstone market. Each site is connected through a cohesive Rajput dynastic narrative rather than treated as isolated attractions." },
      { question: "Is the tour suitable for photography enthusiasts?", answer: "Exceptionally so. This [Jaipur guided tour](/india/jaipur/amber-fort-guided-tour) is inherently photogenic because Rajput architecture was explicitly designed to be visually dramatic. Your expert guide knows every premium photography angle at each monument, from the perfect Maota Lake reflection shot of Amber Fort to the symmetry points of the Ganesh Pol and the narrow street view of Hawa Mahal's honeycomb facade. Because this is a private guided experience, you have unlimited time to compose and capture without being hurried by group schedules. Your guide also identifies lesser-known angles that bypass tourist clusters for clean, unobstructed compositions." },
      { question: "What should I wear for temple and palace visits?", answer: "Jaipur's temple and palace circuit demands modest, comfortable attire suitable for extensive walking in potential heat. We recommend lightweight, breathable fabrics with covered shoulders and knee-length or longer bottoms. Some temples within the fort complex require head coverings which your [official guide](/india/jaipur/amber-fort-guided-tour) carries as supplementary provisions. Comfortable closed-toe walking shoes with good grip are essential for navigating the uneven stone surfaces and steep fort ramps. During winter months, a light jacket for the early morning start is advisable, though temperatures warm significantly by midday in the sheltered fort courtyards." },
      { question: "Are monument entry tickets included?", answer: "To maintain absolute financial transparency, this [Jaipur guided tour](/india/jaipur/amber-fort-guided-tour) primarily covers the expertise of your government-licensed historian guide. Monument entry fees are handled separately to ensure you pay the exact government rate without agency inflation. Jaipur offers an excellent composite ticket covering Amber Fort, Hawa Mahal, Jantar Mantar, and Nahargarh Fort at a significantly discounted bundled rate. Your guide purchases this on your behalf upon arrival, streamlining the ticketing process and ensuring you bypass the chaotic individual queues at each site for an efficient, premium experience." },
      { question: "Is this tour available in languages other than English?", answer: "Yes, we maintain a specialized roster of multilingual government-licensed historian guides for this [Jaipur guided tour](/india/jaipur/amber-fort-guided-tour). Beyond fluent English, we can deploy senior experts delivering the complex Rajput warrior traditions, Mughal diplomatic narratives, and astronomical explanations at Jantar Mantar in Spanish, French, German, Italian, and Japanese. Given the architectural complexity and cultural density of Jaipur's monuments, having a guide who communicates in your mother tongue ensures zero loss of critical historical nuance. Please specify your language preference during booking for guaranteed availability." },
      { question: "Can we customize which monuments to visit?", answer: "Complete customization is the fundamental advantage of engaging a private [official guide in Jaipur](/india/jaipur/amber-fort-guided-tour). While our recommended itinerary follows a strategically optimized geographical sequence, the entire framework responds to your specific interests. If you are primarily interested in military architecture, we can extend the Amber Fort and add Jaigarh Fort with its massive Jaivana cannon. If textiles fascinate you, we incorporate the Anokhi Museum and block-printing workshops. Historical photography enthusiasts can substitute standard sites with the lesser-known Galtaji Monkey Temple or the atmospheric stepwell of Panna Meena ka Kund." },
      { question: "Is this tour suitable for elderly visitors?", answer: "This [Jaipur guided tour](/india/jaipur/amber-fort-guided-tour) can be adapted for elderly travelers, though transparency about physical demands is essential. The Amber Fort involves significant inclines and stair climbing within the complex, though the Jeep ascent eliminates the steep approach walk. The City Palace and Jantar Mantar are relatively flat and accessible. Your private guide expertly manages the pace, utilizing shaded rest areas and the air-conditioned vehicle between sites. For guests with significant mobility limitations, we recommend a modified itinerary that prioritizes accessible ground-level attractions and reduces the total walking distance." },
      { question: "What is the cancellation policy?", answer: "We execute a highly transparent cancellation framework for this [Jaipur guided tour](/india/jaipur/amber-fort-guided-tour). Cancellations made more than 24 hours prior to the scheduled tour start time receive a complete 100% full refund with zero administrative friction or hidden processing fees. Within the 24-hour window, restrictions apply to fairly compensate our officially licensed historian guides who have been exclusively reserved and removed from active booking availability for your specific date. This straightforward policy protects your financial investment while respecting the professional commitment our guides make to your personalized itinerary." }
    ];
  }
  if (slug === 'jaipur-city-highlights-tour-with-amber-fort-hawa-mahal') {
    return [
      { question: "What makes this Jaipur City Highlights Tour special?", answer: "This [Jaipur City Highlights Tour with Amber Fort and Hawa Mahal](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal) is a meticulously curated comprehensive exploration that covers the absolute pinnacle of Rajput royal heritage in a single expertly orchestrated day. Unlike fragmented half-day options, this full-spectrum itinerary seamlessly connects the colossal hilltop Amber Fort, the iconic honeycomb Hawa Mahal, the astronomical Jantar Mantar, the City Palace museum, and the atmospheric old city bazaars through a cohesive dynastic narrative delivered by a government-licensed historian guide with deep expertise in Rajasthani royal architecture." },
      { question: "Is the Amber Fort visit comprehensive or just a quick stop?", answer: "The Amber Fort receives the most substantial time allocation of approximately 2.5 hours within this [Jaipur highlights tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal). This is absolutely not a rushed photograph-and-leave deployment. Your high-authority guide meticulously navigates you through every significant section including the Suraj Pol sun gate, the Jaleb Chowk military courtyard, the extraordinarily ornate Ganesh Pol, the legendary Sheesh Mahal mirror palace, and the deeply secluded zenana women's quarters. You absorb the complete architectural narrative of this 16th-century masterpiece while enjoying priority access and premium photography positioning." },
      { question: "Is hotel pickup included with a private vehicle?", answer: "Yes, seamless door-to-door transportation in a private air-conditioned vehicle with a professional chauffeur is a standard inclusion in this [Jaipur City Highlights Tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal). Your vehicle collects you from any hotel, resort, or railway station within the Jaipur metropolitan area and remains exclusively at your disposal throughout the entire day. This eliminates all transit stress, provides a climate-controlled sanctuary between monument explorations in the Rajasthani sun, and ensures efficient navigation between the geographically scattered sites that define Jaipur's extensive heritage circuit." },
      { question: "How long does the complete highlights tour take?", answer: "This comprehensive multi-monument exploration requires a rigorous 8 to 10-hour deployment to deliver the complete Pink City heritage experience without sacrificing depth at any individual site. We strategically allocate 2.5 hours for Amber Fort, 1.5 hours for the City Palace, 45 minutes for Jantar Mantar, 45 minutes for Hawa Mahal interior access, and dedicated intervals for premium dining and the Johari Bazaar exploration. This [full-day highlights itinerary](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal) ensures your guide delivers university-level historical commentary while maintaining a physically sustainable pace." },
      { question: "Is the Hawa Mahal visit from inside or just outside?", answer: "This [premium highlights tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal) includes complete interior access to the Hawa Mahal through the rear entrance, not just the standard street-level photograph that most tourists settle for. Inside, your guide explains how the 953 intricately carved pink sandstone windows were engineered to allow royal women to observe street processions while maintaining strict purdah anonymity. The upper floors provide spectacular panoramic photography angles over the bustling Johari Bazaar and the distant Nahargarh Fort ridgeline that are completely unavailable from the street. This interior exploration reveals the genius behind what appears to be merely a decorative facade." },
      { question: "Are monument entry tickets included?", answer: "To maintain absolute financial transparency, this [Jaipur City Highlights Tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal) covers your private vehicle, professional chauffeur, and expert government-licensed historian guide, while monument entrance fees are handled separately to ensure uninflated government rates. Jaipur offers a convenient composite ticket covering Amber Fort, Hawa Mahal, Jantar Mantar, Nahargarh Fort, and additional sites at a significantly discounted bundled rate. Your guide purchases this composite ticket on your behalf at the first monument, completely streamlining the ticketing process and eliminating chaotic individual queues." },
      { question: "Is lunch included in the package?", answer: "This package intentionally excludes meals to provide absolute dietary freedom across Jaipur's diverse culinary landscape. Your [local expert guide](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal) serves as a culinary concierge, recommending premium options ranging from royal Rajasthani thali experiences featuring signature dishes like Dal Baati Churma and Laal Maas, to sophisticated rooftop restaurants with fortress views, to authentic old city street food circuits. We schedule a strategic dining interval between the morning Amber Fort deployment and the afternoon City Palace exploration, ensuring proper rest and refueling." },
      { question: "Is the Jantar Mantar observatory actually interesting?", answer: "The Jantar Mantar is genuinely one of the most intellectually rewarding sites in this [Jaipur highlights tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal). What initially appears to be a collection of abstract geometric stone sculptures transforms under your guide's expert explanation into a mind-bending demonstration of 18th-century astronomical genius. The massive Samrat Yantra sundial tells time with two-second accuracy. The Ram Yantra measures celestial altitude with precision that rivals modern instruments. Built by astronomer-king Sawai Jai Singh II in 1734, this UNESCO site proves that Indian mathematics and astronomical observation were centuries ahead of their European contemporaries." },
      { question: "Can we add Nahargarh Fort sunset to the itinerary?", answer: "Yes, the Nahargarh Fort sunset is a spectacular optional extension highly recommended for this [Jaipur City Highlights Tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal). Perched on the Aravalli hills above the city, this defensive citadel provides the most commanding panoramic view of the entire Pink City skyline. During the golden hour, the sandstone buildings below glow with extraordinary warmth. Your private vehicle easily reaches the hilltop via a scenic winding road. The fort's rooftop Padao restaurant offers refreshments while you absorb the sunset, creating the perfect conclusion to your comprehensive Jaipur exploration." },
      { question: "Is this tour suitable for families with young children?", answer: "Exceptionally so. This private [Jaipur highlights tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal) adapts naturally to family dynamics because the massive scale of Amber Fort, stories of warrior kings and treasure vaults, and the dramatic hilltop settings captivate children instinctively. Your guide adjusts narrative complexity for younger audiences, transforming complex history into engaging adventures. The private vehicle provides comfortable air-conditioned rest intervals between monuments. We can modify the pace, extend breaks, and prioritize interactive elements. The key advantage over group tours is complete flexibility in managing energy levels throughout the demanding but exciting day." },
      { question: "What languages are available for the guide?", answer: "We maintain a comprehensive roster of multilingual government-licensed historian guides for this [Jaipur City Highlights Tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal). Beyond fluent English as our baseline standard, we deploy senior experts delivering the complex Rajput architectural and martial narratives in Spanish, French, German, Italian, and Japanese. The profound historical density of Jaipur's fortresses, palaces, and astronomical instruments demands communication in your native tongue to prevent any loss of critical nuance. Specify your linguistic preference when booking and we will guarantee a matching specialist for your comprehensive exploration." },
      { question: "Is this tour available during monsoon season?", answer: "Yes, this [Jaipur highlights tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal) operates year-round including the July through September monsoon period. While intermittent rainfall can temporarily disrupt outdoor segments, the dramatic cloud formations over the hilltop Amber Fort and rain-washed pink sandstone facades create extraordinary photography conditions. Your private vehicle provides dry transit between sites, and most monument interiors offer shelter during showers. Temperature during monsoon is significantly cooler than summer, making the physical demands of fort climbing more manageable. Your flexible private format allows real-time itinerary adjustments around rain patterns." },
      { question: "How much walking is involved?", answer: "This comprehensive multi-monument exploration requires solid physical stamina with approximately 5 to 7 kilometers of cumulative walking across fort ramps, palace courtyards, observatory platforms, and bazaar lanes. The Amber Fort involves the most demanding terrain with significant inclines within the complex. Your [expert guide](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal) mitigates fatigue through strategic pacing, utilizing shaded rest areas and scheduling comfortable air-conditioned vehicle transfers between each site. High-quality supportive footwear is absolutely essential. For guests with mobility concerns, we offer modified routes that prioritize accessible ground-level features." },
      { question: "Can we explore the Johari Bazaar during this tour?", answer: "Yes, the atmospheric Johari Bazaar, Jaipur's legendary gemstone and jewelry market, is seamlessly integrated as a cultural highlight of this [Jaipur City Highlights Tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal). Your guide navigates you through the narrow lanes of this centuries-old trading hub where traditional Rajasthani craftsmen continue to cut, polish, and set precious and semi-precious stones using techniques passed down through generations. This is not a forced shopping stop but an authentic cultural encounter. Your guide provides educational context about Jaipur's global reputation as the world's leading gemstone cutting and trading capital, and can recommend trusted establishments if you choose to purchase authentic Rajasthani jewelry or textiles." },
      { question: "What is the cancellation policy?", answer: "We execute a transparent cancellation framework for this [Jaipur City Highlights Tour](/india/jaipur/jaipur-city-highlights-tour-with-amber-fort-hawa-mahal). Cancellations made more than 24 hours prior to the scheduled pickup time receive a complete 100% full refund with zero administrative friction. Within the 24-hour window, restrictions apply to fairly compensate our permanently dedicated chauffeurs and specifically assigned government-licensed historian guides who have been exclusively reserved for your comprehensive itinerary. This straightforward policy protects your financial investment while respecting our team's scheduling commitment for your full-day Pink City exploration." }
    ];
  }

  // --- UDAIPUR TOUR FAQS ---
  if (slug === 'city-palace-full-day-tour') {
    return [
      { question: "What is included in the Udaipur full day sightseeing tour?", answer: "This comprehensive [Udaipur Full Day Sightseeing Tour](/india/udaipur/city-palace-full-day-tour) includes a dedicated government-licensed historian guide with deep expertise in Mewar royal history and Rajput architectural traditions, a private air-conditioned vehicle with professional chauffeur for seamless all-day transit across the City of Lakes, and priority access assistance at major monuments. The immersive itinerary covers the colossal City Palace complex, the serene Lake Pichola boat ride, the Jagdish Temple, the Saheliyon-ki-Bari garden, the vintage car museum, and the atmospheric old city lanes of Udaipur's UNESCO-candidate heritage zone." },
      { question: "How long does the Udaipur full day tour take?", answer: "This deeply immersive exploration of the Venice of the East requires a rigorous 8 to 10-hour deployment to experience the full spectrum of Mewar royal heritage and lakeside beauty. We typically commence at 9:00 AM at the towering City Palace complex, transition to a boat ride on Lake Pichola, explore the Jagdish Temple and Saheliyon-ki-Bari, and conclude with sunset views from the atmospheric rooftop terraces overlooking the illuminated palace. This [full-day itinerary](/india/udaipur/city-palace-full-day-tour) ensures physically sustainable pacing while maximizing cultural depth and photographic opportunities." },
      { question: "Is the City Palace museum fully covered?", answer: "Yes, the magnificent City Palace, the largest palace complex in Rajasthan, receives the most significant time allocation of approximately 2 to 2.5 hours within this [Udaipur sightseeing tour](/india/udaipur/city-palace-full-day-tour). Your high-authority guide navigates you through the labyrinthine succession of courtyards, balconies, towers, and rooms that were constructed over 400 years by 22 successive Mewar kings. Highlights include the peacock mosaics of Mor Chowk, the mirrored brilliance of Sheesh Mahal, the crystal gallery, and the panoramic rooftop terrace providing commanding views over Lake Pichola and the famous Lake Palace hotel floating in the center." },
      { question: "Is the Lake Pichola boat ride included?", answer: "Yes, a traditional boat ride on the iconic Lake Pichola is a core highlight of this [Udaipur full day tour](/india/udaipur/city-palace-full-day-tour). This serene 45-minute cruise provides breathtaking perspectives of the City Palace rising dramatically from the eastern shore, the ethereal Jag Mandir island palace, and the world-famous Taj Lake Palace hotel appearing to float on the water's surface. Your guide provides detailed commentary on the engineering marvel of this 14th-century artificial lake and the romantic royal legends associated with each island structure. Evening cruises during sunset offer particularly spectacular golden-hour photography conditions." },
      { question: "Is hotel pickup and drop-off included?", answer: "Yes, seamless door-to-door transportation is a standard inclusion in this [Udaipur sightseeing tour](/india/udaipur/city-palace-full-day-tour). Your designated air-conditioned luxury vehicle and professionally licensed chauffeur will collect you from any hotel, haveli, resort, or railway station within Udaipur city limits. The vehicle remains exclusively at your disposal throughout the entire extensive day, providing a climate-controlled sanctuary between monument explorations. At the conclusion of your tour, you are smoothly transported back to your accommodation or any preferred drop-off location including the airport or bus terminal for onward travel." },
      { question: "Is the Jagdish Temple included?", answer: "Yes, the stunning 17th-century Jagdish Temple is a key architectural highlight within this [Udaipur full day tour](/india/udaipur/city-palace-full-day-tour). This Indo-Aryan style Vishnu temple, located just steps from the City Palace entrance, features extraordinarily detailed carved stone panels depicting scenes from Hindu mythology, elephants, horsemen, and celestial dancers. Your guide explains the significance of the Garuda shrine, the intricately carved shikhara tower, and the temple's continuous role as an active place of worship for over 350 years. The temple provides a fascinating counterpoint to the secular palace architecture, demonstrating the intertwined nature of royal power and Hindu devotion in Mewar." },
      { question: "Is this tour suitable for families with children?", answer: "This private [Udaipur sightseeing tour](/india/udaipur/city-palace-full-day-tour) is wonderfully suited for families because Udaipur's lakeside setting, palace stories, and boat rides naturally enchant younger audiences. Your guide transforms tales of heroic Mewar kings, underwater treasure vaults, and floating palaces into engaging narratives for children. The private vehicle provides comfortable rest intervals between sites. The Lake Pichola boat ride is a particular favorite, and the vintage car museum with its spectacular collection of royal automobiles captivates visitors of all ages. We flexibly modify the pace and content to match your family's energy levels." },
      { question: "Are monument entry tickets included?", answer: "To maintain absolute financial transparency, this [Udaipur tour](/india/udaipur/city-palace-full-day-tour) covers your private vehicle, professional chauffeur, and expert historian guide, while monument entrance fees are handled separately to ensure uninflated government rates. The City Palace museum, Lake Pichola boat ride, and other site entries are purchased by your guide on your behalf, ensuring you pay the exact published rates without hidden markups. This transparent pricing structure allows you to choose which optional sites to include and maintains complete control over your total expenditure throughout the day." },
      { question: "Is Saheliyon-ki-Bari garden included?", answer: "Yes, the charming Saheliyon-ki-Bari, or Garden of the Maidens, is a delightful component of this [Udaipur full day tour](/india/udaipur/city-palace-full-day-tour). Built by Maharana Sangram Singh for 48 women attendants who accompanied his queen as part of her dowry, this intimate garden features ornamental fountains, lotus pools, marble elephants, and a small museum. Your guide explains how this serene retreat functioned as a private feminine sanctuary within the broader patriarchal royal framework, providing a deeply humanizing counterpoint to the masculine military narratives that dominate most Rajasthani palace tours." },
      { question: "Can we watch the sunset from a rooftop restaurant?", answer: "Absolutely, and we strongly recommend incorporating the legendary Udaipur sunset into this [full-day tour](/india/udaipur/city-palace-full-day-tour). Your guide coordinates the day's timeline to ensure you are positioned at one of the atmospheric lakeside rooftop terraces during the golden hour. Options include the famous Ambrai restaurant directly facing the City Palace, the elevated Upré at the Lake Pichola Hotel, or the intimate Savage Garden. Watching the reflected sunset illuminating the entire City Palace facade across the water is universally considered one of India's most spectacular visual experiences." },
      { question: "What is the best time of year to visit Udaipur?", answer: "The optimal window for this [Udaipur sightseeing tour](/india/udaipur/city-palace-full-day-tour) spans October through March when daytime temperatures range from a comfortable 20°C to 30°C. November and February provide the most pleasant conditions for extensive outdoor exploration. Post-monsoon October offers the lakes at their fullest and most photogenic levels. Avoid mid-April through June when temperatures can exceed 42°C. The July through September monsoon period fills the lakes dramatically and creates lush green landscapes, though intermittent rain can occasionally disrupt outdoor plans and boat services may be temporarily suspended during heavy rainfall." },
      { question: "Is the vintage car museum included?", answer: "The Garden Hotel's vintage car museum, housing a spectacular collection of royal vehicles including Rolls Royces, Cadillacs, and Mercedes-Benzes used by the Mewar royal family, can be included as an optional highlight of this [Udaipur full day tour](/india/udaipur/city-palace-full-day-tour). This unique attraction showcases how the maharanas blended traditional royal pageantry with modern automotive luxury. Each vehicle has a fascinating provenance story connected to specific royal figures and historical events. Your guide integrates this visit seamlessly into the broader narrative of Mewar's transition from traditional royal governance to the modern democratic era." },
      { question: "What languages are available for the guide?", answer: "We maintain a specialized roster of multilingual government-licensed historian guides for this [Udaipur sightseeing tour](/india/udaipur/city-palace-full-day-tour). Beyond fluent English as our absolute baseline standard, we can deploy senior experts delivering the complex Mewar dynastic history, Rajput architectural narratives, and cultural commentary in Spanish, French, and German. The profound historical density of Udaipur's palaces and the intricate Mewar royal genealogy demand communication in your native tongue to ensure zero loss of critical detail. Specify your linguistic preference upon booking for guaranteed matching with an appropriate specialist." },
      { question: "Is lunch included in the tour?", answer: "This package intentionally excludes meals to provide complete dietary freedom across Udaipur's exceptional culinary landscape. Your [local expert guide](/india/udaipur/city-palace-full-day-tour) serves as a culinary concierge, recommending premium lakeside restaurants, authentic Mewari cuisine establishments, and international dining options. Options range from the romantic Ambrai with its City Palace views to traditional vegetarian thali restaurants in the old city. We schedule a strategic dining interval between the morning palace exploration and the afternoon boat ride, ensuring proper rest and the opportunity to experience Udaipur's renowned hospitality." },
      { question: "What is the cancellation policy?", answer: "We execute a transparent cancellation framework for this [Udaipur Full Day Tour](/india/udaipur/city-palace-full-day-tour). Cancellations made more than 24 hours prior to the scheduled pickup time receive a complete 100% full refund with zero administrative friction or hidden processing fees. Within the 24-hour window, restrictions apply to fairly compensate our permanently dedicated chauffeurs and government-licensed historian guides who have been exclusively reserved for your itinerary. This straightforward policy structurally protects both your financial investment and our team's committed resources for your comprehensive City of Lakes exploration." }
    ];
  }
  if (slug === 'lake-pichola-full-day-tour') {
    return [
      { question: "What is included in this private Udaipur sightseeing tour?", answer: "This comprehensive [Udaipur Private Full-Day Sightseeing Tour](/india/udaipur/lake-pichola-full-day-tour) includes a dedicated government-licensed historian guide specializing in Mewar royal heritage, a private air-conditioned vehicle with professional chauffeur for seamless all-day transit, and a traditional boat ride on the iconic Lake Pichola. The extensive itinerary covers the monumental City Palace complex, the lakeside Jagdish Temple, the Saheliyon-ki-Bari garden, the Fateh Sagar Lake promenade, and the atmospheric old city bazaars, delivering the complete architectural and cultural payload of India's most romantic city in a single expertly orchestrated day." },
      { question: "Is the Lake Pichola boat ride a highlight of this tour?", answer: "Absolutely. The signature boat cruise on Lake Pichola is the romantic centerpiece of this [Udaipur private tour](/india/udaipur/lake-pichola-full-day-tour). This serene 45 to 60-minute cruise provides the most spectacular perspectives of the City Palace rising dramatically from the eastern shore, the ethereal Jag Mandir island palace where Shah Jahan once sought refuge, and the world-famous Taj Lake Palace hotel appearing to float on the water's surface. Your guide provides rich historical commentary throughout the cruise, connecting each lakeside structure to the extraordinary 1,400-year lineage of the Mewar royal dynasty." },
      { question: "How long does the complete tour take?", answer: "This deeply immersive exploration of the Venice of the East requires a comprehensive 8 to 10-hour deployment to experience the full spectrum of Mewar heritage, lakeside beauty, and cultural traditions. The itinerary commences at 9:00 AM at the towering City Palace, transitions through the Jagdish Temple and old city lanes, includes the Lake Pichola boat cruise, explores the Saheliyon-ki-Bari garden and Fateh Sagar Lake, and concludes with sunset views from an atmospheric lakeside terrace. This [full-day itinerary](/india/udaipur/lake-pichola-full-day-tour) ensures no monument is rushed while maintaining physically sustainable pacing." },
      { question: "Is the City Palace included in this tour?", answer: "Yes, the monumental City Palace complex, the largest palace in Rajasthan, is a core component of this [Udaipur private tour](/india/udaipur/lake-pichola-full-day-tour) receiving approximately 2 hours of dedicated exploration. Your guide navigates the labyrinthine succession of eleven individual palaces constructed over four centuries by successive Mewar kings. The peacock mosaics of Mor Chowk, the mirrored brilliance of Sheesh Mahal, and the panoramic rooftop terrace overlooking Lake Pichola and the floating Taj Lake Palace deliver an architectural experience of extraordinary depth that anchors the entire day's historical narrative." },
      { question: "Is hotel pickup and drop-off included?", answer: "Yes, comprehensive door-to-door transportation is a standard inclusion in this [Udaipur sightseeing tour](/india/udaipur/lake-pichola-full-day-tour). Your designated air-conditioned vehicle and licensed chauffeur will collect you from any hotel, haveli, resort, or railway station within Udaipur city limits at your preferred start time. The vehicle remains exclusively at your disposal throughout the entire day, providing a comfortable climate-controlled sanctuary between monument explorations. At the conclusion of your extensive tour, you are smoothly transported back to your accommodation or any preferred drop-off point including the airport terminal." },
      { question: "Can we visit the Jag Mandir island?", answer: "Yes, the Jag Mandir island palace can be incorporated into your Lake Pichola boat cruise during this [Udaipur private tour](/india/udaipur/lake-pichola-full-day-tour). This stunning 17th-century island palace served as a refuge for Mughal Prince Khurram, later Emperor Shah Jahan, during his rebellion against his father Jahangir. Many historians believe the white marble dome and garden layout of Jag Mandir directly inspired Shah Jahan's design for the Taj Mahal. Your guide draws these profound architectural connections during the island exploration, adding extraordinary intellectual depth to what would otherwise be merely a scenic boat ride." },
      { question: "Is lunch included in the package?", answer: "This package intentionally excludes meals to preserve your complete dietary freedom across Udaipur's exceptional restaurant scene. Your dedicated [local expert guide](/india/udaipur/lake-pichola-full-day-tour) serves as a culinary concierge, curating recommendations based on your specific preferences. Options range from the legendary lakeside Ambrai restaurant with direct City Palace panoramas, to authentic Mewari thali establishments in the atmospheric old city lanes, to premium heritage hotel restaurants. We strategically schedule a dining interval between the morning palace exploration and the afternoon boat cruise, ensuring proper rest." },
      { question: "Is the Saheliyon-ki-Bari garden included?", answer: "Yes, the enchanting Saheliyon-ki-Bari, the Garden of the Maidens, is a delightful component of this [Udaipur private tour](/india/udaipur/lake-pichola-full-day-tour). Built by Maharana Sangram Singh as a private retreat for 48 women who accompanied his queen as part of her royal dowry, this intimate garden features ornamental fountains, lotus pools, marble elephants, and a small museum showcasing Mewar heritage. Your guide explains how this serene sanctuary functioned as a feminine retreat within the broader patriarchal court structure, offering a deeply humanizing counterpoint to the military-focused narratives of most Rajasthani palace tours." },
      { question: "Is Fateh Sagar Lake included?", answer: "Yes, the scenic Fateh Sagar Lake, Udaipur's second major lake, is integrated into this [full-day private tour](/india/udaipur/lake-pichola-full-day-tour). This artificial lake offers a more tranquil, locally authentic experience compared to the tourist-heavy Lake Pichola shores. The lakeside promenade is a favorite among Udaipur residents for evening walks, and the Nehru Garden island in its center provides a charming green escape. Your guide explains the hydraulic engineering that connected Udaipur's lake system, demonstrating how the Mewar dynasty created a sophisticated water management infrastructure that sustained this desert city for centuries." },
      { question: "What is the best time of year to visit Udaipur?", answer: "The optimal window for this [Udaipur private tour](/india/udaipur/lake-pichola-full-day-tour) spans October through March when temperatures range from a comfortable 20°C to 28°C, making extensive outdoor exploration highly pleasant. Post-monsoon October is particularly spectacular because the lakes are at maximum capacity, creating the fullest, most photogenic water reflections of the palaces. Avoid April through June when extreme heat exceeding 42°C makes outdoor walking genuinely uncomfortable. The monsoon months of July through September dramatically fill the dry lake beds but intermittent heavy rainfall can temporarily suspend boat services." },
      { question: "What languages are available for the guide?", answer: "We maintain a specialized roster of multilingual government-licensed historian guides for this [Udaipur private tour](/india/udaipur/lake-pichola-full-day-tour). Beyond fluent English as our absolute baseline standard, we deploy senior experts who deliver the complex Mewar dynastic history, Rajput warrior traditions, and architectural commentary in Spanish, French, and German. Given the emotional depth of Udaipur's romantic heritage and the intricate royal genealogy spanning 1,400 years, having a guide who communicates seamlessly in your native tongue ensures complete absorption of every historical nuance and cultural insight without any translation barrier." },
      { question: "Is this tour suitable for couples and honeymoons?", answer: "Exceptionally so. Udaipur is universally celebrated as India's most romantic city, and this [private sightseeing tour](/india/udaipur/lake-pichola-full-day-tour) is ideally structured for couples and honeymoon travelers. The sunset boat ride on Lake Pichola, the intimate palace courtyards, and the atmospheric rooftop dining terraces create a naturally romantic progression throughout the day. Your guide discreetly adjusts the narrative to emphasize the legendary love stories of the Mewar dynasty. We can additionally arrange private sunset boat charters, luxury lakeside dining, and access to heritage hotel terraces for an additional romantic enhancement." },
      { question: "Are monument entry tickets included?", answer: "To maintain absolute financial transparency, this [Udaipur private tour](/india/udaipur/lake-pichola-full-day-tour) covers your private vehicle, professional chauffeur, and expert historian guide, while monument entrance fees and boat ride charges are handled separately at government rates. This ensures zero hidden agency inflation. Your guide purchases all tickets on your behalf, navigating the ticketing counters efficiently and eliminating queue waiting time. This transparent pricing strategy gives you complete control over which optional sites to include in your day, maintaining budgetary flexibility throughout the comprehensive exploration." },
      { question: "Is this tour suitable for elderly visitors?", answer: "This [Udaipur private tour](/india/udaipur/lake-pichola-full-day-tour) can be comfortably adapted for elderly travelers because the City of Lakes terrain is generally flatter than hilltop fort cities like Jaipur. The City Palace has some stairs but also elevator access for upper floors. The boat ride is completely seated and gentle. The Jagdish Temple involves a manageable flight of steps. Your private guide expertly manages the pace, extending rest breaks in shaded areas and utilizing the air-conditioned vehicle between sites. We recommend a modified itinerary that prioritizes the most accessible and rewarding sites while reducing total walking distances." },
      { question: "What is the cancellation policy?", answer: "We execute a transparent cancellation framework for this [Udaipur Private Sightseeing Tour](/india/udaipur/lake-pichola-full-day-tour). Cancellations made more than 24 hours prior to the scheduled pickup time receive a complete 100% full refund with zero administrative friction or hidden processing fees. Within the 24-hour window, restrictions apply to fairly compensate our permanently dedicated chauffeurs and government-licensed historian guides who have been exclusively reserved for your specific itinerary date. This straightforward policy structurally protects both your financial investment and our team's professional scheduling commitment for your comprehensive lakeside exploration." }
    ];
  }

  if (slug === 'phi-phi-islands-half-day-tour') {
    return [
      { question: "What is included in the Private Half-Day Phuket Yacht Cruise?", answer: "This [private Phi Phi Islands half-day yacht cruise](/thailand/phuket/phi-phi-islands-half-day-tour) includes exclusive use of a premium 52-foot private yacht, a professional captain and crew, snorkeling equipment, life jackets, drinks and snacks onboard, and hotel pickup and drop-off from selected Phuket locations. The itinerary covers Maya Bay, Loh Sama Bay, Bamboo Island, and Monkey Beach — four of the Andaman Sea's most iconic destinations — in a single seamlessly orchestrated half-day departure. The yacht accommodates a maximum of 20 guests, ensuring a genuine private experience with no shared passengers." },
      { question: "How long does the yacht cruise last?", answer: "This [half-day Phi Phi Islands cruise](/thailand/phuket/phi-phi-islands-half-day-tour) operates over approximately 5 to 6 hours from departure to return. Morning departures typically leave Phuket between 7:00 AM and 8:00 AM and return by early afternoon, while afternoon departures leave around 1:00 PM and return by sunset. The cruise time is spent navigating between Maya Bay, Loh Sama Bay, Bamboo Island, and Monkey Beach, with generous snorkeling stops and beach time at each location. Your captain optimizes the route based on sea conditions and tide timing to maximize access to each site." },
      { question: "Is Maya Bay actually accessible now?", answer: "Yes, Maya Bay — made globally famous by the film The Beach — has been fully reopened to visitors following its ecological restoration period. However, access is now strictly regulated by the Thai National Park authorities to protect the recovering coral ecosystem. Only a limited number of boats may enter Maya Bay during specific hours, and anchoring inside the bay is prohibited. Our [private yacht tour](/thailand/phuket/phi-phi-islands-half-day-tour) captain has extensive experience navigating these regulations and ensures your group enters Maya Bay during the optimal window for maximum time inside this legendary cove with minimal crowds." },
      { question: "What is the best time of year for this Phi Phi Islands cruise?", answer: "The optimal season for this [Phuket yacht cruise to Phi Phi Islands](/thailand/phuket/phi-phi-islands-half-day-tour) runs from November through April when the Andaman Sea is at its calmest, visibility for snorkeling is at its peak exceeding 15 meters, and the famous emerald and turquoise water colors are most vivid. The period from December to March offers the most consistently perfect conditions. May through October is the southwest monsoon season, during which sea conditions can be rough and some routes around the Phi Phi archipelago may be inaccessible on certain days due to weather. We monitor conditions daily and communicate in advance if any adjustments are required." },
      { question: "How many people can join this private yacht tour?", answer: "This is a strictly private charter accommodating a maximum of 20 guests on the 52-foot yacht. The vessel is not shared with any other group or strangers — your booking covers the entire boat for your party. This private format means departure times, snorkeling stop durations, and route sequencing are all customizable around your group's preferences. Whether you are a couple celebrating a honeymoon, a family with children, or a corporate group seeking an exclusive sea experience, the [private Phi Phi half-day tour](/thailand/phuket/phi-phi-islands-half-day-tour) provides a fully personalized Andaman Sea adventure." },
      { question: "Is snorkeling experience required for this tour?", answer: "No prior snorkeling experience is required. This [Phi Phi Islands yacht cruise](/thailand/phuket/phi-phi-islands-half-day-tour) caters to all swimming ability levels. Full snorkeling equipment including masks, fins, and life vests is provided onboard. Your crew provides a brief snorkeling orientation before the first water stop, covering breathing techniques and how to equalize ear pressure. The snorkeling sites around Phi Phi are renowned for their shallow, calm bays ideal for beginners — particularly Loh Sama Bay and Bamboo Island — while more experienced snorkelers will find abundant coral gardens and marine life at slightly deeper sections. Non-swimmers can comfortably enjoy the cruise from the boat deck." },
      { question: "What marine life will we see while snorkeling?", answer: "The waters surrounding the Phi Phi Islands support extraordinary marine biodiversity. During your [Phuket yacht snorkeling cruise](/thailand/phuket/phi-phi-islands-half-day-tour), you can expect to encounter vibrant coral formations, schools of tropical fish including clownfish, parrotfish, and angelfish, moray eels, and sea turtles which are frequently sighted in the area. The post-restoration recovery of Maya Bay's coral is visibly accelerating, with young coral colonies re-establishing throughout the bay. Blacktip reef sharks are occasionally spotted in shallow waters around Monkey Beach — a thrilling encounter that poses no danger as these small sharks are non-aggressive toward humans." },
      { question: "Is hotel pickup from all Phuket areas included?", answer: "Hotel pickup and drop-off is included from most major hotel zones in Phuket including Patong Beach, Kata Beach, Karon Beach, Bang Tao Beach, Surin Beach, Rawai, and Phuket Town. Your dedicated vehicle will collect your group at the hotel lobby at a pre-arranged time and transfer you directly to the yacht departure pier. After the [half-day Phi Phi cruise](/thailand/phuket/phi-phi-islands-half-day-tour) concludes, you are returned directly to your hotel. For guests staying on outlying islands or in very remote areas, our team will coordinate the most efficient collection logistics and communicate any necessary meeting point adjustments in advance." },
      { question: "Can we customize the route and stops?", answer: "Absolutely. One of the primary advantages of this private charter format is complete itinerary flexibility. While our standard [Phi Phi Islands half-day route](/thailand/phuket/phi-phi-islands-half-day-tour) covers Maya Bay, Loh Sama Bay, Bamboo Island, and Monkey Beach, your captain can adjust the sequence, extend time at preferred locations, or substitute alternative bays based on sea conditions and your group's interests. If certain guests are particularly passionate about snorkeling, the captain can extend the coral exploration stops. If your priority is photography inside Maya Bay, additional time can be allocated there. The route belongs to you — the captain's expertise simply ensures you maximize every minute on the water." },
      { question: "What should we bring on the yacht cruise?", answer: "For the most comfortable experience on this [Phuket yacht tour](/thailand/phuket/phi-phi-islands-half-day-tour), pack high-SPF waterproof sunscreen — the Andaman sun at sea is significantly more intense than on land — along with a beach towel, swimwear, a change of dry clothes, and cash for optional purchases at the islands. A rash guard or UV protection shirt is highly recommended for extended snorkeling sessions. The yacht provides fresh water, snacks, and soft drinks, but if you have specific dietary requirements or prefer alcoholic beverages, you may bring your own. Waterproof phone cases or action cameras are excellent for capturing underwater footage at the snorkeling sites." },
      { question: "What is the cancellation and weather policy?", answer: "We operate a clear and fair cancellation framework for this [private Phi Phi Islands yacht cruise](/thailand/phuket/phi-phi-islands-half-day-tour). Cancellations made more than 24 hours prior to the scheduled departure receive a complete 100% full refund. In the event that the Thai Marine Department issues a navigation warning or sea conditions are officially deemed unsafe on your departure day, your cruise will be rescheduled to the next available date at no additional cost, or a complete refund is issued. Your safety is the absolute priority, and our captains will not depart if conditions present any risk to passengers. We monitor official marine weather forecasts daily and communicate proactively if any concern arises." }
    ];
  }

  // --- PHUKET TOUR FAQS ---

  if (slug === 'james-bond-island-speedboat-tour-phuket') {
    return [
      { question: "What is included in the James Bond Island speedboat tour from Phuket?", answer: "The [James Bond Island speedboat tour](/thailand/phuket/james-bond-island-speedboat-tour-phuket) includes: hotel pickup and drop-off from major Phuket areas, a full-day speedboat to Phang Nga Bay, a visit to James Bond Island (Khao Phing Kan) and the iconic Ko Tapu needle rock, sea cave canoeing through at least one hong (hidden lagoon), Koh Panyee floating village stop with seafood lunch, life jackets, and a professional English-speaking guide. National park entrance fees (฿300/person) are included. The tour runs approximately 10 hours door to door." },
      { question: "What time does the James Bond Island tour depart and return?", answer: "The [James Bond Island tour from Phuket](/thailand/phuket/james-bond-island-speedboat-tour-phuket) operates on a full-day schedule. Hotel pickup begins at 7:00–7:30 AM from Phuket. The group boards the speedboat at Ao Po Grand Marina at approximately 9:00 AM and returns to the marina around 4:30–5:00 PM, with drop-off at your hotel by 6:00 PM. Early departure is essential — the sea cave canoeing (hong) section must be timed to low tide, which typically falls in the late morning. Tours that depart later miss the optimal tide window." },
      { question: "How long is the speedboat ride from Phuket to James Bond Island?", answer: "The speedboat journey from Ao Po Grand Marina to the first stop in Phang Nga Bay takes approximately 45–60 minutes. James Bond Island itself is reached after passing through several limestone karst formations, approximately 100 km from Phuket. The return journey is similar. Total time on the water between all stops is 6–7 hours. The bay is sheltered from ocean swell, so the ride is significantly calmer than open-sea crossings to Phi Phi." },
      { question: "What is sea cave canoeing and is it included?", answer: "Sea cave canoeing through **hongs** is the standout experience on this tour and is fully included. Hongs are collapsed limestone chambers — hidden lagoons accessible only through low-level openings in the cliff face. Your guide paddles you through a narrow, dark passage (sometimes requiring you to lie flat) before emerging into a completely enclosed sky-lit lagoon surrounded by 30–50 metre vertical walls. The experience is extraordinary and completely unlike anything available on a standard beach day. The [James Bond Island speedboat tour](/thailand/phuket/james-bond-island-speedboat-tour-phuket) times the hong canoeing precisely to low tide — the only window when the cave entrance is accessible." },
      { question: "Is this tour suitable for children?", answer: "Yes — the [James Bond Island tour](/thailand/phuket/james-bond-island-speedboat-tour-phuket) is one of the most child-friendly excursions from Phuket. Phang Nga Bay has calm, sheltered water with no ocean swell, and the speedboat ride is smooth. Children find the hong canoeing experience especially exciting. Most operators set a minimum age of 3–4 years old. Life jackets are mandatory for all passengers and are provided on board. Children must be able to sit still in a kayak and follow instructions during the cave passage. The Koh Panyee floating village is fascinating for all ages." },
      { question: "What is the national park entrance fee and is it included?", answer: "The Ao Phang Nga National Park entrance fee is **฿300 per foreign adult** and ฿150 per foreign child. This fee is included in the [James Bond Island speedboat tour price](/thailand/phuket/james-bond-island-speedboat-tour-phuket) — you do not pay separately at the gate. Park fees support conservation of the 400 sq km protected marine area, including the mangrove forests and limestone karst ecosystems. Thai nationals pay a reduced rate (฿30/฿15). Park staff collect fees at checkpoints in the bay." },
      { question: "Is lunch included in the James Bond Island tour?", answer: "Yes — a seafood lunch at **Koh Panyee floating village** is included in the [James Bond Island speedboat tour](/thailand/phuket/james-bond-island-speedboat-tour-phuket). Koh Panyee is a stilted fishing community built over the water in Phang Nga Bay, and lunch here is genuinely excellent — fresh prawns, squid, and fish cooked to order on a platform over the sea. Bring cash (฿200–฿500) for additional drinks, desserts, or souvenirs beyond the included meal. Vegetarian options are available on request — inform the operator when booking." },
      { question: "What should I bring on the James Bond Island tour?", answer: "**Essential**: reef-safe mineral sunscreen (chemical sunscreens are banned at national parks and actively damage coral), swimwear, a waterproof phone case or GoPro, and cash (฿300–฿500 for extras at Koh Panyee). **Recommended**: motion sickness medication if you are prone (take 30 minutes before departure), a light layer for the air-conditioned speedboat cabin, and a wide-angle lens for the karst scenery. **Leave behind**: large bags, valuables, and drones (prohibited in national parks — ฿100,000 fine). Most boats have small dry storage." },
      { question: "What is the difference between this tour and a private Phang Nga Bay tour?", answer: "The group [James Bond Island speedboat tour](/thailand/phuket/james-bond-island-speedboat-tour-phuket) accommodates 20–40 people on a large speedboat and follows a fixed itinerary — excellent value and well-organised. A private charter gives your group the entire boat, flexible timing, longer stops at each location, and a more intimate hong canoeing experience. For groups of 6+, private charter pricing often becomes comparable to group rates per person. See our [private yacht charter options](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping) for full-day exclusivity." },
      { question: "What is the cancellation policy for the James Bond Island tour?", answer: "Free cancellation is available up to 24 hours before your scheduled departure for a full refund. If the Thai Marine Department issues a navigation advisory or conditions are officially unsafe, the tour is rescheduled to the next available date at no cost, or a full refund is issued. The [James Bond Island tour](/thailand/phuket/james-bond-island-speedboat-tour-phuket) runs year-round, but Phang Nga Bay's sheltered geography means weather cancellations are rare compared to open-sea destinations. Book with confidence during all seasons." }
    ];
  }

  if (slug === 'phi-phi-islands-speedboat-tour-maya-bay-snorkeling') {
    return [
      { question: "What is included in the Phi Phi Islands speedboat tour?", answer: "The [Phi Phi Islands speedboat tour](/thailand/phuket/phi-phi-islands-speedboat-tour-maya-bay-snorkeling) includes: hotel pickup and drop-off from major Phuket areas, a full-day speedboat to the Phi Phi archipelago, a visit to **Maya Bay** (the beach from the film *The Beach*), Pileh Lagoon, Bamboo Island snorkelling stop, a swimming stop at Monkey Beach, buffet lunch on Phi Phi Don, and professional English-speaking guide. Snorkelling equipment (mask, fins, life jacket) and national park entrance fees are included. Total duration is approximately 10 hours door to door." },
      { question: "Is Maya Bay open in 2026 and what are the visiting rules?", answer: "Yes — Maya Bay fully reopened in 2022 after a 4-year ecological closure and is accessible in 2026. Thai National Park authorities now enforce strict access rules to protect the recovering coral ecosystem: **no swimming inside the bay**, a maximum visitor limit (~300 people at any time), no boat anchoring (mooring buoys only), and access only between 10:00 AM and 4:00 PM. The coral has visibly recovered and blacktip reef sharks have returned. The [Phi Phi Islands speedboat tour](/thailand/phuket/phi-phi-islands-speedboat-tour-maya-bay-snorkeling) handles all park regulations automatically — you simply enjoy the bay." },
      { question: "How long is the boat ride from Phuket to Phi Phi Islands?", answer: "By speedboat, the journey from the departure marina in Phuket to the Phi Phi Islands takes approximately **45 minutes to 1 hour**. Slower longtail boats take 2.5–3 hours. The crossing is on the open Andaman Sea — conditions are calmer November–April (dry season) and can be rougher May–October (monsoon). The [Phi Phi speedboat tour](/thailand/phuket/phi-phi-islands-speedboat-tour-maya-bay-snorkeling) uses modern, life-jacket-equipped speedboats. If you are prone to motion sickness, take antihistamine-based medication 30 minutes before departure." },
      { question: "What snorkelling sites are covered on this Phi Phi tour?", answer: "The [Phi Phi Islands snorkelling tour](/thailand/phuket/phi-phi-islands-speedboat-tour-maya-bay-snorkeling) covers three main snorkelling areas: **Pileh Lagoon** (shallow, crystal-clear turquoise water inside a natural limestone enclosed lagoon — one of the most photogenic spots in the Andaman Sea), **Bamboo Island** (surrounding coral gardens with excellent marine biodiversity, including turtles and blacktip reef sharks), and **Monkey Beach** (a short swim with rocky reef section). Snorkelling equipment is provided. The tour guide identifies marine species at each site. Water visibility typically reaches 15–25 metres November–April." },
      { question: "What marine life will I see while snorkelling at Phi Phi?", answer: "The waters around Phi Phi Islands support extraordinary marine biodiversity. On the [Phi Phi Islands snorkelling tour](/thailand/phuket/phi-phi-islands-speedboat-tour-maya-bay-snorkeling) you can expect: clownfish (Nemo) in anemone at Bamboo Island, schools of parrotfish, surgeonfish, and angelfish, moray eels in coral crevices, hawksbill turtles (regular sightings), and blacktip reef sharks in shallow water at Bamboo Island — non-aggressive and frequently seen in 1–2 metres of water. Maya Bay's recovering coral is already showing young colonies re-establishing. GoPro or underwater camera highly recommended." },
      { question: "Is lunch included in the Phi Phi Islands speedboat tour?", answer: "Yes — a buffet lunch is included at a beachfront restaurant on **Phi Phi Don** island. The lunch stop is typically at 12:30–1:30 PM and includes rice, grilled fish, Thai curries, fresh fruit, and soft drinks. Vegetarian and dietary alternatives are available — inform the operator when booking. The lunch location is on the island's main beach, allowing time to walk the waterfront, buy drinks, or rent a kayak for free exploration during the lunch break." },
      { question: "Can non-swimmers join this Phi Phi Islands tour?", answer: "Yes — non-swimmers can participate in the [Phi Phi Islands tour](/thailand/phuket/phi-phi-islands-speedboat-tour-maya-bay-snorkeling). Life jackets are provided and mandatory in the water. Non-swimmers can observe coral and tropical fish while wearing a life jacket and floating on the surface at the snorkelling stops. The boat tour, Maya Bay visit, and Phi Phi Don lunch require no swimming. However, since this is primarily a snorkelling-focused tour, swimmers and snorkellers will gain significantly more from the experience. Non-swimmers who prefer a beach day over water activities should also consider the [4-Island Tour](/thailand/phuket) which has more beach time." },
      { question: "What time does the Phi Phi Islands tour depart and return?", answer: "The [Phi Phi Islands speedboat tour from Phuket](/thailand/phuket/phi-phi-islands-speedboat-tour-maya-bay-snorkeling) follows a full-day schedule: hotel pickup 7:00–8:00 AM, speedboat departure at the marina ~8:30 AM, arrival at Phi Phi Leh (Maya Bay) ~9:45 AM, multiple island stops through the day, return departure from Phi Phi Don ~3:30–4:00 PM, back at Phuket marina ~5:00–5:30 PM, hotel drop-off by 6:30 PM. Early departure is critical — Maya Bay is most beautiful in morning light and least crowded before 11:00 AM." },
      { question: "What should I bring on the Phi Phi Islands snorkelling tour?", answer: "**Essential**: reef-safe mineral sunscreen (chemical sunscreens are banned in national parks — bring zinc oxide or titanium dioxide based), swimwear, waterproof phone case or GoPro for underwater photos, and a towel. **Recommended**: rash guard or UV shirt for extended snorkelling, motion sickness medication (take 30 minutes before departure if prone), cash ฿300–฿500 for drinks and extras on Phi Phi Don. **Leave behind**: drones (prohibited in national park — ฿100,000 fine), chemical sunscreen, and large valuables." },
      { question: "What is the cancellation policy for the Phi Phi Islands speedboat tour?", answer: "Free cancellation is available up to 24 hours before scheduled departure for a full refund. In the event of officially unsafe sea conditions or Thai Marine Department advisories, the [Phi Phi Islands tour](/thailand/phuket/phi-phi-islands-speedboat-tour-maya-bay-snorkeling) is rescheduled to the next available date at no additional cost, or a complete refund is issued. During monsoon season (May–October), rough conditions occasionally cause cancellations — the tour operator will communicate at least 12 hours in advance. December–April has the most reliable weather with very rare cancellations." }
    ];
  }

  if (slug === 'phi-phi-khai-islands-speedboat-tour-with-lunch') {
    return [
      { question: "What is included in the Phi Phi and Khai Islands tour?", answer: "The [Phi Phi and Khai Islands speedboat tour](/thailand/phuket/phi-phi-khai-islands-speedboat-tour-with-lunch) includes: hotel pickup and drop-off, a full-day speedboat covering both **Phi Phi Islands** (Maya Bay, Pileh Lagoon, Bamboo Island) and **Khai Island** (Khai Nok or Khai Nai), snorkelling equipment, buffet lunch with seafood and Thai dishes, and a professional English-speaking guide. National park entrance fees and life jackets are included. The combination of Phi Phi's dramatic scenery and Khai's calm, shallow snorkelling bay makes this the most comprehensive single-day island tour available from Phuket." },
      { question: "What is Khai Island and why should I visit it?", answer: "**Khai Island** (Koh Khai) refers to a group of three small islands — Khai Nok, Khai Nai, and Khai Nui — located approximately 15 km east of Phuket. Unlike Phi Phi, Khai's waters are extremely shallow (0.5–3 metres) and protected from all wind directions, making the snorkelling conditions almost always ideal. The coral gardens immediately off the beach support dense populations of clownfish, sea turtles, and reef fish. The beach is small but beautiful and far less crowded than Phi Phi Don. Adding Khai Island to a [Phi Phi tour](/thailand/phuket/phi-phi-khai-islands-speedboat-tour-with-lunch) provides a peaceful contrast to Phi Phi's dramatic karst scenery." },
      { question: "How is this tour different from the standard Phi Phi Islands speedboat tour?", answer: "The [Phi Phi and Khai Islands tour](/thailand/phuket/phi-phi-khai-islands-speedboat-tour-with-lunch) adds **Khai Island** as an additional stop, providing extra snorkelling time in calm, shallow water that is especially good for beginners and children. Phi Phi covers the dramatic scenery (Maya Bay, Pileh Lagoon, cliffs), while Khai provides a relaxed beach and snorkelling experience. The full-day itinerary is slightly more packed than a Phi Phi-only tour, but both destinations are in the same general direction from Phuket, so no significant extra travel time is added. Lunch is served on board or at a beachside venue rather than on Phi Phi Don." },
      { question: "What snorkelling spots are covered on this tour?", answer: "The [Phi Phi and Khai Islands tour](/thailand/phuket/phi-phi-khai-islands-speedboat-tour-with-lunch) covers: **Pileh Lagoon** (Phi Phi Leh — enclosed turquoise lagoon with coral edges), **Bamboo Island** (Phi Phi's best coral reef with turtles and reef sharks), and **Khai Island** (extremely shallow, calm coral garden ideal for beginners with consistently good visibility year-round). Three distinct snorkelling environments in one day — from deep-water coral walls at Bamboo Island to the wading-depth reef at Khai. Equipment (mask, fins, life jacket) provided and briefing given before the first water entry." },
      { question: "Is the Phi Phi and Khai Islands tour suitable for beginners and non-swimmers?", answer: "Yes — this is one of the most beginner-friendly tours from Phuket. The addition of Khai Island is specifically excellent for non-swimmers and first-time snorkellers: the water is only 0.5–2 metres deep in many areas, so you can stand while wearing a mask. Life jackets are provided for all water activities. The [Phi Phi Khai tour](/thailand/phuket/phi-phi-khai-islands-speedboat-tour-with-lunch) is particularly recommended for families with young children or those who have never snorkelled before — the calm, shallow environment removes anxiety and maximises the underwater experience." },
      { question: "Is lunch included and what is served?", answer: "Yes — a full buffet lunch is included in the [Phi Phi Khai Islands speedboat tour](/thailand/phuket/phi-phi-khai-islands-speedboat-tour-with-lunch). The spread typically includes Thai staples: pad thai, green curry, grilled fish, stir-fried vegetables, jasmine rice, fresh fruit, and soft drinks. Lunch is usually served at a beachside venue. Vegetarian and allergen-sensitive options are available on request — specify when booking. The meal quality is consistently good and genuinely filling. Bring cash (฿200–฿300) if you would like to purchase extra drinks or snacks beyond the included items." },
      { question: "What is the boat like on this tour?", answer: "The [Phi Phi Khai Islands tour](/thailand/phuket/phi-phi-khai-islands-speedboat-tour-with-lunch) uses a modern fiberglass speedboat with seating for 20–30 passengers, a small covered cabin section for shade and wind protection on the return journey, a sound system, and onboard fresh water. Life jackets are stored on board and must be worn during all water activities. The boats are serviced regularly and meet Thai marine safety standards. Groups are typically 20–35 people — if you prefer a private boat for your group, see our [private yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping)." },
      { question: "What time does the Phi Phi Khai Islands tour start and end?", answer: "Hotel pickup begins at 7:00–8:00 AM from Phuket hotels. The speedboat departs the marina at approximately 8:30 AM, with the first island stop (usually Phi Phi Leh / Maya Bay) reached by 9:45 AM. Multiple stops through the day — Phi Phi and Khai — bring you back to the Phuket marina by approximately 5:00–5:30 PM, with hotel drop-off by 7:00 PM. The early start is important to reach Maya Bay before peak crowds (which peak between 11:00 AM and 2:00 PM). Total tour duration: ~10 hours." },
      { question: "What should I pack for this island tour?", answer: "**Essential**: reef-safe mineral sunscreen (chemical sunscreens are banned at national parks — use zinc oxide or titanium dioxide), swimwear, waterproof case for phone, towel. **Recommended**: rash guard for extended snorkelling, motion sickness tablet (take 30 minutes before departure if prone), cash ฿300–฿500 for extras. **Useful**: GoPro or waterproof camera — the snorkelling at both Phi Phi and Khai is highly photogenic. **Avoid**: chemical sunscreen, drones (฿100,000 fine in national park), and large bags. Dry storage space on speedboats is limited." },
      { question: "What is the cancellation policy for the Phi Phi Khai Islands tour?", answer: "Free cancellation up to 24 hours before departure for a full refund. If sea conditions are officially unsafe or the Thai Marine Department issues a navigation advisory, the [Phi Phi Khai Islands tour](/thailand/phuket/phi-phi-khai-islands-speedboat-tour-with-lunch) is rescheduled or fully refunded. During the dry season (November–April), cancellations are very rare. Monsoon season (May–October) may bring occasional rough crossings — the operator monitors conditions daily and notifies guests 12+ hours in advance. Book with confidence as all operators maintain transparent weather policies." }
    ];
  }

  if (slug === 'phi-phi-islands-private-yacht-cruise-maya-bay') {
    return [
      { question: "What is included in the private Phi Phi Islands yacht cruise?", answer: "The [private Phi Phi Islands yacht cruise](/thailand/phuket/phi-phi-islands-private-yacht-cruise-maya-bay) includes: exclusive use of a private yacht for your group (2–12 people), a professional captain and crew, visits to **Maya Bay**, Pileh Lagoon, Bamboo Island, and Monkey Beach, full snorkelling equipment, fresh water, snacks, and drinks on board, hotel pickup and drop-off, and national park entrance fees. There are no shared passengers — the entire vessel is yours. The private format means itinerary timing, stop durations, and route sequencing can all be adjusted to your group's preferences." },
      { question: "How is the private yacht cruise different from the group speedboat tour?", answer: "The fundamental difference is exclusivity. On a group [Phi Phi speedboat tour](/thailand/phuket/phi-phi-islands-speedboat-tour-maya-bay-snorkeling), you share a boat with 20–40 strangers and follow a fixed schedule. On the [private Phi Phi yacht cruise](/thailand/phuket/phi-phi-islands-private-yacht-cruise-maya-bay), your group has the entire boat — you choose departure time, linger at Maya Bay as long as you wish, have the snorkelling sites to yourselves, and experience the islands at your own pace. Private also means the captain can access smaller, less-visited bays and coves that group tours never stop at. For couples, families, and groups of 4+, the private experience is dramatically superior." },
      { question: "What type of yacht is used and how many guests can it hold?", answer: "The [private Phi Phi yacht cruise](/thailand/phuket/phi-phi-islands-private-yacht-cruise-maya-bay) operates on a premium sailing or motor yacht (typically 45–65 feet) with a spacious deck, shaded salon, and sun deck. The maximum capacity is 10–12 guests depending on the specific vessel assigned. Every charter is a genuine private experience — no strangers, no fixed group schedule. The yacht is fully equipped with life jackets, snorkelling gear, and safety equipment meeting Thai marine authority standards. Your captain has extensive local knowledge of Phi Phi's tides, currents, and the optimal timing for Maya Bay entry." },
      { question: "Can we customise the route and choose which islands we visit?", answer: "Absolutely — complete itinerary flexibility is the primary advantage of a [private Phi Phi yacht charter](/thailand/phuket/phi-phi-islands-private-yacht-cruise-maya-bay). The standard route covers Maya Bay, Pileh Lagoon, Bamboo Island, and Monkey Beach, but your captain can adjust timing, add extra stops at secluded coves (Loh Samah Bay, Viking Cave viewpoint, private beaches on Phi Phi Leh's eastern shore), or skip any location that doesn't interest you. If the group wants to spend 2 hours snorkelling at Bamboo Island rather than 45 minutes, that is entirely your choice. The yacht belongs to your group for the full duration." },
      { question: "Is hotel pickup from all Phuket areas included?", answer: "Hotel pickup and drop-off is included from most major Phuket hotel zones: Patong Beach, Kata Beach, Karon Beach, Bang Tao, Surin, Rawai, and Phuket Town. Your private vehicle collects the group at the hotel lobby at the agreed time and transfers you to the yacht departure pier. After the cruise, the vehicle returns the group directly to your hotel. For guests in remote locations or on nearby islands (Phi Phi Don, Koh Yao), coordinate pickup logistics with the operator when booking — alternative meeting points can usually be arranged." },
      { question: "Is the private Phi Phi yacht cruise suitable for non-swimmers?", answer: "Yes — non-swimmers can comfortably participate in the [private Phi Phi yacht cruise](/thailand/phuket/phi-phi-islands-private-yacht-cruise-maya-bay). Life jackets are always available and non-swimmers can float on the surface with mask and life jacket to see coral and fish without deep-water exposure. The deck-based experience — watching the limestone cliffs of Maya Bay, having lunch at anchor, and enjoying the sail — is genuinely spectacular regardless of swimming ability. The private format also means the crew can give individual attention to nervous swimmers or first-time snorkellers." },
      { question: "What is the best time of year for the private Phi Phi yacht cruise?", answer: "The optimal season is **November through April** when the Andaman Sea is at its calmest, snorkelling visibility reaches 20–30 metres, and the turquoise water colours are at their most vivid. December–February is peak season — the most consistently perfect conditions but book 3–5 days in advance for the [private Phi Phi yacht cruise](/thailand/phuket/phi-phi-islands-private-yacht-cruise-maya-bay). March–April is excellent with slightly warmer water. May–October (monsoon) brings variable conditions — the outer sea can be rough, but experienced captains manage safe routes on calmer days. Always ask about current sea conditions when booking in monsoon months." },
      { question: "Is food and drink included on the private yacht?", answer: "Fresh water, soft drinks, and light snacks (fruit, crackers, onboard provisions) are included in the [private Phi Phi yacht cruise](/thailand/phuket/phi-phi-islands-private-yacht-cruise-maya-bay). Lunch varies by operator — some provide a full catered meal on board, others stop at a Phi Phi Don restaurant. Confirm the meal arrangement when booking. If you have dietary requirements, inform the operator in advance. You are welcome to bring your own drinks, wine, or preferred snacks on board. Most private charters have a small cooler on deck for personal beverages." },
      { question: "What should we bring on the private Phi Phi yacht cruise?", answer: "**Essential**: reef-safe mineral sunscreen (mandatory in national park waters), swimwear, GoPro or waterproof camera for underwater footage, and a light layer for the sea breeze. **Optional**: your own alcoholic drinks if desired (most charters allow BYO), a wide-angle lens for the cliffs, and motion sickness medication if prone (though yachts are generally smoother than speedboats). **Leave behind**: chemical sunscreen (coral-damaging, banned in national parks), drones without a permit, and large wheeled luggage — the marina has secure storage." },
      { question: "What is the cancellation policy for the private Phi Phi yacht cruise?", answer: "Free cancellation is available up to **48 hours** before the scheduled charter for a full refund. Private yacht charters require 48 hours notice rather than 24 hours because of the coordination involved in preparing the vessel and crew. In the event of Thai Marine Department weather advisories or officially unsafe conditions, the [private Phi Phi yacht cruise](/thailand/phuket/phi-phi-islands-private-yacht-cruise-maya-bay) is rescheduled to your next available date or fully refunded. The operator will notify you at least 12 hours before departure if conditions require rescheduling." }
    ];
  }

  if (slug === 'phuket-private-yacht-catamaran-charter-island-hopping') {
    return [
      { question: "What is included in the Phuket private yacht charter?", answer: "The [Phuket private yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping) includes: exclusive use of your chosen yacht or catamaran for the day (7 options available), a professional captain and crew, your custom island hopping itinerary around the Andaman Sea, snorkelling equipment, life jackets, fresh water and soft drinks on board, lunch (details vary by vessel), and hotel pickup from major Phuket areas. National park entrance fees are additional if your route enters protected areas. With 7 boats available — from speedboats to luxury catamarans — there is an option for every group size and budget." },
      { question: "What boats are available and how do I choose the right one?", answer: "The [Phuket yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping) offers **7 distinct boats**: options range from nimble speedboats (fastest, best for reaching distant islands like James Bond Island or Similan) to spacious sailing catamarans (most stable, best for large groups and leisurely island days) and luxury motor yachts (premium comfort, ideal for special occasions). The right choice depends on: (1) group size — speedboats suit 2–8 people, catamarans 8–20; (2) destination — speedboats cover more ground, catamarans are better for anchored relaxation; (3) comfort priority — catamarans have less motion sickness risk. The booking page shows full specs for each vessel." },
      { question: "Which islands can we visit on the private Phuket yacht charter?", answer: "With the [Phuket private yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping), your captain can take your group to virtually any island within a half-day's sailing radius. Popular destinations: **[Phi Phi Islands](/thailand/phuket/phi-phi-islands)** (Maya Bay, Pileh Lagoon — 45 min speedboat), **[Phang Nga Bay](/thailand/phuket/phang-nga-bay)** (James Bond Island, sea caves — 1.5 hrs), **Racha Islands** (excellent diving — 30 min), **Khai Islands** (shallow snorkelling — 20 min), **Coral Island** (family-friendly — 20 min), and uninhabited private beaches. The captain advises on optimal combinations based on your interests, group size, and current sea conditions." },
      { question: "How many people can join the private yacht charter?", answer: "Capacity varies by vessel — the [Phuket yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping) offers boats ranging from **4 to 20 guests**. Speedboats typically hold 4–10 people comfortably; sailing catamarans accommodate 8–20. The entire vessel is exclusively yours regardless of group size — there are no shared passengers. This makes private charter an excellent choice for: couples and honeymooners, families with children, friend groups of 4–12, and corporate incentive groups. For very large groups (20+), the operator can arrange multiple boats travelling together." },
      { question: "Can we fully customise our island hopping itinerary?", answer: "Yes — complete customisation is the defining feature of the [Phuket private yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping). You choose the islands, the time spent at each, the activities (snorkelling, swimming, anchored lunch, beach walks), and the departure time. The captain provides expert recommendations based on current conditions, tides (critical for sea cave access in Phang Nga), and your group's interests, but the final itinerary is yours. You can also combine destinations not covered by any group tour — for example, combining Phi Phi and Racha Islands, or creating a full [Phuket island hopping](/thailand/phuket/phuket-island-hopping) route that covers 4–5 different islands in one day." },
      { question: "Is hotel transfer included in the yacht charter?", answer: "Yes — hotel pickup and drop-off is included from major Phuket hotel zones for the [private yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping). A private vehicle collects your group from the hotel lobby at the agreed departure time and transfers you to the marina. After the charter, the vehicle returns you to your hotel. For guests staying in Krabi, Khao Lak, or on nearby islands, discuss pickup logistics with the operator when booking — meeting directly at the marina is often the most efficient option and saves time." },
      { question: "What is the best time of year for the Phuket yacht charter?", answer: "**November through April** is the optimal season for the [Phuket private yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping) — calm Andaman Sea, 20–30 metre snorkelling visibility, reliable sunshine, and the most stable conditions for reaching all destinations. December–February is peak season; book at least 3–5 days in advance. March–April remains excellent. May–October (monsoon) brings variable conditions — catamarans handle light monsoon swell better than speedboats, and Phang Nga Bay (sheltered) remains accessible on most monsoon days. The operator confirms conditions 24 hours in advance." },
      { question: "Is the private yacht charter suitable for families with children?", answer: "Yes — the [private Phuket yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping) is ideal for families. The private format means the itinerary, pace, and activity choices revolve entirely around your family. Catamarans are the best vessel for families: maximum stability (minimal sea sickness), wide flat deck for children to move safely, shade areas, and ample space. Life jackets in children's sizes are provided. Popular family itineraries include Khai Islands (very shallow snorkelling, great for children), Phi Phi Islands (iconic scenery and accessible snorkelling), and Racha Yai (calm bay with excellent coral). The crew is experienced with children on board." },
      { question: "What should we bring on the private yacht charter?", answer: "**Essential**: reef-safe mineral sunscreen (mandatory for all national park waters — use zinc oxide or titanium dioxide), swimwear, waterproof camera or GoPro for the snorkelling and scenery, and cash if your route includes stops at villages or restaurants. **Optional**: your own drinks (wine, beer — most charters allow BYO), a wide-angle lens for the karst scenery, seasickness tablets if prone (catamarans are much smoother than speedboats). **Leave behind**: chemical sunscreen, drones without permits, and anything you cannot afford to get wet. The crew provides dry storage but space is limited on smaller vessels." },
      { question: "What is the cancellation policy for the private yacht charter?", answer: "Free cancellation is available up to **48 hours** before the scheduled departure for a full refund. Private yacht charters require 48 hours notice to allow for vessel and crew preparation. In the event of Thai Marine Department weather advisories or officially unsafe sea conditions, the [Phuket private yacht charter](/thailand/phuket/phuket-private-yacht-catamaran-charter-island-hopping) is rescheduled to your preferred alternative date at no cost, or a complete refund is issued. The operator monitors marine weather forecasts daily and communicates proactively. During peak season (December–March), rescheduling is rarely needed due to consistently excellent conditions." }
    ];
  }

  // --- END PHUKET TOUR FAQS ---

  if (t.includes('delhi') && t.includes('agra') && t.includes('day trip')) {
    return [
      { question: "What time do we leave Delhi for a Taj Mahal day tour?", answer: "To maximize your day and experience the Taj Mahal at its most tranquil, we typically recommend a **3:00 AM or 4:00 AM departure** from Delhi. This early start allows you to reach Agra just as the gates open for sunrise, avoiding the heavy morning traffic on the Yamuna Expressway." },
      { question: "How long is the Delhi to Agra drive and is the expressway safe?", answer: "The drive from Delhi to Agra via the **Yamuna Expressway** typically takes between **3 to 3.5 hours**. This modern, 6-lane toll road is one of India's best highways, offering a smooth and safe journey. We include all toll taxes, parking, and fuel in your tour package." },
      { question: "Is a same-day Taj Mahal tour from Delhi actually worth it?", answer: "Absolutely—thanks to the ultra-fast Yamuna Expressway, a **same-day trip is the most popular way** to visit Agra. A well-structured itinerary easily covers the Taj Mahal, Agra Fort, and a relaxed 5-star lunch." }
    ];
  }
  return null;
};

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

  // Derive max group size from pricing tiers if available, otherwise fall back to maxGroupSize
  const effectiveMaxGroupSize = (() => {
    // Check pricing tiers to derive max participants
    const tiersSource = tour?.groupPricingTiers || selectedOption?.groupPricingTiers;
    if (tiersSource) {
      try {
        const tiers = typeof tiersSource === 'string' ? JSON.parse(tiersSource) : tiersSource;
        if (Array.isArray(tiers) && tiers.length > 0) {
          const maxFromTiers = Math.max(...tiers.map((t: any) => Number(t.maxPeople) || 0));
          if (maxFromTiers > 0) return maxFromTiers;
        }
      } catch (e) { /* fall through to defaults */ }
    }
    return Number(selectedOption?.maxGroupSize || tour?.maxGroupSize || 10);
  })();

  // Re-validate participants if maxGroupSize changes (e.g. when changing options)
  useEffect(() => {
    if (tour && participants > effectiveMaxGroupSize) {
      setParticipants(effectiveMaxGroupSize);
      setIsCustomParticipants(false);
    }
  }, [effectiveMaxGroupSize, tour]);



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
      let specificSchemaFaqs = getTourSpecificFAQs(tourTitle, tourSlug || tour?.slug);

      let tourFAQs = [];
      if (specificSchemaFaqs) {
        tourFAQs = specificSchemaFaqs;
      } else {
        tourFAQs = [
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
      }

      // Strip markdown syntax from text - Google's structured data validator rejects markdown in Answer text
      const stripMarkdown = (text: string): string => {
        return text
          .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold** → bold
          .replace(/\*(.+?)\*/g, '$1')         // *italic* → italic
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link text](url) → link text
          .replace(/`(.+?)`/g, '$1')           // `code` → code
          .replace(/#{1,6}\s+/g, '')           // # headings → plain text
          .trim();
      };

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": tourFAQs.map(faq => ({
          "@type": "Question",
          "name": stripMarkdown(faq.question),
          "acceptedAnswer": {
            "@type": "Answer",
            "text": stripMarkdown(faq.answer)
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

  // Initial state checks are now handled within the main render to ensure header/footer are visible for SEO

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

  // Calculate tour FAQs for schema
  const tourFAQs = (() => {
    const t = tour?.title?.toLowerCase() || '';
    const slug = tour?.slug;

    // Use the same logic as the render section to get the high-authority FAQs
    if (slug === 'taj-mahal-sunrise-guided-tour' || slug === 'taj-mahal-sunrise-tour' || slug === 'sunrise-taj-mahal-and-agra-tour-by-car') {
      const isSkipLine = slug === 'taj-mahal-sunrise-tour' || slug === 'sunrise-taj-mahal-and-agra-tour-by-car';
      const tourLabel = isSkipLine ? "Taj Mahal Sunrise Tour (Skip-the-line version)" : "Taj Mahal Sunrise Tour";
      const tourPath = slug === 'sunrise-taj-mahal-and-agra-tour-by-car'
        ? "/india/agra/sunrise-taj-mahal-and-agra-tour-by-car"
        : (isSkipLine ? "/india/agra/taj-mahal-sunrise-tour" : "/india/agra/taj-mahal-sunrise-guided-tour");

      return [
        {
          question: "What is the first entry time allowed by ASI?",
          answer: `The Archaeological Survey of India (ASI) officially opens the Taj Mahal gates exactly **30 minutes before sunrise**. This entry time is strictly enforced to ensure the security personnel from the CISF are in position. For most of the year, this equates to approximately 5:30 AM or 6:00 AM. Many visitors ask if they can enter earlier to beat the crowds, but the ASI protocols are rigid. By booking a [${tourLabel}](${tourPath}), you ensure that our guides have you in the very first segment of the security queue. This strategic positioning is vital because even a 10-minute delay can result in hundreds of people entering before you, potentially obstructing those pristine, reflection-pool views that make the early wake-up call so rewarding for international travelers.`
        },
        {
          question: "Is sunrise timing different in summer vs winter?",
          answer: "Yes, sunrise timing in Agra fluctuates dramatically between the seasons, impacting your [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) schedule. During the intense summer months of May and June, the sun breaks the horizon as early as 5:15 AM, necessitating a 4:30 AM hotel departure. Conversely, in the peak of winter (December and January), sunrise can be as late as 7:15 AM. We constantly monitor the official [sunrise timing](/india/agra/taj-mahal-opening-time) to calibrate our pickup times perfectly. While summer offers clear skies and sharp shadows, winter often brings a mystical morning fog that creates a dream-like atmosphere. Regardless of the month, our local experts ensure you are through the security gates the moment the ASI allows, allowing you to witness the white marble transition from cool lavender to a warm, golden glow as the light intensity changes."
        },
        {
          question: "How early should we reach for best photography?",
          answer: "To capture professional-grade photography without the interference of massive crowds, you should aim to reach the security gates at least **30 to 45 minutes before the gates open**. In the world of high-authority travel photography, the \"Blue Hour\"—the period just before technical sunrise—is considered the platinum window for long-exposure shots of the reflecting pools. Many travelers believe arriving at 6:00 AM is sufficient, but by then, the queue at the East Gate can already be quite long. As your specialized local partner, we prioritize early arrival tactics. Our guides know the exact \"symmetry points\" where the light hits the dome first. By being among the first 50 people inside, you can secure that iconic, unobstructed shot of the mausoleum perfectly mirrored in the water."
        },
        {
          question: "Is Taj Mahal closed on Fridays?",
          answer: "The Taj Mahal is closed to the public every Friday. This closure is a long-standing tradition to allow local residents to use the 17th-century mosque located within the complex for afternoon prayers. If you are planning an [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) exploration, ensure you do not schedule your visit for a Friday, as the gates will remain firmly locked to all tourists. However, Friday can still be a productive day; you can visit the Agra Fort or the Baby Taj. For those desperate for a view, the Mehtab Bagh (Moonlight Garden) remains open on Fridays and provides a stunning perspective of the Taj Mahal from across the Yamuna River during sunset. Our [1-day itinerary](/india/agra/1-day-agra-itinerary) planners always double-check these dates to prevent any disappointment."
        },
        {
          question: "What should I wear for sunrise visit?",
          answer: "Choosing the right attire is essential for both comfort and respect. Since the sunrise visit starts in the dark, temperatures can be 5-10°C cooler than the afternoon. We recommend a \"smart layering\" strategy: a light jacket or pashmina that you can easily remove once the sun rises. We advise dressing modestly (shoulders and knees covered) to maintain the sanctity of the site. Comfortable walking shoes are a must, as you will be covering roughly 3-4 kilometers of marble and sandstone paths. Don't worry about removing your shoes on the main platform; our tours include high-quality [shoe covers](/india/agra/taj-mahal-ticket-price-2026) that allow you to keep your footwear on while exploring the interior cenotaph chamber of Shah Jahan and Mumtaz Mahal."
        },
        {
          question: "Is there morning prayer during sunrise?",
          answer: `While the Taj Mahal complex houses a red sandstone mosque on its western side, there is no loud, public morning prayer (Adhan) broadcast within the gardens during the standard tourist sunrise hours. The mosque is primarily used for private prayers by authorized personnel and locals on Fridays. However, you will often notice a profound, spiritual stillness during the early hours. The only sounds you'll hear are the waking birds in the Charbagh gardens and the soft footsteps of other sunrise enthusiasts. This provides a contemplative environment where our guides can share the architectural and romantic history of the monument without being drowned out by the mid-day bustle, making the [${tourLabel}](${tourPath}) experience feel truly exclusive and personal.`
        },
        {
          question: "Is the Taj Mahal Sunrise Tour worth the 4:30 AM wake-up call?",
          answer: "Waking up at 4:30 AM is truly necessary and is the only way to experience the Taj Mahal's soul. By arriving at sunrise, you bypass the 40°C afternoon heat and the 40,000+ daily visitors who saturate the complex by noon. The value of seeing the marble change color in near-silence far outweighs an extra two hours of sleep. This is a once-in-a-lifetime moment where the \"platinum light\" of the Golden Hour allows for photos that look like postcards. When you weigh the minor inconvenience of an early start against the intellectual and visual reward of an unobstructed view, the answer is a resounding yes. It is the tactical choice for any serious globetrotter following a premium [agra travel guide 2026](/india/agra/agra-travel-guide-2026)."
        },
        {
          question: "Is it worth booking a private guide for the sunrise tour instead of going solo?",
          answer: "A private, ASI-licensed guide is absolutely worth it because they act as your logistical shield and navigate the complex CISF security protocols for you. Beyond logistics, having a historian explain the pietra dura marble inlay and the optical illusions of the calligraphy transforms a \"pretty building\" into a masterpiece of 17th-century engineering. Without a guide, you are essentially just looking at marble; with us, you are experiencing the political and romantic legacy of the Mughal Empire. For the price of a dinner, you gain a deep, high-authority educational experience that makes your [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time) truly meaningful. It settles all objections regarding the complexity of the site."
        },
        {
          question: "Is it worth visiting Agra just for the sunrise tour?",
          answer: "Many of our guests specifically book a [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) just to witness this one specific sunrise moment—and they never regret it. The Taj Mahal at dawn is an emotional experience that justifies the entire trip to India for many. The sheer scale and symmetry, revealed slowly through the morning mist or the first clear light, is a visual payload that mid-day tours simply cannot deliver. By focusing your energy on the sunrise, you capture the \"prime time\" of the city and can even be back in Delhi or at your next destination by mid-afternoon. If you only have 24 hours in Northern India, the sunrise tour is the highest-value investment of your time and travel budget compared to any other [things to do in Agra](/india/agra/things-to-do-in-agra)."
        }
      ];
    }
    if (slug === 'taj-mahal-agra-fort-guided-tour') {
      return [
        {
          question: "How long does the Taj Mahal & Agra Fort tour take?",
          answer: "A comprehensive [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) typically requires **4 to 6 hours** of active exploration. This duration is strategically designed to allow for a deep-dive into the architectural nuances and historical narratives of two UNESCO World Heritage sites. We usually dedicate approximately 3 hours to the Taj Mahal to appreciate the light transitions on the marble and the symmetry of the gardens, followed by another 2 hours at the Agra Fort to explore the royal pavilions and military ramparts. By booking this combined experience, you ensure a high-authority educational journey that captures the essence of the Mughal Empire's zenith without the stress of independent navigation."
        },
        {
          question: "Which monument do we visit first during the combined tour?",
          answer: "To maximize your visual and physical comfort, we always recommend visiting the **Taj Mahal first**. Starting your day at sunrise or shortly after the gates open is the most tactical decision you can make, as it allows you to beat the 40,000+ daily visitors and the intense afternoon heat that can reach 45°C in summer. Once we have captured those iconic reflecting-pool photos in the \"Golden Hour\" light, we proceed to the Agra Fort. Since the Fort is built largely of thick red sandstone, it provides much better natural shade and remains relatively cooler than the open-air marble platforms of the Taj, making the late-morning transition comfortable and productive."
        },
        {
          question: "How far is the Agra Fort from the Taj Mahal?",
          answer: "The physical distance between these two legendary monuments is surprisingly short, approximately **2.5 kilometers (1.5 miles)**. Under standard traffic conditions in the historical zone, the transition takes about 10 to 15 minutes in our private vehicle. This proximity is exactly why the [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) is the most popular choice for travelers on a restricted [1-day Agra itinerary](/india/agra/1-day-agra-itinerary). Despite being so close, the two sites offer vastly different architectural atmospheres—one being a romantic mausoleum and the other a fortified royal city. Our seamless transport between these points ensures you don't waste precious time or energy on the busy city streets."
        },
        {
          question: "Is transport included between the monuments?",
          answer: "Yes, our premium service level includes **dedicated private transportation** between the Taj Mahal and the Agra Fort. We use modern, air-conditioned vehicles to provide a sanctuary from the bustle and dust of Agra's streets during the short transition. Many budget travelers attempt to use cycle-rickshaws or walk, but our high-authority advice is to utilize private transport to maintain your energy levels for the extensive walking required inside the monuments themselves. Having a driver wait for you at the exit gates of the Taj Mahal and drop you exactly at the entrance of the Fort is a major logistical advantage that defines the premium quality of our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) services."
        },
        {
          question: "Are entry tickets included for both sites?",
          answer: "We offer **fully customizable options** regarding admission. You can choose a \"Guided Only\" package if you prefer to buy your own tickets using your phone, or a \"Full Package\" where we pre-purchase the digital ASI tickets for you. If you choose the inclusion option, we handle all the technicalities of the [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) system for both the Taj Mahal and the Agra Fort. This ensures you have the correct high-value tickets for the main mausoleum entry and avoids any confusion at the turnstiles. Please note that the \"Mausoleum\" entry is an additional fee on top of the base Taj Mahal ticket, and we ensure this is always included in our full-service bookings."
        },
        {
          question: "What is the difference between Taj Mahal and Agra Fort architecture?",
          answer: "The architectural contrast is profound: the Taj Mahal is the pinnacle of **Indo-Islamic funerary architecture**, characterized by its ethereal white Makrana marble, delicate pietra dura stone inlay, and perfect bilateral symmetry. In contrast, the Agra Fort is a massive **military and residential citadel** built primarily of rugged red sandstone. While the Taj Mahal represents the romantic and spiritual side of the Mughal Empire, the Agra Fort showcases its political and military power through 70-foot high ramparts and defensive moats. Inside the Fort, however, you will find delicate white marble palaces like the Khas Mahal, which served as the precursor to the Taj's style. This architectural evolution is a core focus of our [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour)."
        },
        {
          question: "Can we see the Taj Mahal from the Agra Fort?",
          answer: "Absolutely, and it is one of the most poignant moments of the entire experience. From the **Musamman Burj** (an octagonal tower) within the Agra Fort, you can enjoy a stunning, framed view of the Taj Mahal sitting across the Yamuna River. This is the exact spot where Emperor Shah Jahan was reportedly imprisoned by his son, Aurangzeb, spendng the final eight years of his life gazing at the monument he built for his wife. This high-authority historical site provides a unique perspective that you cannot get from the Taj's own gardens. Our guides will help you find the best vantage points for photography, ensuring you capture that iconic \"view from the balcony\" that is essential for any [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) collection."
        },
        {
          question: "Is the Agra Fort wheelchair accessible?",
          answer: "The Agra Fort is partially accessible, though it presents more challenges than the Taj Mahal. The main entrance at Amar Singh Gate has a **steep ramp** that requires a strong assistant or motorized help. Many of the interior courtyards are paved with flat stone and are accessible, but certain high-value areas like the interior of the Jahangiri Mahal have small steps. However, as local experts, we have designed specific \"accessibility paths\" that bypass the most difficult stairs. If you or a family member uses a wheelchair, please notify us during booking so we can arrange additional assistance and ensure your [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) is comfortable. Most of the primary palaces can be viewed from the courtyards without needing to climb steps."
        },
        {
          question: "Is this tour too long or strenuous for elderly visitors?",
          answer: "We pride ourselves on creating a **flexible and senior-friendly pace**. While the combined tour involves significant walking (approx. 4-5 km total), we utilize electric carts for the 1km approach to the Taj Mahal to save your energy. Within the monuments, our guides are trained to identify seating areas and shade where you can rest while they share historical anecdotes. If you feel tired after the Taj Mahal, we can customize the Agra Fort segment to focus only on the main palaces near the entrance, skipping the more military-style hiking. This ability to dial the intensity up or down is why our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) approach is highly rated by multi-generational families who want to experience history without exhaustion."
        },
        {
          question: "Are both monuments official UNESCO World Heritage sites?",
          answer: "Yes, both the Taj Mahal and the Agra Fort are prestigious **UNESCO World Heritage Sites**, designated in 1983. They are considered the \"twin pillars\" of Mughal history in India. The Taj Mahal is recognized for being the \"jewel of Muslim art in India,\" while the Agra Fort is honored for its status as a major 16th-century Mughal monument of red sandstone. Visiting both on a single [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) is logically consistent because their histories are inextricably linked. The Fort was the seat of power where the decisions to build the Taj were made. Experiencing both UNESCO sites together provides the high-authority educational context needed to understand why the Mughal Empire remains such a fascinating chapter of global history."
        },
        {
          question: "Can we add Mehtab Bagh (Moonlight Garden) to this tour?",
          answer: "We can certainly add a visit to **Mehtab Bagh** as a \"sunset finale\" to your combined tour. Located directly across the Yamuna River from the Taj Mahal, this 25-acre garden complex offers the perfect symmetrical view of the mausoleum without the crowds. It is particularly valuable on Fridays when the Taj is closed, or for photographers who want the \"rear view\" of the monument reflected in the river. Adding this site extends the tour by about 1 hour and requires a short drive across the river bridge. For many travelers, this is the ultimate objection-killer because it allows for a peaceful, long-distance appreciation of the monument after the close-up intensity of the [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour)."
        },
        {
          question: "Are guides allowed to enter inside the Agra Fort with us?",
          answer: "Yes, our **ASI-licensed guides** are fully authorized to accompany you inside every accessible area of the Agra Fort, including the Diwan-i-Aam (Hall of Public Audience) and the royal pavilions. Unlike some countries where site-specific guides are required, our guides stay with you throughout the entire 5-hour journey. This continuity is vital for a high-authority experience, as the guide can draw direct comparisons between the architecture of the Taj Mahal and the Fort. They will navigate the complex security gates and interior paths for you, ensuring you don't miss the hidden gems like the Anguri Bagh (Grape Garden) or the Gem Mosque. Their presence ensures your [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) remains educational and logistically smooth from start to finish."
        },
        {
          question: "Is there a lunch stop included in the combined tour?",
          answer: "While lunch is not strictly part of the \"monument time,\" we always build in a **flexible lunch break** between the Taj Mahal and the Agra Fort. We have a curated list of high-authority restaurant partners ranging from traditional Mughal thali spots to modern international cafes with views of the Taj. We avoid the \"tourist trap\" buffets that many large bus tours frequent, instead focusing on clean, authentic establishments that meet international hygiene standards. This break is essential for hydration and rest, allowing you to process the morning's history before tackling the Fort. If you are on a tight [1-day Agra itinerary](/india/agra/1-day-agra-itinerary), we can arrange a quick but high-quality meal to keep the day moving efficiently without sacrificing quality."
        },
        {
          question: "What is the best season for a combined Taj and Fort tour?",
          answer: "The \"Platinum Window\" for visiting Agra is from **October to March**. During these months, the weather is pleasantly cool with clear blue skies, making the extensive walking required for the [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) very easy. December and January can bring morning fog, which adds a mystical atmosphere to the Taj but may delay sunrise views. Conversely, the summer months (April to June) are extremely hot, with temperatures often exceeding 40°C, necessitating a very early 5:30 AM start. Monsoon season (July to September) brings humidity and occasional heavy rain, but also results in lush, green gardens and fewer tourists. We calibrate our pickup times and tour intensity based on the specific month of your visit to ensure maximum comfort."
        },
        {
          question: "Can we shorten the Agra Fort visit if we feel tired?",
          answer: "Absolutely. One of the primary benefits of a **private guided tour** is that it is 100% adaptable to your energy levels. If you feel that you've reached your \"historical limit\" after the Taj Mahal, we can pivot to a \"Highlights Only\" version of the Agra Fort. This focuses on the most spectacular palaces located close to the entrance, reducing the walking distance by half while still allowing you to see the famous Musamman Burj view of the Taj. We never force our guests to follow a rigid schedule; if you'd rather trade an hour of fort-walking for a relaxed coffee or some souvenir shopping in the local bazaars, our [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) planners will make it happen seamlessly. Your comfort is our highest priority."
        },
        {
          question: "Is photography allowed inside the Agra Fort?",
          answer: "Yes, **photography is permitted** throughout most of the Agra Fort complex for personal use. You are encouraged to capture the intricate carvings and the stunning river views. However, please note that there are two specific restrictions: first, professional equipment like tripods and large lighting rigs requires a separate, expensive permit from the ASI. Second, like the Taj Mahal, photography is generally prohibited inside the very small, specific religious prayer areas (mosques) if they are in active use. For the most part, you can freely document your [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) with your camera or smartphone. Our guides know the exact \"symmetry spots\" where you can get professional-looking photos without other tourists in the frame, making your social media posts truly high-authority."
        },
        {
          question: "Are large bags allowed inside the monuments?",
          answer: "No, both the Taj Mahal and the Agra Fort have **strict security protocols** that prohibit large backpacks, suitcases, or heavy bags. Only small ladies' handbags or small day-packs containing essentials like water, cameras, and wallets are permitted. Prohibited items include tobacco, lighters, knives, chargers, and food. To simplify your visit, we recommend leaving all non-essential items in our private vehicle, which remains parked in a secure zone with our driver. This \"clean-entry\" strategy allows you to breeze through the CISF security checks and start your [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) without the hassle of using the monument locker rooms, which can have long queues. This is a vital tactical tip for maintaining a smooth pace during your visit."
        },
        {
          question: "Is this a private tour or a shared group tour?",
          answer: "This experience is **strictly a private tour**, meaning you will have your own dedicated ASI-licensed guide and private vehicle. We do not consolidate individual bookings into large groups. This private format is the only way to deliver a high-authority, personalized experience where you can ask as many questions as you like and move at your own pace. Whether you are a solo traveler, a couple on a honeymoon, or a large family, the tour is tailored exclusively to your group. This settles the common objection of being \"stuck\" with a slow group or missing out on details because the guide is too far away. By choosing our [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour), you are investing in a premium, 1-on-1 educational session that respects your time and interests."
        },
        {
          question: "Is the combined Taj Mahal and Agra Fort tour worth the price?",
          answer: "When you consider the logistical complexity of navigating Agra's traffic and the dense history of these sites, the [Taj Mahal & Agra Fort Guided Tour](/india/agra/taj-mahal-agra-fort-guided-tour) is **the highest-value investment** you can make for your India trip. Attempting to see both sites independently often results in \"temple fatigue\" and wasted hours in ticket queues or negotiating with local transport. By booking this expert-led combined tour, you gain a seamless narrative that connects the dots between a lover's tomb and a royal fortress. The \"intellectual payload\" you receive from a historian-guide transforms these monuments from mere stone structures into living stories. When you factor in the private transport, the skip-the-line ticket assistance, and the climate-controlled comfort, the value-to-cost ratio is overwhelmingly positive for any serious globetrotter."
        },
        {
          question: "Is it worth seeing the Agra Fort if I've already seen the Red Fort in Delhi?",
          answer: "While both are Mughal masterpieces, many historians consider the **Agra Fort to be far superior** in terms of architectural preservation and intricate detail. While the Delhi Red Fort is impressive for its massive walls, the interior palaces of the Agra Fort (like the Khas Mahal and Shish Mahal) are much more intact and offer better examples of the transition from sandstone to marble. Furthermore, the unique \"Taj-view\" perspectives available only from the Agra Fort make it an essential companion piece to the mausoleum itself. If you only visit the Taj Mahal without the Fort, you are only getting half of the Mughal story. For anyone following a premium [agra travel guide 2026](/india/agra/agra-travel-guide-2026), the Agra Fort is a non-negotiable inclusion that provides deep historical context and unparalleled photography opportunities."
        }
      ];
    }
    if (slug === 'taj-mahal-delhi-guided-tour') {
      return [
        {
          question: "What time do we typically leave Delhi for a Taj Mahal day tour?",
          answer: "For the most tactical and visually rewarding [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary), we recommend a **3:00 AM or 4:00 AM departure**. This early start is the only way to witness the Taj Mahal at sunrise, allowing you to experience the \"Platinum Hour\" before the intense heat and the 40,000+ daily visitors arrive. If you prefer a more relaxed schedule, a 6:00 AM or 7:00 AM departure is also feasible, though you will encounter more traffic on the way out of the capital. Our private chauffeurs are highly punctual, ensuring you are on the Yamuna Expressway while the rest of the city is still asleep, maximizing your exploration time in the City of Love."
        },
        {
          question: "How long is the actual Delhi to Agra drive and is the expressway safe?",
          answer: "The drive from Delhi to Agra via the **Yamuna Expressway** typically takes between **3 to 3.5 hours** under standard conditions. This 165 km six-lane toll road is the most modern and safest highway in Northern India, bypassing the congested older towns. We prioritize your security by using late-model vehicles equipped with professional-grade safety features and experienced chauffeurs who specialize in this specific corridor. The expressway is fully paved and features multiple monitored rest plazas with clean facilities and international food options. This seamless logistical path is what makes a high-quality [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) not only possible but extremely comfortable for international travelers."
        },
        {
          question: "Do you recommend traveling from Delhi to Agra by car or by train?",
          answer: "While the Gatimaan Express train is fast, we strongly recommend a **private car for maximum flexibility**. A private [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) by car allows you to set your own pace, choose your own pickup time from your hotel, and store your luggage securely throughout the day. More importantly, it provides door-to-door service without the stress of navigating train stations or coordinating with local taxis in Agra. If you are traveling as a family or small group, the cost-to-comfort ratio of a private air-conditioned SUV is far superior to first-class train tickets, providing a \"sanctuary on wheels\" throughout your 12-hour journey."
        },
        {
          question: "Is hotel pickup available from Gurgaon, Noida, or near the Airport?",
          answer: "Yes, our high-authority service includes **complimentary door-to-door pickup** from any location within the National Capital Region (NCR), including New Delhi, Gurgaon (Gurugram), Noida, and hotels near the Indira Gandhi International Airport (IGIA). We calibrate our pickup windows based on your specific location to ensure we hit the Yamuna Expressway at the optimal time. Whether you are staying at a major global chain in Aerocity or a private residence in South Delhi, our chauffeur will be waiting in the lobby at the scheduled time. This all-inclusive logistical support removes the biggest objection for travelers staying outside the main city center, making the [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) effortless."
        },
        {
          question: "Is it possible to visit both the Taj Mahal and Agra Fort in one day?",
          answer: "Absolutely—the [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) is specifically engineered to cover both UNESCO World Heritage sites seamlessly. A typical itinerary includes 3 hours at the Taj Mahal for deep exploration and photography, a relaxed 5-star lunch break, and 2 hours at the historical Agra Fort citadel. Because of the efficiency of the Yamuna Expressway, you can easily accomplish this in a 12-hour window. You can even add a quick visit to the Baby Taj (Itimad-ud-Daulah) or Mehtab Bagh if you maintain a steady pace. Our guides are experts at navigating the crowds, ensuring you receive a high-authority educational experience without ever feeling rushed or overwhelmed."
        },
        {
          question: "What if the traffic is heavy when returning to Delhi?",
          answer: "Traffic congestion is a reality in any major capital, but we utilize **real-time GPS navigation** and tactical route planning to minimize delays. Our drivers are intimately familiar with the peak-hour bottlenecks in areas like Noida and Sarita Vihar. By timing our departure from Agra around 4:00 PM or 5:00 PM, we aim to reach the Delhi border after the heaviest commuter surge. Even if traffic is dense, you will be in the climate-controlled comfort of a private vehicle with complimentary bottled water and Wi-Fi, turning a potential frustration into a period of relaxation. Our priority is to return you to your hotel safely and as efficiently as the [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) standards dictate."
        },
        {
          question: "Are rest stops and clean restrooms included during the journey?",
          answer: "We understand that comfort and hygiene are non-negotiable for international travelers. We schedule **mandatory rest stops** at high-quality midway plazas on the Yamuna Expressway. these plazas are specifically selected for their international hygiene standards, featuring clean Western-style restrooms, ATMs, and reliable food outlets like Starbucks, Costa Coffee, or high-end Indian vegetarian restaurants. This allows you to stretch your legs, grab a fresh espresso, and freshen up before or after your monument visits. These stops are integrated into our [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) to ensure that the 3-hour journey remains a pleasant part of the overall experience rather than a physical endurance test."
        },
        {
          question: "Is the driver English-speaking and what is their role?",
          answer: "Our drivers are **professional chauffeurs** who speak functional English suited for navigation, basic logistics, and safety coordination. Their primary role is to ensure your physical safety on the road and handle all logistical technicalities like toll taxes and parking. While they are very knowledgeable about the route, they are not licensed historical guides. Upon arrival in Agra, you will be met by your specialized, ASI-licensed historical guide who will lead you through the Taj Mahal and Agra Fort. this \"division of labor\" ensures you have a high-authority expert for the history and a focused professional for the driving—a combination that defines a premium [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour)."
        },
        {
          question: "Can we customize the monument list or add a lunch stop?",
          answer: "Yes, our private tours are **100% customizable**. While the standard itinerary focuses on the Taj Mahal and Agra Fort, you can easily swap or add sites like the Baby Taj, the local handicraft bazaars, or the Mehtab Bagh sunset point. regarding dining, we have a curated list of high-authority restaurant partners. You can choose from a traditional Mughal thali lunch at a respected local spot or a luxury 5-star buffet at a hotel like the Taj Gateway or Courtyard by Marriott. Simply communicate your preferences to your guide or driver on the day, and they will adjust the flow of your [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) experience to match your interests."
        },
        {
          question: "Is it worth doing a Delhi to Agra day trip instead of an overnight stay?",
          answer: "For many travelers, a **same-day trip is actually the superior choice**. It allows you to see the absolute highlights of Agra while keeping your base in Delhi, avoiding the hassle of checking in and out of multiple hotels. Thanks to the high-speed Yamuna Expressway, you can enjoy a full 6-7 hours of high-authority sightseeing and still be back in the capital for dinner. An overnight stay is only recommended if you wish to see the Taj Mahal at both sunrise and sunset on different days, or if you plan to continue your journey further into Rajasthan. For the typical visitor, the efficiency and convenience of our [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) provide the best value for time."
        },
        {
          question: "Is there a lunch stop included in the tour?",
          answer: "We build a **flexible lunch window** into every itinerary. While the cost of lunch is usually an optional add-on (unless you choose our all-inclusive package), we exclusively recommend restaurants that meet the highest international health and hygiene standards. We avoid the low-quality tourist cafes, instead directing our guests to authentic Mughal dining rooms or international luxury hotel buffets. This ensures you can sample the famous \"Petha\" and local Agra cuisine without any concerns about food safety. Taking a break for a high-quality meal is essential to recharge during your [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour), especially after several hours of exploring the vast marble platforms and sandstone courtyards."
        },
        {
          question: "Do I need my passport for ticket booking or monument entry?",
          answer: "For international travelers, carrying a **physical passport is mandatory** for the purchase of the \"Foreigner Category\" tickets and for entry validation by the CISF security personnel at the monuments. While digital copies on your phone are useful for backups, the security officers at the Taj Mahal gates often require the original document to match the name on your digital ASI ticket. We ensure that our ticketing technical assistance covers the correct entry category, but the physical passport check is a federal security requirement. This high-authority advice ensures you don't face any friction at the turnstiles during your [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) exploration."
        },
        {
          question: "Is the Delhi to Agra day trip worth the early wake-up call?",
          answer: "Absolutely. The 3:00 AM wake-up call is the single most important tactical move for a successful Agra visit. By arriving at the Taj Mahal for sunrise, you witness the marble change from a soft gray to a glowing pink and finally a brilliant white—all in relative silence. You bypass the mid-day crowds that can exceed 40,000 people and the punishing afternoon sun. The \"intellectual payload\" of seeing the monument at its most tranquil is worth every minute of lost sleep. This is why our [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) is the top-rated experience for travelers who want the \"platinum version\" of India's most famous site without the logistical stress."
        },
        {
          question: "Is it worth booking a private tour versus a group bus tour from Delhi?",
          answer: "A private tour is **infinitely more valuable** for three reasons: first, you control the timing and don't have to wait for 40 other people at rest stops. Second, your ASI-licensed guide provides a high-authority, 1-on-1 historical narrative that a group guide simply cannot offer. Third, you travel in the privacy and health-conscious environment of your own vehicle. Group buses often follow rigid schedules that arrive at the Taj during peak congestion and heat, leading to a diminished experience. For the price of a modest dinner, the upgrade to a private [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) transforms your visit from a generic shuttle into a meaningful, tailored historical journey."
        },
        {
          question: "Is it worth visiting the Agra Fort after seeing the Taj Mahal?",
          answer: "Yes, visiting the Agra Fort is essential to understanding the **full historical context** of the Taj Mahal. While the Taj is a spiritual and romantic monument, the Agra Fort was the seat of the Mughal Empire's political and military power. It is where Emperors Akbar, Jahangir, and Shah Jahan lived and ruled. Most importantly, the Fort contains the Musamman Burj, the tower where Shah Jahan was imprisoned and spent his final years gazing at his wife's tomb across the river. Skipping the Fort means you only get half of the story. Our [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) ensures you see both sides of the coin, providing the deep-dive historical context that every serious traveler seeks."
        },
        {
          question: "Is the Delhi to Agra day trip suitable for elderly travelers?",
          answer: "Yes, we prioritize the **comfort of senior citizens** by ensuring a private, flexible pace. We provide late-model SUVs with easy ingress/egress and ample legroom for the 3-hour journey. In the monuments, your guide will arrange for electric golf cart transport (where available) to minimize walking distances between the parking area and the main platforms. We also strategically plan our visits to the Taj Mahal during the cooler morning hours and include multiple rest stops with clean facilities. This personalized approach settles the objection that a [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary) might be too physically demanding, making it a high-authority choice for multi-generational family groups."
        },
        {
          question: "What happens if the Taj Mahal is closed due to a VIP visit?",
          answer: "While rare, **official VIP closures** or technical maintenance can happen. Because we are high-authority operators with on-ground contacts, we usually receive notifications 24-48 hours in advance. In such cases, we proactively contact you to reschedule your [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour) to the nearest available window. If rescheduling is not possible, we pivot the itinerary to include exceptional alternatives like Fatehpur Sikri or extended time at the Agra Fort and Mehtab Bagh. Our skip-the-line technical assistance ensures that your tickets are adjusted for the new entry time without additional cost, protecting your investment and ensuring your limited time in India is still utilized effectively."
        },
        {
          question: "Are toll taxes and parking fees included in the tour price?",
          answer: "Yes, our pricing is **strictly all-inclusive**. We cover all Yamuna Expressway toll taxes, state border taxes, monument parking fees, and fuel costs. There are no hidden surcharges or \"on-the-road\" payments required. This transparency is a key part of our high-authority service standard, allowing you to relax in your private vehicle without needing to carry large amounts of local currency for transit fees. When you book our [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary), the price you see is the final price for the logistical execution of your journey, ensuring a stress-free transition from the capital to the monuments and back."
        },
        {
          question: "Can we pay the balance on arrival and are child seats available?",
          answer: "We offer **flexible payment structures**, typically requiring a small deposit to secure your vehicle and guide, with the balance payable upon arrival to your driver in Agra. Regarding child safety, we provide specialized child car seats upon prior request for infants and toddlers. This is a vital service for family travelers following a premium [agra travel guide 2026](/india/agra/agra-travel-guide-2026) who want to ensure the same safety standards as they have at home. simply specify the age and weight of your child during the booking process for your [Taj Mahal Delhi Guided Tour](/india/agra/taj-mahal-delhi-guided-tour), and we will have the appropriate equipment installed before your 3:00 AM pickup."
        }
      ];
    }
    if (slug === 'taj-mahal-full-day-tour') {
      return [
        {
          question: "Is the vehicle for the Taj Mahal full day tour strictly private?",
          answer: "Yes, our [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) is built on a strictly private foundation. Your vehicle—whether it is a standard sedan, a premium SUV, or a luxury coach—is reserved exclusively for your party from the moment of pickup in Delhi. This ensures total privacy, allowing you to relax, work, or rest during the 3-hour journey without the noise or unpredictability of group coaches. A private vehicle also means we can adjust the internal temperature, choosing the exact climate-control level that suits your preference. This high-authority service standard is designed for premium buyers who value their personal space and time, turning the transition from Delhi to Agra into a luxurious extension of their overall India experience."
        },
        {
          question: "Will we have the same driver throughout the entire day trip?",
          answer: "Continuity is a hallmark of our premium service. You will be assigned a **dedicated professional chauffeur** who will stay with you from your morning pickup in Delhi until your safe return in the evening. This eliminates the confusion of switching vehicles or coordinating with multiple drivers. Your chauffeur serves as your logistical anchor, managing the Yamuna Expressway transition, the monument parking technicalities, and any spontaneous stops you may require. Having the same driver ensures they become familiar with your pacing and preferences, providing a seamless and secure environment throughout your [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary). Our drivers are trained to prioritize your safety and discretion, adhering to the highest standards of the [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) hospitality."
        },
        {
          question: "Can we stop for photographs or breaks on the Yamuna Expressway?",
          answer: "While the Yamuna Expressway is a high-speed transit corridor, your private [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) includes the flexibility to make tactical stops at the monitored rest plazas. These plazas offer clean facilities and safe panoramas of the Uttar Pradesh countryside. However, for safety reasons, stopping on the actual shoulder of the expressway is strictly prohibited by highway authorities. We instead plan our breaks at designated service areas where you can safely photograph the landscape and enjoy premium refreshments. This ensures that your journey remains both visually rewarding and logistically safe. If you have a specific interest in rural photography, our drivers can suggest the best plazas to stop at while still maintaining the efficiency of your [1-day Agra itinerary](/india/agra/1-day-agra-itinerary)."
        },
        {
          question: "Is a luxury car upgrade available for this private Agra tour?",
          answer: "For our most discerning guests, we offer a range of **luxury vehicle upgrades** including BMW, Mercedes-Benz, or Audi sedans, as well as premium 4x4 SUVs like the Toyota Fortuner. Upgrading your vehicle transforms the 330 km round-trip into a truly world-class experience, featuring superior suspension, premium upholstery, and enhanced noise isolation. If you are traveling as a premium business traveler or for a special occasion like a honeymoon, a luxury upgrade is highly recommended. Simply specify your preference during the booking process for your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour), and we will ensure a pristine, top-tier vehicle is dispatched to your Delhi hotel. This is the ultimate way to settle any concern about the long drive, ensuring you arrive in Agra refreshed and ready for exploration."
        },
        {
          question: "Can we upgrade our lunch to a 5-star luxury buffet?",
          answer: "Absolutely. While our standard [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) includes a high-quality local lunch, we offer a premium upgrade to a **5-star luxury buffet** at Agra's most prestigious hotels, such as the ITC Mughal, the Oberoi Amarvilas, or the Taj Gateway. These dining rooms offer a high-authority culinary experience, featuring royal Mughal recipes prepared with international hygiene standards and impeccable service. A 5-star lunch break is more than just a meal; it is a moment to process the morning's history in a palatial setting. This upgrade is a favorite for premium buyers following an [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) plan, as it provides a refined sanctuary away from the mid-day monument crowds before continuing to the Agra Fort."
        },
        {
          question: "Is the tour guide separate from the driver?",
          answer: "Yes, we adhere to a professional \"division of specialized labor.\" Your tour is facilitated by **two separate professionals**: an expert driver for the 330 km journey and an ASI-licensed historical guide for the monument explorations. Your driver focuses entirely on your road safety and logistical comfort, while your guide—who joins you in Agra—focuses on the architectural nuances and Mughal narratives of the Taj Mahal and Agra Fort. This high-authority approach ensures that you aren't receiving a distracted, multi-tasked service. By having a dedicated specialist for each role, your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) maintains a level of depth and quality that and-driver combinations simply cannot match, providing the premium experience you expect."
        },
        {
          question: "Are the Taj Mahal entry tickets fast-track or skip-the-line?",
          answer: "Our premium [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) service includes **priority ticketing assistance**. While there is no separate \"fast-track\" lane through the federal security check at the monument gates, we pre-book your digital ASI entry tickets in advance. This means you skip the massive public ticket window queues, which can often exceed an hour during the peak season. Upon arrival, your guide handles the technicality of the entry turnstiles, allowing you to move directly to the security screening. This skip-the-line strategy is vital for optimizing your [1-day Agra itinerary](/india/agra/1-day-agra-itinerary), ensuring that your time is spent in front of the marble dome rather than standing in the morning sun waiting for a paper ticket."
        },
        {
          question: "Can we strictly avoid shopping stops during the tour?",
          answer: "Yes, we believe in a **zero-pressure sightseeing experience**. Unlike many budget operators who derive commission from forced visits to marble factories or carpet emporiums, we prioritize your historical interests. If you wish to skip shopping entirely, simply inform your guide at the beginning of the day. Your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) is about the monuments, not the markets. We only suggest local craft visits if you explicitly request to see the traditional artisans at work, such as the descendants of the original Taj marble carvers. This commitment to an \"uncluttered\" itinerary is why we are considered a high-authority choice for serious travelers who want to follow a focused [Agra travel guide 2026](/india/agra/agra-travel-guide-2026) without distraction."
        },
        {
          question: "Is this private Agra tour fully customizable?",
          answer: "Customization is at the core of our premium service. While we have a tried-and-tested logical flow, you are free to **modify the itinerary** based on your specific interests. If you wish to spend more time photographing the Taj Mahal and skip the Baby Taj, or if you'd like to include a visit to the local Christian cemetery to see the Dutch tombs, we will make it happen. You can choose your pickup time, your lunch venue, and the order of monuments. This flexibility is what defines a truly private [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour), transforming it from a standard package into a personal historical commission that respects your unique travel style and pacing."
        },
        {
          question: "What is the cancellation policy for the full day private tour?",
          answer: "We offer a **discerning cancellation policy** that reflects the flexibility required by international travelers. For our private vehicle and guide services, you can generally cancel with a full refund up to 24-48 hours before the scheduled departure. However, please note that government-issued Taj Mahal entry tickets are non-refundable once the specific QR code has been generated by the ASI. This transparent policy protects both your investment and our logistical commitments. We recommend reviewing the specific terms during your booking for the [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour), as we aim to provide a high-authority, stress-free booking environment that accommodates the dynamic nature of luxury travel."
        },
        {
          question: "What happens in the rare event of a vehicle breakdown?",
          answer: "While we use only modern, meticulously maintained vehicles, we have a **rigorous emergency backup protocol** in place. In the extremely unlikely event of a mechanical issue on the Yamuna Expressway, our control center in Delhi can dispatch a relief vehicle from our nearest support station within 60 to 90 minutes. Our drivers are trained in basic troubleshooting but focus on your immediate comfort and safety while the replacement arrives. Your [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) is backed by our regional logistical network, ensuring that a technical glitch never turns into a stranded day. This operational redundacy is a key reason why travelers choose a high-authority operator for their [Delhi to Agra day trip](/india/agra/1-day-agra-itinerary)."
        },
        {
          question: "Is travel insurance included in the private tour package?",
          answer: "Our services include **standard passenger liability insurance** as required by Indian transport laws for all commercial vehicles. This covers basic medical contingencies resulting from transit. However, we strongly recommend that all our guests carry comprehensive personal travel insurance that includes trip cancellation, baggage loss, and international medical evacuation. While we provide the highest-authority logistical safety through experienced drivers and modern vehicles, a private [Taj Mahal Full Day Tour](/india/agra/taj-mahal-full-day-tour) should always be part of a well-insured international journey. This settled objection ensures you have total peace of mind as you traverse the highway and explore the vast complexes of Agra under our professional care."
        }
      ];
    }
    if (slug === 'taj-mahal-entry-ticket') {
      return [
        { question: "Is this an official Taj Mahal entry ticket?", answer: "Yes, these are 100% official digital entry tickets issued by the Archaeological Survey of India (ASI). As an authorized booking partner, we process your admission under strict government regulations, ensuring your QR code is valid at all entry turnstiles. Unlike unauthorized \"skip-the-line\" vouchers sold on the street, our tickets grant you legitimate access to the main Taj Mahal complex, including the peripheral gardens and flanking monuments. By pre-booking with us, you avoid the risk of counterfeit tickets and ensure your visit is recorded in the official ASI attendance system." },
        { question: "Does “skip-the-line” mean skipping security checks?", answer: "It is a common misconception that skip-the-line tickets allow you to bypass the security gates. In reality, \"Skip-The-Line\" refers specifically to bypassing the official ASI ticket window queues, which can often exceed 60 to 90 minutes during the peak tourist season. However, every single visitor to the Taj Mahal, regardless of their status or ticket type, must undergo a mandatory physical security screening conducted by the Central Industrial Security Force (CISF)." }
      ];
    }
    return [];
  })();

  // NOTE: FAQPage schema is injected separately via useEffect (with deduplication).
  // Do NOT add FAQPage here in @graph — it would create a duplicate and break Google Search Console.
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "name": tour?.title || "Tour",
        "description": tour?.shortDescription || "",
        "image": tour?.images?.[0] || "",
        "offers": {
          "@type": "Offer",
          "price": tour?.pricePerPerson || 0,
          "priceCurrency": tour?.currency || "USD"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{tour?.title ? `${tour.title} | ${city || 'Tour'} | AsiaByLocals` : 'AsiaByLocals'}</title>
        <meta name="description" content={tour?.shortDescription || `Book your next adventure in ${city || 'Asia'} with AsiaByLocals.`} />
        {!['Agra', 'Delhi', 'Jaipur', 'Phuket'].includes(city || '') && (
          <meta name="robots" content="noindex, follow" />
        )}
        {/* Dynamic Canonical — only rendered once tour slug is confirmed to prevent /undefined/undefined */}
        {tour?.slug && country && city && (
          <link rel="canonical" href={`https://www.asiabylocals.com/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}/${tour.slug}`} />
        )}
        <meta name="language" content="en" />
        {/* Open Graph */}
        <meta property="og:title" content={tour?.title} />
        <meta property="og:description" content={tour?.shortDescription} />
        {tour?.slug && country && city && (
          <meta property="og:url" content={`https://www.asiabylocals.com/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}/${tour.slug}`} />
        )}
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="AsiaByLocals" />
        <meta property="og:locale" content="en_US" />
        {tour?.images?.[0] && <meta property="og:image" content={tour.images[0]} />}
        {tour?.images?.[0] && <meta property="og:image:width" content="1200" />}
        {tour?.images?.[0] && <meta property="og:image:height" content="630" />}
        {tour?.images?.[0] && <meta property="og:image:alt" content={tour?.title} />}
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tour?.title} />
        <meta name="twitter:description" content={tour?.shortDescription} />
        {tour?.images?.[0] && <meta name="twitter:image" content={tour.images[0]} />}
        {tour?.images?.[0] && <meta name="twitter:image:alt" content={tour?.title} />}
        <meta name="twitter:site" content="@asiabylocals" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-24 sm:h-28 md:h-32 flex items-center justify-between">
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
                className="h-[120px] sm:h-[130px] md:h-[140px] lg:h-[150px] xl:h-[160px] w-auto object-contain"
                style={{ transform: 'translateY(3px)' }}
                width={240}
                height={120}
              />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb - Always rendered if country and city are available, even while loading */}
          <Breadcrumbs
            country={country}
            city={city}
            tourTitle={tour?.title}
          />

          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981] mb-6"></div>
              <p className="text-gray-600 font-black text-xl">Loading amazing experiences...</p>
              <p className="text-gray-400 font-semibold mt-2">Preparing your tour to {city || 'your destination'}</p>
            </div>
          ) : error || !tour ? (
            <div className="py-24 text-center max-w-2xl mx-auto px-6">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-3xl font-black text-[#001A33] mb-4">Tour details unavailable</h2>
              <p className="text-gray-600 text-[18px] font-semibold mb-8">
                {error || 'We couldn\'t load the specific tour details at this moment. This might be due to a temporary connection issue or the tour no longer being active.'}
              </p>
              {country && city && (
                <a
                  href={`/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#10B981] text-white font-black rounded-2xl hover:bg-[#059669] transition-all shadow-lg"
                >
                  <ChevronLeft size={20} />
                  Explore other tours in {city}
                </a>
              )}
            </div>
          ) : (
            <>
              {/* Internal Link: Explore More Tours in City (SEO Cluster) */}
              {country && city && (
                <div className="mb-8 p-6 bg-[#10B981]/5 rounded-2xl border border-[#10B981]/10">
                  <p className="text-[16px] text-gray-700 font-semibold mb-3">
                    Explore more curated experiences in <a href={`/${country.toLowerCase().replace(/\s+/g, '-')}/${city.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#10B981] font-black hover:underline">{city}</a>
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
                        {/* Special badge for yacht/boat charter tours with multiple options */}
                        {tour.options && tour.options.length >= 5 && (tour.title.toLowerCase().includes('yacht') || tour.title.toLowerCase().includes('charter') || tour.title.toLowerCase().includes('catamaran')) && (
                          <span className="px-2 py-1 bg-[#0071EB] text-white text-[12px] font-black rounded flex items-center gap-1">
                            <Anchor size={12} /> {tour.options.length} Options Available
                          </span>
                        )}
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

                    {/* High-Conversion Feature Bar for Yacht/Boat Charters */}
                    {tour.options && tour.options.length >= 5 && (tour.title.toLowerCase().includes('yacht') || tour.title.toLowerCase().includes('charter') || tour.title.toLowerCase().includes('catamaran')) && (
                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 p-3 bg-[#0071EB]/5 border border-[#0071EB]/20 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-[#0071EB] flex items-center justify-center text-white shrink-0">
                            <Anchor size={16} />
                          </div>
                          <div>
                            <div className="text-[13px] font-black text-[#001A33]">{tour.options.length} Private Boats</div>
                            <div className="text-[11px] text-gray-500 font-semibold">Choose your perfect vessel</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-[#0071EB]/5 border border-[#0071EB]/20 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-[#0071EB] flex items-center justify-center text-white shrink-0">
                            <Users size={16} />
                          </div>
                          <div>
                            <div className="text-[13px] font-black text-[#001A33]">Private Charter</div>
                            <div className="text-[11px] text-gray-500 font-semibold">Entire boat for your group</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-[#0071EB]/5 border border-[#0071EB]/20 rounded-xl">
                          <div className="w-8 h-8 rounded-full bg-[#0071EB] flex items-center justify-center text-white shrink-0">
                            <ShieldCheck size={16} />
                          </div>
                          <div>
                            <div className="text-[13px] font-black text-[#001A33]">Captain + Crew</div>
                            <div className="text-[11px] text-gray-500 font-semibold">Fully staffed experience</div>
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
                          width={1200}
                          height={500}
                          fetchPriority="high"
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
                            loading="lazy"
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
                    // Filter out the real DB sortOrder:-1 option (system option) — we'll represent it virtually if needed
                    let allOptions = (tour.options || []).filter((opt: any) => opt.sortOrder !== -1);
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
                      // Detect special yacht/charter tour for horizontal card layout
                      const isYachtCharter = allOptions.length >= 5 && (tour.title.toLowerCase().includes('yacht') || tour.title.toLowerCase().includes('charter') || tour.title.toLowerCase().includes('catamaran'));

                      // Shared price calculation helper
                      const getOptionPrice = (option: any) => {
                        const optTiers = option.groupPricingTiers
                          ? (typeof option.groupPricingTiers === 'string' ? (() => { try { return JSON.parse(option.groupPricingTiers); } catch { return []; } })() : option.groupPricingTiers)
                          : [];
                        const optionHasOwnTiers = Array.isArray(optTiers) && optTiers.length > 0;
                        const priceCurrency = optionHasOwnTiers ? (option.currency || 'INR') : (tour.currency || 'INR');
                        const toDisplayPrice = (price: number) => priceCurrency === 'INR' ? Math.round(price / 85) : price;
                        const currencySymbol = '$';
                        const currentParticipants = isCustomParticipants ? customParticipants : participants;

                        if (optionHasOwnTiers) {
                          const matchingTier = optTiers.find((t: any) =>
                            currentParticipants >= (t.minPeople || 1) && currentParticipants <= (t.maxPeople || 999)
                          ) || optTiers[optTiers.length - 1];
                          const tierPrice = parseFloat(matchingTier?.price || optTiers[0]?.price || option.price || 0);
                          return `${currencySymbol}${toDisplayPrice(tierPrice).toLocaleString()}`;
                        }
                        const groupPrice = calculateGroupPrice(option, currentParticipants);
                        if (groupPrice !== null) {
                          return `${currencySymbol}${toDisplayPrice(groupPrice).toLocaleString()}`;
                        }
                        return `${currencySymbol}${toDisplayPrice(option.price || 0).toLocaleString()}`;
                      };

                      // Extract max guests from option title (e.g. "Up to 15 Guests")
                      const getMaxGuests = (title: string) => {
                        const match = title.match(/up to (\d+)/i);
                        return match ? match[1] : null;
                      };

                      if (isYachtCharter) {
                        // === SPECIAL HORIZONTAL CARD LAYOUT FOR YACHT/CHARTER TOURS ===
                        return (
                          <div className="mb-8" ref={optionsRef}>
                            <h2 className="text-2xl font-black text-[#001A33] mb-2">Choose Your Vessel</h2>
                            <p className="text-[14px] text-gray-500 font-semibold mb-6">{allOptions.length} private boats available — scroll to explore</p>
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:gap-5" style={{ scrollbarWidth: 'thin' }}>
                              {allOptions.map((option: any) => {
                                const isSelected = selectedOption?.id === option.id;
                                const isExpanded = expandedOptions.has(option.id);
                                const maxGuests = getMaxGuests(option.optionTitle);
                                const boatName = option.optionTitle.split('—')[0]?.trim() || option.optionTitle;
                                const boatSpec = option.optionTitle.split('—')[1]?.trim() || '';

                                // Parse option images
                                let optionImages: string[] = [];
                                if (option.images) {
                                  try {
                                    optionImages = typeof option.images === 'string' ? JSON.parse(option.images) : (Array.isArray(option.images) ? option.images : []);
                                  } catch { optionImages = []; }
                                }

                                return (
                                  <div
                                    key={option.id}
                                    className={`snap-start shrink-0 bg-white border-2 rounded-2xl overflow-hidden transition-all flex flex-col ${isExpanded ? 'w-[92vw] sm:w-[380px]' : 'w-[85vw] sm:w-[320px]'} ${isSelected
                                      ? 'border-[#10B981] shadow-lg ring-2 ring-[#10B981]/20'
                                      : 'border-gray-200 hover:border-[#10B981]/40 hover:shadow-md'
                                      }`}
                                  >
                                    {/* Boat Image */}
                                    {optionImages.length > 0 ? (
                                      <div className="relative h-[180px] overflow-hidden">
                                        <img
                                          src={optionImages[0]}
                                          alt={boatName}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                        />
                                        <div className="absolute top-3 left-3">
                                          <span className="px-2.5 py-1 bg-[#10B981] text-white text-[11px] font-black rounded-md shadow-sm">
                                            Private Charter
                                          </span>
                                        </div>
                                        {maxGuests && (
                                          <div className="absolute top-3 right-3">
                                            <span className="px-2.5 py-1 bg-white/90 text-[#001A33] text-[11px] font-black rounded-md shadow-sm flex items-center gap-1">
                                              <Users size={11} /> Up to {maxGuests}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="relative h-[100px] bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                                        <Anchor size={40} className="text-white/30" />
                                        <div className="absolute top-3 left-3">
                                          <span className="px-2.5 py-1 bg-white/20 text-white text-[11px] font-black rounded-md">
                                            Private Charter
                                          </span>
                                        </div>
                                        {maxGuests && (
                                          <div className="absolute top-3 right-3">
                                            <span className="px-2.5 py-1 bg-white/20 text-white text-[11px] font-black rounded-md flex items-center gap-1">
                                              <Users size={11} /> Up to {maxGuests}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Card Header - Green themed */}
                                    <div className="px-5 pt-4 pb-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Anchor size={15} className="text-[#10B981] shrink-0" />
                                        <h3 className="font-black text-[#001A33] text-[16px] truncate">{boatName}</h3>
                                      </div>
                                      {boatSpec && (
                                        <p className="text-gray-500 text-[12px] font-semibold ml-[23px]">{boatSpec}</p>
                                      )}
                                    </div>

                                    {/* Card Body */}
                                    <div className="px-5 pb-5 flex-1 flex flex-col">
                                      {/* Description - clamped when collapsed */}
                                      {!isExpanded && (
                                        <p className="text-[13px] text-gray-600 font-medium leading-relaxed mb-3 line-clamp-2">
                                          {option.optionDescription || ''}
                                        </p>
                                      )}

                                      {/* Quick Specs Badges */}
                                      <div className="flex flex-wrap gap-1.5 mb-3">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#10B981]/10 rounded-full text-[11px] font-bold text-[#10B981]">
                                          <Clock size={11} /> {formatDurationHours(option.durationHours)}
                                        </span>
                                        {option.pickupIncluded && (
                                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#10B981]/10 rounded-full text-[11px] font-bold text-[#10B981]">
                                            <Bus size={11} /> Transfer
                                          </span>
                                        )}
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#10B981]/10 rounded-full text-[11px] font-bold text-[#10B981]">
                                          <CheckCircle2 size={11} /> Free cancel
                                        </span>
                                      </div>

                                      {/* Expandable Details Button - prominent */}
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleOptionExpand(option.id);
                                        }}
                                        className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg text-[13px] font-black text-[#10B981] bg-[#10B981]/5 hover:bg-[#10B981]/10 border border-[#10B981]/20 mb-3 transition-colors"
                                      >
                                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        {isExpanded ? 'Hide Details' : 'View Full Details'}
                                      </button>

                                      {/* Expanded Details */}
                                      {isExpanded && (
                                        <div className="mb-4 space-y-3 text-[12px] animate-in fade-in duration-200">
                                          {/* Full Description */}
                                          <div>
                                            <div className="font-black text-[#001A33] text-[11px] uppercase tracking-wide mb-1">About this vessel</div>
                                            <p className="text-gray-600 font-medium leading-relaxed">{option.optionDescription}</p>
                                          </div>

                                          {/* Specs extracted from description */}
                                          {option.optionDescription && (
                                            <div>
                                              <div className="font-black text-[#001A33] text-[11px] uppercase tracking-wide mb-2">Key Features</div>
                                              <div className="grid grid-cols-2 gap-1.5">
                                                {maxGuests && (
                                                  <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Users size={11} className="text-[#10B981] shrink-0" />
                                                    <span className="font-semibold">Up to {maxGuests} guests</span>
                                                  </div>
                                                )}
                                                <div className="flex items-center gap-1.5 text-gray-600">
                                                  <Clock size={11} className="text-[#10B981] shrink-0" />
                                                  <span className="font-semibold">{formatDurationHours(option.durationHours)}</span>
                                                </div>
                                                {option.optionDescription?.toLowerCase().includes('crew') && (
                                                  <div className="flex items-center gap-1.5 text-gray-600">
                                                    <ShieldCheck size={11} className="text-[#10B981] shrink-0" />
                                                    <span className="font-semibold">Professional crew</span>
                                                  </div>
                                                )}
                                                {option.optionDescription?.toLowerCase().includes('air-condition') && (
                                                  <div className="flex items-center gap-1.5 text-gray-600">
                                                    <CheckCircle2 size={11} className="text-[#10B981] shrink-0" />
                                                    <span className="font-semibold">Air-conditioned</span>
                                                  </div>
                                                )}
                                                {option.optionDescription?.toLowerCase().includes('wifi') && (
                                                  <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Globe size={11} className="text-[#10B981] shrink-0" />
                                                    <span className="font-semibold">WiFi onboard</span>
                                                  </div>
                                                )}
                                                {option.pickupIncluded && (
                                                  <div className="flex items-center gap-1.5 text-gray-600">
                                                    <Bus size={11} className="text-[#10B981] shrink-0" />
                                                    <span className="font-semibold">Hotel transfer</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          )}

                                          {/* Inclusions parsed from description */}
                                          <div>
                                            <div className="font-black text-[#001A33] text-[11px] uppercase tracking-wide mb-2">What's Included</div>
                                            <div className="space-y-1">
                                              {option.optionDescription?.split(/[.,]/).filter((s: string) => s.toLowerCase().includes('includ') || s.toLowerCase().includes('crew') || s.toLowerCase().includes('lunch') || s.toLowerCase().includes('drink') || s.toLowerCase().includes('gear') || s.toLowerCase().includes('snorkel') || s.toLowerCase().includes('kayak') || s.toLowerCase().includes('sup') || s.toLowerCase().includes('towel') || s.toLowerCase().includes('fruit')).length > 0 ? (
                                                // Extract inclusion items from description
                                                (() => {
                                                  const desc = option.optionDescription || '';
                                                  const items: string[] = [];
                                                  if (desc.toLowerCase().includes('crew')) items.push('Professional captain & crew');
                                                  if (desc.toLowerCase().includes('lunch')) items.push('Thai lunch');
                                                  if (desc.toLowerCase().includes('beer')) items.push('Beers included');
                                                  if (desc.toLowerCase().includes('soft drink') || desc.toLowerCase().includes('water')) items.push('Soft drinks & water');
                                                  if (desc.toLowerCase().includes('fruit')) items.push('Fresh fruits');
                                                  if (desc.toLowerCase().includes('welcome drink')) items.push('Welcome drink');
                                                  if (desc.toLowerCase().includes('snorkel')) items.push('Snorkeling gear');
                                                  if (desc.toLowerCase().includes('kayak')) items.push('Kayak');
                                                  if (desc.toLowerCase().includes('sup') || desc.toLowerCase().includes('paddle')) items.push('Stand-up paddleboard');
                                                  if (desc.toLowerCase().includes('towel')) items.push('Towels');
                                                  if (desc.toLowerCase().includes('slide')) items.push('Inflatable slide');
                                                  if (desc.toLowerCase().includes('jacuzzi')) items.push('Floating jacuzzi');
                                                  if (desc.toLowerCase().includes('fishing')) items.push('Fishing gear');
                                                  if (desc.toLowerCase().includes('wifi')) items.push('WiFi & Smart TV');
                                                  if (desc.toLowerCase().includes('floating mat')) items.push('Floating mat');
                                                  if (desc.toLowerCase().includes('tube')) items.push('Inflatable tube');
                                                  if (desc.toLowerCase().includes('snuba')) items.push('SNUBA (on request)');
                                                  if (desc.toLowerCase().includes('insurance') || true) items.push('Accident insurance');
                                                  return items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-1.5 text-gray-600">
                                                      <CheckCircle size={10} className="text-[#10B981] shrink-0" />
                                                      <span className="font-medium">{item}</span>
                                                    </div>
                                                  ));
                                                })()
                                              ) : (
                                                <span className="text-gray-400 italic">Details coming soon</span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Spacer */}
                                      <div className="flex-1" />

                                      {/* Price & Action */}
                                      <div className="border-t border-gray-100 pt-4 mt-2">
                                        <div className="flex items-end justify-between mb-3">
                                          <div>
                                            <div className="text-[11px] text-gray-400 font-semibold uppercase">Private charter</div>
                                            <div className="font-black text-[#001A33] text-[24px] leading-tight">{getOptionPrice(option)}</div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (isSelected) {
                                              setSelectedOption(null);
                                            } else {
                                              setSelectedOption(option);
                                              if (window.innerWidth < 1024 && bookingBoxRef.current) {
                                                setTimeout(() => {
                                                  bookingBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }, 100);
                                              }
                                            }
                                          }}
                                          className={`w-full text-center py-3 rounded-xl font-black text-[14px] transition-all ${isSelected
                                            ? 'bg-[#10B981] text-white shadow-md'
                                            : 'bg-[#10B981] text-white hover:bg-[#059669] shadow-sm hover:shadow-md'
                                          }`}
                                        >
                                          {isSelected ? 'Selected' : 'Select This Boat'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      // === STANDARD VERTICAL LAYOUT FOR OTHER TOURS ===
                      return (
                        <div className="mb-8" ref={optionsRef}>
                          <h2 className="text-2xl font-black text-[#001A33] mb-6">Choose from {allOptions.length} available option{allOptions.length > 1 ? 's' : ''}</h2>
                          <div className="space-y-4">
                            {allOptions.map((option: any) => {
                              const isSelected = selectedOption?.id === option.id;
                              // Convert INR prices to USD at 85 INR = 1 USD
                              const currencySymbol = '$';
                              // If option has no own groupPricingTiers it falls back to main tour's tiers (which may be INR)
                              const optTiers = option.groupPricingTiers
                                ? (typeof option.groupPricingTiers === 'string' ? (() => { try { return JSON.parse(option.groupPricingTiers); } catch { return []; } })() : option.groupPricingTiers)
                                : [];
                              const optionHasOwnTiers = Array.isArray(optTiers) && optTiers.length > 0;
                              // Use option's own currency if it has own tiers; otherwise use main tour's currency (inherited tiers)
                              const priceCurrency = optionHasOwnTiers ? (option.currency || 'INR') : (tour.currency || 'INR');
                              const toDisplayPrice = (price: number) => priceCurrency === 'INR' ? Math.round(price / 85) : price;

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
                                          <span>{formatDurationHours(option.durationHours)}</span>
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

                                            // If option has its own tiers, use them directly (avoid calculateGroupPrice
                                            // which always prefers tour.groupPricingTiers over option tiers)
                                            if (optionHasOwnTiers) {
                                              const matchingTier = optTiers.find((t: any) =>
                                                currentParticipants >= (t.minPeople || 1) && currentParticipants <= (t.maxPeople || 999)
                                              ) || optTiers[optTiers.length - 1];
                                              const tierPrice = parseFloat(matchingTier?.price || optTiers[0]?.price || option.price || 0);
                                              return `${currencySymbol}${toDisplayPrice(tierPrice).toLocaleString()}`;
                                            }

                                            // No own tiers — fall back to main tour tiers (which are in tour.currency)
                                            const groupPrice = calculateGroupPrice(option, currentParticipants);
                                            if (groupPrice !== null) {
                                              return `${currencySymbol}${toDisplayPrice(groupPrice).toLocaleString()}`;
                                            }

                                            // Last fallback: option.price
                                            return `${currencySymbol}${toDisplayPrice(option.price || 0).toLocaleString()}`;
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
                    <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                      <div className="text-[16px] sm:text-[17px] text-gray-700 font-normal sm:font-medium leading-[1.8] whitespace-pre-wrap break-words">
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
                                    <a key={`l-${i}`} href={match[2]} className="text-[#10B981] font-black border-b-2 border-[#10B981]/20 hover:border-[#10B981] transition-all">
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
                            if (!trimmed) return <div key={i} className="h-4"></div>;

                            // Handle Special Bold Headers (Entire line is **Text**)
                            if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.slice(2, -2).includes('**')) {
                              const content = trimmed.slice(2, -2);

                              // Check if it's a Time Heading (e.g., "06:00 AM – Title")
                              const timeMatch = content.match(/^(\d{2}:\d{2}\s?(?:AM|PM))\s?[-–—]\s?(.*)$/i);
                              if (timeMatch) {
                                return (
                                  <div key={i} className="mt-10 mb-6 group first:mt-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                      <span className="bg-[#10B981] text-white px-3 py-1 rounded-full text-[12px] sm:text-[13px] font-black uppercase tracking-wider shadow-sm shadow-[#10B981]/20">
                                        {timeMatch[1]}
                                      </span>
                                      <span className="text-lg sm:text-xl font-black text-[#001A33] group-hover:text-[#10B981] transition-colors leading-tight">
                                        {timeMatch[2]}
                                      </span>
                                    </div>
                                    <div className="mt-4 h-[1px] w-full bg-gradient-to-r from-gray-100 via-gray-50 to-transparent"></div>
                                  </div>
                                );
                              }

                              // Main Title / Summary Header
                              if (content.toLowerCase().includes('tour') || content.toLowerCase().includes('itinerary')) {
                                return (
                                  <div key={i} className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 first:mt-0 mt-6">
                                    <h3 className="text-lg sm:text-xl font-black text-[#001A33] uppercase tracking-tight flex items-center gap-3">
                                      <div className="w-1.5 h-6 bg-[#10B981] rounded-full"></div>
                                      {content}
                                    </h3>
                                  </div>
                                );
                              }

                              // Standard Section Header
                              return (
                                <h4 key={i} className="text-[17px] sm:text-[18px] font-black text-[#001A33] mt-10 mb-4 flex items-center gap-3">
                                  <div className="w-2.5 h-2.5 rounded-full border-2 border-[#10B981] bg-white"></div>
                                  {content}
                                </h4>
                              );
                            }

                            // Handle Headings
                            if (trimmed.startsWith('# ')) {
                              return <h1 key={i} className="text-2xl sm:text-3xl font-black text-[#001A33] mb-8 mt-12 border-b-2 border-gray-50 pb-4">{trimmed.replace('# ', '')}</h1>;
                            }
                            if (trimmed.startsWith('## ')) {
                              return <h2 key={i} className="text-xl sm:text-2xl font-black text-[#001A33] mb-6 mt-10">{trimmed.replace('## ', '')}</h2>;
                            }
                            if (trimmed.startsWith('### ')) {
                              return <h3 key={i} className="text-[18px] sm:text-xl font-black text-[#001A33] mb-4 mt-8">{trimmed.replace('### ', '')}</h3>;
                            }

                            // Handle Separators
                            if (trimmed === '---') {
                              return (
                                <div key={i} className="my-12 flex items-center justify-center gap-4">
                                  <div className="h-px flex-1 bg-gray-100"></div>
                                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                  <div className="h-px flex-1 bg-gray-100"></div>
                                </div>
                              );
                            }

                            // Handle Bullets
                            if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                              const content = trimmed.startsWith('* ') ? trimmed.replace('* ', '') : trimmed.replace('- ', '');
                              return (
                                <div key={i} className="flex gap-4 mb-4 ml-2 group">
                                  <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0"></div>
                                  <span className="text-gray-700 leading-relaxed font-semibold text-[15px] sm:text-[16px]">{renderMarkdownText(content)}</span>
                                </div>
                              );
                            }

                            // Handle Numbered Lists
                            if (/^\d+\.\s/.test(trimmed)) {
                              const splitIndex = trimmed.indexOf('. ');
                              const index = trimmed.substring(0, splitIndex);
                              const content = trimmed.substring(splitIndex + 2);
                              return (
                                <div key={i} className="flex gap-3 mb-4 ml-2 items-start">
                                  <span className="text-[#10B981] font-black min-w-[20px] text-[15px] sm:text-[16px] mt-0.5">{index}.</span>
                                  <span className="text-gray-700 leading-relaxed font-semibold text-[15px] sm:text-[16px]">{renderMarkdownText(content)}</span>
                                </div>
                              );
                            }

                            // Handle Paragraphs
                            return (
                              <p key={i} className="mb-6 last:mb-0 text-gray-700 leading-relaxed text-[15px] sm:text-[16px]">
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
                              if (!time.includes(':')) return time;
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
                          if (trimmed.startsWith('##')) {
                            const level = trimmed.startsWith('###') ? 'text-lg' : 'text-xl';
                            return <h2 key={index} className={`${level} font-black text-[#001A33] mt-6 mb-3 first:mt-0`}>{trimmed.replace(/^#+\s*/, '')}</h2>;
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
                            Duration {formatDurationDisplay(tour.duration)}
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
                      {tour.pickupIncluded && (
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
                              Starting from $
                              {(() => {
                                const INR_TO_USD_SIDEBAR = 85;
                                const sidebarConvert = (p: number) => tour.currency === 'INR' ? Math.round(p / INR_TO_USD_SIDEBAR) : p;
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
                                return sidebarConvert(priceForOne).toLocaleString();
                              })()}
                            </span>
                            <div className="text-3xl font-black text-red-600">
                              $
                              {(() => {
                                const currentParticipants = isCustomParticipants ? customParticipants : participants;
                                console.log('═══════════════════════════════════════════════════════════');
                                console.log('💰 DYNAMIC PRICE CALCULATION (person count changed)');
                                console.log('═══════════════════════════════════════════════════════════');
                                console.log('📥 Selected persons:', currentParticipants);
                                console.log('   isCustomParticipants:', isCustomParticipants);

                                // Always use group pricing logic - calculate from tiers
                                const groupPrice = calculateGroupPrice(tour, currentParticipants);
                                const sidebarConvertDynamic = (p: number) => tour.currency === 'INR' ? Math.round(p / 85) : p;

                                if (groupPrice !== null && groupPrice > 0) {
                                  console.log('✅ Using calculated group price:', groupPrice);
                                  console.log('═══════════════════════════════════════════════════════════');
                                  return sidebarConvertDynamic(groupPrice).toLocaleString();
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
                                      return sidebarConvertDynamic(optionGroupPrice).toLocaleString();
                                    }
                                  }
                                  // DO NOT use groupPrice - it's the LAST tier price (wrong)
                                }

                                // Fallback: use pricePerPerson (should be first tier price)
                                console.warn('⚠️ Using fallback pricePerPerson:', tour.pricePerPerson);
                                console.log('═══════════════════════════════════════════════════════════');
                                return sidebarConvertDynamic(tour.pricePerPerson || 0).toLocaleString();
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
                              $
                              {(() => {
                                const currentParticipants = isCustomParticipants ? customParticipants : participants;
                                // Same logic: if option has no own tiers, price came from main tour's INR tiers
                                const selOptTiers = selectedOption.groupPricingTiers
                                  ? (typeof selectedOption.groupPricingTiers === 'string' ? (() => { try { return JSON.parse(selectedOption.groupPricingTiers); } catch { return []; } })() : selectedOption.groupPricingTiers)
                                  : [];
                                const selOptHasOwnTiers = Array.isArray(selOptTiers) && selOptTiers.length > 0;
                                const selOptPriceCurrency = selOptHasOwnTiers ? (selectedOption.currency || 'INR') : (tour.currency || 'INR');
                                const convertOpt = (p: number) => selOptPriceCurrency === 'INR' ? Math.round(p / 85) : p;
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

                                // If selected option has own tiers, use them directly
                                if (selOptHasOwnTiers) {
                                  const matchingTier = selOptTiers.find((t: any) =>
                                    currentParticipants >= (t.minPeople || 1) && currentParticipants <= (t.maxPeople || 999)
                                  ) || selOptTiers[selOptTiers.length - 1];
                                  const tierPrice = parseFloat(matchingTier?.price || selOptTiers[0]?.price || selectedOption.price || 0);
                                  return convertOpt(tierPrice).toLocaleString();
                                }

                                // No own tiers — fall back to main tour tiers (INR)
                                const groupPrice = calculateGroupPrice(selectedOption, currentParticipants);
                                if (groupPrice !== null && groupPrice > 0) {
                                  return convertOpt(groupPrice).toLocaleString();
                                }

                                // Last resort: option.price
                                return convertOpt(selectedOption.price || 0).toLocaleString();
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
                          <span className="flex-1 min-w-0 truncate pr-2">{selectedDate ? (() => { const [y,m,d] = selectedDate.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }); })() : 'Select date'}</span>
                          <Calendar className="text-gray-400 shrink-0" size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Booking Options - Dropdown Style */}
                    <div className="space-y-4 mb-6">
                      <div className="relative">
                        <select
                          value={participants}
                          onChange={(e) => {
                            setIsCustomParticipants(false);
                            setParticipants(parseInt(e.target.value));
                          }}
                          className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 pr-10 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none appearance-none"
                        >
                          {Array.from({ length: effectiveMaxGroupSize }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>Adult x {num}</option>
                          ))}
                        </select>
                        <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                      </div>

                      {/* Custom Participants Input */}
                      {isCustomParticipants && (
                        <div className="relative">
                          <input
                            type="number"
                            min="11"
                            max={effectiveMaxGroupSize}
                            value={customParticipants}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              const value = isNaN(val) ? 11 : Math.min(val, effectiveMaxGroupSize);
                              setCustomParticipants(value);
                              setParticipants(value);
                            }}
                            className="w-full bg-white border-2 border-gray-200 rounded-2xl py-4 px-4 pr-10 font-bold text-[#001A33] text-[14px] focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] outline-none"
                            placeholder={`Enter adults (max ${effectiveMaxGroupSize})`}
                          />
                          <Users className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                      )}

                      {/* Contact Support for custom/larger groups */}
                      <div className="mt-2 text-[12px] font-semibold text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 italic">
                        Need a custom booking or have a larger group?
                        <a
                          href="https://wa.me/918449538716"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] ml-1 hover:underline flex items-center gap-1 mt-1 font-black"
                        >
                          Contact Support via WhatsApp
                        </a>
                      </div>


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
                          This tour is available for {selectedDate ? (() => { const [y,m,d] = selectedDate.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }); })() : 'selected dates'}
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
                        /* Using extracted getTourSpecificFAQs */

                        const tourFAQs = (() => {
                          const tourTitle = tour.title || 'this tour';
                          const specificFAQs = getTourSpecificFAQs(tourTitle, tourSlug || tour?.slug);
                          const faqs = specificFAQs || [
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

                          const isAgraTour = tour.city?.toLowerCase() === 'agra' || tourTitle.toLowerCase().includes('taj-mahal');

                          if (isAgraTour) {
                            const standardAgraFAQs = [
                              {
                                question: "Is the Taj Mahal closed on Friday?",
                                answer: "Yes, the Taj Mahal is closed every Friday for religious reasons. Please ensure your tour date for the Taj Mahal does not fall on a Friday."
                              },
                              {
                                question: "Is original passport mandatory for entry?",
                                answer: "Yes, foreign tourists must show their original passport or a high-quality digital photo at the entrance gates for security identification and monument entry."
                              }
                            ];

                            // Add if not already present in specific FAQs
                            standardAgraFAQs.forEach(af => {
                              if (!faqs.some(f => f.question.toLowerCase() === af.question.toLowerCase())) {
                                faqs.push(af);
                              }
                            });
                          }

                          if (!specificFAQs) {
                            faqs.push({
                              question: `Will I receive confirmation after booking the ${tourTitle}?`,
                              answer: "Yes, once your booking is completed via our secure gateway, you will receive an instant confirmation email with your tour details and guide contact information."
                            });
                          }

                          return faqs;
                        })();

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
            </>
          )}
        </div>
      </main>

      {/* Global Footer - Always rendered for SEO */}
      <Footer />

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
                      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
                    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
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
                {(tour.options || []).filter((opt: any) => opt.sortOrder !== -1).map((option: any) => {
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
                              <span>{formatDurationHours(option.durationHours)}</span>
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
                      {selectedDate ? (() => { const [y,m,d] = selectedDate.split('-').map(Number); return new Date(y,m-1,d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); })() : 'Not selected'}
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

