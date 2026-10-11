import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([".next/**", ".next-e2e/**", "node_modules/**", "NestGH-admin/**", "public/**", "brag-output-*/**", "docs/**", "load-test.js", "generated/**", "backups/**", "storage/**", ".agents/**"]),
  // next/image writes an inline style on every <img>, which the Content-Security-Policy (proxy.ts) blocks;
  // the admin and owner pages use plain <img> for private, unoptimized photos instead.
  { rules: { "@next/next/no-img-element": "off" } },
  // CommonJS files (node --test suites, UMD browser modules) use require() by design.
  { files: ["**/*.cjs"], rules: { "@typescript-eslint/no-require-imports": "off" } },
]);
