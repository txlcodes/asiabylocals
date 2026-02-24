import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const tours = await prisma.tour.findMany({
        orderBy: { id: 'desc' },
        take: 2,
        select: {
            id: true,
            title: true,
            itineraryItems: true,
            detailedItinerary: true
        }
    });
    console.log(JSON.stringify(tours, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
