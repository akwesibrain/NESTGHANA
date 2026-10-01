import assert from "node:assert/strict";
import test from "node:test";
import { allowedCorsOrigin } from "../../supabase/functions/_shared/cors-policy.mjs";

test("allows only an exact configured HTTPS origin", () => {
  assert.equal(
    allowedCorsOrigin("https://nestgh.example", "https://nestgh.example,https://admin.nestgh.example"),
    "https://nestgh.example",
  );
});

test("denies unconfigured origins and missing configuration", () => {
  assert.equal(allowedCorsOrigin("https://attacker.example", "https://nestgh.example"), null);
  assert.equal(allowedCorsOrigin("https://nestgh.example", ""), null);
  assert.equal(allowedCorsOrigin(null, "https://nestgh.example"), null);
});

test("denies a configured origin with a path or non-canonical origin string", () => {
  assert.equal(allowedCorsOrigin("https://nestgh.example/path", "https://nestgh.example/path"), null);
  assert.equal(allowedCorsOrigin("https://nestgh.example/", "https://nestgh.example/"), null);
});

test("denies insecure non-local origins but allows an exact localhost development origin", () => {
  assert.equal(allowedCorsOrigin("http://nestgh.example", "http://nestgh.example"), null);
  assert.equal(allowedCorsOrigin("http://localhost:3000", "http://localhost:3000"), "http://localhost:3000");
});
