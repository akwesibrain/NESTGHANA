// Cross-site request protection used by the public POST endpoints (lib/server/http.ts).
import assert from "node:assert/strict";
import test from "node:test";
import { isSameOrigin } from "@/lib/server/http";

const request = (headers: Record<string, string>) =>
  new Request("http://localhost:3002/api/listings/submit", { method: "POST", headers });

test("allows a same-origin browser request", () => {
  assert.equal(isSameOrigin(request({ origin: "http://localhost:3002", host: "localhost:3002" })), true);
  assert.equal(isSameOrigin(request({ origin: "https://nestgh.com", host: "nestgh.com" })), true);
});

test("refuses requests sent from another site", () => {
  assert.equal(isSameOrigin(request({ origin: "https://attacker.example", host: "nestgh.com" })), false);
  assert.equal(isSameOrigin(request({ origin: "https://nestgh.com.attacker.example", host: "nestgh.com" })), false);
  assert.equal(isSameOrigin(request({ origin: "http://localhost:3003", host: "localhost:3002" })), false);
});

test("refuses a null or malformed origin", () => {
  assert.equal(isSameOrigin(request({ origin: "null", host: "nestgh.com" })), false);
  assert.equal(isSameOrigin(request({ origin: "not a url", host: "nestgh.com" })), false);
});

test("allows non-browser clients that send no Origin (they carry no visitor cookies)", () => {
  assert.equal(isSameOrigin(request({ host: "nestgh.com" })), true);
});
