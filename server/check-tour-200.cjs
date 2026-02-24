
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tour = await prisma.tour.findUnique({
        where: { id: 200 },
        select: { id: true, slug: true, title: true }
    });
    console.log('Tour 200 info from DB:', tour);
    await prisma.$disconnect();
}

main();
