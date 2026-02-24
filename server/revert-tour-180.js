
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const updatedTour = await prisma.tour.update({
        where: { id: 180 },
        data: {
            title: "Book Entry Tickets of Taj Mahal",
            shortDescription: "Book entry tickets of Taj mahal with skip the line entry (Only for Foreigners)",
            fullDescription: "Book entry tickets of Taj mahal with skip the line entry (Only for Foreigners)\nAfter the booking, your entrance tickets will be send by WhatsApp (PDF) Hence, You are requsted to mentioned your cell no .",
            highlights: "[\"Book Entry Tickets of Taj Mahal in Advance\",\"Skip The Line Entry\",\"Save Time, Fast Entry\"]",
            detailedItinerary: null,
            visitorInfo: null
        }
    });

    console.log("✅ Tour 180 database content reverted to original state.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
