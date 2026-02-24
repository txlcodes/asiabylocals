const fs = require('fs');

const faqs = `
  if (slug === 'taj-mahal-entry-ticket') {
    return [
      {
        question: "Is this official ASI ticket?",
        answer: "Yes, these are 100% official digital entry tickets issued directly by the Archaeological Survey of India (ASI). When you purchase a **Taj Mahal Entry Ticket 2026**, you are securing a legitimate, government-approved QR code that is universally recognized at all electronic turnstiles. Unlike unauthorized vouchers peddled by street vendors that often lead to denied entry, our official passes guarantee seamless access to the peripheral gardens, the flanking mosque, and the actual monument platforms. By securing your official documentation in advance, you immediately neutralize the risk of counterfeit tickets and eliminate the anxiety of dealing with aggressive touts at the physical booking windows. It is the absolute safest, most secure, and most intelligent logistical choice for international travelers following a strict [1-day Agra itinerary](/india/agra/1-day-agra-itinerary)."
      },
      {
        question: "Do I skip only ticket line or security too?",
        answer: "The term \\"skip-the-line\\" refers exclusively to bypassing the incredibly long, physical ASI ticket purchasing queues, which often consume 60 to 90 minutes of your valuable time during the peak tourist season. By pre-booking your **Taj Mahal Entry Ticket 2026** with us, you completely skip this tedious logistical hurdle and proceed directly to the entrance. However, for federal security reasons, absolutely no visitor—regardless of VIP status or ticket tier—is permitted to bypass the mandatory physical security screening conducted by the Central Industrial Security Force (CISF). Every tourist must undergo this metal detector check and bag screening. To minimize this final wait, we strongly recommend arriving right at sunrise and minimizing the items in your daypack, ensuring your seamless transition into your scheduled [Agra guided tour](/india/agra/things-to-do-in-agra)."
      },
      {
        question: "Is mausoleum access included?",
        answer: "Yes, there is a critical distinction in ticketing: the base ticket only permits entry to the gardens, whereas our premium comprehensive pass explicitly includes the \`Mausoleum Entry\` supplement. Your **Taj Mahal Entry Ticket 2026** guarantees full access not only to the sprawling Persian Charbagh gardens and the iconic reflecting pools but also grants you permission to step onto the main white marble platform. Most importantly, it allows you to enter the highly restricted circular interior chamber containing the stunning 17th-century cenotaphs of Emperor Shah Jahan and Mumtaz Mahal. Many budget tourists mistakenly purchase the cheaper base ticket and are devastatingly denied entry to the main dome. We eliminate this devastating error by always bundling the complete, all-inclusive access pass for a high-authority [visit to the Taj Mahal](/india/agra/taj-mahal-opening-time)."
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
        answer: "The CISF implements severe aviation-grade security protocols. You must decisively remove large heavy backpacks, bulky tripods, commercial camera lighting rigs, and drone equipment before reaching the turnstiles with your **Taj Mahal Entry Ticket 2026**. Strictly prohibited items including tobacco, lighters, matches, sharp weapons, electronic chargers, laptops, and all food items will be aggressively confiscated without return. We strongly recommend carrying only a minimal, transparent small daypack containing your physical passport, mobile phone, a small camera, and a single half-liter water bottle. Adhering strictly to this \\"clean entry\\" philosophy guarantees that you will effortlessly breeze through the frustrating security bottlenecks, allowing you to maximize your precious time marveling at the architecture rather than arguing with security during your [Delhi to Agra day trip](/india/agra/taj-mahal-delhi-guided-tour)."
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
`;

const fileContent = fs.readFileSync('TourDetailPage.tsx', 'utf8');

// The block to replace:
const blockStart = "if (slug === 'taj-mahal-entry-ticket') {";
const fallbackBlockStart = "if (t.includes('delhi') && t.includes('agra') && t.includes('day trip')) {";

let startIndex = fileContent.indexOf(blockStart);
if (startIndex === -1) {
    console.error("Could not find start index");
    process.exit(1);
}

// Find the position of the next if block which is for 'delhi' day trip
const endIndex = fileContent.indexOf(fallbackBlockStart, startIndex);
if (endIndex === -1) {
    console.error("Could not find end index");
    process.exit(1);
}

// Construct the new content
const before = fileContent.substring(0, startIndex);
const after = fileContent.substring(endIndex);

const updatedContent = before + faqs.trim() + "\\n\\n  " + after;

fs.writeFileSync('TourDetailPage.tsx', updatedContent);

console.log('Successfully injected Taj Mahal Entry Ticket FAQs!');
