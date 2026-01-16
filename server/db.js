import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Test connection (non-blocking for SQLite)
prisma.$connect()
  .then(() => {
    console.log('✅ Connected to database via Prisma');
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error.message);
    // Don't exit for SQLite - it will create the file if needed
    if (!error.message.includes('SQLite')) {
      console.error('   Please check your DATABASE_URL in .env file');
    }
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('👋 Disconnected from database');
});

export default prisma;
