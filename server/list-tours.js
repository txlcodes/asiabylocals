
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    console.log('Fetching tours...');
    const tours = await prisma.tour.findMany({
        take: 10,
        select: { id: true, slug: true, title: true }
    });
    console.log(JSON.stringify(tours, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
