// Renders comp/index.html frame by frame in headless Edge. Every frame is seek(t), a pure function of time.
// Usage: node render.mjs landscape|vertical stills 0.5,3.2,...   → stills/<format>-<t>.png
//        node render.mjs landscape|vertical frames [fps]         → frames-<format>/f00000.jpg ...
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [format = "landscape", mode = "stills", arg = ""] = process.argv.slice(2);
const HERE = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const size = format === "vertical" ? { width: 1080, height: 1920 } : { width: 1920, height: 1080 };
const PORT = format === "vertical" ? 9338 : 9337;

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const proc = spawn(edge, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files", "--force-color-profile=srgb", `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(path.join(tmpdir(), "edge-render-"))}`, "about:blank"], { stdio: "ignore" });
let targets;
for (let i = 0; i < 60; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (targets.some(t => t.type === "page")) break; } catch {}
  await new Promise(r => setTimeout(r, 250));
}
const ws = new WebSocket(targets.find(t => t.type === "page").webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener("open", r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener("message", e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async expr => {
  const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true });
  if (res.result?.exceptionDetails) throw new Error(res.result.exceptionDetails.exception?.description ?? JSON.stringify(res.result.exceptionDetails));
  return res.result?.result?.value;
};

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { ...size, deviceScaleFactor: 1, mobile: false });
  const url = pathToFileURL(path.join(HERE, "comp", "index.html")).href + `?format=${format}`;
  await send("Page.navigate", { url });
  await new Promise(r => setTimeout(r, 1500));
  for (let i = 0; i < 100 && !(await evaluate("typeof window.ready !== 'undefined'")); i++) await new Promise(r => setTimeout(r, 100));
  await evaluate("window.ready");
  const duration = await evaluate("window.DURATION");
  const grab = async (t, file, type) => {
    await evaluate(`seek(${t}); new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(true))))`);
    const { result } = await send("Page.captureScreenshot", type === "png" ? { format: "png" } : { format: "jpeg", quality: 95 });
    writeFileSync(file, Buffer.from(result.data, "base64"));
  };
  if (mode === "stills") {
    const dir = path.join(HERE, "stills"); mkdirSync(dir, { recursive: true });
    for (const t of arg.split(",").map(Number)) { await grab(t, path.join(dir, `${format}-${t.toFixed(2)}.png`), "png"); console.log("still", t); }
  } else {
    const fps = Number(arg || 30), n = Math.round(duration * fps);
    const dir = path.join(HERE, `frames-${format}`); mkdirSync(dir, { recursive: true });
    for (let f = 0; f < n; f++) {
      await grab(f / fps, path.join(dir, `f${String(f).padStart(5, "0")}.jpg`), "jpeg");
      if (f % 150 === 0) console.log(`frame ${f}/${n}`);
    }
    console.log("frames", n);
  }
} finally {
  ws.close();
  proc.kill();
}
