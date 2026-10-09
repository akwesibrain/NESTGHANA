// Creates an admin account, or resets one (new password, MFA re-enrolment, unlock).
//
//   npm run admin:create -- --email you@example.com --name "Your Name" [--role SUPER_ADMIN]
//   npm run admin:create -- --email you@example.com --reset
//
// The password is asked for interactively (hidden). For automation it can be supplied in the
// NESTGH_ADMIN_PASSWORD environment variable instead. Runs as the privileged DATABASE_URL user.
import "dotenv/config";
import { createInterface } from "node:readline";
import { parseArgs } from "node:util";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient, type AdminRole } from "../generated/prisma/client";
import { hashPassword, PASSWORD_MIN_LENGTH } from "../lib/server/admin-crypto";

const ROLES: AdminRole[] = ["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"];

function promptHidden(question: string): Promise<string> {
  return new Promise(resolve => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const output = rl as unknown as { _writeToOutput: (text: string) => void; output: NodeJS.WriteStream };
    let muted = false;
    output._writeToOutput = text => {
      if (!muted || text.includes("\n")) output.output.write(muted ? "\n" : text);
    };
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
    muted = true;
  });
}

async function readPassword(): Promise<string> {
  const fromEnv = process.env.NESTGH_ADMIN_PASSWORD;
  if (fromEnv) return fromEnv;
  if (!process.stdin.isTTY) throw new Error("No terminal for the password prompt; set NESTGH_ADMIN_PASSWORD instead.");
  const password = await promptHidden(`Password (min ${PASSWORD_MIN_LENGTH} characters): `);
  const confirm = await promptHidden("Repeat password: ");
  if (password !== confirm) throw new Error("Passwords do not match.");
  return password;
}

async function main() {
  const { values } = parseArgs({
    options: {
      email: { type: "string" },
      name: { type: "string", default: "" },
      role: { type: "string", default: "SUPER_ADMIN" },
      reset: { type: "boolean", default: false },
    },
  });
  const email = values.email?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Pass a valid --email.");
  const role = values.role as AdminRole;
  if (!ROLES.includes(role)) throw new Error(`--role must be one of ${ROLES.join(", ")}.`);

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set.");
  const prisma = new PrismaClient({ adapter: new PrismaMariaDb(url) });
  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing && !values.reset) throw new Error(`${email} already exists. Use --reset to set a new password and re-enrol MFA.`);
    if (!existing && values.reset) throw new Error(`${email} does not exist.`);

    const password = await readPassword();
    if (password.length < PASSWORD_MIN_LENGTH || password.length > 256) {
      throw new Error(`The password must be ${PASSWORD_MIN_LENGTH}–256 characters.`);
    }
    const passwordHash = await hashPassword(password);

    if (existing) {
      await prisma.$transaction([
        prisma.adminUser.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            mfaSecretEnc: null,
            mfaEnabledAt: null,
            mfaLastStep: null,
            failedLoginCount: 0,
            lockedUntil: null,
            isActive: true,
          },
        }),
        // Sign out everywhere.
        prisma.adminSession.updateMany({ where: { userId: existing.id, revokedAt: null }, data: { revokedAt: new Date() } }),
      ]);
      console.log(`Reset ${email}. Sign in at /admin and set up the authenticator again.`);
    } else {
      await prisma.adminUser.create({
        data: { email, displayName: values.name ?? "", passwordHash, roles: { create: { role } } },
      });
      console.log(`Created ${role} ${email}. Sign in at /admin; you will be asked to set up an authenticator app.`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
