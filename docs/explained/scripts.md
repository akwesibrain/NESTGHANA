# Scripts explained

## `scripts\sync-public-frontend.mjs`
This file is like a packing helper that copies the right toys into the backpack before a trip.

```js
import { mkdir, copyFile, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { transform } from "esbuild";
```
`import` means “bring tools here.” `node:fs/promises` gives file tools that work with promises, which are JavaScript’s “I will finish this job soon” helpers. `resolve` builds full file paths safely. `transform` comes from `esbuild`, a fast tool that can shrink code.

```js
const root = process.cwd();
const publicDir = resolve(root, "public");
```
`process.cwd()` means the current working folder, like asking, “Which classroom are we standing in right now?” `publicDir` points to the `public` folder inside it.

```js
const minified = [
  ["app.js", "js"],
  ["commercial-listings.js", "js"],
  ["font-loader.js", "js"],
  ["styles.css", "css"],
  ["supabase-config.js", "js"],
];
```
This list names files that should be minified. `minified` means squeezed smaller by removing extra spaces and other unnecessary bits, like folding clothes neatly to fit more in a bag.

```js
const assets = [
  ["index.html", "index.html"],
  ["hero.jpg", "hero.jpg"],
  ["hero.webp", "hero.webp"],
  ["hero-480.webp", "hero-480.webp"],
  ["logo.png", "logo.png"],
  ["logo-80.webp", "logo-80.webp"],
  ["logo-192.png", "logo-192.png"],
  ["data/ghana-locations.json", "ghana-locations.json"],
  ["node_modules/@supabase/supabase-js/dist/umd/supabase.js", "supabase.js"],
  ["node_modules/@supabase/supabase-js/LICENSE", "supabase.LICENSE.txt"],
];
```
This list names files that should be copied as assets. Assets are ready-made things like pictures and library files, like snacks and crayons you pack without changing.

```js
await mkdir(publicDir, { recursive: true });
await Promise.all(assets.map(([source, destination]) =>
  copyFile(resolve(root, source), resolve(publicDir, destination))));
```
`await` means “wait until this finishes.” `mkdir` makes the folder if needed. `recursive: true` means “also create missing parent folders.” `Promise.all` runs many copy jobs together, like asking several students to carry books at once.

```js
await Promise.all(minified.map(async ([name, loader]) => {
  const source = await readFile(resolve(root, name), "utf8");
  const { code } = await transform(source, { loader, minify: true, target: "es2020", legalComments: "none" });
  await writeFile(resolve(publicDir, name), code);
}));
```
This reads each listed file, shrinks it with esbuild, and writes the smaller version into `public`. `async` means this little function also waits for work. `loader` tells esbuild what kind of file it is, like telling the lunch helper whether the box holds apples or sandwiches.

```js
const locationCatalog = JSON.parse(
  await readFile(resolve(root, "data/ghana-locations.json"), "utf8"),
);
```
This reads the Ghana locations JSON file and turns the text into real data.

```js
await writeFile(
  resolve(publicDir, "ghana-locations.js"),
  `window.NESTGH_LOCATION_CATALOG=${JSON.stringify(locationCatalog)};\n`,
);
```
This writes a JavaScript file that puts the locations onto `window`, the browser’s big shared shelf. `JSON.stringify` turns the data back into text so it can be placed directly into the file.

## `scripts\optimize-images.mjs`
This file is like a lunch helper that cuts big fruit into smaller, easier pieces.

```js
import sharp from "sharp";
import { resolve } from "node:path";
```
This brings in `sharp`, an image-processing tool, and the path helper.

```js
const root = process.cwd();
const jobs = [
  ["hero.jpg", "hero.webp", { width: 800 }, { quality: 55 }],
  ["hero.jpg", "hero-480.webp", { width: 480 }, { quality: 60 }],
  ["logo.png", "logo-80.webp", { width: 80 }, { quality: 85 }],
];
```
This sets the working folder and lists resize jobs. Each job says which image starts, what new file to make, how wide it should be, and what quality setting to use.

```js
for (const [src, out, size, opts] of jobs) {
  await sharp(resolve(root, src)).resize(size).webp(opts).toFile(resolve(root, out));
}
```
This loops through each job. `sharp(...)` opens the image, `resize(size)` changes its size, `webp(opts)` turns it into WebP format, and `toFile(...)` saves it. WebP is an image format that is often smaller, like using a compact lunch box.

```js
await sharp(resolve(root, "logo.png")).resize(192).png({ compressionLevel: 9, palette: true }).toFile(resolve(root, "logo-192.png"));
```
This makes one more PNG version of the logo at 192 pixels wide. `compressionLevel: 9` means “squeeze it a lot,” and `palette: true` can help reduce size by using a limited color set.

## `scripts\serve-static.mjs`
This file is like a fast snack counter that keeps popular food ready so lots of kids can be served quickly.

```js
﻿// Local static host for load-testing the production files in public/ (clustered, cached in memory).
import cluster from 'node:cluster';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import os from 'node:os';
```
The top comment says what the script is for: serving the built `public` files during load testing. `cluster` helps run multiple worker processes, `http` creates the server, `fs` reads files, `path` handles file paths, `zlib` compresses data, and `os` gives computer information like CPU count.

