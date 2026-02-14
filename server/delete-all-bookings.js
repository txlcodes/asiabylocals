import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function deleteAllBookings() {
    try {
        console.log('🗑️  Starting cleanup of test bookings...');

        // Count existing bookings
        const count = await prisma.booking.count();
        console.log(`📊 Found ${count} bookings to delete.`);

        if (count === 0) {
            console.log('✅ No bookings found. Database is already clean.');
            return;
        }

        // Delete all bookings
        // Due to Cascade delete on Messages, this will also remove associated messages
        const { count: deletedCount } = await prisma.booking.deleteMany({});

        console.log(`✅ Successfully deleted ${deletedCount} bookings.`);

    } catch (error) {
        console.error('❌ Error deleting bookings:', error);
    } finally {
        await prisma.$disconnect();
    }
}

deleteAllBookings();
