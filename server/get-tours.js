
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const tours = await prisma.tour.findMany({
        where: {
            status: 'approved'
        },
        select: {
            id: true,
            slug: true,
            city: true,
            country: true,
            updatedAt: true
        }
    });

    const outputPath = path.join(__dirname, '..', 'tours.json');
    fs.writeFileSync(outputPath, JSON.stringify(tours, null, 2));
    console.log(`✅ Fetched ${tours.length} approved tours (with IDs) and saved to ${outputPath}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
