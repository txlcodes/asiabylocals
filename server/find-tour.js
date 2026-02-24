
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const tour = await prisma.tour.findFirst({
        where: {
            OR: [
                { slug: 'taj-mahal-photography-tour' },
                { title: { contains: 'Photography' } }
            ]
        }
    });

    if (tour) {
        console.log('ID:', tour.id);
        console.log('Slug:', tour.slug);
        console.log('Title:', tour.title);
    } else {
        console.log('Tour not found');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
