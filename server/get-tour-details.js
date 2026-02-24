
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const tour = await prisma.tour.findUnique({
        where: {
            id: 180
        },
        include: {
            options: true
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
