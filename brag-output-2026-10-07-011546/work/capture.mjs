// Drives the real NestGH page (localhost:3000) in headless Edge and saves screenshots + element
// rectangles for each storyboard state. Listing API calls are answered with presentation data.
// Usage: node capture.mjs desktop|mobile
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { ROOMS, SETTINGS, SPACES } from "./presentation-data.mjs";

const mode = process.argv[2] ?? "desktop";
const VIEW = mode === "mobile" ? { width: 390, height: 844, dpr: 3, mobile: true } : { width: 1440, height: 810, dpr: 2, mobile: false };
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")), `shots-${mode}`);
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";
const PORT = mode === "mobile" ? 9336 : 9335;

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const proc = spawn(edge, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(path.join(tmpdir(), "edge-brag-"))}`, "about:blank"], { stdio: "ignore" });
let targets;
for (let i = 0; i < 60; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (targets.some(t => t.type === "page")) break; } catch {}
  await new Promise(r => setTimeout(r, 250));
}
const ws = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
const listeners = [];
ws.addEventListener("message", e => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  else if (m.method) listeners.forEach(fn => fn(m));
});
const send = (method, params = {}) => new Promise(r => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const wait = ms => new Promise(r => setTimeout(r, ms));
const evaluate = async expr => {
  const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (res.result?.exceptionDetails) throw new Error(res.result.exceptionDetails.exception?.description ?? "evaluate failed");
  return res.result?.result?.value;
};

// Answer the listing/settings API with presentation data.
listeners.push(async m => {
  if (m.method !== "Fetch.requestPaused") return;
  const url = new URL(m.params.request.url);
  let body = null;
  if (url.pathname === "/api/settings") body = SETTINGS;
  if (url.pathname === "/api/listings") body = { rows: url.searchParams.get("category") === "commercial" ? SPACES : ROOMS };
  if (!body) return send("Fetch.continueRequest", { requestId: m.params.requestId });
  await send("Fetch.fulfillRequest", {
    requestId: m.params.requestId,
    responseCode: 200,
    responseHeaders: [{ name: "Content-Type", value: "application/json" }, { name: "Cache-Control", value: "no-store" }],
    body: Buffer.from(JSON.stringify(body)).toString("base64"),
  });
});

await send("Page.enable");
await send("Runtime.enable");
await send("Fetch.enable", { patterns: [{ urlPattern: "*/api/*" }] });
await send("Emulation.setDeviceMetricsOverride", { width: VIEW.width, height: VIEW.height, deviceScaleFactor: VIEW.dpr, mobile: VIEW.mobile });
if (VIEW.mobile) await send("Emulation.setTouchEmulationEnabled", { enabled: true });
// No cookie banner in the video; no smooth scrolling during capture.
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `try{localStorage.setItem("nestgh_cookie_consent_v1",JSON.stringify({choice:"reject",updatedAt:new Date().toISOString()}))}catch(e){}
  document.addEventListener("DOMContentLoaded",()=>{const s=document.createElement("style");s.textContent="html{scroll-behavior:auto!important}*{transition:none!important;animation:none!important}";document.head.append(s)});`,
});

const shot = async (name, rectSelectors = {}) => {
  await evaluate("document.fonts.ready.then(()=>true)");
  await wait(400);
  const rects = await evaluate(`(() => {
    const out = { scrollY: scrollY, viewport: { w: innerWidth, h: innerHeight } };
    const sel = ${JSON.stringify(rectSelectors)};
    for (const [k, s] of Object.entries(sel)) out[k] = [...document.querySelectorAll(s)].map(e => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, text: (e.innerText || "").slice(0, 80) }; });
    return out;
  })()`);
  const { result } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(result.data, "base64"));
  writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(rects, null, 2));
  console.log("saved", name);
};
const shotTall = async (name, selector, itemSel) => {
  await evaluate(`(() => { window.__hidden = [...document.querySelectorAll("body *")].filter(e => ["fixed", "sticky"].includes(getComputedStyle(e).position)); window.__hidden.forEach(e => e.style.setProperty("visibility", "hidden", "important")); return true; })()`);
  await wait(300);
  const info = await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); const top = r.top + scrollY - 8; const items = [...document.querySelectorAll(${JSON.stringify(itemSel)})].map(e => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.top + scrollY - top, w: b.width, h: b.height, text: (e.innerText || "").slice(0, 80) }; }); return { top, height: r.height + 16, width: innerWidth, items }; })()`);
  const { result } = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: info.top, width: info.width, height: info.height, scale: 1 } });
  writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(result.data, "base64"));
  writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(info, null, 2));
  await evaluate(`(() => { (window.__hidden || []).forEach(e => e.style.removeProperty("visibility")); return true; })()`);
  console.log("saved", name);
};
const scrollTo = async (selector, offset = 0) => { await evaluate(`(() => { const e = document.querySelector(${JSON.stringify(selector)}); scrollTo(0, e.getBoundingClientRect().top + scrollY - ${offset}); return true; })()`); await wait(500); };

