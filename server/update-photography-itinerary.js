
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const itinerary = `## Taj Mahal Photography Tour – Detailed Itinerary with Guide Danish Nawaz

Your Taj Mahal Photography Tour begins early in the morning to take full advantage of the soft sunrise light. You will meet your professional licensed guide, Danish Nawaz, at the designated meeting point near the Taj Mahal entrance. Danish will provide a short introduction to the tour plan, photography flow, and timing strategy to ensure you experience the monument at its most beautiful and least crowded moments.

After entry formalities, the experience starts at the grand main gate (Darwaza-i-Rauza). This is where you capture the iconic first view of the Taj Mahal framed perfectly through the large arch. Danish Nawaz will position you at the ideal spot to achieve perfect symmetry, while the professional photographer captures natural, elegant shots. You will receive guidance on posture, walking shots, and candid poses to create a premium visual story of your visit.

From the main gate, you will proceed along the central pathway toward the reflecting pool. The early morning light creates a soft glow on the white marble, and the calm water produces stunning mirror reflections. Danish carefully manages the sequence of photo stops to avoid heavy crowd areas and ensures balanced, clean compositions. Multiple angles will be covered, including centered symmetry shots, side perspectives, and creative framing options.

The tour continues into the Mughal gardens, where wider landscape compositions are captured with greenery framing the monument. Danish Nawaz will share historical insights about Emperor Shah Jahan and Mumtaz Mahal, explaining the symbolism behind the Taj Mahal’s design while the photographer captures relaxed lifestyle-style images.

Next, you will move closer to the marble platform for detailed photography. Here, you will capture elegant shots with the main dome in the background, intricate marble inlay work, and close-up architectural details. Danish will explain the craftsmanship, calligraphy, and symmetry principles that make the Taj Mahal a UNESCO World Heritage Site and one of the Seven Wonders of the World.

## Marble Platform Close-Up & Hidden Angle Exploration

You will also visit the mosque side and alternative angle viewpoints that many visitors miss. These spots offer unique perspectives of the Taj Mahal with fewer crowds, allowing for more artistic and peaceful compositions. The photographer will ensure you receive a total of 25 professionally edited high-quality photos, with options to purchase additional images if desired.

## Sunrise Entry & Grand Gate Photography Session

Throughout the experience, Danish Nawaz ensures smooth timing, historical storytelling, and premium photography guidance. The tour lasts approximately two to three hours, giving you enough time to explore, learn, and create unforgettable memories at the Taj Mahal.

By the end of the tour, you will leave not only with beautiful professional photographs but also with a deeper understanding of the monument’s history, architecture, and romantic legacy.

Danish Nawaz will ensure that all key photography angles have been covered, providing a personalized and enriched experience that combines artistic vision with deep historical context. This is not just a tour; it's a visual journey through one of the most romantic monuments in history.`;

    const updatedTour = await prisma.tour.update({
        where: { id: 208 },
        data: {
            detailedItinerary: itinerary
        }
    });

    console.log("✅ Tour 208 updated with new Detailed Itinerary!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
