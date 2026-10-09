// Local static host for load-testing the production files in public/ (clustered, cached in memory).
import cluster from 'node:cluster';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import os from 'node:os';

const root = path.resolve('public');
const port = Number(process.env.PORT || 3200);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

if (cluster.isPrimary) {
  const workers = Math.max(2, Math.min(6, os.cpus().length - 2));
  for (let i = 0; i < workers; i++) cluster.fork();
} else {
  const cache = new Map();
  const load = (file) => {
    if (cache.has(file)) return cache.get(file);
    const abs = path.join(root, file);
    if (!abs.startsWith(root) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) return null;
    const raw = fs.readFileSync(abs);
    const ext = path.extname(abs);
    const entry = { raw, gz: /\.(html|js|css|svg)$/.test(ext) ? zlib.gzipSync(raw, { level: 9 }) : null, type: types[ext] || 'application/octet-stream' };
    cache.set(file, entry);
    return entry;
  };
  http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    const entry = load(url === '/' ? 'index.html' : url.slice(1));
    if (!entry) { res.writeHead(404); return res.end('Not found'); }
    const useGz = entry.gz && /gzip/.test(req.headers['accept-encoding'] || '');
    const body = useGz ? entry.gz : entry.raw;
    res.writeHead(200, { 'Content-Type': entry.type, 'Content-Length': body.length, 'Cache-Control': 'public, max-age=3600', ...(useGz ? { 'Content-Encoding': 'gzip' } : {}), Vary: 'Accept-Encoding' });
    res.end(body);
  }).listen(port, '127.0.0.1');
}
