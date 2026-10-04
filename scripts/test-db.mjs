// Runs tests/db/*.test.ts against a throwaway database built from the real migrations.
import "dotenv/config";
import { execSync } from "node:child_process";
import mariadb from "mariadb";

const base = process.env.DATABASE_URL;
if (!base) throw new Error("DATABASE_URL is not set.");
const admin = new URL(base);
const testDb = "nestghana_test";
const testUrl = new URL(base);
testUrl.pathname = `/${testDb}`;

async function mysql(sql) {
  const conn = await mariadb.createConnection({ host: admin.hostname, port: Number(admin.port || 3306), user: decodeURIComponent(admin.username), password: decodeURIComponent(admin.password), multipleStatements: true });
  try { await conn.query(sql); } finally { await conn.end(); }
}

const env = { ...process.env, DATABASE_URL: testUrl.href, DATABASE_APP_URL: testUrl.href, IP_HASH_SECRET: "test" };
await mysql(`DROP DATABASE IF EXISTS ${testDb}; CREATE DATABASE ${testDb} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
let failed = false;
try {
  execSync("npx prisma migrate deploy", { env, stdio: "inherit" });
  // "react-server" lets server-only modules load outside Next.js.
  execSync("npx tsx --conditions=react-server --tsconfig tsconfig.json --test tests/db/*.test.ts", { env, stdio: "inherit" });
} catch {
  failed = true;
} finally {
  await mysql(`DROP DATABASE IF EXISTS ${testDb};`);
}
process.exit(failed ? 1 : 0);
