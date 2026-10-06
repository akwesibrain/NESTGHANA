import "server-only";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

// One pool per server process. In development the module reloads on every edit, so the client is
// cached on globalThis to avoid leaking connections.
const globalForPrisma = globalThis as unknown as { nestghPrisma?: PrismaClient; nestghPrismaModels?: string };

// The set of models in the generated client. After `prisma migrate` + `prisma generate`, a client
// cached by a running dev server lacks the new models; comparing this fingerprint swaps it out
// without a restart. (Not `instanceof`: Next can load the generated client once per bundle.)
const MODELS = Object.keys(Prisma.ModelName).sort().join(",");

function createClient(): PrismaClient {
  // The website uses the least-privilege account; DATABASE_URL (root) is only for the Prisma CLI.
  const url = process.env.DATABASE_APP_URL;
  if (!url) throw new Error("DATABASE_APP_URL is not configured.");
  return new PrismaClient({ adapter: new PrismaMariaDb(url) });
}

export function getDb(): PrismaClient {
  if (!globalForPrisma.nestghPrisma || globalForPrisma.nestghPrismaModels !== MODELS) {
    const previous = globalForPrisma.nestghPrisma;
    globalForPrisma.nestghPrisma = createClient();
    globalForPrisma.nestghPrismaModels = MODELS;
    // Let in-flight queries on the old client finish before closing its pool.
    if (previous) setTimeout(() => void previous.$disconnect().catch(() => undefined), 30_000).unref?.();
  }
  return globalForPrisma.nestghPrisma;
}