```js
const root = path.resolve('public');
const port = Number(process.env.PORT || 3200);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
```
This points to the `public` folder, picks a port number, and defines content types. A `port` is like a numbered door on a building. Content types tell the browser what kind of thing it is opening.

```js
if (cluster.isPrimary) {
  const workers = Math.max(2, Math.min(6, os.cpus().length - 2));
  for (let i = 0; i < workers; i++) cluster.fork();
} else {
```
If this is the main process, it decides how many workers to make. It keeps at least 2 and at most 6, based on CPU count. `fork()` starts a worker copy, like asking a few extra lunch helpers to stand beside the main one.

```js
  const cache = new Map();
  const load = (file) => {
    if (cache.has(file)) return cache.get(file);
```
Workers keep a `cache`, which is an in-memory storage shelf for already-read files. `Map` is a key-value store, like cubbies with labels.

```js
    const abs = path.join(root, file);
    if (!abs.startsWith(root) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) return null;
```
This builds the full file path and refuses bad paths, missing files, or folders. That helps keep requests inside the `public` folder only.

```js
    const raw = fs.readFileSync(abs);
    const ext = path.extname(abs);
    const entry = { raw, gz: /\.(html|js|css|svg)$/.test(ext) ? zlib.gzipSync(raw, { level: 9 }) : null, type: types[ext] || 'application/octet-stream' };
    cache.set(file, entry);
    return entry;
  };
```
This reads the file, checks its extension, maybe makes a gzipped copy, stores everything in the cache, and returns it. `gzip` is a compression format, like vacuum-packing clothes to save space.

```js
  http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    const entry = load(url === '/' ? 'index.html' : url.slice(1));
```
This starts the HTTP server. It cleans up the incoming URL and chooses `index.html` for `/`, or the named file for other paths.

```js
    if (!entry) { res.writeHead(404); return res.end('Not found'); }
    const useGz = entry.gz && /gzip/.test(req.headers['accept-encoding'] || '');
    const body = useGz ? entry.gz : entry.raw;
```
If the file is missing, the server sends `404`, which means “not found.” Otherwise it checks whether the browser accepts gzip and chooses the compressed or raw version.

```js
    res.writeHead(200, { 'Content-Type': entry.type, 'Content-Length': body.length, 'Cache-Control': 'public, max-age=3600', ...(useGz ? { 'Content-Encoding': 'gzip' } : {}), Vary: 'Accept-Encoding' });
    res.end(body);
  }).listen(port, '127.0.0.1');
}
```
This sends a successful `200` response with useful headers, including cache rules. `Vary: 'Accept-Encoding'` tells caches that gzip and non-gzip responses are different versions. Then the server starts listening on the chosen port on the local computer only.

## `scripts\load-test.mjs`
This file is like a stopwatch game that checks how fast the snack counter can serve many kids.

```js
﻿import autocannon from 'autocannon';
const base='http://127.0.0.1:'+(process.env.PORT||3100);
const paths=['/','/app.js','/styles.css','/hero-480.webp','/logo-80.webp','/ghana-locations.js','/supabase.js'];
const stages=[100,500,1000,2000,3000];
const out=[];
```
This brings in `autocannon`, a load-testing tool that fires many requests. `base` is the server address, `paths` are the files to test, `stages` are different connection counts, and `out` will collect the results.

```js
for(const c of stages){
  const r=await autocannon({url:base,connections:c,duration:c===3000?30:10,timeout:30,requests:paths.map(p=>({method:'GET',path:p,headers:{'accept-encoding':'gzip'}}))});
```
This runs the test for each connection stage. At 3000 connections it runs longer, for 30 seconds; otherwise 10 seconds. Each request asks for gzip when possible.

```js
  const non2=r.non2xx, errs=r.errors+r.timeouts;
  const total=r['2xx']+non2+errs;
```
This counts responses that were not successful `2xx` codes and also counts errors and timeouts. A timeout means the answer took too long, like waiting so long for lunch that the bell rings.

```js
  const row={connections:c,rps:Math.round(r.requests.average),avg:r.latency.average,p95:r.latency.p97_5,p99:r.latency.p99,max:r.latency.max,total:r.requests.total,'2xx':r['2xx'],non2xx:non2,errors:r.errors,timeouts:r.timeouts,errPct:+(100*(non2+errs)/Math.max(1,r.requests.total+errs)).toFixed(2),mbps:+(r.throughput.average/1e6).toFixed(1)};
  console.log(JSON.stringify(row));out.push(row);
}
```
This builds one summary row. `rps` means requests per second. `latency` means how long replies take. `p95` and `p99` are “almost worst-case” timings, like saying “95 out of 100 kids got lunch by this time.” Then it prints the row and saves it.

```js
import fs from 'fs';fs.writeFileSync('docs/lighthouse/load-'+(process.argv[2]||'run')+'.json',JSON.stringify(out,null,1));
```
At the end, it imports the regular file system tool and writes all test rows into a JSON report file inside `docs/lighthouse`. `process.argv[2]` means “the extra name someone typed after the script command,” and if none was given it uses `run`.
