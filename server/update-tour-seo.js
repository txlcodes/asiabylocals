
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const updatedTour = await prisma.tour.update({
        where: { id: 180 },
        data: {
            title: "Taj Mahal Skip-the-Line Entry Ticket (Foreigners) - Official Admission",
            shortDescription: "Skip the long queues at the Taj Mahal! Secure your official entry ticket now and receive it instantly via WhatsApp. Fast-track entry guaranteed for all international visitors.",
            fullDescription: "Secure your official Taj Mahal entrance ticket and avoid the long queues at the ticket counter. Once you book, we will send your official tickets (PDF) directly to your WhatsApp. \n\nSimply show the PDF barcode at the gate and skip the line! \n\nWhat's Includes:\n- Official Taj Mahal Admission for Foreign Tourists\n- Skip-the-Line Entry\n- Tickets delivered via WhatsApp within minutes\n- 24/7 Support\n\nImportant: Please provide your WhatsApp number during checkout for instant delivery.",
            highlights: JSON.stringify([
                "Skip the long ticket counter lines",
                "Instant Official Ticket PDF via WhatsApp",
                "Official Admission for Foreign International Tourists",
                "Direct Fast-Track entry through the gate",
                "No need to print - show on your phone"
            ]),
            included: "Official Taj Mahal Entry Ticket (Foreigner Class), Skip-the-Line Access, WhatsApp PDF Delivery"
        }
    });

    console.log("✅ Tour 180 updated with better SEO content!");
    console.log("New Title:", updatedTour.title);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
