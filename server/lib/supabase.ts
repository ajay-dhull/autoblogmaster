import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Load environment variables
import dotenv from "dotenv";
dotenv.config();

// Use Replit's provided DATABASE_URL or fallback to .env file
const databaseUrl = process.env.DATABASE_URL || 
  "postgresql://postgres.gkzwondozcofzaygjbej:Ajay%40989898@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

const client = postgres(databaseUrl);
export const db = drizzle(client, { schema });
