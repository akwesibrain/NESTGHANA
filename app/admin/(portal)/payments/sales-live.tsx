"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SalesAnalytics } from "@/lib/server/sales-analytics";

// Live sales analysis for Admin → Payments. Polls /api/admin/sales every 15 s while the tab is
// visible. Geometry is drawn with SVG attributes (not inline styles) so the strict CSP applies.

const POLL_MS = 15_000;
const PERIODS = [7, 30, 90] as const;
const TYPE = {
  ROOM: { label: "Room" },
  HOSTEL: { label: "Hostel" },
  SPACE: { label: "Shop / space" },
} as const;
const STATUS: Record<string, { label: string; tone: string }> = {
  PAID: { label: "Paid", tone: "good" },
  PENDING: { label: "Pending", tone: "warning" },
  PROCESSING: { label: "Processing", tone: "warning" },
  FAILED: { label: "Failed", tone: "critical" },
  ABANDONED: { label: "Cancelled", tone: "neutral" },
  REFUNDED: { label: "Refunded", tone: "neutral" },
  PARTIALLY_REFUNDED: { label: "Partly refunded", tone: "neutral" },
};

const cedis = (pesewas: number, digits = 0) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", maximumFractionDigits: digits, minimumFractionDigits: digits }).format(pesewas / 100);
const shortDay = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GH", { timeZone: "UTC", day: "numeric", month: "short" });
const ago = (iso: string, now: number) => {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86_400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86_400)} d ago`;
};

export function SalesLive({ initial }: { initial: SalesAnalytics }) {
  const [data, setData] = useState(initial);
  const [days, setDays] = useState<number>(initial.days);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.parse(initial.generatedAt));
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const seen = useRef(new Set(initial.recent.map(r => `${r.id}:${r.status}`)));

  const load = useCallback(async (period: number) => {
    try {
      const response = await fetch(`/api/admin/sales?days=${period}`, { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) throw new Error(response.status === 401 ? "Your session ended. Sign in again." : "Live update failed.");
      const next = (await response.json()) as SalesAnalytics;
      const arrived = next.recent.map(r => `${r.id}:${r.status}`).filter(k => !seen.current.has(k));
      arrived.forEach(k => seen.current.add(k));
      setFresh(new Set(arrived.map(k => k.split(":")[0])));
      setData(next);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Live update failed.");
    }
  }, []);

  useEffect(() => {
    const tick = () => { if (!document.hidden) void load(days); };
    const timer = window.setInterval(tick, POLL_MS);
    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    const onVisible = () => { if (!document.hidden) void load(days); };
    document.addEventListener("visibilitychange", onVisible);
    return () => { window.clearInterval(timer); window.clearInterval(clock); document.removeEventListener("visibilitychange", onVisible); };
  }, [days, load]);

  const choose = (period: number) => { setDays(period); void load(period); };
  const k = data.kpis;
  const typeTotal = data.byType.reduce((t, r) => t + r.pesewas, 0);

  return (
    <section className="ngd-card sales" aria-labelledby="sales-heading">
      <header className="sales-head">
        <div>
          <h2 id="sales-heading">Sales analysis</h2>
          <p className="ngd-note">Listing fees collected through Paystack.</p>
        </div>
        <div className="sales-controls">
          <span className={`sales-live${error ? " is-stale" : ""}`} role="status" aria-live="polite">
            <span className="sales-pulse" aria-hidden="true" />
            {error ? error : `Live · updated ${ago(data.generatedAt, now)}`}
          </span>
          <div className="ngd-tabs-filter" role="group" aria-label="Period">
            {PERIODS.map(p => (
              <button key={p} type="button" className={p === days ? "is-active" : undefined} aria-pressed={p === days} onClick={() => choose(p)}>
                {p} days
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="sales-kpis">
        <Kpi label="Today" value={cedis(k.todayPesewas, 2)} />
        <Kpi label="Last 7 days" value={cedis(k.weekPesewas, 2)} />
        <Kpi label={`Last ${data.days} days`} value={cedis(k.periodPesewas, 2)}
          note={k.periodTrend === null ? "No earlier period to compare" : `${k.periodTrend > 0 ? "↑ +" : k.periodTrend < 0 ? "↓ " : "→ "}${k.periodTrend}% vs previous ${data.days} days`}
          tone={k.periodTrend === null || k.periodTrend === 0 ? undefined : k.periodTrend > 0 ? "up" : "down"} />
        <Kpi label="Payments" value={String(k.paidCount)} note={`Average ${cedis(k.averagePesewas, 2)}`} />
        <Kpi label="Payment success" value={k.successRate === null ? "—" : `${k.successRate}%`} note={`${k.inProgress} in progress`} />
        <Kpi label="All time" value={cedis(k.allTimePesewas, 2)} />
      </div>

      <div className="sales-grid">
        <div className="sales-panel sales-panel-wide">
          <h3>Revenue per day</h3>
          <RevenueChart series={data.series} />
        </div>

        <div className="sales-panel">
          <h3>By fee type</h3>
          <ul className="sales-bars">
            {data.byType.map(row => (
              <li key={row.type} title={`${TYPE[row.type].label}: ${cedis(row.pesewas, 2)} from ${row.count} payment${row.count === 1 ? "" : "s"}`}>
                <div><span><i className="sales-swatch" data-type={row.type} aria-hidden="true" />{TYPE[row.type].label}</span><strong>{cedis(row.pesewas)}</strong></div>
                <svg className="sales-bar" width="100%" height="10" aria-hidden="true">
                  <rect width="100%" height="10" rx="5" className="sales-track" />
                  {row.pesewas > 0 ? <rect width={`${Math.max(2, (row.pesewas / Math.max(1, typeTotal)) * 100)}%`} height="10" rx="5" className={`sales-fill is-${row.type.toLowerCase()}`} /> : null}
                </svg>
                <small className="ngd-muted">{row.count} payment{row.count === 1 ? "" : "s"} · {typeTotal ? Math.round((row.pesewas / typeTotal) * 100) : 0}% of revenue</small>
              </li>
            ))}
          </ul>
        </div>

        <div className="sales-panel">
          <h3>Listing conversion</h3>
          <p className="ngd-note">Listings submitted in the last {data.days} days.</p>
          <ul className="sales-bars">
            {([
              ["Submitted", data.funnel.submitted, "step-1"],
              ["Paid", data.funnel.paid, "step-2"],
              ["Approved", data.funnel.approved, "step-3"],
            ] as const).map(([label, value, step]) => {
              const share = data.funnel.submitted ? Math.round((value / data.funnel.submitted) * 100) : 0;
              return (
                <li key={label} title={`${label}: ${value} (${share}% of submitted)`}>
                  <div><span>{label}</span><strong>{value}</strong></div>
                  <svg className="sales-bar" width="100%" height="10" aria-hidden="true">
                    <rect width="100%" height="10" rx="5" className="sales-track" />
                    {value > 0 ? <rect width={`${Math.max(2, share)}%`} height="10" rx="5" className={`sales-fill is-${step}`} /> : null}
                  </svg>
                  <small className="ngd-muted">{share}% of submitted</small>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="sales-panel">
          <h3>Latest payment activity</h3>
          <ul className="sales-feed">
            {data.recent.map(p => (
              <li key={p.id} className={fresh.has(p.id) ? "is-new" : undefined}>
                <span className={`ngd-badge is-${STATUS[p.status]?.tone ?? "neutral"}`}>{STATUS[p.status]?.label ?? p.status}</span>
                <div>
                  <Link href={`/admin/listings/${p.listingId}`}>{p.title}</Link>
                  <small className="ngd-muted">{TYPE[p.type].label} · {ago(p.at, now)}</small>
                </div>
                <strong>{cedis(p.pesewas, 2)}</strong>
              </li>
            ))}
            {!data.recent.length ? <li className="ngd-empty">No payments yet.</li> : null}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Kpi({ label, value, note, tone }: { label: string; value: string; note?: string; tone?: "up" | "down" }) {
  return (
    <div className="sales-kpi">
      <span>{label}</span>
      <strong>{value}</strong>
      {note ? <small className={tone ? `ngd-trend is-${tone}` : "ngd-muted"}>{note}</small> : null}
    </div>
  );
}

/** Area + line of daily revenue with a snapping crosshair and tooltip; a table view for every value. */
function RevenueChart({ series }: { series: SalesAnalytics["series"] }) {
  // Drawn at roughly its display width so text stays at its natural size.
  const W = 1040, H = 260, L = 64, R = 14, T = 12, B = 28;
  const [hover, setHover] = useState<number | null>(null);
  const [table, setTable] = useState(false);
  const max = Math.max(1, ...series.map(p => p.pesewas));
  const niceMax = useMemo(() => {
    const cedi = max / 100;
    const step = 10 ** Math.floor(Math.log10(Math.max(1, cedi)));
    return Math.ceil(cedi / step) * step * 100;
  }, [max]);
  const x = (i: number) => L + (series.length <= 1 ? 0 : (i / (series.length - 1)) * (W - L - R));
  const y = (v: number) => T + (1 - v / niceMax) * (H - T - B);
  const line = series.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.pesewas).toFixed(1)}`).join(" ");
  const area = `${line} L${x(series.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;
  const ticks = [0, 0.5, 1].map(f => f * niceMax);
  const labels = [0, Math.floor((series.length - 1) / 2), series.length - 1];
  const total = series.reduce((t, p) => t + p.pesewas, 0);

  const onMove = (event: React.PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const px = ((event.clientX - box.left) / box.width) * (W - L - R);
    setHover(Math.min(series.length - 1, Math.max(0, Math.round((px / (W - L - R)) * (series.length - 1)))));
  };
  const point = hover === null ? null : series[hover];

  return (
    <div className="sales-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Revenue per day, ${cedis(total, 2)} in total`}>
        {ticks.map(t => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} className="sales-grid-line" />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" className="sales-axis">{cedis(t)}</text>
          </g>
        ))}
        {labels.map(i => (
          <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === series.length - 1 ? "end" : "middle"} className="sales-axis">{shortDay(series[i].day)}</text>
        ))}
        <path d={area} className="sales-area" />
        <path d={line} className="sales-line" />
        {point && hover !== null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={T} y2={H - B} className="sales-crosshair" />
            <circle cx={x(hover)} cy={y(point.pesewas)} r={5} className="sales-dot" />
          </g>
        ) : null}
        <rect x={L} y={T} width={W - L - R} height={H - T - B} fill="transparent"
          onPointerMove={onMove} onPointerLeave={() => setHover(null)} tabIndex={0}
          onFocus={() => setHover(series.length - 1)} onBlur={() => setHover(null)}
          onKeyDown={e => {
            if (e.key === "ArrowLeft") setHover(h => Math.max(0, (h ?? series.length - 1) - 1));
            if (e.key === "ArrowRight") setHover(h => Math.min(series.length - 1, (h ?? 0) + 1));
          }}
          aria-label="Move along the chart with the arrow keys to read each day" />
      </svg>
      {point ? (
        <div className="sales-tooltip" role="status">
          <strong>{cedis(point.pesewas, 2)}</strong>
          <span>{shortDay(point.day)} · {point.paid} paid of {point.attempts} attempt{point.attempts === 1 ? "" : "s"}</span>
        </div>
      ) : null}
      <button type="button" className="ngd-btn sales-table-toggle" aria-expanded={table} onClick={() => setTable(v => !v)}>
        {table ? "Hide table" : "Show as table"}
      </button>
      {table ? (
        <div className="ngd-table-wrap">
          <table className="ngd-table">
            <thead><tr><th>Day</th><th>Revenue</th><th>Paid</th><th>Attempts</th></tr></thead>
            <tbody>
              {[...series].reverse().map(p => (
                <tr key={p.day}><td>{shortDay(p.day)}</td><td>{cedis(p.pesewas, 2)}</td><td>{p.paid}</td><td>{p.attempts}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
