import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const slugs = [
        'agra-friday-tour-taj-closed-alternative',
        'taj-mahal-agra-fort-guided-tour',
        'taj-mahal-entry-ticket',
        'taj-mahal-fatehpur-full-day-tour'
    ];
    const tours = await prisma.tour.findMany({
        where: {
            slug: { in: slugs }
        },
        select: {
            title: true,
            slug: true,
            status: true
        }
    });
    console.log(JSON.stringify(tours, null, 2));
}
main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
