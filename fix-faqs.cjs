const fs = require('fs');
const filePath = 'TourDetailPage.tsx';

let content = fs.readFileSync(filePath, 'utf8');

// The new FAQs block
const newFaqsStr = `
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
                                answer: "Absolutely. One of the most unique and valued benefits of booking a **female guide for Taj Mahal** is her intimate understanding of cultural aesthetics, including traditional Indian attire. Many of our international guests wish to wear a stunning saree for their visit to capture those iconic, culturally immersive photographs. Your female guide can provide private, comfortable, and expert assistance with the complex process of saree draping right before you enter the monument. Furthermore, because she understands the precise angles, lighting, and \\\"symmetry points\\\" of the [Taj Mahal photography tour](/india/agra/taj-mahal-photography-tour) landscape, she will act as your personal creative director. She knows exactly how to arrange the fabric to complement the stark white marble background, ensuring your social media photos look professionally styled, elegant, and perfectly framed without the need to hire an external photographer."
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
                                answer: "Yes, acting as an impenetrable logistical shield against local friction is one of your guide's primary responsibilities. The areas surrounding major monuments are notorious for unauthorized photographers, aggressive souvenir hawkers, and various \\\"fast-track\\\" scams that prey on disoriented tourists. Your **local guide for Agra** completely neutralizes these threats. Because she is a highly respected, licensed local authority, touts actively avoid approaching her clients. She ensures you pay the absolutely correct, official [Taj Mahal ticket price 2026](/india/agra/taj-mahal-ticket-price-2026) without hidden markups, prevents you from being overcharged for shoe covers or water, and navigates you swiftly through the mandatory CISF security check protocols. By actively managing these micro-stresses, your guide allows you to maintain total peace of mind and preserves your energy exclusively for appreciating the stunning architecture of your high-value [Agra guided tour](/india/agra/1-day-agra-itinerary)."
                              },
                              {
                                question: "Can we customize duration?",
                                answer: "Absolutely. Because this is a strictly private, bespoke experience, the duration of your **Agra tour by guide** is entirely subservient to your personal energy levels and specific interests. While a standard comprehensive visit to the mausoleum requires approximately two to three hours, we are highly flexible. If you are a serious professional photographer needing extended time to capture the shifting light during a [Taj Mahal sunrise tour](/india/agra/taj-mahal-sunrise-guided-tour), your guide will happily extend the visit. Conversely, if you are an elderly traveler seeking a swift, \\\"highlights only\\\" overview to avoid the intense midday heat, she will expertly distill the history into a shorter, highly efficient 90-minute walk. You dictate the pace; your specialized **female guide for Taj Mahal** will seamlessly adjust the logistical flow and storytelling narrative to ensure your absolute physical comfort and intellectual satisfaction."
                              },
                              {
                                question: "Can she recommend safe cafes?",
                                answer: "Certainly. Food safety and hygiene are primary concerns for international visitors, and your **local guide for Agra** serves as an indispensable culinary filter. She possesses an expertly curated, strictly vetted list of high-authority cafes and restaurants that consistently meet international health and hygiene standards. Whether you desire a serene rooftop cafe offering panoramic, unobstructed views of the Taj Mahal or a pristine dining room serving authentic, refined Mughal cuisine, she will guide you to safe establishments. We strictly avoid the low-quality \\\"tourist trap\\\" buffets that many generic bus tours frequent. By relying on her insider knowledge during your [Delhi to Agra day trip](/india/agra/taj-mahal-delhi-guided-tour), you can confidently explore Agra's rich culinary landscape, sampling famous local delicacies without any anxiety regarding stomach issues or unfair pricing, ensuring your complete culinary satisfaction and safety."
                              },
                              {
                                question: "Is photography assistance included?",
                                answer: "While they are fundamentally historians rather than professional commercial photographers, our female guides are absolute experts at spatial awareness within the complex. They know the exact, highly sought-after \\\"symmetry points,\\\" the best off-center angles, and the optimal lighting conditions for capturing stunning imagery. They will happily and skillfully assist you by taking high-quality photographs using your smartphone or personal camera throughout the [Agra guided tour](/india/agra/things-to-do-in-agra). They know exactly how to position you to perfectly align with the reflecting pools, ensuring you secure those essential, iconic postcard shots without the intrusion of massive tourist crowds explicitly in the frame. This built-in creative assistance saves you the significant expense and hassle of hiring an external photographer, adding immense value to your [Taj Mahal entry ticket](/india/agra/taj-mahal-entry-ticket) experience while ensuring you leave with flawless visual memories."
                              },
                              {
                                question: "Can guide assist elderly women travelers?",
                                answer: "Yes, our female guides are specifically trained to provide an exceptionally gentle, patient, and highly observant pace for elderly female travelers. Exploring a massive heritage complex that requires over 3 kilometers of walking can be physically demanding. Your **female guide for Taj Mahal** proactively manages this by arranging authorized electric golf carts to minimize walking distances from the parking perimeter to the main gates. Inside the complex, she intuitively identifies shaded seating areas where you can rest comfortably while she engagingly explains the complex history. Furthermore, she meticulously plots a specialized walking route that deliberately avoids unnecessary, strenuous staircases wherever structurally possible. This intense focus on physical accessibility and geriatric comfort ensures that senior travelers can fully participate in and thoroughly enjoy a premium [Taj Mahal full day tour](/india/agra/taj-mahal-full-day-tour) without experiencing exhaustion or mobility-related anxiety."
                              }
                            ];
                          }`;

