
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const updatedTour = await prisma.tour.update({
        where: { id: 200 },
        data: {
            slug: "taj-mahal-sunrise-guided-tour"
        }
    });

    console.log("✅ Tour 200 slug updated to taj-mahal-sunrise-guided-tour!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
