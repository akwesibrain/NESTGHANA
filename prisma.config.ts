import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// The CLI (migrate/seed) runs as the privileged DATABASE_URL user; the website uses DATABASE_APP_URL.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