// First, find the start and end of `getTourSpecificFAQs` inside the render function
const startMatch = content.match(/\/\/ High-authority FAQ data tailored for specific major tours\n\s*const getTourSpecificFAQs = \(title: string, slug: string \| undefined\) => \{/);

if (!startMatch) {
    console.error("Could not find getTourSpecificFAQs start");
    process.exit(1);
}

const startIndex = startMatch.index;

// Find the end by looking for the close brace of the function before `const tourTitle = tour.title || 'this tour';`
const endMatchStr = "return null;\n                        };\n\n                        const tourTitle = tour.title || 'this tour';";
const endIndex = content.indexOf(endMatchStr, startIndex);

if (endIndex === -1) {
    console.error("Could not find getTourSpecificFAQs end");
    process.exit(1);
}

// Extract the function
let functionStr = content.substring(startIndex, endIndex + "return null;\n                        };".length);

// Also remove it from its original place in the render block (temporarily replace with just `// getTourSpecificFAQs moved`)
// No, actually, wait. Let's just redefine it AT THE TOP of the file. No, we can export it from a new file.
// Or we can just leave it where it is and JUST update the female-guide section there, AND ALSO update the schema generation useEffect.

// To update the female guide block in the existing code:
// The block starts at `if (slug === 'female-guide-for-taj-mahal') {` and ends before `if (slug === 'taj-mahal-entry-ticket') {`

const femaleGuideRegex = /if \(slug === 'female-guide-for-taj-mahal'\) \{[\s\S]*?if \(slug === 'taj-mahal-entry-ticket'\) \{/;

if (femaleGuideRegex.test(functionStr)) {
    // Replace inside the functionStr
    functionStr = functionStr.replace(femaleGuideRegex, newFaqsStr.trim() + "\n\n                          if (slug === 'taj-mahal-entry-ticket') {");
} else {
    console.log("Could not find female guide block");
}

// Now we need to ALSO use this function in the useEffect for schema generation!
// Let's move getTourSpecificFAQs OUTSIDE the TourDetailPage component.
// The TourDetailPage component starts at: `const TourDetailPage: React.FC<TourDetailPageProps> = ({ tourId, tourSlug, country, city, onClose }) => {`
// Let's inject functionStr right before it.

const componentStartRegex = /^const TourDetailPage: React\.FC<TourDetailPageProps> = \(\{.*\}\) => \{$/m;
const componentStartMatch = content.match(componentStartRegex);

if (!componentStartMatch) {
    console.error("Could not find TourDetailPage component start");
    process.exit(1);
}

// Change the indentation of functionStr to match top-level (remove 24 or 20 spaces)
let topLevelFunctionStr = "export " + functionStr.replace(/ {24}/g, '  ').replace(/ {26}/g, '    ').replace(/ {28}/g, '      ');
// actually just simple replace leading spaces
topLevelFunctionStr = topLevelFunctionStr.split('\n').map(line => {
    return line.replace(/^ {12}/, ''); // 12 spaces approx? 
}).join('\n');

// Now we have the function. Let's insert it before TourDetailPage
let newContent = content.substring(0, componentStartMatch.index) + "\n\n" + topLevelFunctionStr + "\n\n" + content.substring(componentStartMatch.index);

// Now REMOVE the original getTourSpecificFAQs from the render block
// We need to find its NEW indices because we prepended text
const newStartIndex = newContent.indexOf("// High-authority FAQ data tailored for specific major tours\n                        const getTourSpecificFAQs = (title: string, slug: string | undefined) => {");
const newEndIndex = newContent.indexOf("return null;\n                        };\n\n                        const tourTitle = tour.title || 'this tour';", newStartIndex);

if (newStartIndex !== -1 && newEndIndex !== -1) {
    const originalFuncEnd = newEndIndex + "return null;\n                        };".length;
    newContent = newContent.substring(0, newStartIndex) + "/* Using extracted getTourSpecificFAQs */" + newContent.substring(originalFuncEnd);
} else {
    // maybe indentation is different
    const newStartIndex2 = newContent.indexOf("// High-authority FAQ data tailored for specific major tours");
    if(newStartIndex2 !== -1) {
       // regex replace the inner one
       newContent = newContent.replace(/\/\/ High-authority FAQ data tailored for specific major tours\n[\s\S]*?return null;\n                        \};\n/, '/* Using extracted getTourSpecificFAQs */\n');
    }
}

// Now update the useEffect to USE getTourSpecificFAQs for the schema!
// Find the schema generation block around line 782
// `const tourFAQs = [`
// `  {`
// `    question: \`What is specifically included in the \${tourTitle}?\`,`
const useEffectFaqRegex = /const tourTitle = tour\.title \|\| 'this tour';\n\s*const tourFAQs = \[\n[\s\S]*?if \(!existingFaqSchema\) \{/g;
// actually let's just find the block and replace the tourFAQs logic
const schemaLogicToReplace = `      // FAQ Schema (JSON-LD)
      const tourTitle = tour.title || 'this tour';
      const tourFAQs = [
        {
          question: \`What is specifically included in the \${tourTitle}?\`,
          answer: tour.included || \`The \${tourTitle} includes a professional licensed guide, entry tickets to major monuments as per selection, and a fully customizable itinerary to suit your pace.\`
        },
        {
          question: \`How long does the \${tourTitle} usually take?\`,
          answer: \`The \${tourTitle} typically lasts about \${tour.duration || 'a few hours'}. We recommend starting early to make the most of your time and avoid peak crowds.\`
        },
        {
          question: \`What should I bring for my \${tourTitle}?\`,
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
        question: \`Can I cancel my \${tourTitle} booking?\`,
        answer: "Yes, we offer a flexible cancellation policy. You can cancel your booking up to 24 hours before the scheduled start time for a full refund."
      });`;

const newSchemaLogic = `      // FAQ Schema (JSON-LD)
      const tourTitle = tour.title || 'this tour';
      let specificSchemaFaqs = getTourSpecificFAQs(tourTitle, tourSlug || tour?.slug);
      
      let tourFAQs = [];
      if (specificSchemaFaqs) {
        tourFAQs = specificSchemaFaqs;
      } else {
        tourFAQs = [
          {
            question: \`What is specifically included in the \${tourTitle}?\`,
            answer: tour.included || \`The \${tourTitle} includes a professional licensed guide, entry tickets to major monuments as per selection, and a fully customizable itinerary to suit your pace.\`
          },
          {
            question: \`How long does the \${tourTitle} usually take?\`,
            answer: \`The \${tourTitle} typically lasts about \${tour.duration || 'a few hours'}. We recommend starting early to make the most of your time and avoid peak crowds.\`
          },
          {
            question: \`What should I bring for my \${tourTitle}?\`,
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
          question: \`Can I cancel my \${tourTitle} booking?\`,
          answer: "Yes, we offer a flexible cancellation policy. You can cancel your booking up to 24 hours before the scheduled start time for a full refund."
        });
      }`;

newContent = newContent.replace(schemaLogicToReplace, newSchemaLogic);

// Write back to the file
fs.writeFileSync(filePath, newContent, 'utf8');

console.log("Successfully updated TourDetailPage.tsx with new FAQs and linked them to the schema generator.");
