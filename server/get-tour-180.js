
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tour = await prisma.tour.findUnique({
        where: { id: 180 },
        select: {
            title: true,
            shortDescription: true,
            fullDescription: true,
            slug: true
        }
    });

    console.log(JSON.stringify(tour, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
