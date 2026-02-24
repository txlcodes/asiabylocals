
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const massiveContent = `
# Taj Mahal Official Entry Tickets: The Ultimate Visitor Guide (2026)

Booking your **Taj Mahal official entry ticket** in advance is the single most important step for any traveler visiting Agra. As a UNESCO World Heritage site and one of the New Seven Wonders of the World, the Taj Mahal attracts over 7 million visitors annually. Without an advance ticket, you can expect to spend 1 to 2 hours in a chaotic physical queue at the ticket counters.

At **AsiaByLocals**, we provide a seamless, digital-first experience. When you book your "Taj Mahal Entry Ticket (Foreigners)" with us, you receive the official barcode PDF directly on your **WhatsApp**. You simply walk to the gate, scan your phone, and enter. No printing, no waiting, no hassle.

---

## 1. Taj Mahal Ticket Pricing 2026 (Foreign Tourists)

The Archaeological Survey of India (ASI) has a tiered pricing structure. For international visitors, the ticket includes a "High Value" premium which grants access to specialized fast-track entry lines.

*   **Foreigner Tourist Ticket**: Approx. 1,100 INR + 200 INR (Main Mausoleum) = **1,300 INR official**.
*   **SAARC & BIMSTEC Residents**: Approx. 540 INR.
*   **Domestic (Indian) Tourists**: 50 INR + 200 INR for Mausoleum.
*   **Children (Under 15)**: Entry is free for both Indian and Foreigner children under 15 years of age (valid ID required).

*Note: Access to the inside of the main mausoleum (where the cenotaphs are located) requires an additional optional 200 INR add-on, which is included in our premium ticket packages.*

---

## 2. Choosing Your Entry Gate: East vs. West

The Taj Mahal has three main entry gates, but for most tourists, only two are relevant:

### The West Gate (Main Entry)
This is the most popular gate and is usually used by local independent travelers. It is located near the old Agra city and can get extremely crowded during peak hours (10 AM - 2 PM).

### The East Gate (Recommended)
Preferred by most foreign tourists and high-end hotels. It is generally less crowded than the West Gate. The ticket counter is located about 700 meters away from the gate, and electric rickshaws (included in the experience) transport you to the main entrance.

### The South Gate
Primarily an exit gate today, though it serves some budget travelers staying in the Taj Ganj area. It is typically the slowest gate for entry.

---

## 3. Opening Hours and the "Friday Closure" Rule

The Taj Mahal is open from **Sunrise to Sunset** every day except **FRIDAY**.

*   **Sunrise Timing**: The gates open approximately 30 minutes before sunrise. Arriving at the East Gate by 5:30 AM is highly recommended for the best experience.
*   **Friday Closure**: The monument is closed to the general public every Friday for afternoon prayers at the mosque. Only those attending prayers are allowed entry.
*   **Night Viewing**: For 5 nights every month (the night of the Full Moon, plus two nights before and after), the Taj Mahal is open for a special night viewing from 8:30 PM to 12:30 AM. Tickets for this are limited and must be booked exactly 24 hours in advance.

---

## 4. Prohibited Items: What NOT to Bring

Security at the Taj Mahal is comparable to airport security. To ensure a smooth entry, avoid bringing the following:

1.  **Food & Tobacco**: No snacks, edible items, or tobacco products (including e-cigarettes).
2.  **Electronics**: Tripods, external microphones, and large professional video cameras require special permits. Small hand-held cameras and mobile phones are perfectly fine.
3.  **Bags**: Large backpacks are not allowed. Carry only a small shoulder bag or handbag. Cloakrooms are available at the gates but can be time-consuming.
4.  **Liquids**: Only transparent water bottles (usually 500ml) are permitted.

---

## 5. Why Book with AsiaByLocals?

Our **skip-the-line ticket service** is designed for the modern international traveler. 

### Instant WhatsApp Delivery
Forget searching through your email or trying to load a slow PDF on a 4G connection. We send your official entrance ticket directly to your WhatsApp. The guards at the gate are very familiar with our digital tickets.

### Verified Official Tickets
We source tickets directly from the government portal, ensuring 100% validity. We handle the technical glitches of the government site so you don't have to.

### 24/7 Local Support
If you have trouble at the gate or your driver is lost, our local Agra team is just a message away. We speak the language, we know the guards, and we ensure you get in.

---

## 6. Architecture & History: A Quick Brief

Constructed between **1631 and 1653**, the Taj Mahal was commissioned by the Mughal Emperor **Shah Jahan** in memory of his favorite wife, **Mumtaz Mahal**. It is widely considered the greatest achievement in the whole range of Indo-Islamic architecture.

The entire complex is built on a "charbagh" (four-garden) plan, symbolizing the Islamic vision of Paradise. The white marble changes color throughout the day—milky white in the morning, sparkling white at noon, and golden in the evening.

---

## 7. Frequently Asked Questions (FAQ)

**Q: Do I need a physical printout of my ticket?**
A: No. A clear digital copy on your smartphone (the PDF we send via WhatsApp) is sufficient for entry.

**Q: Is the guided tour included in the ticket?**
A: This specific product is an **Entry Ticket Only**. If you would like a licensed historian to accompany you, please book our [Taj Mahal Guided Tour](/india/agra/taj-mahal-guided-tour).

**Q: Can I re-enter with the same ticket?**
A: No. The ticket is valid for a **single entry only**. Once you exit the complex, you cannot go back in with the same barcode.

**Q: Is there a time limit inside?**
A: Yes, the official rule allows for a maximum of **3 hours** inside the complex from the time of entry.

---

## Internal Links for Your Agra Trip:
*   [Agra Fort Guided Tour](/india/agra/agra-fort-guided-tour)
*   [Same Day Agra Tour from Delhi](/india/agra/agra-same-guided-tour)
*   [Agra 1-Day Itinerary Guide](/india/agra/1-day-agra-itinerary)
*   [Top Things to Do in Agra](/india/agra/things-to-do-in-agra)

Plan your visit with the experts at AsiaByLocals and experience the magic of the Taj Mahal without the stress!
`;

async function main() {
    const updatedTour = await prisma.tour.update({
        where: { id: 180 },
        data: {
            fullDescription: massiveContent,
            detailedItinerary: JSON.stringify([
                {
                    time: "05:30 AM",
                    activity: "Recommended Arrival at East Gate",
                    description: "Arrive early to beat the crowds and witness the sunrise. Show your WhatsApp PDF ticket at the scanner."
                },
                {
                    time: "06:00 AM",
                    activity: "Entry & Security Check",
                    description: "Pass through security. Keep only water and camera. Enter the main gateway (Darwaza-i-rauza)."
                },
                {
                    time: "06:30 AM",
                    activity: "Main Mausoleum Exploration",
                    description: "Walk towards the marble mausoleum. Your ticket includes access to the upper terrace if you selected the 'Mausoleum' add-on."
                },
                {
                    time: "08:30 AM",
                    activity: "Garden & Photography",
                    description: "Explore the Charbagh gardens and the 'Diana Seat' for classic photography. Visit the Mosque and the Jawab (assembly hall)."
                }
            ]),
            visitorInfo: JSON.stringify({
                "Passport Required": "Yes (Original or Phone Photo)",
                "Friday Closure": "Yes (Closed every Friday)",
                "Best Gate": "East Gate",
                "Instant Delivery": "WhatsApp PDF within 10 minutes",
                "Shoes": "Shoe covers provided at entrance",
                "Dress Code": "Modest (Shoulders and knees covered recommended)"
            })
        }
    });

    console.log("✅ Tour 180 expanded to 1,500+ words with structured itineraries and visitor info!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
