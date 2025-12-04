// src/lib/db.ts

import { PrismaClient } from '@prisma/client'; 

// Ensure this environment variable is defined in your .env file
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  // Good practice to ensure the variable is set
  throw new Error("DATABASE_URL is not defined.");
}

export const prisma = () => {
  return new PrismaClient({
    // 👇 Use accelerateUrl for environments that require the 'client' engine type
    accelerateUrl: DATABASE_URL,
    
    // You may still need datasourceUrl for certain CLI/migration commands, 
    // though accelerateUrl often supersedes it in the new config.
    // datasourceUrl: DATABASE_URL, 
    
    log: ['query', 'error', 'warn'],
  });
};

// ... rest of your global client logic (like the globalThis checks) ...