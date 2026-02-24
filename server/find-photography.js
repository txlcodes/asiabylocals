
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const tour = await prisma.tour.findFirst({
        where: {
            OR: [
                { slug: 'taj-mahal-photography-tour' },
                { title: { contains: 'Photography' } },
                { slug: { contains: 'photography' } }
            ]
        },
        select: { id: true, slug: true, title: true }
    });
    console.log(JSON.stringify(tour, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
