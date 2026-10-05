# Load test report

**Tool:** autocannon 7 (`scripts/load-test.mjs`), Node, one machine (Intel i5-10310U, 4 cores / 8 threads, Windows). The load generator and the server share the same CPU.

**What this measures:** the *production static files* served locally. It does NOT measure the real internet, a CDN, or the backend (not built yet). Each virtual user fires requests back-to-back with no think time, which is harsher than real browsing.

**Paths per cycle:** `/`, `/app.js`, `/styles.css`, `/hero-480.webp`, `/logo-80.webp`, `/ghana-locations.js`, `/supabase.js`. Results, property details and list-your-property are in-page views of the same single document (`/`), so they are covered by `/` plus its scripts.

**Stages:** 100, 500, 1,000, 2,000, 3,000 connections (10 s each, 3,000 held for 30 s).

## Run A: `next start` (production build), before the static-host change
| Connections | req/s | avg ms | p95 ms | p99 ms | error rate |
|---|---|---|---|---|---|
| 100 | 666 | 150 | 297 | 317 | 0% |
| 500 | 799 | 625 | 1,011 | 1,024 | 0% |
| 1,000 | 711 | 2,247 | 4,490 | 4,738 | 11.75% (connection errors) |
| 2,000 | 892 | 3,111 | 5,367 | 5,439 | 11.19% |
| 3,000 | 534 | 8,311 | 12,646 | 15,584 | 15.87% |

Cause: the Next.js server is a single Node process (about 800-900 req/s on this machine).

## Run B: clustered in-memory static server (`scripts/serve-static.mjs`), gzip on, same test
| Connections | req/s | avg ms | p95 ms | p99 ms | error rate |
|---|---|---|---|---|---|
| 100 | 1,648 | 63 | 124 | 151 | 0% |
| 500 | 1,415 | 360 | 803 | 833 | 0% |
| 1,000 | 1,570 | 662 | 1,350 | 1,368 | 0% |
| 2,000 | 1,391 | 1,358 | 2,389 | 2,394 | 0% |
| 3,000 | 1,500 | 2,041 | 4,041 | 4,113 | 0% |

(Raw JSON: `docs/lighthouse/load-after.json`, `load-static.json`, `load-static-gzip.json`.)

## Verdict (honest)
- **3,000 concurrent connections reached with 0 errors, 0 timeouts, 0 non-2xx** on the static server. Target met.
- **p95 < 800 ms is met up to ~500 connections (803 ms, borderline) and NOT met above that.** This machine peaks at roughly 1.4-1.6k req/s; latency at higher stages is queueing time on a saturated shared CPU, not slow responses (p95 at 100 users is 124 ms).
- `next start` alone does not survive 1,000+ connections here; production should serve the static files from a CDN (the project deploys on Netlify), which a laptop test cannot represent.
- To test properly: run k6 from a separate machine against the deployed site.
