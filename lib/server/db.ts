import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

// One pool per server process. In development the module reloads on every edit, so the client is
// cached on globalThis to avoid leaking connections.
const globalForPrisma = globalThis as unknown as { nestghPrisma?: PrismaClient };

function createClient(): PrismaClient {
  // The website uses the least-privilege account; DATABASE_URL (root) is only for the Prisma CLI.
  const url = process.env.DATABASE_APP_URL;
  if (!url) throw new Error("DATABASE_APP_URL is not configured.");
  return new PrismaClient({ adapter: new PrismaMariaDb(url) });
}

export function getDb(): PrismaClient {
  globalForPrisma.nestghPrisma ??= createClient();
  return globalForPrisma.nestghPrisma;
}
