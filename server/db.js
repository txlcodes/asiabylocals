import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Configure Prisma for Render free tier PostgreSQL
// Add connection pooling and timeout settings for better reliability
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
        ? `${process.env.DATABASE_URL}?connection_limit=5&pool_timeout=20&connect_timeout=10`
        : undefined
    }
  },
  // Add retry logic for connection issues
  errorFormat: 'pretty',
});

// Enhanced connection handling with retries
let connectionRetries = 0;
const MAX_RETRIES = 3;

async function connectWithRetry() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to database via Prisma');
    connectionRetries = 0; // Reset on success
  } catch (error) {
    connectionRetries++;
    console.error(`❌ Failed to connect to database (attempt ${connectionRetries}/${MAX_RETRIES}):`, error.message);
    
    if (connectionRetries < MAX_RETRIES) {
      console.log(`   Retrying in ${connectionRetries * 2} seconds...`);
      setTimeout(connectWithRetry, connectionRetries * 2000);
    } else {
      console.error('   ⚠️ Max retries reached. Database may be unavailable.');
      console.error('   Please check your DATABASE_URL in environment variables');
    }
  }
}

// Test connection (non-blocking)
connectWithRetry();

// Handle connection errors gracefully
prisma.$on('error', (e) => {
  console.error('❌ Prisma error:', e);
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('👋 Disconnected from database');
});

// Handle process termination
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
