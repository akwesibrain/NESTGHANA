// Database backup: npm run db:backup
// Writes backups/nestghana-YYYY-MM-DD-HHmm.sql.gz (schema, data and triggers) and keeps the newest 14.
// Schedule it daily (Windows Task Scheduler or cron). Also back up storage/listing-images (photos)
// and keep a copy of .env (ADMIN_MFA_KEY) somewhere safe: the database alone is not enough.
//
// Restore: gunzip -c backups/<file>.sql.gz | mysql -u root -P 3308 -h 127.0.0.1 nestghana
import "dotenv/config";
import { spawn } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { createGzip } from "node:zlib";

const KEEP = 14;
const url = new URL(process.env.DATABASE_URL ?? "");
const database = url.pathname.slice(1);
if (!database) throw new Error("DATABASE_URL must include the database name.");

const candidates = [process.env.MYSQLDUMP_PATH, "C:/xampp/mysql/bin/mysqldump.exe", "/usr/bin/mysqldump", "/usr/local/bin/mysqldump"];
const mysqldump = candidates.find(p => p && existsSync(p)) ?? "mysqldump";

const dir = path.resolve("backups");
mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 16).replace("T", "-").replace(":", "");
const file = path.join(dir, `${database}-${stamp}.sql.gz`);

const args = [
  `--host=${url.hostname}`, `--port=${url.port || 3306}`, `--user=${decodeURIComponent(url.username)}`,
  "--single-transaction", "--routines", "--triggers", "--hex-blob", "--default-character-set=utf8mb4", database,
];
const dump = spawn(mysqldump, args, {
  // The password goes through the environment, never the command line (visible to other users).
  env: { ...process.env, MYSQL_PWD: decodeURIComponent(url.password) },
  stdio: ["ignore", "pipe", "pipe"],
});
let stderr = "";
dump.stderr.on("data", d => (stderr += d));
const exited = new Promise(resolve => dump.on("close", resolve));

await pipeline(dump.stdout, createGzip({ level: 9 }), createWriteStream(file));
const code = await exited;
if (code !== 0 || statSync(file).size < 200) {
  rmSync(file, { force: true });
  console.error(`Backup failed (mysqldump exit ${code}). ${stderr.trim()}`);
  process.exit(1);
}

const old = readdirSync(dir).filter(f => f.startsWith(`${database}-`) && f.endsWith(".sql.gz")).sort().reverse().slice(KEEP);
for (const f of old) rmSync(path.join(dir, f));
console.log(`Backup written: ${path.relative(process.cwd(), file)} (${(statSync(file).size / 1024).toFixed(0)} KB). Kept the newest ${KEEP}.`);
