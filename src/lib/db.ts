import { PrismaClient } from '@prisma/client';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined.");
}

// Create a single PrismaClient instance
export const prisma = new PrismaClient({
  accelerateUrl: DATABASE_URL,
  log: ['query', 'error', 'warn'],
});