try {
  await send("Page.navigate", { url: `${BASE}/index.html` });
  await wait(2500);
  await evaluate(`new Promise(r => { const t = setInterval(() => { if (document.querySelectorAll("#list .card").length >= 8) { clearInterval(t); r(true); } }, 100); })`);

  // SEE: hero, then the listing grid
  await shot("01-hero", { search: "#form" });
  await scrollTo("#rooms", VIEW.mobile ? 60 : 72);
  await shot("02-grid", { cards: "#list .card", price: "#list .card .pr" });
  await scrollTo("#list .card:nth-child(5)", VIEW.mobile ? 60 : 160);
  await shot("02b-grid-more", { cards: "#list .card" });

  // SEARCH: region → town (typed, suggestions) → results
  await evaluate(`scrollTo(0, 0)`); await wait(300);
  await scrollTo("#form", VIEW.mobile ? 90 : 220);
  await shot("03-search-empty", { form: "#form", region: "#region", town: "#town", type: "#ty" });
  await evaluate(`(() => { const r = document.getElementById("region"); r.value = "Ashanti"; r.dispatchEvent(new Event("change", { bubbles: true })); return true; })()`);
  await wait(400);
  await shot("04-search-region", { form: "#form", region: "#region", town: "#town" });
  await evaluate(`(() => { const t = document.getElementById("town"); if (t.tagName === "SELECT") { const o = [...t.options].find(x => x.value === "Kumasi" || x.textContent.trim() === "Kumasi"); t.value = o ? o.value : "Kumasi"; } else { t.value = "Kumasi"; } t.dispatchEvent(new Event("input", { bubbles: true })); t.dispatchEvent(new Event("change", { bubbles: true })); return t.value; })()`);
  await wait(500);
  await shot("05-search-town", { form: "#form", region: "#region", town: "#town", type: "#ty", go: "#form .go" });
  await evaluate(`(() => { document.querySelector("#form").requestSubmit(); return true; })()`);
  await wait(900);
  await scrollTo("#rooms", VIEW.mobile ? 60 : 72);
  await shot("07-results", { cards: "#list .card", heading: "#rt", wa: "#list .card a.wa", call: "#list .card a.call", price: "#list .card .pr" });
  await shotTall("07t-results-tall", "#list", "#list .card");

  // CONTACT: open the hostel listing's details
  await evaluate(`(() => { const b = [...document.querySelectorAll("#list .lk")].find(x => /hostel/i.test(x.textContent)); b.click(); return true; })()`);
  await wait(900);
  await shot("08-sheet", { sheet: "#sheet .sp", whatsapp: "#sheet a.wa", call: "#sheet a.call", price: "#sheet .pr, #sheet .price" });
  await evaluate(`(() => { const sp = document.querySelector("#sheet .sp"); const wa = document.querySelector("#sheet a.wa"); if (sp && wa) sp.scrollTop = Math.max(0, wa.offsetTop - sp.clientHeight + 160); return true; })()`);
  await wait(400);
  await shot("09-sheet-contact", { sheet: "#sheet .sp", whatsapp: "#sheet a.wa", call: "#sheet a.call" });
  await evaluate(`(() => { document.querySelector("#sheet #cx")?.click(); return true; })()`);
  await wait(500);

  // MOVE: the hostel card after the owner marks it taken
  await evaluate(`(() => { const r = ROOMS.find(x => /hostel/i.test(x.n) && x.t === "Kumasi"); r.un = true; render(); return true; })()`);
  await wait(500);
  await scrollTo("#rooms", VIEW.mobile ? 60 : 72);
  await shot("10-taken", { cards: "#list .card", gone: "#list .gone", price: "#list .card .pr" });
  await scrollTo("#list .card.off", VIEW.mobile ? 150 : 200);
  await shot("10b-taken-card", { cards: "#list .card", gone: "#list .gone", price: "#list .card .pr" });

  // Shops & Spaces
  await evaluate(`(() => { location.hash = "shops-spaces"; return true; })()`);
  await wait(1500);
  await scrollTo("#shops-spaces", VIEW.mobile ? 60 : 72);
  await shot("11-shops", { filters: "#commercial-filters", cards: "#commercial-list > *" });
  await scrollTo("#commercial-list", VIEW.mobile ? 80 : 120);
  await shot("12-shops-cards", { cards: "#commercial-list > *" });
} finally {
  ws.close();
  proc.kill();
}
